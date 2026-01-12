// Script de prueba específico para el problema de Antony
console.log('🧪 PRUEBA ESPECÍFICA: Antony día 30 diciembre');

// Función para buscar y mostrar el turno de Antony
function verificarAntony() {
    console.log('🔍 Buscando empleado Antony...');

    const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
    const antony = empleados.find(e => e.nombre && e.nombre.toLowerCase().includes('antony'));

    if (!antony) {
        console.error('❌ Antony no encontrado en empleados');
        return;
    }

    console.log('✅ Antony encontrado:', antony.nombre, 'ID:', antony.id);

    // Verificar turnos
    const turnos = AppState.scheduleData.get(antony.id) || [];
    console.log('📊 Turnos totales de Antony:', turnos.length);

    // Buscar turno del día 30 de diciembre 2025
    const turnoDia30 = turnos.find(t => {
        if (t.dia !== 30) return false;
        if (!t.fecha) return false;
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return fecha.getMonth() === 11 && fecha.getFullYear() === 2025; // Diciembre 2025
    });

    if (!turnoDia30) {
        console.log('❌ No se encontró turno para el día 30 de diciembre 2025');
        return;
    }

    console.log('📅 Turno día 30 diciembre:', turnoDia30);
    console.log('🔄 Tipo de turno actual:', turnoDia30.turno);

    // Verificar cómo se mostraría en la interfaz
    const tiposTurnoList = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};
    const tiposTurnoArray = Object.entries(tiposTurnoList).map(([key, value]) => ({
        key,
        ...value
    }));

    console.log('🎨 Buscando tipo de turno para:', turnoDia30.turno);
    const tipoTurno = tiposTurnoArray.find(tt => tt.key === turnoDia30.turno);

    if (tipoTurno) {
        console.log('✅ Tipo de turno encontrado:', tipoTurno);
        console.log('📝 Nombre:', tipoTurno.nombre);
        console.log('🔤 Inicial:', tipoTurno.inicial);
        console.log('🎨 Color:', tipoTurno.color);
    } else {
        console.log('❌ Tipo de turno NO encontrado para clave:', turnoDia30.turno);
        console.log('🔍 Claves disponibles:', tiposTurnoArray.map(tt => tt.key));
    }
}

// Función para simular el cambio de turno
function simularCambioTurno() {
    console.log('🔄 Simulando cambio de turno de Antony día 30...');

    const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
    const antony = empleados.find(e => e.nombre && e.nombre.toLowerCase().includes('antony'));

    if (!antony) return;

    const turnos = AppState.scheduleData.get(antony.id) || [];
    const turnoDia30 = turnos.find(t => {
        if (t.dia !== 30) return false;
        if (!t.fecha) return false;
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return fecha.getMonth() === 11 && fecha.getFullYear() === 2025;
    });

    if (!turnoDia30) return;

    const turnoAnterior = turnoDia30.turno;
    turnoDia30.turno = 'mañana'; // Cambiar a mañana
    AppState.scheduleData.set(antony.id, turnos);
    AppState.saveToStorage();

    console.log(`✅ Turno cambiado: ${turnoAnterior} → ${turnoDia30.turno}`);

    // Notificar cambio
    if (typeof DataChangeManager !== 'undefined') {
        DataChangeManager.notifyShiftChange(antony.id, 30, turnoAnterior, turnoDia30.turno);
        console.log('📢 Notificación de cambio enviada');
    }

    // Verificar nuevamente después del cambio
    setTimeout(() => {
        console.log('🔄 Verificando después del cambio...');
        verificarAntony();
    }, 1000);
}

// Ejecutar pruebas
setTimeout(() => {
    verificarAntony();
    setTimeout(simularCambioTurno, 3000);
}, 2000);