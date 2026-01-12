/**
 * 🗄️ AUTO-GUARDADO CON PERSISTENCIA BD
 * Integra AutoSaveManager con guardado en API/BD
 * 
 * @version 1.0.0
 * @date 4 de enero de 2026
 */

const AutoSaveBDModule = (function() {
    
    // ============================================================================
    // CONFIGURACIÓN
    // ============================================================================
    
    const config = {
        API_BASE_URL: 'http://localhost:5001',
        SYNC_INTERVAL_MS: 60000,  // Sincronizar con BD cada 60 segundos
        RETRIES: 3,
        RETRY_DELAY_MS: 2000,
        TIMEOUT_MS: 10000
    };
    
    // ============================================================================
    // ESTADO PRIVADO
    // ============================================================================
    
    const state = {
        isEnabled: true,
        isSyncingToBD: false,
        syncTimer: null,
        lastBDSync: null,
        bdSyncCount: 0,
        bdSyncErrors: [],
        connectionStatus: 'checking'  // checking | online | offline
    };
    
    // ============================================================================
    // FUNCIONES PRIVADAS
    // ============================================================================
    
    /**
     * Verificar si el servidor está disponible
     */
    function checkServerConnection() {
        console.log('🔍 BD: Verificando conexión con servidor...');
        
        return Promise.race([
            // Intentar conectar al endpoint de turnos (que sabemos que existe)
            fetch(`${config.API_BASE_URL}/api/turnos/1`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
                .then(res => {
                    // Cualquier respuesta (200, 404, etc) significa que el servidor responde
                    const ok = true; // El servidor está online si responde
                    state.connectionStatus = ok ? 'online' : 'offline';
                    console.log(`📡 BD: Estado de conexión = ${ok ? '✅ ONLINE' : '❌ OFFLINE'} (status: ${res.status})`);
                    return ok;
                })
                .catch(err => {
                    state.connectionStatus = 'offline';
                    console.warn(`⚠️ BD: Error de conexión:`, err.message);
                    return false;
                }),
            
            // Timeout de 5 segundos
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 5000)
            )
        ])
        .catch(err => {
            state.connectionStatus = 'offline';
            console.warn(`⚠️ BD: No se puede conectar al servidor (${err.message})`);
            return false;
        });
    }
    
    /**
     * Guardar turnos de UN empleado en BD
     */
    async function guardarEmpleadoEnBD(empleadoId, retryCount = 0) {
        try {
            if (!empleadoId) return false;
            
            // Obtener turnos del empleado desde AppState
            const turnos = AppState.scheduleData.get(empleadoId);
            if (!turnos || turnos.length === 0) {
                console.log(`⚠️ BD: No hay turnos para empleado ${empleadoId}`);
                return false;
            }
            
            // Obtener mes/año actual
            const mes = AppState.currentMonth;
            const anio = AppState.currentYear;
            
            // Preparar payload
            const payload = {
                mes,
                anio,
                turnos: turnos.map(turno => ({
                    dia: turno.dia,
                    turno: turno.turno,
                    horas: turno.horas,
                    fecha: turno.fecha,
                    esFinSemana: turno.esFinSemana,
                    descripcion: turno.descripcion
                }))
            };
            
            // Enviar a API
            const response = await fetch(`${config.API_BASE_URL}/api/turnos/${empleadoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                timeout: config.TIMEOUT_MS
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log(`✅ BD: Turnos de empleado ${empleadoId} guardados`);
            return true;
            
        } catch (error) {
            console.error(`❌ BD: Error guardando empleado ${empleadoId}:`, error.message);
            
            // Reintentar si no hemos superado límite
            if (retryCount < config.RETRIES) {
                console.log(`🔄 BD: Reintentando (${retryCount + 1}/${config.RETRIES})...`);
                await new Promise(resolve => setTimeout(resolve, config.RETRY_DELAY_MS));
                return guardarEmpleadoEnBD(empleadoId, retryCount + 1);
            }
            
            // Guardar error
            state.bdSyncErrors.push({
                empleadoId,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            
            return false;
        }
    }
    
    /**
     * Sincronizar TODOS los empleados con BD
     */
    async function sincronizarTodosConBD() {
        if (state.isSyncingToBD || !state.isEnabled) {
            return;
        }
        
        state.isSyncingToBD = true;
        
        try {
            // Verificar conexión primero
            const estaConectado = await checkServerConnection();
            
            if (!estaConectado) {
                console.warn('⚠️ BD: Servidor no disponible');
                state.isSyncingToBD = false;
                return;
            }
            
            console.log('🔄 BD: Iniciando sincronización con BD...');
            
            // Obtener lista de empleados
            const empleadosActivos = empleados.filter(e => e.estado === 'activo');
            
            let exitosos = 0;
            let fallidos = 0;
            
            // Guardar cada empleado
            for (const empleado of empleadosActivos) {
                const resultado = await guardarEmpleadoEnBD(empleado.id);
                if (resultado) {
                    exitosos++;
                } else {
                    fallidos++;
                }
            }
            
            state.lastBDSync = new Date();
            state.bdSyncCount++;
            
            const msg = `✅ BD Sincronizado: ${exitosos}/${empleadosActivos.length} empleados`;
            console.log(msg);
            
            // No notificar al usuario - sincronización silenciosa
            // (Solo notificar en errores o acciones manuales)
            
        } catch (error) {
            console.error('❌ BD: Error en sincronización:', error);
            
            // No notificar de errores en sincronización automática (modo silencioso)
            // Solo se registran en state.bdSyncErrors para debugging
        } finally {
            state.isSyncingToBD = false;
        }
    }
    
    /**
     * Integrar con AutoSaveManager
     * Extiende el save() original para incluir BD
     */
    function setupAutoSaveHook() {
        if (typeof AutoSaveManager === 'undefined') {
            console.warn('⚠️ AutoSaveManager no está disponible');
            return;
        }
        
        // Guardar referencia al save original
        const originalSave = AutoSaveManager.save;
        
        // Reemplazar con versión extendida
        AutoSaveManager.save = async function() {
            // Llamar save original (localStorage)
            originalSave.call(this);
            
            // Además, intentar guardar en BD
            if (state.isEnabled && state.connectionStatus === 'online') {
                syncronizarTodosConBD().catch(e => 
                    console.error('Error en hook BD:', e)
                );
            }
        };
    }
    
    // ============================================================================
    // API PÚBLICA
    // ============================================================================
    
    return {
        /**
         * Inicializar módulo
         */
        init: function() {
            console.log('🗄️ Inicializando AutoSaveBDModule...');
            
            // Verificar conexión inicial
            checkServerConnection().then(ok => {
                console.log(
                    ok 
                        ? '✅ BD: Servidor accesible' 
                        : '⚠️ BD: Servidor no disponible (usará localStorage como respaldo)'
                );
            });
            
            // Setup hook con AutoSaveManager
            setupAutoSaveHook();
            
            // Iniciar sincronización periódica con BD
            state.syncTimer = setInterval(() => {
                sincronizarTodosConBD().catch(e => 
                    console.error('Error en sincronización periódica:', e)
                );
            }, config.SYNC_INTERVAL_MS);
            
            // Guardar en BD cuando se cierra la pestaña
            window.addEventListener('beforeunload', () => {
                if (state.isEnabled && state.connectionStatus === 'online') {
                    console.log('💾 BD: Guardando datos antes de cerrar...');
                    navigator.sendBeacon(
                        `${config.API_BASE_URL}/api/turnos`,
                        JSON.stringify({
                            accion: 'backup_completo',
                            datos: AppState.scheduleData
                        })
                    );
                }
            });
            
            console.log('✅ AutoSaveBDModule inicializado');
        },
        
        /**
         * Obtener estado actual
         */
        obtenerEstado: function() {
            return {
                isEnabled: state.isEnabled,
                connectionStatus: state.connectionStatus,
                lastSync: state.lastBDSync ? state.lastBDSync.toLocaleTimeString('es-ES') : 'Nunca',
                syncCount: state.bdSyncCount,
                errorCount: state.bdSyncErrors.length,
                isSyncing: state.isSyncingToBD
            };
        },
        
        /**
         * Forzar sincronización inmediata
         */
        forzarSincronizacion: async function() {
            console.log('🔄 BD: Forzando sincronización...');
            await sincronizarTodosConBD();
        },
        
        /**
         * Activar/desactivar guardado en BD
         */
        alternarBD: function(habilitado) {
            state.isEnabled = habilitado;
            const msg = habilitado 
                ? '✅ Auto-guardado BD activado'
                : '🛑 Auto-guardado BD desactivado';
            console.log(msg);
            
            // Notificar cambio manual de estado (no es sync automático)
            if (typeof NotificationSystem !== 'undefined' && NotificationSystem.show) {
                NotificationSystem.show(msg, 'info', 1500);
            }
        },
        
        /**
         * Obtener errores de sincronización
         */
        obtenerErrores: function() {
            return state.bdSyncErrors;
        },
        
        /**
         * Limpiar errores
         */
        limpiarErrores: function() {
            state.bdSyncErrors = [];
        },
        
        /**
         * Destruir módulo (detener timers)
         */
        destroy: function() {
            if (state.syncTimer) {
                clearInterval(state.syncTimer);
            }
            console.log('🗄️ AutoSaveBDModule destruido');
        }
    };
})();

// ============================================================================
// EXPORTAR GLOBALMENTE
// ============================================================================

if (typeof window !== 'undefined') {
    window.AutoSaveBDModule = AutoSaveBDModule;
}

// ============================================================================
// REGISTRAR EN ModuleManager (si existe)
// ============================================================================

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('AutoSaveBDModule', AutoSaveBDModule);
    console.log('📦 AutoSaveBDModule registrado en ModuleManager');
}
