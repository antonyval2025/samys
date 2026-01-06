@echo off
REM ============================================================
REM  AUTO-INSTALLER - Detecta y configura el entorno
REM ============================================================

setlocal enabledelayedexpansion

color 0A
cls

echo.
echo ============================================================
echo  AUTO-INSTALLER - Gestor de Turnos
echo ============================================================
echo.

REM 1. Detectar Python
echo Buscando Python...

python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo [ERROR] Python no está instalado
    echo.
    echo Soluciones:
    echo.
    echo 1. Descarga Python desde:
    echo    https://www.python.org/downloads/
    echo.
    echo 2. Durante la instalacion:
    echo    ✓ Marca "Add Python to PATH"
    echo.
    echo 3. Haz clic en "Install Now"
    echo.
    echo 4. Reinicia tu PC
    echo.
    echo 5. Vuelve a ejecutar este script
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%A in ('python --version 2^>^&1') do (
    echo [OK] %%A
)

echo.
echo Verificando Flask...

python -c "import flask; print(f'[OK] Flask {flask.__version__}')" 2>nul
if errorlevel 1 (
    echo [INFO] Flask no está instalado. Instalando...
    echo.
    
    pip install flask --upgrade
    
    if errorlevel 1 (
        echo.
        echo [ERROR] No se pudo instalar Flask
        echo Intenta manualmente: pip install flask
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo [OK] Flask instalado correctamente
)

echo.
echo ============================================================
echo Entorno listo!
echo ============================================================
echo.
echo Puedes usar cualquiera de estos scripts:
echo.
echo   START.bat ..................... Lo más simple
echo   diagnostico.bat ............... Revisar sistema
echo   iniciar_seguro.bat ............ Con validaciones
echo.
echo Presiona cualquier tecla para cerrar...
echo.

pause
