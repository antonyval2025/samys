/**
 * ✅ SINCRONIZACIÓN DE DATOS - Semana 2
 * Backup automático y sincronización de datos en nube
 * Soporte para múltiples endpoints (localStorage, servidor)
 * 
 * @version 2.0.0
 * @date 2 de enero de 2026
 */

class SincronizacionDatos {
    static isInitialized = false;
    static syncInterval = null;
    static lastSync = null;
    static syncHistory = [];
    static maxHistorial = 100;
    
    // Configuración de sincronización
    static CONFIG = {
        SYNC_INTERVAL_MS: 30000, // 30 segundos (menos frecuente)
        BACKUP_INTERVAL_MS: 600000, // 10 minutos (menos frecuente)
        MAX_RETRIES: 3,
        TIMEOUT_MS: 10000,
        SILENT_MODE: true, // Sincronización silenciosa sin notificaciones
        ENDPOINTS: {
            LOCAL: 'localStorage',
            CLOUD: 'https://api.example.com/sync' // Placeholder
        }
    };

    /**
     * Inicializar sincronización automática
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ SincronizacionDatos ya fue inicializado');
            return;
        }

        console.log('☁️ Inicializando SincronizacionDatos...');

        // Iniciar sincronización periódica
        this.iniciarSincronizacionPeriodica();

        // Escuchar cambios en localStorage (otra pestaña)
        window.addEventListener('storage', (event) => {
            this.manejarCambioStorage(event);
        });

        // Crear backup inicial
        this.crearBackupLocal();

        this.isInitialized = true;
        console.log('✅ SincronizacionDatos inicializado');
    }

    /**
     * Iniciar sincronización periódica - Solo con cambios
     */
    static iniciarSincronizacionPeriodica() {
        this.syncInterval = setInterval(() => {
            // Solo sincronizar si hay cambios pendientes
            if (typeof AppState !== 'undefined' && AppState.cambiosPendientes && AppState.cambiosPendientes.length > 0) {
                this.sincronizar('silent');
            }
        }, this.CONFIG.SYNC_INTERVAL_MS);

        console.log(`📅 Sincronización automática cada ${this.CONFIG.SYNC_INTERVAL_MS / 1000}s (solo con cambios)`);
    }

    /**
     * Detener sincronización periódica
     */
    static detenerSincronizacionPeriodica() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
            console.log('⏸️ Sincronización periódica detenida');
        }
    }

    /**
     * Sincronizar datos del app
     * @param {string|Object} opciones - 'silent' para modo silencioso o {destino, datos, silent}
     * @returns {Object} {exito: bool, mensaje: string}
     */
    static sincronizar(opciones = {}) {
        const inicio = performance.now();
        
        // Permitir pasar 'silent' como string directamente
        const silent = opciones === 'silent' ? true : opciones.silent || this.CONFIG.SILENT_MODE;
        const destino = (typeof opciones === 'object' && opciones.destino) || 'LOCAL';
        
        if (!silent) {
            console.log(`🔄 Iniciando sincronización a ${destino}...`);
        }

        try {
            const datosAEnviar = (typeof opciones === 'object' && opciones.datos) || this.recopilarDatos();

            if (destino === 'LOCAL') {
                const resultado = this.sincronizarLocal(datosAEnviar, inicio, silent);
                return resultado;
            } else if (destino === 'CLOUD') {
                return this.sincronizarCloud(datosAEnviar, inicio);
            }

            return { exito: false, error: 'Destino desconocido: ' + destino };
        } catch (error) {
            if (!silent) {
                console.error('❌ Error durante sincronización:', error);
            }
            return { 
                exito: false, 
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Sincronizar datos localmente (localStorage)
     * @private
     */
    static sincronizarLocal(datos, inicio, silent = false) {
        try {
            // Guardar en localStorage
            localStorage.setItem('turnosAppState_BACKUP', JSON.stringify({
                datos: datos,
                timestamp: new Date().toISOString(),
                version: '2.0.0'
            }));

            const tiempo = (performance.now() - inicio).toFixed(1);
            const registro = {
                timestamp: new Date().toISOString(),
                destino: 'LOCAL',
                estado: 'EXITO',
                tiempo: tiempo,
                bytes: JSON.stringify(datos).length
            };

            this.registrarSync(registro);

            this.lastSync = new Date();
            
            if (!silent) {
                console.log(`✅ Sincronización LOCAL completada en ${tiempo}ms`);
            }

            return {
                exito: true,
                destino: 'LOCAL',
                bytes: registro.bytes,
                tiempo: tiempo,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            const registro = {
                timestamp: new Date().toISOString(),
                destino: 'LOCAL',
                estado: 'FALLO',
                error: error.message
            };
            this.registrarSync(registro);
            
            if (!silent) {
                console.error('❌ Error en sincronización LOCAL:', error);
            }
            return { exito: false, error: error.message };
        }
    }

    /**
     * Sincronizar datos a la nube
     * @private
     */
    static sincronizarCloud(datos, inicio) {
        // Nota: Esta es una implementación placeholder para futura API en nube
        console.log('☁️ Sincronización CLOUD no configurada (placeholder)');
        
        const registro = {
            timestamp: new Date().toISOString(),
            destino: 'CLOUD',
            estado: 'NO_CONFIGURADO',
            mensaje: 'API de nube no disponible en demostración'
        };

        this.registrarSync(registro);

        return {
            exito: false,
            destino: 'CLOUD',
            error: 'API no configurada',
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Recopilar todos los datos del app para sincronizar
     * @private
     */
    static recopilarDatos() {
        // Guards para variables globales
        if (typeof empleados === 'undefined' || !empleados) {
            empleados = [];
        }
        if (typeof AppState === 'undefined' || !AppState) {
            return { empleados: [], scheduleData: {}, currentMonth: 0, currentYear: 2026, cambiosPendientes: [] };
        }

        return {
            empleados: empleados,
            scheduleData: this.convertMapToObject(AppState.scheduleData),
            currentMonth: AppState.currentMonth,
            currentYear: AppState.currentYear,
            cambiosPendientes: AppState.cambiosPendientes,
            metadata: {
                appVersion: '10.3',
                lastModified: new Date().toISOString(),
                userAgent: navigator.userAgent
            }
        };
    }

    /**
     * Convertir Map a Object (para JSON.stringify)
     * @private
     */
    static convertMapToObject(map) {
        const obj = {};
        if (map && typeof map.entries === 'function') {
            for (const [key, value] of map.entries()) {
                obj[key] = value;
            }
        }
        return obj;
    }

    /**
     * Crear backup local
     */
    static crearBackupLocal() {
        const resultado = this.sincronizar({ destino: 'LOCAL' });
        
        if (resultado.exito) {
            console.log('💾 Backup local creado exitosamente');
        }

        return resultado;
    }

    /**
     * Restaurar desde backup local
     * @returns {Object} {exito: bool, datosRestaurados: Object}
     */
    static restaurarDesdeBackupLocal() {
        try {
            const backup = localStorage.getItem('turnosAppState_BACKUP');
            
            if (!backup) {
                return { 
                    exito: false, 
                    error: 'No hay backup disponible',
                    timestamp: new Date().toISOString()
                };
            }

            const { datos, timestamp, version } = JSON.parse(backup);

            console.log(`🔄 Restaurando backup de ${timestamp} (v${version})`);

            // Restaurar empleados
            if (datos.empleados && Array.isArray(datos.empleados)) {
                window.empleados = datos.empleados;
            }

            // Restaurar schedule data
            if (datos.scheduleData && typeof datos.scheduleData === 'object') {
                const scheduleMap = new Map();
                for (const [key, value] of Object.entries(datos.scheduleData)) {
                    scheduleMap.set(parseInt(key), value);
                }
                AppState.scheduleData = scheduleMap;
            }

            console.log('✅ Datos restaurados desde backup local');

            return {
                exito: true,
                datosRestaurados: datos,
                versionBackup: version,
                fechaBackup: timestamp,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.error('❌ Error restaurando backup:', error);
            return { 
                exito: false, 
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Manejar cambios en localStorage (otra pestaña)
     * @private
     */
    static manejarCambioStorage(event) {
        if (event.key === 'turnosAppState_BACKUP' && event.newValue) {
            console.log('📥 Detectado cambio en backup desde otra pestaña');
            
            const registro = {
                timestamp: new Date().toISOString(),
                evento: 'CAMBIO_STORAGE_DETECTADO',
                origen: 'OTRA_PESTAÑA',
                clave: event.key
            };

            this.registrarSync(registro);
        }
    }

    /**
     * Obtener resumen de sincronización
     * @returns {Object} Estadísticas de sync
     */
    static obtenerEstadoSync() {
        const syncsExitosos = this.syncHistory.filter(s => s.estado === 'EXITO').length;
        const syncsFallidos = this.syncHistory.filter(s => s.estado === 'FALLO').length;
        const bytesTotales = this.syncHistory
            .filter(s => s.bytes)
            .reduce((sum, s) => sum + s.bytes, 0);

        return {
            isInitialized: this.isInitialized,
            lastSync: this.lastSync,
            totalSyncs: this.syncHistory.length,
            syncsExitosos: syncsExitosos,
            syncsFallidos: syncsFallidos,
            bytesTotalesSync: bytesTotales,
            ultimosSyncs: this.syncHistory.slice(-5),
            proximoSyncEn: this.obtenerProximoSyncMs()
        };
    }

    /**
     * Calcular próximo sync en ms
     * @private
     */
    static obtenerProximoSyncMs() {
        if (!this.lastSync) return this.CONFIG.SYNC_INTERVAL_MS;
        
        const ahora = new Date();
        const proximoSync = new Date(this.lastSync.getTime() + this.CONFIG.SYNC_INTERVAL_MS);
        const msRestantes = proximoSync.getTime() - ahora.getTime();

        return Math.max(0, msRestantes);
    }

    /**
     * Registrar evento de sincronización
     * @private
     */
    static registrarSync(evento) {
        this.syncHistory.push(evento);

        // Mantener historial limitado
        if (this.syncHistory.length > this.maxHistorial) {
            this.syncHistory = this.syncHistory.slice(-this.maxHistorial);
        }
    }

    /**
     * Limpiar historial de sincronización
     */
    static limpiarHistorial() {
        const cantidad = this.syncHistory.length;
        this.syncHistory = [];
        console.log(`🗑️ Historial limpiado (${cantidad} registros)`);
        return { registrosLimpios: cantidad, timestamp: new Date().toISOString() };
    }

    /**
     * Validar datos antes de sincronizar
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarDatos() {
        const errores = [];

        if (typeof AppState === 'undefined') {
            errores.push('AppState no disponible');
        }

        if (!Array.isArray(empleados)) {
            errores.push('Datos de empleados inválidos');
        }

        if (!(AppState.scheduleData instanceof Map) && typeof AppState.scheduleData !== 'object') {
            errores.push('Datos de schedule inválidos');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Obtener información detallada de sincronización
     * @returns {Object} Reporte completo
     */
    static obtenerReporteSincronizacion() {
        const validacion = this.validarDatos();
        const estado = this.obtenerEstadoSync();

        return {
            isInitialized: this.isInitialized,
            validacionDatos: validacion,
            estadoSync: estado,
            configuracion: {
                intervaloSync: `${this.CONFIG.SYNC_INTERVAL_MS / 1000}s`,
                intervaloBackup: `${this.CONFIG.BACKUP_INTERVAL_MS / 1000}s`,
                reintentos: this.CONFIG.MAX_RETRIES,
                timeout: `${this.CONFIG.TIMEOUT_MS}ms`
            },
            timestamp: new Date().toISOString()
        };
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ SincronizacionDatos cargado');
