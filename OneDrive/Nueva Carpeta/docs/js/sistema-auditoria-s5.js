/**
 * SEMANA 5 - SistemaAuditoriaAvanzado
 * Registro completo de cambios y trazabilidad
 * - Log de todas las operaciones
 * - Quién hizo qué, cuándo y dónde
 * - Recuperación de versiones anteriores
 * - Reportes de cumplimiento
 */

class SistemaAuditoriaAvanzado {
    static isInitialized = false;
    static registroAuditoria = [];
    static nivelAcceso = { // Simulado
        admin: 5,
        supervisor: 3,
        empleado: 1
    };

    static init() {
        if (this.isInitialized) return;

        // ⏳ ESPERAR A QUE NotificationSystem esté disponible
        if (typeof NotificationSystem === 'undefined') {
            console.warn('[SistemaAuditoriaAvanzado] Esperando a NotificationSystem...');
            setTimeout(() => this.init(), 100);
            return;
        }

        try {
            this.loadFromStorage();
            this.isInitialized = true;
            NotificationSystem.show('✅ SistemaAuditoriaAvanzado inicializado', 'success');
        } catch (error) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('❌ Error al inicializar SistemaAuditoriaAvanzado', 'error');
            }
            console.error('SistemaAuditoriaAvanzado Error:', error);
        }
    }

    /**
     * Registrar cambio
     */
    static registrarCambio(entidad, operacion, datosAntes, datosDespues, usuario = 'Sistema', detalles = '') {
        try {
            const registro = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                fecha: new Date().toLocaleDateString('es-ES'),
                hora: new Date().toLocaleTimeString('es-ES'),
                entidad: entidad, // 'turno', 'empleado', 'sede', etc.
                operacion: operacion, // 'crear', 'editar', 'eliminar', 'exportar'
                usuario: usuario,
                datosAntes: JSON.stringify(datosAntes),
                datosDespues: JSON.stringify(datosDespues),
                detalles: detalles,
                ipAddress: this.obtenerIPSimulada(),
                navegador: navigator.userAgent.split(' ').slice(-2).join(' '),
                idSesion: this.obtenerIdSesion()
            };

            this.registroAuditoria.push(registro);
            if (this.registroAuditoria.length > 10000) {
                this.registroAuditoria.shift(); // Mantener últimos 10k registros
            }

            this.saveToStorage();
            return { exito: true, mensaje: 'Cambio registrado', id: registro.id };
        } catch (error) {
            console.error('Error registrando cambio:', error);
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener ID de sesión único
     */
    static obtenerIdSesion() {
        if (!window._sessionId) {
            window._sessionId = 'SES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        }
        return window._sessionId;
    }

    /**
     * Obtener IP simulada
     */
    static obtenerIPSimulada() {
        // En producción, obtenerse del servidor
        return '192.168.1.' + Math.floor(Math.random() * 255);
    }

    /**
     * Obtener historial completo
     */
    static obtenerHistorial(filtros = {}) {
        try {
            let registros = [...this.registroAuditoria];

            // Aplicar filtros
            if (filtros.entidad) {
                registros = registros.filter(r => r.entidad === filtros.entidad);
            }
            if (filtros.operacion) {
                registros = registros.filter(r => r.operacion === filtros.operacion);
            }
            if (filtros.usuario) {
                registros = registros.filter(r => r.usuario === filtros.usuario);
            }
            if (filtros.fechaInicio && filtros.fechaFin) {
                registros = registros.filter(r => {
                    const fecha = new Date(r.timestamp);
                    return fecha >= new Date(filtros.fechaInicio) && 
                           fecha <= new Date(filtros.fechaFin);
                });
            }

            return {
                exito: true,
                total: registros.length,
                registros: registros.slice(-100).reverse() // Últimos 100
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener cambios de un empleado específico
     */
    static obtenerCambiosEmpleado(empleadoId, limite = 50) {
        try {
            const cambios = this.registroAuditoria
                .filter(r => r.detalles.includes(`empleadoId: ${empleadoId}`) || 
                           r.datosDespues.includes(empleadoId))
                .slice(-limite)
                .reverse();

            return {
                exito: true,
                total: cambios.length,
                cambios: cambios
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener cambios por rango de fechas
     */
    static obtenerCambiosPorFecha(fecha1, fecha2) {
        try {
            const d1 = new Date(fecha1);
            const d2 = new Date(fecha2);

            const cambios = this.registroAuditoria.filter(r => {
                const fechaR = new Date(r.timestamp);
                return fechaR >= d1 && fechaR <= d2;
            });

            return {
                exito: true,
                total: cambios.length,
                registros: cambios
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Análisis de actividad por usuario
     */
    static analizarActividadUsuario(usuario) {
        try {
            const cambios = this.registroAuditoria.filter(r => r.usuario === usuario);

            const estadisticas = {
                usuario: usuario,
                totalOperaciones: cambios.length,
                operacionesPorTipo: {},
                fechaPrimeraActividad: cambios[0]?.timestamp,
                fechaUltimaActividad: cambios[cambios.length - 1]?.timestamp,
                entidadesModificadas: new Set()
            };

            cambios.forEach(c => {
                estadisticas.operacionesPorTipo[c.operacion] = 
                    (estadisticas.operacionesPorTipo[c.operacion] || 0) + 1;
                estadisticas.entidadesModificadas.add(c.entidad);
            });

            estadisticas.entidadesModificadas = Array.from(estadisticas.entidadesModificadas);

            return {
                exito: true,
                estadisticas: estadisticas
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Detectar actividades sospechosas
     */
    static detectarActividadesSospechosas() {
        try {
            const sospechosas = [];

            // Múltiples eliminaciones en corto tiempo
            const ultimos10min = new Date(Date.now() - 10 * 60 * 1000);
            const eliminacionesRecientes = this.registroAuditoria
                .filter(r => r.operacion === 'eliminar' && new Date(r.timestamp) > ultimos10min);

            if (eliminacionesRecientes.length > 3) {
                sospechosas.push({
                    tipo: 'ALERTA_ELIMINACIONES',
                    severidad: 'ALTA',
                    mensaje: `${eliminacionesRecientes.length} eliminaciones en últimos 10 minutos`,
                    registros: eliminacionesRecientes
                });
            }

            // Cambios fuera de horario
            const cambiosNoche = this.registroAuditoria.filter(r => {
                const hora = parseInt(r.hora.split(':')[0]);
                return (hora < 6 || hora > 22) && r.operacion === 'editar';
            });

            if (cambiosNoche.length > 5) {
                sospechosas.push({
                    tipo: 'CAMBIOS_NOCTURNOS',
                    severidad: 'MEDIA',
                    mensaje: `${cambiosNoche.length} cambios fuera de horario laboral`,
                    registros: cambiosNoche.slice(-10)
                });
            }

            // Múltiples operaciones del mismo usuario en corto tiempo
            const ultimaHora = new Date(Date.now() - 60 * 60 * 1000);
            const usuarioActividad = {};

            this.registroAuditoria
                .filter(r => new Date(r.timestamp) > ultimaHora)
                .forEach(r => {
                    usuarioActividad[r.usuario] = (usuarioActividad[r.usuario] || 0) + 1;
                });

            Object.entries(usuarioActividad).forEach(([usuario, cantidad]) => {
                if (cantidad > 50) {
                    sospechosas.push({
                        tipo: 'ACTIVIDAD_ALTA',
                        severidad: 'MEDIA',
                        mensaje: `${usuario} realizó ${cantidad} operaciones en 1 hora`,
                        usuario: usuario
                    });
                }
            });

            return {
                exito: true,
                sospechosas: sospechosas,
                alerta: sospechosas.length > 0
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Generar reporte de auditoría
     */
    static generarReporteAuditoria(fecha1, fecha2) {
        try {
            const cambios = this.obtenerCambiosPorFecha(fecha1, fecha2);
            if (!cambios.exito) throw new Error(cambios.mensaje);

            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Courier New', monospace; padding: 20px; background: #1a1a1a; color: #eee; }
                        .header { background: #2d2d2d; padding: 15px; border-left: 4px solid #e74c3c; margin-bottom: 20px; }
                        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #444; }
                        th { background: #374140; color: #fff; font-weight: bold; }
                        tr:nth-child(even) { background: #252525; }
                        .delete { color: #e74c3c; }
                        .create { color: #2ecc71; }
                        .edit { color: #f39c12; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>🔒 REPORTE DE AUDITORÍA</h1>
                        <p>Período: ${fecha1} a ${fecha2}</p>
                        <p>Generado: ${new Date().toLocaleString('es-ES')}</p>
                        <p>Total de operaciones: ${cambios.total}</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Usuario</th>
                                <th>Entidad</th>
                                <th>Operación</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${cambios.registros.map(r => `
                                <tr>
                                    <td>${r.timestamp}</td>
                                    <td>${r.usuario}</td>
                                    <td>${r.entidad}</td>
                                    <td class="${r.operacion}">${r.operacion.toUpperCase()}</td>
                                    <td>${r.detalles}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <p>⚠️ Este documento es confidencial y solo debe ser visto por personal autorizado</p>
                        <p>Sistema de Auditoría v5.0 | Cumplimiento RGPD</p>
                    </div>
                </body>
                </html>
            `;

            return {
                exito: true,
                html: html,
                nombreArchivo: `auditoria_${fecha1}_a_${fecha2}.html`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Limpiar registros antiguos (>90 días)
     */
    static limpiarRegistrosAntiguos(diasRetencion = 90) {
        try {
            const fechaLimite = new Date(Date.now() - diasRetencion * 24 * 60 * 60 * 1000);
            const antes = this.registroAuditoria.length;

            this.registroAuditoria = this.registroAuditoria.filter(r => 
                new Date(r.timestamp) > fechaLimite
            );

            const eliminados = antes - this.registroAuditoria.length;
            this.saveToStorage();

            return {
                exito: true,
                eliminados: eliminados,
                mensaje: `${eliminados} registros eliminados`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Persistencia
     */
    static saveToStorage() {
        try {
            const datos = {
                registros: this.registroAuditoria,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('sistemaAuditoria', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando SistemaAuditoria:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('sistemaAuditoria');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.registroAuditoria = parsed.registros || [];
            }
        } catch (error) {
            console.error('Error cargando SistemaAuditoria:', error);
            this.registroAuditoria = [];
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SistemaAuditoriaAvanzado.init());
} else {
    SistemaAuditoriaAvanzado.init();
}
