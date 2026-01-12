// 🧪 DIAGNÓSTICO: Verificar estado de localStorage y AppState
console.log('🧪 === DIAGNÓSTICO DE PERSISTENCIA ===');

// 1. Verificar localStorage
console.log('📦 LOCALSTORAGE:');
try {
    const saved = localStorage.getItem('turnosAppState');
    if (saved) {
        const state = JSON.parse(saved);
        console.log('✅ Datos encontrados en localStorage');
        console.log('📊 Empleados con turnos:', state.scheduleData ? state.scheduleData.length : 0);

        // Buscar Antony (ID 8 según los logs)
        const antonyData = state.scheduleData.find(([id, turnos]) => id === 8);
        if (antonyData) {
            const [id, turnos] = antonyData;
            console.log('👤 Turnos de Antony en localStorage:', turnos.length);

            // Buscar día 30
            const turno30 = turnos.find(t => t.dia === 30);
            if (turno30) {
                console.log('📅 Día 30 en localStorage:', turno30);
            } else {
                console.log('❌ Día 30 NO encontrado en localStorage');
            }
        } else {
            console.log('❌ Antony NO encontrado en localStorage');
        }
    } else {
        console.log('❌ No hay datos en localStorage');
    }
} catch (error) {
    console.error('❌ Error leyendo localStorage:', error);
}

// 2. Verificar AppState
console.log('🏪 APPSTATE:');
console.log('📅 Mes/año actual:', AppState.currentMonth, '/', AppState.currentYear);
console.log('📊 Empleados en AppState:', AppState.scheduleData.size);

const turnosAntony = AppState.scheduleData.get(8);
if (turnosAntony) {
    console.log('👤 Turnos de Antony en AppState:', turnosAntony.length);

    // Buscar día 30
    const turno30 = turnosAntony.find(t => t.dia === 30);
    if (turno30) {
        console.log('📅 Día 30 en AppState:', turno30);
        console.log('📅 Fecha del turno:', turno30.fecha);
        if (turno30.fecha) {
            const fecha = turno30.fecha instanceof Date ? turno30.fecha : new Date(turno30.fecha);
            console.log('📅 Mes/año del turno:', fecha.getMonth(), '/', fecha.getFullYear());
            console.log('📅 Es del mes actual:', fecha.getMonth() === AppState.currentMonth && fecha.getFullYear() === AppState.currentYear);
        }
    } else {
        console.log('❌ Día 30 NO encontrado en AppState');
    }
} else {
    console.log('❌ Antony NO encontrado en AppState');
}

console.log('🧪 === FIN DIAGNÓSTICO ===');