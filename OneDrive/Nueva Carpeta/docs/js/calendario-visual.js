/**
 * CALENDARIO VISUAL - Sistema de Gestión de Turnos v8.0+
 * Calendario interactivo con vista de conflictos, indicadores de carga y eventos
 * 
 * Clases:
 * - CalendarioVisual: Calendario mensual/anual con turnos
 * - VisualizadorConflictos: Resaltar conflictos en rojo
 * - IndicadorCarga: Mostrar carga de trabajo por día
 * - CalendarioAnual: Vista anual con heatmap
 */

// ═════════════════════════════════════════════════════════════════════════════
// CALENDARIO VISUAL MENSUAL
// ═════════════════════════════════════════════════════════════════════════════

class CalendarioVisual {
    static calendario = null;
    static year = new Date().getFullYear();
    static month = new Date().getMonth();
    static selectedDay = null;
    static empleadoSeleccionado = null;

    /**
     * Inicializar calendario
     */
    static inicializar() {
        console.log('📅 Inicializando CalendarioVisual');
        this.renderizarCalendario();
    }

    /**
     * Renderizar calendario mensual
     * Ahora maneja Promise de AnalisisEquidad.renderizar()
     */
    static async renderizarCalendario() {
        const container = document.getElementById('calendarioVisual');
        if (!container) return;

        // Generar análisis de equidad usando el módulo separado
        let html = await AnalisisEquidad.renderizar();
        container.innerHTML = html;
    }

    /**
     * Cambiar mes anterior
     */
    static mesAnterior() {
        if (this.month === 0) {
            this.month = 11;
            this.year--;
        } else {
            this.month--;
        }
        this.renderizarCalendario().catch(e => console.error('Error renderizando calendario:', e));
    }

    /**
     * Cambiar mes siguiente
     */
    static mesSiguiente() {
        if (this.month === 11) {
            this.month = 0;
            this.year++;
        } else {
            this.month++;
        }
        this.renderizarCalendario().catch(e => console.error('Error renderizando calendario:', e));
    }

    /**
     * Verificar si es hoy
     */
    static esHoy(fecha) {
        const hoy = new Date();
        return fecha.getDate() === hoy.getDate() &&
               fecha.getMonth() === hoy.getMonth() &&
               fecha.getFullYear() === hoy.getFullYear();
    }

    /**
     * Seleccionar día
     */
    static seleccionarDia(dia) {
        this.selectedDay = dia;
        const fecha = new Date(this.year, this.month, dia);
        console.log(`📅 Día seleccionado: ${dia}/${this.month + 1}/${this.year}`);

        // Mostrar detalles del día
        this.mostrarDetallesDia(fecha);
    }

    /**
     * Mostrar detalles del día seleccionado
     */
    static mostrarDetallesDia(fecha) {
        const conflictos = VisualizadorConflictos.detectarConflictosDelDia(fecha);
        const carga = IndicadorCarga.calcularCargaDelDia(fecha);
        const turnos = this.obtenerTurnosDelDia(fecha);

        let html = `
            <div id="detallesCalendario" class="modal active">
                <div class="modal-content" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 600px;">
                    <h2 class="modal-title" style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0 0 10px 0; padding: 20px 20px 0 20px;">📅 Detalles del Día</h2>
                    <p style="color: #64748b; margin: 8px 20px 15px 20px; font-size: 14px;">
                        ${fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 20px; padding: 0;">
                        <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 15px; border-radius: 12px; border: 1px solid #bfdbfe;">
                            <strong style="color: #1e40af; font-size: 14px;">Empleados Trabajando:</strong>
                            <p style="font-size: 2.2em; color: #1e40af; margin: 8px 0 0 0; font-weight: 700;">${carga}</p>
                        </div>
                        <div style="background: linear-gradient(135deg, ${conflictos.length > 0 ? '#fee2e2 0%, #fecaca' : '#d1fae5 0%, #a7f3d0'} 100%); padding: 15px; border-radius: 12px; border: 1px solid ${conflictos.length > 0 ? '#fca5a5' : '#6ee7b7'};">
                            <strong style="color: ${conflictos.length > 0 ? '#991b1b' : '#065f46'}; font-size: 14px;">Conflictos:</strong>
                            <p style="font-size: 2.2em; color: ${conflictos.length > 0 ? '#991b1b' : '#047857'}; margin: 8px 0 0 0; font-weight: 700;">
                                ${conflictos.length}
                            </p>
                        </div>
                    </div>

                    <div style="padding: 0 20px;">
                        <h3 style="color: #1e293b; font-weight: 700; margin: 20px 0 12px 0; font-size: 16px;">📊 Turnos Asignados</h3>
                        ${turnos.length === 0 ? '<p style="color: #64748b; font-size: 14px;">Sin turnos asignados</p>' : `
                            <table style="width: 100%; border-collapse: collapse; margin: 0;">
                                <thead>
                                    <tr style="background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%); color: #4c1d95;">
                                        <th style="padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #c4b5fd;">Empleado</th>
                                        <th style="padding: 10px; text-align: left; font-weight: 700; border-bottom: 2px solid #c4b5fd;">Turno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${turnos.map(t => `
                                        <tr style="border-bottom: 1px solid #e2e8f0; background: #f8fafc;">
                                            <td style="padding: 10px; color: #1e293b; font-weight: 500;">${t.empleado}</td>
                                            <td style="padding: 10px; color: ${ColorManager.getColorTurno(t.turno)}; font-weight: 600;">
                                                ● ${t.turno}
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        `}
                    </div>

                    ${conflictos.length > 0 ? `
                        <div style="padding: 0 20px;">
                            <h3 style="color: #991b1b; font-weight: 700; margin: 16px 0 10px 0; font-size: 16px;">⚠️ Conflictos Detectados</h3>
                            <ul style="padding-left: 20px; color: #1e293b; margin: 0;">
                                ${conflictos.map(c => `<li style="color: #1e293b; margin: 6px 0; font-size: 14px;">${c.descripcion}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="modal-actions" style="margin-top: 20px; padding: 0 20px 20px 20px;">
                        <button class="modal-btn cancel" onclick="document.getElementById('detallesCalendario').remove();" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #1e293b; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease; width: 100%;">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv);
    }

    /**
     * Obtener turnos del día
     */
    static obtenerTurnosDelDia(fecha) {
        const turnos = [];
        const dia = fecha.getDate();

        AppState.scheduleData.forEach((turnosPorDia, empleadoId) => {
            const empleado = empleados.find(e => e.id === empleadoId);
            if (!empleado) return;

            const turno = turnosPorDia.find(t => t.dia === dia);
            if (turno && turno.turno !== 'descanso' && turno.turno !== 'vacaciones') {
                turnos.push({
                    empleado: empleado.nombre,
                    turno: turno.turno,
                    horas: turno.horas
                });
            }
        });

        return turnos;
    }

    /**
     * Cambiar vista (mes, año, empleado)
     */
    static cambiarVista(vista) {
        const botones = document.querySelectorAll('.calendario-btn-vista');
        botones.forEach(btn => {
            btn.classList.remove('active');
            // Remover estilos de activo y aplicar estilos de inactivo
            btn.style.background = '#f1f5f9';
            btn.style.color = '#475569';
            btn.style.border = '2px solid #e2e8f0';
        });
        
        // Aplicar estilos de activo al botón clickeado
        event.target.classList.add('active');
        event.target.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)';
        event.target.style.color = 'white';
        event.target.style.border = 'none';

        switch (vista) {
            case 'mes':
                this.renderizarCalendario();
                break;
            case 'ano':
                CalendarioAnual.renderizarAnual();
                break;
            case 'empleado':
                this.mostrarSelectorEmpleado();
                break;
        }
    }

    /**
     * Mostrar selector de empleado para vista individual
     */
    static mostrarSelectorEmpleado() {
        const container = document.getElementById('calendarioVisual');
        if (!container) return;

        let html = `
            <div style="padding: 20px; text-align: center;">
                <h3>Selecciona un empleado:</h3>
                <select id="selectEmpleadoCalendario" class="period-select" 
                        onchange="CalendarioVisual.renderizarCalendarioEmpleado(this.value)"
                        style="width: 100%; max-width: 300px; padding: 10px; margin: 10px 0;">
                    <option value="">-- Seleccionar empleado --</option>
                    ${empleados.map(emp => `<option value="${emp.id}">${emp.nombre}</option>`).join('')}
                </select>
            </div>
            <div id="calendarioEmpleado" style="margin-top: 20px;"></div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar calendario de un empleado específico
     */
    static renderizarCalendarioEmpleado(empleadoId) {
        if (!empleadoId) return;

        // Validar que empleados es un array
        if (!Array.isArray(empleados)) {
            console.error('empleados no es un array válido:', typeof empleados);
            return;
        }

        const empleado = empleados.find(e => e.id === parseInt(empleadoId));
        if (!empleado) {
            console.error('Empleado no encontrado:', empleadoId);
            return;
        }

        const turnosEmpleado = AppState.scheduleData.get(parseInt(empleadoId)) || [];

        const container = document.getElementById('calendarioEmpleado');
        if (!container) return;

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        let html = `<h3>${empleado.nombre} - ${meses[this.month]} ${this.year}</h3>`;

        // Crear mini calendario
        const primerDia = new Date(this.year, this.month, 1);
        const ultimoDia = new Date(this.year, this.month + 1, 0);
        const diasMes = ultimoDia.getDate();
        const diaInicio = primerDia.getDay();

        html += `
            <div class="calendario-mini" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; margin: 15px 0;">
        `;

        // Encabezados
        const diasSemana = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        diasSemana.forEach(dia => {
            html += `<div style="text-align: center; font-weight: bold; padding: 5px;">${dia}</div>`;
        });

        // Días vacíos
        for (let i = 0; i < diaInicio; i++) {
            html += '<div></div>';
        }

        // Días del mes
        for (let dia = 1; dia <= diasMes; dia++) {
            const turno = turnosEmpleado.find(t => t.dia === dia);
            const color = turno ? ColorManager.getColorTurno(turno.turno) : '#ecf0f1';
            // Verificar si hay conflictos con el turno del día
            let esConflicto = false;
            if (turno && typeof PredictorConflictos !== 'undefined' && PredictorConflictos.predecirConflictos) {
                try {
                    const conflictos = PredictorConflictos.predecirConflictos(AppState.scheduleData, empleados);
                    esConflicto = conflictos && conflictos.alertasRojas && conflictos.alertasRojas.length > 0;
                } catch(e) {
                    esConflicto = false;
                }
            }

            html += `
                <div style="
                    background: ${color};
                    border: ${esConflicto ? '2px solid #e74c3c' : '1px solid #bdc3c7'};
                    border-radius: 5px;
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;
                    font-weight: bold;
                    ${esConflicto ? 'box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);' : ''}
                "
                title="${turno ? turno.turno + ' (' + turno.horas + 'h)' : 'Descanso'}">
                    ${dia}
                </div>
            `;
        }

        html += '</div>';

        container.innerHTML = html;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// VISUALIZADOR DE CONFLICTOS
// ═════════════════════════════════════════════════════════════════════════════

class VisualizadorConflictos {
    /**
     * Detectar conflictos de un día específico
     */
    static detectarConflictosDelDia(fecha) {
        const conflictos = [];
        const dia = fecha.getDate();

        AppState.scheduleData.forEach((turnosPorDia, empleadoId) => {
            const turno = turnosPorDia.find(t => t.dia === dia);
            if (!turno) return;

            // Validar turno y marcar como conflicto si no es válido
            const tiposTurnoArray = Object.keys(tiposTurno || {});
            if (!tiposTurnoArray.includes(turno.turno)) {
                conflictos.push({
                    empleadoId,
                    dia,
                    tipo: 'turno_invalido',
                    turno: turno.turno
                });
            }
        });

        return conflictos;
    }

    /**
     * Marcar días con conflicto en rojo
     */
    static marcarDiasConflicto() {
        const diasConflicto = document.querySelectorAll('.dia-calendario.conflicto');
        diasConflicto.forEach(dia => {
            dia.style.borderColor = '#e8c5ca';
            dia.style.borderWidth = '2px';
            dia.style.boxShadow = '0 0 10px rgba(232, 197, 202, 0.4)';
        });
    }

    /**
     * Obtener descripción de conflicto
     */
    static obtenerDescripcionConflicto(conflicto) {
        const tipos = {
            'max_noche': '⚠️ Excede máximo de turnos noche',
            'min_descanso': '⚠️ Descansos insuficientes',
            'dias_seguidos': '⚠️ Demasiados días seguidos',
            'balance': '⚠️ Distribución desequilibrada',
            'festivo': '⚠️ Turno en día festivo'
        };
        return tipos[conflicto.tipo] || '⚠️ Conflicto detectado';
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// INDICADOR DE CARGA
// ═════════════════════════════════════════════════════════════════════════════

class IndicadorCarga {
    /**
     * Calcular carga del día (cuántos empleados trabajan)
     */
    static calcularCargaDelDia(fecha) {
        const dia = fecha.getDate();
        let carga = 0;

        AppState.scheduleData.forEach((turnosPorDia, empleadoId) => {
            const turno = turnosPorDia.find(t => t.dia === dia);
            if (turno && turno.turno !== 'descanso' && turno.turno !== 'vacaciones' && turno.turno !== 'baja') {
                carga++;
            }
        });

        return carga;
    }

    /**
     * Obtener nivel de carga
     */
    static obtenerNivelCarga(carga) {
        if (carga <= 3) return 'baja';
        if (carga <= 6) return 'media';
        return 'alta';
    }

    /**
     * Obtener color según carga
     */
    static obtenerColorCarga(carga) {
        const nivel = this.obtenerNivelCarga(carga);
        switch (nivel) {
            case 'baja': return '#86efac';    // Verde claro
            case 'media': return '#fcd34d';   // Amarillo
            case 'alta': return '#fca5a5';    // Rosa/Rojo claro
        }
    }

    /**
     * Renderizar indicador visual
     */
    static renderizarIndicador(carga) {
        const porcentaje = Math.min(carga * 15, 100);
        const color = this.obtenerColorCarga(carga);
        return `<div style="width: 100%; height: 4px; background: #ecf0f1; border-radius: 2px; margin-top: 4px;">
                    <div style="width: ${porcentaje}%; height: 100%; background: ${color}; border-radius: 2px;"></div>
                </div>`;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// CALENDARIO ANUAL
// ═════════════════════════════════════════════════════════════════════════════

class CalendarioAnual {
    /**
     * Renderizar vista anual (heatmap)
     */
    static renderizarAnual() {
        const container = document.getElementById('calendarioVisual');
        if (!container) return;

        let html = `
            <div class="calendario-anual-container" style="position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b;">📊 Vista Anual ${CalendarioVisual.year}</h2>
                    <button onclick="document.getElementById('calendarioVisual').innerHTML=''" style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #1e293b; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 12px;">✖️ Cerrar</button>
                </div>
                <div class="calendario-anual" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
        `;

        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        for (let mes = 0; mes < 12; mes++) {
            html += this.renderizarMiniMes(mes, meses[mes]);
        }

        html += `
                </div>
                <div class="calendario-leyenda" style="margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; padding: 15px; background: #f8fafc; border-radius: 8px;">
                    <div style="color: #1e293b; font-weight: 500;"><div class="carga-baja" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-radius: 3px;"></div>Baja carga</div>
                    <div style="color: #1e293b; font-weight: 500;"><div class="carga-media" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-radius: 3px;"></div>Carga media</div>
                    <div style="color: #1e293b; font-weight: 500;"><div class="carga-alta" style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; border-radius: 3px;"></div>Carga alta</div>
                    <div style="color: #1e293b; font-weight: 500;"><div style="display: inline-block; width: 20px; height: 20px; margin-right: 8px; background: #ef4444; border-radius: 3px;"></div>Conflictos</div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Renderizar mini mes para vista anual
     */
    static renderizarMiniMes(mes, nombreMes) {
        const primerDia = new Date(CalendarioVisual.year, mes, 1);
        const ultimoDia = new Date(CalendarioVisual.year, mes + 1, 0);
        const diasMes = ultimoDia.getDate();
        const diaInicio = primerDia.getDay();

        let html = `
            <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <h4 style="text-align: center; margin: 0 0 8px 0; color: #1e293b; font-weight: 700; font-size: 14px;">${nombreMes}</h4>
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px;">
        `;

        // Encabezados
        const diasSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
        diasSemana.forEach(dia => {
            html += `<div style="text-align: center; font-size: 0.75em; font-weight: 700; padding: 4px; color: #1e293b;">${dia}</div>`;
        });

        // Días vacíos
        for (let i = 0; i < diaInicio; i++) {
            html += '<div></div>';
        }

        // Días del mes
        for (let dia = 1; dia <= diasMes; dia++) {
            const fecha = new Date(CalendarioVisual.year, mes, dia);
            const carga = IndicadorCarga.calcularCargaDelDia(fecha);
            const conflictos = VisualizadorConflictos.detectarConflictosDelDia(fecha);
            const color = conflictos.length > 0 ? '#ef4444' : IndicadorCarga.obtenerColorCarga(carga);

            html += `
                <div style="
                    width: 100%;
                    aspect-ratio: 1;
                    background: ${color};
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.7em;
                    font-weight: 700;
                    color: #1e293b;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                "
                onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)';"
                title="${nombreMes} ${dia} - Carga: ${carga}">
                    ${dia}
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        return html;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// GESTOR DE EXPORTACIÓN DE CALENDARIO
// ═════════════════════════════════════════════════════════════════════════════

class ExportadorCalendario {
    /**
     * Exportar calendario a PDF
     */
    static exportarAPDF() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        let contenido = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Calendario ${meses[CalendarioVisual.month]} ${CalendarioVisual.year}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background: white; }
                    h1 { text-align: center; color: #2c3e50; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #bdc3c7; padding: 12px; text-align: center; }
                    th { background: #667eea; color: white; font-weight: bold; }
                    .carga-baja { background: #d4edda; }
                    .carga-media { background: #fff3cd; }
                    .carga-alta { background: #f8d7da; }
                    .conflicto { font-weight: bold; color: #e74c3c; }
                </style>
            </head>
            <body>
                <h1>📅 Calendario - ${meses[CalendarioVisual.month]} ${CalendarioVisual.year}</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Día</th>
                            <th>Empleados</th>
                            <th>Nivel Carga</th>
                            <th>Conflictos</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        const ultimoDia = new Date(CalendarioVisual.year, CalendarioVisual.month + 1, 0).getDate();
        for (let dia = 1; dia <= ultimoDia; dia++) {
            const fecha = new Date(CalendarioVisual.year, CalendarioVisual.month, dia);
            const carga = IndicadorCarga.calcularCargaDelDia(fecha);
            const conflictos = VisualizadorConflictos.detectarConflictosDelDia(fecha);
            const nivel = IndicadorCarga.obtenerNivelCarga(carga);
            const claseCarga = `carga-${nivel}`;

            contenido += `
                <tr class="${claseCarga}">
                    <td><strong>${dia}</strong></td>
                    <td>${carga}</td>
                    <td>${nivel.toUpperCase()}</td>
                    <td class="${conflictos.length > 0 ? 'conflicto' : ''}">
                        ${conflictos.length > 0 ? '⚠️ ' + conflictos.length : '—'}
                    </td>
                </tr>
            `;
        }

        contenido += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const ventana = window.open('', 'exportCalendario', 'width=1000,height=600');
        ventana.document.write(contenido);
        ventana.document.close();
        ventana.print();

        NotificationSystem.show('✅ Calendario exportado a PDF', 'success');
    }

    /**
     * Exportar estadísticas del mes
     */
    static exportarEstadisticas() {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        const ultimoDia = new Date(CalendarioVisual.year, CalendarioVisual.month + 1, 0).getDate();
        
        // Obtener el total de empleados únicos (no la suma de cargas)
        const totalEmpleadosUnicos = empleados.length;
        
        let totalConflictos = 0;
        let diasAltaCarga = 0;
        let totalCargaDias = 0;
        let promedioCarga = 0;

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const fecha = new Date(CalendarioVisual.year, CalendarioVisual.month, dia);
            const carga = IndicadorCarga.calcularCargaDelDia(fecha);
            const conflictos = VisualizadorConflictos.detectarConflictosDelDia(fecha);
            
            totalCargaDias += carga;
            totalConflictos += conflictos.length;
            if (carga > 6) diasAltaCarga++;
        }

        promedioCarga = (totalCargaDias / ultimoDia).toFixed(1);

        let html = `
            <div id="estadisticasCalendario" class="modal active">
                <div class="modal-content" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 600px;">
                    <h2 class="modal-title" style="color: #1e293b; font-size: 22px; font-weight: 700; margin: 0 0 20px 0; padding: 20px 20px 0 20px;">📊 Estadísticas - ${meses[CalendarioVisual.month]} ${CalendarioVisual.year}</h2>
                    
                    <div style="padding: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 0;">
                        <div style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #bfdbfe;">
                            <div style="font-size: 2.5em; color: #1e40af; font-weight: bold;">${totalEmpleadosUnicos}</div>
                            <div style="color: #1e40af; margin-top: 8px; font-weight: 600; font-size: 14px;">Total Empleados</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #fca5a5;">
                            <div style="font-size: 2.5em; color: #991b1b; font-weight: bold;">${totalConflictos}</div>
                            <div style="color: #991b1b; margin-top: 8px; font-weight: 600; font-size: 14px;">Conflictos</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fef08a 100%); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #fcd34d;">
                            <div style="font-size: 2.5em; color: #a16207; font-weight: bold;">${promedioCarga}</div>
                            <div style="color: #a16207; margin-top: 8px; font-weight: 600; font-size: 14px;">Carga Promedio</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #ddd6fe 0%, #e9d5ff 100%); padding: 15px; border-radius: 12px; text-align: center; border: 1px solid #d8b4fe;">
                            <div style="font-size: 2.5em; color: #6b21a8; font-weight: bold;">${diasAltaCarga}</div>
                            <div style="color: #6b21a8; margin-top: 8px; font-weight: 600; font-size: 14px;">Días Alta Carga</div>
                        </div>
                    </div>

                    <div style="padding: 0 20px;">
                        <h3 style="color: #1e293b; font-weight: 700; margin: 20px 0 15px 0; font-size: 16px;">Resumen por Tipo de Carga</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #6ee7b7;">
                                <strong style="color: #065f46; font-size: 14px;">Baja</strong><br>
                                <span style="color: #047857; font-weight: 600; font-size: 16px;">${ultimoDia - diasAltaCarga - [...Array(ultimoDia)].filter((_, i) => {
                                    const fecha = new Date(CalendarioVisual.year, CalendarioVisual.month, i + 1);
                                    const carga = IndicadorCarga.calcularCargaDelDia(fecha);
                                    return carga > 3 && carga <= 6;
                                }).length} días</span>
                            </div>
                            <div style="background: linear-gradient(135deg, #fef08a 0%, #fde047 100%); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #fcd34d;">
                                <strong style="color: #854d0e; font-size: 14px;">Media</strong><br>
                                <span style="color: #b45309; font-weight: 600; font-size: 16px;">${[...Array(ultimoDia)].filter((_, i) => {
                                    const fecha = new Date(CalendarioVisual.year, CalendarioVisual.month, i + 1);
                                    const carga = IndicadorCarga.calcularCargaDelDia(fecha);
                                    return carga > 3 && carga <= 6;
                                }).length} días</span>
                            </div>
                            <div style="background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid #fca5a5;">
                                <strong style="color: #7f1d1d; font-size: 14px;">Alta</strong><br>
                                <span style="color: #b91c1c; font-weight: 600; font-size: 16px;">${diasAltaCarga} días</span>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 20px; border-top: 1px solid #e2e8f0;">
                        <button onclick="document.getElementById('estadisticasCalendario').parentElement.remove();" style="width: 100%; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); color: #1e293b; border: 1px solid #cbd5e1; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                            ✖️ Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv);
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// FILTRO DE CALENDARIO
// ═════════════════════════════════════════════════════════════════════════════

class FiltroCalendario {
    static filtroActivo = {
        empleado: null,
        nivelCarga: null,
        mostrarConflictos: true
    };

    /**
     * Aplicar filtro de empleado
     */
    static filtrarPorEmpleado(empleadoId) {
        this.filtroActivo.empleado = empleadoId ? parseInt(empleadoId) : null;
        CalendarioVisual.renderizarCalendario();
        NotificationSystem.show(`✅ Filtro aplicado`, 'success');
    }

    /**
     * Aplicar filtro de nivel de carga
     */
    static filtrarPorCarga(nivel) {
        this.filtroActivo.nivelCarga = nivel;
        CalendarioVisual.renderizarCalendario();
    }

    /**
     * Mostrar/ocultar conflictos
     */
    static toggleConflictos() {
        this.filtroActivo.mostrarConflictos = !this.filtroActivo.mostrarConflictos;
        CalendarioVisual.renderizarCalendario();
    }

    /**
     * Resetear filtros
     */
    static resetearFiltros() {
        this.filtroActivo = {
            empleado: null,
            nivelCarga: null,
            mostrarConflictos: true
        };
        CalendarioVisual.renderizarCalendario();
        NotificationSystem.show('✅ Filtros reseteados', 'success');
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// ANALIZADOR AVANZADO DEL CALENDARIO
// ═════════════════════════════════════════════════════════════════════════════

class AnalizadorCalendario {
    /**
     * Obtener días más cargados del mes
     */
    static obtenerDiasMasCargados(limite = 5) {
        const diasCargados = [];
        const ultimoDia = new Date(CalendarioVisual.year, CalendarioVisual.month + 1, 0).getDate();
        
        for (let dia = 1; dia <= ultimoDia; dia++) {
            const fecha = new Date(CalendarioVisual.year, CalendarioVisual.month, dia);
            const carga = IndicadorCarga.calcularCargaDelDia(fecha);
            diasCargados.push({ dia, carga, fecha });
        }

        return diasCargados.sort((a, b) => b.carga - a.carga).slice(0, limite);
    }

    /**
     * Obtener empleados con más carga
     */
    static obtenerEmpleadosConMasCarga(limite = 5) {
        const cargaPorEmpleado = new Map();

        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            const cargaTotal = turnos.reduce((sum, turno) => sum + (turno.horas || 0), 0);
            cargaPorEmpleado.set(emp.nombre, {
                id: emp.id,
                carga: cargaTotal,
                turnosNocturno: turnos.filter(t => t.turno === 'noche').length
            });
        });

        return Array.from(cargaPorEmpleado.values())
            .sort((a, b) => b.carga - a.carga)
            .slice(0, limite);
    }

    /**
     * Calcular distribución de tipos de turno
     */
    static calcularDistribucionTurnos() {
        const distribucion = {};
        const tiposTurnoLocal = Object.keys(tiposTurno);
        
        tiposTurnoLocal.forEach(tipo => {
            distribucion[tipo] = 0;
        });

        empleados.forEach(emp => {
            const turnos = AppState.scheduleData.get(emp.id) || [];
            turnos.forEach(turno => {
                if (distribucion.hasOwnProperty(turno.turno)) {
                    distribucion[turno.turno]++;
                }
            });
        });

        return distribucion;
    }

    /**
     * Predecir patrones de carga para los próximos días
     */
    static predecirPatronesCarga(diasAdelante = 7) {
        const predicciones = [];
        const hoy = new Date();
        
        for (let i = 0; i < diasAdelante; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() + i);
            const carga = IndicadorCarga.calcularCargaDelDia(fecha);
            const nivelRiesgo = carga > 8 ? 'ALTO' : carga > 5 ? 'MEDIO' : 'BAJO';
            
            predicciones.push({
                fecha: fecha.toLocaleDateString('es-ES'),
                cargaEstimada: carga,
                nivelRiesgo
            });
        }

        return predicciones;
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN AL CARGAR EL MÓDULO
// ═════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CalendarioVisual !== 'undefined') {
        CalendarioVisual.inicializar();
        console.log('✅ Módulo CalendarioVisual inicializado');
        console.log('✅ ExportadorCalendario disponible');
        console.log('✅ FiltroCalendario disponible');
        console.log('✅ AnalizadorCalendario disponible para análisis avanzado');
    }
});

console.log('✅ Módulo calendario-visual.js cargado correctamente (v2.0+ - Exportación, filtros y análisis avanzado)');
