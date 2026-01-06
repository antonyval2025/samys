/**
 * CLASE BASE PARA CONTROLES - Refactorización de código duplicado
 * Elimina 400+ líneas de duplicación en controles-semana-1/2/3.js
 * 
 * Uso:
 * class ControlesSemana1 extends ControlBase {
 *     static moduloNombre = 'ValidadorDatos';
 *     static modalId = 'modalSemana1';
 * }
 */

class ControlBase {
    // Propiedades que deben ser definidas en subclases
    static moduloNombre = ''; // ej: 'ValidadorDatos'
    static modalId = ''; // ej: 'modalSemana1'
    static sectionId = ''; // ej: 'semana1'
    static color = '#666'; // Color hexadecimal
    static emoji = '⚙️';

    /**
     * Método genérico para abrir modal
     * @param {string} titulo - Título del modal
     * @param {Function} generadorContenido - Función que genera el HTML del contenido
     */
    static abrirModal(titulo, generadorContenido) {
        const modal = document.getElementById(this.modalId) || this.crearModal();
        const tituloEl = document.getElementById(`${this.modalId}Title`);
        const contenidoEl = document.getElementById(`${this.modalId}Content`);

        if (!tituloEl || !contenidoEl) {
            console.error(`❌ Elementos del modal ${this.modalId} no encontrados`);
            return;
        }

        tituloEl.textContent = titulo;

        // Verificar que el módulo esté cargado
        if (typeof window[this.moduloNombre] === 'undefined') {
            contenidoEl.innerHTML = `<p style="color: red; padding: 20px; text-align: center;">
                <strong>❌ ${this.moduloNombre}</strong> no está cargado. Recarga la página.
            </p>`;
            modal.classList.add('active');
            return;
        }

        // Generar contenido llamando a la función proporcionada
        try {
            const html = generadorContenido.call(this);
            contenidoEl.innerHTML = html;
        } catch (error) {
            contenidoEl.innerHTML = `<p style="color: red; padding: 20px; text-align: center;">
                <strong>❌ Error al generar contenido:</strong> ${error.message}
            </p>`;
        }

        modal.classList.add('active');
    }

    /**
     * Crear modal si no existe
     */
    static crearModal() {
        if (document.getElementById(this.modalId)) {
            return document.getElementById(this.modalId);
        }

        const mainContent = document.querySelector('.main-content') || document.body;
        const modalHTML = `
            <div id="${this.modalId}" class="modal">
                <div class="modal-content">
                    <h2 id="${this.modalId}Title" style="margin: 0 0 20px 0; color: ${this.color};">
                        ${this.emoji} Título
                        <button class="close-btn" onclick="document.getElementById('${this.modalId}').classList.remove('active')">✕</button>
                    </h2>
                    <div id="${this.modalId}Content" class="modal-body">
                        <p>Cargando...</p>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn secondary" onclick="document.getElementById('${this.modalId}').classList.remove('active')">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        mainContent.insertAdjacentHTML('beforeend', modalHTML);
        return document.getElementById(this.modalId);
    }

    /**
     * Cerrar modal
     */
    static cerrarModal() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * Agregar botones al sidebar
     * @param {Array} botones - Array de {icono, texto, funcion}
     */
    static agregarBotonesSidebar(botones) {
        const sidebar = document.querySelector('.sidebar-container');
        if (!sidebar) return;

        const sectionHTML = `
            <div class="sidebar-section ${this.sectionId}">
                <div class="sidebar-section-title">${this.emoji} ${this.sectionId.replace('semana', 'Semana ')}</div>
                ${botones.map(btn => `
                    <button class="sidebar-btn ${this.sectionId}" onclick="${btn.funcion}()" title="${btn.texto}">
                        <span style="font-size: 16px;">${btn.icono}</span>
                        <span>${btn.texto}</span>
                    </button>
                `).join('')}
            </div>
        `;

        sidebar.insertAdjacentHTML('beforeend', sectionHTML);
        this.aplicarEstilos();
    }

    /**
     * Aplicar estilos CSS para la sección
     */
    static aplicarEstilos() {
        // Verificar si ya existe el estilo
        if (document.querySelector(`style[data-section="${this.sectionId}"]`)) {
            return;
        }

        const style = document.createElement('style');
        style.setAttribute('data-section', this.sectionId);
        style.textContent = `
            .sidebar-section.${this.sectionId} {
                border-bottom: 2px solid rgba(${this.hexToRgb(this.color).join(',')}, 0.3);
            }

            .sidebar-btn.${this.sectionId} {
                border-left: 3px solid ${this.color};
                background: rgba(${this.hexToRgb(this.color).join(',')}, 0.08);
            }

            .sidebar-btn.${this.sectionId}:hover {
                background: rgba(${this.hexToRgb(this.color).join(',')}, 0.15);
                border-left-color: ${this.lightenColor(this.color)};
            }

            .sidebar-section.${this.sectionId} .sidebar-section-title {
                border-left: 3px solid ${this.color};
                color: ${this.color};
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Utilidad: convertir hex a rgb
     */
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : [100, 100, 100];
    }

    /**
     * Utilidad: aclarar color
     */
    static lightenColor(hex) {
        const rgb = this.hexToRgb(hex);
        const newRgb = rgb.map(val => Math.min(255, val + 40));
        return `rgb(${newRgb.join(',')})`;
    }

    /**
     * Crear elemento de error con estilo
     */
    static crearHTMLError(titulo, errores) {
        return `
            <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 15px;">
                <div style="font-weight: bold; margin-bottom: 10px;">❌ ${titulo}</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px;">
                    ${errores.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Crear elemento de éxito con estilo
     */
    static crearHTMLSuccess(titulo, detalles = '') {
        return `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 15px;">
                <div style="font-weight: bold;">✅ ${titulo}</div>
                ${detalles ? `<p style="margin: 5px 0 0 0; font-size: 13px;">${detalles}</p>` : ''}
            </div>
        `;
    }

    /**
     * Crear elemento de advertencia con estilo
     */
    static crearHTMLWarning(titulo, detalles = '') {
        return `
            <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
                <div style="font-weight: bold;">⚠️ ${titulo}</div>
                ${detalles ? `<p style="margin: 5px 0 0 0; font-size: 13px;">${detalles}</p>` : ''}
            </div>
        `;
    }

    /**
     * Crear tabla genérica
     */
    static crearTabla(headers, datos) {
        return `
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background: #f8f9fa; border-bottom: 2px solid #ddd;">
                        ${headers.map(h => `<th style="padding: 12px; text-align: left; font-weight: bold;">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${datos.map(fila => `
                        <tr style="border-bottom: 1px solid #eee; transition: background 0.2s;">
                            ${fila.map(celda => `<td style="padding: 12px;">${celda}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    /**
     * Crear grid de botones
     */
    static crearGridBotones(botones) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 15px;">
                ${botones.map(btn => `
                    <button 
                        onclick="${btn.onClick}"
                        style="padding: 12px; background: ${btn.color || '#f97316'}; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s;"
                        onmouseover="this.style.opacity='0.8'"
                        onmouseout="this.style.opacity='1'"
                    >
                        ${btn.icono} ${btn.texto}
                    </button>
                `).join('')}
            </div>
        `;
    }
}

// Verificar que está cargado
console.log('✅ ControlBase cargado - Clase base para controles');
