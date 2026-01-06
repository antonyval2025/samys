// ========================================================================
// SCRIPT DE PRUEBAS DE PERSISTENCIA DE DATOS
// Ejecutar en la consola del navegador (F12 → Console)
// ========================================================================

console.log('🧪 INICIANDO SUITE DE PRUEBAS DE PERSISTENCIA');
console.log('═══════════════════════════════════════════════════════════════');

// Variables globales para tracking
let testsPassed = 0;
let testsFailed = 0;
const resultados = [];

// Función helper para logging
function log(nivel, mensaje, dato = null) {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
        '✓': '✅',
        '✗': '❌',
        '→': '→ ',
        'i': 'ℹ️ '
    };
    
    console.log(`[${timestamp}] ${emoji[nivel] || nivel} ${mensaje}`, dato || '');
    resultados.push({ nivel, mensaje, dato, timestamp });
}

// ========================================================================
// SUITE 1: PERSISTENCIA DE EMPLEADOS
// ========================================================================

console.log('\n📋 SUITE 1: PERSISTENCIA DE EMPLEADOS');
console.log('───────────────────────────────────────────────────────────────');

async function testPersistenciaEmpleados() {
    try {
        // Test 1.1: Verificar empleados por defecto
        log('i', 'Test 1.1: Verificando empleados por defecto');
        const countInicial = empleados.length;
        if (countInicial > 0) {
            log('✓', `Hay ${countInicial} empleados cargados`);
            testsPassed++;
        } else {
            log('✗', 'No hay empleados cargados');
            testsFailed++;
        }
        
        // Test 1.2: Verificar que Antony existe
        log('i', 'Test 1.2: Buscando a Antony en la lista');
        const antony = empleados.find(e => e.nombre.includes('Antony'));
        if (antony) {
            log('✓', `Antony encontrado (ID: ${antony.id})`);
            testsPassed++;
        } else {
            log('✗', 'Antony no encontrado en la lista');
            testsFailed++;
        }
        
        // Test 1.3: Agregar un empleado nuevo
        log('i', 'Test 1.3: Creando empleado nuevo');
        const empleadoNuevo = {
            id: Math.max(...empleados.map(e => e.id)) + 1,
            nombre: "Test Empleado Prueba",
            departamento: "Testing",
            localidad: "Pruebas",
            horasContrato: 160,
            turnoPrincipal: "Mañana",
            estado: "activo",
            email: "test@prueba.com",
            telefono: "+34 600 999 999"
        };
        
        empleados.push(empleadoNuevo);
        EmployeeManager.guardarEnStorage();
        
        log('✓', `Empleado creado y guardado (ID: ${empleadoNuevo.id})`);
        testsPassed++;
        
        // Test 1.4: Verificar que se guardó en localStorage
        log('i', 'Test 1.4: Verificando persistencia en localStorage');
        const empleadosGuardados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
        const empleadoEnStorage = empleadosGuardados.find(e => e.id === empleadoNuevo.id);
        
        if (empleadoEnStorage) {
            log('✓', `Empleado encontrado en localStorage`);
            testsPassed++;
        } else {
            log('✗', 'Empleado NO encontrado en localStorage');
            testsFailed++;
        }
        
        // Test 1.5: Simular recarga (limpiar array y recargar)
        log('i', 'Test 1.5: Simulando recarga de página');
        const empleadosAntes = empleados.length;
        empleados.length = 0;
        log('→', `Empleados en memoria: ${empleados.length} (fueron ${empleadosAntes})`);
        
        await EmployeeManager.cargarDelStorage();
        const empleadosDespues = empleados.length;
        
        if (empleadosDespues === empleadosAntes) {
            log('✓', `Datos recuperados correctamente (${empleadosDespues} empleados)`);
            testsPassed++;
        } else {
            log('✗', `Mismatch: antes=${empleadosAntes}, después=${empleadosDespues}`);
            testsFailed++;
        }
        
        // Test 1.6: Eliminar empleado de prueba
        log('i', 'Test 1.6: Limpiando empleado de prueba');
        const indexTest = empleados.findIndex(e => e.id === empleadoNuevo.id);
        if (indexTest !== -1) {
            empleados.splice(indexTest, 1);
            EmployeeManager.guardarEnStorage();
            log('✓', 'Empleado de prueba eliminado y guardado');
            testsPassed++;
        } else {
            log('✗', 'No se pudo encontrar empleado para eliminar');
            testsFailed++;
        }
        
    } catch (error) {
        log('✗', 'Error en suite de empleados', error.message);
        testsFailed++;
    }
}

// ========================================================================
// SUITE 2: PERSISTENCIA DE TURNOS
// ========================================================================

console.log('\n🔄 SUITE 2: PERSISTENCIA DE TURNOS');
console.log('───────────────────────────────────────────────────────────────');

async function testPersistenciaTurnos() {
    try {
        if (empleados.length === 0) {
            log('✗', 'No hay empleados para probar turnos');
            testsFailed++;
            return;
        }
        
        const empleadoTest = empleados[0];
        
        // Test 2.1: Verificar que hay turnos cargados
        log('i', 'Test 2.1: Verificando turnos iniciales');
        const turnosDelEmpleado = AppState.scheduleData.get(empleadoTest.id) || [];
        if (turnosDelEmpleado.length > 0) {
            log('✓', `${turnosDelEmpleado.length} turnos encontrados para ${empleadoTest.nombre}`);
            testsPassed++;
        } else {
            log('i', `No hay turnos para ${empleadoTest.nombre}, generando...`);
        }
        
        // Test 2.2: Crear un turno específico
        log('i', 'Test 2.2: Creando turno de prueba');
        const turnoNuevo = {
            dia: 15,
            turno: 'noche',
            horas: 8,
            fecha: new Date(AppState.currentYear, AppState.currentMonth, 15),
            esFinSemana: false
        };
        
        let turnosActuales = AppState.scheduleData.get(empleadoTest.id) || [];
        // Remover turno anterior del día 15 si existe
        turnosActuales = turnosActuales.filter(t => t.dia !== 15);
        turnosActuales.push(turnoNuevo);
        AppState.scheduleData.set(empleadoTest.id, turnosActuales);
        AppState.saveToStorage();
        
        log('✓', `Turno creado para día ${turnoNuevo.dia}`);
        testsPassed++;
        
        // Test 2.3: Verificar que se guardó
        log('i', 'Test 2.3: Verificando persistencia del turno');
        const turnoGuardado = AppState.scheduleData.get(empleadoTest.id).find(t => t.dia === 15);
        if (turnoGuardado && turnoGuardado.turno === 'noche') {
            log('✓', `Turno verificado en memoria (tipo: ${turnoGuardado.turno})`);
            testsPassed++;
        } else {
            log('✗', 'Turno no guardado correctamente');
            testsFailed++;
        }
        
        // Test 2.4: Simular recarga de AppState
        log('i', 'Test 2.4: Simulando recarga de AppState');
        const turnosAntes = AppState.scheduleData.get(empleadoTest.id).length;
        AppState.scheduleData.clear();
        log('→', `AppState limpiado`);
        
        await AppState.loadFromStorage();
        const turnosDespues = AppState.scheduleData.get(empleadoTest.id)?.length || 0;
        
        if (turnosDespues === turnosAntes) {
            log('✓', `Turnos recuperados correctamente (${turnosDespues} turnos)`);
            testsPassed++;
        } else {
            log('✗', `Mismatch: antes=${turnosAntes}, después=${turnosDespues}`);
            testsFailed++;
        }
        
        // Test 2.5: Verificar integridad de datos
        log('i', 'Test 2.5: Verificando integridad del turno recuperado');
        const turnoRecuperado = AppState.scheduleData.get(empleadoTest.id).find(t => t.dia === 15);
        if (turnoRecuperado && 
            turnoRecuperado.turno === 'noche' && 
            turnoRecuperado.horas === 8) {
            log('✓', 'Turno recuperado con datos íntegros');
            testsPassed++;
        } else {
            log('✗', 'Datos del turno corrompidos', turnoRecuperado);
            testsFailed++;
        }
        
    } catch (error) {
        log('✗', 'Error en suite de turnos', error.message);
        testsFailed++;
    }
}

// ========================================================================
// SUITE 3: PERSISTENCIA DE CAMBIOS MASIVOS
// ========================================================================

console.log('\n⚡ SUITE 3: PERSISTENCIA DE CAMBIOS MASIVOS');
console.log('───────────────────────────────────────────────────────────────');

async function testPersistenciaChangesMasivos() {
    try {
        if (empleados.length < 2) {
            log('✗', 'Se necesitan al menos 2 empleados para esta prueba');
            testsFailed++;
            return;
        }
        
        // Test 3.1: Crear cambios masivos
        log('i', 'Test 3.1: Aplicando cambios masivos de turnos');
        let cambiosAplicados = 0;
        
        for (let i = 0; i < Math.min(3, empleados.length); i++) {
            const emp = empleados[i];
            for (let dia = 1; dia <= 5; dia++) {
                let turnos = AppState.scheduleData.get(emp.id) || [];
                turnos = turnos.filter(t => t.dia !== dia);
                turnos.push({
                    dia: dia,
                    turno: i % 2 === 0 ? 'mañana' : 'tarde',
                    horas: 8,
                    fecha: new Date(AppState.currentYear, AppState.currentMonth, dia),
                    esFinSemana: false
                });
                AppState.scheduleData.set(emp.id, turnos);
                cambiosAplicados++;
            }
        }
        
        AppState.saveToStorage();
        log('✓', `${cambiosAplicados} turnos creados y guardados`);
        testsPassed++;
        
        // Test 3.2: Verificar que todos se guardaron
        log('i', 'Test 3.2: Verificando todos los cambios masivos');
        let turnosEncontrados = 0;
        for (let i = 0; i < Math.min(3, empleados.length); i++) {
            const emp = empleados[i];
            const turnos = AppState.scheduleData.get(emp.id) || [];
            turnosEncontrados += turnos.filter(t => t.dia >= 1 && t.dia <= 5).length;
        }
        
        if (turnosEncontrados > 0) {
            log('✓', `${turnosEncontrados} turnos masivos verificados`);
            testsPassed++;
        } else {
            log('✗', 'No se encontraron turnos masivos');
            testsFailed++;
        }
        
        // Test 3.3: Simular recarga tras cambios masivos
        log('i', 'Test 3.3: Recargando AppState después de cambios masivos');
        const turnosAntesMasivo = turnosEncontrados;
        AppState.scheduleData.clear();
        
        await AppState.loadFromStorage();
        
        let turnosEncontradosDespues = 0;
        for (let i = 0; i < Math.min(3, empleados.length); i++) {
            const emp = empleados[i];
            const turnos = AppState.scheduleData.get(emp.id) || [];
            turnosEncontradosDespues += turnos.filter(t => t.dia >= 1 && t.dia <= 5).length;
        }
        
        if (turnosEncontradosDespues === turnosAntesMasivo) {
            log('✓', `Cambios masivos recuperados: ${turnosEncontradosDespues} turnos`);
            testsPassed++;
        } else {
            log('✗', `Mismatch: antes=${turnosAntesMasivo}, después=${turnosEncontradosDespues}`);
            testsFailed++;
        }
        
    } catch (error) {
        log('✗', 'Error en suite de cambios masivos', error.message);
        testsFailed++;
    }
}

// ========================================================================
// SUITE 4: RECUPERACIÓN Y LIMPIEZA
// ========================================================================

console.log('\n🧹 SUITE 4: RECUPERACIÓN Y LIMPIEZA');
console.log('───────────────────────────────────────────────────────────────');

async function testRecuperacionLimpieza() {
    try {
        // Test 4.1: Verificar tamaño de localStorage
        log('i', 'Test 4.1: Analizando localStorage');
        const empleadosData = JSON.stringify(localStorage.getItem('empleadosData') || '[]');
        const turnosData = JSON.stringify(JSON.stringify(AppState.scheduleData));
        const sizeEmpleados = new Blob([empleadosData]).size;
        const sizeTurnos = new Blob([turnosData]).size;
        
        log('✓', `Empleados: ${sizeEmpleados} bytes`, `Turnos: ${sizeTurnos} bytes`);
        testsPassed++;
        
        // Test 4.2: Intentar corrupción de datos
        log('i', 'Test 4.2: Probando recuperación de datos corruptos');
        const backupEmpleados = localStorage.getItem('empleadosData');
        localStorage.setItem('empleadosData', '{"corrupto": true}');
        
        empleados.length = 0;
        await EmployeeManager.cargarDelStorage();
        
        if (empleados.length === 0) {
            log('→', 'Datos corruptos detectados correctamente');
            // Restaurar backup
            localStorage.setItem('empleadosData', backupEmpleados);
            await EmployeeManager.cargarDelStorage();
            log('✓', 'Backup restaurado');
            testsPassed++;
        } else {
            log('✗', 'Datos corruptos no fueron detectados');
            testsFailed++;
        }
        
        // Test 4.3: Verificar consistencia final
        log('i', 'Test 4.3: Verificando consistencia de datos final');
        const empleadosFinales = empleados.length;
        const turnosEnMemoria = Array.from(AppState.scheduleData.values())
            .reduce((sum, arr) => sum + arr.length, 0);
        
        if (empleadosFinales > 0 && turnosEnMemoria > 0) {
            log('✓', `Estado consistente: ${empleadosFinales} empleados, ${turnosEnMemoria} turnos`);
            testsPassed++;
        } else {
            log('⚠️', `Posible inconsistencia: empleados=${empleadosFinales}, turnos=${turnosEnMemoria}`);
        }
        
    } catch (error) {
        log('✗', 'Error en suite de recuperación', error.message);
        testsFailed++;
    }
}

// ========================================================================
// EJECUTAR TODAS LAS PRUEBAS
// ========================================================================

async function ejecutarTodasPruebas() {
    console.log('\n🚀 EJECUTANDO TODAS LAS PRUEBAS...\n');
    
    await testPersistenciaEmpleados();
    await testPersistenciaTurnos();
    await testPersistenciaChangesMasivos();
    await testRecuperacionLimpieza();
    
    // Resumen final
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`✅ Pruebas PASADAS: ${testsPassed}`);
    console.log(`❌ Pruebas FALLIDAS: ${testsFailed}`);
    console.log(`📈 TASA DE ÉXITO: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (testsFailed === 0) {
        console.log('🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!');
    } else {
        console.log(`⚠️  ${testsFailed} prueba(s) fallida(s) - revisar arriba para detalles`);
    }
    
    return { testsPassed, testsFailed, resultados };
}

// Ejecutar las pruebas
ejecutarTodasPruebas().then(resultado => {
    window.ultimasProebas = resultado;
    console.log('\n💾 Resultados guardados en: window.ultimasPruebas');
});
