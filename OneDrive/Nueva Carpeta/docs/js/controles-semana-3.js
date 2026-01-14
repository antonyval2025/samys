/**
 * CONTROLES SEMANA 3 - Interfaz visual para módulos de análisis
 * Proporciona funciones para abrir paneles de:
 * - AnalizadorConflictos
 * - DashboardAnalytica  
 * - OptimizadorTurnos
 */

// ============================================
// MODALES PARA SEMANA 3
// ============================================

function crearModalSemana3() {
    // Modal principal para Semana 3
    const modal = document.createElement('div');
    modal.id = 'modalSemana3';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>
                <span id="modalSemana3Title">📊 Panel de Análisis</span>
                <button class="close-btn" onclick="document.getElementById('modalSemana3').classList.remove('active')" title="Cerrar">&times;</button>
            </h2>
            
            <div id="modalSemana3Content" class="modal-body">
                <!-- Contenido dinámico aquí -->
            </div>
            
            <div class="modal-footer">
                <button class="modal-btn secondary" onclick="document.getElementById('modalSemana3').classList.remove('active')">Cerrar</button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('modalSemana3')) {
        document.body.appendChild(modal);
    }
    return modal;
}

// ============================================
// 1. ANÁLISIS DE CONFLICTOS
// ============================================

function abrirAnalisis() {
    const modal = document.getElementById('modalSemana3') || crearModalSemana3();
    const titulo = document.getElementById('modalSemana3Title');
    const contenido = document.getElementById('modalSemana3Content');
    
    titulo.textContent = '🚨 Análisis de Conflictos';
    
    try {
        if (typeof AnalizadorConflictos === 'undefined') {
            contenido.innerHTML = '<p style="color: red;">❌ AnalizadorConflictos no está cargado</p>';
            modal.classList.add('active');
            return;
        }
        
        AnalizadorConflictos.init();
        const resumen = AnalizadorConflictos.obtenerResumen();
        
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">📊 Resumen General</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #dc2626;">
                        <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${resumen.totalConflictos}</div>
                        <div style="color: #666; font-size: 13px;">Total Conflictos</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${resumen.alertasCriticas}</div>
                        <div style="color: #666; font-size: 13px;">Alertas Críticas</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                        <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${resumen.advertencias}</div>
                        <div style="color: #666; font-size: 13px;">Advertencias</div>
                    </div>
                </div>
            </div>
        `;
        
        // Análisis por empleado
        html += `<h3 style="margin: 20px 0 15px 0; color: #333;">👥 Conflictos por Empleado</h3>`;
        
        if (empleados && empleados.length > 0) {
            empleados.forEach(emp => {
                const conflictos = AnalizadorConflictos.analizarEmpleado(emp.id);
                const estadoColor = emp.estado === 'activo' ? '#22c55e' : emp.estado === 'vacaciones' ? '#f59e0b' : '#dc2626';
                
                html += `
                    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: bold; color: #333;">${emp.nombre}</div>
                                <div style="font-size: 12px; color: #666;">Departamento: ${emp.departamento || 'N/A'}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="background: ${estadoColor}; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 5px;">${emp.estado}</div>
                                <div style="color: ${conflictos.length > 0 ? '#dc2626' : '#22c55e'}; font-weight: bold;">${conflictos.length} conflicto${conflictos.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>
                        ${conflictos.length > 0 ? `
                            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                                <ul style="margin: 0; padding-left: 20px; font-size: 13px;">
                                    ${conflictos.map(c => `
                                        <li style="margin: 5px 0; color: #666;">
                                            <strong>${c.tipo}</strong> - ${c.descripcion}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `;
            });
        }
        
        contenido.innerHTML = html;
        modal.classList.add('active');
        
    } catch (e) {
        contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
            <strong>❌ Error:</strong> ${e.message}
        </div>`;
        modal.classList.add('active');
    }
}

// ============================================
// 2. MÉTRICAS Y ANALÍTICA
// ============================================

function abrirMetricas() {
    // Delegar al módulo MetricasModule (nueva arquitectura modular)
    if (window.MetricasModule && typeof window.MetricasModule.abrirModal === 'function') {
        console.log('📊 Usando MetricasModule (arquitectura modular)');
        MetricasModule.abrirModal();
    } else {
        // Fallback: usar el código legacy si el módulo no está disponible
        console.warn('⚠️ MetricasModule no disponible, intentando usar DashboardAnalytica legacy');
        const modal = document.getElementById('modalSemana3') || crearModalSemana3();
        const titulo = document.getElementById('modalSemana3Title');
        const contenido = document.getElementById('modalSemana3Content');
        
        titulo.textContent = '📊 Métricas y Analítica';
        
        try {
            if (typeof DashboardAnalytica === 'undefined') {
                contenido.innerHTML = '<p style="color: red;">❌ DashboardAnalytica no está cargado</p>';
                modal.classList.add('active');
                return;
            }
            
            DashboardAnalytica.init();
            const metricas = DashboardAnalytica.obtenerMetricas();
            
            let html = `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333;">📈 KPIs Principales</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
                        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                            <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${metricas.kpis.ocupacion}%</div>
                            <div style="color: #666; font-size: 13px;">Ocupación</div>
                            <div style="font-size: 11px; color: #999; margin-top: 5px;">Uso de turnos asignados</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                            <div style="font-size: 28px; font-weight: bold; color: #10b981;">${metricas.kpis.eficiencia}%</div>
                            <div style="color: #666; font-size: 13px;">Eficiencia</div>
                            <div style="font-size: 11px; color: #999; margin-top: 5px;">Cumplimiento de horas</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                            <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${metricas.kpis.equidadScore}%</div>
                            <div style="color: #666; font-size: 13px;">Equidad (Gini)</div>
                            <div style="font-size: 11px; color: #999; margin-top: 5px;">0=Perfecta, 100=Máximo desequilibrio</div>
                        </div>
                    </div>
                </div>
            `;
            
            contenido.innerHTML = html;
            modal.classList.add('active');
            
        } catch (e) {
            contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
                <strong>❌ Error:</strong> ${e.message}
            </div>`;
            modal.classList.add('active');
        }
    }
}

// ============================================
// 3. OPTIMIZACIÓN DE TURNOS
// ============================================

function abrirOptimizacion() {
    const modal = document.getElementById('modalSemana3') || crearModalSemana3();
    const titulo = document.getElementById('modalSemana3Title');
    const contenido = document.getElementById('modalSemana3Content');
    
    titulo.textContent = '⚡ Optimización de Turnos';
    
    try {
        if (typeof OptimizadorTurnos === 'undefined') {
            contenido.innerHTML = '<p style="color: red;">❌ OptimizadorTurnos no está cargado</p>';
            modal.classList.add('active');
            return;
        }
        
        OptimizadorTurnos.init();
        const resumen = OptimizadorTurnos.obtenerResumen();
        const mejorSugerencia = OptimizadorTurnos.obtenerMejorSugerencia();
        
        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">💡 Resumen de Sugerencias</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px;">
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                        <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${resumen.totalSugerencias}</div>
                        <div style="color: #666; font-size: 13px;">Total Sugerencias</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                        <div style="font-size: 24px; font-weight: bold; color: #10b981;">${resumen.porTipo.balanceo}</div>
                        <div style="color: #666; font-size: 13px;">Balanceo</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${resumen.porTipo.mejora}</div>
                        <div style="color: #666; font-size: 13px;">Mejora</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
                        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${resumen.porTipo.prevención}</div>
                        <div style="color: #666; font-size: 13px;">Prevención</div>
                    </div>
                </div>
            </div>
        `;
        
        // Mejor sugerencia destacada
        if (mejorSugerencia) {
            const colorPrioridad = mejorSugerencia.prioridad === 'critica' ? '#dc2626' : 
                                  mejorSugerencia.prioridad === 'alta' ? '#f59e0b' : 
                                  mejorSugerencia.prioridad === 'media' ? '#3b82f6' : '#22c55e';
            
            html += `
                <div style="background: white; border: 2px solid ${colorPrioridad}; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">🏆 Mejor Sugerencia</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div>
                            <div style="color: #666; font-size: 13px;">Tipo</div>
                            <div style="font-weight: bold; color: #333;">${mejorSugerencia.tipo}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px;">Prioridad</div>
                            <div style="background: ${colorPrioridad}; color: white; padding: 4px 10px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 12px;">${mejorSugerencia.prioridad.toUpperCase()}</div>
                        </div>
                    </div>
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; border-left: 3px solid ${colorPrioridad};">
                        <div style="color: #333; margin-bottom: 10px;">${mejorSugerencia.sugerencia || mejorSugerencia.mensaje}</div>
                        ${mejorSugerencia.empleado ? `<div style="color: #666; font-size: 12px;">👤 Empleado: <strong>${mejorSugerencia.empleado}</strong></div>` : ''}
                    </div>
                </div>
            `;
        }
        
        // Desglose por prioridad
        html += `
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
                <h3 style="margin: 0 0 15px 0; color: #333;">🎯 Sugerencias por Prioridad</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px;">
                    <div style="text-align: center; padding: 12px; background: #fef2f2; border-radius: 6px; border-left: 3px solid #dc2626;">
                        <div style="font-size: 20px; font-weight: bold; color: #dc2626;">${resumen.porPrioridad.critica}</div>
                        <div style="color: #666; font-size: 12px;">Crítica</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background: #fffbeb; border-radius: 6px; border-left: 3px solid #f59e0b;">
                        <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${resumen.porPrioridad.alta}</div>
                        <div style="color: #666; font-size: 12px;">Alta</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background: #eff6ff; border-radius: 6px; border-left: 3px solid #3b82f6;">
                        <div style="font-size: 20px; font-weight: bold; color: #3b82f6;">${resumen.porPrioridad.media}</div>
                        <div style="color: #666; font-size: 12px;">Media</div>
                    </div>
                    <div style="text-align: center; padding: 12px; background: #f0fdf4; border-radius: 6px; border-left: 3px solid #22c55e;">
                        <div style="font-size: 20px; font-weight: bold; color: #22c55e;">${resumen.porPrioridad.baja}</div>
                        <div style="color: #666; font-size: 12px;">Baja</div>
                    </div>
                </div>
            </div>
        `;
        
        contenido.innerHTML = html;
        modal.classList.add('active');
        
    } catch (e) {
        contenido.innerHTML = `<div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 6px;">
            <strong>❌ Error:</strong> ${e.message}
        </div>`;
        modal.classList.add('active');
    }
}
