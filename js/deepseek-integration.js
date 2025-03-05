/**
 * 非遗评估系统 DeepSeek API 集成方案
 * 通过接入DeepSeek API实现智能评估功能
 */

// ===== 后端实现（Node.js Express）=====

// 安装必要的依赖
// npm install express axios body-parser cors dotenv

// .env 文件配置
/*
DEEPSEEK_API_KEY=your_deepseek_api_key
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
PORT=3000
*/

// server.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL;

// DeepSeek API调用函数
async function callDeepSeekAPI(prompt) {
    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一个专业的非物质文化遗产评估专家，擅长分析非遗项目的文化价值、市场潜力、传承风险等维度。请基于提供的信息给出客观、专业的评估结果。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('DeepSeek API调用失败:', error);
        throw new Error('评估服务暂时不可用，请稍后再试');
    }
}

// 评估API路由
app.post('/api/evaluate', async (req, res) => {
    try {
        const { 
            projectName, 
            projectType, 
            location, 
            establishYear, 
            description, 
            annualRevenue, 
            employeeCount,
            financingNeeds,
            financingPurpose
        } = req.body;

        // 构建提示词
        const prompt = `
        请对以下非物质文化遗产项目进行全面评估，并给出具体分数(0-100分)和详细分析：
        
        项目名称：${projectName}
        项目类别：${projectType}
        所在地区：${location}
        成立/传承年份：${establishYear}
        项目描述：${description}
        年营业收入：${annualRevenue || '未提供'}元
        从业人员：${employeeCount || '未提供'}人
        融资需求：${financingNeeds || '未提供'}元
        融资用途：${financingPurpose || '未提供'}
        
        请从以下维度进行评估：
        1. 文化价值（历史传承、技艺独特性、文化意义）
        2. 艺术价值（美学价值、技艺水平、艺术影响力）
        3. 市场潜力（市场需求、产业规模、增长前景）
        4. 商业可行性（盈利模式、运营能力、产品竞争力）
        5. 传承风险（传承人情况、技艺保护、传承难度）
        6. 融资适合度（融资需求合理性、投资回报预期）

        对于每个维度，请给出具体分数(0-100分)，并提供详细的评估理由和建议。最后，给出综合评分和总体评估结论，包括投融资建议和发展策略推荐。
        
        请以JSON格式输出结果，包含各维度得分、评估内容和总体评估。
        `;

        // 调用DeepSeek API
        const evaluationResult = await callDeepSeekAPI(prompt);
        
        // 尝试解析JSON结果
        let parsedResult;
        try {
            // 处理可能的非JSON格式返回
            const jsonMatch = evaluationResult.match(/```json\n([\s\S]*)\n```/) || 
                             evaluationResult.match(/```\n([\s\S]*)\n```/) ||
                             [null, evaluationResult];
                             
            parsedResult = JSON.parse(jsonMatch[1]);
        } catch (error) {
            console.error('JSON解析失败:', error);
            // 如果解析失败，返回原始文本
            parsedResult = { 
                raw: evaluationResult,
                error: "返回格式解析失败，请查看原始结果"
            };
        }
        
        res.json({
            success: true,
            result: parsedResult
        });
    } catch (error) {
        console.error('评估处理失败:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`评估系统服务器运行在 http://localhost:${port}`);
});

// ===== 前端实现 =====

// 添加到 evaluation.js 文件末尾

/**
 * 评估系统与DeepSeek API集成
 * 实现智能评估功能
 */

// 初始化评估系统API集成
function initEvaluationAPI() {
    const evaluationForm = document.getElementById('evaluationForm');
    if (!evaluationForm) return;
    
    evaluationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 表单验证
        if (!validateForm(evaluationForm)) {
            showNotification('请填写所有必填字段', 'error');
            return;
        }
        
        // 显示加载状态
        showEvaluationLoading();
        
        // 收集表单数据
        const formData = {
            projectName: document.getElementById('projectName').value,
            projectType: document.getElementById('projectType').value,
            location: document.getElementById('location').value,
            establishYear: document.getElementById('establishYear').value,
            description: document.getElementById('description').value,
            annualRevenue: document.getElementById('annualRevenue').value,
            employeeCount: document.getElementById('employeeCount').value,
            financingNeeds: document.getElementById('financingNeeds').value,
            financingPurpose: document.getElementById('financingPurpose').value
        };
        
        try {
            // 调用评估API
            const response = await fetch('http://localhost:3000/api/evaluate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 隐藏加载状态
                hideEvaluationLoading();
                
                // 显示评估结果
                showEvaluationResult(data.result);
                
                // 清除表单
                evaluationForm.reset();
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('评估请求失败:', error);
            hideEvaluationLoading();
            showNotification('评估请求失败: ' + error.message, 'error');
        }
    });
}

// 表单验证
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
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
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// 显示评估加载状态
function showEvaluationLoading() {
    // 创建加载遮罩
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'evaluation-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="evaluation-loading-content">
            <div class="evaluation-loading-spinner"></div>
            <h3>正在进行智能评估</h3>
            <p>正在分析您提供的项目信息，请稍候...</p>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    document.body.style.overflow = 'hidden';
    
    // 添加加载动画样式
    if (!document.getElementById('evaluation-loading-style')) {
        const style = document.createElement('style');
        style.id = 'evaluation-loading-style';
        style.textContent = `
            .evaluation-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .evaluation-loading-content {
                background-color: white;
                padding: 3rem;
                border-radius: 8px;
                text-align: center;
                max-width: 80%;
            }
            
            .evaluation-loading-spinner {
                margin: 0 auto 2rem;
                width: 60px;
                height: 60px;
                border: 6px solid var(--primary-color);
                border-top-color: transparent;
                border-radius: 50%;
                animation: evaluation-spinner 1.5s linear infinite;
            }
            
            @keyframes evaluation-spinner {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// 隐藏评估加载状态
function hideEvaluationLoading() {
    const loadingOverlay = document.querySelector('.evaluation-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
        document.body.style.overflow = '';
    }
}

// 显示评估结果
function showEvaluationResult(result) {
    // 创建评估结果模态框
    const resultModal = document.createElement('div');
    resultModal.className = 'evaluation-result-modal';
    
    // 格式化评估结果
    let resultContent = '';
    
    if (result.error) {
        // 处理错误情况
        resultContent = `
            <div class="result-error">
                <h3>评估结果解析失败</h3>
                <p>系统无法正确解析评估结果，请查看原始返回内容：</p>
                <pre>${result.raw}</pre>
            </div>
        `;
    } else {
        // 格式化正常结果
        // 假设返回的结果包含各个维度的得分和评估内容
        const dimensionScores = [
            { name: '文化价值', score: result.culturalValue?.score || 0, color: '#4CAF50' },
            { name: '艺术价值', score: result.artisticValue?.score || 0, color: '#2196F3' },
            { name: '市场潜力', score: result.marketPotential?.score || 0, color: '#FF9800' },
            { name: '商业可行性', score: result.commercialViability?.score || 0, color: '#9C27B0' },
            { name: '传承风险', score: result.inheritanceRisk?.score || 0, color: '#F44336' },
            { name: '融资适合度', score: result.financingSuitability?.score || 0, color: '#607D8B' }
        ];
        
        const overallScore = result.overallScore || calculateAverageScore(dimensionScores);
        
        resultContent = `
            <div class="result-header">
                <div class="result-score-circle">
                    <svg viewBox="0 0 36 36">
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <path class="circle-fill" stroke-dasharray="${overallScore}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path>
                        <text x="18" y="20.35" class="score-text">${overallScore}</text>
                    </svg>
                </div>
                <div class="result-title">
                    <h3>评估结果</h3>
                    <p>项目: ${result.projectName || document.getElementById('projectName').value}</p>
                </div>
            </div>
            
            <div class="result-dimensions">
                ${dimensionScores.map(dimension => `
                    <div class="result-dimension-item">
                        <div class="dimension-header">
                            <div class="dimension-name">${dimension.name}</div>
                            <div class="dimension-score" style="color: ${dimension.color}">${dimension.score}</div>
                        </div>
                        <div class="dimension-bar">
                            <div class="dimension-fill" style="width: ${dimension.score}%; background-color: ${dimension.color}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="result-conclusion">
                <h4>评估结论</h4>
                <p>${result.conclusion || '根据对项目各维度的综合评估，该项目具有较好的发展潜力。建议在加强传承保护的同时，积极探索市场化发展路径。'}</p>
            </div>
            
            <div class="result-recommendations">
                <h4>投融资建议</h4>
                <p>${result.investmentRecommendations || '建议寻求文化产业基金投资，同时申请政府非遗保护专项资金支持。'}</p>
            </div>
        `;
    }
    
    // 组装模态框内容
    resultModal.innerHTML = `
        <div class="result-container">
            <div class="result-close">&times;</div>
            ${resultContent}
            <div class="result-actions">
                <button class="btn btn-secondary result-close-btn">关闭</button>
                <button class="btn btn-primary result-download-btn">下载报告</button>
            </div>
        </div>
    `;
    
    // 添加模态框到页面
    document.body.appendChild(resultModal);
    document.body.style.overflow = 'hidden';
    
    // 添加关闭事件
    const closeButtons = resultModal.querySelectorAll('.result-close, .result-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            resultModal.remove();
            document.body.style.overflow = '';
        });
    });
    
    // 添加下载报告事件
    const downloadButton = resultModal.querySelector('.result-download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            generatePDF(result);
        });
    }
    
    // 添加结果样式
    if (!document.getElementById('evaluation-result-style')) {
        const style = document.createElement('style');
        style.id = 'evaluation-result-style';
        style.textContent = `
            .evaluation-result-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .result-container {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                overflow-y: auto;
                padding: 3rem;
                position: relative;
            }
            
            .result-close {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                font-size: 2.4rem;
                cursor: pointer;
                color: var(--gray-600);
                transition: color 0.3s ease;
            }
            
            .result-close:hover {
                color: var(--primary-color);
            }
            
            .result-header {
                display: flex;
                align-items: center;
                margin-bottom: 3rem;
            }
            
            .result-score-circle {
                width: 100px;
                height: 100px;
                margin-right: 2rem;
            }
            
            .circle-bg {
                fill: none;
                stroke: #eee;
                stroke-width: 3.8;
            }
            
            .circle-fill {
                fill: none;
                stroke: var(--primary-color);
                stroke-width: 3.8;
                stroke-linecap: round;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
            }
            
            .score-text {
                font-family: Arial, sans-serif;
                font-size: 10px;
                fill: var(--dark-color);
                font-weight: bold;
                text-anchor: middle;
            }
            
            .result-dimensions {
                margin-bottom: 3rem;
            }
            
            .result-dimension-item {
                margin-bottom: 1.5rem;
            }
            
            .dimension-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .dimension-score {
                font-weight: 600;
            }
            
            .dimension-bar {
                height: 10px;
                background-color: var(--gray-200);
                border-radius: 5px;
                overflow: hidden;
            }
            
            .dimension-fill {
                height: 100%;
                border-radius: 5px;
                transition: width 1s ease;
            }
            
            .result-conclusion, .result-recommendations {
                margin-bottom: 2rem;
            }
            
            .result-conclusion h4, .result-recommendations h4 {
                color: var(--primary-color);
                margin-bottom: 1rem;
            }
            
            .result-actions {
                display: flex;
                justify-content: flex-end;
                gap: 1.5rem;
                margin-top: 3rem;
            }
            
            .result-error pre {
                background-color: var(--gray-100);
                padding: 1.5rem;
                border-radius: 4px;
                overflow-x: auto;
                margin-top: 1.5rem;
            }
            
            @media (max-width: 576px) {
                .result-header {
                    flex-direction: column;
                    text-align: center;
                }
                
                .result-score-circle {
                    margin-right: 0;
                    margin-bottom: 1.5rem;
                }
                
                .result-actions {
                    flex-direction: column;
                }
                
                .result-actions button {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// 计算平均分数
function calculateAverageScore(dimensionScores) {
    const totalScore = dimensionScores.reduce((sum, dimension) => sum + dimension.score, 0);
    return Math.round(totalScore / dimensionScores.length);
}

// 生成PDF报告
function generatePDF(result) {
    // 这里需要引入jsPDF等库来生成PDF
    // 在实际应用中，可以使用jsPDF或者通过后端服务生成PDF
    alert('PDF报告生成功能正在开发中，敬请期待！');
}

// 当DOM加载完成后初始化评估API集成
document.addEventListener('DOMContentLoaded', initEvaluationAPI);

// ===== 评估系统完整部署流程 =====
/*
1. 创建项目目录结构:
   - backend/ (后端Node.js服务)
   - frontend/ (前端静态文件)

2. 后端部署:
   - 安装依赖: npm install express axios body-parser cors dotenv
   - 创建.env文件配置DeepSeek API密钥
   - 启动服务: node server.js

3. 前端部署:
   - 确保HTML文件引用了正确的JS和CSS文件
   - 修改API调用地址为实际部署的服务器地址

4. 系统架构优化:
   - 添加评估结果缓存机制，减少API调用
   - 实现用户认证和授权
   - 添加评估历史记录功能
   - 实现评估报告生成和下载功能

5. 功能扩展:
   - 添加评估模板管理
   - 实现数据可视化分析
   - 集成支付系统，提供付费高级评估服务
   - 建立评估知识库，持续优化评估模型
*/
