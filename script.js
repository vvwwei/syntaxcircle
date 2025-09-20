let canvas;
let isAnimating = true;
let circles = [];
let connection = { active: true, from: 'circle3', to: 'circle4', color: '#8e44ad' };

// 預設文字內容
const defaultTexts = [
    'SYNTAX',
    'INTERNATIONAL', 
    'COMPARATIVE',
    'NP VP AP NP  COMP  '
];

class Circle {
    constructor(id, text, speed, color, radius, x = 0, y = 0) {
        this.id = id;
        this.text = text;
        this.speed = speed;
        this.color = color;
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.syncTarget = null;
    }

    update() {
        if (isAnimating && !this.syncTarget) {
            this.angle += this.speed * 0.02;
        } else if (this.syncTarget) {
            const target = circles.find(c => c.id === this.syncTarget);
            if (target) {
                this.angle = target.angle;
                this.speed = target.speed;
            }
        }
    }

    draw() {
        push();
        translate(width / 2 + this.x, height / 2 + this.y);
        
        stroke(this.color);
        strokeWeight(4); // 加粗所有圓圈邊緣線
        fill('rgba(255,255,255,0.1)');
        ellipse(0, 0, this.radius * 2, this.radius * 2);
        
        if (this.text) {
            this.drawTextOnCircle();
        }
        
        pop();
    }

    drawTextOnCircle() {
        const chars = this.text.split('');
        
        // 設定統一的字體大小
        const fontSize = 28; // 所有圓形使用相同字體大小
        
        // 設定字體樣式
        textSize(fontSize);
        textFont('Arial, Microsoft JhengHei');
        textStyle(BOLD);
        
        // 以第三個圓圈（半徑150）為基礎，計算統一的字母間距
        const baseRadius = 150; // 第三個圓圈的半徑
        const baseSpacing = 0.5; // 基礎間距
        // 計算第三個圓圈的絕對弧長間距
        const arcLength = (TWO_PI * baseRadius * baseSpacing) / chars.length;
        // 所有圓形使用相同的絕對弧長間距
        const angleStep = arcLength / this.radius;
        
        // 設定文字樣式（移除陰影效果）
        fill(this.color);
        noStroke();
        textAlign(CENTER, BASELINE); // 使用 BASELINE 對齊
        
        // 繪製文字在圓形內側
        for (let i = 0; i < chars.length; i++) {
            const charAngle = this.angle + i * angleStep;
            // 將文字位置設定在圓形內側，保持適當間隔
            const textRadius = this.radius - fontSize * 1.2; // 增加間隔距離
            const x = cos(charAngle) * textRadius;
            const y = sin(charAngle) * textRadius;
            
            push();
            translate(x, y);
            rotate(charAngle + PI / 2);
            text(chars[i], 0, 0);
            pop();
        }
    }

    getPosition() {
        return {
            x: width / 2 + this.x,
            y: height / 2 + this.y
        };
    }
}

function setup() {
    // 響應式畫布大小設定
    let canvasWidth, canvasHeight;
    let isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 手機版：保持正方形比例，確保穩定顯示
        const availableWidth = window.innerWidth - 40; // 增加邊距
        const availableHeight = Math.max(250, window.innerHeight * 0.55); // 確保最小高度
        
        // 使用較小的尺寸作為畫布大小，但設定合理的最小值
        const canvasSize = Math.max(280, Math.min(availableWidth, availableHeight));
        canvasWidth = canvasSize;
        canvasHeight = canvasSize;
    } else {
        // 桌面版：原有設定
        canvasWidth = window.innerWidth - 350;
        canvasHeight = window.innerHeight;
    }
    
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-placeholder');
    
    // 根據螢幕大小調整圓形尺寸
    if (isMobile) {
        // 手機版：適當的圓形大小，不要太小
        const scaleFactor = Math.max(0.4, canvasWidth / 600); // 最小縮放到40%，避免圓形太小
        circles = [
            new Circle('circle1', defaultTexts[0], 1, '#000000', Math.floor(180 * scaleFactor)),
            new Circle('circle2', defaultTexts[1], -0.8, '#000000', Math.floor(140 * scaleFactor)),
            new Circle('circle3', defaultTexts[2], 1.5, '#000000', Math.floor(100 * scaleFactor)),
            new Circle('circle4', defaultTexts[3], -2, '#8e44ad', Math.floor(70 * scaleFactor), Math.floor(12 * scaleFactor), 0)
        ];
    } else {
        // 桌面版：原有尺寸
        circles = [
            new Circle('circle1', defaultTexts[0], 1, '#000000', 250),
            new Circle('circle2', defaultTexts[1], -0.8, '#000000', 200),
            new Circle('circle3', defaultTexts[2], 1.5, '#000000', 150),
            new Circle('circle4', defaultTexts[3], -2, '#8e44ad', 100, 15, 0)
        ];
    }
    
    setupEventListeners();
    
    // 手機版調整控制項範圍
    if (isMobile) {
        adjustMobileControlRanges();
    }
}

function adjustMobileControlRanges() {
    // 調整半徑滑桿的最大值以適應手機螢幕
    const maxRadius = Math.min(canvas.width, canvas.height) / 3; // 畫布的1/3作為最大半徑
    
    document.querySelectorAll('.radius-slider').forEach(slider => {
        slider.max = Math.floor(maxRadius);
        slider.min = 20; // 設定最小半徑
    });
    
    // 調整位置滑桿的範圍
    const maxPosition = Math.min(canvas.width, canvas.height) / 4; // 畫布的1/4作為最大位移
    
    document.querySelectorAll('.x-pos-slider, .y-pos-slider').forEach(slider => {
        slider.min = -Math.floor(maxPosition);
        slider.max = Math.floor(maxPosition);
    });
}

function draw() {
    background(255);
    
    for (let circle of circles) {
        circle.update();
        circle.draw();
    }
    
    drawConnection();
}

function drawConnection() {
    if (connection.active && connection.from && connection.to) {
        const fromCircle = circles.find(c => c.id === connection.from);
        const toCircle = circles.find(c => c.id === connection.to);
        
        if (fromCircle && toCircle) {
            const fromCenter = fromCircle.getPosition();
            const toCenter = toCircle.getPosition();
            
            // 計算兩個圓心之間的基礎角度
            const dx = toCenter.x - fromCenter.x;
            const dy = toCenter.y - fromCenter.y;
            const baseAngle = atan2(dy, dx);
            
            // 計算連接點（在圓形邊界內部，跟隨旋轉）
            // 從起始圓形：使用當前旋轉角度 + 面向目標的角度
            const fromConnectionAngle = fromCircle.angle + baseAngle;
            const fromRadius = fromCircle.radius * 0.8; // 連接點在邊界內部
            const fromX = fromCenter.x + cos(fromConnectionAngle) * fromRadius;
            const fromY = fromCenter.y + sin(fromConnectionAngle) * fromRadius;
            
            // 到目標圓形：使用當前旋轉角度 + 面向起始的角度
            const toConnectionAngle = toCircle.angle + baseAngle + PI; // 加PI表示相反方向
            const toRadius = toCircle.radius * 0.8; // 連接點在邊界內部
            const toX = toCenter.x + cos(toConnectionAngle) * toRadius;
            const toY = toCenter.y + sin(toConnectionAngle) * toRadius;
            
            push();
            stroke(connection.color);
            strokeWeight(3);
            line(fromX, fromY, toX, toY);
            pop();
        }
    }
}

function setupEventListeners() {
    circles.forEach((circle, index) => {
        const groupId = circle.id;
        const group = document.getElementById(groupId);
        
        const textInput = group.querySelector('.text-input');
        const speedSlider = group.querySelector('.speed-slider');
        const speedValue = group.querySelector('.speed-value');
        const colorPicker = group.querySelector('.color-picker');
        const radiusSlider = group.querySelector('.radius-slider');
        const radiusValue = group.querySelector('.radius-value');
        const xPosSlider = group.querySelector('.x-pos-slider');
        const xPosValue = group.querySelector('.x-pos-value');
        const yPosSlider = group.querySelector('.y-pos-slider');
        const yPosValue = group.querySelector('.y-pos-value');
        const syncTarget = group.querySelector('.sync-target');
        
        textInput.addEventListener('input', (e) => {
            circle.text = e.target.value;
        });
        
        speedSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            circle.speed = value;
            speedValue.textContent = value.toFixed(1);
        });
        
        colorPicker.addEventListener('input', (e) => {
            circle.color = e.target.value;
        });
        
        radiusSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            circle.radius = value;
            radiusValue.textContent = value;
        });
        
        xPosSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            circle.x = value;
            xPosValue.textContent = value;
        });
        
        yPosSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            circle.y = value;
            yPosValue.textContent = value;
        });
        
        syncTarget.addEventListener('change', (e) => {
            const targetId = e.target.value;
            if (targetId === 'none') {
                circle.syncTarget = null;
                group.classList.remove('synced');
                enableControls(group);
            } else {
                circle.syncTarget = targetId;
                group.classList.add('synced');
                disableControls(group);
            }
        });
    });
    
    document.getElementById('play-pause-btn').addEventListener('click', () => {
        isAnimating = !isAnimating;
        document.getElementById('play-pause-btn').textContent = isAnimating ? '暫停' : '開始';
    });
    
    document.getElementById('reset-btn').addEventListener('click', () => {
        circles.forEach(circle => {
            circle.angle = 0;
        });
        
        document.querySelectorAll('.circle-group').forEach(group => {
            group.classList.remove('synced');
            enableControls(group);
        });
        
        document.querySelectorAll('.sync-target').forEach(select => {
            select.value = 'none';
        });
        
        circles.forEach(circle => {
            circle.syncTarget = null;
        });
        
        // 根據螢幕大小設定預設值
        let defaultValues;
        if (window.innerWidth <= 768) {
            // 手機版：使用適當大小，避免太小
            const scaleFactor = Math.max(0.4, canvas.width / 600);
            defaultValues = [
                { text: defaultTexts[0], speed: 1, color: '#000000', radius: Math.floor(180 * scaleFactor), x: 0, y: 0 },
                { text: defaultTexts[1], speed: -0.8, color: '#000000', radius: Math.floor(140 * scaleFactor), x: 0, y: 0 },
                { text: defaultTexts[2], speed: 1.5, color: '#000000', radius: Math.floor(100 * scaleFactor), x: 0, y: 0 },
                { text: defaultTexts[3], speed: -2, color: '#8e44ad', radius: Math.floor(70 * scaleFactor), x: Math.floor(12 * scaleFactor), y: 0 }
            ];
        } else {
            // 桌面版：原始尺寸
            defaultValues = [
                { text: defaultTexts[0], speed: 1, color: '#000000', radius: 250, x: 0, y: 0 },
                { text: defaultTexts[1], speed: -0.8, color: '#000000', radius: 200, x: 0, y: 0 },
                { text: defaultTexts[2], speed: 1.5, color: '#000000', radius: 150, x: 0, y: 0 },
                { text: defaultTexts[3], speed: -2, color: '#8e44ad', radius: 100, x: 15, y: 0 }
            ];
        }
        
        circles.forEach((circle, index) => {
            const defaults = defaultValues[index];
            circle.text = defaults.text;
            circle.speed = defaults.speed;
            circle.color = defaults.color;
            circle.radius = defaults.radius;
            circle.x = defaults.x;
            circle.y = defaults.y;
            
            const group = document.getElementById(circle.id);
            group.querySelector('.text-input').value = defaults.text;
            group.querySelector('.speed-slider').value = defaults.speed;
            group.querySelector('.speed-value').textContent = defaults.speed.toFixed(1);
            group.querySelector('.color-picker').value = defaults.color;
            group.querySelector('.radius-slider').value = defaults.radius;
            group.querySelector('.radius-value').textContent = defaults.radius;
            group.querySelector('.x-pos-slider').value = defaults.x;
            group.querySelector('.x-pos-value').textContent = defaults.x;
            group.querySelector('.y-pos-slider').value = defaults.y;
            group.querySelector('.y-pos-value').textContent = defaults.y;
        });
        
        connection.active = false;
        document.getElementById('connection-from').value = 'none';
        document.getElementById('connection-to').value = 'none';
    });
    
    document.getElementById('connection-from').addEventListener('change', updateConnection);
    document.getElementById('connection-to').addEventListener('change', updateConnection);
    document.getElementById('connection-color').addEventListener('input', (e) => {
        connection.color = e.target.value;
    });
    
    document.getElementById('toggle-connection').addEventListener('click', () => {
        connection.active = !connection.active;
        document.getElementById('toggle-connection').textContent = 
            connection.active ? '關閉連結線' : '開啟連結線';
    });
    
    // 匯出功能事件監聽器
    setupExportListeners();
}

function setupExportListeners() {
    const exportFormat = document.getElementById('export-format');
    const gifOptions = document.querySelector('.gif-options');
    const gifDuration = document.getElementById('gif-duration');
    const gifDurationValue = document.getElementById('gif-duration-value');
    const exportBtn = document.getElementById('export-btn');
    const exportStatus = document.getElementById('export-status');
    
    // 格式選擇變更
    exportFormat.addEventListener('change', (e) => {
        if (e.target.value === 'frames' || e.target.value === 'mp4') {
            gifOptions.style.display = 'block';
        } else {
            gifOptions.style.display = 'none';
        }
    });
    
    // GIF 秒數調整
    gifDuration.addEventListener('input', (e) => {
        gifDurationValue.textContent = e.target.value;
    });
    
    // 匯出按鈕
    exportBtn.addEventListener('click', () => {
        const format = exportFormat.value;
        if (format === 'png') {
            exportPNG();
        } else if (format === 'mp4') {
            exportMP4(parseInt(gifDuration.value));
        } else if (format === 'frames') {
            exportFrames(parseInt(gifDuration.value));
        }
    });
    
    function exportPNG() {
        showExportStatus('正在產生圖片...', 'loading');
        exportBtn.disabled = true;
        
        setTimeout(() => {
            try {
                canvas.canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `圓形動畫_${new Date().getTime()}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    showExportStatus('PNG 圖片下載完成！', 'success');
                    exportBtn.disabled = false;
                }, 'image/png');
            } catch (error) {
                showExportStatus('圖片匯出失敗', 'error');
                exportBtn.disabled = false;
            }
        }, 100);
    }
    
    function exportMP4(duration) {
        showExportStatus('正在錄製高畫質影片...', 'loading');
        exportBtn.disabled = true;
        
        // 檢查瀏覽器支援的格式
        let mimeType, fileExtension;
        if (MediaRecorder.isTypeSupported('video/mp4; codecs="avc1.42E01E"')) {
            mimeType = 'video/mp4; codecs="avc1.42E01E"';
            fileExtension = 'mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm; codecs="vp9"')) {
            mimeType = 'video/webm; codecs="vp9"';
            fileExtension = 'webm';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
            mimeType = 'video/webm';
            fileExtension = 'webm';
        } else {
            showExportStatus('瀏覽器不支援影片錄製，請嘗試其他格式', 'error');
            exportBtn.disabled = false;
            return;
        }
        
        try {
            // 獲取畫布的媒體流
            const stream = canvas.canvas.captureStream(60); // 提高到60fps
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: 8000000 // 提高到8Mbps 超高品質
            });
            
            const chunks = [];
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `圓形動畫_${new Date().getTime()}.${fileExtension}`;
                a.click();
                URL.revokeObjectURL(url);
                
                showExportStatus(`${fileExtension.toUpperCase()} 影片下載完成！`, 'success');
                exportBtn.disabled = false;
            };
            
            mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                showExportStatus('MP4 錄製失敗，請嘗試其他格式', 'error');
                exportBtn.disabled = false;
            };
            
            // 開始錄製
            mediaRecorder.start();
            
            // 顯示錄製進度
            let recordingTime = 0;
            const progressInterval = setInterval(() => {
                recordingTime++;
                const progress = Math.round((recordingTime / duration) * 100);
                showExportStatus(`錄製中... ${Math.min(progress, 100)}%`, 'loading');
                
                if (recordingTime >= duration) {
                    clearInterval(progressInterval);
                    showExportStatus('正在處理 MP4 檔案...', 'loading');
                    mediaRecorder.stop();
                }
            }, 1000);
            
        } catch (error) {
            console.error('MP4 export error:', error);
            showExportStatus('MP4 匯出失敗：' + error.message, 'error');
            exportBtn.disabled = false;
        }
    }
    
    function exportFrames(duration) {
        showExportStatus('正在產生影格序列...', 'loading');
        exportBtn.disabled = true;
        
        const fps = 10;
        const totalFrames = duration * fps;
        let frameCount = 0;
        const captureInterval = 100;
        
        function captureFrame() {
            if (frameCount < totalFrames) {
                canvas.canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `圓形動畫_frame_${String(frameCount + 1).padStart(3, '0')}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    
                    frameCount++;
                    const progress = Math.round((frameCount / totalFrames) * 100);
                    showExportStatus(`匯出影格 ${frameCount}/${totalFrames} (${progress}%)`, 'loading');
                    
                    setTimeout(captureFrame, captureInterval);
                }, 'image/png');
            } else {
                showExportStatus(`已成功匯出 ${totalFrames} 張影格！`, 'success');
                exportBtn.disabled = false;
            }
        }
        
        setTimeout(captureFrame, 100);
    }
    
    
    function showExportStatus(message, type) {
        exportStatus.textContent = message;
        exportStatus.className = type;
        exportStatus.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                exportStatus.style.display = 'none';
            }, 3000);
        }
    }
}

function updateConnection() {
    const from = document.getElementById('connection-from').value;
    const to = document.getElementById('connection-to').value;
    
    if (from !== 'none' && to !== 'none' && from !== to) {
        connection.from = from;
        connection.to = to;
        connection.active = true;
        document.getElementById('toggle-connection').textContent = '關閉連結線';
    } else {
        connection.active = false;
        document.getElementById('toggle-connection').textContent = '開啟連結線';
    }
}

function disableControls(group) {
    const inputs = group.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (!input.classList.contains('sync-target')) {
            input.disabled = true;
        }
    });
}

function enableControls(group) {
    const inputs = group.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// 防抖動變數
let resizeTimeout;

function windowResized() {
    // 使用防抖動，避免頻繁調整造成卡頓
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        actualWindowResize();
    }, 150);
}

function actualWindowResize() {
    // 響應式視窗大小調整
    let canvasWidth, canvasHeight;
    let isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // 手機版：保持正方形比例，確保穩定顯示
        const availableWidth = window.innerWidth - 40;
        const availableHeight = Math.max(250, window.innerHeight * 0.55);
        
        // 使用較小的尺寸作為畫布大小，但設定合理的最小值
        const canvasSize = Math.max(280, Math.min(availableWidth, availableHeight));
        canvasWidth = canvasSize;
        canvasHeight = canvasSize;
    } else {
        // 桌面版
        canvasWidth = window.innerWidth - 350;
        canvasHeight = window.innerHeight;
    }
    
    resizeCanvas(canvasWidth, canvasHeight);
    
    // 重新調整圓形大小
    if (isMobile) {
        const scaleFactor = Math.max(0.4, canvasWidth / 600); // 確保不會太小
        circles[0].radius = Math.floor(180 * scaleFactor);
        circles[1].radius = Math.floor(140 * scaleFactor);
        circles[2].radius = Math.floor(100 * scaleFactor);
        circles[3].radius = Math.floor(70 * scaleFactor);
        circles[3].x = Math.floor(12 * scaleFactor);
    } else {
        // 桌面版恢復原始大小
        circles[0].radius = 250;
        circles[1].radius = 200;
        circles[2].radius = 150;
        circles[3].radius = 100;
        circles[3].x = 15;
    }
    
    // 更新HTML控制項的顯示值
    updateControlValues();
    
    // 手機版調整控制項範圍
    if (isMobile) {
        adjustMobileControlRanges();
    }
}

function updateControlValues() {
    circles.forEach((circle, index) => {
        const group = document.getElementById(circle.id);
        if (group) {
            const radiusSlider = group.querySelector('.radius-slider');
            const radiusValue = group.querySelector('.radius-value');
            const xPosSlider = group.querySelector('.x-pos-slider');
            const xPosValue = group.querySelector('.x-pos-value');
            
            if (radiusSlider && radiusValue) {
                radiusSlider.value = circle.radius;
                radiusValue.textContent = circle.radius;
            }
            
            if (xPosSlider && xPosValue) {
                xPosSlider.value = circle.x;
                xPosValue.textContent = circle.x;
            }
        }
    });
}
