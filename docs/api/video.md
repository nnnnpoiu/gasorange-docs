# 🎥 视频模型 API

> 统一入口：`POST /v1/videos` · `GET /v1/videos/{id}`
>
> Base URL: `https://www.gasorange.com`

---

## 鉴权

所有请求需在 Header 中携带 Bearer Token：

```
Authorization: Bearer sk-xxx
```

---

## 通用参数

以下参数适用于所有生成模式（文生视频、图生视频、多模态）：

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `model` | string | 必填 | 模型名称 |
| `prompt` | string | 必填 | 提示词 |
| `resolution` | string | 必填 | `480p` / `720p` / `1080p`（fast 模型不支持 1080p） |
| `ratio` | string | 必填 | `21:9` / `16:9` / `4:3` / `1:1` / `3:4` / `9:16` / `adaptive`，默认 `adaptive` |
| `duration` | integer | 可选 | 时长（秒），4–15，默认 5 |
| `generate_audio` | boolean | 可选 | 是否生成有声视频，默认 `true` |
| `watermark` | boolean | 可选 | 是否含右下角 AI 水印，默认 `false` |

---

## 模型列表

| 模型 ID |
|---|
| `doubao-seedance-2-0-260128` |
| `doubao-seedance-2-0-fast-260128` |
| `dreamina-seedance-2-0-260128` |
| `dreamina-seedance-2-0-fast-260128` |
| `dreamina-seedance-2-0-mini-260615` |

---

## 一、文生视频（Text-to-Video）

最基础的纯文本生成视频，无需任何参考素材。

### 请求示例

```json
{
  "model": "doubao-seedance-2-0-fast-260128",
  "prompt": "一只橘猫在阳光下伸懒腰，温馨治愈风格",
  "resolution": "720p",
  "ratio": "16:9",
  "duration": 5,
  "generate_audio": true,
  "watermark": false
}
```

### Python SDK 示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxx",
    base_url="https://www.gasorange.com/v1"
)

response = client.videos.create(
    model="doubao-seedance-2-0-fast-260128",
    prompt="一只橘猫在阳光下伸懒腰，温馨治愈风格",
    resolution="720p",
    ratio="16:9",
    duration=5,
    generate_audio=True,
    watermark=False
)

print(response.id)  # 任务 ID，用于后续查询
```

### cURL 示例

```bash
curl -X POST https://www.gasorange.com/v1/videos \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "doubao-seedance-2-0-fast-260128",
    "prompt": "一只橘猫在阳光下伸懒腰，温馨治愈风格",
    "resolution": "720p",
    "ratio": "16:9",
    "duration": 5,
    "generate_audio": true,
    "watermark": false
  }'
```

---

## 二、首尾帧 / 图生视频（Image-to-Video）

通过 `content` 数组传入参考图。**图生视频-首帧、首尾帧、多模态参考为3种互斥场景，不可混用。**

### 额外参数

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `content` | array | 必填 | 输入素材数组，元素含 `type=image_url`、`role`、`image_url.url` |
| `content[].role` | string | 必填 | `first_frame`（首帧）/ `last_frame`（尾帧） |
| `return_last_frame` | boolean | 可选 | 是否返回尾帧图像，默认 `false` |

> `image_url.url` 支持 **公网 URL** 或 **Base64 Data URL**。

### 请求示例

```json
{
  "model": "doubao-seedance-2-0-260128",
  "prompt": "镜头平稳推进，人物表情自然变化",
  "content": [
    {
      "type": "image_url",
      "role": "first_frame",
      "image_url": { "url": "https://example.com/start.png" }
    },
    {
      "type": "image_url",
      "role": "last_frame",
      "image_url": { "url": "https://example.com/end.png" }
    }
  ],
  "return_last_frame": true,
  "resolution": "720p",
  "ratio": "16:9",
  "duration": 5
}
```

### Python SDK 示例

```python
response = client.videos.create(
    model="doubao-seedance-2-0-260128",
    prompt="镜头平稳推进，人物表情自然变化",
    content=[
        {
            "type": "image_url",
            "role": "first_frame",
            "image_url": {"url": "https://example.com/start.png"}
        },
        {
            "type": "image_url",
            "role": "last_frame",
            "image_url": {"url": "https://example.com/end.png"}
        }
    ],
    return_last_frame=True,
    resolution="720p",
    ratio="16:9",
    duration=5
)
```

---

## 三、多图参考生成（Multi-Image Reference）

`content` 数组传入多张参考图，`role` 统一为 `reference_image`，融合多图气质生成视频。

### 请求示例

```json
{
  "model": "doubao-seedance-2-0-260128",
  "prompt": "融合多张参考图中的人物与场景气质，生成电影感短视频",
  "content": [
    { "type": "image_url", "role": "reference_image", "image_url": { "url": "https://example.com/ref1.png" } },
    { "type": "image_url", "role": "reference_image", "image_url": { "url": "https://example.com/ref2.png" } },
    { "type": "image_url", "role": "reference_image", "image_url": { "url": "https://example.com/ref3.png" } }
  ],
  "resolution": "720p",
  "ratio": "16:9",
  "duration": 5
}
```

### Python SDK 示例

```python
response = client.videos.create(
    model="doubao-seedance-2-0-260128",
    prompt="融合多张参考图中的人物与场景气质，生成电影感短视频",
    content=[
        {"type": "image_url", "role": "reference_image", "image_url": {"url": "https://example.com/ref1.png"}},
        {"type": "image_url", "role": "reference_image", "image_url": {"url": "https://example.com/ref2.png"}},
        {"type": "image_url", "role": "reference_image", "image_url": {"url": "https://example.com/ref3.png"}}
    ],
    resolution="720p",
    ratio="16:9",
    duration=5
)
```

---

## 四、多模态视频生成（Multi-Modal）

`content` 支持图片、视频、音频混合输入。音频仅支持 `reference_audio`，需配合图或视频。

### content 元素类型

| 类型 | role | URL 字段 | 说明 |
|---|---|---|---|
| `image_url` | `first_frame` / `last_frame` / `reference_image` | `image_url.url` | 链接或 Base64 |
| `video_url` | `reference_video` | `video_url.url` | 仅公网地址 |
| `audio_url` | `reference_audio` | `audio_url.url` | URL 或 Base64 |

### 请求示例

```json
{
  "model": "doubao-seedance-2-0-fast-260128",
  "prompt": "第一人称视角果茶宣传广告",
  "content": [
    { "type": "image_url", "role": "reference_image", "image_url": { "url": "https://example.com/pic1.jpg" } },
    { "type": "video_url", "role": "reference_video", "video_url": { "url": "https://example.com/video1.mp4" } },
    { "type": "audio_url", "role": "reference_audio", "audio_url": { "url": "https://example.com/audio1.mp3" } }
  ],
  "generate_audio": true,
  "ratio": "16:9",
  "duration": 11,
  "watermark": true
}
```

### Python SDK 示例

```python
response = client.videos.create(
    model="doubao-seedance-2-0-fast-260128",
    prompt="第一人称视角果茶宣传广告",
    content=[
        {"type": "image_url", "role": "reference_image", "image_url": {"url": "https://example.com/pic1.jpg"}},
        {"type": "video_url", "role": "reference_video", "video_url": {"url": "https://example.com/video1.mp4"}},
        {"type": "audio_url", "role": "reference_audio", "audio_url": {"url": "https://example.com/audio1.mp3"}}
    ],
    generate_audio=True,
    ratio="16:9",
    duration=11,
    watermark=True
)
```

---

## 五、官方格式参数生成（Metadata 包装）

用 `metadata` 对象包装媒体数据与参数，整体结构同步官网接口。`model` / `prompt` 置于顶层。

### 请求示例

```json
{
  "model": "doubao-seedance-2-0-260128",
  "prompt": "首帧为图片1，尾帧定格为图片2，背景声音统一为女声",
  "metadata": {
    "content": [
      { "type": "image_url", "role": "reference_image", "image_url": { "url": "https://example.com/pic1.jpg" } },
      { "type": "video_url", "role": "reference_video", "video_url": { "url": "https://example.com/video1.mp4" } },
      { "type": "audio_url", "role": "reference_audio", "audio_url": { "url": "https://example.com/audio1.mp3" } }
    ],
    "generate_audio": true,
    "ratio": "16:9",
    "duration": 11,
    "watermark": true
  }
}
```

---

## 查询视频生成结果

```
GET /v1/videos/{id}
```

用创建任务返回的 `id` 轮询状态。任务 ID 仅保存 **7 天**，签名视频链接 **24 小时**有效。

### 响应字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 任务 ID |
| `task_id` | string | 同 `id` |
| `object` | string | 固定 `"video"` |
| `model` | string | 模型名称 |
| `status` | string | `queued` / `in_progress` / `completed` / `failed` |
| `progress` | integer | 进度 0–100，完成为 100 |
| `created_at` | integer | 创建时间戳 |
| `completed_at` | integer | 完成时间戳 |
| `metadata.url` | string | 完成后的视频下载链接 |
| `metadata.total_tokens` | string | 本次消耗 Token |

### 响应示例（completed）

```json
{
  "id": "task_qghsnDbtZo7FeliS4PAA1jGQsq1X1laH",
  "task_id": "task_qghsnDbtZo7FeliS4PAA1jGQsq1X1laH",
  "object": "video",
  "model": "doubao-seedance-2-0-fast-260128",
  "status": "completed",
  "progress": 100,
  "created_at": 1778479354,
  "completed_at": 1778479512,
  "metadata": {
    "url": "https://example.com/result.mp4",
    "total_tokens": "54789"
  }
}
```

### Python SDK 查询示例

```python
# 查询任务状态
response = client.videos.retrieve("task_qghsnDbtZo7FeliS4PAA1jGQsq1X1laH")
print(response.status)  # queued / in_progress / completed / failed
print(response.progress)  # 0-100

if response.status == "completed":
    print(response.metadata.url)  # 视频下载链接
```

### cURL 查询示例

```bash
curl https://www.gasorange.com/v1/videos/task_qghsnDbtZo7FeliS4PAA1jGQsq1X1laH \
  -H "Authorization: Bearer sk-xxx"
```

---

## 状态枚举

| 状态 | 说明 |
|---|---|
| `queued` | 排队中 |
| `in_progress` | 生成中 |
| `completed` | 已完成 |
| `failed` | 失败 |

---

## 注意事项

1. **互斥场景**：图生视频-首帧、首尾帧、多模态参考为 3 种互斥场景，不可在一个请求中混用
2. **1080p 限制**：fast 模型不支持 1080p 分辨率
3. **视频参考**：`reference_video` 仅支持公网 URL，不支持 Base64
4. **任务有效期**：任务 ID 保留 7 天，视频下载链接签名有效期 24 小时
5. **轮询建议**：创建任务后建议 3 秒间隔轮询 `GET /v1/videos/{id}`，直到 `status` 为 `completed` 或 `failed`
