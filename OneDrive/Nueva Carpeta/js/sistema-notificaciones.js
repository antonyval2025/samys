/**
 * SEMANA 4 - SistemaNotificaciones
 * Notificaciones por email, SMS y push notifications
 * - Enviar notificaciones de cambio de turno
 * - Recordatorios de turnos (24h, 1h antes)
 * - Alertas de conflictos
 * - Historial de notificaciones
 */

class SistemaNotificaciones {
    static isInitialized = false;
    static configuracion = {
        emailActivo: false,
        pushActivo: true,
        smsActivo: false,
        recordatorios: {
            previo24h: true,
            previo1h: true,
            previo15min: false
        },
        preferencias: new Map() // Map<empleadoId, {email, telefono, canales}>
    };
    static historialNotificaciones = [];
    static colaNotificaciones = [];

    static init() {
        if (this.isInitialized) return;

        try {
            this.loadFromStorage();
            this.registerServiceWorker();
            this.isInitialized = true;
            NotificationSystem.show('✅ SistemaNotificaciones inicializado', 'success');
        } catch (error) {
            NotificationSystem.show('❌ Error al inicializar SistemaNotificaciones', 'error');
            console.error('SistemaNotificaciones Error:', error);
        }
    }

    /**
     * Registrar Service Worker para push notifications
     */
    static async registerServiceWorker() {
        try {
            if ('serviceWorker' in navigator && 'Notification' in window) {
                const permission = Notification.permission;
                if (permission === 'default') {
                    Notification.requestPermission();
                }
            }
        } catch (error) {
            console.warn('Service Worker no disponible:', error);
        }
    }

    /**
     * Configurar preferencias de notificación de empleado
     */
    static configurarPreferencias(empleadoId, config) {
        try {
            if (!empleadoId) throw new Error('empleadoId requerido');

            const preferencias = {
                email: config.email || '',
                telefono: config.telefono || '',
                canales: config.canales || ['push'],
                activo: config.activo !== false,
                configuradoEn: new Date().toISOString()
            };

            // Validaciones
            if (preferencias.canales.includes('email') && !this.validarEmail(preferencias.email)) {
                throw new Error('Email inválido');
            }
            if (preferencias.canales.includes('sms') && !this.validarTelefono(preferencias.telefono)) {
                throw new Error('Teléfono inválido');
            }

            this.configuracion.preferencias.set(empleadoId, preferencias);
            this.saveToStorage();

            return { 
                exito: true, 
                mensaje: 'Preferencias configuradas',
                empleadoId: empleadoId
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Enviar notificación de cambio de turno
     */
    static notificarCambioTurno(empleadoId, fecha, turnoAnterior, turnoNuevo, cambiadoPor) {
        try {
            const preferencias = this.configuracion.preferencias.get(empleadoId);
            if (!preferencias || !preferencias.activo) {
                return { exito: false, mensaje: 'Notificaciones desactivadas para este empleado' };
            }

            const mensaje = {
                tipo: 'cambio_turno',
                empleadoId: empleadoId,
                fecha: fecha,
                turnoAnterior: turnoAnterior,
                turnoNuevo: turnoNuevo,
                cambiadoPor: cambiadoPor || 'Sistema',
                timestamp: new Date().toISOString(),
                leido: false,
                textos: {
                    asunto: `Cambio de turno - ${fecha}`,
                    body: `Tu turno del ${fecha} ha sido cambiado de ${turnoAnterior} a ${turnoNuevo}`,
                    push: `Turno modificado: ${turnoAnterior} → ${turnoNuevo}`
                }
            };

            return this.enviarNotificacion(empleadoId, mensaje, preferencias);
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Enviar recordatorio de turno
     */
    static enviarRecordatorioTurno(empleadoId, fecha, turno, minutosAntes) {
        try {
            const preferencias = this.configuracion.preferencias.get(empleadoId);
            if (!preferencias || !preferencias.activo) return;

            let tipoRecordatorio = '';
            if (minutosAntes === 1440) tipoRecordatorio = 'Recordatorio 24 horas';
            else if (minutosAntes === 60) tipoRecordatorio = 'Recordatorio 1 hora';
            else if (minutosAntes === 15) tipoRecordatorio = 'Recordatorio 15 minutos';

            const mensaje = {
                tipo: 'recordatorio_turno',
                empleadoId: empleadoId,
                fecha: fecha,
                turno: turno,
                minutosAntes: minutosAntes,
                timestamp: new Date().toISOString(),
                leido: false,
                textos: {
                    asunto: `${tipoRecordatorio} - Turno ${turno}`,
                    body: `${tipoRecordatorio} antes de tu turno de ${turno} el ${fecha}`,
                    push: `⏰ ${tipoRecordatorio}: ${turno} - ${fecha}`
                }
            };

            return this.enviarNotificacion(empleadoId, mensaje, preferencias);
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Alerta de conflicto
     */
    static alertarConflicto(empleadoId, tipoConflicto, detalles) {
        try {
            const preferencias = this.configuracion.preferencias.get(empleadoId);
            if (!preferencias || !preferencias.activo) return;

            const mensaje = {
                tipo: 'alerta_conflicto',
                empleadoId: empleadoId,
                tipoConflicto: tipoConflicto,
                detalles: detalles,
                timestamp: new Date().toISOString(),
                leido: false,
                textos: {
                    asunto: `⚠️ Alerta: ${tipoConflicto}`,
                    body: `Se detectó un conflicto en tu cuadrante: ${detalles}`,
                    push: `⚠️ ${tipoConflicto}`
                }
            };

            return this.enviarNotificacion(empleadoId, mensaje, preferencias);
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Enviar notificación (motor central)
     */
    static enviarNotificacion(empleadoId, mensaje, preferencias) {
        try {
            // Agregar a historial
            this.historialNotificaciones.push(mensaje);
            if (this.historialNotificaciones.length > 1000) {
                this.historialNotificaciones.shift(); // Mantener últimas 1000
            }

            // Procesar por cada canal
            const resultados = {};

            if (preferencias.canales.includes('push')) {
                resultados.push = this.enviarPushNotification(empleadoId, mensaje);
            }

            if (preferencias.canales.includes('email') && this.configuracion.emailActivo) {
                resultados.email = this.encolarEmailNotificacion(empleadoId, mensaje, preferencias.email);
            }

            if (preferencias.canales.includes('sms') && this.configuracion.smsActivo) {
                resultados.sms = this.encolarSMSNotificacion(empleadoId, mensaje, preferencias.telefono);
            }

            this.saveToStorage();

            return {
                exito: true,
                mensaje: 'Notificación enviada',
                resultados: resultados
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Enviar push notification
     */
    static enviarPushNotification(empleadoId, mensaje) {
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(mensaje.textos.asunto, {
                    body: mensaje.textos.body,
                    icon: '📬',
                    tag: `notif-${empleadoId}-${mensaje.timestamp}`,
                    badge: '📋'
                });
                return { exito: true, canal: 'push' };
            }
            return { exito: false, razon: 'Permisos no otorgados' };
        } catch (error) {
            return { exito: false, razon: error.message };
        }
    }

    /**
     * Encolar email (simulado - en producción iría a backend)
     */
    static encolarEmailNotificacion(empleadoId, mensaje, email) {
        try {
            this.colaNotificaciones.push({
                tipo: 'email',
                empleadoId: empleadoId,
                destinatario: email,
                asunto: mensaje.textos.asunto,
                cuerpo: mensaje.textos.body,
                timestamp: new Date().toISOString(),
                enviado: false
            });

            return { exito: true, canal: 'email', encolado: true };
        } catch (error) {
            return { exito: false, razon: error.message };
        }
    }

    /**
     * Encolar SMS (simulado - en producción iría a backend)
     */
    static encolarSMSNotificacion(empleadoId, mensaje, telefono) {
        try {
            this.colaNotificaciones.push({
                tipo: 'sms',
                empleadoId: empleadoId,
                destinatario: telefono,
                mensaje: mensaje.textos.push,
                timestamp: new Date().toISOString(),
                enviado: false
            });

            return { exito: true, canal: 'sms', encolado: true };
        } catch (error) {
            return { exito: false, razon: error.message };
        }
    }

    /**
     * Obtener historial de notificaciones
     */
    static obtenerHistorial(empleadoId = null, limite = 50) {
        try {
            let historial = this.historialNotificaciones;
            
            if (empleadoId) {
                historial = historial.filter(n => n.empleadoId === empleadoId);
            }

            return {
                exito: true,
                total: historial.length,
                historial: historial.slice(-limite).reverse()
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Marcar notificación como leída
     */
    static marcarComoLeida(timestamp) {
        const notif = this.historialNotificaciones.find(n => n.timestamp === timestamp);
        if (notif) {
            notif.leido = true;
            this.saveToStorage();
            return { exito: true };
        }
        return { exito: false, mensaje: 'Notificación no encontrada' };
    }

    /**
     * Limpiar notificaciones antiguas
     */
    static limpiarAntiguos(diasAnterior = 30) {
        try {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - diasAnterior);

            const antes = this.historialNotificaciones.length;
            this.historialNotificaciones = this.historialNotificaciones.filter(n => {
                return new Date(n.timestamp) > fecha;
            });

            const eliminadas = antes - this.historialNotificaciones.length;
            this.saveToStorage();

            return { 
                exito: true, 
                eliminadas: eliminadas,
                mensaje: `${eliminadas} notificaciones eliminadas`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Validar email
     */
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validar teléfono
     */
    static validarTelefono(telefono) {
        const cleaned = telefono.replace(/\D/g, '');
        return cleaned.length >= 9;
    }

    /**
     * Persistencia
     */
    static saveToStorage() {
        try {
            const datos = {
                configuracion: {
                    ...this.configuracion,
                    preferencias: Array.from(this.configuracion.preferencias.entries())
                },
                historialNotificaciones: this.historialNotificaciones,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('sistemaNotificaciones', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando SistemaNotificaciones:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('sistemaNotificaciones');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.configuracion.preferencias = new Map(parsed.configuracion.preferencias);
                this.historialNotificaciones = parsed.historialNotificaciones || [];
            }
        } catch (error) {
            console.error('Error cargando SistemaNotificaciones:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SistemaNotificaciones.init());
} else {
    SistemaNotificaciones.init();
}
