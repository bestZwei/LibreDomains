#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
域名统计模块

此模块提供了统计域名使用情况的功能。
"""

import json
import os
import sys
import datetime
from collections import Counter
from typing import Dict, List, Any, Optional, Tuple

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from scripts.validation.domain_validator import load_config
from scripts.utils.common import load_json_file


def load_domain_config(file_path: str) -> Optional[Dict[str, Any]]:
    """
    加载域名配置文件
    
    Args:
        file_path: 配置文件路径
    
    Returns:
        配置信息字典，如果加载失败则为 None
    """
    data, error = load_json_file(file_path)
    if error:
        print(f"警告: 无法加载配置文件 {file_path}: {error}", file=sys.stderr)
        return None
    return data


def get_domain_files(domain: str, domains_dir: str = None) -> List[str]:
    """
    获取域名目录下的所有 JSON 文件
    
    Args:
        domain: 域名
        domains_dir: 域名目录路径 (可选，默认为项目根目录下的 domains/)
    
    Returns:
        文件路径列表
    """
    if domains_dir is None:
        domains_dir = os.path.join(os.path.dirname(__file__), '../../domains')
    
    domain_dir = os.path.join(domains_dir, domain)
    
    if not os.path.isdir(domain_dir):
        return []
    
    return [os.path.join(domain_dir, f) for f in os.listdir(domain_dir) if f.endswith('.json') and f != 'example.json']


def collect_domain_stats(config: Dict[str, Any], domains_dir: str = None) -> Dict[str, Any]:
    """
    收集域名统计信息
    
    Args:
        config: 项目配置
        domains_dir: 域名目录路径 (可选)
    
    Returns:
        统计信息字典
    """
    if domains_dir is None:
        domains_dir = os.path.join(os.path.dirname(__file__), '../../domains')
    
    stats = {
        'total_domains': 0,
        'enabled_domains': 0,
        'total_subdomains': 0,
        'subdomains_by_domain': {},
        'users': {},
        'record_types': Counter(),
        'top_users': [],
        'recently_added': []
    }
    
    # 统计域名信息
    for domain_config in config.get('domains', []):
        domain = domain_config.get('name')
        enabled = domain_config.get('enabled', False)
        
        stats['total_domains'] += 1
        if enabled:
            stats['enabled_domains'] += 1
        
        # 获取域名目录下的所有文件
        domain_files = get_domain_files(domain, domains_dir)
        subdomain_count = len(domain_files)
        
        stats['total_subdomains'] += subdomain_count
        stats['subdomains_by_domain'][domain] = subdomain_count
        
        # 统计每个子域名的信息
        for file_path in domain_files:
            domain_config = load_domain_config(file_path)
            if domain_config is None:
                continue
                
            subdomain = os.path.basename(file_path)[:-5]  # 去除 .json 后缀
            
            # 获取文件修改时间
            try:
                mtime = os.path.getmtime(file_path)
                mtime_str = datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%d %H:%M:%S')
            except Exception:
                mtime = 0
                mtime_str = 'Unknown'
            
            # 统计用户信息
            owner = domain_config.get('owner', {})
            github_username = owner.get('github')
            
            if github_username:
                if github_username not in stats['users']:
                    stats['users'][github_username] = {
                        'name': owner.get('name', github_username),
                        'count': 0,
                        'domains': []
                    }
                
                stats['users'][github_username]['count'] += 1
                stats['users'][github_username]['domains'].append({
                    'domain': domain,
                    'subdomain': subdomain,
                    'added_time': mtime_str,
                    'timestamp': mtime
                })
            
            # 统计记录类型
            for record in domain_config.get('records', []):
                record_type = record.get('type')
                if record_type:
                    stats['record_types'][record_type] += 1
            
            # 记录最近添加的域名
            stats['recently_added'].append({
                'domain': domain,
                'subdomain': subdomain,
                'full_domain': f"{subdomain}.{domain}",
                'owner': owner.get('name', github_username or 'Unknown'),
                'github': github_username or 'Unknown',
                'added_time': mtime_str,
                'timestamp': mtime
            })
    
    # 处理统计结果
    
    # 用户域名数量排序
    top_users = []
    for username, user_info in stats['users'].items():
        top_users.append({
            'username': username,
            'name': user_info['name'],
            'count': user_info['count'],
            'domains': sorted(user_info['domains'], key=lambda x: x['timestamp'], reverse=True)
        })
    
    stats['top_users'] = sorted(top_users, key=lambda x: x['count'], reverse=True)
    
    # 最近添加的域名排序
    stats['recently_added'] = sorted(stats['recently_added'], key=lambda x: x['timestamp'], reverse=True)[:20]
    
    # 转换记录类型计数器为字典
    stats['record_types'] = dict(stats['record_types'])
    
    return stats


def generate_stats_report(stats: Dict[str, Any], config: Dict[str, Any]) -> str:
    """
    生成统计报告
    
    Args:
        stats: 统计信息
        config: 项目配置
    
    Returns:
        Markdown 格式的报告
    """
    report = []
    
    report.append("# LibreDomains 统计报告")
    report.append("")
    report.append(f"**生成时间**: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report.append("")
    
    # 概览
    report.append("## 概览")
    report.append("")
    report.append(f"- 总域名数: {stats['total_domains']}")
    report.append(f"- 已启用域名: {stats['enabled_domains']}")
    report.append(f"- 总子域名数: {stats['total_subdomains']}")
    report.append(f"- 用户数: {len(stats['users'])}")
    report.append("")
    
    # 域名分布
    report.append("## 域名分布")
    report.append("")
    report.append("| 域名 | 描述 | 子域名数量 | 状态 |")
    report.append("|------|------|------------|------|")
    
    for domain_config in config.get('domains', []):
        domain = domain_config.get('name')
        description = domain_config.get('description', '无')
        enabled = domain_config.get('enabled', False)
        count = stats['subdomains_by_domain'].get(domain, 0)
        status = "启用" if enabled else "禁用"
        
        report.append(f"| {domain} | {description} | {count} | {status} |")
    
    report.append("")
    
    # 记录类型统计
    report.append("## 记录类型统计")
    report.append("")
    report.append("| 记录类型 | 数量 |")
    report.append("|----------|------|")
    
    for record_type, count in sorted(stats['record_types'].items(), key=lambda x: x[1], reverse=True):
        report.append(f"| {record_type} | {count} |")
    
    report.append("")
    
    # 最活跃用户
    report.append("## 最活跃用户")
    report.append("")
    report.append("| 用户 | 域名数量 |")
    report.append("|------|----------|")
    
    for user in stats['top_users'][:10]:  # 只显示前 10 名
        report.append(f"| @{user['username']} | {user['count']} |")
    
    report.append("")
    
    # 最近添加的域名
    report.append("## 最近添加的域名")
    report.append("")
    report.append("| 域名 | 所有者 | 添加时间 |")
    report.append("|------|--------|----------|")
    
    for domain in stats['recently_added'][:10]:  # 只显示前 10 个
        report.append(f"| {domain['full_domain']} | @{domain['github']} | {domain['added_time']} |")
    
    report.append("")
    
    return "\n".join(report)


def main():
    """命令行入口点"""
    import argparse
    
    parser = argparse.ArgumentParser(description='域名统计工具')
    parser.add_argument('--config', help='配置文件路径')
    parser.add_argument('--output', help='输出文件路径')
    parser.add_argument('--json', help='JSON 输出文件路径')
    
    args = parser.parse_args()
    
    # 加载项目配置
    config = load_config(args.config)
    
    # 收集统计信息
    stats = collect_domain_stats(config)
    
    # 生成报告
    report = generate_stats_report(stats, config)
    
    # 输出报告
    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"报告已保存至: {args.output}")
    else:
        print(report)
    
    # 保存 JSON 数据
    if args.json:
        with open(args.json, 'w', encoding='utf-8') as f:
            json.dump(stats, f, ensure_ascii=False, indent=2)
        print(f"JSON 数据已保存至: {args.json}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
