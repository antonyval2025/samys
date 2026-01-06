// ================================================================================
// 🧪 SCRIPT DE TEST RÁPIDO - MODAL AUTO-GUARDADO
// ================================================================================
// Copia TODO este código en la consola del navegador (F12) y presiona Enter

console.clear();
console.log('%c=== TEST MODAL AUTO-GUARDADO ===', 'color: blue; font-weight: bold; font-size: 16px');

// Test 1: Verificar módulos
console.log('%c1. MÓDULOS', 'color: cyan; font-weight: bold');
console.log('✓ AutoSaveUIModule cargado:', typeof AutoSaveUIModule !== 'undefined');
console.log('✓ abrirAutoGuardado existe:', typeof abrirAutoGuardado !== 'undefined');
console.log('✓ AutoSaveManager cargado:', typeof AutoSaveManager !== 'undefined');

// Test 2: Verificar estado del modal
console.log('%c2. ESTADO DEL MODAL', 'color: cyan; font-weight: bold');
const modal = document.getElementById('modalAutoGuardado');
console.log('✓ Modal existe en DOM:', !!modal);
if (modal) {
    console.log('  - Clases:', modal.className);
    console.log('  - Clase "active":', modal.classList.contains('active'));
    console.log('  - Display:', getComputedStyle(modal).display);
    console.log('  - Visibility:', getComputedStyle(modal).visibility);
    console.log('  - Opacity:', getComputedStyle(modal).opacity);
    console.log('  - Z-index:', getComputedStyle(modal).zIndex);
}

// Test 3: Intentar abrir
console.log('%c3. INTENTANDO ABRIR MODAL', 'color: cyan; font-weight: bold');
try {
    if (typeof AutoSaveUIModule !== 'undefined' && typeof AutoSaveUIModule.abrirModal === 'function') {
        AutoSaveUIModule.abrirModal();
        console.log('✓ abrirModal() ejecutado exitosamente');
        
        // Verificar que se abrió
        setTimeout(() => {
            const modal = document.getElementById('modalAutoGuardado');
            console.log('✓ ¿Modal se abrió?', modal?.classList.contains('active') ? 'SÍ ✅' : 'NO ❌');
        }, 500);
    } else {
        console.log('✗ AutoSaveUIModule.abrirModal no está disponible');
    }
} catch (err) {
    console.error('✗ Error al abrir:', err.message);
}

// Test 4: Todos los modales
console.log('%c4. TODOS LOS MODALES EN LA PÁGINA', 'color: cyan; font-weight: bold');
const modales = document.querySelectorAll('[id*="modal"], [class*="modal"]');
console.log(`Encontrados ${modales.length} elementos con "modal" en id/clase:`);
Array.from(modales).forEach(m => {
    console.log(`  - ${m.id || m.className}:`, m.tagName);
});

console.log('%c✅ TEST COMPLETADO', 'color: green; font-weight: bold; font-size: 14px');
console.log('Si el modal aparece en pantalla, ¡el test fue exitoso!');

