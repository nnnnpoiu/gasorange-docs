# 文本模型 API

GasOrange 文本模型兼容 OpenAI API 格式，支持流式/非流式输出。

## 接口信息

| 配置项 | 值 |
|--------|-----|
| 接口地址 | `POST /v1/chat/completions` |
| 认证方式 | Bearer Token |

## 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `model` | string | 是 | 模型名称 |
| `messages` | array | 是 | 对话消息数组 |
| `stream` | boolean | 否 | 是否流式输出，默认 `false` |
| `temperature` | float | 否 | 采样温度，0-2，默认 1 |
| `max_tokens` | integer | 否 | 最大生成 token 数 |

## messages 格式

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `role` | string | 是 | `system` / `user` / `assistant` |
| `content` | string | 是 | 消息内容 |

## 请求示例

### 非流式输出

```bash
curl https://www.gasorange.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "你是一个 helpful 的助手。"},
      {"role": "user", "content": "你好！"}
    ]
  }'
```

### 流式输出

```bash
curl https://www.gasorange.com/v1/chat/completions \
  -H "Authorization: Bearer sk-xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "user", "content": "你好！"}
    ],
    "stream": true
  }'
```

### Python SDK 示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-xxx",
    base_url="https://www.gasorange.com/v1"
)

# 非流式
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好！"}]
)
print(response.choices[0].message.content)

# 流式
stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "你好！"}],
    stream=True
)
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## 响应示例

### 非流式响应

```json
{
  "id": "chatcmpl-xxx",
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
    "prompt_tokens": 10,
    "completion_tokens": 10,
    "total_tokens": 20
  }
}
```

### 流式响应

```text
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"delta":{"content":"你"}}]}

data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"delta":{"content":"好"}}]}

data: [DONE]
```

## 支持的模型

| 模型 | 说明 |
|------|------|
| `deepseek-v4-flash` | DeepSeek V4 Flash 快速模型 |
| `deepseek-v4-pro` | DeepSeek V4 Pro 专业模型 |
| `claude-opus-4-8` | Claude Opus 4.8 高性能模型 |

## 注意事项

1. 所有请求必须携带 `Authorization: Bearer sk-xxx` Header
2. 流式输出时，每个 chunk 以 `data:` 开头，以 `[DONE]` 结束
3. 请妥善保管 API Key，不要在客户端代码中暴露
