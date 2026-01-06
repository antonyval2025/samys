@echo off
REM ============================================================
REM  INICIAR SERVIDOR PYTHON - Gestor de Turnos
REM ============================================================

cd /d "%~dp0"

echo.
echo ============================================================
echo   GESTOR DE TURNOS - Iniciando servidor local
echo ============================================================
echo.

REM Verificar que servidor_turnos.py existe
if not exist "servidor_turnos.py" (
    echo ERROR: No se encuentra servidor_turnos.py
    echo.
    pause
    exit /b 1
)

REM Verificar que HTML existe
if not exist "nuevo_cuadrante_mejorado.html" (
    echo ERROR: No se encuentra nuevo_cuadrante_mejorado.html
    echo.
    pause
    exit /b 1
)

echo [OK] Archivos encontrados
echo.
echo Iniciando servidor Python en puerto 5001...
echo.

REM Iniciar servidor Python directamente (sin compilar a exe)
python servidor_turnos.py

REM Si llegamos aqui, significa que el usuario presiono Ctrl+C
echo.
echo Servidor detenido.
pause
