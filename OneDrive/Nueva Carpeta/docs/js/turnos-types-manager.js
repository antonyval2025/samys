/**
 * TURNOS TYPES MANAGER - Capa de Datos para Tipos de Turnos
 * 
 * Responsabilidad:
 * - Gestionar el estado de tipos de turnos (CRUD)
 * - Persistencia en localStorage
 * - Validaciones y reglas de negocio
 * - Protección de turnos críticos
 * 
 * NO maneja UI directamente (eso es ConsolidadoTurnos)
 */

console.log('[TurnosTypesManager] 🔄 Inicializando gestor de tipos de turnos...');

const TurnosTypesManager = (function() {
    
    // ============================================
    // ESTADO PRIVADO (Fuente de Verdad)
    // ============================================
    let turnosTypes = (() => {
        const stored = localStorage.getItem('tiposTurnoData');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('[TurnosTypesManager] Error parseando localStorage:', e);
            }
        }
        // Valores por defecto
        return {
            'mañana': { id: 1, nombre: 'Mañana', inicial: 'M', horario: '08:00-16:00', horas: 8, color: '#d4edda' },
            'tarde': { id: 2, nombre: 'Tarde', inicial: 'T', horario: '16:00-00:00', horas: 8, color: '#fff3cd' },
            'noche': { id: 3, nombre: 'Noche', inicial: 'N', horario: '00:00-08:00', horas: 8, color: '#f8d7da' },
            'mixto': { id: 4, nombre: 'Mixto', inicial: 'X', horario: '08:00-20:00', horas: 12, color: '#d1ecf1' },
            'descanso': { id: 5, nombre: 'Descanso', inicial: 'D', horario: '---', horas: 0, color: '#e2e3e5' },
            'vacaciones': { id: 6, nombre: 'Vacaciones', inicial: 'V', horario: '---', horas: 0, color: '#fecdd3' },
            'baja': { id: 7, nombre: 'Baja', inicial: 'B', horario: '---', horas: 0, color: '#fda4af' },
            'libre': { id: 8, nombre: 'Libre', inicial: 'L', horario: '---', horas: 0, color: '#e0e7ff' },
            'festivo': { id: 9, nombre: 'Festivo', inicial: 'F', horario: '---', horas: 0, color: '#fef3c7' }
        };
    })();

    // Turnos que no se pueden eliminar
    const TURNOS_PROTEGIDOS = ['descanso', 'vacaciones', 'baja'];

    // ============================================
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Persiste turnos en localStorage
     */
    function guardarEnStorage() {
        try {
            localStorage.setItem('tiposTurnoData', JSON.stringify(turnosTypes));
            console.log('[TurnosTypesManager] 💾 Tipos de turnos guardados en localStorage');
        } catch (error) {
            console.error('[TurnosTypesManager] ❌ Error al guardar:', error);
        }
    }

    /**
     * Valida los datos de un tipo de turno
     */
    function validarTurnoType(nombre, inicial, horas) {
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
            return { valido: false, error: 'Nombre inválido (mín. 2 caracteres)' };
        }

        if (!inicial || typeof inicial !== 'string' || inicial.trim().length < 1) {
            return { valido: false, error: 'Inicial inválida' };
        }

        if (typeof horas !== 'number' || horas < 0 || horas > 24) {
            return { valido: false, error: 'Horas debe estar entre 0 y 24' };
        }

        return { valido: true };
    }

    /**
     * Genera clave desde nombre
     */
    function generarClave(nombre) {
        return nombre.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }

    /**
     * Verifica si hay turnos asignados a empleados
     */
    function hayTurnosAsignados(clave) {
        if (typeof empleados === 'undefined' || typeof AppState === 'undefined') {
            return false;
        }

        let turnosUsados = 0;
        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            turnosUsados += turnos.filter(t => t.turno === clave).length;
        });

        return turnosUsados > 0;
    }

    // ============================================
    // MÉTODOS PÚBLICOS (API)
    // ============================================

    /**
     * Inicializa el manager
     */
    function inicializar() {
        console.log('[TurnosTypesManager] ✅ Inicializado con', Object.keys(turnosTypes).length, 'tipos de turnos');
        return Object.keys(turnosTypes).length > 0;
    }

    /**
     * Obtiene todos los tipos de turnos
     */
    function obtenerTurnos() {
        return JSON.parse(JSON.stringify(turnosTypes)); // Deep copy
    }

    /**
     * Obtiene un tipo de turno por clave
     */
    function obtenerTurnoPorClave(clave) {
        return turnosTypes[clave] ? JSON.parse(JSON.stringify(turnosTypes[clave])) : null;
    }

    /**
     * Obtiene un tipo de turno por nombre
     */
    function obtenerTurnoPorNombre(nombre) {
        const encontrado = Object.entries(turnosTypes).find(
            ([_, turno]) => turno.nombre.toLowerCase() === nombre.toLowerCase()
        );
        return encontrado ? JSON.parse(JSON.stringify(encontrado[1])) : null;
    }

    /**
     * Crea un nuevo tipo de turno
     */
    function crearTurno(nombre, inicial, horario, horas, color) {
        const validacion = validarTurnoType(nombre, inicial, horas);
        if (!validacion.valido) {
            console.error('[TurnosTypesManager] ❌', validacion.error);
            return { exito: false, error: validacion.error };
        }

        const clave = generarClave(nombre);
        if (turnosTypes[clave]) {
            console.error('[TurnosTypesManager] ❌ Ya existe un turno con ese nombre');
            return { exito: false, error: 'Ya existe un turno con ese nombre' };
        }

        const nuevoTurno = {
            id: Math.max(...Object.values(turnosTypes).map(t => t.id || 0), 0) + 1,
            nombre: nombre.trim(),
            inicial: inicial.trim(),
            horario: horario || '---',
            horas: parseFloat(horas) || 0,
            color: color || '#d4edda',
            creadoEn: new Date().toISOString()
        };

        turnosTypes[clave] = nuevoTurno;
        guardarEnStorage();

        console.log('[TurnosTypesManager] ✅ Turno creado:', clave, nuevoTurno);
        return { exito: true, turno: nuevoTurno, clave };
    }

    /**
     * Actualiza un tipo de turno existente
     */
    function actualizarTurno(clave, nombre, inicial, horario, horas, color) {
        const validacion = validarTurnoType(nombre, inicial, horas);
        if (!validacion.valido) {
            console.error('[TurnosTypesManager] ❌', validacion.error);
            return { exito: false, error: validacion.error };
        }

        const turno = turnosTypes[clave];
        if (!turno) {
            console.error('[TurnosTypesManager] ❌ Turno no encontrado');
            return { exito: false, error: 'Turno no encontrado' };
        }

        turno.nombre = nombre.trim();
        turno.inicial = inicial.trim();
        turno.horario = horario || '---';
        turno.horas = parseFloat(horas) || 0;
        turno.color = color || turno.color;
        turno.actualizadoEn = new Date().toISOString();

        guardarEnStorage();

        console.log('[TurnosTypesManager] ✅ Turno actualizado:', clave);
        return { exito: true, turno };
    }

    /**
     * Elimina un tipo de turno
     */
    function eliminarTurno(clave) {
        // Proteger turnos críticos
        if (TURNOS_PROTEGIDOS.includes(clave)) {
            console.error('[TurnosTypesManager] ❌ No se puede eliminar turno protegido:', clave);
            return { exito: false, error: 'No se puede eliminar este turno protegido' };
        }

        if (!turnosTypes[clave]) {
            console.error('[TurnosTypesManager] ❌ Turno no encontrado');
            return { exito: false, error: 'Turno no encontrado' };
        }

        // Verificar si está siendo usado
        if (hayTurnosAsignados(clave)) {
            console.error('[TurnosTypesManager] ❌ Turno está siendo usado por empleados');
            return { exito: false, error: 'Este turno está asignado a empleados. Cámbialos primero.' };
        }

        const turnoEliminado = turnosTypes[clave];
        delete turnosTypes[clave];
        guardarEnStorage();

        console.log('[TurnosTypesManager] ✅ Turno eliminado:', clave);
        return { exito: true, turno: turnoEliminado };
    }

    /**
     * Obtiene estadísticas
     */
    function obtenerEstadisticas() {
        const stats = {};
        Object.entries(turnosTypes).forEach(([clave, turno]) => {
            let usados = 0;
            if (typeof empleados !== 'undefined' && typeof AppState !== 'undefined') {
                empleados.forEach(emp => {
                    const turnos = AppState.scheduleData.get(emp.id) || [];
                    usados += turnos.filter(t => t.turno === clave).length;
                });
            }
            stats[clave] = {
                nombre: turno.nombre,
                horas: turno.horas,
                color: turno.color,
                usados,
                protegido: TURNOS_PROTEGIDOS.includes(clave)
            };
        });
        return stats;
    }

    /**
     * Obtiene el estado actual
     */
    function obtenerEstado() {
        return {
            turnos: obtenerTurnos(),
            total: Object.keys(turnosTypes).length,
            protegidos: TURNOS_PROTEGIDOS
        };
    }

    /**
     * Reinicia a valores por defecto
     */
    function reiniciar() {
        turnosTypes = {
            'mañana': { id: 1, nombre: 'Mañana', inicial: 'M', horario: '08:00-16:00', horas: 8, color: '#d4edda' },
            'tarde': { id: 2, nombre: 'Tarde', inicial: 'T', horario: '16:00-00:00', horas: 8, color: '#fff3cd' },
            'noche': { id: 3, nombre: 'Noche', inicial: 'N', horario: '00:00-08:00', horas: 8, color: '#f8d7da' },
            'mixto': { id: 4, nombre: 'Mixto', inicial: 'X', horario: '08:00-20:00', horas: 12, color: '#d1ecf1' },
            'descanso': { id: 5, nombre: 'Descanso', inicial: 'D', horario: '---', horas: 0, color: '#e2e3e5' },
            'vacaciones': { id: 6, nombre: 'Vacaciones', inicial: 'V', horario: '---', horas: 0, color: '#fecdd3' },
            'baja': { id: 7, nombre: 'Baja', inicial: 'B', horario: '---', horas: 0, color: '#fda4af' },
            'libre': { id: 8, nombre: 'Libre', inicial: 'L', horario: '---', horas: 0, color: '#e0e7ff' },
            'festivo': { id: 9, nombre: 'Festivo', inicial: 'F', horario: '---', horas: 0, color: '#fef3c7' }
        };
        guardarEnStorage();
        console.log('[TurnosTypesManager] 🔄 Reiniciado a valores por defecto');
    }

    // ============================================
    // API PÚBLICA
    // ============================================
    return {
        inicializar,
        obtenerTurnos,
        obtenerTurnoPorClave,
        obtenerTurnoPorNombre,
        crearTurno,
        actualizarTurno,
        eliminarTurno,
        obtenerEstadisticas,
        obtenerEstado,
        reiniciar
    };
})();

console.log('[TurnosTypesManager] ✅ Capa de datos de tipos de turnos cargada');
