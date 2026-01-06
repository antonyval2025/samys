/**
 * CONSOLIDADO DEPARTAMENTOS - Sistema Unificado de Gestión de Departamentos
 * 
 * Propósito: Servir como interface única y modular para gestionar departamentos
 * Fuente de Verdad: DepartamentosManager (FASE 2)
 * Responsabilidad: Coordinar UI, persistencia y propagación de cambios
 * 
 * Arquitectura:
 * - ConsolidadoDepartamentos (UI layer) ← → DepartamentosManager (Data layer)
 * - Cambios en departamentos → SistemaReactividad → Regeneración de turnos en cascada
 */

console.log('[ConsolidadoDepartamentos] 🏢 Cargando sistema unificado de departamentos...');

const ConsolidadoDepartamentos = (function() {
    
    // ============================================
    // STATE LOCAL (UI only, fuente única es DepartamentosManager)
    // ============================================
    const state = {
        departamentoEnEdicion: null,
        formularioVisible: false
    };

    // ============================================
    // MÉTODOS PÚBLICOS
    // ============================================

    /**
     * Abre el modal de gestión de departamentos
     */
    function abrirModal() {
        const modal = document.getElementById('modalGestionDepartamentos');
        if (modal) {
            modal.classList.add('active');
            cargarListaDepartamentos();
        }
    }

    /**
     * Cierra el modal
     */
    function cerrarModal() {
        const modal = document.getElementById('modalGestionDepartamentos');
        if (modal) modal.classList.remove('active');
        limpiarFormulario();
    }

    /**
     * Muestra el formulario para crear nuevo departamento
     */
    function mostrarFormularioNuevo() {
        limpiarFormulario();
        state.departamentoEnEdicion = null;
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('depto_nombre').focus();
        }
    }

    /**
     * Carga la lista de departamentos desde DepartamentosManager
     */
    function cargarListaDepartamentos() {
        const lista = document.getElementById('listaDepartamentos');
        if (!lista) return;

        // Obtener departamentos desde DepartamentosManager
        if (typeof DepartamentosManager === 'undefined') {
            console.error('[ConsolidadoDepartamentos] ❌ DepartamentosManager no disponible');
            lista.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 20px;">Error: Sistema de departamentos no disponible</p>';
            return;
        }

        // 🔄 IMPORTANTE: Asegurar que DepartamentosManager está inicializado
        console.log('[ConsolidadoDepartamentos] 🔍 Verificando inicialización DepartamentosManager...');
        console.log('[ConsolidadoDepartamentos] Estado:', DepartamentosManager.obtenerEstado?.());
        
        if (typeof DepartamentosManager.inicializar === 'function') {
            DepartamentosManager.inicializar();
            console.log('[ConsolidadoDepartamentos] ✅ DepartamentosManager inicializado (forzado)');
        }

        // Obtener departamentos - intenta múltiples métodos
        let departamentos = DepartamentosManager.obtenerDepartamentos();
        
        // Validar que obtuvimos un array
        if (!Array.isArray(departamentos)) {
            console.warn('[ConsolidadoDepartamentos] ⚠️ obtenerDepartamentos() retornó:', departamentos);
            departamentos = departamentos ? Object.values(departamentos) : [];
        }

        console.log('[ConsolidadoDepartamentos] 📋 Departamentos:', departamentos);

        // Si aún está vacío, intentar fallback con estándares
        if (!departamentos || departamentos.length === 0) {
            console.warn('[ConsolidadoDepartamentos] ⚠️ Lista vacía, intentando obtenerEstándaresDisponibles()...');
            const standards = DepartamentosManager.obtenerEstándaresDisponibles?.();
            if (standards) {
                departamentos = Object.values(standards);
                console.log('[ConsolidadoDepartamentos] ✅ Usando estándares predefinidos:', departamentos);
            }
        }

        if (!departamentos || departamentos.length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #cbd5e1; padding: 20px;">No hay departamentos registrados.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 10px;">';
        departamentos.forEach(depto => {
            html += `
                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #f1f5f9 100%); padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <h4 style="color: #1e293b; margin: 0 0 8px 0; font-weight: 700; font-size: 15px;">🏢 ${depto.nombre || 'Sin nombre'}</h4>
                            <p style="color: #475569; margin: 0 0 8px 0; font-size: 13px; line-height: 1.5;">${depto.descripcion || '<em style="color: #94a3b8;">Sin descripción</em>'}</p>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 12px;">
                                <span style="background: rgba(59, 130, 246, 0.1); padding: 6px 8px; border-radius: 4px; color: #1e40af; font-weight: 600;">⏰ ${depto.horasSemanales || 40}h/sem</span>
                                <span style="background: rgba(34, 197, 94, 0.1); padding: 6px 8px; border-radius: 4px; color: #166534; font-weight: 600;">📅 ${depto.diasTrabajo || 5} días</span>
                                <span style="background: rgba(168, 85, 247, 0.1); padding: 6px 8px; border-radius: 4px; color: #6b21a8; font-weight: 600;">⏳ ${depto.horasDiarias || 8}h/día</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin-left: 12px;">
                            <button onclick="ConsolidadoDepartamentos.editarDepartamento('${depto.nombre || depto.id}')" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2); transition: all 0.2s ease;" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="ConsolidadoDepartamentos.eliminarDepartamento('${depto.nombre || depto.id}')" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s ease;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
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
     * Edita un departamento existente
     */
    function editarDepartamento(nombreDepartamento) {
        // Obtener departamento desde DepartamentosManager
        const depto = DepartamentosManager.obtenerDepartamento(nombreDepartamento.toLowerCase());
        if (!depto) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(`❌ Departamento '${nombreDepartamento}' no encontrado`, 'error');
            }
            return;
        }

        state.departamentoEnEdicion = depto;
        
        // Llenar formulario con datos
        document.getElementById('departamentoIdEdicion').value = depto.nombre;
        document.getElementById('depto_nombre').value = depto.nombre || '';
        document.getElementById('depto_descripcion').value = depto.descripcion || '';
        document.getElementById('depto_horasSemanales').value = depto.horasSemanales || 40;
        document.getElementById('depto_diasTrabajo').value = depto.diasTrabajo || 5;
        document.getElementById('depto_horasDiarias').value = depto.horasDiarias || 8;
        
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('depto_nombre').focus();
        }
    }

    /**
     * Guarda un departamento (crea o actualiza)
     */
    function guardarDepartamento() {
        const nombre = document.getElementById('depto_nombre').value.trim();
        const descripcion = document.getElementById('depto_descripcion').value.trim();
        const horasSemanales = parseInt(document.getElementById('depto_horasSemanales').value) || 40;
        const diasTrabajo = parseInt(document.getElementById('depto_diasTrabajo').value) || 5;
        const horasDiarias = parseFloat(document.getElementById('depto_horasDiarias').value) || 8;

        // ✅ Validaciones
        if (!nombre || nombre.length < 2) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('⚠️ El nombre del departamento debe tener al menos 2 caracteres', 'warning');
            }
            return;
        }

        if (horasSemanales < 20 || horasSemanales > 60) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('⚠️ Las horas semanales deben estar entre 20 y 60', 'warning');
            }
            return;
        }

        if (diasTrabajo < 4 || diasTrabajo > 7) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('⚠️ Los días de trabajo deben estar entre 4 y 7', 'warning');
            }
            return;
        }

        if (horasDiarias < 4 || horasDiarias > 12) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show('⚠️ Las horas diarias deben estar entre 4 y 12', 'warning');
            }
            return;
        }

        // ✅ Preparar objeto de departamento
        const deptoData = {
            nombre: nombre,
            descripcion: descripcion,
            horasSemanales: horasSemanales,
            diasTrabajo: diasTrabajo,
            horasDiarias: horasDiarias
        };

        try {
            if (state.departamentoEnEdicion) {
                // ✏️ ACTUALIZAR departamento existente
                DepartamentosManager.actualizarDepartamento(nombre, deptoData);
                
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show(`✅ Departamento '${nombre}' actualizado (${horasSemanales}h/sem, ${diasTrabajo} días, ${horasDiarias}h/día)`, 'success');
                }
            } else {
                // ➕ CREAR departamento nuevo
                DepartamentosManager.agregarDepartamento(nombre, deptoData);
                
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.show(`✅ Departamento '${nombre}' creado (${horasSemanales}h/sem, ${diasTrabajo} días, ${horasDiarias}h/día)`, 'success');
                }
            }

            // 🔔 EMITIR evento de cambio de estándares para regeneración en cascada
            if (typeof SistemaReactividad !== 'undefined') {
                SistemaReactividad.emit('cambio-estandares-departamento', {
                    departamento: nombre,
                    horasSemanales: horasSemanales,
                    diasTrabajo: diasTrabajo,
                    horasDiarias: horasDiarias
                });
                console.log('[ConsolidadoDepartamentos] 🔔 Evento emitido para regeneración de turnos');
            }

            // 🔄 Recargar lista y cerrar formulario
            limpiarFormulario();
            cargarListaDepartamentos();

        } catch (error) {
            console.error('[ConsolidadoDepartamentos] ❌ Error guardando departamento:', error);
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(`❌ Error guardando departamento: ${error.message}`, 'error');
            }
        }
    }

    /**
     * Elimina un departamento (con validaciones)
     */
    function eliminarDepartamento(nombreDepartamento) {
        // Obtener empleados asignados a este departamento
        const empleadosEnDepto = (typeof empleados !== 'undefined' ? empleados : []).filter(e => 
            e.departamento && e.departamento.toLowerCase() === nombreDepartamento.toLowerCase()
        );

        if (empleadosEnDepto.length > 0) {
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(`❌ No se puede eliminar '${nombreDepartamento}': ${empleadosEnDepto.length} empleado(s) asignado(s)`, 'error');
            }
            return;
        }

        if (!confirm(`¿Estás seguro de eliminar el departamento '${nombreDepartamento}'?`)) {
            return;
        }

        try {
            DepartamentosManager.eliminarDepartamento(nombreDepartamento.toLowerCase());
            cargarListaDepartamentos();

            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(`✅ Departamento '${nombreDepartamento}' eliminado`, 'success');
            }
        } catch (error) {
            console.error('[ConsolidadoDepartamentos] ❌ Error eliminando departamento:', error);
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.show(`❌ Error eliminando departamento: ${error.message}`, 'error');
            }
        }
    }

    /**
     * Cancela la edición
     */
    function cancelarFormulario() {
        limpiarFormulario();
    }

    /**
     * Limpia el formulario
     */
    function limpiarFormulario() {
        state.departamentoEnEdicion = null;
        document.getElementById('departamentoIdEdicion').value = '';
        document.getElementById('depto_nombre').value = '';
        document.getElementById('depto_descripcion').value = '';
        document.getElementById('depto_horasSemanales').value = '40';
        document.getElementById('depto_diasTrabajo').value = '5';
        document.getElementById('depto_horasDiarias').value = '8';
        
        const formulario = document.getElementById('formularioDepartamento');
        if (formulario) formulario.style.display = 'none';
    }

    /**
     * Obtiene lista de departamentos para dropdowns
     */
    function obtenerListaDepartamentos() {
        if (typeof DepartamentosManager === 'undefined') return [];
        return DepartamentosManager.obtenerDepartamentos().map(d => d.nombre);
    }

    /**
     * Obtiene los estándares de un departamento
     */
    function obtenerEstandaresDepartamento(nombreDepartamento) {
        if (typeof DepartamentosManager === 'undefined') return null;
        return DepartamentosManager.obtenerDepartamento(nombreDepartamento.toLowerCase());
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function inicializar() {
        console.log('[ConsolidadoDepartamentos] ✅ Sistema unificado inicializado');
    }

    // Inicializar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializar);
    } else {
        inicializar();
    }

    // ============================================
    // INTERFACE PÚBLICA
    // ============================================

    return {
        abrirModal,
        cerrarModal,
        mostrarFormularioNuevo,
        cargarListaDepartamentos,
        editarDepartamento,
        guardarDepartamento,
        eliminarDepartamento,
        cancelarFormulario,
        limpiarFormulario,
        obtenerListaDepartamentos,
        obtenerEstandaresDepartamento
    };

})();
window.ConsolidadoDepartamentos = ConsolidadoDepartamentos;console.log('[ConsolidadoDepartamentos] 🏢 Módulo cargado correctamente');
