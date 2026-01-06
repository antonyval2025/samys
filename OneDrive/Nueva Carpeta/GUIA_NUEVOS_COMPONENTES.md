# 📖 GUÍA DE USO - Nuevos Componentes

## 1. ControlBase - Clase Base para Controles

### ¿Qué es?
Una clase base reutilizable que proporciona funcionalidad común para controles de UI (modales, sidebar, etc).

### Cómo usar

#### Paso 1: Crear tu clase de control
```javascript
class ControlesSemana1 extends ControlBase {
    static moduloNombre = 'ValidadorDatos';
    static modalId = 'modalSemana1';
    static sectionId = 'semana1';
    static color = '#10b981';  // Color hexadecimal
    static emoji = '✅';       // Emoji para mostrar
}
```

#### Paso 2: Implementar métodos específicos
```javascript
ControlesSemana1.abrirValidacion = function() {
    this.abrirModal('Validación de Datos', () => {
        // Retornar HTML del contenido
        let html = '<h3>Verificar integridad</h3>';
        html += '<p>Contenido aquí</p>';
        return html;
    });
};
```

#### Paso 3: Agregar al sidebar
```javascript
ControlesSemana1.agregarBotonesSidebar([
    { 
        icono: '🔍', 
        texto: 'Validar',
        funcion: 'ControlesSemana1.abrirValidacion()'
    },
    { 
        icono: '🔧', 
        texto: 'Reparar',
        funcion: 'ControlesSemana1.abrirReparar()'
    }
]);
```

### Métodos disponibles en ControlBase

#### `abrirModal(titulo, generadorContenido)`
Abre el modal con un título y contenido generado.

```javascript
this.abrirModal('Mi Título', () => {
    return '<p>Contenido HTML aquí</p>';
});
```

#### `cerrarModal()`
Cierra el modal.

```javascript
this.cerrarModal();
```

#### `crearHTMLError(titulo, errores)`
Crea un elemento de error con estilo.

```javascript
const html = this.crearHTMLError('Error de Validación', [
    'Campo nombre vacío',
    'Email inválido'
]);
```

#### `crearHTMLSuccess(titulo, detalles)`
Crea un elemento de éxito.

```javascript
const html = this.crearHTMLSuccess('Validación Completada', '5 empleados validados correctamente');
```

#### `crearTabla(headers, datos)`
Crea una tabla HTML.

```javascript
const html = this.crearTabla(
    ['Nombre', 'Email', 'Estado'],
    [
        ['Juan', 'juan@test.com', '✅'],
        ['María', 'maria@test.com', '❌'],
    ]
);
```

#### `crearGridBotones(botones)`
Crea un grid de botones.

```javascript
const html = this.crearGridBotones([
    { 
        icono: '🔍',
        texto: 'Verificar',
        onClick: 'miClase.miMetodo()',
        color: '#3b82f6'
    },
    {
        icono: '✅',
        texto: 'Aplicar',
        onClick: 'miClase.aplicar()',
        color: '#22c55e'
    }
]);
```

---

## 2. DebugManager - Panel de Diagnóstico

### ¿Qué es?
Un panel avanzado que muestra el estado de todos los módulos, datos y performance en tiempo real.

### Cómo usar

#### Abrir el panel
```javascript
// Desde código
DebugManager.mostrar();

// Desde HTML
<button onclick="DebugManager.mostrar()">Abrir Debug</button>
```

#### Actualizar datos en tiempo real
```javascript
DebugManager.actualizarDatos();
```

#### Exportar diagnóstico a JSON
```javascript
DebugManager.exportarDatos();
// Descarga un archivo debug-TIMESTAMP.json
```

#### Limpiar consola
```javascript
DebugManager.limpiarConsola();
```

---

## 3. Ejemplo Completo: Refactorizar un Control

### ANTES (sin ControlBase) - 250+ líneas
```javascript
function abrirValidacion() {
    const modal = document.getElementById('modalSemana1') || crearModalSemana1();
    const titulo = document.getElementById('modalSemana1Title');
    const contenido = document.getElementById('modalSemana1Content');
    
    titulo.textContent = '✅ Validación de Datos';
    
    if (typeof ValidadorDatos === 'undefined') {
        contenido.innerHTML = '<p style="color: red;">❌ ValidadorDatos no está cargado</p>';
        modal.classList.add('active');
        return;
    }
    
    let html = `<h3>Verificación de Integridad</h3>`;
    let erroresEncontrados = 0;
    
    if (empleados && empleados.length > 0) {
        empleados.forEach((emp) => {
            const validacion = ValidadorDatos.validarEmpleado(emp);
            if (!validacion.valido) {
                erroresEncontrados++;
                html += `<div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                    <div style="font-weight: bold;">❌ ${emp.nombre}</div>
                    <ul>${validacion.errores.map(e => `<li>${e}</li>`).join('')}</ul>
                </div>`;
            }
        });
    }
    
    // ... 150+ líneas más
    
    modal.classList.add('active');
}

function crearModalSemana1() {
    // ... 100+ líneas creando modal HTML
}
```

### DESPUÉS (con ControlBase) - ~40 líneas
```javascript
class ControlesSemana1 extends ControlBase {
    static moduloNombre = 'ValidadorDatos';
    static modalId = 'modalSemana1';
    static sectionId = 'semana1';
    static color = '#10b981';
    static emoji = '✅';

    static abrirValidacion() {
        this.abrirModal('Validación de Datos', () => {
            let html = '<h3>Verificación de Integridad</h3>';
            
            if (empleados && empleados.length > 0) {
                empleados.forEach((emp) => {
                    const validacion = ValidadorDatos.validarEmpleado(emp);
                    if (!validacion.valido) {
                        html += this.crearHTMLError(emp.nombre, validacion.errores);
                    } else {
                        html += this.crearHTMLSuccess(emp.nombre, 'Validado correctamente');
                    }
                });
            }
            
            return html;
        });
    }
}

// Inicializar
ControlesSemana1.agregarBotonesSidebar([
    { icono: '🔍', texto: 'Validar', funcion: 'ControlesSemana1.abrirValidacion()' }
]);
```

**Reducción**: 250 → 40 líneas (**84% menos código**)

---

## 4. Integración con la Aplicación

### Cargar los nuevos componentes
```html
<!-- En nuevo_cuadrante_mejorado.html -->
<script src="js/control-base.js"></script>
<script src="js/debug-manager.js"></script>
<script src="js/controles-semana-1.js"></script> <!-- usa ControlBase -->
```

### El orden correcto de carga
1. `control-base.js` (clase base)
2. `debug-manager.js` (panel debug)
3. `controles-semana-*.js` (que heredan de ControlBase)

---

## 5. Mejores Prácticas

### ✅ HACER
```javascript
// ✅ Usar métodos de ControlBase
this.abrirModal(titulo, () => html);
this.crearHTMLError(titulo, errores);
this.crearTabla(headers, datos);

// ✅ Definir propiedades estáticas
static moduloNombre = 'MiModulo';
static color = '#color-válido';

// ✅ Validar módulos antes de usar
if (typeof window[this.moduloNombre] === 'undefined') {
    // error handling
}
```

### ❌ NO HACER
```javascript
// ❌ Manipular DOM directamente
document.getElementById('modal').innerHTML = ...;

// ❌ Duplicar código de aperturas de modal
const modal = document.getElementById(...);
const titulo = document.getElementById(...);
// ... repetido 3 veces

// ❌ Sin validación de módulos
window.MiModulo.metodo(); // ¿Qué si MiModulo no está cargado?
```

---

## 6. Troubleshooting

### Problema: Modal no abre
**Solución**: Verificar que los elementos con IDs existan:
```javascript
const modal = document.getElementById(this.modalId);
if (!modal) {
    console.error(`Modal ${this.modalId} no encontrado`);
    return;
}
```

### Problema: Contenido no se actualiza
**Solución**: Llamar a `actualizarDatos()` después de cambios:
```javascript
// Hacer cambios
empleados.push(nuevoEmpleado);

// Actualizar modal
this.abrirModal('Empleados', () => {
    // Regenerar HTML con datos nuevos
    return this.crearTabla(headers, empleados);
});
```

### Problema: ControlBase no está disponible
**Solución**: Verificar orden de carga en `nuevo_cuadrante_mejorado.html`:
```html
<!-- CORRECTO: Primero ControlBase -->
<script src="js/control-base.js"></script>
<script src="js/controles-semana-1.js"></script>

<!-- INCORRECTO: Sin ControlBase -->
<script src="js/controles-semana-1.js"></script>
```

---

## 7. Migrar un Control Existente

### Pasos:

**1. Reemplazar función por clase**
```javascript
// ANTES
function abrirValidacion() { ... }

// DESPUÉS
class ControlesSemana1 extends ControlBase {
    static abrirValidacion() { ... }
}
```

**2. Usar métodos de ControlBase**
```javascript
// ANTES
contenido.innerHTML = `<div style="...">...</div>`;

// DESPUÉS
return this.crearHTMLSuccess('Título', 'Detalles');
```

**3. Inicializar**
```javascript
ControlesSemana1.agregarBotonesSidebar([
    { icono: '...', texto: '...', funcion: '...' }
]);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ControlesSemana1.init?.());
} else {
    ControlesSemana1.init?.();
}
```

---

## 📚 Referencias

- **ControlBase**: `js/control-base.js`
- **DebugManager**: `js/debug-manager.js`
- **Ejemplo completo**: `js/controles-semana-4.js` y `js/controles-semana-5.js`
- **Análisis**: `ANALISIS_APLICACION_COMPLETO.md`

---

**Última actualización**: 2 de Enero, 2026
