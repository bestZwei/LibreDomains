document.addEventListener('DOMContentLoaded', function() {
    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced scroll animations with staggered effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    const cards = document.querySelectorAll('.feature-card, .domain-card, .rule-card, .doc-card, .step-content');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });

    // Enhanced copy code functionality
    const codeBlock = document.querySelector('.config-example pre code');
    if (codeBlock) {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '📋 复制代码';
        copyButton.className = 'copy-btn';
        copyButton.style.cssText = `
            position: absolute;
            top: 16px;
            right: 16px;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.8rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: var(--shadow);
        `;
        
        copyButton.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-lg)';
        });
        
        copyButton.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow)';
        });
        
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyButton.innerHTML = '✅ 已复制!';
                copyButton.style.background = 'var(--success-color)';
                setTimeout(() => {
                    copyButton.innerHTML = '📋 复制代码';
                    copyButton.style.background = 'var(--primary-color)';
                }, 2000);
            });
        });

        const preElement = codeBlock.parentElement;
        preElement.style.position = 'relative';
        preElement.appendChild(copyButton);
    }

    // Enhanced header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollTimer = null;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for backdrop effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // Clear existing timer
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        
        // Set timer to show header after scroll stops
        scrollTimer = setTimeout(() => {
            header.style.transform = 'translateY(0)';
        }, 150);
    });

    // Add transition to header
    header.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // Add floating animation to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach((icon, index) => {
        icon.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });

    // Enhanced mobile menu with animations
    function initMobileMenu() {
        const nav = document.querySelector('.nav');
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        toggleButton.style.display = 'none';
        
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex !important;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 30px;
                    height: 30px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                }
                
                .mobile-menu-toggle span {
                    width: 100%;
                    height: 3px;
                    background: var(--text-color);
                    border-radius: 2px;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu-toggle.active span:nth-child(1) {
                    transform: rotate(45deg) translate(7px, 7px);
                }
                
                .mobile-menu-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
                
                .nav {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    box-shadow: var(--shadow-lg);
                    flex-direction: column;
                    padding: 2rem;
                    gap: 1rem;
                    border-top: 1px solid var(--border-light);
                    animation: slideDown 0.3s ease-out;
                }
                
                .nav.active {
                    display: flex;
                }
                
                .nav a {
                    padding: 1rem;
                    margin: 0;
                    border-radius: var(--border-radius-sm);
                    text-align: center;
                    background: var(--bg-light);
                    border: 1px solid var(--border-light);
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }
        `;
        document.head.appendChild(style);
        
        toggleButton.addEventListener('click', function() {
            nav.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target)) {
                nav.classList.remove('active');
                toggleButton.classList.remove('active');
            }
        });
        
        header.querySelector('.container').appendChild(toggleButton);
    }

    initMobileMenu();

    // Add typing animation to hero title
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid rgba(255,255,255,0.8)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing after page load
        setTimeout(typeWriter, 1000);
    }

    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        button.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Add progress indicator for long content
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: var(--bg-gradient);
        z-index: 1001;
        transition: width 0.3s ease;
        border-radius: 0 3px 3px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // 子域名检测功能
    initSubdomainChecker();
});

// 全局域名配置（移到函数外部，避免变量初始化问题）
const domainConfig = {
    'ciao.su': { enabled: true, path: 'ciao.su' },
    'ciallo.de': { enabled: false, path: 'ciallo.de' }
};

// 显示全部DNS记录（全局函数）
function showAllRecords(event) {
    event.preventDefault();
    const recordsList = document.getElementById('recordsList');
    const allRecordsData = recordsList.getAttribute('data-all-records');
    
    if (!allRecordsData) return;
    
    try {
        const allRecords = JSON.parse(allRecordsData);
        const recordsHtml = allRecords.map(record => `
            <div class="dns-record">
                <div class="record-type ${record.type}">${record.type}</div>
                <div class="record-name">${record.name || '@'}</div>
                <div class="record-content">${record.content}</div>
                <div class="record-ttl">${record.ttl || 3600}s</div>
            </div>
        `).join('');
        
        recordsList.innerHTML = recordsHtml + `
            <div class="collapse-records-info">
                <button class="collapse-records-btn" onclick="collapseRecords(event)">
                    收起记录列表
                </button>
            </div>
        `;
    } catch (error) {
        console.error('解析DNS记录数据失败:', error);
    }
}

// 收起DNS记录列表（全局函数）
function collapseRecords(event) {
    event.preventDefault();
    const recordsList = document.getElementById('recordsList');
    const allRecordsData = recordsList.getAttribute('data-all-records');
    
    if (!allRecordsData) return;
    
    try {
        const allRecords = JSON.parse(allRecordsData);
        const maxDisplayRecords = 5;
        const totalRecords = allRecords.length;
        const displayRecords = allRecords.slice(0, maxDisplayRecords);
        
        let recordsHtml = displayRecords.map(record => `
            <div class="dns-record">
                <div class="record-type ${record.type}">${record.type}</div>
                <div class="record-name">${record.name || '@'}</div>
                <div class="record-content">${record.content}</div>
                <div class="record-ttl">${record.ttl || 3600}s</div>
            </div>
        `).join('');
        
        if (totalRecords > maxDisplayRecords) {
            recordsHtml += `
                <div class="more-records-info">
                    <span class="more-records-text">
                        还有 ${totalRecords - maxDisplayRecords} 条记录未显示
                    </span>
                    <button class="show-all-records-btn" onclick="showAllRecords(event)">
                        显示全部 ${totalRecords} 条记录
                    </button>
                </div>
            `;
        }
        
        recordsList.innerHTML = recordsHtml;
    } catch (error) {
        console.error('恢复DNS记录显示失败:', error);
    }
}

// 子域名检测功能
function initSubdomainChecker() {
    const subdomainInput = document.getElementById('subdomainInput');
    const checkButton = document.getElementById('checkButton');
    const checkerResult = document.getElementById('checkerResult');
    const totalDomainsSpan = document.getElementById('totalDomains');
    const recentDomainsList = document.getElementById('recentDomainsList');
    const domainSelect = document.getElementById('domainSelect');
    const domainSuffix = document.getElementById('domainSuffix');
    
    let registeredDomains = new Map(); // 改为 Map，按域名分组存储
    let reservedSubdomains = new Set([
        '@', 'www', 'mail', 'email', 'webmail', 'ns', 'dns',
        'api', 'cdn', 'ftp', 'sftp', 'admin', 'panel', 
        'dashboard', 'control', 'dev', 'test', 'staging', 
        'demo', 'blog', 'forum', 'wiki', 'docs', 'tv',
        'app', 'mobile', 'static', 'assets'
    ]);

    // 检查是否支持必要的 API
    if (!window.fetch) {
        console.warn('Fetch API not supported, subdomain checker will be limited');
        recentDomainsList.innerHTML = `
            <div class="error-message">
                您的浏览器不支持此功能，请使用现代浏览器
            </div>
        `;
        return;
    }

    // 域名选择器事件
    domainSelect.addEventListener('change', function() {
        const selectedDomain = this.value;
        const isEnabled = domainConfig[selectedDomain]?.enabled;
        
        // 更新后缀显示
        domainSuffix.textContent = '.' + selectedDomain;
        
        // 更新样式
        if (isEnabled) {
            domainSuffix.classList.remove('paused');
            checkButton.disabled = false;
        } else {
            domainSuffix.classList.add('paused');
            checkButton.disabled = true;
        }
        
        // 清除之前的结果
        checkerResult.classList.remove('show');
        
        // 重新加载该域名的数据
        loadRegisteredDomains(selectedDomain);
    });

    // 加载已注册的域名数据
    loadRegisteredDomains();

    // 输入验证
    subdomainInput.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        const isValid = validateSubdomain(value);
        const inputGroup = this.parentElement;
        const validationHint = inputGroup.nextElementSibling;
        const selectedDomain = domainSelect.value;
        const isDomainEnabled = domainConfig[selectedDomain]?.enabled;

        if (value === '') {
            inputGroup.classList.remove('invalid');
            if (validationHint && validationHint.classList.contains('validation-hint')) {
                validationHint.remove();
            }
            checkButton.disabled = !isDomainEnabled;
            return;
        }

        if (isValid && isDomainEnabled) {
            inputGroup.classList.remove('invalid');
            if (validationHint && validationHint.classList.contains('validation-hint')) {
                validationHint.remove();
            }
            checkButton.disabled = false;
        } else {
            inputGroup.classList.add('invalid');
            if (!validationHint || !validationHint.classList.contains('validation-hint')) {
                const hint = document.createElement('div');
                hint.className = 'validation-hint error';
                hint.textContent = !isDomainEnabled ? '所选域名暂停开放申请' : getValidationMessage(value);
                inputGroup.parentElement.insertBefore(hint, inputGroup.nextSibling);
            }
            checkButton.disabled = true;
        }
    });

    // 回车键检测
    subdomainInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !checkButton.disabled) {
            e.preventDefault();
            checkSubdomain();
        }
    });

    // 检测按钮点击
    checkButton.addEventListener('click', checkSubdomain);

    // 验证子域名格式
    function validateSubdomain(subdomain) {
        if (!subdomain) return false;
        if (subdomain.length < 3 || subdomain.length > 63) return false;
        if (subdomain.startsWith('-') || subdomain.endsWith('-')) return false;
        if (!/^[a-z0-9-]+$/.test(subdomain)) return false;
        return true;
    }

    // 获取验证错误信息
    function getValidationMessage(subdomain) {
        if (subdomain.length < 3) return '子域名长度至少3个字符';
        if (subdomain.length > 63) return '子域名长度不能超过63个字符';
        if (subdomain.startsWith('-') || subdomain.endsWith('-')) return '子域名不能以连字符开头或结尾';
        if (!/^[a-z0-9-]+$/.test(subdomain)) return '只能包含小写字母、数字和连字符';
        return '无效的子域名格式';
    }    // 检测子域名可用性
    async function checkSubdomain() {
        const subdomain = subdomainInput.value.toLowerCase().trim();
        const selectedDomain = domainSelect.value;
        
        if (!validateSubdomain(subdomain)) return;
        
        // 检查域名是否开放
        if (!domainConfig[selectedDomain]?.enabled) {
            showResult('domain-paused', '域名暂停开放', `${selectedDomain} 域名暂时不开放申请`);
            return;
        }

        // 显示加载状态
        checkButton.disabled = true;
        checkButton.classList.add('loading');
        checkButton.textContent = '';
        
        try {
            // 检查是否为保留域名
            if (reservedSubdomains.has(subdomain)) {
                showResult('unavailable', '域名不可用', `"${subdomain}" 是系统保留域名，无法申请`);
                return;
            }

            // 检查是否已被注册
            const domainSet = registeredDomains.get(selectedDomain) || new Set();
            if (domainSet.has(subdomain)) {
                // 获取域名详细信息
                const domainData = await getDomainDetails(subdomain, selectedDomain);
                showResult('unavailable', '域名不可用', `"${subdomain}.${selectedDomain}" 已被其他用户注册`, domainData);
                return;
            }

            // 域名可用
            showResult('available', '域名可用！', `"${subdomain}.${selectedDomain}" 可以申请`);

        } catch (error) {
            console.error('检测失败:', error);
            showResult('error', '检测失败', '检测过程中出现错误，但域名可能仍然可用');
        } finally {
            // 恢复按钮状态
            setTimeout(() => {
                const isDomainEnabled = domainConfig[domainSelect.value]?.enabled;
                checkButton.disabled = !isDomainEnabled || !subdomainInput.value.trim();
                checkButton.classList.remove('loading');
                checkButton.textContent = '检测';
            }, 500);
        }
    }    // 获取域名详细信息
    async function getDomainDetails(subdomain, domain) {
        try {
            const domainPath = domainConfig[domain]?.path || domain;
            const apiUrl = `https://api.github.com/repos/bestzwei/LibreDomains/contents/domains/${domainPath}/${subdomain}.json`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'LibreDomains-Checker/1.0'
                },
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                console.warn(`GitHub API failed for ${subdomain}.${domain}: ${response.status}`);
                return null;
            }              const fileData = await response.json();
            // 使用现代方法正确解码 UTF-8 编码的 Base64 内容，避免中文乱码
            let content;
            try {
                // 方法1：使用 TextDecoder (推荐，现代浏览器支持)
                const binaryString = atob(fileData.content);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                content = new TextDecoder('utf-8').decode(bytes);
            } catch (error) {
                // 方法2：回退到传统方法
                try {
                    content = decodeURIComponent(escape(atob(fileData.content)));
                } catch (fallbackError) {
                    // 方法3：最后回退，直接解码（可能有中文问题）
                    content = atob(fileData.content);
                }
            }
            const domainData = JSON.parse(content);
            
            // 获取文件的创建和修改时间
            try {
                const commitUrl = `https://api.github.com/repos/bestzwei/LibreDomains/commits?path=domains/${domainPath}/${subdomain}.json&per_page=100`;
                const commitResponse = await fetch(commitUrl, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'LibreDomains-Checker/1.0'
                    }
                });
                
                if (commitResponse.ok) {
                    const commits = await commitResponse.json();
                    if (commits.length > 0) {
                        // 最新提交（最后修改时间）
                        domainData.lastModified = commits[0].commit.author.date;
                        
                        // 最早提交（注册时间）
                        domainData.registrationDate = commits[commits.length - 1].commit.author.date;
                        
                        // 获取创建者信息（第一次提交的作者）
                        const firstCommit = commits[commits.length - 1];
                        domainData.creator = {
                            name: firstCommit.commit.author.name,
                            date: firstCommit.commit.author.date
                        };
                        
                        // 如果有提交者的GitHub信息
                        if (firstCommit.author) {
                            domainData.creator.github = firstCommit.author.login;
                        }
                    }
                }
            } catch (commitError) {
                console.warn('获取提交历史失败:', commitError);
                // 使用文件的最后修改时间作为备选
                domainData.lastModified = fileData.sha ? new Date().toISOString() : null;
            }
            
            // 验证和清理数据
            if (domainData.owner) {
                // 确保owner字段格式正确
                if (typeof domainData.owner === 'string') {
                    // 如果owner是字符串，转换为对象
                    domainData.owner = { name: domainData.owner };
                }
                
                // 清理GitHub用户名（移除@符号）
                if (domainData.owner.github && domainData.owner.github.startsWith('@')) {
                    domainData.owner.github = domainData.owner.github.substring(1);
                }
            }
            
            // 添加一些统计信息
            if (domainData.records && Array.isArray(domainData.records)) {
                domainData.recordCount = domainData.records.length;
                domainData.recordTypes = [...new Set(domainData.records.map(r => r.type))];
            }
            
            return domainData;
            
        } catch (error) {
            console.error('获取域名详细信息失败:', error);
            return null;
        }
    }// 显示检测结果
    function showResult(type, title, message, domainData = null) {
        const resultIcon = checkerResult.querySelector('.result-icon');
        const resultTitle = checkerResult.querySelector('.result-title');
        const resultSubtitle = checkerResult.querySelector('.result-subtitle');
        const domainInfo = checkerResult.querySelector('#domainInfo');

        // 设置图标
        const icons = {
            available: '✅',
            unavailable: '❌',
            error: '⚠️',
            'domain-paused': '⏸️'
        };
        resultIcon.textContent = icons[type];

        // 设置标题和副标题
        resultTitle.textContent = title;
        resultSubtitle.textContent = message;

        // 设置域名信息
        updateDomainInfo(type, domainData);

        // 设置样式类
        checkerResult.className = `checker-result show ${type}`;

        // 滚动到结果位置
        setTimeout(() => {
            checkerResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }    // 更新域名信息显示
    function updateDomainInfo(type, domainData) {
        const domainName = document.getElementById('domainName');
        const domainStatus = document.getElementById('domainStatus');
        const registrationDate = document.getElementById('registrationDate');
        const domainOwner = document.getElementById('domainOwner');
        const domainInfo = document.getElementById('domainInfo');

        const subdomain = subdomainInput.value.toLowerCase().trim();
        const selectedDomain = domainSelect.value;
        const fullDomain = `${subdomain}.${selectedDomain}`;

        // 构建 markdown 风格表格
        let tableRows = `
            <tr>
                <td>域名</td>
                <td>
                    <span class="domain-text">${fullDomain}</span>
                    <button class="copy-domain-btn" onclick="copyToClipboard('${fullDomain}')" title="复制域名">复制</button>
                </td>
            </tr>
        `;

        if (type === 'available') {
            tableRows += `
                <tr>
                    <td>状态</td>
                    <td>可申请</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>未注册</td>
                </tr>
                <tr>
                    <td>所有者</td>
                    <td>无</td>
                </tr>
            `;
            domainInfo.innerHTML = `
                <h5>域名详情</h5>
                <table class="md-table">${tableRows}</table>
            `;
            hideExtendedInfo();
        } else if (type === 'unavailable' && domainData) {
            // 所有者信息
            let ownerText = '未知';
            if (domainData.owner) {
                ownerText = domainData.owner.name || '未知';
                if (domainData.owner.github) {
                    ownerText += ` (<a href="https://github.com/${escapeHtml(domainData.owner.github)}" target="_blank" class="github-link">${escapeHtml(domainData.owner.github)}</a>)`;
                }
                if (domainData.owner.email) {
                    const email = escapeHtml(domainData.owner.email);
                    ownerText += `<br><span class="email-masked" title="点击显示完整邮箱" onclick="toggleEmailMask(this, '${email}')">${maskEmail(email)}</span>`;
                }
            }
            tableRows += `
                <tr>
                    <td>状态</td>
                    <td>已注册</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>${formatDate(domainData.registrationDate || '未知')}</td>
                </tr>
                <tr>
                    <td>所有者</td>
                    <td>${ownerText}</td>
                </tr>
            `;
            // 扩展信息（如描述、记录数等）
            let extraRows = '';
            if (domainData.description) {
                extraRows += `<tr><td>用途描述</td><td>${escapeHtml(domainData.description)}</td></tr>`;
            }
            if (domainData.records && domainData.records.length > 0) {
                const recordTypes = [...new Set(domainData.records.map(r => r.type))];
                extraRows += `<tr><td>DNS记录</td><td>${domainData.records.length} 条 (${recordTypes.join(', ')})</td></tr>`;
            }
            if (domainData.lastModified) {
                extraRows += `<tr><td>最后更新</td><td>${formatDate(domainData.lastModified)}</td></tr>`;
            }
            // 配置文件链接
            const configUrl = `https://github.com/bestzwei/LibreDomains/blob/main/domains/${selectedDomain}/${subdomain}.json`;
            extraRows += `<tr><td>配置文件</td><td><a href="${configUrl}" target="_blank" class="github-link">查看完整配置</a></td></tr>`;

            domainInfo.innerHTML = `
                <h5>域名详情</h5>
                <table class="md-table">
                    ${tableRows}
                    ${extraRows}
                </table>
            `;
            hideExtendedInfo();
        } else if (type === 'domain-paused') {
            tableRows += `
                <tr>
                    <td>状态</td>
                    <td>暂停开放</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>不适用</td>
                </tr>
                <tr>
                    <td>所有者</td>
                    <td>不适用</td>
                </tr>
            `;
            domainInfo.innerHTML = `
                <h5>域名详情</h5>
                <table class="md-table">${tableRows}</table>
            `;
            hideExtendedInfo();
        } else {
            tableRows += `
                <tr>
                    <td>状态</td>
                    <td>检测失败</td>
                </tr>
                <tr>
                    <td>注册时间</td>
                    <td>未知</td>
                </tr>
                <tr>
                    <td>所有者</td>
                    <td>未知</td>
                </tr>
            `;
            domainInfo.innerHTML = `
                <h5>域名详情</h5>
                <table class="md-table">${tableRows}</table>
            `;
            hideExtendedInfo();
        }
    }    // 显示扩展域名信息
    function showExtendedInfo(domainData) {
        const domainInfo = document.getElementById('domainInfo');
        let existingExtended = domainInfo.querySelector('.extended-items');
        
        if (existingExtended) {
            existingExtended.remove();
        }

        if (!domainData) return;

        const extendedDiv = document.createElement('div');
        extendedDiv.className = 'extended-items animate-fade-in';
        
        let extendedHtml = '<div class="info-grid extended-grid">';
        
        // 描述信息
        if (domainData.description) {
            extendedHtml += `
                <div class="extended-item">
                    <span class="extended-label">用途描述</span>
                    <span class="extended-value">${escapeHtml(domainData.description)}</span>
                </div>
            `;
        }
        
        // 所有者详细信息
        if (domainData.owner) {
            const owner = domainData.owner;
            
            if (owner.github) {
                extendedHtml += `
                    <div class="extended-item">
                        <span class="extended-label">GitHub 用户</span>
                        <span class="extended-value">
                            <a href="https://github.com/${escapeHtml(owner.github)}" 
                               target="_blank" 
                               class="github-link">
                                @${escapeHtml(owner.github)}
                            </a>
                        </span>
                    </div>
                `;
            }
            
            if (owner.email) {
                const email = escapeHtml(owner.email);
                extendedHtml += `
                    <div class="extended-item">
                        <span class="extended-label">联系邮箱</span>
                        <span class="extended-value">
                            <span class="email-masked" title="点击显示完整邮箱" onclick="toggleEmailMask(this, '${email}')">
                                ${maskEmail(email)}
                            </span>
                        </span>
                    </div>
                `;
            }
        }
        
        // 创建者信息（如果与所有者不同）
        if (domainData.creator && domainData.creator.github && 
            domainData.creator.github !== domainData.owner?.github) {
            extendedHtml += `
                <div class="extended-item">
                    <span class="extended-label">域名创建者</span>
                    <span class="extended-value">
                        <a href="https://github.com/${escapeHtml(domainData.creator.github)}" 
                           target="_blank" 
                           class="github-link">
                            @${escapeHtml(domainData.creator.github)}
                        </a>
                    </span>
                </div>
            `;
        }
        
        // DNS记录详细信息（整合到这里）
        if (domainData.records && domainData.records.length > 0) {
            const recordTypes = [...new Set(domainData.records.map(r => r.type))];
            const typeColors = {
                'A': '#4CAF50',
                'AAAA': '#2196F3', 
                'CNAME': '#FF9800',
                'TXT': '#9C27B0',
                'MX': '#F44336'
            };
            
            const typeTagsHtml = recordTypes.map(type => 
                `<span class="record-type-tag" style="background-color: ${typeColors[type] || '#666'};">${type}</span>`
            ).join(' ');
            
            extendedHtml += `
                <div class="extended-item">
                    <span class="extended-label">DNS 记录</span>
                    <span class="extended-value">
                        ${domainData.records.length} 条记录<br>
                        <div class="record-types">${typeTagsHtml}</div>
                    </span>
                </div>
            `;

            // 添加详细的DNS记录列表
            const maxDisplayRecords = 3; // 在扩展信息中显示3条
            const displayRecords = domainData.records.slice(0, maxDisplayRecords);
            const totalRecords = domainData.records.length;
            
            let recordsHtml = `
                <div class="extended-item dns-records-section">
                    <span class="extended-label">记录详情</span>
                    <div class="extended-value">
                        <div class="dns-records-compact">
            `;
            
            displayRecords.forEach(record => {
                recordsHtml += `
                    <div class="dns-record-compact">
                        <span class="record-type-mini ${record.type}">${record.type}</span>
                        <span class="record-info">
                            <strong>${record.name || '@'}</strong>
                            <span class="record-arrow">→</span>
                            <code>${record.content}</code>
                        </span>
                    </div>
                `;
            });
            
            if (totalRecords > maxDisplayRecords) {
                recordsHtml += `
                    <div class="more-records-compact">
                        <button class="show-all-records-compact" onclick="showAllRecordsInExtended(event)">
                            查看全部 ${totalRecords} 条记录
                        </button>
                    </div>
                `;
            }
            
            recordsHtml += `
                        </div>
                    </div>
                </div>
            `;
            
            extendedHtml += recordsHtml;
            
            // 存储完整记录数据
            extendedDiv.setAttribute('data-all-records', JSON.stringify(domainData.records));
        }
        
        // 最后更新时间
        if (domainData.lastModified) {
            const lastModified = new Date(domainData.lastModified);
            const now = new Date();
            const diffDays = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
            let timeAgo = '';
            
            if (diffDays === 0) {
                timeAgo = '今天';
            } else if (diffDays === 1) {
                timeAgo = '1天前';
            } else if (diffDays < 30) {
                timeAgo = `${diffDays}天前`;
            } else if (diffDays < 365) {
                timeAgo = `${Math.floor(diffDays / 30)}个月前`;
            } else {
                timeAgo = `${Math.floor(diffDays / 365)}年前`;
            }
            
            extendedHtml += `
                <div class="extended-item">
                    <span class="extended-label">最后更新</span>
                    <span class="extended-value">
                        ${formatDate(domainData.lastModified)}
                        <small style="display: block; color: var(--text-secondary);">(${timeAgo})</small>
                    </span>
                </div>
            `;
        }
        
        // 域名配置文件链接
        const selectedDomain = document.getElementById('domainSelect').value;
        const subdomain = document.getElementById('subdomainInput').value.toLowerCase().trim();
        const configUrl = `https://github.com/bestzwei/LibreDomains/blob/main/domains/${selectedDomain}/${subdomain}.json`;
        
        extendedHtml += `
            <div class="extended-item">
                <span class="extended-label">配置文件</span>
                <span class="extended-value">
                    <a href="${configUrl}" target="_blank" class="github-link">
                        查看完整配置
                    </a>
                </span>
            </div>
        `;
        
        extendedHtml += '</div>';
        extendedDiv.innerHTML = extendedHtml;
        
        // 将扩展信息添加到domainInfo中，而不是作为单独的区域
        const infoGrid = domainInfo.querySelector('.info-grid');
        if (infoGrid) {
            // 如果已有info-grid，则替换它
            infoGrid.parentNode.replaceChild(extendedDiv.firstChild, infoGrid);
        } else {
            // 如果没有info-grid，则直接添加到domainInfo
            domainInfo.appendChild(extendedDiv.firstChild);
        }
    }

    // 隐藏扩展信息
    function hideExtendedInfo() {
        const domainInfo = document.getElementById('domainInfo');
        const existingExtended = domainInfo.querySelector('.extended-info');
        if (existingExtended) {
            existingExtended.remove();
        }
    }    // 更新DNS记录显示（简化版，因为已整合到扩展信息中）
    // function updateDnsRecords(type, domainData) {
    //     const recordsList = document.getElementById('recordsList');
    //
    //     if (type === 'available' || type === 'domain-paused') {
    //         recordsList.innerHTML = '<p class="no-records">域名未注册，暂无DNS记录</p>';
    //         return;
    //     }
    //
    //     if (type === 'error') {
    //         recordsList.innerHTML = '<p class="no-records">无法获取DNS记录信息</p>';
    //         return;
    //     }
    //
    //     if (domainData && domainData.records && domainData.records.length > 0) {
    //         recordsList.innerHTML = `
    //             <p class="records-summary">
    //                 📋 共有 ${domainData.records.length} 条DNS记录，详细信息请查看上方详情
    //             </p>
    //         `;
    //     } else {
    //         recordsList.innerHTML = '<p class="no-records">暂无DNS记录信息</p>';
    //     }
    // }
    // 格式化日期
    function formatDate(dateString) {
        if (!dateString || dateString === '未知') return '未知';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    // 加载已注册的域名数据
    async function loadRegisteredDomains(specificDomain = null) {
        const domainsToLoad = specificDomain ? [specificDomain] : Object.keys(domainConfig);
        
        try {
            // 显示加载状态
            recentDomainsList.innerHTML = '<div class="loading">正在加载域名数据...</div>';
            
            // 更新hero统计加载状态
            const heroTotalDomainsSpan = document.getElementById('heroTotalDomains');
            if (heroTotalDomainsSpan) {
                heroTotalDomainsSpan.textContent = '加载中...';
            }
            
            for (const domain of domainsToLoad) {
                const domainPath = domainConfig[domain]?.path || domain;
                const apiUrl = `https://api.github.com/repos/bestzwei/LibreDomains/contents/domains/${domainPath}`;
                
                try {
                    const response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'User-Agent': 'LibreDomains-Checker/1.0'
                        },
                        cache: 'no-cache'
                    });
                    
                    if (!response.ok) {
                        console.warn(`GitHub API failed for ${domain} with status: ${response.status}`);
                        continue;
                    }
                    
                    const files = await response.json();
                    
                    if (!Array.isArray(files)) {
                        continue;
                    }
                    
                    const domainFiles = files.filter(file => 
                        file.name && 
                        file.name.endsWith('.json') && 
                        file.name !== 'example.json' &&
                        file.type === 'file'
                    );

                    // 存储到对应域名的 Set 中
                    const domainSet = new Set();
                    domainFiles.forEach(file => {
                        const domainName = file.name.replace('.json', '');
                        if (domainName && /^[a-z0-9-]+$/.test(domainName)) {
                            domainSet.add(domainName);
                        }
                    });
                    
                    registeredDomains.set(domain, domainSet);
                    
                } catch (domainError) {
                    console.error(`加载 ${domain} 域名数据失败:`, domainError);
                }
            }

            // 更新显示
            updateDisplay();

        } catch (error) {
            console.error('加载域名数据失败:', error);
            await loadDomainsFromBackup();
        }
    }

    // 更新显示
    function updateDisplay() {
        const selectedDomain = domainSelect.value;
        const currentDomainSet = registeredDomains.get(selectedDomain) || new Set();
        
        // 更新统计信息
        if (totalDomainsSpan) {
            totalDomainsSpan.textContent = currentDomainSet.size;
        }

        // 计算所有域名的总数（替代原来的重复统计）
        const activeDomainsSpan = document.getElementById('activeDomains');
        if (activeDomainsSpan) {
            let totalAllDomains = 0;
            registeredDomains.forEach((domainSet) => {
                totalAllDomains += domainSet.size;
            });
            activeDomainsSpan.textContent = totalAllDomains;
        }

        // 更新hero区域的统计
        const heroTotalDomainsSpan = document.getElementById('heroTotalDomains');
        if (heroTotalDomainsSpan) {
            // 计算所有域名的总数
            let totalAllDomains = 0;
            registeredDomains.forEach((domainSet) => {
                totalAllDomains += domainSet.size;
            });
            heroTotalDomainsSpan.textContent = totalAllDomains;
        }

        // 显示最近注册的域名
        const recentDomains = Array.from(currentDomainSet)
            .sort()
            .slice(0, 12)
            .map(name => ({
                name,
                url: '#',
                size: 0
            }));

        displayRecentDomains(recentDomains);
    }

    // 备用数据加载方案
    async function loadDomainsFromBackup() {
        try {
            const knownDomains = ['cc', 'example'];
            
            registeredDomains.clear();
            const ciaoSuSet = new Set();
            knownDomains.forEach(domain => {
                if (domain !== 'example') {
                    ciaoSuSet.add(domain);
                }
            });
            registeredDomains.set('ciao.su', ciaoSuSet);

            updateDisplay();

            if (recentDomainsList.children.length === 0) {
                recentDomainsList.innerHTML = `
                    <div class="error-message">
                        无法连接到 GitHub API，显示的是缓存数据。
                        <br>完整数据请访问 
                        <a href="https://github.com/bestzwei/LibreDomains/tree/main/domains" 
                           target="_blank" style="color: var(--primary-color);">GitHub 仓库</a>
                    </div>
                `;
            }

            // 设置备用统计数据
            const heroTotalDomainsSpan = document.getElementById('heroTotalDomains');
            if (heroTotalDomainsSpan) {
                heroTotalDomainsSpan.textContent = '2+';
            }

        } catch (backupError) {
            console.error('备用数据加载也失败:', backupError);
            if (recentDomainsList) {
                recentDomainsList.innerHTML = `
                    <div class="error-message">
                        数据加载失败，请检查网络连接或稍后重试
                        <br><a href="https://github.com/bestzwei/LibreDomains/tree/main/domains" 
                               target="_blank" style="color: var(--primary-color);">查看完整域名列表</a>
                    </div>
                `;
            }
            
            // 设置错误状态的统计数据
            const heroTotalDomainsSpan = document.getElementById('heroTotalDomains');
            if (heroTotalDomainsSpan) {
                heroTotalDomainsSpan.textContent = '?';
            }
            
            const activeDomainsSpan = document.getElementById('activeDomains');
            if (activeDomainsSpan) {
                activeDomainsSpan.textContent = '?';
            }
        }
    }

    // 显示最近注册的域名
    function displayRecentDomains(domains) {
        if (!recentDomainsList) return;

        if (domains.length === 0) {
            recentDomainsList.innerHTML = '<div class="loading">暂无注册域名</div>';
            return;
        }

        const domainsHtml = domains.map(domain => `
            <div class="domain-item" data-domain="${domain.name}">
                <span class="domain-name">${domain.name}</span>
                <div class="domain-status" title="已注册"></div>
            </div>
        `).join('');

        recentDomainsList.innerHTML = domainsHtml;

        // 添加点击效果
        const domainItems = recentDomainsList.querySelectorAll('.domain-item');
        domainItems.forEach(item => {
            item.addEventListener('click', function() {
                const domainName = this.getAttribute('data-domain') || 
                                  this.querySelector('.domain-name')?.textContent;
                
                if (domainName && subdomainInput) {
                    subdomainInput.value = domainName;
                    subdomainInput.focus();
                    
                    // 添加视觉反馈
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    // 自动触发检测
                    setTimeout(() => {
                        if (checkButton && !checkButton.disabled) {
                            checkSubdomain();
                        }
                    }, 200);
                }
            });
        });
    }    // 初始化时触发域名选择事件
    domainSelect.dispatchEvent(new Event('change'));

    // 减少自动刷新频率以避免API限制
    setInterval(() => loadRegisteredDomains(), 10 * 60 * 1000); // 10分钟
}

// 辅助函数：HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 辅助函数：邮箱遮罩
function maskEmail(email) {
    if (!email || !email.includes('@')) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return local.substring(0, 2) + '***' + local.substring(local.length - 1) + '@' + domain;
}

// 辅助函数：切换邮箱显示
function toggleEmailMask(element, fullEmail) {
    if (element.textContent.includes('***')) {
        element.textContent = fullEmail;
        element.title = '点击隐藏邮箱';
    } else {
        element.textContent = maskEmail(fullEmail);
        element.title = '点击显示完整邮箱';
    }
}

// 辅助函数：复制到剪贴板
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // 显示复制成功提示
        showToast('✅ 已复制到剪贴板: ' + text);
    }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✅ 已复制到剪贴板: ' + text);
    });
}

// 辅助函数：显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 禁用 Cloudflare RUM 相关错误
window.addEventListener('error', function(e) {
    // 忽略 Cloudflare RUM 相关错误
    if (e.message && e.message.includes('cdn-cgi/rum')) {
        e.preventDefault();
        return false;
    }
});

// 禁用 Cloudflare Web Analytics 如果不需要
if (typeof window.cloudflareAnalytics !== 'undefined') {
    window.cloudflareAnalytics = null;
}

// Add additional CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .feature-card:nth-child(odd) {
        animation-delay: 0.1s;
    }
    
    .feature-card:nth-child(even) {
        animation-delay: 0.2s;
    }
    
    /* 域名详情相关样式 */
    .domain-text {
        font-family: 'Courier New', monospace;
        font-weight: bold;
    }
    
    .copy-domain-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9em;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: var(--border-radius-sm);
        transition: all 0.2s ease;
        opacity: 0.7;
    }
    
    .copy-domain-btn:hover {
        opacity: 1;
        background: var(--bg-light);
        transform: scale(1.1);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
    }
    
    .extended-grid {
        display: grid;
        gap: 1rem;
    }
    
    /* 使extended-item样式与info-item一致 */
    .extended-item {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1.25rem;
        align-items: center;
        padding: 0.75rem;
        border-radius: var(--border-radius-sm);
        transition: all var(--animation-duration) var(--animation-easing);
    }
    
    .extended-item:hover {
        background: var(--bg-light);
        box-shadow: var(--shadow-sm);
        transform: translateX(2px);
    }
    
    /* 使extended-label样式与info-label一致 */
    .extended-label {
        font-weight: 600;
        color: var(--text-light);
        font-size: 0.925rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
    }
    
    /* 使用emoji图标来标识不同类型的信息 */
    .extended-item:nth-child(1) .extended-label::before {
        content: '📄';
        font-size: 1rem;
    }
    
    .extended-item:nth-child(2) .extended-label::before {
        content: '👤';
        font-size: 1rem;
    }
    
    .extended-item:nth-child(3) .extended-label::before {
        content: '✉️';
        font-size: 1rem;
    }
    
    .extended-item:nth-child(4) .extended-label::before {
        content: '🔧';
        font-size: 1rem;
    }
    
    /* 使extended-value样式与info-value一致 */
    .extended-value {
        color: var(--text-color);
        word-break: break-word;
        font-size: 0.925rem;
        line-height: 1.5;
        padding: 0.25rem 0;
    }
    
    .github-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 600;
        transition: all var(--animation-duration) var(--animation-easing);
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }
    
    .github-link:hover {
        color: var(--primary-light);
    }
    
    .github-link::before {
        content: '🔗';
        font-size: 0.9rem;
    }
    
    .email-masked {
        cursor: pointer;
        color: var(--primary-color);
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace;
        font-size: 0.9rem;
        padding: 0.35rem 0.75rem;
        background: var(--bg-light);
        border-radius: var(--border-radius-sm);
        transition: all var(--animation-duration) var(--animation-easing);
        display: inline-block;
    }
    
    .email-masked:hover {
        background: rgba(102, 126, 234, 0.1);
        transform: translateY(-1px);
    }
    
    .email-masked:hover {
        background: var(--primary-color);
        color: white;
    }
    
    /* 紧凑DNS记录样式 */
    .dns-records-section {
        grid-column: 1 / -1;
    }
    
    .dns-records-compact {
        margin-top: 0.5rem;
    }
    
    .dns-record-compact {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: var(--bg-white);
        border: 1px solid var(--border-light);
        border-radius: var(--border-radius-sm);
        margin-bottom: 0.5rem;
        transition: all var(--animation-duration) var(--animation-easing);
    }
    
    .dns-record-compact:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-sm);
    }
    
    .record-type-mini {
        font-size: 0.7rem;
        font-weight: 700;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        min-width: 45px;
        text-align: center;
        flex-shrink: 0;
    }
    
    .record-type-mini.A { background: #4299e1; }
    .record-type-mini.AAAA { background: #48bb78; }
    .record-type-mini.CNAME { background: #ed8936; }
    .record-type-mini.TXT { background: #9f7aea; }
    .record-type-mini.MX { background: #f56565; }
    
    .record-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Consolas', monospace;
        font-size: 0.85rem;
        min-width: 0;
    }
    
    .record-info strong {
        color: var(--primary-color);
        font-weight: 600;
        flex-shrink: 0;
    }
    
    .record-arrow {
        color: var(--text-muted);
        flex-shrink: 0;
    }
    
    .record-info code {
        background: none;
        padding: 0;
        color: var(--text-color);
        font-size: 0.8rem;
        word-break: break-all;
        flex: 1;
        min-width: 0;
    }
    
    .record-ttl {
        color: var(--text-muted);
        font-size: 0.75rem;
        margin-left: 0.5rem;
        flex-shrink: 0;
    }
    
    .more-records-compact,
    .collapse-records-compact {
        text-align: center;
        margin-top: 0.75rem;
    }
    
    .show-all-records-compact,
    .collapse-records-compact {
        background: transparent;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all var(--animation-duration) var(--animation-easing);
    }
    
    .show-all-records-compact:hover,
    .collapse-records-compact:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
    }
    
    .records-summary {
        text-align: center;
        color: var(--text-light);
        font-size: 0.925rem;
        padding: 1.5rem;
        background: var(--bg-light);
        border-radius: var(--border-radius-sm);
        border: 1px solid var(--border-light);
        font-style: italic;
    }
    
    @media (max-width: 768px) {
        .extended-item {
            grid-template-columns: 1fr;
            gap: 0.25rem;
        }
        
        .extended-label {
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .toast-message {
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .dns-records-section {
            grid-column: 1;
        }
        
        .dns-record-compact {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .record-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
            width: 100%;
        }
        
        .record-info code {
            word-break: break-all;
        }
    }

    /* Markdown 表格样式 */
    .md-table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
    }
    
    .md-table th, .md-table td {
        padding: 0.75rem;
        text-align: left;
        border: 1px solid var(--border-light);
    }
    
    .md-table th {
        background: var(--bg-light);
        color: var(--text-light);
        font-weight: 600;
    }
    
    .md-table tr:hover {
        background: rgba(102, 126, 234, 0.1);
    }
    
    .md-table .availability-badge {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: var(--border-radius-sm);
        font-size: 0.875rem;
        font-weight: 500;
    }
    
    .md-table .available {
        background: #48bb78;
        color: white;
    }
    
    .md-table .unavailable {
        background: #f56565;
        color: white;
    }
`;
document.head.appendChild(additionalStyles);

// 在扩展信息中显示全部DNS记录（全局函数）
function showAllRecordsInExtended(event) {
    event.preventDefault();
    const button = event.target;
    const extendedInfo = button.closest('.extended-info');
    const allRecordsData = extendedInfo.getAttribute('data-all-records');
    
    if (!allRecordsData) return;
    
    try {
        const allRecords = JSON.parse(allRecordsData);
        const recordsContainer = button.closest('.dns-records-compact');
        
        let recordsHtml = '';
        allRecords.forEach(record => {
            recordsHtml += `
                <div class="dns-record-compact">
                    <span class="record-type-mini ${record.type}">${record.type}</span>
                    <span class="record-info">
                        <strong>${record.name || '@'}</strong>
                        <span class="record-arrow">→</span>
                        <code>${record.content}</code>
                        <small class="record-ttl">(TTL: ${record.ttl || 3600}s)</small>
                    </span>
                </div>
            `;
        });
        
        recordsHtml += `
            <div class="more-records-compact">
                <button class="collapse-records-compact" onclick="collapseRecordsInExtended(event)">
                    收起记录列表
                </button>
            </div>
        `;
        
        recordsContainer.innerHTML = recordsHtml;
    } catch (error) {
        console.error('解析DNS记录数据失败:', error);
    }
}

// 在扩展信息中收起DNS记录（全局函数）
function collapseRecordsInExtended(event) {
    event.preventDefault();
    const button = event.target;
    const extendedInfo = button.closest('.extended-info');
    const allRecordsData = extendedInfo.getAttribute('data-all-records');
    
    if (!allRecordsData) return;
    
    try {
        const allRecords = JSON.parse(allRecordsData);
        const recordsContainer = button.closest('.dns-records-compact');
        const maxDisplayRecords = 3;
        const displayRecords = allRecords.slice(0, maxDisplayRecords);
        const totalRecords = allRecords.length;
        
        let recordsHtml = '';
        displayRecords.forEach(record => {
            recordsHtml += `
                <div class="dns-record-compact">
                    <span class="record-type-mini ${record.type}">${record.type}</span>
                    <span class="record-info">
                        <strong>${record.name || '@'}</strong>
                        <span class="record-arrow">→</span>
                        <code>${record.content}</code>
                    </span>
                </div>
            `;
        });
        
        if (totalRecords > maxDisplayRecords) {
            recordsHtml += `
                <div class="more-records-compact">
                    <button class="show-all-records-compact" onclick="showAllRecordsInExtended(event)">
                        查看全部 ${totalRecords} 条记录
                    </button>
                </div>
            `;
        }
        
        recordsContainer.innerHTML = recordsHtml;
    } catch (error) {
        console.error('恢复DNS记录显示失败:', error);
    }
}
