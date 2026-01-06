# Script para instalar npm packages correctamente en Windows
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  INSTALANDO DEPENDENCIAS DE NODE.JS" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Cambiar a directorio backend
$backendPath = "$PSScriptRoot\backend"
Set-Location $backendPath

Write-Host "Directorio actual: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Encontrar npm
Write-Host "Buscando npm..." -ForegroundColor Yellow
$npmPath = Get-Command npm -ErrorAction SilentlyContinue

if ($null -eq $npmPath) {
    Write-Host "npm no encontrado en PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Intentando desde Program Files..." -ForegroundColor Yellow
    
    # Rutas comunes de Node.js en Windows
    $nodePaths = @(
        "C:\Program Files\nodejs\npm.cmd",
        "C:\Program Files (x86)\nodejs\npm.cmd"
    )
    
    $found = $false
    foreach ($path in $nodePaths) {
        if (Test-Path $path) {
            Write-Host "npm encontrado en: $path" -ForegroundColor Green
            & $path install
            $found = $true
            break
        }
    }
    
    if ($found) {
        Write-Host ""
        Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  DEPENDENCIAS INSTALADAS" -ForegroundColor Green
        Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
    } else {
        Write-Host "Error: npm no se encontro" -ForegroundColor Red
    }
} else {
    Write-Host "npm encontrado: $($npmPath.Source)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Ejecutando: npm install" -ForegroundColor Cyan
    Write-Host ""
    
    & npm install
}

Write-Host ""
Read-Host "Presiona Enter para cerrar"

