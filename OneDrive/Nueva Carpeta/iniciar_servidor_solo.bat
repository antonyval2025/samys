@echo off
REM ╔════════════════════════════════════════════════════════════════╗
REM ║  SERVIDOR API NODE.JS (SOLO API)                              ║
REM ║  Arranca solo el servidor de Base de Datos en Puerto 5001      ║
REM ╚════════════════════════════════════════════════════════════════╝

chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🚀 INICIANDO SERVIDOR API (Node.js)                          ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar que backend/node_modules existe
if not exist "backend\node_modules\" (
    echo ❌ ERROR: Las dependencias no están instaladas
    echo.
    echo Por favor ejecuta primero:
    echo   cd backend
    echo   npm install
    echo.
    pause
    exit /b 1
)

REM Limpiar procesos previos
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [1/1] 📡 Iniciando Servidor API (Puerto 5001)...
echo.

cd /d "%~dp0\backend"
npm start

pause
