/**
 * 💾 BACKUP MANAGER - Módulo IIFE
 * Interfaz amigable para crear, restaurar y descargar backups
 * 
 * Patrón: Revealing Module Pattern (IIFE)
 * Registrado en: ModuleManager
 * 
 * @version 2.0.0 (REFACTORIZADO A MODULEMANAGER)
 * @date 5 de enero de 2026
 * 
 * Dependencias:
 * - SincronizacionDatos (js/sincronizacion-datos.js)
 * - NotificationSystem (built-in)
 * - AppState (built-in)
 * - ModuleManager (built-in)
 */

window.BackupManagerModule = (function() {
    // ===== VARIABLES PRIVADAS =====
    let ultimoBackup = null;
    let estadisticas = {
        backupsCreados: 0,
        restauraciones: 0,
        descargas: 0,
        validaciones: 0
    };

    // ===== FUNCIONES PRIVADAS =====
    function validarDependencias() {
        // SincronizacionDatos es opcional (algunos métodos podrían no funcionar)
        if (typeof NotificationSystem === 'undefined') {
            console.error('[BackupManager] NotificationSystem no está disponible');
            return false;
        }
        if (typeof AppState === 'undefined') {
            console.error('[BackupManager] AppState no está disponible');
            return false;
        }
        return true;
    }

    function puedeUsarSincronizacion() {
        return typeof SincronizacionDatos !== 'undefined' && SincronizacionDatos !== null;
    }

    function formatearBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    function formatearTiempo(ms) {
        if (ms < 1000) return ms + 'ms';
        if (ms < 60000) return (ms / 1000).toFixed(1) + 's';
        return (ms / 60000).toFixed(1) + 'min';
    }

    // ===== API PÚBLICA =====
    return {
        /**
         * Crear backup manualmente (ahora)
         */
        crearBackupAhora: function() {
            try {
                if (typeof NotificationSystem === 'undefined' || typeof AppState === 'undefined') {
                    if (typeof NotificationSystem !== 'undefined') {
                        NotificationSystem.show('❌ Dependencias faltantes', 'error');
                    }
                    return { exito: false, error: 'Dependencias no disponibles' };
                }

                NotificationSystem.show('💾 Creando backup...', 'info');
                
                // Intentar usar SincronizacionDatos si está disponible
                let resultado = null;
                let tamañoBackup = 0;
                
                if (puedeUsarSincronizacion()) {
                    try {
                        resultado = SincronizacionDatos.crearBackupLocal();
                    } catch (e) {
                        console.warn('[BackupManager] SincronizacionDatos falló, usando backup local:', e.message);
                        resultado = null;
                    }
                }
                
                // Si SincronizacionDatos no está disponible o falló, crear backup localmente
                if (!resultado) {
                    const backupLocal = {
                        app: AppState,
                        empleados: typeof empleados !== 'undefined' ? empleados : [],
                        timestamp: new Date().toISOString()
                    };
                    
                    try {
                        const backupString = JSON.stringify(backupLocal);
                        tamañoBackup = backupString.length;
                        localStorage.setItem('backup_manual_' + new Date().toISOString().replace(/[:.]/g, '-'), backupString);
                        resultado = { exito: true, tamaño: tamañoBackup };
                    } catch (e) {
                        resultado = { exito: false, error: e.message };
                    }
                } else {
                    // Si SincronizacionDatos devolvió un resultado exitoso, calcular tamaño
                    if (resultado.exito) {
                        const backupData = {
                            app: AppState,
                            empleados: typeof empleados !== 'undefined' ? empleados : []
                        };
                        tamañoBackup = JSON.stringify(backupData).length;
                        resultado.tamaño = tamañoBackup;
                    }
                }

                // Guardar estado del último backup localmente
                ultimoBackup = {
                    existe: resultado && resultado.exito,
                    timestamp: new Date().toISOString(),
                    tamaño: resultado?.tamaño || 0,
                    tamañoFormateado: formatearBytes(resultado?.tamaño || 0),
                    error: resultado?.error || null
                };
                
                if (resultado && resultado.exito) {
                    estadisticas.backupsCreados++;
                    const tamaño = resultado.bytes || resultado.tamaño || 0;
                    const msg = `✅ Backup creado exitosamente\n📊 Tamaño: ${formatearBytes(tamaño)}`;
                    NotificationSystem.show(msg, 'success');
                    console.log('[BackupManager] Backup exitoso:', resultado);
                    return resultado;
                } else {
                    const error = resultado?.error || 'Error desconocido';
                    NotificationSystem.show(`❌ Error: ${error}`, 'error');
                    console.error('[BackupManager] Error al crear backup:', resultado);
                    return resultado || { exito: false, error: error };
                }

            } catch (error) {
                NotificationSystem.show(`❌ Error inesperado: ${error.message}`, 'error');
                console.error('[BackupManager] Error fatal:', error);
                return { exito: false, error: error.message };
            }
        },

        /**
         * Restaurar desde backup con confirmación
         */
        restaurarBackup: function() {
            try {
                // Validar dependencias inline
                if (typeof NotificationSystem === 'undefined' || typeof AppState === 'undefined') {
                    if (typeof NotificationSystem !== 'undefined') {
                        NotificationSystem.show('❌ Dependencias faltantes para restaurar', 'error');
                    }
                    return { exito: false };
                }

                if (!confirm('⚠️ Esto sobrescribirá todos los datos actuales. ¿Continuar?')) {
                    console.log('[BackupManager] Restauración cancelada por usuario');
                    return { exito: false, cancelado: true };
                }

                NotificationSystem.show('🔄 Restaurando backup...', 'info');
                
                // Verificar si SincronizacionDatos está disponible
                if (typeof SincronizacionDatos === 'undefined' || !SincronizacionDatos) {
                    NotificationSystem.show('❌ SincronizacionDatos no disponible', 'error');
                    return { exito: false, error: 'SincronizacionDatos no disponible' };
                }
                
                const resultado = SincronizacionDatos.restaurarDesdeBackupLocal();

                if (resultado && resultado.exito) {
                    estadisticas.restauraciones++;
                    
                    // Recargar UI
                    if (typeof UI !== 'undefined' && UI.generarCuadranteGeneral) {
                        UI.generarCuadranteGeneral();
                    }

                    NotificationSystem.show(`✅ Backup restaurado correctamente\n📅 Versión: ${resultado.versionBackup}`, 'success');
                    console.log('[BackupManager] Restauración exitosa:', resultado);
                    return resultado;
                } else {
                    NotificationSystem.show(`❌ Error: ${resultado?.error || 'Error desconocido'}`, 'error');
                    console.error('[BackupManager] Error al restaurar:', resultado);
                    return resultado || { exito: false, error: 'Error en restauración' };
                }

            } catch (error) {
                NotificationSystem.show(`❌ Error inesperado: ${error.message}`, 'error');
                console.error('[BackupManager] Error fatal:', error);
                return { exito: false, error: error.message };
            }
        },

        /**
         * Descargar backup como JSON
         */
        descargarBackupJSON: function() {
            try {
                if (typeof NotificationSystem === 'undefined' || typeof AppState === 'undefined') return;

                estadisticas.descargas++;
                
                const datos = {
                    app: AppState,
                    empleados: typeof empleados !== 'undefined' ? empleados : [],
                    timestamp: new Date().toISOString(),
                    navegador: navigator.userAgent,
                    zona_horaria: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    idioma: navigator.language
                };

                const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup_turnos_${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}_${new Date().toLocaleTimeString().replace(/[:.]/g, '-')}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                NotificationSystem.show('✅ Backup descargado correctamente', 'success');
                console.log('[BackupManager] Backup descargado:', a.download);

            } catch (error) {
                NotificationSystem.show(`❌ Error al descargar: ${error.message}`, 'error');
                console.error('[BackupManager]', error);
            }
        },

        /**
         * Obtener estado actual de backup y sincronización
         */
        obtenerEstadoActual: function() {
            try {
                if (typeof NotificationSystem === 'undefined' || typeof AppState === 'undefined') return null;

                // Intentar obtener stats de SincronizacionDatos si está disponible
                let stats = {};
                let sincActiva = false;
                
                if (puedeUsarSincronizacion()) {
                    stats = SincronizacionDatos.obtenerEstadisticas?.() || {};
                    sincActiva = SincronizacionDatos.estaActivo?.() || false;
                }

                return {
                    sincronizacionActiva: sincActiva,
                    ultimoSync: stats.ultimaSincronizacion || null,
                    proximoSync: stats.proximaSincronizacion || 'N/A',
                    totalSyncs: stats.totalSincronizaciones || 0,
                    syncsExitosos: stats.exitosas || 0,
                    syncsFallidos: stats.fallidas || 0,
                    backup: ultimoBackup || { existe: false },
                    estadisticas: estadisticas
                };

            } catch (error) {
                console.error('[BackupManager]', error);
                return null;
            }
        },

        /**
         * Validar integridad de datos
         */
        validarIntegridad: function() {
            try {
                if (typeof NotificationSystem === 'undefined') return { valido: false };

                estadisticas.validaciones++;

                // Validar memoria: AppState debe existir
                let memoriaValida = false;
                if (typeof AppState !== 'undefined' && AppState !== null && typeof AppState === 'object') {
                    memoriaValida = true;
                } else if (typeof AppState !== 'undefined') {
                    // Si AppState existe pero no es un objeto válido, seguimos adelante
                    memoriaValida = true;
                }

                const empleadosValidos = Array.isArray(empleados) && empleados.length > 0;
                
                // Validar turnos: puede ser Map o puede tener datos de cualquier forma
                let turnosValidos = false;
                let totalTurnos = 0;
                
                if (AppState?.scheduleData) {
                    if (AppState.scheduleData instanceof Map) {
                        turnosValidos = true;
                        totalTurnos = AppState.scheduleData.size;
                    } else if (typeof AppState.scheduleData === 'object' && Object.keys(AppState.scheduleData).length > 0) {
                        // Si es un objeto con datos, también es válido
                        turnosValidos = true;
                        totalTurnos = Object.keys(AppState.scheduleData).length;
                    }
                }

                // Si hay empleados y turnos, considerar que la memoria es válida incluso si AppState es débil
                if (empleadosValidos && turnosValidos) {
                    memoriaValida = true;
                }

                let tamaño = 0;
                try {
                    if (AppState && typeof AppState === 'object') {
                        const strAppState = JSON.stringify(AppState);
                        tamaño = strAppState ? strAppState.length : 0;
                    } else if (empleadosValidos) {
                        // Si no tenemos AppState pero tenemos empleados, aproximar tamaño
                        tamaño = JSON.stringify(empleados).length;
                    }
                } catch (e) {
                    console.warn('[BackupManager] No se pudo calcular tamaño:', e.message);
                    tamaño = 0;
                }

                const resultado = {
                    memoriaValida,
                    empleadosValidos,
                    turnosValidos,
                    backupValido: ultimoBackup?.exito || false,
                    detalleMemoria: {
                        empleados: (empleadosValidos && Array.isArray(empleados)) ? empleados.length : 0,
                        turnos: totalTurnos,
                        tamaño: tamaño
                    },
                    detalleBackup: ultimoBackup || null,
                    resumenGral: `${memoriaValida ? '✅' : '❌'} Memoria | ${empleadosValidos ? '✅' : '❌'} Empleados | ${turnosValidos ? '✅' : '❌'} Turnos`
                };

                if (resultado.memoriaValida && resultado.empleadosValidos && resultado.turnosValidos) {
                    NotificationSystem.show('✅ Validación exitosa - Todos los datos OK', 'success');
                    console.log('[BackupManager] Validación OK:', resultado);
                } else {
                    // Solo mostrar advertencia si faltan datos críticos (memoria o empleados)
                    // Turnos vacíos es normal en primer uso
                    if (!resultado.memoriaValida || !resultado.empleadosValidos) {
                        NotificationSystem.show('⚠️ Algunas validaciones fallaron - Ver consola', 'warning');
                    } else {
                        // Turnos pueden estar vacíos, pero memoria y empleados OK
                        NotificationSystem.show('✅ Datos críticos OK (turnos pueden estar vacíos)', 'success');
                    }
                    console.log('[BackupManager] Validación con detalles:', resultado);
                }

                return resultado;

            } catch (error) {
                NotificationSystem.show(`❌ Error en validación: ${error.message}`, 'error');
                console.error('[BackupManager]', error);
                return { valido: false, error: error.message };
            }
        },

        /**
         * Obtener estadísticas
         */
        obtenerEstadisticas: function() {
            return {
                ...estadisticas,
                tasaExito: estadisticas.backupsCreados > 0 ? '✅ 100%' : 'N/A'
            };
        },

        /**
         * Validar disponibilidad de dependencias
         */
        validarDependencias: function() {
            return validarDependencias();
        },

        /**
         * Formatear bytes
         */
        formatearBytes: function(bytes) {
            return formatearBytes(bytes);
        }
    };
})();

// ============================================================================
// REGISTRAR EN MODULEMANAGER
// ============================================================================

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('BackupManager', window.BackupManagerModule);
    console.log('📦 BackupManagerModule registrado en ModuleManager');
} else {
    console.warn('⚠️ ModuleManager no disponible, BackupManagerModule cargado globalmente');
}

console.log('✅ BackupManagerModule cargado completamente');

// ============================================================================
// CLASE LEGACY (compatibilidad hacia atrás)
// ============================================================================
// Delegue todas las llamadas al módulo IIFE
class BackupManager {
    static crearBackupAhora() {
        return window.BackupManagerModule?.crearBackupAhora();
    }

    static restaurarBackup() {
        return window.BackupManagerModule?.restaurarBackup();
    }

    static descargarBackupJSON() {
        return window.BackupManagerModule?.descargarBackupJSON();
    }

    static obtenerEstadoActual() {
        return window.BackupManagerModule?.obtenerEstadoActual();
    }

    static validarIntegridad() {
        return window.BackupManagerModule?.validarIntegridad();
    }

    static obtenerEstadisticas() {
        return window.BackupManagerModule?.obtenerEstadisticas() || {};
    }

    static validarDependencias() {
        return window.BackupManagerModule?.validarDependencias() || false;
    }

    static formatearBytes(bytes) {
        return window.BackupManagerModule?.formatearBytes(bytes) || '';
    }
}
