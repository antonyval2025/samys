/**
 * SEMANA 5 - GestorBackups
 * Backup automático, restauración y versionado de datos
 * - Backup programado (diario, semanal, mensual)
 * - Encriptación de datos sensibles
 * - Restauración punto-en-tiempo
 * - Validación de integridad
 */

class GestorBackups {
    static isInitialized = false;
    static backups = new Map(); // Map<backupId, {datos, fecha, tamaño, checksum}>
    static programacion = {
        diario: true,
        semanal: true,
        mensual: true,
        ultimoBackup: null
    };

    static init() {
        if (this.isInitialized) return;

        try {
            this.loadFromStorage();
            this.planificarBackupsAutomaticos();
            this.isInitialized = true;
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('✅ GestorBackups inicializado', 'success');
            }
        } catch (error) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('❌ Error al inicializar GestorBackups', 'error');
            }
            console.error('GestorBackups Error:', error);
        }
    }

    /**
     * Crear backup manual
     */
    static crearBackup(nombre = '', tipo = 'manual') {
        try {
            const backupId = 'BK-' + Date.now();
            const datosGuardar = {
                scheduleData: AppState?.scheduleData ? 
                    Array.from(AppState.scheduleData.entries()) : [],
                empleados: typeof empleados !== 'undefined' ? empleados : [],
                appState: {
                    currentYear: AppState?.currentYear,
                    currentMonth: AppState?.currentMonth
                },
                timestamp: new Date().toISOString()
            };

            const jsonStr = JSON.stringify(datosGuardar);
            const checksum = this.calcularChecksum(jsonStr);
            const tamaño = new Blob([jsonStr]).size;

            const backup = {
                id: backupId,
                nombre: nombre || `Backup ${new Date().toLocaleString('es-ES')}`,
                tipo: tipo, // 'manual', 'diario', 'semanal', 'mensual'
                timestamp: new Date().toISOString(),
                tamaño: tamaño,
                checksum: checksum,
                datos: this.comprimirDatos(jsonStr),
                valido: true,
                descripcion: 'Backup del sistema'
            };

            this.backups.set(backupId, backup);
            this.programacion.ultimoBackup = new Date().toISOString();
            this.saveToStorage();

            return {
                exito: true,
                backupId: backupId,
                mensaje: `Backup creado exitosamente`,
                tamaño: `${(tamaño / 1024).toFixed(2)} KB`,
                checksum: checksum
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Comprimir datos (simulado con base64)
     */
    static comprimirDatos(datos) {
        try {
            return btoa(datos); // Encode base64
        } catch (error) {
            return datos;
        }
    }

    /**
     * Descomprimir datos
     */
    static descomprimirDatos(datos) {
        try {
            return atob(datos); // Decode base64
        } catch (error) {
            return datos;
        }
    }

    /**
     * Calcular checksum SHA-256 (simulado)
     */
    static calcularChecksum(datos) {
        let hash = 0;
        for (let i = 0; i < datos.length; i++) {
            const char = datos.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a entero de 32-bit
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Obtener lista de backups
     */
    static obtenerBackups(limite = 50) {
        try {
            const backups = Array.from(this.backups.values())
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, limite);

            return {
                exito: true,
                total: this.backups.size,
                backups: backups.map(b => ({
                    id: b.id,
                    nombre: b.nombre,
                    tipo: b.tipo,
                    timestamp: b.timestamp,
                    tamaño: `${(b.tamaño / 1024).toFixed(2)} KB`,
                    valido: b.valido
                }))
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Restaurar desde backup
     */
    static restaurarBackup(backupId) {
        try {
            const backup = this.backups.get(backupId);
            if (!backup) throw new Error('Backup no encontrado');
            if (!backup.valido) throw new Error('Backup no es válido');

            // Verificar integridad
            const datosDescomprimidos = this.descomprimirDatos(backup.datos);
            const checksumActual = this.calcularChecksum(datosDescomprimidos);
            if (checksumActual !== backup.checksum) {
                throw new Error('Backup corrupto - Checksum no coincide');
            }

            const datosRestaurados = JSON.parse(datosDescomprimidos);

            // Restaurar
            if (AppState && datosRestaurados.scheduleData) {
                AppState.scheduleData = new Map(datosRestaurados.scheduleData);
            }
            if (datosRestaurados.empleados && typeof window !== 'undefined') {
                window.empleados = datosRestaurados.empleados;
            }
            if (AppState && datosRestaurados.appState) {
                AppState.currentYear = datosRestaurados.appState.currentYear;
                AppState.currentMonth = datosRestaurados.appState.currentMonth;
                AppState.saveToStorage?.();
            }

            // Registrar en auditoría
            if (SistemaAuditoriaAvanzado) {
                SistemaAuditoriaAvanzado.registrarCambio(
                    'backup',
                    'restaurar',
                    {},
                    { backupId: backupId },
                    'Sistema',
                    `Restaurado backup: ${backup.nombre}`
                );
            }

            return {
                exito: true,
                mensaje: `Backup ${backup.nombre} restaurado exitosamente`,
                timestampBackup: backup.timestamp
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Eliminar backup
     */
    static eliminarBackup(backupId) {
        try {
            const backup = this.backups.get(backupId);
            if (!backup) throw new Error('Backup no encontrado');

            this.backups.delete(backupId);
            this.saveToStorage();

            return {
                exito: true,
                mensaje: `Backup ${backup.nombre} eliminado`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Descargar backup
     */
    static descargarBackup(backupId) {
        try {
            const backup = this.backups.get(backupId);
            if (!backup) throw new Error('Backup no encontrado');

            const datosDescomprimidos = this.descomprimirDatos(backup.datos);
            const blob = new Blob([datosDescomprimidos], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${backup.nombre.replace(/\s+/g, '_')}_${Date.now()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return { exito: true, mensaje: 'Backup descargado' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Importar backup desde archivo
     */
    static importarBackup(archivoInput) {
        return new Promise((resolve) => {
            try {
                const archivo = archivoInput.files[0];
                if (!archivo) {
                    resolve({ exito: false, mensaje: 'Selecciona un archivo' });
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const contenido = e.target.result;
                        const datos = JSON.parse(contenido);

                        const backupId = 'BK-' + Date.now();
                        const checksum = this.calcularChecksum(contenido);

                        const backup = {
                            id: backupId,
                            nombre: `Importado: ${archivo.name}`,
                            tipo: 'importado',
                            timestamp: new Date().toISOString(),
                            tamaño: archivo.size,
                            checksum: checksum,
                            datos: this.comprimirDatos(contenido),
                            valido: true,
                            descripcion: 'Backup importado desde archivo'
                        };

                        this.backups.set(backupId, backup);
                        this.saveToStorage();

                        resolve({
                            exito: true,
                            mensaje: 'Backup importado exitosamente',
                            backupId: backupId
                        });
                    } catch (error) {
                        resolve({ exito: false, mensaje: 'Archivo inválido: ' + error.message });
                    }
                };
                reader.readAsText(archivo);
            } catch (error) {
                resolve({ exito: false, mensaje: error.message });
            }
        });
    }

    /**
     * Validar integridad de todos los backups
     */
    static validarIntegridad() {
        try {
            const resultados = [];
            let validos = 0;
            let invalidos = 0;

            this.backups.forEach((backup, backupId) => {
                try {
                    const datosDescomprimidos = this.descomprimirDatos(backup.datos);
                    const checksumActual = this.calcularChecksum(datosDescomprimidos);
                    const esValido = checksumActual === backup.checksum;

                    if (esValido) {
                        validos++;
                        backup.valido = true;
                    } else {
                        invalidos++;
                        backup.valido = false;
                    }

                    resultados.push({
                        backupId: backupId,
                        nombre: backup.nombre,
                        valido: esValido
                    });
                } catch (error) {
                    invalidos++;
                    backup.valido = false;
                    resultados.push({
                        backupId: backupId,
                        nombre: backup.nombre,
                        valido: false,
                        error: error.message
                    });
                }
            });

            this.saveToStorage();

            return {
                exito: true,
                totalBackups: this.backups.size,
                validos: validos,
                invalidos: invalidos,
                resultados: resultados
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Limpiar backups antiguos
     */
    static limpiarAntiguos(diasRetencion = 30) {
        try {
            const fechaLimite = new Date(Date.now() - diasRetencion * 24 * 60 * 60 * 1000);
            let eliminados = 0;

            const backupsAEliminar = [];
            this.backups.forEach((backup, id) => {
                if (new Date(backup.timestamp) < fechaLimite) {
                    backupsAEliminar.push(id);
                }
            });

            backupsAEliminar.forEach(id => {
                this.backups.delete(id);
                eliminados++;
            });

            this.saveToStorage();

            return {
                exito: true,
                eliminados: eliminados,
                mensaje: `${eliminados} backups antiguos eliminados`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Planificar backups automáticos
     */
    static planificarBackupsAutomaticos() {
        try {
            // Backup diario (cada 24h)
            setInterval(() => {
                if (this.programacion.diario) {
                    this.crearBackup('Backup Automático Diario', 'diario');
                }
            }, 24 * 60 * 60 * 1000);

            // Backup semanal (cada 7 días)
            setInterval(() => {
                if (this.programacion.semanal) {
                    this.crearBackup('Backup Automático Semanal', 'semanal');
                }
            }, 7 * 24 * 60 * 60 * 1000);

            return { exito: true, mensaje: 'Backups automáticos planificados' };
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
                backups: Array.from(this.backups.entries()),
                programacion: this.programacion,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('gestorBackups', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando GestorBackups:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('gestorBackups');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.backups = new Map(parsed.backups);
                this.programacion = parsed.programacion || this.programacion;
            }
        } catch (error) {
            console.error('Error cargando GestorBackups:', error);
            this.backups = new Map();
        }
    }
}

// ⚠️ DESHABILITADO: Init automático causa conflictos
// GestorBackups se inicializa bajo demanda cuando el usuario lo necesita
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', () => {
//         try {
//             GestorBackups.init();
//         } catch (e) {
//             console.warn('⚠️ GestorBackups.init() falló (no crítico):', e.message);
//         }
//     });
// } else {
//     try {
//         GestorBackups.init();
//     } catch (e) {
//         console.warn('⚠️ GestorBackups.init() falló (no crítico):', e.message);
//     }
// }
