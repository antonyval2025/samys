#!/usr/bin/env powershell
<#
.SYNOPSIS
    Servidor local para desarrollo - Sistema de Gestión de Turnos
.DESCRIPTION
    Inicia un servidor HTTP local para pruebas de la aplicación
.PARAMETER Port
    Puerto a usar (default: 8000)
.PARAMETER Open
    Abre automáticamente en el navegador
#>

param(
    [int]$Port = 8000,
    [switch]$Open
)

# Obtener la carpeta actual
$ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 SERVIDOR LOCAL - Sistema de Gestión de Turnos" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Ruta del proyecto: $ProjectPath" -ForegroundColor Yellow
Write-Host "🔌 Puerto: $Port" -ForegroundColor Yellow
Write-Host ""

# Intentar usar Python primero (más común)
try {
    Write-Host "🔍 Buscando Python..." -ForegroundColor Cyan
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Iniciando servidor Python en puerto $Port..." -ForegroundColor Yellow
    
    # Cambiar al directorio del proyecto
    Push-Location $ProjectPath
    
    # Iniciar servidor
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ SERVIDOR INICIADO" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
    Write-Host "   • App Principal:    http://localhost:$Port/nuevo_cuadrante_mejorado.html" -ForegroundColor White
    Write-Host "   • Tests:            http://localhost:$Port/test-integracion.html" -ForegroundColor White
    Write-Host "   • Directorio:       http://localhost:$Port/" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Documentación:" -ForegroundColor Cyan
    Write-Host "   • INTEGRACION.md   - Guía de integración de módulos" -ForegroundColor Gray
    Write-Host "   • ARQUITECTURA.md  - Diagramas y flujos" -ForegroundColor Gray
    Write-Host "   • README.md        - Documentación general" -ForegroundColor Gray
    Write-Host "   • COMPLETADO.md    - Resumen de lo completado" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🛑 Para detener el servidor: Presiona Ctrl+C" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    
    # Abrir en navegador si se solicita
    if ($Open) {
        Write-Host "🌐 Abriendo navegador..." -ForegroundColor Cyan
        Start-Process "http://localhost:$Port/nuevo_cuadrante_mejorado.html"
    }
    
    # Iniciar servidor
    python -m http.server $Port --directory $ProjectPath
}
catch {
    # Alternativa: Node.js http-server
    Write-Host "❌ Python no encontrado. Intentando con Node.js..." -ForegroundColor Yellow
    
    try {
        Write-Host "🔍 Buscando Node.js..." -ForegroundColor Cyan
        $nodeVersion = node --version 2>&1
        Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Instalando http-server si no existe..." -ForegroundColor Yellow
        npm install -g http-server 2>&1 | Out-Null
        
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host "  ✅ SERVIDOR INICIADO" -ForegroundColor Green
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
        Write-Host "   • App Principal:    http://localhost:$Port/nuevo_cuadrante_mejorado.html" -ForegroundColor White
        Write-Host "   • Tests:            http://localhost:$Port/test-integracion.html" -ForegroundColor White
        Write-Host "   • Directorio:       http://localhost:$Port/" -ForegroundColor White
        Write-Host ""
        Write-Host "🛑 Para detener el servidor: Presiona Ctrl+C" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
        Write-Host ""
        
        if ($Open) {
            Write-Host "🌐 Abriendo navegador..." -ForegroundColor Cyan
            Start-Process "http://localhost:$Port/nuevo_cuadrante_mejorado.html"
        }
        
        Push-Location $ProjectPath
        http-server -p $Port --gzip --cors
    }
    catch {
        Write-Host ""
        Write-Host "❌ ERROR: No se encontró Python ni Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "Por favor, instala uno de los siguientes:" -ForegroundColor Yellow
        Write-Host "  1. Python 3: https://www.python.org/downloads/" -ForegroundColor Cyan
        Write-Host "  2. Node.js:  https://nodejs.org/en/download/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Alternativa sin servidor:" -ForegroundColor Yellow
        Write-Host "  Abre directamente en el navegador:" -ForegroundColor Cyan
        Write-Host "  file:///c:/Users/samys/OneDrive/Nueva%20Carpeta/nuevo_cuadrante_mejorado.html" -ForegroundColor White
        Write-Host ""
        Exit 1
    }
}
