/**
 * ✅ GENERADOR DE REPORTES - Semana 2
 * Crea reportes automáticos de turnos, horas trabajadas, equidad de distribución
 * Sin dependencias externas, funciona con la app existente
 * 
 * @version 2.0.0
 * @date 2 de enero de 2026
 */

class GeneradorReportes {
    /**
     * Generar reporte completo del mes
     * @returns {Object} Reporte con estadísticas generales
     */
    static generarReporteMensual() {
        // Guards para variables globales
        if (typeof empleados === 'undefined' || !empleados) {
            console.warn('⚠️ empleados no está definido');
            return { empleados: [], estadisticas: {}, periodo: 'Desconocido' };
        }
        if (typeof AppState === 'undefined' || !AppState) {
            console.warn('⚠️ AppState no está definido');
            return { empleados: [], estadisticas: {}, periodo: 'Desconocido' };
        }

        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        
        let reporte = {
            periodo: `${this.getNombreMes(mes)}/${año}`,
            fechaGeneracion: new Date().toISOString(),
            totalEmpleados: empleados.length,
            empleadosActivos: 0,
            empleadosEnVacaciones: 0,
            empleadosEnBaja: 0,
            estadisticas: {
                horasTotales: 0,
                turnosAsignados: 0,
                turnosNocturnos: 0,
                turnosDescanso: 0,
                horaPromedio: 0
            },
            empleados: [],
            conflictos: [],
            warnings: []
        };

        // ✅ CALCULAR ESTADÍSTICAS POR EMPLEADO
        empleados.forEach(empleado => {
            const turnos = AppState.scheduleData.get(empleado.id) || [];
            let horasEmpleado = 0;
            let turnosNocturnos = 0;
            let turnosDescanso = 0;
            const detallesTurnos = [];

            turnos.forEach(turno => {
                if (turno.mes === mes && turno.anio === año) {
                    const tiposTurno = {
                        'mañana': 8, 'tarde': 8, 'noche': 8, 'mixto': 10,
                        'descanso': 0, 'vacaciones': 0, 'baja': 0, 'libre': 0, 'festivo': 0
                    };
                    
                    const horas = tiposTurno[turno.turno] || 0;
                    horasEmpleado += horas;
                    
                    if (turno.turno === 'noche') turnosNocturnos++;
                    if (turno.turno === 'descanso') turnosDescanso++;
                    
                    detallesTurnos.push({
                        dia: turno.dia,
                        turno: turno.turno,
                        horas: horas
                    });
                }
            });

            // ✅ REGISTRAR ESTADO DEL EMPLEADO
            if (empleado.estado === 'activo') reporte.empleadosActivos++;
            else if (empleado.estado === 'vacaciones') reporte.empleadosEnVacaciones++;
            else if (empleado.estado === 'baja') reporte.empleadosEnBaja++;

            // ✅ AGREGAR A REPORTE
            reporte.empleados.push({
                id: empleado.id,
                nombre: empleado.nombre,
                departamento: empleado.departamento || 'No especificado',
                estado: empleado.estado,
                horasTrabajadas: horasEmpleado,
                turnosNocturnos: turnosNocturnos,
                turnosDescanso: turnosDescanso,
                turnosTotal: detallesTurnos.length,
                detalles: detallesTurnos
            });

            reporte.estadisticas.horasTotales += horasEmpleado;
            reporte.estadisticas.turnosAsignados += detallesTurnos.length;
            reporte.estadisticas.turnosNocturnos += turnosNocturnos;
            reporte.estadisticas.turnosDescanso += turnosDescanso;
        });

        // ✅ CALCULAR PROMEDIOS
        if (reporte.empleadosActivos > 0) {
            reporte.estadisticas.horaPromedio = (reporte.estadisticas.horasTotales / reporte.empleadosActivos).toFixed(1);
        }

        // ✅ DETECTAR CONFLICTOS Y WARNINGS
        reporte = this.detectarConflictosReporte(reporte);

        console.log('✅ Reporte mensual generado:', reporte);
        return reporte;
    }

    /**
     * Detectar conflictos en la distribución de turnos
     * @param {Object} reporte - Reporte a analizar
     * @returns {Object} Reporte actualizado con conflictos detectados
     */
    static detectarConflictosReporte(reporte) {
        const mesesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        
        reporte.empleados.forEach(emp => {
            // ⚠️ WARNING: Más de 12 turnos nocturnos
            if (emp.turnosNocturnos > 12) {
                reporte.warnings.push({
                    tipo: 'TURNOS_NOCTURNOS_EXCESO',
                    empleado: emp.nombre,
                    valor: emp.turnosNocturnos,
                    limite: 12,
                    mensaje: `⚠️ ${emp.nombre} tiene ${emp.turnosNocturnos} turnos nocturnos (máx recomendado: 12)`
                });
            }

            // ⚠️ WARNING: Horas bajo el contrato
            if (emp.horasTrabajadas < (emp.horasContrato || 160) * 0.8) {
                reporte.warnings.push({
                    tipo: 'HORAS_INSUFICIENTES',
                    empleado: emp.nombre,
                    horasTrabajadas: emp.horasTrabajadas,
                    horasEsperadas: emp.horasContrato || 160,
                    mensaje: `⚠️ ${emp.nombre} ha trabajado menos horas de las esperadas`
                });
            }

            // ❌ CONFLICTO: Menos de 2 descansos consecutivos
            if (emp.turnosDescanso < 2) {
                reporte.conflictos.push({
                    tipo: 'DESCANSOS_INSUFICIENTES',
                    empleado: emp.nombre,
                    cantidad: emp.turnosDescanso,
                    minimo: 2,
                    severidad: 'CRÍTICO',
                    mensaje: `❌ ${emp.nombre} tiene menos de 2 descansos consecutivos`
                });
            }

            // ❌ CONFLICTO: Empleado en baja pero con turnos
            if (emp.estado === 'baja' && emp.turnosTotal > 0) {
                reporte.conflictos.push({
                    tipo: 'EMPLEADO_BAJA_CON_TURNOS',
                    empleado: emp.nombre,
                    severidad: 'CRÍTICO',
                    mensaje: `❌ ${emp.nombre} está en baja pero tiene ${emp.turnosTotal} turnos asignados`
                });
            }
        });

        return reporte;
    }

    /**
     * Generar reporte individual de empleado
     * @param {number} empleadoId - ID del empleado
     * @returns {Object} Reporte detallado del empleado
     */
    static generarReporteEmpleado(empleadoId) {
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) {
            return { valido: false, error: `Empleado ${empleadoId} no encontrado` };
        }

        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        const turnos = AppState.scheduleData.get(empleadoId) || [];
        
        const reporteEmpleado = {
            empleado: {
                id: empleado.id,
                nombre: empleado.nombre,
                email: empleado.email,
                telefono: empleado.telefono,
                departamento: empleado.departamento,
                estado: empleado.estado,
                horasContrato: empleado.horasContrato
            },
            periodo: `${this.getNombreMes(mes)}/${año}`,
            fechaGeneracion: new Date().toISOString(),
            estadisticas: {
                horasTrabajadas: 0,
                turnosTotal: 0,
                turnosNocturnos: 0,
                turnosMañana: 0,
                turnosTarde: 0,
                turnosDescanso: 0,
                turnosVacaciones: 0,
                turnosBaja: 0,
                turnosLibre: 0,
                porcentajeNocturno: 0,
                porcentajeDescanso: 0
            },
            calendario: [],
            recomendaciones: []
        };

        // ✅ PROCESAR TURNOS DEL MES
        turnos.forEach(turno => {
            if (turno.mes === mes && turno.anio === año) {
                const tiposTurno = {
                    'mañana': { horas: 8, icono: '🌅' },
                    'tarde': { horas: 8, icono: '☀️' },
                    'noche': { horas: 8, icono: '🌙' },
                    'mixto': { horas: 10, icono: '🔄' },
                    'descanso': { horas: 0, icono: '😴' },
                    'vacaciones': { horas: 0, icono: '🏖️' },
                    'baja': { horas: 0, icono: '🚑' },
                    'libre': { horas: 0, icono: '🆓' },
                    'festivo': { horas: 0, icono: '🎉' }
                };

                const config = tiposTurno[turno.turno] || { horas: 0, icono: '?' };
                reporteEmpleado.estadisticas.horasTrabajadas += config.horas;
                reporteEmpleado.estadisticas.turnosTotal++;

                // Contar por tipo
                if (turno.turno === 'noche') reporteEmpleado.estadisticas.turnosNocturnos++;
                else if (turno.turno === 'mañana') reporteEmpleado.estadisticas.turnosMañana++;
                else if (turno.turno === 'tarde') reporteEmpleado.estadisticas.turnosTarde++;
                else if (turno.turno === 'descanso') reporteEmpleado.estadisticas.turnosDescanso++;
                else if (turno.turno === 'vacaciones') reporteEmpleado.estadisticas.turnosVacaciones++;
                else if (turno.turno === 'baja') reporteEmpleado.estadisticas.turnosBaja++;
                else if (turno.turno === 'libre') reporteEmpleado.estadisticas.turnosLibre++;

                reporteEmpleado.calendario.push({
                    dia: turno.dia,
                    turno: turno.turno,
                    horas: config.horas,
                    icono: config.icono
                });
            }
        });

        // ✅ CALCULAR PORCENTAJES
        if (reporteEmpleado.estadisticas.turnosTotal > 0) {
            reporteEmpleado.estadisticas.porcentajeNocturno = (
                (reporteEmpleado.estadisticas.turnosNocturnos / reporteEmpleado.estadisticas.turnosTotal) * 100
            ).toFixed(1);
            
            reporteEmpleado.estadisticas.porcentajeDescanso = (
                (reporteEmpleado.estadisticas.turnosDescanso / reporteEmpleado.estadisticas.turnosTotal) * 100
            ).toFixed(1);
        }

        // ✅ GENERAR RECOMENDACIONES
        reporteEmpleado.recomendaciones = this.generarRecomendaciones(reporteEmpleado);

        console.log('✅ Reporte de empleado generado:', reporteEmpleado);
        return reporteEmpleado;
    }

    /**
     * Generar recomendaciones basadas en datos
     * @param {Object} reporteEmpleado - Reporte del empleado
     * @returns {Array} Lista de recomendaciones
     */
    static generarRecomendaciones(reporteEmpleado) {
        const recomendaciones = [];
        const stats = reporteEmpleado.estadisticas;

        if (stats.turnosNocturnos > 10) {
            recomendaciones.push({
                tipo: 'BALANCE',
                icono: '⚖️',
                mensaje: `Muchos turnos nocturnos (${stats.turnosNocturnos}). Considera reducir para mejor salud.`,
                prioridad: 'ALTA'
            });
        }

        if (stats.porcentajeDescanso < 20) {
            recomendaciones.push({
                tipo: 'DESCANSO',
                icono: '😴',
                mensaje: 'Pocos días de descanso. Es importante recuperarse.',
                prioridad: 'ALTA'
            });
        }

        if (stats.horasTrabajadas < (reporteEmpleado.empleado.horasContrato * 0.9)) {
            recomendaciones.push({
                tipo: 'HORAS',
                icono: '⏰',
                mensaje: `Horas trabajadas (${stats.horasTrabajadas}) inferior al contrato (${reporteEmpleado.empleado.horasContrato}).`,
                prioridad: 'MEDIA'
            });
        }

        if (stats.turnosTotal > 25) {
            recomendaciones.push({
                tipo: 'CARGA',
                icono: '📊',
                mensaje: `Carga de trabajo alta (${stats.turnosTotal} turnos). Evalúa distribución equitativa.`,
                prioridad: 'MEDIA'
            });
        }

        return recomendaciones;
    }

    /**
     * Exportar reporte a HTML
     * @param {Object} reporte - Reporte a exportar
     * @returns {string} HTML del reporte
     */
    static exportarReporteHTML(reporte) {
        let html = `
        <div style="font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #0f172a; text-align: center;">📊 Reporte de Turnos - ${reporte.periodo}</h1>
            <p style="color: #666; text-align: center;">Generado: ${new Date(reporte.fechaGeneracion).toLocaleString('es-ES')}</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #0ea5e9;">Estadísticas Generales</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Total Empleados</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${reporte.totalEmpleados}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Activos</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${reporte.empleadosActivos}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>En Vacaciones</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${reporte.empleadosEnVacaciones}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>En Baja</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${reporte.empleadosEnBaja}</td>
                    </tr>
                    <tr style="background: #e0f2fe;">
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Horas Totales</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>${reporte.estadisticas.horasTotales}h</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Promedio por Empleado</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${reporte.estadisticas.horaPromedio}h</td>
                    </tr>
                </table>
            </div>
        </div>`;

        return html;
    }

    /**
     * Obtener nombre del mes
     * @param {number} mes - Índice del mes (0-11)
     * @returns {string} Nombre del mes
     */
    static getNombreMes(mes) {
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        return meses[mes] || 'Desconocido';
    }

    /**
     * Validar integridad del reporte
     * @param {Object} reporte - Reporte a validar
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarReporte(reporte) {
        const errores = [];

        if (!reporte.periodo) {
            errores.push('Periodo no especificado');
        }

        if (!Array.isArray(reporte.empleados)) {
            errores.push('Lista de empleados inválida');
        }

        if (reporte.estadisticas.horasTotales < 0) {
            errores.push('Horas totales no pueden ser negativas');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            timestamp: new Date().toISOString()
        };
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ GeneradorReportes cargado');
