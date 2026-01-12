/**
 * Sistema de Tema (Oscuro/Claro)
 * Gestiona preferencia de usuario con persistencia en localStorage
 */

class ThemeManager {
  static STORAGE_KEY = 'app-theme-preference';
  static DARK_THEME = 'dark';
  static LIGHT_THEME = 'light';

  /**
   * Inicializar sistema de temas
   */
  static init() {
    // Detectar preferencia guardada o del sistema
    const savedTheme = this.getSavedTheme();
    const preferredTheme = savedTheme || this.getSystemThemePreference();
    
    // Aplicar tema
    this.setTheme(preferredTheme);
    
    // Escuchar cambios de preferencia del sistema
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getSavedTheme()) {
          this.setTheme(e.matches ? this.DARK_THEME : this.LIGHT_THEME);
        }
      });
    }

    // Crear botón de toggle
    this.createThemeToggle();
  }

  /**
   * Obtener tema guardado en localStorage
   */
  static getSavedTheme() {
    try {
      return localStorage.getItem(this.STORAGE_KEY);
    } catch (e) {
      console.warn('No se puede acceder a localStorage:', e);
      return null;
    }
  }

  /**
   * Detectar preferencia de tema del sistema
   */
  static getSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK_THEME;
    }
    return this.LIGHT_THEME;
  }

  /**
   * Aplicar tema
   */
  static setTheme(theme) {
    const isValid = [this.DARK_THEME, this.LIGHT_THEME].includes(theme);
    const finalTheme = isValid ? theme : this.DARK_THEME;

    // Actualizar data-attribute
    document.documentElement.setAttribute('data-theme', finalTheme);

    // Guardar preferencia
    try {
      localStorage.setItem(this.STORAGE_KEY, finalTheme);
    } catch (e) {
      console.warn('No se puede guardar preferencia de tema:', e);
    }

    // Actualizar toggle si existe
    this.updateToggleButton(finalTheme);

    // Disparar evento
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: finalTheme } }));
  }

  /**
   * Alternar tema
   */
  static toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || this.DARK_THEME;
    const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
    this.setTheme(newTheme);
  }

  /**
   * Crear botón de toggle
   */
  static createThemeToggle() {
    // Buscar header o crear contenedor
    const header = document.querySelector('header');
    if (!header) return;

    // Crear botón
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle dark/light theme');
    toggleBtn.setAttribute('title', 'Cambiar tema');
    
    // Agregar al header (lado derecho)
    const headerRight = document.createElement('div');
    headerRight.className = 'header-right';
    headerRight.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
    `;
    headerRight.appendChild(toggleBtn);
    header.appendChild(headerRight);

    // Actualizar ícono inicial
    this.updateToggleButton(document.documentElement.getAttribute('data-theme') || this.DARK_THEME);

    // Event listener
    toggleBtn.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Actualizar apariencia del botón toggle
   */
  static updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    if (theme === this.DARK_THEME) {
      btn.textContent = '☀️';
      btn.title = 'Cambiar a tema claro';
    } else {
      btn.textContent = '🌙';
      btn.title = 'Cambiar a tema oscuro';
    }

    // Estilos del botón
    btn.style.cssText = `
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 2px solid var(--border-color);
      padding: 8px 12px;
      border-radius: var(--radius-md);
      font-size: 18px;
      cursor: pointer;
      transition: all 300ms ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
    `;

    btn.onmouseenter = () => {
      btn.style.borderColor = 'var(--color-primary)';
      btn.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.3)';
    };

    btn.onmouseleave = () => {
      btn.style.borderColor = 'var(--border-color)';
      btn.style.boxShadow = 'none';
    };
  }

  /**
   * Obtener tema actual
   */
  static getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || this.DARK_THEME;
  }

  /**
   * Escuchar cambios de tema (para componentes que lo necesiten)
   */
  static onChange(callback) {
    window.addEventListener('themeChanged', (e) => {
      callback(e.detail.theme);
    });
  }
}

// Inicializar automáticamente cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
