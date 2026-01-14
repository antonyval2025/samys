/**
 * GESTOR DE SIDEBAR
 * Maneja la apertura, cierre y comportamiento del sidebar
 * Con soporte para hover-expand automático
 */

class SidebarManager {
    static isOpen = true;
    static isCollapsed = false;
    
    static init() {
        const sidebar = document.getElementById('sidebar-container');
        const toggle = document.querySelector('.sidebar-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', () => this.togglePermanent());
        }
        
        // Cerrar sidebar en móvil al hacer clic en botón
        const sidebarBtns = document.querySelectorAll('.sidebar-btn');
        sidebarBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.togglePermanent();
                }
            });
        });
        
        // Cerrar con Escape en móvil
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && window.innerWidth <= 768) {
                if (this.isOpen && this.isCollapsed) {
                    this.togglePermanent();
                }
            }
        });
    }
    
    // Toggle permanente (con botón ☰)
    static togglePermanent() {
        const sidebar = document.getElementById('sidebar-container');
        if (sidebar) {
            this.isCollapsed = !this.isCollapsed;
            if (this.isCollapsed) {
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-closed');
                document.body.classList.remove('sidebar-open');
            } else {
                sidebar.classList.remove('collapsed');
                document.body.classList.remove('sidebar-closed');
                document.body.classList.add('sidebar-open');
            }
        }
    }
    
    static open() {
        const sidebar = document.getElementById('sidebar-container');
        if (sidebar) {
            sidebar.classList.remove('collapsed');
            this.isCollapsed = false;
            document.body.classList.add('sidebar-open');
            document.body.classList.remove('sidebar-closed');
        }
    }
    
    static close() {
        const sidebar = document.getElementById('sidebar-container');
        if (sidebar) {
            sidebar.classList.add('collapsed');
            this.isCollapsed = true;
            document.body.classList.add('sidebar-closed');
            document.body.classList.remove('sidebar-open');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    SidebarManager.init();
});
