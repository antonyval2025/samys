#!/usr/bin/env powershell
# ============================================================================
# INICIAR_APP.ps1 - Gestor de Turnos (PowerShell)
# Version mejorada con deteccion inteligente y reinicio limpio
# ============================================================================

param()

$ErrorActionPreference = "Continue"
$WarningPreference = "SilentlyContinue"

# Funciones
function Print-Header {
    Clear-Host
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host "GESTOR DE TURNOS - APLICACION (PowerShell)".PadLeft(75) -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host ""
}

function Print-Step {
    param(
        [int]$StepNum,
        [string]$Title
    )
    Write-Host "[PASO $StepNum/5] $Title" -ForegroundColor Cyan
    Write-Host "-" * 80 -ForegroundColor Gray
}

function Get-Timestamp {
    return Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
}

function Stop-ServerProcesses {
    Write-Host "[*] Buscando procesos Python activos..." -ForegroundColor Yellow
    
    $pythonProcesses = Get-Process -Name python -ErrorAction SilentlyContinue
    
    if ($pythonProcesses) {
        Write-Host "    [!] Encontrados $($pythonProcesses.Count) proceso(s) Python" -ForegroundColor Red
        
        foreach ($process in $pythonProcesses) {
            try {
                Write-Host "    [*] Deteniendo proceso: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force -ErrorAction Stop
                Write-Host "        [+] Proceso detenido correctamente" -ForegroundColor Green
            }
            catch {
                Write-Host "        [X] Error al detener proceso: $_" -ForegroundColor Red
            }
        }
        
        Start-Sleep -Seconds 2
        Write-Host "    [+] Todos los procesos fueron detenidos" -ForegroundColor Green
    } else {
        Write-Host "    [+] No hay procesos Python activos" -ForegroundColor Green
    }
}

function Clear-UsedPorts {
    Write-Host "[*] Limpiando puertos en uso..." -ForegroundColor Yellow
    
    $puertos = @(5001, 5002, 5003, 8000, 8001, 8080)
    
    foreach ($puerto in $puertos) {
        try {
            $conexion = [System.Net.Sockets.TcpClient]::new()
            $resultado = $conexion.ConnectAsync("127.0.0.1", $puerto).Wait(1000)
            $conexion.Dispose()
            
            if ($resultado) {
                Write-Host "    [*] Puerto $puerto en uso, intentando liberar..." -ForegroundColor Yellow
                
                $processo = netstat -ano | Select-String ":$puerto" | ForEach-Object {
                    $linea = $_ -split '\s+'
                    $linea[-1]
                } | Select-Object -Unique
                
                if ($processo) {
                    Stop-Process -Id $processo -Force -ErrorAction SilentlyContinue
                    Write-Host "        [+] Puerto $puerto liberado" -ForegroundColor Green
                }
            }
        }
        catch {
            # Puerto no disponible o error, continuar
        }
    }
    
    Start-Sleep -Seconds 1
    Write-Host "    [+] Puertos limpiados" -ForegroundColor Green
}

function Verify-Files {
    Write-Host "[*] Verificando archivos necesarios..." -ForegroundColor Yellow
    
    $archivos = @(
        "servidor_turnos.py",
        "nuevo_cuadrante_mejorado.html",
        "launcher_simple.py"
    )
    
    $todosBien = $true
    
    foreach ($archivo in $archivos) {
        if (Test-Path $archivo) {
            $size = (Get-Item $archivo).Length / 1KB
            Write-Host "    [+] $archivo ($('{0:F1}' -f $size) KB)" -ForegroundColor Green
        } else {
            Write-Host "    [X] ERROR: $archivo NO ENCONTRADO" -ForegroundColor Red
            $todosBien = $false
        }
    }
    
    if (-not $todosBien) {
        Write-Host ""
        Write-Host "[X] ERROR: Faltan archivos necesarios" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
    
    Write-Host "    [+] Todos los archivos verificados correctamente" -ForegroundColor Green
}

function Start-Server {
    Write-Host "[*] Iniciando servidor..." -ForegroundColor Yellow
    
    try {
        Write-Host "    [*] Ejecutando launcher_simple.py..." -ForegroundColor Yellow
        Start-Process python -ArgumentList "launcher_simple.py" -WindowStyle Hidden -NoNewWindow
        
        Write-Host "    [*] Esperando inicializacion del servidor..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        
        # Verificar que Python este activo
        $pythonRunning = Get-Process -Name python -ErrorAction SilentlyContinue
        
        if ($pythonRunning) {
            Write-Host "    [+] Servidor iniciado correctamente (PID: $($pythonRunning.Id))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "    [X] El servidor no se inicio correctamente" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "    [X] Error al iniciar servidor: $_" -ForegroundColor Red
        return $false
    }
}

function Open-Browser {
    Write-Host "[*] Abriendo navegador..." -ForegroundColor Yellow
    
    try {
        Start-Process "http://localhost:5001/nuevo_cuadrante_mejorado.html"
        Start-Sleep -Seconds 2
        Write-Host "    [+] Navegador abierto correctamente" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "    [X] Error al abrir navegador: $_" -ForegroundColor Red
        return $false
    }
}

# MAIN
function Main {
    # Cambiar al directorio del script
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    Set-Location $scriptDir
    
    Print-Header
    
    # PASO 1: Detectar y detener procesos anteriores
    Print-Step 1 "Detectando y deteniendo procesos anteriores"
    Stop-ServerProcesses
    Write-Host ""
    
    # PASO 2: Limpiar puertos
    Print-Step 2 "Limpiando puertos en uso"
    Clear-UsedPorts
    Write-Host ""
    
    # PASO 3: Verificar archivos
    Print-Step 3 "Verificando archivos necesarios"
    Verify-Files
    Write-Host ""
    
    # PASO 4: Iniciar servidor
    Print-Step 4 "Iniciando servidor"
    if (-not (Start-Server)) {
        Write-Host ""
        Write-Host "[X] No se pudo iniciar el servidor" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
    Write-Host ""
    
    # PASO 5: Abrir navegador
    Print-Step 5 "Abriendo navegador"
    Open-Browser
    Write-Host ""
    
    # Mensaje final
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host "[+] APLICACION INICIADA CORRECTAMENTE".PadLeft(75) -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "[INFO] Estado del servidor:" -ForegroundColor Cyan
    Write-Host "    - La aplicacion se abrio en tu navegador" -ForegroundColor White
    Write-Host "    - Puedes cerrar esta ventana sin detener el servidor" -ForegroundColor White
    Write-Host "    - El servidor continuara en background" -ForegroundColor White
    Write-Host ""
    Write-Host "[PROXIMA VEZ] Cuando ejecutes este script nuevamente:" -ForegroundColor Cyan
    Write-Host "    - Detectara procesos Python anteriores" -ForegroundColor White
    Write-Host "    - Los detendera correctamente" -ForegroundColor White
    Write-Host "    - Limpiara puertos en uso" -ForegroundColor White
    Write-Host "    - Iniciara un servidor nuevo y limpio" -ForegroundColor White
    Write-Host ""
    Write-Host "[*] Presiona Enter para finalizar..." -ForegroundColor Yellow
    Read-Host
}

Main
