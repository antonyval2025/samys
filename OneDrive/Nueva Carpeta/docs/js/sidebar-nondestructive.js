/**
 * SIDEBAR NO-DESTRUCTIVO - JavaScript
 * Sistema de navegación lateral que NO reorg aniza HTML
 * Cada botón ejecuta funciones existentes
 */

class SidebarManager {
    static isInitialized = false;
    static isExpanded = false;

    /**
     * Inicializar sidebar después de que la página haya cargado
     * IMPORTANTE: Esto se ejecuta DESPUÉS de DOMContentLoaded
     */
    static init() {
        if (this.isInitialized) {
            console.log('⚠️ Sidebar ya inicializado');
            return;
        }

        console.log('🚀 Inicializando Sidebar No-Destructivo...');
        
        // Inyectar HTML del sidebar
        this.injectHTML();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Marcar como inicializado
        this.isInitialized = true;
        console.log('✅ Sidebar inicializado exitosamente');
    }

    /**
     * Inyectar HTML del sidebar al final del body
     */
    static injectHTML() {
        const sidebarHTML = `
        <div id="app-sidebar" class="app-sidebar-panel">
            <!-- Toggle Button -->
            <button class="sidebar-toggle" id="sidebarToggle" title="Expandir/Contraer menú">
                ☰
            </button>

            <!-- Navigation -->
            <nav class="sidebar-nav">
                <!-- Grupo: Vistas Principales -->
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Vistas</div>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-cuadrante-general"
                        onclick="SidebarManager.clickTab('tab-general')"
                        title="Cuadrante General"
                    >📊</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-informe-individual"
                        onclick="SidebarManager.clickTab('tab-individual')"
                        title="Informe Individual"
                    >📈</button>
                </div>

                <div class="sidebar-divider"></div>

                <!-- Grupo: Gestión -->
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Gestión</div>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-empleados"
                        onclick="SidebarManager.openEmployeeManager()"
                        title="Gestionar Empleados"
                    >👥</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-departamentos"
                        onclick="SidebarManager.openDepartmentManager()"
                        title="Gestionar Departamentos"
                    >🏢</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-localidades"
                        onclick="SidebarManager.openLocationManager()"
                        title="Gestionar Localidades"
                    >📍</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-turnos"
                        onclick="SidebarManager.openTurnoTypeManager()"
                        title="Gestionar Tipos de Turno"
                    >⏰</button>
                </div>

                <div class="sidebar-divider"></div>

                <!-- Grupo: Acciones -->
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Acciones</div>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-generar"
                        onclick="SidebarManager.regenerateSchedule()"
                        title="Regenerar Cuadrante"
                    >📋</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-edicion-masiva"
                        onclick="SidebarManager.openBulkEdit()"
                        title="Edición Masiva (desde Cuadrante Individual)"
                    >📅</button>
                </div>

                <div class="sidebar-divider"></div>

                <!-- Grupo: Utilidades -->
                <div class="sidebar-group">
                    <div class="sidebar-group-title">Utilidades</div>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-chat"
                        onclick="SidebarManager.openChat()"
                        title="Asistente IA"
                    >🤖</button>
                    <button 
                        class="sidebar-nav-btn" 
                        id="btn-debug"
                        onclick="SidebarManager.showDebug()"
                        title="Información de Debug"
                    >🔍</button>
                </div>
            </nav>

            <!-- Footer -->
            <div class="sidebar-footer" id="sidebarFooter">
                v10
            </div>
        </div>
        `;

        // Inyectar al final del body (DESPUÉS de todo el contenido)
        document.body.insertAdjacentHTML('beforeend', sidebarHTML);
        console.log('✓ HTML del sidebar inyectado');
    }

    /**
     * Configurar event listeners
     */
    static setupEventListeners() {
        const sidebar = document.getElementById('app-sidebar');

        // Hover: Expandir al pasar el mouse
        if (sidebar) {
            sidebar.addEventListener('mouseenter', () => {
                // El CSS se encarga de expandir automáticamente con :hover
                console.log('🖱️ Mouse sobre sidebar → expandido');
            });

            sidebar.addEventListener('mouseleave', () => {
                // El CSS contrae automáticamente al salir
                console.log('🖱️ Mouse fuera del sidebar → contraído');
            });
        }

        // Cerrar sidebar al hacer click en botones (en mobile)
        const buttons = document.querySelectorAll('.sidebar-nav-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // En móvil, cerrar sidebar automáticamente
                if (window.innerWidth < 768) {
                    this.collapseSidebar();
                }
            });
        });

        // Actualizar botón activo según tab
        this.updateActiveButton();

        console.log('✓ Event listeners configurados (Hover automático activado)');
    }

    /**
     * Toggle: expandir/contraer sidebar
     */
    static toggleSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('expanded');
            this.isExpanded = sidebar.classList.contains('expanded');
            console.log(`📂 Sidebar ${this.isExpanded ? 'expandido' : 'colapsado'}`);
        }
    }

    /**
     * Expandir sidebar
     */
    static expandSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && !sidebar.classList.contains('expanded')) {
            sidebar.classList.add('expanded');
            this.isExpanded = true;
        }
    }

    /**
     * Contraer sidebar
     */
    static collapseSidebar() {
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar && sidebar.classList.contains('expanded')) {
            sidebar.classList.remove('expanded');
            this.isExpanded = false;
        }
    }

    /**
     * Hacer click en un tab (sin reorganizar HTML)
     * @param {string} tabId - ID del tab (ej: 'tab-general')
     */
    static clickTab(tabId) {
        const tabButton = document.querySelector(`[data-tab="${tabId}"]`);
        if (tabButton) {
            console.log(`📑 Cambiando a tab: ${tabId}`);
            tabButton.click();
            this.updateActiveButton();
        } else {
            console.warn(`⚠️ Tab no encontrado: ${tabId}`);
        }
    }

    /**
     * Cambiar mes (llamar función existente)
     * @param {number} delta - +1 siguiente, -1 anterior
     */
    static changeMonth(delta) {
        console.log(`📅 Cambiando mes: ${delta > 0 ? 'siguiente' : 'anterior'}`);
        if (typeof DateUtils !== 'undefined' && DateUtils.cambiarMes) {
            DateUtils.cambiarMes(delta);
        } else {
            console.warn('⚠️ DateUtils no disponible');
        }
    }

    /**
     * Abrir gestor de empleados
     */
    static openEmployeeManager() {
        console.log('👥 Abriendo Gestor de Empleados...');
        if (typeof EmployeeManager !== 'undefined' && EmployeeManager.abrirModal) {
            EmployeeManager.abrirModal();
        } else {
            console.warn('⚠️ EmployeeManager no disponible');
        }
    }

    /**
     * Abrir gestor de departamentos
     */
    static openDepartmentManager() {
        console.log('🏢 Abriendo Gestor de Departamentos...');
        if (typeof DepartmentManager !== 'undefined' && DepartmentManager.abrirModal) {
            DepartmentManager.abrirModal();
        } else {
            console.warn('⚠️ DepartmentManager no disponible');
        }
    }

    /**
     * Abrir gestor de localidades
     */
    static openLocationManager() {
        console.log('📍 Abriendo Gestor de Localidades...');
        if (typeof LocationManager !== 'undefined' && LocationManager.abrirModal) {
            LocationManager.abrirModal();
        } else {
            console.warn('⚠️ LocationManager no disponible');
        }
    }

    /**
     * Abrir gestor de tipos de turno
     */
    static openTurnoTypeManager() {
        console.log('⏰ Abriendo Gestor de Tipos de Turno...');
        if (typeof TurnoTypeManager !== 'undefined' && TurnoTypeManager.abrirModal) {
            TurnoTypeManager.abrirModal();
        } else {
            console.warn('⚠️ TurnoTypeManager no disponible');
        }
    }

    /**
     * Regenerar cuadrante
     */
    static regenerateSchedule() {
        console.log('📋 Regenerando cuadrante...');
        if (typeof TurnoManager !== 'undefined' && TurnoManager.reiniciarDatos) {
            TurnoManager.reiniciarDatos();
            NotificationSystem?.show?.('Cuadrante regenerado', 'success');
        } else {
            console.warn('⚠️ TurnoManager no disponible');
        }
    }

    /**
     * Abrir edición masiva
     */
    static openBulkEdit() {
        console.log('📅 Abriendo Edición Masiva...');
        
        // Si hay un empleado seleccionado (estamos en cuadrante individual)
        if (typeof AppState !== 'undefined' && AppState.selectedEmployee) {
            console.log('📅 Abriendo desde CUADRANTE INDIVIDUAL');
            if (typeof EdicionMasiva !== 'undefined' && EdicionMasiva.abrirModalDesdeIndividual) {
                EdicionMasiva.abrirModalDesdeIndividual();
            } else {
                console.warn('⚠️ abrirModalDesdeIndividual no disponible');
            }
        } else {
            // Si no hay empleado (estamos en cuadrante general)
            console.log('📅 Abriendo desde CUADRANTE GENERAL');
            if (typeof EdicionMasiva !== 'undefined' && EdicionMasiva.abrirModal) {
                EdicionMasiva.abrirModal();
            } else if (typeof TurnoEditor !== 'undefined' && TurnoEditor.mostrarModalEdicionMasiva) {
                TurnoEditor.mostrarModalEdicionMasiva();
            } else {
                console.warn('⚠️ Edición Masiva no disponible');
            }
        }
    }

    /**
     * Abrir Chat/IA
     */
    static openChat() {
        console.log('🤖 Abriendo Chat...');
        if (typeof ChatBot !== 'undefined' && ChatBot.abrirModal) {
            ChatBot.abrirModal();
        } else {
            console.warn('⚠️ ChatBot no disponible');
        }
    }

    /**
     * Mostrar información de debug
     */
    static showDebug() {
        console.log('🔍 Mostrando información de debug...');
        const debugInfo = {
            empleados: empleados?.length || 0,
            turnos: AppState?.scheduleData?.size || 0,
            localStorage: localStorage.getItem('turnosAppState')?.length || 0,
            isSidebarExpanded: this.isExpanded,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        console.log('📊 Estado:', debugInfo);
        alert(`📊 DEBUG INFO:\n\n${JSON.stringify(debugInfo, null, 2)}\n\nVer consola (F12) para más detalles`);
    }

    /**
     * Actualizar botón activo según el tab actual
     */
    static updateActiveButton() {
        // Remover clase active de todos los botones
        document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Agregar clase active al botón del tab actual
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab?.id === 'tab-general') {
            document.getElementById('btn-cuadrante-general')?.classList.add('active');
        } else if (activeTab?.id === 'tab-individual') {
            document.getElementById('btn-informe-individual')?.classList.add('active');
        }
    }

    /**
     * Método para agregar notificación visual a un botón
     * @param {string} buttonId - ID del botón
     */
    static notifyButton(buttonId) {
        const btn = document.getElementById(buttonId);
        if (btn) {
            btn.classList.add('notify');
            setTimeout(() => btn.classList.remove('notify'), 3000);
        }
    }

    /**
     * Registrar un click en botón del sidebar (para analytics, si es necesario)
     * @param {string} action - Nombre de la acción
     */
    static logAction(action) {
        console.log(`[SIDEBAR] Acción ejecutada: ${action}`);
        // Aquí se podría enviar a analytics si es necesario
    }
}

/**
 * Inicializar sidebar cuando la página está lista
 * Se ejecuta DESPUÉS de que todas las librerías estén cargadas
 */
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que todo está cargado
    setTimeout(() => {
        SidebarManager.init();
    }, 500);
});

// Hacer SidebarManager accesible desde consola
window.SidebarManager = SidebarManager;

console.log('✓ Script de Sidebar cargado y listo');
