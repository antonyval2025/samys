/**
 * SEMANA 5 - DashboardAvanzado
 * KPIs, métricas y visualización de datos
 * - Gráficos de distribución de turnos
 * - Análisis de productividad
 * - Indicadores de desempeño
 * - Exportación de reportes ejecutivos
 */

class DashboardAvanzado {
    static isInitialized = false;
    static metricas = {
        kpis: new Map(),
        historico: [],
        graficos: new Map()
    };

    static init() {
        if (this.isInitialized) return;

        try {
            this.loadFromStorage();
            this.isInitialized = true;
            NotificationSystem.show('✅ DashboardAvanzado inicializado', 'success');
        } catch (error) {
            NotificationSystem.show('❌ Error al inicializar DashboardAvanzado', 'error');
            console.error('DashboardAvanzado Error:', error);
        }
    }

    /**
     * Calcular KPIs principales
     */
    static calcularKPIs(mes, año) {
        try {
            const turnos = this.obtenerTurnosMes(mes, año);
            const empleadosArray = typeof window !== 'undefined' && window.empleados ? window.empleados : [];

            const kpis = {
                totalEmpleados: empleadosArray.length,
                totalTurnos: turnos.length,
                tasaAsistencia: this.calcularTasaAsistencia(turnos),
                distribucionTurnosMañana: this.contarTurnosPorTipo(turnos, 'mañana'),
                distribucionTurnosTarde: this.contarTurnosPorTipo(turnos, 'tarde'),
                distribucionTurnosNoche: this.contarTurnosPorTipo(turnos, 'noche'),
                hrsPromedioPorEmpleado: this.calcularPromedioHoras(turnos, empleadosArray.length),
                cumplimientoHoras: this.calcularCumplimiento(turnos),
                distribucionDescansos: this.contarTurnosPorTipo(turnos, 'descanso'),
                indiceEquidad: this.calcularIndiceEquidad(turnos, empleadosArray),
                costoLaboral: this.estimarCostoLaboral(turnos),
                timestamp: new Date().toISOString()
            };

            this.metricas.kpis.set(`${mes}-${año}`, kpis);
            this.saveToStorage();

            return {
                exito: true,
                kpis: kpis,
                mes: mes,
                año: año
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener turnos de un mes
     */
    static obtenerTurnosMes(mes, año) {
        try {
            const turnos = [];
            if (AppState?.scheduleData) {
                AppState.scheduleData.forEach((empleadoTurnos, empleadoId) => {
                    empleadoTurnos.forEach(turno => {
                        if (turno.dia >= 1 && turno.dia <= 31) {
                            turnos.push({
                                empleadoId: empleadoId,
                                dia: turno.dia,
                                turno: turno.turno,
                                horas: turno.horas || 0
                            });
                        }
                    });
                });
            }
            return turnos;
        } catch (error) {
            return [];
        }
    }

    /**
     * Calcular tasa de asistencia
     */
    static calcularTasaAsistencia(turnos) {
        if (turnos.length === 0) return 0;

        const asistencias = turnos.filter(t => 
            t.turno && !['descanso', 'vacaciones', 'baja'].includes(t.turno)
        ).length;

        return Math.round((asistencias / turnos.length) * 100) / 100;
    }

    /**
     * Contar turnos por tipo
     */
    static contarTurnosPorTipo(turnos, tipo) {
        return turnos.filter(t => t.turno === tipo).length;
    }

    /**
     * Calcular promedio de horas por empleado
     */
    static calcularPromedioHoras(turnos, totalEmpleados) {
        if (totalEmpleados === 0) return 0;

        const totalHoras = turnos.reduce((sum, t) => sum + (t.horas || 0), 0);
        return Math.round((totalHoras / totalEmpleados) * 100) / 100;
    }

    /**
     * Calcular cumplimiento de horas (vs objetivo 160/mes)
     */
    static calcularCumplimiento(turnos) {
        const horasTotales = turnos.reduce((sum, t) => sum + (t.horas || 0), 0);
        const empleadosUnicos = new Set(turnos.map(t => t.empleadoId)).size;
        const horasEsperadas = empleadosUnicos * 160; // 160 hrs/mes estándar

        if (horasEsperadas === 0) return 0;
        return Math.round((horasTotales / horasEsperadas) * 100) / 100;
    }

    /**
     * Calcular índice de equidad (Gini coefficient)
     */
    static calcularIndiceEquidad(turnos, empleados) {
        try {
            const horasPorEmpleado = {};
            turnos.forEach(t => {
                horasPorEmpleado[t.empleadoId] = (horasPorEmpleado[t.empleadoId] || 0) + (t.horas || 0);
            });

            const horas = Object.values(horasPorEmpleado);
            if (horas.length === 0) return 1;

            const media = horas.reduce((a, b) => a + b) / horas.length;
            const diferencias = horas.map(h => Math.abs(h - media));
            const gini = diferencias.reduce((a, b) => a + b) / (2 * horas.length * media);

            return Math.round(gini * 100) / 100;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Estimar costo laboral del mes
     */
    static estimarCostoLaboral(turnos) {
        try {
            const costoHora = 15; // € por hora (aproximado)
            const totalHoras = turnos.reduce((sum, t) => sum + (t.horas || 0), 0);
            return Math.round(totalHoras * costoHora * 100) / 100;
        } catch (error) {
            return 0;
        }
    }

    /**
     * Generar datos para gráfico de distribución
     */
    static generarGraficoDistribucion(mes, año) {
        try {
            const turnos = this.obtenerTurnosMes(mes, año);
            const tipos = ['mañana', 'tarde', 'noche', 'mixto', 'descanso', 'vacaciones', 'baja', 'festivo'];

            const datos = {
                labels: tipos.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
                datos: tipos.map(t => this.contarTurnosPorTipo(turnos, t)),
                colores: [
                    '#d4edda', '#fff3cd', '#f8d7da', '#d1ecf1',
                    '#e2e3e5', '#cfe2ff', '#f8f9fa', '#ffeaa7'
                ]
            };

            return {
                exito: true,
                grafico: datos
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Análisis de empleado individual
     */
    static analizarEmpleado(empleadoId, mes, año) {
        try {
            const turnos = this.obtenerTurnosMes(mes, año)
                .filter(t => t.empleadoId === empleadoId);

            const analisis = {
                empleadoId: empleadoId,
                totalTurnos: turnos.length,
                totalHoras: turnos.reduce((sum, t) => sum + (t.horas || 0), 0),
                distribucion: {
                    mañana: this.contarTurnosPorTipo(turnos, 'mañana'),
                    tarde: this.contarTurnosPorTipo(turnos, 'tarde'),
                    noche: this.contarTurnosPorTipo(turnos, 'noche'),
                    descansos: this.contarTurnosPorTipo(turnos, 'descanso')
                },
                cumplimiento: Math.round((turnos.reduce((s, t) => s + (t.horas || 0), 0) / 160) * 100),
                diasTrabajados: turnos.filter(t => !['descanso', 'vacaciones', 'baja'].includes(t.turno)).length,
                diasDescanso: this.contarTurnosPorTipo(turnos, 'descanso'),
                fechaAnalisis: new Date().toISOString()
            };

            return {
                exito: true,
                analisis: analisis
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Generar reporte ejecutivo en HTML
     */
    static generarReporteEjecutivo(mes, año) {
        try {
            const kpis = this.calcularKPIs(mes, año);
            if (!kpis.exito) throw new Error('Error al calcular KPIs');

            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                  color: white; padding: 20px; border-radius: 8px; text-align: center; }
                        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                                   gap: 15px; margin: 20px 0; }
                        .kpi-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        .kpi-value { font-size: 32px; font-weight: bold; color: #667eea; }
                        .kpi-label { color: #666; margin-top: 10px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
                        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background: #667eea; color: white; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📊 Reporte Ejecutivo - ${meses[mes-1]} ${año}</h1>
                        <p>Generado: ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-value">${kpis.kpis.totalEmpleados}</div>
                            <div class="kpi-label">Total Empleados</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">${kpis.kpis.totalTurnos}</div>
                            <div class="kpi-label">Total Turnos</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">${(kpis.kpis.tasaAsistencia * 100).toFixed(1)}%</div>
                            <div class="kpi-label">Tasa Asistencia</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">${kpis.kpis.hrsPromedioPorEmpleado}</div>
                            <div class="kpi-label">Horas Promedio</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">${(kpis.kpis.cumplimientoHoras * 100).toFixed(1)}%</div>
                            <div class="kpi-label">Cumplimiento Horas</div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-value">€${kpis.kpis.costoLaboral.toLocaleString('es-ES')}</div>
                            <div class="kpi-label">Costo Laboral</div>
                        </div>
                    </div>

                    <h2>Distribución de Turnos</h2>
                    <table>
                        <tr>
                            <th>Tipo Turno</th>
                            <th>Cantidad</th>
                            <th>Porcentaje</th>
                        </tr>
                        <tr>
                            <td>Mañana</td>
                            <td>${kpis.kpis.distribucionTurnosMañana}</td>
                            <td>${((kpis.kpis.distribucionTurnosMañana / kpis.kpis.totalTurnos) * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>Tarde</td>
                            <td>${kpis.kpis.distribucionTurnosTarde}</td>
                            <td>${((kpis.kpis.distribucionTurnosTarde / kpis.kpis.totalTurnos) * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>Noche</td>
                            <td>${kpis.kpis.distribucionTurnosNoche}</td>
                            <td>${((kpis.kpis.distribucionTurnosNoche / kpis.kpis.totalTurnos) * 100).toFixed(1)}%</td>
                        </tr>
                        <tr>
                            <td>Descansos</td>
                            <td>${kpis.kpis.distribucionDescansos}</td>
                            <td>${((kpis.kpis.distribucionDescansos / kpis.kpis.totalTurnos) * 100).toFixed(1)}%</td>
                        </tr>
                    </table>

                    <div class="footer">
                        <p>Sistema de Gestión de Cuadrantes v5.0 | Confidencial</p>
                    </div>
                </body>
                </html>
            `;

            return {
                exito: true,
                html: html,
                nombreArchivo: `reporte_${meses[mes-1]}_${año}.html`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Exportar reporte como PDF (simulated)
     */
    static exportarReportePDF(mes, año) {
        try {
            const reporte = this.generarReporteEjecutivo(mes, año);
            if (!reporte.exito) throw new Error(reporte.mensaje);

            const blob = new Blob([reporte.html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = reporte.nombreArchivo.replace('.html', '.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return { exito: true, mensaje: 'PDF exportado' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Persistencia
     */
    static saveToStorage() {
        try {
            const datos = {
                kpis: Array.from(this.metricas.kpis.entries()),
                historico: this.metricas.historico,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('dashboardAvanzado', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando DashboardAvanzado:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('dashboardAvanzado');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.metricas.kpis = new Map(parsed.kpis);
                this.metricas.historico = parsed.historico || [];
            }
        } catch (error) {
            console.error('Error cargando DashboardAvanzado:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DashboardAvanzado.init());
} else {
    DashboardAvanzado.init();
}
