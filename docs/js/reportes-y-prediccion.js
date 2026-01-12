// =============================================
// SISTEMA DE REPORTES AVANZADOS
// =============================================

class GeneradorReportes {
    /**
     * Genera reporte de análisis de rotación de turnos
     */
    static generarReporteRotacion(scheduleData, empleados) {
        const reporte = {
            titulo: 'Análisis de Rotación de Turnos',
            fecha: new Date().toLocaleDateString('es-ES'),
            mes: DateUtils.getNombreMes(AppState.currentMonth),
            año: AppState.currentYear,
            empleados: [],
            resumenGeneral: {}
        };

        let turnosManañaTotal = 0;
        let turnosTardeTotal = 0;
        let turnosNocheTotal = 0;
        let horasTotales = 0;

        empleados.forEach(emp => {
            const turnos = scheduleData.get(emp.id) || [];
            
            const analisisEmpleado = {
                nombre: emp.nombre,
                departamento: emp.departamento,
                turnoPrincipal: emp.turnoPrincipal,
                mañana: turnos.filter(t => t.turno === 'mañana').length,
                tarde: turnos.filter(t => t.turno === 'tarde').length,
                noche: turnos.filter(t => t.turno === 'noche').length,
                descansos: turnos.filter(t => t.turno === 'descanso').length,
                vacaciones: turnos.filter(t => t.turno === 'vacaciones').length,
                baja: turnos.filter(t => t.turno === 'baja').length,
                horasTotales: turnos.reduce((sum, t) => sum + t.horas, 0),
                porcentajeTrabajo: ((turnos.filter(t => t.turno !== 'descanso').length / turnos.length) * 100).toFixed(1)
            };

            reporte.empleados.push(analisisEmpleado);

            turnosManañaTotal += analisisEmpleado.mañana;
            turnosTardeTotal += analisisEmpleado.tarde;
            turnosNocheTotal += analisisEmpleado.noche;
            horasTotales += analisisEmpleado.horasTotales;
        });

        reporte.resumenGeneral = {
            totalEmpleados: empleados.length,
            turnosManañaTotal,
            turnosTardeTotal,
            turnosNocheTotal,
            horasTotales,
            horasPromedio: (horasTotales / empleados.length).toFixed(1)
        };

        return reporte;
    }

    /**
     * Genera reporte de cumplimiento de horas contratadas
     */
    static generarReporteCumplimientoHoras(scheduleData, empleados) {
        const reporte = {
            titulo: 'Cumplimiento de Horas Contratadas',
            fecha: new Date().toLocaleDateString('es-ES'),
            detalle: [],
            resumen: {
                cumplimiento: 0,
                noConformidad: 0,
                advertencia: 0
            }
        };

        empleados.forEach(emp => {
            const turnos = scheduleData.get(emp.id) || [];
            const horasReales = turnos.reduce((sum, t) => sum + t.horas, 0);
            const porcentaje = (horasReales / emp.horasContrato) * 100;

            let estado = 'Cumplimiento';
            if (porcentaje < 90) {
                estado = 'No Conformidad';
                reporte.resumen.noConformidad++;
            } else if (porcentaje < 100) {
                estado = 'Advertencia';
                reporte.resumen.advertencia++;
            } else {
                reporte.resumen.cumplimiento++;
            }

            reporte.detalle.push({
                empleado: emp.nombre,
                departamento: emp.departamento,
                horasContratadas: emp.horasContrato,
                horasReales,
                diferencia: horasReales - emp.horasContrato,
                porcentaje: porcentaje.toFixed(1),
                estado,
                color: estado === 'Cumplimiento' ? '#2ecc71' : 
                       estado === 'Advertencia' ? '#f39c12' : '#e74c3c'
            });
        });

        return reporte;
    }

    /**
     * Genera reporte de distribución de turnos nocturnos
     */
    static generarReporteTurnosNocturno(scheduleData, empleados) {
        const reporte = {
            titulo: 'Distribución de Turnos Nocturnos',
            fecha: new Date().toLocaleDateString('es-ES'),
            detalle: [],
            analisis: {}
        };

        const turnosNochePorEmpleado = empleados.map(emp => ({
            empleado: emp.nombre,
            departamento: emp.departamento,
            turnoPrincipal: emp.turnoPrincipal,
            turnosNoche: (scheduleData.get(emp.id) || []).filter(t => t.turno === 'noche').length
        })).sort((a, b) => b.turnosNoche - a.turnosNoche);

        reporte.detalle = turnosNochePorEmpleado;

        const turnosPromedio = turnosNochePorEmpleado.reduce((sum, e) => sum + e.turnosNoche, 0) / empleados.length;
        
        reporte.analisis = {
            promedio: turnosPromedio.toFixed(1),
            maximo: Math.max(...turnosNochePorEmpleado.map(e => e.turnosNoche)),
            minimo: Math.min(...turnosNochePorEmpleado.map(e => e.turnosNoche)),
            desviacionEstandar: this.calcularDesviacionEstandar(
                turnosNochePorEmpleado.map(e => e.turnosNoche)
            ).toFixed(2),
            equilibrio: turnosPromedio > 0 ? 
                (100 - (this.calcularDesviacionEstandar(turnosNochePorEmpleado.map(e => e.turnosNoche)) / turnosPromedio * 100)).toFixed(1) :
                '100'
        };

        return reporte;
    }

    /**
     * Genera reporte de fines de semana asignados
     */
    static generarReporteFinSemana(scheduleData, empleados) {
        const reporte = {
            titulo: 'Distribución de Fines de Semana',
            fecha: new Date().toLocaleDateString('es-ES'),
            detalle: []
        };

        const finSemanasPorEmpleado = empleados.map(emp => {
            const turnos = scheduleData.get(emp.id) || [];
            const finSemanasTrabajadas = turnos.filter(t => t.esFinSemana && t.turno !== 'descanso').length;
            const finSemanasDescanso = turnos.filter(t => t.esFinSemana && t.turno === 'descanso').length;

            return {
                empleado: emp.nombre,
                departamento: emp.departamento,
                finSemanasTrabajadas,
                finSemanasDescanso,
                total: finSemanasTrabajadas + finSemanasDescanso,
                porcentajeDescanso: ((finSemanasDescanso / (finSemanasTrabajadas + finSemanasDescanso)) * 100).toFixed(1)
            };
        });

        reporte.detalle = finSemanasPorEmpleado;

        return reporte;
    }

    /**
     * Exporta reporte a HTML para visualización e impresión
     */
    static exportarReporteHTML(reporte) {
        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${reporte.titulo}</title>
                <style>
                    * { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                    body { background: #f5f5f5; padding: 20px; }
                    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
                    h1 { color: #2c3e50; margin-bottom: 10px; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
                    .meta { color: #7f8c8d; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background: #3498db; color: white; padding: 12px; text-align: left; }
                    td { padding: 10px; border-bottom: 1px solid #ecf0f1; }
                    tr:nth-child(even) { background: #f8f9fa; }
                    .negativo { color: #e74c3c; font-weight: bold; }
                    .positivo { color: #2ecc71; font-weight: bold; }
                    .advertencia { color: #f39c12; font-weight: bold; }
                    .resumen { background: #f0f8ff; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0; }
                    .resumen h3 { color: #2c3e50; margin-bottom: 10px; }
                    .resumen-item { display: inline-block; margin-right: 30px; }
                    .resumen-valor { font-size: 1.3em; font-weight: bold; color: #3498db; }
                    @media print { body { background: white; } .container { box-shadow: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${reporte.titulo}</h1>
                    <div class="meta">
                        <p><strong>Generado:</strong> ${reporte.fecha}</p>
                        <p><strong>Período:</strong> ${reporte.mes} ${reporte.año}</p>
                    </div>
        `;

        if (reporte.resumen) {
            html += `<div class="resumen"><h3>Resumen</h3>`;
            Object.entries(reporte.resumen).forEach(([key, value]) => {
                html += `<div class="resumen-item"><div style="color: #7f8c8d; font-size: 0.9em;">${key}</div><div class="resumen-valor">${value}</div></div>`;
            });
            html += `</div>`;
        }

        if (reporte.analisis) {
            html += `<div class="resumen"><h3>Análisis</h3>`;
            Object.entries(reporte.analisis).forEach(([key, value]) => {
                html += `<div class="resumen-item"><div style="color: #7f8c8d; font-size: 0.9em;">${key}</div><div class="resumen-valor">${value}</div></div>`;
            });
            html += `</div>`;
        }

        if (reporte.detalle && Array.isArray(reporte.detalle)) {
            html += `<table>`;
            const keys = Object.keys(reporte.detalle[0]);
            html += `<thead><tr>`;
            keys.forEach(key => {
                html += `<th>${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>`;
            });
            html += `</tr></thead><tbody>`;

            reporte.detalle.forEach(item => {
                html += `<tr>`;
                keys.forEach(key => {
                    const valor = item[key];
                    let clase = '';
                    if (typeof valor === 'string') {
                        if (valor.includes('No')) clase = 'negativo';
                        else if (valor.includes('Advertencia')) clase = 'advertencia';
                        else if (valor.includes('Cumpl')) clase = 'positivo';
                    }
                    html += `<td class="${clase}">${valor}</td>`;
                });
                html += `</tr>`;
            });
            html += `</tbody></table>`;
        }

        html += `
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `;

        const ventana = window.open('', '_blank');
        ventana.document.write(html);
        ventana.document.close();
    }

    /**
     * Calcula desviación estándar
     */
    static calcularDesviacionEstandar(numeros) {
        const promedio = numeros.reduce((a, b) => a + b, 0) / numeros.length;
        const varianza = numeros.reduce((sum, num) => sum + Math.pow(num - promedio, 2), 0) / numeros.length;
        return Math.sqrt(varianza);
    }
}

// =============================================
// PREDICTOR DE CONFLICTOS
// =============================================

class PredictorConflictos {
    /**
     * Predice conflictos potenciales en el próximo mes
     */
    static predecirConflictos(scheduleData, empleados) {
        const predicciones = {
            alertasAltas: [],
            alertasMedias: [],
            alertasRojas: []
        };

        empleados.forEach(emp => {
            const turnos = scheduleData.get(emp.id) || [];
            
            // Predicción 1: Acumulación de turnos noche
            const turnosNoche = turnos.filter(t => t.turno === 'noche').length;
            if (turnosNoche > 10) {
                predicciones.alertasRojas.push({
                    empleado: emp.nombre,
                    tipo: 'Exceso de turnos noche',
                    detalle: `${turnosNoche} turnos noche (máximo recomendado: 10)`,
                    impacto: 'Cansancio, errores operacionales'
                });
            } else if (turnosNoche > 8) {
                predicciones.alertasMedias.push({
                    empleado: emp.nombre,
                    tipo: 'Turnos noche elevados',
                    detalle: `${turnosNoche} turnos noche`,
                    impacto: 'Posible fatiga'
                });
            }

            // Predicción 2: Falta de descansos consecutivos
            let diasSeguidos = 0;
            for (let i = 0; i < turnos.length; i++) {
                if (turnos[i].turno !== 'descanso') {
                    diasSeguidos++;
                    if (diasSeguidos > 6) {
                        predicciones.alertasRojas.push({
                            empleado: emp.nombre,
                            tipo: 'Violación de descanso',
                            detalle: `${diasSeguidos} días seguidos sin descanso (máx: 6)`,
                            impacto: 'Incumplimiento legal, burnout'
                        });
                        break;
                    }
                } else {
                    diasSeguidos = 0;
                }
            }

            // Predicción 3: Desequilibrio horario vs contrato
            const horasReales = turnos.reduce((sum, t) => sum + t.horas, 0);
            const porcentaje = (horasReales / emp.horasContrato) * 100;
            if (porcentaje < 80) {
                predicciones.alertasRojas.push({
                    empleado: emp.nombre,
                    tipo: 'Incumplimiento de horas',
                    detalle: `${horasReales}h asignadas vs ${emp.horasContrato}h contratadas (${porcentaje.toFixed(0)}%)`,
                    impacto: 'Problema contractual'
                });
            }
        });

        return predicciones;
    }
}
