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
                <div class="modal-content" style="max-width: 950px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                    <!-- ENCABEZADO -->
                    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; border-radius: 16px 16px 0 0; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">📍 Gestor de Múltiples Sedes</h2>
                        <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')" style="background: rgba(255,255,255,0.2); color: white; border: none; width: 40px; height: 40px; border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">✕</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 30px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                            <!-- Crear Nueva Sede -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.08) 100%); border-radius: 12px; border-left: 4px solid #8b5cf6;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">➕ Crear Nueva Sede</h3>
                                <input type="text" id="inputNombreSede" placeholder="Nombre de la sede" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                <input type="text" id="inputUbicacionSede" placeholder="Ubicación geográfica" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                <button onclick="ControlesSemana4.crearSede()" style="width: 100%; padding: 12px; margin-top: 16px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(139, 92, 246, 0.3)'">Crear Sede</button>
                            </div>
                            
                            <!-- Sedes Disponibles -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(30, 64, 175, 0.08) 100%); border-radius: 12px; border-left: 4px solid #3b82f6;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">🏢 Sedes Disponibles</h3>
                                <div id="listaSedes" style="max-height: 240px; overflow-y: auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: white;">
                                    <div style="color: #94a3b8; text-align: center; padding: 20px;">Cargando...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Asignar Empleado -->
                        <div style="padding: 24px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.08) 100%); border-radius: 12px; border-left: 4px solid #22c55e;">
                            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">👤 Asignar Empleado a Sede</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
                                <select id="selectEmpleadoAsignar" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; cursor: pointer;" onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <select id="selectSedeAsignar" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease; cursor: pointer;" onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar sede</option>
                                </select>
                                <input type="number" id="inputSalario" placeholder="Salario" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                            </div>
                            <button onclick="ControlesSemana4.asignarEmpleado()" style="width: 100%; padding: 12px; margin-top: 12px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(34, 197, 94, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(34, 197, 94, 0.3)'">Asignar Empleado</button>
                        </div>

                        <!-- Reportes -->
                        <div style="padding: 24px; margin-top: 24px; background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.08) 100%); border-radius: 12px; border-left: 4px solid #f43f5e;">
                            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">📊 Reportes</h3>
                            <button onclick="ControlesSemana4.generarReporteComparativo()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(244, 63, 94, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(244, 63, 94, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(244, 63, 94, 0.3)'">📈 Reporte Comparativo de Sedes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modal Calendario
        const modalCalendario = `
            <div id="modalCalendario" class="modal">
                <div class="modal-content" style="max-width: 950px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                    <!-- ENCABEZADO -->
                    <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; border-radius: 16px 16px 0 0; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">📅 Integración de Calendario</h2>
                        <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')" style="background: rgba(255,255,255,0.2); color: white; border: none; width: 40px; height: 40px; border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">✕</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 30px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                            <!-- Festivos -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%); border-radius: 12px; border-left: 4px solid #0ea5e9;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">🎉 Festivos España 2025</h3>
                                <div id="listaFestivos" style="max-height: 280px; overflow-y: auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: white;">
                                    <div style="color: #94a3b8; text-align: center; padding: 20px;">Cargando...</div>
                                </div>
                            </div>
                            
                            <!-- Exportar iCal -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.08) 100%); border-radius: 12px; border-left: 4px solid #22c55e;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">📥 Exportar Calendario iCal</h3>
                                <select id="selectEmpleadoICAL" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <select id="selectMesICAL" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#22c55e'; this.style.boxShadow='0 0 0 3px rgba(34, 197, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                </select>
                                <button onclick="ControlesSemana4.descargarICAL()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(34, 197, 94, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(34, 197, 94, 0.3)'">📥 Descargar iCal</button>
                            </div>
                        </div>

                        <!-- Agregar Evento Especial -->
                        <div style="padding: 24px; background: linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.08) 100%); border-radius: 12px; border-left: 4px solid #f43f5e;">
                            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">➕ Agregar Evento Especial</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <select id="selectEmpleadoEvento" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f43f5e'; this.style.boxShadow='0 0 0 3px rgba(244, 63, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <input type="date" id="inputFechaEvento" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f43f5e'; this.style.boxShadow='0 0 0 3px rgba(244, 63, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                            </div>
                            <input type="text" id="inputTipoEvento" placeholder="Tipo (reunión, capacitación, etc)" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f43f5e'; this.style.boxShadow='0 0 0 3px rgba(244, 63, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                            <textarea id="inputDescEvento" placeholder="Descripción del evento" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; min-height: 70px; transition: all 0.3s ease; resize: vertical;" onfocus="this.style.borderColor='#f43f5e'; this.style.boxShadow='0 0 0 3px rgba(244, 63, 94, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'"></textarea>
                            <button onclick="ControlesSemana4.agregarEvento()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(244, 63, 94, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(244, 63, 94, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(244, 63, 94, 0.3)'">➕ Agregar Evento</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Modal Notificaciones
        const modalNotificaciones = `
            <div id="modalNotificaciones" class="modal">
                <div class="modal-content" style="max-width: 950px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
                    <!-- ENCABEZADO -->
                    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 16px 16px 0 0; color: white; display: flex; justify-content: space-between; align-items: center;">
                        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">🔔 Sistema de Notificaciones</h2>
                        <button class="close-btn" onclick="this.closest('.modal').classList.remove('active')" style="background: rgba(255,255,255,0.2); color: white; border: none; width: 40px; height: 40px; border-radius: 8px; font-size: 20px; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">✕</button>
                    </div>
                    
                    <div class="modal-body" style="padding: 30px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                            <!-- Configurar Preferencias -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%); border-radius: 12px; border-left: 4px solid #f59e0b;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">⚙️ Configurar Preferencias</h3>
                                <select id="selectEmpleadoNotif" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <input type="email" id="inputEmailNotif" placeholder="Correo electrónico" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                <input type="tel" id="inputTelfNotif" placeholder="Teléfono (WhatsApp)" style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; transition: all 0.3s ease;" onfocus="this.style.borderColor='#f59e0b'; this.style.boxShadow='0 0 0 3px rgba(245, 158, 11, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                <div style="margin: 12px 0; padding: 12px; background: white; border-radius: 8px; border: 1px solid #cbd5e1;">
                                    <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer; color: #475569;">
                                        <input type="checkbox" id="checkPush" style="margin-right: 8px; cursor: pointer;"> 
                                        <span>📲 Push Notifications</span>
                                    </label>
                                    <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer; color: #475569;">
                                        <input type="checkbox" id="checkEmail" style="margin-right: 8px; cursor: pointer;"> 
                                        <span>📧 Email</span>
                                    </label>
                                    <label style="display: flex; align-items: center; margin: 8px 0; cursor: pointer; color: #475569;">
                                        <input type="checkbox" id="checkSMS" style="margin-right: 8px; cursor: pointer;"> 
                                        <span>💬 SMS/WhatsApp</span>
                                    </label>
                                </div>
                                <button onclick="ControlesSemana4.configurarPreferencias()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(245, 158, 11, 0.3)'">💾 Guardar Preferencias</button>
                            </div>
                            
                            <!-- Historial -->
                            <div style="padding: 24px; background: linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(2, 132, 199, 0.08) 100%); border-radius: 12px; border-left: 4px solid #0ea5e9;">
                                <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">📜 Historial de Notificaciones</h3>
                                <div id="historialNotif" style="max-height: 280px; overflow-y: auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: white; font-size: 13px;">
                                    <div style="color: #94a3b8; text-align: center; padding: 20px;">Cargando...</div>
                                </div>
                            </div>
                        </div>

                        <!-- Enviar Notificación Manual -->
                        <div style="padding: 24px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(109, 40, 217, 0.08) 100%); border-radius: 12px; border-left: 4px solid #8b5cf6;">
                            <h3 style="margin: 0 0 16px 0; color: #1e293b; font-size: 16px; font-weight: 700;">📤 Enviar Notificación Manual</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <select id="selectEmpleadoEnviar" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option>Seleccionar empleado</option>
                                </select>
                                <select id="selectTipoNotif" style="padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'">
                                    <option value="cambio">📋 Cambio de Turno</option>
                                    <option value="recordatorio">⏰ Recordatorio</option>
                                    <option value="alerta">🚨 Alerta</option>
                                </select>
                            </div>
                            <textarea id="inputMensajeNotif" placeholder="Escribe el mensaje a enviar..." style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; min-height: 80px; transition: all 0.3s ease; resize: vertical;" onfocus="this.style.borderColor='#8b5cf6'; this.style.boxShadow='0 0 0 3px rgba(139, 92, 246, 0.1)'" onblur="this.style.borderColor='#cbd5e1'; this.style.boxShadow='none'"></textarea>
                            <button onclick="ControlesSemana4.enviarNotificacionManual()" style="width: 100%; padding: 12px; margin-top: 12px; background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);" onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(139, 92, 246, 0.3)'">📤 Enviar Notificación</button>
                        </div>
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
