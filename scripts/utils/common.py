#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
工具函数模块

此模块提供了项目中常用的工具函数。
"""

import os
import re
import json
import socket
from typing import Dict, List, Any, Optional, Tuple


def load_json_file(file_path: str) -> Tuple[Optional[Dict[str, Any]], Optional[str]]:
    """
    加载 JSON 文件
    
    Args:
        file_path: 文件路径
    
    Returns:
        (内容, 错误信息)
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f), None
    except json.JSONDecodeError as e:
        # 提供更详细的JSON格式错误信息
        error_msg = f"JSON 格式错误: {str(e)}"
        if hasattr(e, 'lineno') and hasattr(e, 'colno'):
            error_msg += f"\n位置: 第 {e.lineno} 行, 第 {e.colno} 列"
        if hasattr(e, 'msg'):
            if "Expecting ',' delimiter" in e.msg:
                error_msg += "\n提示: 可能缺少逗号分隔符，请检查 JSON 对象中的字段是否用逗号正确分隔"
            elif "Expecting ':' delimiter" in e.msg:
                error_msg += "\n提示: 可能缺少冒号，请检查键值对格式是否正确"
            elif "Expecting value" in e.msg:
                error_msg += "\n提示: 可能有多余的逗号或缺少值"
            elif "Unterminated string" in e.msg:
                error_msg += "\n提示: 字符串未正确闭合，请检查引号是否匹配"
        return None, error_msg
    except FileNotFoundError:
        return None, f"文件不存在: {file_path}"
    except Exception as e:
        return None, f"读取文件错误: {str(e)}"


def save_json_file(file_path: str, data: Any) -> Optional[str]:
    """
    保存 JSON 文件
    
    Args:
        file_path: 文件路径
        data: 要保存的数据
    
    Returns:
        错误信息，如果没有错误则为 None
    """
    try:
        # 确保目录存在
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return None
    except Exception as e:
        return f"保存文件错误: {str(e)}"


def is_valid_domain_name(domain: str) -> bool:
    """
    检查域名是否合法
    
    Args:
        domain: 域名
    
    Returns:
        是否合法
    """
    if not domain:
        return False
    
    # 域名长度应在 1-253 字符之间
    if len(domain) > 253:
        return False
    
    # 域名由多个标签组成，每个标签由字母、数字和连字符组成，不能以连字符开头或结尾
    # 标签之间用点分隔，每个标签长度在 1-63 之间
    pattern = r'^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$'
    return bool(re.match(pattern, domain, re.IGNORECASE))


def is_valid_subdomain(subdomain: str, reserved_subdomains: List[str] = None) -> bool:
    """
    检查子域名是否合法
    
    Args:
        subdomain: 子域名
        reserved_subdomains: 保留子域名列表 (可选)
    
    Returns:
        是否合法
    """
    # @ 表示根域名
    if subdomain == '@':
        return True
    
    # 检查是否为保留子域名
    if reserved_subdomains:
        if subdomain.lower() in [r.lower() for r in reserved_subdomains]:
            return False
    
    # 修复：与 domain_validator.py 保持一致，并确保小写，最少3个字符
    if len(subdomain) < 3:
        return False
    pattern = r'^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])$'
    return bool(re.match(pattern, subdomain.lower()))


def is_valid_ip(ip: str) -> bool:
    """
    检查 IP 地址是否合法
    
    Args:
        ip: IP 地址
    
    Returns:
        是否合法
    """
    try:
        socket.inet_pton(socket.AF_INET, ip)
        return True
    except socket.error:
        try:
            socket.inet_pton(socket.AF_INET6, ip)
            return True
        except socket.error:
            return False


def is_valid_email(email: str) -> bool:
    """
    检查邮箱地址是否合法
    
    Args:
        email: 邮箱地址
    
    Returns:
        是否合法
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def is_valid_github_username(username: str) -> bool:
    """
    检查 GitHub 用户名是否合法
    
    Args:
        username: GitHub 用户名
    
    Returns:
        是否合法
    """
    pattern = r'^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$'
    return bool(re.match(pattern, username))


def get_subdomain_from_path(file_path: str) -> Tuple[str, str]:
    """
    从文件路径中提取域名和子域名
    
    Args:
        file_path: 文件路径
    
    Returns:
        (域名, 子域名)
    """
    # 预期路径格式: */domains/domain.com/subdomain.json
    parts = file_path.replace('\\', '/').split('/')
    domain_index = -1
    
    for i, part in enumerate(parts):
        if part == 'domains':
            domain_index = i
            break
    
    if domain_index == -1 or domain_index + 2 >= len(parts):
        return '', ''
    
    domain = parts[domain_index + 1]
    subdomain = os.path.splitext(parts[domain_index + 2])[0]
    
    return domain, subdomain
