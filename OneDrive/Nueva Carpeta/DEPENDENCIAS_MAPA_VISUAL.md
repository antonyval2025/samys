# 🔗 MAPA INTERACTIVO DE DEPENDENCIAS

## Leyenda
```
✅ = Módulo activo y usado
⚠️ = Módulo activo pero tiene problemas
🔴 = Módulo legacy/deprecado
→ = Depende de
← = Es usado por
```

---

## 1. CORE STACK (SEMANA 1)

### modules.js (3000+ líneas) 🔴 MONOLÍTICO
```
modules.js
├─ TurnoManager ✅
│  ├─ Métodos: generarTurnosEmpleado(), cambiarTurno(), obtenerDia()
│  ├─ Depende de: AppState ← 
│  └─ Usado por: ❌ TODO (HTML, SEMANA 2,3,4,5)
│
├─ AppState ✅ (CRÍTICO)
│  ├─ Estado global: scheduleData, currentMonth, currentYear
│  ├─ Métodos: saveToStorage(), loadFromStorage()
│  └─ Usado por: ❌ TODO (literalmente toda la app)
│
├─ EmployeeManager ✅
│  ├─ Métodos: abrirGestion(), guardarEmpleado(), eliminarEmpleado()
│  ├─ Depende de: AppState ←
│  └─ Usado por: Modal gestión empleados
│
├─ ExportManager ✅
│  ├─ Métodos: exportarPDF(), exportarExcel(), enviarWhatsApp()
│  ├─ Depende de: html2canvas, jsPDF, AppState ←
│  └─ Usado por: Botones exportar
│
└─ UI (Varias clases)
   ├─ Depende de: AppState ←, TurnoManager ←
   └─ Usado por: Renderización de tablas
```

**Problema:** Todo en 1 archivo = difícil mantener
**Solución:** Ya está modularizado en MetricasModule ✅

---

## 2. SEMANA 3 - LA ZONA CRÍTICA ⚠️

### controles-semana-3.js (PUNTO DE ENTRADA)
```
controles-semana-3.js
├─ abrirAnalisis()
│  ├─ Crea modal
│  ├─ Carga: AnalizadorConflictos
│  ├─ Depende de: AnalizadorConflictos.init() ←
│  └─ Usado por: onclick="abrirAnalisis()" (botón)
│
├─ abrirMetricas() ✅ AHORA MODULAR
│  ├─ Verifica si existe MetricasModule
│  │  ├─ SI: Carga MetricasModule.abrirModal() ✅
│  │  └─ NO: Carga DashboardAnalytica.init() (LEGACY) 🔴
│  ├─ Depende de: MetricasModule ← o DashboardAnalytica
│  └─ Usado por: onclick="abrirMetricas()" (botón)
│
└─ abrirOptimizacion()
   ├─ Crea modal
   ├─ Carga: OptimizadorTurnos
   ├─ Depende de: OptimizadorTurnos.init() ←
   └─ Usado por: onclick="abrirOptimizacion()" (botón)
```

### dashboard-analytica.js 🔴 LEGACY COMPLETO
```
dashboard-analytica.js (362 líneas)
├─ DashboardAnalytica (clase estática)
│  ├─ isInitialized (variable de estado)
│  │
│  ├─ init() - AUTO-EJECUTA ❌ PROBLEMA
│  │  └─ self.init() llamado al cargar archivo
│  │
│  ├─ calcularMetricas() ← DUPLICADO CON MetricasModule
│  │  └─ Calcula KPIs, distribución, análisis
│  │
│  ├─ generarHTML() ← DUPLICADO CON MetricasModule
│  │  └─ Crea tabla de KPIs
│  │
│  ├─ obtenerMetricas()
│  │  └─ Retorna datos cacheados
│  │
│  └─ Usado SOLO EN: controles-semana-3.js → fallback
│
│ LÍNEAS NO USADAS: 280 / 362 = 77.3%
│
│ DEPENDENCIAS:
│  ├─ AppState (global) ←
│  ├─ empleados (global) ←
│  └─ localStorage ←
│
└─ STATUS: ⚠️ MANTENER COMO FALLBACK, NO ELIMINAR
```

### MetricasModule ✅ NUEVO (REEMPLAZO)
```
MetricasModule (250+ líneas en HTML)
├─ calcularMetricas() ✅
│  └─ Reemplaza: DashboardAnalytica.calcularMetricas()
│
├─ generarHTML() ✅
│  └─ Reemplaza: DashboardAnalytica.generarHTML()
│
├─ abrirModal() ✅
│  └─ Crea interfaz con tabs
│
├─ exportarJSON() ✅
│  └─ Nueva funcionalidad
│
├─ exportarCSV() ✅
│  └─ Nueva funcionalidad
│
├─ cache: {} ⚙️
│  └─ Almacena cálculos anteriores
│
├─ Dependencias:
│  ├─ AppState ←
│  ├─ empleados ←
│  └─ ModuleManager ←
│
└─ PUNTO DE ENTRADA: MetricasModule.abrirModal()
```

### AnalizadorConflictos ✅ ESPECIALIZADO
```
analizador-conflictos.js
├─ AnalizadorConflictos (clase estática)
│  ├─ init() - Crea modal, inicia análisis
│  ├─ analizarEmpleado() - Detecta conflictos individuales
│  ├─ analizarTodos() - Análisis completo
│  ├─ detectarPatrones() - Patrones conflictivos
│  │
│  ├─ Dependencias:
│  │  ├─ AppState ←
│  │  ├─ TurnoManager ←
│  │  └─ empleados ←
│  │
│  └─ Usado por: controles-semana-3.js → abrirAnalisis()
```

### OptimizadorTurnos ✅ ESPECIALIZADO
```
optimizador-turnos.js
├─ OptimizadorTurnos (clase estática)
│  ├─ init() - Crea modal de optimización
│  ├─ generarSugerencias() - Propone cambios
│  ├─ aplicarOptimizacion() - Aplica automáticamente
│  │
│  ├─ Dependencias:
│  │  ├─ AppState ←
│  │  ├─ TurnoManager ←
│  │  ├─ AnalizadorConflictos ← (para validar)
│  │  └─ empleados ←
│  │
│  └─ Usado por: controles-semana-3.js → abrirOptimizacion()
```

---

## 3. FLUJO DE EJECUCIÓN (SEMANA 3)

### Escenario: Usuario hace clic en "📊 Métricas"
```
Usuario: click "📊 Métricas"
   ↓
HTML onclick="abrirMetricas()" ← ⚠️ DEPRECATED
   ↓
controles-semana-3.js: abrirMetricas()
   ↓
¿Existe MetricasModule.abrirModal?
   ├─ SI ✅
   │  └─ MetricasModule.abrirModal()
   │     ├─ calcularMetricas()
   │     ├─ generarHTML()
   │     └─ mostrarModal()
   │
   └─ NO ❌
      └─ DashboardAnalytica.init()
         ├─ Verifica si ya inicializado
         ├─ Calcula métricas
         ├─ Genera HTML
         └─ mostrarModal()
```

**Problema:** El flujo intenta acceder a abrirMetricas() en HTML (línea X)
**Solución:** Eliminar window.abrirMetricas() del HTML

---

## 4. DEPENDENCIAS POR MÓDULO

### Módulos que dependen de AppState
```
AppState (FUENTE DE VERDAD)
├─ MetricasModule ←
├─ DashboardAnalytica ←
├─ AnalizadorConflictos ←
├─ OptimizadorTurnos ←
├─ TurnoManager ←
├─ SincronizacionDatos ← (SEMANA 4)
├─ BalanceoTurnos ← (SEMANA 5)
└─ TODO MÓDULO QUE NECESITA ESTADO
```

**Riesgo:** Si AppState falla, TODO cae
**Mitigación:** AppState nunca ha fallado (crítico)

---

### Módulos que dependen de empleados[]
```
empleados[] (LISTA GLOBAL)
├─ TurnoManager ← (obtiene empleado para generar turnos)
├─ UI ← (renderiza en tabla)
├─ ExportManager ← (exporta datos de empleado)
├─ MetricasModule ← (calcula por empleado)
├─ AnalizadorConflictos ← (analiza conflictos por empleado)
├─ OptimizadorTurnos ← (optimiza asignaciones)
└─ CASI TODO
```

**Problema:** Variable global mutable
**Mitigación:** Se carga de localStorage.empleadosData

---

## 5. TABLA DE LÍNEAS DE CÓDIGO

| Archivo | Líneas | % Usado | Estado | Notas |
|---------|--------|--------|--------|-------|
| modules.js | 3000+ | 95% | ✅ CRÍTICO | Monolítico pero funciona |
| MetricasModule | 250 | 100% | ✅ NUEVO | Reemplaza DashboardAnalytica |
| dashboard-analytica.js | 362 | 23% | 🔴 LEGACY | 77% duplicado, mantener fallback |
| controles-semana-3.js | 322 | 100% | ✅ MODULAR | Ya refactorizado |
| analizador-conflictos.js | 280 | 100% | ✅ ACTIVO | Especializado |
| optimizador-turnos.js | 200 | 100% | ✅ ACTIVO | Especializado |
| calendario-visual.js | 400 | 95% | ✅ ACTIVO | UI visual |
| **TOTALES** | **4814** | **~85%** | ✅ SALUDABLE | Sin bloques críticos |

---

## 6. LLAMADAS DE FUNCIÓN CRÍTICAS

### En nuevo_cuadrante_mejorado.html
```javascript
// PUNTO 1: Carga de módulos
<script src="js/modules.js"></script>           // CRÍTICO
<script src="js/dashboard-analytica.js"></script> // LEGACY
<script src="js/controles-semana-3.js"></script>  // PUNTO DE ENTRADA

// PUNTO 2: Evento de carga
document.addEventListener('DOMContentLoaded', () => {
    AppState.loadFromStorage();     // ← Depende de modules.js
    UI.generarCuadranteGeneral();   // ← Depende de modules.js
});

// PUNTO 3: Botones onclick
<button onclick="abrirMetricas()"> 📊 Métricas </button>
// ↑ Busca abrirMetricas() en: 
//   1. HTML (window.abrirMetricas) ← ⚠️ REDUNDANTE
//   2. controles-semana-3.js (function abrirMetricas) ← ✅ CORRECTO

<button onclick="abrirAnalisis()"> 📈 Análisis </button>
// ↑ Usa controles-semana-3.js → AnalizadorConflictos

<button onclick="abrirOptimizacion()"> ⚡ Optimizar </button>
// ↑ Usa controles-semana-3.js → OptimizadorTurnos
```

---

## 7. CONFLICTOS IDENTIFICADOS

### CONFLICTO #1: abrirMetricas() definida 2 veces
```javascript
// HTML (línea 6583) - DEPRECATED
window.abrirMetricas = function() { ... }

// controles-semana-3.js (línea 142) - ACTIVA
function abrirMetricas() { ... }

RESULTADO: La de controles-semana-3.js gana
PROBLEMA: Confusión, código redundante
SOLUCIÓN: Eliminar la de HTML
```

### CONFLICTO #2: DashboardAnalytica.init() se ejecuta automáticamente
```javascript
// En dashboard-analytica.js (línea ~360)
self.init();  // ← Se ejecuta al cargar el archivo

RESULTADO: Inicialización no solicitada
PROBLEMA: Puede entrar en conflicto si MetricasModule también se inicia
SOLUCIÓN: Comentar esta línea, solo inicializar si se usa como fallback
```

### CONFLICTO #3: Duplicación de lógica de cálculo
```javascript
// MetricasModule.calcularMetricas()
// vs
// DashboardAnalytica.calcularMetricas()

RESULTADO: Posibles discrepancias en datos
PROBLEMA: Mantenimiento duplicado
SOLUCIÓN: Usar MetricasModule como fuente única, DashboardAnalytica solo fallback
```

---

## 8. PLAN DE REMEDIACIÓN DETALLADO

### Paso 1️⃣: Eliminar redundancia de abrirMetricas()
**Archivo:** nuevo_cuadrante_mejorado.html
**Línea:** ~6583
**Acción:** ELIMINAR bloque window.abrirMetricas()
**Validación:** Verificar que onclick sigue funcionando
**Riesgo:** MUY BAJO

### Paso 2️⃣: Desactivar init() automático de DashboardAnalytica
**Archivo:** js/dashboard-analytica.js
**Línea:** ~360
**Acción:** Comentar `self.init();`
**Validación:** Verificar que MetricasModule sigue funcionando
**Riesgo:** MUY BAJO (fallback no debería inicializarse automáticamente)

### Paso 3️⃣: Documentar fallback en controles-semana-3.js
**Archivo:** js/controles-semana-3.js
**Línea:** 142-189
**Acción:** Agregar comentarios explicando fallback
**Validación:** Código funcional sin cambios
**Riesgo:** BAJO

### Paso 4️⃣: Crear js/dependencias.md
**Crear archivo:** Con diagrama de dependencias
**Uso:** Referencia para futuro mantenimiento
**Riesgo:** NINGUNO

---

## 9. CHECKLIST FINAL

### Verificación PRE-LIMPIEZA
- [ ] MetricasModule funciona (botón "Métricas" abre modal)
- [ ] AnalizadorConflictos funciona (botón "Análisis" abre modal)
- [ ] OptimizadorTurnos funciona (botón "Optimizar" abre modal)
- [ ] No hay errores en consola al cargar

### Limpieza INMEDIATA
- [ ] Eliminar window.abrirMetricas() del HTML
- [ ] Comentar self.init() en dashboard-analytica.js
- [ ] Agregar comentarios de deprecated en archivos legacy

### Verificación POST-LIMPIEZA
- [ ] Botón "Métricas" sigue abriendo modal
- [ ] Botón "Análisis" sigue abriendo modal
- [ ] Botón "Optimizar" sigue abriendo modal
- [ ] No hay errores nuevos en consola

### Documentación
- [ ] Crear DEPENDENCIAS_MODULOS.md
- [ ] Actualizar ARQUITECTURA.md con changes
- [ ] Documentar fallbacks

---

**Documento:** MAPA INTERACTIVO DE DEPENDENCIAS
**Versión:** 2.1
**Última actualización:** 4 de enero de 2026
**Estado:** ✅ LISTO PARA IMPLEMENTAR
