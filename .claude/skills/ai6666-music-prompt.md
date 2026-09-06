---
name: ai6666-music-prompt
description: 教父音乐（ai6666.com）AI 音乐生成的提示词编写指南。当用户需要为 ai6666.com 生成音乐、编写音乐提示词、选择风格标签、构建歌词结构、或理解 Suno/教父音乐的 Tag 用法时，调用此 skill。
---

# 教父音乐提示词指南

对应 ai6666.com 教父音乐生成页（/music/create/）。帮助写出可用的 AI 音乐生成提示词。

## 核心写法

最稳定的写法：先确定整首歌方向，再补充歌词结构。不要只写"好听、高级、爆款"，要写**具体音乐信息**。

**一行公式**：`核心曲风, 人声, 情绪, 主乐器, 速度, 制作质感`

## 三个位置的区别

| 位置 | 用途 | 写法 | 示例 |
|------|------|------|------|
| 风格标签（可选） | 控制整首歌的曲风、人声、情绪、乐器、速度 | 不加括号，英文逗号分隔 | `Mandarin pop ballad, female vocal, piano, strings, slow tempo` |
| 歌词框里的 `[]` | 标记段落结构（主歌/副歌/桥段） | 单独一行，英文结构名 | `[Verse 1]` `[Chorus]` `[Instrumental]` |
| 歌词框里的 `()` | 补充这一段的唱法、乐器、氛围 | 放在段落标签下一行，英文半角括号 | `(soft female vocal, piano only)` |

**简单记法**：「风格标签」管整首歌；`[]` 管"这一段是什么"；`()` 管"这一段怎么唱、怎么编"。

## 歌词结构标签

| 标签 | 用途 |
|------|------|
| `[Intro]` | 前奏，开头 |
| `[Verse 1]` / `[Verse 2]` | 主歌，推进故事 |
| `[Pre-Chorus]` | 预副歌，抬情绪 |
| `[Chorus]` | 副歌，放最想被记住的句子，短、重复、好唱 |
| `[Post-Chorus]` | 副歌后段，重复短句或旋律动机 |
| `[Hook]` | 记忆点，最抓耳的一句 |
| `[Bridge]` | 桥段，制造变化，换视角/减弱配器/转调 |
| `[Break]` | 停顿，制造对比 |
| `[Breakdown]` | 拆解段，降低能量，只保留鼓贝斯 |
| `[Build-Up]` | 能量堆叠，Drop 或最终副歌前 |
| `[Drop]` | 爆发段，电子/舞曲/热血歌常用 |
| `[Interlude]` | 间奏，连接两段歌词 |
| `[Instrumental]` | 纯音乐段，可加入乐器独奏 |
| `[Guitar Solo]` / `[Piano Solo]` / `[Saxophone Solo]` | 各类乐器独奏 |
| `[Male Vocal]` / `[Female Vocal]` | 男声/女声段落，适合对唱分角色 |
| `[Duet]` | 对唱，男女一起唱或互相回应 |
| `[Harmony]` | 和声，副歌加厚 |
| `[Choir]` | 合唱，群唱副歌、史诗感 |
| `[Rap]` | 说唱段落 |
| `[Spoken Word]` | 念白，独白/电话感/剧情 |
| `[Whisper]` | 耳语，亲密/悬疑/深夜 |
| `[Outro]` | 尾奏，收束情绪 |
| `[Fade Out]` | 渐弱结束 |
| `[End]` | 明确结束 |
| `[Final Chorus]` | 最终副歌爆发，配合 `(full band, choir, key change)` |

## 人声控制

| 目标 | 写法 | 位置 |
|------|------|------|
| 整首歌男声 | `Male vocal` | 风格标签 |
| 整首歌女声 | `Female vocal` | 风格标签 |
| 男女对唱 | `Male and female duet` + `vocal harmony` | 风格标签 |
| 某段男声 | `[Male Vocal]` + `(soft male vocal)` | 歌词框 |
| 某段女声 | `[Female Vocal]` + `(soft female vocal)` | 歌词框 |
| 某句指定声线 | 把目标句单独一行，上方加 `(male vocal)` 或 `(female vocal)` | 歌词框 |

**注意**：单句控制要把目标句独立出来；长段落里频繁切换男女声不如拆成多个小段稳定。

## Tag 速查表

### 曲风/流派
`Mandarin pop`（华语流行）、`Mandopop`、`Cantopop`（粤语）、`Pop`、`Pop ballad`（流行抒情）、`Indie pop`、`Dream pop`、`City pop`、`Synth-pop`、`J-pop`、`K-pop`、`Anime opening`、`Rock`、`Pop rock`、`Alternative rock`、`Metal`、`Folk`、`Indie folk`、`Country`、`R&B`、`Soul`、`Neo-soul`、`Hip-hop`、`Rap`、`Trap`、`Lo-fi hip-hop`、`EDM`、`House`、`Techno`、`Future bass`、`Jazz`、`Blues`、`Cinematic`、`Orchestral`、`Chinese traditional`、`Ancient Chinese`（古风）

### 情绪/氛围
`Happy`、`Joyful`、`Bright`、`Sweet`、`Romantic`、`Warm`、`Tender`、`Intimate`（贴耳亲密）、`Sad`、`Melancholic`（忧郁）、`Nostalgic`（怀旧）、`Sentimental`、`Lonely`、`Heartbroken`、`Bittersweet`、`Dreamy`、`Ethereal`（空灵）、`Atmospheric`、`Mysterious`、`Dark`、`Hopeful`、`Uplifting`、`Epic`、`Aggressive`、`Anxious`

### 人声
`Male vocal`、`Female vocal`、`Male and female duet`、`Duet`、`Soft vocal`、`Powerful vocal`、`Breathy vocal`（气声）、`Raspy vocal`（沙哑）、`Falsetto`（假声）、`Belting`（强唱）、`Whisper`、`Spoken word`、`Rap vocal`、`Vocal harmony`、`Choir`、`Call and response`（一问一答）

### 乐器
`Piano`、`Soft piano`、`Electric piano`、`Rhodes`、`Synth`、`Synth pad`（铺底）、`Synth lead`、`Synth bass`、`Acoustic guitar`（木吉他）、`Nylon guitar`、`Electric guitar`、`Distorted guitar`（失真）、`Guitar solo`、`Bass guitar`、`Drums`、`Acoustic drums`、`Drum machine`、`808`、`Strings`（弦乐）、`Orchestral strings`、`Violin`、`Cello`（大提琴）、`Brass section`（铜管）、`Saxophone`、`Flute`、`Guzheng`（古筝）、`Guqin`（古琴）、`Erhu`（二胡）、`Pipa`（琵琶）、`Dizi`（笛子）、`Xiao`（箫）、`Suona`（唢呐）、`Kalimba`（拇指琴）、`Music box`（八音盒）

### 节奏/制作
`Slow tempo`、`Medium tempo`、`Fast tempo`、`70 BPM`、`90 BPM`、`120 BPM`、`4/4`、`3/4`、`Waltz`、`Swing`、`Syncopated`（切分）、`Build-up`、`Drop`、`Breakdown`、`Fade out`、`Clean mix`、`Polished`、`Raw`、`Warm reverb`、`Long reverb`、`Wide stereo`、`Close-mic vocal`、`Lo-fi texture`、`Vinyl crackle`（黑胶噪声）、`Tape saturation`、`Sidechain`（侧链泵动）、`Filter sweep`、`Glitch`

### 音效/场景（放歌词框的 Intro/Outro/Bridge 段）
`Rain ambience`（雨声）、`Ocean waves`（海浪）、`City night ambience`、`Thunder`（雷声）、`Wind chimes`（风铃）、`Fire crackle`（火焰）、`Footsteps`（脚步）、`Heartbeat`（心跳）、`Phone call intro`（电话开场）、`Radio voice`（电台）、`Tape stop`、`Riser`、`Impact hit`、`Silence`

## 常用模板

### 中文伤感情歌
风格标签：`Mandarin pop ballad, sad, female vocal, piano, strings, slow tempo, intimate, emotional build-up`

### 甜蜜男女对唱
风格标签：`Mandarin pop, male and female duet, romantic, warm, acoustic guitar, piano, medium tempo, vocal harmony`

### 国风情歌
风格标签：`Ancient Chinese, Mandarin pop ballad, female vocal, guzheng, pipa, dizi, strings, poetic, slow tempo, cinematic`

### 电子舞曲
风格标签：`EDM, future bass, female vocal, euphoric, 128 BPM, synth lead, sidechain, build-up, drop, wide stereo`

### 说唱加旋律副歌
风格标签：`Hip-hop, trap, rap verse, melodic chorus, male vocal, 808 bass, dark piano, medium tempo, clean mix`

## 完整歌词示例

```
[Intro]
(rain ambience, soft piano)

[Verse 1]
(soft female vocal, piano only)
雨停在凌晨三点半
你的名字还亮在旧聊天

[Pre-Chorus]
(strings enter, emotional build-up)
我把想念调成静音
却听见心跳一遍一遍

[Chorus]
(full band, vocal harmony)
如果风会替我说晚安
请别让它吹散你的答案

[Instrumental]
(guzheng solo, cinematic strings)

[Outro]
(fade out, whispered vocal)
我把没说完的爱
留给明天的海
```

## 男女对唱段落切换示例

```
[Verse 1]
[Male Vocal]
(soft male vocal, close-mic)
我把没寄出的信
放回旧抽屉

[Verse 2]
[Female Vocal]
(soft female vocal, breathy)
我在同一场雨里
听见你的回音

[Chorus]
[Duet]
(male and female duet, vocal harmony)
如果风会替我们说晚安
别让爱散在天亮以前
```

## 发音读错怎么办

如果某个字反复被唱错，在歌词里**只把这个字**改成带声调的拼音，其他字保持中文：
- 浉河 → `shī河`
- 钦 → `qīn`

**不要**把整句都改成拼音，只改容易唱错的那个字。

## 提交前检查

1. **曲风是否明确**：至少有一个核心曲风（如 `Pop ballad` / `Folk` / `Rock` / `R&B`）
2. **人声是否明确**：男声/女声/对唱/合唱/说唱至少选一个方向
3. **乐器是否有主次**：主角乐器 1-3 个，背景乐器少量补充（不要堆太多）
4. **情绪是否统一**：不要同时塞入太多相反情绪（如 `Slow tempo` + `Very fast`）
5. **歌词结构是否清楚**：标出主歌、副歌、桥段
6. **是否留有发挥空间**：提示词控制方向，不需要把每个细节都写死

## 常见错误

| 问题 | 原因 | 改法 |
|------|------|------|
| 只写"高级、震撼、好听" | 不是音乐信息 | 改成曲风、情绪、人声、乐器、速度和制作感 |
| 标签互相冲突 | 如同时写 Slow tempo 和 Very fast | 同一维度只保留一个明确方向 |
| 乐器堆太多 | 模型只抓住其中一部分 | 主角乐器 1-3 个，背景少量补充 |
| 副歌没有记忆点 | 歌词太散，旋律也散 | 把最重要的一句话放进 `[Chorus]`，允许重复 |
