@echo off
REM ============================================================
REM  DIAGNÓSTICO DEL SISTEMA - Gestor de Turnos
REM ============================================================

setlocal enabledelayedexpansion

color 0E
cls

echo.
echo ============================================================
echo   DIAGNÓSTICO DEL SISTEMA - Gestor de Turnos
echo ============================================================
echo.

REM 1. Verificar archivos
echo [1/6] Verificando archivos necesarios...
echo.

set "missing=0"

if exist "servidor_turnos.py" (
    echo  [OK] servidor_turnos.py
) else (
    echo  [X] FALTA: servidor_turnos.py
    set "missing=1"
)

if exist "nuevo_cuadrante_mejorado.html" (
    echo  [OK] nuevo_cuadrante_mejorado.html
) else (
    echo  [X] FALTA: nuevo_cuadrante_mejorado.html
    set "missing=1"
)

if exist "servidor_turnos.exe" (
    for /F "usebackq" %%A in ('servidor_turnos.exe') do set "exe_size=%%~zA"
    if defined exe_size (
        echo  [OK] servidor_turnos.exe (!exe_size! bytes^)
    ) else (
        echo  [OK] servidor_turnos.exe (compilado^)
    )
) else (
    echo  [INFO] servidor_turnos.exe no presente (opcional^)
)

echo.

REM 2. Verificar Python
echo [2/6] Verificando Python...
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo  [X] Python NO está instalado
    echo  Solución: https://www.python.org/downloads/
) else (
    for /f "tokens=*" %%A in ('python --version 2^>^&1') do (
        echo  [OK] %%A
    )
)

echo.

REM 3. Verificar Flask
echo [3/6] Verificando Flask...
echo.

python -c "import flask; print(f'  [OK] Flask {flask.__version__}')" 2>nul
if errorlevel 1 (
    echo  [X] Flask NO está instalado
    echo  Solución: pip install flask
) 

echo.

REM 4. Verificar puerto 5001
echo [4/6] Verificando puerto 5001...
echo.

netstat -ano | findstr ":5001 " >nul 2>&1
if errorlevel 1 (
    echo  [OK] Puerto 5001 disponible
) else (
    echo  [ADVERTENCIA] Puerto 5001 ya está en uso
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr ":5001 "') do (
        echo  PID del proceso: %%A
    )
)

echo.

REM 5. Verificar espacio en disco
echo [5/6] Verificando espacio en disco...
echo.

for /f "tokens=*" %%A in ('wmic logicaldisk get name ^| findstr ":"') do (
    for /f "usebackq tokens=3" %%B in (`wmic logicaldisk get freespace ^| findstr "^[0-9]"`) do (
        set /a "free=%%B/1024/1024"
        echo  [OK] !free! MB disponibles en %%A
    )
)

echo.

REM 6. Verificar conectividad
echo [6/6] Verificando conectividad de red...
echo.

ping -n 1 127.0.0.1 >nul 2>&1
if errorlevel 1 (
    echo  [X] Problema con loopback 127.0.0.1
) else (
    echo  [OK] Loopback (127.0.0.1) funciona
)

echo.
echo ============================================================
echo RESUMEN DE DIAGNÓSTICO
echo ============================================================
echo.

if "!missing!"=="1" (
    echo [CRÍTICO] Faltan archivos necesarios
    echo Solución: Verifica que estés en la carpeta correcta
) else (
    echo [OK] Archivos: Todos presentes
    
    python --version >nul 2>&1
    if errorlevel 1 (
        echo [CRÍTICO] Python: No instalado
    ) else (
        echo [OK] Python: Instalado
    )
    
    python -c "import flask" >nul 2>&1
    if errorlevel 1 (
        echo [ADVERTENCIA] Flask: No instalado
        echo             Instala con: pip install flask
    ) else (
        echo [OK] Flask: Instalado
    )
)

echo.
echo RECOMENDACIÓN:
echo.
if "!missing!"=="0" (
    python --version >nul 2>&1
    if errorlevel 0 (
        python -c "import flask" >nul 2>&1
        if errorlevel 0 (
            echo ✓ Tu sistema está listo para iniciar
            echo   Usa: iniciar_simple.bat
        ) else (
            echo ⚠ Instala Flask primero: pip install flask
        )
    )
) else (
    echo ✗ Resuelve los errores antes de continuar
)

echo.
pause
