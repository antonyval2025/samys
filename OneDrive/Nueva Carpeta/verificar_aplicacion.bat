@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  VERIFICADOR DE APLICACIÓN PORTÁTIL
REM  Comprueba que todos los archivos necesarios están presentes
REM ═══════════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║            VERIFICADOR - APLICACIÓN PORTÁTIL                             ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [1] Verificando archivos necesarios...
echo ─────────────────────────────────────────────────────────────────────────────

set "all_ok=true"

if exist "servidor_turnos.exe" (
    echo ✅ servidor_turnos.exe encontrado
    for /f %%A in ('powershell -command "(Get-Item servidor_turnos.exe).Length / 1MB | % {"{0:N1}" -f $_}"') do (
        echo   Tamaño: %%A MB
    )
) else (
    echo ❌ servidor_turnos.exe NO ENCONTRADO
    set "all_ok=false"
)

if exist "nuevo_cuadrante_mejorado.html" (
    echo ✅ nuevo_cuadrante_mejorado.html encontrado
) else (
    echo ❌ nuevo_cuadrante_mejorado.html NO ENCONTRADO
    set "all_ok=false"
)

if exist "iniciar.bat" (
    echo ✅ iniciar.bat encontrado
) else (
    echo ❌ iniciar.bat NO ENCONTRADO
    set "all_ok=false"
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [2] Verificando puerto 5001 disponible...
echo ─────────────────────────────────────────────────────────────────────────────

netstat -an | find ":5001" > nul
if errorlevel 1 (
    echo ✅ Puerto 5001 disponible
) else (
    echo ⚠️  Puerto 5001 podría estar en uso
    echo   Puedes cambiar el puerto en iniciar.bat si es necesario
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [3] Verificando base de datos...
echo ─────────────────────────────────────────────────────────────────────────────

if exist "turnos_database.db" (
    echo ✅ turnos_database.db encontrado
    for /f %%A in ('powershell -command "(Get-Item turnos_database.db).Length / 1KB | % {"{0:N1}" -f $_}"') do (
        echo   Tamaño: %%A KB
    )
) else (
    echo ⚠️  turnos_database.db no existe aún
    echo   Se creará automáticamente al iniciar el servidor
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [4] Resultado final...
echo ─────────────────────────────────────────────────────────────────────────────

if "!all_ok!"=="true" (
    echo.
    echo ✅ ¡APLICACIÓN LISTA PARA DISTRIBUIR!
    echo.
    echo    Para iniciar, ejecuta: iniciar.bat
    echo    Otros usuarios pueden: copiar los 3 archivos principales
    echo                          hacer doble clic en iniciar.bat
    echo.
) else (
    echo.
    echo ❌ Faltan archivos. Por favor:
    echo.
    echo    1. Verifica que estés en la carpeta correcta
    echo    2. Si falta servidor_turnos.exe, ejecuta: compilar_exe.bat
    echo    3. Si falta nuevo_cuadrante_mejorado.html, cópialo del repositorio
    echo.
)

echo.
pause
