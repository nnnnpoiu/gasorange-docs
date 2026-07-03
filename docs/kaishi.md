# 🚀 快速接入 GasOrange

## 基础信息

| 配置项 | 值 |
|--------|-----|
| Base URL | `https://www.gasorange.com` |
| 认证方式 | Bearer Token (API Key) |
| API 版本 | v1 |

## 鉴权

所有请求需在 Header 中携带 Bearer Token：

```
Authorization: Bearer sk-xxx
```

> ⚠️ **安全提醒**：请勿在客户端暴露 API Key，建议在服务端调用 API。

## 支持的模型类型

GasOrange 支持以下大模型能力：

| 类型 | 说明 |
|------|------|
| 文本模型 | 大语言模型对话，兼容 OpenAI 格式 |
| 图片模型 | 图像生成 |
| 视频模型 | Seedance 视频生成 |

---

## 💬 文本对话接口

### Python SDK 示例

```bash
pip install openai
```

> ⚠️ **注意**：请确保 Python 版本 >= 3.7

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    base_url="https://www.gasorange.com/v1"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "你是一个 helpful 的助手。"},
        {"role": "user", "content": "你好！"}
    ]
)

print(response.choices[0].message.content)
```

### 返回示例

```text
你好！很高兴为你服务。有什么我可以帮你的吗？
```

---

### 🐍 Python request 示例

```python
import requests

url = "https://www.gasorange.com/v1/chat/completions"

headers = {
    "Authorization": "Bearer sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4o",
    "messages": [
        {"role": "system", "content": "你是一个 helpful 的助手。"},
        {"role": "user", "content": "你好！"}
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

### 📤 返回示例

```json
{
  "id": "chatcmpl-xxxxxxxx",
  "object": "chat.completion",
  "created": 1699000000,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！很高兴为你服务。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 15,
    "total_tokens": 35
  }
}
```

---

> 💡 **提示**：请将 `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 替换为你的实际 API Key。

---

© 2025 GasOrange 快速开始
