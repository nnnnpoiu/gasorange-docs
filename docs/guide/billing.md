# 计费说明

GasOrange 采用按量计费模式，根据实际使用的 Token 数量计费。

## 计费规则

| 模型类型 | 计费单位 | 说明 |
|----------|----------|------|
| 文本模型 | Token | 按输入和输出的 Token 总数计费 |
| 图片模型 | 张 | 按生成图片的数量计费 |
| 视频模型 | Token | 按生成视频消耗的 Token 计费 |

## 文本模型计费

文本模型按 Token 计费，1 Token 约等于 1 个中文汉字或 0.75 个英文单词。

| 模型 | 输入价格（每 1K Token） | 输出价格（每 1K Token） |
|------|------------------------|------------------------|
| `deepseek-v4-flash` | 请咨询平台 | 请咨询平台 |
| `deepseek-v4-pro` | 请咨询平台 | 请咨询平台 |
| `claude-opus-4-8` | 请咨询平台 | 请咨询平台 |

> 具体价格请登录平台查看 [Pricing 页面](https://www.gasorange.com/pricing) 或联系客服。

## 图片模型计费

| 模型 | 尺寸 | 价格（每张） |
|------|------|-------------|
| `gpt-image-2` | 请咨询平台 | 请咨询平台 |

> 具体价格请登录平台查看 [Pricing 页面](https://www.gasorange.com/pricing) 或联系客服。

## 视频模型计费

视频模型按生成视频消耗的 Token 计费，具体费用取决于视频时长和分辨率。

| 模型 | 分辨率 | 价格说明 |
|------|--------|----------|
| `doubao-seedance-2-0-260128` | 480p/720p/1080p | 按实际消耗 Token 计费 |
| `doubao-seedance-2-0-fast-260128` | 480p/720p | 按实际消耗 Token 计费 |
| `dreamina-seedance-2-0-260128` | 480p/720p/1080p | 按实际消耗 Token 计费 |
| `dreamina-seedance-2-0-fast-260128` | 480p/720p | 按实际消耗 Token 计费 |
| `dreamina-seedance-2-0-mini-260615` | 480p/720p | 按实际消耗 Token 计费 |

> 具体价格请登录平台查看 [Pricing 页面](https://www.gasorange.com/pricing) 或联系客服。

> 视频生成完成后，可通过查询接口获取 `metadata.total_tokens` 查看本次消耗。

## 余额查询

可通过 API 查询当前账户余额：

```bash
curl https://www.gasorange.com/v1/user/balance \
  -H "Authorization: Bearer sk-xxx"
```

## 注意事项

1. 计费以实际消耗的 Token 为准
2. 流式输出和非流式输出的计费方式相同
3. 余额不足时 API 将返回 402 错误
4. 建议设置余额预警，避免服务中断
