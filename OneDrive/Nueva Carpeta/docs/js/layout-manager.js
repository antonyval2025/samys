/**
 * LAYOUT MANAGER - Gestión de Sidebar y Navegación
 * ================================================
 * 
 * Controla:
 * - Activación/desactivación de items del sidebar
 * - Sincronización con modales existentes
 * - Responsividad y collapse
 * - Historial de navegación
 */

class LayoutManager {
  static initialized = false;

  /**
   * Estructura de navegación
   * Mapea items del sidebar con funcionalidades existentes
   */
  static navigationMap = {
    // GESTIÓN
    gestion: {
      label: "Gestión",
      icon: "📊",
      items: [
        {
          id: "empleados",
          label: "Empleados",
          icon: "👥",
          action: () => {
            if (typeof EmployeeManager !== "undefined" && EmployeeManager.abrirModal) {
              EmployeeManager.abrirModal();
            } else {
              console.error("❌ EmployeeManager.abrirModal no disponible");
              NotificationSystem?.show?.("Error: EmployeeManager no cargado", "error");
            }
          },
          badges: 0,
        },
        {
          id: "departamentos",
          label: "Departamentos",
          icon: "🏢",
          action: () => {
            if (typeof DepartmentManager !== "undefined" && DepartmentManager.abrirModal) {
              DepartmentManager.abrirModal();
            } else {
              console.warn("⚠️ DepartmentManager no disponible");
              NotificationSystem?.show?.("DepartmentManager no cargado", "warning");
            }
          },
          badges: 0,
        },
        {
          id: "parametros",
          label: "Parámetros",
          icon: "⚙️",
          action: () => {
            NotificationSystem?.show?.("Parámetros - Próximamente (v11.0)", "info");
            console.log("📅 Feature: Parámetros (planeado para v11.0)");
          },
          badges: 0,
        },
      ],
    },
    // CALENDARIO Y CUADRANTE
    calendario: {
      label: "Calendario",
      icon: "📅",
      items: [
        {
          id: "cuadrante-general",
          label: "Cuadrante General",
          icon: "📋",
          action: () => {
            const btn = document.querySelector("[data-tab='tab-general']");
            if (btn) {
              btn.click();
              setTimeout(() => {
                document.getElementById("tab-general")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 200);
            }
          },
          badges: 0,
        },
        {
          id: "informe-individual",
          label: "Informe Individual",
          icon: "📊",
          action: () => {
            // Abre el TAB del informe individual (con dropdown select)
            const btn = document.querySelector("[data-tab='tab-individual']");
            if (btn) {
              btn.click();
              setTimeout(() => {
                document.getElementById("tab-individual")?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 200);
            }
          },
          badges: 0,
        },
        {
          id: "edicion-masiva",
          label: "Edición Masiva",
          icon: "✏️",
          action: () => {
            if (typeof EdicionMasiva !== "undefined" && EdicionMasiva.abrirModal) {
              EdicionMasiva.abrirModal();
            } else {
              console.error("❌ EdicionMasiva.abrirModal no disponible");
              NotificationSystem?.show?.("Error: EdicionMasiva no cargado", "error");
            }
          },
          badges: 0,
        },
      ],
    },
    // REPORTES Y ANÁLISIS
    reportes: {
      label: "Reportes",
      icon: "📈",
      items: [
        {
          id: "resumen-general",
          label: "Resumen General",
          icon: "📊",
          action: () => {
            console.log("Abriendo reportes...");
            if (typeof GeneradorReportes !== "undefined" && GeneradorReportes.abrirPanelReportes) {
              GeneradorReportes.abrirPanelReportes();
            } else {
              console.warn("⚠️ GeneradorReportes.abrirPanelReportes no disponible");
            }
          },
          badges: 0,
        },
        {
          id: "distribucion-turnos",
          label: "Distribución de Turnos",
          icon: "🔄",
          action: () => {
            if (typeof AnalizadorCalendario !== "undefined" && AnalizadorCalendario.generarGraficoDistribucion) {
              AnalizadorCalendario.generarGraficoDistribucion();
            } else {
              console.warn("⚠️ AnalizadorCalendario no disponible");
            }
          },
          badges: 0,
        },
        {
          id: "equidad-cargas",
          label: "Equidad de Cargas",
          icon: "⚖️",
          action: () => {
            if (typeof AnalizadorCalendario !== "undefined" && AnalizadorCalendario.analizarEquidad) {
              const analisis = AnalizadorCalendario.analizarEquidad();
              console.log("Análisis de Equidad:", analisis);
            } else {
              console.warn("⚠️ AnalizadorCalendario no disponible");
            }
          },
          badges: 0,
        },
      ],
    },
    // EXPORTACIÓN E INTEGRACIÓN
    exportacion: {
      label: "Exportación",
      icon: "💾",
      items: [
        {
          id: "descargar-pdf",
          label: "Descargar PDF",
          icon: "📄",
          action: () => {
            if (typeof ExportManager !== "undefined" && ExportManager.exportarCuadranteGeneral) {
              ExportManager.exportarCuadranteGeneral("pdf");
            } else {
              console.error("❌ ExportManager.exportarCuadranteGeneral no disponible");
              NotificationSystem?.show?.("Error: ExportManager no cargado", "error");
            }
          },
          badges: 0,
        },
        {
          id: "descargar-excel",
          label: "Descargar Excel",
          icon: "📊",
          action: () => {
            console.log("Exportando Excel...");
            if (typeof ExportManager !== "undefined" && ExportManager.exportarExcelGeneral) {
              ExportManager.exportarExcelGeneral();
            } else {
              console.warn("⚠️ ExportManager.exportarExcelGeneral no disponible");
              NotificationSystem?.show?.("Excel no disponible aún", "warning");
            }
          },
          badges: 0,
        },
        {
          id: "compartir-whatsapp",
          label: "Compartir WhatsApp",
          icon: "💬",
          action: () => {
            NotificationSystem?.show?.("WhatsApp - Usa individual cuadrante para compartir", "info");
            console.log("💬 WhatsApp: Disponible en vista individual de empleados");
          },
          badges: 0,
        },
      ],
    },
    // HERRAMIENTAS Y CONFIGURACIÓN
    herramientas: {
      label: "Herramientas",
      icon: "🛠️",
      items: [
        {
          id: "filtros-avanzados",
          label: "Filtros Avanzados",
          icon: "🔍",
          action: () => {
            if (typeof FiltroCalendario !== "undefined" && FiltroCalendario.abrirPanelFiltros) {
              FiltroCalendario.abrirPanelFiltros();
            } else {
              console.warn("⚠️ FiltroCalendario no disponible");
            }
          },
          badges: 0,
        },
        {
          id: "configuracion",
          label: "Configuración",
          icon: "⚙️",
          action: () => {
            NotificationSystem?.show?.("Configuración - Próximamente (v11.0)", "info");
            console.log("📅 Feature: Configuración (planeado para v11.0)");
          },
          badges: 0,
        },
        {
          id: "ayuda",
          label: "Ayuda",
          icon: "❓",
          action: () => {
            if (typeof DocumentAnalyzer !== "undefined" && DocumentAnalyzer.mostrarAyuda) {
              DocumentAnalyzer.mostrarAyuda();
            } else {
              console.warn("⚠️ DocumentAnalyzer no disponible");
            }
          },
          badges: 0,
        },
      ],
    },
  };

  /**
   * Inicializar sidebar
   */
  static init() {
    if (LayoutManager.initialized) return;

    console.log("🎨 LayoutManager: Inicializando sidebar...");

    // Crear estructura del sidebar
    this.createSidebarStructure();

    // Asignar event listeners
    this.attachEventListeners();

    // Restaurar estado activo si existe
    this.restoreActiveState();

    LayoutManager.initialized = true;
    console.log("✅ LayoutManager: Sidebar inicializado correctamente");
  }

  /**
   * Crear estructura HTML del sidebar
   */
  static createSidebarStructure() {
    // Verificar si la estructura ya existe
    if (document.querySelector(".app-wrapper")) {
      console.log("✅ Estructura del sidebar ya existe");
      return;
    }

    const container = document.body;

    // Crear wrapper
    const appWrapper = document.createElement("div");
    appWrapper.className = "app-wrapper";

    // Crear sidebar
    const sidebar = document.createElement("aside");
    sidebar.className = "app-sidebar";
    sidebar.innerHTML = this.generateSidebarHTML();

    // Crear app-main
    const appMain = document.createElement("div");
    appMain.className = "app-main";

    // Mover TODOS los hijos actuales al app-main
    while (container.firstChild) {
      appMain.appendChild(container.firstChild);
    }

    // Armar estructura
    appWrapper.appendChild(sidebar);
    appWrapper.appendChild(appMain);
    container.appendChild(appWrapper);

    console.log("✅ Estructura del sidebar creada correctamente");
  }

  /**
   * Generar HTML del sidebar
   */
  static generateSidebarHTML() {
    let html = `
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">📅</div>
        <div class="sidebar-logo-text">TURNOS v10</div>
      </div>

      <nav class="sidebar-nav">
    `;

    // Generar secciones de navegación
    Object.entries(this.navigationMap).forEach(([key, section]) => {
      html += `<div class="nav-section" data-section="${key}">`;
      html += `<div class="nav-section-title">${section.label}</div>`;

      section.items.forEach((item) => {
        const badgeHTML =
          item.badges > 0
            ? `<span class="nav-item-badge">${item.badges}</span>`
            : "";
        html += `
          <div class="nav-item" data-nav-id="${item.id}" data-tooltip="${item.label}">
            <span class="nav-item-icon">${item.icon}</span>
            <span class="nav-item-label">${item.label}</span>
            ${badgeHTML}
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
      </nav>

      <div class="sidebar-footer">
        <div>v10.0 • 2025</div>
      </div>
    `;

    return html;
  }

  /**
   * Asignar event listeners a items de navegación
   */
  static attachEventListeners() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        const navId = item.getAttribute("data-nav-id");

        // Deactivar todos
        navItems.forEach((ni) => ni.classList.remove("active"));

        // Activar actual
        item.classList.add("active");

        // Guardar en sessionStorage
        sessionStorage.setItem("activeNavItem", navId);

        // Ejecutar acción
        this.executeNavAction(navId);
      });
    });

    // Event listeners para secciones colapsables (futuro)
    const sections = document.querySelectorAll(".nav-section");
    sections.forEach((section) => {
      const title = section.querySelector(".nav-section-title");
      if (title) {
        title.addEventListener("click", () => {
          section.classList.toggle("expanded");
        });
      }
    });
  }

  /**
   * Ejecutar acción de navegación
   */
  static executeNavAction(navId) {
    // Buscar la acción en navigationMap
    for (const section of Object.values(this.navigationMap)) {
      const item = section.items.find((i) => i.id === navId);
      if (item && item.action) {
        try {
          item.action();
          console.log(`✅ Ejecutado: ${navId}`);
        } catch (error) {
          console.error(`❌ Error ejecutando acción ${navId}:`, error.message);
          // No mostrar notificación si es error esperado
          if (error.message && !error.message.includes("is not defined")) {
            NotificationSystem?.show?.(
              `Error: ${error.message}`,
              "error"
            );
          }
        }
        return;
      }
    }
    console.warn(`⚠️ Acción no encontrada: ${navId}`);
  }

  /**
   * Restaurar item activo desde sessionStorage
   */
  static restoreActiveState() {
    const activeNavId = sessionStorage.getItem("activeNavItem");
    if (activeNavId) {
      const activeItem = document.querySelector(
        `[data-nav-id="${activeNavId}"]`
      );
      if (activeItem) {
        activeItem.classList.add("active");
      }
    }
  }

  /**
   * Establecer badge en un item de navegación
   */
  static setBadge(navId, count) {
    const item = document.querySelector(`[data-nav-id="${navId}"]`);
    if (item) {
      let badge = item.querySelector(".nav-item-badge");

      if (!badge && count > 0) {
        badge = document.createElement("span");
        badge.className = "nav-item-badge";
        item.appendChild(badge);
      }

      if (badge) {
        badge.textContent = count;
        if (count === 0) {
          badge.remove();
        }
      }
    }
  }

  /**
   * Activar item de navegación programáticamente
   */
  static activateNavItem(navId) {
    const item = document.querySelector(`[data-nav-id="${navId}"]`);
    if (item) {
      item.click();
    }
  }

  /**
   * Obtener estado actual del sidebar
   */
  static getState() {
    return {
      activeNavItem: sessionStorage.getItem("activeNavItem"),
      expandedSections: Array.from(
        document.querySelectorAll(".nav-section.expanded")
      ).map((s) => s.getAttribute("data-section")),
    };
  }
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener("DOMContentLoaded", () => {
  // Esperar a que LayoutManager esté listo
  const checkAndInit = setInterval(() => {
    if (typeof LayoutManager !== "undefined") {
      try {
        LayoutManager.init();
      } catch(e) {
        console.error("❌ Error al inicializar LayoutManager:", e);
      }
      clearInterval(checkAndInit);
    }
  }, 100);

  // Timeout de seguridad
  setTimeout(() => clearInterval(checkAndInit), 5000);
});

/**
 * Exportar para uso externo
 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = LayoutManager;
}
