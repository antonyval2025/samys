# Análisis Estructural Detallado - Sistema de Gestión de Turnos

## 1. ESTRUCTURA HTML ACTUAL (FUNCIONANDO)

### 1.1 Jerarquía DOM
```
<body>
  └─ <div class="container">
      ├─ <header> ... Título
      ├─ <div class="top-controls"> ... Selectores año/mes, botones acción
      ├─ <div class="tabs"> ... Botones de pestaña (data-tab)
      ├─ <div id="tab-general" class="tab-content active"> ... Vista General
      ├─ <div id="tab-individual" class="tab-content"> ... Vista Individual
      └─ <div id="modalEdicionMasiva" class="modal"> ... Modales (fixed position)
```

### 1.2 Elementos Clave
- **`.container`** - Contenedor principal (NO reorganizar)
- **`.top-controls`** - Barra con selectores de fecha + botones
  - Contiene: `selectYear`, `selectMonth`, botones ◀ ▶
- **`.tabs`** - Botones para cambiar vista
  - `<button data-tab="tab-general">` → muestra `#tab-general`
  - `<button data-tab="tab-individual">` → muestra `#tab-individual`
- **`.tab-content`** - Contenedor de vista
  - Clase `.active` → `display: block` (visible)
  - Sin `.active` → `display: none` (oculto)

### 1.3 Modales
- Posicionados `position: fixed`
- Iniciialmente con `visibility: hidden` o `display: none`
- Clase `.active` → `visibility: visible; display: flex` y `opacity: 1`
- Ejemplos:
  - `#modalEdicionMasiva` - Edición masiva
  - `#modalGestionEmpleados` - Gestión empleados
  - `#cuadranteIndividual` - Modal emergente (empleado seleccionado)

## 2. SISTEMA DE TABS (Cambio de Vista)

### 2.1 Cómo Funciona
```javascript
// Evento click en botón tab
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const tabId = e.target.dataset.tab; // ej: "tab-general"
    
    // 1. Remover .active de todos
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    // 2. Agregar .active al seleccionado
    e.target.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });
});
```

### 2.2 CSS Asociado (en `css/estilos_pastel4.css`)
```css
.tab-content {
  display: none; /* Oculto por defecto */
}

.tab-content.active {
  display: block; /* Visible cuando tiene .active */
}
```

### 2.3 Problema Actual
- Los botones ◀ ▶ (cambio mes) están en `.top-controls`
- `.top-controls` está FUERA de los tabs
- Resultado: flechas visible en AMBAS pestañas (General e Individual)
- **Requisito**: Solo deben aparecer en "Cuadrante General"

## 3. ARQUITECTURA DE DATOS Y FUNCIONALIDAD

### 3.1 Estado Global
```javascript
AppState {
  currentMonth: Number (0-11)
  currentYear: Number
  scheduleData: Map<empleadoId, Array<turno>>
  cambiosPendientes: Array
}

empleados[] // Array global
```

### 3.2 Funciones Principales (llamadas vía onclick)
- **`DateUtils.cambiarMes(±1)`** - Cambia mes/año
- **`EmployeeManager.abrirModal()`** - Abre modal empleados
- **`TurnoManager.reiniciarDatos()`** - Regenera cuadrante
- **`UI.generarCuadranteGeneral()`** - Render tabla general
- **`UI.generarCuadranteIndividual(id)`** - Render modal empleado
- **`EdicionMasiva.abrirModal()`** - Abre edición masiva

### 3.3 Flujo de Datos
1. **Carga Inicial** (DOMContentLoaded)
   - Cargar empleados desde localStorage/API
   - Cargar turnos desde AppState
   - Generar cuadrante → `UI.generarCuadranteGeneral()`
   - Renderizar en `#cuadranteGeneral`

2. **Cambio de Mes** (ClickButton ▶)
   - Llamar `DateUtils.cambiarMes(1)`
   - Actualiza `AppState.currentMonth`
   - Regenera tabla
   - Render nuevo contenido

3. **Cambio de Tab** (Click botón "Informe Individual")
   - Evento click → ejecuta addEventListener
   - Remover `.active` de todos tabs
   - Agregar `.active` a `#tab-individual`
   - CSS: `#tab-general { display: none }` + `#tab-individual { display: block }`

## 4. ANÁLISIS: ¿POR QUÉ FALLÓ EL SIDEBAR ANTERIOR?

### 4.1 Error del Layout Manager
El script `js/layout-manager.js` intentaba:
```javascript
createSidebarStructure() {
  const wrapper = document.createElement('div');
  wrapper.classList.add('app-wrapper'); // Nueva div
  
  const sidebar = document.createElement('div');
  sidebar.classList.add('app-sidebar'); // Nueva div
  
  const main = document.createElement('div');
  main.classList.add('app-main'); // Nueva div
  
  // REORGANIZAR TODO EL HTML
  document.body.appendChild(wrapper);
  wrapper.appendChild(sidebar);
  wrapper.appendChild(main);
  // ... mover .container adentro de main
}
```

### 4.2 Por Qué Rompió
1. **Cambió el contexto de posicionamiento**
   - Modales con `position: fixed` pierden su viewport
   - Quedan posicionados respecto a `.app-wrapper` en lugar de viewport

2. **Cambió la cascada de CSS**
   - Flexbox en `.app-wrapper` afecta a `.app-main`
   - `.container` dentro de `.app-main` pierde sus propiedades

3. **Los tabs siguieron en lugar original**
   - Tabs quedaron dentro de `.app-main`
   - Pero su contenido se reorganizó
   - Sincronización rota

4. **Modal cuadranteIndividual (fixed) se perdió**
   - `top: 0; left: 0; right: 0; bottom: 0` pierde significado
   - Se posiciona respecto a `.app-wrapper`, no viewport

## 5. SOLUCIÓN PROPUESTA: SIDEBAR NO-DESTRUCTIVO

### 5.1 Principios
✅ **DEBE**:
- No reorganizar HTML
- No crear nuevas divs contenedoras
- Solo agregar elementos visuales
- Cada botón sidebar = llamar función existente

❌ **NO DEBE**:
- Modificar estructura DOM
- Cambiar contexto de modales
- Afectar cascada CSS
- Crear lógica paralela

### 5.2 Implementación Propuesta

#### A) Agregar HTML del Sidebar (al final del body)
```html
<!-- SIDEBAR - Elemento añadido (no reorg aniza) -->
<div id="app-sidebar" class="app-sidebar-panel" style="position: fixed; left: 0; top: 0; bottom: 0; width: 70px; ...">
  <div class="sidebar-toggle">☰</div>
  <nav class="sidebar-nav">
    <button onclick="document.querySelector('[data-tab=\"tab-general\"]').click()">📊</button>
    <button onclick="document.querySelector('[data-tab=\"tab-individual\"]').click()">📈</button>
    <button onclick="DateUtils.cambiarMes(-1)">◀</button>
    <button onclick="DateUtils.cambiarMes(1)">▶</button>
    <button onclick="EmployeeManager.abrirModal()">👥</button>
    ...
  </nav>
</div>
```

#### B) CSS del Sidebar (adicional, no reemplaza)
```css
.app-sidebar-panel {
  position: fixed; /* NO afecta otros elementos */
  left: 0;
  top: 0;
  bottom: 0;
  width: 70px;
  background: linear-gradient(...);
  z-index: 99; /* Por debajo de modales (10000) */
  box-shadow: 2px 0 10px rgba(0,0,0,0.3);
}

.sidebar-toggle {
  cursor: pointer;
  padding: 15px;
  text-align: center;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}

.sidebar-nav button {
  width: 100%;
  padding: 12px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.sidebar-nav button:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.05);
}
```

#### C) JavaScript de Interacción
```javascript
// Inyectar sidebar DESPUÉS de que page cargue
document.addEventListener('DOMContentLoaded', () => {
  // El sidebar HTML ya existe en la página
  // Solo agregar comportamiento
  
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.app-sidebar-panel');
  
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });
});
```

### 5.3 Ventajas
✅ Sidebar es elemento aparte (no reorg aniza)
✅ Cada botón hace EXACTAMENTE lo mismo que antes
✅ No cambia ningún CSS existente
✅ Modales siguen funcionando (position: fixed intacto)
✅ Tabs siguen funcionando
✅ CERO riesgo de ruptura

### 5.4 Comportamiento
- Sidebar pequeño (70px) en lado izquierdo
- Botones de navegación rápida
- Click en botón → ejecuta función existente
- Sin lógica nueva, solo acceso visual

## 6. ARREGLOS SECUNDARIOS (DESPUÉS del sidebar)

Una vez el sidebar esté en lugar:

### 6.1 Problema: Flechas de mes en ambas pestañas
**Opción A**: CSS selectivo (simple)
```css
#tab-individual .top-controls {
  display: none;
}
```
⚠️ Pero requiere MOVER `.top-controls` dentro de tab-general

**Opción B**: Lógica JavaScript (mejor)
```javascript
// Mostrar/ocultar flechas según tab activo
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const arrows = document.querySelectorAll('.nav-btn'); // ◀ ▶
    if (btn.dataset.tab === 'tab-general') {
      arrows.forEach(a => a.style.display = 'inline-block');
    } else {
      arrows.forEach(a => a.style.display = 'none');
    }
  });
});
```

### 6.2 Otros ajustes pequeños (después)
- Mejorar responsive (si es necesario)
- Ajustar colores/animaciones
- Agregar más atajos al sidebar

## 7. CRONOGRAMA PROPUESTO

### Fase 1: Sidebar Non-Destructivo (HOY)
- [ ] Crear HTML del sidebar (agregado, no reorganiza)
- [ ] Crear CSS del sidebar (aislado)
- [ ] Pruebas: Verificar que app sigue 100% funcional
- [ ] Resultado: Sidebar + App = TODO FUNCIONA

### Fase 2: Ajustes Pequeños (DESPUÉS)
- [ ] Opcionalmente: ocultar flechas en tab Individual
- [ ] Opcionalmente: mejorar responsive
- [ ] Opcionalmente: agregar más atajos

### Fase 3: Futuro (si es necesario)
- [ ] Integración más profunda
- [ ] Temas oscuro/claro
- [ ] Configuración persistida

## 8. VALIDACIÓN PRE-IMPLEMENTACIÓN

Antes de hacer cambios, verificar:
- [ ] App funciona: Cuadrante General ✓
- [ ] App funciona: Informe Individual ✓
- [ ] Tab switching: General ↔ Individual ✓
- [ ] Modales: click en empleado → popup ✓
- [ ] Cambio mes: ◀ ▶ botones ✓
- [ ] Data persiste: localStorage ✓

Después de agregar sidebar:
- [ ] App sigue funcionando: Cuadrante General ✓
- [ ] App sigue funcionando: Informe Individual ✓
- [ ] Tab switching: General ↔ Individual ✓
- [ ] Modales: siguen apareciendo ✓
- [ ] Sidebar: botones ejecutan acciones ✓
- [ ] Sidebar: visible sin romper nada ✓

---

**Conclusión**: El problema anterior fue intentar REORGANIZAR el HTML. 
La solución es: **Agregar** un sidebar como elemento visual aparte que NO toca la estructura existente.
