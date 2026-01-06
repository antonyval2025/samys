# ============================================================
# INICIAR SERVIDOR - Gestor de Turnos (PowerShell)
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  GESTOR DE TURNOS - Iniciador PowerShell" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Verificar archivos necesarios
$needed_files = @("servidor_turnos.py", "nuevo_cuadrante_mejorado.html")
$error = $false

foreach ($file in $needed_files) {
    if (-not (Test-Path $file)) {
        Write-Host "[ERROR] No se encuentra: $file" -ForegroundColor Red
        $error = $true
    } else {
        Write-Host "[OK] Encontrado: $file" -ForegroundColor Green
    }
}

if ($error) {
    Write-Host ""
    Write-Host "Verifica que los archivos esten en: $scriptPath" -ForegroundColor Yellow
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host ""

# Verificar Python
Write-Host "Verificando Python..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[OK] $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Python no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluciones:" -ForegroundColor Yellow
    Write-Host "1. Instala Python desde https://www.python.org" 
    Write-Host "2. Marca 'Add Python to PATH' durante la instalacion"
    Write-Host "3. Reinicia la computadora"
    Write-Host ""
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host ""

# Verificar dependencias (Flask)
Write-Host "Verificando dependencias..." -ForegroundColor Cyan
try {
    python -c "import flask; Write-Host '[OK] Flask disponible' -ForegroundColor Green" 2>&1
} catch {
    Write-Host "[ERROR] Flask no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instala con: pip install flask" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona ENTER para salir"
    exit 1
}

Write-Host ""

# Verificar puerto 5001
Write-Host "Verificando puerto 5001..." -ForegroundColor Cyan
$puerto_proceso = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
if ($puerto_proceso) {
    Write-Host "[ADVERTENCIA] Puerto 5001 ya está en uso" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "¿Deseas continuar de todas formas? (s/n)"
    if ($response -ne "s") {
        exit 0
    }
} else {
    Write-Host "[OK] Puerto 5001 disponible" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Iniciando servidor Flask..." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "URL: http://localhost:5001" -ForegroundColor Yellow
Write-Host "Presiona CTRL+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Crear job para abrir navegador después de 2 segundos
$job = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    try {
        Start-Process "http://localhost:5001"
    } catch {
        # Silenciar si falla
    }
}

# Ejecutar servidor (bloqueante)
python servidor_turnos.py

# Limpiar job
Stop-Job -Job $job -Force -ErrorAction SilentlyContinue 2>&1 | Out-Null

Write-Host ""
Write-Host "Servidor detenido." -ForegroundColor Yellow
Write-Host ""
Read-Host "Presiona ENTER para salir"
Read-Host "Presiona Enter para cerrar"
