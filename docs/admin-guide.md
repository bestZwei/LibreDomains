# 管理员指南

本指南提供 LibreDomains 项目的管理操作说明。管理员负责审核域名申请、配置系统及维护项目健康。

## 目录

1. [系统架构](#系统架构)
2. [初始设置](#初始设置)
3. [日常管理](#日常管理)
4. [故障排除](#故障排除)
5. [安全最佳实践](#安全最佳实践)
6. [违规处理流程](#违规处理流程)

## 系统架构

LibreDomains 由以下组件组成：

1. **配置存储**：GitHub 仓库存储所有域名配置
2. **自动化验证**：GitHub Actions 运行验证脚本
3. **部署系统**：GitHub Actions 和 Python 脚本部署 DNS 配置
4. **DNS 管理**：通过 Cloudflare API 管理 DNS 记录

## 初始设置

### 1. 环境变量设置

在 GitHub 仓库中，设置以下密钥：

1. `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌，需具有 DNS 编辑权限
2. `GITHUB_TOKEN` - 用于机器人评论 PR 的 GitHub 令牌

添加方法：
- 仓库设置 > Secrets and variables > Actions > New repository secret

### 2. 添加新域名

1. 在 Cloudflare 中添加域名并获取 Zone ID
2. 修改 `config/domains.json` 文件：

```json
{
  "domains": [
    {
      "name": "新域名.com",
      "enabled": true,
      "description": "域名描述",
      "cloudflare_zone_id": "Cloudflare_区域_ID"
    },
    // 其他现有域名...
  ],
  // 其他配置...
}
```

3. 创建域名目录：
```bash
mkdir -p domains/新域名.com
```

### 3. 更新工作流配置

如有必要，更新 `.github/workflows/` 中的工作流文件。

## 日常管理

### 审核 Pull Request

1. 检查自动验证结果
2. 验证申请者的身份和域名用途是否合理
3. 检查记录是否遵循最佳实践
4. 合并合规的 PR

### 处理非标准请求

某些用户可能有特殊需求（如更多记录、保留子域名等）：

1. 在 PR 中讨论需求
2. 如批准特例，可临时调整验证脚本的限制
3. 记录特例决定

### 监控系统健康

定期检查：

1. 查看健康检查报告（每日自动运行）
2. 监控 Cloudflare 配额使用情况
3. 检查失败的工作流运行

## 禁止的内容策略

确保域名不被用于：

1. 垃圾邮件或恶意软件传播
2. 非法内容
3. 侵犯版权的内容
4. 钓鱼网站

如发现违规，立即：

1. 临时暂停子域名（通过 Cloudflare 设置）
2. 联系所有者讨论问题
3. 必要时永久移除配置

## 故障排除

### DNS 部署失败

1. 检查 Cloudflare API 令牌是否有效
2. 验证 Zone ID 是否正确
3. 查看 Cloudflare API 限制是否已达到
4. 检查部署日志中的详细错误信息

### 验证脚本错误

1. 本地运行验证脚本进行调试：
```bash
python scripts/validation/domain_validator.py
```

2. 检查脚本依赖项是否完整
3. 验证配置文件格式

## 添加新功能

### 管理保留子域名

保留子域名配置在 `config/domains.json` 文件的 `reserved_subdomains` 数组中：

```json
{
  "reserved_subdomains": [
    "www", "mail", "email", "webmail", "ns", "dns",
    "api", "cdn", "ftp", "sftp",
    "admin", "panel", "dashboard", "control",
    "dev", "test", "staging", "demo",
    "blog", "forum", "wiki", "docs",
    "app", "mobile", "static", "assets"
  ]
}
```

#### 添加新的保留子域名

1. 编辑 `config/domains.json`
2. 在 `reserved_subdomains` 数组中添加新的子域名
3. 提交更改并推送到主分支
4. 更新相关文档

#### 移除保留子域名

1. 从 `reserved_subdomains` 数组中移除子域名
2. 确保该子域名未被系统关键功能使用
3. 更新文档说明变更

#### 批准保留子域名的特例申请

在特殊情况下，管理员可以批准保留子域名的申请：

1. 在 PR 中讨论申请理由
2. 临时修改验证脚本跳过该检查
3. 合并 PR 后恢复验证脚本
4. 记录特例决定和原因

### 增加新的记录类型支持

1. 更新 `config/domains.json` 中的 `record_types` 列表
2. 修改验证脚本以支持新类型的验证逻辑
3. 测试新记录类型的部署

### 修改域名策略

更新以下文件中的规则：

1. `scripts/validation/domain_validator.py`
2. `docs/user-guide.md`
3. `README.md`

## 安全最佳实践

1. 定期轮换 Cloudflare API 令牌
2. 使用最小权限原则配置令牌权限
3. 监控异常活动
4. 定期审计域名配置

## 备份和恢复

GitHub 仓库本身提供了版本历史作为备份。此外：

1. 考虑定期导出所有域名配置
2. 保存 Cloudflare 区域设置的备份

## 紧急联系人

维护以下信息的最新版本：

1. 项目主要维护者联系方式
2. Cloudflare 账户管理员
3. 域名注册商联系信息

## 定期维护清单

- [ ] 检查域名是否即将到期
- [ ] 审查 Cloudflare 设置
- [ ] 验证 GitHub Actions 配置是否最新
- [ ] 检查依赖项更新
- [ ] 审查自动化脚本的日志

## 违规处理流程

### 识别违规行为

根据[服务条款](terms-of-service.md)，以下行为被视为违规：

1. **技术违规**
   - 超出申请限制（超过 3 个子域名或 10 个记录）
   - 使用保留的子域名
   - 提供虚假信息

2. **内容违规**
   - 传播非法内容
   - 垃圾邮件或恶意软件
   - 侵犯知识产权
   - 钓鱼或欺诈行为

3. **滥用行为**
   - 恶意占用资源
   - 尝试绕过系统限制
   - 冒充他人或机构

### 处理措施

1. **轻微违规**
   - 在 PR 中留言警告
   - 要求用户修正问题
   - 记录违规行为

2. **严重违规**
   - 立即关闭相关 PR
   - 暂停域名解析（通过 Cloudflare）
   - 通知用户并要求说明

3. **重大违规**
   - 永久删除域名配置
   - 将用户加入黑名单
   - 必要时报告相关部门

### 申诉处理

1. 用户可通过 GitHub Issue 提出申诉
2. 管理员应在 48 小时内回复
3. 如确认误判，及时恢复服务
4. 记录所有申诉和处理结果

### 法律投诉处理

1. 收到 DMCA 或其他法律投诉时
2. 立即暂停相关域名
3. 通知域名所有者
4. 按法律要求处理投诉
