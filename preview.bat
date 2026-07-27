@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo  ═══════════════════════════════════════
echo   水晶男孩推廣部 — 本地預覽
echo   網址：http://127.0.0.1:5501
echo   關閉此視窗 = 停止預覽
echo  ═══════════════════════════════════════
echo.

where py >nul 2>&1
if %errorlevel%==0 (
    start "" "http://127.0.0.1:5501/index.html"
    py -m http.server 5501
    goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
    start "" "http://127.0.0.1:5501/index.html"
    python -m http.server 5501
    goto :eof
)

echo [錯誤] 找不到 Python。請安裝 Python 後再試，或使用 Cursor：Ctrl+Shift+P →「預覽網站」
pause
