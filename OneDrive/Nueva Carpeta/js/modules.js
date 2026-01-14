// =============================================
// SISTEMA DE GESTIÓN DE TURNOS - MÓDULOS JS
// =============================================

// =============================================
// CONFIGURACIÓN Y CONSTANTES
// =============================================

/**
 * Configuración de departamentos
 * Cada departamento tiene:
 * - horasPorSemana: horas que trabaja en 6 días (1 día libra)
 * - descripccion: Descripción del departamento
 * - diasTrabajo: Días que trabaja por semana
 * - diasLibra: Días de descanso por semana
 */
const departamentosConfig = {
    'Limpieza': {
        horasPorSemana: 39,
        diasTrabajo: 6,
        diasLibra: 1,
        descripcion: 'Limpieza - 39h/semana (6 días × 6.5h)',
        horasPromedioDia: 6.5
    },
    'Administrativo': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diasLibra: 2,
        descripcion: 'Administrativo - 40h/semana (5 días × 8h)',
        horasPromedioDia: 8
    },
    'Operaciones': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diasLibra: 2,
        descripcion: 'Operaciones - 40h/semana (5 días × 8h)',
        horasPromedioDia: 8
    }
};

/**
 * Calcular horas de contrato basado en departamento
 * Usa promedio mensual estándar (52 semanas / 12 meses)
 */
function calcularHorasContratoPorDepartamento(departamento, mes, anio) {
    const config = departamentosConfig[departamento];
    if (!config) return 160; // Fallback
    
    // Promedio mensual: (horas/semana * 52 semanas) / 12 meses
    const horasMensuales = Math.round((config.horasPorSemana * 52 / 12) * 10) / 10;
    
    console.log(`[CalculadorHoras] Departamento: ${departamento} | ${config.horasPorSemana}h/semana → ${horasMensuales}h/mes`);
    
    return horasMensuales;
}

const tiposTurno = {
    mañana: { id: 1, nombre: "Mañana", inicial: "M", horario: "08:00-16:00", color: "#d4edda", horas: 8 },
    tarde: { id: 2, nombre: "Tarde", inicial: "T", horario: "14:30-21:00", color: "#fff3cd", horas: 6.5 },
    noche: { id: 3, nombre: "Noche", inicial: "N", horario: "00:00-08:00", color: "#f8d7da", horas: 8 },
    guardia: { id: 4, nombre: "Guardia", inicial: "GD", horario: "12:00-08:00", color: "#d8b4fe", horas: 20 },
    mixto: { id: 5, nombre: "Mixto", inicial: "X", horario: "Variable", color: "#cce5ff", horas: 6 },
    asuntospropios: { id: 6, nombre: "Asuntos propios", inicial: "AP", horario: "Variable", color: "#e0e7ff", horas: 8 },
    descanso: { id: 7, nombre: "Descanso", inicial: "D", horario: "-", color: "#e2e3e5", horas: 0 },
    vacaciones: { id: 8, nombre: "Vacaciones", inicial: "V", horario: "-", color: "#d0ebff", horas: 0 },
    baja: { id: 9, nombre: "Baja médica", inicial: "B", horario: "-", color: "#ffe3e3", horas: 0 },
    festivo: { id: 10, nombre: "Festivo", inicial: "F", horario: "-", color: "#f8d7da", horas: 0 },
    libre: { id: 11, nombre: "Libre", inicial: "L", horario: "-", color: "#e2e3e5", horas: 0 }
};

var empleados = [
    {
        id: 1,
        nombre: "María Rodríguez López",
        departamento: "Operaciones",
        localidad: "Madrid",
        horasContrato: 160,
        turnoPrincipal: "Mañana",
        estado: "activo",
        email: "maria.rodriguez@empresa.com",
        telefono: "+34 600 111 222"
    },
    {
        id: 2,
        nombre: "Carlos Martínez Gutiérrez",
        departamento: "Ventas",
        localidad: "Barcelona",
        horasContrato: 140,
        turnoPrincipal: "Tarde",
        estado: "activo",
        email: "carlos.martinez@empresa.com",
        telefono: "+34 600 222 333"
    },
    {
        id: 3,
        nombre: "Ana García Pérez",
        departamento: "Administración",
        localidad: "Valencia",
        horasContrato: 120,
        turnoPrincipal: "Mañana",
        estado: "vacaciones",
        email: "ana.garcia@empresa.com",
        telefono: "+34 600 333 444"
    },
    {
        id: 4,
        nombre: "Javier Sánchez Ruiz",
        departamento: "Soporte Técnico",
        localidad: "Madrid",
        horasContrato: 180,
        turnoPrincipal: "Noche",
        estado: "activo",
        email: "javier.sanchez@empresa.com",
        telefono: "+34 600 444 555"
    },
    {
        id: 5,
        nombre: "Laura Fernández Díaz",
        departamento: "Operaciones",
        localidad: "Bilbao",
        horasContrato: 160,
        turnoPrincipal: "Mañana",
        estado: "baja",
        email: "laura.fernandez@empresa.com",
        telefono: "+34 600 555 666"
    },
    {
        id: 6,
        nombre: "Pedro Gómez Martín",
        departamento: "Ventas",
        localidad: "Barcelona",
        horasContrato: 140,
        turnoPrincipal: "Tarde",
        estado: "activo",
        email: "pedro.gomez@empresa.com",
        telefono: "+34 600 666 777"
    },
    {
        id: 7,
        nombre: "Sofía López Martínez",
        departamento: "Administración",
        localidad: "Madrid",
        horasContrato: 120,
        turnoPrincipal: "Mañana",
        estado: "activo",
        email: "sofia.lopez@empresa.com",
        telefono: "+34 600 777 888"
    },
    {
        id: 8,
        nombre: "Antony García Rodríguez",
        departamento: "Operaciones",
        localidad: "Getafe",
        horasContrato: 160,
        turnoPrincipal: "Mañana",
        estado: "activo",
        email: "antony.garcia@empresa.com",
        telefono: "+34 600 888 999"
      },
      {
          id: 9,
          nombre: "Miguel Ángel Ruiz",
          departamento: "Administración",
          localidad: "Madrid",
          horasContrato: 160,
          turnoPrincipal: "Mañana",
          estado: "activo",
          email: "miguel.ruiz@empresa.com",
          telefono: "+34 600 999 000"
      },
      {
          id: 10,
          nombre: "Elena Beltrán Ocaña",
          departamento: "Operaciones",
          localidad: "Madrid",
          horasContrato: 160,
          turnoPrincipal: "Tarde",
          estado: "activo",
          email: "elena.beltran@empresa.com",
          telefono: "+34 600 000 111"
      },
      {
          id: 11,
          nombre: "Ricardo Torres Gil",
          departamento: "Ventas",
          localidad: "Barcelona",
          horasContrato: 140,
          turnoPrincipal: "Mañana",
          estado: "activo",
          email: "ricardo.torres@empresa.com",
          telefono: "+34 600 111 222"
      },
      {
          id: 12,
          nombre: "Isabel Castro León",
          departamento: "Limpieza",
          localidad: "Madrid",
          horasContrato: 169,
          turnoPrincipal: "Mañana",
          estado: "activo",
          email: "isabel.castro@empresa.com",
          telefono: "+34 600 222 333"
      }
  ];

  // =============================================
  // ESTADO GLOBAL
  // =============================================

  class AppState {
      static currentYear = 2026;
      static currentMonth = 0; // Enero
      static cambiosPendientes = [];
      static rangoSeleccionado = null;
      static userRole = 'admin'; // admin | supervisor | empleado
      
      static scheduleData = new Map();
      static selectedEmployee = null;
      static filters = {
          departamento: 'todos',
          localidad: 'todas',
          busqueda: ''
      };

    static saveToStorage() {
        try {
            // 💾 GUARDAR ESTADO GLOBAL + DATOS POR MES
            // La clave aquí es que TODOS los meses se guardan juntos
            const currentData = {
                year: this.currentYear,
                month: this.currentMonth,
                filters: this.filters,
                selectedEmployeeId: this.selectedEmployee?.id || null,
                // IMPORTANTE: scheduleData es un Map con todos los turnos de todos los meses
                // Cada turno tiene una fecha que indica a qué mes pertenece
                scheduleData: Array.from(this.scheduleData.entries()),
                userRole: this.userRole,
                empleados: window.empleados || [],
                timestamp: new Date().toISOString()
            };
            
            const dataJSON = JSON.stringify(currentData);
            
            // Guardar en localStorage (persistencia permanente)
            localStorage.setItem('turnosAppState', dataJSON);
            
            // Guardar también en sessionStorage como respaldo (persistencia de sesión)
            sessionStorage.setItem('turnosAppStateBackup', dataJSON);
            
            console.log('💾 [LocalDB] Guardado exitoso (localStorage + sessionStorage)');
            
            // Mostrar un pequeño indicador visual en la UI
            const indicator = document.getElementById('save-indicator');
            if (indicator) {
                indicator.classList.add('visible');
                setTimeout(() => indicator.classList.remove('visible'), 2000);
            }
        } catch (error) {
            console.error('❌ Error en el guardado local:', error);
        }
    }

    static async loadFromStorage() {
        try {
            console.log(`🔄 [LocalDB] Cargando datos del navegador...`);
            
            // Intentar cargar desde localStorage primero
            let saved = localStorage.getItem('turnosAppState');
            
            // Si no hay datos en localStorage, intentar recuperar del respaldo en sessionStorage
            if (!saved) {
                console.log('ℹ️ No hay datos en localStorage, intentando sessionStorage...');
                saved = sessionStorage.getItem('turnosAppStateBackup');
                
                if (saved) {
                    console.log('✅ Datos recuperados desde respaldo de sesión');
                    // Restaurar a localStorage para persistencia futura
                    localStorage.setItem('turnosAppState', saved);
                }
            }
            
            if (!saved) {
                console.log('ℹ️ No hay datos previos. Usando configuración por defecto (12 empleados).');
                // Intentar cargar empleados del localStorage como fallback
                const empleadosGuardados = localStorage.getItem('empleadosData');
                if (empleadosGuardados) {
                    window.empleados = JSON.parse(empleadosGuardados);
                    console.log(`👥 Cargados ${window.empleados.length} empleados desde empleadosData`);
                }
                return false;
            }

            const data = JSON.parse(saved);
            
            // Restaurar configuración básica
            this.currentYear = data.year || 2026;
            this.currentMonth = data.month || 0;
            this.filters = data.filters || this.filters;
            this.userRole = data.userRole || 'admin';

            // Restaurar Empleados - Primero intenta desde el saved state, luego desde localStorage
            if (data.empleados && data.empleados.length > 0) {
                window.empleados = data.empleados;
                console.log(`👥 Restaurados ${window.empleados.length} empleados desde turnosAppState.`);
            } else {
                // Fallback: cargar desde empleadosData si no están en turnosAppState
                const empleadosGuardados = localStorage.getItem('empleadosData');
                if (empleadosGuardados) {
                    window.empleados = JSON.parse(empleadosGuardados);
                    console.log(`👥 Cargados ${window.empleados.length} empleados desde empleadosData (fallback).`);
                }
            }

            // ⭐ RESTAURAR TODOS LOS DATOS DE TODOS LOS MESES (NO SOLO EL MES ACTUAL)
            // Esto es crítico: si cargamos solo el mes actual, perdemos los otros meses
            if (data.scheduleData && Array.isArray(data.scheduleData)) {
                this.scheduleData.clear();
                
                // Restaurar TODOS los turnos (de todos los meses)
                data.scheduleData.forEach(([empId, turnos]) => {
                    const turnosProcesados = turnos.map(t => ({
                        ...t, 
                        fecha: t.fecha ? new Date(t.fecha) : null
                    }));
                    this.scheduleData.set(parseInt(empId), turnosProcesados);
                });
                
                console.log(`📅 Cuadrante de TODOS LOS MESES cargado (${this.scheduleData.size} empleados con datos)`);
            }

            if (data.selectedEmployeeId) {
                this.selectedEmployee = window.empleados.find(e => e.id === data.selectedEmployeeId);
            }

            return true;
        } catch (e) {
            console.error('❌ Error cargando base de datos local:', e);
            return false;
        }
    }

    static setEmployee(employee) {
        this.selectedEmployee = employee;
        this.saveToStorage();
    }

    static setMonth(month) {
        this.currentMonth = month;
        this.saveToStorage();
    }

    static setYear(year) {
        this.currentYear = year;
        this.saveToStorage();
    }

    static setFilters(filters) {
        this.filters = { ...this.filters, ...filters };
        this.saveToStorage();
    }

    static agregarCambio(empleadoId, dia, nuevoTurno) {
        this.cambiosPendientes.push({
            empleadoId,
            dia,
            nuevoTurno,
            timestamp: new Date().toISOString(),
            usuarioId: this.userRole
        });
    }

    static limpiarCambios() {
        this.cambiosPendientes = [];
    }

    static aplicarCambiosPendientes() {
        const cambiosAplicados = [];
        
        this.cambiosPendientes.forEach(cambio => {
            const turnos = this.scheduleData.get(cambio.empleadoId);
            if (turnos && turnos[cambio.dia - 1]) {
                const turnoAnterior = turnos[cambio.dia - 1].turno;
                turnos[cambio.dia - 1].turno = cambio.nuevoTurno;
                turnos[cambio.dia - 1].horas = tiposTurno[cambio.nuevoTurno]?.horas || 0;
                
                cambiosAplicados.push({
                    empleadoId: cambio.empleadoId,
                    dia: cambio.dia,
                    turnoAnterior,
                    turnoNuevo: cambio.nuevoTurno
                });
            }
        });
        
        this.limpiarCambios();
        this.saveToStorage();
        
        // 🔥 NOTIFICAR CAMBIOS EN LOTE - Sincroniza todas las vistas
        if (cambiosAplicados.length > 0) {
            console.log('[aplicarCambiosPendientes] Notificando', cambiosAplicados.length, 'cambios');
            DataChangeManager.notifyBulkChange(cambiosAplicados);
        }
    }

    static canEditShifts() {
        return this.userRole === 'admin' || this.userRole === 'supervisor';
    }

    static canDeleteEmployees() {
        return this.userRole === 'admin';
    }

    static canViewReports() {
        return this.userRole === 'admin' || this.userRole === 'supervisor';
    }
}

// =============================================
// GESTOR CENTRAL DE CAMBIOS DE DATOS
// =============================================
// Este sistema centraliza TODOS los cambios de datos y notifica a los observadores
// Garantiza que las vistas siempre estén sincronizadas con los datos

class DataChangeManager {
    static observers = [];
    
    // Registrar un observador que se notificará cuando cambien los datos
    static subscribe(callback) {
        if (typeof callback === 'function') {
            this.observers.push(callback);
            console.log('[DataChangeManager] Observador registrado. Total:', this.observers.length);
        }
    }
    
    // Desuscribir un observador
    static unsubscribe(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }
    
    // Notificar a todos los observadores sobre cambios
    static notifyChange(changeType, data = {}) {
        console.log('[DataChangeManager] 📢 Notificando cambio:', { changeType, empleadoId: data.empleadoId });
        
        this.observers.forEach(callback => {
            try {
                callback({
                    type: changeType,
                    timestamp: new Date(),
                    data: data
                });
            } catch (error) {
                console.error('[DataChangeManager] Error en observador:', error);
            }
        });
    }
    
    // Notificar cambio de turno específico
    static notifyShiftChange(empleadoId, dia, turnoAnterior, turnoNuevo) {
        this.notifyChange('SHIFT_CHANGED', {
            empleadoId,
            dia,
            turnoAnterior,
            turnoNuevo,
            timestamp: new Date().toISOString()
        });
    }
    
    // Notificar cambio de empleado
    static notifyEmployeeChange(empleadoId) {
        this.notifyChange('EMPLOYEE_CHANGED', { empleadoId });
    }
    
    // Notificar cambios en lote (múltiples cambios)
    static notifyBulkChange(cambios) {
        this.notifyChange('BULK_CHANGES', { count: cambios.length, cambios });
    }
    
    // Notificar cambio de mes
    static notifyMonthChange() {
        this.notifyChange('MONTH_CHANGED', {
            mes: AppState.currentMonth,
            año: AppState.currentYear
        });
    }
}

// =============================================
// SISTEMA DE NOTIFICACIONES
// =============================================

class NotificationSystem {
    static reproducirSonido(tipo) {
        // No reproducir si está desactivado
        if (!this.sonidosActivados) return;
        
        // No reproducir si no hay soporte
        if (typeof window.AudioContext === 'undefined' && typeof window.webkitAudioContext === 'undefined') return;
        
        try {
            // Obtener o crear AudioContext
            let audioContext = window.__appAudioContext;
            
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                window.__appAudioContext = audioContext;
            }
            
            // Si está suspendido, no reproducir (será reanudado en el primer user gesture)
            if (audioContext.state === 'suspended') {
                return;
            }
            
            const oscilador = audioContext.createOscillator();
            const ganancia = audioContext.createGain();
            
            oscilador.connect(ganancia);
            ganancia.connect(audioContext.destination);
            
            const frecuencias = {
                'success': 600,
                'error': 300,
                'warning': 450,
                'info': 500
            };
            
            oscilador.frequency.value = frecuencias[tipo] || 500;
            ganancia.gain.setValueAtTime(0.3, audioContext.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscilador.start(audioContext.currentTime);
            oscilador.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Silenciar errores de audio - no es crítico
        }
    }

    static show(mensaje, tipo = 'info', duracion = 3000, opciones = {}) {
        console.log(`[Notificación ${tipo}] ${mensaje}`);
        
        const posicion = opciones.posicion || this.posicion;
        let container = document.getElementById(`notificationContainer-${posicion}`);
        if (!container) {
            container = document.createElement('div');
            container.id = `notificationContainer-${posicion}`;
            container.style.cssText = `
                position: fixed;
                z-index: 9999;
                max-width: 450px;
                pointer-events: none;
                ${this.getEstilosPosicion(posicion)}
            `;
            document.body.appendChild(container);
        }
        
        const colores = {
            'success': '#22c55e',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#f97316'
        };
        
        const iconos = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        
        const grupoKey = `${tipo}-${mensaje.substring(0, 30)}`;
        let notificacionExistente = this.grupos.get(grupoKey);
        
        if (notificacionExistente && opciones.agrupar !== false) {
            const contador = notificacionExistente.querySelector('.notif-contador');
            if (contador) {
                let count = parseInt(contador.textContent) + 1;
                contador.textContent = count;
            }
            clearTimeout(notificacionExistente.timerID);
            if (duracion > 0) {
                notificacionExistente.timerID = setTimeout(() => this.cerrarNotificacion(notificacionExistente, opciones), duracion);
            }
            return;
        }
        
        const notifID = this.contadorID++;
        const timestampNotif = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        this.historial.unshift({
            id: notifID,
            mensaje,
            tipo,
            timestamp: timestampNotif,
            grupo: grupoKey
        });
        if (this.historial.length > this.maxHistorial) {
            this.historial.pop();
        }
        
        this.reproducirSonido(tipo);
        
        const notificacion = document.createElement('div');
        notificacion.id = `notif-${notifID}`;
        notificacion.className = `notificacion ${tipo}`;
        notificacion.style.cssText = `
            background: ${colores[tipo] || colores.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 10px;
            position: relative;
        `;
        
        const contenido = document.createElement('div');
        contenido.style.cssText = 'flex: 1;';
        
        const textoMain = document.createElement('div');
        textoMain.style.cssText = 'display: flex; align-items: center; gap: 8px; font-weight: 500;';
        textoMain.innerHTML = `<span>${iconos[tipo]}</span><span>${mensaje}</span>`;
        contenido.appendChild(textoMain);
        
        if (duracion > 0) {
            const barraProgreso = document.createElement('div');
            barraProgreso.style.cssText = `
                height: 2px;
                background: rgba(255,255,255,0.3);
                border-radius: 1px;
                margin-top: 8px;
                overflow: hidden;
            `;
            const llenoProgreso = document.createElement('div');
            llenoProgreso.style.cssText = `
                height: 100%;
                background: rgba(255,255,255,0.8);
                animation: progress ${duracion}ms linear forwards;
            `;
            barraProgreso.appendChild(llenoProgreso);
            contenido.appendChild(barraProgreso);
        }
        
        notificacion.appendChild(contenido);
        
        const acciones = opciones.acciones || this.accionesDefault[tipo] || ['cerrar'];
        if (acciones.length > 0) {
            const grupoAcciones = document.createElement('div');
            grupoAcciones.style.cssText = 'display: flex; gap: 5px; margin-left: 10px; flex-shrink: 0;';
            
            acciones.forEach(accion => {
                const btn = document.createElement('button');
                btn.style.cssText = `
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.4);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s ease;
                `;
                btn.onmouseover = () => btn.style.background = 'rgba(255,255,255,0.3)';
                btn.onmouseout = () => btn.style.background = 'rgba(255,255,255,0.2)';
                
                const etiquetasAcciones = {
                    'cerrar': '✕',
                    'reintentar': '🔄',
                    'aceptar': '✓',
                    'ver': '👁️'
                };
                
                btn.textContent = etiquetasAcciones[accion] || accion;
                btn.title = accion;
                
                btn.onclick = (e) => {
                    e.stopPropagation();
                    if (opciones.callback && typeof opciones.callback === 'function') {
                        opciones.callback(accion, notificacion);
                    }
                    if (accion === 'cerrar') {
                        this.cerrarNotificacion(notificacion, opciones);
                    }
                };
                
                grupoAcciones.appendChild(btn);
            });
            
            notificacion.appendChild(grupoAcciones);
        }
        
        if (opciones.agrupar !== false) {
            const contadorSpan = document.createElement('span');
            contadorSpan.className = 'notif-contador';
            contadorSpan.style.cssText = `
                background: rgba(0,0,0,0.3);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                margin-left: 5px;
            `;
            contadorSpan.textContent = '1';
            textoMain.appendChild(contadorSpan);
        }
        
        container.appendChild(notificacion);
        this.grupos.set(grupoKey, notificacion);
        
        if (duracion > 0) {
            notificacion.timerID = setTimeout(() => {
                this.cerrarNotificacion(notificacion, opciones);
            }, duracion);
        }
    }

    static cerrarNotificacion(notificacion, opciones) {
        notificacion.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (opciones && opciones.callback && typeof opciones.callback === 'function') {
                opciones.callback('cerrar', notificacion);
            }
            notificacion.remove();
            for (let [key, notif] of this.grupos) {
                if (notif === notificacion) {
                    this.grupos.delete(key);
                    break;
                }
            }
        }, 300);
    }

    static mostrarHistorial() {
        console.table(this.historial);
        return this.historial;
    }

    static limpiarHistorial() {
        this.historial = [];
        console.log('✅ Historial limpiado');
    }

    static activarSonidos() {
        this.sonidosActivados = true;
        console.log('🔊 Sonidos activados');
    }

    static desactivarSonidos() {
        this.sonidosActivados = false;
        console.log('🔇 Sonidos desactivados');
    }

    static cambiarPosicion(pos) {
        this.posicion = pos;
        console.log(`🎯 Posición cambiada a: ${pos}`);
    }

    static getEstilosPosicion(posicion) {
        const estilos = {
            'top-right': 'top: 20px; right: 20px;',
            'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };
        return estilos[posicion] || estilos['top-right'];
    }

    static getIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || 'ℹ️';
    }

    static getBackgroundColor(type) {
        const colors = {
            'success': '#22c55e',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#a855f7'
        };
        return colors[type] || '#3498db';
    }
}

// Inicializar propiedades estáticas de NotificationSystem
NotificationSystem.historial = [];
NotificationSystem.maxHistorial = 50;
NotificationSystem.contadorID = 0;
NotificationSystem.grupos = new Map();
NotificationSystem.posicion = 'top-right';
NotificationSystem.sonidosActivados = true;
NotificationSystem.accionesDefault = {
    'success': ['cerrar'],
    'error': ['reintentar', 'cerrar'],
    'warning': ['aceptar', 'cerrar'],
    'info': ['cerrar']
};

// =============================================
// UTILIDADES DE FECHA
// =============================================

class DateUtils {
    static getNombreMes(mesIndex) {
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return meses[mesIndex];
    }

    static getDiasEnMes(año, mes) {
        return new Date(año, mes + 1, 0).getDate();
    }

    static esDiaHabil(fecha) {
        const dia = fecha.getDay();
        return dia !== 0 && dia !== 6;
    }

    static formatearFecha(fecha) {
        return fecha.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static cambiarMes(direccion) {
        let mes = AppState.currentMonth + direccion;
        let año = AppState.currentYear;
        
        if (mes < 0) {
            mes = 11;
            año--;
        } else if (mes > 11) {
            mes = 0;
            año++;
        }
        
        // 🔴 CRÍTICO: Guardar TODOS los datos del mes actual ANTES de cambiar
        console.log(`[DateUtils.cambiarMes] 💾 Guardando datos del mes ${AppState.currentMonth}/${AppState.currentYear}...`);
        AppState.saveToStorage();
        
        AppState.setMonth(mes);
        AppState.setYear(año);
        
        document.getElementById('selectMonth').value = mes;
        document.getElementById('selectYear').value = año;
        
        TurnoManager.reiniciarDatos();
    }
}

// =============================================
// GESTOR DE COLORES
// =============================================

class ColorManager {
    static getColorTurno(turno) {
        return tiposTurno[turno]?.color || '#e2e3e5';
    }

    static getTextoColor(turno) {
        const coloresTexto = {
            'mañana': '#155724',
            'tarde': '#856404',
            'noche': '#721c24',
            'mixto': '#004085',
            'descanso': '#383d41',
            'vacaciones': '#1864ab',
            'baja': '#c92a2a',
            'festivo': '#721c24',
            'libre': '#383d41'
        };
        return coloresTexto[turno] || '#383d41';
    }

    static generarColorAvatar(nombre) {
        let hash = 0;
        for (let i = 0; i < nombre.length; i++) {
            hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const colores = [
            '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c',
            '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad'
        ];
        
        return colores[Math.abs(hash) % colores.length];
    }
}

// =============================================
// VALIDADOR DE TURNOS MEJORADO
// =============================================

class ValidadorTurnos {
    static validarEmpleado(empleado) {
        const errores = [];
        
        if (!empleado.nombre || empleado.nombre.trim().length < 3) {
            errores.push('Nombre inválido (mínimo 3 caracteres)');
        }
        
        if (!empleado.departamento) {
            errores.push('Departamento requerido');
        }
        
        if (empleado.horasContrato < 0 || empleado.horasContrato > 240) {
            errores.push('Horas de contrato inválidas (0-240)');
        }
        
        if (!empleado.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empleado.email)) {
            errores.push('Email inválido');
        }
        
        if (!empleado.telefono || empleado.telefono.length < 9) {
            errores.push('Teléfono inválido (mínimo 9 caracteres)');
        }
        
        return {
            valido: errores.length === 0,
            errores: errores
        };
    }

    static validarDistribucionTurnos(scheduleData, empleadoId, diasEnMes) {
        const turnos = scheduleData.get(empleadoId) || [];
        const validacion = {
            valido: true,
            advertencias: []
        };

        // Contar turnos nocturnos
        const turnosNoche = turnos.filter(t => t.turno === 'noche').length;
        if (turnosNoche > 10) {
            validacion.advertencias.push(`⚠️ Muchos turnos noche (${turnosNoche}). Máximo recomendado: 10`);
        }

        // Validar descansos consecutivos
        let descansoActual = 0;
        let descansoMinimo = 2;
        for (let i = 0; i < turnos.length; i++) {
            if (turnos[i].turno === 'descanso') {
                descansoActual++;
            } else {
                if (descansoActual > 0 && descansoActual < descansoMinimo && turnos[i].turno !== 'vacaciones' && turnos[i].turno !== 'baja') {
                    validacion.advertencias.push(`⚠️ Descansos no consecutivos detectados (${descansoActual} día(s))`);
                }
                descansoActual = 0;
            }
        }

        return validacion;
    }
}

// =============================================
// MANEJADOR DE EXPORTACIÓN MEJORADO
// =============================================

class ExportManager {
    static async generarPDFGeneral() {
        try {
            NotificationSystem.show('Generando PDF...', 'info');
            const elemento = document.getElementById('cuadranteGeneral');
            const canvas = await html2canvas(elemento, { scale: 2 });
            const pdf = new jsPDF('l', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
            pdf.save(`cuadrante_${DateUtils.getNombreMes(AppState.currentMonth)}_${AppState.currentYear}.pdf`);
            NotificationSystem.show('PDF generado correctamente', 'success');
        } catch (error) {
            console.error('Error generando PDF:', error);
            NotificationSystem.show('Error al generar PDF', 'error');
        }
    }

    static generarCSVIndividual(empleadoId) {
        try {
            const empleado = empleados.find(e => e.id === empleadoId);
            const turnos = AppState.scheduleData.get(empleadoId) || [];
            
            let csv = 'data:text/csv;charset=utf-8,';
            csv += `Empleado,${empleado.nombre}\n`;
            csv += `Departamento,${empleado.departamento}\n`;
            csv += `Mes,${DateUtils.getNombreMes(AppState.currentMonth)}\n`;
            csv += `Año,${AppState.currentYear}\n\n`;
            csv += `Día,Turno,Horas,Fecha\n`;
            
            turnos.forEach(turno => {
                const fecha = turno.fecha.toLocaleDateString('es-ES');
                csv += `${turno.dia},${TurnoManager.formatearTurnoCompleto(turno.turno)},${turno.horas},${fecha}\n`;
            });
            
            const enlace = document.createElement('a');
            enlace.href = encodeURI(csv);
            enlace.download = `cuadrante_${empleado.nombre}_${AppState.currentMonth + 1}.csv`;
            enlace.click();
            
            NotificationSystem.show('CSV descargado correctamente', 'success');
        } catch (error) {
            console.error('Error generando CSV:', error);
            NotificationSystem.show('Error al descargar CSV', 'error');
        }
    }

    static copiarWhatsAppText(empleadoId) {
        const empleado = empleados.find(e => e.id === empleadoId);
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        
        let mensaje = `📋 Cuadrante de turnos - ${empleado.nombre}\n`;
        mensaje += `${DateUtils.getNombreMes(AppState.currentMonth)} ${AppState.currentYear}\n\n`;
        
        turnos.slice(0, 15).forEach(turno => {
            const fecha = turno.fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
            const turnoFormato = TurnoManager.formatearTurno(turno.turno);
            mensaje += `${fecha}: ${turnoFormato} (${turno.horas}h)\n`;
        });
        
        navigator.clipboard.writeText(mensaje);
        NotificationSystem.show('Texto copiado al portapapeles', 'success');
    }

    static async generarCuadranteGeneralMensual() {
        try {
            NotificationSystem.show('Generando cuadrante mensual...', 'info');
            
            // Verificar disponibilidad de jsPDF
            if (!window.jspdf) {
                NotificationSystem.show('Librería jsPDF no disponible', 'error');
                return;
            }
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('l', 'mm', 'a4');
            
            // Crear HTML de la tabla como contenido
            const diasEnMes = DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth);
            const mes = DateUtils.getNombreMes(AppState.currentMonth);
            
            let html = `<h2>${mes} ${AppState.currentYear}</h2>`;
            html += '<table border="1" cellpadding="3">';
            html += '<thead><tr><th>Empleado</th><th>Depto</th>';
            
            for (let dia = 1; dia <= diasEnMes; dia++) {
                html += `<th>${dia}</th>`;
            }
            html += '<th>Total</th></tr></thead><tbody>';
            
            empleados.forEach(empleado => {
                const turnos = AppState.scheduleData.get(empleado.id) || [];
                let totalHoras = 0;
                
                html += `<tr><td>${empleado.nombre}</td><td>${empleado.departamento}</td>`;
                
                for (let dia = 1; dia <= diasEnMes; dia++) {
                    const turno = turnos[dia - 1] || {};
                    totalHoras += turno.horas || 0;
                    html += `<td>${turno.turno || '-'}</td>`;
                }
                
                html += `<td>${totalHoras}</td></tr>`;
            });
            
            html += '</tbody></table>';
            
            // Usar html2pdf si está disponible, si no, simplemente descargar como HTML
            if (window.html2pdf) {
                const element = document.createElement('div');
                element.innerHTML = html;
                window.html2pdf().set({
                    margin: 10,
                    filename: `cuadrante_${mes}_${AppState.currentYear}.pdf`,
                    image: { type: 'png', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { orientation: 'l', unit: 'mm', format: 'a4' }
                }).save();
            } else {
                // Fallback: descargar como archivo de texto/HTML
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cuadrante_${mes}_${AppState.currentYear}.html`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            NotificationSystem.show('Cuadrante generado correctamente', 'success');
        } catch (error) {
            console.error('Error generando PDF:', error);
            NotificationSystem.show('Error al generar PDF: ' + error.message, 'error');
        }
    }

    static async exportarCuadranteGeneral(formato) {
        if (formato === 'pdf') {
            await this.generarCuadranteGeneralMensual();
        } else if (formato === 'print') {
            const elemento = document.getElementById('cuadranteGeneral');
            if (elemento) {
                const ventana = window.open('', '_blank');
                ventana.document.write('<html><head><title>Cuadrante</title></head><body>');
                ventana.document.write(elemento.innerHTML);
                ventana.document.write('</body></html>');
                ventana.document.close();
                ventana.print();
            }
        }
    }

    static async generarInformeIndividual() {
        if (!AppState.selectedEmployee) {
            NotificationSystem.show('Por favor, selecciona un empleado primero', 'warning');
            return;
        }

        const empleado = AppState.selectedEmployee;
        const turnos = AppState.scheduleData.get(empleado.id) || [];
        const diasEnMes = DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth);
        const mes = DateUtils.getNombreMes(AppState.currentMonth);
        
        const totalHoras = turnos.reduce((sum, dia) => sum + (dia.horas || 0), 0);
        const turnosNoche = turnos.filter(dia => dia.turno === 'noche').length;
        const ausencias = turnos.filter(dia => dia.turno === 'vacaciones' || dia.turno === 'baja').length;
        
        let html = `
            <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px;">
                <h1 style="text-align: center; color: #2c3e50;">INFORME INDIVIDUAL MENSUAL</h1>
                <h2 style="text-align: center; color: #7f8c8d;">${mes} ${AppState.currentYear}</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2c3e50;">${empleado.nombre}</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div><strong>Departamento:</strong><br>${empleado.departamento}</div>
                        <div><strong>Turno Principal:</strong><br>${empleado.turnoPrincipal}</div>
                        <div><strong>Horas Contrato:</strong><br>${empleado.horasContrato}h</div>
                        <div><strong>Estado:</strong><br>${empleado.estado.toUpperCase()}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
                    <div style="background: #c9b3d9; color: #6b5b7d; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;">${totalHoras}h</div>
                        <div>Horas Trabajadas</div>
                    </div>
                    <div style="background: ${totalHoras >= empleado.horasContrato ? '#2ecc71' : '#e74c3c'}; color: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold;">${totalHoras - empleado.horasContrato}h</div>
                        <div>Balance</div>
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h3 style="color: #2c3e50; margin-top: 0;">Estadísticas</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                        <div><strong>Turnos de noche:</strong> ${turnosNoche}</div>
                        <div><strong>Días de ausencia:</strong> ${ausencias}</div>
                        <div><strong>Cumplimiento:</strong> ${Math.round((totalHoras / empleado.horasContrato) * 100)}%</div>
                        <div><strong>Periodo:</strong> ${AppState.currentMonth + 1}/${AppState.currentYear}</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3 style="color: #2c3e50;">Distribución de Turnos</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #c9b3d9; color: #6b5b7d;">
                                <th style="padding: 10px; border: 1px solid #ddd;">Día</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Turno</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">Horas</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const turno = turnos[dia - 1] || {};
            const fecha = new Date(AppState.currentYear, AppState.currentMonth, dia);
            const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
            
            html += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${dia} (${nombreDia})</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${turno.turno || '-'}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${turno.horas || 0}h</td>
                </tr>
            `;
        }
        
        html += `
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #7f8c8d; text-align: center; font-size: 0.9rem;">
                    <p>Informe generado automáticamente el ${new Date().toLocaleDateString('es-ES')}</p>
                </div>
            </div>
        `;
        
        // Mostrar en popup
        const ventana = window.open('', '_blank');
        ventana.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Informe Individual</title>
                <meta charset="UTF-8">
            </head>
            <body style="margin: 0; padding: 0;">
                ${html}
            </body>
            </html>
        `);
        ventana.document.close();
        
        NotificationSystem.show('Informe individual generado', 'success');
    }
}

// =============================================
// GESTOR DE TURNOS
// =============================================

class TurnoManager {
    // 🔧 NUEVA FUNCIÓN: Generar turnos considerando localidad y festivos
    static generarTurnosEmpleadoConLocalidad(empleado, diasEnMes) {
        const turnos = [];
        const fechaBase = new Date(AppState.currentYear, AppState.currentMonth, 1);
        
        // 🔧 NUEVO: Obtener estándares del departamento del empleado
        let horasPorTurno = 8; // Valor por defecto
        if (typeof DepartamentosManager !== 'undefined') {
            const depto = DepartamentosManager.obtenerDepartamento(empleado.departamento?.toLowerCase() || 'general');
            if (depto && depto.horasDiarias) {
                horasPorTurno = depto.horasDiarias;
                console.log(`[generarTurnosEmpleadoConLocalidad] 📊 Usando estándares del depto ${empleado.departamento}: ${horasPorTurno}h/día`);
            }
        }
        
        // 🔧 NUEVO: Usar dinámicamente los turnos - prioridad a turnos por defecto
        const tiposTurnoDisponibles = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
        
        // Fusionar: primero tiposTurno (por defecto), luego agregar los de localStorage
        const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };
        
        // 🔧 NUEVO: Actualizar horas de todos los turnos según el departamento
        Object.keys(turnosMerged).forEach(key => {
            if (turnosMerged[key].turno !== 'descanso' && turnosMerged[key].turno !== 'vacaciones' && turnosMerged[key].turno !== 'baja') {
                turnosMerged[key].horas = horasPorTurno;
            }
        });
        
        // 🔧 Buscar el turno del empleado respetando caso sensible primero, luego insensible
        let turnoEmpleado = empleado.turnoPrincipal;
        
        if (!turnosMerged[turnoEmpleado]) {
            // Intentar en minúsculas
            const turnoLower = turnoEmpleado?.toLowerCase();
            const turnoEncontrado = Object.keys(turnosMerged).find(t => t.toLowerCase() === turnoLower);
            turnoEmpleado = turnoEncontrado || 'mañana'; // Fallback a mañana si no existe
        }
        
        console.log(`[generarTurnosEmpleadoConLocalidad] Empleado: ${empleado.nombre}, Turno principal: ${empleado.turnoPrincipal}, Turno asignado: ${turnoEmpleado}, Horas: ${horasPorTurno}h`);
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaObj = new Date(fechaBase);
            fechaObj.setDate(dia);
            const diaSemana = fechaObj.getDay();
            
            // 🔧 Chequear si es domingo O festivo (nacional/local)
            const esDomingo = diaSemana === 0;
            const esFestivo = typeof window.esFestivoLocal === 'function' 
                ? window.esFestivoLocal(fechaObj, empleado.id)
                : false;
            
            let turno;
            
            if (empleado.estado === 'vacaciones' && dia <= 15) {
                turno = 'vacaciones';
            } else if (empleado.estado === 'baja') {
                turno = 'baja';
            } else if (esDomingo || esFestivo) {
                // 🔧 Domingos Y festivos: SIEMPRE descanso
                turno = 'descanso';
            } else {
                // 🔧 Días laborales: Turno configurado del empleado (SIN variaciones)
                turno = turnoEmpleado;
            }
            
            turnos.push({
                dia: dia,
                turno: turno,
                horas: turnosMerged[turno]?.horas || 0,
                horario: turnosMerged[turno]?.horario || '',
                fecha: fechaObj,
                esFinSemana: diaSemana === 0 || diaSemana === 6
            });
        }
        
        return turnos;
    }
    static generarTurnosEmpleado(empleado, diasEnMes) {
        const turnos = [];
        const fechaBase = new Date(AppState.currentYear, AppState.currentMonth, 1);
        
        // 🔧 NUEVO: Obtener estándares del departamento del empleado
        let horasPorTurno = 8; // Valor por defecto
        if (typeof DepartamentosManager !== 'undefined') {
            const depto = DepartamentosManager.obtenerDepartamento(empleado.departamento?.toLowerCase() || 'general');
            if (depto && depto.horasDiarias) {
                horasPorTurno = depto.horasDiarias;
                console.log(`[generarTurnosEmpleado] 📊 Usando estándares del depto ${empleado.departamento}: ${horasPorTurno}h/día`);
            }
        }
        
        // 🔧 NUEVO: Usar dinámicamente los turnos - prioridad a turnos por defecto
        const tiposTurnoDisponibles = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
        
        // Fusionar: primero tiposTurno (por defecto), luego agregar los de localStorage
        const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };
        
        // 🔧 NUEVO: Actualizar horas de todos los turnos según el departamento
        Object.keys(turnosMerged).forEach(key => {
            if (turnosMerged[key].turno !== 'descanso' && turnosMerged[key].turno !== 'vacaciones' && turnosMerged[key].turno !== 'baja') {
                turnosMerged[key].horas = horasPorTurno;
            }
        });
        
        // 🔧 Buscar el turno del empleado respetando caso sensible primero, luego insensible
        let turnoEmpleado = empleado.turnoPrincipal;
        
        if (!turnosMerged[turnoEmpleado]) {
            // Intentar en minúsculas
            const turnoLower = turnoEmpleado?.toLowerCase();
            const turnoEncontrado = Object.keys(turnosMerged).find(t => t.toLowerCase() === turnoLower);
            turnoEmpleado = turnoEncontrado || 'mañana'; // Fallback a mañana si no existe
        }
        
        console.log(`[generarTurnosEmpleado] Empleado: ${empleado.nombre}, Turno principal: ${empleado.turnoPrincipal}, Turno asignado: ${turnoEmpleado}, Horas: ${horasPorTurno}h`);
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaObj = new Date(fechaBase);
            fechaObj.setDate(dia);
            const diaSemana = fechaObj.getDay();
            
            // 🔧 Chequear si es domingo O festivo (nacional/local)
            const esDomingo = diaSemana === 0;
            const esFestivo = typeof window.esFestivoLocal === 'function' 
                ? window.esFestivoLocal(fechaObj, empleado.id)
                : false;
            
            let turno;
            
            if (empleado.estado === 'vacaciones' && dia <= 15) {
                turno = 'vacaciones';
            } else if (empleado.estado === 'baja') {
                turno = 'baja';
            } else if (esDomingo || esFestivo) {
                // 🔧 Domingos Y festivos: SIEMPRE descanso
                turno = 'descanso';
            } else {
                // 🔧 Días laborales: Turno configurado del empleado (SIN variaciones aleatorias)
                turno = turnoEmpleado;
            }
            
            turnos.push({
                dia: dia,
                turno: turno,
                horas: turnosMerged[turno]?.horas || 0,
                horario: turnosMerged[turno]?.horario || '',
                fecha: fechaObj,
                esFinSemana: diaSemana === 0 || diaSemana === 6
            });
        }
        
        return turnos;
    }


    static async inicializarDatos() {
        const diasEnMes = DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth);
        console.log(`[inicializarDatos] 🔄 Iniciando para ${AppState.currentMonth}/${AppState.currentYear} (${diasEnMes} días)`);

        empleados.forEach(empleado => {
            // ✅ VERIFICAR SI YA HAY DATOS PARA ESTE EMPLEADO EN ESTE MES ESPECÍFICO
            const turnosExistentes = AppState.scheduleData.get(empleado.id) || [];
            
            // Buscar si hay turno del mes actual
            const tieneDelMesActual = turnosExistentes.some(t => {
                const fecha = new Date(t.fecha);
                return fecha.getMonth() === AppState.currentMonth && 
                       fecha.getFullYear() === AppState.currentYear;
            });
            
            if (tieneDelMesActual) {
                console.log(`[inicializarDatos] ✓ Turnos ya existen para ${empleado.nombre} en ${AppState.currentMonth}/${AppState.currentYear}`);
                return; // NO REGENERAR, YA EXISTEN para este mes
            }
            
            // Si no hay datos de este mes, ENTONCES generar nuevos
            console.log(`[inicializarDatos] 🆕 Generando turnos para ${empleado.nombre} (${diasEnMes} días)`);
            
            const turnosNuevos = empleado.localidad 
                ? TurnoManager.generarTurnosEmpleadoConLocalidad(empleado, diasEnMes)
                : TurnoManager.generarTurnosEmpleado(empleado, diasEnMes);
            
            // ✅ CRÍTICO: AGREGAR los turnos nuevos, NO REEMPLAZAR
            // Si ya existen turnos de otros meses, mantenerlos y agregar los del mes actual
            if (turnosExistentes.length > 0) {
                // Combinar: turnos anteriores + turnos nuevos del mes actual
                const turnosCombinados = [...turnosExistentes, ...turnosNuevos];
                AppState.scheduleData.set(empleado.id, turnosCombinados);
                console.log(`[inicializarDatos] ✅ Turnos agregados para ${empleado.nombre}: ${turnosNuevos.length} días nuevos (total: ${turnosCombinados.length})`);
            } else {
                // Primer mes: simplemente guardar los turnos nuevos
                AppState.scheduleData.set(empleado.id, turnosNuevos);
                console.log(`[inicializarDatos] ✅ Turnos generados para ${empleado.nombre}: ${turnosNuevos.length} días`);
            }
        });
        
        // IMPORTANTE: Guardar en storage después de inicializar
        AppState.saveToStorage();
        
        // GUARDAR EN API/BD TAMBIÉN
        console.log('[inicializarDatos] 📤 Guardando en API/BD...');
        // await this._guardarEnAPI(); (Modo Local)
    }

    static async reiniciarDatos() {
        console.log(`[TurnoManager.reiniciarDatos] 📅 Cambiando a mes ${AppState.currentMonth}/${AppState.currentYear}`);
        
        // ✅ ACTUALIZACIÓN v11: MODO MANUAL ÚNICAMENTE
        // ❌ NO GENERAR AUTOMÁTICAMENTE BAJO NINGUNA CIRCUNSTANCIA
        // Solo cargar datos existentes y mostrar/ocultar botón
        
        console.log('[TurnoManager.reiniciarDatos] 💾 Guardando cambios del mes anterior...');
        AppState.saveToStorage();
        
        console.log('[TurnoManager.reiniciarDatos] 📂 Cargando datos del storage...');
        await AppState.loadFromStorage();
        
        // ⏳ ESPERAR UN POCO para asegurar que cargaron los datos
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 🔍 DIAGNÓSTICO: Ver qué meses tienen datos
        console.log('[TurnoManager.reiniciarDatos] 🔍 Diagnóstico de meses disponibles:');
        const mesesDisponibles = new Set();
        for (const [empId, turnos] of AppState.scheduleData) {
            if (turnos && turnos.length > 0) {
                turnos.forEach(t => {
                    const fecha = new Date(t.fecha);
                    mesesDisponibles.add(`${fecha.getMonth()}/${fecha.getFullYear()}`);
                });
            }
        }
        console.log(`[TurnoManager.reiniciarDatos] Meses con datos: ${Array.from(mesesDisponibles).join(', ')}`);
        
        // Verificar si hay datos para el MES ACTUAL
        let tieneEmpleadosConDatosDelMes = false;
        
        for (const [empId, turnos] of AppState.scheduleData) {
            if (turnos && turnos.length > 0) {
                const turnoDelMes = turnos.find(t => {
                    const fecha = new Date(t.fecha);
                    return fecha.getMonth() === AppState.currentMonth && fecha.getFullYear() === AppState.currentYear;
                });
                
                if (turnoDelMes) {
                    tieneEmpleadosConDatosDelMes = true;
                    console.log(`[TurnoManager.reiniciarDatos] ✅ Encontrados datos para el mes ${AppState.currentMonth}/${AppState.currentYear}`);
                    break;
                }
            }
        }
        
        // ✅ NO cambiar automáticamente de mes - Dejar que el usuario seleccione libremente
        // Los KPIs cargarán directamente desde la BD sin dependencia de AppState.scheduleData
        if (!tieneEmpleadosConDatosDelMes) {
            console.log(`[TurnoManager.reiniciarDatos] ⚠️ NO hay datos en AppState para ${AppState.currentMonth}/${AppState.currentYear} (pero KPIs cargarán desde BD)`);
        } else {
            console.log(`[TurnoManager.reiniciarDatos] ✅ Cuadrante tiene datos en AppState del mes actual`);
        }
        
        // ✅ ACTUALIZAR BOTÓN
        if (typeof TurnoManager !== 'undefined' && typeof TurnoManager.verificarYMostrarBoton === 'function') {
            TurnoManager.verificarYMostrarBoton();
        }
        
        AppState.saveToStorage();
        UI.generarCuadranteGeneral();
        UI.actualizarTitulosMes();
        if (AppState.selectedEmployee) {
            UI.generarCuadranteIndividual();
            UI.actualizarEstadisticasIndividual();
        }
        
        // ✅ Actualizar KPIs automáticamente después de cambiar mes
        if (typeof window.actualizarKPIs === 'function') {
            console.log('[TurnoManager.reiniciarDatos] 📊 Actualizando KPIs...');
            try {
                window.actualizarKPIs();
            } catch (e) {
                console.error('[TurnoManager.reiniciarDatos] ❌ Error en actualizarKPIs:', e);
            }
        }

        // ✅ Actualizar Calendario Visual (análisis de equidad horizontal)
        if (typeof CalendarioVisual !== 'undefined' && typeof CalendarioVisual.renderizarCalendario === 'function') {
            console.log('[TurnoManager.reiniciarDatos] 📅 Actualizando calendario visual...');
            CalendarioVisual.renderizarCalendario();
        }
        
        NotificationSystem.show('✅ Mes cargado correctamente', 'success');
    }

    static obtenerIniciales(nombre) {
        return nombre.split(' ')
            .map(palabra => palabra[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    static formatearTurno(turno) {
        const turnos = {
            'mañana': 'M',
            'tarde': 'T',
            'noche': 'N',
            'mixto': 'MX',
            'descanso': 'D',
            'vacaciones': 'V',
            'baja': 'B',
            'festivo': 'F',
            'libre': 'L'
        };
        return turnos[turno] || turno.charAt(0).toUpperCase();
    }

    static formatearTurnoCompleto(turno) {
        const turnos = {
            'mañana': 'Mañana',
            'tarde': 'Tarde',
            'noche': 'Noche',
            'mixto': 'Mixto',
            'descanso': 'Descanso',
            'vacaciones': 'Vacaciones',
            'baja': 'Baja médica',
            'festivo': 'Festivo',
            'libre': 'Libre'
        };
        return turnos[turno] || turno.charAt(0).toUpperCase() + turno.slice(1);
    }

    static obtenerOpcionesTurno() {
        // 🔧 IMPORTANTE: Leer desde localStorage, no de la constante global
        const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
        const tiposAUsar = Object.keys(tiposTurnoData).length > 0 ? tiposTurnoData : tiposTurno;
        
        return Object.keys(tiposAUsar).map(key => ({
            valor: key,
            nombre: tiposAUsar[key].nombre,
            color: tiposAUsar[key].color,
            textoColor: ColorManager.getTextoColor(key)
        }));
    }

    // ✅ NUEVA FUNCIÓN: Detectar si el cuadrante está vacío (para modal A+B)
    static esCuadranteVacio() {
        // ✅ MEJORADO: Revisar tanto AppState como localStorage para detectar si hay datos
        const mesActual = AppState.currentMonth;
        const anioActual = AppState.currentYear;
        
        console.log(`[esCuadranteVacio] Revisando mes ${mesActual}/${anioActual}`);
        
        // 1️⃣ Revisar AppState en memoria
        let tieneDataEnMemoria = false;
        for (let [empId, turnos] of AppState.scheduleData) {
            if (!Array.isArray(turnos) || turnos.length === 0) continue;
            
            const tieneDelMes = turnos.some(t => {
                if (!t.fecha) return false;
                const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
            });
            
            if (tieneDelMes) {
                console.log(`[esCuadranteVacio] ✓ Empleado ${empId} tiene datos en MEMORIA`);
                tieneDataEnMemoria = true;
                break;
            }
        }
        
        // 2️⃣ Revisar localStorage para detectar si hay turnos guardados
        let tieneDataEnStorage = false;
        try {
            const turnosAppState = localStorage.getItem('turnosAppState');
            if (turnosAppState) {
                const datosStorage = JSON.parse(turnosAppState);
                
                // Verificar si hay algún dato para este mes
                if (datosStorage.scheduleData && typeof datosStorage.scheduleData === 'object') {
                    const valores = Object.values(datosStorage.scheduleData);
                    
                    for (let empleadoTurnos of valores) {
                        if (!Array.isArray(empleadoTurnos)) continue;
                        
                        const tieneDelMes = empleadoTurnos.some(t => {
                            if (!t.fecha) return false;
                            const fecha = typeof t.fecha === 'string' ? new Date(t.fecha) : t.fecha;
                            return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
                        });
                        
                        if (tieneDelMes) {
                            console.log(`[esCuadranteVacio] ✓ Encontrados datos en STORAGE`);
                            tieneDataEnStorage = true;
                            break;
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('[esCuadranteVacio] Error leyendo localStorage:', e.message);
        }
        
        // 3️⃣ Decisión final
        const estaVacio = !tieneDataEnMemoria && !tieneDataEnStorage;
        console.log(`[esCuadranteVacio] Resultado: ${estaVacio ? '✅ VACÍO' : '❌ TIENE DATOS'}`);
        return estaVacio;
    }

    // ✅ NUEVA FUNCIÓN: Mostrar modal de generación
    static mostrarModalGeneracion() {
        const modal = document.getElementById('modalGenerarTurnos');
        if (!modal) {
            console.error('❌ modalGenerarTurnos no encontrado');
            return;
        }
        
        // Llenar con datos del mes/año actual
        const mesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const mesElement = document.getElementById('mes_modal');
        if (mesElement) mesElement.textContent = mesNombres[AppState.currentMonth];
        
        const anioElement = document.getElementById('anio_modal');
        if (anioElement) anioElement.textContent = AppState.currentYear;
        
        // Calcular cuántos turnos se van a generar
        const diasEnMes = new Date(AppState.currentYear, AppState.currentMonth + 1, 0).getDate();
        const totalEmpleados = empleados.length;
        const totalTurnos = diasEnMes * totalEmpleados;
        
        const totalElement = document.getElementById('total_turnos_modal');
        if (totalElement) totalElement.textContent = totalTurnos;
        
        modal.classList.add('active');
        console.log('✅ Modal abierto');
    }

    // ✅ NUEVA FUNCIÓN: Cerrar modal
    static cerrarModalGeneracion() {
        const modal = document.getElementById('modalGenerarTurnos');
        if (modal) {
            modal.classList.remove('active');
            console.log('✅ Modal cerrado');
        }
    }

    // NUEVA FUNCION: Generar turnos (COMPATIBLE CON API)
    static async generarTurnos() {
        await this.inicializarDatos();
        this.cerrarModalGeneracion();
        UI.generarCuadranteGeneral();
    }

    // Nueva función para guardar en API con reintentos
    static async _guardarEnAPI() { console.log("API deshabilitada"); }

    static verificarYMostrarBoton() {
        const btn = document.getElementById('btnGenerarTurnos');
        if (!btn) {
            console.log('⚠️ btnGenerarTurnos no encontrado');
            return;
        }
        
        const estaVacio = this.esCuadranteVacio();
        console.log('[verificarYMostrarBoton] Cuadrante vacío:', estaVacio);
        
        if (estaVacio) {
            btn.style.display = 'block';
            console.log('🟢 Botón MOSTRADO (cuadrante vacío)');
        } else {
            btn.style.display = 'none';
            console.log('🔴 Botón OCULTADO (cuadrante con datos)');
        }
    }
}

// ✅ ASSIGN TURNOMANAGER CLASS TO WINDOW OBJECT (DESPUÉS de definición completa)
// Sobrescribir cualquier placeholder anterior
window.TurnoManager = TurnoManager;
console.log('✅ [modules.js] Clase TurnoManager asignada a window.TurnoManager');
console.log('   Métodos disponibles:', Object.getOwnPropertyNames(TurnoManager).filter(m => typeof TurnoManager[m] === 'function').join(', '));

// Disparar evento global para que los placeholders sepan que está listo
window.dispatchEvent(new CustomEvent('TurnoManagerReady'));
console.log('✅ [modules.js] Evento TurnoManagerReady disparado');

// Dummy para placeholders
class UI {
    static generarCuadranteGeneral() {
        console.time('generarCuadranteGeneral');
        console.log('[generarCuadranteGeneral] 🔄 Iniciando regeneración del cuadrante general...');

        const elemento = document.getElementById('cuadranteGeneral');
        if (!elemento) {
            console.warn('[generarCuadranteGeneral] ❌ Elemento cuadranteGeneral no encontrado');
            return;
        }
        
        // Obtener valores de los filtros
        const filtroDepartamento = document.getElementById('filtroDepartamentoGeneral')?.value || '';
        const filtroEstado = document.getElementById('filtroEstadoGeneral')?.value || '';
        
        // Filtrar empleados según los criterios seleccionados
        let empleadosFiltrados = empleados.filter(emp => {
            const cumpleDepartamento = !filtroDepartamento || emp.departamento === filtroDepartamento;
            const cumpleEstado = !filtroEstado || emp.estado === filtroEstado;
            return cumpleDepartamento && cumpleEstado;
        });
        
        const diasEnMes = DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth);
        const mes = DateUtils.getNombreMes(AppState.currentMonth);
        
        let html = `<h2>${mes} ${AppState.currentYear}</h2>`;
        html += '<table border="1" cellpadding="3" style="width:100%; border-collapse: collapse; cursor: pointer; font-size: 12px; page-break-inside: avoid;">';
        html += '<thead><tr style="background: #c9b3d9; color: #6b5b7d;"><th style="padding: 5px;">Empleado</th>';
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(AppState.currentYear, AppState.currentMonth, dia);
            const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'short' });
            // 🔧 Colorear número del día en naranja pastel + clickeable para resumen
            html += `<th class="dia-header" data-dia="${dia}" style="cursor: pointer; transition: all 0.3s ease; padding: 3px; width: 45px; min-width: 45px; max-width: 45px;" onmouseover="this.style.background='rgba(249,115,22,0.15)'" onmouseout="this.style.background='transparent'">
                <span style="color: #fb923c; font-weight: bold; font-size: 12px;">${dia}</span><br>
                <span style="color: #64748b; font-size: 10px;">${nombreDia}</span>
            </th>`;
        }
        
        html += '</tr></thead><tbody>';
        
        empleadosFiltrados.forEach(empleado => {
            const turnos = AppState.scheduleData.get(empleado.id) || [];
            let totalHoras = 0;
            const estaSeleccionado = AppState.selectedEmployee?.id === empleado.id;
            const bgSeleccionado = estaSeleccionado ? 'background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; box-shadow: 0 0 20px rgba(249, 115, 22, 0.8), 0 0 40px rgba(234, 88, 12, 0.6);' : 'background: #f3f4f6; color: #0f172a;';
            
            html += `<tr data-empleado-id="${empleado.id}" style="${estaSeleccionado ? 'background: #e8f4f8;' : ''}">
                <td class="empleado-nombre" data-empleado-id="${empleado.id}" 
                    style="font-weight: bold; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white; cursor: pointer; padding: 5px; border-radius: 5px; border: 1px solid rgba(236, 72, 153, 0.3); transition: all 0.3s ease; font-size: 12px; display: flex; flex-direction: column; gap: 3px;">
                    <span style="text-align: left;">${estaSeleccionado ? '✓ ' : ''}${empleado.nombre}</span>
                    <span style="font-size: 10px; opacity: 0.9; font-weight: 500; text-align: right;">${empleado.departamento}</span>
                </td>`;
            
            for (let dia = 1; dia <= diasEnMes; dia++) {
                // 🔧 BUG FIX: Buscar turno filtrando por mes/año ACTUAL, no solo por día
                const turno = turnos.find(t => {
                    if (t.dia !== dia) return false;
                    if (!t.fecha) return true; // Fallback si no tiene fecha
                    
                    const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                    const turnoMes = fecha.getMonth();
                    const turnoAnio = fecha.getFullYear();
                    
                    return turnoMes === AppState.currentMonth && turnoAnio === AppState.currentYear;
                }) || {};
                const color = tiposTurno[turno.turno]?.color || '#ffffff';
                const inicial = tiposTurno[turno.turno]?.inicial || '-';
                totalHoras += turno.horas || 0;
                
                // Generar gradiente basado en el color del turno
                const gradientColor = `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`;
                const borderColor = color.replace('#', 'rgba(') + ', 0.5)';
                
                html += `<td class="turno-celda" data-empleado-id="${empleado.id}" data-dia="${dia}" 
                    style="text-align: center; cursor: pointer; background: ${gradientColor}; color: #0f172a; font-weight: bold; font-size: 12px; border: 1px solid ${borderColor}; border-radius: 5px; padding: 3px 2px; width: 45px; min-width: 45px; max-width: 45px; transition: all 0.3s ease; transform: scale(1); overflow: hidden;" 
                    title="Click para cambiar turno">
                    ${inicial}
                </td>`;
            }
            
            html += `</tr>`;
        });
        
        html += '</tbody></table>';
        elemento.innerHTML = html;
        
        // Asignar event listeners después de crear el HTML
        document.querySelectorAll('.empleado-nombre').forEach(el => {
            el.addEventListener('click', (e) => {
                // Obtener el ID del TD, no del span
                const td = e.currentTarget;
                const empleadoId = parseInt(td.dataset.empleadoId);
                const empleado = empleados.find(emp => emp.id === empleadoId);
                AppState.selectedEmployee = empleado;
                NotificationSystem.show(`✓ ${empleado.nombre} seleccionado`, 'success');
                
                // Cambiar foto del overlay al empleado seleccionado
                if (empleado.foto) {
                    const overlay = elemento.querySelector('.foto-overlay-hologram');
                    if (overlay) {
                        overlay.style.backgroundImage = `url('${empleado.foto}')`;
                    }
                }
                
                // Mostrar vista previa
                const vistaPrevia = document.getElementById('vistaPrevia');
                if (vistaPrevia) {
                    const turnos = AppState.scheduleData.get(empleadoId) || [];
                    // 🔧 BUG FIX: Filtrar solo turnos del mes/año ACTUAL para contar días trabajados
                    const diasTrabajados = turnos.filter(t => {
                        if (!t.turno || t.turno === '-' || t.turno === 'V' || t.turno === 'B') return false;
                        if (!t.fecha) return false;
                        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                        return fecha.getMonth() === AppState.currentMonth && fecha.getFullYear() === AppState.currentYear;
                    }).length;
                    
                    document.getElementById('nombreEmpleado').textContent = empleado.nombre;
                    document.getElementById('deptoEmpleado').textContent = empleado.departamento;
                    document.getElementById('horasEmpleado').textContent = empleado.horasContrato + 'h';
                    document.getElementById('turnoEmpleado').textContent = empleado.turnoPrincipal;
                    document.getElementById('diasEmpleado').textContent = diasTrabajados;
                    
                    vistaPrevia.style.display = 'block';
                    
                    // Mostrar cuadrante individual
                    if (typeof mostrarCuadranteEmpleado === 'function') {
                        mostrarCuadranteEmpleado(empleadoId);
                    }
                    
                    // Actualizar estadísticas
                    if (typeof actualizarEstadisticasIndividual === 'function') {
                        actualizarEstadisticasIndividual();
                    }
                }
                
                UI.generarCuadranteGeneral();
            });
        });
        
        document.querySelectorAll('.turno-celda').forEach(el => {
            el.addEventListener('click', (e) => {
                const empleadoId = parseInt(e.currentTarget.dataset.empleadoId);
                const dia = parseInt(e.currentTarget.dataset.dia);
                TurnoEditor.abrirEditorTurno(empleadoId, dia);
            });
        });
        
        // 🔥 AGREGAR EVENT LISTENERS A ENCABEZADOS DE DÍAS PARA MOSTRAR RESUMEN
        document.querySelectorAll('.dia-header').forEach(el => {
            el.addEventListener('click', (e) => {
                const dia = parseInt(e.currentTarget.dataset.dia);
                UI.mostrarResumenDia(dia);
            });
        });
        
// 🔥 REGISTRAR OBSERVADOR PARA SINCRONIZACIÓN AUTOMÁTICA (solo una vez)
        if (typeof DataChangeManager !== 'undefined' && !window._cuadranteGeneralObserverRegistrado) {
            const observador = (cambio) => {
                // Evitar bucles: no actualizar si estamos en medio de una actualización
                if (window._cuadranteGeneralActualizando) {
                    console.log('[generarCuadranteGeneral] ⏸️ Saltando actualización (ya en proceso)');
                    return;
                }

                // Actualizar siempre que haya cambios de turno o cambios en lote
                if (cambio.type === 'SHIFT_CHANGED' || cambio.type === 'BULK_CHANGES' || cambio.type === 'MONTH_CHANGED') {
                    console.log('[generarCuadranteGeneral] 🔄 Detectado cambio, actualizando cuadrante general...');
                    window._cuadranteGeneralActualizando = true;
                    UI.generarCuadranteGeneral();  // Volver a renderizar
                    window._cuadranteGeneralActualizando = false;
                }
            };

            DataChangeManager.subscribe(observador);
            console.log('[generarCuadranteGeneral] ✅ Observador registrado para cuadrante general (primera vez)');

            // Marcar que ya se registró
            window._cuadranteGeneralObserverRegistrado = true;
            window._cuadranteGeneralObserver = observador;
        }

        // Actualizar KPIs de la parte inferior
        if (typeof window.actualizarKPIs === 'function') {
            window.actualizarKPIs();
        }

        console.timeEnd('generarCuadranteGeneral');
        console.log('[generarCuadranteGeneral] ✅ Regeneración completada');
    }

    static abrirEditorTurno(empleadoId, dia, turnoActual) {
        const turnos = Object.keys(tiposTurno);
        let opcionesHTML = '';
        
        turnos.forEach(t => {
            const selected = t === turnoActual ? 'selected' : '';
            const inicial = tiposTurno[t].inicial;
            opcionesHTML += `<option value="${t}" ${selected}>${inicial} - ${tiposTurno[t].nombre}</option>`;
        });

        // Obtener horas actuales del turno
        const turnosEmpleado = AppState.scheduleData.get(empleadoId) || [];
        const turnoDia = turnosEmpleado.find(t => t.dia === dia);
        const horasActuales = turnoDia ? turnoDia.horas : (tiposTurno[turnoActual]?.horas || 0);

        // Crear un popup simple con selección
        const contenedor = document.createElement('div');
        contenedor.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #3498db;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            min-width: 300px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;
        
        const empleado = empleados.find(e => e.id === empleadoId);
        
        contenedor.innerHTML = `
            <h3 style="margin-top: 0; color: #2c3e50;">Cambiar Turno</h3>
            <p><strong>Empleado:</strong> ${empleado.nombre}</p>
            <p><strong>Día:</strong> ${dia} de ${DateUtils.getNombreMes(AppState.currentMonth)}</p>
            <p>
                <strong>Turno:</strong>
                <select id="selectTurno" style="width: 100%; padding: 8px; margin: 10px 0;">
                    ${opcionesHTML}
                </select>
            </p>
            <p>
                <strong>Horas:</strong>
                <input type="number" id="inputHoras" value="${horasActuales.toString()}" step="0.25" min="0" max="24" style="width: 100%; padding: 8px; margin: 10px 0;">
            </p>
            <div style="text-align: right;">
                <button id="btnCancelar" style="padding: 8px 16px; margin-right: 10px; cursor: pointer;">
                    Cancelar
                </button>
                <button id="btnGuardar" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Guardar
                </button>
            </div>
        `;
        
        // Agregar fondo oscuro
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        `;
        
        const cerrar = () => {
            overlay.remove();
            contenedor.remove();
        };
        
        overlay.addEventListener('click', cerrar);
        
        document.body.appendChild(overlay);
        document.body.appendChild(contenedor);
        
        // Asignar eventos a los botones
        contenedor.querySelector('#btnCancelar').addEventListener('click', cerrar);
        contenedor.querySelector('#btnGuardar').addEventListener('click', () => {
            const nuevoTurno = contenedor.querySelector('#selectTurno').value;
            const inputHoras = contenedor.querySelector('#inputHoras');
            const nuevasHoras = parseFloat(inputHoras.value);

            // Validar horas
            if (isNaN(nuevasHoras) || nuevasHoras < 0 || nuevasHoras > 24) {
                alert('Por favor ingrese horas válidas (0-24)');
                inputHoras.focus();
                return;
            }

            UI.guardarCambioTurno(empleadoId, dia, nuevoTurno, nuevasHoras);
            cerrar();
        });

        // Actualizar horas automáticamente cuando cambie el tipo de turno
        contenedor.querySelector('#selectTurno').addEventListener('change', (e) => {
            const tipoTurnoSeleccionado = e.target.value;
            const horasPredeterminadas = tiposTurno[tipoTurnoSeleccionado]?.horas || 0;
            contenedor.querySelector('#inputHoras').value = horasPredeterminadas.toString();
        });
    }

    // 🔥 FUNCIÓN RECONSTRUIDA: Guardar cambio de turno y actualizar UI
    static guardarCambioTurno(empleadoId, dia, nuevoTurno, horasPersonalizadas = null) {
        console.time('guardarCambioTurno');
        console.log(`[guardarCambioTurno] 💾 Guardando cambio: empleado ${empleadoId}, día ${dia}, turno ${nuevoTurno}, horas ${horasPersonalizadas}`);
        console.log(`[guardarCambioTurno] 📅 Mes/año actual: ${AppState.currentMonth}/${AppState.currentYear}`);

        try {
            // Obtener turnos actuales del empleado
            let turnos = AppState.scheduleData.get(empleadoId) || [];
            console.log(`[guardarCambioTurno] 📊 Turnos actuales del empleado: ${turnos.length}`);

            // Encontrar el turno del día específico
            const turnoIndex = turnos.findIndex(t => t.dia === dia);
            console.log(`[guardarCambioTurno] 🔍 Índice del turno día ${dia}: ${turnoIndex}`);

            if (turnoIndex === -1) {
                console.warn(`[guardarCambioTurno] ⚠️ No se encontró turno para día ${dia}, creando nuevo`);
                // Crear nuevo turno si no existe
                const nuevoTurnoObj = {
                    dia: dia,
                    turno: nuevoTurno,
                    horas: horasPersonalizadas !== null ? horasPersonalizadas : (tiposTurno[nuevoTurno]?.horas || 0),
                    fecha: new Date(AppState.currentYear, AppState.currentMonth, dia),
                    esFinSemana: new Date(AppState.currentYear, AppState.currentMonth, dia).getDay() === 0 || new Date(AppState.currentYear, AppState.currentMonth, dia).getDay() === 6
                };
                turnos.push(nuevoTurnoObj);
                console.log(`[guardarCambioTurno] ➕ Nuevo turno creado:`, nuevoTurnoObj);
            } else {
                // Actualizar turno existente
                const turnoAnterior = turnos[turnoIndex].turno;
                console.log(`[guardarCambioTurno] 🔄 Turno anterior: ${turnoAnterior}`);
                turnos[turnoIndex].turno = nuevoTurno;
                turnos[turnoIndex].horas = horasPersonalizadas !== null ? horasPersonalizadas : (tiposTurno[nuevoTurno]?.horas || turnos[turnoIndex].horas);

                console.log(`[guardarCambioTurno] 🔄 Turno actualizado: ${turnoAnterior} → ${nuevoTurno}`);
                console.log(`[guardarCambioTurno] 📅 Fecha del turno:`, turnos[turnoIndex].fecha);
            }

            // Guardar en AppState
            AppState.scheduleData.set(empleadoId, turnos);
            console.log(`[guardarCambioTurno] 💾 Guardado en AppState. Total turnos: ${AppState.scheduleData.get(empleadoId).length}`);

            AppState.saveToStorage();
            console.log(`[guardarCambioTurno] 💾 Guardado en localStorage`);

            // Notificar cambio para sincronización (sin regenerar toda la tabla)
            if (window.DataChangeManager) {
                DataChangeManager.notifyShiftChange(empleadoId, dia, nuevoTurno);
            }

            // Actualizar solo la celda visual (optimizado)
            UI.actualizarCeldaTurno(empleadoId, dia);

            console.log(`[guardarCambioTurno] ✅ Cambio guardado exitosamente`);

        } catch (error) {
            console.error(`[guardarCambioTurno] ❌ Error al guardar cambio:`, error);
            NotificationSystem.show('Error al guardar el cambio de turno', 'error');
        }

        console.timeEnd('guardarCambioTurno');
    }

    // 🔥 MÉTODO OPTIMIZADO: Actualizar solo una celda específica
    static actualizarCeldaTurno(empleadoId, dia) {
        console.log(`[actualizarCeldaTurno] 🔄 Actualizando celda específica: empleado ${empleadoId}, día ${dia}`);

        // Buscar la celda específica
        const selector = `.turno-celda[data-empleado-id="${empleadoId}"][data-dia="${dia}"]`;
        const celda = document.querySelector(selector);

        if (!celda) {
            console.warn(`[actualizarCeldaTurno] ❌ Celda no encontrada: ${selector}`);
            return;
        }

        // Obtener el turno actualizado
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const turno = turnos.find(t => {
            if (t.dia !== dia) return false;
            if (!t.fecha) return true;

            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            const turnoMes = fecha.getMonth();
            const turnoAnio = fecha.getFullYear();

            return turnoMes === AppState.currentMonth && turnoAnio === AppState.currentYear;
        }) || {};

        const color = tiposTurno[turno.turno]?.color || '#ffffff';
        const inicial = tiposTurno[turno.turno]?.inicial || '-';

        // Generar gradiente y actualizar la celda
        const gradientColor = `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`;
        const borderColor = color.replace('#', 'rgba(') + ', 0.5)';

        celda.style.background = gradientColor;
        celda.style.borderColor = borderColor;
        celda.textContent = inicial;
        celda.title = `Click para cambiar turno - ${turno?.turno || 'Sin turno'} - ${turno?.horas || 0}h`;

        console.log(`[actualizarCeldaTurno] ✅ Celda actualizada: ${inicial} (${turno.turno})`);
    }

    static generarCuadranteIndividual() {}
    
    static actualizarTitulosMes() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                       'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const mesTituloGeneral = document.getElementById('mesTituloGeneral');
        if (mesTituloGeneral) {
            const nombreMes = meses[AppState.currentMonth] || 'Mes';
            mesTituloGeneral.textContent = `${nombreMes} ${AppState.currentYear}`;
        }
    }
    
    static actualizarEstadisticasIndividual() {}
    static actualizarEstadisticasGeneral() {}
    
    // 🔥 NUEVA FUNCIÓN: Mostrar resumen inteligente de un día con gráficos y mapas de calor
    static mostrarResumenDia(dia) {
        console.log(`📊 [mostrarResumenDia] Generando resumen para día ${dia}`);
        
        const fecha = new Date(AppState.currentYear, AppState.currentMonth, dia);
        const nombreDia = fecha.toLocaleDateString('es-ES', { weekday: 'long' });
        const nombreMes = fecha.toLocaleDateString('es-ES', { month: 'long' });
        const isFestivo = typeof window.esFestivo === 'function' ? window.esFestivo(fecha) : false;
        const esDomingo = fecha.getDay() === 0;
        
        // Recopilar datos del día
        let distribucionTurnos = {};
        let horasTotales = 0;
        let empleadosTrabajando = 0;
        let turnoPorEmpleado = [];
        
        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            const turnoDelDia = turnos.find(t => {
                if (t.dia !== dia) return false;
                if (!t.fecha) return true;
                const tFecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                return tFecha.getMonth() === AppState.currentMonth && tFecha.getFullYear() === AppState.currentYear;
            });
            
            if (turnoDelDia) {
                const tipoTurno = turnoDelDia.turno;
                distribucionTurnos[tipoTurno] = (distribucionTurnos[tipoTurno] || 0) + 1;
                horasTotales += turnoDelDia.horas || 0;
                
                if (!['descanso', 'vacaciones', 'baja', 'festivo', 'libre'].includes(tipoTurno)) {
                    empleadosTrabajando++;
                }
                
                turnoPorEmpleado.push({
                    nombre: emp.nombre,
                    turno: tipoTurno,
                    horas: turnoDelDia.horas || 0,
                    color: tiposTurno[tipoTurno]?.color || '#ffffff'
                });
            }
        });
        
        // Crear modal de resumen
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 11000;
        `;
        modal.id = 'modalResumenDia';
        
        // Crear contenido
        const contenido = document.createElement('div');
        contenido.style.cssText = `
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            border-radius: 20px;
            padding: 40px;
            max-width: 900px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        let html = `
            <style>
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .stat-box {
                    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
                    padding: 20px;
                    border-radius: 12px;
                    border-left: 4px solid #0ea5e9;
                    margin-bottom: 15px;
                }
                .stat-value {
                    font-size: 32px;
                    font-weight: 700;
                    color: #0c4a6e;
                }
                .stat-label {
                    font-size: 12px;
                    color: #0369a1;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-top: 5px;
                }
                .turno-badge {
                    display: inline-block;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 12px;
                    margin: 5px;
                }
                .employee-row {
                    background: white;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s ease;
                }
                .employee-row:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    transform: translateX(4px);
                }
            </style>
            
            <div style="margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                        <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 28px;">
                            📅 ${dia} de ${nombreMes}
                        </h2>
                        <p style="margin: 0; color: #64748b; text-transform: capitalize;">
                            ${nombreDia}${isFestivo ? ' 🎉 (Festivo)' : ''}${esDomingo ? ' ☀️ (Domingo)' : ''}
                        </p>
                    </div>
                    <button onclick="document.getElementById('modalResumenDia').remove()" 
                            style="background: #f1f5f9; color: #475569; border: 2px solid #cbd5e1; padding: 12px 20px; 
                                   border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 16px; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#e2e8f0'" onmouseout="this.style.background='#f1f5f9'">
                        ✕
                    </button>
                </div>
            </div>
            
            <!-- ESTADÍSTICAS PRINCIPALES -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div class="stat-box">
                    <div class="stat-value">${empleadosTrabajando}</div>
                    <div class="stat-label">Empleados Trabajando</div>
                </div>
                <div class="stat-box" style="border-left-color: #22c55e; background: linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%);">
                    <div class="stat-value" style="color: #166534;">${horasTotales.toFixed(1)}h</div>
                    <div class="stat-label" style="color: #15803d;">Horas Totales</div>
                </div>
                <div class="stat-box" style="border-left-color: #f97316; background: linear-gradient(135deg, #fed7aa 0%, #ffedd5 100%);">
                    <div class="stat-value" style="color: #92400e;">${Object.keys(distribucionTurnos).length}</div>
                    <div class="stat-label" style="color: #b45309;">Tipos de Turnos</div>
                </div>
            </div>
            
            <!-- DISTRIBUCIÓN DE TURNOS -->
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b;">📊 Distribución de Turnos</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
        `;
        
        // Agregar badges de distribución
        Object.entries(distribucionTurnos).forEach(([turno, cantidad]) => {
            const info = tiposTurno[turno] || { nombre: turno, color: '#ccc' };
            html += `
                <div class="turno-badge" style="background: ${info.color}; border: 2px solid ${info.color}; color: #0f172a;">
                    ${info.nombre}: <strong>${cantidad}</strong>
                </div>
            `;
        });
        
        html += `</div></div>`;
        
        // MAPA DE CALOR (visualización de carga)
        html += `
            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b;">🔥 Intensidad del Día</h3>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="flex: 1; height: 40px; background: linear-gradient(90deg, #dcfce7 0%, #fef3c7 50%, #fed7aa 100%); border-radius: 10px; border: 2px solid #dbeafe;"></div>
                    <div style="text-align: right; min-width: 150px;">
                        <div style="font-weight: 700; color: #1e293b; font-size: 14px;">Carga: ${empleadosTrabajando > 5 ? '🔴 Alta' : empleadosTrabajando > 2 ? '🟡 Media' : '🟢 Baja'}</div>
                        <div style="font-size: 12px; color: #64748b;">${empleadosTrabajando} de ${empleados.length} empleados</div>
                    </div>
                </div>
            </div>
        `;
        
        // LISTA DETALLADA DE EMPLEADOS
        if (turnoPorEmpleado.length > 0) {
            html += `
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                    <h3 style="margin: 0 0 15px 0; color: #1e293b;">👥 Turnos Asignados</h3>
                    <div>
            `;
            
            turnoPorEmpleado.forEach(item => {
                const turnoInfo = tiposTurno[item.turno] || { nombre: item.turno };
                html += `
                    <div class="employee-row">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="flex: 1;">
                                <div style="font-weight: 600; color: #1e293b;">${item.nombre}</div>
                                <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                                    ${turnoInfo.nombre}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="padding: 6px 12px; background: ${item.color}; border-radius: 6px; font-weight: 600; color: #0f172a; font-size: 12px;">
                                    ${item.horas}h
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        contenido.innerHTML = html;
        modal.appendChild(contenido);
        document.body.appendChild(modal);
        
        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        console.log(`✅ [mostrarResumenDia] Resumen generado correctamente`);
    }
}

class EmployeeManager {
    static empleadoEnEdicion = null;

    static abrirModal() {
        return this.mostrarModalGestion();
    }

    static mostrarModalGestion() {
        const modal = document.getElementById('modalGestionEmpleados');
        if (!modal) {
            console.warn('Modal modalGestionEmpleados no encontrado');
            return;
        }
        modal.classList.add('active');
        this.actualizarListaEmpleados();
        
        // Llenar select de localidades
        if (typeof LocationManager !== 'undefined') {
            LocationManager.llenarSelectLocalidades();
        }
        
        const cerrarConESC = (e) => {
            if (e.key === 'Escape') {
                this.cerrarModal();
                document.removeEventListener('keydown', cerrarConESC);
            }
        };
        document.addEventListener('keydown', cerrarConESC);
    }

    static cerrarModal() {
        const modal = document.getElementById('modalGestionEmpleados');
        if (modal) {
            modal.classList.remove('active');
        }
        this.cancelarFormulario();
    }

    static mostrarFormularioNuevo() {
        this.empleadoEnEdicion = null;
        this.limpiarFormulario();
        this.llenarSelectDepartamentos();
        this.llenarSelectTurnos();  // Agregar esta línea
        const formulario = document.getElementById('formularioEmpleado');
        if (formulario) {
            formulario.style.display = 'block';
        }
    }

    static llenarSelectDepartamentos() {
        const selectDepto = document.getElementById('emple_departamento');
        if (!selectDepto) return;
        
        // Mantener la opción por defecto
        selectDepto.innerHTML = '<option value="">Selecciona departamento</option>';
        
        // 🔥 IMPORTANTE: Usar ConsolidadoDepartamentos (interface unificada) que a su vez usa DepartamentosManager (FASE 2)
        if (typeof ConsolidadoDepartamentos !== 'undefined' && ConsolidadoDepartamentos.obtenerListaDepartamentos) {
            const deptos = ConsolidadoDepartamentos.obtenerListaDepartamentos();
            deptos.forEach(nombreDepto => {
                const option = document.createElement('option');
                option.value = nombreDepto;
                option.textContent = nombreDepto;
                selectDepto.appendChild(option);
            });
            console.log(`[EmployeeManager] ✅ ${deptos.length} departamentos cargados desde ConsolidadoDepartamentos`);
        } else if (typeof DepartamentosManager !== 'undefined' && DepartamentosManager.obtenerDepartamentos) {
            // Fallback directo a DepartamentosManager si ConsolidadoDepartamentos aún no está listo
            const deptos = DepartamentosManager.obtenerDepartamentos();
            deptos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto.nombre;
                option.textContent = depto.nombre;
                selectDepto.appendChild(option);
            });
            console.log(`[EmployeeManager] ⚠️ ${deptos.length} departamentos cargados directo desde DepartamentosManager`);
        } else if (typeof DepartmentManager !== 'undefined' && DepartmentManager.departamentos) {
            // Fallback a DepartmentManager (viejo) solo si lo anterior no está disponible
            DepartmentManager.departamentos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto.nombre;
                option.textContent = depto.nombre;
                selectDepto.appendChild(option);
            });
            console.log('[EmployeeManager] ⚠️ Usando DepartmentManager antiguo');
        } else {
            // Fallback a opciones por defecto si nada está disponible
            const deptosPorDefecto = ['Operaciones', 'Ventas', 'Administración', 'Soporte Técnico', 'Recursos Humanos', 'Marketing', 'Limpieza'];
            deptosPorDefecto.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto;
                option.textContent = depto;
                selectDepto.appendChild(option);
            });
            console.log('[EmployeeManager] ⚠️ Usando departamentos por defecto');
        }
    }

    static llenarSelectTurnos() {
        const selectTurno = document.getElementById('emple_turno');
        if (!selectTurno) return;
        
        // Limpiar opciones previas
        selectTurno.innerHTML = '<option value="">Selecciona turno principal</option>';
        
        // Leer turnos de localStorage
        const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
        
        // Si localStorage está vacío, usar global tiposTurno
        const tiposAUsar = Object.keys(tiposTurnoData).length > 0 ? tiposTurnoData : tiposTurno;
        
        Object.entries(tiposAUsar).forEach(([key, tipo]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = tipo.nombre || key;
            selectTurno.appendChild(option);
        });
    }

    static limpiarFormulario() {
        const campos = ['emple_nombre', 'emple_departamento', 'emple_localidad', 'emple_telefono', 'emple_email', 'emple_horas', 'emple_turno'];
        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.value = '';
        });
        const estadoSelect = document.getElementById('emple_estado');
        if (estadoSelect) estadoSelect.value = 'activo';
    }

    static cancelarFormulario() {
        const formulario = document.getElementById('formularioEmpleado');
        if (formulario) {
            formulario.style.display = 'none';
        }
        this.limpiarFormulario();
        this.empleadoEnEdicion = null;
    }

    static actualizarListaEmpleados() {
        const container = document.getElementById('listaEmpleados');
        if (!container) return;

        if (empleados.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">No hay empleados registrados</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
        
        empleados.forEach(emp => {
            const estadoColor = {
                'activo': '#d4edda',
                'vacaciones': '#d0ebff',
                'baja': '#ffe3e3',
                'inactivo': '#f8f9fa'
            };
            
            const estadoTextoColor = {
                'activo': '#155724',
                'vacaciones': '#1864ab',
                'baja': '#c92a2a',
                'inactivo': '#666'
            };

            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; border-left: 4px solid #c9b3d9;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                        <div>
                            <h5 style="color: #2c3e50; margin: 0 0 5px 0;">${emp.nombre}</h5>
                            <div style="font-size: 0.9rem; color: #7f8c8d;">
                                <div>🏢 ${emp.departamento || 'N/A'} | 📍 ${emp.localidad || 'N/A'}</div>
                                <div>📱 ${emp.telefono}</div>
                                <div>📧 ${emp.email}</div>
                                <div>⏰ ${emp.horasContrato}h/mes | 🕐 ${emp.turnoPrincipal || 'N/A'}</div>
                            </div>
                        </div>
                        <span style="display: inline-block; padding: 4px 12px; background: ${estadoColor[emp.estado] || '#f8f9fa'}; color: ${estadoTextoColor[emp.estado] || '#666'}; border-radius: 15px; font-size: 0.85rem; font-weight: 600;">
                            ${(emp.estado || 'activo').toUpperCase()}
                        </span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button style="background: #c9b3d9; color: #6b5b7d; flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer;" onclick="EmployeeManager.editarEmpleado(${emp.id})">
                            ✏️ Editar
                        </button>
                        <button style="background: #f3d4d9; color: #c2185b; flex: 1; padding: 8px; border: none; border-radius: 4px; cursor: pointer;" onclick="EmployeeManager.eliminarEmpleado(${emp.id})">
                            🗑️ Eliminar
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    static editarEmpleado(empleadoId) {
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) return;

        this.empleadoEnEdicion = empleado;
        this.llenarSelectDepartamentos();
        this.llenarSelectTurnos();  // Agregar esta línea
        document.getElementById('empleadoIdEdicion').value = empleadoId;
        document.getElementById('emple_nombre').value = empleado.nombre;
        document.getElementById('emple_departamento').value = empleado.departamento;
        document.getElementById('emple_localidad').value = empleado.localidad || '';
        document.getElementById('emple_telefono').value = empleado.telefono;
        document.getElementById('emple_email').value = empleado.email;
        
        // 🔄 SINCRONIZACIÓN: Obtener horas del departamento asignado (buscar por NOMBRE)
        let horasAMostrar = empleado.horasContrato;
        if (typeof DepartamentosManager !== 'undefined') {
            const deptos = DepartamentosManager.obtenerDepartamentos();
            const depto = deptos.find(d => d.nombre === empleado.departamento);
            if (depto && depto.horasSemanales) {
                horasAMostrar = depto.horasSemanales;
                console.log(`[EmployeeManager] 🔄 Sincronizando horas de empleado ${empleado.nombre}: ${horasAMostrar}h/semana (departamento: ${depto.nombre})`);
            }
        }
        
        document.getElementById('emple_horas').value = horasAMostrar;
        document.getElementById('emple_turno').value = empleado.turnoPrincipal;
        document.getElementById('emple_estado').value = empleado.estado;
        
        const formulario = document.getElementById('formularioEmpleado');
        if (formulario) {
            formulario.style.display = 'block';
        }
    }

    static guardarEmpleado() {
        const nombre = document.getElementById('emple_nombre')?.value?.trim() || '';
        const departamento = document.getElementById('emple_departamento')?.value || '';
        const localidad = document.getElementById('emple_localidad')?.value?.trim() || '';
        const telefono = document.getElementById('emple_telefono')?.value?.trim() || '';
        const email = document.getElementById('emple_email')?.value?.trim() || '';
        const horas = parseInt(document.getElementById('emple_horas')?.value || 0);
        const turno = document.getElementById('emple_turno')?.value || '';
        const estado = document.getElementById('emple_estado')?.value || 'activo';

        if (!nombre || nombre.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!departamento) {
            alert('Debe seleccionar un departamento');
            return;
        }

        if (!localidad || localidad.length < 2) {
            alert('Debe ingresar una localidad válida');
            return;
        }

        if (!telefono || telefono.length < 9) {
            alert('Debe ingresar un número de teléfono válido');
            return;
        }

        if (!email || !this.validarEmail(email)) {
            alert('Debe ingresar un email válido');
            return;
        }

        if (isNaN(horas) || horas < 0 || horas > 240) {
            alert('Las horas deben estar entre 0 y 240');
            return;
        }

        if (!turno) {
            alert('Debe seleccionar un turno principal');
            return;
        }

        // 🔔 REACTIVIDAD: Detectar cambio de departamento O turnoPrincipal ANTES de modificar
        let huboNuevoDepartamento = false;
        let huboNuevoTurno = false;
        if (this.empleadoEnEdicion) {
            const empleadoAnterior = empleados.find(e => e.id === this.empleadoEnEdicion.id);
            if (empleadoAnterior) {
                huboNuevoDepartamento = empleadoAnterior.departamento && empleadoAnterior.departamento !== departamento;
                huboNuevoTurno = empleadoAnterior.turnoPrincipal && empleadoAnterior.turnoPrincipal !== turno;
            }
        }

        if (this.empleadoEnEdicion) {
            this.empleadoEnEdicion.nombre = nombre;
            this.empleadoEnEdicion.departamento = departamento;
            this.empleadoEnEdicion.localidad = localidad;
            this.empleadoEnEdicion.telefono = telefono;
            this.empleadoEnEdicion.email = email;
            this.empleadoEnEdicion.horasContrato = horas;
            this.empleadoEnEdicion.turnoPrincipal = turno;
            this.empleadoEnEdicion.estado = estado;
            
            alert('Empleado actualizado correctamente');
        } else {
            const nuevoId = Math.max(...empleados.map(e => e.id), 0) + 1;
            const nuevoEmpleado = {
                id: nuevoId,
                nombre: nombre,
                departamento: departamento,
                localidad: localidad,
                horasContrato: horas,
                turnoPrincipal: turno,
                estado: estado,
                email: email,
                telefono: telefono
            };
            empleados.push(nuevoEmpleado);
            alert('Empleado agregado correctamente');
        }

        this.guardarEnStorage();
        console.log('💾 EmployeeManager guardado en storage. Total empleados:', empleados.length);
        
        // 🔔 REACTIVIDAD COMPLETA: Emitir evento y regenerar si hubo cambio
        // IMPORTANTE: Emitir DESPUÉS de guardar en storage para que empleados[] esté actualizado
        if (this.empleadoEnEdicion && (huboNuevoDepartamento || huboNuevoTurno)) {
            console.log(`[EmployeeManager] 🔔 Cambio detectado - Depto: ${huboNuevoDepartamento}, Turno: ${huboNuevoTurno}`);
            
            if (huboNuevoDepartamento && typeof SistemaReactividad !== 'undefined') {
                SistemaReactividad.emit('cambio-departamento-empleado', {
                    empleadoId: this.empleadoEnEdicion.id,
                    nuevoDepartamento: departamento,
                    empleadoObj: this.empleadoEnEdicion
                });
            }
            
            // 🔥 REGENERACIÓN EN CASCADA: Si cambió departamento O turnoPrincipal, regenerar turnos
            if (huboNuevoDepartamento || huboNuevoTurno) {
                console.log(`[EmployeeManager] 🔄 Regenerando turnos - Empleado: ${this.empleadoEnEdicion.nombre}, Depto: ${departamento}, Turno: ${turno}`);
                
                const diasEnMes = DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth);
                const turnosActualizados = this.empleadoEnEdicion.localidad
                    ? TurnoManager.generarTurnosEmpleadoConLocalidad(this.empleadoEnEdicion, diasEnMes)
                    : TurnoManager.generarTurnosEmpleado(this.empleadoEnEdicion, diasEnMes);
                
                if (turnosActualizados && turnosActualizados.length > 0) {
                    AppState.scheduleData.set(this.empleadoEnEdicion.id, turnosActualizados);
                    AppState.saveToStorage();
                    console.log(`[EmployeeManager] ✅ ${turnosActualizados.length} turnos regenerados automáticamente`);
                    
                    // 🎨 Actualizar UI
                    if (typeof UI !== 'undefined') {
                        UI.generarCuadranteGeneral();
                        UI.generarCuadranteIndividual();
                    }
                    
                    if (typeof NotificationSystem !== 'undefined') {
                        NotificationSystem.show(`✅ Turnos regenerados automáticamente para ${this.empleadoEnEdicion.nombre}`, 'success');
                    }
                }
            }
        }
        
        this.cerrarModal();
    }

    static eliminarEmpleado(empleadoId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            return;
        }

        const indice = empleados.findIndex(e => e.id === empleadoId);
        if (indice !== -1) {
            const empleado = empleados[indice];
            empleados.splice(indice, 1);

            if (AppState && AppState.selectedEmployee?.id === empleadoId) {
                AppState.selectedEmployee = null;
                const select = document.getElementById('selectEmpleado');
                if (select) select.value = '';
            }

            this.guardarEnStorage();
            
            // Eliminar turnos del empleado de AppState
            AppState.scheduleData.delete(empleadoId);
            AppState.saveToStorage();
            
            this.actualizarListaEmpleados();
            
            // Actualizar filtro de localidades en el informe individual
            if (typeof llenarCentrosDeTrabajo !== 'undefined') {
                const selectCentro = document.getElementById('selectCentroTrabajo');
                if (selectCentro) {
                    // Limpiar opciones anteriores (excepto la primera)
                    while (selectCentro.options.length > 1) {
                        selectCentro.remove(1);
                    }
                    // Llenar nuevamente con las localidades actualizadas
                    llenarCentrosDeTrabajo();
                }
            }
            
            if (typeof UI !== 'undefined') {
                UI.generarCuadranteGeneral();
            }
            alert(`Empleado "${empleado.nombre}" eliminado`);
        }
    }

    static actualizarHorasPorDepartamento() {
        const departamentoSelect = document.getElementById('emple_departamento');
        const horasInput = document.getElementById('emple_horas');
        
        if (!departamentoSelect || !horasInput) return;
        
        const nombreDepartamento = departamentoSelect.value;
        
        // Obtener el departamento desde DepartamentosManager
        if (typeof DepartamentosManager !== 'undefined') {
            // Buscar por NOMBRE en la lista de departamentos (no por ID)
            const deptos = DepartamentosManager.obtenerDepartamentos();
            const depto = deptos.find(d => d.nombre === nombreDepartamento);
            
            if (depto && depto.horasSemanales) {
                horasInput.value = depto.horasSemanales;
                console.log(`[EmployeeManager] 🔄 Horas actualizadas: ${depto.horasSemanales}h/semana (departamento: ${depto.nombre})`);
                
                // Mostrar notificación visual
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show(`✅ Horas actualizadas a ${depto.horasSemanales}h/semana (${depto.nombre})`, 'success');
                }
            } else {
                console.warn(`[EmployeeManager] ⚠️ No encontré departamento: ${nombreDepartamento}`);
            }
        }
    }

    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static guardarEnStorage() {
        try {
            localStorage.setItem('empleadosData', JSON.stringify(empleados));
        } catch (error) {
            console.error('Error guardando empleados:', error);
        }
    }

    static cargarDelStorage() {
        try {
            const saved = localStorage.getItem('empleadosData');
            if (saved) {
                const empleadosCargados = JSON.parse(saved);
                if (empleadosCargados && Array.isArray(empleadosCargados) && empleadosCargados.length > 0) {
                    empleados.length = 0;
                    // Corregir URLs de foto si no tienen protocolo http://
                    empleadosCargados.forEach(emp => {
                        if (emp.foto && !emp.foto.startsWith('http://') && !emp.foto.startsWith('https://')) {
                            emp.foto = 'http://' + emp.foto;
                        }
                    });
                    empleados.push(...empleadosCargados);
                }
            }
        } catch (error) {
            console.error('Error cargando empleados:', error);
        }
    }

    // Guardar empleado en la BD (API)
    static guardarEmpleadoEnBD(empleado) { console.log("API deshabilitada"); }
}

class TurnoEditor {
    static mostrarModalEdicionMasiva() {
        console.log('[TurnoEditor] mostrarModalEdicionMasiva llamado');
        // Llamar a EdicionMasiva si existe
        if (typeof EdicionMasiva !== 'undefined' && EdicionMasiva.abrirModal) {
            EdicionMasiva.abrirModal();
        } else {
            console.warn('[TurnoEditor] EdicionMasiva no está disponible');
            const modal = document.getElementById('modalEdicionMasiva');
            if (modal) {
                modal.classList.add('active');
            }
        }
    }

    static abrirEditorTurno(empleadoId, dia, mes, anio) {
        const modal = document.getElementById('modalDescripcionTurno');
        if (!modal) return;

        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) return;

        // Usar mes y año pasados, o si no, usar los actuales
        const mesActual = mes !== undefined ? mes : AppState.currentMonth;
        const anioActual = anio !== undefined ? anio : AppState.currentYear;

        console.log('[abrirEditorTurno] Parámetros:', { empleadoId, dia, mes, anio, mesActual, anioActual });

        const turnos = AppState.scheduleData.get(empleadoId) || [];
        
        // FILTRAR por día Y mes/año
        const turnoObj = turnos.find(t => {
            if (t.dia !== dia) return false;
            if (!t.fecha) return true;  // Sin fecha, asumir correcto
            
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            const turnoMes = fecha.getMonth();
            const turnoAnio = fecha.getFullYear();
            
            return turnoMes === mesActual && turnoAnio === anioActual;
        });
        
        console.log('[abrirEditorTurno] Turno encontrado:', turnoObj, 'de', turnos.length, 'turnos totales');
        
        // Obtener tipo de turno - 🔧 CORREGIDO: Usar localStorage y buscar correctamente
        const tiposTurnoList = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};
        
        // 🔧 BUG FIX: turnoObj.turno es la CLAVE (ej: "tarde"), no la inicial
        const tipoTurno = tiposTurnoList[turnoObj?.turno] || Object.values(tiposTurnoList).find(tt => tt.inicial === turnoObj?.turno);

        // Llenar los campos del modal
        document.getElementById('tituloTurnoModal').textContent = `Editar Turno - ${empleado.nombre}`;
        document.getElementById('tipoTurnoDesc').textContent = tipoTurno?.nombre || turnoObj?.turno || '-';
        document.getElementById('horarioTurnoDesc').textContent = tipoTurno?.horario || '-';
        document.getElementById('horasEstandarDesc').textContent = (tipoTurno?.horas || turnoObj?.horas || 0) + 'h';
        document.getElementById('empleadoDesc').textContent = empleado.nombre;
        document.getElementById('diaDesc').textContent = dia;
        
        // Calcular fecha
        const fecha = new Date(anioActual, mesActual, dia);
        const fechaFormato = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('fechaDesc').textContent = fechaFormato;
        
        // Llenar campo de horas
        const horasEditarTurno = document.getElementById('horasEditarTurno');
        horasEditarTurno.value = turnoObj?.horas || 0;
        
        // Generar botones de turno rápido
        const opcionesDiv = document.getElementById('opcionesTurnosRapidas');
        if (opcionesDiv) {
            let html = '';
            Object.entries(tiposTurnoList).forEach(([key, tt]) => {
                // 🔧 BUG FIX: Comparar con la clave "tarde", "mañana", etc.
                const isSelected = key === turnoObj?.turno ? 'border: 3px solid #333;' : '';
                html += `
                    <button 
                        style="background: ${tt.color}; color: #0f172a; padding: 12px; border: 2px solid #ccc; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 14px; ${isSelected}"
                        onclick="TurnoEditor.cambiarTurnoRapido('${tt.inicial}', '${tt.nombre}', '${tt.horario}', ${tt.horas}, '${tt.color}')"
                        title="${tt.nombre}"
                    >
                        ${tt.inicial} - ${tt.nombre}
                    </button>
                `;
            });
            opcionesDiv.innerHTML = html;
        }
        
        // Guardar referencias para luego guardar los cambios
        modal.dataset.empleadoId = empleadoId;
        modal.dataset.dia = dia;
        modal.dataset.mes = mesActual;  // Guardar mes
        modal.dataset.anio = anioActual;  // Guardar año
        modal.dataset.turnoActual = turnoObj?.turno || '-';  // Inicializar con el turno actual
        
        console.log('[abrirEditorTurno] Modal dataset:', { empleadoId, dia, mes: mesActual, anio: anioActual });
        
        // Mostrar modal
        modal.classList.add('active');
    }

    static cambiarTurnoRapido(inicial, nombre, horario, horas, color) {
        document.getElementById('tipoTurnoDesc').textContent = nombre;
        document.getElementById('horarioTurnoDesc').textContent = horario;
        document.getElementById('horasEstandarDesc').textContent = horas + 'h';

        // Guardar el turno actual en el campo modal
        const modal = document.getElementById('modalDescripcionTurno');
        modal.dataset.turnoActual = inicial;  // Guardar como inicial

        console.log('Turno seleccionado:', inicial, 'Horas estándar:', horas);

        // Actualizar el input de horas con las horas estándar del turno seleccionado
        const horasInput = document.getElementById('horasEditarTurno');
        horasInput.value = horas;

        console.log('Actualizando horas al estándar del turno seleccionado:', horas);
    }

    static cerrarModal() {
        const modal = document.getElementById('modalEdicionMasiva');
        if (modal) modal.classList.remove('active');
    }

    static cerrarModalDescripcion() {
        const modal = document.getElementById('modalDescripcionTurno');
        if (modal) modal.classList.remove('active');
    }

    static guardarDescripcion() {
        const modal = document.getElementById('modalDescripcionTurno');
        if (!modal) return;

        const empleadoId = parseInt(modal.dataset.empleadoId);
        const dia = parseInt(modal.dataset.dia);
        const mesModal = parseInt(modal.dataset.mes);  // Mes guardado en el modal
        const anioModal = parseInt(modal.dataset.anio);  // Año guardado en el modal
        const horasInput = document.getElementById('horasEditarTurno');
        const turnoInicial = modal.dataset.turnoActual;

        console.log('[guardarDescripcion] Iniciando con:', { empleadoId, dia, mesModal, anioModal });

        if (!empleadoId || !dia) {
            console.error('Error: empleadoId o dia no definidos', { empleadoId, dia });
            alert('Error: No se pudo identificar el turno a editar');
            return;
        }

        // Obtener el turno actual
        const scheduleData = AppState.scheduleData.get(empleadoId);
        if (!scheduleData) {
            console.error('Error: No hay datos para este empleado', empleadoId);
            alert('Error: No hay datos para este empleado');
            return;
        }

        console.log('[guardarDescripcion] Total de turnos:', scheduleData.length);
        scheduleData.forEach((t, i) => {
            if (t.fecha) {
                const f = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                console.log(`  [${i}] dia=${t.dia} mes=${f.getMonth()} año=${f.getFullYear()} turno=${t.turno}`);
            }
        });

        // FILTRAR por mes/año guardado en el modal Y por día
        const turnoObj = scheduleData.find(t => {
            if (t.dia !== dia) return false;  // Mismo día
            if (!t.fecha) {
                console.log('[guardarDescripcion] Turno sin fecha encontrado');
                return true;  // Sin fecha, asumir que es correcto
            }
            
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            const turnoMes = fecha.getMonth();
            const turnoAnio = fecha.getFullYear();
            
            const coincide = turnoMes === mesModal && turnoAnio === anioModal;
            console.log(`[guardarDescripcion] Comparando turno dia ${t.dia}: mes ${turnoMes} vs ${mesModal}, año ${turnoAnio} vs ${anioModal} = ${coincide}`);
            return coincide;
        });
        
        if (!turnoObj) {
            console.error('Error: No se encontró el turno para el día', { empleadoId, dia, mesModal, anioModal });
            alert('Error: No se encontró el turno');
            return;
        }
        
        console.log('[guardarDescripcion] Turno encontrado:', turnoObj);

        // Convertir inicial a nombre de turno (si cambió)
        if (turnoInicial && turnoInicial !== '-') {
            // Buscar qué tipo de turno tiene esa inicial
            const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};
            let nombreTurnoNuevo = turnoInicial;  // Por defecto es la inicial
            
            // Buscar en tiposTurnoData
            for (const [key, value] of Object.entries(tiposTurnoData)) {
                if (value.inicial === turnoInicial) {
                    nombreTurnoNuevo = key;  // Usar el nombre del turno como clave
                    break;
                }
            }
            
            // Si no se encontró en tiposTurnoData, buscar en tiposTurno original
            if (nombreTurnoNuevo === turnoInicial) {
                for (const [key, value] of Object.entries(tiposTurno)) {
                    if (value.inicial === turnoInicial) {
                        nombreTurnoNuevo = key;
                        break;
                    }
                }
            }
            
            // 🔴 VALIDACIÓN CRÍTICA: Si es guardia, debe ser domingo o festivo
            if (nombreTurnoNuevo.toLowerCase().includes('guardia')) {
                const fecha = turnoObj.fecha instanceof Date ? turnoObj.fecha : new Date(turnoObj.fecha);
                const diaSemana = fecha.getDay();
                const esDomingo = diaSemana === 0;
                const esFestivo = typeof window.esFestivoLocal === 'function'
                    ? window.esFestivoLocal(fecha, empleadoId)
                    : (typeof window.esFestivo === 'function' ? window.esFestivo(fecha) : false);
                
                if (!esDomingo && !esFestivo) {
                    // NO es domingo ni festivo - bloquear asignación de guardia
                    const fechaFormato = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
                    NotificationSystem.show(`❌ Las guardias solo se pueden asignar a domingos o festivos. ${fechaFormato} es un día laboral normal.`, 'error', 4000);
                    console.warn(`[guardarDescripcion] ❌ Intento de asignar guardia a día laboral: ${nombreTurnoNuevo} el ${fechaFormato}`);
                    return;  // Cancelar el guardado
                }
            }
            
            if (nombreTurnoNuevo !== turnoObj.turno) {
                turnoObj.turno = nombreTurnoNuevo;
                
                // 🔧 BUG FIX: Obtener las horas Y horario estándar del nuevo turno
                // Primero intentar en tiposTurnoData del localStorage, luego en tiposTurno
                const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};
                let tipoData = tiposTurnoData[nombreTurnoNuevo] || tiposTurno[nombreTurnoNuevo] || {};
                turnoObj.horas = tipoData.horas || 0;
                turnoObj.horario = tipoData.horario || '';  // 🔧 NUEVO: También asignar horario
            }
        }

        // Actualizar horas si se ingresó un valor diferente
        if (horasInput && horasInput.value) {
            const horasNuevas = parseFloat(horasInput.value);
            if (horasNuevas >= 0 && horasNuevas <= 24) {
                turnoObj.horas = horasNuevas;
            }
        }

        console.log('Turno guardado:', { turno: turnoObj.turno, horas: turnoObj.horas, dia: turnoObj.dia, mes: mesModal, anio: anioModal });

        // Guardar en AppState
        const turnoAnterior = turnoObj.turno; // Guardar para notificar cambio
        AppState.scheduleData.set(empleadoId, scheduleData);
        AppState.saveToStorage();
        
        console.log('Datos guardados en AppState');

        // Actualizar window.informeActual si está activo (para que WhatsApp muestre datos actualizados)
        if (window.informeActual && window.informeActual.turnos) {
            window.informeActual.turnos = scheduleData;
            console.log('window.informeActual.turnos actualizado');
        }

        // Cerrar modal
        this.cerrarModalDescripcion();
        
        // 🔥 NOTIFICAR CAMBIO DE TURNO - Sistema centralizado de sincronización
        // Esto notificará a todos los observadores registrados (cuadrante general, individual, etc.)
        DataChangeManager.notifyShiftChange(empleadoId, dia, turnoAnterior, turnoObj.turno);
        
        // Fallback: Actualizar vistas manualmente por si acaso
        if (typeof mostrarCuadranteEmpleado === 'function') {
            console.log('Llamando mostrarCuadranteEmpleado para empleado:', empleadoId);
            mostrarCuadranteEmpleado(empleadoId);
        }
        
        if (typeof UI !== 'undefined' && typeof UI.generarCuadranteGeneral === 'function') {
            console.log('Llamando generarCuadranteGeneral');
            UI.generarCuadranteGeneral();
        }

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('✅ Turno guardado correctamente', 'success', 3000, {
                callback: (accion) => {
                    console.log('✅ Notificación de guardado cerrada');
                }
            });
        }
    }

    static guardarCambios() {
        // Guardar cambios pendientes
        if (AppState && typeof AppState.aplicarCambiosPendientes === 'function') {
            AppState.aplicarCambiosPendientes();
        }
    }
}

// =============================================
// CLASE: DepartmentManager
// =============================================
class DepartmentManager {
    static departamentos = JSON.parse(localStorage.getItem('departamentosData')) || [
        { id: 1, nombre: 'Operaciones', descripcion: 'Gestión operativa general' },
        { id: 2, nombre: 'Ventas', descripcion: 'Equipo comercial' },
        { id: 3, nombre: 'Administración', descripcion: 'Gestión administrativa' },
        { id: 4, nombre: 'Soporte Técnico', descripcion: 'Soporte a clientes' },
        { id: 5, nombre: 'Recursos Humanos', descripcion: 'Gestión de recursos humanos' },
        { id: 6, nombre: 'Marketing', descripcion: 'Marketing y comunicación' }
    ];

    static abrirModal() {
        const modal = document.getElementById('modalGestionDepartamentos');
        if (modal) {
            modal.classList.add('active');
            this.cargarListaDepartamentos();
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalGestionDepartamentos');
        if (modal) modal.classList.remove('active');
        this.limpiarFormulario();
    }

    static mostrarFormularioNuevo() {
        this.limpiarFormulario();
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('depto_nombre').focus();
        }
    }

    static cargarListaDepartamentos() {
        const lista = document.getElementById('listaDepartamentos');
        if (!lista) return;

        if (this.departamentos.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #cbd5e1; padding: 20px;">No hay departamentos registrados.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 10px;">';
        this.departamentos.forEach(depto => {
            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-weight: 600;">🏢 ${depto.nombre}</h4>
                            <p style="color: #7f8c8d; margin: 0; font-size: 0.9rem;">${depto.descripcion || 'Sin descripción'}</p>
                            <small style="color: #cbd5e1;">ID: ${depto.id}</small>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="DepartmentManager.editarDepartamento(${depto.id})" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="DepartmentManager.eliminarDepartamento(${depto.id})" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        lista.innerHTML = html;
    }

    static editarDepartamento(id) {
        const depto = this.departamentos.find(d => d.id === id);
        if (!depto) return;

        document.getElementById('departamentoIdEdicion').value = id;
        document.getElementById('depto_nombre').value = depto.nombre;
        document.getElementById('depto_descripcion').value = depto.descripcion || '';
        document.getElementById('depto_horasSemanales').value = depto.horasSemanales || 40;
        document.getElementById('depto_diasTrabajo').value = depto.diasTrabajo || 5;
        document.getElementById('depto_horasDiarias').value = depto.horasDiarias || 8;
        
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) formulario.style.display = 'block';
        
        document.getElementById('depto_nombre').focus();
    }

    static guardarDepartamento() {
        const nombre = document.getElementById('depto_nombre').value.trim();
        const descripcion = document.getElementById('depto_descripcion').value.trim();
        const horasSemanales = parseInt(document.getElementById('depto_horasSemanales').value) || 40;
        const diasTrabajo = parseInt(document.getElementById('depto_diasTrabajo').value) || 5;
        const horasDiarias = parseFloat(document.getElementById('depto_horasDiarias').value) || 8;
        const idEdicion = document.getElementById('departamentoIdEdicion').value;

        if (!nombre) {
            alert('Por favor, ingresa un nombre para el departamento');
            return;
        }

        let deptoGuardado = null;

        if (idEdicion) {
            // Editar departamento existente
            const depto = this.departamentos.find(d => d.id === parseInt(idEdicion));
            if (depto) {
                depto.nombre = nombre;
                depto.descripcion = descripcion;
                depto.horasSemanales = horasSemanales;
                depto.diasTrabajo = diasTrabajo;
                depto.horasDiarias = horasDiarias;
                deptoGuardado = depto;
            }
        } else {
            // Crear nuevo departamento
            const nuevoId = Math.max(...this.departamentos.map(d => d.id), 0) + 1;
            deptoGuardado = {
                id: nuevoId,
                nombre: nombre,
                descripcion: descripcion,
                horasSemanales: horasSemanales,
                diasTrabajo: diasTrabajo,
                horasDiarias: horasDiarias
            };
            this.departamentos.push(deptoGuardado);
        }

        this.guardarEnStorage();
        
        // 🔗 INTEGRACIÓN FASE 2: Sincronizar con DepartamentosManager
        if (typeof DepartamentosManager !== 'undefined' && deptoGuardado) {
            DepartamentosManager.sincronizarDepartamento(deptoGuardado);
        }
        
        // 🔔 REACTIVIDAD: Emitir evento de cambio de estándares
        if (typeof SistemaReactividad !== 'undefined' && deptoGuardado) {
            SistemaReactividad.emit('cambio-estandares-departamento', {
                departamento: deptoGuardado.nombre,
                horasSemanales: deptoGuardado.horasSemanales,
                diasTrabajo: deptoGuardado.diasTrabajo,
                horasDiarias: deptoGuardado.horasDiarias
            });
        }
        
        this.limpiarFormulario();
        this.cargarListaDepartamentos();
        
        // Actualizar filtros de departamentos en la tabla general
        this.actualizarFiltrosDepartamentos();
        
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(`Departamento '${nombre}' guardado (${horasSemanales}h/semana, ${diasTrabajo} días, ${horasDiarias}h/día)`, 'success');
        }
    }

    static eliminarDepartamento(id) {
        // Verificar si hay empleados en ese departamento
        const empleadosEnDepto = empleados.filter(e => {
            const depto = this.departamentos.find(d => d.id === id);
            return depto && e.departamento === depto.nombre;
        });

        if (empleadosEnDepto.length > 0) {
            alert(`No se puede eliminar este departamento porque hay ${empleadosEnDepto.length} empleado(s) asignado(s).\nPrimero, reasigna estos empleados a otro departamento.`);
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este departamento?')) {
            const deptoAEliminar = this.departamentos.find(d => d.id === id);
            this.departamentos = this.departamentos.filter(d => d.id !== id);
            this.guardarEnStorage();
            
            // 🔗 INTEGRACIÓN FASE 2: Sincronizar eliminación con DepartamentosManager
            if (typeof DepartamentosManager !== 'undefined' && deptoAEliminar) {
                const deptoId = deptoAEliminar.nombre.toLowerCase().replace(/\s+/g, '_');
                // Registrar eliminación en FASE 2 (opcional: crear método eliminarDepartamento en DepartamentosManager)
                console.log('[DepartmentManager] 🔗 Eliminado departamento sincronizado:', deptoAEliminar.nombre);
            }
            
            this.cargarListaDepartamentos();
            
            // Actualizar filtros de departamentos en la tabla general
            this.actualizarFiltrosDepartamentos();
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('Departamento eliminado correctamente', 'success');
            }
        }
    }

    static cancelarFormulario() {
        this.limpiarFormulario();
    }

    static limpiarFormulario() {
        document.getElementById('departamentoIdEdicion').value = '';
        document.getElementById('depto_nombre').value = '';
        document.getElementById('depto_descripcion').value = '';
        
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) formulario.style.display = 'none';
    }

    static guardarEnStorage() {
        localStorage.setItem('departamentosData', JSON.stringify(this.departamentos));
    }

    static obtenerListaDepartamentos() {
        return this.departamentos.map(d => d.nombre);
    }

    static actualizarFiltrosDepartamentos() {
        // Actualizar filtro del cuadrante general (filtroDepartamentoGeneral)
        const filtroDepartamentoGeneral = document.getElementById('filtroDepartamentoGeneral');
        if (filtroDepartamentoGeneral) {
            // Guardar selección actual
            const seleccionAnterior = filtroDepartamentoGeneral.value;
            
            // Limpiar opciones (excepto la primera que es vacía)
            while (filtroDepartamentoGeneral.options.length > 1) {
                filtroDepartamentoGeneral.remove(1);
            }
            
            // Obtener departamentos únicos del array empleados
            const departamentos = [...new Set(empleados.map(e => e.departamento))].sort();
            departamentos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto;
                option.textContent = depto;
                filtroDepartamentoGeneral.appendChild(option);
            });
            
            // Restaurar selección si aún existe
            if (departamentos.includes(seleccionAnterior)) {
                filtroDepartamentoGeneral.value = seleccionAnterior;
            }
        }
        
        // Actualizar filtro individual (selectDepartamentoIndividual)
        const selectDepartamentoIndividual = document.getElementById('selectDepartamentoIndividual');
        if (selectDepartamentoIndividual) {
            // Guardar selección actual
            const seleccionAnterior = selectDepartamentoIndividual.value;
            
            // Limpiar opciones (excepto la primera que es vacía)
            while (selectDepartamentoIndividual.options.length > 1) {
                selectDepartamentoIndividual.remove(1);
            }
            
            // Obtener departamentos del DepartmentManager
            const departamentos = [...new Set(this.departamentos.map(d => d.nombre))].sort();
            departamentos.forEach(depto => {
                const option = document.createElement('option');
                option.value = depto;
                option.textContent = depto;
                selectDepartamentoIndividual.appendChild(option);
            });
            
            // Restaurar selección si aún existe
            if (departamentos.includes(seleccionAnterior)) {
                selectDepartamentoIndividual.value = seleccionAnterior;
            }
        }
    }
}

// =============================================
// CLASE: LocationManager
// =============================================
class LocationManager {
    static localidades = JSON.parse(localStorage.getItem('localidadesData')) || [
        { id: 1, nombre: 'Madrid' },
        { id: 2, nombre: 'Barcelona' },
        { id: 3, nombre: 'Valencia' },
        { id: 4, nombre: 'Bilbao' },
        { id: 5, nombre: 'Sevilla' }
    ];

    static abrirModal() {
        const modal = document.getElementById('modalGestionLocalidades');
        if (modal) {
            modal.classList.add('active');
            this.cargarListaLocalidades();
            this.llenarSelectLocalidades();
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalGestionLocalidades');
        if (modal) modal.classList.remove('active');
        this.limpiarFormulario();
    }

    static mostrarFormularioNuevo() {
        this.limpiarFormulario();
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('loc_nombre').focus();
        }
    }

    static llenarSelectLocalidades() {
        const select = document.getElementById('emple_localidad');
        if (!select) return;

        // Limpiar opciones previas excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Agregar localidades
        this.localidades.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.nombre;
            option.textContent = loc.nombre;
            select.appendChild(option);
        });
    }

    static cargarListaLocalidades() {
        const lista = document.getElementById('listaLocalidades');
        if (!lista) return;

        if (this.localidades.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #cbd5e1; padding: 20px;">No hay localidades registradas.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 10px;">';
        this.localidades.forEach(loc => {
            // Contar empleados en esta localidad
            const empsEnLocalidad = empleados.filter(e => e.localidad === loc.nombre).length;
            
            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-weight: 600;">📍 ${loc.nombre}</h4>
                            <small style="color: #cbd5e1;">Empleados: ${empsEnLocalidad}</small>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="LocationManager.editarLocalidad(${loc.id})" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="LocationManager.eliminarLocalidad(${loc.id})" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;" ${empsEnLocalidad > 0 ? 'disabled' : ''}>
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        lista.innerHTML = html;
    }

    static editarLocalidad(id) {
        const loc = this.localidades.find(l => l.id === id);
        if (!loc) return;

        document.getElementById('localidadIdEdicion').value = id;
        document.getElementById('loc_nombre').value = loc.nombre;
        
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) formulario.style.display = 'block';
        
        document.getElementById('loc_nombre').focus();
    }

    static guardarLocalidad() {
        const nombre = document.getElementById('loc_nombre').value.trim();
        const idEdicion = document.getElementById('localidadIdEdicion').value;

        if (!nombre) {
            alert('Por favor, ingresa un nombre para la localidad');
            return;
        }

        // Validar que no exista otra localidad con el mismo nombre (excepto la que estamos editando)
        const existe = this.localidades.find(l => 
            l.nombre.toLowerCase() === nombre.toLowerCase() && 
            (!idEdicion || l.id !== parseInt(idEdicion))
        );

        if (existe) {
            alert('Ya existe una localidad con ese nombre');
            return;
        }

        if (idEdicion) {
            // Editar localidad existente
            const loc = this.localidades.find(l => l.id === parseInt(idEdicion));
            if (loc) {
                const nombreAnterior = loc.nombre;
                loc.nombre = nombre;
                
                // Actualizar empleados que tenían la localidad antigua
                empleados.forEach(emp => {
                    if (emp.localidad === nombreAnterior) {
                        emp.localidad = nombre;
                    }
                });
                EmployeeManager.guardarEnStorage();
            }
        } else {
            // Crear nueva localidad
            const nuevoId = Math.max(...this.localidades.map(l => l.id), 0) + 1;
            this.localidades.push({
                id: nuevoId,
                nombre: nombre
            });
        }

        this.guardarEnStorage();
        this.limpiarFormulario();
        this.cargarListaLocalidades();
        this.llenarSelectLocalidades();
        
        // Actualizar también el filtro del informe individual
        if (typeof llenarCentrosDeTrabajo !== 'undefined') {
            const selectCentro = document.getElementById('selectCentroTrabajo');
            if (selectCentro) {
                while (selectCentro.options.length > 1) {
                    selectCentro.remove(1);
                }
                llenarCentrosDeTrabajo();
            }
        }
        
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('Localidad guardada correctamente', 'success');
        }
    }

    static eliminarLocalidad(id) {
        // Verificar si hay empleados en esa localidad
        const loc = this.localidades.find(l => l.id === id);
        if (!loc) return;

        const empleadosEnLocalidad = empleados.filter(e => e.localidad === loc.nombre);

        if (empleadosEnLocalidad.length > 0) {
            alert(`No se puede eliminar esta localidad porque hay ${empleadosEnLocalidad.length} empleado(s) asignado(s).\nPrimero, reasigna estos empleados a otra localidad.`);
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar esta localidad?')) {
            this.localidades = this.localidades.filter(l => l.id !== id);
            this.guardarEnStorage();
            this.cargarListaLocalidades();
            this.llenarSelectLocalidades();
            
            // Actualizar también el filtro del informe individual
            if (typeof llenarCentrosDeTrabajo !== 'undefined') {
                const selectCentro = document.getElementById('selectCentroTrabajo');
                if (selectCentro) {
                    while (selectCentro.options.length > 1) {
                        selectCentro.remove(1);
                    }
                    llenarCentrosDeTrabajo();
                }
            }
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('Localidad eliminada correctamente', 'success');
            }
        }
    }

    static cancelarFormulario() {
        this.limpiarFormulario();
    }

    static limpiarFormulario() {
        document.getElementById('localidadIdEdicion').value = '';
        document.getElementById('loc_nombre').value = '';
        
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) formulario.style.display = 'none';
    }

    static guardarEnStorage() {
        localStorage.setItem('localidadesData', JSON.stringify(this.localidades));
    }

    static obtenerListaLocalidades() {
        return this.localidades.map(l => l.nombre);
    }
}

// =============================================
// CLASE: TurnoTypeManager
// =============================================
class TurnoTypeManager {
    static abrirModal() {
        const modal = document.getElementById('modalGestionTurnos');
        if (modal) {
            modal.classList.add('active');
            this.cargarListaTurnos();
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalGestionTurnos');
        if (modal) modal.classList.remove('active');
        this.limpiarFormulario();
    }

    static mostrarFormularioNuevo() {
        this.limpiarFormulario();
        const formulario = document.getElementById('formularioTurno');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('turno_nombre').focus();
        }
    }

    static cargarListaTurnos() {
        const lista = document.getElementById('listaTurnos');
        if (!lista) return;

        let html = '<div style="display: grid; gap: 10px;">';
        
        Object.entries(tiposTurno).forEach(([clave, turno]) => {
            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${turno.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-weight: 600;">
                                <span style="background: ${turno.color}; color: #0f172a; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-right: 8px;">${turno.inicial}</span>
                                ${turno.nombre}
                            </h4>
                            <p style="color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                                ⏱️ ${turno.horario} | ⏰ ${turno.horas}h
                            </p>
                            <small style="color: #cbd5e1;">Clave: ${clave}</small>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="TurnoTypeManager.editarTurno('${clave}')" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="TurnoTypeManager.eliminarTurno('${clave}')" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;">
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        lista.innerHTML = html;
    }

    static editarTurno(clave) {
        const turno = tiposTurno[clave];
        if (!turno) return;

        document.getElementById('turnoIdEdicion').value = clave;
        document.getElementById('turno_nombre').value = turno.nombre;
        document.getElementById('turno_inicial').value = turno.inicial;
        document.getElementById('turno_horario').value = turno.horario;
        document.getElementById('turno_horas').value = turno.horas;
        document.getElementById('turno_color').value = turno.color;
        document.getElementById('turno_color_hex').value = turno.color;
        
        const formulario = document.getElementById('formularioTurno');
        if (formulario) formulario.style.display = 'block';
        
        document.getElementById('turno_nombre').focus();
    }

    static guardarTurno() {
        const clave = document.getElementById('turnoIdEdicion').value;
        const nombre = document.getElementById('turno_nombre').value.trim();
        const inicial = document.getElementById('turno_inicial').value.trim();
        const horario = document.getElementById('turno_horario').value.trim();
        const horas = parseFloat(document.getElementById('turno_horas').value) || 0;
        const color = document.getElementById('turno_color').value;

        if (!nombre || !inicial || horas < 0) {
            alert('Por favor, completa los campos requeridos (Nombre, Inicial, Horas)');
            return;
        }

        if (clave) {
            // Editar turno existente
            tiposTurno[clave].nombre = nombre;
            tiposTurno[clave].inicial = inicial;
            tiposTurno[clave].horario = horario;
            tiposTurno[clave].horas = horas;
            tiposTurno[clave].color = color;
        } else {
            // Crear nuevo turno - usar el nombre en minúsculas como clave
            const nuevaClave = nombre.toLowerCase().replace(/\s+/g, '');
            
            if (tiposTurno[nuevaClave]) {
                alert('Ya existe un turno con ese nombre');
                return;
            }
            
            tiposTurno[nuevaClave] = {
                id: Object.keys(tiposTurno).length + 1,
                nombre: nombre,
                inicial: inicial,
                horario: horario,
                horas: horas,
                color: color
            };
        }

        this.guardarEnStorage();
        this.limpiarFormulario();
        this.cargarListaTurnos();
        
        // Regenerar cuadrantes para que reflejen los cambios en las horas
        if (typeof UI !== 'undefined') {
            UI.generarCuadranteGeneral();
            UI.generarCuadranteIndividual();
        }
        
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('Turno guardado correctamente', 'success');
        }
    }

    static eliminarTurno(clave) {
        // No permitir eliminar turnos predefinidos críticos
        const turnosProtegidos = ['descanso', 'vacaciones', 'baja'];
        if (turnosProtegidos.includes(clave)) {
            alert('No se puede eliminar este turno protegido');
            return;
        }

        // Verificar si hay empleados asignados a este turno
        let turnosUsados = 0;
        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            turnosUsados += turnos.filter(t => t.turno === clave).length;
        });

        if (turnosUsados > 0) {
            alert(`No se puede eliminar este turno porque hay ${turnosUsados} turno(s) asignado(s) a empleados.\nPrimero, cambia esos turnos a otro tipo.`);
            return;
        }

        if (confirm('¿Estás seguro de que deseas eliminar este turno?')) {
            delete tiposTurno[clave];
            this.guardarEnStorage();
            this.cargarListaTurnos();
            
            // Regenerar cuadrantes después de eliminar turno
            if (typeof UI !== 'undefined') {
                UI.generarCuadranteGeneral();
                UI.generarCuadranteIndividual();
            }
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('Turno eliminado correctamente', 'success');
            }
        }
    }

    static cancelarFormulario() {
        this.limpiarFormulario();
    }

    static limpiarFormulario() {
        document.getElementById('turnoIdEdicion').value = '';
        document.getElementById('turno_nombre').value = '';
        document.getElementById('turno_inicial').value = '';
        document.getElementById('turno_horario').value = '';
        document.getElementById('turno_horas').value = '';
        document.getElementById('turno_color').value = '#d4edda';
        document.getElementById('turno_color_hex').value = '#d4edda';
        
        const formulario = document.getElementById('formularioTurno');
        if (formulario) formulario.style.display = 'none';
    }

    static guardarEnStorage() {
        localStorage.setItem('tiposTurnoData', JSON.stringify(tiposTurno));
        // Regenerar leyenda dinámica cuando cambian los colores de turnos
        if (typeof generarLeyendaDinamica === 'function') {
            generarLeyendaDinamica();
        }
    }

    static cargarDelStorage() {
        const datos = localStorage.getItem('tiposTurnoData');
        if (datos) {
            try {
                const turnosCargados = JSON.parse(datos);
                Object.assign(tiposTurno, turnosCargados);
            } catch (e) {
                console.error('Error cargando tipos de turnos:', e);
            }
        }
    }
}

// =============================================
// CLASE: CalculadorHorasInteligente
// =============================================
// Calcula horas de forma inteligente considerando:
// - Contrato: 154h / mes
// - Base: 6.5h/día
// - Guardias: domingos/festivos trabajados (compensación: 1 día libre + €22)

class CalculadorHorasInteligente {
    static HORAS_BASE_DIARIA = 6.5;
    static COMPENSACION_GUARDIA_EUROS = 22;
    
    /**
     * Calcula el resumen de horas para un empleado en un mes específico
     * @param {number} empleadoId 
     * @param {number} mes 
     * @param {number} anio 
     * @returns {object} Objeto con cálculos detallados
     */
    static calcularResumenMensual(empleadoId, mes, anio) {
        // 🔧 GARANTIZAR QUE USAMOS LOS EMPLEADOS ACTUALES (desde localStorage)
        const empleadosActuales = JSON.parse(localStorage.getItem('empleadosData') || '[]');
        const empleado = empleadosActuales.find(e => e.id === empleadoId) || empleados.find(e => e.id === empleadoId);
        if (!empleado) return null;
        
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const turnosDelMes = turnos.filter(t => {
            if (!t.fecha) return false;
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            return fecha.getMonth() === mes && fecha.getFullYear() === anio;
        });
        
        // Calcular días trabajados (excluyendo descansos, vacaciones, baja)
        const diasTrabajados = turnosDelMes.filter(t => 
            t.turno && !['descanso', 'libre', 'baja', 'vacaciones', 'festivo'].includes(t.turno)
        );
        
        // Detectar guardias:
        // 1. Domingo O Festivo + cualquier turno de trabajo = GUARDIA
        // 2. Otros días + turno tipo "guardia" = GUARDIA
        const guardias = diasTrabajados.filter(t => {
            if (!t.fecha) return false;
            const diaSemana = t.fecha.getDay ? t.fecha.getDay() : new Date(t.fecha).getDay();
            const esDomingo = diaSemana === 0;
            const esFestivoTrabajado = esFestivo(t.fecha);
            const esGuardiaTipo = t.turno === 'guardia' || t.turno.includes('guardia');
            
            // Si es domingo O festivo = siempre guardia
            // Si es otro día = solo si es tipo "guardia"
            return (esDomingo || esFestivoTrabajado) || esGuardiaTipo;
        });
        
        // 🔧 CORRECCIÓN: Contar TODOS los descansos como compensados (no solo los explícitamente marcados)
        // Descansos = cualquier día con turno 'descanso' o 'libre'
        const descansosCompensados = turnosDelMes.filter(t => 
            t.turno === 'descanso' || t.turno === 'libre' || t.turno === 'descanso-compensado' || t.turno.includes('comp')
        ).length;
        
        // Calcular horas
        const horasDiasNormales = (diasTrabajados.length - guardias.length) * this.HORAS_BASE_DIARIA;
        const horasGuardias = guardias.length * this.HORAS_BASE_DIARIA;
        const compensacionEuroGuardias = guardias.length * this.COMPENSACION_GUARDIA_EUROS;
        
        const totalHorasTrabajadas = horasDiasNormales + horasGuardias;
        
        // Calcular balance vs contrato
        // Si el empleado tiene departamento, recalcular horas contrato automáticamente
        let horasContrato = empleado.horasContrato || 160;
        
        if (empleado.departamento && departamentosConfig[empleado.departamento]) {
            horasContrato = calcularHorasContratoPorDepartamento(empleado.departamento, mes, anio);
            console.log(`[CalculadorHoras] Empleado: ${empleado.nombre} | Depto: ${empleado.departamento} | Horas calculadas: ${horasContrato}h`);
        }
        
        const diasNecesarios = Math.ceil(horasContrato / this.HORAS_BASE_DIARIA);
        const balance = totalHorasTrabajadas - horasContrato;
        const cumple = totalHorasTrabajadas >= horasContrato;
        
        return {
            empleadoId,
            empleadoNombre: empleado.nombre,
            mes,
            anio,
            horasContrato,
            diasNecesarios,
            
            // Detalle de trabajo
            diasTrabajados: diasTrabajados.length,
            diasNormales: diasTrabajados.length - guardias.length,
            diasGuardias: guardias.length,
            descansosCompensados,
            descansosFaltantes: Math.max(0, guardias.length - descansosCompensados), // 🔧 Descansos que FALTA tomar para compensar guardias
            
            // Horas
            horasDiasNormales,
            horasGuardias,
            totalHorasTrabajadas,
            balance,
            balanceFormato: balance >= 0 ? `+${balance.toFixed(2)}h` : `${balance.toFixed(2)}h`,
            cumple,
            
            // Compensación
            compensacionEuroGuardias,
            
            // Detalles
            guardiasList: guardias.map(g => ({
                dia: g.dia,
                fecha: g.fecha ? new Date(g.fecha).toLocaleDateString('es-ES') : 'N/A',
                turno: g.turno
            }))
        };
    }
    
    /**
     * Genera resumen visual para mostrar en cuadrante
     */
    static generarResumenHTML(resumen, empleado) {
        if (!resumen) return '<p style="color: red;">Error calculando resumen</p>';
        
        // 🔧 Usar el valor directo de empleado si está disponible, fallback a resumen
        const horasContrato = empleado ? empleado.horasContrato : resumen.horasContrato;
        
        const colorBalance = resumen.balance >= 0 ? '#22c55e' : '#ef4444';
        const iconBalance = resumen.balance >= 0 ? '✅' : '⚠️';
        
        return `
            <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 20px; border-radius: 12px; border: 1px solid #475569; margin: 15px 0;">
                <h4 style="color: #f1f5f9; margin: 0 0 15px 0; font-size: 16px; font-weight: 700;">📊 Resumen Mensuales</h4>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 15px;">
                    <div style="padding: 15px; background: linear-gradient(135deg, #34d399 0%, rgba(16, 185, 129, 0.2) 100%); border-radius: 8px; border-left: 4px solid #34d399;">
                        <div style="color: #0f172a; font-size: 14px; font-weight: 600;">⏱️ HORAS CONTRATO</div>
                        <div style="color: #f1f5f9; font-size: 18px; font-weight: 700; margin-top: 6px;">${horasContrato}h</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #22c55e 0%, rgba(34, 197, 94, 0.2) 100%); padding: 12px; border-radius: 8px; border-left: 3px solid #34d399;">
                        <div style="color: #0f172a; font-size: 11px; font-weight: 600;">Horas Trabajadas</div>
                        <div style="color: #86efac; font-size: 18px; font-weight: 700; margin-top: 4px;">${resumen.totalHorasTrabajadas.toFixed(2)}h</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, ${colorBalance} 0%, rgba(${colorBalance === '#22c55e' ? '34, 197, 94' : '239, 68, 68'}, 0.2) 100%); padding: 12px; border-radius: 8px; border-left: 3px solid ${colorBalance};">
                        <div style="color: #0f172a; font-size: 11px; font-weight: 600;">Balance</div>
                        <div style="color: ${colorBalance}; font-size: 18px; font-weight: 700; margin-top: 4px;">${iconBalance} ${resumen.balanceFormato}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
                    <div style="background: linear-gradient(135deg, #f97316 0%, rgba(249, 115, 22, 0.15) 100%); padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="color: #0f172a; font-size: 10px;">Días Trabajados</div>
                        <div style="color: #fed7aa; font-size: 16px; font-weight: 700;">${resumen.diasTrabajados}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #a78bfa 0%, rgba(139, 92, 246, 0.15) 100%); padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="color: #0f172a; font-size: 10px;">Guardias Trabajadas</div>
                        <div style="color: #e9d5ff; font-size: 16px; font-weight: 700;">${resumen.diasGuardias}</div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, ${resumen.descansosFaltantes > 0 ? '#ef4444' : '#a78bfa'} 0%, rgba(${resumen.descansosFaltantes > 0 ? '239, 68, 68' : '168, 85, 247'}, 0.15) 100%); padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="color: #0f172a; font-size: 10px;">Descansos Comp.</div>
                        <div style="color: ${resumen.descansosFaltantes > 0 ? '#fca5a5' : '#d8b4fe'}; font-size: 16px; font-weight: 700;">
                            ${resumen.descansosCompensados}${resumen.descansosFaltantes > 0 ? ` ⚠️ Faltan: ${resumen.descansosFaltantes}` : ''}
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #22c55e 0%, rgba(34, 197, 94, 0.15) 100%); padding: 10px; border-radius: 6px; text-align: center;">
                        <div style="color: #0f172a; font-size: 10px;">Comp. Guardias €</div>
                        <div style="color: #86efac; font-size: 16px; font-weight: 700;">€${resumen.compensacionEuroGuardias.toFixed(2)}</div>
                    </div>
                </div>
                
                ${resumen.guardiasList.length > 0 ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #475569;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0; font-weight: 600;">📍 Guardias Trabajadas:</p>
                        <div style="color: #f1f5f9; font-size: 12px; line-height: 1.6;">
                            ${resumen.guardiasList.map(g => `
                                <div>• Día ${g.dia} (${g.fecha}) - ${g.turno}</div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

/**
 * 🔧 FUNCIONES DE DEBUG - Llamar desde consola
 */
window.debugTurnosSamantha = function() {
    const samantha = empleados.find(e => e.id === 12);
    if (!samantha) {
        console.log('❌ Samantha no encontrada');
        return;
    }
    
    console.log('👤 Empleado:', samantha.nombre);
    console.log('📊 Contrato:', samantha.horasContrato, 'h');
    console.log('🏢 Departamento:', samantha.departamento);
    
    const turnos = AppState.scheduleData.get(12) || [];
    const turnosNoviembre = turnos.filter(t => {
        if (!t.fecha) return false;
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return fecha.getMonth() === 11 && fecha.getFullYear() === 2025;
    });
    
    console.log('📋 Total turnos noviembre:', turnosNoviembre.length);
    console.log('🔍 Detalle de turnos:');
    
    turnosNoviembre.forEach((t, i) => {
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        const diaSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][fecha.getDay()];
        console.log(`  Día ${t.dia} (${diaSemana}): ${t.turno} - ${t.horas}h`);
    });
    
    // Detectar guardias manualmente
    const guardias = turnosNoviembre.filter(t => {
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        const diaSemana = fecha.getDay();
        return diaSemana === 0 || t.turno === 'guardia' || t.turno.includes('guardia');
    });
    
    console.log('🚨 Guardias detectadas:', guardias.length);
    guardias.forEach(g => {
        console.log(`  - Día ${g.dia}: ${g.turno}`);
    });
};

window.debugTurnosSamanthaSimple = function() {
    console.clear();
    const samantha = empleados.find(e => e.id === 12);
    const turnos = AppState.scheduleData.get(12) || [];
    
    // USAR EL MES ACTUAL DE LA APP
    const mesActual = AppState.currentMonth !== undefined ? AppState.currentMonth : 11;
    const anioActual = AppState.currentYear || 2025;
    
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    const turnosDelMes = turnos.filter(t => {
        if (!t.fecha) return false;
        const f = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return f.getMonth() === mesActual && f.getFullYear() === anioActual;
    });
    
    console.log('👤 SAMANTHA VALENCIA - ' + meses[mesActual].toUpperCase() + ' ' + anioActual);
    console.log('📊 Contrato:', samantha.horasContrato, 'h');
    console.log('Total turnos:', turnosDelMes.length);
    console.log('');
    
    turnosDelMes.forEach(t => {
        const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        const diaSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][fecha.getDay()];
        console.log(`  Día ${t.dia} (${diaSemana}): ${t.turno} (${t.horas}h)`);
    });
    
    console.log('');
    // Contar guardias
    const tiposGuardia = turnosDelMes.filter(t => 
        t.turno === 'guardia' || t.turno.includes('guardia')
    );
    console.log('🚨 Turnos tipo "guardia":', tiposGuardia.length);
    
    const domingos = turnosDelMes.filter(t => {
        const f = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
        return f.getDay() === 0;
    });
    console.log('📅 Domingos trabajados:', domingos.length);
};

// =============================================
// CLASE: ChatBot - Asistente Inteligente
// =============================================
class ChatBot {
    static abrirModal() {
        const modal = document.getElementById('modalChatBot');
        if (modal) {
            modal.classList.add('active');
            // Enfocar el input después de un pequeño delay para que el modal se abra
            setTimeout(() => {
                const input = document.getElementById('chatInput');
                if (input) input.focus();
            }, 100);
        }
    }

    static cerrarModal() {
        const modal = document.getElementById('modalChatBot');
        if (modal) modal.classList.remove('active');
    }

    static enviarMensaje() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const pregunta = input.value.trim();
        if (!pregunta) return;

        // Agregar mensaje del usuario
        this.agregarMensajeUsuario(pregunta);

        // Limpiar input
        input.value = '';

        // Procesar la pregunta y mostrar respuesta
        setTimeout(() => {
            const respuesta = this.procesarPregunta(pregunta);
            this.agregarMensajeBot(respuesta);
        }, 500); // Pequeño delay para simular procesamiento
    }

    static agregarMensajeUsuario(texto) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const mensajeDiv = document.createElement('div');
        mensajeDiv.style.cssText = `
            display: flex;
            justify-content: flex-end;
            margin-bottom: 16px;
        `;

        mensajeDiv.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 18px 18px 4px 18px;
                max-width: 70%;
                word-wrap: break-word;
                box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2);
            ">
                ${this.escapeHtml(texto)}
            </div>
        `;

        container.appendChild(mensajeDiv);
        this.scrollToBottom();
    }

    static agregarMensajeBot(texto) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const mensajeDiv = document.createElement('div');
        mensajeDiv.style.cssText = `
            display: flex;
            justify-content: flex-start;
            margin-bottom: 16px;
        `;

        mensajeDiv.innerHTML = `
            <div style="
                background: white;
                color: #1e293b;
                padding: 12px 16px;
                border-radius: 18px 18px 18px 4px;
                max-width: 70%;
                word-wrap: break-word;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                border: 1px solid #e2e8f0;
            ">
                ${this.escapeHtml(texto).replace(/\n/g, '<br>')}
            </div>
        `;

        container.appendChild(mensajeDiv);
        this.scrollToBottom();
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static scrollToBottom() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    static limpiarChat() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; color: #64748b; font-style: italic; margin-top: 20px;">
                    Chat limpiado. ¡Hola! Soy tu asistente inteligente. Pregúntame sobre empleados, turnos o la aplicación.
                </div>
            `;
        }
    }

    static procesarPregunta(pregunta) {
        const preguntaLower = pregunta.toLowerCase().trim();

        // PREGUNTAS SOBRE DOCUMENTACIÓN Y ARQUITECTURA (usando DocumentAnalyzer)
        if (this.coincide(preguntaLower, ['cómo funciona', 'como funciona', 'cómo se', 'explicame', 'explícame', 'cómo es', 'arquitectura', 'estructura'])) {
            if (typeof DocumentAnalyzer !== 'undefined') {
                return DocumentAnalyzer.generarRespuesta(pregunta);
            }
        }

        if (this.coincide(preguntaLower, ['resumen', 'summary', 'resumir', 'explicación general', 'visión general'])) {
            if (typeof DocumentAnalyzer !== 'undefined') {
                return DocumentAnalyzer.generarResumen(pregunta);
            }
        }

        if (this.coincide(preguntaLower, ['mapa', 'diagrama', 'visual', 'estructura', 'organigrama'])) {
            if (typeof DocumentAnalyzer !== 'undefined') {
                return DocumentAnalyzer.generarMapaMental(pregunta);
            }
        }

        if (this.coincide(preguntaLower, ['qué es', 'que es', 'definición', 'significado'])) {
            if (typeof DocumentAnalyzer !== 'undefined') {
                return DocumentAnalyzer.explicarQue(pregunta);
            }
        }

        if (this.coincide(preguntaLower, ['estadísticas de documentación', 'cuantos documentos', 'documentación disponible'])) {
            if (typeof DocumentAnalyzer !== 'undefined') {
                return DocumentAnalyzer.estadisticasDocumentacion();
            }
        }

        // Preguntas sobre empleados
        if (this.coincide(preguntaLower, ['cuántos empleados', 'numero empleados', 'cuantos empleados', 'total empleados', 'empleados registrados'])) {
            return this.contarEmpleados();
        }

        if (this.coincide(preguntaLower, ['empleados por departamento', 'departamentos', 'por departamento', 'depto'])) {
            return this.empleadosPorDepartamento();
        }

        if (this.coincide(preguntaLower, ['empleados en', 'localidad', 'localidades', 'por localidad', 'ubicacion'])) {
            return this.empleadosPorLocalidad();
        }

        // Buscar nombre en pregunta para muchos contextos
        const nombre = this.extraerNombre(pregunta);

        if (this.coincide(preguntaLower, ['información de', 'datos de', 'info de', 'quién es', 'quien es', 'detalles de', 'perfil de']) && nombre) {
            return this.infoEmpleado(nombre);
        }

        if (this.coincide(preguntaLower, ['horas de', 'contrato de', 'cuantas horas', 'cuántas horas', 'horas contrato', 'horario contrato']) && nombre) {
            return this.horasContratoEmpleado(nombre);
        }

        // Preguntas sobre turnos
        if (this.coincide(preguntaLower, ['turnos de', 'turno de', 'mis turnos', 'cuales son los turnos', 'cuáles son los turnos']) && nombre) {
            return this.turnosEmpleadoMes(nombre);
        }

        if (this.coincide(preguntaLower, ['horas trabajadas', 'total horas', 'cuantas horas trabajo', 'cuántas horas trabajo', 'horas trabajadas por', 'horas acumuladas']) && nombre) {
            return this.horasTrabajadasMes(nombre);
        }

        if (this.coincide(preguntaLower, ['estadísticas', 'estadisticas', 'resumen mes', 'resumen del mes', 'datos del mes', 'balance mes'])) {
            return this.estadisticasMes();
        }

        // Buscar tipo de turno en cualquier pregunta
        const tipoTurno = this.extraerTipoTurno(preguntaLower);
        if (tipoTurno) {
            // Preguntas sobre horas de un turno específico
            if (this.coincide(preguntaLower, ['cuantas horas', 'cuántas horas', 'horas', 'horario', 'hora trabaja', 'hora trabajo', 'cuantas horas trabaja'])) {
                return this.horasTurno(tipoTurno);
            }
            // Preguntas sobre cuántos turnos de ese tipo
            if (this.coincide(preguntaLower, ['cuantos turnos', 'cuántos turnos', 'turnos de', 'turnos en', 'total turnos'])) {
                return this.contarTurnosTipo(tipoTurno);
            }
        }

        // Preguntas sobre la aplicación
        if (this.coincide(preguntaLower, ['ayuda', 'qué puedo', 'que puedo', 'comandos', 'preguntas', 'ejemplos'])) {
            return this.ayuda();
        }

        if (this.coincide(preguntaLower, ['versión', 'version', 'qué versión', 'que version'])) {
            return this.version();
        }

        if (this.coincide(preguntaLower, ['funciones', 'características', 'caracteristicas', 'qué hace', 'que hace', 'capacidades', 'features'])) {
            return this.caracteristicas();
        }

        // Preguntas específicas sobre fechas y estados
        if (this.coincide(preguntaLower, ['mes actual', 'qué mes', 'que mes', 'mes de hoy', 'en qué mes', 'en que mes'])) {
            return this.mesActual();
        }

        if (this.coincide(preguntaLower, ['vacaciones', 'de vacaciones', 'en vacaciones', 'quiénes de vacaciones', 'quienes de vacaciones', 'empleados vacaciones'])) {
            return this.empleadosVacaciones();
        }

        if (this.coincide(preguntaLower, ['baja', 'de baja', 'en baja', 'quiénes de baja', 'quienes de baja', 'empleados baja', 'baja médica'])) {
            return this.empleadosBaja();
        }

        // Si tiene un nombre pero no coincide con ningún patrón específico
        if (nombre) {
            return this.infoEmpleado(nombre);
        }

        // Si no entiende la pregunta, intenta con DocumentAnalyzer
        if (typeof DocumentAnalyzer !== 'undefined') {
            const respuestaDoc = DocumentAnalyzer.generarRespuesta(pregunta);
            if (!respuestaDoc.includes('No encontré')) {
                return respuestaDoc;
            }
        }

        // Si no entiende la pregunta
        return this.preguntaNoEntendida();
    }

    static coincide(texto, palabraClave) {
        if (Array.isArray(palabraClave)) {
            return palabraClave.some(palabra => texto.includes(palabra));
        }
        return texto.includes(palabraClave);
    }

    static extraerTipoTurno(preguntaLower) {
        // Buscar en los turnos que realmente existen en tiposTurno
        if (window.tiposTurno) {
            for (const [clave, turno] of Object.entries(tiposTurno)) {
                // Buscar por clave (ej: "t6", "tarde", "mixto")
                if (preguntaLower.includes(clave.toLowerCase())) {
                    return clave;
                }
                // Buscar por nombre del turno
                if (preguntaLower.includes(turno.nombre.toLowerCase())) {
                    return clave;
                }
            }
        }
        
        // Fallback a búsqueda de palabras clave básicas
        if (preguntaLower.includes('mañana')) return 'mañana';
        if (preguntaLower.includes('tarde')) return 'tarde';
        if (preguntaLower.includes('noche')) return 'noche';
        if (preguntaLower.includes('mixto')) return 'mixto';
        if (preguntaLower.includes('descanso')) return 'descanso';
        return null;
    }

    static contarEmpleados() {
        const activos = empleados.filter(e => e.estado === 'activo').length;
        const total = empleados.length;
        return `📊 Hay ${total} empleados registrados, de los cuales ${activos} están activos.`;
    }

    static empleadosPorDepartamento() {
        const porDepto = {};
        empleados.forEach(emp => {
            porDepto[emp.departamento] = (porDepto[emp.departamento] || 0) + 1;
        });

        let respuesta = '🏢 Empleados por departamento:\n';
        Object.entries(porDepto).forEach(([depto, count]) => {
            respuesta += `• ${depto}: ${count} empleados\n`;
        });
        return respuesta;
    }

    static empleadosPorLocalidad() {
        const porLocalidad = {};
        empleados.forEach(emp => {
            porLocalidad[emp.localidad] = (porLocalidad[emp.localidad] || 0) + 1;
        });

        let respuesta = '📍 Empleados por localidad:\n';
        Object.entries(porLocalidad).forEach(([localidad, count]) => {
            respuesta += `• ${localidad}: ${count} empleados\n`;
        });
        return respuesta;
    }

    static extraerNombre(pregunta) {
        // Buscar nombres de empleados en la pregunta
        // Primero intenta nombres completos (más específicos)
        const preguntaLower = pregunta.toLowerCase();
        
        for (const emp of empleados) {
            if (preguntaLower.includes(emp.nombre.toLowerCase())) {
                return emp.nombre;
            }
        }
        
        // Intenta buscar por apellido o nombre parcial
        for (const emp of empleados) {
            const partes = emp.nombre.split(' ');
            for (const parte of partes) {
                if (parte.length > 2 && preguntaLower.includes(parte.toLowerCase())) {
                    return emp.nombre;
                }
            }
        }
        
        return null;
    }

    static infoEmpleado(nombre) {
        const emp = empleados.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
        if (!emp) return `❌ No encontré al empleado "${nombre}".`;

        return `👤 Información de ${emp.nombre}:
• Departamento: ${emp.departamento}
• Localidad: ${emp.localidad}
• Horas de contrato: ${emp.horasContrato}h/mes
• Turno principal: ${emp.turnoPrincipal}
• Estado: ${emp.estado}
• Email: ${emp.email}
• Teléfono: ${emp.telefono}`;
    }

    static horasContratoEmpleado(nombre) {
        const emp = empleados.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
        if (!emp) return `❌ No encontré al empleado "${nombre}".`;

        return `⏰ ${emp.nombre} tiene ${emp.horasContrato} horas de contrato mensual en el departamento de ${emp.departamento}.`;
    }

    static turnosEmpleadoMes(nombre) {
        const emp = empleados.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
        if (!emp) return `❌ No encontré al empleado "${nombre}".`;

        const turnosEmp = AppState.scheduleData.get(emp.id) || [];
        if (turnosEmp.length === 0) return `📅 No hay turnos registrados para ${emp.nombre} este mes.`;

        const tiposTurno = {};
        turnosEmp.forEach(t => {
            tiposTurno[t.turno] = (tiposTurno[t.turno] || 0) + 1;
        });

        let respuesta = `📅 Turnos de ${emp.nombre} en ${this.nombreMes(AppState.currentMonth)} ${AppState.currentYear}:\n`;
        Object.entries(tiposTurno).forEach(([turno, count]) => {
            const infoTurno = window.tiposTurno?.[turno];
            const horas = infoTurno ? infoTurno.horas : '?';
            respuesta += `• ${turno}: ${count} días (${horas}h cada uno = ${count * horas}h)\n`;
        });

        const totalHoras = turnosEmp.reduce((sum, t) => {
            const infoTurno = window.tiposTurno?.[t.turno];
            return sum + (infoTurno ? infoTurno.horas : 0);
        }, 0);

        respuesta += `\n💰 Total horas trabajadas: ${totalHoras}h`;
        return respuesta;
    }

    static horasTrabajadasMes(nombre) {
        const emp = empleados.find(e => e.nombre.toLowerCase() === nombre.toLowerCase());
        if (!emp) return `❌ No encontré al empleado "${nombre}".`;

        const turnosEmp = AppState.scheduleData.get(emp.id) || [];
        const totalHoras = turnosEmp.reduce((sum, t) => {
            const infoTurno = window.tiposTurno?.[t.turno];
            return sum + (infoTurno ? infoTurno.horas : 0);
        }, 0);

        const contrato = emp.horasContrato;
        const porcentaje = contrato > 0 ? ((totalHoras / contrato) * 100).toFixed(1) : 0;

        return `⏱️ ${emp.nombre} ha trabajado ${totalHoras} horas este mes (${porcentaje}% de su contrato de ${contrato}h).`;
    }

    static estadisticasMes() {
        const totalEmpleados = empleados.length;
        let totalHoras = 0;
        let turnosAsignados = 0;

        empleados.forEach(emp => {
            const turnosEmp = AppState.scheduleData.get(emp.id) || [];
            turnosEmp.forEach(t => {
                const infoTurno = window.tiposTurno?.[t.turno];
                totalHoras += infoTurno ? infoTurno.horas : 0;
                turnosAsignados++;
            });
        });

        const promedioHoras = totalEmpleados > 0 ? (totalHoras / totalEmpleados).toFixed(1) : 0;

        return `📊 Estadísticas de ${this.nombreMes(AppState.currentMonth)} ${AppState.currentYear}:
• Total empleados: ${totalEmpleados}
• Turnos asignados: ${turnosAsignados}
• Horas totales trabajadas: ${totalHoras}h
• Promedio horas por empleado: ${promedioHoras}h`;
    }

    static contarTurnosTipo(tipo) {
        let count = 0;
        empleados.forEach(emp => {
            const turnosEmp = AppState.scheduleData.get(emp.id) || [];
            count += turnosEmp.filter(t => t.turno === tipo).length;
        });

        const infoTurno = window.tiposTurno?.[tipo];
        const horas = infoTurno ? infoTurno.horas : 8;

        return `🌅 Hay ${count} turnos de ${tipo} asignados este mes (${count * horas}h totales).`;
    }

    static horasTurno(tipoTurno) {
        const infoTurno = window.tiposTurno?.[tipoTurno];
        if (!infoTurno) return `❌ No encontré información del turno "${tipoTurno}".`;

        return `⏰ El turno ${infoTurno.nombre} (${tipoTurno}) trabaja ${infoTurno.horas} horas al día.
• Horario: ${infoTurno.horario}
• Código: ${tipoTurno}`;
    }

    static empleadosVacaciones() {
        const enVacaciones = empleados.filter(e => e.estado === 'vacaciones');
        if (enVacaciones.length === 0) return '🏖️ No hay empleados de vacaciones actualmente.';

        let respuesta = `🏖️ Empleados de vacaciones (${enVacaciones.length}):\n`;
        enVacaciones.forEach(emp => {
            respuesta += `• ${emp.nombre} (${emp.departamento})\n`;
        });
        return respuesta;
    }

    static empleadosBaja() {
        const deBaja = empleados.filter(e => e.estado === 'baja');
        if (deBaja.length === 0) return '⚠️ No hay empleados de baja actualmente.';

        let respuesta = `⚠️ Empleados de baja (${deBaja.length}):\n`;
        deBaja.forEach(emp => {
            respuesta += `• ${emp.nombre} (${emp.departamento})\n`;
        });
        return respuesta;
    }

    static mesActual() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return `📅 Estamos en ${meses[AppState.currentMonth]} de ${AppState.currentYear}.`;
    }

    static nombreMes(mesIndex) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[mesIndex] || 'Mes desconocido';
    }

    static ayuda() {
        return `🤖 Preguntas que puedes hacer:

👥 **Sobre empleados:**
• "¿Cuántos empleados hay?"
• "¿Empleados por departamento?"
• "¿Información de [nombre]?"
• "¿Horas de contrato de [nombre]?"

📅 **Sobre turnos:**
• "¿Turnos de [nombre]?"
• "¿Horas trabajadas de [nombre]?"
• "¿Cuántos turnos de mañana/tarde/noche?"
• "¿Estadísticas del mes?"

📚 **NUEVO: Sobre la aplicación (Análisis Inteligente):**
• "¿Cómo funciona el sistema?"
• "Resumen de la arquitectura"
• "Mapa mental del sistema"
• "¿Qué es AppState?"
• "¿Cómo funciona la exportación?"
• "Estadísticas de documentación"

🏢 **Sobre la aplicación:**
• "¿Qué funciones tiene?"
• "¿Empleados de vacaciones?"
• "¿Qué mes es?"

💡 **Ejemplos:**
• "¿Cuántas horas ha trabajado María?"
• "¿Quiénes están de vacaciones?"
• "¿Cómo editar turnos masivamente?"
• "Resumen de datos"`;
    }

    static version() {
        return `📋 Versión del Sistema de Gestión de Turnos: v9.3
Última actualización: Diciembre 2025
Características: Gestión de turnos, empleados, reportes, exportación PDF/WhatsApp`;
    }

    static caracteristicas() {
        return `🚀 Características principales:

👥 **Gestión de Empleados**
• CRUD completo de empleados
• Departamentos y localidades
• Estados (activo, vacaciones, baja)

📅 **Gestión de Turnos**
• Turnos predefinidos (mañana, tarde, noche, etc.)
• Edición individual y masiva
• Cálculo automático de horas

📊 **Reportes y Estadísticas**
• Reportes por empleado
• Estadísticas mensuales
• Exportación PDF y Excel

💬 **Integraciones**
• WhatsApp para envío de cuadrantes
• Exportación a Excel
• Persistencia local (localStorage)

🔧 **Funcionalidades Avanzadas**
• Balanceo automático de turnos
• Validaciones inteligentes
• Sistema de permisos`;
    }

    static preguntaNoEntendida() {
        const sugerencias = [
            '❓ No entendí exactamente tu pregunta.',
            '',
            '💡 **Intenta preguntar así:**',
            '• "Cuántos empleados hay"',
            '• "Información de María"',
            '• "Horas trabajadas de Juan"',
            '• "Estadísticas del mes"',
            '• "Empleados de vacaciones"',
            '• "Turnos de noche"',
            '',
            '📝 **O escribe "ayuda" para ver todos los comandos disponibles.**'
        ];
        
        return sugerencias.join('\n');
    }
}

// =============================================
// FIN DE MÓDULOS PRINCIPALES

/**
 * Clase para gestionar respaldos de datos en archivos JSON locales.
 * Permite cumplir con el requisito de guardar datos en el dispositivo del usuario.
 */
class BackupManager {
    static exportarDatosJSON() {
        try {
            const data = {
                turnos: localStorage.getItem('turnosAppState'),
                empleados: localStorage.getItem('empleadosData'),
                config: localStorage.getItem('configuracionGeneral'),
                export_date: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_turnos_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            NotificationSystem.show('💾 Archivo JSON descargado correctamente', 'success');
        } catch (error) {
            console.error('Error exportando:', error);
            NotificationSystem.show('❌ Error al exportar datos', 'error');
        }
    }

    static importarDatosJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.turnos) localStorage.setItem('turnosAppState', data.turnos);
                    if (data.empleados) localStorage.setItem('empleadosData', data.empleados);
                    if (data.config) localStorage.setItem('configuracionGeneral', data.config);
                    
                    NotificationSystem.show('📥 Datos importados correctamente. Recargando...', 'success');
                    setTimeout(() => location.reload(), 1500);
                } catch (error) {
                    console.error('Error importando:', error);
                    NotificationSystem.show('❌ El archivo no es un formato válido', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    static limpiarDatosLocales() {
        if (confirm('⚠️ ¿Estás seguro de que quieres borrar TODOS los datos locales? Esta acción no se puede deshacer.')) {
            localStorage.clear();
            NotificationSystem.show('🗑️ Datos borrados. Reiniciando...', 'info');
            setTimeout(() => location.reload(), 1000);
        }
    }
}

window.AppState = AppState;
window.EmployeeManager = EmployeeManager;
window.TurnoManager = TurnoManager;
window.UI = UI;
window.BackupManager = BackupManager;

// =============================================
// INICIALIZACIÓN AUTOMÁTICA (MODO LOCAL JSON)
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Sistema en Modo Local (Persistence with JSON/LocalStorage)...');
    
    // 1. Cargar datos del usuario (si existen)
    AppState.loadFromStorage().then(exito => {
        if (exito) {
            console.log('✅ Base de datos local cargada con éxito');
        } else {
            console.log('ℹ️ Iniciando base de datos con configuración predeterminada');
            // Guardar el estado inicial para que exista en el primer arranque
            AppState.saveToStorage();
        }
        
        // 2. Generar UI inicial
        if (typeof UI !== 'undefined' && UI.generarCuadranteGeneral) {
            UI.generarCuadranteGeneral();
            
            if (window.NotificationSystem) {
                NotificationSystem.show('Sistema listo (Modo Local Privado)', 'info');
            }
        }
    }).catch(err => {
        console.error('❌ Error crítico en inicialización:', err);
    });
});

