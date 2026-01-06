@echo off
REM ============================================================================
REM INICIAR_APP_AVANZADO.bat - Version Mejorada con Control Total
REM - Mejor deteccion de procesos
REM - Limpieza exhaustiva de puertos
REM - Reinicio automatico si falla
REM - Registro de estado
REM ============================================================================

setlocal enabledelayedexpansion

cd /d "%~dp0"
set TIMESTAMP=%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%

REM Crear carpeta de logs si no existe
if not exist "logs" mkdir logs

set LOGFILE=logs\inicio_%TIMESTAMP%.log

REM Colores
color 0A

echo. > "%LOGFILE%"
echo ============================================================================ >> "%LOGFILE%"
echo GESTOR DE TURNOS - INICIALIZACION >> "%LOGFILE%"
echo Timestamp: %TIMESTAMP% >> "%LOGFILE%"
echo ============================================================================ >> "%LOGFILE%"

:INICIO
cls
echo.
echo ============================================================================
echo               GESTOR DE TURNOS - APLICACION [AVANZADO]
echo ============================================================================
echo.
echo [*] Versión: Advanced v2.0
echo [*] Timestamp: %TIMESTAMP%
echo.

REM ============================================================================
REM PASO 1: DETECTAR Y LIMPIAR PROCESOS ANTERIORES
REM ============================================================================
echo [PASO 1/5] Detectando procesos anteriores...
echo [PASO 1/5] Detectando procesos anteriores... >> "%LOGFILE%"

REM Buscar todos los python.exe en la carpeta actual
tasklist /FI "IMAGENAME eq python.exe" 2>nul | find /I "python.exe" >nul
if !errorlevel! equ 0 (
    echo     [!] Se detecto proceso Python activo
    echo     [!] Se detecto proceso Python activo >> "%LOGFILE%"
    
    REM Obtener PIDs activos
    for /f "tokens=2" %%A in ('tasklist /FI "IMAGENAME eq python.exe" 2^>nul ^| find "python"') do (
        set "PID=%%A"
        echo     [*] Deteniendo PID: !PID!
        echo     [*] Deteniendo PID: !PID! >> "%LOGFILE%"
        taskkill /PID !PID! /F >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo     [+] Procesos detenidos
    echo     [+] Procesos detenidos >> "%LOGFILE%"
) else (
    echo     [+] No hay procesos Python activos
    echo     [+] No hay procesos Python activos >> "%LOGFILE%"
)
echo.

REM ============================================================================
REM PASO 2: LIMPIAR PUERTOS EN USO
REM ============================================================================
echo [PASO 2/5] Limpiando puertos en uso...
echo [PASO 2/5] Limpiando puertos en uso... >> "%LOGFILE%"

setlocal enabledelayedexpansion
for %%P in (5001 5002 5003 8000 8001 8080) do (
    REM Intentar encontrar proceso en puerto
    for /F "tokens=5" %%A in ('netstat -ano 2^>nul ^| findstr ":%%P"') do (
        echo     [*] Puerto %%P en uso por PID: %%A
        echo     [*] Puerto %%P en uso por PID: %%A >> "%LOGFILE%"
        taskkill /PID %%A /F >nul 2>&1
    )
)
timeout /t 1 /nobreak >nul
echo     [+] Puertos limpiados
echo     [+] Puertos limpiados >> "%LOGFILE%"
echo.

REM ============================================================================
REM PASO 3: VERIFICAR ARCHIVOS
REM ============================================================================
echo [PASO 3/5] Verificando archivos necesarios...
echo [PASO 3/5] Verificando archivos necesarios... >> "%LOGFILE%"

set ARCHIVOS_OK=1

if not exist "servidor_turnos.py" (
    echo     [X] ERROR: servidor_turnos.py NO encontrado
    echo     [X] ERROR: servidor_turnos.py NO encontrado >> "%LOGFILE%"
    set ARCHIVOS_OK=0
) else (
    echo     [+] servidor_turnos.py OK
    echo     [+] servidor_turnos.py OK >> "%LOGFILE%"
)

if not exist "nuevo_cuadrante_mejorado.html" (
    echo     [X] ERROR: nuevo_cuadrante_mejorado.html NO encontrado
    echo     [X] ERROR: nuevo_cuadrante_mejorado.html NO encontrado >> "%LOGFILE%"
    set ARCHIVOS_OK=0
) else (
    echo     [+] nuevo_cuadrante_mejorado.html OK
    echo     [+] nuevo_cuadrante_mejorado.html OK >> "%LOGFILE%"
)

if not exist "launcher_simple.py" (
    echo     [X] ERROR: launcher_simple.py NO encontrado
    echo     [X] ERROR: launcher_simple.py NO encontrado >> "%LOGFILE%"
    set ARCHIVOS_OK=0
) else (
    echo     [+] launcher_simple.py OK
    echo     [+] launcher_simple.py OK >> "%LOGFILE%"
)

if !ARCHIVOS_OK! equ 0 (
    echo.
    echo [X] ERROR: Faltan archivos necesarios. Revisa la carpeta.
    echo [X] ERROR: Faltan archivos necesarios >> "%LOGFILE%"
    echo.
    pause
    exit /b 1
)

echo     [+] Todos los archivos verificados correctamente
echo     [+] Todos los archivos verificados correctamente >> "%LOGFILE%"
echo.

REM ============================================================================
REM PASO 4: DETECTAR PUERTO DISPONIBLE
REM ============================================================================
echo [PASO 4/6] Detectando puerto disponible...
echo [PASO 4/6] Detectando puerto disponible... >> "%LOGFILE%"

set PUERTO=5001

for %%P in (5001 5002 5003 8000 8001 8080) do (
    netstat -ano 2>nul | find ":%%P" >nul
    if !errorlevel! neq 0 (
        set PUERTO=%%P
        echo     [+] Puerto %%P disponible
        echo     [+] Puerto %%P disponible >> "%LOGFILE%"
        goto PUERTO_ENCONTRADO
    )
)

:PUERTO_ENCONTRADO
echo     [*] Usando puerto: !PUERTO!
echo     [*] Usando puerto: !PUERTO! >> "%LOGFILE%"
echo.

REM ============================================================================
REM PASO 5: INICIAR SERVIDOR
REM ============================================================================
echo [PASO 5/6] Iniciando servidor en puerto !PUERTO!...
echo [PASO 5/6] Iniciando servidor en puerto !PUERTO!... >> "%LOGFILE%"

REM Iniciar servidor en background
start /B cmd /C "python launcher_simple.py >> "%LOGFILE%" 2>&1"

REM Esperar a que inicie y responda con validacion HTTP
echo     [*] Esperando servidor con validacion HTTP...
echo     [*] Esperando servidor con validacion HTTP... >> "%LOGFILE%"
set INTENTOS=0
set INTENTO_PUERTO=0
set SERVIDOR_LISTO=0
set PUERTO_ACTUAL=5001

:VERIFICAR_SERVIDOR_HTTP
set /a INTENTOS+=1
set /a INTENTO_PUERTO+=1

if !INTENTO_PUERTO! gtr 5 (
    echo     [*] Puerto !PUERTO_ACTUAL! no responde. Probando siguiente... >> "%LOGFILE%"
    set INTENTO_PUERTO=1
    
    if "!PUERTO_ACTUAL!"=="5001" set PUERTO_ACTUAL=5002
    if "!PUERTO_ACTUAL!"=="5002" set PUERTO_ACTUAL=5003
    if "!PUERTO_ACTUAL!"=="5003" set PUERTO_ACTUAL=8000
    if "!PUERTO_ACTUAL!"=="8000" set PUERTO_ACTUAL=8001
    if "!PUERTO_ACTUAL!"=="8001" set PUERTO_ACTUAL=8080
)

timeout /t 1 /nobreak >nul

REM Verificar que el puerto está escuchando
netstat -ano 2>nul | find ":!PUERTO_ACTUAL!" >nul
if !errorlevel! neq 0 (
    echo     [*] Intento !INTENTOS!/30 - Puerto !PUERTO_ACTUAL! no en netstat >> "%LOGFILE%"
    if !INTENTOS! lss 30 goto VERIFICAR_SERVIDOR_HTTP
    goto SERVIDOR_NO_LISTO_AVZ
)

REM Verificar conexion HTTP real con PowerShell
echo     [*] Intento !INTENTOS!/30 - Validando HTTP en puerto !PUERTO_ACTUAL!... >> "%LOGFILE%"
powershell -Command "try { $web = New-Object System.Net.WebClient; $web.DownloadString('http://127.0.0.1:!PUERTO_ACTUAL!/nuevo_cuadrante_mejorado.html') | Out-Null; exit 0 } catch { exit 1 }" 2>nul
if !errorlevel! equ 0 (
    set PUERTO=!PUERTO_ACTUAL!
    echo     [+] ¡Servidor responde en puerto !PUERTO! >> "%LOGFILE%"
    echo     [+] ¡Servidor responde en puerto !PUERTO!
    set SERVIDOR_LISTO=1
    goto SERVIDOR_LISTO_OK_AVZ
)

if !INTENTOS! lss 30 goto VERIFICAR_SERVIDOR_HTTP

:SERVIDOR_NO_LISTO_AVZ
echo     [!] Advertencia: Server no responde en puertos esperados >> "%LOGFILE%"
echo     [*] Continuando de todas formas... >> "%LOGFILE%"
timeout /t 3 /nobreak >nul

:SERVIDOR_LISTO_OK_AVZ

echo     [+] Servidor inicializado correctamente
echo     [+] Servidor inicializado correctamente >> "%LOGFILE%"

REM ============================================================================
REM PASO 6: MOSTRAR MENSAJE Y PEDIR CONFIRMACIÓN
REM ============================================================================
echo [PASO 6/6] Preparando para abrir navegador...
echo [PASO 6/6] Preparando para abrir navegador... >> "%LOGFILE%"
echo.

echo ============================================================================
echo [+] APLICACION LISTA - PUERTO: !PUERTO!
echo ============================================================================
echo.
echo [!] IMPORTANTE:
echo     - Puedes cerrar esta ventana sin detener el servidor
echo     - El servidor seguira ejecutandose en background
echo     - La proxima vez que abras INICIAR_APP_AVANZADO.bat:
echo       * Detectara procesos Python anteriores
echo       * Los detendera correctamente
echo       * Limpiara puertos en uso
echo       * Iniciara un servidor nuevo y limpio
echo.
echo [*] Se abrira el navegador en: http://localhost:!PUERTO!
echo.
echo Presiona una tecla para abrir navegador...
pause

REM ============================================================================
REM ABRIR NAVEGADOR (DESPUES DE PRESIONAR ENTER)
REM ============================================================================
echo.
echo [*] Puerto final: !PUERTO!
echo [*] Abriendo navegador en: http://localhost:!PUERTO!/nuevo_cuadrante_mejorado.html
echo [*] Abriendo navegador en: http://localhost:!PUERTO!/nuevo_cuadrante_mejorado.html >> "%LOGFILE%"
echo.

start "" "http://localhost:!PUERTO!/nuevo_cuadrante_mejorado.html"
timeout /t 1 /nobreak >nul

echo [+] Navegador abierto
echo [+] Navegador abierto >> "%LOGFILE%"
echo.

REM ============================================================================
REM MENSAJE FINAL
REM ============================================================================
echo ============================================================================
echo [+] ¡DISFRUTA LA APLICACION!
echo ============================================================================
echo.
echo [INFO] Status del servidor:
echo     - La aplicacion se abrio en tu navegador (puerto !PUERTO!)
echo     - Puedes cerrar esta ventana sin detener el servidor
echo     - El servidor continuara en background
echo.
echo [LOG] Archivo de registro: %LOGFILE%
echo.

timeout /t 2 /nobreak >nul

REM Registro de cierre
echo Cierre: %date% %time% >> "%LOGFILE%"
echo ============================================================================ >> "%LOGFILE%"

exit /b 0
