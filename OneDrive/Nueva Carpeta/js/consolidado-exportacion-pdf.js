/**
 * CONSOLIDADO EXPORTACIÓN PDF - Sistema Modular de Generación de PDFs
 * 
 * Propósito: Centralizar toda la lógica de generación de PDFs en módulo
 * Fuente de Verdad: Este archivo (módulo consolidado)
 * Responsabilidad: Generar PDFs visuales con calendario, tarjetas e información
 * 
 * Arquitectura:
 * - ConsolidadoExportacionPDF (UI + Logic layer)
 * - SistemaReactividad (Event emission)
 * 
 * @version 1.0.0
 * @date 7 de enero de 2026
 */

console.log('[ConsolidadoExportacionPDF] 🔄 Cargando sistema consolidado de exportación PDF...');

const ConsolidadoExportacionPDF = (function() {

    // ============================================
    // FUNCIONES AUXILIARES - INTERNALES
    // ============================================

    /**
     * Obtiene información de turno visual
     */
    function obtenerInfoTurnoVisualPDF(turnoNombre, tiposTurnoData = {}) {
        const tiposTurno = {
            mañana: { inicial: 'M', horario: '08:00-16:00', color: '#d4edda', horas: 8 },
            tarde: { inicial: 'T', horario: '16:00-00:00', color: '#fff3cd', horas: 8 },
            noche: { inicial: 'N', horario: '00:00-08:00', color: '#f8d7da', horas: 8 },
            mixto: { inicial: 'X', horario: '08:00-00:00', color: '#e2e8f0', horas: 10 },
            descanso: { inicial: 'D', horario: 'Descanso', color: '#f3f4f6', horas: 0 },
            vacaciones: { inicial: 'V', horario: 'Vacaciones', color: '#dbeafe', horas: 0 },
            baja: { inicial: 'B', horario: 'Baja', color: '#fee2e2', horas: 0 },
            libre: { inicial: 'L', horario: 'Libre', color: '#f0fdf4', horas: 0 },
            festivo: { inicial: 'F', horario: 'Festivo', color: '#fef3c7', horas: 0 },
            guardia: { inicial: 'G', horario: 'Guardia', color: '#fecaca', horas: 0 }
        };

        // Buscar en tipos personalizados primero
        if (tiposTurnoData[turnoNombre]) {
            return tiposTurnoData[turnoNombre];
        }

        // Luego en tipos predeterminados
        if (tiposTurno[turnoNombre]) {
            return tiposTurno[turnoNombre];
        }

        // Por defecto
        return { inicial: '?', horario: turnoNombre || 'N/A', color: '#e5e7eb', horas: 0 };
    }

    /**
     * Crea una tarjeta de información para el PDF
     */
    function crearTarjetaInfoPDF(titulo, valor, detalle, background, icono = '📊') {
        return `
            <div style="border-radius:24px; padding:24px; background:${background}; display:flex; flex-direction:column; gap:10px; box-shadow:0 8px 32px rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(10px); transition:all 0.3s ease;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">${icono}</span>
                    <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.15em; color:rgba(255,255,255,0.7); font-weight:600;">${titulo}</span>
                </div>
                <span style="font-size:32px; font-weight:800; color:#fff; line-height:1.2;">${valor}</span>
                ${detalle ? `<span style="font-size:12px; color:rgba(255,255,255,0.8); line-height:1.4;">${detalle}</span>` : ''}
            </div>
        `;
    }

    /**
     * Calcula resumen de turnos
     */
    function calcularResumenTurnosPDF(turnos, empleadoId) {
        const limpio = Array.isArray(turnos) ? turnos : [];
        const trabajados = limpio.filter(t => t?.turno && !['descanso','libre','baja','vacaciones','festivo'].includes(t.turno)).length;
        const descansos = limpio.filter(t => t?.turno && ['descanso','libre'].includes(t.turno)).length;
        const vacaciones = limpio.filter(t => t?.turno === 'vacaciones').length;
        const noches = limpio.filter(t => t?.turno === 'noche').length;
        const guardias = limpio.filter(t => {
            if (!t?.fecha) return false;
            const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
            const esDomingo = fecha.getDay() === 0;
            const esFestivoTrabajado = typeof window.esFestivoLocal === 'function'
                ? window.esFestivoLocal(fecha, empleadoId)
                : (typeof window.esFestivo === 'function' ? window.esFestivo(fecha) : false);
            const esGuardiaMarcada = (t?.turno || '').toLowerCase().includes('guardia');
            const turnoTrabajado = t.turno && !['descanso','libre','baja','vacaciones','festivo'].includes(t.turno);
            return (esDomingo && turnoTrabajado) || (esFestivoTrabajado && turnoTrabajado) || esGuardiaMarcada;
        }).length;
        return { trabajados, descansos, vacaciones, noches, guardias };
    }

    /**
     * Construye calendario visual para el PDF
     */
    function construirCalendarioVisualPDF({ turnos, mesNum, anio, empleadoId, tiposTurnoData }) {
        const diasSemana = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
        const diasEnMes = new Date(anio, mesNum + 1, 0).getDate();
        const primerDia = new Date(anio, mesNum, 1).getDay();
        const offset = (primerDia + 6) % 7;

        const celdas = [];

        for (let i = 0; i < offset; i++) {
            celdas.push(`<div style="width:100%; aspect-ratio:1/1; border-radius:12px; background:rgba(15,23,42,0.2); padding:16px; border:2px solid transparent; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; gap:4px; opacity:0.3;"></div>`);
        }

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const turnoDia = turnos.find(t => t?.dia === dia);
            const fechaRepr = new Date(anio, mesNum, dia);
            const esDomingo = fechaRepr.getDay() === 0;
            const esFestivo = typeof window.esFestivoLocal === 'function'
                ? window.esFestivoLocal(fechaRepr, empleadoId)
                : (typeof window.esFestivo === 'function' ? window.esFestivo(fechaRepr) : false);
            const turnoNormalizado = (turnoDia?.turno || '').toLowerCase();
            const esGuardia = esDomingo || esFestivo || turnoNormalizado.includes('guardia');
            const infoTurno = obtenerInfoTurnoVisualPDF(turnoDia?.turno, tiposTurnoData);

            const horario = turnoDia?.horario || infoTurno.horario || '';
            const horasDelTurno = turnoDia?.horas || infoTurno.horas || '';
            const horas = horasDelTurno ? `${horasDelTurno}h` : '';

            const badgeTextColor = turnoDia ? '#0f172a' : '#cbd5f5';
            const guardiaBadge = esGuardia ? '<span style="padding:4px 10px; border-radius:999px; background:rgba(248,113,113,0.2); color:#fecaca; font-size:11px; font-weight:600; text-transform:uppercase;">Guardia</span>' : '';
            const contexto = esFestivo ? 'Festivo' : (esDomingo ? 'Domingo' : '');
            const contextoHtml = contexto ? `<span style="font-size:11px; color:#94a3b8;">${contexto}</span>` : '';

            const bgColor = infoTurno.color || 'rgba(15,23,42,0.35)';
            const backgroundGradient = `linear-gradient(135deg, ${bgColor}88 0%, ${bgColor}cc 100%)`;
            const borderColor = esGuardia ? '3px solid #ff6b6b' : '2px solid transparent';
            const boxShadow = esGuardia ? '0 0 12px rgba(255, 107, 107, 0.6), inset 0 0 8px rgba(255, 107, 107, 0.2)' : 'inset 0 2px 8px rgba(0, 0, 0, 0.1)';

            celdas.push(`
                <div style="width:100%; aspect-ratio:1/1; border-radius:12px; background:${backgroundGradient}; padding:16px; border:${borderColor}; box-shadow:${boxShadow}; display:flex; flex-direction:column; justify-content:space-between; align-items:center; text-align:center; gap:4px; transition:all 0.3s ease;">
                    <div style="width:100%;">
                        <span style="font-size:28px; font-weight:700; color:#0f172a;">${dia}</span>
                    </div>
                    <div style="width:100%;">
                        <div style="display:inline-block; padding:6px 12px; border-radius:999px; background:transparent; color:#0f172a; font-weight:700; font-size:28px; line-height:1.4;">${infoTurno.inicial}</div>
                    </div>
                    ${horas ? `<div style="font-size:13px; font-weight:600; color:#0f172a; letter-spacing:0.5px;">${horas}</div>` : ''}
                    ${horario ? `<div style="font-size:11px; color:#0f172a;">${horario}</div>` : ''}
                    ${guardiaBadge}
                    ${contextoHtml}
                </div>
            `);
        }

        return `
            <div style="margin-top:10px;">
                <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:18px; margin-bottom:16px;">
                    ${diasSemana.map(d => `<div style="text-align:center; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:#94a3b8;">${d}</div>`).join('')}
                </div>
                <div style="display:grid; grid-template-columns: repeat(7, 1fr); gap:18px;">
                    ${celdas.join('')}
                </div>
            </div>
        `;
    }

    // ============================================
    // MÉTODOS PÚBLICOS
    // ============================================

    /**
     * Genera PDF visual del cuadrante con canvas
     */
    async function generarPDFCuadranteVisual(informe) {
        try {
            console.log('[ConsolidadoExportacionPDF] 🔵 Iniciando generación de PDF...');
            const { empleado, turnos, mes, anio, mesNum, totalHoras } = informe || {};
            if (!empleado) throw new Error('No hay empleado para generar el PDF');

            const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
            const resumen = calcularResumenTurnosPDF(turnos || [], empleado.id);
            const horasContrato = parseFloat(empleado.horasContrato) || 0;
            const balance = (totalHoras || 0) - horasContrato;
            const cumplimiento = horasContrato > 0 ? Math.round(((totalHoras || 0) / horasContrato) * 100) : 0;

            const wrapper = document.createElement('div');
            wrapper.style.position = 'fixed';
            wrapper.style.left = '-9999px';
            wrapper.style.top = '0';
            wrapper.style.zIndex = '-1';

            const content = document.createElement('div');
            content.style.width = '1200px';
            content.style.padding = '32px';
            content.style.background = 'linear-gradient(135deg, #0b1220, #111827)';
            content.style.borderRadius = '32px';
            content.style.boxShadow = '0 40px 80px rgba(0,0,0,0.55)';
            content.style.fontFamily = "'Poppins','Segoe UI',sans-serif";
            content.style.color = '#f8fafc';

            const tarjetas = [
                crearTarjetaInfoPDF('Empleado', empleado.nombre, empleado.departamento || 'Sin depto', 'linear-gradient(135deg,#6366f1,#8b5cf6)', '👤'),
                crearTarjetaInfoPDF('Localidad', empleado.localidad || 'N/D', empleado.turnoPrincipal || 'Sin turno', 'linear-gradient(135deg,#0ea5e9,#38bdf8)', '📍'),
                crearTarjetaInfoPDF('Horas trabajadas', `${(totalHoras || 0).toFixed(2)}h`, `Contrato: ${horasContrato}h`, 'linear-gradient(135deg,#22c55e,#4ade80)', '⏱️'),
                crearTarjetaInfoPDF('Balance', `${balance >= 0 ? '+' : ''}${balance.toFixed(2)}h`, `Cumplimiento ${cumplimiento}%`, 'linear-gradient(135deg,#f97316,#fb923c)', '📈')
            ].join('');

            const calendarioHTML = construirCalendarioVisualPDF({
                turnos: turnos || [],
                mesNum,
                anio,
                empleadoId: empleado.id,
                tiposTurnoData
            });

            content.innerHTML = `
                <div style="border-bottom:2px solid rgba(148,163,184,0.2); padding-bottom:24px; margin-bottom:32px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:24px;">
                        <div>
                            <p style="margin:0; font-size:13px; letter-spacing:0.5em; color:#94a3b8; text-transform:uppercase; font-weight:600;">📋 Cuadrante Mensual</p>
                            <h1 style="margin:8px 0 0 0; font-size:36px; font-weight:900; color:#f8fafc; background:rgba(241,245,249,0.08); padding:8px 16px; border-radius:12px; display:inline-block;">${mes} ${anio}</h1>
                            <p style="margin:12px 0 0 0; color:#cbd5f5; font-size:14px;">${empleado.nombre} · ${empleado.departamento || 'Sin departamento'}</p>
                        </div>
                        <div style="text-align:right; padding:16px; background:rgba(59,130,246,0.1); border-radius:16px; border:1px solid rgba(59,130,246,0.3);">
                            <div style="font-size:12px; color:#94a3b8; margin-bottom:6px;">📅 Generado</div>
                            <span style="font-size:12px; color:#cbd5f5;">${new Date().toLocaleDateString('es-ES')}</span>
                            <div style="font-size:36px; font-weight:800; margin-top:8px; color:#60a5fa;">${resumen.trabajados}</div>
                            <div style="font-size:11px; color:#cbd5f5; margin-top:4px;">días activos</div>
                        </div>
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:16px; margin-bottom:32px;">
                    ${tarjetas}
                </div>
                <!-- 🔧 CRÍTICO: El fondo blanco debe estar DETRÁS del calendario, no envolviendo -->
                <div style="position:relative; margin-top:24px;">
                    <!-- Fondo blanco de verdadero background -->
                    <div style="position:absolute; top:0; left:-48px; right:-48px; bottom:0; background:linear-gradient(135deg,rgba(241,245,249,0.95),rgba(226,232,240,0.9)); border-radius:32px; border:2px solid rgba(226,232,240,0.5); box-shadow:0 20px 60px rgba(0,0,0,0.1); z-index:0;"></div>
                    <!-- Contenido encima del fondo -->
                    <div style="position:relative; z-index:1; padding:48px;">
                        <div style="margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid rgba(148,163,184,0.2);">
                            <h2 style="margin:0; font-size:18px; font-weight:700; color:#1e293b; letter-spacing:0.05em;">📅 Distribución de Turnos</h2>
                        </div>
                        ${calendarioHTML}
                    </div>
                </div>
            `;

            wrapper.appendChild(content);
            document.body.appendChild(wrapper);

            const contentForPDF = content.cloneNode(true);

            const wrapperPDF = document.createElement('div');
            wrapperPDF.style.position = 'fixed';
            wrapperPDF.style.left = '-9999px';
            wrapperPDF.style.top = '0';
            wrapperPDF.style.zIndex = '-1';
            wrapperPDF.appendChild(contentForPDF);
            document.body.appendChild(wrapperPDF);

            // 🔧 FORZAR ANCHO ANTES DE html2canvas
            contentForPDF.style.width = '1200px !important';
            contentForPDF.style.display = 'block';

            const canvas = await html2canvas(contentForPDF, {
                backgroundColor: '#0b1220',
                scale: 2,
                useCORS: true,
                logging: false,
                windowHeight: contentForPDF.scrollHeight,
                windowWidth: 1200,
                allowTaint: true
            });
            console.log('[ConsolidadoExportacionPDF] ✅ Canvas generado');

            document.body.removeChild(wrapper);
            document.body.removeChild(wrapperPDF);

            const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
            if (!jsPDFConstructor) {
                throw new Error('La libreria jsPDF no está disponible');
            }
            console.log('[ConsolidadoExportacionPDF] ✅ jsPDF disponible');

            const pdf = new jsPDFConstructor('landscape', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const scale = Math.min(pageWidth / (canvas.width * 0.75), pageHeight / (canvas.height * 0.75));
            const imgWidth = (canvas.width * scale) * 0.75;
            const imgHeight = (canvas.height * scale) * 0.75;
            const startX = (pageWidth - imgWidth) / 2;
            const startY = (pageHeight - imgHeight) / 2;

            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', startX, startY, imgWidth, imgHeight);

            const fileName = `Cuadrante_${empleado.nombre.replace(/\s+/g, '_')}_${mes}_${anio}.pdf`;
            const pdfUrl = pdf.output('bloburi');

            console.log(`[ConsolidadoExportacionPDF] ✅ PDF generado: ${fileName}`);

            return {
                pdf: pdf,
                url: pdfUrl,
                fileName: fileName
            };

        } catch (error) {
            console.error('[ConsolidadoExportacionPDF] ❌ Error:', error);
            throw error;
        }
    }

    // ============================================
    // EXPOSICIÓN PÚBLICA
    // ============================================

    return {
        generarPDFCuadranteVisual: generarPDFCuadranteVisual
    };

})();

// Exponer globalmente
window.ConsolidadoExportacionPDF = ConsolidadoExportacionPDF;

console.log('[ConsolidadoExportacionPDF] ✅ Sistema cargado correctamente');
