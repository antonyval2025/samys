@echo off
REM Compilar servidor_turnos.py a ejecutable .exe
REM Este script usa PyInstaller para crear un .exe portátil

echo.
echo ========================================
echo  Compilando servidor a ejecutable .exe
echo ========================================
echo.

REM Cambiar al directorio del script
cd /d "%~dp0"

REM Verificar que PyInstaller está instalado
python -c "import PyInstaller" >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] PyInstaller no está instalado
    echo [*] Instalando PyInstaller...
    pip install pyinstaller -q
)

echo [*] Compilando servidor_turnos.py...
echo.

REM Compilar con PyInstaller
REM --onefile: Genera un único ejecutable
REM --windowed: Sin consola (pero lo vamos a quitar para ver logs)
REM --add-data: Incluye archivos necesarios
pyinstaller --onefile ^
    --name "servidor_turnos" ^
    --distpath "." ^
    --workpath "build" ^
    --specpath "build" ^
    servidor_turnos.py

if %errorlevel% equ 0 (
    echo.
    echo [+] ========================================
    echo [+] Compilación exitosa!
    echo [+] ========================================
    echo [+] Ejecutable creado: servidor_turnos.exe
    echo [+] Tamaño: ~30-40 MB (incluye Python)
    echo [+] 
    echo [+] Ahora puedes:
    echo [+] 1. Copiar servidor_turnos.exe a cualquier PC
    echo [+] 2. Copiar nuevo_cuadrante_mejorado.html
    echo [+] 3. Ejecutar iniciar.bat
    echo [+] 4. ¡Listo! Funciona sin Python instalado
    echo [+] ========================================
    echo.
    
    REM Limpiar archivos de compilación innecesarios
    if exist "build" rmdir /s /q "build"
    if exist "dist" rmdir /s /q "dist"
    
    echo [*] Limpieza completada
    pause
) else (
    echo.
    echo [!] Error en compilación
    echo [!] Revisa los errores arriba
    pause
    exit /b 1
)
