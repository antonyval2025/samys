/**
 * CONTROLES SEMANA 1 - Validación, Autoguardado y Sincronización
 * Proporciona funciones para:
 * - ValidadorDatos: Valida integridad de datos
 * - AutoSaveManager: Autoguardado automático
 * - TabSyncManager: Sincronización entre pestañas
 */

// Variable global para mantener dashboard de sync activo
let dashboardSyncActivo = false;
let intervaloActualizacionSync = null;

// ============================================
// VALIDAR INTEGRIDAD DE DATOS (Semana 1)
// ============================================

function abrirValidacion() {
    const modal = document.getElementById('modalSemana1') || crearModalSemana1();
    const titulo = document.getElementById('modalSemana1Title');
    const contenido = document.getElementById('modalSemana1Content');
    
    titulo.textContent = '✅ Validación de Datos';
    
    try {
        if (typeof ValidadorDatos === 'undefined') {
            contenido.innerHTML = '<p style="color: red;">❌ ValidadorDatos no está cargado</p>';
            modal.classList.add('active');
            return;
        }
        
        let html = `<h3 style="margin: 0 0 15px 0; color: #333;">🔍 Verificación de Integridad</h3>`;
        
        let erroresEncontrados = 0;
        let advertenciasEncontradas = 0;
        
        if (empleados && empleados.length > 0) {
            html += `<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">`;
            
            empleados.forEach((emp, idx) => {
                const validacion = ValidadorDatos.validarEmpleado(emp);
                
                if (!validacion.valido) {
                    erroresEncontrados++;
                    html += `
                        <div style="background: #f8d7da; color: #721c24; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #dc2626;">
                            <div style="font-weight: bold;">❌ ${emp.nombre} (ID: ${emp.id})</div>
                            <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                ${validacion.errores.map(e => `<li style="font-size: 12px;">${e}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                } else {
                    if (validacion.warnings && validacion.warnings.length > 0) {
                        advertenciasEncontradas++;
                        html += `
                            <div style="background: #fff3cd; color: #856404; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #ffc107;">
                                <div style="font-weight: bold;">⚠️ ${emp.nombre} (ID: ${emp.id})</div>
                                <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                                    ${validacion.warnings.map(w => `<li style="font-size: 12px;">${w}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else {
                        html += `
                            <div style="background: #d4edda; color: #155724; padding: 12px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #22c55e;">
                                <div style="font-weight: bold;">✅ ${emp.nombre} (ID: ${emp.id})</div>
                                <div style="font-size: 12px; margin-top: 5px;">Datos válidos y completos</div>
                            </div>
                        `;
                    }
                }
            });
            
            html += `</div>`;
            
            html += `
                <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">📊 Resumen</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                        <div style="background: white; padding: 12px; border-radius: 6px; text-align: center; border-left: 4px solid #22c55e;">
                            <div style="font-size: 20px; font-weight: bold; color: #22c55e;">${empleados.length - erroresEncontrados}</div>
                            <div style="color: #666; font-size: 12px;">Empleados Válidos</div>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 6px; text-align: center; border-left: 4px solid #ffc107;">
                            <div style="font-size: 20px; font-weight: bold; color: #ffc107;">${advertenciasEncontradas}</div>
                            <div style="color: #666; font-size: 12px;">Con Advertencias</div>
                        </div>
                        <div style="background: white; padding: 12px; border-radius: 6px; text-align: center; border-left: 4px solid #dc2626;">
                            <div style="font-size: 20px; font-weight: bold; color: #dc2626;">${erroresEncontrados}</div>
                            <div style="color: #666; font-size: 12px;">Con Errores</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            html = '<div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px;">⚠️ No hay empleados para validar. Crea empleados primero.</div>';
        }
        
        contenido.innerHTML = html;
        modal.classList.add('active');
        
    } catch (e) {
        contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
            <strong>❌ Error:</strong> ${e.message}
        </div>`;
        modal.classList.add('active');
    }
}

// ============================================
// ESTADO DE AUTOGUARDADO (Semana 1)
// ============================================

function abrirAutoGuardado() {
    const modal = document.getElementById('modalSemana1') || crearModalSemana1();
    const titulo = document.getElementById('modalSemana1Title');
    const contenido = document.getElementById('modalSemana1Content');
    
    titulo.textContent = '💾 Estado de Autoguardado';
    
    try {
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">🔄 Autoguardado Automático</h3>
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <div style="font-weight: bold; color: #333;">Estado</div>
                            <div style="color: #666; font-size: 12px;">El sistema guarda automáticamente cada 30 segundos</div>
                        </div>
                        <div style="background: #22c55e; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold;">
                            ✅ ACTIVO
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">💡 Características</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">⏱️ Intervalo</div>
                        <div style="color: #666; font-size: 13px;">Cada 30 segundos sin cambios pendientes</div>
                    </div>
                    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">📊 Scope</div>
                        <div style="color: #666; font-size: 13px;">Turnos, empleados, configuración</div>
                    </div>
                    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">💾 Almacenamiento</div>
                        <div style="color: #666; font-size: 13px;">localStorage del navegador</div>
                    </div>
                    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">🔔 Notificación</div>
                        <div style="color: #666; font-size: 13px;">Notificación visual silenciosa</div>
                    </div>
                </div>
            </div>
            
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px;">
                <div style="font-weight: bold; margin-bottom: 5px;">✅ Datos Guardados</div>
                <div style="font-size: 12px;">Tus cambios se guardan automáticamente sin intervención</div>
            </div>
        `;
        
        contenido.innerHTML = html;
        modal.classList.add('active');
        
    } catch (e) {
        contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
            <strong>❌ Error:</strong> ${e.message}
        </div>`;
        modal.classList.add('active');
    }
}

// ============================================
// SINCRONIZACIÓN ENTRE PESTAÑAS (Semana 1)
// ============================================

function abrirSincronizacion() {
    try {
        if (typeof TabSyncManager === 'undefined') {
            NotificationSystem.show('⚠️ TabSyncManager no disponible', 'error');
            return;
        }
        
        const stats = TabSyncManager.getStats();
        const otherTabs = TabSyncManager.detectOtherTabs();
        
        // Mostrar notificación rápida de estado (desaparece en 3s)
        const mensaje = `🔄 Sync Activo | ${otherTabs.length} otra${otherTabs.length !== 1 ? 's' : ''} pestaña${otherTabs.length !== 1 ? 's' : ''} | ${stats.sincronizacionesTotales || 0} cambios`;
        NotificationSystem.show(mensaje, 'info');
        
        // Solo mostrar modal si hay error o problema
        if (!stats || stats.sincronizacionesTotales === undefined) {
            const modal = document.getElementById('modalSemana1') || crearModalSemana1();
            const titulo = document.getElementById('modalSemana1Title');
            const contenido = document.getElementById('modalSemana1Content');
            
            titulo.textContent = '🔄 Estado de Sincronización';
            contenido.innerHTML = `
                <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
                            <div style="color: #666; font-size: 11px; margin-bottom: 5px;">ESTADO</div>
                            <div style="font-weight: bold; color: #10b981; font-size: 16px;">✅ ACTIVO</div>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 6px;">
                            <div style="color: #666; font-size: 11px; margin-bottom: 5px;">OTRAS PESTAÑAS</div>
                            <div style="font-weight: bold; color: #3b82f6; font-size: 16px;">${otherTabs.length}</div>
                        </div>
                    </div>
                    <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #10b981;">
                        <div style="font-size: 13px; color: #333;">
                            ✅ La sincronización está funcionando en segundo plano de forma automática.
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 8px;">
                            Los cambios en esta pestaña se sincronizan automáticamente a través de localStorage.
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
            
            // Auto-cerrar después de 5 segundos
            setTimeout(() => {
                modal.classList.remove('active');
            }, 5000);
        }
        
    } catch (e) {
        NotificationSystem.show('❌ Error en sincronización: ' + e.message, 'error');
    }
}

// ============================================
// CREAR MODAL (Semana 1)
// ============================================

function crearModalSemana1() {
    const modal = document.createElement('div');
    modal.id = 'modalSemana1';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>
                <span id="modalSemana1Title">📊 Panel de Validación</span>
                <button class="close-btn" onclick="document.getElementById('modalSemana1').classList.remove('active')" title="Cerrar">&times;</button>
            </h2>
            
            <div id="modalSemana1Content" class="modal-body">
                <!-- Contenido dinámico aquí -->
            </div>
            
            <div class="modal-footer">
                <button class="modal-btn secondary" onclick="document.getElementById('modalSemana1').classList.remove('active')">Cerrar</button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('modalSemana1')) {
        document.body.appendChild(modal);
    }
    return modal;
}
