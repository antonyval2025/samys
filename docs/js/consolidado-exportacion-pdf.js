/**
 * CONSOLIDADO EXPORTACIÓN PDF - Sistema Modular Completo
 * @version 3.0.0
 * Contiene métodos para generar PDFs del cuadrante individual con bordes rojos en festivos
 */

const ConsolidadoExportacionPDF = (function() {
    'use strict';

    function obtenerInfoTurnoVisualPDF(turnoNombre, tiposTurnoData = {}) {
        // Primero buscar en los tipos personalizados del localStorage
        if (tiposTurnoData[turnoNombre]) {
            return tiposTurnoData[turnoNombre];
        }
        
        // Fallback a colores predeterminados
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
        return tiposTurno[turnoNombre] || { inicial: '?', horario: 'N/A', color: '#e5e7eb', horas: 0 };
    }

    function crearTarjetaInfoPDF(titulo, valor, detalle, bgColor, icono = '📊') {
        return `
            <div style="padding:12px; background:${bgColor}; border-radius:8px; color:white; text-align:center;">
                <div style="font-size:16px; margin-bottom:4px;">${icono}</div>
                <div style="font-size:10px; color:rgba(255,255,255,0.8); margin-bottom:3px; text-transform:uppercase;">${titulo}</div>
                <div style="font-size:18px; font-weight:bold; margin-bottom:2px;">${valor}</div>
                <div style="font-size:9px; color:rgba(255,255,255,0.7);">${detalle}</div>
            </div>
        `;
    }

    function calcularResumenTurnosPDF(turnos = [], empleadoId) {
        const limpio = Array.isArray(turnos) ? turnos : [];
        
        const trabajados = limpio.filter(t => 
            t?.turno && !['descanso', 'vacaciones', 'baja', 'libre', 'festivo'].includes(t.turno)
        ).length;
        
        const descansos = limpio.filter(t => t?.turno === 'descanso').length;
        const guardias = limpio.filter(t => t?.turno === 'festivo' || 
            (typeof window.esFestivoLocal === 'function' && window.esFestivoLocal(new Date(2024, 0, t.dia), empleadoId))).length;
        const noches = limpio.filter(t => t?.turno === 'noche').length;
        const vacaciones = limpio.filter(t => ['vacaciones', 'baja'].includes(t?.turno)).length;
        
        return { trabajados, descansos, guardias, noches, vacaciones };
    }

    function construirCalendarioVisualPDF({ turnos = [], mesNum = 0, anio = 2024, empleadoId, tiposTurnoData = {} }) {
        console.log('[construirCalendarioVisualPDF] Iniciando con:', { mesNum, anio, empleadoId });
        
        const diasEnMes = new Date(anio, mesNum + 1, 0).getDate();
        const primerDia = new Date(anio, mesNum, 1).getDay();
        
        let html = '<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:12px;">';
        
        // Encabezados de días
        const diasSemana = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        diasSemana.forEach(dia => {
            html += `<div style="text-align:center; padding:8px; font-weight:bold; color:#cbd5f5; font-size:12px; border-bottom:1px solid rgba(148,163,184,0.2);">${dia}</div>`;
        });
        
        // Celdas vacías antes del primer día
        for (let i = 0; i < primerDia; i++) {
            html += '<div></div>';
        }
        
        // Días del mes - EXACTAMENTE COMO EN EL CUADRANTE INDIVIDUAL
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const turnoDia = turnos.find(t => t?.dia === dia);
            const infoTurno = obtenerInfoTurnoVisualPDF(turnoDia?.turno, tiposTurnoData);
            
            // DETECTAR SI ES DOMINGO O FESTIVO - COPIADO DEL CUADRANTE INDIVIDUAL
            const fecha = new Date(anio, mesNum, dia);
            const diaSemana = fecha.getDay();
            const esDomingo = diaSemana === 0;
            const esFestivo = turnoDia?.turno === 'festivo';
            
            // LA CLAVE: esGuardia = esDomingo || esFestivo
            const esGuardia = esDomingo || esFestivo;
            
            const bgColor = turnoDia ? infoTurno.color : '#f9f9f9';
            const textColor = turnoDia ? '#000' : '#ccc';
            
            // COPIADO DIRECTAMENTE DEL CUADRANTE INDIVIDUAL:
            // border:${esGuardia ? '2px solid rgba(248,113,113,0.9)' : '1px solid rgba(148,163,184,0.25)'}
            const borderStyle = esGuardia ? '2px solid rgba(248, 113, 113, 0.9)' : '1px solid rgba(148, 163, 184, 0.25)';
            const boxShadowStyle = esGuardia ? '0 12px 25px rgba(248, 113, 113, 0.25)' : 'inset 0 0 0 rgba(0, 0, 0, 0)';
            
            console.log(`[construirCalendarioVisualPDF] Día ${dia}: esDomingo=${esDomingo}, esFestivo=${esFestivo}, esGuardia=${esGuardia}, border=${borderStyle}`);
            
            html += `
                <div style="background:${bgColor}; border:${borderStyle}; border-radius:8px; padding:10px; text-align:center; min-height:70px; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:4px; box-shadow:${boxShadowStyle};">
                    <div style="font-weight:bold; font-size:16px; color:#000;">${dia}</div>
                    <div style="font-size:14px; font-weight:bold; color:${textColor};">${infoTurno.inicial}</div>
                    ${infoTurno.horas ? `<div style="font-size:10px; color:${textColor};">${infoTurno.horas}h</div>` : ''}
                    ${esGuardia ? '<div style="font-size:9px; color:#f87171; font-weight:bold;">Guardia</div>' : ''}
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    // ==================== MÉTODO PÚBLICO: generarPDFCuadranteVisual ====================
    async function generarPDFCuadranteVisual(informe) {
        try {
            console.log('🔵 [generarPDFCuadranteVisual] Iniciando con informe:', informe);
            const { empleado, turnos, mes, anio, mesNum, totalHoras } = informe || {};
            if (!empleado) throw new Error('No hay empleado para generar el PDF');
            console.log('✅ [generarPDFCuadranteVisual] Empleado:', empleado.nombre);
            
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
            content.style.width = '1400px';
            content.style.padding = '48px';
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
                            <h1 style="margin:12px 0 0 0; font-size:48px; font-weight:900; background:linear-gradient(135deg,#fff,#cbd5f5); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">${mes} ${anio}</h1>
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
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:20px; margin-bottom:32px;">
                    ${tarjetas}
                </div>
                <div style="background:linear-gradient(135deg,rgba(15,23,42,0.95),rgba(15,23,42,0.8)); border-radius:32px; padding:32px; border:2px solid rgba(148,163,184,0.2); box-shadow:0 20px 60px rgba(0,0,0,0.4);">
                    <div style="margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid rgba(148,163,184,0.2);">
                        <h2 style="margin:0; font-size:18px; font-weight:700; color:#fff; letter-spacing:0.05em;">📅 Distribución de Turnos</h2>
                    </div>
                    ${calendarioHTML}
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:14px; margin-top:32px;">
                    <div style="padding:16px; border-radius:16px; background:linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.05)); border:1px solid rgba(34,197,94,0.4); box-shadow:0 4px 12px rgba(34,197,94,0.1);"><span style="font-size:11px; color:#86efac; text-transform:uppercase; font-weight:600;">✓ Descansos</span><div style="font-size:24px; font-weight:700; color:#4ade80; margin-top:6px;">${resumen.descansos}</div></div>
                    <div style="padding:16px; border-radius:16px; background:linear-gradient(135deg,rgba(248,113,113,0.15),rgba(248,113,113,0.05)); border:1px solid rgba(248,113,113,0.4); box-shadow:0 4px 12px rgba(248,113,113,0.1);"><span style="font-size:11px; color:#fca5a5; text-transform:uppercase; font-weight:600;">⚠️ Guardias</span><div style="font-size:24px; font-weight:700; color:#f87171; margin-top:6px;">${resumen.guardias}</div></div>
                    <div style="padding:16px; border-radius:16px; background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.05)); border:1px solid rgba(59,130,246,0.4); box-shadow:0 4px 12px rgba(59,130,246,0.1);"><span style="font-size:11px; color:#93c5fd; text-transform:uppercase; font-weight:600;">🌙 Noches</span><div style="font-size:24px; font-weight:700; color:#3b82f6; margin-top:6px;">${resumen.noches}</div></div>
                    <div style="padding:16px; border-radius:16px; background:linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.05)); border:1px solid rgba(251,191,36,0.4); box-shadow:0 4px 12px rgba(251,191,36,0.1);"><span style="font-size:11px; color:#fde047; text-transform:uppercase; font-weight:600;">📦 Vacaciones/Bajas</span><div style="font-size:24px; font-weight:700; color:#facc15; margin-top:6px;">${resumen.vacaciones}</div></div>
                </div>
                <div style="margin-top:32px; padding:16px; border-radius:16px; background:rgba(100,116,139,0.1); border:1px solid rgba(100,116,139,0.3); text-align:center;">
                    <p style="margin:0; font-size:11px; color:#94a3b8; letter-spacing:0.05em;">🔐 Documento generado automáticamente • Sistema de Gestión de Turnos</p>
                </div>
            `;

            wrapper.appendChild(content);
            document.body.appendChild(wrapper);

            // Clonar el contenido para remover el botón WhatsApp del PDF
            const contentForPDF = content.cloneNode(true);
            const btnWhatsAppEnPDF = contentForPDF.querySelector('.btn-whatsapp-modal');
            if (btnWhatsAppEnPDF) {
                btnWhatsAppEnPDF.remove();
            }

            // Crear un wrapper temporal solo para la captura del PDF
            const wrapperPDF = document.createElement('div');
            wrapperPDF.style.position = 'fixed';
            wrapperPDF.style.left = '-9999px';
            wrapperPDF.style.top = '0';
            wrapperPDF.style.zIndex = '-1';
            wrapperPDF.appendChild(contentForPDF);
            document.body.appendChild(wrapperPDF);

            const canvas = await html2canvas(contentForPDF, {
                backgroundColor: '#0b1220',
                scale: 2,
                useCORS: true,
                logging: false,
                windowHeight: contentForPDF.scrollHeight,
                windowWidth: contentForPDF.scrollWidth,
                allowTaint: true
            });
            console.log('✅ [generarPDFCuadranteVisual] Canvas generado');

            document.body.removeChild(wrapper);
            document.body.removeChild(wrapperPDF);

            const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
            if (!jsPDFConstructor) {
                throw new Error('La libreria jsPDF no está disponible');
            }
            console.log('✅ [generarPDFCuadranteVisual] jsPDF disponible');
            
            const pdf = new jsPDFConstructor('landscape', 'pt', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Escalar para que todo quepa en una sola página
            const scale = Math.min(pageWidth / (canvas.width * 0.75), pageHeight / (canvas.height * 0.75));
            const imgWidth = (canvas.width * scale) * 0.75;
            const imgHeight = (canvas.height * scale) * 0.75;
            const startX = (pageWidth - imgWidth) / 2;
            const startY = (pageHeight - imgHeight) / 2;
            
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', startX, startY, imgWidth, imgHeight);

            const fileName = `Cuadrante_${empleado.nombre.replace(/\s+/g, '_')}_${mes}_${anio}.pdf`;
            const blob = pdf.output('blob');
            const file = new File([blob], fileName, { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.ultimoPdfCuadrante = { fileName, url, creado: Date.now() };
            console.log('✅ [generarPDFCuadranteVisual] PDF completado:', fileName);
            return { blob, file, url, fileName };
        } catch (error) {
            console.error('❌ [generarPDFCuadranteVisual] Error:', error);
            throw error;
        }
    }

    // Retornar API pública
    return {
        generarPDFCuadranteVisual
    };
})();

console.log('[ConsolidadoExportacionPDF] ✅ Sistema consolidado cargado correctamente');
