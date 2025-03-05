/**
 * 非遗数据库脚本文件 (database.js)
 * 此文件包含非遗数据库页面的特定交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 切换查看方式（网格/列表）
    const viewBtns = document.querySelectorAll('.view-btn');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (viewBtns.length > 0 && resultsContainer) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有按钮的活动状态
                viewBtns.forEach(b => b.classList.remove('active'));
                
                // 添加当前按钮的活动状态
                this.classList.add('active');
                
                // 切换结果容器的类名
                const viewType = this.dataset.view;
                resultsContainer.className = viewType === 'grid' ? 'results-grid' : 'results-list';
            });
        });
    }
    
    // 分类标签页切换
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryPanes = document.querySelectorAll('.category-pane');
    
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const categoryId = this.dataset.category;
                
                // 移除所有按钮和面板的活动状态
                categoryBtns.forEach(b => b.classList.remove('active'));
                categoryPanes.forEach(p => p.classList.remove('active'));
                
                // 添加当前按钮和对应面板的活动状态
                this.classList.add('active');
                document.getElementById(categoryId).classList.add('active');
            });
        });
    }

    // 模拟搜索功能
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('searchKeyword');
    const searchBtn = document.querySelector('.search-btn');
    const resultCount = document.getElementById('resultCount');
    
    if (searchForm && searchBtn) {
        searchBtn.addEventListener('click', function() {
            // 阻止默认行为
            event.preventDefault();
            
            // 显示加载动画
            showLoading();
            
            // 模拟搜索延迟
            setTimeout(() => {
                // 根据输入的关键词更新结果数量
                if (searchInput && searchInput.value.trim() !== '') {
                    // 生成随机结果数量（实际应用中应根据真实数据）
                    const randomCount = Math.floor(Math.random() * 200) + 1;
                    if (resultCount) {
                        resultCount.textContent = randomCount;
                    }
                    
                    // 显示搜索反馈
                    showNotification(`已为您找到 ${randomCount} 个与"${searchInput.value.trim()}"相关的非遗项目`, 'success');
                } else {
                    // 如果没有输入关键词，显示提示
                    showNotification('请输入搜索关键词', 'info');
                }
                
                // 隐藏加载动画
                hideLoading();
                
                // 滚动到结果区域
                const resultsSection = document.querySelector('.database-results');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
        });
    }
    
    // 高级筛选展开/收起动画
    const searchAdvanced = document.querySelector('.search-advanced');
    if (searchAdvanced) {
        const summary = searchAdvanced.querySelector('summary');
        
        summary.addEventListener('click', function(e) {
            // 阻止默认切换行为
            e.preventDefault();
            
            // 手动切换open属性
            if (searchAdvanced.hasAttribute('open')) {
                const content = searchAdvanced.querySelector('.advanced-filters');
                
                // 添加收起动画
                content.style.height = `${content.scrollHeight}px`;
                setTimeout(() => {
                    content.style.height = '0';
                    content.style.opacity = '0';
                }, 10);
                
                // 动画结束后移除open属性
                setTimeout(() => {
                    searchAdvanced.removeAttribute('open');
                    content.style.height = '';
                    content.style.opacity = '';
                }, 300);
            } else {
                // 添加open属性
                searchAdvanced.setAttribute('open', '');
                
                // 添加展开动画
                const content = searchAdvanced.querySelector('.advanced-filters');
                content.style.height = '0';
                content.style.opacity = '0';
                
                setTimeout(() => {
                    content.style.height = `${content.scrollHeight}px`;
                    content.style.opacity = '1';
                }, 10);
                
                // 动画结束后恢复样式
                setTimeout(() => {
                    content.style.height = '';
                }, 300);
            }
        });
    }
    
    // 分页功能
    const paginationBtns = document.querySelectorAll('.pagination-btn');
    
    if (paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            if (!btn.disabled) {
                btn.addEventListener('click', function() {
                    // 移除所有按钮的活动状态
                    paginationBtns.forEach(b => {
                        if (b.textContent && !isNaN(b.textContent.trim())) {
                            b.classList.remove('active');
                        }
                    });
                    
                    // 添加当前按钮的活动状态（如果是数字按钮）
                    if (this.textContent && !isNaN(this.textContent.trim())) {
                        this.classList.add('active');
                    }
                    
                    // 模拟页面切换
                    showLoading();
                    
                    setTimeout(() => {
                        hideLoading();
                        
                        // 滚动到结果区域顶部
                        const resultsSection = document.querySelector('.database-results');
                        if (resultsSection) {
                            resultsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 800);
                });
            }
        });
    }
    
    // 显示加载动画
    function showLoading() {
        // 创建加载动画元素
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-overlay';
        loadingEl.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>加载中...</p>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(loadingEl);
        
        // 添加样式
        const loadingStyle = document.createElement('style');
        if (!document.getElementById('loading-style')) {
            loadingStyle.id = 'loading-style';
            loadingStyle.textContent = `
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(255, 255, 255, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                
                .loading-spinner {
                    text-align: center;
                }
                
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid var(--gray-200);
                    border-top-color: var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(loadingStyle);
        }
    }
    
    // 隐藏加载动画
    function hideLoading() {
        const loadingEl = document.querySelector('.loading-overlay');
        if (loadingEl) {
            loadingEl.remove();
        }
    }
    
    // 显示通知消息
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
    
    // 地图交互
    initMap();
    
    function initMap() {
        // 模拟地图标记点数据
        const markers = [
            { x: 58, y: 45, name: '北京琉璃厂', count: 42 },
            { x: 76, y: 52, name: '天津泥人张', count: 28 },
            { x: 62, y: 62, name: '河北武强年画', count: 35 },
            { x: 45, y: 48, name: '山西平遥推光漆器', count: 31 },
            { x: 78, y: 68, name: '江苏苏州缂丝', count: 46 },
            { x: 79, y: 72, name: '浙江龙泉青瓷', count: 38 },
            { x: 65, y: 83, name: '福建漆线雕', count: 29 },
            { x: 50, y: 70, name: '河南汝瓷', count: 33 },
            { x: 73, y: 78, name: '江西景德镇陶瓷', count: 54 },
            { x: 55, y: 85, name: '广东醒狮', count: 37 },
            { x: 40, y: 78, name: '湖南湘绣', count: 26 },
            { x: 35, y: 90, name: '广西壮锦', count: 23 },
            { x: 25, y: 85, name: '云南扎染', count: 30 },
            { x: 15, y: 70, name: '西藏唐卡', count: 19 },
            { x: 30, y: 60, name: '四川竹编', count: 41 },
            { x: 15, y: 50, name: '青海热贡艺术', count: 22 },
            { x: 22, y: 40, name: '甘肃敦煌彩塑', count: 27 }
        ];
        
        // 获取地图容器
        const mapWrapper = document.querySelector('.map-wrapper');
        const mapMarkers = document.querySelector('.map-markers');
        
        if (mapWrapper && mapMarkers) {
            // 清空现有标记
            mapMarkers.innerHTML = '';
            
            // 添加标记点
            markers.forEach(marker => {
                const markerElement = document.createElement('div');
                markerElement.className = 'map-marker';
                markerElement.style.left = `${marker.x}%`;
                markerElement.style.top = `${marker.y}%`;
                
                // 设置标记点大小根据数量
                const size = Math.max(20, Math.min(40, marker.count / 2 + 15));
                
                markerElement.innerHTML = `
                    <div class="marker-point" style="width: ${size}px; height: ${size}px;"></div>
                    <div class="marker-tooltip">
                        <strong>${marker.name}</strong>
                        <span>${marker.count}个非遗项目</span>
                    </div>
                `;
                
                mapMarkers.appendChild(markerElement);
                
                // 添加鼠标悬停效果
                markerElement.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                });
                
                markerElement.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
            });
            
            // 添加标记点样式
            const markerStyle = document.createElement('style');
            if (!document.getElementById('marker-style')) {
                markerStyle.id = 'marker-style';
                markerStyle.textContent = `
                    .map-marker {
                        position: absolute;
                        transform: translate(-50%, -50%);
                        z-index: 2;
                    }
                    
                    .marker-point {
                        width: 20px;
                        height: 20px;
                        background-color: var(--primary-color);
                        border-radius: 50%;
                        cursor: pointer;
                        position: relative;
                        transition: transform 0.3s ease;
                    }
                    
                    .marker-point::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: var(--primary-color);
                        border-radius: 50%;
                        opacity: 0.5;
                        animation: pulse 2s infinite;
                    }
                    
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                            opacity: 0.5;
                        }
                        70% {
                            transform: scale(2);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 0;
                        }
                    }
                    
                    .marker-tooltip {
                        position: absolute;
                        top: -15px;
                        left: 50%;
                        transform: translate(-50%, -100%);
                        background-color: white;
                        border-radius: 4px;
                        padding: 10px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                        width: 150px;
                        text-align: center;
                        visibility: hidden;
                        opacity: 0;
                        transition: all 0.3s ease;
                        pointer-events: none;
                    }
                    
                    .marker-tooltip::after {
                        content: '';
                        position: absolute;
                        bottom: -5px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 10px;
                        height: 10px;
                        background-color: white;
                        transform: rotate(45deg);
                    }
                    
                    .marker-tooltip strong {
                        display: block;
                        margin-bottom: 5px;
                    }
                    
                    .marker-tooltip span {
                        font-size: 14px;
                        color: var(--primary-color);
                    }
                    
                    .map-marker:hover .marker-point,
                    .map-marker.active .marker-point {
                        transform: scale(1.2);
                    }
                    
                    .map-marker:hover .marker-tooltip,
                    .map-marker.active .marker-tooltip {
                        visibility: visible;
                        opacity: 1;
                        top: -10px;
                    }
                `;
                document.head.appendChild(markerStyle);
            }
        }
    }
    
    // 滚动动画
    initScrollAnimations();
    
    function initScrollAnimations() {
        const animatedElements = [
            ...document.querySelectorAll('.stats-card'),
            ...document.querySelectorAll('.result-item'),
            ...document.querySelectorAll('.category-card')
        ];
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            animatedElements.forEach(element => {
                element.classList.add('animation-ready');
                observer.observe(element);
            });
            
            // 添加动画样式
            const animationStyle = document.createElement('style');
            if (!document.getElementById('animation-style')) {
                animationStyle.id = 'animation-style';
                animationStyle.textContent = `
                    .animation-ready {
                        opacity: 0;
                        transform: translateY(30px);
                        transition: opacity 0.6s ease, transform 0.6s ease;
                    }
                    
                    .animate {
                        opacity: 1;
                        transform: translateY(0);
                    }
                `;
                document.head.appendChild(animationStyle);
            }
        }
    }

    /**
     * 动态加载非遗项目数据 (添加到database.js)
     */
    function loadHeritageItems(filters = {}) {
        // 模拟API请求，实际应用中应替换为真实后端API调用
        showLoading();

        // 模拟网络延迟
        setTimeout(() => {
            // 假设这是从API获取的数据
            const heritageItems = [
                {
                    id: 1001,
                    name: "苏州缂丝",
                    location: "江苏苏州",
                    category: "传统技艺",
                    level: "national",
                    image: "images/heritage/suzhou-kesi.jpg",
                    description: "苏州缂丝是中国汉族传统丝织工艺，距今已有2000多年历史，以其图案精美、色彩绚丽、质地坚韧而闻名于世。",
                    culturalValue: 92,
                    marketPotential: 86,
                    inheritanceRisk: 65
                },
                {
                    id: 1002,
                    name: "景德镇陶瓷烧制技艺",
                    location: "江西景德镇",
                    category: "传统技艺",
                    level: "national",
                    image: "images/heritage/jingdezhen-porcelain.jpg",
                    description: "景德镇陶瓷烧制技艺历史悠久，始于汉代，盛于唐宋，是中国陶瓷工艺的集大成者，被誉为\"白如玉明如镜薄如纸声如磬\"",
                    culturalValue: 95,
                    marketPotential: 90,
                    inheritanceRisk: 38
                },
                {
                    id: 1003,
                    name: "广东醒狮",
                    location: "广东佛山",
                    category: "民俗活动",
                    level: "national",
                    image: "images/heritage/guangdong-lion.jpg",
                    description: "广东醒狮是岭南文化的代表性民俗活动，起源于清代，是中国传统民间艺术的瑰宝，具有驱邪祈福、祝贺喜庆的文化内涵。",
                    culturalValue: 88,
                    marketPotential: 82,
                    inheritanceRisk: 45
                },
            // 更多项目...
        ];

            // 根据筛选条件过滤数据
            let filteredItems = [...heritageItems];

            if (filters.keyword) {
                const keyword = filters.keyword.toLowerCase();
                filteredItems = filteredItems.filter(item =>
                    item.name.toLowerCase().includes(keyword) ||
                    item.description.toLowerCase().includes(keyword) ||
                    item.location.toLowerCase().includes(keyword)
                );
            }

            if (filters.category) {
                filteredItems = filteredItems.filter(item => item.category === filters.category);
            }

            if (filters.level) {
                filteredItems = filteredItems.filter(item => item.level === filters.level);
            }

            // 根据排序方式排序
            if (filters.sort) {
                switch(filters.sort) {
                    case 'cultural':
                        filteredItems.sort((a, b) => b.culturalValue - a.culturalValue);
                        break;
                    case 'market':
                        filteredItems.sort((a, b) => b.marketPotential - a.marketPotential);
                        break;
                    case 'risk':
                        filteredItems.sort((a, b) => b.inheritanceRisk - a.inheritanceRisk);
                        break;
                    default:
                        // 默认按相关度排序，这里简化为按ID排序
                        filteredItems.sort((a, b) => a.id - b.id);
                }
            }

            // 更新结果计数
            const resultCount = document.getElementById('resultCount');
            if (resultCount) {
                resultCount.textContent = filteredItems.length;
            }

            // 渲染项目
            renderHeritageItems(filteredItems);

            // 隐藏加载动画
            hideLoading();
        }, 800);
    }

    /**
     * 渲染非遗项目列表
     */
    function renderHeritageItems(items) {
        const container = document.getElementById('resultsContainer');
        if (!container) return;

        // 清空容器
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<div class="no-results">未找到匹配的非遗项目，请尝试其他筛选条件</div>';
            return;
        }

        // 添加项目到容器
        items.forEach(item => {
            // 生成评级标签类名
            const levelClass = {
                'national': 'national',
                'provincial': 'provincial',
                'city': 'city',
                'county': 'county'
            }[item.level] || 'other';

            // 生成评级标签文本
            const levelText = {
                'national': '国家级',
                'provincial': '省级',
                'city': '市级',
                'county': '县级'
            }[item.level] || '其他';

            // 创建项目元素
            const itemElement = document.createElement('div');
            itemElement.className = 'result-item';
            itemElement.innerHTML = `
            <div class="result-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <div class="result-badge ${levelClass}">${levelText}</div>
            </div>
            <div class="result-content">
                <h3>${item.name}</h3>
                <div class="result-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                    <span><i class="fas fa-tag"></i> ${item.category}</span>
                </div>
                <p>${item.description}</p>
                <div class="result-stats">
                    <div class="stat">
                        <div class="stat-label">文化价值</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${item.culturalValue}%;"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">市场潜力</div>
                        <div class="stat-bar">
                            <div class="stat-fill" style="width: ${item.marketPotential}%;"></div>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">传承风险</div>
                        <div class="stat-bar risk">
                            <div class="stat-fill" style="width: ${item.inheritanceRisk}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="result-actions">
                    <a href="database-detail.html?id=${item.id}" class="btn btn-outline btn-sm">查看详情</a>
                    <a href="evaluation.html?project=${item.id}" class="btn btn-primary btn-sm">申请评估</a>
                </div>
            </div>
        `;

            container.appendChild(itemElement);
        });

        // 添加元素显示动画
        const resultItems = container.querySelectorAll('.result-item');
        resultItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50 * index);
        });
    }

    /**
     * 初始化搜索和筛选功能
     */
    function initSearchAndFilters() {
        const searchForm = document.querySelector('.search-form');
        const searchInput = document.getElementById('searchKeyword');
        const searchBtn = document.querySelector('.search-btn');
        const categoryFilter = document.getElementById('filterCategory');
        const regionFilter = document.getElementById('filterRegion');
        const levelFilter = document.getElementById('filterLevel');
        const batchFilter = document.getElementById('filterBatch');
        const sortSelect = document.getElementById('sortResults');

        // 搜索按钮点击事件
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();

                const filters = {
                    keyword: searchInput ? searchInput.value : '',
                    category: categoryFilter ? categoryFilter.value : '',
                    region: regionFilter ? regionFilter.value : '',
                    level: levelFilter ? levelFilter.value : '',
                    batch: batchFilter ? batchFilter.value : '',
                    sort: sortSelect ? sortSelect.value : 'relevance'
                };

                loadHeritageItems(filters);
            });
        }

        // 排序选择事件
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const filters = {
                    keyword: searchInput ? searchInput.value : '',
                    category: categoryFilter ? categoryFilter.value : '',
                    region: regionFilter ? regionFilter.value : '',
                    level: levelFilter ? levelFilter.value : '',
                    batch: batchFilter ? batchFilter.value : '',
                    sort: this.value
                };

                loadHeritageItems(filters);
            });
        }

        // 筛选器变化事件
        const filterElements = [categoryFilter, regionFilter, levelFilter, batchFilter];
        filterElements.forEach(filter => {
            if (filter) {
                filter.addEventListener('change', function() {
                    // 高级筛选变化时不自动触发搜索，让用户点击搜索按钮来确认
                    // 这里也可以直接触发搜索，取决于用户体验设计
                });
            }
        });

        // 初始加载数据
        loadHeritageItems();
    }

// 当DOM加载完成后初始化功能
    document.addEventListener('DOMContentLoaded', function() {
        initSearchAndFilters();
    });
});
