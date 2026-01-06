@echo off
REM ============================================================
REM  INICIAR SERVIDOR CON NAVEGADOR - Gestor de Turnos
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

echo [OK] Archivos encontrados
echo.
echo Iniciando servidor en puerto 5001...
echo.

REM Iniciar servidor en ventana separada (no bloqueante)
start "Servidor Turnos" python servidor_turnos.py

REM Esperar 3 segundos a que el servidor inicie
timeout /t 3 /nobreak >nul

REM Abrir navegador
start http://localhost:5001

echo.
echo ============================================================
echo SERVIDOR EN EJECUCIÓN
echo.
echo URL: http://localhost:5001
echo.
echo El servidor está corriendo en otra ventana
echo Cierra esa ventana para detener el servidor
echo ============================================================
echo.

pause
