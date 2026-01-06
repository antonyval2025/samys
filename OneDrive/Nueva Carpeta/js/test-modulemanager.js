/**
 * 🧪 VALIDACIÓN RÁPIDA - ModuleManager Integration
 * 
 * Copia y pega estos comandos en consola (F12) para validar
 * que los módulos están correctamente registrados.
 * 
 * Fecha: 5 enero 2026
 */

// ============================================================================
// TEST 1: Verificar ModuleManager disponible
// ============================================================================
console.group('TEST 1: ModuleManager Disponible');
const test1 = typeof window.ModuleManager === 'object';
console.log(test1 ? '✅ PASS' : '❌ FAIL', 'ModuleManager está disponible');
if (test1) console.log('Métodos:', Object.keys(ModuleManager).join(', '));
console.groupEnd();

// ============================================================================
// TEST 2: Listar todos los módulos registrados
// ============================================================================
console.group('TEST 2: Módulos Registrados');
const modulos = Object.keys(ModuleManager.modules || {});
console.log(`✅ ${modulos.length} módulos disponibles:`, modulos.join(', '));
console.groupEnd();

// ============================================================================
// TEST 3: WhatsAppSender registrado
// ============================================================================
console.group('TEST 3: WhatsAppSender');
const whatsAppModule = ModuleManager.get('WhatsAppSender');
const test3a = whatsAppModule !== null && whatsAppModule !== undefined;
console.log(test3a ? '✅ PASS' : '❌ FAIL', 'Módulo disponible en ModuleManager');

const test3b = typeof whatsAppModule?.enviarMensajeEmpleado === 'function';
console.log(test3b ? '✅ PASS' : '❌ FAIL', 'Método enviarMensajeEmpleado disponible');

const test3c = typeof whatsAppModule?.enviarMasivoEmpleados === 'function';
console.log(test3c ? '✅ PASS' : '❌ FAIL', 'Método enviarMasivoEmpleados disponible');

const test3d = typeof whatsAppModule?.validarDependencias === 'function';
console.log(test3d ? '✅ PASS' : '❌ FAIL', 'Método validarDependencias disponible');

if (test3a && test3b && test3c && test3d) {
    console.log('🎯 Métodos públicos:', Object.keys(whatsAppModule).join(', '));
}
console.groupEnd();

// ============================================================================
// TEST 4: BackupManager registrado
// ============================================================================
console.group('TEST 4: BackupManager');
const backupModule = ModuleManager.get('BackupManager');
const test4a = backupModule !== null && backupModule !== undefined;
console.log(test4a ? '✅ PASS' : '❌ FAIL', 'Módulo disponible en ModuleManager');

const test4b = typeof backupModule?.crearBackupAhora === 'function';
console.log(test4b ? '✅ PASS' : '❌ FAIL', 'Método crearBackupAhora disponible');

const test4c = typeof backupModule?.restaurarBackup === 'function';
console.log(test4c ? '✅ PASS' : '❌ FAIL', 'Método restaurarBackup disponible');

const test4d = typeof backupModule?.descargarBackupJSON === 'function';
console.log(test4d ? '✅ PASS' : '❌ FAIL', 'Método descargarBackupJSON disponible');

const test4e = typeof backupModule?.obtenerEstadoActual === 'function';
console.log(test4e ? '✅ PASS' : '❌ FAIL', 'Método obtenerEstadoActual disponible');

const test4f = typeof backupModule?.validarIntegridad === 'function';
console.log(test4f ? '✅ PASS' : '❌ FAIL', 'Método validarIntegridad disponible');

if (test4a && test4b && test4c && test4d && test4e && test4f) {
    console.log('🎯 Métodos públicos:', Object.keys(backupModule).join(', '));
}
console.groupEnd();

// ============================================================================
// TEST 5: Clases Legacy (compatibilidad)
// ============================================================================
console.group('TEST 5: Clases Legacy');
const test5a = typeof window.WhatsAppSender === 'function';
console.log(test5a ? '✅ PASS' : '❌ FAIL', 'Clase WhatsAppSender disponible');

const test5b = typeof window.BackupManager === 'function';
console.log(test5b ? '✅ PASS' : '❌ FAIL', 'Clase BackupManager disponible');

const test5c = typeof window.WhatsAppSender?.enviarMensajeEmpleado === 'function';
console.log(test5c ? '✅ PASS' : '❌ FAIL', 'Método static de WhatsAppSender accesible');

const test5d = typeof window.BackupManager?.crearBackupAhora === 'function';
console.log(test5d ? '✅ PASS' : '❌ FAIL', 'Método static de BackupManager accesible');
console.groupEnd();

// ============================================================================
// TEST 6: Validar dependencias
// ============================================================================
console.group('TEST 6: Validar Dependencias');
const test6a = whatsAppModule?.validarDependencias?.() || false;
console.log(test6a ? '✅ PASS' : '❌ FAIL', 'WhatsAppSender - todas las dependencias OK');

const test6b = backupModule?.validarDependencias?.() || false;
console.log(test6b ? '✅ PASS' : '❌ FAIL', 'BackupManager - todas las dependencias OK');
console.groupEnd();

// ============================================================================
// TEST 7: Obtener estado actual
// ============================================================================
console.group('TEST 7: Obtener Estado Actual');
try {
    const estadoBackup = backupModule?.obtenerEstadoActual?.();
    if (estadoBackup) {
        console.log('✅ PASS - Estado de BackupManager:');
        console.table({
            'Sincronización Activa': estadoBackup.sincronizacionActiva,
            'Último Sync': estadoBackup.ultimoSync ? new Date(estadoBackup.ultimoSync).toLocaleString() : 'N/A',
            'Próximo Sync': estadoBackup.proximoSync,
            'Total Syncs': estadoBackup.totalSyncs,
            'Backup Existe': estadoBackup.backup?.existe || false
        });
    } else {
        console.log('❌ FAIL - No se pudo obtener estado');
    }
} catch (e) {
    console.log('❌ ERROR:', e.message);
}
console.groupEnd();

// ============================================================================
// TEST 8: Obtener estadísticas
// ============================================================================
console.group('TEST 8: Estadísticas');
try {
    const statsWhatsApp = whatsAppModule?.obtenerEstadisticas?.();
    console.log('WhatsAppSender:');
    console.table(statsWhatsApp || {});

    const statsBackup = backupModule?.obtenerEstadisticas?.();
    console.log('BackupManager:');
    console.table(statsBackup || {});
} catch (e) {
    console.log('❌ ERROR:', e.message);
}
console.groupEnd();

// ============================================================================
// TEST 9: Intentar envío de prueba (SIN abrir WhatsApp)
// ============================================================================
console.group('TEST 9: Prueba de Envío (Sin ejecutar)');
console.log('Para probar envío de mensaje:');
console.log('ModuleManager.get("WhatsAppSender").enviarMensajeEmpleado(1, "Juan", { dia: 5 })');
console.log('\nPara prueba masiva:');
console.log('ModuleManager.get("WhatsAppSender").enviarMasivoEmpleados([1,2,3], { pausa: 1500 })');
console.groupEnd();

// ============================================================================
// TEST 10: Intentar backup (REQUIERE confirmación)
// ============================================================================
console.group('TEST 10: Prueba de Backup (Sin ejecutar)');
console.log('Para crear backup ahora:');
console.log('ModuleManager.get("BackupManager").crearBackupAhora()');
console.log('\nPara validar integridad:');
console.log('ModuleManager.get("BackupManager").validarIntegridad()');
console.groupEnd();

// ============================================================================
// RESUMEN FINAL
// ============================================================================
console.group('%c📊 RESUMEN FINAL', 'color: #22c55e; font-size: 16px; font-weight: bold');
const allPass = test1 && test3a && test3b && test3c && test3d && test4a && test4b && test4c && test4d && test4e && test4f && test5a && test5b && test5c && test5d && test6a && test6b;
if (allPass) {
    console.log('%c✅ TODAS LAS PRUEBAS PASARON', 'color: #22c55e; font-weight: bold; font-size: 14px');
    console.log('Módulos correctamente integrados en ModuleManager');
    console.log('Arquitectura modular funcionando correctamente');
} else {
    console.log('%c⚠️ ALGUNAS PRUEBAS FALLARON', 'color: #f59e0b; font-weight: bold; font-size: 14px');
    console.log('Verifica los resultados arriba para identificar qué falta');
}
console.groupEnd();

console.log('%c📚 REFERENCIA RÁPIDA', 'color: #3b82f6; font-weight: bold; font-size: 12px');
console.log(`
USAR MÓDULOS:
  const whatsApp = ModuleManager.get('WhatsAppSender');
  const backup = ModuleManager.get('BackupManager');

MÉTODOS WHATSAPP:
  • enviarMensajeEmpleado(id, nombre, opciones)
  • enviarMasivoEmpleados(ids, opciones)
  • enviarPorDepartamento(dpto, opciones)
  • obtenerEstadisticas()
  • resetearEstadisticas()
  • validarDependencias()

MÉTODOS BACKUP:
  • crearBackupAhora()
  • restaurarBackup()
  • descargarBackupJSON()
  • obtenerEstadoActual()
  • validarIntegridad()
  • obtenerEstadisticas()
  • validarDependencias()
  • formatearBytes(bytes)

LISTAR TODOS LOS MÓDULOS:
  ModuleManager.list()
  
VERIFICAR MÓDULOS ESPECÍFICOS:
  ModuleManager.verificar(['WhatsAppSender', 'BackupManager'])
`);
