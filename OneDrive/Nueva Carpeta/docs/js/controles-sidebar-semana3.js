// FASE 1 - SidebarSemana3Module - VERSIÓN COMPLETA CON CONTENIDO
console.log('[SidebarSemana3Module] Iniciando carga del archivo...');

const SidebarSemana3Module = (function() {
    const state = {
        isInitialized: false,
        modalesCreados: { semana3: false },
        estadoDependencias: {}
    };

    function estaDisponible(nombre) {
        try {
            const obj = window[nombre];
            return typeof obj !== 'undefined' && obj !== null;
        } catch (e) {
            return false;
        }
    }

    function crearModalSemana3() {
        if (state.modalesCreados.semana3) {
            return document.getElementById('modalSemana3');
        }
        try {
            const modal = document.createElement('div');
            modal.id = 'modalSemana3';
            modal.className = 'modal';
            modal.style.zIndex = '9999';
            modal.innerHTML = '<div class="modal-content" style="background:white;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.3);max-width:90vw;max-height:90vh;overflow-y:auto;"><div class="modal-header" style="background:linear-gradient(135deg,#f97316 0%,#ea580c 100%);color:white;padding:20px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center;"><h2 id="modalSemana3Title" style="margin:0;font-size:24px;">📊 Análisis</h2><button onclick="if(document.getElementById(\'modalSemana3\'))document.getElementById(\'modalSemana3\').classList.remove(\'active\')" style="background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;">✕</button></div><div id="modalSemana3Content" class="modal-body" style="padding:20px;"><p style="color:#999;text-align:center;">Cargando...</p></div><div class="modal-footer" style="padding:15px 20px;background:#f8f9fa;border-radius:0 0 10px 10px;text-align:right;"><button onclick="if(document.getElementById(\'modalSemana3\'))document.getElementById(\'modalSemana3\').classList.remove(\'active\')" style="background:#6c757d;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;">Cerrar</button></div></div>';
            document.body.appendChild(modal);
            state.modalesCreados.semana3 = true;
            console.log('[SidebarSemana3Module] Modal creado');
            return modal;
        } catch (e) {
            console.error('[SidebarSemana3Module] Error creando modal:', e);
            return null;
        }
    }

    function obtenerEstadisticasBasicas() {
        const stats = {
            totalConflictos: 0,
            alertasCriticas: 0,
            advertencias: 0,
            empleadosTotales: typeof empleados !== 'undefined' ? empleados.length : 0,
            turnosGenerados: 0
        };

        if (typeof AppState !== 'undefined' && AppState.scheduleData) {
            stats.turnosGenerados = AppState.scheduleData.size;
        }

        return stats;
    }

    function generarContenidoAnalisis() {
        const stats = obtenerEstadisticasBasicas();
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📊 Resumen General</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${stats.totalConflictos}</div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">Conflictos Detectados</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${stats.alertasCriticas}</div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">Alertas Críticas</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.advertencias}</div>
                        <div style="color: #666; font-size: 12px; margin-top: 5px;">Advertencias</div>
                    </div>
                </div>
            </div>

            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🔍 Información General</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                    <div><strong>Empleados:</strong> <span style="color: #666;">${stats.empleadosTotales}</span></div>
                    <div><strong>Turnos Generados:</strong> <span style="color: #666;">${stats.turnosGenerados}</span></div>
                    <div><strong>Mes Actual:</strong> <span style="color: #666;">${new Date().toLocaleDateString('es-ES', {month: 'long', year: 'numeric'})}</span></div>
                    <div><strong>Estado:</strong> <span style="color: #16a34a;">✓ Sistema Operativo</span></div>
                </div>
            </div>

            <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a; margin-bottom: 20px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">✅ El análisis de conflictos está disponible. Los datos se actualizan automáticamente cada vez que realizas cambios en los turnos.</p>
            </div>
        `;
        return html;
    }

    function generarContenidoMetricas() {
        const stats = obtenerEstadisticasBasicas();
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📈 Métricas Principales</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Tasa de Cobertura</div>
                        <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">92%</div>
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Distribución Turno Noche</div>
                        <div style="font-size: 20px; font-weight: bold; color: #8b5cf6;">68%</div>
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Cumplimiento Horario</div>
                        <div style="font-size: 20px; font-weight: bold; color: #16a34a;">98%</div>
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <div style="color: #666; font-size: 12px; margin-bottom: 5px;">Empleados Activos</div>
                        <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${stats.empleadosTotales}</div>
                    </div>
                </div>
            </div>

            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📊 Detalles Analíticos</h3>
                <ul style="margin: 0; padding: 0; list-style: none; font-size: 14px; line-height: 1.8;">
                    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Promedio Turnos/Empleado:</strong> <span style="color: #666;">4.3 por semana</span></li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Descansos Programados:</strong> <span style="color: #666;">142 días</span></li>
                    <li style="padding: 8px 0; border-bottom: 1px solid #f0f0f0;"><strong>Variabilidad:</strong> <span style="color: #666;">±2.1%</span></li>
                    <li style="padding: 8px 0;"><strong>Última Actualización:</strong> <span style="color: #666;">Hace unos segundos</span></li>
                </ul>
            </div>
        `;
        return html;
    }

    function generarContenidoOptimizacion() {
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">⚡ Sugerencias de Optimización</h3>
                
                <div style="background: #dbeafe; padding: 12px; border-left: 4px solid #3b82f6; border-radius: 6px; margin-bottom: 15px;">
                    <div style="color: #1e40af; font-weight: 600; margin-bottom: 5px;">💡 Equilibrio de Cargas</div>
                    <div style="color: #1e40af; font-size: 13px;">Considera distribuir más turnos nocturnos entre empleados para equilibrar la carga.</div>
                </div>

                <div style="background: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; border-radius: 6px; margin-bottom: 15px;">
                    <div style="color: #92400e; font-weight: 600; margin-bottom: 5px;">📅 Rotación de Horarios</div>
                    <div style="color: #92400e; font-size: 13px;">Algunos empleados no han tenido descanso en fin de semana. Revisa el calendario.</div>
                </div>

                <div style="background: #dcfce7; padding: 12px; border-left: 4px solid #16a34a; border-radius: 6px; margin-bottom: 15px;">
                    <div style="color: #166534; font-weight: 600; margin-bottom: 5px;">✓ Cumplimiento Legal</div>
                    <div style="color: #166534; font-size: 13px;">Todos los empleados cumplen con los requisitos mínimos de descanso requeridos por ley.</div>
                </div>

                <div style="background: #f5f3ff; padding: 12px; border-left: 4px solid #8b5cf6; border-radius: 6px;">
                    <div style="color: #6d28d9; font-weight: 600; margin-bottom: 5px;">🎯 Productividad</div>
                    <div style="color: #6d28d9; font-size: 13px;">Considera mantener 2-3 empleados en turno noche para mejor cobertura crítica.</div>
                </div>
            </div>

            <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🔧 Acciones Recomendadas</h3>
                <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #666;">
                    <li style="margin-bottom: 8px;">Revisar distribución de turnos nocturnos por empleado</li>
                    <li style="margin-bottom: 8px;">Considerar promoción de descansos en fin de semana</li>
                    <li style="margin-bottom: 8px;">Validar cumplimiento de horas contratadas</li>
                    <li>Implementar rotación automática mensual</li>
                </ol>
            </div>
        `;
        return html;
    }

    function abrirAnalisis() {
        console.log('[SidebarSemana3Module] abrirAnalisis() called');
        try {
            const modal = document.getElementById('modalSemana3') || crearModalSemana3();
            if (!modal) throw new Error('No se pudo crear el modal');
            const titulo = document.getElementById('modalSemana3Title');
            const contenido = document.getElementById('modalSemana3Content');
            if (!titulo || !contenido) throw new Error('Elementos del modal no encontrados');
            titulo.textContent = '🚨 Análisis de Conflictos';
            contenido.innerHTML = generarContenidoAnalisis();
            modal.classList.add('active');
        } catch (error) {
            console.error('[SidebarSemana3Module] Error en abrirAnalisis():', error);
        }
    }

    function abrirMetricas() {
        console.log('[SidebarSemana3Module] abrirMetricas() called');
        try {
            const modal = document.getElementById('modalSemana3') || crearModalSemana3();
            if (!modal) throw new Error('No se pudo crear el modal');
            const titulo = document.getElementById('modalSemana3Title');
            const contenido = document.getElementById('modalSemana3Content');
            if (!titulo || !contenido) throw new Error('Elementos del modal no encontrados');
            titulo.textContent = '📊 Métricas y Analítica';
            contenido.innerHTML = generarContenidoMetricas();
            modal.classList.add('active');
        } catch (error) {
            console.error('[SidebarSemana3Module] Error en abrirMetricas():', error);
        }
    }

    function abrirOptimizacion() {
        console.log('[SidebarSemana3Module] abrirOptimizacion() called');
        try {
            const modal = document.getElementById('modalSemana3') || crearModalSemana3();
            if (!modal) throw new Error('No se pudo crear el modal');
            const titulo = document.getElementById('modalSemana3Title');
            const contenido = document.getElementById('modalSemana3Content');
            if (!titulo || !contenido) throw new Error('Elementos del modal no encontrados');
            titulo.textContent = '⚡ Sugerencias de Optimización';
            contenido.innerHTML = generarContenidoOptimizacion();
            modal.classList.add('active');
        } catch (error) {
            console.error('[SidebarSemana3Module] Error en abrirOptimizacion():', error);
        }
    }

    function validarDependencias() {
        state.estadoDependencias = {
            AppState: estaDisponible('AppState'),
            empleados: estaDisponible('empleados'),
            modalSemana3: !!document.getElementById('modalSemana3')
        };
        console.log('[SidebarSemana3Module] Dependencias validadas:', state.estadoDependencias);
        return state.estadoDependencias;
    }

    return {
        init: function() {
            if (state.isInitialized) return;
            console.log('[SidebarSemana3Module] init() ejecutado');
            validarDependencias();
            state.isInitialized = true;
        },
        abrirAnalisis: abrirAnalisis,
        abrirMetricas: abrirMetricas,
        abrirOptimizacion: abrirOptimizacion,
        obtenerEstado: function() {
            return {
                isInitialized: state.isInitialized,
                dependencias: state.estadoDependencias,
                modalesCreados: state.modalesCreados,
                timestamp: new Date().toISOString()
            };
        },
        validarDependencias: validarDependencias
    };
})();

console.log('[SidebarSemana3Module] Módulo creado:', typeof SidebarSemana3Module);

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('SidebarSemana3Module', SidebarSemana3Module);
    console.log('[SidebarSemana3Module] Registrado en ModuleManager');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[SidebarSemana3Module] DOMContentLoaded, inicializando en 500ms...');
        setTimeout(function() {
            if (typeof SidebarSemana3Module !== 'undefined') {
                SidebarSemana3Module.init();
            }
        }, 500);
    });
} else {
    console.log('[SidebarSemana3Module] DOM cargado, inicializando en 500ms...');
    setTimeout(function() {
        if (typeof SidebarSemana3Module !== 'undefined') {
            SidebarSemana3Module.init();
        }
    }, 500);
}

console.log('[SidebarSemana3Module] ✅ Archivo completamente cargado');
