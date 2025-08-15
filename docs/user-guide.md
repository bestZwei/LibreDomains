# 用户指南

本指南将帮助您申请和管理 LibreDomains 提供的二级域名。

## 目录

1. [申请域名](#申请域名)
2. [更新域名记录](#更新域名记录)
3. [DNS 记录类型说明](#dns-记录类型说明)
4. [常见问题](#常见问题)
5. [技术支持](#技术支持)

## 重要提醒

使用本服务前，请务必阅读并同意我们的[服务条款](terms-of-service.md)。

## 申请域名

### 前提条件

- GitHub 账户
- 基本的 Git 和 GitHub 知识
- 了解 DNS 记录的基本概念
- 已阅读并同意我们的[服务条款](terms-of-service.md)

### 详细步骤

#### 1. Fork 仓库

1. 访问 [LibreDomains 仓库](https://github.com/bestzwei/LibreDomains)
2. 点击右上角的 "Fork" 按钮
3. 等待仓库克隆到您的 GitHub 账户

#### 2. 创建配置文件

1. 在您 Fork 的仓库中，导航到 `domains/[域名]/` 目录
   - 例如: 如果您想申请 `myapp.ciao.su`，请导航到 `domains/ciao.su/`
2. 点击 "Add file" > "Create new file"
3. 将文件命名为您想要的子域名，如 `myapp.json`
   - **注意**: 请确保您的子域名不在保留列表中
4. 填写文件内容，格式如下:

```json
{
  "description": "个人博客网站",
  "owner": {
    "name": "您的姓名",
    "github": "您的GitHub用户名",
    "email": "您的邮箱"
  },
  "records": [
    {
      "type": "A",
      "name": "@",
      "content": "您的IP地址",
      "ttl": 3600,
      "proxied": false
    }
  ]
}
```

### 字段说明

**description 部分：**
- `description`: 必填，对子域名用途的简要描述（5-200个字符）

**owner 部分：**
- `name`: 必填，用于标识域名所有者
- `github`: 必填，用于权限验证和联系
- `email`: 必填，联系邮箱

### 保留子域名说明

以下子域名为系统保留，**不允许申请**（这些子域名通常用于系统功能、服务管理或特定用途）：

- **根域名**: `@` - 根域名由管理员控制，用于主域名的核心配置
- **系统功能**: `www`, `mail`, `email`, `webmail`, `ns`, `dns`
- **服务相关**: `api`, `cdn`, `ftp`, `sftp`
- **管理相关**: `admin`, `panel`, `dashboard`, `control`
- **开发相关**: `dev`, `test`, `staging`, `demo`
- **内容相关**: `blog`, `forum`, `wiki`, `docs`, `tv`
- **应用相关**: `app`, `mobile`, `static`, `assets`

**为什么这些子域名被保留？**
- **安全考虑**: 防止恶意用户冒充管理界面或系统服务
- **功能保留**: 为将来可能的官方功能预留空间
- **标准实践**: 遵循互联网域名管理的最佳实践

如果您需要申请类似功能的子域名，建议使用变体，如：
- `myblog` 而不是 `blog`
- `myapi` 而不是 `api`
- `myapp` 而不是 `app`

#### 3. 提交 Pull Request

1. 提交您的更改并填写提交信息
2. 返回到您的 Fork 仓库页面
3. 点击 "Contribute" > "Open pull request"
4. 填写 PR 描述，说明您申请的域名及用途
5. 提交 PR

#### 4. 后续流程

1. 自动检查将验证您的配置文件
2. 如有问题，机器人会留下评论指出问题所在
3. 修复问题后重新提交
4. 等待管理员审核并合并您的 PR
5. PR 合并后，域名将在几分钟内生效

## 更新域名记录

1. 访问您 Fork 的仓库
2. 如果已过时，先同步更新（点击"Sync fork"按钮）
3. 导航到您的域名配置文件
4. 点击编辑按钮（铅笔图标）
5. 更新 JSON 内容
6. 提交更改并创建新的 Pull Request
7. 等待审核和部署

## DNS 记录类型说明

### A 记录

指向服务器的 IPv4 地址。

```json
{
  "type": "A",
  "name": "@",       // @ 表示域名本身，其他值如 "www" 表示子域名
  "content": "185.199.108.153",   // IP 地址
  "ttl": 3600,       // 缓存时间（秒）
  "proxied": false   // 是否经过 Cloudflare 代理
}
```

### AAAA 记录

指向服务器的 IPv6 地址。

```json
{
  "type": "AAAA",
  "name": "@",
  "content": "2606:4700:90:0:f22e:fbec:5bed:a9b9",
  "ttl": 3600,
  "proxied": false
}
```

### CNAME 记录

创建一个指向另一个域名的别名。

```json
{
  "type": "CNAME",
  "name": "www",
  "content": "username.github.io",
  "ttl": 3600,
  "proxied": false
}
```

### TXT 记录

存储文本信息，常用于验证域名所有权。

```json
{
  "type": "TXT",
  "name": "@",
  "content": "v=spf1 include:_spf.google.com ~all",
  "ttl": 3600,
  "proxied": false
}
```

### MX 记录

指定处理域名邮件的服务器。

```json
{
  "type": "MX",
  "name": "@",
  "content": "mail.example.com",
  "priority": 10,    // 邮件服务器优先级
  "ttl": 3600,
  "proxied": false
}
```

## 常见问题

### 我提交的 PR 显示检查失败

请查看自动检查的评论，修复指出的问题，然后更新您的 PR。常见问题包括：

#### JSON 格式错误
- **缺少逗号分隔符**: JSON 对象中的字段必须用逗号分隔
  ```json
  // ❌ 错误
  {
    "name": "张三"
    "email": "zhang@example.com"
  }
  
  // ✅ 正确
  {
    "name": "张三",
    "email": "zhang@example.com"
  }
  ```

- **多余的逗号**: 最后一个字段后不应有逗号
  ```json
  // ❌ 错误
  {
    "name": "张三",
    "email": "zhang@example.com",
  }
  
  // ✅ 正确
  {
    "name": "张三",
    "email": "zhang@example.com"
  }
  ```

- **引号不匹配**: 所有字符串必须用双引号包围
  ```json
  // ❌ 错误
  {
    'name': '张三',
    "email": "zhang@example.com"
  }
  
  // ✅ 正确
  {
    "name": "张三",
    "email": "zhang@example.com"
  }
  ```

#### 其他常见问题
- 子域名已被占用
- 记录类型不支持
- 超过了每个子域名的记录数限制
- 无效的域名格式
- 无效的 IP 地址或邮箱格式

#### 推荐工具
- 使用 [JSONLint](https://jsonlint.com/) 在线验证 JSON 格式
- 使用支持语法高亮的编辑器（如 VS Code、Sublime Text）
- 复制示例文件并修改，避免格式错误

### 我的域名多久能生效？

PR 合并后，DNS 记录通常会在 5-15 分钟内生效。但由于 DNS 缓存的特性，全球范围内可能需要 24-48 小时才能完全生效。

### 我可以申请多少个子域名？

每个 GitHub 用户最多可申请 3 个子域名。

### 我可以删除我的域名吗？

可以。创建一个删除您的域名配置文件的 PR，审核通过后您的域名将被移除。

## 技术支持

如遇问题，请通过以下方式获取帮助:

1. 在仓库中创建 Issue
2. 联系项目维护者
3. 查阅项目 Wiki

祝您使用愉快！

### 规则

1. 子域名必须由小写字母、数字和连字符组成
2. 子域名长度在 3-63 个字符之间
3. 子域名不能以连字符开头或结尾
4. 一个 GitHub 用户最多可以申请 3 个子域名
5. 每个子域名最多可以有 10 个 DNS 记录
6. **不允许申请以下保留的子域名**（这些子域名由系统保留，用于特定功能或管理目的）:
   - **根域名**: `@` (根域名由管理员控制)
   - **系统保留**: `www`, `mail`, `email`, `webmail`, `ns`, `dns`
   - **服务保留**: `api`, `cdn`, `ftp`, `sftp`
   - **管理保留**: `admin`, `panel`, `dashboard`, `control`
   - **开发保留**: `dev`, `test`, `staging`, `demo`
   - **内容保留**: `blog`, `forum`, `wiki`, `docs`, `tv`
   - **应用保留**: `app`, `mobile`, `static`, `assets`
