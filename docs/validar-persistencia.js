// Script de validación de persistencia
// Copiar y pegar en la consola del navegador (F12)

console.log('🔍 VALIDACIÓN DE PERSISTENCIA DE DATOS\n');

// 1. Ver empleados
console.log('1️⃣ EMPLEADOS:');
console.log(`   Total en memoria: ${empleados.length}`);
empleados.slice(0, 3).forEach(emp => {
    console.log(`   - ${emp.id}: ${emp.nombre} (${emp.departamento})`);
});
if (empleados.length > 3) {
    console.log(`   ... y ${empleados.length - 3} más`);
}

// 2. Ver turnos en AppState
console.log('\n2️⃣ TURNOS EN APPSTATE:');
console.log(`   Total empleados con turnos: ${AppState.scheduleData.size}`);
const firstEmployee = Array.from(AppState.scheduleData.keys())[0];
if (firstEmployee) {
    const turnos = AppState.scheduleData.get(firstEmployee);
    console.log(`   Empleado ${firstEmployee}: ${turnos.length} días`);
    console.log(`   - Día 1: ${turnos[0].turno} (${turnos[0].horas}h)`);
    console.log(`   - Día 2: ${turnos[1].turno} (${turnos[1].horas}h)`);
    console.log(`   - Día 3: ${turnos[2].turno} (${turnos[2].horas}h)`);
}

// 3. Ver localStorage
console.log('\n3️⃣ DATOS EN LOCALSTORAGE:');
const keys = Object.keys(localStorage);
console.log(`   Total keys: ${keys.length}`);
const empleadosData = localStorage.getItem('empleadosData');
const turnosAppState = localStorage.getItem('turnosAppState');
const tiposTurnoData = localStorage.getItem('tiposTurnoData');

if (empleadosData) {
    const emps = JSON.parse(empleadosData);
    console.log(`   ✓ empleadosData: ${emps.length} empleados (${(empleadosData.length / 1024).toFixed(2)} KB)`);
} else {
    console.log(`   ✗ empleadosData: VACÍO`);
}

if (turnosAppState) {
    const state = JSON.parse(turnosAppState);
    console.log(`   ✓ turnosAppState: ${state.scheduleData.length} empleados con turnos (${(turnosAppState.length / 1024).toFixed(2)} KB)`);
    console.log(`      - Mes: ${state.month}, Año: ${state.year}`);
} else {
    console.log(`   ✗ turnosAppState: VACÍO`);
}

if (tiposTurnoData) {
    const tipos = JSON.parse(tiposTurnoData);
    const tiposArray = Object.keys(tipos);
    console.log(`   ✓ tiposTurnoData: ${tiposArray.length} tipos (${(tiposTurnoData.length / 1024).toFixed(2)} KB)`);
} else {
    console.log(`   ✗ tiposTurnoData: VACÍO`);
}

// 4. Validar integridad
console.log('\n4️⃣ VALIDACIÓN DE INTEGRIDAD:');
let issues = 0;

if (empleados.length === 0) {
    console.log(`   ✗ No hay empleados en memoria`);
    issues++;
} else {
    console.log(`   ✓ Hay ${empleados.length} empleados`);
}

if (AppState.scheduleData.size === 0) {
    console.log(`   ✗ No hay turnos en AppState`);
    issues++;
} else if (AppState.scheduleData.size !== empleados.length) {
    console.log(`   ⚠ Advertencia: ${AppState.scheduleData.size} empleados tienen turnos, pero hay ${empleados.length} empleados`);
    issues++;
} else {
    console.log(`   ✓ Todos los empleados tienen turnos generados`);
}

// 5. Resumen
console.log('\n5️⃣ RESUMEN:');
if (issues === 0) {
    console.log(`   ✅ SISTEMA COMPLETAMENTE FUNCIONAL`);
    console.log(`   \n   ¿Cómo probar persistencia?`);
    console.log(`   1. Edita un turno en la tabla`);
    console.log(`   2. Haz clic en "Guardar cambios"`);
    console.log(`   3. Recarga la página (F5 o Ctrl+R)`);
    console.log(`   4. El turno debe mantener el nuevo valor`);
    console.log(`   5. Ejecuta este script nuevamente para confirmar`);
} else {
    console.log(`   ⚠ ENCONTRADOS ${issues} PROBLEMA(S) - Ver detalles arriba`);
}

// 6. Función auxiliar: Editar turno para probar
console.log('\n6️⃣ FUNCIÓN AUXILIAR PARA PROBAR:');
console.log(`   testearPersistencia() - Edita un turno y muestra cambios`);

window.testearPersistencia = function() {
    console.log('\n🧪 INICIANDO PRUEBA DE PERSISTENCIA...\n');
    
    const empId = 1;
    const turnos = AppState.scheduleData.get(empId);
    const diaTest = 0;
    const turnoOriginal = turnos[diaTest].turno;
    const turnoNuevo = turnoOriginal === 'mañana' ? 'tarde' : 'mañana';
    
    console.log(`Empleado: ${empId}`);
    console.log(`Día: ${diaTest + 1}`);
    console.log(`Turno original: ${turnoOriginal}`);
    console.log(`Cambiando a: ${turnoNuevo}`);
    
    // Cambiar
    turnos[diaTest].turno = turnoNuevo;
    
    // Guardar
    AppState.saveToStorage();
    console.log(`\n✅ Turno guardado en AppState y localStorage`);
    
    // Verificar
    const savedState = JSON.parse(localStorage.getItem('turnosAppState'));
    const savedScheduleData = new Map(savedState.scheduleData);
    const savedTurnos = savedScheduleData.get(empId);
    const savedTurno = savedTurnos[diaTest].turno;
    
    console.log(`\n📊 VERIFICACIÓN:`);
    console.log(`Turno en memoria: ${turnos[diaTest].turno}`);
    console.log(`Turno en localStorage: ${savedTurno}`);
    
    if (savedTurno === turnoNuevo) {
        console.log(`\n✅ PERSISTENCIA CORRECTA - El turno se guardó bien`);
        console.log(`\nAhora recarga la página (F5) y ejecuta:`);
        console.log(`console.log(AppState.scheduleData.get(1)[0].turno)`);
        console.log(`\nDebe mostrar: "${turnoNuevo}"`);
    } else {
        console.log(`\n❌ ERROR - El turno NO se guardó correctamente`);
    }
};

console.log(`\n   Ejecuta: testearPersistencia()`);
console.log(`   Luego recarga (F5) y verifica que el cambio persiste`);

console.log('\n═══════════════════════════════════════════════════════════');
