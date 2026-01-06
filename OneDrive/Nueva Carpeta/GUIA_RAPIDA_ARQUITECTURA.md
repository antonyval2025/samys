# ⚡ GUÍA RÁPIDA - ARQUITECTURA DEL PROYECTO

## 🎯 RESPUESTAS RÁPIDAS

### ¿Cómo funciona el botón "Métricas"?
```
Usuario: click "📊 Métricas"
    ↓ (nuevo_cuadrante_mejorado.html)
onclick="abrirMetricas()"
    ↓ (js/controles-semana-3.js:133)
if MetricasModule exists?
    ├─ SÍ → MetricasModule.abrirModal() ✅
    └─ NO → DashboardAnalytica.init() (fallback) 🔴
```

**Punto de entrada:** `js/controles-semana-3.js:133`

---

### ¿Dónde vive el estado de la app?
```javascript
AppState (en modules.js)
├─ currentYear, currentMonth
├─ scheduleData = Map<empleadoId, [turnos]>
├─ cambiosPendientes = []
└─ métodos: saveToStorage(), loadFromStorage()
```

**Persistencia:** `localStorage['turnosAppState']` + `localStorage['empleadosData']`

---

### ¿Cuál es el orden de carga de scripts?
```html
1. modules.js (CRÍTICO - define AppState, TurnoManager)
2. guardias-globales.js (placeholders)
3. Luego todos los demás en orden
4. controles-semana-3.js (define abrirMetricas, abrirAnalisis, etc)
5. MetricasModule inicializa en DOMContentLoaded
```

**Importante:** modules.js debe cargarse primero

---

### ¿Cuántos archivos hay y cuáles son críticos?
```
Total: 36 archivos JS

CRÍTICOS (romper = app no funciona):
✅ js/modules.js (3000+ líneas)
✅ js/guardias-globales.js (placeholders)

IMPORTANTES (necesarios para UI):
✅ js/controles-semana-2.js (calendario)
✅ js/controles-semana-3.js (analítica)
✅ js/dashboard-analytica.js (fallback)

OPCIONALES (mejoras pero no críticos):
⚠️ js/theme-manager.js
⚠️ js/accessibility-manager.js
⚠️ js/debug-manager.js
```

---

### ¿Cómo agregar un nuevo tipo de turno?
```javascript
1. En tiposTurno (en modules.js):
tiposTurno.festivo = {
    horario: "Festivo",
    color: "#e0e0e0",
    horas: 0
}

2. En CSS (inline):
.festivo { background-color: #e0e0e0; }

3. TurnoManager.generarTurnosEmpleado() 
   automáticamente lo usará
```

---

### ¿Cómo crear un nuevo reporte?
```javascript
1. Crear clase en HTML o archivo nuevo:
class MiReporte {
    static calcular() { ... }
    static exportar() { ... }
}

2. Registrar en ModuleManager:
ModuleManager.register('MiReporte', MiReporte)

3. Llamar desde botón:
onclick="abrirMiReporte()"
```

---

## 📚 ARCHIVOS PRINCIPALES

### HTML
```
nuevo_cuadrante_mejorado.html (6831 líneas)
├─ HTML/CSS (líneas 1-500)
├─ ModuleManager (líneas 6348-6388)
├─ MetricasModule (líneas 6394-6696)
└─ Event listeners (línea 6720+)
```

### Core (Semana 1)
```
modules.js (3000+ líneas) ← LEER ESTO
├─ TurnoManager
├─ AppState
├─ EmployeeManager
└─ ExportManager
```

### Analítica (Semana 3)
```
controles-semana-3.js (punto de entrada)
├─ abrirMetricas() → MetricasModule.abrirModal()
├─ abrirAnalisis() → AnalizadorConflictos.init()
└─ abrirOptimizacion() → OptimizadorTurnos.init()

dashboard-analytica.js (legacy, fallback)
```

---

## 🔍 BUSCAR PROBLEMAS

### Problema: "Botón no funciona"
```
Pasos:
1. Abrir DevTools (F12)
2. Ir a Console
3. Escribir: typeof nombreFuncion
4. Si 'undefined' → función no cargó
5. Verificar js/controles-semana-3.js está cargado
```

### Problema: "Datos no se guardan"
```
Pasos:
1. Abrir DevTools (F12)
2. Ir a Application → Local Storage
3. Buscar: turnosAppState
4. Si no existe → AppState.saveToStorage() no se llama
5. Verificar que cambio incluye: AppState.saveToStorage()
```

### Problema: "Tabla está vacía"
```
Pasos:
1. Consola: console.log(empleados)
2. Si empty array → cargar empleados primero
3. Si tiene datos → llamar: UI.generarCuadranteGeneral()
```

---

## 💾 COMANDOS DE CONSOLA ÚTILES

```javascript
// VER ESTADO
console.log(AppState.scheduleData)
console.log(AppState.currentMonth, AppState.currentYear)
console.log(empleados)

// GUARDAR
AppState.saveToStorage()
localStorage.setItem('turnosAppState', JSON.stringify(AppState.scheduleData))

// CARGAR
AppState.loadFromStorage()
localStorage.getItem('turnosAppState')

// LIMPIAR
localStorage.clear()
location.reload()

// VERIFICAR MÓDULOS
console.log(ModuleManager.list())
console.log(window.MetricasModule)
console.log(window.DashboardAnalytica)
```

---

## 🏗️ ESTRUCTURA DE DATOS

### AppState.scheduleData
```javascript
Map {
  empleado_id: [
    { 
      dia: 1,
      turno: "mañana",
      horas: 8,
      fecha: Date,
      esFinSemana: false
    },
    // ... más días
  ]
}
```

### empleados[]
```javascript
[
  {
    id: 1,
    nombre: "Juan",
    email: "juan@example.com",
    telefono: "123456789",
    horas: 160,
    estado: "activo"
  },
  // ... más empleados
]
```

### Cambios pendientes
```javascript
AppState.cambiosPendientes = [
  {
    empleadoId: 1,
    dia: 5,
    nuevoTurno: "noche",
    timestamp: "2024-06-01T10:30:00Z"
  }
]
```

---

## ⚠️ COSAS QUE NO HACER

### ❌ NO tocar
- Orden de carga de `<script>` (modules.js debe ir primero)
- Nombre de variables globales (AppState, empleados)
- Métodos de localStorage (se usan en múltiples lugares)

### ⚠️ TENER CUIDADO
- Modificar modules.js (es muy grande, riesgo de romper)
- Eliminar archivos js/ sin verificar si se usan
- Cambiar nombres de funciones en controles-semana-3.js

### ✅ SEGURO
- Crear nuevas clases/módulos
- Agregar nuevos tipos de turno
- Modificar HTML/CSS
- Agregar nuevas funcionalidades en modales

---

## 🧪 TESTING RÁPIDO

### Test 1: Página carga sin errores
```
1. Abrir nueva pestaña
2. Cargar página
3. Abrir DevTools (F12)
4. Ver Console
5. Debería haber logs ✅ sin errores 🔴
```

### Test 2: Botón Métricas funciona
```
1. Click "📊 Métricas"
2. Debe abrir modal
3. Console debe mostrar: "📊 Usando MetricasModule"
```

### Test 3: Datos se cargan
```
1. Consola: console.log(empleados.length)
2. Debería mostrar número > 0
3. Si 0 → datos no se cargan, revisar API
```

### Test 4: Cambios se guardan
```
1. Cambiar un turno
2. Consola: console.log(AppState.cambiosPendientes)
3. Debería mostrar el cambio
4. Click "Guardar"
5. Cambio debe aplicarse
```

---

## 📞 PREGUNTAS FRECUENTES

### P: ¿Dónde hago cambios?
R: Depende:
- Lógica turno → modules.js (TurnoManager)
- Interfaz → nuevo_cuadrante_mejorado.html o controles-semana-X.js
- Datos → modules.js (AppState)

### P: ¿Cómo agrego un empleado?
R: Dos opciones:
1. Interfaz: Click "👥 Gestionar Empleados"
2. Consola: `EmployeeManager.guardarEmpleado({...})`

### P: ¿Los datos se pierden al recargar?
R: No, se guardan en localStorage automáticamente

### P: ¿Cómo exporto a PDF?
R: Click en "📄 Exportar" → Elije formato

### P: ¿Dónde está la base de datos?
R: Hay 2:
1. localStorage (en navegador)
2. API en localhost:5001 (opcional)

---

## 🎓 GUÍA DE APRENDIZAJE

### Nivel 1: Entender la estructura
1. Leer [RESUMEN_FINAL_AUDITORIA.md](RESUMEN_FINAL_AUDITORIA.md)
2. Ver AUDITORIA_ARQUITECTURA_COMPLETA.md
3. Entender orden de carga

### Nivel 2: Entender el flujo
1. Leer [DEPENDENCIAS_MAPA_VISUAL.md](DEPENDENCIAS_MAPA_VISUAL.md)
2. Seguir flujos de ejecución
3. Entender cómo MetricasModule delega

### Nivel 3: Hacer cambios
1. Leer [PLAN_ACCION_BAJO_RIESGO.md](PLAN_ACCION_BAJO_RIESGO.md)
2. Seguir el checklist
3. Validar con tests

### Nivel 4: Agregar funciones
1. Crear módulo nuevo
2. Registrar en ModuleManager
3. Documentar dependencias

---

## 📋 RESUMEN EN 30 SEGUNDOS

**¿Qué es?**
Sistema de gestión de turnos en una página HTML con 36+ módulos JS

**¿Cómo funciona?**
HTML → JavaScript → localStorage (estado) → Renderiza tabla

**¿Dónde están las partes importantes?**
- Core: modules.js
- Interfaz: nuevo_cuadrante_mejorado.html
- Módulos: js/controles-semana-X.js

**¿Cuál es el riesgo?**
Muy bajo - está bien estructurado y documentado

**¿Qué puedo cambiar sin miedo?**
HTML, CSS, crear nuevos módulos

**¿Qué no debo tocar?**
Orden de scripts, variables globales, métodos localStorage

---

**Documento:** Guía Rápida de Arquitectura
**Versión:** 1.0
**Última actualización:** 4 de enero de 2026
**Tiempo de lectura:** 5 minutos
**Público:** Desarrolladores
