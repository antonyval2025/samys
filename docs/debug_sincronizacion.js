// Script de debug para verificar sincronización
console.log('🔍 DEBUG: Verificando sincronización de datos');

// Verificar DataChangeManager
console.log('DataChangeManager existe:', typeof DataChangeManager !== 'undefined');
if (typeof DataChangeManager !== 'undefined') {
    console.log('Observadores registrados:', DataChangeManager.observers.length);

    // Agregar un observador de debug
    DataChangeManager.subscribe((cambio) => {
        console.log('🔄 [DEBUG] Cambio detectado:', cambio);
    });
}

// Verificar AppState
console.log('AppState existe:', typeof AppState !== 'undefined');
if (typeof AppState !== 'undefined') {
    console.log('Empleados en AppState:', AppState.scheduleData.size);
}

// Función para verificar turno específico de Antony
function verificarTurnoAntony() {
    console.log('🔍 Verificando turno de Antony día 30 diciembre...');

    // Buscar empleado Antony
    const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
    const antony = empleados.find(e => e.nombre && e.nombre.toLowerCase().includes('antony'));
    console.log('Antony encontrado:', antony);

    if (antony && typeof AppState !== 'undefined') {
        const turnos = AppState.scheduleData.get(antony.id) || [];
        console.log('Turnos de Antony:', turnos.length);

        // Buscar turno del día 30 de diciembre (mes 11)
        const turnoDia30 = turnos.find(t => {
            if (t.dia !== 30) return false;
            if (!t.fecha) return false;
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            return fecha.getMonth() === 11 && fecha.getFullYear() === 2025; // Diciembre 2025
        });

        console.log('Turno día 30 diciembre:', turnoDia30);
        console.log('Turno actual:', turnoDia30?.turno);

        // Verificar tipos de turno disponibles
        const tiposTurnoList = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};
        console.log('Tipos de turno disponibles:', Object.keys(tiposTurnoList));

        // Verificar si "asuntospropios" existe
        console.log('asuntospropios existe:', tiposTurnoList.asuntospropios);
    }
}

// Verificar tipos de turno
console.log('Tipos de turno globales:');
console.log('tiposTurno:', Object.keys(tiposTurno || {}));
console.log('tiposTurnoData:', JSON.parse(localStorage.getItem('tiposTurnoData') || '{}'));

// Ejecutar verificación después de carga
setTimeout(() => {
    verificarTurnoAntony();
}, 2000);

// Simular cambio manual para probar
function simularCambioManual() {
    console.log('🧪 Simulando cambio manual...');

    // Buscar Antony
    const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
    const antony = empleados.find(e => e.nombre && e.nombre.toLowerCase().includes('antony'));

    if (antony && typeof AppState !== 'undefined') {
        const turnos = AppState.scheduleData.get(antony.id) || [];

        // Buscar y cambiar el turno del día 30
        const turnoDia30 = turnos.find(t => {
            if (t.dia !== 30) return false;
            if (!t.fecha) return false;
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            return fecha.getMonth() === 11 && fecha.getFullYear() === 2025;
        });

        if (turnoDia30) {
            console.log('Turno actual:', turnoDia30.turno);
            turnoDia30.turno = 'mañana'; // Cambiar a mañana
            AppState.scheduleData.set(antony.id, turnos);
            AppState.saveToStorage();

            console.log('Turno cambiado a:', turnoDia30.turno);

            // Notificar cambio
            if (typeof DataChangeManager !== 'undefined') {
                DataChangeManager.notifyShiftChange(antony.id, 30, 'asuntospropios', 'mañana');
                console.log('✅ Notificación enviada');
            }
        } else {
            console.log('❌ No se encontró turno del día 30');
        }
    }
}

setTimeout(simularCambioManual, 4000);