# 🚀 GUÍA DE USO - ModuleManager y MetricasModule

## ✅ Fase 1 Completada

### Lo que se implementó:

1. **ModuleManager** - Sistema central de gestión de módulos
   - Registra y carga módulos
   - Verifica dependencias
   - Proporciona acceso a módulos

2. **MetricasModule** - Módulo de análisis y estadísticas
   - Calcula métricas automáticamente
   - Genera reportes HTML
   - Exporta en JSON y CSV
   - Sistema de caché

## 📚 Cómo usar

### Acceder a un módulo desde la consola
```javascript
// Obtener el módulo
const modulo = ModuleManager.get('Metricas');

// Usar el módulo
ModuleManager.get('Metricas').abrirModal();
```

### Ver todos los módulos cargados
```javascript
ModuleManager.list();
// Muestra tabla con los módulos disponibles
```

### Obtener métricas sin abrir modal
```javascript
const metricas = MetricasModule.obtenerMetricas();
console.log(metricas);
// { empleadosActivos: 5, totalHoras: 850, totalTurnosNoche: 15, ... }
```

### Exportar métricas
```javascript
// JSON
const json = MetricasModule.exportarJSON();

// CSV
const csv = MetricasModule.exportarCSV();

// Descargar CSV
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'metricas.csv';
a.click();
```

### Trabajar con caché
```javascript
// Desactivar caché (recalcula cada vez)
MetricasModule.deshabilitarCache();

// Actualizar datos cacheados
MetricasModule.actualizarCache();

// Reactivar caché
MetricasModule.habilitarCache();
```

## 🔍 Inspeccionar módulos

### Ver módulo de métricas completo
```javascript
console.log(MetricasModule);
```

### Verificar si módulo está cargado
```javascript
if (ModuleManager.get('Metricas')) {
    console.log('✅ Métricas disponible');
}
```

### Listar todos
```javascript
ModuleManager.verificar(['Metricas']);
// Retorna true si todos están, false si falta alguno
```

## 🎯 Casos de Uso

### Caso 1: Mostrar notificación cuando se abre métricas
```javascript
function abrirMetricas() {
    NotificationSystem.show('Cargando métricas...', 'info');
    MetricasModule.abrirModal();
    
    const metricas = MetricasModule.obtenerMetricas();
    if (metricas.empleadosActivos === 0) {
        NotificationSystem.show('⚠️ No hay empleados activos', 'warning');
    }
}
```

### Caso 2: Auto-refresh de métricas
```javascript
setInterval(() => {
    MetricasModule.actualizarCache();
    console.log('✓ Métricas actualizadas');
}, 30000); // Cada 30 segundos
```

### Caso 3: Validar datos antes de exportar
```javascript
function exportarMetricas() {
    const metricas = MetricasModule.obtenerMetricas();
    
    if (!metricas) {
        NotificationSystem.show('No hay datos para exportar', 'error');
        return;
    }
    
    const csv = MetricasModule.exportarCSV();
    // Descargar...
}
```

## 🔄 Patrón de Módulos

Todos los futuros módulos seguirán este patrón:

```javascript
window.NuevoModule = (function() {
    // ===== VARIABLES PRIVADAS =====
    let privado = 'solo accesible aquí';
    
    // ===== FUNCIONES PRIVADAS =====
    function ayudante() {
        return privado;
    }
    
    // ===== API PÚBLICA =====
    return {
        metodoPublico: function() {
            return ayudante();
        },
        
        otroMetodo: function(param) {
            console.log(param);
        }
    };
})();

// Registrar
ModuleManager.register('Nuevo', NuevoModule);
```

## 🛠️ Ventajas de esta arquitectura

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Encapsulación** | ❌ Todo global | ✅ Datos privados |
| **Reutilización** | ❌ Copiar todo | ✅ Importar módulo |
| **Testing** | ❌ Difícil | ✅ Aislar módulo |
| **Mantenibilidad** | ❌ 6500 líneas | ✅ 200-300 líneas por módulo |
| **Escalabilidad** | ❌ Código espagueti | ✅ Estructura clara |

## 📋 Próximos pasos

### Fase 2: Migrar más módulos
- [ ] CalendarioModule
- [ ] ExportacionModule
- [ ] GestionEmpleadosModule

### Fase 3: Mejoras
- [ ] Sistema de eventos entre módulos
- [ ] Persistencia de estado de módulos
- [ ] Lazy loading
- [ ] Documentación automática

## ⚠️ Importante

1. **No modifiques módulos directamente en HTML**
   - Siempre usa ModuleManager.get() primero
   
2. **Espera a DOMContentLoaded**
   - Los módulos se cargan en el evento load
   
3. **Verifica disponibilidad**
   - Usa ModuleManager.verificar() antes de usar

## 🎓 Ejemplo Completo: Análisis de Datos

```javascript
// Obtener el módulo
const metricas = ModuleManager.get('Metricas');

if (!metricas) {
    console.error('Módulo no disponible');
    exit;
}

// Calcular
const datos = metricas.obtenerMetricas();

// Validar
if (!datos || datos.empleadosActivos === 0) {
    console.warn('Sin datos');
    return;
}

// Analizar
console.log(`
  📊 RESUMEN
  Empleados: ${datos.empleadosActivos}
  Horas: ${datos.totalHoras}h
  Noche: ${datos.totalTurnosNoche}
`);

// Exportar
const json = metricas.exportarJSON();
console.log(json);
```

---

**Estado:** ✅ Fase 1 Completada  
**Próxima:** Fase 2 (CalendarioModule)  
**Contacto:** El sistema está listo para expandir
