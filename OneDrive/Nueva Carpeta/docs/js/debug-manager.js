/**
 * GESTOR DE DEBUG - Panel de diagnóstico avanzado
 * Proporciona información en tiempo real sobre el estado de la aplicación
 */

class DebugManager {
    static isInitialized = false;
    static modalId = 'modalDebugPanel';

    static init() {
        if (this.isInitialized) return;

        this.crearModal();
        this.isInitialized = true;
        console.log('✅ DebugManager inicializado');
    }

    static crearModal() {
        if (document.getElementById(this.modalId)) return;

        const html = `
            <div id="${this.modalId}" class="modal">
                <div class="modal-content" style="max-width: 900px; max-height: 80vh; overflow-y: auto;">
                    <h2 style="margin: 0 0 20px 0; color: #ef4444;">
                        🔍 Panel de Diagnóstico
                        <button class="close-btn" onclick="DebugManager.cerrar()">✕</button>
                    </h2>
                    
                    <div class="modal-body" id="debugContent">
                        <p style="text-align: center; color: #999;">Cargando...</p>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="DebugManager.actualizarDatos()" style="background: #3b82f6;">🔄 Actualizar</button>
                        <button onclick="DebugManager.exportarDatos()" style="background: #10b981;">📥 Exportar JSON</button>
                        <button onclick="DebugManager.limpiarConsola()" style="background: #f59e0b;">🗑️ Limpiar</button>
                        <button onclick="DebugManager.cerrar()" style="background: #6b7280;">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    static mostrar() {
        this.init();
        const modal = document.getElementById(this.modalId);
        if (modal) {
            this.actualizarDatos();
            modal.classList.add('active');
        }
    }

    static cerrar() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    static actualizarDatos() {
        const contenido = document.getElementById('debugContent');
        if (!contenido) return;

        let html = '';

        // 1. ESTADO DE MÓDULOS
        html += `<div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #f97316; font-size: 16px;">📦 Estado de Módulos</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #1e293b;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #f97316;">Módulo</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 2px solid #f97316;">Estado</th>
                </tr>
                ${this.obtenerModulos().map(m => `
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 10px;">${m.nombre}</td>
                        <td style="padding: 10px; text-align: center; color: ${window[m.clase] ? '#22c55e' : '#ef4444'};">
                            ${window[m.clase] ? '✓ Cargado' : '✗ Falta'}
                        </td>
                    </tr>
                `).join('')}
            </table>
        </div>`;

        // 2. ESTADO DE DATOS
        html += `<div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #f97316; font-size: 16px;">📊 Estado de Datos</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #1e293b;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #f97316;">Propiedad</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #f97316;">Valor</th>
                </tr>`;

        // AppState
        if (typeof AppState !== 'undefined') {
            html += `
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Mes Actual</td>
                    <td style="padding: 10px; text-align: right; color: #22c55e;">${AppState.currentMonth}/${AppState.currentYear}</td>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Turnos en Memoria</td>
                    <td style="padding: 10px; text-align: right; color: #22c55e;">${AppState.scheduleData?.size || 0}</td>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Cambios Pendientes</td>
                    <td style="padding: 10px; text-align: right; color: ${(AppState.cambiosPendientes?.length || 0) > 5 ? '#fbbf24' : '#22c55e'};">${AppState.cambiosPendientes?.length || 0}</td>
                </tr>
            `;
        }

        // Empleados
        if (window.empleados && Array.isArray(window.empleados)) {
            html += `
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Total Empleados</td>
                    <td style="padding: 10px; text-align: right; color: #22c55e;">${window.empleados.length}</td>
                </tr>
            `;
        }

        // localStorage
        const datosLocales = localStorage.getItem('turnosAppState');
        const tamañoKB = datosLocales ? (datosLocales.length / 1024).toFixed(2) : '0';
        html += `
            <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px; color: #999;">localStorage (turnos)</td>
                <td style="padding: 10px; text-align: right; color: #22c55e;">${tamañoKB} KB</td>
            </tr>
        `;

        html += '</table></div>';

        // 3. INFORMACIÓN DEL NAVEGADOR
        html += `<div style="margin-bottom: 25px;">
            <h3 style="margin: 0 0 15px 0; color: #f97316; font-size: 16px;">🌐 Información del Navegador</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="background: #1e293b;">
                    <th style="padding: 10px; text-align: left; border-bottom: 2px solid #f97316;">Propiedad</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 2px solid #f97316;">Valor</th>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">User Agent</td>
                    <td style="padding: 10px; text-align: right; font-size: 11px; color: #22c55e;">${navigator.userAgent.substring(0, 50)}...</td>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Plataforma</td>
                    <td style="padding: 10px; text-align: right; color: #22c55e;">${navigator.platform}</td>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Lenguaje</td>
                    <td style="padding: 10px; text-align: right; color: #22c55e;">${navigator.language}</td>
                </tr>
                <tr style="border-bottom: 1px solid #334155;">
                    <td style="padding: 10px; color: #999;">Online</td>
                    <td style="padding: 10px; text-align: right; color: ${navigator.onLine ? '#22c55e' : '#ef4444'};">${navigator.onLine ? '✓ Sí' : '✗ No'}</td>
                </tr>
            </table>
        </div>`;

        // 4. PERFORMANCE
        if (performance.timing) {
            const timing = performance.timing;
            const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            const connectTime = timing.responseEnd - timing.requestStart;
            const renderTime = timing.domInteractive - timing.navigationStart;

            html += `<div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 15px 0; color: #f97316; font-size: 16px;">⚡ Performance</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    <tr style="background: #1e293b;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #f97316;">Métrica</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #f97316;">Tiempo</th>
                    </tr>
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 10px; color: #999;">Tiempo Total de Carga</td>
                        <td style="padding: 10px; text-align: right; color: #22c55e;">${pageLoadTime}ms</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 10px; color: #999;">Tiempo de Conexión</td>
                        <td style="padding: 10px; text-align: right; color: #22c55e;">${connectTime}ms</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #334155;">
                        <td style="padding: 10px; color: #999;">Tiempo de Renderizado</td>
                        <td style="padding: 10px; text-align: right; color: #22c55e;">${renderTime}ms</td>
                    </tr>
                </table>
            </div>`;
        }

        contenido.innerHTML = html;
    }

    static obtenerModulos() {
        return [
            { nombre: 'Validador de Datos', clase: 'ValidadorDatos' },
            { nombre: 'Autoguardado', clase: 'AutoSaveManager' },
            { nombre: 'Sincronización Pestañas', clase: 'TabSyncManager' },
            { nombre: 'Generador Reportes', clase: 'GeneradorReportes' },
            { nombre: 'WhatsApp', clase: 'IntegracionWhatsApp' },
            { nombre: 'Sincronización Datos', clase: 'SincronizacionDatos' },
            { nombre: 'Analizador Conflictos', clase: 'AnalizadorConflictos' },
            { nombre: 'Dashboard Analítica', clase: 'DashboardAnalytica' },
            { nombre: 'Optimizador Turnos', clase: 'OptimizadorTurnos' },
            { nombre: 'Gestor MultiLocal', clase: 'GestorMultiLocal' },
            { nombre: 'Integración Calendario', clase: 'IntegracionCalendario' },
            { nombre: 'Notificaciones', clase: 'SistemaNotificaciones' },
            { nombre: 'Dashboard Avanzado', clase: 'DashboardAvanzado' },
            { nombre: 'Auditoría Avanzada', clase: 'SistemaAuditoriaAvanzado' },
            { nombre: 'Gestor Backups', clase: 'GestorBackups' }
        ];
    }

    static exportarDatos() {
        const datos = {
            timestamp: new Date().toISOString(),
            appState: {
                mes: AppState?.currentMonth,
                año: AppState?.currentYear,
                turnosEnMemoria: AppState?.scheduleData?.size
            },
            empleados: window.empleados?.length || 0,
            localstorage: {
                turnosAppState: localStorage.getItem('turnosAppState')?.substring(0, 100) + '...',
                empleadosData: localStorage.getItem('empleadosData')?.substring(0, 100) + '...'
            }
        };

        const json = JSON.stringify(datos, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert('✅ Datos exportados correctamente');
    }

    static limpiarConsola() {
        if (confirm('¿Deseas limpiar toda la consola del navegador?')) {
            console.clear();
            console.log('%c✅ Consola limpiada', 'color: #22c55e; font-size: 14px; font-weight: bold;');
        }
    }
}

// Inicializar cuando DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DebugManager.init());
} else {
    DebugManager.init();
}

console.log('✅ DebugManager cargado');
