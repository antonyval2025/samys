// 🔧 Script de Verificación Automática del Sistema Modal A+B
// Este script se ejecuta automáticamente al cargar la aplicación

(function verificarSistemaAB() {
    // Guard: Esperar a que TurnoManager esté disponible
    if (typeof window.TurnoManager === 'undefined') {
        console.log('[VerificacionAB] Esperando a que TurnoManager se cargue...');
        setTimeout(verificarSistemaAB, 100);
        return;
    }
    
    console.log('════════════════════════════════════════════════════════════════');
    console.log('🔍 VERIFICACIÓN AUTOMÁTICA DEL SISTEMA MODAL A+B');
    console.log('════════════════════════════════════════════════════════════════');
    
    let checksOk = 0;
    let checksTotal = 10;
    
    // CHECK 1: AppState
    console.log('\n1️⃣ Verificando AppState...');
    if (typeof window.AppState !== 'undefined' && window.AppState.scheduleData instanceof Map) {
        console.log('   ✅ AppState disponible');
        console.log(`   - Turnos cargados: ${window.AppState.scheduleData.size} empleados`);
        console.log(`   - Mes actual: ${window.AppState.currentMonth}/${window.AppState.currentYear}`);
        checksOk++;
    } else {
        console.error('   ❌ AppState NO disponible');
    }
    
    // CHECK 2: TurnoManager
    console.log('\n2️⃣ Verificando TurnoManager...');
    if (typeof window.TurnoManager !== 'undefined') {
        console.log('   ✅ TurnoManager disponible');
        checksOk++;
    } else {
        console.error('   ❌ TurnoManager NO disponible');
    }
    
    // CHECK 3: Botón
    console.log('\n3️⃣ Verificando botón #btnGenerarTurnos...');
    const btn = document.getElementById('btnGenerarTurnos');
    if (btn) {
        console.log('   ✅ Botón encontrado en DOM');
        console.log(`   - Visible: ${btn.style.display !== 'none'}`);
        console.log(`   - Texto: "${btn.textContent}"`);
        checksOk++;
    } else {
        console.error('   ❌ Botón NO encontrado');
    }
    
    // CHECK 4: Modal
    console.log('\n4️⃣ Verificando modal #modalGenerarTurnos...');
    const modal = document.getElementById('modalGenerarTurnos');
    if (modal) {
        console.log('   ✅ Modal encontrado en DOM');
        console.log(`   - Activo: ${modal.classList.contains('active')}`);
        checksOk++;
    } else {
        console.error('   ❌ Modal NO encontrado');
    }
    
    // CHECK 5: Método esCuadranteVacio
    console.log('\n5️⃣ Verificando TurnoManager.esCuadranteVacio()...');
    if (typeof window.TurnoManager !== 'undefined' && typeof window.TurnoManager.esCuadranteVacio === 'function') {
        try {
            const vacio = window.TurnoManager.esCuadranteVacio();
            console.log(`   ✅ Función disponible: esCuadranteVacio() = ${vacio}`);
            checksOk++;
        } catch (e) {
            console.error(`   ❌ Error ejecutando: ${e.message}`);
        }
    } else {
        console.error('   ❌ Función NO disponible');
    }
    
    // CHECK 6: Método mostrarModalGeneracion
    console.log('\n6️⃣ Verificando TurnoManager.mostrarModalGeneracion()...');
    if (typeof window.TurnoManager !== 'undefined' && typeof window.TurnoManager.mostrarModalGeneracion === 'function') {
        console.log('   ✅ Función disponible: mostrarModalGeneracion()');
        checksOk++;
    } else {
        console.error('   ❌ Función NO disponible');
    }
    
    // CHECK 7: Método cerrarModalGeneracion
    console.log('\n7️⃣ Verificando TurnoManager.cerrarModalGeneracion()...');
    if (typeof window.TurnoManager !== 'undefined' && typeof window.TurnoManager.cerrarModalGeneracion === 'function') {
        console.log('   ✅ Función disponible: cerrarModalGeneracion()');
        checksOk++;
    } else {
        console.error('   ❌ Función NO disponible');
    }
    
    // CHECK 8: Método generarTurnos
    console.log('\n8️⃣ Verificando TurnoManager.generarTurnos()...');
    if (typeof window.TurnoManager !== 'undefined' && typeof window.TurnoManager.generarTurnos === 'function') {
        console.log('   ✅ Función disponible: generarTurnos()');
        checksOk++;
    } else {
        console.error('   ❌ Función NO disponible');
    }
    
    // CHECK 9: Método verificarYMostrarBoton
    console.log('\n9️⃣ Verificando TurnoManager.verificarYMostrarBoton()...');
    if (typeof window.TurnoManager !== 'undefined' && typeof window.TurnoManager.verificarYMostrarBoton === 'function') {
        console.log('   ✅ Función disponible: verificarYMostrarBoton()');
        checksOk++;
    } else {
        console.error('   ❌ Función NO disponible');
    }
    
    // CHECK 10: UI Manager
    console.log('\n🔟 Verificando UI Manager...');
    if (typeof window.UI !== 'undefined' && typeof window.UI.generarCuadranteGeneral === 'function') {
        console.log('   ✅ UI Manager disponible');
        checksOk++;
    } else {
        console.error('   ❌ UI Manager NO disponible');
    }
    
    // RESUMEN
    console.log('\n════════════════════════════════════════════════════════════════');
    console.log(`📊 RESULTADO: ${checksOk}/${checksTotal} verificaciones OK (${(checksOk/checksTotal*100).toFixed(0)}%)`);
    console.log('════════════════════════════════════════════════════════════════');
    
    if (checksOk === checksTotal) {
        console.log('✅ ¡SISTEMA COMPLETAMENTE FUNCIONAL! Puedes usar A+B sin problemas.');
        console.log('\n📋 INSTRUCCIONES:');
        console.log('1. Si cuadrante está VACÍO → verás botón "📋 Generar Turnos" (verde)');
        console.log('2. Haz clic en el botón → se abre modal');
        console.log('3. Haz clic en "Generar" → se generan turnos');
        console.log('4. Si cuadrante tiene datos → botón se oculta automáticamente');
        console.log('5. Cambia de mes → botón reaparece si está vacío');
    } else if (checksOk >= 8) {
        console.warn('⚠️ Sistema mayormente funcional pero hay algunos problemas menores.');
        console.log('Revisa los errores arriba para más detalles.');
    } else {
        console.error('❌ Sistema tiene problemas críticos. Ver errores arriba.');
    }
    
    console.log('════════════════════════════════════════════════════════════════\n');
    
    // COMANDOS ÚTILES
    console.log('💡 COMANDOS ÚTILES EN LA CONSOLA:');
    console.log('');
    console.log('// Ver si botón está visible:');
    console.log('document.getElementById("btnGenerarTurnos")?.style?.display');
    console.log('');
    console.log('// Ver si cuadrante está vacío:');
    console.log('TurnoManager.esCuadranteVacio()');
    console.log('');
    console.log('// Ver datos del mes actual:');
    console.log('AppState.scheduleData');
    console.log('');
    console.log('// Simular clic en botón:');
    console.log('TurnoManager.mostrarModalGeneracion()');
    console.log('');
    console.log('// Generar turnos manualmente:');
    console.log('TurnoManager.generarTurnos()');
    console.log('');
    console.log('// Limpiar localStorage:');
    console.log('localStorage.clear(); location.reload();');
    console.log('\n');
})();
