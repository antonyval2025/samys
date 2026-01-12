// 🧪 PRUEBA RÁPIDA: Verificar función guardarCambioTurno
console.log('🧪 Probando guardarCambioTurno...');

// Simular datos de prueba
if (typeof AppState === 'undefined') {
    console.log('❌ AppState no está definido');
} else {
    console.log('✅ AppState disponible');

    // Verificar que la función existe
    if (typeof UI.guardarCambioTurno === 'function') {
        console.log('✅ UI.guardarCambioTurno existe');

        // Verificar que actualizarCeldaTurno existe
        if (typeof UI.actualizarCeldaTurno === 'function') {
            console.log('✅ UI.actualizarCeldaTurno existe');
            console.log('🎉 Todas las funciones necesarias están disponibles');
        } else {
            console.log('❌ UI.actualizarCeldaTurno no existe');
        }
    } else {
        console.log('❌ UI.guardarCambioTurno no existe');
    }
}

console.log('✅ Prueba completada');