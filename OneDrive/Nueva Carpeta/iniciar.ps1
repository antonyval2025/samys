#!/usr/bin/env pwsh
<#
.SYNOPSIS
Inicia el servidor compilado (sin requirir Python) y abre automáticamente la aplicación web
.DESCRIPTION
Este script inicia el servidor ejecutable en segundo plano y abre el navegador
automáticamente cuando el servidor esté listo.
#>

$ErrorActionPreference = "Stop"

# Configuración
$PORT = 5001
$URL = "http://localhost:$PORT"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommandPath
$SERVER_EXE = "$SCRIPT_DIR\servidor_turnos.exe"

Write-Host "`n" + ("="*50)
Write-Host " Sistema de Gestión de Turnos" -ForegroundColor Cyan
Write-Host " Servidor Independiente (sin Python)" -ForegroundColor Yellow
Write-Host ("="*50) -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del script
Set-Location $SCRIPT_DIR

# Verificar que el ejecutable existe
if (-not (Test-Path $SERVER_EXE)) {
    Write-Host "[!] ERROR: servidor_turnos.exe no encontrado" -ForegroundColor Red
    Write-Host "[*] Ejecuta compilar_exe.bat primero para generar el ejecutable" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[+] servidor_turnos.exe encontrado ($([math]::Round((Get-ChildItem $SERVER_EXE).Length/1MB, 1)) MB)" -ForegroundColor Green
Write-Host ""
Write-Host "[*] Iniciando servidor ejecutable..." -ForegroundColor Yellow
Write-Host "[*] Puerto: $PORT" -ForegroundColor Cyan
Write-Host "[*] Base de datos: turnos_database.db" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor en proceso separado
$serverProcess = Start-Process $SERVER_EXE -PassThru -NoNewWindow

# Esperar a que el servidor esté listo
Write-Host "[*] Esperando a que el servidor esté listo..." -ForegroundColor Yellow
$maxAttempts = 20
$attempt = 0

do {
    Start-Sleep -Seconds 1
    $attempt++
    
    try {
        $response = Invoke-WebRequest -Uri "$URL/api/empleados" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[+] Servidor respondiendo..." -ForegroundColor Green
            break
        }
    } catch {
        # Continuar intentando
    }
    
    if ($attempt -eq $maxAttempts) {
        Write-Host "[!] Servidor tardó demasiado en iniciar" -ForegroundColor Red
        Write-Host "[!] Abre manualmente: $URL" -ForegroundColor Yellow
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} while ($attempt -lt $maxAttempts)

# Abrir navegador
Write-Host "[*] Abriendo navegador..." -ForegroundColor Yellow
Start-Process $URL

# Mensaje final
Write-Host ""
Write-Host ("="*50) -ForegroundColor Green
Write-Host "[+] Servidor iniciado correctamente" -ForegroundColor Green
Write-Host "[+] Navegador abierto automáticamente" -ForegroundColor Green
Write-Host "[+] URL: $URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "[!] Para detener el servidor, cierra la ventana del servidor o presiona Ctrl+C" -ForegroundColor Yellow
Write-Host ("="*50) -ForegroundColor Green
Write-Host ""

# Mantener el proceso abierto
Wait-Process -InputObject $serverProcess
