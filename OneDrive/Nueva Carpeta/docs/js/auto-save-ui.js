/**
 * 🔄 AUTO-SAVE UI MODULE - Interfaz del Sistema de Auto-guardado
 * 
 * Módulo modular que proporciona la UI para controlar AutoSaveManager
 * Responsabilidades:
 * - Modal de estado del auto-guardado
 * - Actualizar estadísticas en tiempo real
 * - Acciones: Forzar guardado, Activar/Desactivar
 * 
 * @version 1.0.0
 * @date 4 de enero de 2026
 * @namespace AutoSaveUIModule
 */

const AutoSaveUIModule = (function() {
    'use strict';
    
    // ========================================================================
    // ESTADO PRIVADO
    // ========================================================================
    
    const state = {
        isOpen: false,
        updateInterval: null
    };
    
    // ========================================================================
    // MÉTODOS PRIVADOS
    // ========================================================================
    
    /**
     * Crear el HTML del modal
     * @returns {HTMLElement}
     */
    function crearEstructuraModal() {
        const template = `
            <div id="modalAutoGuardado" class="modal">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 18px; font-weight: 600;">📋 Estado de Autoguardado</h2>
                        <button class="modal-close" onclick="AutoSaveUIModule.cerrarModal()" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 32px; height: 32px; border-radius: 4px; hover: background: rgba(255,255,255,0.3);">×</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 24px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        
                        <!-- Estado del sistema -->
                        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                
                                <div>
                                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Estado</span>
                                    <p style="margin: 8px 0 0 0; font-size: 14px;">
                                        <span id="autoSaveStatusDisplay" style="display: inline-block; padding: 4px 8px; border-radius: 4px; background: #dcfce7; color: #166534; font-weight: 600;">✅ ACTIVO</span>
                                    </p>
                                </div>
                                
                                <div>
                                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Cambios pendientes</span>
                                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;" id="pendingChangesDisplay">0</p>
                                </div>
                                
                                <div>
                                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Total guardados</span>
                                    <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;" id="totalSavesDisplay">0</p>
                                </div>
                                
                                <div>
                                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Intervalo</span>
                                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #475569;">Cada 30s</p>
                                </div>
                                
                            </div>
                        </div>
                        
                        <!-- Último guardado -->
                        <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                            <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">Último guardado (localStorage)</span>
                            <p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;" id="lastSaveTimeDisplay">Nunca</p>
                        </div>
                        
                        <!-- Estado BD -->
                        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%); padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #7c3aed;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600;">🗄️ Base de Datos</span>
                                <span style="font-size: 11px; padding: 4px 8px; border-radius: 4px; background: white; color: #7c3aed; font-weight: 600;" id="bdStatusBadge">Verificando...</span>
                            </div>
                            <p style="margin: 6px 0 0 0; font-size: 13px; color: #475569; line-height: 1.5;" id="bdSyncInfo">
                                Sincronizando con BD...
                            </p>
                        </div>
                        
                        <!-- Descripción -->
                        <p style="font-size: 13px; color: #64748b; margin: 0 0 20px 0; line-height: 1.6;">
                            Los cambios se guardan en <strong>localStorage (instantáneo)</strong> y se sincronizan con la <strong>BD cada 60 segundos</strong>. Tu información está siempre segura en ambos lugares.
                        </p>
                        
                        <!-- Acciones -->
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button class="btn btn-primary" onclick="AutoSaveUIModule.forzarGuardado()" style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                💾 Guardar ahora
                            </button>
                            <button class="btn btn-sync" onclick="if(typeof AutoSaveBDModule !== 'undefined') AutoSaveBDModule.forzarSincronizacion()" style="flex: 1; min-width: 150px; background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); color: white; padding: 12px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                🗄️ Sync BD
                            </button>
                            <button class="btn btn-secondary" onclick="AutoSaveUIModule.alternarAutoGuardado()" style="flex: 1; min-width: 150px; background: #f1f5f9; color: #475569; padding: 12px 16px; border: 2px solid #cbd5e1; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                <span id="toggleButtonText">🛑 Desactivar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = template;
        return container.firstElementChild;
    }
    
    /**
     * Inyectar CSS si es necesario
     */
    function inyectarEstilos() {
        const styleId = 'autoSaveUIStyles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #modalAutoGuardado.modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
                z-index: 9999;
                overflow: visible !important;
            }
            
            #modalAutoGuardado.modal.active {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
            
            #modalAutoGuardado .modal-content {
                background: white;
                border-radius: 8px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                overflow-x: visible;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
            }
            
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Obtener estadísticas del AutoSaveManager
     * @returns {Object}
     */
    function obtenerEstadisticas() {
        if (typeof AutoSaveManager === 'undefined') {
            return {
                isInitialized: false,
                totalSaves: 0,
                lastSaveTime: null,
                pendingChangeCount: 0
            };
        }
        
        return AutoSaveManager.getStats();
    }
    
    /**
     * Actualizar la visualización del modal
     */
    function actualizarVisualizacion() {
        const stats = obtenerEstadisticas();
        
        // Estado
        const statusElement = document.getElementById('autoSaveStatusDisplay');
        if (statusElement) {
            statusElement.innerHTML = stats.isInitialized
                ? '<span style="display: inline-block; padding: 4px 8px; border-radius: 4px; background: #dcfce7; color: #166534; font-weight: 600;">✅ ACTIVO</span>'
                : '<span style="display: inline-block; padding: 4px 8px; border-radius: 4px; background: #fee2e2; color: #991b1b; font-weight: 600;">🛑 INACTIVO</span>';
        }
        
        // Cambios pendientes
        const pendingElement = document.getElementById('pendingChangesDisplay');
        if (pendingElement) {
            pendingElement.textContent = stats.pendingChangeCount;
        }
        
        // Total guardados
        const totalElement = document.getElementById('totalSavesDisplay');
        if (totalElement) {
            totalElement.textContent = stats.totalSaves;
        }
        
        // Último guardado
        const lastTimeElement = document.getElementById('lastSaveTimeDisplay');
        if (lastTimeElement) {
            if (stats.lastSaveTime) {
                const fecha = new Date(stats.lastSaveTime);
                lastTimeElement.textContent = fecha.toLocaleTimeString('es-ES');
            } else {
                lastTimeElement.textContent = 'Nunca';
            }
        }
        
        // Botón toggle
        const toggleButton = document.getElementById('toggleButtonText');
        if (toggleButton) {
            toggleButton.textContent = stats.isInitialized ? '🛑 Desactivar' : '▶️ Activar';
        }
        
        // Estado BD
        if (typeof AutoSaveBDModule !== 'undefined') {
            const bdEstado = AutoSaveBDModule.obtenerEstado();
            
            const bdStatusBadge = document.getElementById('bdStatusBadge');
            if (bdStatusBadge) {
                const badgeColor = bdEstado.connectionStatus === 'online' 
                    ? '#22c55e' 
                    : bdEstado.connectionStatus === 'offline' 
                    ? '#ef4444' 
                    : '#f59e0b';
                const badgeText = bdEstado.connectionStatus === 'online'
                    ? 'CONECTADA'
                    : bdEstado.connectionStatus === 'offline'
                    ? 'SIN CONEXIÓN'
                    : 'VERIFICANDO';
                
                bdStatusBadge.style.color = badgeColor;
                bdStatusBadge.textContent = badgeText;
            }
            
            const bdSyncInfo = document.getElementById('bdSyncInfo');
            if (bdSyncInfo) {
                const lastSync = bdEstado.lastSync;
                const syncText = `
                    Último sync: ${lastSync} | 
                    Total syncs: ${bdEstado.syncCount} | 
                    Errores: ${bdEstado.errorCount}
                `;
                bdSyncInfo.textContent = syncText;
            }
        }
    }
    
    /**
     * Iniciar actualización automática cada 1 segundo
     */
    function iniciarActualizacionAutomatica() {
        if (state.updateInterval) {
            clearInterval(state.updateInterval);
        }
        
        state.updateInterval = setInterval(() => {
            if (state.isOpen) {
                actualizarVisualizacion();
            }
        }, 1000);
    }
    
    /**
     * Detener actualización automática
     */
    function detenerActualizacionAutomatica() {
        if (state.updateInterval) {
            clearInterval(state.updateInterval);
            state.updateInterval = null;
        }
    }
    
    // ========================================================================
    // MÉTODOS PÚBLICOS
    // ========================================================================
    
    return {
        /**
         * Inicializar el módulo
         */
        init: function() {
            console.log('🔄 Inicializando AutoSaveUIModule...');
            
            // 🗑️ AGRESIVAMENTE LIMPIAR TODOS los posibles modales antiguos
            const selectoresAntiguos = [
                '#modalAutoGuardado',
                '[id*="autoguard" i]',
                '[id*="autoSave" i]',
                '[id*="configuracion" i]'
            ];
            
            selectoresAntiguos.forEach(selector => {
                const elementos = document.querySelectorAll(selector);
                elementos.forEach(el => {
                    if (el.id !== 'modalAutoGuardado' || el.parentElement !== document.body) {
                        el.remove();
                        console.log(`🗑️ Removido elemento antiguo: ${selector}`);
                    }
                });
            });
            
            // Inyectar estilos
            inyectarEstilos();
            
            // Crear modal NUEVO
            const modal = crearEstructuraModal();
            document.body.appendChild(modal);
            console.log('✅ Modal AutoGuardado creado y agregado al DOM');
            
            // Cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.cerrarModal();
                }
            });
            
            console.log('✅ AutoSaveUIModule inicializado');
        },
        
        /**
         * Abrir el modal
         */
        abrirModal: function() {
            console.log('🔓 Abriendo modal AutoGuardado...');
            
            // Asegurar que el modal existe
            let modal = document.getElementById('modalAutoGuardado');
            if (!modal) {
                console.log('⚠️ Modal no existe, inicializando...');
                this.init();
                modal = document.getElementById('modalAutoGuardado');
            }
            
            if (!modal) {
                console.error('❌ Error: No se pudo crear el modal');
                return;
            }
            
            // Actualizar datos antes de mostrar
            actualizarVisualizacion();
            
            // Mostrar modal
            modal.classList.add('active');
            
            state.isOpen = true;
            iniciarActualizacionAutomatica();
            
            console.log('✅ Modal Auto-guardado abierto');
        },
        
        /**
         * Cerrar el modal
         */
        cerrarModal: function() {
            const modal = document.getElementById('modalAutoGuardado');
            if (modal) {
                modal.classList.remove('active');
            }
            
            state.isOpen = false;
            detenerActualizacionAutomatica();
            
            console.log('📖 Modal Auto-guardado cerrado');
        },
        
        /**
         * Forzar guardado inmediato
         */
        forzarGuardado: function() {
            if (typeof AutoSaveManager === 'undefined') {
                console.warn('⚠️ AutoSaveManager no disponible');
                return;
            }
            
            console.log('⚡ Forzando guardado desde UI...');
            AutoSaveManager.forceSave();
            
            // Actualizar visualización
            setTimeout(() => {
                actualizarVisualizacion();
            }, 500);
            
            // Notificación
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('💾 Cambios guardados manualmente', 'success', 2000);
            }
        },
        
        /**
         * Alternar auto-guardado (activar/desactivar)
         */
        alternarAutoGuardado: function() {
            if (typeof AutoSaveManager === 'undefined') {
                console.warn('⚠️ AutoSaveManager no disponible');
                return;
            }
            
            if (AutoSaveManager.isInitialized) {
                console.log('🛑 Desactivando auto-guardado...');
                AutoSaveManager.destroy();
                
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show('🛑 Auto-guardado DESACTIVADO', 'warning', 3000);
                }
            } else {
                console.log('▶️ Activando auto-guardado...');
                AutoSaveManager.init();
                
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show('✅ Auto-guardado ACTIVADO', 'success', 3000);
                }
            }
            
            // Actualizar UI
            setTimeout(() => {
                actualizarVisualizacion();
            }, 500);
        },
        
        /**
         * Obtener estado actual
         */
        obtenerEstado: function() {
            return obtenerEstadisticas();
        }
    };
    
})();

// ============================================================================
// REGISTRAR EN MODULEMANAGER
// ============================================================================

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('AutoSaveUI', AutoSaveUIModule);
    console.log('📦 AutoSaveUIModule registrado en ModuleManager');
}

// ============================================================================
// ASIGNAR A WINDOW
// ============================================================================

if (typeof window !== 'undefined') {
    window.AutoSaveUIModule = AutoSaveUIModule;
}

console.log('✅ AutoSaveUIModule cargado completamente');
