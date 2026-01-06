# 🔗 Guía de Integración - Módulos en HTML

## ✅ Estado Actual

El archivo `nuevo_cuadrante_mejorado.html` ha sido actualizado para cargar **todos los módulos JavaScript** y **CSS externo** de forma modular:

### Cambios Realizados

#### 1. **CSS Externo** (antes inline)
```html
<!-- Estilos en archivo externo -->
<link rel="stylesheet" href="css/estilos.css">

<!-- Fallback mínimo en caso de que CSS no cargue -->
<style>
    /* Estilos críticos mínimos */
</style>
```

#### 2. **Módulos JavaScript** (en orden de carga)
```html
<!-- 1. Módulo principal -->
<script src="js/modules.js"></script>

<!-- 2. Validaciones y balanceo -->
<script src="js/balanceo-y-restricciones.js"></script>

<!-- 3. Reportes y predicción -->
<script src="js/reportes-y-prediccion.js"></script>

<!-- 4. Multi-local (opcional) -->
<script src="js/soporte-multilocal.js"></script>

<!-- 5. Ejemplos (comentado por defecto) -->
<!-- <script src="js/ejemplos-y-best-practices.js"></script> -->
```

---

## 📋 Verificación de Dependencias

| Módulo | Requiere | Estado |
|--------|----------|--------|
| `js/modules.js` | html2canvas, jsPDF | ✅ Externas cargadas |
| `js/balanceo-y-restricciones.js` | modules.js | ✅ OK |
| `js/reportes-y-prediccion.js` | modules.js, balanceo | ✅ OK |
| `js/soporte-multilocal.js` | modules.js, reportes | ✅ OK |
| `css/estilos.css` | N/A | ✅ Enlazado |

---

## 🚀 Cómo Usar

### Opción 1: Servidor Local (Recomendado)

```bash
# En PowerShell / Terminal
cd "c:\Users\samys\OneDrive\Nueva Carpeta"

# Opción A: Python 3
python -m http.server 8000

# Opción B: Node.js (si está instalado)
npx http-server

# Opción C: Live Server (VS Code)
# Instala extensión Live Server, clic derecho en HTML > Open with Live Server
```

Luego abre: **http://localhost:8000/nuevo_cuadrante_mejorado.html**

### Opción 2: Archivo Local (Sin servidor)

Abre directamente el HTML en navegador:
```
file:///c:/Users/samys/OneDrive/Nueva%20Carpeta/nuevo_cuadrante_mejorado.html
```

⚠️ **Nota**: Algunos módulos pueden no funcionar correctamente sin servidor debido a CORS.

---

## ✨ Funcionalidades Disponibles Después de Integración

### ✅ Completamente Integradas

1. **Validaciones Robustas**
   ```javascript
   RestriccionesTurnos.validarCambioTurno(empleadoId, dia, nuevoTurno)
   // Valida: máx noche, descansos, estado, etc.
   ```

2. **Balanceo Automático**
   ```javascript
   BalanceadorTurnos.aplicarBalanceoAutomatico()
   // Distribuye turnos equitativamente
   ```

3. **Reportes Avanzados**
   ```javascript
   GeneradorReportes.generarReporteRotacion(scheduleData, empleados)
   // 4 tipos: rotación, horas, noche, fin de semana
   ```

4. **Auditoría Completa**
   ```javascript
   SistemaAuditoria.registrarCambio(cambio)
   // Historial de todos los cambios
   ```

5. **Permisos por Rol**
   ```javascript
   AppState.canEditShifts()  // true/false según rol
   // Roles: admin, supervisor, empleado
   ```

### 🟡 Framework Creado (No integrado en UI)

6. **Soporte Multi-local**
   ```javascript
   GestorLocales.crearLocal(config)
   // Gestión de múltiples sucursales/empresas
   ```

---

## 🔍 Cómo Verificar la Integración

### En la Consola del Navegador (F12)

```javascript
// Ver estado global
console.log(AppState)
// Output: { currentYear, currentMonth, scheduleData, ... }

// Verificar módulos cargados
console.log(ValidadorTurnos)
// Output: class ValidadorTurnos { ... }

console.log(BalanceadorTurnos)
// Output: class BalanceadorTurnos { ... }

console.log(GeneradorReportes)
// Output: class GeneradorReportes { ... }

// Ver empleados
console.log(empleados)
// Output: Array(7) de empleados

// Ver datos de turnos
console.log(AppState.scheduleData)
// Output: Map(7) con turnos por empleado
```

### Errores Comunes

**Error**: `ReferenceError: modules is not defined`
- ✅ **Solución**: Asegurar que `js/modules.js` está cargado primero

**Error**: `CORS policy: cross-origin request blocked`
- ✅ **Solución**: Usar servidor local (http://localhost:8000/)

**Error**: `Cannot read property 'scheduleData' of undefined`
- ✅ **Solución**: Esperar a que DOM esté listo (evento DOMContentLoaded)

---

## 📦 Estructura de Carpetas Esperada

```
c:\Users\samys\OneDrive\Nueva Carpeta\
├── nuevo_cuadrante_mejorado.html    (MODIFICADO - con imports)
├── css/
│   └── estilos.css                  (650+ líneas)
├── js/
│   ├── modules.js                   (560 líneas)
│   ├── balanceo-y-restricciones.js  (360 líneas)
│   ├── reportes-y-prediccion.js     (340 líneas)
│   ├── soporte-multilocal.js        (260 líneas)
│   └── ejemplos-y-best-practices.js (480 líneas)
├── .github/
│   └── copilot-instructions.md      (2500+ líneas)
├── README.md                        (340 líneas)
├── ARQUITECTURA.md                  (220 líneas)
└── INTEGRACION.md                   (ESTE ARCHIVO)
```

---

## 🔧 Próximos Pasos

### 1. **Completar Soporte Multi-local** (30 min)
```javascript
// En TurnoManager.inicializarDatos():
// Agregar selector de local
// Cargar datos específicos del local seleccionado
// Aplicar reglas del local
```

### 2. **Crear Interfaz de Calendario** (45 min)
```javascript
// Nuevo módulo: js/integracion-calendario.js
// Vista visual de mes/semana
// Click-to-assign turnos
// Conflictos destacados
```

### 3. **Notificaciones por Email** (30 min)
```javascript
// Integración con servicio de email
// Notificaciones al cambiar turno
// Recordatorios diarios
```

### 4. **Testing Unitario** (45 min)
```bash
# Usar Jest o Mocha
npm install --save-dev jest
npm test
```

---

## 📞 Soporte y Debugging

### Modo Debug Activado

Todos los módulos incluyen `console.log()` en:
- Inicialización
- Cambios de estado
- Errores de validación
- Cambios de auditoría

Para ver logs:
1. Abre DevTools (F12)
2. Tab "Console"
3. Realiza acciones en la app
4. Los logs aparecerán en tiempo real

### Exportar Datos para Debugging

```javascript
// Exportar estado completo como JSON
const estado = JSON.stringify({
    appState: AppState,
    empleados: empleados,
    scheduleData: Array.from(AppState.scheduleData.entries())
});

// Copiar a portapapeles
navigator.clipboard.writeText(estado);
```

---

## ✅ Checklist de Integración

- [x] CSS externo enlazado
- [x] Módulo principal (modules.js) importado
- [x] Validaciones (balanceo-y-restricciones.js) importadas
- [x] Reportes (reportes-y-prediccion.js) importados
- [x] Multi-local (soporte-multilocal.js) importado
- [x] Fallback CSS mínimo incluido
- [x] Script de inicialización agregado
- [x] Documentación creada

### Próximo Checklist (Optimizaciones)

- [ ] Precompilar CSS a minificado
- [ ] Minificar módulos JS
- [ ] Agregar Service Worker para offline
- [ ] Lazy loading de módulos (si el archivo crece)
- [ ] Transpilación a ES5 para navegadores antiguos

---

**Estado**: ✅ **Integración Completada**  
**Versión**: 8.0+  
**Fecha**: Diciembre 2025  
**Próximo paso recomendado**: Soporte Multi-local
