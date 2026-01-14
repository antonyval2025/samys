// Script para capturar mensajes y errores durante edición
console.log('📊 MONITOREO: Capturando mensajes durante edición de turnos');

// Capturar todas las notificaciones
const notificacionesCapturadas = [];
if (window.NotificationSystem && window.NotificationSystem.show) {
    const originalShow = window.NotificationSystem.show;
    window.NotificationSystem.show = function(message, type = 'info', duration = 5000) {
        const timestamp = new Date().toISOString();
        const notificacion = {
            timestamp,
            message,
            type,
            duration,
            stack: new Error().stack
        };
        notificacionesCapturadas.push(notificacion);

        console.log(`📢 NOTIFICACIÓN [${timestamp}]: "${message}" (${type})`);
        console.log('Stack:', notificacion.stack);

        return originalShow.call(this, message, type, duration);
    };
}

// Capturar errores de JavaScript
const erroresCapturados = [];
window.addEventListener('error', (event) => {
    const error = {
        timestamp: new Date().toISOString(),
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
    };
    erroresCapturados.push(error);

    console.error('🚨 ERROR JAVASCRIPT:', error);
});

// Capturar llamadas a funciones críticas
const llamadasFunciones = [];
const funcionesAMonitorear = ['generarCuadranteGeneral', 'guardarCambioTurno', 'notifyShiftChange'];

funcionesAMonitorear.forEach(funcName => {
    if (window.UI && window.UI[funcName]) {
        const originalFunc = window.UI[funcName];
        window.UI[funcName] = function(...args) {
            const llamada = {
                timestamp: new Date().toISOString(),
                funcion: funcName,
                argumentos: args
            };
            llamadasFunciones.push(llamada);

            console.log(`🔄 LLAMADA [${llamada.timestamp}]: ${funcName}(${args.join(', ')})`);

            return originalFunc.apply(this, args);
        };
    }

    if (window.DataChangeManager && window.DataChangeManager[funcName]) {
        const originalFunc = window.DataChangeManager[funcName];
        window.DataChangeManager[funcName] = function(...args) {
            const llamada = {
                timestamp: new Date().toISOString(),
                funcion: `DataChangeManager.${funcName}`,
                argumentos: args
            };
            llamadasFunciones.push(llamada);

            console.log(`🔄 LLAMADA [${llamada.timestamp}]: DataChangeManager.${funcName}(${args.map(a => JSON.stringify(a)).join(', ')})`);

            return originalFunc.apply(this, args);
        };
    }
});

// Función para mostrar resumen
window.mostrarResumenMonitoreo = function() {
    console.log('📊 RESUMEN DE MONITOREO:');
    console.log('='.repeat(50));

    console.log(`📢 NOTIFICACIONES CAPTURADAS: ${notificacionesCapturadas.length}`);
    notificacionesCapturadas.forEach((n, i) => {
        console.log(`  ${i + 1}. [${n.timestamp}] ${n.type.toUpperCase()}: "${n.message}"`);
    });

    console.log(`🚨 ERRORES CAPTURADOS: ${erroresCapturados.length}`);
    erroresCapturados.forEach((e, i) => {
        console.log(`  ${i + 1}. [${e.timestamp}] ${e.message} (${e.filename}:${e.lineno})`);
    });

    console.log(`🔄 LLAMADAS A FUNCIONES: ${llamadasFunciones.length}`);
    llamadasFunciones.forEach((c, i) => {
        console.log(`  ${i + 1}. [${c.timestamp}] ${c.funcion}`);
    });

    // Detectar posibles bucles
    const llamadasRecientes = llamadasFunciones.slice(-10);
    const llamadasGenerarCuadrante = llamadasRecientes.filter(c => c.funcion === 'generarCuadranteGeneral').length;
    if (llamadasGenerarCuadrante > 3) {
        console.warn('⚠️ POSIBLE BUCLE INFINITO: generarCuadranteGeneral llamado', llamadasGenerarCuadrante, 'veces en las últimas 10 llamadas');
    }
};

// Auto-mostrar resumen después de 10 segundos
setTimeout(() => {
    console.log('⏰ Auto-mostrando resumen de monitoreo...');
    mostrarResumenMonitoreo();
}, 10000);

// Función para limpiar datos de monitoreo
window.limpiarMonitoreo = function() {
    notificacionesCapturadas.length = 0;
    erroresCapturados.length = 0;
    llamadasFunciones.length = 0;
    console.log('🧹 Datos de monitoreo limpiados');
};