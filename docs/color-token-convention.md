# CSS Color Token 命名規範

> 適用於任何前端專案。把自己的色值填進 `:root`，命名規則照用。

---

## 命名格式

```
--color-[類別]-[修飾詞]
```

| 位置 | 說明 |
|---|---|
| `--color-` | 固定前綴，所有顏色 token 統一掛這個 |
| `[類別]` | 語意分類：`brand` / `bg` / `surface` / `text` |
| `[修飾詞]` | 可選，描述深淺或用途變體 |

---

## 四個類別

### `brand` — 品牌色
專案主色及其深淺變體。

```css
--color-brand           /* 主色，最常用 */
--color-brand-light     /* 淡化版，用於 hover 背景、標籤底色 */
--color-brand-dark      /* 加深版，用於文字、引言、邊框 */
```

### `bg` — 背景色
頁面層級的大面積背景，通常是深色或中性色。

```css
--color-bg              /* 最底層，全站頁面底色 */
--color-bg-raised       /* 稍淺一層，導覽列、頁尾、深色卡片 */
--color-bg-alt          /* 備用，與主底色形成微弱對比 */
```

### `surface` — 表面色
內容區塊的淺色底，通常是接近白色的暖/冷調。

```css
--color-surface         /* 標準內容區底色 */
--color-surface-soft    /* 更溫和的變體，卡片、引言框 */
```

### `text` — 文字色

```css
--color-text            /* 一般內文 */
--color-text-dark       /* 強調、標題 */
--color-text-muted      /* 次要說明、標籤 */
--color-text-inverse    /* 用於深色背景上的淺色文字 */
```

---

## :root 模板

直接複製，把 hex 換成你的品牌色：

```css
:root {
  /* Brand */
  --color-brand:        ;
  --color-brand-light:  ;
  --color-brand-dark:   ;

  /* Background */
  --color-bg:           ;
  --color-bg-raised:    ;
  --color-bg-alt:       ;

  /* Surface */
  --color-surface:      ;
  --color-surface-soft: ;

  /* Text */
  --color-text:         ;
  --color-text-dark:    ;
  --color-text-muted:   ;
  --color-text-inverse: ;
}
```

---

## 使用規則

**必須用 token，禁止硬寫 hex：**

```css
/* ✅ */
background: var(--color-brand);
color: var(--color-text-muted);

/* ❌ */
background: #ffcc00;
color: #4d4d4d;
```

**例外：`rgba()` 透明度**

CSS 變數無法直接放進 `rgba()` 的色版參數，此情況允許保留 hex：

```css
/* ✅ 允許 */
border: 1px solid rgba(255, 204, 0, 0.28);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**頁面 scope token**

單一頁面或元件專用的顏色，用有意義的前綴隔離，不納入全站 `:root`：

```css
/* 只在該頁面的 <style> 或專屬 .css 裡定義 */
:root {
  --lyrics-bg: #2a2a2a;
  --lyrics-accent: #f5dfa8;
}
```

---

## 常見錯誤

| 錯誤 | 問題 | 修正 |
|---|---|---|
| `--primary` | 語意不明，是文字色？背景色？ | `--color-brand` |
| `--text-color` 和 `--text-main` 並存 | 重複，造成混亂 | 合併成 `--color-text` |
| `--black` | 不知道是背景黑還是文字黑 | `--color-bg-raised` 或 `--color-text-dark` |
| `--gray` | 完全沒有語意 | 依用途改為 `--color-text-muted` 或 `--color-text-inverse` |
