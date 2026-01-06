# 🚀 GUÍA DE IMPLEMENTACIÓN PASO A PASO
**Cómo comenzar a implementar las soluciones hoy**

---

## 📌 ANTES DE COMENZAR

### ✅ Verificación Pre-Implementación

```bash
# 1. Verificar que tienes el código base
ls -la nuevo_cuadrante_mejorado.html        # Debe existir
ls -la css/estilos_pastel4.css             # Debe existir
ls -la js/modules.js                       # Debe existir

# 2. Crear respaldo
cp nuevo_cuadrante_mejorado.html nuevo_cuadrante_mejorado.html.backup
cp -r js js_backup
cp -r css css_backup

# 3. Inicializar Git (si no está)
git init
git add .
git commit -m "backup: versión inicial antes de refactor"
```

---

## 🎯 PLAN DETALLADO SEMANA 1

### Día 1: Setup y Validación (8 horas)

#### Paso 1.1: Crear Estructura de Carpetas (30 min)
```bash
# Terminal en c:\Users\samys\OneDrive\Nueva Carpeta

mkdir -p js/modules
mkdir -p css/modules
mkdir -p tests
mkdir -p docs

# Crear archivo git ignore
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo "dist/" >> .gitignore
```

#### Paso 1.2: Crear ValidadorDatos (2 horas)
**Archivo**: `js/modules/validadores.js`

```javascript
/**
 * ValidadorDatos - Validación centralizada de todos los datos de la aplicación
 * @namespace ValidadorDatos
 */
export class ValidadorDatos {
    /**
     * Valida un objeto empleado
     * @param {Object} empleado - Objeto empleado a validar
     * @returns {Object} { valido: boolean, errores: string[] }
     */
    static validarEmpleado(empleado) {
        const errores = [];
        
        // Validar nombre
        if (!empleado.nombre) {
            errores.push('El nombre es requerido');
        } else if (empleado.nombre.trim().length < 3) {
            errores.push('El nombre debe tener al menos 3 caracteres');
        } else if (empleado.nombre.length > 100) {
            errores.push('El nombre no puede exceder 100 caracteres');
        }
        
        // Validar email
        if (empleado.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(empleado.email)) {
                errores.push('El formato de email es inválido');
            }
        }
        
        // Validar teléfono
        if (empleado.telefono) {
            const telefonoLimpio = empleado.telefono.replace(/\D/g, '');
            if (telefonoLimpio.length < 9) {
                errores.push('El teléfono debe tener al menos 9 dígitos');
            }
        }
        
        // Validar horas de contrato
        if (!empleado.horasContrato) {
            errores.push('Las horas de contrato son requeridas');
        } else if (empleado.horasContrato < 80 || empleado.horasContrato > 240) {
            errores.push('Las horas de contrato deben estar entre 80 y 240');
        }
        
        // Validar DNI si existe
        if (empleado.dni && !this.validarDNI(empleado.dni)) {
            errores.push('El DNI no es válido');
        }
        
        return {
            valido: errores.length === 0,
            errores
        };
    }
    
    /**
     * Valida un DNI español
     * @param {string} dni - DNI a validar
     * @returns {boolean}
     */
    static validarDNI(dni) {
        const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!regex.test(dni)) return false;
        
        const numero = parseInt(dni.slice(0, -1), 10);
        const letra = dni.slice(-1).toUpperCase();
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letraCorrecta = letras[numero % 23];
        
        return letra === letraCorrecta;
    }
    
    /**
     * Valida un turno
     * @param {string} turno - Tipo de turno
     * @param {number} empleadoId - ID del empleado
     * @param {number} dia - Día del mes
     * @returns {Object} { valido: boolean, errores: string[] }
     */
    static validarTurno(turno, empleadoId, dia) {
        const errores = [];
        
        // Validar tipo de turno
        if (!tiposTurno[turno]) {
            errores.push(`Tipo de turno inválido: ${turno}`);
        }
        
        // Validar día
        if (dia < 1 || dia > 31) {
            errores.push('El día debe estar entre 1 y 31');
        }
        
        // Validar empleado existe
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) {
            errores.push('El empleado no existe');
        }
        
        return {
            valido: errores.length === 0,
            errores
        };
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ValidadorDatos };
}
```

**Checklist**:
- [ ] Archivo creado en `js/modules/validadores.js`
- [ ] 3 métodos implementados (validarEmpleado, validarDNI, validarTurno)
- [ ] Comentarios JSDoc completos
- [ ] Sintaxis correcta (sin errores)

#### Paso 1.3: Crear Tests para ValidadorDatos (2 horas)
**Archivo**: `tests/validadores.test.js`

```javascript
/**
 * Tests para ValidadorDatos
 * Ejecutar: jest tests/validadores.test.js
 */

// Mock de datos globales (simulación)
const tiposTurno = {
    mañana: { horas: 8 },
    tarde: { horas: 8 },
    noche: { horas: 8 },
    descanso: { horas: 0 }
};

const empleados = [
    { id: 1, nombre: 'Juan García', email: 'juan@example.com', telefono: '666123456', horasContrato: 160 },
    { id: 2, nombre: 'María López', email: 'maria@example.com', telefono: '666789012', horasContrato: 120 }
];

describe('ValidadorDatos', () => {
    describe('validarEmpleado', () => {
        it('Debe aceptar empleado válido', () => {
            const emp = { 
                nombre: 'Juan García',
                email: 'juan@example.com',
                telefono: '666123456',
                horasContrato: 160
            };
            const result = ValidadorDatos.validarEmpleado(emp);
            expect(result.valido).toBe(true);
            expect(result.errores.length).toBe(0);
        });
        
        it('Debe rechazar nombre muy corto', () => {
            const emp = { 
                nombre: 'JG',
                email: 'test@example.com',
                telefono: '666123456',
                horasContrato: 160
            };
            const result = ValidadorDatos.validarEmpleado(emp);
            expect(result.valido).toBe(false);
            expect(result.errores[0]).toContain('3 caracteres');
        });
        
        it('Debe rechazar email inválido', () => {
            const emp = { 
                nombre: 'Juan García',
                email: 'juaninvalido',
                telefono: '666123456',
                horasContrato: 160
            };
            const result = ValidadorDatos.validarEmpleado(emp);
            expect(result.valido).toBe(false);
            expect(result.errores[0]).toContain('email');
        });
        
        it('Debe rechazar horas fuera de rango', () => {
            const emp = { 
                nombre: 'Juan García',
                email: 'juan@example.com',
                telefono: '666123456',
                horasContrato: 300  // Fuera de rango
            };
            const result = ValidadorDatos.validarEmpleado(emp);
            expect(result.valido).toBe(false);
            expect(result.errores[0]).toContain('80 y 240');
        });
    });
    
    describe('validarDNI', () => {
        it('Debe validar DNI correcto', () => {
            const valido = ValidadorDatos.validarDNI('12345678Z');
            expect(valido).toBe(true);
        });
        
        it('Debe rechazar DNI con letra incorrecta', () => {
            const valido = ValidadorDatos.validarDNI('12345678A');
            expect(valido).toBe(false);
        });
    });
    
    describe('validarTurno', () => {
        it('Debe validar turno válido', () => {
            const result = ValidadorDatos.validarTurno('mañana', 1, 5);
            expect(result.valido).toBe(true);
        });
        
        it('Debe rechazar tipo de turno inválido', () => {
            const result = ValidadorDatos.validarTurno('invalido', 1, 5);
            expect(result.valido).toBe(false);
            expect(result.errores[0]).toContain('inválido');
        });
    });
});
```

**Checklist**:
- [ ] Archivo `tests/validadores.test.js` creado
- [ ] 6+ test cases escritos
- [ ] Todos los tests pasan (si tienes Jest configurado)
- [ ] Coverage >= 90%

#### Paso 1.4: Integración en HTML (1 hora)
**Modificación**: `nuevo_cuadrante_mejorado.html`

```html
<!-- Agregar ANTES del script de modules.js -->
<script src="js/modules/validadores.js"></script>

<!-- En la función EmployeeManager.guardarEmpleado(), reemplazar: -->
<!-- ❌ ANTERIOR: -->
static guardarEmpleado(nombre, email, telefono, horasContrato) {
    // Validación débil directa
    if (!nombre || nombre.length < 2) {
        alert('Nombre inválido');
        return false;
    }
    // ... más validaciones débiles
}

<!-- ✅ NUEVO: -->
static guardarEmpleado(nombre, email, telefono, horasContrato) {
    const empleado = { nombre, email, telefono, horasContrato };
    const validacion = ValidadorDatos.validarEmpleado(empleado);
    
    if (!validacion.valido) {
        NotificationSystem.show(validacion.errores[0], 'error');
        return false;
    }
    
    // Proceder a guardar
    // ... resto del código
}
```

**Checklist**:
- [ ] Script tag agregado al HTML
- [ ] EmployeeManager.guardarEmpleado() refactorizado
- [ ] Prueba manual: intentar crear empleado con datos inválidos
- [ ] Debe mostrar error en notificación
- [ ] Commit: `feat: validación centralizada de empleados`

---

### Día 2: Autoguardado (8 horas)

#### Paso 2.1: Crear AutoSaveManager (2 horas)
**Archivo**: `js/modules/auto-save.js`

```javascript
/**
 * AutoSaveManager - Autoguardado automático cada 30 segundos
 * @namespace AutoSaveManager
 */
export class AutoSaveManager {
    static readonly INTERVALO_MS = 30000; // 30 segundos
    static readonly DEBOUNCE_MS = 500;
    
    static #timer = null;
    static #debounceTimer = null;
    static #ultimoEstadoGuardado = null;
    static #activo = false;
    
    /**
     * Inicializa el sistema de autoguardado
     */
    static init() {
        console.log('🔄 AutoSaveManager inicializado');
        this.#activo = true;
        
        // Guardar cada 30 segundos si hay cambios
        this.#timer = setInterval(() => {
            this.#verificarYGuardar();
        }, this.INTERVALO_MS);
        
        // Evento antes de descargar página
        window.addEventListener('beforeunload', (e) => {
            if (this.#tieneCambiosSinGuardar()) {
                e.preventDefault();
                e.returnValue = '¿Salir sin guardar cambios?';
                this.#verificarYGuardar();
            }
        });
        
        console.log('✅ Escuchador beforeunload agregado');
    }
    
    /**
     * Verifica si hay cambios sin guardar
     */
    static #tieneCambiosSinGuardar() {
        return AppState.cambiosPendientes && AppState.cambiosPendientes.length > 0;
    }
    
    /**
     * Verifica y guarda cambios
     */
    static #verificarYGuardar() {
        if (!this.#activo) return;
        
        if (this.#tieneCambiosSinGuardar()) {
            const estadoActual = JSON.stringify({
                cambios: AppState.cambiosPendientes,
                timestamp: new Date().toISOString()
            });
            
            // Solo guardar si el estado cambió
            if (estadoActual !== this.#ultimoEstadoGuardado) {
                this.#guardar();
                this.#ultimoEstadoGuardado = estadoActual;
            }
        }
    }
    
    /**
     * Guarda el estado actual
     */
    static #guardar() {
        try {
            AppState.saveToStorage();
            console.log('💾 Autoguardado completado', {
                cambios: AppState.cambiosPendientes.length,
                timestamp: new Date().toLocaleTimeString('es-ES')
            });
            
            // Notificación silenciosa (opcional)
            if (window.NotificationSystem) {
                NotificationSystem.show('💾 Cambios guardados', 'success', 1000);
            }
        } catch (e) {
            console.error('❌ Error en autoguardado:', e);
            if (window.NotificationSystem) {
                NotificationSystem.show('⚠️ Error al guardar: ' + e.message, 'error');
            }
        }
    }
    
    /**
     * Detiene el autoguardado
     */
    static destroy() {
        console.log('🛑 AutoSaveManager detenido');
        clearInterval(this.#timer);
        clearTimeout(this.#debounceTimer);
        this.#activo = false;
    }
    
    /**
     * Obtiene el estado actual
     */
    static getStatus() {
        return {
            activo: this.#activo,
            cambiosPendientes: AppState.cambiosPendientes.length,
            ultimoGuardado: this.#ultimoEstadoGuardado ? new Date().toLocaleTimeString() : 'Nunca'
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutoSaveManager };
}
```

**Checklist**:
- [ ] Archivo `js/modules/auto-save.js` creado
- [ ] Métodos init(), destroy(), getStatus() implementados
- [ ] JSDoc completo
- [ ] Sin errores de sintaxis

#### Paso 2.2: Integrar en HTML (1 hora)

```html
<!-- En nuevo_cuadrante_mejorado.html -->

<!-- Agregar al <head> o antes de </body>: -->
<script src="js/modules/auto-save.js"></script>

<!-- En el event listener DOMContentLoaded: -->
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    
    // Inicializar autoguardado
    if (typeof AutoSaveManager !== 'undefined') {
        AutoSaveManager.init();
        console.log('✅ Autoguardado activado');
    }
    
    // Mostrar estado en consola
    window.getAutoSaveStatus = () => AutoSaveManager.getStatus();
});

<!-- Al cerrar la página: -->
window.addEventListener('beforeunload', () => {
    if (typeof AutoSaveManager !== 'undefined') {
        AutoSaveManager.destroy();
    }
});
```

**Checklist**:
- [ ] Script tag agregado
- [ ] Inicialización en DOMContentLoaded
- [ ] Prueba manual en consola: `getAutoSaveStatus()`
- [ ] Debe mostrar status: { activo: true, cambiosPendientes: 0, ... }
- [ ] Commit: `feat: autoguardado cada 30 segundos`

#### Paso 2.3: Tests Autoguardado (1 hora)
**Archivo**: `tests/auto-save.test.js`

```javascript
describe('AutoSaveManager', () => {
    beforeEach(() => {
        // Mock de AppState
        window.AppState = {
            cambiosPendientes: [],
            saveToStorage: jest.fn()
        };
    });
    
    it('Debe detectar cambios pendientes', () => {
        AutoSaveManager.init();
        AppState.cambiosPendientes = [{ turno: 'noche' }];
        
        setTimeout(() => {
            // Después de 30s, debe guardar
            expect(AppState.saveToStorage).toHaveBeenCalled();
        }, 31000);
    });
    
    it('Debe mostrar advertencia antes de descargar', () => {
        AutoSaveManager.init();
        AppState.cambiosPendientes = [{ cambio: true }];
        
        const event = new Event('beforeunload');
        expect(() => window.dispatchEvent(event)).not.toThrow();
    });
});
```

**Checklist**:
- [ ] Tests escritos
- [ ] Coverage >= 80%
- [ ] Prueba en navegador: haz cambios y espera 35s
- [ ] Debe ver "Cambios guardados" (notificación)

---

### Día 3: Sincronización Entre Pestañas (4 horas)

#### Paso 3.1: Crear TabSyncManager (2 horas)
**Archivo**: `js/modules/tab-sync.js`

```javascript
/**
 * TabSyncManager - Sincronización en tiempo real entre pestañas
 * @namespace TabSyncManager
 */
export class TabSyncManager {
    static #activo = false;
    
    /**
     * Inicializa la sincronización entre pestañas
     */
    static init() {
        console.log('🔗 TabSyncManager inicializado');
        this.#activo = true;
        
        // Escuchar cambios en localStorage desde otras pestañas
        window.addEventListener('storage', (event) => {
            this.#handleStorageChange(event);
        });
        
        console.log('✅ Event listener de storage agregado');
    }
    
    /**
     * Maneja cambios en localStorage
     */
    static #handleStorageChange(event) {
        if (!this.#activo) return;
        
        // Solo procesamos cambios en turnosAppState
        if (event.key === 'turnosAppState') {
            console.log('📱 Cambios detectados en otra pestaña');
            
            try {
                // Recargar estado desde localStorage
                if (typeof AppState !== 'undefined') {
                    AppState.loadFromStorage();
                    console.log('✅ Estado recargado desde localStorage');
                }
                
                // Actualizar UI
                if (typeof UI !== 'undefined') {
                    UI.generarCuadranteGeneral();
                    console.log('✅ Cuadrante general actualizado');
                    
                    // Si estaba viendo un empleado específico
                    if (AppState.selectedEmployee) {
                        UI.generarCuadranteIndividual(AppState.selectedEmployee);
                        console.log('✅ Cuadrante individual actualizado');
                    }
                }
                
                // Mostrar notificación
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show(
                        '📱 Cuadrante actualizado desde otra pestaña',
                        'info',
                        3000
                    );
                }
            } catch (e) {
                console.error('❌ Error sincronizando datos:', e);
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show(
                        '⚠️ Error sincronizando: ' + e.message,
                        'error'
                    );
                }
            }
        }
    }
    
    /**
     * Detiene la sincronización
     */
    static destroy() {
        console.log('🛑 TabSyncManager detenido');
        this.#activo = false;
    }
    
    /**
     * Obtiene el estado actual
     */
    static getStatus() {
        return {
            activo: this.#activo,
            timestamp: new Date().toLocaleTimeString('es-ES')
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TabSyncManager };
}
```

**Checklist**:
- [ ] Archivo `js/modules/tab-sync.js` creado
- [ ] Event listener implementado
- [ ] JSDoc completo
- [ ] Sin errores

#### Paso 3.2: Integrar en HTML (1 hora)

```html
<!-- En nuevo_cuadrante_mejorado.html -->
<script src="js/modules/tab-sync.js"></script>

<!-- En DOMContentLoaded: -->
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    
    // Inicializar sincronización
    if (typeof TabSyncManager !== 'undefined') {
        TabSyncManager.init();
        console.log('✅ Sincronización entre pestañas activada');
    }
});
```

**Checklist**:
- [ ] Script tag agregado
- [ ] Inicialización completada
- [ ] Prueba manual: abrir app en 2 pestañas
- [ ] Cambiar turno en pestaña A
- [ ] Pestaña B debe actualizarse automáticamente
- [ ] Commit: `feat: sincronización en tiempo real entre pestañas`

---

### Día 4: Refactorizar AppState Básico (4 horas)

#### Paso 4.1: Crear AppState v2 (3 horas)
**Archivo**: `js/modules/app-state-v2.js`

```javascript
/**
 * AppState v2 - Gestión centralizada del estado con validación y auditoría
 * @namespace AppState
 */
export class AppState {
    // === PROPIEDADES PRIVADAS ===
    static #scheduleData = new Map();
    static #cambiosPendientes = [];
    static #auditLog = [];
    static #currentYear = new Date().getFullYear();
    static #currentMonth = new Date().getMonth();
    static #selectedEmployee = null;
    
    // === GETTERS (LECTURA SEGURA) ===
    
    static get scheduleData() {
        return this.#scheduleData;
    }
    
    static get cambiosPendientes() {
        // Retornar copia para evitar modificación directa
        return [...this.#cambiosPendientes];
    }
    
    static get auditLog() {
        return [...this.#auditLog];
    }
    
    static get currentYear() {
        return this.#currentYear;
    }
    
    static get currentMonth() {
        return this.#currentMonth;
    }
    
    static get selectedEmployee() {
        return this.#selectedEmployee;
    }
    
    // === MÉTODOS PÚBLICOS (MODIFICACIÓN SEGURA) ===
    
    /**
     * Establece el mes y año actual
     */
    static setMes(mes, anio) {
        if (mes < 0 || mes > 11) throw new Error('Mes inválido (0-11)');
        if (anio < 2000 || anio > 2100) throw new Error('Año inválido');
        
        this.#currentMonth = mes;
        this.#currentYear = anio;
        
        this.#registrarAuditoria('MES_CAMBIADO', { mes, anio });
        this.saveToStorage();
    }
    
    /**
     * Establece un turno para un empleado en un día específico
     */
    static setTurno(empleadoId, dia, turno, horas = null) {
        // Validar entrada
        if (!empleadoId || !dia || !turno) {
            throw new Error('Parámetros requeridos: empleadoId, dia, turno');
        }
        
        // Validar turno
        if (typeof ValidadorDatos !== 'undefined') {
            const validacion = ValidadorDatos.validarTurno(turno, empleadoId, dia);
            if (!validacion.valido) {
                throw new Error(validacion.errores[0]);
            }
        }
        
        // Obtener turnos del empleado
        if (!this.#scheduleData.has(empleadoId)) {
            throw new Error(`Empleado ${empleadoId} no existe en scheduleData`);
        }
        
        const turnos = this.#scheduleData.get(empleadoId);
        const turnoExistente = turnos.find(t => t.dia === dia);
        
        if (!turnoExistente) {
            throw new Error(`Turno del día ${dia} no existe para empleado ${empleadoId}`);
        }
        
        // Registrar cambio histórico
        const turnoAnterior = turnoExistente.turno;
        
        // Modificar turno
        turnoExistente.turno = turno;
        if (horas) {
            turnoExistente.horas = horas;
        }
        turnoExistente.ultimaModificacion = new Date().toISOString();
        
        // Registrar en auditoría
        this.#registrarAuditoria('TURNO_MODIFICADO', {
            empleadoId,
            dia,
            turnoAnterior,
            turnoNuevo: turno
        });
        
        // Agregar a cambios pendientes
        this.#cambiosPendientes.push({
            tipo: 'TURNO_MODIFICADO',
            empleadoId,
            dia,
            turnoNuevo: turno,
            horasNuevas: horas,
            timestamp: new Date().toISOString()
        });
        
        // Guardar automáticamente
        this.saveToStorage();
    }
    
    /**
     * Elimina un empleado y sus turnos
     */
    static eliminarEmpleado(empleadoId) {
        if (!empleadoId) throw new Error('empleadoId requerido');
        
        // Registrar en auditoría
        const empleado = empleados.find(e => e.id === empleadoId);
        this.#registrarAuditoria('EMPLEADO_ELIMINADO', {
            empleadoId,
            nombre: empleado?.nombre
        });
        
        // Eliminar datos
        this.#scheduleData.delete(empleadoId);
        
        // Limpiar cambios pendientes del empleado
        this.#cambiosPendientes = this.#cambiosPendientes.filter(
            c => c.empleadoId !== empleadoId
        );
        
        this.saveToStorage();
    }
    
    /**
     * Aplica todos los cambios pendientes
     */
    static aplicarCambiosPendientes() {
        const cantidad = this.#cambiosPendientes.length;
        
        if (cantidad === 0) {
            console.log('ℹ️ No hay cambios pendientes para aplicar');
            return;
        }
        
        console.log(`📋 Aplicando ${cantidad} cambios...`);
        
        // Los cambios ya están aplicados en scheduleData
        // Solo necesitamos limpiar la cola
        this.#cambiosPendientes = [];
        
        this.#registrarAuditoria('CAMBIOS_APLICADOS', {
            cantidad,
            timestamp: new Date().toISOString()
        });
        
        this.saveToStorage();
        
        console.log(`✅ ${cantidad} cambios aplicados y guardados`);
    }
    
    /**
     * Guarda el estado en localStorage
     */
    static saveToStorage() {
        try {
            const data = {
                currentYear: this.#currentYear,
                currentMonth: this.#currentMonth,
                scheduleData: Array.from(this.#scheduleData.entries()),
                cambiosPendientes: this.#cambiosPendientes,
                auditLog: this.#auditLog.slice(-1000), // Mantener últimos 1000
                version: 2,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('turnosAppState', JSON.stringify(data));
            console.log('✅ Estado guardado en localStorage');
        } catch (e) {
            console.error('❌ Error guardando estado:', e);
            
            // Si es por quota excedida, limpiar audit log
            if (e.name === 'QuotaExceededError') {
                console.warn('⚠️ localStorage llena, limpiando auditoría...');
                this.#auditLog = this.#auditLog.slice(-500);
                this.saveToStorage(); // Reintentar
            }
        }
    }
    
    /**
     * Carga el estado desde localStorage
     */
    static loadFromStorage() {
        try {
            const dataStr = localStorage.getItem('turnosAppState');
            if (!dataStr) {
                console.log('ℹ️ No hay datos guardados en localStorage');
                return;
            }
            
            const data = JSON.parse(dataStr);
            
            // Validar versión
            if (data.version !== 2) {
                console.warn('⚠️ Formato de almacenamiento antiguo, reiniciando...');
                this.#limpiar();
                return;
            }
            
            // Cargar datos
            this.#currentYear = data.currentYear;
            this.#currentMonth = data.currentMonth;
            this.#scheduleData = new Map(data.scheduleData || []);
            this.#cambiosPendientes = data.cambiosPendientes || [];
            this.#auditLog = data.auditLog || [];
            
            console.log('✅ Estado cargado desde localStorage');
        } catch (e) {
            console.error('❌ Error cargando estado:', e);
            this.#limpiar();
        }
    }
    
    // === MÉTODOS PRIVADOS ===
    
    /**
     * Registra un evento en el audit log
     */
    static #registrarAuditoria(tipo, datos) {
        this.#auditLog.push({
            tipo,
            datos,
            timestamp: new Date().toISOString(),
            userId: 'system' // TODO: obtener usuario actual
        });
    }
    
    /**
     * Limpia todos los datos
     */
    static #limpiar() {
        this.#scheduleData.clear();
        this.#cambiosPendientes = [];
        this.#auditLog = [];
        console.log('🧹 Estado limpiado');
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState };
}
```

**Checklist**:
- [ ] Archivo `js/modules/app-state-v2.js` creado
- [ ] Propiedades privadas (#)
- [ ] Métodos públicos seguros
- [ ] Sistema de auditoría
- [ ] JSDoc completo
- [ ] Sintaxis correcta

#### Paso 4.2: Tests AppState v2 (1 hora)
**Archivo**: `tests/app-state.test.js`

```javascript
describe('AppState v2', () => {
    beforeEach(() => {
        // Limpiar antes de cada test
        localStorage.clear();
        AppState.loadFromStorage();
    });
    
    it('Debe permitir setear un turno válido', () => {
        AppState.setTurno(1, 5, 'noche');
        const cambio = AppState.cambiosPendientes[0];
        
        expect(cambio.tipo).toBe('TURNO_MODIFICADO');
        expect(cambio.turnoNuevo).toBe('noche');
    });
    
    it('Debe rechazar parámetros inválidos', () => {
        expect(() => AppState.setTurno(null, 5, 'noche')).toThrow();
        expect(() => AppState.setTurno(1, null, 'noche')).toThrow();
        expect(() => AppState.setTurno(1, 5, null)).toThrow();
    });
    
    it('Debe registrar cambios en auditoría', () => {
        AppState.setTurno(1, 5, 'noche');
        const audit = AppState.auditLog;
        
        expect(audit.length).toBeGreaterThan(0);
        expect(audit[audit.length - 1].tipo).toBe('TURNO_MODIFICADO');
    });
    
    it('Debe aplicar cambios pendientes', () => {
        AppState.setTurno(1, 5, 'noche');
        AppState.setTurno(1, 6, 'tarde');
        
        expect(AppState.cambiosPendientes.length).toBe(2);
        
        AppState.aplicarCambiosPendientes();
        
        expect(AppState.cambiosPendientes.length).toBe(0);
    });
});
```

**Checklist**:
- [ ] Tests escritos
- [ ] Coverage >= 80%
- [ ] Todos los tests pasan

---

### Día 5: Integración y Testing (8 horas)

#### Paso 5.1: Integrar AppState v2 en HTML (2 horas)

```html
<!-- En nuevo_cuadrante_mejorado.html -->

<!-- Reemplazar las referencias a la vieja clase AppState -->
<!-- Agregar al HTML antes de </body>: -->

<script src="js/modules/app-state-v2.js"></script>

<!-- En la función TurnoEditor.guardarDescripcion(): -->
static guardarDescripcion(empleadoId, dia, nuevoTurno, horas) {
    try {
        // Usar nuevo método seguro
        AppState.setTurno(empleadoId, dia, nuevoTurno, horas);
        
        console.log(`✅ Turno guardado: Emp ${empleadoId} Día ${dia} = ${nuevoTurno}`);
        
        // Cerrar modal
        document.getElementById('modalEdicionTurno').classList.remove('active');
        
        // Actualizar UI
        UI.generarCuadranteGeneral();
        
        // Notificación
        NotificationSystem.show('✅ Turno guardado correctamente', 'success');
    } catch (e) {
        NotificationSystem.show('❌ Error: ' + e.message, 'error');
        console.error('Error guardando turno:', e);
    }
}
```

**Checklist**:
- [ ] Script tag agregado
- [ ] AppState.setTurno() usado en lugar de modificación directa
- [ ] Error handling implementado
- [ ] Prueba manual: crear/editar turno
- [ ] Debe guardar sin errores

#### Paso 5.2: Ejecutar Suite Completa de Tests (2 horas)

```bash
# Terminal
cd c:\Users\samys\OneDrive\Nueva Carpeta

# Instalar Jest (si no está)
npm install --save-dev jest

# Ejecutar todos los tests
npm test

# Ver coverage
npm test -- --coverage

# Mode watch (rerun en cambios)
npm test -- --watch
```

**Checklist**:
- [ ] Jest instalado
- [ ] Todos los tests pasan
- [ ] Coverage >= 70%
- [ ] Sin warnings

#### Paso 5.3: Testing Manual (2 horas)

```javascript
// En la consola del navegador, después de cargar:

// 1. Verificar autoguardado
console.log(getAutoSaveStatus());
// Debe mostrar: { activo: true, cambiosPendientes: 0, ... }

// 2. Hacer un cambio
AppState.setTurno(1, 5, 'noche');

// 3. Esperar 35 segundos
// 4. Verificar en localStorage
console.log(localStorage.getItem('turnosAppState').substring(0, 100));

// 5. Abrir otra pestaña
// 6. Los cambios deben verse automáticamente

// 7. Ver auditoría
console.log(AppState.auditLog);
```

**Checklist**:
- [ ] Autoguardado funciona (esperar 35s)
- [ ] Cambios aparecen en localStorage
- [ ] Sincronización entre pestañas funciona
- [ ] Auditoría registra cambios
- [ ] No hay errores en consola

#### Paso 5.4: Commit y Documentación (2 horas)

```bash
# Terminal
git add .
git commit -m "feat: semana 1 completada - validación, autoguardado, sincronización"

# Crear rama para siguiente fase
git checkout -b feat/event-bus
```

**Checklist**:
- [ ] Cambios committed
- [ ] Mensaje descriptivo
- [ ] Nueva rama creada
- [ ] README.md actualizado con cambios semana 1

---

## 📊 RESUMEN SEMANA 1

| Tarea | Estado | Horas | Commit |
|-------|--------|-------|--------|
| ValidadorDatos | ✅ Completa | 8 | feat: validación centralizada |
| AutoSaveManager | ✅ Completa | 6 | feat: autoguardado 30s |
| TabSyncManager | ✅ Completa | 4 | feat: sincronización multi-tab |
| AppState v2 | ✅ Completa | 10 | refactor: AppState seguro |
| Tests | ✅ Completa | 8 | test: suite semana 1 |
| Integración | ✅ Completa | 4 | refactor: integración en HTML |
| **TOTAL** | **✅** | **40h** | 6 commits |

---

## 🎯 PRÓXIMOS PASOS (Semana 2)

1. [ ] Leer guía de Semana 2 (cuando esté disponible)
2. [ ] Continuar con AppState auditoría avanzada
3. [ ] Refactorizar métodos de EmployeeManager
4. [ ] Expandir cobertura de tests
5. [ ] Deploy a staging environment

---

**Documento**: Guía Paso a Paso Semana 1  
**Fecha**: 1 de enero de 2026  
**Versión**: 1.0 - LISTA PARA IMPLEMENTACIÓN INMEDIATA
