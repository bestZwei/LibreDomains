#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
管理员工具

此模块提供了管理员管理域名配置的功能。
"""

import json
import os
import sys
import argparse
from typing import Dict, List, Any, Optional

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from scripts.validation.domain_validator import load_config
from scripts.utils.common import load_json_file


class AdminTool:
    """管理员工具类"""
    
    def __init__(self, config_path: str = None):
        """
        初始化管理员工具
        
        Args:
            config_path: 配置文件路径 (可选)
        """
        self.config_path = config_path or os.path.join(os.path.dirname(__file__), '../../config/domains.json')
        self.config = load_config(self.config_path)
        self.domains_dir = os.path.join(os.path.dirname(__file__), '../../domains')
    
    def save_config(self):
        """保存配置文件"""
        with open(self.config_path, 'w', encoding='utf-8') as f:
            json.dump(self.config, f, ensure_ascii=False, indent=2)
    
    def list_domains(self) -> List[Dict[str, Any]]:
        """
        列出所有域名
        
        Returns:
            域名列表
        """
        return self.config.get('domains', [])
    
    def get_domain_config(self, domain: str) -> Optional[Dict[str, Any]]:
        """
        获取域名配置
        
        Args:
            domain: 域名
        
        Returns:
            域名配置，如果不存在则为 None
        """
        for domain_config in self.config.get('domains', []):
            if domain_config.get('name') == domain:
                return domain_config
        return None
    
    def add_domain(self, name: str, zone_id: str, description: str = "", enabled: bool = False) -> bool:
        """
        添加域名
        
        Args:
            name: 域名名称
            zone_id: Cloudflare Zone ID
            description: 域名描述
            enabled: 是否启用
        
        Returns:
            是否成功添加
        """
        # 检查域名是否已存在
        if self.get_domain_config(name):
            return False
        
        # 添加域名配置
        self.config.setdefault('domains', []).append({
            'name': name,
            'enabled': enabled,
            'description': description,
            'cloudflare_zone_id': zone_id
        })
        
        # 创建域名目录
        domain_dir = os.path.join(self.domains_dir, name)
        os.makedirs(domain_dir, exist_ok=True)
        
        # 保存配置
        self.save_config()
        
        return True
    
    def update_domain(self, name: str, zone_id: str = None, description: str = None, enabled: bool = None) -> bool:
        """
        更新域名配置
        
        Args:
            name: 域名名称
            zone_id: Cloudflare Zone ID (可选)
            description: 域名描述 (可选)
            enabled: 是否启用 (可选)
        
        Returns:
            是否成功更新
        """
        # 获取域名配置
        domain_config = self.get_domain_config(name)
        if not domain_config:
            return False
        
        # 更新配置
        if zone_id is not None:
            domain_config['cloudflare_zone_id'] = zone_id
        if description is not None:
            domain_config['description'] = description
        if enabled is not None:
            domain_config['enabled'] = enabled
        
        # 保存配置
        self.save_config()
        
        return True
    
    def remove_domain(self, name: str, force: bool = False) -> bool:
        """
        移除域名
        
        Args:
            name: 域名名称
            force: 是否强制移除 (包括所有子域名配置)
        
        Returns:
            是否成功移除
        """
        # 获取域名配置
        domain_config = self.get_domain_config(name)
        if not domain_config:
            return False
        
        # 检查域名目录是否存在
        domain_dir = os.path.join(self.domains_dir, name)
        if os.path.isdir(domain_dir):
            # 检查是否有子域名配置
            subdomains = [f for f in os.listdir(domain_dir) if f.endswith('.json') and f != 'example.json']
            if subdomains and not force:
                return False
        
        # 从配置中移除域名
        self.config['domains'] = [d for d in self.config.get('domains', []) if d.get('name') != name]
        
        # 保存配置
        self.save_config()
        
        return True
    
    def list_subdomains(self, domain: str, include_reserved: bool = False) -> List[str]:
        """
        列出域名下的所有子域名
        
        Args:
            domain: 域名
            include_reserved: 是否包含保留/示例文件
        
        Returns:
            子域名列表
        """
        domain_dir = os.path.join(self.domains_dir, domain)
        if not os.path.isdir(domain_dir):
            return []
        
        if include_reserved:
            return [f[:-5] for f in os.listdir(domain_dir) if f.endswith('.json')]
        else:
            # 排除示例文件和保留文件
            excluded_files = ['example.json', 'template.json', '.example.json']
            return [f[:-5] for f in os.listdir(domain_dir) 
                    if f.endswith('.json') and f not in excluded_files]
    
    def get_subdomain_config(self, domain: str, subdomain: str) -> Optional[Dict[str, Any]]:
        """
        获取子域名配置
        
        Args:
            domain: 域名
            subdomain: 子域名
        
        Returns:
            子域名配置，如果不存在则为 None
        """
        file_path = os.path.join(self.domains_dir, domain, f"{subdomain}.json")
        if not os.path.isfile(file_path):
            return None
        
        data, error = load_json_file(file_path)
        if error:
            print(f"警告: 无法加载配置文件 {file_path}: {error}", file=sys.stderr)
            return None
        return data
    
    def remove_subdomain(self, domain: str, subdomain: str) -> bool:
        """
        移除子域名
        
        Args:
            domain: 域名
            subdomain: 子域名
        
        Returns:
            是否成功移除
        """
        file_path = os.path.join(self.domains_dir, domain, f"{subdomain}.json")
        if not os.path.isfile(file_path):
            return False
        
        try:
            os.remove(file_path)
            return True
        except Exception:
            return False


def list_domains(args):
    """列出所有域名"""
    admin = AdminTool(args.config)
    domains = admin.list_domains()
    
    print(f"找到 {len(domains)} 个域名:")
    for i, domain in enumerate(domains, 1):
        status = "启用" if domain.get('enabled') else "禁用"
        print(f"{i}. {domain.get('name')} [{status}] - {domain.get('description', '无描述')}")
        print(f"   Zone ID: {domain.get('cloudflare_zone_id')}")
    
    return 0


def add_domain(args):
    """添加域名"""
    admin = AdminTool(args.config)
    
    success = admin.add_domain(
        name=args.name,
        zone_id=args.zone_id,
        description=args.description,
        enabled=args.enabled
    )
    
    if success:
        print(f"域名 '{args.name}' 添加成功")
        return 0
    else:
        print(f"域名 '{args.name}' 添加失败，可能已存在")
        return 1


def update_domain(args):
    """更新域名配置"""
    admin = AdminTool(args.config)
    
    # 修复：正确映射参数名称
    success = admin.update_domain(
        name=args.name,
        zone_id=getattr(args, 'zone_id', None),  # 修复：使用正确的属性名
        description=args.description,
        enabled=args.enabled
    )
    
    if success:
        print(f"域名 '{args.name}' 更新成功")
        return 0
    else:
        print(f"域名 '{args.name}' 更新失败，可能不存在")
        return 1


def remove_domain(args):
    """移除域名"""
    admin = AdminTool(args.config)
    
    success = admin.remove_domain(
        name=args.name,
        force=args.force
    )
    
    if success:
        print(f"域名 '{args.name}' 移除成功")
        return 0
    else:
        print(f"域名 '{args.name}' 移除失败，可能不存在或存在子域名配置")
        print("使用 --force 参数强制移除")
        return 1


def list_subdomains(args):
    """列出域名下的所有子域名"""
    admin = AdminTool(args.config)
    
    # 检查域名是否存在
    domain_config = admin.get_domain_config(args.domain)
    if not domain_config:
        print(f"域名 '{args.domain}' 不存在")
        return 1
    
    subdomains = admin.list_subdomains(args.domain)
    
    print(f"域名 '{args.domain}' 下有 {len(subdomains)} 个子域名:")
    for i, subdomain in enumerate(sorted(subdomains), 1):
        config = admin.get_subdomain_config(args.domain, subdomain)
        description = config.get('description', '无描述') if config else '无描述'
        owner = config.get('owner', {}).get('name', '未知') if config else '未知'
        github = config.get('owner', {}).get('github', '未知') if config else '未知'
        records = len(config.get('records', [])) if config else 0
        
        print(f"{i}. {subdomain}.{args.domain}")
        print(f"   描述: {description}")
        print(f"   所有者: {owner} (@{github})")
        print(f"   记录数: {records}")
    
    return 0


def remove_subdomain(args):
    """移除子域名"""
    admin = AdminTool(args.config)
    
    # 检查域名是否存在
    domain_config = admin.get_domain_config(args.domain)
    if not domain_config:
        print(f"域名 '{args.domain}' 不存在")
        return 1
    
    success = admin.remove_subdomain(args.domain, args.subdomain)
    
    if success:
        print(f"子域名 '{args.subdomain}.{args.domain}' 移除成功")
        return 0
    else:
        print(f"子域名 '{args.subdomain}.{args.domain}' 移除失败，可能不存在")
        return 1


def main():
    """命令行入口点"""
    parser = argparse.ArgumentParser(description='LibreDomains 管理员工具')
    parser.add_argument('--config', help='配置文件路径')
    
    subparsers = parser.add_subparsers(dest='command', help='子命令')
    
    # 列出所有域名
    list_parser = subparsers.add_parser('list', help='列出所有域名')
    list_parser.set_defaults(func=list_domains)
    
    # 添加域名
    add_parser = subparsers.add_parser('add', help='添加域名')
    add_parser.add_argument('name', help='域名名称')
    add_parser.add_argument('zone_id', help='Cloudflare Zone ID')
    add_parser.add_argument('--description', default='', help='域名描述')
    add_parser.add_argument('--enabled', action='store_true', help='启用域名')
    add_parser.set_defaults(func=add_domain)
    
    # 更新域名配置
    update_parser = subparsers.add_parser('update', help='更新域名配置')
    update_parser.add_argument('name', help='域名名称')
    update_parser.add_argument('--zone-id', help='Cloudflare Zone ID')
    update_parser.add_argument('--description', help='域名描述')
    update_parser.add_argument('--enabled', dest='enabled', action='store_true', help='启用域名')
    update_parser.add_argument('--disabled', dest='enabled', action='store_false', help='禁用域名')
    update_parser.set_defaults(func=update_domain)
    
    # 移除域名
    remove_parser = subparsers.add_parser('remove', help='移除域名')
    remove_parser.add_argument('name', help='域名名称')
    remove_parser.add_argument('--force', action='store_true', help='强制移除 (包括所有子域名配置)')
    remove_parser.set_defaults(func=remove_domain)
    
    # 列出子域名
    list_subdomains_parser = subparsers.add_parser('list-subdomains', help='列出域名下的所有子域名')
    list_subdomains_parser.add_argument('domain', help='域名')
    list_subdomains_parser.set_defaults(func=list_subdomains)
    
    # 移除子域名
    remove_subdomain_parser = subparsers.add_parser('remove-subdomain', help='移除子域名')
    remove_subdomain_parser.add_argument('domain', help='域名')
    remove_subdomain_parser.add_argument('subdomain', help='子域名')
    remove_subdomain_parser.set_defaults(func=remove_subdomain)
    
    args = parser.parse_args()
    
    if hasattr(args, 'func'):
        return args.func(args)
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
