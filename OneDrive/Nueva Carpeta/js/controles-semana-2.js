/**
 * CONTROLES SEMANA 2 - Reportes, WhatsApp e Integración
 * Proporciona funciones para:
 * - GeneradorReportes: Generación de reportes mensuales
 * - IntegracionWhatsApp: Envío de mensajes WhatsApp
 * - SincronizacionDatos: Backup y sincronización
 */

// ============================================
// GENERADOR DE REPORTES (Semana 2)
// ============================================

function abrirReportes() {
    const modal = document.getElementById('modalSemana2') || crearModalSemana2();
    const titulo = document.getElementById('modalSemana2Title');
    const contenido = document.getElementById('modalSemana2Content');
    
    titulo.textContent = '📋 Generador de Reportes';
    
    try {
        if (typeof GeneradorReportes === 'undefined') {
            contenido.innerHTML = '<p style="color: red;">❌ GeneradorReportes no está cargado</p>';
            modal.classList.add('active');
            return;
        }
        
        let html = `
            <h3 style="margin: 0 0 15px 0; color: #333;">📊 Tipos de Reportes Disponibles</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; cursor: pointer;" onclick="generarReporteMensual()">
                    <div style="font-weight: bold; color: #333; margin-bottom: 8px;">📅 Reporte Mensual</div>
                    <div style="color: #666; font-size: 12px; margin-bottom: 10px;">Análisis completo del mes actual</div>
                    <div style="background: #eff6ff; color: #0284c7; padding: 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-align: center; cursor: pointer;">
                        ▶ Generar
                    </div>
                </div>
                
                <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; cursor: pointer;" onclick="generarReporteEmpleados()">
                    <div style="font-weight: bold; color: #333; margin-bottom: 8px;">👥 Reportes Individuales</div>
                    <div style="color: #666; font-size: 12px; margin-bottom: 10px;">Análisis por empleado del mes</div>
                    <div style="background: #f0fdf4; color: #16a34a; padding: 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-align: center; cursor: pointer;">
                        ▶ Generar
                    </div>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">💡 Información de Reportes</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #3b82f6;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">📅 Mensual Incluye:</div>
                        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #666;">
                            <li>Resumen de ocupación</li>
                            <li>Distribución de turnos</li>
                            <li>Cumplimiento de horas</li>
                            <li>Estadísticas por turno</li>
                            <li>Análisis de conflictos</li>
                        </ul>
                    </div>
                    <div style="padding: 12px; background: white; border-radius: 6px; border-left: 3px solid #10b981;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">👥 Individual Incluye:</div>
                        <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #666;">
                            <li>Turnos asignados</li>
                            <li>Horas trabajadas</li>
                            <li>Porcentaje descanso</li>
                            <li>Análisis de patrón</li>
                            <li>Tendencias mensuales</li>
                        </ul>
                    </div>
                </div>
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
// INTEGRACIÓN WHATSAPP (Semana 2)
// ============================================

function abrirWhatsApp() {
    const modal = document.getElementById('modalSemana2') || crearModalSemana2();
    const titulo = document.getElementById('modalSemana2Title');
    const contenido = document.getElementById('modalSemana2Content');
    
    titulo.textContent = '💬 Integración WhatsApp';
    
    try {
        if (typeof IntegracionWhatsApp === 'undefined') {
            contenido.innerHTML = '<p style="color: red;">❌ IntegracionWhatsApp no está cargada</p>';
            modal.classList.add('active');
            return;
        }
        
        let html = `
            <h3 style="margin: 0 0 15px 0; color: #333;">📱 Enviar Mensajes WhatsApp</h3>
            
            <div style="background: #d4f8e8; color: #065f46; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #10b981;">
                <div style="font-weight: bold; margin-bottom: 5px;">✅ Configuración Lista</div>
                <div style="font-size: 12px;">Puedes enviar notificaciones de turnos por WhatsApp</div>
            </div>
            
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📋 Empleados Disponibles</h3>
                
                <div style="max-height: 300px; overflow-y: auto;">
                    ${empleados && empleados.length > 0 ? empleados.map(emp => `
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: bold; color: #333;">${emp.nombre}</div>
                                <div style="font-size: 12px; color: #666;">📱 ${emp.telefono || 'Sin teléfono'}</div>
                            </div>
                            <button onclick="enviarMensajeWhatsApp(${emp.id}, '${emp.nombre}')" style="background: #22c55e; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px;">
                                Enviar
                            </button>
                        </div>
                    `).join('') : '<p style="color: #666;">No hay empleados registrados</p>'}
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">💡 Funcionalidades</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="padding: 12px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">📤 Notificaciones</div>
                        <div style="font-size: 12px; color: #666;">Envía confirmación de turnos asignados</div>
                    </div>
                    <div style="padding: 12px; background: white; border-radius: 6px;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">📝 Cambios</div>
                        <div style="font-size: 12px; color: #666;">Comunica cambios de último momento</div>
                    </div>
                </div>
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
// SINCRONIZACIÓN Y BACKUP (Semana 2)
// ============================================

function abrirBackup() {
    const modal = document.getElementById('modalSemana2') || crearModalSemana2();
    const titulo = document.getElementById('modalSemana2Title');
    const contenido = document.getElementById('modalSemana2Content');
    
    titulo.textContent = '💾 Gestión de Backup';
    
    try {
        // Obtener referencia al módulo (primero desde ModuleManager, luego globalmente)
        const backupMgr = (typeof ModuleManager !== 'undefined' && ModuleManager.get('BackupManager')) 
                          || window.BackupManagerModule;
        
        if (!backupMgr) {
            console.error('[abrirBackup] BackupManager no disponible', {
                ModuleManager: typeof ModuleManager,
                BackupManagerModule: typeof window.BackupManagerModule
            });
            contenido.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
                    <strong>❌ Error:</strong> BackupManager no está cargado<br>
                    <small>Recarga la página o verifica la consola</small>
                </div>
            `;
            modal.classList.add('active');
            return;
        }

        // Validar dependencias del módulo
        if (!backupMgr.validarDependencias?.()) {
            console.warn('[abrirBackup] BackupManager dice que faltan dependencias');
            contenido.innerHTML = `
                <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px;">
                    <strong>⚠️ Advertencia:</strong> BackupManager tiene dependencias faltantes<br>
                    <small>Algunas funciones no estarán disponibles</small>
                </div>
            `;
            modal.classList.add('active');
            return;
        }

        // Obtener estado actual
        const estado = backupMgr.obtenerEstadoActual();
        const validacion = backupMgr.validarIntegridad();
        
        let html = `
            <!-- ESTADO GENERAL -->
            <div style="background: #f0f9ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; font-size: 16px; color: #333;">🔄 Estado de Sincronización</div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">
                            ${estado && estado.sincronizacionActiva ? '✅ ACTIVO' : '⚠️ INACTIVO'}
                            ${estado && estado.ultimoSync ? ' | Última: ' + new Date(estado.ultimoSync).toLocaleTimeString() : ''}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 20px; margin-bottom: 5px;">
                            ${validacion && validacion.memoriaValida && validacion.backupValido ? '✅' : '⚠️'}
                        </div>
                        <div style="color: #666; font-size: 11px;">
                            ${validacion && validacion.resumenGral}
                        </div>
                    </div>
                </div>
            </div>

            <!-- ESTADÍSTICAS -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="color: #666; font-size: 12px; margin-bottom: 5px;">SINCRONIZACIONES</div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${estado && estado.totalSyncs ? estado.totalSyncs : 0}</div>
                    <div style="color: #666; font-size: 11px; margin-top: 5px;">
                        ✅ ${estado && estado.syncsExitosos ? estado.syncsExitosos : 0} | ❌ ${estado && estado.syncsFallidos ? estado.syncsFallidos : 0}
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="color: #666; font-size: 12px; margin-bottom: 5px;">PRÓXIMO SYNC</div>
                    <div style="font-size: 18px; font-weight: bold; color: #22c55e;">
                        ${estado && estado.proximoSync ? estado.proximoSync : 'N/A'}
                    </div>
                    <div style="color: #666; font-size: 11px; margin-top: 5px;">tiempo restante</div>
                </div>
            </div>

            <!-- BACKUP ACTUAL -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; color: #333; margin-bottom: 12px;">💾 Backup Actual</div>
                ${estado && estado.backup && estado.backup.existe ? 
                    `<div style="background: white; padding: 12px; border-radius: 6px; border-left: 3px solid #10b981;">
                        <div style="font-weight: bold; color: #333; margin-bottom: 5px;">✅ Backup Disponible</div>
                        <div style="color: #666; font-size: 12px; margin: 3px 0;">
                            📅 Fecha: ${estado.backup.timestamp ? new Date(estado.backup.timestamp).toLocaleString() : 'N/A'}
                        </div>
                        <div style="color: #666; font-size: 12px; margin: 3px 0;">
                            📦 Tamaño: ${estado.backup.tamañoFormateado || (backupMgr.formatearBytes ? backupMgr.formatearBytes(estado.backup.tamaño || 0) : '0 B')}
                        </div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">
                            🔹 Versión: v${estado.backup.version || '2.0.0'}
                        </div>
                    </div>`
                    :
                    `<div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 12px; border-radius: 6px;">
                        <div style="color: #92400e; font-size: 13px;">
                            ⚠️ Sin backup disponible
                        </div>
                    </div>`
                }
            </div>

            <!-- ACCIONES -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <button onclick="crearBackupAhora()" 
                        style="background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;"
                        onmouseover="this.style.background='#2563eb'; this.style.transform='scale(1.02)';"
                        onmouseout="this.style.background='#3b82f6'; this.style.transform='scale(1)';">
                    💾 Crear Backup Ahora
                </button>

                <button onclick="restaurarBackup()" 
                        style="background: #f59e0b; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.3s ease;"
                        onmouseover="this.style.background='#d97706'; this.style.transform='scale(1.02)';"
                        onmouseout="this.style.background='#f59e0b'; this.style.transform='scale(1)';">
                    🔄 Restaurar Backup
                </button>
            </div>

            <!-- MÁS ACCIONES -->
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <button onclick="descargarBackupJSON()" 
                        style="background: #10b981; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.3s ease; margin-bottom: 10px;"
                        onmouseover="this.style.background='#059669'; this.style.transform='scale(1.02)';"
                        onmouseout="this.style.background='#10b981'; this.style.transform='scale(1)';">
                    ⬇️ Descargar Backup (JSON)
                </button>

                <button onclick="validarIntegridad()" 
                        style="background: #8b5cf6; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.3s ease;"
                        onmouseover="this.style.background='#7c3aed'; this.style.transform='scale(1.02)';"
                        onmouseout="this.style.background='#8b5cf6'; this.style.transform='scale(1)';">
                    🔍 Validar Integridad
                </button>
            </div>

            <!-- INFORMACIÓN -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; color: #92400e; font-size: 12px;">
                <div style="font-weight: bold; margin-bottom: 8px;">💡 Información</div>
                <ul style="margin: 0; padding-left: 20px;">
                    <li style="margin: 5px 0;">Backup automático cada 5 minutos</li>
                    <li style="margin: 5px 0;">Sincronización local en localStorage</li>
                    <li style="margin: 5px 0;">Puedes restaurar el último backup disponible</li>
                    <li style="margin: 5px 0;">Descarga JSON para resguardo externo</li>
                    <li style="margin: 5px 0;">Validación de integridad automática</li>
                </ul>
            </div>
        `;
        
        contenido.innerHTML = html;
        modal.classList.add('active');
        
    } catch (e) {
        contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
            <strong>❌ Error:</strong> ${e.message}
        </div>`;
        modal.classList.add('active');
        console.error('[abrirBackup]', e);
    }
}

// ============================================
// FUNCIONES AUXILIARES (Semana 2)
// ============================================

function generarReporteMensual() {
    alert('📊 Generando reporte mensual...\n\nEsta funcionalidad abrirá un PDF con el análisis completo del mes.');
}

function generarReporteEmpleados() {
    alert('👥 Generando reportes individuales...\n\nEsta funcionalidad generará reportes para cada empleado.');
}

function enviarMensajeWhatsApp(empleadoId, nombre) {
    // Delegra a módulo WhatsAppSender registrado en ModuleManager
    try {
        // Obtener módulo desde ModuleManager si está disponible
        const whatsAppModule = (typeof ModuleManager !== 'undefined' && ModuleManager.get('WhatsAppSender')) 
            || window.WhatsAppSenderModule;
        
        if (!whatsAppModule) {
            NotificationSystem.show('❌ WhatsAppSender no está cargado', 'error');
            console.error('WhatsAppSender no disponible en ModuleManager o globalmente');
            return;
        }

        whatsAppModule.enviarMensajeEmpleado(empleadoId, nombre, {
            tipo: 'confirmacion',
            dia: new Date().getDate()
        });
    } catch (error) {
        NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
        console.error('[enviarMensajeWhatsApp]', error);
    }
}

// ============================================
// FUNCIONES PARA BOTONES DE BACKUP
// ============================================

function crearBackupAhora() {
    try {
        const backupMgr = (typeof ModuleManager !== 'undefined' && ModuleManager.get('BackupManager')) 
                          || window.BackupManagerModule;
        
        if (!backupMgr) {
            NotificationSystem.show('❌ BackupManager no disponible', 'error');
            console.error('[crearBackupAhora] BackupManager no encontrado');
            return;
        }

        if (typeof backupMgr.crearBackupAhora !== 'function') {
            NotificationSystem.show('❌ Método crearBackupAhora no existe', 'error');
            console.error('[crearBackupAhora] Método no es función');
            return;
        }

        console.log('[crearBackupAhora] Ejecutando...');
        const resultado = backupMgr.crearBackupAhora();
        
        if (resultado && resultado.exito) {
            // Recargar el modal para mostrar el nuevo backup
            setTimeout(() => {
                abrirBackup();
            }, 800);
        }

    } catch (error) {
        NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
        console.error('[crearBackupAhora]', error);
    }
}

function restaurarBackup() {
    try {
        const backupMgr = (typeof ModuleManager !== 'undefined' && ModuleManager.get('BackupManager')) 
                          || window.BackupManagerModule;
        
        if (!backupMgr) {
            NotificationSystem.show('❌ BackupManager no disponible', 'error');
            console.error('[restaurarBackup] BackupManager no encontrado');
            return;
        }

        if (typeof backupMgr.restaurarBackup !== 'function') {
            NotificationSystem.show('❌ Método restaurarBackup no existe', 'error');
            console.error('[restaurarBackup] Método no es función');
            return;
        }

        console.log('[restaurarBackup] Ejecutando...');
        backupMgr.restaurarBackup();

    } catch (error) {
        NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
        console.error('[restaurarBackup]', error);
    }
}

function descargarBackupJSON() {
    try {
        const backupMgr = (typeof ModuleManager !== 'undefined' && ModuleManager.get('BackupManager')) 
                          || window.BackupManagerModule;
        
        if (!backupMgr) {
            NotificationSystem.show('❌ BackupManager no disponible', 'error');
            console.error('[descargarBackupJSON] BackupManager no encontrado');
            return;
        }

        if (typeof backupMgr.descargarBackupJSON !== 'function') {
            NotificationSystem.show('❌ Método descargarBackupJSON no existe', 'error');
            console.error('[descargarBackupJSON] Método no es función');
            return;
        }

        console.log('[descargarBackupJSON] Ejecutando...');
        backupMgr.descargarBackupJSON();

    } catch (error) {
        NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
        console.error('[descargarBackupJSON]', error);
    }
}

function validarIntegridad() {
    try {
        const backupMgr = (typeof ModuleManager !== 'undefined' && ModuleManager.get('BackupManager')) 
                          || window.BackupManagerModule;
        
        if (!backupMgr) {
            NotificationSystem.show('❌ BackupManager no disponible', 'error');
            console.error('[validarIntegridad] BackupManager no encontrado');
            return;
        }

        if (typeof backupMgr.validarIntegridad !== 'function') {
            NotificationSystem.show('❌ Método validarIntegridad no existe', 'error');
            console.error('[validarIntegridad] Método no es función');
            return;
        }

        console.log('[validarIntegridad] Ejecutando...');
        const resultado = backupMgr.validarIntegridad();
        console.log('Resultado validación:', resultado);
        
        if (resultado) {
            NotificationSystem.show(`✅ Validación completada:\n${resultado.resumenGral}`, 'success');
        }

    } catch (error) {
        NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
        console.error('[validarIntegridad]', error);
    }
}

// ============================================
// CREAR MODAL (Semana 2)
// ============================================

function crearModalSemana2() {
    const modal = document.createElement('div');
    modal.id = 'modalSemana2';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>
                <span id="modalSemana2Title">📊 Panel Semana 2</span>
                <button class="close-btn" onclick="document.getElementById('modalSemana2').classList.remove('active')" title="Cerrar">&times;</button>
            </h2>
            
            <div id="modalSemana2Content" class="modal-body">
                <!-- Contenido dinámico aquí -->
            </div>
            
            <div class="modal-footer">
                <button class="modal-btn secondary" onclick="document.getElementById('modalSemana2').classList.remove('active')">Cerrar</button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('modalSemana2')) {
        document.body.appendChild(modal);
    }
    return modal;
}
