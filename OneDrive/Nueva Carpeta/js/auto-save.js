/**
 * ✅ AUTO-GUARDADO AUTOMÁTICO - Semana 1
 * Guarda cambios automáticamente cada 30 segundos
 * También guarda al cerrar la pestaña
 * 
 * @version 1.0.0
 * @date 2 de enero de 2026
 */

class AutoSaveManager {
    static INTERVAL_MS = 30000;   // Guardar cada 30 segundos
    static DEBOUNCE_MS = 500;    // Debounce de 500ms después del último cambio
    
    static timer = null;
    static debounceTimer = null;
    static lastSavedState = null;
    static isInitialized = false;
    static savedCount = 0;
    static lastSaveTime = null;
    
    /**
     * Inicializar el sistema de autoguardado
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ AutoSaveManager ya fue inicializado');
            return;
        }
        
        console.log('🔄 Inicializando AutoSaveManager...');
        
        // ✅ INTERVALO PERIÓDICO: Guardar cada 30 segundos si hay cambios
        this.timer = setInterval(() => {
            this.checkAndSave();
        }, this.INTERVAL_MS);
        
        // ✅ EVENTO: Guardar al descargar la página
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges()) {
                console.log('💾 Guardando cambios antes de descargar página...');
                this.checkAndSave();
                
                // Mostrar confirmación si hay cambios pendientes
                e.preventDefault();
                e.returnValue = '¿Salir sin guardar cambios de turnos?';
            }
        });
        
        // ✅ EVENTO: Detectar cambios en inputs
        document.addEventListener('change', (e) => {
            if (this.isRelevantElement(e.target)) {
                console.log('📝 Cambio detectado, programando autoguardado...');
                this.scheduleDebounce();
            }
        }, true);
        
        console.log('✅ AutoSaveManager inicializado');
        this.isInitialized = true;
        
        // Mostrar estado inicial
        this.showStatus();
    }
    
    /**
     * Verificar si el elemento es relevante para guardar
     * @param {Element} element
     * @returns {boolean}
     */
    static isRelevantElement(element) {
        const tags = ['INPUT', 'SELECT', 'TEXTAREA'];
        const classes = ['modal-select', 'turno-selector', 'filtro-select'];
        
        if (!tags.includes(element.tagName)) return false;
        if (element.id.includes('modal')) return true;
        return classes.some(cls => element.classList.contains(cls));
    }
    
    /**
     * Programar guardado con debounce
     */
    static scheduleDebounce() {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        this.debounceTimer = setTimeout(() => {
            this.checkAndSave();
        }, this.DEBOUNCE_MS);
    }
    
    /**
     * Verificar si hay cambios sin guardar
     * @returns {boolean}
     */
    static hasUnsavedChanges() {
        if (typeof AppState === 'undefined') return false;
        return AppState.cambiosPendientes && AppState.cambiosPendientes.length > 0;
    }
    
    /**
     * Verificar cambios y guardar si es necesario
     */
    static checkAndSave() {
        if (!this.hasUnsavedChanges()) {
            return;
        }
        
        try {
            const currentState = JSON.stringify({
                cambios: AppState.cambiosPendientes,
                timestamp: new Date().toISOString(),
                count: AppState.cambiosPendientes.length
            });
            
            // Solo guardar si el estado cambió
            if (currentState !== this.lastSavedState) {
                this.save();
            }
        } catch (e) {
            console.error('❌ Error en checkAndSave:', e);
        }
    }
    
    /**
     * Ejecutar guardado real
     */
    static save() {
        try {
            const changeCount = (AppState && AppState.cambiosPendientes) 
                ? AppState.cambiosPendientes.length 
                : 0;
            
            if (typeof AppState === 'undefined' || !AppState.saveToStorage) {
                console.warn('⚠️ AppState.saveToStorage no disponible');
                return;
            }
            
            console.log(`💾 Autoguardando ${changeCount} cambios...`);
            
            AppState.saveToStorage();
            
            this.lastSavedState = JSON.stringify({
                cambios: AppState.cambiosPendientes,
                timestamp: new Date().toISOString()
            });
            
            this.savedCount++;
            this.lastSaveTime = new Date();
            
            // Notificación discreta
            console.log(`✅ Autoguardado exitoso (${this.savedCount} guardados totales)`);
            
            if (typeof NotificationSystem !== 'undefined' && NotificationSystem.show) {
                NotificationSystem.show(
                    `💾 ${changeCount} cambios guardados automáticamente`,
                    'success',
                    2000  // 2 segundos
                );
            }
            
        } catch (e) {
            console.error('❌ Error en AutoSaveManager.save:', e);
            
            if (typeof NotificationSystem !== 'undefined' && NotificationSystem.show) {
                NotificationSystem.show(
                    '⚠️ Error guardando: ' + e.message,
                    'error',
                    3000
                );
            }
        }
    }
    
    /**
     * Destruir el sistema de autoguardado
     */
    static destroy() {
        console.log('🛑 Destruyendo AutoSaveManager...');
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }
        
        this.isInitialized = false;
        console.log('✅ AutoSaveManager destruido');
    }
    
    /**
     * Mostrar estado actual
     */
    static showStatus() {
        const status = {
            inicializado: this.isInitialized,
            cambiosPendientes: this.hasUnsavedChanges() 
                ? (AppState.cambiosPendientes ? AppState.cambiosPendientes.length : 0)
                : 0,
            totalGuardados: this.savedCount,
            ultimoGuardado: this.lastSaveTime ? this.lastSaveTime.toLocaleTimeString('es-ES') : 'Nunca',
            timestamp: new Date().toISOString()
        };
        
        console.table(status);
        return status;
    }
    
    /**
     * Forzar guardado inmediato
     */
    static forceSave() {
        console.log('⚡ Forzando guardado inmediato...');
        this.checkAndSave();
        this.showStatus();
    }
    
    /**
     * Obtener estadísticas
     * @returns {Object}
     */
    static getStats() {
        return {
            totalSaves: this.savedCount,
            lastSaveTime: this.lastSaveTime,
            isInitialized: this.isInitialized,
            hasPendingChanges: this.hasUnsavedChanges(),
            pendingChangeCount: AppState && AppState.cambiosPendientes 
                ? AppState.cambiosPendientes.length 
                : 0
        };
    }
}

// ✅ Asignar a window para que sea accesible globalmente
if (typeof window !== 'undefined') {
    window.AutoSaveManager = AutoSaveManager;
}

console.log('✅ AutoSaveManager cargado (Semana 1)');
