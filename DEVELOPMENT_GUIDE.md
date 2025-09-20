# 圓形動畫專案開發指導

## 📋 目錄

- [專案概述](#專案概述)
- [技術架構](#技術架構)
- [開發環境設定](#開發環境設定)
- [檔案結構詳解](#檔案結構詳解)
- [核心功能說明](#核心功能說明)
- [自定義指導](#自定義指導)
- [最佳實踐](#最佳實踐)
- [故障排除](#故障排除)

---

## 🎯 專案概述

互動式圓形動畫是一個基於 p5.js 的網頁應用程式，提供四個可控制的同心圓動畫效果。使用者可以即時調整文字內容、旋轉速度、顏色、大小和位置，並支援圓形間的同步和連結線功能。

### 主要特色
- ✨ 四個獨立可控的圓形動畫
- 🎨 即時視覺控制介面
- 🔗 圓形間連結線效果
- 🔄 同步功能支援
- 📱 響應式設計

---

## 🏗️ 技術架構

### 前端技術棧
```
HTML5 + CSS3 + JavaScript (ES6+)
└── p5.js 圖形函式庫 (v1.7.0)
```

### 核心組件架構
```
Application
├── Circle Class (圓形物件)
├── Animation Loop (動畫循環)
├── Event Handlers (事件處理)
└── UI Controls (介面控制)
```

---

## ⚙️ 開發環境設定

### 最低需求
- 現代瀏覽器 (Chrome 90+, Firefox 88+, Safari 14+)
- 文字編輯器或 IDE
- 本地 HTTP 伺服器 (可選，建議用於開發)

### 快速啟動
1. 複製專案檔案到本地目錄
2. 使用瀏覽器開啟 `index.html`
3. 或啟動本地伺服器：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx serve .
   ```

---

## 📁 檔案結構詳解

```
circle-language/
├── index.html          # 主頁面檔案
├── script.js           # JavaScript 邏輯
├── style.css           # CSS 樣式
├── README.md           # 專案說明
├── DEVELOPMENT_GUIDE.md # 開發指導 (本檔案)
└── .cursor/            # Cursor IDE 規則
    └── rules/
        ├── git-commit-push.mdc
        ├── project-structure.mdc
        └── coding-standards.mdc
```

### 檔案職責說明

#### `index.html`
- **用途**：主要 HTML 結構
- **包含**：控制面板、畫布容器、p5.js 引入
- **特色**：完整的中文介面、響應式佈局

#### `script.js`
- **用途**：核心動畫和互動邏輯
- **主要類別**：
  - `Circle`: 圓形物件管理
- **主要函式**：
  - `setup()`: p5.js 初始化
  - `draw()`: 動畫循環
  - `setupEventListeners()`: 事件綁定

#### `style.css`
- **用途**：視覺樣式和響應式設計
- **特色**：現代化設計、漸層效果、平滑動畫

---

## 🔧 核心功能說明

### Circle 類別
```javascript
class Circle {
    constructor(id, text, speed, color, radius, x, y)
    update()              // 更新動畫狀態
    draw()                // 繪製圓形和文字
    drawTextOnCircle()    // 文字沿圓形繪製
    getPosition()         // 取得圓形位置
}
```

### 動畫系統
- **更新循環**：每幀更新圓形角度和位置
- **同步機制**：目標圓形自動跟隨源圓形
- **文字渲染**：動態計算文字間距和大小

### 控制系統
- **即時更新**：所有控制項立即生效
- **狀態管理**：同步時自動禁用相關控制
- **視覺反饋**：提供清楚的狀態指示

---

## 🎨 自定義指導

### 添加新圓形
1. 在 `setup()` 中增加新的 Circle 實例
2. 在 HTML 中新增對應的控制組
3. 在 CSS 中定義樣式
4. 在事件監聽器中綁定控制項

### 修改預設值
```javascript
// 在 script.js 中修改
const defaultTexts = [
    '您的文字1',
    '您的文字2',
    '您的文字3',
    '您的文字4'
];
```

### 自定義顏色主題
```css
/* 在 style.css 中修改 */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### 調整動畫參數
```javascript
// 速度範圍調整
this.angle += this.speed * 0.02; // 修改 0.02 改變整體速度

// 文字大小範圍
const fontSize = map(this.radius, 100, 250, 20, 36); // 調整範圍
```

---

## 💡 最佳實踐

### 程式碼風格
- 使用 2 空格縮排
- 函式名稱使用駱駝式命名
- 變數名稱要有描述性
- 適當使用註解（簡潔為主）

### 效能優化
- 避免在 `draw()` 中創建新物件
- 使用 `push()/pop()` 保護變換狀態
- 合理使用圖形快取

### 使用者體驗
- 保持控制項的即時回饋
- 提供清楚的視覺狀態指示
- 確保響應式設計在各裝置正常運作

---

## 🐛 故障排除

### 常見問題

#### 1. 畫布不顯示
- **原因**：p5.js 未正確載入
- **解決**：檢查網路連線，確認 CDN 可存取

#### 2. 控制項無效果
- **原因**：事件監聽器未正確綁定
- **解決**：檢查 HTML 元素 ID 是否正確

#### 3. 文字顯示異常
- **原因**：字體載入問題或文字編碼
- **解決**：確認字體設定和 UTF-8 編碼

#### 4. 同步功能異常
- **原因**：圓形 ID 對應錯誤
- **解決**：檢查 `syncTarget` 設定和圓形陣列

### 除錯技巧
```javascript
// 在瀏覽器控制台檢查圓形狀態
console.log(circles);

// 檢查特定圓形屬性
console.log(circles[0].angle, circles[0].speed);

// 監控同步狀態
circles.forEach(c => console.log(c.id, c.syncTarget));
```

---

## 📚 進階開發

### 新功能建議
- 添加動畫預設組合
- 實現圓形軌跡記錄
- 支援動畫匯出功能
- 添加音頻同步功能

### 擴展方向
- 支援更多圓形數量
- 3D 圓形效果
- 粒子系統整合
- WebGL 加速渲染

---

## 🔒 版本控制

使用 Git 進行版本控制時，請注意：

- **不要**讓 AI 助手直接執行 git 操作
- **建議**手動執行以下命令序列：
  ```bash
  git add .
  git commit -m "描述性提交訊息"
  git push origin main
  ```

---

## 📞 支援

如需協助或有任何疑問，請：
1. 檢查本指導文件
2. 查看專案 README.md
3. 檢查瀏覽器控制台錯誤訊息
4. 確認所有檔案路徑正確

---

*最後更新：2024年9月*
