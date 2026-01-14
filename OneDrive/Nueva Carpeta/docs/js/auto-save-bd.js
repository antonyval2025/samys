/**
 * 🗄️ AUTO-GUARDADO CON PERSISTENCIA BD - DESHABILITADO
 * Este módulo ha sido desactivado para usar exclusivamente localStorage
 * @version 2.0.0-disabled
 */

const AutoSaveBDModule = (function() {
    return {
        init: () => {
            console.log('ℹ️ AutoSaveBDModule deshabilitado preventivamente (Modo LocalStorage activo)');
        },
        sincronizar: () => Promise.resolve({ exito: true, mensaje: 'Modo local activo' }),
        forzarSincronizacion: () => console.log('Sincronización deshabilitada - Usando LocalStorage'),
        obtenerEstado: () => ({ connectionStatus: 'offline', isEnabled: false, lastSync: 'N/A' }),
        alternarBD: () => {},
        obtenerErrores: () => [],
        limpiarErrores: () => {},
        destroy: () => {}
    };
})();

if (typeof window !== 'undefined') {
    window.AutoSaveBDModule = AutoSaveBDModule;
}

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('AutoSaveBDModule', AutoSaveBDModule);
}

