#!/usr/bin/env node

/**
 * 🔍 Script de Validación - Verificar que el cálculo de horas es correcto
 * 
 * Este script verifica que en todos los archivos HTML se esté usando la fórmula correcta
 * para calcular las horas totales trabajadas.
 */

const fs = require('fs');
const path = require('path');

const files = [
    'nuevo_cuadrante_mejorado.html',
    'DISTRIBUCION_LISTA/nuevo_cuadrante_mejorado.html'
];

const correctFormula = "turnos.reduce((sum, t) => sum + (t.horas || 0), 0)";
const incorrectFormula = "diasConTrabajo * horasPorDiaEmpleado";

console.log('🔍 Validando cálculo de horas...\n');

let allGood = true;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Archivo no encontrado: ${file}`);
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Buscar fórmula correcta
    const hasCorrect = content.includes(correctFormula);
    
    // Buscar fórmulas incorrectas que podrían haber quedado
    const hasIncorrectPattern = content.includes("diasConTrabajo * horasPor") && 
                                !content.includes("const totalHoras = Math.round(turnos.reduce");
    
    console.log(`📄 ${file}`);
    console.log(`   ✅ Fórmula correcta presente: ${hasCorrect ? 'SÍ' : 'NO'}`);
    
    if (hasIncorrectPattern) {
        console.log(`   ❌ Patrón incorrecto encontrado: diasConTrabajo * horasPor`);
        allGood = false;
    } else {
        console.log(`   ✅ No hay patrones incorrectos`);
    }
    console.log('');
});

console.log(allGood ? '✅ Validación exitosa - Todo está correcto!' : '❌ Se encontraron problemas');
process.exit(allGood ? 0 : 1);
