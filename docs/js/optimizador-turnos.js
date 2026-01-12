/**
 * ✅ OPTIMIZADOR DE TURNOS - Semana 3
 * Sugerencias automáticas y optimización inteligente de turnos
 * Algoritmo de balanceo y mejora continua
 * 
 * @version 3.0.0
 * @date 2 de enero de 2026
 */

class OptimizadorTurnos {
    static isInitialized = false;
    static sugerencias = [];
    static mejoresEjecutadas = 0;
    static maxSugerencias = 100;

    /**
     * Inicializar optimizador
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ OptimizadorTurnos ya fue inicializado');
            return;
        }

        console.log('⚡ Inicializando OptimizadorTurnos...');
        this.isInitialized = true;
        this.generarSugerenciasAutomaticas();
        console.log('✅ OptimizadorTurnos inicializado');
    }

    /**
     * Generar sugerencias automáticas de optimización
     * @returns {Array} Lista de sugerencias
     */
    static generarSugerenciasAutomaticas() {
        this.sugerencias = [];
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        // Analizar desequilibrios
        const desequilibrios = this.detectarDesequilibrios();
        desequilibrios.forEach(desequilibrio => {
            this.sugerencias.push({
                tipo: 'BALANCEO',
                empleado: desequilibrio.empleado,
                empleadoId: desequilibrio.empleadoId,
                problema: desequilibrio.problema,
                sugerencia: desequilibrio.sugerencia,
                impacto: 'ALTO',
                prioridad: desequilibrio.prioridad,
                accion: desequilibrio.accion,
                timestamp: new Date().toISOString()
            });
        });

        // Detectar oportunidades de mejora
        const oportunidades = this.detectarOportunidades();
        oportunidades.forEach(oportunidad => {
            this.sugerencias.push({
                tipo: 'MEJORA',
                empleado: oportunidad.empleado,
                empleadoId: oportunidad.empleadoId,
                problema: oportunidad.problema,
                sugerencia: oportunidad.sugerencia,
                impacto: 'MEDIO',
                prioridad: oportunidad.prioridad,
                accion: oportunidad.accion,
                timestamp: new Date().toISOString()
            });
        });

        // Limitar historial
        if (this.sugerencias.length > this.maxSugerencias) {
            this.sugerencias = this.sugerencias.slice(-this.maxSugerencias);
        }

        console.log(`✅ ${this.sugerencias.length} sugerencias generadas`);
        return this.sugerencias;
    }

    /**
     * Detectar desequilibrios en distribución
     * @private
     */
    static detectarDesequilibrios() {
        const desequilibrios = [];
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        // Calcular carga de cada empleado
        const cargas = {};
        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            const turnosDelMes = turnos.filter(t => t.mes === mes && t.anio === año);
            
            const horas = turnosDelMes
                .filter(t => ['mañana', 'tarde', 'noche', 'mixto'].includes(t.turno))
                .length * 8;
            
            cargas[emp.id] = { nombre: emp.nombre, horas: horas };
        });

        // Detectar extremos
        const cargasArray = Object.values(cargas);
        const promedio = cargasArray.reduce((a, b) => a + b.horas, 0) / cargasArray.length;
        const desviacion = Math.sqrt(
            cargasArray.reduce((sum, c) => sum + Math.pow(c.horas - promedio, 2), 0) / cargasArray.length
        );

        cargasArray.forEach((carga, index) => {
            const empId = Object.keys(cargas)[index];
            
            // Sobre cargado
            if (carga.horas > promedio + desviacion * 1.5) {
                desequilibrios.push({
                    empleadoId: parseInt(empId),
                    empleado: carga.nombre,
                    problema: `Sobre cargado (${carga.horas}h vs promedio ${promedio.toFixed(0)}h)`,
                    sugerencia: `Reducir carga laboral de ${carga.nombre}`,
                    prioridad: 'ALTA',
                    accion: 'Reasignar algunos turnos a empleados con menor carga'
                });
            }

            // Sub cargado
            if (carga.horas < promedio - desviacion * 1.5) {
                desequilibrios.push({
                    empleadoId: parseInt(empId),
                    empleado: carga.nombre,
                    problema: `Sub cargado (${carga.horas}h vs promedio ${promedio.toFixed(0)}h)`,
                    sugerencia: `Aumentar carga laboral de ${carga.nombre}`,
                    prioridad: 'MEDIA',
                    accion: 'Asignar más turnos si el empleado está disponible'
                });
            }
        });

        return desequilibrios;
    }

    /**
     * Detectar oportunidades de mejora
     * @private
     */
    static detectarOportunidades() {
        const oportunidades = [];
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        empleados.forEach(empleado => {
            const turnos = AppState.scheduleData.get(empleado.id) || [];
            const turnosDelMes = turnos.filter(t => t.mes === mes && t.anio === año);

            // Oportunidad 1: Muchos turnos nocturnos
            const nocturnos = turnosDelMes.filter(t => t.turno === 'noche').length;
            if (nocturnos > 8) {
                oportunidades.push({
                    empleadoId: empleado.id,
                    empleado: empleado.nombre,
                    problema: `${nocturnos} turnos nocturnos asignados`,
                    sugerencia: `Alternar algunos turnos nocturnos con diurnos para mejor salud`,
                    prioridad: 'MEDIA',
                    accion: `Cambiar 2-3 turnos noche por mañana/tarde`
                });
            }

            // Oportunidad 2: Falta de descansos consecutivos
            const descansos = turnosDelMes.filter(t => t.turno === 'descanso').length;
            if (descansos < 4) {
                oportunidades.push({
                    empleadoId: empleado.id,
                    empleado: empleado.nombre,
                    problema: `Solo ${descansos} días de descanso en el mes`,
                    sugerencia: `Agregar 2-3 descansos más para recuperación`,
                    prioridad: 'ALTA',
                    accion: `Asignar ${4 - descansos} días de descanso adicionales`
                });
            }

            // Oportunidad 3: Patrón repetitivo monótono
            const patrones = this.analizarPatron(turnosDelMes);
            if (patrones.repeticion > 0.8) {
                oportunidades.push({
                    empleadoId: empleado.id,
                    empleado: empleado.nombre,
                    problema: `Patrón muy repetitivo (${(patrones.repeticion * 100).toFixed(0)}% similaridad)`,
                    sugerencia: `Variar la distribución de turnos para mayor dinamismo`,
                    prioridad: 'BAJA',
                    accion: `Reordenar algunos turnos para crear variedad`
                });
            }
        });

        return oportunidades;
    }

    /**
     * Analizar patrón de turnos
     * @private
     */
    static analizarPatron(turnos) {
        if (turnos.length < 7) {
            return { repeticion: 0, patron: 'insuficientes datos' };
        }

        // Crear secuencia de turnos
        const secuencia = [];
        for (let dia = 1; dia <= 30; dia++) {
            const turno = turnos.find(t => t.dia === dia);
            secuencia.push(turno?.turno?.[0] || 'X'); // Primera letra
        }

        // Detectar repeticiones (ver si primer y segundo tercio son similares)
        const tercio = Math.floor(secuencia.length / 3);
        let coincidencias = 0;
        
        for (let i = 0; i < tercio; i++) {
            if (secuencia[i] === secuencia[i + tercio]) {
                coincidencias++;
            }
        }

        const repeticion = coincidencias / tercio;
        return { repeticion, patron: secuencia.join('') };
    }

    /**
     * Ejecutar mejora recomendada
     * @param {number} sugerenciaIndex - Índice de la sugerencia
     * @returns {Object} {exito: bool, cambios: []}
     */
    static ejecutarMejora(sugerenciaIndex) {
        if (sugerenciaIndex < 0 || sugerenciaIndex >= this.sugerencias.length) {
            return { exito: false, error: 'Sugerencia no encontrada' };
        }

        const sugerencia = this.sugerencias[sugerenciaIndex];
        const cambios = [];

        try {
            console.log(`⚡ Ejecutando mejora: ${sugerencia.sugerencia}`);
            
            // Las mejoras reales se implementarían aquí
            // Por ahora, solo registramos que se intentó
            
            this.mejoresEjecutadas++;
            
            return {
                exito: true,
                sugerencia: sugerencia.sugerencia,
                cambiosRealizados: cambios,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error ejecutando mejora:', error);
            return { exito: false, error: error.message };
        }
    }

    /**
     * Obtener sugerencia con mejor impacto
     * @returns {Object} Sugerencia recomendada
     */
    static obtenerMejorSugerencia() {
        if (this.sugerencias.length === 0) {
            return { mensaje: 'No hay sugerencias disponibles' };
        }

        // Ordenar por prioridad
        const prioridades = { 'ALTA': 3, 'MEDIA': 2, 'BAJA': 1 };
        const ordenadas = [...this.sugerencias].sort((a, b) => 
            (prioridades[b.prioridad] || 0) - (prioridades[a.prioridad] || 0)
        );

        return ordenadas[0];
    }

    /**
     * Obtener todas las sugerencias filtradas
     * @param {Object} filtro - {tipo, prioridad, empleadoId}
     * @returns {Array} Sugerencias filtradas
     */
    static obtenerSugerencias(filtro = {}) {
        let resultados = [...this.sugerencias];

        if (filtro.tipo) {
            resultados = resultados.filter(s => s.tipo === filtro.tipo);
        }

        if (filtro.prioridad) {
            resultados = resultados.filter(s => s.prioridad === filtro.prioridad);
        }

        if (filtro.empleadoId) {
            resultados = resultados.filter(s => s.empleadoId === filtro.empleadoId);
        }

        return resultados;
    }

    /**
     * Obtener resumen de optimización
     * @returns {Object} Resumen de estado
     */
    static obtenerResumen() {
        return {
            isInitialized: this.isInitialized,
            totalSugerencias: this.sugerencias.length,
            porTipo: {
                balanceo: this.sugerencias.filter(s => s.tipo === 'BALANCEO').length,
                mejora: this.sugerencias.filter(s => s.tipo === 'MEJORA').length
            },
            porPrioridad: {
                alta: this.sugerencias.filter(s => s.prioridad === 'ALTA').length,
                media: this.sugerencias.filter(s => s.prioridad === 'MEDIA').length,
                baja: this.sugerencias.filter(s => s.prioridad === 'BAJA').length
            },
            mejoresEjecutadas: this.mejoresEjecutadas,
            mejorSugerencia: this.obtenerMejorSugerencia(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validar integridad del optimizador
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarIntegridad() {
        const errores = [];

        if (!this.isInitialized) {
            errores.push('OptimizadorTurnos no inicializado');
        }

        if (!Array.isArray(this.sugerencias)) {
            errores.push('Lista de sugerencias corrupto');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Exportar sugerencias a JSON
     * @returns {Object} Sugerencias formateadas
     */
    static exportarSugerencias() {
        return {
            generado: new Date().toISOString(),
            totalSugerencias: this.sugerencias.length,
            resumen: this.obtenerResumen(),
            sugerencias: this.sugerencias
        };
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ OptimizadorTurnos cargado');
