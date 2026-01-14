/**
 * =====================================================
 * MÓDULO: ANÁLISIS DE EQUIDAD Y CARGA DE TRABAJO
 * =====================================================
 * 
 * Responsable de calcular y renderizar análisis de 
 * distribución equilibrada de turnos entre empleados.
 * 
 * Ubicación en UI: Sección horizontal debajo de KPIs
 */

class AnalisisEquidad {
    /**
     * Calcular estadísticas de equidad del mes actual
     * Carga datos directamente desde la API (igual que KPIs)
     * @returns {Object} Métricas de equidad
     */
    static async calcularMetricas() {
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        const mesKey = `${año}-${mes}`;

        const estadisticas = {};
        let totalDiasGlobal = 0;
        let totalHorasGlobal = 0;
        let totalNochesGlobal = 0;

        // Calcular estadísticas por empleado - Cargando desde API
        for (const emp of (window.empleados || [])) {
            try {
                const turnosEmpleado = AppState.scheduleData.get(emp.id) || [];
                
                // Filtrar por mes/año actual
                const turnosMes = turnosEmpleado.filter(t => {
                    const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                    return fecha.getMonth() === mes && fecha.getFullYear() === año;
                });

                const diasTrabajados = turnosMes.filter(t => 
                    t.turno && !['descanso', 'libre', 'baja', 'vacaciones', '-', 'LL'].includes(t.turno)
                ).length;
                
                const diasNoche = turnosMes.filter(t => 
                    t.turno === 'noche' || t.turno === 'mixto'
                ).length;
                
                const totalHoras = turnosMes.reduce((sum, t) => sum + (t.horas || 0), 0);

                estadisticas[emp.id] = {
                    nombre: emp.nombre,
                    id: emp.id,
                    diasTrabajados,
                    diasNoche,
                    totalHoras
                };

                totalDiasGlobal += diasTrabajados;
                totalHorasGlobal += totalHoras;
                totalNochesGlobal += diasNoche;
            } catch (e) {
                console.warn(`⚠️ Error cargando datos para ${emp.nombre}:`, e.message);
                estadisticas[emp.id] = {
                    nombre: emp.nombre,
                    id: emp.id,
                    diasTrabajados: 0,
                    diasNoche: 0,
                    totalHoras: 0
                };
            }
        }

        // Calcular promedios
        const cantEmpleados = window.empleados ? window.empleados.length : 0;
        const promedioDias = cantEmpleados > 0 ? totalDiasGlobal / cantEmpleados : 0;
        const promedioHoras = cantEmpleados > 0 ? totalHorasGlobal / cantEmpleados : 0;
        const promedioNoches = cantEmpleados > 0 ? totalNochesGlobal / cantEmpleados : 0;

        // Detectar desequilibrios
        const alertas = [];
        Object.values(estadisticas).forEach(stats => {
            if (stats.diasTrabajados > promedioDias * 1.3) {
                alertas.push({
                    empleado: stats.nombre,
                    tipo: 'SOBRECARGADO',
                    diferencia: ((stats.diasTrabajados - promedioDias) / promedioDias * 100).toFixed(0),
                    valor: stats.diasTrabajados
                });
            }
            if (stats.diasTrabajados < promedioDias * 0.7) {
                alertas.push({
                    empleado: stats.nombre,
                    tipo: 'SUBCARGADO',
                    diferencia: ((promedioDias - stats.diasTrabajados) / promedioDias * 100).toFixed(0),
                    valor: stats.diasTrabajados
                });
            }
        });

        return {
            estadisticas,
            promedios: {
                dias: promedioDias,
                horas: promedioHoras,
                noches: promedioNoches
            },
            alertas,
            totalEmpleados: cantEmpleados
        };
    }

    /**
     * Encontrar empleados con más/menos turnos
     * @param {Object} estadisticas - Estadísticas por empleado
     * @returns {Object} Top 3 de cada categoría
     */
    static obtenerRankings(estadisticas) {
        const stats = Object.values(estadisticas);

        const masTurnos = stats
            .sort((a, b) => b.diasTrabajados - a.diasTrabajados)
            .slice(0, 3);

        const menosTurnos = stats
            .sort((a, b) => a.diasTrabajados - b.diasTrabajados)
            .slice(0, 3);

        const masNoches = stats
            .sort((a, b) => b.diasNoche - a.diasNoche)
            .slice(0, 3);

        return { masTurnos, menosTurnos, masNoches };
    }

    /**
     * Renderizar sección de análisis en HTML
     * Ahora es async porque carga datos desde API
     * @returns {Promise<String>} HTML de la sección
     */
    static async renderizar() {
        try {
            const metricas = await this.calcularMetricas();
            const rankings = this.obtenerRankings(metricas.estadisticas);

            return this._construirHTML(metricas, rankings);
        } catch (e) {
            console.error('❌ Error en AnalisisEquidad.renderizar():', e.message);
            return '';
        }
    }

    /**
     * Construir HTML de la sección (privado)
     * @private
     */
    static _construirHTML(metricas, rankings) {
        const { promedios, alertas } = metricas;

        return `
            <div class="analisis-equidad-container">
                <!-- Header -->
                <div class="analisis-equidad-header">
                    <span class="analisis-equidad-icon">📊</span>
                    <h3 class="analisis-equidad-title">Análisis de Equidad y Carga de Trabajo</h3>
                </div>

                <!-- Métricas Principales - 4 columnas horizontales -->
                <div class="analisis-equidad-metricas">
                    ${this._renderMetrica('📅 Días', promedios.dias.toFixed(1), 'Trabajados (prom)', 'metrica-azul')}
                    ${this._renderMetrica('⏰ Horas', promedios.horas.toFixed(0) + 'h', 'Mensuales (prom)', 'metrica-naranja')}
                    ${this._renderMetrica('🌙 Turnos', promedios.noches.toFixed(1), 'Noche (prom)', 'metrica-purpura')}
                    ${this._renderMetrica('⚠️ Estado', alertas.length > 0 ? '❌ Alertas' : '✅ OK', alertas.length + ' desequilibrios', 'metrica-' + (alertas.length > 0 ? 'rojo' : 'verde'))}
                </div>

                <!-- Detalles: Rankings en 3 columnas -->
                <div class="analisis-equidad-detalles">
                    ${this._renderRanking('👥 Más Turnos', rankings.masTurnos)}
                    ${this._renderRanking('🌙 Más Nocturnos', rankings.masNoches)}
                    ${this._renderRanking('📉 Menos Turnos', rankings.menosTurnos)}
                </div>

                <!-- Alertas si existen -->
                ${alertas.length > 0 ? this._renderAlertas(alertas) : ''}
            </div>
        `;
    }

    /**
     * Renderizar una métrica individual (privado)
     * @private
     */
    static _renderMetrica(label, valor, subtitulo, clase) {
        return `
            <div class="analisis-metrica ${clase}">
                <div class="analisis-metrica-label">${label}</div>
                <div class="analisis-metrica-valor">${valor}</div>
                <div class="analisis-metrica-subtitulo">${subtitulo}</div>
            </div>
        `;
    }

    /**
     * Renderizar ranking de empleados (privado)
     * @private
     */
    static _renderRanking(titulo, empleados) {
        // Determinar el tipo de métrica según el título
        let metrica = 'días';
        let unidad = 'd';
        if (titulo.includes('Noche')) {
            metrica = 'turnos noche';
            unidad = 'n';
        } else if (titulo.includes('Menos')) {
            metrica = 'días trabajados';
            unidad = 'd';
        }

        return `
            <div class="analisis-ranking">
                <div class="analisis-ranking-titulo">${titulo}</div>
                ${empleados.map((e, i) => {
                    const valor = e.diasNoche !== undefined && unidad === 'n' ? e.diasNoche : e.diasTrabajados || 0;
                    return `
                        <div class="analisis-ranking-item">
                            <span class="analisis-ranking-medalla">${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                            <span class="analisis-ranking-nombre">${e.nombre}</span>
                            <span class="analisis-ranking-valor" title="${valor} ${metrica}">
                                ${valor}<small style="font-size:10px; margin-left:2px;">${unidad}</small>
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Renderizar alertas (privado)
     * @private
     */
    static _renderAlertas(alertas) {
        return `
            <div class="analisis-alertas">
                <div class="analisis-alertas-titulo">⚠️ Desequilibrios Detectados</div>
                <div class="analisis-alertas-contenido">
                    ${alertas.slice(0, 5).map(a => `
                        <span class="analisis-alerta-badge analisis-alerta-${a.tipo}">
                            ${a.empleado} ${a.tipo === 'SOBRECARGADO' ? '+' : '-'}${a.diferencia}%
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Módulo AnalisisEquidad cargado');
});
