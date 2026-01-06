@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM  CREADOR AUTOMÁTICO DE PAQUETE DE DISTRIBUCIÓN
REM  Genera una carpeta lista para compartir sin Python
REM ═══════════════════════════════════════════════════════════════════════════════

setlocal enabledelayedexpansion
color 0A

cls
echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                   CREADOR DE PAQUETE DE DISTRIBUCIÓN                      ║
echo ║                   (Aplicación Portátil sin Python)                        ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.
echo Versi¢n 10.0 - 25 de diciembre de 2025
echo.
pause

cls
echo [FASE 1] Verificando archivos necesarios...
echo ═════════════════════════════════════════════════════════════════════════════

set "ok_servidor=false"
set "ok_html=false"
set "ok_bat=false"

if exist "servidor_turnos.exe" (
    echo ✅ servidor_turnos.exe encontrado
    set "ok_servidor=true"
) else (
    echo ❌ ERROR: servidor_turnos.exe NO ENCONTRADO
    echo    Primero debes compilar: ejecuta compilar_exe.bat
    echo.
    pause
    exit /b 1
)

if exist "nuevo_cuadrante_mejorado.html" (
    echo ✅ nuevo_cuadrante_mejorado.html encontrado
    set "ok_html=true"
) else (
    echo ❌ ERROR: nuevo_cuadrante_mejorado.html NO ENCONTRADO
    echo.
    pause
    exit /b 1
)

if exist "iniciar.bat" (
    echo ✅ iniciar.bat encontrado
    set "ok_bat=true"
) else (
    echo ❌ ERROR: iniciar.bat NO ENCONTRADO
    echo.
    pause
    exit /b 1
)

if not "!ok_servidor!"=="true" goto :error
if not "!ok_html!"=="true" goto :error
if not "!ok_bat!"=="true" goto :error

echo.
echo ✅ Todos los archivos esenciales están presentes
echo.
timeout /t 2 /nobreak

cls
echo [FASE 2] Creando carpeta de distribución...
echo ═════════════════════════════════════════════════════════════════════════════

REM Crear carpeta con timestamp
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c%%a%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

set "distFolder=Distribucion_Turnos_%mydate%_%mytime%"

echo Carpeta: %distFolder%
echo Ubicación: %cd%\%distFolder%
echo.

mkdir "%distFolder%" 2>nul

echo ✅ Carpeta creada
echo.
timeout /t 1 /nobreak

cls
echo [FASE 3] Copiando archivos esenciales...
echo ═════════════════════════════════════════════════════════════════════════════

echo Copiando servidor_turnos.exe...
copy "servidor_turnos.exe" "%distFolder%\" >nul
if errorlevel 1 (
    echo ❌ Error al copiar servidor_turnos.exe
    pause
    exit /b 1
)
echo ✅ servidor_turnos.exe copiado

echo Copiando nuevo_cuadrante_mejorado.html...
copy "nuevo_cuadrante_mejorado.html" "%distFolder%\" >nul
if errorlevel 1 (
    echo ❌ Error al copiar HTML
    pause
    exit /b 1
)
echo ✅ nuevo_cuadrante_mejorado.html copiado

echo Copiando iniciar.bat...
copy "iniciar.bat" "%distFolder%\" >nul
if errorlevel 1 (
    echo ❌ Error al copiar iniciar.bat
    pause
    exit /b 1
)
echo ✅ iniciar.bat copiado

echo.
echo ✅ Archivos esenciales copiados
echo.
timeout /t 1 /nobreak

cls
echo [FASE 4] Agregando documentación...
echo ═════════════════════════════════════════════════════════════════════════════

if exist "LEER_PRIMERO_PORTABLE.txt" (
    copy "LEER_PRIMERO_PORTABLE.txt" "%distFolder%\" >nul
    echo ✅ LEER_PRIMERO_PORTABLE.txt incluido
)

if exist "verificar_aplicacion.bat" (
    copy "verificar_aplicacion.bat" "%distFolder%\" >nul
    echo ✅ verificar_aplicacion.bat incluido
)

REM Crear archivo de instrucciones simples
(
echo.
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║              BIENVENIDO - INSTRUCCIONES DE INSTALACIÓN                    ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.
echo REQUISITOS:
echo   ✓ Windows 10 o superior
echo   ✓ Navegador web ^(Chrome, Edge, Firefox^)
echo   ✓ NO requiere Python instalado
echo   ✓ NO requiere Internet
echo.
echo INSTALACIÓN - 3 PASOS:
echo   1. Esta carpeta es tu instalación completa
echo   2. Haz doble clic en: iniciar.bat
echo   3. El navegador abre automáticamente
echo.
echo ¿QUÉ ESPERAR?
echo   - Aparece una ventana negra ^(servidor iniciando^)
echo   - Después de 2-5 segundos: "[+] Servidor listo!"
echo   - Navegador abre automáticamente
echo   - Ves la aplicación de gestión de turnos
echo.
echo ¿CÓMO USAR?
echo   1. Click "👥 Gestionar Empleados" - agrega tus empleados
echo   2. Click "📅 Generar Turnos" - crea cuadrante mensual
echo   3. Click en celdas para editar turnos
echo   4. Los datos se guardan automáticamente en turnos_database.db
echo.
echo COPIAR A OTRA PC:
echo   - Copia toda esta carpeta a la otra PC
echo   - Abre "iniciar.bat"
echo   - ¡Funciona en cualquier Windows!
echo.
echo RESPALDO DE DATOS:
echo   - Tu información está en: turnos_database.db
echo   - Copia este archivo para tener respaldo
echo.
echo ¿PROBLEMAS?
echo   - Puerto en uso: edita iniciar.bat, cambia 5001 por otro número
echo   - Antivirus: es un falso positivo, permite la excepción
echo   - No se abre navegador: ve a http://localhost:5001 manualmente
echo.
echo SOPORTE:
echo   - Revisa LEER_PRIMERO_PORTABLE.txt para más detalles
echo   - Ejecuta verificar_aplicacion.bat para diagnóstico
echo.
echo ═════════════════════════════════════════════════════════════════════════════
echo.
) > "%distFolder%\PRIMERO_LEEME.txt"

echo ✅ PRIMERO_LEEME.txt creado
echo.
timeout /t 1 /nobreak

cls
echo [FASE 5] Generando información del paquete...
echo ═════════════════════════════════════════════════════════════════════════════

REM Crear archivo de información
(
echo INFORMACIÓN DEL PAQUETE
echo ═════════════════════════════════════════════════════════════════════════════
echo.
echo Nombre: Gestor de Turnos - Edición Portátil
echo Versión: 10.0
echo Compilación: %date% %time%
echo.
echo CONTENIDO:
echo   ✓ servidor_turnos.exe       - Servidor web ^(12.8 MB^)
echo   ✓ nuevo_cuadrante_mejorado.html - Aplicación web
echo   ✓ iniciar.bat               - Script de inicio
echo   ✓ PRIMERO_LEEME.txt         - Instrucciones simples
echo.
echo CARACTERÍSTICAS:
echo   ✓ Sin dependencias ^(Python, Node.js, etc.^)
echo   ✓ Portátil ^(USB, email, OneDrive^)
echo   ✓ Offline ^(sin conexión a Internet^)
echo   ✓ Base de datos local ^(SQLite^)
echo   ✓ Inicio rápido ^(5 segundos^)
echo.
echo COMPATIBILIDAD:
echo   ✓ Windows 10, 11, Server 2019+
echo   ✓ Procesadores x64
echo   ✓ Mínimo: 100 MB disco, 256 MB RAM
echo.
echo USO RECOMENDADO:
echo   - Inicio rápido para nuevas instalaciones
echo   - Distribución a otros ordenadores
echo   - Uso en USB
echo   - Copias de seguridad
echo.
echo NOTAS TÉCNICAS:
echo   - Python 3.13 compilado en ejecutable
echo   - Flask 2.3 para API REST
echo   - SQLite3 para persistencia
echo   - HTML5/CSS3/JavaScript vanilla
echo.
) > "%distFolder%\INFORMACION_PAQUETE.txt"

echo ✅ Información del paquete generada
echo.
timeout /t 1 /nobreak

cls
echo [FASE 6] Verificando integridad...
echo ═════════════════════════════════════════════════════════════════════════════

if exist "%distFolder%\servidor_turnos.exe" (
    echo ✅ servidor_turnos.exe verificado
) else (
    echo ❌ Error: servidor_turnos.exe no se copió correctamente
    exit /b 1
)

if exist "%distFolder%\nuevo_cuadrante_mejorado.html" (
    echo ✅ nuevo_cuadrante_mejorado.html verificado
) else (
    echo ❌ Error: HTML no se copió correctamente
    exit /b 1
)

if exist "%distFolder%\iniciar.bat" (
    echo ✅ iniciar.bat verificado
) else (
    echo ❌ Error: iniciar.bat no se copió correctamente
    exit /b 1
)

echo.
echo ✅ Todos los archivos verificados correctamente
echo.
timeout /t 2 /nobreak

cls
echo [FASE 7] Cálculo de tamaño...
echo ═════════════════════════════════════════════════════════════════════════════

for /f %%A in ('powershell -command "^(Get-ChildItem -Path '%distFolder%' -Recurse | Measure-Object -Property Length -Sum^).Sum / 1MB | % {'{0:N1}' -f $_}"') do (
    set "total_size=%%A"
)

echo Tamaño total del paquete: %total_size% MB
echo.
timeout /t 1 /nobreak

cls
echo ╔════════════════════════════════════════════════════════════════════════════╗
echo ║                         ✅ ÉXITO - PAQUETE CREADO                         ║
echo ╚════════════════════════════════════════════════════════════════════════════╝
echo.
echo INFORMACIÓN DEL PAQUETE:
echo ─────────────────────────────────────────────────────────────────────────────
echo Carpeta: %distFolder%
echo Ubicación: %cd%\%distFolder%
echo Tamaño: %total_size% MB
echo Archivos: 5 (3 esenciales + 2 documentación)
echo.
echo PRÓXIMOS PASOS:
echo ─────────────────────────────────────────────────────────────────────────────
echo.
echo OPCIÓN A: Prueba rápida
echo   1. Abre la carpeta: %cd%\%distFolder%
echo   2. Doble clic en iniciar.bat
echo   3. Verifica que la app funciona
echo.
echo OPCIÓN B: Crear archivo .ZIP para compartir
echo   1. Abre el Explorador de archivos
echo   2. Clic derecho en la carpeta %distFolder%
echo   3. Enviar a → Carpeta comprimida
echo   4. Resultado: %distFolder%.zip ^(%total_size% MB aprox.^)
echo   5. ¡Distribúyelo por email, USB, etc.!
echo.
echo OPCIÓN C: Copiar a USB
echo   1. Conecta USB
echo   2. Copia la carpeta %distFolder% al USB
echo   3. Usuarios pueden ejecutar desde USB directamente
echo.
echo ✅ LISTO PARA DISTRIBUIR
echo ─────────────────────────────────────────────────────────────────────────────
echo.
pause

REM Ofrecer abrir la carpeta
choice /c SN /M "¿Abrir la carpeta ahora? (S/N)"
if errorlevel 2 goto :fin
if errorlevel 1 (
    start "" "%distFolder%"
)

:fin
cls
echo.
echo ✅ Paquete de distribución completado exitosamente
echo.
echo 📁 Carpeta: %distFolder%
echo 💾 Tamaño: %total_size% MB
echo 📋 Archivos: 5 principales
echo.
echo ¡Ya puedes compartir esta carpeta! 🚀
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERROR: No se pudo completar la creación del paquete
echo.
pause
exit /b 1
