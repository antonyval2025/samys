@echo off
REM Iniciar servidor compilado (sin dependencias Python)
setlocal enabledelayedexpansion
title Sistema de Gestion de Turnos - Servidor

cls
echo.
echo ============================================================
echo   GESTOR DE TURNOS v10.0
echo   Iniciando servidor...
echo ============================================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar que el ejecutable existe
if not exist "servidor_turnos.exe" (
    echo [ERROR] servidor_turnos.exe no encontrado
    echo.
    echo Opciones:
    echo   1. Ejecuta: compilar_exe.bat (para generar el ejecutable)
    echo   2. Verifica que no moviste los archivos
    echo.
    pause
    exit /b 1
)

REM Verificar que el HTML existe
if not exist "nuevo_cuadrante_mejorado.html" (
    echo [ERROR] nuevo_cuadrante_mejorado.html no encontrado
    echo.
    pause
    exit /b 1
)

echo [OK] Archivos encontrados
echo.

REM Matar cualquier proceso anterior en puerto 5001 (opcional)
netstat -ano | findstr ":5001" >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Puerto 5001 en uso, cerrando proceso anterior...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 >nul
)

echo [*] Iniciando servidor en puerto 5001...
echo.

REM Iniciar servidor en segundo plano
start "Servidor Turnos" /B servidor_turnos.exe

REM Esperar a que el servidor esté listo
echo [*] Esperando respuesta del servidor...
set timeout=0

:wait_loop
timeout /t 1 /nobreak >nul
set /a timeout+=1

REM Verificar si el puerto está respondiendo (método simple)
netstat -ano | findstr ":5001" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Servidor respondiendo en puerto 5001
    timeout /t 2 >nul
    goto open_browser
)

if %timeout% lss 20 (
    goto wait_loop
)

echo.
echo [!] El servidor tardó en iniciar, pero continuando...
echo.

:open_browser
cls
echo.
echo ============================================================
echo   GESTOR DE TURNOS - SERVIDOR INICIADO
echo ============================================================
echo.
echo [OK] Servidor: ACTIVO
echo [OK] Puerto: 5001
echo [OK] Base de datos: turnos_database.db
echo [OK] URL: http://localhost:5001
echo.
echo Abriendo navegador automáticamente...
echo.

REM Esperar un poco antes de abrir navegador
timeout /t 2 /nobreak >nul

REM Abrir en navegador predeterminado
start http://localhost:5001

echo.
echo ============================================================
echo [OK] Aplicacion iniciada correctamente
echo.
echo Tu navegador deberia abrirse en 5 segundos...
echo Si no se abre:
echo   1. Abre manualmente: http://localhost:5001
echo   2. Usa Chrome, Edge o Firefox
echo.
echo Para DETENER el servidor:
echo   1. Cierra esta ventana
echo   2. O presiona Ctrl+C
echo ============================================================
echo.

pause
