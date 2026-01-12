/**
 * =====================================================
 * MÓDULO: PANEL DE FILTROS Y ACCIONES
 * =====================================================
 * 
 * Responsable de filtrado, búsqueda y acciones rápidas
 * sobre el cuadrante de turnos.
 * 
 * Ubicación en UI: Sección horizontal debajo de análisis de equidad
 */

class PanelFiltros {
    static filtroActivo = {
        empleado: null,
        nivelCarga: null,
        mostrarConflictos: true
    };

    /**
     * Renderizar panel completo
     * @returns {Promise<String>} HTML del panel
     */
    static async renderizar() {
        try {
            const estadisticas = await this._obtenerEstadisticas();
            return this._construirHTML(estadisticas);
        } catch (e) {
            console.error('❌ Error en PanelFiltros.renderizar():', e.message);
            return '';
        }
    }

    /**
     * Obtener estadísticas rápidas (con filtro de empleado si aplica)
     * @private
     */
    static async _obtenerEstadisticas() {
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        const mesKey = `${año}-${mes}`;

        let totalTurnos = 0;
        let totalHoras = 0;
        let conflictosDetectados = 0;
        let empleadosMasOcupados = [];

        // Si hay filtro de empleado, obtener solo ese empleado
        let empleadosAIterar = window.empleados || [];
        
        if (this.filtroActivo.empleado) {
            const empleadoFiltrado = empleadosAIterar.find(e => e.id === this.filtroActivo.empleado);
            if (empleadoFiltrado) {
                empleadosAIterar = [empleadoFiltrado];
            }
        }

        for (const emp of empleadosAIterar) {
            try {
                const response = await fetch(`http://localhost:5001/api/turnos/${emp.id}`, { timeout: 5000 });
                if (!response.ok) continue;

                const data = await response.json();
                const mesData = data.turnos?.[mesKey];
                const turnosMes = mesData?.turnos || [];

                totalTurnos += turnosMes.length;
                const horasMes = turnosMes.reduce((sum, t) => sum + (t.horas || 0), 0);
                totalHoras += horasMes;

                empleadosMasOcupados.push({
                    nombre: emp.nombre,
                    turnos: turnosMes.length,
                    horas: horasMes
                });
            } catch (e) {
                // Error silencioso
            }
        }

        return {
            totalTurnos,
            totalHoras: totalHoras.toFixed(0),
            conflictos: conflictosDetectados,
            empleados: empleadosMasOcupados.sort((a, b) => b.horas - a.horas).slice(0, 3),
            filtroActivo: this.filtroActivo.empleado
        };
    }

    /**
     * Construir HTML del panel
     * @private
     */
    static _construirHTML(estadisticas) {
        // Obtener nombre del empleado filtrado si aplica
        let labelFiltro = '';
        if (estadisticas.filtroActivo) {
            const emp = (window.empleados || []).find(e => e.id === estadisticas.filtroActivo);
            if (emp) {
                labelFiltro = ` <span style="background: rgba(34, 197, 94, 0.3); padding: 4px 12px; border-radius: 4px; font-size: 12px; margin-left: 10px;">Filtrado: <strong>${emp.nombre}</strong></span>`;
            }
        }

        return `
            <div class="panel-filtros-container">
                <!-- Header -->
                <div class="panel-filtros-header">
                    <span class="panel-filtros-icon">⚙️</span>
                    <h3 class="panel-filtros-title">Filtros y Acciones Rápidas${labelFiltro}</h3>
                </div>

                <!-- Sección de Filtros -->
                <div class="panel-filtros-section">
                    <div class="panel-filtros-subtitle">🔍 Opciones de Filtrado</div>
                    
                    <div class="panel-filtros-grid">
                        <!-- Filtro por Empleado -->
                        <div class="filtro-item">
                            <label class="filtro-label">👤 Empleado</label>
                            <select id="filtroEmpleadoPanel" class="filtro-select" onchange="PanelFiltros.aplicarFiltroEmpleado(this.value)">
                                <option value="">Todos los empleados</option>
                                ${(window.empleados || []).map(emp => 
                                    `<option value="${emp.id}" ${estadisticas.filtroActivo === emp.id ? 'selected' : ''}>${emp.nombre}</option>`
                                ).join('')}
                            </select>
                        </div>

                        <!-- Filtro por Carga -->
                        <div class="filtro-item">
                            <label class="filtro-label">⚖️ Carga de Trabajo</label>
                            <div class="filtro-opciones">
                                <label class="filtro-radio">
                                    <input type="radio" name="filtro-carga" value="todos" checked onchange="PanelFiltros.aplicarFiltroCarga('todos')">
                                    <span>Todos</span>
                                </label>
                                <label class="filtro-radio">
                                    <input type="radio" name="filtro-carga" value="baja" onchange="PanelFiltros.aplicarFiltroCarga('baja')">
                                    <span>🟢 Baja</span>
                                </label>
                                <label class="filtro-radio">
                                    <input type="radio" name="filtro-carga" value="media" onchange="PanelFiltros.aplicarFiltroCarga('media')">
                                    <span>🟡 Media</span>
                                </label>
                                <label class="filtro-radio">
                                    <input type="radio" name="filtro-carga" value="alta" onchange="PanelFiltros.aplicarFiltroCarga('alta')">
                                    <span>🔴 Alta</span>
                                </label>
                            </div>
                        </div>

                        <!-- Mostrar Conflictos -->
                        <div class="filtro-item">
                            <label class="filtro-label">⚠️ Validación</label>
                            <label class="filtro-checkbox">
                                <input type="checkbox" id="mostrarConflictosPanel" checked onchange="PanelFiltros.toggleConflictos()">
                                <span>Mostrar Conflictos</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Sección de Acciones Rápidas -->
                <div class="panel-filtros-section">
                    <div class="panel-filtros-subtitle">⚡ Acciones Rápidas</div>
                    
                    <div class="panel-filtros-botones">
                        <button class="panel-btn panel-btn-primary" onclick="PanelFiltros.exportarEstadisticas()">
                            <span class="btn-icon">📊</span>
                            <span class="btn-text">Generar<br>Estadísticas</span>
                        </button>
                        <button class="panel-btn panel-btn-success" onclick="PanelFiltros.exportarPDF()">
                            <span class="btn-icon">📄</span>
                            <span class="btn-text">Exportar<br>PDF</span>
                        </button>
                        <button class="panel-btn panel-btn-warning" onclick="PanelFiltros.resetearFiltros()">
                            <span class="btn-icon">🔄</span>
                            <span class="btn-text">Resetear<br>Filtros</span>
                        </button>
                    </div>
                </div>

                <!-- Resumen de Datos -->
                <div class="panel-filtros-resumen">
                    <div class="resumen-item">
                        <div class="resumen-icon">📋</div>
                        <div class="resumen-contenido">
                            <div class="resumen-label">Turnos Totales</div>
                            <div class="resumen-valor">${estadisticas.totalTurnos}</div>
                        </div>
                    </div>
                    <div class="resumen-item">
                        <div class="resumen-icon">⏰</div>
                        <div class="resumen-contenido">
                            <div class="resumen-label">Horas Totales</div>
                            <div class="resumen-valor">${estadisticas.totalHoras}h</div>
                        </div>
                    </div>
                    <div class="resumen-item">
                        <div class="resumen-icon">👥</div>
                        <div class="resumen-contenido">
                            <div class="resumen-label">${estadisticas.filtroActivo ? 'Empleado' : 'Top Ocupado'}</div>
                            <div class="resumen-valor">${estadisticas.empleados.slice(0, 1).map(e => e.nombre).join('') || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Aplicar filtro de empleado
     */
    static async aplicarFiltroEmpleado(empleadoId) {
        this.filtroActivo.empleado = empleadoId ? parseInt(empleadoId) : null;
        
        // Mostrar el empleado seleccionado
        if (this.filtroActivo.empleado) {
            const emp = (window.empleados || []).find(e => e.id === this.filtroActivo.empleado);
            if (emp) {
                NotificationSystem.show(`✅ Mostrando datos de ${emp.nombre}`, 'success');
            }
        } else {
            NotificationSystem.show(`✅ Mostrando todos los empleados`, 'success');
        }
        
        // Recalcular y actualizar el panel
        try {
            const html = await this.renderizar();
            const container = document.getElementById('panelFiltrosContainer');
            if (container) {
                container.innerHTML = html;
                console.log('✓ Panel actualizado con filtro:', this.filtroActivo.empleado);
            }
        } catch (e) {
            console.error('❌ Error actualizando panel:', e);
        }
    }

    /**
     * Aplicar filtro de carga
     */
    static aplicarFiltroCarga(nivel) {
        this.filtroActivo.nivelCarga = nivel !== 'todos' ? nivel : null;
        NotificationSystem.show(`✅ Filtro de carga: ${nivel}`, 'success');
        console.log('🔍 Filtro carga:', this.filtroActivo.nivelCarga);
    }

    /**
     * Toggle conflictos
     */
    static toggleConflictos() {
        this.filtroActivo.mostrarConflictos = !this.filtroActivo.mostrarConflictos;
        const msg = this.filtroActivo.mostrarConflictos ? 'Mostrando' : 'Ocultando';
        NotificationSystem.show(`✅ ${msg} conflictos`, 'success');
    }

    /**
     * Resetear todos los filtros
     */
    static async resetearFiltros() {
        this.filtroActivo = {
            empleado: null,
            nivelCarga: null,
            mostrarConflictos: true
        };
        
        const select = document.getElementById('filtroEmpleadoPanel');
        if (select) select.value = '';
        
        const radios = document.querySelectorAll('input[name="filtro-carga"]');
        radios.forEach(r => r.checked = r.value === 'todos');
        
        const checkbox = document.getElementById('mostrarConflictosPanel');
        if (checkbox) checkbox.checked = true;
        
        // Recalcular y actualizar el panel
        try {
            const html = await this.renderizar();
            const container = document.getElementById('panelFiltrosContainer');
            if (container) {
                container.innerHTML = html;
            }
        } catch (e) {
            console.error('❌ Error reseteando filtros:', e);
        }
        
        NotificationSystem.show('✅ Todos los filtros reseteados', 'success');
    }

    /**
     * Exportar estadísticas del mes
     */
    static async exportarEstadisticas() {
        try {
            NotificationSystem.show('📊 Generando estadísticas...', 'info');
            const stats = await this._obtenerEstadisticas();
            
            const html = `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                    <h2>📊 Estadísticas del Mes</h2>
                    <p><strong>Turnos Totales:</strong> ${stats.totalTurnos}</p>
                    <p><strong>Horas Totales:</strong> ${stats.totalHoras}h</p>
                    <p><strong>Top 3 Empleados más Ocupados:</strong></p>
                    <ul>
                        ${stats.empleados.map((e, i) => 
                            `<li>${i + 1}. ${e.nombre} - ${e.horas}h (${e.turnos} turnos)</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
            
            const ventana = window.open('', '', 'width=600,height=400');
            ventana.document.write(html);
            ventana.document.close();
            
            NotificationSystem.show('✅ Estadísticas generadas', 'success');
        } catch (e) {
            NotificationSystem.show('❌ Error generando estadísticas', 'error');
            console.error(e);
        }
    }

    /**
     * Exportar a PDF (implementado)
     */
    static async exportarPDF() {
        try {
            NotificationSystem.show('📄 Generando PDF...', 'info');
            
            // Obtener estadísticas actuales
            const stats = await this._obtenerEstadisticas();
            const nombreEmpleado = stats.filtroActivo 
                ? (window.empleados || []).find(e => e.id === stats.filtroActivo)?.nombre 
                : 'Todos los empleados';
            
            // Crear contenedor HTML para PDF
            const htmlContent = `
                <div style="padding: 30px; background: #f8f9fa; font-family: Arial, sans-serif;">
                    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #22c55e; padding-bottom: 20px;">
                        <h1 style="margin: 0; color: #1e293b; font-size: 28px;">📊 Estadísticas de Turnos</h1>
                        <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px;">
                            Mes: ${new Date(2026, AppState.currentMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #22c55e; margin-top: 0; font-size: 16px;">👤 Filtro Aplicado</h2>
                        <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>${nombreEmpleado}</strong></p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);">
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">📋 Turnos Totales</div>
                            <div style="font-size: 32px; font-weight: 700;">${stats.totalTurnos}</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);">
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">⏰ Horas Totales</div>
                            <div style="font-size: 32px; font-weight: 700;">${stats.totalHoras}h</div>
                        </div>
                        <div style="background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); padding: 20px; border-radius: 10px; color: white; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);">
                            <div style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">📅 Promedio/Empleado</div>
                            <div style="font-size: 32px; font-weight: 700;">${stats.totalTurnos > 0 ? (stats.totalTurnos / (window.empleados?.length || 1)).toFixed(1) : 0}</div>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h2 style="color: #22c55e; margin-top: 0; font-size: 16px;">👥 Empleados con Mayor Carga</h2>
                        ${stats.empleados.length > 0 ? `
                            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                                <thead>
                                    <tr style="border-bottom: 2px solid #e2e8f0;">
                                        <th style="text-align: left; padding: 12px; color: #64748b; font-weight: 600; font-size: 13px;">Empleado</th>
                                        <th style="text-align: right; padding: 12px; color: #64748b; font-weight: 600; font-size: 13px;">Turnos</th>
                                        <th style="text-align: right; padding: 12px; color: #64748b; font-weight: 600; font-size: 13px;">Horas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${stats.empleados.map((emp, i) => `
                                        <tr style="border-bottom: 1px solid #f1f5f9;">
                                            <td style="padding: 12px; color: #1e293b; font-weight: 500;">${i + 1}. ${emp.nombre}</td>
                                            <td style="text-align: right; padding: 12px; color: #1e293b;">${emp.turnos}</td>
                                            <td style="text-align: right; padding: 12px; color: #1e293b; font-weight: 600;">${emp.horas}h</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        ` : `
                            <p style="color: #94a3b8; font-style: italic; margin: 15px 0 0 0;">No hay datos disponibles</p>
                        `}
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
                        <p style="margin: 0;">Generado: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</p>
                    </div>
                </div>
            `;
            
            // Crear elemento temporal
            const elemento = document.createElement('div');
            elemento.innerHTML = htmlContent;
            elemento.style.position = 'fixed';
            elemento.style.left = '0';
            elemento.style.top = '0';
            elemento.style.width = '100%';
            elemento.style.zIndex = '-9999';
            document.body.appendChild(elemento);
            
            // Convertir a canvas
            const canvas = await html2canvas(elemento, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            
            // Crear PDF
            const jsPDFConstructor = window.jspdf?.jsPDF || window.jsPDF;
            if (!jsPDFConstructor) {
                throw new Error('La librería jsPDF no está disponible. Por favor, recarga la página.');
            }
            
            const pdf = new jsPDFConstructor({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth - 10;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 5, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            // Descargar
            const nombreArchivo = `estadisticas-${nombreEmpleado.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
            pdf.save(nombreArchivo);
            
            // Limpiar
            document.body.removeChild(elemento);
            
            NotificationSystem.show('✅ PDF descargado correctamente', 'success');
        } catch (e) {
            console.error('❌ Error generando PDF:', e);
            NotificationSystem.show('❌ Error generando PDF: ' + e.message, 'error');
        }
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Módulo PanelFiltros cargado');
});
