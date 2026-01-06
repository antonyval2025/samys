# 🔧 GUÍA TÉCNICA DE CORRECCIONES - Código de Implementación

---

## 1. AUTOGUARDADO AUTOMÁTICO

### Problema Actual
Los cambios en `cambiosPendientes` se pierden si el usuario cierra la pestaña sin hacer clic en "Guardar".

### Solución Implementable

```javascript
// js/modules/auto-save.js
export class AutoSaveManager {
    static readonly INTERVAL_MS = 30000; // 30 segundos
    static readonly DEBOUNCE_MS = 500;  // Esperar 500ms después del último cambio
    
    static timer = null;
    static debounceTimer = null;
    static lastSavedState = null;
    
    static init() {
        // Guardar cada 30 segundos si hay cambios
        this.timer = setInterval(() => {
            this.checkAndSave();
        }, this.INTERVAL_MS);
        
        // Guardar al descargar la página
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '¿Salir sin guardar cambios?';
                this.checkAndSave();
            }
        });
    }
    
    static hasUnsavedChanges() {
        return AppState.cambiosPendientes.length > 0;
    }
    
    static checkAndSave() {
        if (this.hasUnsavedChanges()) {
            const stateStr = JSON.stringify({
                cambios: AppState.cambiosPendientes,
                timestamp: new Date().toISOString()
            });
            
            if (stateStr !== this.lastSavedState) {
                this.save();
                NotificationSystem.show('💾 Cambios guardados', 'success');
            }
        }
    }
    
    static save() {
        try {
            AppState.saveToStorage();
            this.lastSavedState = JSON.stringify({
                cambios: AppState.cambiosPendientes,
                timestamp: new Date().toISOString()
            });
        } catch (e) {
            NotificationSystem.show('⚠️ Error guardando: ' + e.message, 'error');
            console.error('AutoSave Error:', e);
        }
    }
    
    static destroy() {
        clearInterval(this.timer);
        clearTimeout(this.debounceTimer);
    }
}

// En nuevo_cuadrante_mejorado.html, al inicio:
document.addEventListener('DOMContentLoaded', () => {
    AutoSaveManager.init();
    // ... resto del código
});

// Al cerrar:
window.addEventListener('beforeunload', () => {
    AutoSaveManager.destroy();
});
```

---

## 2. SINCRONIZACIÓN ENTRE PESTAÑAS

### Problema Actual
Si abres en 2 pestañas y cambias algo en una, la otra NO se actualiza.

### Solución Implementable

```javascript
// js/modules/tab-sync.js
export class TabSyncManager {
    static init() {
        // Escuchar cambios en localStorage desde otras pestañas
        window.addEventListener('storage', (event) => {
            if (event.key === 'turnosAppState') {
                console.log('📱 Cambios detectados en otra pestaña');
                
                // Recargar estado
                AppState.loadFromStorage();
                
                // Mostrar notificación
                NotificationSystem.show('📱 Cuadrante actualizado desde otra pestaña', 'info');
                
                // Refrescar UI
                UI.generarCuadranteGeneral();
                
                // Si estaba viendo un empleado específico, refrescar
                if (AppState.selectedEmployee) {
                    UI.generarCuadranteIndividual(AppState.selectedEmployee);
                }
            }
        });
        
        // Mantener sesión activa entre pestañas
        this.startHeartbeat();
    }
    
    static startHeartbeat() {
        // Cada 5 segundos, escribir timestamp de "latido"
        setInterval(() => {
            localStorage.setItem('app_heartbeat_' + new Date().getTime(), 'true');
        }, 5000);
    }
}

// Agregar al init:
TabSyncManager.init();
```

---

## 3. VALIDACIÓN CENTRALIZADA DE DATOS

### Problema Actual
Validaciones débiles y distribuidas en múltiples funciones.

### Solución Implementable

```javascript
// js/modules/validadores.js
export class ValidadorDatos {
    // Validar empleado
    static validarEmpleado(empleado) {
        const errores = [];
        
        // Nombre
        if (!empleado.nombre || empleado.nombre.trim().length < 3) {
            errores.push('Nombre debe tener al menos 3 caracteres');
        }
        if (empleado.nombre.length > 100) {
            errores.push('Nombre no puede exceder 100 caracteres');
        }
        
        // Email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (empleado.email && !emailRegex.test(empleado.email)) {
            errores.push('Email inválido');
        }
        
        // Teléfono
        const telefono = empleado.telefono.replace(/\D/g, '');
        if (telefono.length < 9) {
            errores.push('Teléfono debe tener al menos 9 dígitos');
        }
        
        // Horas
        if (empleado.horasContrato < 80 || empleado.horasContrato > 240) {
            errores.push('Horas de contrato deben estar entre 80 y 240');
        }
        
        // DNI si existe
        if (empleado.dni && !this.validarDNI(empleado.dni)) {
            errores.push('DNI inválido');
        }
        
        return {
            valido: errores.length === 0,
            errores
        };
    }
    
    // Validar DNI español
    static validarDNI(dni) {
        const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!regex.test(dni)) return false;
        
        const numero = dni.slice(0, -1);
        const letra = dni.slice(-1).toUpperCase();
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letraCorrecta = letras[numero % 23];
        
        return letra === letraCorrecta;
    }
    
    // Validar turno
    static validarTurno(turno, empleadoId, dia, mes, anio) {
        const errores = [];
        
        // Tipo de turno válido
        if (!tiposTurno[turno]) {
            errores.push(`Tipo de turno inválido: ${turno}`);
        }
        
        // Día válido
        if (dia < 1 || dia > 31) {
            errores.push('Día inválido');
        }
        
        // Obtener empleado
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) {
            errores.push('Empleado no encontrado');
            return { valido: false, errores };
        }
        
        // Validar restricciones
        const restricciones = this.validarRestriccionesTurno(
            empleadoId, dia, turno, mes, anio
        );
        if (!restricciones.valido) {
            errores.push(...restricciones.errores);
        }
        
        return {
            valido: errores.length === 0,
            errores
        };
    }
    
    // Validar restricciones de turnos
    static validarRestriccionesTurno(empleadoId, dia, turno, mes, anio) {
        const errores = [];
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        
        if (turno === 'noche' || turno === 'mixto') {
            // Máx 12 noches por mes
            const noctesEstesMes = turnos.filter(t => 
                (t.turno === 'noche' || t.turno === 'mixto') && 
                t.mes === mes && t.anio === anio
            ).length;
            
            if (noctesEstesMes >= 12) {
                errores.push('Máximo 12 turnos nocturnos por mes alcanzado');
            }
        }
        
        // No permitir 3+ nocturnos seguidos
        if (turno === 'noche') {
            const noctesConsecutivas = this.contarNoctesConsecutivas(turnos, dia);
            if (noctesConsecutivas >= 2) {
                errores.push('No se permiten más de 2 noches consecutivas');
            }
        }
        
        // No permitir cambiar a baja sin causa
        if (turno === 'baja') {
            if (!AppState.cambiosPendientes.some(c => 
                c.empleadoId === empleadoId && c.motivo === 'baja_medica'
            )) {
                errores.push('Solo administrador puede asignar bajas');
            }
        }
        
        return {
            valido: errores.length === 0,
            errores
        };
    }
    
    static contarNoctesConsecutivas(turnos, dia) {
        let count = 0;
        for (let d = dia; d >= 1; d--) {
            const turno = turnos.find(t => t.dia === d);
            if (turno?.turno === 'noche') {
                count++;
            } else {
                break;
            }
        }
        return count;
    }
}

// Uso:
const validation = ValidadorDatos.validarEmpleado(nuevoEmpleado);
if (!validation.valido) {
    NotificationSystem.show(validation.errores[0], 'error');
    return;
}
```

---

## 4. EVENT BUS - PATRÓN DE COMUNICACIÓN

### Problema Actual
No hay patrón centralizado de comunicación entre componentes.

### Solución Implementable

```javascript
// js/modules/event-bus.js
export class EventBus {
    static #subscriptions = new Map();
    
    static subscribe(eventName, callback, context = null) {
        if (!this.#subscriptions.has(eventName)) {
            this.#subscriptions.set(eventName, []);
        }
        
        const subscription = {
            callback,
            context,
            unsubscribe() {
                const handlers = EventBus.#subscriptions.get(eventName);
                const index = handlers.indexOf(this);
                if (index > -1) handlers.splice(index, 1);
            }
        };
        
        this.#subscriptions.get(eventName).push(subscription);
        return subscription.unsubscribe.bind(subscription);
    }
    
    static publish(eventName, data = null) {
        const handlers = this.#subscriptions.get(eventName) || [];
        handlers.forEach(sub => {
            try {
                sub.callback.call(sub.context, data);
            } catch (e) {
                console.error(`Error en evento ${eventName}:`, e);
            }
        });
    }
    
    static clear(eventName) {
        if (eventName) {
            this.#subscriptions.delete(eventName);
        } else {
            this.#subscriptions.clear();
        }
    }
}

// Definir eventos globales
export const EVENTOS = {
    // Empleados
    EMPLEADO_CREADO: 'empleado:creado',
    EMPLEADO_ACTUALIZADO: 'empleado:actualizado',
    EMPLEADO_ELIMINADO: 'empleado:eliminado',
    
    // Turnos
    TURNO_CAMBIADO: 'turno:cambiado',
    TURNOS_APLICADOS: 'turnos:aplicados',
    
    // Mes
    MES_CAMBIADO: 'mes:cambiado',
    
    // UI
    CUADRANTE_ACTUALIZAR: 'ui:cuadrante-actualizar',
    MODAL_CERRAR: 'ui:modal-cerrar',
    
    // Estado
    CAMBIOS_PENDIENTES: 'estado:cambios-pendientes',
    GUARDADO_COMPLETADO: 'estado:guardado',
};

// Uso en módulos:
// ============================================

// En TurnoEditor.guardarDescripcion():
static guardarDescripcion(empleadoId, dia, nuevoTurno) {
    const validacion = ValidadorDatos.validarTurno(
        nuevoTurno, empleadoId, dia, AppState.currentMonth, AppState.currentYear
    );
    
    if (!validacion.valido) {
        NotificationSystem.show(validacion.errores[0], 'error');
        return;
    }
    
    // Actualizar estado
    const turnosEmpleado = AppState.scheduleData.get(empleadoId) || [];
    const turnoObj = turnosEmpleado.find(t => t.dia === dia);
    if (turnoObj) {
        turnoObj.turno = nuevoTurno;
        turnoObj.horas = tiposTurno[nuevoTurno].horas;
    }
    
    // Publicar evento
    EventBus.publish(EVENTOS.TURNO_CAMBIADO, {
        empleadoId,
        dia,
        turno: nuevoTurno
    });
    
    // Guardar
    AppState.saveToStorage();
    
    // Cerrar modal
    document.getElementById('modalEdicionTurno').classList.remove('active');
}

// En UI.generarCuadranteGeneral():
// Suscribirse a cambios
EventBus.subscribe(EVENTOS.TURNO_CAMBIADO, function(data) {
    if (data.empleadoId === this.empleadoActual) {
        this.actualizarFilaEmpleado(data.empleadoId);
    }
}, { empleadoActual: 1, actualizarFilaEmpleado: UI.actualizarFilaEmpleado });
```

---

## 5. REFACTORIZAR AppState CON MÉTODOS SEGUROS

### Problema Actual
Cualquier código puede modificar `AppState.scheduleData` directamente sin validación.

### Solución Implementable

```javascript
// js/modules/app-state-v2.js
export class AppState {
    // === PROPIEDADES PRIVADAS ===
    static #scheduleData = new Map();
    static #cambiosPendientes = [];
    static #auditLog = [];
    static #currentYear = new Date().getFullYear();
    static #currentMonth = new Date().getMonth();
    static #selectedEmployee = null;
    static #userRole = 'admin'; // 'admin' | 'supervisor' | 'empleado'
    
    // === GETTERS ===
    static get scheduleData() {
        return this.#scheduleData;
    }
    
    static get cambiosPendientes() {
        return [...this.#cambiosPendientes]; // Copia para no modificar
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
    
    static get userRole() {
        return this.#userRole;
    }
    
    // === MÉTODOS PÚBLICOS ===
    
    static setMes(month, year) {
        if (month < 0 || month > 11) throw new Error('Mes inválido');
        if (year < 2000 || year > 2100) throw new Error('Año inválido');
        
        this.#currentMonth = month;
        this.#currentYear = year;
        EventBus.publish(EVENTOS.MES_CAMBIADO, { month, year });
        this.saveToStorage();
    }
    
    static setTurno(empleadoId, dia, turno, horas) {
        // Validar
        const validacion = ValidadorDatos.validarTurno(turno, empleadoId, dia);
        if (!validacion.valido) {
            throw new Error(validacion.errores[0]);
        }
        
        // Obtener turnos del empleado
        if (!this.#scheduleData.has(empleadoId)) {
            throw new Error('Empleado no encontrado');
        }
        
        const turnos = this.#scheduleData.get(empleadoId);
        const existente = turnos.find(t => t.dia === dia);
        
        if (!existente) {
            throw new Error(`Turno del día ${dia} no encontrado`);
        }
        
        // Registrar cambio en auditoría
        this.#registrarAuditoria('TURNO_MODIFICADO', {
            empleadoId,
            dia,
            turnoAnterior: existente.turno,
            turnoNuevo: turno
        });
        
        // Modificar
        existente.turno = turno;
        existente.horas = horas || tiposTurno[turno].horas;
        existente.ultimaModificacion = new Date().toISOString();
        
        // Agregar a cambios pendientes
        this.#cambiosPendientes.push({
            tipo: 'turno_modificado',
            empleadoId,
            dia,
            turnoNuevo: turno,
            timestamp: new Date().toISOString()
        });
        
        // Publicar evento
        EventBus.publish(EVENTOS.TURNO_CAMBIADO, {
            empleadoId,
            dia,
            turno
        });
        
        // Guardar automáticamente
        this.saveToStorage();
    }
    
    static eliminarEmpleado(empleadoId) {
        if (this.#userRole !== 'admin') {
            throw new Error('No tienes permisos para eliminar empleados');
        }
        
        // Registrar auditoría
        const empleado = empleados.find(e => e.id === empleadoId);
        this.#registrarAuditoria('EMPLEADO_ELIMINADO', {
            empleadoId,
            empleadoNombre: empleado?.nombre
        });
        
        // Eliminar turnos
        this.#scheduleData.delete(empleadoId);
        
        // Eliminar cambios pendientes del empleado
        this.#cambiosPendientes = this.#cambiosPendientes.filter(
            c => c.empleadoId !== empleadoId
        );
        
        // Publicar evento
        EventBus.publish(EVENTOS.EMPLEADO_ELIMINADO, { empleadoId });
        
        this.saveToStorage();
    }
    
    static aplicarCambiosPendientes() {
        if (this.#cambiosPendientes.length === 0) {
            return;
        }
        
        console.log(`📋 Aplicando ${this.#cambiosPendientes.length} cambios...`);
        
        // Ya están aplicados en scheduleData, solo limpiar
        const cantidadAplicada = this.#cambiosPendientes.length;
        this.#cambiosPendientes = [];
        
        // Registrar en auditoría
        this.#registrarAuditoria('CAMBIOS_APLICADOS', {
            cantidad: cantidadAplicada,
            timestamp: new Date().toISOString()
        });
        
        EventBus.publish(EVENTOS.GUARDADO_COMPLETADO, {
            cambios: cantidadAplicada
        });
        
        this.saveToStorage();
    }
    
    static saveToStorage() {
        try {
            const data = {
                currentYear: this.#currentYear,
                currentMonth: this.#currentMonth,
                scheduleData: Array.from(this.#scheduleData.entries()),
                cambiosPendientes: this.#cambiosPendientes,
                auditLog: this.#auditLog.slice(-1000), // Mantener últimos 1000 registros
                version: 2
            };
            
            localStorage.setItem('turnosAppState', JSON.stringify(data));
            console.log('✅ Estado guardado en localStorage');
        } catch (e) {
            console.error('❌ Error guardando estado:', e);
            if (e.name === 'QuotaExceededError') {
                this.#limpiarAuditLog();
                this.saveToStorage(); // Reintentar
            }
        }
    }
    
    static loadFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('turnosAppState') || '{}');
            
            if (data.version !== 2) {
                console.warn('Formato de almacenamiento anticuado, inicializando nuevamente');
                return;
            }
            
            this.#currentYear = data.currentYear;
            this.#currentMonth = data.currentMonth;
            this.#scheduleData = new Map(data.scheduleData || []);
            this.#cambiosPendientes = data.cambiosPendientes || [];
            this.#auditLog = data.auditLog || [];
            
            console.log('✅ Estado cargado desde localStorage');
        } catch (e) {
            console.error('❌ Error cargando estado:', e);
        }
    }
    
    // === MÉTODOS PRIVADOS ===
    
    static #registrarAuditoria(tipo, datos) {
        this.#auditLog.push({
            tipo,
            datos,
            usuario: this.#userRole,
            timestamp: new Date().toISOString()
        });
    }
    
    static #limpiarAuditLog() {
        this.#auditLog = this.#auditLog.slice(-500);
        console.log('🧹 Audit log limpiado');
    }
}
```

---

## 6. PROBLEMA: CÁLCULO DE HORAS DINÁMICO

### Solución Implementable

```javascript
// js/modules/turno-manager-v2.js
export class TurnoManager {
    
    static generarTurnosEmpleado(empleado, mes, anio) {
        const nuevos = [];
        const diasMes = new Date(anio, mes + 1, 0).getDate();
        
        // Patrones configurables por tipo de contrato
        const patrones = {
            'tiempo_completo': [5, 2],   // 5 trabajo, 2 descanso
            'jornada_parcial': [3, 2],
            'turnos_rotativos': [7, 3]
        };
        
        const patron = patrones[empleado.tipoContrato] || [5, 2];
        const [diasTrabajo, diasDescanso] = patron;
        
        let posicionPatron = 0;
        const tiposRotacion = ['mañana', 'tarde', 'noche'];
        let posicionTipo = 0;
        
        for (let dia = 1; dia <= diasMes; dia++) {
            const fecha = new Date(anio, mes, dia);
            const esFinSemana = fecha.getDay() === 0 || fecha.getDay() === 6;
            
            // Determinar si es descanso o trabajo
            const posEnPatron = posicionPatron % (diasTrabajo + diasDescanso);
            const esDescanso = posEnPatron >= diasTrabajo;
            
            let turno;
            if (esDescanso) {
                turno = 'descanso';
            } else if (esFinSemana && Math.random() > 0.7) {
                // 30% probabilidad de descanso en fin de semana
                turno = 'descanso';
            } else {
                // Rotar tipos de turno
                turno = tiposRotacion[posicionTipo % tiposRotacion.length];
                posicionTipo++;
            }
            
            // Obtener info del turno
            const infoTurno = tiposTurno[turno];
            
            nuevos.push({
                dia,
                turno,
                horas: infoTurno.horas,
                horario: infoTurno.horario,
                fecha: fecha.toISOString(),
                esFinSemana,
                ultimaModificacion: new Date().toISOString()
            });
            
            posicionPatron++;
        }
        
        return nuevos;
    }
    
    static calcularEstadisticas(empleadoId, mes, anio) {
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const turnosMes = turnos.filter(t => {
            const fecha = new Date(t.fecha);
            return fecha.getMonth() === mes && fecha.getFullYear() === anio;
        });
        
        const stats = {
            totalHoras: 0,
            mañanas: 0,
            tardes: 0,
            noches: 0,
            descansos: 0,
            vacaciones: 0,
            bajas: 0,
            horasProgramadas: 0,
            horasReales: 0,
            cumplimiento: 0
        };
        
        turnosMes.forEach(t => {
            stats.totalHoras += t.horas || 0;
            
            switch (t.turno) {
                case 'mañana': stats.mañanas++; break;
                case 'tarde': stats.tardes++; break;
                case 'noche': stats.noches++; break;
                case 'descanso': stats.descansos++; break;
                case 'vacaciones': stats.vacaciones++; break;
                case 'baja': stats.bajas++; break;
            }
        });
        
        // Calcular cumplimiento
        const horasContratadas = empleados.find(e => e.id === empleadoId)?.horasContrato || 0;
        stats.cumplimiento = horasContratadas > 0 
            ? Math.round((stats.totalHoras / horasContratadas) * 100)
            : 0;
        
        return stats;
    }
}
```

---

## 7. IMPLEMENTAR VIRTUALIZACIÓN DE TABLA

### Para tablas grandes (500+ empleados)

```javascript
// js/modules/virtual-table.js
export class VirtualTable {
    constructor(container, options = {}) {
        this.container = container;
        this.rowHeight = options.rowHeight || 35;
        this.bufferRows = options.bufferRows || 5;
        this.rows = [];
        this.renderFunc = options.renderRow || null;
    }
    
    init(rows, renderFunc) {
        this.rows = rows;
        this.renderFunc = renderFunc;
        this.container.addEventListener('scroll', () => this.onScroll());
        this.render();
    }
    
    onScroll() {
        this.render();
    }
    
    render() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;
        
        // Calcular primero y último índice visible
        const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.bufferRows);
        const endIdx = Math.min(
            this.rows.length,
            Math.ceil((scrollTop + containerHeight) / this.rowHeight) + this.bufferRows
        );
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Agregar espaciador superior
        const topSpacer = document.createElement('div');
        topSpacer.style.height = (startIdx * this.rowHeight) + 'px';
        this.container.appendChild(topSpacer);
        
        // Renderizar filas visibles
        for (let i = startIdx; i < endIdx; i++) {
            const row = this.rows[i];
            const rowElement = this.renderFunc(row, i);
            rowElement.style.height = this.rowHeight + 'px';
            this.container.appendChild(rowElement);
        }
        
        // Agregar espaciador inferior
        const bottomSpacer = document.createElement('div');
        bottomSpacer.style.height = ((this.rows.length - endIdx) * this.rowHeight) + 'px';
        this.container.appendChild(bottomSpacer);
    }
}

// Uso:
const tabla = new VirtualTable(document.getElementById('cuadranteGeneral'), {
    rowHeight: 40,
    bufferRows: 10
});

tabla.init(empleados, (empleado, index) => {
    const row = document.createElement('tr');
    row.dataset.empleadoId = empleado.id;
    row.innerHTML = `<td>${empleado.nombre}</td>...`;
    return row;
});
```

---

## 8. PRUEBAS UNITARIAS

```javascript
// tests/app-state.test.js
describe('AppState', () => {
    beforeEach(() => {
        AppState.loadFromStorage = () => {};
        AppState.saveToStorage = () => {};
    });
    
    it('Debe permitir setear turno válido', () => {
        const empleado = { id: 1, nombre: 'Juan', tipoContrato: 'tiempo_completo' };
        empleados.push(empleado);
        
        AppState.setTurno(1, 5, 'noche', 8);
        const turno = AppState.scheduleData.get(1)?.find(t => t.dia === 5);
        
        expect(turno.turno).toBe('noche');
        expect(turno.horas).toBe(8);
    });
    
    it('Debe rechazar más de 12 noches por mes', () => {
        // ... setup ...
        
        expect(() => {
            for (let i = 0; i < 13; i++) {
                AppState.setTurno(1, i + 1, 'noche', 8);
            }
        }).toThrow('Máximo 12 turnos nocturnos');
    });
    
    it('Debe registrar cambios en auditoría', () => {
        AppState.setTurno(1, 5, 'mañana', 8);
        
        const auditLog = AppState.auditLog;
        expect(auditLog.length).toBeGreaterThan(0);
        expect(auditLog[auditLog.length - 1].tipo).toBe('TURNO_MODIFICADO');
    });
});
```

---

## CONCLUSIÓN

Con estas implementaciones:
- ✅ Autoguardado cada 30 segundos
- ✅ Sincronización entre pestañas en tiempo real
- ✅ Validación centralizada y robusta
- ✅ Patrón Event Bus para comunicación limpia
- ✅ AppState seguro sin escrituras directas
- ✅ Auditoría completa de cambios
- ✅ Manejo correcto de horas
- ✅ Virtualización para grandes volúmenes

**Tiempo estimado para implementar completamente: 3-4 semanas**
