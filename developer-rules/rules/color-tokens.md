---
description: 全站 CSS color token 一覽與使用規範。
alwaysApply: true
---

# 【顏色 Token 規範】全站 CSS 變數一覽

所有顏色**必須**透過以下 token 引用，**禁止**在 CSS / HTML inline style 硬寫 hex 值（`rgba()` 中的透明度變化除外）。

## Token 總表（定義於 `assets/css/style.css` `:root`）

### 品牌色
| Token | 值 | 用途 |
|---|---|---|
| `--color-brand` | `#ffcc00` | 主要強調色：按鈕、邊框、標題裝飾線 |
| `--color-brand-light` | `#fceea7` | 淡黃底色、hover 背景 |
| `--color-brand-dark` | `#4e492b` | 深棕黃文字、引言色 |

### 背景色
| Token | 值 | 用途 |
|---|---|---|
| `--color-bg` | `#0a0a0a` | 全站頁面底色 |
| `--color-bg-raised` | `#1a1a1a` | 導覽列、頁尾、深色卡片 |
| `--color-bg-alt` | `#fcfaf2` | 淺色替代底（不常用） |

### 表面色（淺色內容區）
| Token | 值 | 用途 |
|---|---|---|
| `--color-surface` | `#fffdf7` | section 底色 |
| `--color-surface-soft` | `#fff9e8` | 卡片、暖白底 |

### 文字色
| Token | 值 | 用途 |
|---|---|---|
| `--color-text` | `#333333` | 一般內文 |
| `--color-text-dark` | `#1a1a1a` | 強調、標題文字 |
| `--color-text-muted` | `#4d4d4d` | 次要說明文字 |
| `--color-text-inverse` | `#f4f4f4` | 深色背景上的淺色文字 |

## 廢除名稱（禁止再使用）

以下為舊命名，已全數替換，不得復用：

`--primary` `--accent` `--yellow` `--light-yellow` `--dark-yellow`
`--black` `--card-bg` `--deep-black` `--bg-alt`
`--surface` `--surface-soft`
`--text-color` `--text-main` `--text` `--text-muted` `--gray`

## 例外：`rgba()` 透明度變化

token 無法直接放入 `rgba()` 的色版參數，此情況保留 hex 硬寫：

```css
/* ✅ 允許 */
border: 1px solid rgba(255, 204, 0, 0.28);

/* ✅ 允許 */
background: var(--color-brand);

/* ❌ 禁止 */
background-color: #ffcc00;
```

## 頁面 / 套件 scope token

以下為特定頁面內部使用的 scope token，不屬於全站規範，**不可**在其他頁面引用：

- `--lyrics-*`（歌詞頁）
- `--njtw-*`（NJTW5 節目頁）
- `--access-*`（演唱會票務狀態）
