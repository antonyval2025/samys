/**
 * 📱 WHATSAPP SENDER - Módulo IIFE
 * Envía mensajes a WhatsApp Web de forma modular
 * 
 * Patrón: Revealing Module Pattern (IIFE)
 * Registrado en: ModuleManager
 * 
 * @version 2.0.0 (REFACTORIZADO A MODULEMANAGER)
 * @date 5 de enero de 2026
 * 
 * Dependencias:
 * - IntegracionWhatsApp (js/integracion-whatsapp.js)
 * - NotificationSystem (built-in)
 * - AppState (built-in)
 * - ModuleManager (built-in)
 */

window.WhatsAppSenderModule = (function() {
    // ===== VARIABLES PRIVADAS =====
    let estadisticas = {
        enviados: 0,
        fallidos: 0,
        intentos: 0,
        ultimoEnvio: null
    };

    // ===== FUNCIONES PRIVADAS =====
    function validarDependencias() {
        if (typeof IntegracionWhatsApp === 'undefined') {
            console.error('[WhatsAppSender] IntegracionWhatsApp no está disponible');
            return false;
        }
        if (typeof NotificationSystem === 'undefined') {
            console.error('[WhatsAppSender] NotificationSystem no está disponible');
            return false;
        }
        if (typeof AppState === 'undefined') {
            console.error('[WhatsAppSender] AppState no está disponible');
            return false;
        }
        return true;
    }

    function formatearMensaje(empleado, turno, opciones = {}) {
        const fecha = opciones.fecha || new Date().toLocaleDateString();
        const hora = opciones.hora || new Date().toLocaleTimeString();
        
        return `Hola ${empleado.nombre},\n\nTu turno para ${fecha}:\n${turno.toUpperCase()}\n\nHora: ${hora}`;
    }

    // ===== API PÚBLICA =====
    return {
        /**
         * Enviar mensaje WhatsApp a un empleado
         */
        enviarMensajeEmpleado: function(empleadoId, nombre, opciones = {}) {
            try {
                if (!validarDependencias()) return;

                const empleado = empleados.find(e => e.id === empleadoId);
                if (!empleado) {
                    NotificationSystem.show(`❌ Empleado #${empleadoId} no encontrado`, 'error');
                    return;
                }

                if (!empleado.telefono) {
                    NotificationSystem.show(`⚠️ ${nombre} sin teléfono registrado`, 'warning');
                    return;
                }

                if (!IntegracionWhatsApp.validarTelefono(empleado.telefono)) {
                    NotificationSystem.show(`❌ Teléfono inválido para ${nombre}`, 'error');
                    return;
                }

                const dia = opciones.dia || new Date().getDate();
                const turno = AppState.scheduleData.get(empleadoId)?.[dia - 1]?.turno || 'Descanso';
                const mensaje = formatearMensaje(empleado, turno, opciones);

                IntegracionWhatsApp.enviarMensaje(empleado.telefono, mensaje);
                
                estadisticas.enviados++;
                estadisticas.ultimoEnvio = new Date();
                
                NotificationSystem.show(`✅ Mensaje enviado a ${nombre}`, 'success');
                console.log(`[WhatsAppSender] Mensaje enviado a ${nombre} (${empleado.telefono})`);

            } catch (error) {
                estadisticas.fallidos++;
                NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
                console.error('[WhatsAppSender]', error);
            }
        },

        /**
         * Enviar masivo a múltiples empleados con pausa
         */
        enviarMasivoEmpleados: function(empleadoIds = [], opciones = {}) {
            try {
                if (!validarDependencias()) return;
                if (!Array.isArray(empleadoIds) || empleadoIds.length === 0) {
                    NotificationSystem.show('⚠️ Sin empleados seleccionados', 'warning');
                    return;
                }

                const pausa = opciones.pausa || 1500; // ms entre envíos
                let indice = 0;

                const enviarSiguiente = () => {
                    if (indice < empleadoIds.length) {
                        const id = empleadoIds[indice];
                        const emp = empleados.find(e => e.id === id);
                        if (emp) {
                            this.enviarMensajeEmpleado(id, emp.nombre, opciones);
                        }
                        indice++;
                        setTimeout(enviarSiguiente, pausa);
                    } else {
                        NotificationSystem.show(
                            `✅ Envío masivo completado\n📊 ${estadisticas.enviados} exitosos, ${estadisticas.fallidos} fallidos`,
                            'success'
                        );
                    }
                };

                enviarSiguiente();

            } catch (error) {
                NotificationSystem.show(`❌ Error en envío masivo: ${error.message}`, 'error');
                console.error('[WhatsAppSender]', error);
            }
        },

        /**
         * Enviar por departamento
         */
        enviarPorDepartamento: function(departamento, opciones = {}) {
            try {
                if (!validarDependencias()) return;

                const empleadosDepto = empleados.filter(e => e.departamento === departamento && e.estado === 'activo');
                if (empleadosDepto.length === 0) {
                    NotificationSystem.show(`⚠️ Sin empleados en ${departamento}`, 'warning');
                    return;
                }

                const ids = empleadosDepto.map(e => e.id);
                this.enviarMasivoEmpleados(ids, opciones);

            } catch (error) {
                NotificationSystem.show(`❌ Error: ${error.message}`, 'error');
                console.error('[WhatsAppSender]', error);
            }
        },

        /**
         * Obtener estadísticas de envíos
         */
        obtenerEstadisticas: function() {
            return {
                ...estadisticas,
                tasaExito: estadisticas.intentos > 0 ? 
                    ((estadisticas.enviados / estadisticas.intentos) * 100).toFixed(1) + '%' : 
                    'N/A'
            };
        },

        /**
         * Resetear estadísticas
         */
        resetearEstadisticas: function() {
            estadisticas = { enviados: 0, fallidos: 0, intentos: 0, ultimoEnvio: null };
            console.log('[WhatsAppSender] Estadísticas reseteadas');
        },

        /**
         * Validar disponibilidad de dependencias
         */
        validarDependencias: function() {
            return validarDependencias();
        }
    };
})();

// ============================================================================
// REGISTRAR EN MODULEMANAGER
// ============================================================================

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('WhatsAppSender', window.WhatsAppSenderModule);
    console.log('📦 WhatsAppSenderModule registrado en ModuleManager');
} else {
    console.warn('⚠️ ModuleManager no disponible, WhatsAppSenderModule cargado globalmente');
}

console.log('✅ WhatsAppSenderModule cargado completamente');

// ============================================================================
// CLASE LEGACY (compatibilidad hacia atrás)
// ============================================================================
// Delegue todas las llamadas al módulo IIFE
class WhatsAppSender {
    static enviarMensajeEmpleado(empleadoId, nombre, opciones = {}) {
        return window.WhatsAppSenderModule?.enviarMensajeEmpleado(empleadoId, nombre, opciones);
    }

    static enviarMasivoEmpleados(empleadoIds = [], opciones = {}) {
        return window.WhatsAppSenderModule?.enviarMasivoEmpleados(empleadoIds, opciones);
    }

    static enviarPorDepartamento(departamento, opciones = {}) {
        return window.WhatsAppSenderModule?.enviarPorDepartamento(departamento, opciones);
    }

    static obtenerEstadisticas() {
        return window.WhatsAppSenderModule?.obtenerEstadisticas() || {};
    }

    static validarDependencias() {
        return window.WhatsAppSenderModule?.validarDependencias() || false;
    }
}
