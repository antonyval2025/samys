/**
 * ✅ SINCRONIZACIÓN ENTRE PESTAÑAS - Semana 1
 * Sincroniza automáticamente cambios entre múltiples pestañas del mismo navegador
 * 
 * @version 1.0.0
 * @date 2 de enero de 2026
 */

class TabSyncManager {
    static isInitialized = false;
    static tabId = null;
    static lastSync = null;
    static syncCount = 0;
    static heartbeatInterval = null;
    static listeners = [];
    
    /**
     * Inicializar sincronización entre pestañas
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ TabSyncManager ya fue inicializado');
            return;
        }
        
        console.log('🔄 Inicializando TabSyncManager...');
        
        // ✅ GENERAR ID ÚNICO PARA ESTA PESTAÑA
        this.tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substring(7);
        console.log('📱 ID de pestaña:', this.tabId);
        
        // ✅ ESCUCHAR EVENTOS de localStorage (cambios en otra pestaña)
        window.addEventListener('storage', (event) => {
            this.handleStorageChange(event);
        });
        
        // ✅ INICIAR HEARTBEAT (latido de presencia)
        this.startHeartbeat();
        
        // ✅ GUARDAR ESTADO INICIAL
        this.updatePresence();
        
        console.log('✅ TabSyncManager inicializado');
        this.isInitialized = true;
    }
    
    /**
     * Manejar cambios en localStorage desde otras pestañas
     * @param {StorageEvent} event
     */
    static handleStorageChange(event) {
        // ✅ SINCRONIZAR SI EL CAMBIO VIENE DE OTRA PESTAÑA
        if (event.key === 'turnosAppState' && event.newValue) {
            console.log('📱 Cambios detectados en otra pestaña, sincronizando...');
            
            try {
                // ✅ VALIDAR QUE AppState ESTÁ DISPONIBLE
                if (typeof AppState === 'undefined') {
                    console.warn('⚠️ AppState no está disponible, no se puede sincronizar');
                    return;
                }
                
                if (typeof AppState.loadFromStorage !== 'function') {
                    console.warn('⚠️ AppState.loadFromStorage no es una función');
                    return;
                }
                
                // Recargar AppState desde localStorage
                AppState.loadFromStorage();
                console.log('✅ AppState reargado desde otra pestaña');
                
                // Notificación visual
                if (typeof NotificationSystem !== 'undefined' && typeof NotificationSystem.show === 'function') {
                    NotificationSystem.show(
                        '📱 Cuadrante actualizado desde otra pestaña',
                        'info',
                        3000
                    );
                }
                
                // Refrescar UI
                if (typeof UI !== 'undefined') {
                    if (typeof UI.generarCuadranteGeneral === 'function') {
                        UI.generarCuadranteGeneral();
                    }
                    if (typeof UI.actualizarTitulosMes === 'function') {
                        UI.actualizarTitulosMes();
                    }
                }
                
                this.syncCount++;
                this.lastSync = new Date();
                
                // Notificar listeners
                this.notifyListeners({
                    type: 'SYNC_FROM_STORAGE',
                    timestamp: new Date().toISOString(),
                    source: 'otra_pestaña'
                });
            } catch (e) {
                console.error('❌ Error sincronizando desde otra pestaña:', e);
            }
        }
        
        // ✅ DETECTAR SI OTRA PESTAÑA SE CERRÓ
        if (event.key && event.key.startsWith('tab_heartbeat_')) {
            if (event.newValue === null) {
                const tabId = event.key.replace('tab_heartbeat_', '');
                console.log('📴 Pestaña cerrada:', tabId);
                this.notifyListeners({
                    type: 'TAB_CLOSED',
                    tabId: tabId,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
    
    /**
     * Iniciar heartbeat (latido de presencia cada 5 segundos)
     */
    static startHeartbeat() {
        console.log('💓 Iniciando heartbeat...');
        
        this.heartbeatInterval = setInterval(() => {
            this.updatePresence();
        }, 5000);  // Cada 5 segundos
    }
    
    /**
     * Actualizar presencia en localStorage
     */
    static updatePresence() {
        try {
            const heartbeatKey = 'tab_heartbeat_' + this.tabId;
            const heartbeatData = {
                timestamp: new Date().toISOString(),
                tabId: this.tabId,
                url: window.location.href,
                title: document.title
            };
            
            localStorage.setItem(heartbeatKey, JSON.stringify(heartbeatData));
        } catch (e) {
            console.warn('⚠️ Error actualizando heartbeat:', e.message);
        }
    }
    
    /**
     * Detectar si hay otras pestañas abiertas
     * @returns {Array<string>} IDs de otras pestañas
     */
    static detectOtherTabs() {
        const otherTabs = [];
        
        try {
            // ✅ USAR Object.keys() en lugar de for...in
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                if (key.startsWith('tab_heartbeat_') && key !== 'tab_heartbeat_' + this.tabId) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        // ✅ VALIDAR que el heartbeat no es antiguo (máximo 10 segundos)
                        const timestamp = new Date(data.timestamp);
                        const ahora = new Date();
                        const diferencia = (ahora - timestamp) / 1000;  // en segundos
                        
                        if (diferencia < 10) {  // Solo mostrar si el heartbeat es reciente
                            otherTabs.push({
                                id: key.replace('tab_heartbeat_', ''),
                                timestamp: data.timestamp,
                                url: data.url,
                                title: data.title
                            });
                        } else {
                            // ✅ LIMPIAR heartbeats viejos
                            localStorage.removeItem(key);
                            console.log('🗑️ Heartbeat antiguo removido:', key);
                        }
                    } catch (e) {
                        // Ignorar si no es JSON válido
                        console.warn('⚠️ Heartbeat inválido ignorado:', key);
                    }
                }
            });
        } catch (e) {
            console.warn('⚠️ Error detectando otras pestañas:', e.message);
        }
        
        return otherTabs;
    }
    
    /**
     * Broadcast: Notificar a otras pestañas sobre un cambio
     * @param {Object} data - Datos a compartir
     */
    static broadcast(data) {
        try {
            const message = {
                from: this.tabId,
                timestamp: new Date().toISOString(),
                data: data
            };
            
            // Guardar en localStorage (dispara evento storage en otras pestañas)
            const broadcastKey = 'tab_broadcast_' + Date.now();
            localStorage.setItem(broadcastKey, JSON.stringify(message));
            
            console.log('📡 Mensaje broadcast enviado:', data);
            
            // ✅ LIMPIAR MENSAJES ANTIGUOS (evitar que localStorage crezca)
            this.cleanupOldBroadcasts();
        } catch (e) {
            console.error('❌ Error en broadcast:', e);
        }
    }
    
    /**
     * Limpiar broadcasts antiguos de localStorage
     */
    static cleanupOldBroadcasts() {
        try {
            const keys = Object.keys(localStorage);
            const ahora = Date.now();
            const maxAge = 60000;  // 60 segundos
            
            keys.forEach(key => {
                if (key.startsWith('tab_broadcast_')) {
                    const timestamp = parseInt(key.replace('tab_broadcast_', ''));
                    if ((ahora - timestamp) > maxAge) {
                        localStorage.removeItem(key);
                    }
                }
            });
        } catch (e) {
            console.warn('⚠️ Error limpiando broadcasts:', e.message);
        }
    }
    
    /**
     * Subscribe a eventos de sincronización
     * @param {Function} callback - Función a ejecutar cuando ocurra una sincronización
     */
    static subscribe(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
    }
    
    /**
     * Notificar a todos los listeners
     * @param {Object} event
     */
    static notifyListeners(event) {
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (e) {
                console.error('❌ Error en listener:', e);
            }
        });
    }
    
    /**
     * Destruir gestor de sincronización
     */
    static destroy() {
        console.log('🛑 Destruyendo TabSyncManager...');
        
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        
        // Limpiar heartbeat de esta pestaña
        try {
            localStorage.removeItem('tab_heartbeat_' + this.tabId);
        } catch (e) {
            console.warn('⚠️ No se pudo limpiar heartbeat:', e.message);
        }
        
        this.isInitialized = false;
        console.log('✅ TabSyncManager destruido');
    }
    
    /**
     * Mostrar estado actual
     */
    static showStatus() {
        const otherTabs = this.detectOtherTabs();
        
        const status = {
            inicializado: this.isInitialized,
            tabId: this.tabId,
            sincronizacionesTotales: this.syncCount,
            ultimaSincronizacion: this.lastSync ? this.lastSync.toLocaleTimeString('es-ES') : 'Nunca',
            otrasPestañasAbiertas: otherTabs.length,
            detalles: otherTabs
        };
        
        console.table(status);
        return status;
    }
    
    /**
     * Obtener estadísticas
     * @returns {Object}
     */
    static getStats() {
        return {
            tabId: this.tabId,
            isInitialized: this.isInitialized,
            totalSyncs: this.syncCount,
            lastSyncTime: this.lastSync,
            openTabs: this.detectOtherTabs().length,
            listeners: this.listeners.length
        };
    }
}

// ✅ Asignar a window para que sea accesible globalmente
if (typeof window !== 'undefined') {
    window.TabSyncManager = TabSyncManager;
}

console.log('✅ TabSyncManager cargado (Semana 1)');
