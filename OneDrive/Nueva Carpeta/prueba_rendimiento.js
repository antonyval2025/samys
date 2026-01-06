// Script de prueba de rendimiento para edición de turnos
console.log('🧪 PRUEBA DE RENDIMIENTO: Edición de turnos en cuadrante general');

// Función para medir tiempo de edición
function medirTiempoEdicion() {
    console.log('⏱️ Midiendo tiempo de edición de turno...');

    // Verificar que UI esté disponible
    if (typeof UI === 'undefined' || typeof UI.abrirEditorTurno !== 'function') {
        console.error('❌ UI.abrirEditorTurno no está disponible');
        return;
    }

    // Simular clic en una celda de turno
    const turnoCeldas = document.querySelectorAll('.turno-celda');
    if (turnoCeldas.length === 0) {
        console.error('❌ No se encontraron celdas de turno');
        return;
    }

    const primeraCelda = turnoCeldas[0];
    const empleadoId = parseInt(primeraCelda.dataset.empleadoId);
    const dia = parseInt(primeraCelda.dataset.dia);

    console.log(`🎯 Probando con empleado ${empleadoId}, día ${dia}`);

    // Simular apertura del editor
    console.time('abrirEditorTurno');
    UI.abrirEditorTurno(empleadoId, dia);
    console.timeEnd('abrirEditorTurno');

    // Esperar un poco y simular guardado
    setTimeout(() => {
        const selectTurno = document.querySelector('#selectTurno');
        if (selectTurno) {
            console.log('✅ Modal abierto, cambiando turno...');
            selectTurno.value = 'tarde'; // Cambiar a tarde

            // Simular clic en guardar
            const btnGuardar = document.querySelector('#btnGuardar');
            if (btnGuardar) {
                console.time('guardarCambioTurno');
                btnGuardar.click();
                console.timeEnd('guardarCambioTurno');
            } else {
                console.error('❌ Botón guardar no encontrado');
            }
        } else {
            console.error('❌ Select de turno no encontrado');
        }
    }, 500);
}

// Función para verificar observadores
function verificarObservadores() {
    console.log('🔍 Verificando observadores registrados...');
    console.log('DataChangeManager existe:', typeof DataChangeManager !== 'undefined');

    if (typeof DataChangeManager !== 'undefined') {
        console.log('Número de observadores:', DataChangeManager.observers.length);
        console.log('Observador cuadrante general registrado:', !!window._cuadranteGeneralObserverRegistrado);
        console.log('Observador cuadrante individual registrado:', !!window._cuadranteIndividualObserverRegistrado);
    }
}

// Función para verificar rendimiento de regeneración
function medirRegeneracion() {
    console.log('⏱️ Midiendo regeneración del cuadrante general...');
    console.time('regeneracionCompleta');
    UI.generarCuadranteGeneral();
    console.timeEnd('regeneracionCompleta');
}

// Ejecutar pruebas después de carga - ESPERAR A QUE UI ESTÉ DISPONIBLE
function esperarUI() {
    if (typeof UI !== 'undefined' && typeof UI.generarCuadranteGeneral === 'function') {
        console.log('✅ UI disponible, ejecutando pruebas de rendimiento...');
        setTimeout(() => {
            verificarObservadores();
            medirRegeneracion();

            // Esperar a que termine la regeneración inicial
            setTimeout(medirTiempoEdicion, 2000);
        }, 1000); // Pequeño delay adicional para estabilidad
    } else {
        console.log('⏳ Esperando a que UI esté disponible...');
        setTimeout(esperarUI, 100);
    }
}

// Iniciar espera de UI
esperarUI();

// Monitorear errores
window.addEventListener('error', (e) => {
    console.error('🚨 ERROR JAVASCRIPT:', e.message, 'en', e.filename, ':', e.lineno);
});

// Monitorear mensajes de notificación
const originalShow = window.NotificationSystem?.show;
if (window.NotificationSystem) {
    window.NotificationSystem.show = function(message, type, duration) {
        console.log(`📢 NOTIFICACIÓN: "${message}" (tipo: ${type})`);
        return originalShow.call(this, message, type, duration);
    };
}