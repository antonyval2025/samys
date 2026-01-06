// 🔍 SCRIPT DE DIAGNÓSTICO PARA NOTIFICATIONSYSTEM
// Pegar esta línea ENTERA en la consola del navegador:

(function() {
    console.clear();
    console.log('%c📊 DIAGNÓSTICO NOTIFICATIONSYSTEM', 'background: #2196F3; color: white; padding: 10px; font-size: 14px;');
    console.log('═'.repeat(80));
    
    // 1️⃣ Verificar si existe
    console.log('\n1️⃣ EXISTENCIA:');
    console.log('window.NotificationSystem existe:', typeof window.NotificationSystem);
    console.log('Es un objeto:', window.NotificationSystem !== null && typeof window.NotificationSystem === 'object');
    
    // 2️⃣ Listar todas las propiedades y métodos
    console.log('\n2️⃣ PROPIEDADES Y MÉTODOS:');
    const keys = Object.keys(window.NotificationSystem);
    console.log(`Total de propiedades/métodos: ${keys.length}`);
    console.table(keys.map(k => ({
        nombre: k,
        tipo: typeof window.NotificationSystem[k],
        esFunction: typeof window.NotificationSystem[k] === 'function' ? '✅ Función' : '📦 Propiedad'
    })));
    
    // 3️⃣ Verificar métodos específicos
    console.log('\n3️⃣ MÉTODOS ESPERADOS:');
    const metodosEsperados = [
        'show',
        'mostrarHistorial',
        'limpiarHistorial',
        'cerrarNotificacion',
        'activarSonidos',
        'desactivarSonidos',
        'cambiarPosicion',
        'reproducirSonido'
    ];
    
    metodosEsperados.forEach(metodo => {
        const existe = typeof window.NotificationSystem[metodo] === 'function';
        const emoji = existe ? '✅' : '❌';
        console.log(`${emoji} ${metodo}: ${existe ? 'Función disponible' : 'NO ENCONTRADO'}`);
    });
    
    // 4️⃣ Verificar historial
    console.log('\n4️⃣ HISTORIAL:');
    console.log('Existe historial:', Array.isArray(window.NotificationSystem.historial));
    console.log('Historial tiene elementos:', window.NotificationSystem.historial.length);
    
    // 5️⃣ Test práctico
    console.log('\n5️⃣ TEST PRÁCTICO:');
    try {
        window.NotificationSystem.show('🧪 Test de NotificationSystem', 'info', 3000);
        console.log('✅ show() funcionó correctamente');
    } catch (e) {
        console.error('❌ Error al ejecutar show():', e.message);
    }
    
    try {
        const hist = window.NotificationSystem.mostrarHistorial();
        console.log('✅ mostrarHistorial() funcionó, encontraron', hist.length, 'notificaciones');
    } catch (e) {
        console.error('❌ Error al ejecutar mostrarHistorial():', e.message);
    }
    
    // 6️⃣ Estructura JSON
    console.log('\n6️⃣ ESTRUCTURA JSON DEL OBJETO:');
    const estructura = {};
    for (let key in window.NotificationSystem) {
        const val = window.NotificationSystem[key];
        if (typeof val === 'function') {
            estructura[key] = 'FUNCIÓN';
        } else if (Array.isArray(val)) {
            estructura[key] = `ARRAY[${val.length}]`;
        } else if (typeof val === 'object') {
            estructura[key] = 'OBJETO';
        } else {
            estructura[key] = typeof val;
        }
    }
    console.log(JSON.stringify(estructura, null, 2));
    
    console.log('\n═'.repeat(80));
    console.log('%c✅ Diagnóstico completado', 'background: #4CAF50; color: white; padding: 10px;');
})();
