@echo off
REM INICIAR_RAPIDO.bat - Versión ultra-rápida (menos de 2 segundos)
cd /d "%~dp0"
taskkill /F /IM python.exe >nul 2>&1
start /B python launcher_simple.py
timeout /t 1 /nobreak >nul
python launcher.py
