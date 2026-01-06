# 🔌 GUÍA DE INTEGRACIÓN - Sistema de Notificaciones v13.0

**Para:** Desarrolladores que integrarán nuevas características

---

## 🎯 Objetivo

Documentar cómo integrar el sistema de notificaciones mejorado en:
- Nueva funcionalidad
- Validaciones
- Operaciones asincrónicas
- Manejo de errores
- Confirmaciones de usuario

---

## 📋 Índice Rápido

1. Notificaciones básicas
2. Con validación
3. Con acciones
4. Con API asincrónica
5. Con manejo de errores
6. Patrones recomendados

---

## 1️⃣ NOTIFICACIÓN BÁSICA

```javascript
// Más simple posible
NotificationSystem.show('¡Hecho!', 'success');

// Con duración custom
NotificationSystem.show('Guardado', 'success', 2000);

// Permanente (sin auto-cierre)
NotificationSystem.show('Esperando...', 'info', 0);
```

**Tipos disponibles:**
- `success` - Verde (✅)
- `error` - Rojo (❌)
- `warning` - Amarillo (⚠️)
- `info` - Naranja (ℹ️)

---

## 2️⃣ NOTIFICACIÓN CON VALIDACIÓN

```javascript
// Validar antes de guardar
function guardarDatos(datos) {
    // Validación simple
    if (!datos.nombre || datos.nombre.length < 3) {
        NotificationSystem.show(
            '❌ El nombre debe tener al menos 3 caracteres',
            'error',
            0,
            {
                acciones: ['editar', 'cerrar'],
                callback: (accion) => {
                    if (accion === 'editar') {
                        document.getElementById('nombreInput').focus();
                    }
                }
            }
        );
        return false;
    }
    
    // Si pasó validación
    NotificationSystem.show('✅ Guardando...', 'info');
    return true;
}
```

**Patrón:** Validar → Mostrar error con acción → Si OK, continuar

---

## 3️⃣ NOTIFICACIÓN CON ACCIONES

```javascript
// Pregunta al usuario
function confirmarEliminacion(id) {
    NotificationSystem.show(
        '⚠️ ¿Eliminar este elemento permanentemente?',
        'warning',
        0, // Sin auto-cierre
        {
            acciones: ['confirmar', 'cancelar'],
            callback: (accion) => {
                if (accion === 'confirmar') {
                    eliminarElement(id);
                    NotificationSystem.show('✅ Eliminado correctamente', 'success', 2000);
                } else {
                    NotificationSystem.show('❌ Operación cancelada', 'info', 1500);
                }
            }
        }
    );
}
```

**Patrón:** Mostrar con acciones → Callback ejecuta lógica → Mostrar resultado

---

## 4️⃣ NOTIFICACIÓN CON OPERACIÓN ASYNC

```javascript
// Operación con servidor/API
async function descargarArchivo() {
    try {
        // Mostrar "cargando"
        NotificationSystem.show(
            '📥 Descargando archivo...',
            'info',
            0, // Permanente
            {
                acciones: ['cancelar'],
                callback: (accion) => {
                    // Si hace clic en cancelar, implementar lógica
                    console.log('Usuario canceló descarga');
                }
            }
        );
        
        // Ejecutar operación
        const response = await fetch('/api/descargar');
        const blob = await response.blob();
        
        // Crear descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo.pdf';
        a.click();
        
        // Mostrar éxito
        NotificationSystem.show(
            '✅ Archivo descargado correctamente',
            'success',
            3000
        );
        
    } catch (error) {
        // Mostrar error
        NotificationSystem.show(
            `❌ Error: ${error.message}`,
            'error',
            0,
            {
                acciones: ['reintentar', 'cerrar'],
                callback: (accion) => {
                    if (accion === 'reintentar') {
                        descargarArchivo(); // Llamar recursivamente
                    }
                }
            }
        );
    }
}
```

**Patrón:** Mostrar carga → Ejecutar → Mostrar resultado/error

---

## 5️⃣ NOTIFICACIÓN CON MANEJO DE ERRORES

```javascript
// Patrón robusto para cualquier operación
async function operacionRisky() {
    const operacion = 'Guardando cambios';
    let intentos = 0;
    const maxIntentos = 3;
    
    async function ejecutar() {
        try {
            NotificationSystem.show(
                `⏳ ${operacion}...`,
                'info'
            );
            
            // Tu lógica aquí
            await miAPI.guardar();
            
            NotificationSystem.show(
                `✅ ${operacion} completado`,
                'success',
                2000
            );
            
        } catch (error) {
            intentos++;
            
            if (intentos < maxIntentos) {
                NotificationSystem.show(
                    `⚠️ ${operacion} falló (Intento ${intentos}/${maxIntentos})`,
                    'warning',
                    0,
                    {
                        acciones: ['reintentar', 'cancelar'],
                        callback: (accion) => {
                            if (accion === 'reintentar') {
                                ejecutar(); // Reintentar recursivamente
                            } else {
                                NotificationSystem.show(
                                    '❌ Operación cancelada',
                                    'error',
                                    2000
                                );
                            }
                        }
                    }
                );
            } else {
                NotificationSystem.show(
                    `❌ ${operacion} falló después de ${maxIntentos} intentos`,
                    'error',
                    0,
                    {
                        acciones: ['contactar soporte', 'cerrar'],
                        callback: (accion) => {
                            if (accion === 'contactar soporte') {
                                window.location.href = 'mailto:soporte@empresa.com';
                            }
                        }
                    }
                );
            }
        }
    }
    
    await ejecutar();
}
```

**Patrón:** Try/catch → Mostrar error con reintentos → Fallback final

---

## 6️⃣ PATRONES RECOMENDADOS

### A. Flujo Linear (Simple)
```javascript
// 1. Validar
if (!valido) return mostrarError();

// 2. Ejecutar
const resultado = await operacion();

// 3. Mostrar resultado
mostrarExito();
```

### B. Flujo Confirmación
```javascript
// 1. Pedir confirmación
pedirConfirmacion(() => {
    // 2. Si confirma, ejecutar
    ejecutarOperacion();
    // 3. Mostrar resultado
    mostrarResultado();
});
```

### C. Flujo Reintentos
```javascript
// 1. Intentar
while (intentos < max) {
    try {
        ejecutar();
        break;
    } catch {
        intentos++;
        if (intentos < max) pedir reintentos();
    }
}
```

### D. Flujo Progreso
```javascript
// 1. Mostrar carga
mostrarCargando();

// 2. Progreso
for (let i = 0; i < total; i++) {
    procesarItem(i);
    // Actualizar progreso si es larga
}

// 3. Finalizar
mostrarCompletado();
```

---

## 🎯 CASOS DE USO COMUNES

### Guardar Formulario
```javascript
async function guardarFormulario() {
    // Validar
    if (!validarForm()) {
        NotificationSystem.show('❌ Revisa los campos', 'error');
        return;
    }
    
    // Guardar
    try {
        NotificationSystem.show('💾 Guardando...', 'info');
        await guardar();
        NotificationSystem.show('✅ Guardado', 'success', 2000);
    } catch (e) {
        NotificationSystem.show('❌ Error: ' + e.message, 'error', 0, {
            acciones: ['reintentar', 'cerrar'],
            callback: (a) => {
                if (a === 'reintentar') guardarFormulario();
            }
        });
    }
}
```

### Eliminar Elemento
```javascript
function eliminar(id) {
    NotificationSystem.show(
        '⚠️ ¿Eliminar permanentemente?',
        'warning',
        0,
        {
            acciones: ['eliminar', 'cancelar'],
            callback: (a) => {
                if (a === 'eliminar') {
                    API.delete(id);
                    NotificationSystem.show('✅ Eliminado', 'success', 2000);
                }
            }
        }
    );
}
```

### Descargar Archivo
```javascript
function descargar(archivo) {
    NotificationSystem.show(
        `📥 Descargando: ${archivo}`,
        'info',
        5000 // Con barra de progreso de 5s
    );
    
    API.descargar(archivo)
        .then(() => {
            NotificationSystem.show('✅ Descargado', 'success', 2000);
        })
        .catch(e => {
            NotificationSystem.show(`❌ Error: ${e.message}`, 'error');
        });
}
```

### Enviar por WhatsApp
```javascript
function enviarPorWhatsApp(datos) {
    NotificationSystem.show(
        '📱 Abriendo WhatsApp...',
        'info',
        2000,
        {
            posicion: 'bottom-right'
        }
    );
    
    abrirWhatsApp(datos);
}
```

---

## 📍 POSICIONES EN DIFERENTES CONTEXTOS

```javascript
// Top-right: Para acciones generales (default)
NotificationSystem.show('Guardado', 'success');

// Top-center: Para confirmaciones críticas
NotificationSystem.cambiarPosicion('top-center');
NotificationSystem.show('¿Confirmar?', 'warning', 0);

// Bottom-right: Para mensajes no-intrusivos
NotificationSystem.cambiarPosicion('bottom-right');
NotificationSystem.show('Cambios guardados automáticamente', 'success', 2000);

// Bottom-left: Para logs o debug
NotificationSystem.cambiarPosicion('bottom-left');
NotificationSystem.show('Debug: Operación completada', 'info', 1000);
```

---

## 🔊 CONTROL DE SONIDOS

```javascript
// En inicialización de app
document.addEventListener('DOMContentLoaded', () => {
    // Leer preferencia del usuario (si existe)
    const sonidosActivados = localStorage.getItem('sonidosNotif') !== 'false';
    
    if (!sonidosActivados) {
        NotificationSystem.desactivarSonidos();
    }
});

// Permitir usuario controlar sonidos
function toggleSonidos() {
    if (NotificationSystem.sonidosActivados) {
        NotificationSystem.desactivarSonidos();
        localStorage.setItem('sonidosNotif', 'false');
    } else {
        NotificationSystem.activarSonidos();
        localStorage.setItem('sonidosNotif', 'true');
    }
}
```

---

## 🧪 TESTING DE INTEGRACIONES

```javascript
// Función para testear tu integración
function testearNotificaciones() {
    console.log('🧪 Testing integraciones...');
    
    // Test 1: Validación
    console.log('Test 1: Validación');
    miFormulario.nombre = ''; // Inválido
    guardarFormulario();
    // Verificar que se muestra error
    
    // Test 2: Éxito
    console.log('Test 2: Éxito');
    miFormulario.nombre = 'Juan'; // Válido
    guardarFormulario();
    // Verificar que se muestra éxito
    
    // Test 3: Historial
    console.log('Test 3: Historial');
    NotificationSystem.mostrarHistorial();
    // Verificar que hay al menos 2 notificaciones
}

// Ejecutar: testearNotificaciones()
```

---

## 🚀 CHECKLIST DE INTEGRACIÓN

- [ ] Implementé validación con notificación de error
- [ ] Agreguué acciones cuando aplica (confirmar, editar, reintentar)
- [ ] Mostré feedback visual durante operación async
- [ ] Implementé reintentos para operaciones críticas
- [ ] Probé en diferentes posiciones de pantalla
- [ ] Verifiqué que funciona sin sonidos (desactivados)
- [ ] Testeé que las acciones ejecutan lógica correcta
- [ ] Verifiqué el historial con console.table()
- [ ] Agregué mensajes claros para el usuario
- [ ] Documenté la funcionalidad en comentarios

---

## 📚 REFERENCIAS

**Documentación Completa:**
- NOTIFICACIONES_MEJORADAS_GUIA.md - API completa
- TEST_NOTIFICACIONES_INTERACTIVO.md - Ejemplos
- IMPLEMENTACION_NOTIFICACIONES_v13.md - Técnico

**En Código:**
- nuevo_cuadrante_mejorado.html (líneas 4744-5005) - Implementación
- DEMO_CONSOLA_NOTIFICACIONES.js - Ejemplos ejecutables

---

## 💡 TIPS

1. **Siempre validar antes de mostrar OK:**
   ```javascript
   if (!valido) mostrarError();
   else continuar();
   ```

2. **Usar acciones para operaciones críticas:**
   ```javascript
   if (esOperacionCritica) {
       mostrarConAcciones();
   }
   ```

3. **Mostrar progreso en operaciones largas:**
   ```javascript
   NotificationSystem.show(msg, tipo, 10000); // 10s con barra
   ```

4. **Agrupar notificaciones similares:**
   ```javascript
   // Automático si el mensaje es idéntico
   // Desactivar si necesita contador individual:
   {agrupar: false}
   ```

5. **Usar callbacks para validar acciones:**
   ```javascript
   callback: (accion) => {
       if (accion === 'expected') executeLogic();
   }
   ```

---

## 🎓 RESUMEN

El sistema de notificaciones te proporciona:

✅ Feedback visual inmediato
✅ Interactividad con el usuario
✅ Manejo de errores robusto
✅ Confirmaciones seguras
✅ Historial auditable
✅ Sonidos confirmatorios
✅ Flexibilidad total

**Úsalo para mejorar la experiencia de cada interacción del usuario.**

---

**Versión:** 13.0
**Última actualización:** 3 de enero de 2026

