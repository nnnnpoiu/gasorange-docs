# GasOrange 客户端与第三方调用指南

本教程将引导您在 GasOrange 大模型中转平台上，配置并使用各种主流 CLI 客户端（如 **Claude Code**、**OpenAI Codex CLI**、**Gemini CLI**）以及第三方客户端软件（如 **Cherry Studio**）。

---

## 目录
- [Claude Code 使用指南](#claude-code-使用指南)
- [OpenAI Codex CLI 使用指南](#openai-codex-cli-使用指南)
- [Gemini CLI 使用指南](#gemini-cli-使用指南)
- [第三方工具配置（以 Cherry Studio 为例）](#第三方工具配置以-cherry-studio-为例)

---

## Claude Code 使用指南

### 1. 什么是 Claude Code
Claude Code 是 Anthropic 推出的代理式（Agentic）命令行编程工具。它可以在您的终端中直接理解项目结构、阅读与修改代码、运行命令、审查 Git Diff，并自动辅助您完成代码测试、重构、编写文档以及提交 Git 工作流。

**核心适用场景：**
* 快速理解并熟悉陌生的代码库
* 自动修复 Bug、重构代码与补充单元测试
* 自动生成或维护项目文档
* 执行代码审查与安全检查
* 与 VS Code / JetBrains 等 IDE 协同工作

### 2. 系统要求与前置条件
* 支持的系统：macOS、Linux、Windows (及 WSL)
* Node.js 环境：推荐 Node.js 18+（原生安装脚本可不依赖 npm）
* 内存要求：建议至少 4GB 内存
* 凭证准备：已获取 GasOrange API 密钥（API Key）

验证 Node.js 安装：
```bash
node -v
npm -v
```

### 3. 安装 Claude Code

#### 方式一：原生安装（推荐）
* **macOS / Linux / WSL**:
  ```bash
  curl -fsSL https://claude.ai/install.sh | bash
  ```
* **Windows (PowerShell)**:
  ```powershell
  irm https://claude.ai/install.ps1 | iex
  ```
* **Windows (CMD)**:
  ```cmd
  curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
  ```

#### 方式二：npm 安装
```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，可运行以下命令验证：
```bash
claude --version
claude doctor
```
*提示：如需更新，请运行 `claude update`。在 Windows 下如果安装或运行报错，请尝试“以管理员身份运行”命令行终端。*

### 4. 配置 GasOrange 平台
请登录 GasOrange 控制台获取 API Key 并配置。

* **控制台入口**：[https://www.gasorange.com/console](https://www.gasorange.com/console)
* **API 密钥管理**：[https://www.gasorange.com/console/token](https://www.gasorange.com/console/token)
* **Claude API Host 地址**：`https://www.gasorange.com`
* **支持的模型与价格**：[https://www.gasorange.com/pricing](https://www.gasorange.com/pricing)

**快捷配置步骤：**
1. 登录 GasOrange 令牌管理页面，点击已生成令牌右侧的**三角符号**，即可查看并复制一键配置脚本。
2. 在本地终端中运行配置脚本，或手动设置环境变量。
3. 重新打开终端，运行 `claude` 即可启动。

如需按用途分组或精细管理 Key：
1. 访问 [GasOrange 令牌管理](https://www.gasorange.com/console/token)
2. 点击 **添加令牌**
3. 选择您需要的 **令牌分组**，并按需勾选对应的 Providers 与 Models。

### 5. 基础与常用命令

在项目根目录下启动：
```bash
cd your-project
claude
```

直接执行单次任务：
```bash
claude "修复编译错误"
claude -p "解释这个函数的作用"
```

恢复最近一次会话：
```bash
claude -c
```

**常用提问示例：**
* `What does this project do?` (这个项目是做什么的？)
* `Where is the main entry point?` (主入口文件在哪里？)
* `Explain the folder structure.` (解释文件夹结构。)
* `Find the cause of this bug and propose a fix.` (寻找 Bug 原因并提供修复方案。)
* `Review my current changes.` (审查我当前的修改。)

### 6. 常用斜杠命令与特殊输入
在 Claude Code 交互界面中，可使用以下指令：

* `/help`：查看帮助与命令列表
* `/clear`：清空当前的会话上下文
* `/model`：切换当前使用的模型
* `/init`：为项目初始化 `CLAUDE.md` 规范文件
* `/review`：审查当前代码改动
* `/security-review`：安全风险审查
* `/permissions`：管理并查看当前的工具执行权限
* `/memory`：管理持久化记忆文件
* `/compact`：压缩长对话上下文以节省 Token
* `/plan`：进入只读规划模式
* `/resume`：恢复历史会话
* `/tasks` 或 `/bashes`：查看在后台运行的任务或 Bash 进程
* `/plugin`：管理插件
* `/mcp`：配置与管理 Model Context Protocol (MCP) 插件
* `/exit`：退出

**特殊输入语法：**
* `@<file_path>`：在上下文中引用特定文件（如 `@src/index.js`）
* `!<command>`：直接在 Claude 界面中运行一条本地 Bash 命令（如 `!npm run test`）
* `#<content>`：手动向记忆中写入内容
* `/<command>`：执行斜杠命令

### 7. 权限与安全策略
Claude Code 默认在执行高危操作（如修改文件、运行终端命令、访问网络等）时会向您请求确认。

**常见权限模式：**
* `default`：默认模式，敏感操作必须经用户确认。
* `acceptEdits`：自动允许修改文件，适合支持 Git 回滚的小改动。
* `plan`：只读规划模式，Claude 只能提供建议，不能修改任何本地文件。
* `dontAsk`：非交互模式，任何需要授权的请求都默认拒绝（适合脚本或 CI 管道）。
* `bypassPermissions`：完全跳过所有确认提示（极高风险，日常不建议使用）。

**安全建议：**
* 面对陌生的仓库，优先使用 `plan` 模式运行。
* 在 Claude 自动修改代码前，确保项目已经提交 Git，方便随时回滚。
* 避免将包含敏感密钥的 `.env` 或 `secrets/` 目录放入 Claude 的读取范围内。

用户可以通过修改配置文件进行精细化授权：
* 全局配置：`~/.claude/settings.json`
* 项目共享配置：`.claude/settings.json`
* 本地项目专用配置：`.claude/settings.local.json`

**配置文件示例：**
```json
{
  "model": "sonnet",
  "language": "chinese",
  "permissions": {
    "allow": [
      "Read(./src/**)",
      "Bash(npm test)"
    ],
    "deny": [
      "Read(./.env*)",
      "Read(./secrets/**)"
    ],
    "defaultMode": "default"
  }
}
```

### 8. 集成到 IDE 中使用

#### 在 VS Code 中使用：
1. 在 VS Code 插件市场搜索并安装 **Claude Code** 扩展。
2. 打开您的项目工作区。
3. 您可以通过侧边栏的 Claude Code 面板直接与 AI 交互，或在 VS Code 内置终端中直接输入 `claude` 启动。

#### 在 JetBrains 系列 IDE 中使用：
1. 打开 IDE 的插件市场（Plugins），搜索并安装 **Claude Code** 插件。
2. 重启 IDE。
3. 在内置终端中运行 `claude` 即可建立联动。
   * 快捷打开按键：macOS `Cmd + Esc`，Windows/Linux `Ctrl + Esc`
   * 也可在外部独立终端中，输入 `/ide` 来连接当前打开的 IDE 窗口。

### 9. 最佳工作流实践
推荐遵循以下反馈环：
`探索 (Explore) ➔ 规划 (Plan) ➔ 编码 (Code) ➔ 评审 (Review) ➔ 测试 (Test)`

**提问与执行步骤示例：**
1. `analyze the project structure` (分析项目结构)
2. `think step by step and propose a plan, do not edit files yet` (逐步思考并给出修改方案，先不要修改任何文件)
3. `implement step 1 and show me the diff` (开始实施步骤 1 并展示修改的 Diff)
4. `run tests and fix failures` (运行测试并修复测试失败的问题)
5. `review the final changes` (审查最终的代码修改)

### 10. Claude Code 常见问题排查

* **找不到 `claude` 命令**
  * 确认是否成功安装，运行 `claude --version` 查看。
  * 检查全局 npm 的安装路径是否已加入系统环境变量 `PATH`。
  * 运行 `claude doctor` 诊断环境。
  * 如果通过 `npm` 安装失败，建议改用官方的原生脚本安装。
* **PowerShell 阻止执行 `claude.ps1` 脚本**
  * 这是由于 Windows 执行策略限制。您可以选择改用 CMD、Git Bash，或者使用原生 Windows 安装脚本安装 exe 可执行程序。
* **网络连接超时或无法响应**
  * 请确认您的本地代理配置正确，且能够稳定连接 GasOrange API Host (`https://www.gasorange.com`)。
  * 确认您的 GasOrange API Key 正常，且账户有足够的余额。
* **IDE 扩展无法工作**
  * 确认 VS Code 或 JetBrains IDE 已更新到较新版本。
  * 如果使用的是远程开发模式（WSL / Remote SSH），需要将 Claude Code 安装在远程目标主机上而非本地。
* **长会话变慢**
  * 使用 `/compact` 压缩上下文体积，或者使用 `/clear` 清除当前会话。

---

## OpenAI Codex CLI 使用指南

### 1. 前置要求
* 准备 Node.js 与 npm 环境
* 本地已安装 Git
* Windows 用户推荐使用 WSL2；若在原生 PowerShell 下使用，建议调用 `codex.cmd`
* 已在 GasOrange 平台创建并获取 API Key

```bash
node -v
npm -v
git --version
```

### 2. 安装 Codex CLI

使用 npm 进行全局安装：
```bash
npm install -g @openai/codex
```
*(macOS 用户亦可使用 Homebrew：`brew install codex`)*

安装后验证：
```bash
codex --help
codex --version
```
*提示：在 Windows 下如果安装或运行报错，请使用管理员权限打开终端。*

### 3. 配置 GasOrange
请登录 GasOrange 获取 API 凭证，并配置本地文件。

* **控制台入口**：[https://www.gasorange.com/console](https://www.gasorange.com/console)
* **API 密钥管理**：[https://www.gasorange.com/console/token](https://www.gasorange.com/console/token)
* **OpenAI 兼容 Base URL / Endpoint**：`https://www.gasorange.com/v1`
* **支持的模型与价格**：[https://www.gasorange.com/pricing](https://www.gasorange.com/pricing)

**配置文件路径：**
* macOS / Linux / WSL：`~/.codex/config.toml`
* Windows：`%USERPROFILE%\.codex\config.toml`

您可以通过在项目根目录或 `~/.codex/` 路径下放置 `AGENTS.md` 来自定义项目的编码规范、测试方法与安全限制。
*提示：在 GasOrange 令牌管理页面中，点击令牌右侧的**三角符号**可直接复制一键配置脚本。*

### 4. 常用命令与交互模式

启动交互式会话：
```bash
codex
codex "帮我修复当前的 Lint 错误"
```

执行单次非交互式命令：
```bash
codex exec "统计该项目中的代码总行数"
```

自动修改工作区代码（全自动模式）：
```bash
codex exec --full-auto "修复 lint 报错"
```

在非 Git 初始化目录中强行运行：
```bash
codex exec --skip-git-repo-check "描述当前目录的文件"
```

**交互模式 TUI 命令：**
* `/model`：切换所使用的模型与推理参数
* `/plan`：开启/关闭计划规划模式
* `/approvals`：设置授权与审批策略
* `/permissions`：配置命令执行权限
* `/review`：启动代码审查
* `/diff`：查看工作区当前的修改对比
* `/status`：查看当前模型、沙盒状态以及 Token 消耗统计
* `/init`：生成默认的 `AGENTS.md`
* `/mcp`：管理和查看 MCP 插件
* `/exit` 或 `/quit`：退出会话

### 5. 沙盒与权限管理
Codex 客户端的安全机制主要由以下两个核心参数决定：
* `sandbox_mode`：规定 Codex 脚本允许访问和修改的系统资源范围。
* `approval_policy`：规定何种操作需要用户授权。

推荐的开发配置：
```toml
sandbox_mode = "workspace-write"
approval_policy = "on-request"
```

如果您只希望 AI 进行代码分析而不修改任何文件，可使用只读模式：
```toml
sandbox_mode = "read-only"
approval_policy = "never"
```

如果开发任务需要进行网络请求，请在 `workspace-write` 模式下开启网络访问：
```toml
[sandbox_workspace_write]
network_access = true
```
*安全警告：日常开发请避免开启 `danger-full-access` 或使用 `--yolo` 参数，除非代码运行在隔离的容器或虚拟机中。*

### 6. 模型选择与推荐
默认情况下，您可以在 `config.toml` 中配置或者启动时指定 GasOrange 支持的 Codex 兼容模型：
```bash
codex -m gpt-5.1-codex-max
```

或者在配置文件中指定：
```toml
model = "gpt-5.1-codex-max"
```
*支持的全部可用模型请随时参考 GasOrange 官方定价页。*

### 7. Codex 常见问题排查

* **提示 `codex: command not found`**
  * 请确认是否成功安装，并重启终端。
  * 检查全局 npm 的 `bin` 目录是否包含在系统的 `PATH` 路径中。
  * Windows 用户请使用 `codex.cmd` 运行。
* **提示 `running scripts is disabled`**
  * Windows 系统的 PowerShell 脚本执行策略受限。推荐直接使用 `codex.cmd` 或者改用 WSL2。
* **提示当前目录不是 Git 仓库**
  * 在未初始化 Git 的目录下使用 `exec` 命令时，需附加 `--skip-git-repo-check` 参数。
* **文件一直处于只读，无法修改**
  * 在交互式界面输入 `/status` 检查当前的沙盒状态；启动时带上允许修改的参数：`codex --sandbox workspace-write`。
* **Windows 命令行乱码**
  * 推荐使用 WSL2。若在 PowerShell 下，可在运行前执行 `chcp 65001` 将终端临时编码修改为 UTF-8。

---

## Gemini CLI 使用指南

### 1. 前置条件
* 系统中已安装 Node.js >= 20 且 npm 可用
* 已在 GasOrange 控制台获取可用的 API Key
* 明确了所需要调用的 Gemini 模型名称

```bash
node -v
npm -v
```

### 2. 安装 Gemini CLI

推荐使用 npm 全局安装：
```bash
npm install -g @google/gemini-cli
```

也可以使用 npx 临时运行（无需全局安装）：
```bash
npx https://github.com/google-gemini/gemini-cli
```
*不建议在 macOS 下使用 Homebrew 安装，可能会导致环境变量读取不全的异常。Windows 下安装/运行出错请务必使用管理员权限终端。*

### 3. 配置 GasOrange
请登录 GasOrange 获取 API Key 进行环境配置。

* **控制台入口**：[https://www.gasorange.com/console](https://www.gasorange.com/console)
* **API 密钥管理**：[https://www.gasorange.com/console/token](https://www.gasorange.com/console/token)
* **Gemini 兼容 Base URL / Endpoint**：`https://www.gasorange.com/v1beta` 或 `https://www.gasorange.com/v1/chat/completions`

**快捷配置步骤：**
1. 登录 GasOrange 令牌管理页面，点击对应令牌的**三角符号**一键复制配置命令。
2. 运行配置命令完成认证。或者在 Gemini CLI 内置界面中输入 `/auth`，然后粘贴您的 GasOrange API Key，并手动设置 Endpoint 地址为：
   `https://www.gasorange.com/v1beta`

### 4. 启动与使用
使用 Gemini CLI 时，通常需要显式指定目标模型：
```bash
gemini -m <model_name>
```

**使用示例：**
```bash
gemini -m gemini-3-pro-preview
gemini -m gemini-2.5-flash
```
*请注意，可用的具体模型名称请随时以 GasOrange [Pricing 页面](https://www.gasorange.com/pricing) 为准。*

### 5. Gemini 常见问题排查

* **提示 `API key not valid`**
  * 通常是由于当前项目目录或上层目录存在 `.env` 配置文件，其中的配置覆盖了全局的 Gemini 环境变量。
  * 排查方法：检查并清理当前目录和祖先目录下的 `.env` 文件，或者将全局 `~/.gemini` 的配置文件复制到当前项目目录下，再重新运行一键配置脚本。
* **提示 `Model is not allowed`**
  * 该错误通常意味着模型名称拼写不正确，或者在启动时漏掉了 `-m` 模型参数。
  * 请参考 GasOrange 官方模型列表填入正确的模型名称。
* **遇到 `RESOURCE_EXHAUSTED` 错误**
  * 这通常代表上游的接口调用额度或频次达到了平台或账户的限额，请稍后重试或前往控制台检查额度。
* **遇到 `SyntaxError` 或 `unsupported engine`**
  * 您的 Node.js 版本过低。Gemini CLI 必须运行在 Node.js >= 20 的环境下，请升级 Node.js。

**推荐排查顺序：**
1. 确认 Node.js 版本 >= 20。
2. 尝试重新安装最新版 CLI：`npm install -g @google/gemini-cli`。
3. 删除本地已有的 `.gemini` 配置目录，然后重新运行 GasOrange 的一键配置脚本。
4. 确认所请求的模型名称在 `https://www.gasorange.com/pricing` 列表中。

---

## 第三方工具配置（以 Cherry Studio 为例）

### 声明
* GasOrange 官方仅对 Claude Code、OpenAI Codex CLI 以及 Gemini CLI 官方客户端提供售后支持。第三方工具的配置教程仅供参考。
* 管理 API 密钥：[https://www.gasorange.com/console/token](https://www.gasorange.com/console/token)
* 查询可用模型：[https://www.gasorange.com/pricing](https://www.gasorange.com/pricing)

### 1. 配置 Anthropic / Claude 模型
1. 登录 GasOrange 控制台生成您的 API Key。
2. 打开 Cherry Studio，进入 **设置** ➔ **模型提供商 (Model Provider)**。
3. 点击 **添加**，选择 Provider 类型为 **Anthropic**。
4. 将 API Key 填入输入框，并将 **API Host (或 Base URL)** 修改为：
   `https://www.gasorange.com`
5. 手动添加您想要调用的模型（如 `claude-opus-4-6`），点击保存即可开始使用。

### 2. 配置 OpenAI 兼容模型
1. 在 Cherry Studio 的 **模型提供商 (Model Provider)** 页面中点击 **添加**。
2. 选择 Provider 类型为 **OpenAI**。
3. 将 API Key 填入输入框，并将 **API Host / Base URL** 修改为：
   `https://www.gasorange.com/v1`
4. 手动输入或加载模型列表（如 `gpt-5.4`），保存后即可开始使用。

### 3. 配置 Gemini 模型
1. 在 Cherry Studio 的 **模型提供商 (Model Provider)** 页面中点击 **添加**。
2. 选择 Provider 类型为 **Gemini**。
3. 将 API Key 填入输入框，并将 **API Host / Base URL** 修改为：
   `https://www.gasorange.com/v1beta`
4. 手动输入您想要调用的模型名称（如 `gemini-3.1-pro-preview`），保存即可。
