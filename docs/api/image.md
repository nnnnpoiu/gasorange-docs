# 图片模型 API

GasOrange 图片模型支持通过文本描述生成图像，兼容 OpenAI DALL-E 格式。

## 接口信息

| 配置项 | 值 |
|--------|-----|
| 接口地址 | `POST /v1/images/generations` |
| 认证方式 | Bearer Token |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 模型名称 |
| `prompt` | string | 是 | 图片描述文本 |
| `size` | string | 否 | 图片尺寸，如 `1024x1024` |
| `quality` | string | 否 | 图片质量 `standard` / `hd` |
| `n` | integer | 否 | 生成数量，默认 1 |
| `response_format` | string | 否 | 返回格式 `url` / `b64_json` |

## 请求示例

### cURL

```bash
curl https://www.gasorange.com/v1/images/generations \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-image-2",
    "prompt": "一只可爱的橘猫在阳光下伸懒腰",
    "size": "1024x1024",
    "quality": "standard",
    "n": 1
  }'
```

### Python SDK 示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxx",
    base_url="https://www.gasorange.com/v1"
)

response = client.images.generate(
    model="dall-e-3",
    prompt="一只可爱的橘猫在阳光下伸懒腰",
    size="1024x1024",
    quality="standard",
    n=1
)

print(response.data[0].url)
```

## 响应示例

```json
{
  "created": 1699000000,
  "data": [
    {
      "url": "https://example.com/generated-image.png",
      "revised_prompt": "A cute orange cat stretching in the sunlight"
    }
  ]
}
```

## 支持的图片尺寸

| 尺寸 | 说明 |
|------|------|
| `1024x1024` | 正方形 |
| `1024x1792` | 竖屏 |
| `1792x1024` | 横屏 |

## 支持的模型

| 模型 | 说明 |
|------|------|
| `gpt-image-2` | GPT Image 2 图像生成模型 |

## 注意事项

1. 图片生成可能需要数秒时间，请耐心等待响应
2. 生成的图片 URL 有效期为 24 小时
3. 请遵守平台的内容安全政策
