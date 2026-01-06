// SCRIPT DE VERIFICACIÓN - Copiar en consola para verificar NotificationSystem

console.clear();

console.log('%c🧪 VERIFICACIÓN DEL SISTEMA', 'background: #4CAF50; color: white; padding: 15px; border-radius: 4px; font-weight: bold; font-size: 14px;');

// Test 1: Verificar que existe
console.log('\n✅ TEST 1: ¿Existe NotificationSystem?');
if (typeof window.NotificationSystem === 'object') {
    console.log('✅ SÍ - Object encontrado');
} else {
    console.log('❌ NO - No encontrado');
}

// Test 2: Verificar métodos
console.log('\n✅ TEST 2: Métodos disponibles');
const metodos = [
    'show',
    'mostrarHistorial',
    'limpiarHistorial',
    'activarSonidos',
    'desactivarSonidos',
    'cambiarPosicion',
    'cerrarNotificacion'
];

metodos.forEach(m => {
    const existe = typeof window.NotificationSystem[m] === 'function';
    console.log(`  ${existe ? '✅' : '❌'} ${m}`);
});

// Test 3: Propiedades
console.log('\n✅ TEST 3: Propiedades');
console.log(`  ✅ historial: ${Array.isArray(window.NotificationSystem.historial) ? 'Array' : 'ERROR'}`);
console.log(`  ✅ sonidosActivados: ${typeof window.NotificationSystem.sonidosActivados}`);
console.log(`  ✅ posicion: ${window.NotificationSystem.posicion}`);
console.log(`  ✅ maxHistorial: ${window.NotificationSystem.maxHistorial}`);

// Test 4: Funcionar un test
console.log('\n✅ TEST 4: Mostrar notificación');
NotificationSystem.show('✅ Sistema funcionando', 'success', 2000);

// Test 5: Historial
console.log('\n✅ TEST 5: Verificar historial');
console.log(`  Notificaciones registradas: ${window.NotificationSystem.historial.length}`);

console.log('\n%c✅ VERIFICACIÓN COMPLETA', 'background: #4CAF50; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');
