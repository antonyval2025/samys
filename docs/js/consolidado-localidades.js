/**
 * CONSOLIDADO LOCALIDADES - Sistema Unificado de Gestión de Localidades
 * 
 * Propósito: Servir como interface única y modular para gestionar localidades
 * Fuente de Verdad: LocalidadesManager (equivalente a DepartamentosManager)
 * Responsabilidad: Coordinar UI, persistencia y propagación de cambios
 * 
 * Arquitectura:
 * - ConsolidadoLocalidades (UI layer) ← → LocalidadesManager (Data layer)
 * - Cambios en localidades → SistemaReactividad → Regeneración en cascada
 */

console.log('[ConsolidadoLocalidades] 📍 Cargando sistema unificado de localidades...');

const ConsolidadoLocalidades = (function() {
    
    // ============================================
    // STATE LOCAL (UI only)
    // ============================================
    const state = {
        localidadEnEdicion: null,
        formularioVisible: false
    };

    // ============================================
    // MÉTODOS PÚBLICOS
    // ============================================

    /**
     * Abre el modal de gestión de localidades
     */
    function abrirModal() {
        const modal = document.getElementById('modalGestionLocalidades');
        if (modal) {
            modal.classList.add('active');
            cargarListaLocalidades();
            llenarSelectLocalidades();
        }
    }

    /**
     * Cierra el modal
     */
    function cerrarModal() {
        const modal = document.getElementById('modalGestionLocalidades');
        if (modal) modal.classList.remove('active');
        limpiarFormulario();
    }

    /**
     * Muestra el formulario para crear nueva localidad
     */
    function mostrarFormularioNuevo() {
        limpiarFormulario();
        state.localidadEnEdicion = null;
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('loc_nombre').focus();
        }
    }

    /**
     * Carga la lista de localidades desde LocalidadesManager
     */
    function cargarListaLocalidades() {
        const lista = document.getElementById('listaLocalidades');
        if (!lista) return;

        // Obtener localidades desde LocalidadesManager
        if (typeof LocalidadesManager === 'undefined') {
            console.error('[ConsolidadoLocalidades] ❌ LocalidadesManager no disponible');
            lista.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 20px;">Error: Sistema de localidades no disponible</p>';
            return;
        }

        // 🔄 IMPORTANTE: Asegurar que LocalidadesManager está inicializado
        if (typeof LocalidadesManager.inicializar === 'function') {
            LocalidadesManager.inicializar();
        }

        // Obtener localidades
        let localidades = LocalidadesManager.obtenerLocalidades?.();
        
        // Validar que obtuvimos un array
        if (!Array.isArray(localidades)) {
            localidades = localidades ? Object.values(localidades) : [];
        }

        console.log('[ConsolidadoLocalidades] 📋 Localidades cargadas:', localidades.length);

        if (!localidades || localidades.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #cbd5e1; padding: 20px;">No hay localidades registradas.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 10px;">';
        localidades.forEach(loc => {
            // Contar empleados en esta localidad
            const empsEnLocalidad = typeof empleados !== 'undefined' 
                ? empleados.filter(e => e.localidad === loc.nombre).length 
                : 0;
            
            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-weight: 600;">📍 ${loc.nombre}</h4>
                            <small style="color: #cbd5e1;">Empleados: ${empsEnLocalidad}</small>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="ConsolidadoLocalidades.editarLocalidad(${loc.id})" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="ConsolidadoLocalidades.eliminarLocalidad(${loc.id})" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;" ${empsEnLocalidad > 0 ? 'disabled' : ''}>
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        lista.innerHTML = html;
    }

    /**
     * Llena el select de localidades en el formulario de empleados
     */
    function llenarSelectLocalidades() {
        const select = document.getElementById('emple_localidad');
        if (!select) return;

        // Limpiar opciones previas excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Obtener localidades desde LocalidadesManager
        if (typeof LocalidadesManager === 'undefined') return;

        const localidades = LocalidadesManager.obtenerLocalidades?.() || [];
        const localidadesArray = Array.isArray(localidades) ? localidades : Object.values(localidades);

        // Agregar localidades
        localidadesArray.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc.nombre;
            option.textContent = loc.nombre;
            select.appendChild(option);
        });
    }

    /**
     * Edita una localidad existente
     */
    function editarLocalidad(id) {
        if (typeof LocalidadesManager === 'undefined') return;

        const localidades = LocalidadesManager.obtenerLocalidades?.() || [];
        const localidadesArray = Array.isArray(localidades) ? localidades : Object.values(localidades);
        const loc = localidadesArray.find(l => l.id === id);
        
        if (!loc) return;

        document.getElementById('localidadIdEdicion').value = id;
        document.getElementById('loc_nombre').value = loc.nombre;
        
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) formulario.style.display = 'block';
        
        document.getElementById('loc_nombre').focus();
    }

    /**
     * Guarda una localidad (nueva o editada)
     */
    function guardarLocalidad() {
        const nombre = document.getElementById('loc_nombre').value.trim();
        const idEdicion = document.getElementById('localidadIdEdicion').value;

        if (!nombre) {
            alert('Por favor, ingresa un nombre para la localidad');
            return;
        }

        if (typeof LocalidadesManager === 'undefined') {
            alert('Sistema de localidades no disponible');
            return;
        }

        if (idEdicion) {
            // Editar localidad existente
            LocalidadesManager.actualizarLocalidad(parseInt(idEdicion), nombre);
            console.log('[ConsolidadoLocalidades] ✅ Localidad actualizada');
        } else {
            // Crear nueva localidad
            LocalidadesManager.crearLocalidad(nombre);
            console.log('[ConsolidadoLocalidades] ✅ Localidad creada');
        }

        // 🔄 Actualizar UI y propagar cambios
        cargarListaLocalidades();
        llenarSelectLocalidades();
        limpiarFormulario();

        // 📡 Emitir evento de cambio para reactividad
        if (typeof SistemaReactividad !== 'undefined') {
            SistemaReactividad.emit('localidades-cambio', { accion: idEdicion ? 'actualizar' : 'crear' });
        }

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(`✅ Localidad ${idEdicion ? 'actualizada' : 'creada'} correctamente`, 'success');
        }
    }

    /**
     * Elimina una localidad
     */
    function eliminarLocalidad(id) {
        if (!confirm('¿Está seguro de que desea eliminar esta localidad?')) return;

        if (typeof LocalidadesManager === 'undefined') {
            alert('Sistema de localidades no disponible');
            return;
        }

        LocalidadesManager.eliminarLocalidad(id);
        console.log('[ConsolidadoLocalidades] ✅ Localidad eliminada');

        // 🔄 Actualizar UI y propagar cambios
        cargarListaLocalidades();
        llenarSelectLocalidades();

        // 📡 Emitir evento de cambio para reactividad
        if (typeof SistemaReactividad !== 'undefined') {
            SistemaReactividad.emit('localidades-cambio', { accion: 'eliminar' });
        }

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('✅ Localidad eliminada correctamente', 'success');
        }
    }

    /**
     * Limpia el formulario
     */
    function limpiarFormulario() {
        document.getElementById('loc_nombre').value = '';
        document.getElementById('localidadIdEdicion').value = '';
        const formulario = document.getElementById('formularioLocalidad');
        if (formulario) formulario.style.display = 'none';
        state.localidadEnEdicion = null;
    }

    /**
     * Obtiene todas las localidades
     */
    function obtenerLocalidades() {
        if (typeof LocalidadesManager === 'undefined') return [];
        const locs = LocalidadesManager.obtenerLocalidades?.() || [];
        return Array.isArray(locs) ? locs : Object.values(locs);
    }

    /**
     * Obtiene el estado actual
     */
    function obtenerEstado() {
        return {
            localidades: obtenerLocalidades(),
            localidadEnEdicion: state.localidadEnEdicion,
            formularioVisible: state.formularioVisible
        };
    }

    // ============================================
    // API PÚBLICA
    // ============================================
    return {
        abrirModal,
        cerrarModal,
        mostrarFormularioNuevo,
        cargarListaLocalidades,
        llenarSelectLocalidades,
        editarLocalidad,
        guardarLocalidad,
        eliminarLocalidad,
        limpiarFormulario,
        obtenerLocalidades,
        obtenerEstado
    };
})();

console.log('[ConsolidadoLocalidades] ✅ Sistema unificado de localidades cargado');
