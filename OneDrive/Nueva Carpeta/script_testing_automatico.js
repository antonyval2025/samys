/**
 * SCRIPT DE TESTING AUTOMÁTICO - Opción 3: WhatsApp Masivo
 * Ejecutar en consola del navegador (F12)
 * Propósito: Validar que todas las funciones funcionan correctamente
 */

console.log('%c🧪 INICIANDO TESTING AUTOMÁTICO - WhatsApp Masivo v11', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('═══════════════════════════════════════════════════════\n');

// ===== TEST 1: Verificar que AppState existe =====
console.log('%c✅ TEST 1: Verificar AppState', 'color: #22c55e; font-weight: bold;');
if (typeof AppState !== 'undefined' && AppState.currentMonth !== undefined) {
    console.log('   ✓ AppState existe');
    console.log(`   ✓ Mes actual: ${AppState.currentMonth}`);
    console.log(`   ✓ Año actual: ${AppState.currentYear}`);
} else {
    console.error('   ✗ AppState no está disponible');
}

// ===== TEST 2: Verificar que empleados cargaron =====
console.log('\n%c✅ TEST 2: Verificar empleados', 'color: #22c55e; font-weight: bold;');
if (typeof empleados !== 'undefined' && empleados.length > 0) {
    console.log(`   ✓ ${empleados.length} empleados cargados`);
    console.log(`   ✓ Primero: ${empleados[0].nombre}`);
    
    const conTelefono = empleados.filter(e => e.telefono).length;
    console.log(`   ✓ ${conTelefono}/${empleados.length} tienen teléfono`);
} else {
    console.error('   ✗ empleados no cargó correctamente');
}

// ===== TEST 3: Verificar que funciones existen =====
console.log('\n%c✅ TEST 3: Verificar funciones', 'color: #22c55e; font-weight: bold;');
const funcionesRequeridas = [
    'enviarWhatsAppMasivo',
    'enviarWhatsAppEmpleadoDirecto',
    'abrirCarpetaDescargas',
    'generarPDFCuadranteVisual',
    'generarContenidoiCalendar'
];

funcionesRequeridas.forEach(fn => {
    if (typeof window[fn] === 'function') {
        console.log(`   ✓ ${fn}() existe`);
    } else {
        console.error(`   ✗ ${fn}() NO existe`);
    }
});

// ===== TEST 4: Verificar NotificationSystem =====
console.log('\n%c✅ TEST 4: Verificar NotificationSystem', 'color: #22c55e; font-weight: bold;');
if (typeof NotificationSystem !== 'undefined' && typeof NotificationSystem.show === 'function') {
    console.log('   ✓ NotificationSystem.show existe');
    NotificationSystem.show('🧪 TEST: NotificationSystem funcionando', 'info', 2000);
} else {
    console.error('   ✗ NotificationSystem no está disponible');
}

// ===== TEST 5: Verificar AppState.scheduleData =====
console.log('\n%c✅ TEST 5: Verificar datos de turnos', 'color: #22c55e; font-weight: bold;');
if (typeof AppState.scheduleData !== 'undefined') {
    const empleadosConDatos = AppState.scheduleData.size;
    console.log(`   ✓ AppState.scheduleData existe`);
    console.log(`   ✓ ${empleadosConDatos} empleados con datos de turnos`);
    
    // Verificar que el primer empleado tiene turnos
    const primerEmpleado = empleados[0];
    const turnos = AppState.scheduleData.get(primerEmpleado.id);
    if (turnos && turnos.length > 0) {
        console.log(`   ✓ ${primerEmpleado.nombre} tiene ${turnos.length} turnos`);
    }
} else {
    console.error('   ✗ AppState.scheduleData no está disponible');
}

// ===== TEST 6: Simular Flujo de WhatsApp Masivo (sin ejecutar realmente) =====
console.log('\n%c✅ TEST 6: Validar lógica de filtrado', 'color: #22c55e; font-weight: bold;');
try {
    // Simular filtrado de empleados
    const empleadosConTelefono = empleados.filter(e => e.telefono);
    const empleadosSinTelefono = empleados.filter(e => !e.telefono);
    
    console.log(`   ✓ ${empleadosConTelefono.length} empleados con teléfono (listos para envío)`);
    console.log(`   ✓ ${empleadosSinTelefono.length} empleados sin teléfono (serán excluidos)`);
    
    if (empleadosConTelefono.length > 0) {
        console.log(`   ✓ Primer empleado para envío: ${empleadosConTelefono[0].nombre}`);
    }
} catch (error) {
    console.error('   ✗ Error en filtrado:', error.message);
}

// ===== TEST 7: Verificar que URLs de WhatsApp son válidas =====
console.log('\n%c✅ TEST 7: Validar URLs de WhatsApp', 'color: #22c55e; font-weight: bold;');
const empleadoPrueba = empleados.find(e => e.telefono);
if (empleadoPrueba) {
    const numero = empleadoPrueba.telefono.replace(/\D/g, '');
    const urlWhatsApp = `whatsapp://send?phone=${numero}&text=${encodeURIComponent('Prueba')}`;
    console.log(`   ✓ URL válida construida para: ${empleadoPrueba.nombre}`);
    console.log(`   ✓ Número de teléfono: ${numero}`);
    console.log(`   ✓ URL: ${urlWhatsApp.substring(0, 50)}...`);
} else {
    console.warn('   ⚠ No hay empleado con teléfono para validar URL');
}

// ===== TEST 8: Verificar elementos del DOM =====
console.log('\n%c✅ TEST 8: Verificar elementos DOM', 'color: #22c55e; font-weight: bold;');
const elementosRequeridos = {
    'cuadranteGeneral': '#cuadranteGeneral',
    'filtroDepartamento': '#filtroDepartamentoGeneral',
    'filtroEstado': '#filtroEstadoGeneral',
    'botonWhatsApp': 'button[onclick*="abrirWhatsApp"]'
};

Object.entries(elementosRequeridos).forEach(([nombre, selector]) => {
    const elemento = document.querySelector(selector);
    if (elemento) {
        console.log(`   ✓ ${nombre} encontrado en DOM`);
    } else {
        console.warn(`   ⚠ ${nombre} no encontrado (selector: ${selector})`);
    }
});

// ===== TEST 9: Revisar localStorage =====
console.log('\n%c✅ TEST 9: Verificar localStorage', 'color: #22c55e; font-weight: bold;');
const turnosAppState = localStorage.getItem('turnosAppState');
const empleadosData = localStorage.getItem('empleadosData');

if (turnosAppState) {
    console.log('   ✓ turnosAppState guardado en localStorage');
    const size = new Blob([turnosAppState]).size;
    console.log(`   ✓ Tamaño: ${(size / 1024).toFixed(2)} KB`);
} else {
    console.warn('   ⚠ turnosAppState no está en localStorage');
}

if (empleadosData) {
    console.log('   ✓ empleadosData guardado en localStorage');
    const size = new Blob([empleadosData]).size;
    console.log(`   ✓ Tamaño: ${(size / 1024).toFixed(2)} KB`);
} else {
    console.warn('   ⚠ empleadosData no está en localStorage');
}

// ===== TEST 10: Verificar colores de turnos =====
console.log('\n%c✅ TEST 10: Verificar configuración de turnos', 'color: #22c55e; font-weight: bold;');
if (typeof tiposTurno !== 'undefined') {
    console.log(`   ✓ tiposTurno definido`);
    console.log(`   ✓ Tipos disponibles: ${Object.keys(tiposTurno).join(', ')}`);
} else {
    console.error('   ✗ tiposTurno no está definido');
}

// ===== RESUMEN FINAL =====
console.log('\n%c═══════════════════════════════════════════════════════', 'color: #3b82f6;');
console.log('%c✅ TESTING AUTOMÁTICO COMPLETADO', 'color: #22c55e; font-size: 14px; font-weight: bold;');
console.log('%c═══════════════════════════════════════════════════════\n', 'color: #3b82f6;');

console.log('%c📋 PRÓXIMOS PASOS MANUALES:', 'color: #f59e0b; font-weight: bold;');
console.log(`
1. ✅ Interfaz cargada y funcional
2. ⏳ Hacer clic en "📤 Enviar por WhatsApp Masivo"
3. ⏳ Confirmar diálogo de empleados
4. ⏳ Observar modal de progreso
5. ⏳ Verificar instrucciones al 100%
6. ⏳ Revisar notificación final
7. ⏳ Buscar archivos en Descargas
8. ⏳ Validar que PDF + ICS se crearon

INSTRUCCIÓN: Abre DevTools (F12) > Pestaña "Console" para ver logs detallados
`);

console.log('%c✅ Sistema listo para testing manual', 'color: #22c55e; font-weight: bold;');
