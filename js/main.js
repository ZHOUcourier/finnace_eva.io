/**
 * 主脚本文件 (main.js)
 * 此文件包含网站的全局交互功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 移动端菜单切换
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuIcon && navMenu) {
        mobileMenuIcon.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // 滚动时改变导航栏样式
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // 平滑滚动到锚点
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 80; // 导航栏高度补偿
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 如果移动菜单打开，点击后关闭
                if (navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                }
            }
        });
    });
    
    // 表单提交处理
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 表单验证
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            // 模拟表单提交
            showNotification('表单提交成功，我们将尽快与您联系', 'success');
            form.reset();
        });
    });
    
    // 通知消息
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // 添加关闭按钮事件
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', function() {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }
    
    // 添加通知样式
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            max-width: 350px;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.hide {
            transform: translateY(100px);
            opacity: 0;
        }
        
        .notification.success {
            background-color: #d4edda;
            border-left: 4px solid #28a745;
        }
        
        .notification.error {
            background-color: #f8d7da;
            border-left: 4px solid #dc3545;
        }
        
        .notification.info {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content p {
            margin: 0;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // 加载动画
    window.addEventListener('load', function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }
    });
});

// 添加预加载动画
const preloader = document.createElement('div');
preloader.id = 'preloader';
preloader.innerHTML = `
    <div class="preloader-spinner">
        <div class="spinner-circle"></div>
    </div>
`;

const preloaderStyle = document.createElement('style');
preloaderStyle.textContent = `
    #preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    }
    
    #preloader.hide {
        opacity: 0;
    }
    
    .preloader-spinner {
        position: relative;
        width: 60px;
        height: 60px;
    }
    
    .spinner-circle {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 3px solid transparent;
        border-top-color: var(--primary-color, #D81B60);
        border-radius: 50%;
        animation: preloader-spin 1.2s linear infinite;
    }
    
    .spinner-circle:before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border: 3px solid transparent;
        border-top-color: var(--secondary-color, #1E88E5);
        border-radius: 50%;
        animation: preloader-spin 1.8s linear infinite;
    }
    
    .spinner-circle:after {
        content: "";
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border: 3px solid transparent;
        border-top-color: var(--accent-color, #FFC107);
        border-radius: 50%;
        animation: preloader-spin 2.4s linear infinite;
    }
    
    @keyframes preloader-spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

document.head.appendChild(preloaderStyle);
document.body.prepend(preloader);

/**
 * 功能增强脚本 - 添加到main.js文件末尾
 */

// 滚动到顶部按钮
function addScrollToTopButton() {
    // 创建按钮元素
    const scrollButton = document.createElement('div');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollButton);

    // 滚动事件监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    // 点击事件
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 数字动画效果
function addCounterAnimation() {
    const counters = document.querySelectorAll('.stats-number, .stat-number, .stat h3');

    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseFloat(element.textContent.replace(/,/g, '').replace(/¥/g, '').replace(/亿/g, ''));
                const duration = 2000; // 动画持续时间（毫秒）
                const step = target / (duration / 16); // 每16ms更新一次（约60fps）

                let current = 0;
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        // 如果原文本包含特殊符号，保留它们
                        if (element.textContent.includes('¥')) {
                            element.textContent = '¥' + Math.floor(current).toLocaleString();
                            if (element.textContent.includes('亿')) {
                                element.textContent += '亿';
                            }
                        } else if (element.textContent.includes('%')) {
                            element.textContent = Math.floor(current) + '%';
                        } else {
                            element.textContent = Math.floor(current).toLocaleString();
                            if (element.textContent.includes('亿')) {
                                element.textContent += '亿';
                            }
                        }
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.textContent = element.dataset.originalText || element.textContent;
                    }
                };

                // 保存原始文本以便最后恢复
                element.dataset.originalText = element.textContent;
                updateCounter();

                // 完成后取消观察
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 图片懒加载
function addLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);

                // 添加淡入效果
                img.style.opacity = 0;
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = 1;
                };
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

// 平滑显示页面内容
function addPageReveal() {
    const revealElements = document.querySelectorAll('.feature-card, .case-card, .stat-item, .process-step, .dimension-info, .project-item');

    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach((element, index) => {
        // 添加初始样式
        element.classList.add('reveal-element');
        element.style.transitionDelay = `${index * 0.1}s`;

        revealObserver.observe(element);
    });
}

// 悬停卡片3D效果
function addCardTiltEffect() {
    const cards = document.querySelectorAll('.feature-card, .case-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const cardRect = this.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // 计算倾斜角度（限制在较小范围内）
            const rotateX = mouseY * -0.05;
            const rotateY = mouseX * 0.05;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// 项目详情页面的项目图片滑块
function initProjectSlider() {
    const slider = document.querySelector('.project-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slider-item');
    const nextBtn = slider.querySelector('.slider-next');
    const prevBtn = slider.querySelector('.slider-prev');
    const dotsContainer = slider.querySelector('.slider-dots');

    let currentSlide = 0;

    // 创建指示点
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');

        dot.addEventListener('click', () => {
            goToSlide(index);
        });

        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    // 显示指定幻灯片
    function goToSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    // 初始化幻灯片位置
    goToSlide(0);

    // 上一张/下一张按钮
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    });

    // 自动播放
    let slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }, 5000);

    // 鼠标悬停时暂停自动播放
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            goToSlide(currentSlide);
        }, 5000);
    });
}

// 文档加载完成后初始化所有增强功能
document.addEventListener('DOMContentLoaded', function() {
    // 添加通用样式类到body
    document.body.classList.add('enhanced-ui');

    // 初始化所有增强功能
    addScrollToTopButton();
    addCounterAnimation();
    addLazyLoading();
    addPageReveal();
    addCardTiltEffect();
    initProjectSlider();

    // 为图片添加加载动画样式
    const addImageLoadingStyle = document.createElement('style');
    addImageLoadingStyle.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        img[data-src] {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
    `;
    document.head.appendChild(addImageLoadingStyle);
});

/**
 * 移动端优化脚本 - 添加到main.js中
 */

// 优化移动端菜单
function enhanceMobileMenu() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('nav ul');

    if (!mobileMenuIcon || !navMenu) return;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    // 创建关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'nav-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    navMenu.appendChild(closeBtn);

    // 点击菜单图标打开菜单
    mobileMenuIcon.addEventListener('click', function() {
        navMenu.classList.add('show');
        overlay.classList.add('show');
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    });

    // 点击关闭按钮或遮罩层关闭菜单
    function closeMenu() {
        navMenu.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // 点击导航链接后关闭菜单
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(closeMenu, 150);
            }
        });
    });
}

// 优化移动端表单体验
function enhanceMobileFormExperience() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');

        // 输入完成后自动收起键盘
        inputs.forEach(input => {
            // 处理失去焦点事件
            input.addEventListener('blur', function() {
                // 短暂延迟，确保任何点击事件已完成
                setTimeout(() => {
                    // 检查当前焦点是否在表单中的其他输入框
                    const activeElement = document.activeElement;
                    const isActiveElementInput =
                        activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'SELECT' ||
                        activeElement.tagName === 'TEXTAREA';

                    if (!isActiveElementInput) {
                        // 如果焦点不在输入框上，尝试模拟键盘收起
                        input.blur();
                    }
                }, 100);
            });
        });

        // 添加表单字段完成状态指示
        inputs.forEach(input => {
            if (input.required) {
                input.addEventListener('change', function() {
                    if (this.value.trim()) {
                        this.classList.add('completed');
                    } else {
                        this.classList.remove('completed');
                    }
                });
            }
        });
    });

    // 添加完成指示器样式
    const completedStyle = document.createElement('style');
    completedStyle.textContent = `
        input.completed, select.completed, textarea.completed {
            border-left: 3px solid var(--success-color);
        }
    `;
    document.head.appendChild(completedStyle);
}

// 优化移动端滑块体验
function enhanceMobileSwiperExperience() {
    const sliders = document.querySelectorAll('.testimonial-slider, .project-slider');

    sliders.forEach(slider => {
        // 添加拖动指示器
        const dragIndicator = document.createElement('div');
        dragIndicator.className = 'swipe-indicator';
        dragIndicator.innerHTML = '<span>滑动查看更多</span><i class="fas fa-chevron-right"></i>';
        slider.appendChild(dragIndicator);

        // 在用户滑动后隐藏指示器
        let isDragged = false;

        slider.addEventListener('scroll', function() {
            if (!isDragged) {
                dragIndicator.classList.add('hide');
                isDragged = true;
            }
        }, { passive: true });

        slider.addEventListener('touchmove', function() {
            if (!isDragged) {
                dragIndicator.classList.add('hide');
                isDragged = true;
            }
        }, { passive: true });
    });

    // 添加拖动指示器样式
    const indicatorStyle = document.createElement('style');
    indicatorStyle.textContent = `
        .swipe-indicator {
            position: absolute;
            right: 20px;
            bottom: 20px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 14px;
            display: flex;
            align-items: center;
            z-index: 5;
            opacity: 0.8;
            animation: pulse-indicator 2s infinite;
        }
        
        .swipe-indicator.hide {
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .swipe-indicator i {
            margin-left: 8px;
            animation: slide-right 1.5s infinite;
        }
        
        @keyframes pulse-indicator {
            0% { opacity: 0.8; }
            50% { opacity: 0.4; }
            100% { opacity: 0.8; }
        }
        
        @keyframes slide-right {
            0% { transform: translateX(0); }
            50% { transform: translateX(5px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(indicatorStyle);
}

// 添加双击返回顶部功能（移动端友好）
function addDoubleTapToTop() {
    let lastTap = 0;

    document.addEventListener('touchend', function(e) {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        // 检测双击 (小于500ms的两次点击)
        if (tapLength < 500 && tapLength > 0) {
            // 双击事件 - 回到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // 显示视觉反馈
            const feedback = document.createElement('div');
            feedback.className = 'double-tap-feedback';
            feedback.innerHTML = '<i class="fas fa-arrow-up"></i>';

            document.body.appendChild(feedback);

            setTimeout(() => {
                feedback.classList.add('show');
            }, 10);

            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => {
                    feedback.remove();
                }, 300);
            }, 1000);
        }

        lastTap = currentTime;
    });

    // 添加双击反馈样式
    const feedbackStyle = document.createElement('style');
    feedbackStyle.textContent = `
        .double-tap-feedback {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 80px;
            height: 80px;
            background-color: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 30px;
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 9999;
        }
        
        .double-tap-feedback.show {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
    `;
    document.head.appendChild(feedbackStyle);
}

// 优化手机快速访问功能
function addQuickActions() {
    // 只在移动端显示
    if (window.innerWidth > 768) return;

    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions';
    quickActions.innerHTML = `
        <a href="tel:01012345678" class="quick-action">
            <i class="fas fa-phone"></i>
        </a>
        <a href="#" class="quick-action" id="quickSearch">
            <i class="fas fa-search"></i>
        </a>
        <a href="evaluation.html" class="quick-action">
            <i class="fas fa-clipboard-check"></i>
        </a>
    `;

    document.body.appendChild(quickActions);

    // 快速搜索功能
    const quickSearchBtn = document.getElementById('quickSearch');
    if (quickSearchBtn) {
        quickSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // 创建快速搜索模态框
            const searchModal = document.createElement('div');
            searchModal.className = 'quick-search-modal';
            searchModal.innerHTML = `
                <div class="quick-search-container">
                    <div class="quick-search-header">
                        <h3>搜索非遗项目</h3>
                        <button class="quick-search-close">&times;</button>
                    </div>
                    <div class="quick-search-body">
                        <form class="quick-search-form">
                            <input type="text" placeholder="输入关键词、项目名称..." autofocus>
                            <button type="submit"><i class="fas fa-search"></i></button>
                        </form>
                        <div class="quick-search-tags">
                            <span>热门搜索:</span>
                            <a href="database.html?keyword=刺绣">刺绣</a>
                            <a href="database.html?keyword=陶瓷">陶瓷</a>
                            <a href="database.html?keyword=传统技艺">传统技艺</a>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(searchModal);

            // 显示模态框
            setTimeout(() => {
                searchModal.classList.add('show');
            }, 10);

            // 关闭模态框
            const closeBtn = searchModal.querySelector('.quick-search-close');
            closeBtn.addEventListener('click', function() {
                searchModal.classList.remove('show');
                setTimeout(() => {
                    searchModal.remove();
                }, 300);
            });

            // 处理搜索表单提交
            const searchForm = searchModal.querySelector('.quick-search-form');
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const input = this.querySelector('input');
                const keyword = input.value.trim();

                if (keyword) {
                    window.location.href = `database.html?keyword=${encodeURIComponent(keyword)}`;
                }
            });
        });
    }

    // 添加样式
    const quickActionStyle = document.createElement('style');
    quickActionStyle.textContent = `
        .quick-actions {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 99;
        }
        
        .quick-action {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            font-size: 20px;
            transition: all 0.3s ease;
        }
        
        .quick-action:hover, .quick-action:active {
            background-color: #A91E24;
            color: white;
            transform: scale(1.1);
        }
        
        .quick-search-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .quick-search-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .quick-search-container {
            width: 90%;
            max-width: 500px;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .quick-search-modal.show .quick-search-container {
            transform: translateY(0);
        }
        
        .quick-search-header {
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--gray-200);
        }
        
        .quick-search-header h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .quick-search-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .quick-search-body {
            padding: 20px;
        }
        
        .quick-search-form {
            display: flex;
            margin-bottom: 20px;
        }
        
        .quick-search-form input {
            flex: 1;
            padding: 12px 15px;
            border: 2px solid var(--gray-300);
            border-radius: 4px 0 0 4px;
            font-size: 16px;
        }
        
        .quick-search-form button {
            padding: 12px 15px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        
        .quick-search-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }
        
        .quick-search-tags span {
            color: var(--gray-600);
            font-size: 14px;
        }
        
        .quick-search-tags a {
            padding: 5px 10px;
            background-color: var(--gray-200);
            border-radius: 20px;
            font-size: 14px;
            color: var(--gray-700);
            text-decoration: none;
        }
    `;
    document.head.appendChild(quickActionStyle);
}

// 当DOM加载完成后初始化所有移动端优化
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 992) {
        // 仅在移动设备上初始化
        enhanceMobileMenu();
        enhanceMobileFormExperience();
        enhanceMobileSwiperExperience();
        addDoubleTapToTop();
        addQuickActions();
    }
});