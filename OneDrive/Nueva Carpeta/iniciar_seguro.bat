@echo off
REM ============================================================
REM  INICIAR SERVIDOR SEGURO - Gestor de Turnos v9.4
REM ============================================================

setlocal enabledelayedexpansion

cd /d "%~dp0"

color 0A
cls

echo.
echo ============================================================
echo   GESTOR DE TURNOS - Iniciador Seguro
echo ============================================================
echo.

REM Verificar archivos necesarios
set "error=0"

if not exist "servidor_turnos.py" (
    echo [ERROR] No se encuentra: servidor_turnos.py
    set "error=1"
)

if not exist "nuevo_cuadrante_mejorado.html" (
    echo [ERROR] No se encuentra: nuevo_cuadrante_mejorado.html
    set "error=1"
)

if "!error!"=="1" (
    echo.
    echo Verifica que todos los archivos esten en: %cd%
    echo.
    pause
    exit /b 1
)

echo [OK] Archivos necesarios encontrados
echo.

REM Verificar si Python está disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python no está instalado o no está en PATH
    echo.
    echo Soluciones:
    echo 1. Instala Python desde https://www.python.org
    echo 2. Asegúrate de marcar "Add Python to PATH" durante instalacion
    echo 3. Reinicia la computadora después de instalar Python
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%A in ('python --version 2^>^&1') do (
    echo [OK] %%A detectada
)
echo.

REM Verificar si el puerto 5001 está disponible
netstat -ano | findstr ":5001 " >nul 2>&1
if errorlevel 0 (
    REM Intenta obtener el PID del proceso
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":5001 "') do (
        set "PID=%%A"
    )
    if defined PID (
        echo [ADVERTENCIA] Puerto 5001 ya está en uso (PID: !PID!)
        echo.
        echo Opciones:
        echo 1. Presiona CTRL+C para cancelar
        echo 2. Presiona cualquier tecla para intentar de todas formas
        echo.
        pause
    )
)

echo.
echo ============================================================
echo Iniciando servidor Flask...
echo ============================================================
echo.

REM Iniciar servidor (bloqueante - como debe ser)
python servidor_turnos.py

REM Si llega aquí, el servidor fue detenido
echo.
echo Servidor detenido.
pause
