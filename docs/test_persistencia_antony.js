// 🧪 PRUEBA: Verificar persistencia del turno de Antony día 30 diciembre
console.log('🧪 Probando persistencia del turno de Antony...');

// 1. Verificar empleado Antony
const antony = empleados.find(e => e.nombre.toLowerCase().includes('antony'));
if (!antony) {
    console.error('❌ Empleado Antony no encontrado');
    return;
}
console.log('✅ Empleado Antony encontrado:', antony);

// 2. Verificar turnos actuales en AppState
const turnosAntony = AppState.scheduleData.get(antony.id) || [];
console.log('📊 Turnos de Antony en AppState:', turnosAntony.length);

// 3. Buscar turno del día 30
const turnoDia30 = turnosAntony.find(t => t.dia === 30);
if (turnoDia30) {
    console.log('📅 Turno día 30:', turnoDia30);
} else {
    console.log('❌ No se encontró turno para día 30');
}

// 4. Verificar localStorage
try {
    const saved = localStorage.getItem('turnosAppState');
    if (saved) {
        const state = JSON.parse(saved);
        const scheduleData = new Map(state.scheduleData);
        const turnosAntonyStorage = scheduleData.get(antony.id) || [];
        const turnoDia30Storage = turnosAntonyStorage.find(t => t.dia === 30);
        console.log('💾 Turno día 30 en localStorage:', turnoDia30Storage);
    }
} catch (error) {
    console.error('❌ Error leyendo localStorage:', error);
}

// 5. Verificar si el turno pertenece al mes actual
const mesActual = AppState.currentMonth;
const anioActual = AppState.currentYear;
console.log('📅 Mes/año actual:', mesActual, '/', anioActual);

if (turnoDia30) {
    const fechaTurno = turnoDia30.fecha instanceof Date ? turnoDia30.fecha : new Date(turnoDia30.fecha);
    console.log('📅 Fecha del turno:', fechaTurno);
    console.log('📅 Mes del turno:', fechaTurno.getMonth(), '(debería ser', mesActual, ')');
    console.log('📅 Año del turno:', fechaTurno.getFullYear(), '(debería ser', anioActual, ')');
}