// DEPARTAMENTOS MANAGER - Sistema extensible de gestión de departamentos
console.log('[DepartamentosManager] Iniciando carga...');

const DepartamentosManager = (function() {
    // Estándares predefinidos de departamentos
    const DEPARTAMENTOS = {
        DEFAULT: {
            id: 'default',
            nombre: 'General',
            horasSemanales: 40,
            horasDiarias: 8,
            diasTrabajo: 5,
            diasDescanso: 2,
            turnosNocturnos: true,
            rotacionDomiingos: false,
            descripcion: 'Estándar general'
        },
        LIMPIEZA: {
            id: 'limpieza',
            nombre: 'Limpieza',
            horasSemanales: 39,
            horasDiarias: 6.5,
            diasTrabajo: 6,
            diasDescanso: 1,
            turnosNocturnos: false,
            rotacionDomingos: true,
            guardiasRotativasDomingos: true,
            descripcion: 'Equipo de limpieza - 39h semanales'
        },
        ENFERMERIA: {
            id: 'enfermeria',
            nombre: 'Enfermería',
            horasSemanales: 40,
            horasDiarias: 8,
            diasTrabajo: 5,
            diasDescanso: 2,
            turnosNocturnos: true,
            rotacionDomingos: true,
            guardiasRotativasDomingos: true,
            descripcion: 'Equipo de enfermería - 24/7'
        }
    };

    const state = {
        departamentos: new Map(),
        departamentosPorEmpleado: new Map(), // empleadoId -> departamentoId
        configuracionCargada: false
    };

    function inicializar() {
        console.log('[DepartamentosManager] Inicializando departamentos predefinidos');
        
        // PRIMERO: Crear siempre los departamentos predefinidos
        crearDepartamentosDefecto();
        
        // LUEGO: Cargar desde localStorage si existen (sincronizados)
        const stored = localStorage.getItem('departamentosConfig');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                // Cargar departamentos sincronizados (sin sobrescribir los predefinidos)
                data.departamentos.forEach(([id, depto]) => {
                    // No sobrescribir predefinidos: default, limpieza, enfermeria
                    if (!['default', 'limpieza', 'enfermeria'].includes(id)) {
                        state.departamentos.set(id, depto);
                    }
                });
                state.departamentosPorEmpleado = new Map(data.departamentosPorEmpleado);
                console.log('[DepartamentosManager] Configuración cargada desde localStorage + predefinidos');
            } catch (e) {
                console.error('[DepartamentosManager] Error cargando config:', e);
            }
        }
        
        state.configuracionCargada = true;
        console.log('[DepartamentosManager] ✅ Inicialización completada. Departamentos:', Array.from(state.departamentos.keys()));
    }

    function crearDepartamentosDefecto() {
        console.log('[DepartamentosManager] Creando departamentos por defecto');
        state.departamentos.set('default', DEPARTAMENTOS.DEFAULT);
        state.departamentos.set('limpieza', DEPARTAMENTOS.LIMPIEZA);
        state.departamentos.set('enfermeria', DEPARTAMENTOS.ENFERMERIA);
    }

    function guardarEnStorage() {
        const data = {
            departamentos: Array.from(state.departamentos.entries()),
            departamentosPorEmpleado: Array.from(state.departamentosPorEmpleado.entries())
        };
        localStorage.setItem('departamentosConfig', JSON.stringify(data));
        console.log('[DepartamentosManager] Configuración guardada');
    }

    function agregarDepartamento(config) {
        const id = (typeof config === 'string' ? config : config.id || config.nombre).toLowerCase().replace(/\s+/g, '_');
        const nombre = typeof config === 'string' ? config : config.nombre;
        
        const deptoData = typeof config === 'string' ? { nombre: config } : config;
        
        state.departamentos.set(id, {
            id: id,
            nombre: nombre,
            horasSemanales: deptoData.horasSemanales || 40,
            horasDiarias: deptoData.horasDiarias || 8,
            diasTrabajo: deptoData.diasTrabajo || 5,
            diasDescanso: (deptoData.diasTrabajo || 5) > 5 ? 1 : 2,
            turnosNocturnos: deptoData.turnosNocturnos !== false,
            rotacionDomingos: deptoData.rotacionDomingos || false,
            guardiasRotativasDomingos: deptoData.guardiasRotativasDomingos || false,
            descripcion: deptoData.descripcion || '',
            fechaCreacion: new Date().toISOString()
        });
        guardarEnStorage();
        console.log('[DepartamentosManager] Departamento añadido:', id);
    }

    function actualizarDepartamento(nombreDepartamento, datosActualizados) {
        const id = nombreDepartamento.toLowerCase().replace(/\s+/g, '_');
        const depto = state.departamentos.get(id);
        
        if (!depto) {
            throw new Error(`Departamento '${nombreDepartamento}' no encontrado`);
        }

        // Actualizar campos
        depto.nombre = datosActualizados.nombre || depto.nombre;
        depto.descripcion = datosActualizados.descripcion !== undefined ? datosActualizados.descripcion : depto.descripcion;
        depto.horasSemanales = datosActualizados.horasSemanales || depto.horasSemanales;
        depto.horasDiarias = datosActualizados.horasDiarias || depto.horasDiarias;
        depto.diasTrabajo = datosActualizados.diasTrabajo || depto.diasTrabajo;
        depto.diasDescanso = depto.diasTrabajo > 5 ? 1 : 2;
        depto.turnosNocturnos = datosActualizados.turnosNocturnos !== undefined ? datosActualizados.turnosNocturnos : depto.turnosNocturnos;
        depto.rotacionDomingos = datosActualizados.rotacionDomingos !== undefined ? datosActualizados.rotacionDomingos : depto.rotacionDomingos;
        depto.guardiasRotativasDomingos = datosActualizados.guardiasRotativasDomingos !== undefined ? datosActualizados.guardiasRotativasDomingos : depto.guardiasRotativasDomingos;
        depto.fechaActualizacion = new Date().toISOString();

        guardarEnStorage();
        console.log('[DepartamentosManager] Departamento actualizado:', id, depto);
    }

    function eliminarDepartamento(nombreDepartamento) {
        const id = nombreDepartamento.toLowerCase().replace(/\s+/g, '_');
        const depto = state.departamentos.get(id);

        if (!depto) {
            throw new Error(`Departamento '${nombreDepartamento}' no encontrado`);
        }

        // Verificar que no hay empleados asignados
        const empleadosAsignados = [];
        state.departamentosPorEmpleado.forEach((deptId, empId) => {
            if (deptId === id) {
                empleadosAsignados.push(empId);
            }
        });

        if (empleadosAsignados.length > 0) {
            throw new Error(`No se puede eliminar: ${empleadosAsignados.length} empleado(s) asignado(s)`);
        }

        state.departamentos.delete(id);
        guardarEnStorage();
        console.log('[DepartamentosManager] Departamento eliminado:', id);
    }

    function asignarEmpleadoADepartamento(empleadoId, departamentoId) {
        if (!state.departamentos.has(departamentoId)) {
            console.error(`[DepartamentosManager] Departamento no existe: ${departamentoId}`);
            return false;
        }
        state.departamentosPorEmpleado.set(empleadoId, departamentoId);
        guardarEnStorage();
        console.log(`[DepartamentosManager] Empleado ${empleadoId} asignado a ${departamentoId}`);
        return true;
    }

    function obtenerDepartamento(id) {
        return state.departamentos.get(id);
    }

    function obtenerDepartamentoEmpleado(empleadoId) {
        const deptId = state.departamentosPorEmpleado.get(empleadoId) || 'default';
        return state.departamentos.get(deptId);
    }

    function listarDepartamentos() {
        return Array.from(state.departamentos.values());
    }

    function listarEmpleadosPorDepartamento(departamentoId) {
        const empleados = [];
        state.departamentosPorEmpleado.forEach((deptId, empId) => {
            if (deptId === departamentoId) {
                empleados.push(empId);
            }
        });
        return empleados;
    }

    function validarEstándarEmpleado(empleadoId, horasAsignadas) {
        const depto = obtenerDepartamentoEmpleado(empleadoId);
        if (!depto) return { válido: false, error: 'Departamento no encontrado' };
        
        const horasDiariasDept = depto.horasDiarias;
        const horasSemanalsDept = depto.horasSemanales;
        
        return {
            válido: true,
            departamento: depto.nombre,
            estándarDiario: horasDiariasDept,
            estándarSemanal: horasSemanalsDept,
            horasAsignadas: horasAsignadas,
            cumple: Math.abs(horasAsignadas - horasSemanalsDept) < 2
        };
    }

    function calcularEscalaParaDepartamento(empleadoId, baseHoras) {
        const depto = obtenerDepartamentoEmpleado(empleadoId);
        if (!depto) return baseHoras;
        
        // Escalar horas según el departamento
        const factor = depto.horasSemanales / 40; // 40 es el estándar base
        return Math.round(baseHoras * factor * 10) / 10;
    }

    return {
        inicializar: inicializar,
        agregarDepartamento: agregarDepartamento,
        actualizarDepartamento: actualizarDepartamento,
        eliminarDepartamento: eliminarDepartamento,
        asignarEmpleadoADepartamento: asignarEmpleadoADepartamento,
        obtenerDepartamento: obtenerDepartamento,
        obtenerDepartamentoEmpleado: obtenerDepartamentoEmpleado,
        listarDepartamentos: listarDepartamentos,
        obtenerDepartamentos: listarDepartamentos, // Alias para ConsolidadoDepartamentos
        listarEmpleadosPorDepartamento: listarEmpleadosPorDepartamento,
        validarEstándarEmpleado: validarEstándarEmpleado,
        calcularEscalaParaDepartamento: calcularEscalaParaDepartamento,
        obtenerEstándaresDisponibles: () => DEPARTAMENTOS,
        guardarEnStorage: guardarEnStorage,
        obtenerEstado: () => ({
            departamentos: Array.from(state.departamentos.entries()),
            departamentosPorEmpleado: Array.from(state.departamentosPorEmpleado.entries()),
            configuracionCargada: state.configuracionCargada
        }),
        // 🔗 INTEGRACIÓN: Sincronizar departamento creado desde UI antigua
        sincronizarDepartamento: function(deptoNuevo) {
            console.log('[DepartamentosManager] 🔗 Sincronizando departamento:', deptoNuevo.nombre);
            
            // Convertir formato antiguo al nuevo (si es necesario)
            const depto = {
                id: deptoNuevo.nombre.toLowerCase().replace(/\s+/g, '_'),
                nombre: deptoNuevo.nombre,
                descripcion: deptoNuevo.descripcion || '',
                // Usar los valores proporcionados del departamento, con defaults
                horasSemanales: deptoNuevo.horasSemanales || 40,
                horasDiarias: deptoNuevo.horasDiarias || 8,
                diasTrabajo: deptoNuevo.diasTrabajo || 5,
                diasDescanso: 7 - (deptoNuevo.diasTrabajo || 5),
                turnosNocturnos: deptoNuevo.turnosNocturnos !== false, // true por defecto
                rotacionDomingos: deptoNuevo.rotacionDomingos || false,
                guardiasRotativasDomingos: deptoNuevo.guardiasRotativasDomingos || false
            };
            
            // Actualizar en nuestro estado interno
            state.departamentos.set(depto.id, depto);
            guardarEnStorage();
            
            console.log('[DepartamentosManager] ✅ Departamento sincronizado:', {
                nombre: depto.nombre,
                horasSemanales: depto.horasSemanales,
                diasTrabajo: depto.diasTrabajo,
                horasDiarias: depto.horasDiarias
            });
        }
    };
})();

// Registrar en ModuleManager si existe
if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('DepartamentosManager', DepartamentosManager);
    console.log('[DepartamentosManager] Registrado en ModuleManager');
}

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => DepartamentosManager.inicializar(), 300);
    });
} else {
    DepartamentosManager.inicializar();
}

console.log('[DepartamentosManager] ✅ Módulo cargado');
