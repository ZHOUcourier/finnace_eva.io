/**
 * 评估系统脚本文件 (evaluation.js)
 * 此文件包含评估系统页面的特定交互功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // 标签页切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // 移除所有活动标签
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // 激活选中的标签
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // 检查URL中是否有锚点，如有则激活相应标签
        const hash = window.location.hash.substr(1);
        if (hash) {
            const targetTab = document.querySelector(`.tab-btn[data-tab="${hash}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }
    
    // FAQ手风琴效果
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // 关闭所有其他FAQ项
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // 如果当前项未激活，则激活它
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // 评估表单验证
    const evaluationForm = document.getElementById('evaluationForm');
    
    if (evaluationForm) {
        const formInputs = evaluationForm.querySelectorAll('input, select, textarea');
        
        // 输入字段焦点事件
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                const errorMessage = this.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
            });
        });
        
        // 自定义表单验证
        evaluationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            let firstError = null;
            
            // 验证所有必填字段
            const requiredFields = evaluationForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                const errorMessage = field.nextElementSibling;
                if (errorMessage && errorMessage.classList.contains('error-message')) {
                    errorMessage.remove();
                }
                
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    const error = document.createElement('p');
                    error.className = 'error-message';
                    error.textContent = '此字段为必填项';
                    field.parentNode.insertBefore(error, field.nextSibling);
                    
                    if (!firstError) {
                        firstError = field;
                    }
                }
            });
            
            // 验证电子邮箱格式
            const emailField = evaluationForm.querySelector('input[type="email"]');
            if (emailField && emailField.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value.trim())) {
                    isValid = false;
                    emailField.classList.add('error');
                    
                    const error = document.createElement('p');
                    error.className = 'error-message';
                    error.textContent = '请输入有效的电子邮箱地址';
                    emailField.parentNode.insertBefore(error, emailField.nextSibling);
                    
                    if (!firstError) {
                        firstError = emailField;
                    }
                }
            }
            
            // 验证电话号码格式
            const phoneField = evaluationForm.querySelector('input[type="tel"]');
            if (phoneField && phoneField.value.trim()) {
                const phonePattern = /^1[3-9]\d{9}$/; // 中国大陆手机号码格式
                if (!phonePattern.test(phoneField.value.trim())) {
                    isValid = false;
                    phoneField.classList.add('error');
                    
                    const error = document.createElement('p');
                    error.className = 'error-message';
                    error.textContent = '请输入有效的手机号码';
                    phoneField.parentNode.insertBefore(error, phoneField.nextSibling);
                    
                    if (!firstError) {
                        firstError = phoneField;
                    }
                }
            }
            
            // 验证成立年份是否合理
            const yearField = evaluationForm.querySelector('input[name="establishYear"]');
            if (yearField && yearField.value.trim()) {
                const year = parseInt(yearField.value.trim());
                const currentYear = new Date().getFullYear();
                
                if (year < 1 || year > currentYear) {
                    isValid = false;
                    yearField.classList.add('error');
                    
                    const error = document.createElement('p');
                    error.className = 'error-message';
                    error.textContent = `年份必须在1至${currentYear}之间`;
                    yearField.parentNode.insertBefore(error, yearField.nextSibling);
                    
                    if (!firstError) {
                        firstError = yearField;
                    }
                }
            }
            
            // 如果验证失败，滚动到第一个错误字段
            if (!isValid && firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            // 模拟表单提交
            showSubmissionResult();
        });
    }
    
    // 模拟表单提交结果
    function showSubmissionResult() {
        // 创建结果弹窗
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>评估申请已提交</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <p>感谢您提交非遗项目评估申请！我们已收到您的信息，工作人员将在1-2个工作日内与您联系，请保持手机畅通。</p>
                    <p>您的申请编号：<strong>NH${generateRandomId()}</strong></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-close-btn">确定</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 添加关闭事件
        const closeBtns = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                modal.classList.add('hide');
                setTimeout(() => {
                    modal.remove();
                }, 300);
            });
        });
        
        // 显示动画
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // 重置表单
        document.getElementById('evaluationForm').reset();
    }
    
    // 生成随机申请ID
    function generateRandomId() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}${random}`;
    }
    
    // 添加模态框样式
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal.hide {
            opacity: 0;
            visibility: hidden;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(-50px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            opacity: 0.5;
            transition: opacity 0.3s ease;
        }
        
        .modal-close:hover {
            opacity: 1;
        }
        
        .modal-body {
            padding: 30px 20px;
            text-align: center;
        }
        
        .success-icon {
            font-size: 70px;
            color: var(--success-color);
            margin-bottom: 20px;
        }
        
        .modal-footer {
            padding: 15px 20px;
            border-top: 1px solid var(--border-color);
            text-align: center;
        }
        
        .error-message {
            color: var(--error-color);
            font-size: 14px;
            margin-top: 5px;
            margin-bottom: 0;
        }
        
        input.error,
        select.error,
        textarea.error {
            border-color: var(--error-color);
        }
    `;
    document.head.appendChild(modalStyle);
    
    // 评估维度滚动动画
    const dimensionSections = document.querySelectorAll('.dimension-info');
    
    if (dimensionSections.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        dimensionSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // 添加滚动动画样式
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .dimension-info {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .dimension-info.animate {
            opacity: 1;
            transform: translateY(0);
        }
        
        .dimension-factors li {
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        
        .dimension-info.animate .dimension-factors li:nth-child(1) {
            transition-delay: 0.1s;
        }
        
        .dimension-info.animate .dimension-factors li:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .dimension-info.animate .dimension-factors li:nth-child(3) {
            transition-delay: 0.3s;
        }
        
        .dimension-info.animate .dimension-factors li:nth-child(4) {
            transition-delay: 0.4s;
        }
        
        .dimension-info.animate .dimension-factors li:nth-child(5) {
            transition-delay: 0.5s;
        }
        
        .dimension-info.animate .dimension-factors li {
            opacity: 1;
            transform: translateX(0);
        }
    `;
    document.head.appendChild(animationStyle);
});
