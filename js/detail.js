/**
 * 非遗项目详情页脚本 (detail.js)
 * 此文件包含非遗项目详情页面的交互功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化页内导航
    initNavigation();
    
    // 初始化图片轮播
    initGallerySlider();
    
    // 初始化融资标签页
    initFundingTabs();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 加载与URL参数匹配的项目数据
    loadProjectData();
});

/**
 * 初始化页内导航
 */
function initNavigation() {
    // 获取所有导航项
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.detail-section');
    
    if (navItems.length === 0 || sections.length === 0) return;
    
    // 点击导航项滚动到对应区域
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 获取页内导航的高度，用于滚动偏移
                const navHeight = document.querySelector('.detail-navigation').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新导航活动状态
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const navHeight = document.querySelector('.detail-navigation').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 10; // 10px的容差
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                const targetId = section.getAttribute('id');
                
                // 更新导航项的活动状态
                navItems.forEach(item => {
                    const itemHref = item.getAttribute('href').substring(1);
                    if (itemHref === targetId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    });
}

/**
 * 初始化图片轮播
 */
function initGallerySlider() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (!galleryContainer || galleryItems.length === 0) return;
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // 显示指定索引的图片
    function showSlide(index) {
        // 确保索引在有效范围内
        if (index < 0) {
            index = galleryItems.length - 1;
        } else if (index >= galleryItems.length) {
            index = 0;
        }
        
        // 更新当前索引
        currentIndex = index;
        
        // 更新图片显示状态
        galleryItems.forEach((item, i) => {
            if (i === currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // 更新指示点状态
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }
    
    // 显示下一张图片
    function nextSlide() {
        showSlide(currentIndex + 1);
    }
    
    // 显示上一张图片
    function prevSlide() {
        showSlide(currentIndex - 1);
    }
    
    // 开始自动轮播
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    // 停止自动轮播
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // 为前后按钮添加点击事件
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', function() {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // 为指示点添加点击事件
    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.addEventListener('click', function() {
                showSlide(i);
                stopAutoSlide();
                startAutoSlide();
            });
        });
    }
    
    // 鼠标悬停时暂停自动轮播
    galleryContainer.addEventListener('mouseenter', stopAutoSlide);
    galleryContainer.addEventListener('mouseleave', startAutoSlide);
    
    // 触摸事件处理（针对移动设备）
    let touchStartX = 0;
    let touchEndX = 0;
    
    galleryContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    galleryContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    function handleSwipe() {
        // 检测滑动方向
        if (touchEndX < touchStartX - 50) {
            // 向左滑动，显示下一张
            nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            // 向右滑动，显示上一张
            prevSlide();
        }
    }
    
    // 初始显示第一张图片并开始自动轮播
    showSlide(0);
    startAutoSlide();
}

/**
 * 初始化融资标签页
 */
function initFundingTabs() {
    const fundingTabs = document.querySelectorAll('.funding-tab');
    const fundingPanes = document.querySelectorAll('.funding-pane');
    
    if (fundingTabs.length === 0 || fundingPanes.length === 0) return;
    
    fundingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // 更新标签页状态
            fundingTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新内容面板状态
            fundingPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });
}

/**
 * 初始化滚动动画
 */
function initScrollAnimations() {
    // 需要添加动画的元素
    const animatedElements = [
        ...document.querySelectorAll('.technique-highlight .highlight-item'),
        ...document.querySelectorAll('.inheritor-item'),
        ...document.querySelectorAll('.related-item'),
        ...document.querySelectorAll('.data-card'),
        ...document.querySelectorAll('.segment-item'),
        ...document.querySelectorAll('.model-item'),
        ...document.querySelectorAll('.score-bar')
    ];
    
    if (animatedElements.length === 0) return;
    
    // 使用IntersectionObserver检测元素是否进入视口
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 为进入视口的元素添加动画类
                    entry.target.classList.add('animate');
                    
                    // 如果是进度条，设置其宽度
                    if (entry.target.classList.contains('score-bar')) {
                        const fill = entry.target.querySelector('.score-fill');
                        if (fill && fill.style.width === '0%') {
                            const widthValue = fill.getAttribute('data-width') || fill.style.width;
                            setTimeout(() => {
                                fill.style.width = widthValue;
                            }, 100);
                        }
                    }
                    
                    // 元素显示后不再观察
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // 当元素有10%进入视口时触发
            rootMargin: '0px 0px -50px 0px' // 视口底部向上偏移50px
        });
        
        // 开始观察元素
        animatedElements.forEach(element => {
            // 保存进度条原始宽度值并设为0
            if (element.classList.contains('score-bar')) {
                const fill = element.querySelector('.score-fill');
                if (fill) {
                    fill.setAttribute('data-width', fill.style.width);
                    fill.style.width = '0%';
                }
            }
            
            // 添加初始类并开始观察
            element.classList.add('animation-ready');
            observer.observe(element);
        });
        
        // 添加动画样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .animation-ready {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate {
                opacity: 1;
                transform: translateY(0);
            }
            
            .score-bar .score-fill {
                transition: width 1s ease-out;
            }
        `;
        document.head.appendChild(styleElement);
    }
}

/**
 * 从URL参数加载项目数据
 * 在实际应用中，这里应该从服务器API获取数据
 */
function loadProjectData() {
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (!projectId) return;
    
    // 模拟从服务器获取数据的过程
    // 在实际应用中，这里应该使用fetch或axios从API获取数据
    console.log(`正在加载项目ID: ${projectId} 的数据`);
    
    // 这里可以根据projectId加载不同的项目数据并更新页面内容
    // 以下是示例代码，实际应用需要根据具体的数据结构进行调整
    
    /*
    fetch(`/api/heritage/${projectId}`)
        .then(response => response.json())
        .then(data => {
            // 更新页面标题
            document.title = `${data.name} - 非遗金融评估体系`;
            
            // 更新横幅内容
            const bannerTitle = document.querySelector('.detail-banner h1');
            if (bannerTitle) {
                bannerTitle.textContent = data.name;
            }
            
            // 更新其他页面内容...
            
        })
        .catch(error => {
            console.error('加载项目数据失败:', error);
        });
    */
}

/**
 * 项目详情页面分享功能
 */
function shareProject() {
    // 获取分享按钮
    const shareBtns = document.querySelectorAll('.share-btn');
    
    if (shareBtns.length === 0) return;
    
    // 获取当前页面信息
    const currentUrl = window.location.href;
    const projectTitle = document.querySelector('.detail-banner h1')?.textContent || '非遗项目详情';
    const projectDesc = document.querySelector('.overview-content p')?.textContent || '了解这个非物质文化遗产项目的详细信息';
    
    // 为分享按钮添加事件处理
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const type = this.classList[1]; // 获取分享类型：weixin, weibo, qq, link
            
            switch (type) {
                case 'weixin':
                    // 显示微信分享二维码（实际应用中需要生成二维码）
                    alert('请使用微信扫描二维码分享');
                    break;
                    
                case 'weibo':
                    // 分享到微博
                    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(projectTitle)}&pic=&appkey=`;
                    window.open(weiboUrl, '_blank');
                    break;
                    
                case 'qq':
                    // 分享到QQ
                    const qqUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(projectTitle)}&desc=${encodeURIComponent(projectDesc)}&pics=`;
                    window.open(qqUrl, '_blank');
                    break;
                    
                case 'link':
                    // 复制链接到剪贴板
                    navigator.clipboard.writeText(currentUrl)
                        .then(() => {
                            // 显示成功提示
                            const tooltip = document.createElement('div');
                            tooltip.className = 'copy-tooltip';
                            tooltip.textContent = '链接已复制到剪贴板';
                            tooltip.style.position = 'fixed';
                            tooltip.style.top = '50%';
                            tooltip.style.left = '50%';
                            tooltip.style.transform = 'translate(-50%, -50%)';
                            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                            tooltip.style.color = 'white';
                            tooltip.style.padding = '10px 20px';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.zIndex = '1000';
                            
                            document.body.appendChild(tooltip);
                            
                            // 2秒后移除提示
                            setTimeout(() => {
                                tooltip.remove();
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('复制链接失败:', err);
                            alert('复制链接失败，请手动复制浏览器地址栏中的链接');
                        });
                    break;
            }
        });
    });
}

// 页面加载完成后初始化分享功能
document.addEventListener('DOMContentLoaded', shareProject);
