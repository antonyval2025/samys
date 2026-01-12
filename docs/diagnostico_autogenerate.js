// Diagnóstico: ¿Dónde se están generando automáticamente los turnos?
// Ejecuta esto en la consola para rastrear

const originalInitialize = TurnoManager.inicializarDatos;
const originalGenerate = TurnoManager.generarTurnos;

TurnoManager.inicializarDatos = function() {
    console.error('🔴 ¡ALERTA! Se está llamando a inicializarDatos()');
    console.trace('Stack trace:');
    return originalInitialize.apply(this, arguments);
};

TurnoManager.generarTurnos = function() {
    console.error('🔴 ¡ALERTA! Se está llamando a generarTurnos()');
    console.trace('Stack trace:');
    return originalGenerate.apply(this, arguments);
};

console.log('✅ Monitoreo activado. Si ves "ALERTA", se está generando automáticamente');
