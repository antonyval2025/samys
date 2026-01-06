@echo off
REM PRUEBA FINAL SIMPLE - VERIFICACION DE ARCHIVOS

setlocal enabledelayedexpansion

cls
echo.
echo ========================================================================
echo                  PRUEBA FINAL - VERIFICACION v10.0
echo ========================================================================
echo.

set "ok=0"
set "total=0"

REM Verificar archivos esenciales
echo [Archivos Esenciales]
echo ──────────────────────────────────────────────────────────────────────

set /a total+=1
if exist "servidor_turnos.exe" (
    echo OK: servidor_turnos.exe encontrado
    set /a ok+=1
) else (
    echo ERROR: servidor_turnos.exe NO ENCONTRADO
)

set /a total+=1
if exist "nuevo_cuadrante_mejorado.html" (
    echo OK: nuevo_cuadrante_mejorado.html encontrado
    set /a ok+=1
) else (
    echo ERROR: nuevo_cuadrante_mejorado.html NO ENCONTRADO
)

set /a total+=1
if exist "iniciar.bat" (
    echo OK: iniciar.bat encontrado
    set /a ok+=1
) else (
    echo ERROR: iniciar.bat NO ENCONTRADO
)

echo.
echo [Herramientas]
echo ──────────────────────────────────────────────────────────────────────

set /a total+=1
if exist "compilar_exe.bat" (
    echo OK: compilar_exe.bat encontrado
    set /a ok+=1
) else (
    echo ERROR: compilar_exe.bat NO ENCONTRADO
)

set /a total+=1
if exist "crear_paquete_distribucion.bat" (
    echo OK: crear_paquete_distribucion.bat encontrado
    set /a ok+=1
) else (
    echo ERROR: crear_paquete_distribucion.bat NO ENCONTRADO
)

echo.
echo [Documentacion]
echo ──────────────────────────────────────────────────────────────────────

set /a total+=1
if exist "LEER_PRIMERO_PORTABLE.txt" (
    echo OK: LEER_PRIMERO_PORTABLE.txt encontrado
    set /a ok+=1
) else (
    echo ERROR: LEER_PRIMERO_PORTABLE.txt NO ENCONTRADO
)

set /a total+=1
if exist "RESUMEN_FINAL_v10.txt" (
    echo OK: RESUMEN_FINAL_v10.txt encontrado
    set /a ok+=1
) else (
    echo ERROR: RESUMEN_FINAL_v10.txt NO ENCONTRADO
)

set /a total+=1
if exist "INDICE_MAESTRO_v10.md" (
    echo OK: INDICE_MAESTRO_v10.md encontrado
    set /a ok+=1
) else (
    echo ERROR: INDICE_MAESTRO_v10.md NO ENCONTRADO
)

echo.
echo [Puerto]
echo ──────────────────────────────────────────────────────────────────────
netstat -an | find ":5001" > nul
if errorlevel 1 (
    echo OK: Puerto 5001 disponible
    set /a total+=1
    set /a ok+=1
) else (
    echo AVISO: Puerto 5001 podria estar en uso
    set /a total+=1
)

echo.
echo [Base de Datos]
echo ──────────────────────────────────────────────────────────────────────

set /a total+=1
if exist "turnos_database.db" (
    echo OK: Base de datos encontrada
    set /a ok+=1
) else (
    echo INFO: Base de datos se creara al primer inicio
    set /a ok+=1
)

echo.
echo ========================================================================
echo RESULTADO: %ok%/%total% verificaciones pasadas
echo ========================================================================
echo.

if %ok% EQU %total% (
    echo ✓ EXITO: Aplicacion lista para distribucion
    echo.
    echo Proximos pasos:
    echo   1. Doble clic en iniciar.bat para probar
    echo   2. Doble clic en crear_paquete_distribucion.bat para empaquetar
    echo   3. Distribuir la carpeta resultante
    echo.
) else (
    echo ✗ ADVERTENCIA: Algunas verificaciones fallaron
    echo   Revisa los ERRORES arriba
    echo.
)

pause
