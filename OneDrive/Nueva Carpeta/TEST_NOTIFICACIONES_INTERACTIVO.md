# 🧪 Demo Interactivo - Sistema de Notificaciones Mejorado

## Ejecuta esto en la consola del navegador para probar todas las características:

---

## 1️⃣ TEST BÁSICO - Todos los Tipos

```javascript
console.log('%c🧪 TEST 1: TIPOS DE NOTIFICACIONES BÁSICAS', 'background: #4CAF50; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

NotificationSystem.show('✅ Operación completada', 'success', 3000);

setTimeout(() => {
    NotificationSystem.show('⚠️ Tenga cuidado con esto', 'warning', 3000);
}, 500);

setTimeout(() => {
    NotificationSystem.show('ℹ️ Información importante', 'info', 3000);
}, 1000);

setTimeout(() => {
    NotificationSystem.show('❌ Algo salió mal', 'error', 3000);
}, 1500);

console.log('✅ TEST 1 completado - Debería ver 4 notificaciones');
```

---

## 2️⃣ TEST POSICIONAMIENTO - Cambiar Ubicación

```javascript
console.log('%c🧪 TEST 2: CAMBIAR POSICIONES', 'background: #2196F3; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

const posiciones = ['top-right', 'top-center', 'bottom-right', 'bottom-left'];
const mensajes = ['Arriba-Derecha', 'Arriba-Centro', 'Abajo-Derecha', 'Abajo-Izquierda'];

posiciones.forEach((pos, i) => {
    setTimeout(() => {
        NotificationSystem.cambiarPosicion(pos);
        NotificationSystem.show(`📍 Posición: ${mensajes[i]}`, 'info', 2000);
    }, i * 800);
});

console.log('✅ TEST 2 completado - Verá 4 notificaciones en diferentes lugares');
```

---

## 3️⃣ TEST ACCIONES - Botones Interactivos

```javascript
console.log('%c🧪 TEST 3: NOTIFICACIONES CON ACCIONES', 'background: #FF9800; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

NotificationSystem.show(
    '📥 ¿Descargar archivo?',
    'warning',
    0, // Permanente hasta actuar
    {
        acciones: ['descargar', 'cancelar'],
        callback: function(accion) {
            if (accion === 'descargar') {
                NotificationSystem.show('✅ Descargando...', 'success', 2000);
            } else if (accion === 'cancelar') {
                NotificationSystem.show('❌ Descarga cancelada', 'info', 2000);
            }
        }
    }
);

console.log('✅ TEST 3 completado - Haz clic en los botones de la notificación');
```

---

## 4️⃣ TEST AGRUPACIÓN - Notificaciones Similares se Agrupan

```javascript
console.log('%c🧪 TEST 4: AGRUPACIÓN AUTOMÁTICA', 'background: #9C27B0; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

// Enviar 5 notificaciones similares rápidamente
for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        NotificationSystem.show('💾 Archivo guardado', 'success', 5000);
        console.log(`Notificación ${i} enviada`);
    }, i * 400);
}

console.log('✅ TEST 4 completado - Las 5 notificaciones deberían agruparse en 1 con contador');
```

---

## 5️⃣ TEST SONIDOS - Activar/Desactivar Audio

```javascript
console.log('%c🧪 TEST 5: CONTROL DE SONIDOS', 'background: #F44336; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

// Mostrar estado actual
console.log(`Estado actual: ${NotificationSystem.sonidosActivados ? '🔊 Activados' : '🔇 Desactivados'}`);

// Mostrar con sonido
NotificationSystem.show('🔊 Con sonido (success)', 'success', 2000);

setTimeout(() => {
    // Desactivar sonidos
    NotificationSystem.desactivarSonidos();
    NotificationSystem.show('🔇 Sin sonido (error) - No escucharás nada', 'error', 2000);
}, 2500);

setTimeout(() => {
    // Reactivar sonidos
    NotificationSystem.activarSonidos();
    NotificationSystem.show('🔊 Sonidos reactivados (warning)', 'warning', 2000);
}, 5000);

console.log('✅ TEST 5 completado');
```

---

## 6️⃣ TEST HISTORIAL - Ver Registro de Notificaciones

```javascript
console.log('%c🧪 TEST 6: VER HISTORIAL', 'background: #00BCD4; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

// Generar algunas notificaciones
for (let i = 1; i <= 3; i++) {
    const tipos = ['success', 'warning', 'error'];
    NotificationSystem.show(`Notificación de prueba ${i}`, tipos[i-1], 1000);
}

setTimeout(() => {
    console.log('%c📋 HISTORIAL COMPLETO:', 'background: #00BCD4; color: white; padding: 5px; border-radius: 2px; font-weight: bold;');
    const historial = NotificationSystem.mostrarHistorial();
    console.log(`Total en historial: ${historial.length}`);
}, 1500);

console.log('✅ TEST 6 completado - Ver tabla en consola abajo');
```

---

## 7️⃣ TEST ERROR CON REINTENTAR - Caso Realista

```javascript
console.log('%c🧪 TEST 7: ERROR CON REINTENTAR', 'background: #E91E63; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

let intentos = 0;

function simularErrorReintentar() {
    NotificationSystem.show(
        `⚠️ Error al guardar (Intento ${intentos + 1}/3)`,
        'error',
        0,
        {
            acciones: ['reintentar', 'cerrar'],
            callback: function(accion, elemento) {
                if (accion === 'reintentar') {
                    intentos++;
                    if (intentos < 3) {
                        NotificationSystem.cerrarNotificacion(elemento);
                        setTimeout(simularErrorReintentar, 500);
                    } else {
                        NotificationSystem.cerrarNotificacion(elemento);
                        NotificationSystem.show('✅ ¡Guardado exitosamente!', 'success', 3000);
                    }
                }
            }
        }
    );
}

simularErrorReintentar();

console.log('✅ TEST 7 completado - Prueba hacer clic en "Reintentar"');
```

---

## 8️⃣ TEST BARRA DE PROGRESO - Duración Visual

```javascript
console.log('%c🧪 TEST 8: BARRA DE PROGRESO', 'background: #673AB7; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

const duraciones = [
    { msg: '⏱️ 2 segundos', dur: 2000 },
    { msg: '⏱️ 5 segundos', dur: 5000 },
    { msg: '⏱️ 8 segundos', dur: 8000 }
];

duraciones.forEach((item, i) => {
    setTimeout(() => {
        NotificationSystem.show(item.msg, 'info', item.dur);
        console.log(`Notificación ${i + 1} con duración ${item.dur}ms`);
    }, i * 2500);
});

console.log('✅ TEST 8 completado - Observa cómo la barra se vacía');
```

---

## 9️⃣ TEST LIMPIAR HISTORIAL

```javascript
console.log('%c🧪 TEST 9: LIMPIAR HISTORIAL', 'background: #607D8B; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

console.log(`Notificaciones antes: ${NotificationSystem.historial.length}`);

NotificationSystem.limpiarHistorial();

console.log(`Notificaciones después: ${NotificationSystem.historial.length}`);
console.log('✅ TEST 9 completado - Historial limpiado');
```

---

## 🔟 TEST ESTADÍSTICAS - Análisis de Notificaciones

```javascript
console.log('%c🧪 TEST 10: ESTADÍSTICAS', 'background: #1976D2; color: white; padding: 10px; border-radius: 4px; font-weight: bold; font-size: 14px');

// Generar varias notificaciones
const tipos = ['success', 'success', 'error', 'warning', 'info', 'success'];
tipos.forEach((tipo, i) => {
    setTimeout(() => {
        NotificationSystem.show(`Estadística ${i+1}`, tipo, 1000);
    }, i * 300);
});

setTimeout(() => {
    const historial = NotificationSystem.historial;
    const stats = {
        'Total': historial.length,
        'Success': historial.filter(n => n.tipo === 'success').length,
        'Error': historial.filter(n => n.tipo === 'error').length,
        'Warning': historial.filter(n => n.tipo === 'warning').length,
        'Info': historial.filter(n => n.tipo === 'info').length,
    };
    
    console.log('%c📊 ESTADÍSTICAS:', 'background: #1976D2; color: white; padding: 5px; border-radius: 2px; font-weight: bold;');
    console.table(stats);
}, 2500);

console.log('✅ TEST 10 completado - Ver tabla de estadísticas abajo');
```

---

## 🎬 EJECUTAR TODOS LOS TESTS EN SECUENCIA

```javascript
console.log('%c🎬 INICIANDO SUITE COMPLETA DE TESTS', 'background: #4CAF50; color: white; padding: 15px; border-radius: 4px; font-weight: bold; font-size: 16px');

const tests = [
    { 
        name: 'TEST 1: Tipos Básicos',
        delay: 0,
        fn: () => {
            ['success', 'warning', 'info', 'error'].forEach((tipo, i) => {
                setTimeout(() => {
                    NotificationSystem.show(`Test ${tipo}`, tipo, 2000);
                }, i * 600);
            });
        }
    },
    {
        name: 'TEST 2: Acciones',
        delay: 4000,
        fn: () => {
            NotificationSystem.show('¿Continuar?', 'warning', 0, {
                acciones: ['sí', 'no'],
                callback: (action) => console.log(`✅ Usuario seleccionó: ${action}`)
            });
        }
    },
    {
        name: 'TEST 3: Agrupación',
        delay: 6000,
        fn: () => {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => NotificationSystem.show('🔄 Guardado', 'success', 2000), i * 400);
            }
        }
    },
    {
        name: 'TEST 4: Historial',
        delay: 10000,
        fn: () => {
            console.log('Historial actual:');
            console.table(NotificationSystem.mostrarHistorial());
        }
    }
];

tests.forEach(test => {
    setTimeout(() => {
        console.log(`\n%c▶️ ${test.name}`, 'color: #FF9800; font-weight: bold; font-size: 12px');
        test.fn();
    }, test.delay);
});

console.log('⏱️ Suite de tests iniciada - Observa las notificaciones');
```

---

## 🎓 Guía Rápida Inline

```javascript
// Lo más básico
NotificationSystem.show('Mensaje', 'success');

// Con duración custom
NotificationSystem.show('Mensaje', 'error', 5000);

// Con acciones
NotificationSystem.show('Confirmar?', 'warning', 0, {
    acciones: ['sí', 'no'],
    callback: (accion) => console.log(accion)
});

// Ver historial
NotificationSystem.mostrarHistorial();

// Cambiar posición
NotificationSystem.cambiarPosicion('bottom-right');

// Control de sonidos
NotificationSystem.desactivarSonidos();
NotificationSystem.activarSonidos();
```

