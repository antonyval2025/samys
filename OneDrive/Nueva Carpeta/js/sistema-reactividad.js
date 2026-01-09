/**
 * SISTEMA DE REACTIVIDAD - Propagación automática de cambios
 * Módulo INDEPENDIENTE que observa cambios y propaga actualización
 * Sin modificar código existente - Patrón Observer/Pub-Sub
 */

console.log('[SistemaReactividad] Iniciando carga...');

const SistemaReactividad = (function() {
    
    // 📋 Observadores registrados por tipo de evento
    const observadores = {
        'cambio-departamento-empleado': [],
        'cambio-estandares-departamento': [],
        'regenerar-turnos-empleado': [],
        'actualizar-cuadrante': []
    };

    /**
     * Registra una función que se ejecutará cuando ocurra un evento
     */
    function on(tipoEvento, callback) {
        if (!observadores[tipoEvento]) {
            console.warn(`[SistemaReactividad] Evento desconocido: ${tipoEvento}`);
            return false;
        }
        observadores[tipoEvento].push(callback);
        console.log(`[SistemaReactividad] ✅ Observador registrado para: ${tipoEvento}`);
        return true;
    }

    /**
     * Dispara un evento y notifica a todos los observadores
     */
    function emit(tipoEvento, datos) {
        if (!observadores[tipoEvento]) return false;
        
        console.log(`[SistemaReactividad] 🔔 Evento: ${tipoEvento}`, datos);
        
        observadores[tipoEvento].forEach((callback, idx) => {
            try {
                callback(datos);
            } catch (error) {
                console.error(`[SistemaReactividad] ❌ Error en observador ${idx}:`, error);
            }
        });
        
        return true;
    }

    /**
     * LÓGICA REACTIVA: Cuando cambia departamento de empleado
     * → Regenera sus turnos con los estándares del nuevo departamento
     */
    function setupReactividadDepartamento() {
        // Escuchar cambios de departamento
        on('cambio-departamento-empleado', function(datos) {
            const { empleadoId, nuevoDepartamento, empleadoObj } = datos;
            
            console.log(`[SistemaReactividad] 🔄 Empleado ${empleadoId} cambiado a ${nuevoDepartamento}`);
            
            // Obtener estándares del nuevo departamento
            if (typeof DepartamentosManager === 'undefined') {
                console.warn('[SistemaReactividad] DepartamentosManager no disponible');
                return;
            }

            const depto = DepartamentosManager.obtenerDepartamento(nuevoDepartamento.toLowerCase().replace(/\s+/g, '_'));
            if (!depto) {
                console.warn(`[SistemaReactividad] Departamento no encontrado: ${nuevoDepartamento}`);
                return;
            }

            console.log(`[SistemaReactividad] 📊 Estándares del nuevo depto:`, {
                horas: depto.horasSemanales,
                dias: depto.diasTrabajo,
                horaDia: depto.horasDiarias
            });

            // Regenerar turnos del empleado
            emit('regenerar-turnos-empleado', {
                empleadoId: empleadoId,
                empleadoObj: empleadoObj,
                departamento: nuevoDepartamento,
                estandares: {
                    horasSemanales: depto.horasSemanales,
                    diasTrabajo: depto.diasTrabajo,
                    horasDiarias: depto.horasDiarias
                }
            });
        });

        // Escuchar regeneración de turnos
        on('regenerar-turnos-empleado', function(datos) {
            const { empleadoId, departamento, estandares } = datos;
            
            console.log(`[SistemaReactividad] 🔄 Regenerando turnos para empleado ${empleadoId} con ${estandares.horasDiarias}h/día en departamento: ${departamento}`);

            // Obtener mes/año actual
            if (typeof AppState === 'undefined') {
                console.warn('[SistemaReactividad] AppState no disponible');
                return;
            }

            const mes = AppState.currentMonth;
            const año = AppState.currentYear;
            
            // Usar GeneradorTurnosDepartamentos si está disponible
            if (typeof GeneradorTurnosDepartamentos !== 'undefined') {
                // Pasar departamento explícitamente para evitar problemas de sincronización
                const turnos = GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito(
                    empleadoId, 
                    departamento,  // 🔑 Pasar departamento explícitamente
                    estandares,    // 🔑 Pasar estándares explícitamente
                    mes, 
                    año
                );
                
                if (turnos && turnos.length > 0) {
                    // Guardar turnos en AppState
                    AppState.scheduleData.set(empleadoId, turnos);
                    AppState.saveToStorage();
                    
                    console.log(`[SistemaReactividad] ✅ ${turnos.length} turnos regenerados para empleado ${empleadoId}`);
                    console.log(`[SistemaReactividad] 📈 Horas totales: ${turnos.reduce((sum, t) => sum + (t.horas || 0), 0)}`);

                    // Emitir evento para actualizar UI
                    emit('actualizar-cuadrante', { empleadoId: empleadoId });
                }
            } else {
                console.warn('[SistemaReactividad] GeneradorTurnosDepartamentos no disponible');
            }
        });

        // Escuchar cambios en estándares de departamento
        on('cambio-estandares-departamento', function(datos) {
            const { departamento, horasSemanales, diasTrabajo, horasDiarias } = datos;
            
            console.log(`[SistemaReactividad] 📊 Estándares de ${departamento} cambiados: ${horasSemanales}h, ${diasTrabajo}d, ${horasDiarias}h/d`);

            // Regenerar turnos de TODOS los empleados en este departamento
            if (typeof empleados === 'undefined') {
                console.warn('[SistemaReactividad] array empleados no disponible');
                return;
            }

            const empleadosEnDepto = empleados.filter(e => e.departamento === departamento);
            console.log(`[SistemaReactividad] 🔄 Regenerando ${empleadosEnDepto.length} empleados en ${departamento}`);

            empleadosEnDepto.forEach(emp => {
                emit('regenerar-turnos-empleado', {
                    empleadoId: emp.id,
                    empleadoObj: emp,
                    departamento: departamento,
                    estandares: {
                        horasSemanales: horasSemanales,
                        diasTrabajo: diasTrabajo,
                        horasDiarias: horasDiarias
                    }
                });
            });
        });

        // Escuchar actualización de cuadrante
        on('actualizar-cuadrante', function(datos) {
            const { empleadoId } = datos;
            
            console.log(`[SistemaReactividad] 🎨 Actualizando cuadrante para empleado ${empleadoId}`);

            // Llamar a UI para regenerar tabla
            if (typeof UI !== 'undefined' && typeof UI.generarCuadranteGeneral === 'function') {
                UI.generarCuadranteGeneral();
                console.log(`[SistemaReactividad] ✅ Cuadrante actualizado`);
            }
        });
    }

    // Inicializar reactividad al cargar
    function inicializar() {
        console.log('[SistemaReactividad] 🚀 Inicializando sistema de reactividad');
        setupReactividadDepartamento();
    }

    // API pública
    return {
        inicializar: inicializar,
        on: on,
        emit: emit,
        obtenerObservadores: () => observadores
    };
})();

// Registrar en ModuleManager
if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('SistemaReactividad', SistemaReactividad);
    console.log('[SistemaReactividad] Registrado en ModuleManager');
}

console.log('[SistemaReactividad] ✅ Módulo cargado');
