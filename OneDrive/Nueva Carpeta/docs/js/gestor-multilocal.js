/**
 * SEMANA 4 - GestorMultiLocal
 * Gestiona múltiples sedes/departamentos con herencia de configuración
 * - Crear/editar/eliminar sedes
 * - Asignar empleados a sedes
 * - Sincronizar datos entre sedes
 * - Configuración independiente por sede
 */

class GestorMultiLocal {
    static isInitialized = false;
    static sedes = new Map(); // Map<sedeId, {nombre, ubicacion, empleados[], config}>
    static sedeActual = null;

    static init() {
        if (this.isInitialized) return;
        
        try {
            this.loadFromStorage();
            this.isInitialized = true;
            NotificationSystem.show('✅ GestorMultiLocal inicializado', 'success');
        } catch (error) {
            NotificationSystem.show('❌ Error al inicializar GestorMultiLocal', 'error');
            console.error('GestorMultiLocal Error:', error);
        }
    }

    /**
     * Crear nueva sede
     */
    static crearSede(nombre, ubicacion, config = {}) {
        try {
            if (!nombre || nombre.trim().length < 3) {
                throw new Error('Nombre de sede debe tener mínimo 3 caracteres');
            }

            const sedeId = Date.now();
            const nuevaSede = {
                id: sedeId,
                nombre: nombre.trim(),
                ubicacion: ubicacion || 'Sin especificar',
                empleados: [],
                config: {
                    horaInicioTurnoMañana: config.horaInicioTurnoMañana || '08:00',
                    horaInicioTurnoTarde: config.horaInicioTurnoTarde || '16:00',
                    horaInicioTurnoNoche: config.horaInicioTurnoNoche || '00:00',
                    diasDescansoSemanal: config.diasDescansoSemanal || 2,
                    maxTurnosNocturnos: config.maxTurnosNocturnos || 12,
                    minDescansoConsecutivo: config.minDescansoConsecutivo || 2,
                    festivos: config.festivos || []
                },
                fechaCreacion: new Date().toISOString(),
                estatus: 'activa'
            };

            this.sedes.set(sedeId, nuevaSede);
            this.saveToStorage();

            return {
                exito: true,
                mensaje: `Sede "${nombre}" creada exitosamente`,
                sedeId: sedeId
            };
        } catch (error) {
            return {
                exito: false,
                mensaje: error.message,
                error: error
            };
        }
    }

    /**
     * Eliminar sede
     */
    static eliminarSede(sedeId) {
        try {
            if (!this.sedes.has(sedeId)) {
                throw new Error('Sede no encontrada');
            }

            const sede = this.sedes.get(sedeId);
            if (sede.empleados.length > 0) {
                throw new Error(`No se puede eliminar sede con ${sede.empleados.length} empleados asignados`);
            }

            this.sedes.delete(sedeId);
            if (this.sedeActual === sedeId) {
                this.sedeActual = this.sedes.keys().next().value || null;
            }

            this.saveToStorage();
            return { exito: true, mensaje: 'Sede eliminada' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener todas las sedes
     */
    static obtenerSedes() {
        return Array.from(this.sedes.values());
    }

    /**
     * Obtener sede por ID
     */
    static obtenerSede(sedeId) {
        return this.sedes.get(sedeId);
    }

    /**
     * Asignar empleado a sede
     */
    static asignarEmpleadoSede(empleadoId, sedeId, salario = 0) {
        try {
            if (!this.sedes.has(sedeId)) {
                throw new Error('Sede no existe');
            }

            const sede = this.sedes.get(sedeId);
            const empleadoExistente = sede.empleados.find(e => e.empleadoId === empleadoId);

            if (empleadoExistente) {
                throw new Error('Empleado ya asignado a esta sede');
            }

            sede.empleados.push({
                empleadoId: empleadoId,
                salario: salario,
                fechaAsignacion: new Date().toISOString(),
                activo: true
            });

            this.saveToStorage();
            return { exito: true, mensaje: 'Empleado asignado a sede' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Remover empleado de sede
     */
    static removerEmpleadoSede(empleadoId, sedeId) {
        try {
            const sede = this.sedes.get(sedeId);
            const index = sede.empleados.findIndex(e => e.empleadoId === empleadoId);

            if (index === -1) {
                throw new Error('Empleado no encontrado en esta sede');
            }

            sede.empleados.splice(index, 1);
            this.saveToStorage();
            return { exito: true, mensaje: 'Empleado removido de sede' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Transferir empleado entre sedes
     */
    static transferirEmpleado(empleadoId, sedeOrigen, sedeDestino) {
        try {
            this.removerEmpleadoSede(empleadoId, sedeOrigen);
            const salario = this.sedes.get(sedeOrigen)
                .empleados.find(e => e.empleadoId === empleadoId)?.salario || 0;
            
            this.asignarEmpleadoSede(empleadoId, sedeDestino, salario);
            this.saveToStorage();
            
            return { exito: true, mensaje: 'Empleado transferido' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Sincronizar configuración entre sedes
     */
    static sincronizarConfiguracion(sedeOrigen, sedesDestino = []) {
        try {
            const sedeO = this.sedes.get(sedeOrigen);
            if (!sedeO) throw new Error('Sede origen no existe');

            let sincronizadas = 0;
            sedesDestino.forEach(sedeDestId => {
                const sedeD = this.sedes.get(sedeDestId);
                if (sedeD) {
                    sedeD.config = { ...sedeO.config };
                    sincronizadas++;
                }
            });

            this.saveToStorage();
            return { 
                exito: true, 
                mensaje: `Configuración sincronizada a ${sincronizadas} sedes`,
                sincronizadas: sincronizadas
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Generar reporte comparativo de sedes
     */
    static generarReporteComparativo() {
        try {
            const sedes = this.obtenerSedes();
            const reporte = {
                totalSedes: sedes.length,
                totalEmpleados: 0,
                sedesPorEmpleado: {},
                resumen: []
            };

            sedes.forEach(sede => {
                const empleadosActivos = sede.empleados.filter(e => e.activo).length;
                reporte.totalEmpleados += empleadosActivos;

                reporte.resumen.push({
                    sede: sede.nombre,
                    ubicacion: sede.ubicacion,
                    empleados: empleadosActivos,
                    config: sede.config,
                    estatus: sede.estatus
                });
            });

            return {
                exito: true,
                reporte: reporte,
                generado: new Date().toISOString()
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Estadísticas por sede
     */
    static obtenerEstadisticas(sedeId) {
        try {
            const sede = this.sedes.get(sedeId);
            if (!sede) throw new Error('Sede no encontrada');

            const empleadosActivos = sede.empleados.filter(e => e.activo).length;
            const salarioTotal = sede.empleados
                .filter(e => e.activo)
                .reduce((sum, e) => sum + (e.salario || 0), 0);

            return {
                exito: true,
                estadisticas: {
                    sede: sede.nombre,
                    empleadosActivos: empleadosActivos,
                    salarioTotal: salarioTotal,
                    salarioPromedio: empleadosActivos > 0 ? salarioTotal / empleadosActivos : 0,
                    config: sede.config
                }
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
                sedes: Array.from(this.sedes.entries()),
                sedeActual: this.sedeActual,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gestorMultiLocal', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando GestorMultiLocal:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('gestorMultiLocal');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.sedes = new Map(parsed.sedes);
                this.sedeActual = parsed.sedeActual;
            } else {
                // Sede de prueba
                this.crearSede('Sede Principal', 'Madrid', {
                    horaInicioTurnoMañana: '08:00',
                    horaInicioTurnoTarde: '16:00'
                });
            }
        } catch (error) {
            console.error('Error cargando GestorMultiLocal:', error);
            this.sedes = new Map();
        }
    }
}

// Inicializar cuando el DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GestorMultiLocal.init());
} else {
    GestorMultiLocal.init();
}
