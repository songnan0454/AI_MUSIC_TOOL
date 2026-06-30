# 🎵 音频降速切分 + 歌词转拼音工具

一个基于 Node.js 的音频处理 Web 应用，支持音频降速、声纹破坏、切分、加水印、视频提取音频以及歌词转拼音功能。

## ✨ 功能特性

### 音频降速切分
- **声纹破坏**：变调 + 高通/低通滤波，保护声音隐私
- **降速处理**：可配置降速倍数（默认2倍），整首均匀降速
- **智能切分**：自动读取音频时长，按指定份数切分，输出**无损 WAV**（采样级精确、无编码延迟静音）
- **BPM 检测**：对整首降速音频统一检测一次 BPM，所有片段共用同一个值

### 视频提取音频
- 上传视频文件，分离出音频轨道并导出为 MP3（192kbps）
- 支持 mp4 / mov / avi / mkv / webm / flv / wmv / m4v

### 音频加水印
- 将女声水印“AI老男孩制作”按指定间隔循环混入原音频

### 歌词转拼音
- 支持所有汉字转拼音
- 英文保持原样
- 每字拼音之间自动添加空格

## 🛠 技术栈

- **后端**: Node.js + Express
- **音频处理**: ffmpeg (fluent-ffmpeg)
- **音频元数据**: music-metadata
- **BPM 检测**: music-tempo
- **拼音转换**: pinyin-pro
- **文件上传**: multer

## 📦 安装

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 ffmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
下载 [ffmpeg](https://ffmpeg.org/download.html) 并添加到系统 PATH

### 3. 启动服务

```bash
npm start
```

服务将在 http://localhost:3000 启动

## 📖 使用说明

### 音频处理

1. 访问 http://localhost:3000
2. 拖拽或点击上传音频文件（支持 mp3/wav/m4a/flac）
3. 配置参数：
   - **降速倍数**：1倍=原速50%，2倍=原速33%
   - **切分份数**：将音频切分成几份（默认5份）
4. 点击「开始处理」
5. 查看统一 BPM，下载处理后的 WAV 片段

### 视频提取音频

1. 在「视频提取音频」区拖拽或点击上传视频文件
2. 点击「提取音频」
3. 下载分离出的 MP3 音频

### 音频加水印

1. 在「音频加水印」区上传音频文件
2. 设置水印间隔（秒）
3. 点击「添加水印」并下载

### 歌词转拼音

1. 在右侧输入框输入中文歌词
2. 点击「转换拼音」
3. 点击「复制结果」复制转换后的拼音

## ⚙️ 参数说明

### 降速倍数

| 倍数 | 实际速度 | 说明 |
|------|----------|------|
| 0.5 | 66% | 轻微降速 |
| 1 | 50% | 默认，降速一半 |
| 2 | 33% | 降速更多 |
| 3 | 25% | 重度降速 |
| 4 | 20% | 极度降速 |

### 声纹破坏效果

| 效果 | 参数 | 作用 |
|------|------|------|
| 变调 | +25% | 改变音高，破坏声纹特征 |
| 高通滤波 | 180Hz | 去除低频共鸣 |
| 低通滤波 | 4500Hz | 去除高频细节 |

## 📁 项目结构

```
.
├── server.js           # Express 服务器
├── package.json        # 项目配置
├── public/
│   ├── index.html      # 前端页面
│   └── watermark.mp3   # 水印音频
├── uploads/            # 临时上传目录
├── processed/          # 临时处理目录
└── output/             # 输出目录（下载文件）
```

## 🔧 配置

### 端口配置

默认端口为 3000，可在 `server.js` 中修改：

```javascript
const PORT = 3000; // 修改为你需要的端口
```

### 文件大小限制

默认限制 100MB，可在 `server.js` 中修改：

```javascript
limits: { fileSize: 100 * 1024 * 1024 } // 修改为需要的限制
```

## 🐛 常见问题

### 1. 报错 "Cannot find ffmpeg"

**解决方案**: 确保已安装 ffmpeg 并在系统 PATH 中

```bash
# 检查 ffmpeg 是否安装
ffmpeg -version
```

### 2. 上传文件失败

**可能原因**:
- 文件格式不支持（仅支持 mp3/wav/m4a/flac）
- 文件超过大小限制（默认100MB）

### 3. 切分数量不准确

切分基于音频时长计算，最后一份数可能较短。如需精确控制，可手动调整切分份数。

## 📝 API 接口

### POST /upload

上传并处理音频文件（降速 + 声纹破坏 + BPM 检测 + 切分为 WAV）

**参数**:
- `audio`: 音频文件（FormData）
- `slowdownRate`: 降速倍数（默认2）
- `splitCount`: 切分份数（默认5）

**响应**:
```json
{
  "success": true,
  "sessionId": "uuid",
  "segments": [
    { "name": "歌名_片段_000.wav", "url": "/output/uuid/歌名_片段_000.wav" }
  ],
  "totalSegments": 5,
  "bpm": 120
}
```

### POST /extract-audio

从视频中提取音频，导出为 MP3

**参数**:
- `video`: 视频文件（FormData，支持 mp4/mov/avi/mkv/webm/flv/wmv/m4v，默认上限 500MB）

**响应**:
```json
{
  "success": true,
  "downloadUrl": "/output/视频名_音频.mp3"
}
```

### POST /watermark

为音频添加循环女声水印

**参数**:
- `audio`: 音频文件（FormData）
- `interval`: 水印间隔秒数（默认5）

**响应**:
```json
{
  "success": true,
  "downloadUrl": "/output/歌名_加水印.mp3",
  "watermarkCount": 12
}
```

### POST /pinyin

歌词转拼音

**参数**:
```json
{
  "lyrics": "中文歌词内容"
}
```

**响应**:
```json
{
  "success": true,
  "pinyin": "zhong wen ge ci nei rong"
}
```

## 📄 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
