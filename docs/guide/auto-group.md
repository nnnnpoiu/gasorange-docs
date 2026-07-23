# Auto 分组使用指南

## 1. 接入信息

Base URL：

```
https://www.gasorange.com
```

API Key：

```
sk-你的key
```

推荐使用平台提供的 `auto` 分组 API Key。

## 2. Auto 分组说明

`auto` 是自动分组入口，不是真实计费分组。

当 API Key 配置为：

```
group = auto
cross_group_retry = true
```

平台会在已配置的兜底分组中自动选择可用模型渠道。如果当前分组不可用，会继续尝试下一个可用分组。

计费按最终实际使用的真实分组价格计算。

## 3. 检查当前 Key 能力

```
curl -s https://www.gasorange.com/api/token/capabilities \
  -H "Authorization: Bearer sk-你的key" | jq
```

成功响应示例：

```
{
  "success": true,
  "message": "",
  "data": {
    "token": {
      "request_available": true,
      "group": "auto",
      "cross_group_retry_effective": true
    },
    "groups": {
      "auto_groups": ["claude_特惠", "claude_aws", "gpt_az"]
    },
    "models": [
      {
        "name": "claude-sonnet-4-5",
        "available_groups": ["claude_特惠", "claude_aws"],
        "available": true,
        "price": {
          "claude_特惠": {
            "billing_type": "token",
            "currency": "USD",
            "prices": [
              { "type": "input", "price": 3, "unit": "1M tokens" },
              { "type": "output", "price": 15, "unit": "1M tokens" },
              { "type": "cache_read", "price": 0.3, "unit": "1M tokens" },
              { "type": "cache_create", "price": 3.75, "unit": "1M tokens" }
            ]
          }
        }
      }
    ]
  }
}
```

字段说明：

| 字段                                | 含义                            |
| ----------------------------------- | ------------------------------- |
| `token.request_available`           | 当前 Key 是否可正常请求         |
| `token.unavailable_reasons`         | 不可用原因，仅异常时返回        |
| `token.group`                       | 当前 Key 的分组，推荐为 `auto`  |
| `token.cross_group_retry_effective` | 跨分组重试是否实际生效          |
| `groups.auto_groups`                | `auto` Key 会使用的兜底分组列表 |
| `models[].name`                     | 可调用的模型名称                |
| `models[].available_groups`         | 该模型可使用的真实分组          |
| `models[].available`                | 该模型当前是否可用              |
| `models[].price`                    | 该模型按分组计算后的最终价格    |

价格字段说明：

| 字段             | 含义                                    |
| ---------------- | --------------------------------------- |
| `billing_type`   | 计费类型：`token`、`request`、`dynamic` |
| `currency`       | 价格币种，当前为 `USD`                  |
| `prices[].type`  | 价格类型                                |
| `prices[].price` | 最终价格                                |
| `prices[].unit`  | 计价单位                                |

常见价格类型：

| type           | 含义         |
| -------------- | ------------ |
| `input`        | 输入价格     |
| `output`       | 输出价格     |
| `cache_read`   | 缓存读取价格 |
| `cache_create` | 缓存创建价格 |
| `image_input`  | 图片输入价格 |
| `audio_input`  | 音频输入价格 |
| `audio_output` | 音频输出价格 |
| `model`        | 按次模型价格 |

## 4. 测试模型请求

OpenAI 兼容接口：

```
curl -s https://www.gasorange.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "你好，测试一下。"
      }
    ]
  }' | jq
```

Claude / Anthropic 接口：

```
curl -s https://www.gasorange.com/v1/messages \
  -H "x-api-key: sk-你的key" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 200,
    "messages": [
      {
        "role": "user",
        "content": "你好，测试一下。"
      }
    ]
  }' | jq
```

## 5. 异常响应

如果 API Key 无效、格式错误或鉴权失败，返回：

```
{
  "success": false,
  "message": "Invalid token"
}
```

注意 Authorization 必须写成：

```
-H "Authorization: Bearer sk-你的key"
```

如果 Key 鉴权成功，但当前 Key 不满足调用条件，接口仍返回 `success: true`，并通过 `request_available` 和 `unavailable_reasons` 说明原因：

```
{
  "success": true,
  "message": "",
  "data": {
    "token": {
      "request_available": false,
      "unavailable_reasons": ["token quota is exhausted"],
      "group": "auto",
      "cross_group_retry_effective": true
    },
    "groups": {
      "auto_groups": ["claude_特惠", "claude_aws"]
    },
    "models": []
  }
}
```

## 6. 常见问题

### 6.1 request_available 为 false

查看：

```
token.unavailable_reasons
```

常见原因：

- Key 已过期
- Key 被禁用
- 额度不足
- 用户被禁用
- 分组不可用
- IP 不在 Key 白名单内

### 6.2 cross_group_retry_effective 为 false

说明当前 Key 没有真正启用跨分组重试。

常见原因：

```
Key 不是 group=auto
或没有开启 cross_group_retry
```

请联系平台管理员调整 Key 配置。

### 6.3 某个模型不能自动兜底

查看该模型的：

```
models[].available_groups
```

如果只有一个分组，例如：

```
"available_groups": ["claude_特惠"]
```

说明该模型只在一个分组可用，该分组不可用时无法自动切换。

### 6.4 auto 分组如何计费

`auto` 不直接计费。
最终按实际落到的真实分组价格计费。

例如：

```
auto 最终落到 claude_aws
则按 claude_aws 对应价格计费
```

## 7. 最短测试流程

```
# 1. 查看 Key 能力
curl -s https://www.gasorange.com/api/token/capabilities \
  -H "Authorization: Bearer sk-你的key" | jq

# 2. 查看模型
curl -s https://www.gasorange.com/v1/models \
  -H "Authorization: Bearer sk-你的key" | jq

# 3. 测试请求
curl -s https://www.gasorange.com/v1/chat/completions \
  -H "Authorization: Bearer sk-你的key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5",
    "messages": [
      {
        "role": "user",
        "content": "你好，测试一下。"
      }
    ]
  }' | jq
```