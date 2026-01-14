/**
 * SOPORTE MULTI-LOCAL/EMPRESA - Sistema de Gestión de Turnos v8.0+
 * Permite gestionar múltiples sucursales, departamentos y consolidar reportes
 * 
 * Clases:
 * - GestorLocales: Crear, editar, eliminar locales
 * - GestorDepartamentos: Gestionar departamentos dentro de locales
 * - ConsolidadorReportes: Consolidar reportes de múltiples locales
 * - LocalizacionUtils: Funciones de soporte para locales
 */

// ═════════════════════════════════════════════════════════════════════════════
// GESTOR DE LOCALES/SUCURSALES
// ═════════════════════════════════════════════════════════════════════════════

class GestorLocales {
    static locales = [];
    static localActualId = null;

    /**
     * Inicializar locales desde localStorage
     */
    static inicializarLocales() {
        const localesGuardadas = localStorage.getItem('localesData');
        if (localesGuardadas) {
            try {
                this.locales = JSON.parse(localesGuardadas);
                console.log(`✅ ${this.locales.length} locales cargados desde storage`);
            } catch (e) {
                console.error('Error al cargar locales:', e);
                this.crearLocalesPorDefecto();
            }
        } else {
            this.crearLocalesPorDefecto();
        }
    }

    /**
     * Crear locales por defecto para demostración
     */
    static crearLocalesPorDefecto() {
        this.locales = [
            {
                id: 'local-madrid',
                nombre: 'Madrid Centro',
                ciudad: 'Madrid',
                pais: 'España',
                horarios: { inicio: '08:00', fin: '20:00' },
                diasOperativos: [1, 2, 3, 4, 5, 6], // Lun-Sáb
                reglas: {
                    maxTurnosNoche: 12,
                    minDescansos: 2,
                    maxDiasSeguidos: 6,
                    horasPromedio: 40
                },
                departamentos: [],
                empleados: [],
                creado: new Date().toISOString(),
                activo: true
            },
            {
                id: 'local-barcelona',
                nombre: 'Barcelona',
                ciudad: 'Barcelona',
                pais: 'España',
                horarios: { inicio: '09:00', fin: '21:00' },
                diasOperativos: [1, 2, 3, 4, 5, 6],
                reglas: {
                    maxTurnosNoche: 10,
                    minDescansos: 2,
                    maxDiasSeguidos: 6,
                    horasPromedio: 40
                },
                departamentos: [],
                empleados: [],
                creado: new Date().toISOString(),
                activo: true
            },
            {
                id: 'local-valencia',
                nombre: 'Valencia',
                ciudad: 'Valencia',
                pais: 'España',
                horarios: { inicio: '07:00', fin: '19:00' },
                diasOperativos: [1, 2, 3, 4, 5],
                reglas: {
                    maxTurnosNoche: 8,
                    minDescansos: 2,
                    maxDiasSeguidos: 5,
                    horasPromedio: 35
                },
                departamentos: [],
                empleados: [],
                creado: new Date().toISOString(),
                activo: true
            }
        ];

        this.localActualId = 'local-madrid'; // Seleccionar Madrid por defecto
        this.guardarLocales();
        console.log('✅ Locales por defecto creados');
    }

    /**
     * Cambiar el local actual
     */
    static cambiarLocalActual(localId) {
        if (!localId) {
            NotificationSystem.show('⚠️ Por favor selecciona un local', 'warning');
            return;
        }

        const local = this.locales.find(l => l.id === localId);
        if (!local) {
            NotificationSystem.show('❌ Local no encontrado', 'error');
            return;
        }

        this.localActualId = localId;
        AppState.currentLocalId = localId;
        AppState.saveToStorage();

        console.log(`🏢 Local cambiado a: ${local.nombre}`);
        NotificationSystem.show(`✅ Local cambiado a: ${local.nombre}`, 'success');

        // Recargar datos del local
        TurnoManager.reiniciarDatos();
    }

    /**
     * Obtener local actual
     */
    static obtenerLocalActual() {
        return this.locales.find(l => l.id === this.localActualId) || this.locales[0];
    }

    /**
     * Crear nuevo local
     */
    static crearLocal(config) {
        const nuevoLocal = {
            id: `local-${Date.now()}`,
            nombre: config.nombre || 'Nuevo Local',
            ciudad: config.ciudad || '',
            pais: config.pais || 'España',
            horarios: config.horarios || { inicio: '08:00', fin: '20:00' },
            diasOperativos: config.diasOperativos || [1, 2, 3, 4, 5, 6],
            reglas: config.reglas || {
                maxTurnosNoche: 12,
                minDescansos: 2,
                maxDiasSeguidos: 6,
                horasPromedio: 40
            },
            departamentos: [],
            empleados: [],
            creado: new Date().toISOString(),
            activo: true
        };

        this.locales.push(nuevoLocal);
        this.guardarLocales();
        this.actualizarSelectLocal();

        NotificationSystem.show(`✅ Local '${nuevoLocal.nombre}' creado`, 'success');
        return nuevoLocal;
    }

    /**
     * Actualizar un local
     */
    static actualizarLocal(localId, actualizaciones) {
        const local = this.locales.find(l => l.id === localId);
        if (!local) {
            NotificationSystem.show('❌ Local no encontrado', 'error');
            return;
        }

        Object.assign(local, actualizaciones);
        this.guardarLocales();
        this.actualizarSelectLocal();

        NotificationSystem.show(`✅ Local '${local.nombre}' actualizado`, 'success');
        return local;
    }

    /**
     * Eliminar un local
     */
    static eliminarLocal(localId) {
        const idx = this.locales.findIndex(l => l.id === localId);
        if (idx < 0) {
            NotificationSystem.show('❌ Local no encontrado', 'error');
            return;
        }

        const localEliminado = this.locales.splice(idx, 1)[0];
        this.guardarLocales();

        // Si era el actual, cambiar a otro
        if (this.localActualId === localId && this.locales.length > 0) {
            this.localActualId = this.locales[0].id;
        }

        this.actualizarSelectLocal();
        NotificationSystem.show(`✅ Local '${localEliminado.nombre}' eliminado`, 'success');
    }

    /**
     * Agregar empleado a un local
     */
    static agregarEmpleadoALocal(localId, empleado) {
        const local = this.locales.find(l => l.id === localId);
        if (!local) {
            console.error('Local no encontrado:', localId);
            return false;
        }

        if (!local.empleados) local.empleados = [];
        
        // Evitar duplicados
        if (!local.empleados.includes(empleado.id)) {
            local.empleados.push(empleado.id);
            this.guardarLocales();
            console.log(`✅ Empleado ${empleado.nombre} asignado a ${local.nombre}`);
            return true;
        }
        return false;
    }

    /**
     * Obtener empleados de un local
     */
    static obtenerEmpleadosDelLocal(localId) {
        const local = this.locales.find(l => l.id === localId);
        if (!local) return [];

        if (!local.empleados || local.empleados.length === 0) {
            // Todos los empleados si no hay asignación específica
            return empleados;
        }

        return empleados.filter(e => local.empleados.includes(e.id));
    }

    /**
     * Cargar empleados del local actual
     */
    static cargarEmpleadosDelLocal(localId) {
        const empleadosLocal = this.obtenerEmpleadosDelLocal(localId);
        AppState.empleadosActuales = empleadosLocal;
        console.log(`📊 ${empleadosLocal.length} empleados cargados para local`);
    }

    /**
     * Guardar locales en localStorage
     */
    static guardarLocales() {
        try {
            localStorage.setItem('localesData', JSON.stringify(this.locales));
            AppState.saveToStorage();
        } catch (e) {
            console.error('Error al guardar locales:', e);
        }
    }

    /**
     * Actualizar select de locales en la UI
     */
    static actualizarSelectLocal() {
        const select = document.getElementById('selectLocal');
        if (!select) return;

        const valorActual = select.value;
        select.innerHTML = '<option value="">-- Seleccionar Local --</option>';

        this.locales.forEach(local => {
            const option = document.createElement('option');
            option.value = local.id;
            option.textContent = `🏢 ${local.nombre} (${local.ciudad})`;
            if (local.id === this.localActualId) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        if (this.localActualId) {
            select.value = this.localActualId;
        }
    }

    /**
     * Mostrar modal de gestión de locales
     */
    static mostrarModalGestión() {
        console.log('📍 DEBUG: mostrarModalGestión() llamado');
        console.log(`📍 DEBUG: AppState.canEditShifts() = ${AppState.canEditShifts()}`);
        console.log(`📍 DEBUG: AppState.userRole = ${AppState.userRole}`);
        
        if (!AppState.canEditShifts()) {
            const msg = `❌ No tienes permiso para gestionar locales. userRole='${AppState.userRole}' (se requiere admin o supervisor)`;
            console.error(msg);
            alert(msg);
            NotificationSystem.show(msg, 'error');
            return;
        }

        let html = `
            <div id="modalGestionLocales" class="modal active">
                <div class="modal-content">
                    <h2 class="modal-title">🏢 Gestión de Locales</h2>
                    
                    <form onsubmit="GestorLocales.crearLocalDesdeForm(event)">
                        <h3>Crear Nuevo Local</h3>
                        <input type="text" id="inputNombreLocal" placeholder="Nombre del local" required class="modal-select" style="width: 100%;">
                        <input type="text" id="inputCiudadLocal" placeholder="Ciudad" required class="modal-select" style="width: 100%; margin-top: 10px;">
                        <button type="submit" class="modal-btn apply" style="width: 100%; margin-top: 15px;">➕ Crear Local</button>
                    </form>

                    <hr style="margin: 20px 0; border: 1px solid #ecf0f1;">

                    <h3>Locales Existentes</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #3498db; color: white;">
                                <th style="padding: 10px; text-align: left;">Nombre</th>
                                <th style="padding: 10px; text-align: left;">Ciudad</th>
                                <th style="padding: 10px; text-align: center;">Empleados</th>
                                <th style="padding: 10px; text-align: center;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        this.locales.forEach(local => {
            const empsCount = this.obtenerEmpleadosDelLocal(local.id).length;
            html += `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 10px; font-weight: 600;">${local.nombre}</td>
                    <td style="padding: 10px;">${local.ciudad}</td>
                    <td style="padding: 10px; text-align: center;">${empsCount}</td>
                    <td style="padding: 10px; text-align: center;">
                        <button class="nav-btn" onclick="GestorLocales.cambiarLocalActual('${local.id}')" style="padding: 6px 12px; font-size: 0.9rem;">
                            ${this.localActualId === local.id ? '✓ Actual' : 'Cambiar'}
                        </button>
                        <button class="nav-btn" style="padding: 6px 12px; font-size: 0.9rem; background: #e74c3c; margin-left: 5px;" onclick="GestorLocales.eliminarLocal('${local.id}')">
                            🗑️ Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>

                    <div class="modal-actions" style="margin-top: 20px;">
                        <button class="modal-btn cancel" onclick="document.getElementById('modalGestionLocales').remove();">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv);
    }

    /**
     * Crear local desde formulario
     */
    static crearLocalDesdeForm(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('inputNombreLocal').value;
        const ciudad = document.getElementById('inputCiudadLocal').value;

        this.crearLocal({ nombre, ciudad });

        // Limpiar y recargar modal
        document.getElementById('modalGestionLocales').remove();
        this.mostrarModalGestión();
    }

    /**
     * Obtener todas las reglas de un local
     */
    static obtenerReglas(localId) {
        const local = this.obtenerLocalActual();
        return local.reglas || {
            maxTurnosNoche: 12,
            minDescansos: 2,
            maxDiasSeguidos: 6,
            horasPromedio: 40
        };
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// GESTOR DE DEPARTAMENTOS
// ═════════════════════════════════════════════════════════════════════════════

class GestorDepartamentos {
    /**
     * Crear departamento en un local
     */
    static crearDepartamento(localId, config) {
        const local = GestorLocales.locales.find(l => l.id === localId);
        if (!local) {
            console.error('Local no encontrado:', localId);
            return null;
        }

        if (!local.departamentos) local.departamentos = [];

        const nuevoDept = {
            id: `dept-${Date.now()}`,
            nombre: config.nombre || 'Departamento',
            presupuestoHoras: config.presupuestoHoras || 160,
            empleados: [],
            creado: new Date().toISOString()
        };

        local.departamentos.push(nuevoDept);
        GestorLocales.guardarLocales();

        NotificationSystem.show(`✅ Departamento '${nuevoDept.nombre}' creado`, 'success');
        return nuevoDept;
    }

    /**
     * Obtener departamentos de un local
     */
    static obtenerDepartamentosLocal(localId) {
        const local = GestorLocales.locales.find(l => l.id === localId);
        return local?.departamentos || [];
    }

    /**
     * Validar presupuesto de horas de un departamento
     */
    static validarPresupuestoHoras(deptoId, horasUtilizadas) {
        const deptosActuales = this.obtenerDepartamentosLocal(GestorLocales.localActualId);
        const depto = deptosActuales.find(d => d.id === deptoId);
        
        if (!depto) return { valido: true };

        const disponibles = depto.presupuestoHoras - horasUtilizadas;
        return {
            valido: disponibles >= 0,
            presupuestoTotal: depto.presupuestoHoras,
            horasUtilizadas: horasUtilizadas,
            horasDisponibles: disponibles
        };
    }

    /**
     * Mostrar modal de gestión de departamentos
     */
    static mostrarModalGestión() {
        console.log('📍 DEBUG: GestorDepartamentos.mostrarModalGestión() llamado');
        console.log(`📍 DEBUG: AppState.canEditShifts() = ${AppState.canEditShifts()}`);
        console.log(`📍 DEBUG: AppState.userRole = ${AppState.userRole}`);
        
        if (!AppState.canEditShifts()) {
            const msg = `❌ No tienes permiso para gestionar departamentos. userRole='${AppState.userRole}' (se requiere admin o supervisor)`;
            console.error(msg);
            alert(msg);
            NotificationSystem.show(msg, 'error');
            return;
        }

        const localActual = GestorLocales.obtenerLocalActual();
        const deptos = this.obtenerDepartamentosLocal(localActual.id);

        let html = `
            <div id="modalGestionDeptos" class="modal active">
                <div class="modal-content">
                    <h2 class="modal-title">📂 Gestión de Departamentos - ${localActual.nombre}</h2>
                    
                    <form onsubmit="GestorDepartamentos.crearDeptDesdeForm(event)">
                        <h3>Crear Nuevo Departamento</h3>
                        <input type="text" id="inputNombreDepto" placeholder="Nombre del departamento" required class="modal-select" style="width: 100%;">
                        <input type="number" id="inputPresupuestoDepto" placeholder="Presupuesto horas/mes" value="160" min="0" class="modal-select" style="width: 100%; margin-top: 10px;">
                        <button type="submit" class="modal-btn apply" style="width: 100%; margin-top: 15px;">➕ Crear Departamento</button>
                    </form>

                    <hr style="margin: 20px 0; border: 1px solid #ecf0f1;">

                    <h3>Departamentos Existentes</h3>
                    ${deptos.length === 0 ? '<p style="color: #7f8c8d;">No hay departamentos. Crea uno nuevo.</p>' : `
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #3498db; color: white;">
                                    <th style="padding: 10px; text-align: left;">Nombre</th>
                                    <th style="padding: 10px; text-align: center;">Presupuesto (hrs/mes)</th>
                                    <th style="padding: 10px; text-align: center;">Empleados</th>
                                    <th style="padding: 10px; text-align: center;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${deptos.map(d => `
                                    <tr style="border-bottom: 1px solid #ecf0f1;">
                                        <td style="padding: 10px; font-weight: 600;">${d.nombre}</td>
                                        <td style="padding: 10px; text-align: center;">${d.presupuestoHoras}</td>
                                        <td style="padding: 10px; text-align: center;">${d.empleados?.length || 0}</td>
                                        <td style="padding: 10px; text-align: center;">
                                            <button class="nav-btn" style="padding: 6px 12px; font-size: 0.9rem; background: #e74c3c;" onclick="GestorDepartamentos.eliminarDepartamento('${localActual.id}', '${d.id}')">
                                                🗑️ Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `}

                    <div class="modal-actions" style="margin-top: 20px;">
                        <button class="modal-btn cancel" onclick="document.getElementById('modalGestionDeptos').remove();">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        const modalDiv = document.createElement('div');
        modalDiv.innerHTML = html;
        document.body.appendChild(modalDiv);
    }

    /**
     * Crear departamento desde formulario
     */
    static crearDeptDesdeForm(e) {
        e.preventDefault();

        const nombre = document.getElementById('inputNombreDepto').value;
        const presupuesto = parseInt(document.getElementById('inputPresupuestoDepto').value);

        this.crearDepartamento(GestorLocales.localActualId, {
            nombre,
            presupuestoHoras: presupuesto
        });

        document.getElementById('modalGestionDeptos').remove();
        this.mostrarModalGestión();
    }

    /**
     * Eliminar departamento
     */
    static eliminarDepartamento(localId, deptId) {
        const local = GestorLocales.locales.find(l => l.id === localId);
        if (!local) return;

        const idx = local.departamentos?.findIndex(d => d.id === deptId) ?? -1;
        if (idx >= 0) {
            const deptEliminado = local.departamentos.splice(idx, 1)[0];
            GestorLocales.guardarLocales();
            NotificationSystem.show(`✅ Departamento '${deptEliminado.nombre}' eliminado`, 'success');
        }
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// CONSOLIDADOR DE REPORTES
// ═════════════════════════════════════════════════════════════════════════════

class ConsolidadorReportes {
    /**
     * Consolidar reportes de múltiples locales
     */
    static consolidarReportesRotacion(localesIds = null) {
        const locales = localesIds
            ? GestorLocales.locales.filter(l => localesIds.includes(l.id))
            : GestorLocales.locales;

        const reporteConsolidado = {
            titulo: 'Reporte Consolidado - Múltiples Locales',
            fecha: new Date().toLocaleDateString('es-ES'),
            locales: locales.map(local => {
                const empleadosLocal = GestorLocales.obtenerEmpleadosDelLocal(local.id);
                return {
                    nombre: local.nombre,
                    ciudad: local.ciudad,
                    reporteRotacion: GeneradorReportes.generarReporteRotacion(
                        AppState.scheduleData,
                        empleadosLocal
                    )
                };
            }),
            resumenGlobal: {}
        };

        // Calcular resumen global
        let totalEmpleados = 0;
        let totalHoras = 0;
        let totalTurnosNoche = 0;

        reporteConsolidado.locales.forEach(localReport => {
            totalEmpleados += localReport.reporteRotacion.empleados.length;
            localReport.reporteRotacion.empleados.forEach(emp => {
                totalHoras += emp.horasTotales || 0;
                totalTurnosNoche += emp.turnos?.noche || 0;
            });
        });

        reporteConsolidado.resumenGlobal = {
            totalLocales: locales.length,
            totalEmpleados,
            totalHoras,
            promedioHorasPorLocal: totalEmpleados > 0 ? totalHoras / totalEmpleados : 0,
            totalTurnosNoche
        };

        return reporteConsolidado;
    }

    /**
     * Analizar comparativo entre locales
     */
    static analizarComparativoLocales() {
        const comparativo = {
            fecha: new Date().toLocaleDateString('es-ES'),
            locales: {}
        };

        GestorLocales.locales.forEach(local => {
            const empleados = GestorLocales.obtenerEmpleadosDelLocal(local.id);
            const reporte = GeneradorReportes.generarReporteRotacion(
                AppState.scheduleData,
                empleados
            );

            comparativo.locales[local.nombre] = {
                ciudad: local.ciudad,
                totalEmpleados: empleados.length,
                horasPromedio: reporte.empleados.reduce((sum, e) => sum + (e.horasTotales || 0), 0) / (empleados.length || 1),
                turnosNochePromedio: reporte.empleados.reduce((sum, e) => sum + (e.turnos?.noche || 0), 0) / (empleados.length || 1),
                equidad: BalanceadorTurnos.calcularEquidad(AppState.scheduleData)
            };
        });

        return comparativo;
    }

    /**
     * Exportar reportes consolidados a HTML
     */
    static exportarReportesConsolidadosHTML() {
        const reporte = this.consolidarReportesRotacion();
        const comparativo = this.analizarComparativoLocales();

        let html = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Reporte Consolidado - Múltiples Locales</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f7fa; }
                    .header { text-align: center; margin-bottom: 30px; }
                    h1 { color: #2c3e50; }
                    .local-section { background: white; padding: 20px; margin-bottom: 20px; border-radius: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                    th { background: #3498db; color: white; }
                    .comparativo { background: white; padding: 20px; border-radius: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📊 Reporte Consolidado - Múltiples Locales</h1>
                    <p>Fecha: ${reporte.fecha}</p>
                </div>

                <div class="comparativo">
                    <h2>📈 Comparativo de Locales</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Local</th>
                                <th>Ciudad</th>
                                <th>Empleados</th>
                                <th>Horas Promedio</th>
                                <th>Turnos Noche Promedio</th>
                                <th>Equidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(comparativo.locales).map(([nombre, datos]) => `
                                <tr>
                                    <td><strong>${nombre}</strong></td>
                                    <td>${datos.ciudad}</td>
                                    <td>${datos.totalEmpleados}</td>
                                    <td>${datos.horasPromedio.toFixed(1)}</td>
                                    <td>${datos.turnosNochePromedio.toFixed(1)}</td>
                                    <td>${(datos.equidad * 100).toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                ${reporte.locales.map(local => `
                    <div class="local-section">
                        <h2>🏢 ${local.nombre} - ${local.ciudad}</h2>
                        <p>Total de empleados: ${local.reporteRotacion.empleados.length}</p>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Empleado</th>
                                    <th>Mañana</th>
                                    <th>Tarde</th>
                                    <th>Noche</th>
                                    <th>Horas Totales</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${local.reporteRotacion.empleados.map(emp => `
                                    <tr>
                                        <td><strong>${emp.nombre}</strong></td>
                                        <td>${emp.turnos?.mañana || 0}</td>
                                        <td>${emp.turnos?.tarde || 0}</td>
                                        <td>${emp.turnos?.noche || 0}</td>
                                        <td>${emp.horasTotales || 0}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}

                <script>
                    window.print();
                </script>
            </body>
            </html>
        `;

        const ventana = window.open('', 'reporteConsolidado', 'width=1200,height=800');
        ventana.document.write(html);
        ventana.document.close();
    }
}

// ═════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN AL CARGAR EL MÓDULO
// ═════════════════════════════════════════════════════════════════════════════

function inicializarSoporteMultiLocal() {
    if (typeof GestorLocales !== 'undefined') {
        GestorLocales.inicializarLocales();
        GestorLocales.actualizarSelectLocal();
        console.log('✅ Módulo de soporte multi-local inicializado');
    }
}

// Ejecutar inmediatamente si el DOM está listo, o esperar a DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSoporteMultiLocal);
} else {
    inicializarSoporteMultiLocal();
}

console.log('✅ Módulo soporte-multilocal.js cargado correctamente');
