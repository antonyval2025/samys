// GENERADOR TURNOS DEPARTAMENTOS - Generación específica por departamento
console.log('[GeneradorTurnosDepartamentos] Iniciando carga...');

const GeneradorTurnosDepartamentos = (function() {
    const tiposTurnoLimpieza = {
        mañana: { horario: '06:00-12:30', color: '#fbbf24', horas: 6.5, descripcion: 'Mañana' },
        tarde: { horario: '12:30-19:00', color: '#60a5fa', horas: 6.5, descripcion: 'Tarde' },
        descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' },
        guardiadomingo: { horario: '08:00-15:00', color: '#f87171', horas: 6.5, descripcion: 'Guardia Domingo' }
    };

    const tiposTurnoGeneral = {
        mañana: { horario: '08:00-16:00', color: '#d4edda', horas: 8, descripcion: 'Mañana' },
        tarde: { horario: '16:00-00:00', color: '#fff3cd', horas: 8, descripcion: 'Tarde' },
        noche: { horario: '00:00-08:00', color: '#f8d7da', horas: 8, descripcion: 'Noche' },
        descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' }
    };

    function generarTurnosEmpleadoDepartamento(empleadoId, mes, año) {
        if (typeof DepartamentosManager === 'undefined') {
            console.error('[GeneradorTurnosDepartamentos] DepartamentosManager no disponible');
            return [];
        }

        const depto = DepartamentosManager.obtenerDepartamentoEmpleado(empleadoId);
        if (!depto) {
            console.error(`[GeneradorTurnosDepartamentos] Departamento no encontrado para empleado ${empleadoId}`);
            return [];
        }

        console.log(`[GeneradorTurnosDepartamentos] Generando turnos para ${depto.nombre}`);

        if (depto.id === 'limpieza') {
            return generarTurnosLimpieza(empleadoId, mes, año);
        } else if (depto.id === 'enfermeria') {
            return generarTurnosGeneral(empleadoId, mes, año, 8, true);
        } else {
            return generarTurnosGeneral(empleadoId, mes, año, 8, depto.turnosNocturnos);
        }
    }

    // 🔑 NUEVA FUNCIÓN: Versión explícita que recibe departamento y estándares directamente
    // Usado por SistemaReactividad para evitar problemas de sincronización
    function generarTurnosEmpleadoDepartamentoExplicito(empleadoId, nombreDepartamento, estandares, mes, año) {
        console.log(`[GeneradorTurnosDepartamentos] 🎯 Generando turnos EXPLÍCITOS para ${empleadoId} en ${nombreDepartamento}`);
        console.log(`[GeneradorTurnosDepartamentos] 📊 Estándares: ${estandares.horasDiarias}h/día, ${estandares.diasTrabajo} días`);

        if (!nombreDepartamento || !estandares) {
            console.error('[GeneradorTurnosDepartamentos] Parámetros incompletos');
            return [];
        }

        // Normalizar nombre de departamento para comparación
        const deptoNormalizado = nombreDepartamento.toLowerCase().trim();

        if (deptoNormalizado === 'limpieza') {
            return generarTurnosLimpiezaExplicito(empleadoId, estandares, mes, año);
        } else {
            return generarTurnosGeneralExplicito(empleadoId, estandares, mes, año);
        }
    }

    function generarTurnosEmpleadoDepartamento(empleadoId, mes, año) {
        if (typeof DepartamentosManager === 'undefined') {
            console.error('[GeneradorTurnosDepartamentos] DepartamentosManager no disponible');
            return [];
        }

        const depto = DepartamentosManager.obtenerDepartamentoEmpleado(empleadoId);
        if (!depto) {
            console.error(`[GeneradorTurnosDepartamentos] Departamento no encontrado para empleado ${empleadoId}`);
            return [];
        }

        console.log(`[GeneradorTurnosDepartamentos] Generando turnos para ${depto.nombre}`);

        if (depto.id === 'limpieza') {
            return generarTurnosLimpieza(empleadoId, mes, año);
        } else if (depto.id === 'enfermeria') {
            return generarTurnosGeneral(empleadoId, mes, año, 8, true);
        } else {
            return generarTurnosGeneral(empleadoId, mes, año, 8, depto.turnosNocturnos);
        }
    }

    function generarTurnosLimpieza(empleadoId, mes, año) {
        const turnos = [];
        const diasEnMes = new Date(año, mes, 0).getDate();
        
        // 📌 Obtener estándares de DepartamentosManager
        const depto = DepartamentosManager ? DepartamentosManager.obtenerDepartamento('limpieza') : null;
        const horasDiarias = depto ? depto.horasDiarias : 6.5;
        const diasTrabajo = depto ? depto.diasTrabajo : 6;
        const diasDescanso = 7 - diasTrabajo;
        
        console.log(`[GeneradorTurnosDepartamentos] 🔄 Limpieza: ${horasDiarias}h/día, ${diasTrabajo} días trabajo, ${diasDescanso} descanso`);
        
        // Crear tipos de turno dinámicamente con horasDiarias del departamento
        const tiposTurnoLimpiezaDinamico = {
            mañana: { horario: '06:00-12:30', color: '#fbbf24', horas: horasDiarias, descripcion: 'Mañana' },
            tarde: { horario: '12:30-19:00', color: '#60a5fa', horas: horasDiarias, descripcion: 'Tarde' },
            descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' },
            guardiadomingo: { horario: '08:00-15:00', color: '#f87171', horas: horasDiarias, descripcion: 'Guardia Domingo' }
        };
        
        // Patrón: X días trabajo (alternando mañana/tarde), Y descanso
        let patternIndex = (empleadoId * 7) % 4;
        const patrones = [
            [0, 1, 0, 1, 0, 1, 2], // M, T, M, T, M, T, Descanso (para 6 días)
            [1, 0, 1, 0, 1, 0, 2], // T, M, T, M, T, M, Descanso
            [0, 1, 0, 1, 0, 1, 2],
            [1, 0, 1, 0, 1, 0, 2]
        ];

        let turnoActual = patrones[patternIndex];
        let turnoIdx = 0;

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(año, mes - 1, dia);
            const esDomingo = fecha.getDay() === 0;
            
            let turno = {};

            if (esDomingo) {
                // Guardia rotativa los domingos
                const semana = Math.floor((dia - 1) / 7);
                const tieneGuardia = (empleadoId + semana) % 3 === 0;
                
                turno = {
                    dia: dia,
                    turno: tieneGuardia ? 'guardiadomingo' : 'descanso',
                    horas: tieneGuardia ? horasDiarias : 0,
                    fecha: fecha,
                    esFinSemana: true,
                    esGuardiaRotativa: tieneGuardia
                };
            } else {
                // Aplicar patrón de X trabajo, Y descanso
                const tipoTurnoIdx = turnoActual[turnoIdx % 7];
                let tipoTurno = 'descanso';
                
                if (tipoTurnoIdx === 0) tipoTurno = 'mañana';
                else if (tipoTurnoIdx === 1) tipoTurno = 'tarde';
                else tipoTurno = 'descanso';

                turno = {
                    dia: dia,
                    turno: tipoTurno,
                    horas: tiposTurnoLimpiezaDinamico[tipoTurno].horas,
                    fecha: fecha,
                    esFinSemana: false,
                    esGuardiaRotativa: false
                };

                turnoIdx++;
            }

            turnos.push(turno);
        }

        console.log(`[GeneradorTurnosDepartamentos] ✅ Generados ${turnos.length} turnos para limpieza (${horasDiarias}h/día)`);
        return turnos;
    }

    function generarTurnosGeneral(empleadoId, mes, año, horasDiarias = 8, conNoche = true) {
        const turnos = [];
        const diasEnMes = new Date(año, mes, 0).getDate();
        
        // 📌 Obtener estándares de DepartamentosManager si existe departamento
        if (typeof DepartamentosManager !== 'undefined') {
            const depto = DepartamentosManager.obtenerDepartamentoEmpleado(empleadoId);
            if (depto && depto.horasDiarias) {
                horasDiarias = depto.horasDiarias;
                console.log(`[GeneradorTurnosDepartamentos] 🔄 ${depto.nombre}: ${horasDiarias}h/día`);
            }
        }
        
        // Crear tipos de turno dinámicamente con horasDiarias del departamento
        const tiposTurnoGeneralDinamico = {
            mañana: { horario: '08:00-16:00', color: '#d4edda', horas: horasDiarias, descripcion: 'Mañana' },
            tarde: { horario: '16:00-00:00', color: '#fff3cd', horas: horasDiarias, descripcion: 'Tarde' },
            noche: { horario: '00:00-08:00', color: '#f8d7da', horas: horasDiarias, descripcion: 'Noche' },
            descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' }
        };
        
        // Patrón rotativo: 5 días trabajo, 2 descanso
        const patrones = [
            ['mañana', 'mañana', 'mañana', 'tarde', 'tarde', 'descanso', 'descanso'],
            ['tarde', 'tarde', 'noche', 'noche', 'mañana', 'descanso', 'descanso'],
            ['noche', 'noche', 'mañana', 'tarde', 'tarde', 'descanso', 'descanso']
        ];

        const patronBase = patrones[empleadoId % patrones.length];
        let turnoIdx = 0;

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(año, mes - 1, dia);
            const tipoTurno = conNoche ? patronBase[turnoIdx % 7] : (patronBase[turnoIdx % 7] === 'noche' ? 'tarde' : patronBase[turnoIdx % 7]);
            
            turnos.push({
                dia: dia,
                turno: tipoTurno,
                horas: tiposTurnoGeneralDinamico[tipoTurno].horas,
                fecha: fecha,
                esFinSemana: fecha.getDay() === 0 || fecha.getDay() === 6
            });

            turnoIdx++;
        }

        return turnos;
    }

    // 🔑 NUEVA FUNCIÓN EXPLÍCITA para Limpieza
    function generarTurnosLimpiezaExplicito(empleadoId, estandares, mes, año) {
        const turnos = [];
        const diasEnMes = new Date(año, mes, 0).getDate();
        
        const horasDiarias = estandares.horasDiarias || 6.5;
        const diasTrabajo = estandares.diasTrabajo || 6;
        
        console.log(`[GeneradorTurnosDepartamentos] 🔄 Limpieza EXPLÍCITO: ${horasDiarias}h/día, ${diasTrabajo} días trabajo`);
        
        // Crear tipos de turno dinámicamente con horasDiarias del estandar
        const tiposTurnoLimpiezaDinamico = {
            mañana: { horario: '06:00-12:30', color: '#fbbf24', horas: horasDiarias, descripcion: 'Mañana' },
            tarde: { horario: '12:30-19:00', color: '#60a5fa', horas: horasDiarias, descripcion: 'Tarde' },
            descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' },
            guardiadomingo: { horario: '08:00-15:00', color: '#f87171', horas: horasDiarias, descripcion: 'Guardia Domingo' }
        };
        
        let patternIndex = (empleadoId * 7) % 4;
        const patrones = [
            [0, 1, 0, 1, 0, 1, 2],
            [1, 0, 1, 0, 1, 0, 2],
            [0, 1, 0, 1, 0, 1, 2],
            [1, 0, 1, 0, 1, 0, 2]
        ];

        let turnoActual = patrones[patternIndex];
        let turnoIdx = 0;

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(año, mes - 1, dia);
            const esDomingo = fecha.getDay() === 0;
            
            let turno = {};

            if (esDomingo) {
                const semana = Math.floor((dia - 1) / 7);
                const tieneGuardia = (empleadoId + semana) % 3 === 0;
                
                turno = {
                    dia: dia,
                    turno: tieneGuardia ? 'guardiadomingo' : 'descanso',
                    horas: tieneGuardia ? horasDiarias : 0,
                    fecha: fecha,
                    esFinSemana: true,
                    esGuardiaRotativa: tieneGuardia
                };
            } else {
                const tipoTurnoIdx = turnoActual[turnoIdx % 7];
                let tipoTurno = 'descanso';
                
                if (tipoTurnoIdx === 0) tipoTurno = 'mañana';
                else if (tipoTurnoIdx === 1) tipoTurno = 'tarde';
                else tipoTurno = 'descanso';

                turno = {
                    dia: dia,
                    turno: tipoTurno,
                    horas: tiposTurnoLimpiezaDinamico[tipoTurno].horas,
                    fecha: fecha,
                    esFinSemana: false,
                    esGuardiaRotativa: false
                };

                turnoIdx++;
            }

            turnos.push(turno);
        }

        return turnos;
    }

    // 🔑 NUEVA FUNCIÓN EXPLÍCITA para General
    function generarTurnosGeneralExplicito(empleadoId, estandares, mes, año) {
        const turnos = [];
        const diasEnMes = new Date(año, mes, 0).getDate();
        
        const horasDiarias = estandares.horasDiarias || 8;
        
        console.log(`[GeneradorTurnosDepartamentos] 🔄 General EXPLÍCITO: ${horasDiarias}h/día`);
        
        // Crear tipos de turno dinámicamente con horasDiarias del estandar
        const tiposTurnoGeneralDinamico = {
            mañana: { horario: '08:00-16:00', color: '#d4edda', horas: horasDiarias, descripcion: 'Mañana' },
            tarde: { horario: '16:00-00:00', color: '#fff3cd', horas: horasDiarias, descripcion: 'Tarde' },
            noche: { horario: '00:00-08:00', color: '#f8d7da', horas: horasDiarias, descripcion: 'Noche' },
            descanso: { horario: 'Descanso', color: '#e5e7eb', horas: 0, descripcion: 'Descanso' }
        };
        
        let patternIndex = (empleadoId * 7) % 3;
        const patrones = [
            [0, 0, 0, 0, 0, 3, 3], // 5 mañana, 2 descanso
            [1, 1, 1, 1, 1, 3, 3], // 5 tarde, 2 descanso
            [2, 2, 2, 2, 2, 3, 3]  // 5 noche, 2 descanso
        ];

        let turnoActual = patrones[patternIndex];
        let turnoIdx = 0;

        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(año, mes - 1, dia);
            const tipoTurnoIdx = turnoActual[turnoIdx % 7];
            let tipoTurno = 'descanso';
            
            if (tipoTurnoIdx === 0) tipoTurno = 'mañana';
            else if (tipoTurnoIdx === 1) tipoTurno = 'tarde';
            else if (tipoTurnoIdx === 2) tipoTurno = 'noche';
            else tipoTurno = 'descanso';

            turnos.push({
                dia: dia,
                turno: tipoTurno,
                horas: tiposTurnoGeneralDinamico[tipoTurno].horas,
                fecha: fecha,
                esFinSemana: fecha.getDay() === 0 || fecha.getDay() === 6
            });

            turnoIdx++;
        }

        return turnos;
    }

    function obtenerTiposTurno(departamentoId = 'default') {
        if (departamentoId === 'limpieza') {
            return tiposTurnoLimpieza;
        }
        return tiposTurnoGeneral;
    }

    function validarTurnosDepartamento(empleadoId, turnos, departamentoId = null) {
        if (!departamentoId) {
            if (typeof DepartamentosManager === 'undefined') return { válido: false };
            const depto = DepartamentosManager.obtenerDepartamentoEmpleado(empleadoId);
            departamentoId = depto ? depto.id : 'default';
        }

        const depto = DepartamentosManager ? DepartamentosManager.obtenerDepartamento(departamentoId) : null;
        if (!depto) return { válido: false, error: 'Departamento no encontrado' };

        const horasTotales = turnos.reduce((sum, t) => sum + (t.horas || 0), 0);
        const diasTrabajo = turnos.filter(t => t.turno !== 'descanso').length;

        return {
            válido: true,
            departamento: depto.nombre,
            horasTotales: horasTotales,
            horasEsperadas: depto.horasSemanales * 4.33, // Aproximado
            diasTrabajo: diasTrabajo,
            diasTrabajoDept: depto.diasTrabajo,
            cumple: true
        };
    }

    return {
        generarTurnosEmpleadoDepartamento: generarTurnosEmpleadoDepartamento,
        generarTurnosEmpleadoDepartamentoExplicito: generarTurnosEmpleadoDepartamentoExplicito,
        generarTurnosLimpieza: generarTurnosLimpieza,
        generarTurnosLimpiezaExplicito: generarTurnosLimpiezaExplicito,
        generarTurnosGeneral: generarTurnosGeneral,
        generarTurnosGeneralExplicito: generarTurnosGeneralExplicito,
        obtenerTiposTurno: obtenerTiposTurno,
        validarTurnosDepartamento: validarTurnosDepartamento,
        tiposTurnoLimpieza: tiposTurnoLimpieza,
        tiposTurnoGeneral: tiposTurnoGeneral
    };
})();

if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('GeneradorTurnosDepartamentos', GeneradorTurnosDepartamentos);
    console.log('[GeneradorTurnosDepartamentos] Registrado en ModuleManager');
}

console.log('[GeneradorTurnosDepartamentos] ✅ Módulo cargado');
