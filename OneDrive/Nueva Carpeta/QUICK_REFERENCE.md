# 🚀 QUICK REFERENCE - Guía Rápida para Developers

---

## 📌 ATAJOS IMPORTANTES

### Documentación Completa
```
├── RESUMEN_EJECUTIVO.md                    ← LEER PRIMERO (5 min)
├── ANALISIS_INTEGRAL_PROYECTO_2026.md      ← FALLOS DETALLADOS (30 min)
├── IMPLEMENTACION_TECNICA_CODIGO.md        ← CÓDIGO LISTO (45 min)
├── PLAN_ACCION_PRIORITIZADO.md             ← TIMELINE + TAREAS (20 min)
└── QUICK_REFERENCE.md                      ← TÚ ESTÁS AQUÍ (5 min)
```

---

## 🔴 TOP 5 PROBLEMAS URGENTES

```javascript
// 1. CAMBIOS SE PIERDEN ❌
AppState.cambiosPendientes.push({...});
// Navegador cierra → DATOS PERDIDOS

// Solución: Autoguardado cada 30s
// Archivo: js/modules/auto-save.js
AutoSaveManager.init();

// ---

// 2. NO SINCRONIZA ENTRE PESTAÑAS ❌
// Pestaña A: cambio turno
// Pestaña B: no ve cambio automáticamente

// Solución: Event listener en storage
// Archivo: js/modules/tab-sync.js
window.addEventListener('storage', (e) => {
    if (e.key === 'turnosAppState') {
        AppState.loadFromStorage();
        UI.actualizar();
    }
});

// ---

// 3. VALIDACIÓN DÉBIL ❌
const emp = { nombre: 'A', email: 'invalido', horas: 999 };
EmployeeManager.guardarEmpleado(emp); // ¡ACEPTA!

// Solución: Validador centralizado
// Archivo: js/modules/validadores.js
const val = ValidadorDatos.validarEmpleado(emp);
if (!val.valido) throw new Error(val.errores[0]);

// ---

// 4. AppState SIN CONTROL ❌
AppState.scheduleData.set(1, []); // ¡Se puede sobrescribir!
// No hay auditoría ni validación

// Solución: Métodos seguros
// Archivo: js/modules/app-state-v2.js
AppState.setTurno(1, 5, 'noche'); // Valida + audita automáticamente

// ---

// 5. ARQUITECTURA MONOLÍTICA ❌
// Todo en nuevo_cuadrante_mejorado.html (4500 líneas)
// Imposible navegar o mantener

// Solución: Módulos separados
// Archivos: js/modules/
// - app-state.js
// - validadores.js
// - event-bus.js
// - turnos.js
// - etc.
```

---

## 🟢 SOLUCIONES RÁPIDAS (COPY-PASTE)

### 1. AutoSaveManager
```javascript
// En nuevo_cuadrante_mejorado.html:
<script src="js/modules/auto-save.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    AutoSaveManager.init();
});
```

### 2. TabSyncManager
```javascript
<script src="js/modules/tab-sync.js"></script>

document.addEventListener('DOMContentLoaded', () => {
    TabSyncManager.init();
});
```

### 3. ValidadorDatos
```javascript
// En EmployeeManager.guardarEmpleado():
const validacion = ValidadorDatos.validarEmpleado(empleado);
if (!validacion.valido) {
    NotificationSystem.show(validacion.errores[0], 'error');
    return;
}
```

### 4. Event Bus (Comunicación)
```javascript
// Publicar evento
EventBus.publish(EVENTOS.TURNO_CAMBIADO, {
    empleadoId: 1,
    dia: 5,
    turno: 'noche'
});

// Suscribirse a evento
EventBus.subscribe(EVENTOS.TURNO_CAMBIADO, (data) => {
    UI.actualizarFilaEmpleado(data.empleadoId);
});
```

---

## 🎯 IMPLEMENTACIÓN POR SEMANA

### Semana 1 (Máxima Prioridad)
```
Lunes:    ValidadorDatos + tests
Martes:   AutoSaveManager integrado
Miércoles: TabSyncManager funcional
Jueves:   Refactor AppState básico
Viernes:  Tests + documentación
```

### Semana 2
```
Lunes-Martes:   AppState v2 completo
Miércoles:      Auditoría + métodos seguros
Jueves-Viernes: Tests exhaustivos
```

### Semana 3
```
Lunes-Martes:   EventBus implementado
Miércoles:      TurnoEditor refactorizado
Jueves-Viernes: Todos los managers con eventos
```

### Semana 4
```
Lunes-Miércoles:  Dividir modules.js
Jueves-Viernes:   Dividir CSS en módulos
```

---

## 🔧 COMANDOS GIT

```bash
# Crear rama para nuevas features
git checkout -b feat/auto-save
git add -A
git commit -m "feat: autoguardado cada 30s"
git push origin feat/auto-save

# Crear rama para refactoring
git checkout -b refactor/app-state
git add -A
git commit -m "refactor: AppState con métodos seguros"

# Crear rama para tests
git checkout -b test/validadores
git add -A
git commit -m "test: suite completa de validadores"
```

---

## 📊 TESTING

### Ejecutar Tests
```bash
npm test                    # Todos los tests
npm test -- app-state       # Tests específicos
npm test -- --coverage      # Con coverage
npm test -- --watch         # Modo watch
```

### Escribir Test Básico
```javascript
describe('ValidadorDatos', () => {
    it('Debe rechazar email inválido', () => {
        const emp = { email: 'invalido' };
        const result = ValidadorDatos.validarEmpleado(emp);
        
        expect(result.valido).toBe(false);
        expect(result.errores[0]).toContain('Email');
    });
});
```

---

## 🚨 DEBUGGING RÁPIDO

### En Consola
```javascript
// Ver estado actual
console.log(AppState.scheduleData);
console.log(AppState.cambiosPendientes);
console.log(AppState.auditLog);

// Ver qué tiene localStorage
localStorage.getItem('turnosAppState');

// Limpiar y recargar
localStorage.clear();
location.reload();

// Ver qué cambios están pendientes
AppState.cambiosPendientes.forEach(c => {
    console.log(`${c.empleadoId} - Día ${c.dia}: ${c.turnoNuevo}`);
});
```

### Brekapoints Chrome DevTools
```javascript
// Pausar cuando se cambia un turno
window.addEventListener('TURNO_CHANGED', () => debugger);

// O en el código:
if (empleadoId === 5) debugger; // Breakpoint condicional
```

---

## 📈 PERFORMANCE

### Herramientas
```bash
# Lighthouse (Chrome DevTools)
# Ctrl+Shift+I → Lighthouse → Generate Report

# DevTools Performance
# Ctrl+Shift+I → Performance → Record → Acciones → Stop

# Profiler para memoria
# Ctrl+Shift+I → Memory → Take Heap Snapshot
```

### Targets a Lograr
```
✅ First Contentful Paint (FCP): < 2 segundos
✅ Largest Contentful Paint (LCP): < 2 segundos
✅ Cumulative Layout Shift (CLS): < 0.1
✅ Interaction to Next Paint (INP): < 200ms
✅ Time to Interactive (TTI): < 3.8 segundos
```

---

## 🎨 ESTRUCTURA CSS POST-REFACTOR

```css
/* Variables centralizadas */
:root {
    --color-primary: #3498db;
    --color-danger: #e74c3c;
    --spacing-base: 16px;
    --font-size-base: 16px;
    --z-index-modal: 1000;
}

/* Temas */
[data-theme="dark"] {
    --color-bg: #1a1a1a;
    --color-text: #ffffff;
}

/* Evitar !important */
/* Usar cascada y especificidad adecuada */
.modal.active .modal-content { /* vs. !important */ }
```

---

## 🔐 SEGURIDAD BÁSICA

```javascript
// ❌ NUNCA hacer esto:
localStorage.setItem('password', userPassword);
AppState.userPassword = password;
console.log('API Key:', apiKey);

// ✅ HACER esto:
// Hashes en servidor, never en cliente
// sessionStorage para tokens (borrados al cerrar)
// Variables de entorno para secrets

// Validar SIEMPRE input del usuario
const filtered = userInput.replace(/[<>]/g, ''); // XSS protection
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
@media (min-width: 480px) { /* Smartphones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktops */ }
@media (min-width: 1440px) { /* Large desktops */ }
```

---

## 🎯 CHECKLIST ANTES DE COMMIT

```javascript
// □ Tests pasan: npm test
// □ No hay console.log de debug: grep 'console.log'
// □ No hay commented code: grep '//'
// □ JSDoc en funciones públicas
// □ Sin cambios accidentales en otros archivos
// □ Commit message descriptivo
// □ Sin merge conflicts

// Comando pre-commit
git status  // Ver qué cambió
git diff    // Revisar cambios
npm test    // Tests
git add -A
git commit -m "feat: descripción clara"
```

---

## 💡 TIPS PARA DEVELOPERS

### Tip 1: Usar Constantes Centralizadas
```javascript
// ❌ MALO
if (turno === 'noche' || turno === 'Noche' || turno === 'NOCHE') { }

// ✅ BUENO
const TIPOS_TURNO = {
    MANANA: 'mañana',
    TARDE: 'tarde',
    NOCHE: 'noche'
};
if (turno === TIPOS_TURNO.NOCHE) { }
```

### Tip 2: Usar Métodos Privados Cuando Sea Apropiado
```javascript
class Manager {
    static publicMethod() {
        this.#privateMethod(); // Privado con #
    }
    
    static #privateMethod() {
        // No accesible desde fuera
    }
}
```

### Tip 3: Early Returns para Simplificar
```javascript
// ❌ COMPLICADO
function validar(data) {
    if (data.nombre) {
        if (data.email) {
            if (data.telefono) {
                return true;
            }
        }
    }
    return false;
}

// ✅ LIMPIO
function validar(data) {
    if (!data.nombre) return false;
    if (!data.email) return false;
    if (!data.telefono) return false;
    return true;
}
```

### Tip 4: Usar Destructuring
```javascript
// ❌ VERBOSE
const nombre = empleado.nombre;
const email = empleado.email;

// ✅ CONCISO
const { nombre, email } = empleado;
```

### Tip 5: Comentarios Útiles (No Obvios)
```javascript
// ❌ OBVIO
x = x + 1; // Aumentar x

// ✅ ÚTIL
// Necesario agregar 1 porque los IDs comienzan en 0
x = x + 1;
```

---

## 🆘 PROBLEMAS COMUNES Y SOLUCIONES

### Problema: Modal No Se Cierra
```javascript
// Verificar:
// 1. Elemento tiene id correcto
<div id="modalEdicion" class="modal">

// 2. JavaScript lo está removiendo correctamente
document.getElementById('modalEdicion').classList.remove('active');

// 3. CSS tiene transition suave
.modal {
    transition: opacity 0.3s ease;
}
```

### Problema: Tabla Se Ralentiza
```javascript
// Solución: Virtualización
const table = new VirtualTable(container, {
    rowHeight: 35,
    bufferRows: 5
});
table.init(empleados, renderRow);
```

### Problema: localStorage Llena
```javascript
// Solución: Compresión + Limpieza
AppState.saveToStorage = function() {
    const data = { /* ... */ };
    const compressed = LZ.compressToBase64(JSON.stringify(data));
    localStorage.setItem('turnosAppState', compressed);
};
```

### Problema: Cambios No Se Sincronizan
```javascript
// Verificar event listener está activo
window.addEventListener('storage', (event) => {
    if (event.key === 'turnosAppState') {
        location.reload(); // O actualizar sin reload
    }
});
```

---

## 📞 CONTACTO EN EQUIPO

**Lead Dev** (preguntas arquitectura): 
- Cómo estructurar módulos
- Patrones de comunicación
- Decisiones de diseño

**Mid-Level Dev** (preguntas implementación):
- Cómo usar EventBus
- Validación de datos
- Tests unitarios

**QA** (preguntas testing):
- Casos de prueba
- Coverage
- Regresión

---

## 🎓 RECURSOS EXTERNOS

```
MDN Web Docs: https://developer.mozilla.org/
JavaScript.info: https://javascript.info/
Jest Testing: https://jestjs.io/
WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/
```

---

## ✅ CHECKLIST MENSUAL

```
Semana 1:
☐ Validación + Autoguardado completados
☐ Tests escritos y pasando
☐ Code review completado
☐ Deploy a staging

Semana 2:
☐ AppState refactorizado
☐ Sistema de auditoría funcionando
☐ Tests al 80% coverage
☐ Documentación actualizada

Semana 3:
☐ EventBus centralizado
☐ Managers usando eventos
☐ No hay memory leaks
☐ Performance baseline medido

Semana 4:
☐ Módulos separados
☐ CSS modularizado
☐ Build process optimizado
☐ Listo para fase 2
```

---

**Última actualización**: 1 de enero de 2026  
**Versión**: 1.0  
**Para**: Equipo de Desarrollo

---

*Documentación generada automáticamente por análisis exhaustivo del proyecto.*  
*Cualquier pregunta → Revisa ANALISIS_INTEGRAL_PROYECTO_2026.md*
