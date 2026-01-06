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
                border-bottom: 2px solid rgba(155, 89, 182, 0.3);
            }

            .sidebar-btn.semana5 {
                border-left: 3px solid #e74c3c;
                background: rgba(231, 76, 60, 0.08);
            }

            .sidebar-btn.semana5:hover {
                background: rgba(231, 76, 60, 0.15);
                border-left-color: #ec7063;
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
                <div class="modal-content">
                    <h2>🔒 Sistema de Auditoría <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                            <select id="selectFiltroEntidad" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                <option value="">Todas las entidades</option>
                                <option value="turno">Turno</option>
                                <option value="empleado">Empleado</option>
                                <option value="backup">Backup</option>
                            </select>
                            <button onclick="ControlesSemana5.cargarHistorialAuditoria()" style="width: 100%;">🔄 Refrescar</button>
                        </div>

                        <div id="historialAuditoria" style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-size: 12px; background: #f9f9f9;">
                            Cargando...
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Detectar Actividades Sospechosas</h4>
                            <button onclick="ControlesSemana5.detectarSospechosas()" style="width: 100%; margin-top: 10px;">⚠️ Analizar Ahora</button>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Exportar Reporte</h4>
                            <input type="date" id="inputFechaInicio" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 5px;">
                            <input type="date" id="inputFechaFin" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <button onclick="ControlesSemana5.generarReporteAuditoria()" style="width: 100%; margin-top: 10px;">📋 Generar Reporte</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalAuditoria').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Modal Backups
        const modalBackups = `
            <div id="modalBackups" class="modal">
                <div class="modal-content">
                    <h2>💾 Gestor de Backups <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="margin-bottom: 20px;">
                            <h4>Crear Backup Manual</h4>
                            <input type="text" id="inputNombreBackup" placeholder="Nombre del backup" style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            <button onclick="ControlesSemana5.crearBackupManual()" style="width: 100%;">💾 Crear Backup</button>
                        </div>

                        <div style="padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Backups Disponibles</h4>
                            <div id="listaBackups" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                                Cargando...
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Validación de Integridad</h4>
                            <button onclick="ControlesSemana5.validarIntegridad()" style="width: 100%; margin-bottom: 10px;">✓ Validar Backups</button>
                            <button onclick="ControlesSemana5.limpiarAntiguos()" style="width: 100%;">🗑️ Limpiar Antiguos (>30 días)</button>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Importar Backup</h4>
                            <input type="file" id="inputArchivoBackup" accept=".json" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px; width: 100%; margin-bottom: 10px;">
                            <button onclick="ControlesSemana5.importarBackup()" style="width: 100%;">📤 Importar Archivo</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalBackups').classList.remove('active')">Cerrar</button>
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

        let html = '<table style="width: 100%; font-size: 11px;"><tr><th>Usuario</th><th>Operación</th><th>Timestamp</th></tr>';
        
        resultado.registros.forEach(r => {
            html += `<tr><td>${r.usuario}</td><td>${r.operacion}</td><td>${r.timestamp.substring(0, 10)}</td></tr>`;
        });

        html += '</table>';
        document.getElementById('historialAuditoria').innerHTML = html || 'Sin registros';
    }

    static detectarSospechosas() {
        const resultado = SistemaAuditoriaAvanzado.detectarActividadesSospechosas();
        if (resultado.sospechosas.length === 0) {
            alert('✅ No se detectaron actividades sospechosas');
        } else {
            alert(`⚠️ ${resultado.sospechosas.length} alertas detectadas:\n` + 
                resultado.sospechosas.map(s => `- ${s.tipo}: ${s.mensaje}`).join('\n'));
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
        const nombre = document.getElementById('inputNombreBackup')?.value || 'Backup Manual';
        const resultado = GestorBackups.crearBackup(nombre, 'manual');
        
        if (resultado.exito) {
            alert(`✅ Backup creado: ${resultado.backupId}`);
            document.getElementById('inputNombreBackup').value = '';
            this.listarBackups();
        }
    }

    static listarBackups() {
        const resultado = GestorBackups.obtenerBackups();
        let html = '';

        resultado.backups.forEach(b => {
            html += `<div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <div style="flex: 1;">
                    <strong>${b.nombre}</strong><br>
                    <small>${b.timestamp} | ${b.tamaño}</small>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button onclick="ControlesSemana5.restaurarBackup('${b.id}')" style="padding: 5px 10px; font-size: 11px;">🔄</button>
                    <button onclick="ControlesSemana5.descargarBackup('${b.id}')" style="padding: 5px 10px; font-size: 11px;">⬇️</button>
                    <button onclick="ControlesSemana5.eliminarBackup('${b.id}')" style="padding: 5px 10px; font-size: 11px; background: #e74c3c;">🗑️</button>
                </div>
            </div>`;
        });

        document.getElementById('listaBackups').innerHTML = html || 'Sin backups';
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
