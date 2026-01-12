// =============================================
// EJEMPLOS DE USO Y BEST PRACTICES
// =============================================

/**
 * Este archivo contiene ejemplos prácticos de cómo usar
 * el sistema de gestión de turnos para diferentes casos de uso
 */

// =============================================
// EJEMPLO 1: Inicializar la Aplicación
// =============================================

function inicializarAplicacion() {
    // 1. Cargar datos de localStorage
    AppState.loadFromStorage();
    EmployeeManager.cargarDelStorage();
    SistemaAuditoria.cargarHistorial();

    // 2. Inicializar cuadrante
    TurnoManager.inicializarDatos();

    // 3. Renderizar UI
    UI.generarCuadranteGeneral();
    EmployeeManager.actualizarSelectEmpleados();

    // 4. Configurar listeners
    configurarListeners();

    console.log('✅ Aplicación inicializada correctamente');
}

// =============================================
// EJEMPLO 2: Crear un Empleado Completo
// =============================================

function crearEmpleadoCompleto(datos) {
    // Validar datos
    const validacion = ValidadorTurnos.validarEmpleado(datos);
    if (!validacion.valido) {
        NotificationSystem.show(`Error: ${validacion.errores[0]}`, 'error');
        return false;
    }

    // Crear empleado
    const nuevoEmpleado = {
        id: Math.max(...empleados.map(e => e.id), 0) + 1,
        ...datos
    };

    // Guardar
    empleados.push(nuevoEmpleado);
    EmployeeManager.guardarEnStorage();

    // Generar turnos
    const turnos = TurnoManager.generarTurnosEmpleado(
        nuevoEmpleado,
        DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth)
    );
    AppState.scheduleData.set(nuevoEmpleado.id, turnos);

    // Actualizar UI
    UI.generarCuadranteGeneral();
    EmployeeManager.actualizarSelectEmpleados();

    NotificationSystem.show(`Empleado "${nuevoEmpleado.nombre}" creado`, 'success');
    return true;
}

// Uso
const empleadoNuevo = {
    nombre: "Ana María López",
    departamento: "Operaciones",
    horasContrato: 160,
    turnoPrincipal: "Mañana",
    estado: "activo",
    email: "ana.maria@empresa.com",
    telefono: "+34 600 999 888"
};

// crearEmpleadoCompleto(empleadoNuevo);

// =============================================
// EJEMPLO 3: Cambiar Turno con Validación
// =============================================

function cambiarTurnoConValidacion(empleadoId, dia, nuevoTurno) {
    // 1. Validar cambio
    const validacion = RestriccionesTurnos.validarCambioTurno(
        AppState.scheduleData,
        empleadoId,
        dia,
        nuevoTurno,
        empleados
    );

    // 2. Mostrar advertencias
    if (validacion.advertencias.length > 0) {
        validacion.advertencias.forEach(adv => {
            NotificationSystem.show(adv, 'warning');
        });
    }

    // 3. Si hay errores, abortar
    if (!validacion.permitido) {
        NotificationSystem.show(`Error: ${validacion.errores[0]}`, 'error');
        return false;
    }

    // 4. Registrar en auditoría
    const turnoAnterior = AppState.scheduleData.get(empleadoId)[dia - 1]?.turno;
    SistemaAuditoria.registrarCambio({
        empleadoId,
        dia,
        turnoAnterior,
        nuevoTurno,
        razon: 'Cambio manual validado'
    });

    // 5. Aplicar cambio
    AppState.agregarCambio(empleadoId, dia, nuevoTurno);
    AppState.aplicarCambiosPendientes();
    
    NotificationSystem.show('Turno actualizado', 'success');
    return true;
}

// Uso
// cambiarTurnoConValidacion(1, 15, 'noche');

// =============================================
// EJEMPLO 4: Balancear Automáticamente
// =============================================

function balancearTurnosAutomaticamente() {
    // 1. Obtener análisis actual
    const equidad = BalanceadorTurnos.calcularEquidad(
        AppState.scheduleData,
        empleados
    );

    console.log(`📊 Índice de equidad: ${(equidad * 100).toFixed(1)}%`);

    if (equidad > 0.9) {
        NotificationSystem.show('✅ Turnos ya están bien balanceados', 'info');
        return;
    }

    // 2. Aplicar balanceo
    const resultado = BalanceadorTurnos.aplicarBalanceoAutomatico(
        AppState.scheduleData,
        empleados,
        DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth)
    );

    // 3. Mostrar cambios propuestos
    console.log('Cambios propuestos:');
    resultado.cambiosPropuestos.forEach(cambio => {
        console.log(`  ${empleados.find(e => e.id === cambio.empleadoId).nombre}: Día ${cambio.dia} → ${cambio.nuevoTurno}`);
    });

    // 4. Aplicar si el usuario acepta
    if (resultado.cambiosPropuestos.length > 0) {
        resultado.cambiosPropuestos.forEach(cambio => {
            AppState.agregarCambio(cambio.empleadoId, cambio.dia, cambio.nuevoTurno);
        });

        AppState.aplicarCambiosPendientes();
        UI.generarCuadranteGeneral();

        NotificationSystem.show(
            `${resultado.cambiosPropuestos.length} turnos balanceados. Equidad: ${(resultado.horasDiferencia.horas.length > 0 ? 'mejorada' : 'igual')}`,
            'success'
        );
    }
}

// =============================================
// EJEMPLO 5: Generar Reporte Completo
// =============================================

function generarReporteCompleto() {
    const mes = DateUtils.getNombreMes(AppState.currentMonth);
    const año = AppState.currentYear;

    console.log(`\n📊 REPORTE MENSUAL - ${mes} ${año}\n`);

    // 1. Reporte de rotación
    const reporteRotacion = GeneradorReportes.generarReporteRotacion(
        AppState.scheduleData,
        empleados
    );

    console.log('=== ROTACIÓN DE TURNOS ===');
    reporteRotacion.empleados.forEach(emp => {
        console.log(`${emp.nombre}:`);
        console.log(`  Mañana: ${emp.mañana}, Tarde: ${emp.tarde}, Noche: ${emp.noche}`);
        console.log(`  Horas: ${emp.horasTotales}h (${emp.porcentajeTrabajo}% trabajo)`);
    });

    // 2. Reporte de horas
    const reporteHoras = GeneradorReportes.generarReporteCumplimientoHoras(
        AppState.scheduleData,
        empleados
    );

    console.log('\n=== CUMPLIMIENTO DE HORAS ===');
    reporteHoras.detalle.forEach(emp => {
        const emoji = emp.estado === 'Cumplimiento' ? '✅' : 
                      emp.estado === 'Advertencia' ? '⚠️' : '❌';
        console.log(`${emoji} ${emp.empleado}: ${emp.horasReales}h / ${emp.horasContratadas}h (${emp.porcentaje}%)`);
    });

    // 3. Reporte de turnos nocturnos
    const reporteNoche = GeneradorReportes.generarReporteTurnosNocturno(
        AppState.scheduleData,
        empleados
    );

    console.log('\n=== TURNOS NOCTURNOS ===');
    console.log(`Promedio: ${reporteNoche.analisis.promedio}`);
    console.log(`Equilibrio: ${reporteNoche.analisis.equilibrio}%`);
    reporteNoche.detalle.forEach(emp => {
        console.log(`  ${emp.empleado}: ${emp.turnosNoche}`);
    });

    // 4. Predicciones
    const predicciones = PredictorConflictos.predecirConflictos(
        AppState.scheduleData,
        empleados
    );

    if (predicciones.alertasRojas.length > 0) {
        console.log('\n🔴 ALERTAS CRÍTICAS:');
        predicciones.alertasRojas.forEach(alerta => {
            console.log(`  ${alerta.empleado}: ${alerta.mensaje}`);
        });
    }

    return {
        rotacion: reporteRotacion,
        horas: reporteHoras,
        noche: reporteNoche,
        predicciones
    };
}

// =============================================
// EJEMPLO 6: Detectar y Resolver Conflictos
// =============================================

function detectarYResolverConflictos() {
    const conflictos = RestriccionesTurnos.detectarConflictos(
        AppState.scheduleData,
        empleados
    );

    if (conflictos.length === 0) {
        NotificationSystem.show('✅ No hay conflictos detectados', 'success');
        return;
    }

    console.log(`⚠️ Se detectaron ${conflictos.length} conflicto(s):\n`);

    const conflictosPorSeveridad = {
        error: [],
        warning: []
    };

    conflictos.forEach(c => {
        conflictosPorSeveridad[c.severidad].push(c);
        console.log(`[${c.severidad.toUpperCase()}] ${c.empleado} (Día ${c.dia}): ${c.mensaje}`);
    });

    // Sugerir soluciones
    if (conflictosPorSeveridad.error.length > 0) {
        console.log('\n💡 Sugerencias de resolución:');
        conflictosPorSeveridad.error.forEach(c => {
            if (c.tipo === 'descanso_insuficiente') {
                console.log(`  → ${c.empleado}: Agregar más descansos`);
            }
            if (c.tipo === 'estado_incompatible') {
                console.log(`  → ${c.empleado}: Ajustar estado del empleado o turnos`);
            }
        });
    }

    return conflictos;
}

// =============================================
// EJEMPLO 7: Exportar Datos en Diferentes Formatos
// =============================================

function exportarEnMultiplesFormatos() {
    const mes = DateUtils.getNombreMes(AppState.currentMonth);
    const año = AppState.currentYear;

    // 1. Exportar HTML para impresión
    const reporte = GeneradorReportes.generarReporteRotacion(
        AppState.scheduleData,
        empleados
    );
    GeneradorReportes.exportarReporteHTML(reporte);

    // 2. Exportar CSV individual
    if (AppState.selectedEmployee) {
        ExportManager.generarCSVIndividual(AppState.selectedEmployee.id);
    }

    // 3. Exportar auditoría
    SistemaAuditoria.exportarAuditoria();

    // 4. Exportar estado completo como JSON
    const estadoCompleto = {
        periodo: `${mes} ${año}`,
        empleados,
        scheduleData: Array.from(AppState.scheduleData.entries()),
        cambiosRealizados: SistemaAuditoria.historial
    };

    const blob = new Blob([JSON.stringify(estadoCompleto, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuadrante_${mes}_${año}.json`;
    a.click();

    NotificationSystem.show('Datos exportados en múltiples formatos', 'success');
}

// =============================================
// EJEMPLO 8: Búsqueda y Filtrado Avanzado
// =============================================

function buscarEmpleadosPorCriterios(criterios) {
    return empleados.filter(emp => {
        // Filtro por nombre
        if (criterios.nombre && !emp.nombre.toLowerCase().includes(criterios.nombre.toLowerCase())) {
            return false;
        }

        // Filtro por departamento
        if (criterios.departamento && emp.departamento !== criterios.departamento) {
            return false;
        }

        // Filtro por turno
        if (criterios.turno && emp.turnoPrincipal !== criterios.turno) {
            return false;
        }

        // Filtro por estado
        if (criterios.estado && emp.estado !== criterios.estado) {
            return false;
        }

        // Filtro por rango de horas
        if (criterios.horasMin && emp.horasContrato < criterios.horasMin) {
            return false;
        }
        if (criterios.horasMax && emp.horasContrato > criterios.horasMax) {
            return false;
        }

        return true;
    });
}

// Uso
const empleadosOperaciones = buscarEmpleadosPorCriterios({
    departamento: 'Operaciones',
    estado: 'activo'
});

// =============================================
// EJEMPLO 9: Sistema de Permisos
// =============================================

function aplicarPermisosBasadosEnRol() {
    const rol = AppState.userRole;
    
    // Admin: acceso total
    if (rol === 'admin') {
        document.querySelectorAll('[data-require-admin]').forEach(el => {
            el.style.display = 'block';
        });
    }

    // Supervisor: solo ver y reportar
    else if (rol === 'supervisor') {
        document.querySelectorAll('[data-require-edit]').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('[data-require-delete]').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Empleado: solo ver su cuadrante
    else if (rol === 'empleado') {
        document.querySelectorAll('[data-require-admin]').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('[data-require-edit]').forEach(el => {
            el.style.display = 'none';
        });
        document.getElementById('selectEmpleado').value = AppState.selectedEmployee?.id || '';
        document.getElementById('selectEmpleado').disabled = true;
    }
}

// =============================================
// EJEMPLO 10: Monitoreo y Alertas Proactivas
// =============================================

function configurarAlertas() {
    // Ejecutar cada 5 minutos
    setInterval(() => {
        const predicciones = PredictorConflictos.predecirConflictos(
            AppState.scheduleData,
            empleados
        );

        if (predicciones.alertasRojas.length > 0) {
            predicciones.alertasRojas.slice(0, 1).forEach(alerta => {
                NotificationSystem.show(
                    `🔴 ${alerta.empleado}: ${alerta.tipo}`,
                    'error'
                );
            });
        }

        if (predicciones.alertasMedias.length > 0) {
            predicciones.alertasMedias.slice(0, 1).forEach(alerta => {
                NotificationSystem.show(
                    `⚠️ ${alerta.empleado}: ${alerta.tipo}`,
                    'warning'
                );
            });
        }
    }, 5 * 60 * 1000);
}

// =============================================
// HELPER: Configurar Event Listeners
// =============================================

function configurarListeners() {
    // Cambio de mes
    document.getElementById('selectMonth')?.addEventListener('change', (e) => {
        AppState.setMonth(parseInt(e.target.value));
        TurnoManager.reiniciarDatos();
    });

    document.getElementById('selectYear')?.addEventListener('change', (e) => {
        AppState.setYear(parseInt(e.target.value));
        TurnoManager.reiniciarDatos();
    });

    // Selección de empleado
    document.getElementById('selectEmpleado')?.addEventListener('change', (e) => {
        const empleado = empleados.find(emp => emp.id === parseInt(e.target.value));
        if (empleado) {
            AppState.setEmployee(empleado);
            UI.generarCuadranteIndividual();
            UI.actualizarEstadisticasIndividual();
        }
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId)?.classList.add('active');
        });
    });

    console.log('✅ Listeners configurados');
}
