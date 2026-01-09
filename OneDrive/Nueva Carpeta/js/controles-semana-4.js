/**
 * SEMANA 4 - Controles para Sidebar
 * Interfaz de usuario para GestorMultiLocal, IntegracionCalendario, SistemaNotificaciones
 */

class ControlesSemana4 {
    static init() {
        this.agregarBotonesSidebar();
        this.agregarModales();
    }

    static agregarBotonesSidebar() {
        const sidebar = document.querySelector('.sidebar-container');
        if (!sidebar) return;

        const sectionHTML = `
            <div class="sidebar-section semana4">
                <div class="sidebar-section-title">🌐 Escalabilidad</div>
                
                <button class="sidebar-btn semana4" onclick="ControlesSemana4.abrirGestorMultiLocal()">
                    <span style="font-size: 16px;">📍</span>
                    <span>Múltiples Sedes</span>
                </button>
                
                <button class="sidebar-btn semana4" onclick="ControlesSemana4.abrirCalendario()">
                    <span style="font-size: 16px;">📅</span>
                    <span>Calendario</span>
                </button>
                
                <button class="sidebar-btn semana4" onclick="ControlesSemana4.abrirNotificaciones()">
                    <span style="font-size: 16px;">🔔</span>
                    <span>Notificaciones</span>
                </button>
            </div>
        `;

        sidebar.insertAdjacentHTML('beforeend', sectionHTML);
        this.aplicarEstilosSemana4();
    }

    static aplicarEstilosSemana4() {
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-section.semana4 {
                border-bottom: 2px solid rgba(139, 92, 246, 0.3);
            }

            .sidebar-btn.semana4 {
                border-left: 3px solid #8b5cf6;
                background: rgba(139, 92, 246, 0.08);
            }

            .sidebar-btn.semana4:hover {
                background: rgba(139, 92, 246, 0.15);
                border-left-color: #a78bfa;
            }

            .sidebar-section-title {
                border-left: 3px solid #8b5cf6;
                color: #8b5cf6;
            }
        `;
        document.head.appendChild(style);
    }

    static abrirGestorMultiLocal() {
        const modal = document.getElementById('modalGestorMultiLocal');
        if (modal) {
            modal.classList.add('active');
            this.actualizarListaSedes();
        }
    }

    static abrirCalendario() {
        const modal = document.getElementById('modalCalendario');
        if (modal) {
            modal.classList.add('active');
            this.actualizarFestivos();
        }
    }

    static abrirNotificaciones() {
        const modal = document.getElementById('modalNotificaciones');
        if (modal) {
            modal.classList.add('active');
            this.actualizarHistorialNotificaciones();
        }
    }

    static agregarModales() {
        const mainContent = document.querySelector('.main-content') || document.body;

        // Modal Gestor MultiLocal
        const modalMultiLocal = `
            <div id="modalGestorMultiLocal" class="modal">
                <div class="modal-content">
                    <h2>📍 Gestor de Múltiples Sedes <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4>Crear Nueva Sede</h4>
                                <input type="text" id="inputNombreSede" placeholder="Nombre" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                <input type="text" id="inputUbicacionSede" placeholder="Ubicación" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                <button onclick="ControlesSemana4.crearSede()" style="width: 100%; margin-top: 10px;">Crear Sede</button>
                            </div>
                            
                            <div>
                                <h4>Sedes Disponibles</h4>
                                <div id="listaSedes" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                                    Cargando...
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Asignar Empleado a Sede</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                                <select id="selectEmpleadoAsignar" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Empleado</option>
                                </select>
                                <select id="selectSedeAsignar" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Sede</option>
                                </select>
                                <input type="number" id="inputSalario" placeholder="Salario" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <button onclick="ControlesSemana4.asignarEmpleado()" style="width: 100%; margin-top: 10px;">Asignar</button>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Reportes</h4>
                            <button onclick="ControlesSemana4.generarReporteComparativo()" style="width: 100%; margin-top: 10px;">📊 Reporte Comparativo de Sedes</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalGestorMultiLocal').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Modal Calendario
        const modalCalendario = `
            <div id="modalCalendario" class="modal">
                <div class="modal-content">
                    <h2>📅 Integración de Calendario <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4>Festivos España 2025</h4>
                                <div id="listaFestivos" style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px;">
                                    Cargando...
                                </div>
                            </div>
                            
                            <div>
                                <h4>Exportar iCal</h4>
                                <select id="selectEmpleadoICAL" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <select id="selectMesICAL" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                </select>
                                <button onclick="ControlesSemana4.descargarICAL()" style="width: 100%; margin-top: 10px;">📥 Descargar iCal</button>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Agregar Evento Especial</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <select id="selectEmpleadoEvento" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Empleado</option>
                                </select>
                                <input type="date" id="inputFechaEvento" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            </div>
                            <input type="text" id="inputTipoEvento" placeholder="Tipo (reunion, capacitación, etc)" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                            <textarea id="inputDescEvento" placeholder="Descripción" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;"></textarea>
                            <button onclick="ControlesSemana4.agregarEvento()" style="width: 100%; margin-top: 10px;">Agregar Evento</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalCalendario').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        // Modal Notificaciones
        const modalNotificaciones = `
            <div id="modalNotificaciones" class="modal">
                <div class="modal-content">
                    <h2>🔔 Sistema de Notificaciones <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')">✕</button></h2>
                    
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4>Configurar Preferencias</h4>
                                <select id="selectEmpleadoNotif" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <input type="email" id="inputEmailNotif" placeholder="Email" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                <input type="tel" id="inputTelfNotif" placeholder="Teléfono" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;">
                                <div style="margin: 10px 0;">
                                    <label><input type="checkbox" id="checkPush"> Push</label>
                                    <label><input type="checkbox" id="checkEmail"> Email</label>
                                    <label><input type="checkbox" id="checkSMS"> SMS</label>
                                </div>
                                <button onclick="ControlesSemana4.configurarPreferencias()" style="width: 100%; margin-top: 10px;">Guardar Preferencias</button>
                            </div>
                            
                            <div>
                                <h4>Historial de Notificaciones</h4>
                                <div id="historialNotif" style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-size: 12px;">
                                    Cargando...
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <h4>Enviar Notificación Manual</h4>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                <select id="selectEmpleadoEnviar" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option>Empleado</option>
                                </select>
                                <select id="selectTipoNotif" style="padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                    <option value="cambio">Cambio de Turno</option>
                                    <option value="recordatorio">Recordatorio</option>
                                    <option value="alerta">Alerta</option>
                                </select>
                            </div>
                            <textarea id="inputMensajeNotif" placeholder="Mensaje" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;"></textarea>
                            <button onclick="ControlesSemana4.enviarNotificacionManual()" style="width: 100%; margin-top: 10px;">📤 Enviar Notificación</button>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button onclick="document.getElementById('modalNotificaciones').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        mainContent.insertAdjacentHTML('beforeend', modalMultiLocal);
        mainContent.insertAdjacentHTML('beforeend', modalCalendario);
        mainContent.insertAdjacentHTML('beforeend', modalNotificaciones);
    }

    // ============ MÉTODOS GestorMultiLocal ============
    static crearSede() {
        const nombre = document.getElementById('inputNombreSede')?.value;
        const ubicacion = document.getElementById('inputUbicacionSede')?.value;

        if (!nombre) {
            alert('Ingresa nombre de la sede');
            return;
        }

        const resultado = GestorMultiLocal.crearSede(nombre, ubicacion);
        alert(resultado.mensaje);
        this.actualizarListaSedes();
        document.getElementById('inputNombreSede').value = '';
        document.getElementById('inputUbicacionSede').value = '';
    }

    static actualizarListaSedes() {
        const sedes = GestorMultiLocal.obtenerSedes();
        const html = sedes.map(sede => `
            <div style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${sede.nombre}</strong><br>
                📍 ${sede.ubicacion}<br>
                <small>Empleados: ${sede.empleados.length}</small>
            </div>
        `).join('');

        const elemento = document.getElementById('listaSedes');
        if (elemento) elemento.innerHTML = html || 'Sin sedes';

        this.actualizarSelectSedes();
        this.llenarSelectEmpleados();
    }

    static actualizarSelectSedes() {
        const sedes = GestorMultiLocal.obtenerSedes();
        const select = document.getElementById('selectSedeAsignar');
        if (select) {
            select.innerHTML = '<option>Seleccionar sede</option>' +
                sedes.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('');
        }
    }

    static llenarSelectEmpleados() {
        // Llenar selectEmpleadoAsignar
        const selectAsignar = document.getElementById('selectEmpleadoAsignar');
        if (selectAsignar && typeof empleados !== 'undefined' && empleados.length > 0) {
            selectAsignar.innerHTML = '<option>Seleccionar empleado</option>' +
                empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }

        // Llenar selectEmpleadoEvento
        const selectEvento = document.getElementById('selectEmpleadoEvento');
        if (selectEvento && typeof empleados !== 'undefined' && empleados.length > 0) {
            selectEvento.innerHTML = '<option>Seleccionar empleado</option>' +
                empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }

        // Llenar selectEmpleadoNotif
        const selectNotif = document.getElementById('selectEmpleadoNotif');
        if (selectNotif && typeof empleados !== 'undefined' && empleados.length > 0) {
            selectNotif.innerHTML = '<option>Seleccionar empleado</option>' +
                empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }

        // Llenar selectEmpleadoEnviar
        const selectEnviar = document.getElementById('selectEmpleadoEnviar');
        if (selectEnviar && typeof empleados !== 'undefined' && empleados.length > 0) {
            selectEnviar.innerHTML = '<option>Seleccionar empleado</option>' +
                empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }

        // Llenar selectEmpleadoICAL
        const selectICAL = document.getElementById('selectEmpleadoICAL');
        if (selectICAL && typeof empleados !== 'undefined' && empleados.length > 0) {
            selectICAL.innerHTML = '<option>Seleccionar empleado</option>' +
                empleados.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
        }
    }

    static asignarEmpleado() {
        const empleadoId = document.getElementById('selectEmpleadoAsignar')?.value;
        const sedeId = document.getElementById('selectSedeAsignar')?.value;
        const salario = parseFloat(document.getElementById('inputSalario')?.value || 0);

        if (!empleadoId || sedeId === 'Seleccionar sede') {
            alert('Selecciona empleado y sede');
            return;
        }

        const resultado = GestorMultiLocal.asignarEmpleadoSede(parseInt(empleadoId), parseInt(sedeId), salario);
        alert(resultado.mensaje);
        this.actualizarListaSedes();
    }

    static generarReporteComparativo() {
        const resultado = GestorMultiLocal.generarReporteComparativo();
        if (resultado.exito) {
            const reporte = resultado.reporte.resumen.map(s => 
                `${s.sede}: ${s.empleados} empleados`
            ).join('\n');
            alert('📊 REPORTE DE SEDES\n\n' + reporte);
        }
    }

    // ============ MÉTODOS IntegracionCalendario ============
    static actualizarFestivos() {
        const festivos = IntegracionCalendario.obtenerFestivos();
        const html = festivos.map(f => `
            <div style="padding: 8px; border-bottom: 1px solid #eee;">
                <strong>${f.nombre}</strong><br>
                <small>${f.fecha}</small>
            </div>
        `).join('');

        const elemento = document.getElementById('listaFestivos');
        if (elemento) elemento.innerHTML = html;

        // Llenar select de meses para iCal
        this.llenarSelectMeses();
        this.llenarSelectEmpleados();
    }

    static llenarSelectMeses() {
        const selectMes = document.getElementById('selectMesICAL');
        if (selectMes) {
            const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            selectMes.innerHTML = meses.map((m, i) => 
                `<option value="${i + 1}">${m}</option>`
            ).join('');
            // Seleccionar mes actual por defecto
            const mesActual = new Date().getMonth() + 1;
            selectMes.value = mesActual;
        }
    }

    static descargarICAL() {
        const empleadoId = document.getElementById('selectEmpleadoICAL')?.value;
        const mes = document.getElementById('selectMesICAL')?.value;

        if (!empleadoId || empleadoId === 'Seleccionar empleado') {
            alert('Selecciona un empleado');
            return;
        }

        const resultado = IntegracionCalendario.descargarICAL(parseInt(empleadoId), parseInt(mes), 2025);
        if (resultado.exito) {
            alert('✅ iCal descargado');
        } else {
            alert('❌ ' + resultado.mensaje);
        }
    }

    static agregarEvento() {
        const empleadoId = document.getElementById('selectEmpleadoEvento')?.value;
        const fecha = document.getElementById('inputFechaEvento')?.value;
        const tipo = document.getElementById('inputTipoEvento')?.value;
        const desc = document.getElementById('inputDescEvento')?.value;

        if (!empleadoId || !fecha || !tipo) {
            alert('Rellena todos los campos');
            return;
        }

        const resultado = IntegracionCalendario.agregarEventoEspecial(parseInt(empleadoId), fecha, tipo, desc);
        alert(resultado.mensaje);
    }

    // ============ MÉTODOS SistemaNotificaciones ============
    static actualizarHistorialNotificaciones() {
        const resultado = SistemaNotificaciones.obtenerHistorial(null, 10);
        const html = resultado.historial.map(n => `
            <div style="padding: 8px; border-bottom: 1px solid #eee; font-size: 11px;">
                <strong>${n.textos.asunto}</strong><br>
                ${n.textos.body}<br>
                <small style="color: #999;">${new Date(n.timestamp).toLocaleString()}</small>
            </div>
        `).join('');

        const elemento = document.getElementById('historialNotif');
        if (elemento) elemento.innerHTML = html || 'Sin notificaciones';

        // Llenar selects de empleados y tipos de notificación
        this.llenarSelectEmpleados();
        this.llenarSelectTiposNotif();
    }

    static llenarSelectTiposNotif() {
        const selectTipo = document.getElementById('selectTipoNotif');
        if (selectTipo) {
            const tipos = [
                { value: 'cambio-turno', label: '📋 Cambio de Turno' },
                { value: 'recordatorio', label: '⏰ Recordatorio' },
                { value: 'alerta', label: '🚨 Alerta de Conflicto' }
            ];
            selectTipo.innerHTML = tipos.map(t => 
                `<option value="${t.value}">${t.label}</option>`
            ).join('');
        }
    }

    static configurarPreferencias() {
        const empleadoId = document.getElementById('selectEmpleadoNotif')?.value;
        const email = document.getElementById('inputEmailNotif')?.value;
        const telefono = document.getElementById('inputTelfNotif')?.value;
        const canales = [];

        if (document.getElementById('checkPush')?.checked) canales.push('push');
        if (document.getElementById('checkEmail')?.checked) canales.push('email');
        if (document.getElementById('checkSMS')?.checked) canales.push('sms');

        if (!empleadoId || empleadoId === 'Seleccionar empleado') {
            alert('Selecciona un empleado');
            return;
        }

        const resultado = SistemaNotificaciones.configurarPreferencias(parseInt(empleadoId), {
            email: email,
            telefono: telefono,
            canales: canales.length > 0 ? canales : ['push']
        });

        alert(resultado.mensaje);
    }

    static enviarNotificacionManual() {
        const empleadoId = document.getElementById('selectEmpleadoEnviar')?.value;
        const tipo = document.getElementById('selectTipoNotif')?.value;
        const mensaje = document.getElementById('inputMensajeNotif')?.value;

        if (!empleadoId || !mensaje) {
            alert('Rellena todos los campos');
            return;
        }

        let resultado;
        if (tipo === 'cambio') {
            resultado = SistemaNotificaciones.notificarCambioTurno(parseInt(empleadoId), '2025-01-15', 'mañana', 'tarde', 'Manual');
        } else if (tipo === 'recordatorio') {
            resultado = SistemaNotificaciones.enviarRecordatorioTurno(parseInt(empleadoId), '2025-01-15', 'noche', 1440);
        } else {
            resultado = SistemaNotificaciones.alertarConflicto(parseInt(empleadoId), 'Alerta Manual', mensaje);
        }

        alert(resultado.exito ? '✅ Notificación enviada' : '❌ ' + resultado.mensaje);
    }
}

// Inicializar cuando DOM está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ControlesSemana4.init());
} else {
    ControlesSemana4.init();
}
