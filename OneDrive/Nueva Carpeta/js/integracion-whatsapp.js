/**
 * ✅ INTEGRACIÓN WHATSAPP - Semana 2
 * Envía notificaciones de turnos a WhatsApp
 * Sin dependencias externas, usa API de WhatsApp Web
 * 
 * @version 2.0.0
 * @date 2 de enero de 2026
 */

class IntegracionWhatsApp {
    static WHATSAPP_API = 'https://wa.me';
    static isInitialized = false;
    static messageQueue = [];
    static sentMessages = 0;
    static failedMessages = 0;

    /**
     * Inicializar integración de WhatsApp
     */
    static init() {
        if (this.isInitialized) {
            console.warn('⚠️ IntegracionWhatsApp ya fue inicializado');
            return;
        }

        console.log('📱 Inicializando IntegracionWhatsApp...');
        this.isInitialized = true;
        console.log('✅ IntegracionWhatsApp inicializado');
    }

    /**
     * Validar número de teléfono internacional
     * @param {string} telefono - Teléfono a validar
     * @returns {boolean} Es válido
     */
    static validarTelefono(telefono) {
        if (!telefono || typeof telefono !== 'string') {
            return false;
        }

        // Remover espacios, guiones, paréntesis
        const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '');

        // Validar que tenga entre 9 y 15 dígitos (estándar internacional)
        const soloNumeros = telefonoLimpio.replace(/\D/g, '');
        if (soloNumeros.length < 9 || soloNumeros.length > 15) {
            console.warn(`⚠️ Teléfono inválido: ${telefono}`);
            return false;
        }

        return true;
    }

    /**
     * Formatear número de teléfono a formato WhatsApp
     * @param {string} telefono - Teléfono en cualquier formato
     * @returns {string} Teléfono formateado (solo dígitos, con código país si es necesario)
     */
    static formatearTelefonoWhatsApp(telefono) {
        if (!this.validarTelefono(telefono)) {
            return null;
        }

        // Remover todo excepto números
        let soloNumeros = telefono.replace(/\D/g, '');

        // Si empieza con 0, probablemente es formato local (España)
        if (soloNumeros.startsWith('0')) {
            soloNumeros = '34' + soloNumeros.substring(1);
        }

        // Si no tiene código país (menos de 10 dígitos), asumir España (34)
        if (soloNumeros.length < 10) {
            soloNumeros = '34' + soloNumeros;
        }

        // Si ya tiene código país pero sin 34 al inicio, agregarlo
        if (!soloNumeros.startsWith('34') && soloNumeros.length === 9) {
            soloNumeros = '34' + soloNumeros;
        }

        return soloNumeros;
    }

    /**
     * Enviar confirmación de turno a WhatsApp
     * @param {number} empleadoId - ID del empleado
     * @param {number} dia - Día del mes
     * @param {string} turno - Tipo de turno
     * @returns {Object} {exito: bool, url: string, mensaje: string}
     */
    static enviarConfirmacionTurno(empleadoId, dia, turno) {
        // Guard para empleados global
        if (typeof empleados === 'undefined' || !empleados) {
            return {
                exito: false,
                error: 'empleados no está definido',
                timestamp: new Date().toISOString()
            };
        }

        const empleado = empleados.find(e => e.id === empleadoId);
        
        if (!empleado) {
            return {
                exito: false,
                error: `Empleado ${empleadoId} no encontrado`,
                timestamp: new Date().toISOString()
            };
        }

        if (!empleado.telefono) {
            return {
                exito: false,
                error: `${empleado.nombre} no tiene teléfono registrado`,
                timestamp: new Date().toISOString()
            };
        }

        const telefonoFormateado = this.formatearTelefonoWhatsApp(empleado.telefono);
        if (!telefonoFormateado) {
            return {
                exito: false,
                error: `Teléfono inválido para ${empleado.nombre}: ${empleado.telefono}`,
                timestamp: new Date().toISOString()
            };
        }

        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        const mesesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
        const periodoTexto = `${dia} de ${mesesNombre[mes]} de ${año}`;

        // Construir mensaje formateado
        const mensaje = `Hola ${empleado.nombre},

Confirmación de turno:
📅 Fecha: ${periodoTexto}
🕐 Turno: ${turno}

Esta es una notificación automática del sistema de gestión de turnos.`;

        // Construir URL de WhatsApp
        const urlWhatsApp = this.construirURLWhatsApp(telefonoFormateado, mensaje);

        // Registrar en cola
        this.messageQueue.push({
            empleadoId: empleadoId,
            nombre: empleado.nombre,
            telefono: telefonoFormateado,
            mensaje: mensaje,
            dia: dia,
            turno: turno,
            timestamp: new Date().toISOString(),
            estado: 'PENDIENTE'
        });

        this.sentMessages++;

        console.log(`✅ WhatsApp preparado para ${empleado.nombre} (${telefonoFormateado})`);

        return {
            exito: true,
            url: urlWhatsApp,
            empleado: empleado.nombre,
            telefono: telefonoFormateado,
            mensaje: mensaje,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Enviar cambio de turno a WhatsApp
     * @param {number} empleadoId - ID del empleado
     * @param {number} dia - Día del mes
     * @param {string} turnoAnterior - Turno anterior
     * @param {string} turnoNuevo - Turno nuevo
     * @returns {Object} {exito: bool, url: string}
     */
    static enviarCambioTurno(empleadoId, dia, turnoAnterior, turnoNuevo) {
        const empleado = empleados.find(e => e.id === empleadoId);
        
        if (!empleado || !empleado.telefono) {
            return {
                exito: false,
                error: `No se puede contactar a ${empleado?.nombre || 'empleado'}`,
                timestamp: new Date().toISOString()
            };
        }

        const telefonoFormateado = this.formatearTelefonoWhatsApp(empleado.telefono);
        const mes = AppState.currentMonth;
        const año = AppState.currentYear;
        const mesesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

        const mensaje = `⚠️ ${empleado.nombre},

Se ha realizado un cambio en tu turno:

📅 Fecha: ${dia} de ${mesesNombre[mes]} de ${año}
❌ Turno anterior: ${turnoAnterior}
✅ Turno nuevo: ${turnoNuevo}

Por favor confirma si tienes disponibilidad.`;

        const urlWhatsApp = this.construirURLWhatsApp(telefonoFormateado, mensaje);

        this.messageQueue.push({
            empleadoId: empleadoId,
            nombre: empleado.nombre,
            tipo: 'CAMBIO',
            turnoAnterior: turnoAnterior,
            turnoNuevo: turnoNuevo,
            timestamp: new Date().toISOString(),
            estado: 'PENDIENTE'
        });

        console.log(`✅ WhatsApp de cambio preparado para ${empleado.nombre}`);

        return {
            exito: true,
            url: urlWhatsApp,
            empleado: empleado.nombre,
            mensaje: mensaje,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Enviar recordatorio de turno (día anterior)
     * @param {number} empleadoId - ID del empleado
     * @param {number} dia - Día del turno
     * @returns {Object} {exito: bool, mensaje: string}
     */
    static enviarRecordatorioTurno(empleadoId, dia) {
        const empleado = empleados.find(e => e.id === empleadoId);
        
        if (!empleado || !empleado.telefono) {
            return { exito: false, error: 'Empleado sin contacto' };
        }

        const turnos = AppState.scheduleData.get(empleadoId) || [];
        const turno = turnos.find(t => t.dia === dia);
        
        if (!turno) {
            return { exito: false, error: 'Turno no encontrado' };
        }

        const telefonoFormateado = this.formatearTelefonoWhatsApp(empleado.telefono);
        const horaInicio = this.obtenerHoraInicio(turno.turno);

        const mensaje = `⏰ Recordatorio de turno para mañana

${empleado.nombre}, mañana tienes:
🕐 Turno: ${turno.turno}
⏱️ Hora inicio: ${horaInicio}

¡No olvides tu turno!`;

        const urlWhatsApp = this.construirURLWhatsApp(telefonoFormateado, mensaje);

        console.log(`📢 Recordatorio preparado para ${empleado.nombre}`);

        return {
            exito: true,
            url: urlWhatsApp,
            empleado: empleado.nombre,
            mensaje: mensaje,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Construir URL de WhatsApp Web
     * @param {string} telefonoFormateado - Teléfono sin espacios/símbolos
     * @param {string} mensaje - Mensaje a enviar
     * @returns {string} URL completa de WhatsApp
     */
    static construirURLWhatsApp(telefonoFormateado, mensaje) {
        // Codificar mensaje para URL
        const mensajeEncodificado = encodeURIComponent(mensaje);
        return `${this.WHATSAPP_API}/${telefonoFormateado}?text=${mensajeEncodificado}`;
    }

    /**
     * Obtener hora de inicio del turno
     * @param {string} turno - Tipo de turno
     * @returns {string} Hora en formato HH:MM
     */
    static obtenerHoraInicio(turno) {
        const horarios = {
            'mañana': '08:00',
            'tarde': '16:00',
            'noche': '00:00',
            'mixto': '08:00',
            'descanso': '-',
            'vacaciones': '-',
            'baja': '-',
            'libre': '-',
            'festivo': '-'
        };
        return horarios[turno] || '00:00';
    }

    /**
     * Obtener estado de la cola de mensajes
     * @returns {Object} Estado y estadísticas
     */
    static obtenerEstadoCola() {
        return {
            pendientes: this.messageQueue.filter(m => m.estado === 'PENDIENTE').length,
            enviados: this.sentMessages,
            fallidos: this.failedMessages,
            total: this.messageQueue.length,
            mensajes: this.messageQueue.slice(-10) // Últimos 10 mensajes
        };
    }

    /**
     * Limpiar cola de mensajes
     */
    static limpiarCola() {
        const limpios = this.messageQueue.length;
        this.messageQueue = [];
        console.log(`🗑️ Cola limpiada (${limpios} mensajes removidos)`);
        return { mensajesLimpios: limpios, timestamp: new Date().toISOString() };
    }

    /**
     * Validar integración WhatsApp
     * @returns {Object} {valido: bool, errores: []}
     */
    static validarIntegracion() {
        const errores = [];

        if (!this.isInitialized) {
            errores.push('IntegracionWhatsApp no está inicializado');
        }

        if (!Array.isArray(this.messageQueue)) {
            errores.push('Cola de mensajes corrupta');
        }

        // Verificar que haya empleados con teléfono
        const empleadosConTelefono = empleados.filter(e => e.telefono && this.validarTelefono(e.telefono));
        if (empleadosConTelefono.length === 0) {
            errores.push('⚠️ Ningún empleado tiene teléfono válido para WhatsApp');
        }

        return {
            valido: errores.length === 0,
            errores: errores,
            empleadosDisponibles: empleadosConTelefono.length,
            timestamp: new Date().toISOString()
        };
    }
}

// ✅ LOG DE INICIALIZACIÓN
console.log('✅ IntegracionWhatsApp cargado');
