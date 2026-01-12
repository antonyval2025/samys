/**
 * ⏳ SISTEMA DE GUARDIAS GLOBALES
 * Evita que archivos JS accedan a variables indefinidas
 * Se carga ANTES de todos los demás scripts
 */

console.log('[guardias-globales.js] Instalando guardias globales...');

// ⏳ Crear placeholder para NotificationSystem si no existe
if (typeof NotificationSystem === 'undefined') {
    window.NotificationSystem = {
        show: function(message, type, duration, opciones) {
            console.log(`[NotificationSystem PLACEHOLDER] ${type}: ${message}`);
        },
        mostrarHistorial: function() { 
            console.log('[NotificationSystem PLACEHOLDER] mostrarHistorial'); 
            return [];
        },
        limpiarHistorial: function() { 
            console.log('[NotificationSystem PLACEHOLDER] limpiarHistorial');
        },
        activarSonidos: function() { 
            console.log('[NotificationSystem PLACEHOLDER] activarSonidos');
        },
        desactivarSonidos: function() { 
            console.log('[NotificationSystem PLACEHOLDER] desactivarSonidos');
        },
        cambiarPosicion: function(pos) { 
            console.log('[NotificationSystem PLACEHOLDER] cambiarPosicion:', pos);
        },
        reproducirSonido: function(tipo) { 
            console.log('[NotificationSystem PLACEHOLDER] reproducirSonido:', tipo);
        },
        cerrarNotificacion: function(elem) { 
            console.log('[NotificationSystem PLACEHOLDER] cerrarNotificacion');
        },
        getIcon: function(type) { return 'ℹ️'; },
        getBackgroundColor: function(type) { return '#3498db'; }
    };
    console.log('[guardias-globales.js] ✅ Placeholder NotificationSystem creado');
}

// ⏳ Crear placeholder para AppState si no existe
if (typeof AppState === 'undefined') {
    window.AppState = {
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        selectedEmployee: null,
        scheduleData: new Map(),
        filters: {},
        cambiosPendientes: [],
        rangoSeleccionado: null,
        userRole: 'admin',
        saveToStorage: function() { console.log('[AppState PLACEHOLDER] saveToStorage'); },
        loadFromStorage: function() { console.log('[AppState PLACEHOLDER] loadFromStorage'); }
    };
    console.log('[guardias-globales.js] ✅ Placeholder AppState creado');
}

// ⏳ Crear placeholder para TurnoManager si no existe
if (typeof TurnoManager === 'undefined') {
    window.TurnoManager = {
        formatearTurno: function(t) { return t?.charAt(0)?.toUpperCase() || '-'; },
        formatearTurnoCompleto: function(t) { return t || '-'; },
        obtenerOpcionesTurno: function() { return []; }
    };
    console.log('[guardias-globales.js] ✅ Placeholder TurnoManager creado');
}

// ⏳ Crear placeholder para DateUtils si no existe
if (typeof DateUtils === 'undefined') {
    window.DateUtils = {
        getNombreMes: function(i) { 
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[i] || '';
        },
        getDiasEnMes: function(a, m) { return new Date(a, m + 1, 0).getDate(); },
        esDiaHabil: function(f) { const d = f.getDay(); return d !== 0 && d !== 6; },
        formatearFecha: function(f) { return f?.toLocaleDateString('es-ES') || ''; }
    };
    console.log('[guardias-globales.js] ✅ Placeholder DateUtils creado');
}

// ⏳ Crear placeholder para UI si no existe
if (typeof UI === 'undefined') {
    window.UI = {
        generarCuadranteGeneral: function() { console.log('[UI PLACEHOLDER] generarCuadranteGeneral'); },
        generarCuadranteIndividual: function() { console.log('[UI PLACEHOLDER] generarCuadranteIndividual'); },
        actualizarTitulosMes: function() { console.log('[UI PLACEHOLDER] actualizarTitulosMes'); }
    };
    console.log('[guardias-globales.js] ✅ Placeholder UI creado');
}

console.log('[guardias-globales.js] ✅ Todas las guardias instaladas correctamente');
