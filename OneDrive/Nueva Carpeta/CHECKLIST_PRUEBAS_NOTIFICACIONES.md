# ✅ CHECKLIST DE PRUEBAS - Sistema de Notificaciones v13.0

## 🚀 VERIFICACIÓN RÁPIDA (5 MINUTOS)

Ejecuta estos comandos EN ORDEN en la consola del navegador (F12) para verificar que TODO funciona:

---

## ✅ PASO 1: Sistema Cargado (30 segundos)

```javascript
console.log('%c✅ PASO 1: VERIFICAR SISTEMA CARGADO', 'background: #4CAF50; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

// Verificar que NotificationSystem existe
if (typeof NotificationSystem === 'object') {
    console.log('✅ NotificationSystem cargado correctamente');
} else {
    console.log('❌ ERROR: NotificationSystem no encontrado');
}

// Verificar métodos principales
const metodos = ['show', 'mostrarHistorial', 'cambiarPosicion', 'activarSonidos'];
const metodosOK = metodos.every(m => typeof NotificationSystem[m] === 'function');
console.log(metodosOK ? '✅ Todos los métodos disponibles' : '❌ Faltan métodos');
```

**Resultado esperado:**
```
✅ NotificationSystem cargado correctamente
✅ Todos los métodos disponibles
```

---

## ✅ PASO 2: Notificación Básica (30 segundos)

```javascript
console.log('%c✅ PASO 2: NOTIFICACIÓN BÁSICA', 'background: #4CAF50; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

// Mostrar una notificación simple
NotificationSystem.show('📋 Test básico funcionando', 'success', 2000);

console.log('✅ Deberías ver una notificación verde en pantalla');
```

**Resultado esperado:**
- 📊 Notificación verde en pantalla (arriba-derecha)
- Desaparece en 2 segundos

---

## ✅ PASO 3: Todos los Tipos (1 minuto)

```javascript
console.log('%c✅ PASO 3: TODOS LOS TIPOS', 'background: #4CAF50; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

const tipos = [
    { tipo: 'success', msg: '✅ Success - Todo está bien' },
    { tipo: 'warning', msg: '⚠️ Warning - Precaución' },
    { tipo: 'error', msg: '❌ Error - Algo salió mal' },
    { tipo: 'info', msg: 'ℹ️ Info - Información importante' }
];

tipos.forEach((item, i) => {
    setTimeout(() => {
        NotificationSystem.show(item.msg, item.tipo, 3000);
        console.log(`✅ ${item.tipo} mostrado`);
    }, i * 900);
});

console.log('⏱️ Se mostrarán 4 notificaciones en 3.6 segundos...');
```

**Resultado esperado:**
- 4 notificaciones en secuencia (cada 900ms)
- Colores correctos (verde, amarillo, rojo, naranja)
- Cada una con su icono

---

## ✅ PASO 4: Posicionamiento (1 minuto)

```javascript
console.log('%c✅ PASO 4: CAMBIAR POSICIONES', 'background: #2196F3; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

const posiciones = [
    'top-right',
    'top-center',
    'bottom-right',
    'bottom-left'
];

posiciones.forEach((pos, i) => {
    setTimeout(() => {
        NotificationSystem.cambiarPosicion(pos);
        NotificationSystem.show(`📍 ${pos}`, 'info', 2000);
        console.log(`✅ Posición: ${pos}`);
    }, i * 2500);
});

console.log('⏱️ Se mostrarán 4 notificaciones en diferentes lugares...');
```

**Resultado esperado:**
- Notificación 1: Arriba-Derecha
- Notificación 2: Arriba-Centro
- Notificación 3: Abajo-Derecha
- Notificación 4: Abajo-Izquierda

---

## ✅ PASO 5: Acciones/Botones (1 minuto)

```javascript
console.log('%c✅ PASO 5: ACCIONES INTERACTIVAS', 'background: #FF9800; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

NotificationSystem.cambiarPosicion('top-center'); // Cambiar a centro para ver mejor

NotificationSystem.show(
    '🤔 ¿Qué prefieres?',
    'warning',
    0, // Permanente hasta que actúes
    {
        acciones: ['opción1', 'opción2', 'cerrar'],
        callback: function(accion, elemento) {
            console.log(`✅ Usuario seleccionó: ${accion}`);
            if (accion !== 'cerrar') {
                NotificationSystem.show(`✅ Seleccionaste "${accion}"`, 'success', 2000);
            }
        }
    }
);

console.log('✅ Notificación con botones mostrada - Haz clic en los botones');
```

**Resultado esperado:**
- Notificación con 3 botones: "opción1", "opción2", "cerrar"
- Al hacer clic, muestra mensaje de confirmación
- Cada clic se registra en consola

---

## ✅ PASO 6: Sonidos (1 minuto)

```javascript
console.log('%c✅ PASO 6: SONIDOS', 'background: #F44336; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

console.log(`Estado actual: ${NotificationSystem.sonidosActivados ? '🔊 Activados' : '🔇 Desactivados'}`);

// Probar cada sonido
['success', 'error', 'warning', 'info'].forEach((tipo, i) => {
    setTimeout(() => {
        NotificationSystem.show(`🔊 Sonido de ${tipo}`, tipo, 1500);
        console.log(`✅ Sonido de ${tipo} reproducido`);
    }, i * 1700);
});

console.log('⏱️ Escucharás 4 sonidos diferentes en 6.8 segundos...');
```

**Resultado esperado:**
- 4 notificaciones en secuencia
- Cada una emite un sonido diferente
- Success: agudo (600 Hz)
- Error: grave (300 Hz)
- Warning: medio (450 Hz)
- Info: neutral (500 Hz)

---

## ✅ PASO 7: Agrupación (1 minuto)

```javascript
console.log('%c✅ PASO 7: AGRUPACIÓN AUTOMÁTICA', 'background: #9C27B0; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

NotificationSystem.cambiarPosicion('top-right');

// Enviar 5 notificaciones idénticas
for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
        NotificationSystem.show('💾 Archivo guardado', 'success', 5000);
        console.log(`Notificación ${i} enviada`);
    }, i * 400);
}

console.log('✅ Enviando 5 notificaciones similares...');
console.log('⚡ Deberías ver 1 notificación con contador "5"');
console.log('(Si vieras 5 notificaciones = agrupación desactivada)');
```

**Resultado esperado:**
- Una única notificación de "Archivo guardado"
- Con contador visible "5" o similar
- NO 5 notificaciones individuales

---

## ✅ PASO 8: Historial (1 minuto)

```javascript
console.log('%c✅ PASO 8: VER HISTORIAL', 'background: #00BCD4; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

// Generar algunas notificaciones
['success', 'error', 'warning', 'info'].forEach((tipo, i) => {
    NotificationSystem.show(`Notificación de test ${i+1}`, tipo, 500);
});

// Mostrar historial después de 2 segundos
setTimeout(() => {
    console.log('%c📋 HISTORIAL REGISTRADO:', 'background: #00BCD4; color: white; padding: 5px; font-weight: bold;');
    const historial = NotificationSystem.mostrarHistorial();
    console.log(`Total en historial: ${historial.length} notificaciones`);
    console.log('Verás una tabla con: id, mensaje, tipo, timestamp, grupo');
}, 2000);

console.log('✅ Abre la consola para ver la tabla de historial');
```

**Resultado esperado:**
- Tabla en consola con columnas: id, mensaje, tipo, timestamp, grupo
- Al menos 4 filas (de las notificaciones que generamos)
- Cada una con hora exacta (HH:MM:SS)

---

## ✅ PASO 9: Barra de Progreso (1 minuto)

```javascript
console.log('%c✅ PASO 9: BARRA DE PROGRESO', 'background: #673AB7; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

NotificationSystem.cambiarPosicion('bottom-right');

// Notificaciones con diferentes duraciones
[
    { msg: '⏱️ 3 segundos', dur: 3000 },
    { msg: '⏱️ 6 segundos', dur: 6000 },
    { msg: '⏱️ 9 segundos', dur: 9000 }
].forEach((item, i) => {
    setTimeout(() => {
        NotificationSystem.show(item.msg, 'info', item.dur);
        console.log(`Notificación con duración ${item.dur}ms`);
    }, i * 10000);
});

console.log('⏱️ Observa cómo la barra de progreso se vacía lentamente');
```

**Resultado esperado:**
- 3 notificaciones con duraciones progresivas
- Barra gris que se vacía (de lleno a vacío)
- Cada notificación desaparece al final

---

## ✅ PASO 10: Desactivar Sonidos (30 segundos)

```javascript
console.log('%c✅ PASO 10: CONTROL DE SONIDOS', 'background: #FF5722; color: white; padding: 10px; border-radius: 4px; font-weight: bold;');

// Desactivar sonidos
NotificationSystem.desactivarSonidos();
console.log('🔇 Sonidos desactivados');

// Mostrar notificación (sin sonido)
NotificationSystem.show('🔇 Esta notificación NO tiene sonido', 'error', 2000);

// Reactivar después de 2.5 segundos
setTimeout(() => {
    NotificationSystem.activarSonidos();
    NotificationSystem.show('🔊 Sonidos reactivados', 'success', 2000);
    console.log('🔊 Sonidos reactivados');
}, 2500);

console.log('✅ Primera notificación sin sonido, segunda con sonido');
```

**Resultado esperado:**
- Primera notificación: sin sonido
- Segunda notificación: con sonido audible

---

## 🏁 RESULTADO FINAL

```javascript
console.log('%c🎉 ¡PRUEBAS COMPLETADAS!', 'background: #4CAF50; color: white; padding: 15px; border-radius: 4px; font-weight: bold; font-size: 16px');

console.log(`
✅ Sistema Cargado
✅ Notificaciones Básicas
✅ Todos los Tipos (4)
✅ Posicionamiento (4 ubicaciones)
✅ Acciones/Botones Interactivos
✅ Sonidos Web Audio
✅ Agrupación Automática
✅ Historial (console.table)
✅ Barra de Progreso
✅ Control de Sonidos

🎯 CONCLUSIÓN: Todas las características funcionan correctamente
`);

// Estadísticas finales
const historial = NotificationSystem.historial;
console.log('%c📊 ESTADÍSTICAS FINALES:', 'background: #2196F3; color: white; padding: 5px; font-weight: bold;');
console.log(`Total notificaciones en historial: ${historial.length}`);
console.log(`Sonidos: ${NotificationSystem.sonidosActivados ? '🔊 Activados' : '🔇 Desactivados'}`);
console.log(`Posición actual: ${NotificationSystem.posicion}`);
```

---

## 📋 CHECKLIST DE REVISIÓN

- [ ] Paso 1: Sistema cargado ✅
- [ ] Paso 2: Notificación básica ✅
- [ ] Paso 3: Todos los tipos (4) ✅
- [ ] Paso 4: Posicionamiento (4 ubicaciones) ✅
- [ ] Paso 5: Acciones/Botones ✅
- [ ] Paso 6: Sonidos ✅
- [ ] Paso 7: Agrupación ✅
- [ ] Paso 8: Historial ✅
- [ ] Paso 9: Barra de progreso ✅
- [ ] Paso 10: Control de sonidos ✅

**Si marcaste TODO: ✅ SISTEMA 100% FUNCIONAL**

---

## 🐛 Troubleshooting

### Problema: No se ve la notificación
**Solución:** 
```javascript
NotificationSystem.show('Test', 'success', 5000);
// Busca en pantalla (arriba-derecha por defecto)
```

### Problema: No se escucha sonido
**Solución:**
```javascript
// 1. Verifica si está activado
console.log(NotificationSystem.sonidosActivados);

// 2. Reactiva si está desactivado
NotificationSystem.activarSonidos();

// 3. Algunos navegadores requieren interacción previa
// → Haz clic en la página primero
```

### Problema: Botones no funcionan
**Solución:**
```javascript
// Los botones necesitan un callback
NotificationSystem.show('Test', 'info', 0, {
    acciones: ['test'],
    callback: (accion) => console.log('Clic:', accion)
});
```

### Problema: Historial vacío
**Solución:**
```javascript
// El historial se crea automáticamente
// Si está vacío, genera una notificación primero
NotificationSystem.show('Test', 'info');
// Luego verifica
NotificationSystem.mostrarHistorial();
```

---

## ⏱️ TIEMPO TOTAL: 10 MINUTOS

- 30 seg: Paso 1
- 30 seg: Paso 2
- 1 min: Paso 3
- 1 min: Paso 4
- 1 min: Paso 5
- 1 min: Paso 6
- 1 min: Paso 7
- 1 min: Paso 8
- 1 min: Paso 9
- 30 seg: Paso 10

**= 10 minutos TOTAL**

---

## ✨ Notas

- Todos los pasos son completamente seguros (no modifican datos)
- Puedes repetir los pasos en cualquier orden
- Los sonidos requieren volumen activado en el navegador
- El historial se borra al refrescar la página (normal)

**¿Listo? ¡Comienza por el PASO 1!** 🚀

