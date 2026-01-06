# 🎨 REFERENCIA RÁPIDA - Clases CSS v2.0

---

## 📌 BOTONES

```html
<!-- Primario (Púrpura) -->
<button class="btn btn-primary">Guardar</button>

<!-- Secundario (Naranja) -->
<button class="btn btn-secondary">Exportar</button>

<!-- Éxito (Verde) -->
<button class="btn btn-success">Aprobar</button>

<!-- Error (Rojo) -->
<button class="btn btn-error">Eliminar</button>

<!-- Outline -->
<button class="btn btn-outline">Opción</button>

<!-- Tamaños -->
<button class="btn btn-primary btn-sm">Pequeño</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Grande</button>

<!-- Deshabilitado -->
<button class="btn btn-primary" disabled>Deshabilitado</button>
```

---

## 📝 INPUTS Y FORMULARIOS

```html
<!-- Text Input -->
<label for="nombre">Nombre</label>
<input type="text" id="nombre" placeholder="Nombre completo">

<!-- Select -->
<label for="mes">Mes</label>
<select id="mes">
  <option>Enero</option>
  <option>Febrero</option>
</select>

<!-- Textarea -->
<label for="comentarios">Comentarios</label>
<textarea id="comentarios" placeholder="Escribe..."></textarea>

<!-- Checkbox -->
<label>
  <input type="checkbox"> Aceptar términos
</label>

<!-- Radio -->
<label>
  <input type="radio" name="opcion"> Opción 1
</label>
<label>
  <input type="radio" name="opcion"> Opción 2
</label>
```

---

## 💳 TARJETAS

```html
<!-- Tarjeta básica -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Título</h3>
  </div>
  <div class="card-body">
    <p>Contenido de la tarjeta</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Acción</button>
  </div>
</div>
```

---

## 🚨 ALERTAS

```html
<!-- Éxito (Verde) -->
<div class="alert alert-success">
  <span>✅</span>
  <span>Operación completada exitosamente</span>
</div>

<!-- Error (Rojo) -->
<div class="alert alert-error">
  <span>❌</span>
  <span>Ha ocurrido un error</span>
</div>

<!-- Advertencia (Amarillo) -->
<div class="alert alert-warning">
  <span>⚠️</span>
  <span>Por favor, revisa esto</span>
</div>

<!-- Información (Cyan) -->
<div class="alert alert-info">
  <span>ℹ️</span>
  <span>Información importante</span>
</div>
```

---

## 🏷️ BADGES

```html
<!-- Primario -->
<span class="badge">Primario</span>

<!-- Éxito -->
<span class="badge badge-success">Éxito</span>

<!-- Error -->
<span class="badge badge-error">Error</span>

<!-- Advertencia -->
<span class="badge badge-warning">Advertencia</span>

<!-- Info -->
<span class="badge badge-info">Info</span>
```

---

## 📊 GRID RESPONSIVO

```html
<!-- Grid automático (1 col en mobile, 2 en tablet, 3 en desktop) -->
<div class="grid grid-cols-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>

<!-- Grid de 1 columna (mobile) -->
<div class="grid grid-cols-1">
  <div>Full width</div>
</div>

<!-- Grid de 2 columnas (tablet+) -->
<div class="grid grid-cols-2">
  <div>50%</div>
  <div>50%</div>
</div>

<!-- Grid de 4 columnas (desktop) -->
<div class="grid grid-cols-4">
  <div>25%</div>
  <div>25%</div>
  <div>25%</div>
  <div>25%</div>
</div>
```

---

## 📋 TABLAS RESPONSIVE

```html
<!-- Envolver tabla para scroll horizontal en mobile -->
<div class="table-responsive">
  <table>
    <thead>
      <tr>
        <th>Empleado</th>
        <th>Lunes</th>
        <th>Martes</th>
        <th>Miércoles</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Juan García</td>
        <td><span class="badge badge-success">Mañana</span></td>
        <td><span class="badge badge-info">Tarde</span></td>
        <td><span class="badge">Descanso</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎭 MODALES

```html
<!-- Modal (inicialmente hidden) -->
<div id="miModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Título del Modal</h2>
      <button class="modal-close" onclick="document.getElementById('miModal').classList.remove('active')">×</button>
    </div>
    
    <div class="modal-body">
      <p>Contenido del modal</p>
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="document.getElementById('miModal').classList.remove('active')">Cancelar</button>
      <button class="btn btn-primary">Guardar</button>
    </div>
  </div>
</div>

<!-- Abrir modal -->
<button class="btn btn-primary" onclick="document.getElementById('miModal').classList.add('active')">Abrir</button>
```

---

## 🔄 FLEXBOX UTILITIES

```html
<!-- Flex básico -->
<div class="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Flex en columna (vertical) -->
<div class="flex flex-col">
  <div>Arriba</div>
  <div>Abajo</div>
</div>

<!-- Flex con wrap -->
<div class="flex flex-wrap">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Flex centrado -->
<div class="flex flex-center" style="height: 200px;">
  <div>Contenido centrado</div>
</div>

<!-- Flex espacio entre -->
<div class="flex justify-between">
  <span>Izquierda</span>
  <span>Derecha</span>
</div>
```

---

## 🔤 TIPOGRAFÍA

```html
<!-- Headings -->
<h1>Heading 1 (Más grande)</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6 (Más pequeño)</h6>

<!-- Párrafos -->
<p>Párrafo normal</p>
<p style="font-size: var(--font-size-sm);">Párrafo pequeño</p>
<p style="font-size: var(--font-size-xs);">Párrafo muy pequeño</p>

<!-- Links -->
<a href="#">Link que cambia color en hover</a>
```

---

## 🎨 UTILIDADES

```html
<!-- Ocultar elemento -->
<div class="hidden">Esto está oculto</div>

<!-- Solo para lectores de pantalla -->
<span class="sr-only">Texto para usuarios con discapacidades visuales</span>

<!-- Truncar texto (una línea con ellipsis) -->
<p class="truncate">Este es un texto muy largo que será truncado...</p>

<!-- Limitar a 2 líneas -->
<p class="line-clamp-2">Este es un texto que se limitará a dos líneas máximo...</p>

<!-- Opcacidad -->
<div class="opacity-50">50% transparente</div>
<div class="opacity-75">75% opaco</div>

<!-- No envolver texto -->
<p class="no-wrap">Este texto no se envuelve</p>

<!-- Spinner (cargando) -->
<div class="spinner"></div>
```

---

## 🎯 VARIABLES CSS PRINCIPALES

```css
/* Colores */
var(--color-primary)        /* #8b5cf6 - Púrpura */
var(--color-secondary)      /* #f97316 - Naranja */
var(--color-success)        /* #22c55e - Verde */
var(--color-warning)        /* #f59e0b - Amarillo */
var(--color-error)          /* #ef4444 - Rojo */
var(--color-info)           /* #06b6d4 - Cyan */

/* Fondos */
var(--bg-primary)           /* #0f172a - Azul muy oscuro */
var(--bg-secondary)         /* #1e293b - Azul oscuro */
var(--bg-tertiary)          /* #334155 - Azul medio */
var(--bg-light)             /* #475569 - Azul claro */

/* Texto */
var(--text-primary)         /* #f1f5f9 - Blanco grisáceo */
var(--text-secondary)       /* #cbd5e1 - Gris claro */
var(--text-tertiary)        /* #94a3b8 - Gris medio */

/* Espaciado */
var(--spacing-xs)           /* 0.25rem */
var(--spacing-sm)           /* 0.5rem */
var(--spacing-md)           /* 1rem */
var(--spacing-lg)           /* 1.5rem */
var(--spacing-xl)           /* 2rem */
var(--spacing-2xl)          /* 3rem */

/* Transiciones */
var(--transition-fast)      /* 150ms ease-in-out */
var(--transition-base)      /* 300ms ease-in-out */
var(--transition-slow)      /* 500ms ease-in-out */

/* Sombras */
var(--shadow-sm)            /* pequeña */
var(--shadow-md)            /* media */
var(--shadow-lg)            /* grande */
var(--shadow-xl)            /* extra grande */

/* Border radius */
var(--radius-sm)            /* 0.375rem */
var(--radius-md)            /* 0.5rem */
var(--radius-lg)            /* 0.75rem */
var(--radius-xl)            /* 1rem */
var(--radius-2xl)           /* 1.5rem */
```

---

## 🔑 CLASES DE UTILIDAD

| Clase | Efecto |
|-------|--------|
| `.hidden` | `display: none` |
| `.sr-only` | Screen reader only |
| `.truncate` | Overflow ellipsis (1 línea) |
| `.line-clamp-2` | Max 2 líneas con ellipsis |
| `.opacity-50` | Opacidad al 50% |
| `.opacity-75` | Opacidad al 75% |
| `.no-wrap` | `white-space: nowrap` |
| `.flex` | `display: flex` |
| `.flex-col` | `flex-direction: column` |
| `.flex-wrap` | `flex-wrap: wrap` |
| `.flex-center` | Centrado horizontal y vertical |
| `.justify-between` | `justify-content: space-between` |
| `.grid` | `display: grid` |
| `.grid-cols-1` | 1 columna |
| `.grid-cols-2` | 2 columnas |
| `.grid-cols-3` | 3 columnas |
| `.grid-cols-4` | 4 columnas |
| `.spinner` | Loader animado |

---

## 🌙 CONTROLES DE TEMA

```javascript
// Cambiar tema manualmente
ThemeManager.setTheme('dark');      // Cambiar a oscuro
ThemeManager.setTheme('light');     // Cambiar a claro
ThemeManager.toggleTheme();         // Alternar

// Obtener tema actual
ThemeManager.getCurrentTheme();     // → 'dark' o 'light'

// Escuchar cambios
ThemeManager.onChange((theme) => {
  console.log('Tema cambió a:', theme);
});
```

---

## ⌨️ CONTROLES DE ACCESIBILIDAD

```
TAB           → Navegar elementos focusables
Shift + TAB   → Navegar hacia atrás
ESC           → Cerrar modal abierto
Ctrl/Cmd + /  → Abrir panel de accesibilidad
```

---

## 📱 BREAKPOINTS

```css
/* Mobile (320px - 640px) */
@media (max-width: 640px) { ... }

/* Tablet pequeña (641px - 768px) */
@media (min-width: 641px) and (max-width: 768px) { ... }

/* Tablet (769px - 1024px) */
@media (min-width: 769px) { ... }

/* Desktop (1025px+) */
@media (min-width: 1025px) { ... }
```

---

## ✨ ANIMACIONES

```css
@keyframes fadeIn         /* Fade in (opacity) */
@keyframes slideIn        /* Slide desde arriba */
@keyframes slideInDown    /* Slide más suave */
@keyframes spin           /* Rotación infinita */
@keyframes pulse          /* Pulso */
```

---

## 🎯 EJEMPLOS COMUNES

### Botón que abre modal
```html
<button class="btn btn-primary" onclick="document.getElementById('miModal').classList.add('active')">
  Abrir Modal
</button>
```

### Card con contenido responsivo
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Mi Card</h3>
  </div>
  <div class="card-body">
    <p>Contenido flexible</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary btn-sm">Acción</button>
  </div>
</div>
```

### Alert con ícono
```html
<div class="alert alert-success">
  <span>✅</span>
  <span>Guardado exitosamente</span>
</div>
```

### Tabla en mobile
```html
<div class="table-responsive">
  <table>
    <!-- Contenido -->
  </table>
</div>
```

---

**Última actualización:** 2 de enero de 2026  
**Para más información:** Ver MEJORAS_UI_RESUMEN.md
