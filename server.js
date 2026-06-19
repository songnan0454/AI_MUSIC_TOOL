const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { pinyin } = require('pinyin-pro');
const mm = require('music-metadata');

const app = express();
const PORT = 3000;

// 创建必要的目录
const dirs = ['uploads', 'processed', 'output'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const sessionId = uuidv4();
    req.sessionId = sessionId;
    cb(null, `${sessionId}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.mp3', '.wav', '.m4a', '.flac'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('只支持音频文件 (mp3, wav, m4a, flac)'));
    }
  },
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB 限制
});

// 解析 JSON 请求体
app.use(express.json());

// 静态文件服务
app.use(express.static('public'));
app.use('/output', express.static('output'));

// 首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 上传和处理
app.post('/upload', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择一个音频文件' });
  }

  // 获取原文件名（不含扩展名）
  const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));

  // 获取降速倍数，默认2倍
  const slowdownRate = parseFloat(req.body.slowdownRate) || 2;
  // 获取切分份数，默认5份
  const splitCount = parseInt(req.body.splitCount) || 5;
  // 是否添加水印
  const addWatermark = req.body.addWatermark === 'true';

  const sessionId = req.sessionId;
  const inputPath = req.file.path;
  const outputDir = path.join('output', sessionId);

  // 创建会话输出目录
  fs.mkdirSync(outputDir, { recursive: true });

  const slowedPath = path.join('processed', `${sessionId}-slowed.mp3`);
  const watermarkPath = path.join(__dirname, 'public', 'watermark.mp3');

  try {
    // 计算atempo值：降速n倍 = 原速/(n+1)，所以atempo = 1/(n+1)
    const tempo = 1 / (slowdownRate + 1);

    let atempoFilter = '';
    if (tempo >= 0.5) {
      atempoFilter = `atempo=${tempo}`;
    } else {
      const factors = [];
      let remaining = tempo;
      while (remaining < 0.5) {
        factors.push(0.5);
        remaining = remaining / 0.5;
      }
      factors.push(remaining);
      atempoFilter = factors.map(f => `atempo=${f}`).join(',');
    }

    console.log(`降速倍数: ${slowdownRate}, tempo: ${tempo.toFixed(3)}, 水印: ${addWatermark}`);

    // 步骤1: 降速
    const tempPath = path.join('processed', `${sessionId}-temp.mp3`);
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioFilters(atempoFilter)
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .audioFrequency(44100)
        .output(tempPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // 步骤2: 声纹破坏
    await new Promise((resolve, reject) => {
      ffmpeg(tempPath)
        .audioFilters('asetrate=44100*1.25,aresample=44100,highpass=f=180,lowpass=f=4500')
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .audioFrequency(44100)
        .output(slowedPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    fs.unlinkSync(tempPath);

    // 使用 music-metadata 读取降速后的音频时长
    const metadata = await mm.parseFile(slowedPath);
    const duration = metadata.format.duration;

    const segmentTime = duration / splitCount;

    console.log(`音频时长: ${duration.toFixed(1)}秒, 切分${splitCount}份, 每份: ${segmentTime.toFixed(1)}秒`);

    // 步骤3: 切分成指定份数
    await new Promise((resolve, reject) => {
      ffmpeg(slowedPath)
        .outputOptions([
          '-f segment',
          `-segment_time ${segmentTime}`
        ])
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .output(path.join(outputDir, `${originalName}_片段_%03d.mp3`))
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // 获取生成的文件列表
    const files = fs.readdirSync(outputDir)
      .filter(f => f.endsWith('.mp3'))
      .sort()
      .map(f => ({
        name: f,
        url: `/output/${sessionId}/${f}`
      }));

    // 清理临时文件
    fs.unlinkSync(inputPath);
    fs.unlinkSync(slowedPath);

    res.json({
      success: true,
      sessionId,
      segments: files,
      totalSegments: files.length
    });

  } catch (error) {
    console.error('处理错误:', error);
    // 清理临时文件
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(slowedPath)) fs.unlinkSync(slowedPath);
    } catch (e) {}

    res.status(500).json({ error: '音频处理失败: ' + error.message });
  }
});

// 独立的水印功能
app.post('/watermark', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择一个音频文件' });
  }

  // 获取原文件名（不含扩展名）
  const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));

  const sessionId = uuidv4();
  const inputPath = req.file.path;
  const watermarkPath = path.join(__dirname, 'public', 'watermark.mp3');
  const watermarkedPath = path.join('output', `${originalName}_加水印.mp3`);
  const interval = parseInt(req.body.interval) || 5;

  try {
    // 获取原音频时长
    const metadata = await mm.parseFile(inputPath);
    const duration = metadata.format.duration;

    console.log(`添加水印: 音频时长 ${duration.toFixed(1)}秒, 间隔 ${interval}秒`);

    // 计算需要的水印次数
    const watermarkCount = Math.ceil(duration / interval);

    // 构建滤镜链
    const filterParts = [];

    // 每个水印延迟到指定位置，音量放大到5
    for (let i = 0; i < watermarkCount; i++) {
      const delayMs = Math.round(i * interval * 1000);
      filterParts.push(`[${i+1}:a]adelay=${delayMs}|${delayMs},volume=5[w${i}]`);
    }

    // 将所有水印混合
    const watermarkInputs = Array.from({ length: watermarkCount }, (_, i) => `[w${i}]`).join('');
    filterParts.push(`${watermarkInputs}amix=inputs=${watermarkCount}:duration=longest:dropout_transition=0[watermark_mix]`);

    // 最后将原音频和水印混合，原音频权重1.0，水印权重1.5（更大声）
    filterParts.push(`[0:a]volume=1[a0]`);
    filterParts.push(`[a0][watermark_mix]amix=inputs=2:duration=first:dropout_transition=0:weights=1 1.5[aout]`);

    // 使用 ffmpeg 添加水印
    const ffmpegCmd = ffmpeg();

    // 添加原音频输入
    ffmpegCmd.input(inputPath);

    // 添加多个水印输入
    for (let i = 0; i < watermarkCount; i++) {
      ffmpegCmd.input(watermarkPath);
    }

    await new Promise((resolve, reject) => {
      ffmpegCmd
        .complexFilter(filterParts, 'aout')
        .audioCodec('libmp3lame')
        .audioBitrate('192k')
        .output(watermarkedPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // 清理临时文件
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      downloadUrl: `/output/${originalName}_加水印.mp3`,
      watermarkCount
    });

  } catch (error) {
    console.error('水印处理错误:', error);
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) {}

    res.status(500).json({ error: '水印处理失败: ' + error.message });
  }
});

// 歌词转拼音 API
app.post('/pinyin', (req, res) => {
  const { lyrics } = req.body;
  if (!lyrics) {
    return res.status(400).json({ error: '请提供歌词内容' });
  }

  const isChinese = (c) => /[一-龥]/.test(c);
  const isEnglish = (c) => ('A' <= c && c <= 'Z') || ('a' <= c && c <= 'z');

  const result = [];
  let i = 0;
  while (i < lyrics.length) {
    const char = lyrics[i];

    if (char === '\n') {
      result.push('\n');
    } else if (char === ' ') {
      result.push(' ');
    } else if (char === '（') {
      result.push('(');
    } else if (char === '）') {
      result.push(')');
    } else if (isChinese(char)) {
      // 中文转拼音，前面如果不是空格或换行或括号则加空格
      if (result.length > 0 && !['\n', ' ', '('].includes(result[result.length - 1])) {
        result.push(' ');
      }
      result.push(pinyin(char, { toneType: 'none' }));
    } else if (isEnglish(char)) {
      // 收集连续英文
      let word = char;
      while (i + 1 < lyrics.length && isEnglish(lyrics[i + 1])) {
        i++;
        word += lyrics[i];
      }
      // 前面如果不是空格或换行或括号则加空格
      if (result.length > 0 && !['\n', ' ', '('].includes(result[result.length - 1])) {
        result.push(' ');
      }
      result.push(word);
    } else {
      result.push(char);
    }
    i++;
  }

  let output = result.join('');
  // 清理多余空格
  output = output.replace(/ +/g, ' ').replace(/ \n/g, '\n');

  res.json({ success: true, pinyin: output });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🎵 音频降速切分服务已启动: http://localhost:${PORT}`);
});