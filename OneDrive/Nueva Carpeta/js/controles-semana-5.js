/**
 * SEMANA 5 - Controles para Sidebar
 * Interfaz de usuario para Dashboard, Auditoría y Backups
 */

class ControlesSemana5 {
    static init() {
        this.agregarBotonesSidebar();
        this.agregarModales();
    }

    static agregarBotonesSidebar() {
        const sidebar = document.querySelector('.sidebar-container');
        if (!sidebar) return;

        const sectionHTML = `
            <div class="sidebar-section semana5">
                <div class="sidebar-section-title">⚙️ Administración</div>
                
                <button class="sidebar-btn semana5" onclick="ControlesSemana5.abrirDashboard()">
                    <span style="font-size: 16px;">📊</span>
                    <span>Dashboard</span>
                </button>
                
                <button class="sidebar-btn semana5" onclick="ControlesSemana5.abrirAuditoria()">
                    <span style="font-size: 16px;">🔒</span>
                    <span>Auditoría</span>
                </button>
                
                <button class="sidebar-btn semana5" onclick="ControlesSemana5.abrirBackups()">
                    <span style="font-size: 16px;">💾</span>
                    <span>Backups</span>
                </button>
            </div>
        `;

        sidebar.insertAdjacentHTML('beforeend', sectionHTML);
        this.aplicarEstilosSemana5();
    }

    static aplicarEstilosSemana5() {
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-section.semana5 {
                border-top: 2px solid rgba(139, 92, 246, 0.3);
                margin-top: 20px;
                padding-top: 16px;
            }

            .sidebar-btn.semana5 {
                border-left: 3px solid #a78bfa;
                background: rgba(139, 92, 246, 0.08);
                transition: all 0.3s ease;
                font-weight: 500;
            }

            .sidebar-btn.semana5:hover {
                background: rgba(139, 92, 246, 0.15);
                border-left-color: #c084fc;
                transform: translateX(4px);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
            }

            .sidebar-btn.semana5:active {
                transform: translateX(2px);
            }

            .sidebar-section.semana5 .sidebar-section-title {
                color: #a78bfa;
                font-weight: 700;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    static abrirDashboard() {
        const modal = document.getElementById('modalDashboard');
        if (modal) {
            modal.classList.add('active');
            this.cargarDatosKPI();
        }
    }

    static abrirAuditoria() {
        const modal = document.getElementById('modalAuditoria');
        if (modal) {
            modal.classList.add('active');
            this.cargarHistorialAuditoria();
        }
    }

    static abrirBackups() {
        const modal = document.getElementById('modalBackups');
        if (modal) {
            modal.classList.add('active');
            this.listarBackups();
        }
    }

    static agregarModales() {
        const mainContent = document.querySelector('.main-content') || document.body;

        // Modal Dashboard
        const modalDashboard = `
            <div id="modalDashboard" class="modal">
                <div class="modal-content">
                    <h2>📊 Dashboard Avanzado <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                            <select id="selectMesDash" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="1">Enero</option><option value="2">Febrero</option>
                                <option value="3">Marzo</option><option value="4">Abril</option>
                                <option value="5">Mayo</option><option value="6">Junio</option>
                            </select>
                            <select id="selectAñoDash" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="2025">2025</option><option value="2024">2024</option>
                            </select>
                            <button onclick="ControlesSemana5.cargarDatosKPI()" style="width: 100%;">Actualizar</button>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiEmpleados">-</div>
                                <div style="font-size: 12px; color: #666;">Empleados</div>
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiTurnos">-</div>
                                <div style="font-size: 12px; color: #666;">Turnos</div>
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiAsistencia">-</div>
                                <div style="font-size: 12px; color: #666;">Asistencia %</div>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiHoras">-</div>
                                <div style="font-size: 12px; color: #666;">Horas Promedio</div>
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiCumplimiento">-</div>
                                <div style="font-size: 12px; color: #666;">Cumplimiento %</div>
                            </div>
                            <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
                                <div style="font-size: 24px; font-weight: bold; color: #667eea;" id="kpiCosto">-</div>
                                <div style="font-size: 12px; color: #666;">Costo Laboral €</div>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Exportar Reportes</h4>
                            <button onclick="ControlesSemana5.exportarReportePDF()" style="width: 100%; margin-top: 10px;">📄 Exportar como PDF</button>
                            <button onclick="ControlesSemana5.exportarReporteHTML()" style="width: 100%; margin-top: 10px;">🌐 Exportar como HTML</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalDashboard').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Modal Auditoría
        const modalAuditoria = `
            <div id="modalAuditoria" class="modal">
                <div class="modal-content" style="max-width: 1100px; background: linear-gradient(135deg, #0f172a 0%, #1a1f35 100%);">
                    <div style="background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); padding: 20px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">🔒 Sistema de Auditoría</h2>
                        <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')" style="background: rgba(255,255,255,0.3); border: none; color: white; padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer;">✕</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 24px; color: #f1f5f9;">
                        <!-- Filtros -->
                        <div style="display: grid; grid-template-columns: 1fr 120px; gap: 12px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; color: #cbd5e1; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Filtrar por tipo:</label>
                                <select id="selectFiltroEntidad" style="width: 100%; padding: 10px; background: #1e293b; color: #f1f5f9; border: 1px solid #475569; border-radius: 6px; font-size: 13px;">
                                    <option value="">📋 Todas las entidades</option>
                                    <option value="turno">🕐 Turno</option>
                                    <option value="empleado">👤 Empleado</option>
                                    <option value="backup">💾 Backup</option>
                                </select>
                            </div>
                            <button onclick="ControlesSemana5.cargarHistorialAuditoria()" style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; height: fit-content; align-self: flex-end;">🔄</button>
                        </div>

                        <!-- Historial con cards -->
                        <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #475569;">
                            <h4 style="margin: 0 0 12px 0; color: #e2e8f0; font-size: 14px;">📜 Historial de Cambios</h4>
                            <div id="historialAuditoria" style="max-height: 350px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
                                Cargando...
                            </div>
                        </div>

                        <!-- Análisis de Seguridad -->
                        <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(249, 115, 22, 0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <h4 style="margin: 0 0 4px 0; color: white; font-size: 14px;">⚠️ Detectar Actividades Sospechosas</h4>
                                    <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">Analiza cambios anormales o potencialmente fraudulentos</p>
                                </div>
                                <button onclick="ControlesSemana5.detectarSospechosas()" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; white-space: nowrap;">Analizar Ahora</button>
                            </div>
                        </div>

                        <!-- Exportar Reporte -->
                        <div style="background: #1e293b; border-radius: 8px; padding: 16px; border: 1px solid #475569;">
                            <h4 style="margin: 0 0 12px 0; color: #e2e8f0; font-size: 14px;">📊 Exportar Reporte</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 120px; gap: 10px;">
                                <div>
                                    <label style="display: block; color: #cbd5e1; font-size: 12px; margin-bottom: 4px;">Desde:</label>
                                    <input type="date" id="inputFechaInicio" style="width: 100%; padding: 8px; background: #0f172a; color: #f1f5f9; border: 1px solid #475569; border-radius: 6px; font-size: 12px;">
                                </div>
                                <div>
                                    <label style="display: block; color: #cbd5e1; font-size: 12px; margin-bottom: 4px;">Hasta:</label>
                                    <input type="date" id="inputFechaFin" style="width: 100%; padding: 8px; background: #0f172a; color: #f1f5f9; border: 1px solid #475569; border-radius: 6px; font-size: 12px;">
                                </div>
                                <button onclick="ControlesSemana5.generarReporteAuditoria()" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; height: fit-content; align-self: flex-end;">📋</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #475569; background: #0f172a; border-radius: 0 0 12px 12px;">
                        <button onclick="document.getElementById('modalAuditoria').classList.remove('active')" style="background: linear-gradient(135deg, #64748b 0%, #475569 100%); color: white; padding: 10px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Modal Backups - MODERNO Y MEJORADO
        const modalBackups = `
            <div id="modalBackups" class="modal">
                <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                    <div style="background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); padding: 20px 24px; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                            📁 Gestor de Backups
                        </h2>
                        <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">✕</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 28px;">
                        <!-- CREAR BACKUP MANUAL -->
                        <div style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%); border: 2px solid #e9d5ff; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                            <h4 style="margin: 0 0 16px 0; color: #5b21b6; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                💾 Crear Backup Manual
                            </h4>
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: flex-end;">
                                <input type="text" id="inputNombreBackup" placeholder="Nombre del backup (opcional)" style="padding: 12px 14px; border: 2px solid #e2e8f0; border-radius: 8px; width: 100%; background: white; color: #1e293b; font-weight: 500; transition: all 0.3s ease; font-size: 14px;">
                                <button onclick="ControlesSemana5.crearBackupManual()" style="background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(167, 139, 250, 0.5); white-space: nowrap;">💾 Crear Backup</button>
                            </div>
                        </div>

                        <!-- BACKUPS DISPONIBLES -->
                        <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%); border: 2px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                            <h4 style="margin: 0 0 16px 0; color: #1e40af; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                📋 Backups Disponibles
                            </h4>
                            <div id="listaBackups" style="max-height: 280px; overflow-y: auto; border: 2px solid #dbeafe; border-radius: 8px; padding: 12px; background: white;">
                                <div style="text-align: center; color: #94a3b8; padding: 20px; font-size: 14px;">Cargando backups...</div>
                            </div>
                        </div>

                        <!-- VALIDACIÓN DE INTEGRIDAD -->
                        <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%); border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                            <h4 style="margin: 0 0 16px 0; color: #15803d; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                ✓ Validación de Integridad
                            </h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <button onclick="ControlesSemana5.validarIntegridad()" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4);">✓ Validar Backups</button>
                                <button onclick="ControlesSemana5.limpiarAntiguos()" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);">🗑️ Limpiar Antiguos (>30 días)</button>
                            </div>
                        </div>

                        <!-- IMPORTAR BACKUP -->
                        <div style="background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.05) 100%); border: 2px solid #fed7aa; border-radius: 12px; padding: 20px;">
                            <h4 style="margin: 0 0 16px 0; color: #92400e; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                                📤 Importar Backup
                            </h4>
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: flex-end;">
                                <input type="file" id="inputArchivoBackup" accept=".json" style="padding: 12px 14px; border: 2px solid #e2e8f0; border-radius: 8px; width: 100%; background: white; color: #1e293b; font-weight: 500; transition: all 0.3s ease; font-size: 14px; cursor: pointer;">
                                <button onclick="ControlesSemana5.importarBackup()" style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(249, 115, 22, 0.5); white-space: nowrap;">📤 Importar</button>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f1f5f9; padding: 16px 24px; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
                        <button onclick="document.getElementById('modalBackups').classList.remove('active')" style="background: #f1f5f9; color: #475569; border: 2px solid #cbd5e1; padding: 12px 28px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        mainContent.insertAdjacentHTML('beforeend', modalDashboard);
        mainContent.insertAdjacentHTML('beforeend', modalAuditoria);
        mainContent.insertAdjacentHTML('beforeend', modalBackups);
    }

    // ============ MÉTODOS DASHBOARD ============
    static cargarDatosKPI() {
        const mes = parseInt(document.getElementById('selectMesDash')?.value) || 1;
        const año = parseInt(document.getElementById('selectAñoDash')?.value) || 2025;

        const resultado = DashboardAvanzado.calcularKPIs(mes, año);
        
        if (resultado.exito) {
            const kpis = resultado.kpis;
            document.getElementById('kpiEmpleados').textContent = kpis.totalEmpleados;
            document.getElementById('kpiTurnos').textContent = kpis.totalTurnos;
            document.getElementById('kpiAsistencia').textContent = (kpis.tasaAsistencia * 100).toFixed(1);
            document.getElementById('kpiHoras').textContent = kpis.hrsPromedioPorEmpleado;
            document.getElementById('kpiCumplimiento').textContent = (kpis.cumplimientoHoras * 100).toFixed(1);
            document.getElementById('kpiCosto').textContent = (kpis.costoLaboral / 1000).toFixed(1) + 'k';
        }
    }

    static exportarReportePDF() {
        const mes = parseInt(document.getElementById('selectMesDash')?.value) || 1;
        const año = parseInt(document.getElementById('selectAñoDash')?.value) || 2025;
        
        const resultado = DashboardAvanzado.exportarReportePDF(mes, año);
        alert(resultado.mensaje || '✅ PDF exportado');
    }

    static exportarReporteHTML() {
        const mes = parseInt(document.getElementById('selectMesDash')?.value) || 1;
        const año = parseInt(document.getElementById('selectAñoDash')?.value) || 2025;
        
        const resultado = DashboardAvanzado.generarReporteEjecutivo(mes, año);
        if (resultado.exito) {
            const blob = new Blob([resultado.html], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = resultado.nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('✅ HTML exportado');
        }
    }

    // ============ MÉTODOS AUDITORÍA ============
    static cargarHistorialAuditoria() {
        const entidad = document.getElementById('selectFiltroEntidad')?.value;
        const resultado = SistemaAuditoriaAvanzado.obtenerHistorial({entidad: entidad || undefined});

        if (!resultado.registros || resultado.registros.length === 0) {
            document.getElementById('historialAuditoria').innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                    <div style="font-size: 32px; margin-bottom: 10px;">📭</div>
                    <p>Sin registros de auditoría</p>
                </div>
            `;
            return;
        }

        let html = '';
        resultado.registros.slice(0, 50).forEach((r, idx) => {
            const iconoOp = {
                'crear': '✨',
                'editar': '✏️',
                'eliminar': '🗑️',
                'exportar': '📤',
                'guardar': '💾'
            }[r.operacion] || '📌';

            const iconoEntidad = {
                'turno': '🕐',
                'empleado': '👤',
                'backup': '💾',
                'sede': '🏢',
                'departamento': '🏭'
            }[r.entidad] || '📋';

            const horaLocal = new Date(r.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const fechaLocal = new Date(r.timestamp).toLocaleDateString('es-ES');

            html += `
                <div style="background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.3s ease;" 
                     onmouseover="this.style.borderColor='#a78bfa'; this.style.background='#1a1f35';" 
                     onmouseout="this.style.borderColor='#475569'; this.style.background='#0f172a';">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span style="font-size: 18px;">${iconoEntidad}</span>
                            <div>
                                <div style="color: #f1f5f9; font-weight: 600; font-size: 13px;">
                                    ${iconoOp} ${r.operacion.charAt(0).toUpperCase() + r.operacion.slice(1)} - ${r.entidad}
                                </div>
                                <div style="color: #cbd5e1; font-size: 11px; margin-top: 2px;">👤 ${r.usuario || 'Sistema'}</div>
                            </div>
                        </div>
                        <div style="text-align: right; font-size: 11px; color: #94a3b8;">
                            <div>${horaLocal}</div>
                            <div>${fechaLocal}</div>
                        </div>
                    </div>
                    ${r.detalles ? `<div style="color: #cbd5e1; font-size: 11px; padding-top: 8px; border-top: 1px solid #475569; margin-top: 8px;">📝 ${r.detalles}</div>` : ''}
                </div>
            `;
        });

        document.getElementById('historialAuditoria').innerHTML = html;
    }

    static detectarSospechosas() {
        const resultado = SistemaAuditoriaAvanzado.detectarActividadesSospechosas();
        
        if (resultado.sospechosas.length === 0) {
            NotificationSystem.show('✅ No se detectaron actividades sospechosas', 'success');
        } else {
            let html = '<div style="padding: 20px; background: #7c2d12; border-radius: 8px; border: 2px solid #ea580c;">';
            html += `<h3 style="margin: 0 0 12px 0; color: #fca5a5; font-size: 16px;">⚠️ ${resultado.sospechosas.length} Alertas Detectadas</h3>`;
            html += '<div style="display: flex; flex-direction: column; gap: 8px;">';
            
            resultado.sospechosas.forEach(s => {
                html += `
                    <div style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; border-left: 3px solid #fca5a5;">
                        <div style="color: #fca5a5; font-weight: 600; font-size: 12px;">${s.tipo}</div>
                        <div style="color: #e7d5c8; font-size: 11px; margin-top: 2px;">${s.mensaje}</div>
                    </div>
                `;
            });
            
            html += '</div></div>';
            
            // Mostrar en una notificación visual extendida
            const container = document.createElement('div');
            container.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10000; background: #0f172a; border: 2px solid #ea580c; border-radius: 12px; padding: 24px; max-width: 500px; max-height: 400px; overflow-y: auto; box-shadow: 0 20px 60px rgba(234, 88, 12, 0.5);';
            container.innerHTML = html + `<button onclick="this.parentElement.remove()" style="margin-top: 16px; width: 100%; padding: 10px; background: #ea580c; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cerrar</button>`;
            document.body.appendChild(container);
        }
    }

    static generarReporteAuditoria() {
        const fecha1 = document.getElementById('inputFechaInicio')?.value;
        const fecha2 = document.getElementById('inputFechaFin')?.value;

        if (!fecha1 || !fecha2) {
            alert('Selecciona fechas de inicio y fin');
            return;
        }

        const resultado = SistemaAuditoriaAvanzado.generarReporteAuditoria(fecha1, fecha2);
        if (resultado.exito) {
            const blob = new Blob([resultado.html], {type: 'text/html'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = resultado.nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('✅ Reporte generado');
        }
    }

    // ============ MÉTODOS BACKUPS ============
    static crearBackupManual() {
        let nombre = document.getElementById('inputNombreBackup')?.value || '';
        
        // Si no se proporciona nombre, generar automáticamente con fecha y hora
        if (!nombre.trim()) {
            const ahora = new Date();
            const fecha = ahora.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
            const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            nombre = `Backup_${fecha}_${hora}`;
        }
        
        const resultado = GestorBackups.crearBackup(nombre, 'manual');
        
        if (resultado.exito) {
            NotificationSystem.show(`✅ Backup creado: ${nombre}`, 'success');
            document.getElementById('inputNombreBackup').value = '';
            this.listarBackups();
        } else {
            NotificationSystem.show(`❌ Error al crear backup`, 'error');
        }
    }

    static listarBackups() {
        const resultado = GestorBackups.obtenerBackups();
        let html = '';

        resultado.backups.forEach(b => {
            html += `<div style="padding: 16px; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; background: white; border-radius: 8px; margin-bottom: 10px; transition: all 0.3s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="flex: 1;">
                    <strong style="color: #1e293b; font-size: 15px; display: block; margin-bottom: 4px;">${b.nombre}</strong>
                    <small style="color: #64748b; font-size: 12px;">📅 ${b.timestamp} | 💾 ${b.tamaño}</small>
                </div>
                <div style="display: flex; gap: 8px; margin-left: 16px;">
                    <button onclick="ControlesSemana5.restaurarBackup('${b.id}')" title="Restaurar este backup" style="padding: 10px 14px; font-size: 16px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; font-weight: 600;" onmouseover="this.style.boxShadow='0 4px 12px rgba(59, 130, 246, 0.5)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(59, 130, 246, 0.3)'; this.style.transform='translateY(0)'">🔄</button>
                    <button onclick="ControlesSemana5.descargarBackup('${b.id}')" title="Descargar este backup" style="padding: 10px 14px; font-size: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; font-weight: 600;" onmouseover="this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.5)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(16, 185, 129, 0.3)'; this.style.transform='translateY(0)'">⬇️</button>
                    <button onclick="ControlesSemana5.eliminarBackup('${b.id}')" title="Eliminar este backup" style="padding: 10px 14px; font-size: 16px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); display: flex; align-items: center; justify-content: center; min-width: 44px; min-height: 44px; font-weight: 600;" onmouseover="this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.5)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(239, 68, 68, 0.3)'; this.style.transform='translateY(0)'">🗑️</button>
                </div>
            </div>`;
        });

        document.getElementById('listaBackups').innerHTML = html || '<div style="text-align: center; padding: 30px; color: #94a3b8;">📭 Sin backups disponibles</div>';
    }

    static restaurarBackup(backupId) {
        if (confirm('¿Restaurar este backup? Se perderán cambios no guardados.')) {
            const resultado = GestorBackups.restaurarBackup(backupId);
            alert(resultado.mensaje);
            if (resultado.exito) location.reload();
        }
    }

    static descargarBackup(backupId) {
        const resultado = GestorBackups.descargarBackup(backupId);
        alert(resultado.mensaje || '✅ Descargado');
    }

    static eliminarBackup(backupId) {
        if (confirm('¿Eliminar este backup?')) {
            const resultado = GestorBackups.eliminarBackup(backupId);
            alert(resultado.mensaje);
            this.listarBackups();
        }
    }

    static validarIntegridad() {
        const resultado = GestorBackups.validarIntegridad();
        alert(`✓ ${resultado.validos} válidos\n✗ ${resultado.invalidos} inválidos\nTotal: ${resultado.totalBackups}`);
    }

    static limpiarAntiguos() {
        if (confirm('¿Eliminar backups más antiguos de 30 días?')) {
            const resultado = GestorBackups.limpiarAntiguos(30);
            alert(resultado.mensaje);
            this.listarBackups();
        }
    }

    static importarBackup() {
        const input = document.getElementById('inputArchivoBackup');
        if (input.files.length === 0) {
            alert('Selecciona un archivo');
            return;
        }

        GestorBackups.importarBackup(input).then(resultado => {
            alert(resultado.mensaje);
            if (resultado.exito) {
                this.listarBackups();
                input.value = '';
            }
        });
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ControlesSemana5.init());
} else {
    ControlesSemana5.init();
}
