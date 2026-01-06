#!/bin/bash
# SCRIPT DE VERIFICACIÓN - Sidebar No-Destructivo
# Verifica que todos los archivos necesarios existen

echo "🔍 VERIFICANDO IMPLEMENTACIÓN DEL SIDEBAR..."
echo ""

# Verificar archivos CSS
echo "📄 Verificando archivos CSS:"
if [ -f "css/sidebar-nondestructive.css" ]; then
    echo "  ✅ css/sidebar-nondestructive.css EXISTE"
    lines=$(wc -l < css/sidebar-nondestructive.css)
    echo "     → $lines líneas"
else
    echo "  ❌ css/sidebar-nondestructive.css NO EXISTE"
fi

# Verificar archivos JS
echo ""
echo "📄 Verificando archivos JavaScript:"
if [ -f "js/sidebar-nondestructive.js" ]; then
    echo "  ✅ js/sidebar-nondestructive.js EXISTE"
    lines=$(wc -l < js/sidebar-nondestructive.js)
    echo "     → $lines líneas"
else
    echo "  ❌ js/sidebar-nondestructive.js NO EXISTE"
fi

# Verificar referencias en HTML
echo ""
echo "📄 Verificando referencias en HTML:"
if grep -q "sidebar-nondestructive.css" nuevo_cuadrante_mejorado.html; then
    echo "  ✅ CSS incluido en HTML"
else
    echo "  ❌ CSS NO incluido en HTML"
fi

if grep -q "sidebar-nondestructive.js" nuevo_cuadrante_mejorado.html; then
    echo "  ✅ JS incluido en HTML"
else
    echo "  ❌ JS NO incluido en HTML"
fi

# Verificar documentación
echo ""
echo "📚 Verificando documentación:"
files_to_check=(
    "ANALISIS_ESTRUCTURAL_DETALLADO.md"
    "GUIA_SIDEBAR_NONDESTRUCTIVO.md"
    "SIDEBAR_IMPLEMENTACION_COMPLETA.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file NO EXISTE"
    fi
done

echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo ""
echo "PRÓXIMO PASO: Abrir nuevo_cuadrante_mejorado.html en navegador y probar"
