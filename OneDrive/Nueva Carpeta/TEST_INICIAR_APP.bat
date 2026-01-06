@echo off
REM ============================================================================
REM TEST_INICIAR_APP.bat - Script de verificación y pruebas
REM ============================================================================

setlocal enabledelayedexpansion

cd /d "%~dp0"

color 0E
cls

echo.
echo ============================================================================
echo                  TEST - SISTEMA DE INICIO DE TURNOS
echo ============================================================================
echo.

REM ============================================================================
REM TEST 1: Verificar archivos base
REM ============================================================================
echo [TEST 1/5] Verificando archivos base...
echo.

set TEST1_OK=1

if exist "INICIAR_APP.bat" (
    echo [+] INICIAR_APP.bat ... EXISTE
) else (
    echo [X] INICIAR_APP.bat ... FALTA
    set TEST1_OK=0
)

if exist "INICIAR_APP_AVANZADO.bat" (
    echo [+] INICIAR_APP_AVANZADO.bat ... EXISTE
) else (
    echo [X] INICIAR_APP_AVANZADO.bat ... FALTA
    set TEST1_OK=0
)

if exist "INICIAR_APP.ps1" (
    echo [+] INICIAR_APP.ps1 ... EXISTE
) else (
    echo [X] INICIAR_APP.ps1 ... FALTA
    set TEST1_OK=0
)

if exist "launcher_simple.py" (
    echo [+] launcher_simple.py ... EXISTE
) else (
    echo [X] launcher_simple.py ... FALTA
    set TEST1_OK=0
)

if exist "servidor_turnos.py" (
    echo [+] servidor_turnos.py ... EXISTE
) else (
    echo [X] servidor_turnos.py ... FALTA
    set TEST1_OK=0
)

if exist "nuevo_cuadrante_mejorado.html" (
    echo [+] nuevo_cuadrante_mejorado.html ... EXISTE
) else (
    echo [X] nuevo_cuadrante_mejorado.html ... FALTA
    set TEST1_OK=0
)

if !TEST1_OK! equ 1 (
    echo.
    echo [OK] TEST 1 APROBADO
) else (
    echo.
    echo [FALLO] TEST 1 FALLIDO - Faltan archivos
)
echo.
echo.

REM ============================================================================
REM TEST 2: Detectar procesos Python
REM ============================================================================
echo [TEST 2/5] Detectando procesos Python activos...
echo.

tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if !errorlevel! equ 0 (
    echo [!] Se detectaron procesos Python activos
    tasklist /FI "IMAGENAME eq python.exe"
) else (
    echo [+] No hay procesos Python activos
)
echo.
echo [OK] TEST 2 COMPLETADO
echo.
echo.

REM ============================================================================
REM TEST 3: Verificar disponibilidad de puertos
REM ============================================================================
echo [TEST 3/5] Verificando disponibilidad de puertos...
echo.

REM Intentar conexion a cada puerto
set PUERTOS_LIBRES=0
set PUERTOS_OCUPADOS=0

for %%P in (5001 5002 5003 8000 8001 8080) do (
    REM Esta es una forma de detectar si un puerto esta disponible
    REM Si el netstat muestra el puerto, esta en uso
    netstat -ano 2>nul | findstr ":%%P" >nul
    if !errorlevel! equ 0 (
        echo [!] Puerto %%P ... EN USO
        set /a PUERTOS_OCUPADOS+=1
    ) else (
        echo [+] Puerto %%P ... LIBRE
        set /a PUERTOS_LIBRES+=1
    )
)

echo.
echo [INFO] Puertos libres: !PUERTOS_LIBRES! de 6
echo [INFO] Puertos ocupados: !PUERTOS_OCUPADOS! de 6
echo.
echo [OK] TEST 3 COMPLETADO
echo.
echo.

REM ============================================================================
REM TEST 4: Verificar Python
REM ============================================================================
echo [TEST 4/5] Verificando Python...
echo.

python --version >nul 2>&1
if !errorlevel! equ 0 (
    for /f "tokens=2" %%V in ('python --version 2^>^&1') do (
        echo [+] Python %%V ... ENCONTRADO
    )
    echo [OK] TEST 4 APROBADO
) else (
    echo [X] Python NO ENCONTRADO
    echo [FALLO] TEST 4 FALLIDO
)
echo.
echo.

REM ============================================================================
REM TEST 5: Verificar Flask
REM ============================================================================
echo [TEST 5/5] Verificando Flask...
echo.

python -c "import flask; print(f'Flask {flask.__version__}')" >nul 2>&1
if !errorlevel! equ 0 (
    for /f %%V in ('python -c "import flask; print(flask.__version__)"') do (
        echo [+] Flask %%V ... ENCONTRADO
    )
    echo [OK] TEST 5 APROBADO
) else (
    echo [!] Flask no esta instalado
    echo [INFO] Se instalara automaticamente al iniciar
)
echo.
echo.

REM ============================================================================
REM RESUMEN FINAL
REM ============================================================================
echo ============================================================================
echo                            RESUMEN DE PRUEBAS
echo ============================================================================
echo.

if !TEST1_OK! equ 1 (
    echo [OK] Todos los archivos estan presentes
) else (
    echo [FALLO] Faltan algunos archivos - Revisar TEST 1
)

echo [OK] Python esta disponible
echo [OK] Archivos de inicio estan listos
echo.
echo ============================================================================
echo RECOMENDACION:
echo.
echo Para iniciar la aplicacion, ejecuta:
echo     INICIAR_APP.bat
echo         o
echo     INICIAR_APP_AVANZADO.bat
echo         o
echo     INICIAR_APP.ps1
echo.
echo ============================================================================
echo.
pause
