/**
 * CONSOLIDADO TURNOS - Sistema Unificado de Gestión de Tipos de Turnos
 * 
 * Propósito: Servir como interface única y modular para gestionar tipos de turnos
 * Fuente de Verdad: TurnosTypesManager (data layer)
 * Responsabilidad: Coordinar UI, persistencia y propagación de cambios
 * 
 * Arquitectura:
 * - ConsolidadoTurnos (UI layer) ← → TurnosTypesManager (Data layer)
 * - Cambios en turnos → SistemaReactividad → Regeneración de cuadrantes en cascada
 */

console.log('[ConsolidadoTurnos] 🔄 Cargando sistema unificado de tipos de turnos...');

const ConsolidadoTurnos = (function() {
    
    // ============================================
    // STATE LOCAL (UI only)
    // ============================================
    const state = {
        turnoEnEdicion: null,
        formularioVisible: false
    };

    // ============================================
    // MÉTODOS PÚBLICOS
    // ============================================

    /**
     * Abre el modal de gestión de turnos
     */
    function abrirModal() {
        const modal = document.getElementById('modalGestionTurnos');
        if (modal) {
            modal.classList.add('active');
            cargarListaTurnos();
        }
    }

    /**
     * Cierra el modal
     */
    function cerrarModal() {
        const modal = document.getElementById('modalGestionTurnos');
        if (modal) modal.classList.remove('active');
        limpiarFormulario();
    }

    /**
     * Muestra el formulario para crear nuevo tipo de turno
     */
    function mostrarFormularioNuevo() {
        limpiarFormulario();
        state.turnoEnEdicion = null;
        const formulario = document.getElementById('formularioTurno');
        if (formulario) {
            formulario.style.display = 'block';
            document.getElementById('turno_nombre').focus();
        }
    }

    /**
     * Carga la lista de tipos de turnos desde TurnosTypesManager
     */
    function cargarListaTurnos() {
        const lista = document.getElementById('listaTurnos');
        if (!lista) return;

        // Obtener turnos desde TurnosTypesManager
        if (typeof TurnosTypesManager === 'undefined') {
            console.error('[ConsolidadoTurnos] ❌ TurnosTypesManager no disponible');
            lista.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 20px;">Error: Sistema de turnos no disponible</p>';
            return;
        }

        // 🔄 IMPORTANTE: Asegurar que TurnosTypesManager está inicializado
        if (typeof TurnosTypesManager.inicializar === 'function') {
            TurnosTypesManager.inicializar();
        }

        // Obtener turnos
        const turnos = TurnosTypesManager.obtenerTurnos?.();
        
        if (!turnos || Object.keys(turnos).length === 0) {
            lista.innerHTML = '<p style="text-align: center; color: #cbd5e1; padding: 20px;">No hay tipos de turnos registrados.</p>';
            return;
        }

        let html = '<div style="display: grid; gap: 10px;">';
        Object.entries(turnos).forEach(([clave, turno]) => {
            const stats = TurnosTypesManager.obtenerEstadisticas?.();
            const usados = stats?.[clave]?.usados || 0;
            const protegido = stats?.[clave]?.protegido || false;

            html += `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid ${turno.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h4 style="color: #2c3e50; margin: 0 0 5px 0; font-weight: 600;">
                                <span style="background: ${turno.color}; color: #0f172a; padding: 4px 12px; border-radius: 4px; font-weight: bold; margin-right: 8px;">${turno.inicial}</span>
                                ${turno.nombre}
                                ${protegido ? '<span style="background: #f97316; color: white; padding: 2px 8px; border-radius: 3px; font-size: 10px; margin-left: 8px;">🔒 Protegido</span>' : ''}
                            </h4>
                            <p style="color: #7f8c8d; margin: 0; font-size: 0.9rem;">
                                ⏱️ ${turno.horario} | ⏰ ${turno.horas}h ${usados > 0 ? `| 👥 ${usados} asignados` : ''}
                            </p>
                            <small style="color: #cbd5e1;">Clave: ${clave}</small>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="ConsolidadoTurnos.editarTurno('${clave}')" style="padding: 8px 12px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.2);" onmouseover="this.style.boxShadow='0 0 15px rgba(249, 115, 22, 0.8), 0 0 30px rgba(234, 88, 12, 0.6)'" onmouseout="this.style.boxShadow='0 2px 4px rgba(249, 115, 22, 0.2)'">
                                ✏️ Editar
                            </button>
                            <button onclick="ConsolidadoTurnos.eliminarTurno('${clave}')" style="padding: 8px 12px; background: #ef4444; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 600;" ${protegido || usados > 0 ? 'disabled' : ''}>
                                🗑️ Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        lista.innerHTML = html;

        console.log('[ConsolidadoTurnos] 📋 Lista de turnos cargada:', Object.keys(turnos).length);
    }

    /**
     * Edita un tipo de turno existente
     */
    function editarTurno(clave) {
        if (typeof TurnosTypesManager === 'undefined') return;

        const turno = TurnosTypesManager.obtenerTurnoPorClave?.(clave);
        if (!turno) return;

        state.turnoEnEdicion = clave;
        document.getElementById('turnoIdEdicion').value = clave;
        document.getElementById('turno_nombre').value = turno.nombre;
        document.getElementById('turno_inicial').value = turno.inicial;
        document.getElementById('turno_horario').value = turno.horario;
        document.getElementById('turno_horas').value = turno.horas;
        document.getElementById('turno_color').value = turno.color;
        document.getElementById('turno_color_hex').value = turno.color;
        
        const formulario = document.getElementById('formularioTurno');
        if (formulario) formulario.style.display = 'block';
        
        document.getElementById('turno_nombre').focus();
    }

    /**
     * Guarda un tipo de turno (nuevo o editado)
     */
    function guardarTurno() {
        const clave = document.getElementById('turnoIdEdicion').value;
        const nombre = document.getElementById('turno_nombre').value.trim();
        const inicial = document.getElementById('turno_inicial').value.trim();
        const horario = document.getElementById('turno_horario').value.trim();
        const horas = parseFloat(document.getElementById('turno_horas').value) || 0;
        const color = document.getElementById('turno_color').value;

        if (!nombre || !inicial || horas < 0 || horas > 24) {
            alert('Por favor, completa los campos correctamente');
            return;
        }

        if (typeof TurnosTypesManager === 'undefined') {
            alert('Sistema de turnos no disponible');
            return;
        }

        let resultado;
        if (clave) {
            // Editar turno existente
            resultado = TurnosTypesManager.actualizarTurno(clave, nombre, inicial, horario, horas, color);
        } else {
            // Crear nuevo turno
            resultado = TurnosTypesManager.crearTurno(nombre, inicial, horario, horas, color);
        }

        if (!resultado.exito) {
            alert('❌ ' + resultado.error);
            return;
        }

        // 🔄 Actualizar UI y propagar cambios
        cargarListaTurnos();
        limpiarFormulario();

        // 📡 Emitir evento de cambio para reactividad
        if (typeof SistemaReactividad !== 'undefined') {
            SistemaReactividad.emit('turnos-types-cambio', { accion: clave ? 'actualizar' : 'crear' });
        }

        // 🔄 Regenerar cuadrantes
        if (typeof UI !== 'undefined') {
            UI.generarCuadranteGeneral();
            UI.generarCuadranteIndividual?.();
        }

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show(`✅ Turno ${clave ? 'actualizado' : 'creado'} correctamente`, 'success');
        }

        console.log('[ConsolidadoTurnos] ✅ Turno guardado:', resultado.clave || clave);
    }

    /**
     * Elimina un tipo de turno
     */
    function eliminarTurno(clave) {
        if (!confirm('¿Está seguro de que desea eliminar este turno?')) return;

        if (typeof TurnosTypesManager === 'undefined') {
            alert('Sistema de turnos no disponible');
            return;
        }

        const resultado = TurnosTypesManager.eliminarTurno(clave);
        if (!resultado.exito) {
            alert('❌ ' + resultado.error);
            return;
        }

        // 🔄 Actualizar UI y propagar cambios
        cargarListaTurnos();
        limpiarFormulario();

        // 📡 Emitir evento de cambio para reactividad
        if (typeof SistemaReactividad !== 'undefined') {
            SistemaReactividad.emit('turnos-types-cambio', { accion: 'eliminar' });
        }

        // 🔄 Regenerar cuadrantes
        if (typeof UI !== 'undefined') {
            UI.generarCuadranteGeneral();
            UI.generarCuadranteIndividual?.();
        }

        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.show('✅ Turno eliminado correctamente', 'success');
        }

        console.log('[ConsolidadoTurnos] ✅ Turno eliminado:', clave);
    }

    /**
     * Limpia el formulario
     */
    function limpiarFormulario() {
        document.getElementById('turnoIdEdicion').value = '';
        document.getElementById('turno_nombre').value = '';
        document.getElementById('turno_inicial').value = '';
        document.getElementById('turno_horario').value = '';
        document.getElementById('turno_horas').value = '';
        document.getElementById('turno_color').value = '#d4edda';
        document.getElementById('turno_color_hex').value = '#d4edda';
        
        const formulario = document.getElementById('formularioTurno');
        if (formulario) formulario.style.display = 'none';
        state.turnoEnEdicion = null;
    }

    /**
     * Obtiene todos los tipos de turnos
     */
    function obtenerTurnos() {
        if (typeof TurnosTypesManager === 'undefined') return {};
        return TurnosTypesManager.obtenerTurnos?.() || {};
    }

    /**
     * Obtiene el estado actual
     */
    function obtenerEstado() {
        return {
            turnos: obtenerTurnos(),
            turnoEnEdicion: state.turnoEnEdicion,
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
        cargarListaTurnos,
        editarTurno,
        guardarTurno,
        eliminarTurno,
        limpiarFormulario,
        obtenerTurnos,
        obtenerEstado
    };
})();

console.log('[ConsolidadoTurnos] ✅ Sistema unificado de tipos de turnos cargado');
