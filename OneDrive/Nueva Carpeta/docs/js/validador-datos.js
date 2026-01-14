/**
 * ✅ VALIDADOR DATOS - Semana 1
 * Clase centralizada para validar empleados, turnos y datos
 * Sin dependencias externas, funciona con la app existente
 * 
 * @version 1.0.0
 * @date 2 de enero de 2026
 */

class ValidadorDatos {
    /**
     * Validar objeto empleado
     * @param {Object} empleado - Datos del empleado
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarEmpleado(empleado) {
        const errores = [];
        const warnings = [];
        
        if (!empleado) {
            return { valido: false, errores: ['Empleado no definido'], warnings: [] };
        }
        
        // ✅ VALIDACIÓN: Nombre
        if (!empleado.nombre || empleado.nombre.trim().length < 3) {
            errores.push('❌ Nombre debe tener al menos 3 caracteres');
        }
        if (empleado.nombre && empleado.nombre.length > 100) {
            errores.push('❌ Nombre no puede exceder 100 caracteres');
        }
        
        // ✅ VALIDACIÓN: Email
        if (empleado.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(empleado.email)) {
                errores.push('❌ Email inválido: ' + empleado.email);
            }
        } else {
            warnings.push('⚠️ Email no proporcionado');
        }
        
        // ✅ VALIDACIÓN: Teléfono
        if (empleado.telefono) {
            const telefono = empleado.telefono.replace(/\D/g, '');
            if (telefono.length < 9) {
                errores.push('❌ Teléfono debe tener al menos 9 dígitos');
            }
        } else {
            warnings.push('⚠️ Teléfono no proporcionado');
        }
        
        // ✅ VALIDACIÓN: Horas de contrato
        if (empleado.horasContrato) {
            const horas = parseFloat(empleado.horasContrato);
            if (isNaN(horas) || horas < 80 || horas > 240) {
                errores.push('❌ Horas de contrato deben estar entre 80 y 240 (recibido: ' + horas + ')');
            }
        } else {
            warnings.push('⚠️ Horas de contrato no definidas');
        }
        
        // ✅ VALIDACIÓN: Departamento
        if (!empleado.departamento || empleado.departamento.trim().length === 0) {
            errores.push('❌ Departamento es obligatorio');
        }
        
        // ✅ VALIDACIÓN: Estado
        const estadosValidos = ['activo', 'vacaciones', 'baja', 'inactivo'];
        if (empleado.estado && !estadosValidos.includes(empleado.estado.toLowerCase())) {
            errores.push('❌ Estado inválido: ' + empleado.estado + '. Válidos: ' + estadosValidos.join(', '));
        }
        
        // ⚠️ WARNING: Validar si tiene turnos generados
        if (typeof AppState !== 'undefined' && AppState.scheduleData) {
            const turnos = AppState.scheduleData.get(empleado.id);
            if (!turnos || turnos.length === 0) {
                warnings.push('⚠️ Sin turnos generados para este mes');
            }
        }
        
        return {
            valido: errores.length === 0,
            errores: errores,
            warnings: warnings,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Validar DNI español
     * @param {string} dni - DNI a validar
     * @returns {boolean}
     */
    static validarDNI(dni) {
        if (!dni || typeof dni !== 'string') return false;
        
        const regex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/i;
        if (!regex.test(dni.toUpperCase())) return false;
        
        const numero = parseInt(dni.slice(0, -1));
        const letra = dni.slice(-1).toUpperCase();
        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const letraCorrecta = letras[numero % 23];
        
        return letra === letraCorrecta;
    }
    
    /**
     * Validar turno individual
     * @param {Object} params - {empleadoId, turno, dia, mes, anio}
     * @returns {Object} {valido: bool, errores: [], warnings: []}
     */
    static validarTurno(params) {
        const { empleadoId, turno, dia, mes, anio } = params;
        const errores = [];
        const warnings = [];
        
        // ✅ VALIDACIÓN: Parámetros requeridos
        if (!empleadoId || !turno || !dia) {
            return { 
                valido: false, 
                errores: ['Parámetros requeridos: empleadoId, turno, dia'],
                warnings: []
            };
        }
        
        // ✅ VALIDACIÓN: Empleado existe
        const empleado = (typeof empleados !== 'undefined' && empleados.find) 
            ? empleados.find(e => e.id === parseInt(empleadoId))
            : null;
        
        if (!empleado) {
            errores.push('❌ Empleado ' + empleadoId + ' no encontrado');
            return { valido: false, errores, warnings };
        }
        
        // ✅ VALIDACIÓN: Tipo de turno válido
        const tiposTurnoValidos = ['mañana', 'tarde', 'noche', 'mixto', 'descanso', 'vacaciones', 'baja', 'libre', 'festivo'];
        if (!tiposTurnoValidos.includes(turno.toLowerCase())) {
            errores.push('❌ Tipo de turno inválido: ' + turno);
        }
        
        // ✅ VALIDACIÓN: Día válido
        if (dia < 1 || dia > 31) {
            errores.push('❌ Día inválido: ' + dia);
        }
        
        // ⚠️ WARNING: Si hay turnos previos, validar restricciones
        if (typeof AppState !== 'undefined' && AppState.scheduleData) {
            const turnosPrevios = AppState.scheduleData.get(parseInt(empleadoId)) || [];
            
            // Máximo 12 noches por mes
            if (turno.toLowerCase() === 'noche' || turno.toLowerCase() === 'mixto') {
                const noctesEstesMes = turnosPrevios.filter(t => {
                    const esMesValido = t.mes === mes && t.anio === anio;
                    const esNoche = (t.turno === 'noche' || t.turno === 'mixto');
                    return esMesValido && esNoche;
                }).length;
                
                if (noctesEstesMes >= 12) {
                    warnings.push('⚠️ Máximo 12 turnos nocturnos por mes - ya hay ' + noctesEstesMes);
                }
            }
        }
        
        return {
            valido: errores.length === 0,
            errores,
            warnings,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Validar rango de fechas
     * @param {Object} params - {fechaInicio, fechaFin}
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarRangoFechas(params) {
        const { fechaInicio, fechaFin } = params;
        const errores = [];
        
        if (!fechaInicio || !fechaFin) {
            return { valido: false, errores: ['Fechas requeridas'] };
        }
        
        const f1 = new Date(fechaInicio);
        const f2 = new Date(fechaFin);
        
        if (isNaN(f1.getTime()) || isNaN(f2.getTime())) {
            errores.push('❌ Fechas inválidas');
        }
        
        if (f1 > f2) {
            errores.push('❌ Fecha inicio no puede ser posterior a fecha fin');
        }
        
        const diffDias = Math.floor((f2 - f1) / (1000 * 60 * 60 * 24));
        if (diffDias > 90) {
            errores.push('⚠️ Rango muy amplio (' + diffDias + ' días)');
        }
        
        return {
            valido: errores.length === 0,
            errores,
            diasEnRango: diffDias
        };
    }
    
    /**
     * Validar cambio de turno masivo
     * @param {Object} params - {empleadoIds, fechaInicio, fechaFin, nuevoTurno}
     * @returns {Object} {valido, errores, warnings, preview}
     */
    static validarCambioMasivo(params) {
        const { empleadoIds, fechaInicio, fechaFin, nuevoTurno } = params;
        const errores = [];
        const warnings = [];
        let preview = {
            empleadosAfectados: 0,
            turnosCambiados: 0,
            horasImpactadas: 0
        };
        
        // ✅ VALIDACIÓN: Parámetros requeridos
        if (!empleadoIds || !Array.isArray(empleadoIds) || empleadoIds.length === 0) {
            errores.push('❌ Debe seleccionar al menos 1 empleado');
        }
        
        if (!fechaInicio || !fechaFin) {
            errores.push('❌ Debe especificar rango de fechas');
        }
        
        if (!nuevoTurno) {
            errores.push('❌ Debe especificar nuevo turno');
        }
        
        // Si hay errores previos, retornar
        if (errores.length > 0) {
            return { valido: false, errores, warnings, preview };
        }
        
        // ✅ VALIDACIÓN: Calcular preview
        if (typeof AppState !== 'undefined' && AppState.scheduleData) {
            const f1 = new Date(fechaInicio);
            const f2 = new Date(fechaFin);
            
            preview.empleadosAfectados = empleadoIds.length;
            
            empleadoIds.forEach(empId => {
                const turnos = AppState.scheduleData.get(parseInt(empId)) || [];
                const turnosEnRango = turnos.filter(t => {
                    if (!t.fecha) return false;
                    const fecha = t.fecha instanceof Date ? t.fecha : new Date(t.fecha);
                    return fecha >= f1 && fecha <= f2;
                });
                
                preview.turnosCambiados += turnosEnRango.length;
                preview.horasImpactadas += turnosEnRango.reduce((sum, t) => sum + (t.horas || 0), 0);
            });
        }
        
        return {
            valido: errores.length === 0,
            errores,
            warnings,
            preview
        };
    }
    
    /**
     * Validar integridad de datos en AppState
     * @returns {Object} {integro: bool, problemas: []}
     */
    static validarIntegridad() {
        const problemas = [];
        
        // ✅ VALIDACIÓN: AppState existe
        if (typeof AppState === 'undefined') {
            problemas.push('❌ AppState no está definido');
            return { integro: false, problemas };
        }
        
        // ✅ VALIDACIÓN: scheduleData es Map
        if (!(AppState.scheduleData instanceof Map)) {
            problemas.push('❌ AppState.scheduleData no es un Map');
        }
        
        // ✅ VALIDACIÓN: Campos requeridos
        if (typeof AppState.currentMonth !== 'number') {
            problemas.push('⚠️ AppState.currentMonth no es número');
        }
        
        if (typeof AppState.currentYear !== 'number') {
            problemas.push('⚠️ AppState.currentYear no es número');
        }
        
        // ✅ VALIDACIÓN: Empleados
        if (typeof empleados === 'undefined' || !Array.isArray(empleados)) {
            problemas.push('❌ empleados no es un Array');
        }
        
        // ✅ VALIDACIÓN: localStorage accesible
        try {
            const test = 'validador_test_' + Date.now();
            localStorage.setItem(test, '1');
            localStorage.removeItem(test);
        } catch (e) {
            problemas.push('⚠️ localStorage no accesible: ' + e.message);
        }
        
        return {
            integro: problemas.length === 0,
            problemas,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Generar reporte de validación completo
     * @returns {Object} Reporte detallado
     */
    static generarReporte() {
        const reporte = {
            timestamp: new Date().toISOString(),
            validaciones: {
                empleados: {
                    total: empleados ? empleados.length : 0,
                    validos: 0,
                    invalidos: 0,
                    problemas: []
                },
                integridad: this.validarIntegridad(),
                localStorage: {
                    disponible: this.puedeAccederAlmacenamiento(),
                    ocupado: this.obtenerEspacioUsado(),
                    disponibleAproximado: this.obtenerEspacioDisponible()
                }
            }
        };
        
        // Validar cada empleado
        if (empleados) {
            empleados.forEach(emp => {
                const validacion = this.validarEmpleado(emp);
                if (validacion.valido) {
                    reporte.validaciones.empleados.validos++;
                } else {
                    reporte.validaciones.empleados.invalidos++;
                    reporte.validaciones.empleados.problemas.push({
                        empleado: emp.nombre || emp.id,
                        errores: validacion.errores
                    });
                }
            });
        }
        
        return reporte;
    }
    
    /**
     * Verificar si se puede acceder a localStorage
     * @returns {boolean}
     */
    static puedeAccederAlmacenamiento() {
        try {
            const test = '__storage_test__' + Date.now();
            localStorage.setItem(test, '1');
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Obtener aproximadamente cuánto espacio está siendo usado (bytes)
     * @returns {number}
     */
    static obtenerEspacioUsado() {
        let usado = 0;
        try {
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    usado += localStorage[key].length + key.length;
                }
            }
        } catch (e) {
            console.error('Error calculando espacio usado:', e);
        }
        return usado;
    }
    
    /**
     * Estimar espacio disponible (localStorage típicamente 5-10MB)
     * @returns {number}
     */
    static obtenerEspacioDisponible() {
        const usado = this.obtenerEspacioUsado();
        const limiteAproximado = 5 * 1024 * 1024; // 5MB
        return limiteAproximado - usado;
    }
}

// ✅ Asignar a window para que sea accesible globalmente
if (typeof window !== 'undefined') {
    window.ValidadorDatos = ValidadorDatos;
}

console.log('✅ ValidadorDatos cargado (Semana 1)');
