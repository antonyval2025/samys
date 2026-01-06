# 📬 Sistema de Notificaciones Mejorado - Guía Completa

## Resumen de Mejoras Implementadas

✅ **🔊 Sonidos** - Notificaciones auditivas con Web Audio API
✅ **📋 Historial** - Registro completo de todas las notificaciones
✅ **🔗 Acciones** - Botones interactivos en las notificaciones
✅ **⏱️ Progress** - Barra de progreso visual con duración
✅ **🎯 Posicionamiento** - 4 posiciones diferentes
✅ **🔔 Grupos** - Agrupación automática de notificaciones similares
✅ **📊 Contador** - Badge con número de repeticiones

---

## 🚀 Uso Básico

### Notificación Simple
```javascript
NotificationSystem.show('¡Listo!', 'success');
```

### Notificación con Duración Custom
```javascript
NotificationSystem.show('Precaución', 'warning', 5000);
```

### Notificación sin Auto-cierre
```javascript
NotificationSystem.show('Espera aquí', 'info', 0); // Durará indefinidamente
```

---

## 📋 Tipos de Notificaciones

| Tipo | Color | Icono | Acciones Default |
|------|-------|-------|------------------|
| `success` | Verde (#22c55e) | ✅ | cerrar |
| `error` | Rojo (#ef4444) | ❌ | reintentar, cerrar |
| `warning` | Amarillo (#f59e0b) | ⚠️ | aceptar, cerrar |
| `info` | Naranja (#f97316) | ℹ️ | cerrar |

---

## 🎯 Posicionamiento

Cambiar posición por defecto:
```javascript
NotificationSystem.cambiarPosicion('top-center');
NotificationSystem.cambiarPosicion('bottom-right');
```

Opciones disponibles:
- `top-right` - Arriba a la derecha (default)
- `top-center` - Arriba centrado
- `bottom-right` - Abajo a la derecha
- `bottom-left` - Abajo a la izquierda

---

## 🔗 Acciones Personalizadas

### Con Callbacks
```javascript
NotificationSystem.show(
    'Confirmar eliminación',
    'warning',
    0, // Sin cierre automático
    {
        acciones: ['confirmar', 'cancelar'],
        callback: function(accion, elemento) {
            if (accion === 'confirmar') {
                console.log('✅ Confirmado');
                // Hacer algo
            }
        }
    }
);
```

### Acciones Disponibles por Default
- `cerrar` - ✕ Cierra la notificación
- `reintentar` - 🔄 Reintentar operación
- `aceptar` - ✓ Aceptar
- `ver` - 👁️ Ver detalles

### Crear Acciones Custom
```javascript
{
    acciones: ['descargar', 'compartir', 'cerrar'],
    callback: function(accion, elemento) {
        switch(accion) {
            case 'descargar':
                console.log('Descargando...');
                break;
            case 'compartir':
                console.log('Compartiendo...');
                break;
            case 'cerrar':
                NotificationSystem.cerrarNotificacion(elemento);
                break;
        }
    }
}
```

---

## 🔔 Agrupación de Notificaciones

Por defecto, notificaciones similares se agrupan automáticamente:

```javascript
// Primera notificación
NotificationSystem.show('Archivo guardado', 'success', 3000);

// 2 segundos después...
NotificationSystem.show('Archivo guardado', 'success', 3000);
// → En lugar de 2 notificaciones, se muestra 1 con contador "2"
```

Desactivar agrupación:
```javascript
NotificationSystem.show('No agrupar', 'info', 3000, {
    agrupar: false
});
```

---

## 🔊 Control de Sonidos

### Activar/Desactivar Sonidos
```javascript
// Desactivar sonidos
NotificationSystem.desactivarSonidos();

// Activar sonidos
NotificationSystem.activarSonidos();
```

### Sonidos por Tipo
- **Success** - 600 Hz (agudo)
- **Error** - 300 Hz (grave)
- **Warning** - 450 Hz (medio)
- **Info** - 500 Hz (neutral)

---

## 📋 Historial de Notificaciones

### Ver Historial en Consola
```javascript
NotificationSystem.mostrarHistorial();
// → Abre tabla con todas las notificaciones (últimas 50)
```

### Propiedades del Historial
```javascript
[
    {
        id: 0,
        mensaje: "Archivo guardado",
        tipo: "success",
        timestamp: "14:30:45",  // HH:MM:SS
        grupo: "success-Archivo guard..."
    },
    // ... más notificaciones
]
```

### Limpiar Historial
```javascript
NotificationSystem.limpiarHistorial();
```

### Acceso Programático
```javascript
const historial = NotificationSystem.mostrarHistorial();
console.log(`Total notificaciones: ${historial.length}`);

// Filtrar por tipo
const errores = historial.filter(n => n.tipo === 'error');
console.log(`Errores registrados: ${errores.length}`);
```

---

## ⏱️ Barra de Progreso

Automática en toda notificación con duración:
```javascript
NotificationSystem.show(
    'Descargando archivo...',
    'info',
    5000 // Barra llena que se vacía en 5 segundos
);
```

---

## 💡 Ejemplos Prácticos

### 1️⃣ Descarga de Archivo
```javascript
NotificationSystem.show(
    'Descargando cuadrante.pdf',
    'info',
    3000,
    {
        acciones: ['cancelar'],
        callback: (accion) => {
            if (accion === 'cancelar') {
                console.log('Descarga cancelada');
            }
        }
    }
);
```

### 2️⃣ Error con Reintentar
```javascript
NotificationSystem.show(
    'Error: No se pudo guardar',
    'error',
    0,
    {
        acciones: ['reintentar', 'cerrar'],
        callback: (accion) => {
            if (accion === 'reintentar') {
                console.log('Reintentando...');
                // Lógica de reintento
            }
        }
    }
);
```

### 3️⃣ Confirmación Crítica
```javascript
NotificationSystem.show(
    '¿Eliminar empleado de forma permanente?',
    'warning',
    0, // Permanente hasta que actúe
    {
        acciones: ['confirmar', 'cancelar'],
        callback: (accion) => {
            if (accion === 'confirmar') {
                // Ejecutar eliminación
                EmployeeManager.eliminarEmpleado(empleadoId);
            }
        }
    }
);
```

### 4️⃣ Notificación en Abajo Centrado
```javascript
NotificationSystem.show(
    'Cambios guardados automáticamente',
    'success',
    2000,
    {
        posicion: 'bottom-right'
    }
);
```

### 5️⃣ Múltiples Notificaciones (Agrupadas)
```javascript
// Estas 3 se agruparán en 1 notificación con contador "3"
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        NotificationSystem.show('Guardado', 'success', 2000);
    }, i * 500);
}
```

---

## 🔧 Configuración Global

### Cambiar Número Máximo de Historiales
```javascript
// En tu código al inicializar
NotificationSystem.maxHistorial = 100; // Default: 50
```

### Cambiar Duración Default
```javascript
// Modificar en cada llamada o crear wrapper
function miNotif(msg, tipo) {
    NotificationSystem.show(msg, tipo, 4000); // 4s por defecto
}
```

---

## 📊 Estadísticas de Notificaciones

```javascript
// Obtener estadísticas desde consola
const historial = NotificationSystem.historial;
const stats = {
    total: historial.length,
    porTipo: {
        success: historial.filter(n => n.tipo === 'success').length,
        error: historial.filter(n => n.tipo === 'error').length,
        warning: historial.filter(n => n.tipo === 'warning').length,
        info: historial.filter(n => n.tipo === 'info').length,
    }
};
console.table(stats);
```

---

## 🎨 Personalización CSS

### Cambiar Colores de Notificaciones
```css
.notificacion.success {
    background: #my-custom-color !important;
}
```

### Cambiar Animación de Entrada
```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px); /* De arriba */
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## ✅ Integración con Código Existente

### Sustituciones Directas
Todas las llamadas antiguas funcionan igual:

```javascript
// Antes (sigue funcionando)
NotificationSystem.show('Guardado', 'success');

// Ahora con mejoras
NotificationSystem.show('Guardado', 'success', 3000, {
    acciones: ['cerrar'],
    posicion: 'bottom-right'
});
```

---

## 🐛 Debugging

### Inspeccionar Estado Actual
```javascript
console.log('Historial:', NotificationSystem.historial);
console.log('Grupos activos:', NotificationSystem.grupos);
console.log('Sonidos activados:', NotificationSystem.sonidosActivados);
console.log('Posición actual:', NotificationSystem.posicion);
```

### Simular Múltiples Notificaciones
```javascript
['success', 'error', 'warning', 'info'].forEach((tipo, i) => {
    setTimeout(() => {
        NotificationSystem.show(`Test ${tipo}`, tipo, 5000);
    }, i * 800);
});
```

---

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

**Nota**: Web Audio API (para sonidos) requiere navegadores modernos. Si no está disponible, las notificaciones seguirán funcionando sin sonido.

---

## 🚀 Próximas Mejoras Sugeridas

1. 📧 Email notifications para cambios críticos
2. 🔔 Push notifications en móvil
3. 💾 Persistencia de historial en localStorage
4. 🌍 Soporte para múltiples idiomas
5. 🎯 Notificaciones flotantes personalizadas
6. ⌨️ Accesos rápidos de teclado (Ctrl+Z para deshacer)

