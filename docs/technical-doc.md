# 技术文档

本文档提供 LibreDomains 项目的技术实现细节和架构说明。

## 目录

1. [项目架构](#项目架构)
2. [文件结构](#文件结构)
3. [工作流程](#工作流程)
4. [API 参考](#api-参考)
5. [配置参考](#配置参考)

## 项目架构

LibreDomains 是一个基于 GitHub 的二级域名分发服务，通过以下组件实现功能：

- **存储层**：使用 Git 仓库存储域名配置
- **验证层**：Python 脚本和 GitHub Actions 验证域名请求
- **部署层**：Python 脚本通过 Cloudflare API 部署 DNS 记录
- **监控层**：定期健康检查确保域名正常工作

### 架构图

```
┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│ GitHub 用户 │──────▶│ Pull Request │──────▶│ 验证检查脚本  │
└─────────────┘       └──────────────┘       └───────┬───────┘
                                                    │
                                                    ▼
┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│ DNS 记录生效 │◀─────│ Cloudflare   │◀─────│ 部署脚本      │
└─────────────┘       └──────────────┘       └───────────────┘
```

## 文件结构

```
.
├── .github/                      # GitHub 配置
│   ├── ISSUE_TEMPLATE/           # Issue 模板
│   └── workflows/                # GitHub Actions 工作流
│       ├── deploy-domains.yml    # 部署域名工作流
│       ├── health-check.yml      # 健康检查工作流
│       └── validate-domain.yml   # 验证域名工作流
├── config/
│   └── domains.json              # 域名配置
├── docs/                         # 文档
│   ├── user-guide.md             # 用户指南
│   └── admin-guide.md            # 管理员指南
├── domains/                      # 域名目录
│   ├── ciallo.de/                # ciallo.de 域名配置
│   └── ciao.su/                  # ciao.su 域名配置
│       └── example.json          # 示例配置
├── scripts/                      # 脚本目录
│   ├── admin/                    # 管理员脚本
│   ├── bot/                      # 机器人脚本
│   │   └── pr_checker.py         # PR 检查脚本
│   ├── cloudflare/               # Cloudflare 相关脚本
│   │   └── cloudflare_manager.py # Cloudflare API 管理器
│   ├── dns/                      # DNS 相关脚本
│   ├── health/                   # 健康检查脚本
│   │   └── domain_health.py      # 域名健康检查
│   ├── stats/                    # 统计脚本
│   ├── utils/                    # 工具脚本
│   └── validation/               # 验证脚本
│       └── domain_validator.py   # 域名验证器
└── README.md                     # 主文档
```

## 工作流程

### 域名申请流程

1. 用户 Fork 仓库并创建域名配置文件
2. 用户提交 Pull Request (PR)
3. `validate-domain.yml` 工作流触发
4. `pr_checker.py` 运行验证检查
5. 机器人评论验证结果
6. 管理员审核 PR
7. PR 被合并至主分支
8. `deploy-domains.yml` 工作流触发
9. `cloudflare_manager.py` 部署 DNS 记录
10. DNS 记录生效

### 健康检查流程

1. `health-check.yml` 工作流按计划触发
2. `domain_health.py` 检查所有域名状态
3. 生成健康报告
4. 如有问题，通知管理员

## API 参考

### CloudflareManager 类

主要方法：

- `__init__(api_key, email=None, config_path=None)`: 初始化管理器
- `get_zone_id(domain)`: 获取域名的 Zone ID
- `list_dns_records(zone_id, type=None, name=None)`: 列出 DNS 记录
- `create_dns_record(zone_id, type, name, content, ttl=3600, proxied=True)`: 创建 DNS 记录
- `update_dns_record(zone_id, record_id, type, name, content, ttl=3600, proxied=True)`: 更新 DNS 记录
- `delete_dns_record(zone_id, record_id)`: 删除 DNS 记录
- `sync_domain_records(domain, records)`: 同步域名的所有记录

### 域名验证器

主要函数：

- `load_config(config_path=None)`: 加载配置
- `is_valid_domain_name(domain)`: 验证域名格式（最少3个字符）
- `is_reserved_subdomain(subdomain, config)`: 检查是否为保留子域名
- `validate_domain_config(file_path, config)`: 验证域名配置文件
- `validate_pull_request(pr_files, config)`: 验证 PR 中的文件

## 配置参考

### 域名配置（domains.json）

```json
{
  "domains": [
    {
      "name": "ciao.su",
      "enabled": true,
      "description": "主要域名",
      "cloudflare_zone_id": "your_cloudflare_zone_id"
    },
    {
      "name": "ciallo.de",
      "enabled": false,
      "description": "备用域名（暂未开放）",
      "cloudflare_zone_id": "your_cloudflare_zone_id"
    }
  ],
  "record_types": ["A", "AAAA", "CNAME", "TXT", "MX"],
  "max_records_per_subdomain": 10,
  "cloudflare_timeout": 30,
  "reserved_subdomains": [
    "www", "mail", "email", "webmail", "ns", "dns",
    "api", "cdn", "ftp", "sftp",
    "admin", "panel", "dashboard", "control",
    "dev", "test", "staging", "demo",
    "blog", "forum", "wiki", "docs",
    "app", "mobile", "static", "assets"
  ],
  "max_subdomains_per_user": 3
}
```

**保留子域名配置说明**:
- `reserved_subdomains`: 数组，包含所有不允许用户申请的子域名
- 包括根域名 `@`，确保主域名控制权在管理员手中
- 检查时不区分大小写
- 管理员可通过修改此配置来添加或移除保留子域名

### 域名记录格式

```json
{
  "description": "网站或服务的用途描述",
  "owner": {
    "name": "用户名称",
    "github": "GitHub用户名",
    "email": "user@example.com"
  },
  "records": [
    {
      "type": "A",
      "name": "@",
      "content": "185.199.108.153",
      "ttl": 3600,
      "proxied": false
    },
    {
      "type": "CNAME",
      "name": "www",
      "content": "username.github.io",
      "ttl": 3600,
      "proxied": false
    }
  ]
}
```

## 环境变量

GitHuh Actions 工作流程中使用的环境变量：

- `CLOUDFLARE_API_TOKEN`: Cloudflare API 令牌
- `GITHUB_TOKEN`: GitHub API 令牌

## 问题排查

请参考[管理员指南](./admin-guide.md)的故障排除部分。
