// BALANCEADOR TURNOS - Balanceo automático y equitativo de turnos
console.log('[BalanceadorTurnos] Iniciando carga...');

const BalanceadorTurnos = (function() {
    const state = {
        isInitialized: false,
        ultimoBalanceo: null,
        estadisticasBalanceo: {}
    };

    function calcularEquidadTurnos(empleadoId, turnos, departamentoId = null) {
        if (!turnos || turnos.length === 0) return { equidad: 0, mensaje: 'Sin turnos' };

        const depto = DepartamentosManager ? DepartamentosManager.obtenerDepartamento(departamentoId) : null;
        
        const stats = {
            totalTurnos: turnos.length,
            turnosMañana: turnos.filter(t => t.turno === 'mañana').length,
            turnosTarde: turnos.filter(t => t.turno === 'tarde').length,
            turnosNoche: turnos.filter(t => t.turno === 'noche').length,
            descansos: turnos.filter(t => t.turno === 'descanso').length,
            horasTotales: turnos.reduce((sum, t) => sum + (t.horas || 0), 0),
            horasPromedio: 0
        };

        stats.horasPromedio = stats.horasTotales / (stats.totalTurnos || 1);

        let equidad = 100;
        
        // Validar contra estándar del departamento
        if (depto) {
            const horasEsperadas = depto.horasSemanales;
            const variacion = Math.abs(stats.horasPromedio - (horasEsperadas / 6)); // 6 días promedio
            equidad = Math.max(0, 100 - (variacion * 10));
        }

        return {
            equidad: Math.round(equidad),
            stats: stats,
            departamento: depto ? depto.nombre : 'General'
        };
    }

    function calcularDistribucionEmpleados(empleados, turnosPorEmpleado) {
        const distribucion = {};
        const departamentos = {};

        empleados.forEach(emp => {
            const depto = DepartamentosManager ? DepartamentosManager.obtenerDepartamentoEmpleado(emp.id) : null;
            const deptId = depto ? depto.id : 'default';
            
            if (!departamentos[deptId]) {
                departamentos[deptId] = {
                    nombre: depto ? depto.nombre : 'General',
                    empleados: [],
                    estadisticas: {}
                };
            }

            const turnos = turnosPorEmpleado.get(emp.id) || [];
            const equidad = calcularEquidadTurnos(emp.id, turnos, deptId);

            distribucion[emp.id] = equidad;
            departamentos[deptId].empleados.push({
                id: emp.id,
                nombre: emp.nombre,
                equidad: equidad.equidad
            });
        });

        // Calcular promedios por departamento
        Object.values(departamentos).forEach(depto => {
            const equidades = depto.empleados.map(e => e.equidad);
            depto.estadisticas = {
                promedio: Math.round(equidades.reduce((a, b) => a + b, 0) / equidades.length),
                minima: Math.min(...equidades),
                maxima: Math.max(...equidades),
                varianza: calcularVarianza(equidades)
            };
        });

        return { distribucion, departamentos };
    }

    function calcularVarianza(valores) {
        if (valores.length === 0) return 0;
        const promedio = valores.reduce((a, b) => a + b) / valores.length;
        const varianza = valores.reduce((sum, v) => sum + Math.pow(v - promedio, 2), 0) / valores.length;
        return Math.round(Math.sqrt(varianza) * 100) / 100;
    }

    function generarRecomendacionesBalanceo(distribucion, departamentos) {
        const recomendaciones = [];

        Object.entries(departamentos).forEach(([deptId, depto]) => {
            const stats = depto.estadisticas;
            
            if (stats.maxima - stats.minima > 15) {
                recomendaciones.push({
                    tipo: 'warning',
                    departamento: depto.nombre,
                    mensaje: `Gran diferencia de equidad (${stats.maxima - stats.minima}%) entre empleados`,
                    accion: 'Redistribuir turnos entre empleados menos cargados'
                });
            }

            if (stats.promedio < 70) {
                recomendaciones.push({
                    tipo: 'critical',
                    departamento: depto.nombre,
                    mensaje: `Baja equidad promedio (${stats.promedio}%)`,
                    accion: 'Revisar distribución general del departamento'
                });
            }

            const empleadosMalDistribuidos = depto.empleados.filter(e => e.equidad < 60);
            if (empleadosMalDistribuidos.length > 0) {
                recomendaciones.push({
                    tipo: 'warning',
                    departamento: depto.nombre,
                    empleados: empleadosMalDistribuidos.map(e => e.nombre),
                    mensaje: `${empleadosMalDistribuidos.length} empleado(s) con baja equidad`,
                    accion: 'Asignar turnos más equitativos'
                });
            }
        });

        return recomendaciones;
    }

    function aplicarBalanceoAutomatico(empleados, turnosPorEmpleado) {
        console.log('[BalanceadorTurnos] Iniciando balanceo automático...');

        const analisis = calcularDistribucionEmpleados(empleados, turnosPorEmpleado);
        const recomendaciones = generarRecomendacionesBalanceo(analisis.distribucion, analisis.departamentos);

        state.ultimoBalanceo = {
            timestamp: new Date().toISOString(),
            analisis: analisis,
            recomendaciones: recomendaciones,
            estadisticasGenerales: {
                empleadosTotales: empleados.length,
                departamentos: Object.keys(analisis.departamentos).length
            }
        };

        console.log('[BalanceadorTurnos] Balanceo completado:', state.ultimoBalanceo);
        return state.ultimoBalanceo;
    }

    function obtenerResumenBalanceo() {
        if (!state.ultimoBalanceo) {
            return {
                estado: 'sin-analisis',
                mensaje: 'No se ha realizado un análisis de balanceo'
            };
        }

        const depto = Object.values(state.ultimoBalanceo.analisis.departamentos)[0];
        return {
            estado: 'completado',
            timestamp: state.ultimoBalanceo.timestamp,
            promedio: depto?.estadisticas.promedio || 0,
            varianza: depto?.estadisticas.varianza || 0,
            recomendacionesCount: state.ultimoBalanceo.recomendaciones.length
        };
    }

    return {
        calcularEquidadTurnos: calcularEquidadTurnos,
        calcularDistribucionEmpleados: calcularDistribucionEmpleados,
        generarRecomendacionesBalanceo: generarRecomendacionesBalanceo,
        aplicarBalanceoAutomatico: aplicarBalanceoAutomatico,
        obtenerResumenBalanceo: obtenerResumenBalanceo,
        obtenerUltimoBalanceo: () => state.ultimoBalanceo,
        obtenerEstado: () => ({
            inicializado: state.isInitialized,
            ultimoBalanceo: state.ultimoBalanceo
        })
    };
})();

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('BalanceadorTurnos', BalanceadorTurnos);
    console.log('[BalanceadorTurnos] Registrado en ModuleManager');
}

console.log('[BalanceadorTurnos] ✅ Módulo cargado');
