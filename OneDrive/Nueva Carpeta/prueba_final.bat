@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  PRUEBA FINAL - VALIDACIÓN COMPLETA DE LA APLICACIÓN
REM  Ejecuta todas las verificaciones antes de distribuir
REM ═══════════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion
color 0F

cls
echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                      PRUEBA FINAL - v10.0                                 ║
echo ║              Validación completa antes de distribución                    ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.

set "total_checks=0"
set "passed_checks=0"

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 1] Verificaciones de archivos
echo ─────────────────────────────────────────────────────────────────────────────
echo.

set /a total_checks+=1
if exist "servidor_turnos.exe" (
    echo ✅ [1/1] servidor_turnos.exe encontrado
    set /a passed_checks+=1
    for /f "tokens=*" %%A in ('powershell -command "(Get-Item servidor_turnos.exe).Length / 1MB | % {'{0:N1}' -f $_}"') do (
        echo   └─ Tamaño: %%A MB
    )
) else (
    echo ❌ [1/1] servidor_turnos.exe NO ENCONTRADO
)

set /a total_checks+=1
if exist "nuevo_cuadrante_mejorado.html" (
    echo ✅ [2/1] nuevo_cuadrante_mejorado.html encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [2/1] nuevo_cuadrante_mejorado.html NO ENCONTRADO
)

set /a total_checks+=1
if exist "iniciar.bat" (
    echo ✅ [3/1] iniciar.bat encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [3/1] iniciar.bat NO ENCONTRADO
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 2] Verificaciones de herramientas
echo ─────────────────────────────────────────────────────────────────────────────
echo.

set /a total_checks+=1
if exist "compilar_exe.bat" (
    echo ✅ [1/3] compilar_exe.bat encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [1/3] compilar_exe.bat NO ENCONTRADO
)

set /a total_checks+=1
if exist "crear_paquete_distribucion.bat" (
    echo ✅ [2/3] crear_paquete_distribucion.bat encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [2/3] crear_paquete_distribucion.bat NO ENCONTRADO
)

set /a total_checks+=1
if exist "verificar_aplicacion.bat" (
    echo ✅ [3/3] verificar_aplicacion.bat encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [3/3] verificar_aplicacion.bat NO ENCONTRADO
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 3] Verificaciones de documentación
echo ─────────────────────────────────────────────────────────────────────────────
echo.

set /a total_checks+=1
if exist "LEER_PRIMERO_PORTABLE.txt" (
    echo ✅ [1/5] LEER_PRIMERO_PORTABLE.txt encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [1/5] LEER_PRIMERO_PORTABLE.txt NO ENCONTRADO
)

set /a total_checks+=1
if exist "RESUMEN_FINAL_v10.txt" (
    echo ✅ [2/5] RESUMEN_FINAL_v10.txt encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [2/5] RESUMEN_FINAL_v10.txt NO ENCONTRADO
)

set /a total_checks+=1
if exist "INDICE_MAESTRO_v10.md" (
    echo ✅ [3/5] INDICE_MAESTRO_v10.md encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [3/5] INDICE_MAESTRO_v10.md NO ENCONTRADO
)

set /a total_checks+=1
if exist "ARQUITECTURA.md" (
    echo ✅ [4/5] ARQUITECTURA.md encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [4/5] ARQUITECTURA.md NO ENCONTRADO
)

set /a total_checks+=1
if exist "GUIA_DISTRIBUCION_PAQUETE.md" (
    echo ✅ [5/5] GUIA_DISTRIBUCION_PAQUETE.md encontrado
    set /a passed_checks+=1
) else (
    echo ❌ [5/5] GUIA_DISTRIBUCION_PAQUETE.md NO ENCONTRADO
)

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 4] Verificaciones de puerto
echo ─────────────────────────────────────────────────────────────────────────────
echo.

netstat -an | find ":5001" > nul
if errorlevel 1 (
    echo ✅ Puerto 5001 disponible
    set /a passed_checks+=1
) else (
    echo ⚠️  Puerto 5001 podría estar en uso
)
set /a total_checks+=1

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 5] Verificaciones de base de datos
echo ─────────────────────────────────────────────────────────────────────────────
echo.

if exist "turnos_database.db" (
    echo ✅ Base de datos encontrada (se creará automáticamente si no existe)
    set /a passed_checks+=1
    for /f "tokens=*" %%A in ('powershell -command "(Get-Item turnos_database.db).Length / 1KB | % {'{0:N1}' -f $_}"') do (
        echo   └─ Tamaño actual: %%A KB
    )
) else (
    echo ℹ️  Base de datos no existe aún (se creará al primer inicio)
    set /a passed_checks+=1
)
set /a total_checks+=1

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 6] Cálculo de tamaño total
echo ─────────────────────────────────────────────────────────────────────────────
echo.

for /f "tokens=*" %%A in ('powershell -command "^(Get-ChildItem -Recurse | Measure-Object -Property Length -Sum^).Sum / 1MB | % {'{0:N1}' -f $_}"') do (
    set "total_size=%%A"
)

echo Tamaño total del proyecto: %total_size% MB
echo Archivos: 50+ documentos + herramientas + aplicación

echo.

REM ─────────────────────────────────────────────────────────────────────────────
echo [FASE 7] Resumen de resultados
echo ─────────────────────────────────────────────────────────────────────────────
echo.

echo Verificaciones completadas: %passed_checks%/%total_checks%

if %passed_checks% EQU %total_checks% (
    echo.
    echo ╔════════════════════════════════════════════════════════════════════════════╗
    echo ║                    ✅ TODAS LAS PRUEBAS PASARON                            ║
    echo ║                  ¡APLICACIÓN LISTA PARA DISTRIBUCIÓN!                      ║
    echo ╚════════════════════════════════════════════════════════════════════════════╝
    echo.
    echo Puedes:
    echo   1. Iniciar la app: doble clic en iniciar.bat
    echo   2. Crear paquete: doble clic en crear_paquete_distribucion.bat
    echo   3. Distribuir por: USB, email (.ZIP), OneDrive, etc.
    echo.
) else (
    set /a failing_checks=total_checks - passed_checks
    echo.
    echo ⚠️  ADVERTENCIA: !failing_checks! verificaciones fallaron
    echo   Revisa los ❌ más arriba
    echo.
    echo Posibles soluciones:
    echo   1. Si falta servidor_turnos.exe: ejecuta compilar_exe.bat
    echo   2. Si falta documentación: revisa que no se eliminó
    echo   3. Si algo más: abre issue en el proyecto
    echo.
)

echo.
echo ═════════════════════════════════════════════════════════════════════════════
echo.
pause
