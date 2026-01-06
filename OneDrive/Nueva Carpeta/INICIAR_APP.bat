@echo off
REM ╔════════════════════════════════════════════════════════════════╗
REM ║  GESTOR DE TURNOS - INICIALIZACIÓN                             ║
REM ╚════════════════════════════════════════════════════════════════╝

color 0A
chcp 65001 >nul 2>&1
cls
cd /d "%~dp0"

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  VERIFICANDO REQUISITOS...                                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar Node.js
echo Buscando Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ERROR: Node.js NO está instalado
    echo.
    echo Descarga desde: https://nodejs.org
    echo Después reinicia esta ventana.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js encontrado: %%i
)

REM Verificar Python
echo Buscando Python...
python --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ERROR: Python NO está instalado
    echo.
    echo Descarga desde: https://www.python.org
    echo Después reinicia esta ventana.
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do echo ✅ Python encontrado: %%i
)

REM Verificar backend/node_modules
echo Buscando dependencias (backend/node_modules)...
if not exist "backend\node_modules\" (
    echo.
    echo ❌ ERROR: npm packages NO instalados
    echo.
    echo Abre PowerShell y ejecuta:
    echo   cd backend
    echo   npm install
    echo.
    echo Después reinicia este script.
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Dependencies instaladas
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✅ TODOS LOS REQUISITOS ESTÁN OK                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Matar procesos anteriores
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo.
echo 🚀 INICIANDO SERVIDORES...
echo.
echo [1/2] Abriendo SERVIDOR API (Puerto 5001)...
start "SERVIDOR API - Puerto 5001" /D "%cd%\backend" cmd /c npm start
timeout /t 3 /nobreak >nul

echo [2/2] Abriendo SERVIDOR FRONTEND (Puerto 8000)...
start "SERVIDOR FRONTEND - Puerto 8000" /D "%cd%" cmd /c python -m http.server 8000 --directory .
timeout /t 2 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✅ SERVIDORES INICIADOS                                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📌 IMPORTANTE:
echo   - Debes ver 2 ventanas negras abiertas (no las cierres)
echo   - En 3 segundos se abrirá el navegador
echo   - Si el navegador no abre, entra a:
echo     http://localhost:8000/nuevo_cuadrante_mejorado.html
echo.
echo 🔗 DIRECCIONES:
echo   - API:  http://localhost:5001/health
echo   - App:  http://localhost:8000
echo.

timeout /t 3 /nobreak >nul

echo 🌍 Abriendo navegador...
start http://localhost:8000/nuevo_cuadrante_mejorado.html

echo.
echo ✅ ¡Listo! Las ventanas de los servidores deben estar abiertas.
echo.
timeout /t 5 /nobreak >nul

exit /b 0
