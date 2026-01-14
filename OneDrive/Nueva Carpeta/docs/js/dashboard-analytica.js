/**
 * ✅ DASHBOARD ANALÍTICA - Semana 3
 * Panel de control con gráficos y estadísticas de turnos
 * Sin dependencias externas (gráficos ASCII básicos)
 * 
 * @version 3.0.0
 * @date 2 de enero de 2026
 */

class DashboardAnalytica {
    static isInitialized = false;
    static metricas = {};
    static historialMetricas = [];
    static maxHistorial = 100;

    /**
     * Inicializar dashboard
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ DashboardAnalytica ya fue inicializado');
            return;
        }

        console.log('📊 Inicializando DashboardAnalytica...');
        this.isInitialized = true;
        this.calcularMetricas();
        console.log('✅ DashboardAnalytica inicializado');
    }

    /**
     * Calcular todas las métricas del dashboard
     */
    static calcularMetricas() {
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;

        this.metricas = {
            periodo: `${this.getNombreMes(mes)}/${año}`,
            timestamp: new Date().toISOString(),
            totalEmpleados: empleados.length,
            distribucion: {
                activos: 0,
                vacaciones: 0,
                baja: 0,
                inactivos: 0
            },
            turnos: {
                totalAsignados: 0,
                mañana: 0,
                tarde: 0,
                noche: 0,
                descanso: 0,
                vacaciones: 0,
                baja: 0
            },
            horas: {
                totales: 0,
                promedio: 0,
                maxima: 0,
                minima: Infinity
            },
            equidad: {
                indiceGini: 0,
                desviacionEstandar: 0,
                coeficienteVariacion: 0
            },
            cargas: {
                empleadoMaximo: null,
                empleadoMinimo: null
            },
            kpis: {
                ocupacion: 0,
                eficiencia: 0,
                equidadScore: 0
            }
        };

        // Procesar datos de empleados
        const dataEmpleados = [];

        empleados.forEach(empleado => {
            // Contar estado
            if (empleado.estado === 'activo') this.metricas.distribucion.activos++;
            else if (empleado.estado === 'vacaciones') this.metricas.distribucion.vacaciones++;
            else if (empleado.estado === 'baja') this.metricas.distribucion.baja++;
            else this.metricas.distribucion.inactivos++;

            // Procesar turnos del empleado
            const turnos = AppState.scheduleData.get(empleado.id) || [];
            const turnosDelMes = turnos.filter(t => t.mes === mes && t.anio === año);

            let horasEmpleado = 0;
            let turnosEmpleado = 0;

            turnosDelMes.forEach(turno => {
                const tiposTurno = {
                    'mañana': 8, 'tarde': 8, 'noche': 8, 'mixto': 10,
                    'descanso': 0, 'vacaciones': 0, 'baja': 0, 'libre': 0, 'festivo': 0
                };

                const horas = tiposTurno[turno.turno] || 0;
                horasEmpleado += horas;
                turnosEmpleado++;

                // Contar por tipo
                this.metricas.turnos[turno.turno] = (this.metricas.turnos[turno.turno] || 0) + 1;
            });

            // Actualizar totales
            this.metricas.horas.totales += horasEmpleado;
            this.metricas.turnos.totalAsignados += turnosEmpleado;
            this.metricas.horas.maxima = Math.max(this.metricas.horas.maxima, horasEmpleado);
            this.metricas.horas.minima = Math.min(this.metricas.horas.minima, horasEmpleado);

            dataEmpleados.push({
                id: empleado.id,
                nombre: empleado.nombre,
                horas: horasEmpleado,
                turnos: turnosEmpleado
            });
        });

        // Calcular promedios
        if (empleados.length > 0) {
            this.metricas.horas.promedio = (this.metricas.horas.totales / empleados.length).toFixed(1);
            
            // Calcular índice de Gini (medida de desigualdad)
            this.metricas.equidad.indiceGini = this.calcularGini(dataEmpleados.map(e => e.horas));
            
            // Identificar empleados con carga máxima y mínima
            const maxEmp = dataEmpleados.reduce((a, b) => a.horas > b.horas ? a : b);
            const minEmp = dataEmpleados.reduce((a, b) => a.horas < b.horas ? a : b);
            
            this.metricas.cargas.empleadoMaximo = { nombre: maxEmp.nombre, horas: maxEmp.horas };
            this.metricas.cargas.empleadoMinimo = { nombre: minEmp.nombre, horas: minEmp.horas };
        }

        // Calcular KPIs
        this.metricas.kpis.ocupacion = this.calcularOcupacion();
        this.metricas.kpis.eficiencia = this.calcularEficiencia();
        this.metricas.kpis.equidadScore = (100 - (this.metricas.equidad.indiceGini * 100)).toFixed(1);

        // Registrar en historial
        this.registrarMetrica(this.metricas);
    }

    /**
     * Calcular índice de Gini (0 = perfecto balance, 1 = máxima desigualdad)
     * @private
     */
    static calcularGini(valores) {
        if (valores.length === 0) return 0;
        
        const sorted = [...valores].sort((a, b) => a - b);
        let suma = 0;
        
        sorted.forEach((valor, i) => {
            suma += (i + 1) * valor;
        });

        const n = valores.length;
        const media = valores.reduce((a, b) => a + b) / n;
        const gini = (2 * suma) / (n * n * media) - (n + 1) / n;

        return Math.max(0, gini).toFixed(3);
    }

    /**
     * Calcular ocupación (% de turnos vs días)
     * @private
     */
    static calcularOcupacion() {
        const diasTrabajables = 22; // Promedio de días hábiles/mes
        const turnosMaximos = empleados.length * diasTrabajables;
        const ocupacion = ((this.metricas.turnos.totalAsignados / turnosMaximos) * 100).toFixed(1);
        return ocupacion;
    }

    /**
     * Calcular eficiencia (horas contratadas vs trabajadas)
     * @private
     */
    static calcularEficiencia() {
        const horasContratadas = empleados.reduce((sum, e) => sum + (e.horasContrato || 160), 0);
        const eficiencia = ((this.metricas.horas.totales / horasContratadas) * 100).toFixed(1);
        return eficiencia;
    }

    /**
     * Obtener gráfico ASCII de distribución
     * @returns {string} Gráfico formateado
     */
    static generarGraficoDistribucion() {
        const dist = this.metricas.distribucion;
        const total = Object.values(dist).reduce((a, b) => a + b, 0);

        let grafico = '\n📊 DISTRIBUCIÓN DE EMPLEADOS\n';
        grafico += '=' + '='.repeat(40) + '\n';

        Object.entries(dist).forEach(([estado, cantidad]) => {
            const porcentaje = ((cantidad / total) * 100).toFixed(0);
            const barras = '█'.repeat(Math.ceil(porcentaje / 5));
            grafico += `${estado.padEnd(15)} │ ${barras.padEnd(20)} ${porcentaje}% (${cantidad})\n`;
        });

        return grafico;
    }

    /**
     * Obtener gráfico ASCII de turnos
     * @returns {string} Gráfico formateado
     */
    static generarGraficoTurnos() {
        const turnos = this.metricas.turnos;
        const max = Math.max(...Object.values(turnos).filter(v => typeof v === 'number'));

        let grafico = '\n📈 DISTRIBUCIÓN DE TURNOS\n';
        grafico += '=' + '='.repeat(40) + '\n';

        ['mañana', 'tarde', 'noche', 'descanso', 'vacaciones', 'baja'].forEach(tipo => {
            const cantidad = turnos[tipo] || 0;
            const escala = Math.ceil((cantidad / max) * 20);
            const barras = '▄'.repeat(escala);
            grafico += `${tipo.padEnd(15)} │ ${barras.padEnd(20)} ${cantidad}\n`;
        });

        return grafico;
    }

    /**
     * Obtener resumen ejecutivo
     * @returns {string} Resumen formateado
     */
    static generarResumenEjecutivo() {
        let resumen = '\n📋 RESUMEN EJECUTIVO\n';
        resumen += '=' + '='.repeat(40) + '\n';
        resumen += `Período: ${this.metricas.periodo}\n`;
        resumen += `Total Empleados: ${this.metricas.totalEmpleados}\n`;
        resumen += `\n📊 HORAS:\n`;
        resumen += `  Total: ${this.metricas.horas.totales}h\n`;
        resumen += `  Promedio: ${this.metricas.horas.promedio}h\n`;
        resumen += `  Máximo: ${this.metricas.horas.maxima}h\n`;
        resumen += `  Mínimo: ${this.metricas.horas.minima}h\n`;
        resumen += `\n🎯 KPIs:\n`;
        resumen += `  Ocupación: ${this.metricas.kpis.ocupacion}%\n`;
        resumen += `  Eficiencia: ${this.metricas.kpis.eficiencia}%\n`;
        resumen += `  Equidad: ${this.metricas.kpis.equidadScore}%\n`;
        resumen += `\n👥 CARGA LABORAL:\n`;
        if (this.metricas.cargas.empleadoMaximo) {
            resumen += `  Máxima: ${this.metricas.cargas.empleadoMaximo.nombre} (${this.metricas.cargas.empleadoMaximo.horas}h)\n`;
        }
        if (this.metricas.cargas.empleadoMinimo) {
            resumen += `  Mínima: ${this.metricas.cargas.empleadoMinimo.nombre} (${this.metricas.cargas.empleadoMinimo.horas}h)\n`;
        }

        return resumen;
    }

    /**
     * Obtener datos del dashboard
     * @returns {Object} Métricas actuales
     */
    static obtenerMetricas() {
        return this.metricas;
    }

    /**
     * Registrar métrica en historial
     * @private
     */
    static registrarMetrica(metrica) {
        this.historialMetricas.push(metrica);
        
        if (this.historialMetricas.length > this.maxHistorial) {
            this.historialMetricas = this.historialMetricas.slice(-this.maxHistorial);
        }
    }

    /**
     * Obtener tendencias
     * @returns {Object} Análisis de tendencias
     */
    static obtenerTendencias() {
        if (this.historialMetricas.length < 2) {
            return { mensaje: 'Sin suficientes datos para analizar tendencias' };
        }

        const anterior = this.historialMetricas[this.historialMetricas.length - 2];
        const actual = this.historialMetricas[this.historialMetricas.length - 1];

        return {
            horasPromedio: {
                anterior: anterior.horas?.promedio || 0,
                actual: actual.horas?.promedio || 0,
                cambio: (actual.horas?.promedio - anterior.horas?.promedio).toFixed(1)
            },
            ocupacion: {
                anterior: anterior.kpis?.ocupacion || 0,
                actual: actual.kpis?.ocupacion || 0,
                cambio: (actual.kpis?.ocupacion - anterior.kpis?.ocupacion).toFixed(1)
            },
            equidad: {
                anterior: anterior.kpis?.equidadScore || 0,
                actual: actual.kpis?.equidadScore || 0,
                cambio: (actual.kpis?.equidadScore - anterior.kpis?.equidadScore).toFixed(1)
            }
        };
    }

    /**
     * Obtener nombre del mes
     * @private
     */
    static getNombreMes(mes) {
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        return meses[mes] || 'Desconocido';
    }

    /**
     * Validar integridad del dashboard
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarIntegridad() {
        const errores = [];

        if (!this.isInitialized) {
            errores.push('DashboardAnalytica no inicializado');
        }

        if (!this.metricas || typeof this.metricas !== 'object') {
            errores.push('Métricas corrupto');
        }

        if (!Array.isArray(this.historialMetricas)) {
            errores.push('Historial de métricas corrupto');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Exportar dashboard a HTML
     * @returns {string} HTML del dashboard
     */
    static exportarHTML() {
        let html = '<div style="font-family: monospace; white-space: pre; background: #0f172a; color: #e2e8f0; padding: 20px; border-radius: 8px;">';
        html += this.generarResumenEjecutivo();
        html += this.generarGraficoDistribucion();
        html += this.generarGraficoTurnos();
        html += '</div>';
        return html;
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ DashboardAnalytica cargado');
