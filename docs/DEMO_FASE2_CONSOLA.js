// DEMO RÁPIDA - Pruebas de los 3 módulos FASE 2
// Ejecutar en consola del navegador

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🧪 DEMO FASE 2 - Departamentos, Turnos y Balanceo            ║
║  Ejecuta cada bloque de código en la consola del navegador     ║
╚════════════════════════════════════════════════════════════════╝
`);

// ============================================================
// 1️⃣ VERIFICAR CARGA DE MÓDULOS
// ============================================================
console.log('\n1️⃣ VERIFICANDO CARGA DE MÓDULOS...');
console.log('─'.repeat(50));

const modulosDisponibles = {
    DepartamentosManager: typeof DepartamentosManager !== 'undefined',
    GeneradorTurnosDepartamentos: typeof GeneradorTurnosDepartamentos !== 'undefined',
    BalanceadorTurnos: typeof BalanceadorTurnos !== 'undefined',
    ModuleManager: typeof ModuleManager !== 'undefined'
};

console.table(modulosDisponibles);

if (Object.values(modulosDisponibles).some(v => !v)) {
    console.error('❌ No todos los módulos están cargados. Espera 2-3 segundos y reinicia.');
}


// ============================================================
// 2️⃣ LISTAR DEPARTAMENTOS DISPONIBLES
// ============================================================
console.log('\n2️⃣ DEPARTAMENTOS DISPONIBLES');
console.log('─'.repeat(50));

const departamentos = DepartamentosManager.listarDepartamentos();
console.table(departamentos);


// ============================================================
// 3️⃣ ASIGNAR EMPLEADOS A DEPARTAMENTO
// ============================================================
console.log('\n3️⃣ ASIGNANDO EMPLEADOS A DEPARTAMENTOS');
console.log('─'.repeat(50));
console.log(`
// Ejecuta en consola:
// Asignar primer empleado a Limpieza
DepartamentosManager.asignarEmpleadoADepartamento(1, 'limpieza');

// Asignar segundo empleado a Enfermería
DepartamentosManager.asignarEmpleadoADepartamento(2, 'enfermeria');

// Otros quedan en 'default'
`);


// ============================================================
// 4️⃣ GENERAR TURNOS PARA LIMPIEZA
// ============================================================
console.log('\n4️⃣ GENERANDO TURNOS ESPECÍFICOS');
console.log('─'.repeat(50));
console.log(`
// Ejecuta para generar turnos de limpieza (enero 2026):
const turnosLimpieza = GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamento(1, 1, 2026);
console.table(turnosLimpieza.slice(0, 10)); // Ver primeros 10 días

// Verificar estándar
console.log('Turnos generados:', turnosLimpieza.length);
console.log('Horas totales:', turnosLimpieza.reduce((s, t) => s + t.horas, 0));
console.log('Esperado: 39h/semana aprox.');
`);


// ============================================================
// 5️⃣ VALIDAR TURNOS
// ============================================================
console.log('\n5️⃣ VALIDAR CUMPLIMIENTO DE ESTÁNDARES');
console.log('─'.repeat(50));
console.log(`
// Ejecuta:
const turnosLimpieza = GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamento(1, 1, 2026);
const validacion = GeneradorTurnosDepartamentos.validarTurnosDepartamento(1, turnosLimpieza, 'limpieza');
console.log('Validación:', validacion);

// Resultado esperado:
// - departamento: 'Limpieza'
// - horasEsperadas: ~169h (39h * 4.33 semanas)
// - cumple: true
`);


// ============================================================
// 6️⃣ CALCULAR EQUIDAD DE TURNOS
// ============================================================
console.log('\n6️⃣ ANALIZAR EQUIDAD DE TURNOS');
console.log('─'.repeat(50));
console.log(`
// Ejecuta:
const turnosLimpieza = GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamento(1, 1, 2026);
const equidad = BalanceadorTurnos.calcularEquidadTurnos(1, turnosLimpieza, 'limpieza');
console.log('Equidad:', equidad);

// Resultado esperado:
// - equidad: 85-100 (puntuación de 0-100%)
// - stats: { totalTurnos, turnosMañana, turnosTarde, descansos, horasTotales, ... }
// - departamento: 'Limpieza'
`);


// ============================================================
// 7️⃣ BALANCEO AUTOMÁTICO COMPLETO
// ============================================================
console.log('\n7️⃣ BALANCEO AUTOMÁTICO DE TODO EL EQUIPO');
console.log('─'.repeat(50));
console.log(`
// Ejecuta (si empleados está disponible):
if (typeof empleados !== 'undefined') {
    const turnosPorEmpleado = new Map();
    empleados.forEach(emp => {
        const turnos = GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamento(emp.id, 1, 2026);
        turnosPorEmpleado.set(emp.id, turnos);
    });
    
    const balanceo = BalanceadorTurnos.aplicarBalanceoAutomatico(empleados, turnosPorEmpleado);
    console.log('Balanceo completado:', balanceo);
}

// Resultado esperado:
// - analisis: { distribucion, departamentos }
// - recomendaciones: [...] (alertas de desbalance)
// - estadisticasGenerales: { empleadosTotales, departamentos }
`);


// ============================================================
// 8️⃣ RESUMEN RÁPIDO
// ============================================================
console.log('\n8️⃣ RESUMEN DEL SISTEMA');
console.log('─'.repeat(50));
console.log(`
// Ver estado de departamentos:
console.log(DepartamentosManager.obtenerEstado());

// Ver último balanceo:
console.log(BalanceadorTurnos.obtenerUltimoBalanceo());

// Ver resumen:
console.log(BalanceadorTurnos.obtenerResumenBalanceo());
`);


// ============================================================
// 📋 TIPOS DE TURNO POR DEPARTAMENTO
// ============================================================
console.log('\n📋 TIPOS DE TURNO DISPONIBLES');
console.log('─'.repeat(50));

const tiposGeneral = GeneradorTurnosDepartamentos.obtenerTiposTurno('default');
const tiposLimpieza = GeneradorTurnosDepartamentos.obtenerTiposTurno('limpieza');

console.log('\n🏢 DEPARTAMENTO GENERAL:');
console.table(tiposGeneral);

console.log('\n🧹 DEPARTAMENTO LIMPIEZA:');
console.table(tiposLimpieza);


// ============================================================
// 🎯 PRÓXIMOS PASOS
// ============================================================
console.log(`
╔════════════════════════════════════════════════════════════════╗
║  🎯 PRÓXIMOS PASOS                                             ║
╠════════════════════════════════════════════════════════════════╣
║  1. Asigna empleados a departamentos                           ║
║  2. Genera turnos específicos                                  ║
║  3. Valida cumplimiento de estándares                          ║
║  4. Calcula equidad por empleado                               ║
║  5. Ejecuta balanceo automático                                ║
║  6. Revisa recomendaciones                                     ║
║  7. Implementa UI para gestión                                 ║
╚════════════════════════════════════════════════════════════════╝
`);

console.log('✅ Demo lista. Copia y ejecuta los bloques de código anteriores.');
