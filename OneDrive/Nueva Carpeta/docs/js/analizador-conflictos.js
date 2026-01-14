/**
 * ✅ ANALIZADOR DE CONFLICTOS - Semana 3
 * Análisis predictivo y detección de incompatibilidades en turnos
 * Sin dependencias externas
 * 
 * @version 3.0.0
 * @date 2 de enero de 2026
 */

class AnalizadorConflictos {
    static isInitialized = false;
    static conflictosDetectados = [];
    static alertasCriticas = [];
    static warnings = [];
    static maxHistorial = 200;

    /**
     * Inicializar analizador de conflictos
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ AnalizadorConflictos ya fue inicializado');
            return;
        }

        console.log('🔍 Inicializando AnalizadorConflictos...');
        this.isInitialized = true;
        
        // Ejecutar análisis inicial
        this.analizarCuadranteCompleto();
        
        console.log('✅ AnalizadorConflictos inicializado');
    }

    /**
     * Analizar cuadrante completo en busca de conflictos
     * @returns {Object} Reporte de conflictos
     */
    static analizarCuadranteCompleto() {
        this.conflictosDetectados = [];
        this.alertasCriticas = [];
        this.warnings = [];

        empleados.forEach(empleado => {
            this.analizarEmpleado(empleado.id);
        });

        this.analizarPatronesGlobales();

        const reporte = {
            timestamp: new Date().toISOString(),
            totalEmpleados: empleados.length,
            conflictosEncontrados: this.conflictosDetectados.length,
            alertasCriticas: this.alertasCriticas.length,
            warnings: this.warnings.length,
            conflictos: this.conflictosDetectados,
            alertas: this.alertasCriticas,
            advertencias: this.warnings
        };

        console.log(`🔍 Análisis completado: ${this.conflictosDetectados.length} conflictos, ${this.alertasCriticas.length} alertas críticas`);
        return reporte;
    }

    /**
     * Analizar empleado específico
     * @param {number} empleadoId - ID del empleado
     * @returns {Array} Lista de conflictos encontrados
     */
    static analizarEmpleado(empleadoId) {
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) return [];

        const conflictosEmpleado = [];
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        // Filtrar turnos del mes actual
        const turnosDelMes = turnos.filter(t => t.mes === mes && t.anio === año);

        // ❌ CONFLICTO 1: Demasiados turnos nocturnos
        const turnosNocturnos = turnosDelMes.filter(t => t.turno === 'noche').length;
        if (turnosNocturnos > 12) {
            const conflicto = {
                tipo: 'TURNOS_NOCTURNOS_EXCESO',
                empleadoId: empleadoId,
                empleado: empleado.nombre,
                severidad: 'CRÍTICA',
                valor: turnosNocturnos,
                limite: 12,
                descripcion: `${empleado.nombre} tiene ${turnosNocturnos} turnos nocturnos (máx recomendado: 12)`,
                accion: 'Reducir turnos nocturnos para preservar salud del empleado'
            };
            this.alertasCriticas.push(conflicto);
            conflictosEmpleado.push(conflicto);
        }

        // ❌ CONFLICTO 2: Menos de 2 descansos consecutivos
        const turnosDescanso = turnosDelMes.filter(t => t.turno === 'descanso').length;
        if (turnosDescanso < 2) {
            const conflicto = {
                tipo: 'DESCANSOS_INSUFICIENTES',
                empleadoId: empleadoId,
                empleado: empleado.nombre,
                severidad: 'CRÍTICA',
                valor: turnosDescanso,
                minimo: 2,
                descripcion: `${empleado.nombre} tiene ${turnosDescanso} descansos (mínimo legal: 2)`,
                accion: 'Agregar más días de descanso'
            };
            this.alertasCriticas.push(conflicto);
            conflictosEmpleado.push(conflicto);
        }

        // ❌ CONFLICTO 3: Empleado en baja con turnos asignados
        if (empleado.estado === 'baja' && turnosDelMes.length > 0) {
            const conflicto = {
                tipo: 'EMPLEADO_BAJA_CON_TURNOS',
                empleadoId: empleadoId,
                empleado: empleado.nombre,
                severidad: 'CRÍTICA',
                turnosAsignados: turnosDelMes.length,
                descripcion: `${empleado.nombre} está en BAJA pero tiene ${turnosDelMes.length} turnos`,
                accion: 'Remover todos los turnos del empleado en baja'
            };
            this.alertasCriticas.push(conflicto);
            conflictosEmpleado.push(conflicto);
        }

        // ❌ CONFLICTO 4: Empleado en vacaciones con turnos laborales
        if (empleado.estado === 'vacaciones') {
            const turnosLaborales = turnosDelMes.filter(t => 
                ['mañana', 'tarde', 'noche', 'mixto'].includes(t.turno)
            ).length;
            if (turnosLaborales > 0) {
                const conflicto = {
                    tipo: 'EMPLEADO_VACACIONES_CON_TURNOS',
                    empleadoId: empleadoId,
                    empleado: empleado.nombre,
                    severidad: 'ALTA',
                    turnosLaborales: turnosLaborales,
                    descripcion: `${empleado.nombre} está en vacaciones pero tiene ${turnosLaborales} turnos laborales`,
                    accion: 'Cambiar turnos laborales a "vacaciones"'
                };
                this.alertasCriticas.push(conflicto);
                conflictosEmpleado.push(conflicto);
            }
        }

        // ⚠️ WARNING 1: Horas insuficientes
        const horasTrabajadas = turnosDelMes
            .filter(t => ['mañana', 'tarde', 'noche'].includes(t.turno))
            .length * 8;
        
        const horasEsperadas = (empleado.horasContrato || 160) * 0.8;
        if (horasTrabajadas < horasEsperadas) {
            this.warnings.push({
                tipo: 'HORAS_INSUFICIENTES',
                empleadoId: empleadoId,
                empleado: empleado.nombre,
                severidad: 'MEDIA',
                horasTrabajadas: horasTrabajadas,
                horasEsperadas: horasEsperadas,
                deficit: horasEsperadas - horasTrabajadas,
                descripcion: `${empleado.nombre} está bajo sus horas contratadas`
            });
        }

        // ⚠️ WARNING 2: Muchos turnos seguidos
        const turnosSeguidos = this.detectarTurnosSeguidos(turnosDelMes);
        if (turnosSeguidos.max > 5) {
            this.warnings.push({
                tipo: 'TURNOS_SEGUIDOS_EXCESO',
                empleadoId: empleadoId,
                empleado: empleado.nombre,
                severidad: 'MEDIA',
                maxConsecutivos: turnosSeguidos.max,
                recomendado: 5,
                descripcion: `${empleado.nombre} tiene hasta ${turnosSeguidos.max} turnos consecutivos`
            });
        }

        this.conflictosDetectados.push(...conflictosEmpleado);
        return conflictosEmpleado;
    }

    /**
     * Detectar turnos seguidos sin descanso
     * @private
     */
    static detectarTurnosSeguidos(turnos) {
        let maxConsecutivos = 0;
        let actual = 0;

        for (let dia = 1; dia <= 31; dia++) {
            const turno = turnos.find(t => t.dia === dia);
            if (turno && turno.turno !== 'descanso') {
                actual++;
                maxConsecutivos = Math.max(maxConsecutivos, actual);
            } else {
                actual = 0;
            }
        }

        return { max: maxConsecutivos };
    }

    /**
     * Analizar patrones globales
     * @private
     */
    static analizarPatronesGlobales() {
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        // Calcular distribución de turnos nocturnos
        let totalNocturnos = 0;
        const nocturosPorEmpleado = {};

        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            const nocturnos = turnos.filter(t => 
                t.mes === mes && t.anio === año && t.turno === 'noche'
            ).length;
            nocturosPorEmpleado[emp.id] = nocturnos;
            totalNocturnos += nocturnos;
        });

        // Detectar desbalance en distribución
        const promedio = totalNocturnos / empleados.length;
        const desviacion = Object.values(nocturosPorEmpleado).map(n => 
            Math.abs(n - promedio)
        ).reduce((a, b) => a + b, 0) / empleados.length;

        if (desviacion > 3) {
            this.warnings.push({
                tipo: 'DISTRIBUCION_DESBALANCEADA',
                severidad: 'MEDIA',
                parametro: 'Turnos nocturnos',
                promedio: promedio.toFixed(1),
                desviacion: desviacion.toFixed(1),
                descripcion: 'Distribución muy desigual de turnos nocturnos entre empleados',
                accion: 'Rebalancear turnos para mayor equidad'
            });
        }
    }

    /**
     * Obtener predicción de conflictos para cambio propuesto
     * @param {Object} cambio - {empleadoId, dia, nuevoTurno}
     * @returns {Object} Predicción de conflictos
     */
    static predecirConflictosDelCambio(cambio) {
        const { empleadoId, dia, nuevoTurno } = cambio;
        const prediccion = {
            cambio: cambio,
            conflictosPosibles: [],
            warnings: [],
            seguro: true,
            timestamp: new Date().toISOString()
        };

        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) {
            return { ...prediccion, error: 'Empleado no encontrado' };
        }

        // Simular el cambio
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const turnoActual = turnos.find(t => t.dia === dia);

        // Si es noche, verificar límite de 12
        if (nuevoTurno === 'noche') {
            const mes = AppState.currentMonth;
            const año = AppState.currentYear;
            const nocturnos = turnos.filter(t => 
                t.mes === mes && t.anio === año && t.turno === 'noche'
            ).length;

            if (nocturnos + 1 > 12) {
                prediccion.conflictosPosibles.push({
                    tipo: 'NOCTURNOS_SOBRE_LIMITE',
                    limite: 12,
                    futuroTotal: nocturnos + 1,
                    severidad: 'ALTA'
                });
                prediccion.seguro = false;
            }
        }

        // Si quita descanso, verificar mínimo
        if (turnoActual?.turno === 'descanso' && nuevoTurno !== 'descanso') {
            const descansos = turnos.filter(t => t.turno === 'descanso').length;
            if (descansos - 1 < 2) {
                prediccion.warnings.push({
                    tipo: 'DESCANSOS_BAJO_MINIMO',
                    minimo: 2,
                    futuroTotal: descansos - 1,
                    severidad: 'ALTA'
                });
            }
        }

        return prediccion;
    }

    /**
     * Obtener resumen de estado actual
     * @returns {Object} Resumen de conflictos
     */
    static obtenerResumen() {
        return {
            isInitialized: this.isInitialized,
            totalConflictos: this.conflictosDetectados.length,
            alertasCriticas: this.alertasCriticas.length,
            totalWarnings: this.warnings.length,
            ultimoAnalisis: this.obtenerUltimoAnalisis(),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Obtener último análisis realizado
     * @private
     */
    static obtenerUltimoAnalisis() {
        if (this.conflictosDetectados.length === 0 && this.alertasCriticas.length === 0) {
            return 'Sin conflictos detectados';
        }

        return `${this.alertasCriticas.length} alertas críticas, ${this.warnings.length} advertencias`;
    }

    /**
     * Limpiar historial de conflictos
     */
    static limpiarHistorial() {
        const cantidad = this.conflictosDetectados.length;
        this.conflictosDetectados = [];
        this.alertasCriticas = [];
        this.warnings = [];
        return { conflictosLimpios: cantidad, timestamp: new Date().toISOString() };
    }

    /**
     * Exportar reporte de conflictos
     * @returns {Object} Reporte completo
     */
    static exportarReporte() {
        return {
            generado: new Date().toISOString(),
            periodo: `${AppState.currentMonth + 1}/${AppState.currentYear}`,
            conflictosDetectados: this.conflictosDetectados,
            alertasCriticas: this.alertasCriticas,
            warnings: this.warnings,
            resumen: this.obtenerResumen()
        };
    }

    /**
     * Validar integridad del analizador
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarIntegridad() {
        const errores = [];

        if (!this.isInitialized) {
            errores.push('AnalizadorConflictos no inicializado');
        }

        if (!Array.isArray(this.conflictosDetectados)) {
            errores.push('Historial de conflictos corrupto');
        }

        if (!Array.isArray(this.alertasCriticas)) {
            errores.push('Alertas críticas corrupto');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            timestamp: new Date().toISOString()
        };
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ AnalizadorConflictos cargado');
