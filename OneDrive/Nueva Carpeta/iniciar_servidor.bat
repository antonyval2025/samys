@echo off
chcp 65001 > nul
cls

echo ╔════════════════════════════════════════════════════════════════╗
echo ║  📦 INSTALANDO SERVIDOR DE TURNOS                              ║
echo ╚════════════════════════════════════════════════════════════════╝

cd /d "%~dp0backend"

echo.
echo ⏳ Instalando dependencias (express, cors)...
echo.

call npm install express cors

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ ERROR: No se pudieron instalar las dependencias
    echo Asegúrate de tener Node.js instalado: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  🚀 INICIANDO SERVIDOR EN http://localhost:5001                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

node server.js

pause

REM Sistema de Gestión de Turnos - Iniciador de Servidor
REM Detecta Python automáticamente (sin dependencias necesarias)

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo Sistema de Gestion de Turnos
echo ========================================
echo.

REM Detectar si Python está instalado
where python >nul 2>nul
if %errorlevel% neq 0 (
    REM Python no está en PATH, buscar en ubicaciones comunes
    if exist "C:\Python311\python.exe" (
        set PYTHON=C:\Python311\python.exe
    ) else if exist "C:\Python310\python.exe" (
        set PYTHON=C:\Python310\python.exe
    ) else if exist "C:\Python39\python.exe" (
        set PYTHON=C:\Python39\python.exe
    ) else if exist "C:\Program Files\Python311\python.exe" (
        set PYTHON=C:\Program Files\Python311\python.exe
    ) else (
        set PYTHON=
    )
) else (
    set PYTHON=python
)

REM Si no encuentra Python, mostrar alternativas
if "!PYTHON!"=="" (
    echo.
    echo ❌ ERROR: Python no está instalado
    echo.
    echo Opciones:
    echo.
    echo 1. Descargar e instalar Python desde:
    echo    https://www.python.org/downloads/
    echo    IMPORTANTE: Marca "Add Python to PATH"
    echo.
    echo 2. Si tienes servidor_turnos.exe, úsalo directamente
    echo.
    echo 3. Si tienes Node.js:
    echo    npm install -g http-server
    echo    http-server -p 8000
    echo.
    pause
    exit /b 1
)

REM Detener procesos anteriores
echo.
echo Deteniendo procesos anteriores...
taskkill /F /IM python.exe >nul 2>nul
timeout /t 1 /nobreak >nul

REM Iniciar servidor
echo.
echo Iniciando servidor HTTP en puerto 8000...
echo.
echo ✓ Accede a: http://localhost:8000/nuevo_cuadrante_mejorado.html
echo.
echo ⚠️  Presiona CTRL+C para detener
echo.
echo ========================================
echo.

REM Ejecutar servidor
if "!PYTHON!"=="python" (
    python -m http.server 8000
) else (
    "!PYTHON!" -m http.server 8000
)

echo.
echo ✓ Servidor detenido
pause
