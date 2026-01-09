/**
 * SEMANA 4 - IntegracionCalendario
 * Sincronización con Google Calendar y generación de eventos iCal
 * - Conectar con Google Calendar API
 * - Exportar turnos como eventos
 * - Sincronizar festivos y eventos especiales
 * - Compartir calendario con empleados
 */

class IntegracionCalendario {
    static isInitialized = false;
    static calendarios = new Map(); // Map<empleadoId, {googleCalendarId, icalUrl}>
    static eventos = new Map(); // Map<eventId, {fecha, tipo, descripcion}>
    static festivosGlobales = [];

    static init() {
        if (this.isInitialized) return;

        try {
            this.loadFromStorage();
            this.cargarFestivosEspana();
            this.isInitialized = true;
            NotificationSystem.show('✅ IntegracionCalendario inicializado', 'success');
        } catch (error) {
            NotificationSystem.show('❌ Error al inicializar IntegracionCalendario', 'error');
            console.error('IntegracionCalendario Error:', error);
        }
    }

    /**
     * Cargar festivos para España
     */
    static cargarFestivosEspana() {
        const año = new Date().getFullYear();
        this.festivosGlobales = [
            { fecha: `${año}-01-01`, nombre: 'Año Nuevo' },
            { fecha: `${año}-01-06`, nombre: 'Reyes Magos' },
            { fecha: `${año}-05-01`, nombre: 'Día del Trabajo' },
            { fecha: `${año}-08-15`, nombre: 'Asunción de María' },
            { fecha: `${año}-10-12`, nombre: 'Día de la Hispanidad' },
            { fecha: `${año}-11-01`, nombre: 'Todos los Santos' },
            { fecha: `${año}-12-25`, nombre: 'Navidad' }
        ];
    }

    /**
     * Conectar empleado con Google Calendar
     */
    static conectarGoogleCalendar(empleadoId, googleCalendarId, token) {
        try {
            if (!empleadoId || !googleCalendarId) {
                throw new Error('Datos de conexión inválidos');
            }

            this.calendarios.set(empleadoId, {
                googleCalendarId: googleCalendarId,
                token: token, // En producción, esto iría en backend seguro
                conectadoEn: new Date().toISOString(),
                activo: true
            });

            this.saveToStorage();
            return { 
                exito: true, 
                mensaje: 'Google Calendar conectado correctamente',
                empleadoId: empleadoId
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Generar evento iCal para un turno
     */
    static generarEventoICal(empleado, turno, fecha) {
        try {
            const tiposTurno = {
                mañana: { inicio: '08:00', fin: '16:00', color: '#d4edda' },
                tarde: { inicio: '16:00', fin: '00:00', color: '#fff3cd' },
                noche: { inicio: '00:00', fin: '08:00', color: '#f8d7da' },
                mixto: { inicio: '08:00', fin: '00:00', color: '#d1ecf1' },
                descanso: { inicio: '00:00', fin: '23:59', color: '#e2e3e5' },
                vacaciones: { inicio: '00:00', fin: '23:59', color: '#cfe2ff' },
                festivo: { inicio: '00:00', fin: '23:59', color: '#ffeaa7' }
            };

            const horario = tiposTurno[turno] || tiposTurno.descanso;
            const fechaObj = new Date(fecha);
            const fechaStr = fechaObj.toISOString().split('T')[0].replace(/-/g, '');

            const evento = {
                uid: `turno-${empleado.id}-${fecha}@cuadrante.local`,
                dtstart: fechaStr,
                dtend: fechaStr,
                summary: `${turno.charAt(0).toUpperCase() + turno.slice(1)} - ${empleado.nombre}`,
                description: `Turno: ${turno}\\nHorario: ${horario.inicio} - ${horario.fin}\\nEmpleado: ${empleado.nombre}`,
                location: 'Sede Principal',
                categories: turno,
                color: horario.color
            };

            return {
                exito: true,
                evento: evento,
                iCal: this.generarICalString(evento)
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Generar string iCal completo
     */
    static generarICalString(evento) {
        const ahora = new Date().toISOString().replace(/[-:.]/g, '').split('Z')[0];
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cuadrante de Turnos//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Turnos Laborales
X-WR-TIMEZONE:Europe/Madrid
BEGIN:VEVENT
UID:${evento.uid}
DTSTAMP:${ahora}Z
DTSTART:${evento.dtstart}
DTEND:${evento.dtend}
SUMMARY:${evento.summary}
DESCRIPTION:${evento.description}
LOCATION:${evento.location}
CATEGORIES:${evento.categories}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
    }

    /**
     * Exportar cuadrante completo como iCal
     */
    static exportarCuadranteICAL(empleadoId, mes, año) {
        try {
            if (!AppState?.scheduleData?.has(empleadoId)) {
                throw new Error('Empleado sin turnos registrados');
            }

            const empleado = empleados.find(e => e.id === empleadoId);
            const turnos = AppState.scheduleData.get(empleadoId);
            
            // Definir horarios de turnos (debe coincidir con tiposTurno global)
            const horariosturno = {
                mañana: { inicio: '08:00', fin: '16:00', horas: 8 },
                tarde: { inicio: '16:00', fin: '00:00', horas: 8 },
                noche: { inicio: '00:00', fin: '08:00', horas: 8 },
                mixto: { inicio: '08:00', fin: '20:00', horas: 12 },
                descanso: { inicio: '00:00', fin: '00:00', horas: 0 },
                vacaciones: { inicio: '00:00', fin: '00:00', horas: 0 },
                baja: { inicio: '00:00', fin: '00:00', horas: 0 },
                libre: { inicio: '00:00', fin: '00:00', horas: 0 },
                festivo: { inicio: '00:00', fin: '00:00', horas: 0 }
            };

            let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cuadrante Turnos//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Turnos ${mes}/${año} - ${empleado?.nombre || 'Empleado'}
X-WR-TIMEZONE:Europe/Madrid\n`;

            turnos.forEach(turno => {
                if (turno.dia >= 1 && turno.dia <= 31) {
                    const fechaStr = `${año}${String(mes).padStart(2, '0')}${String(turno.dia).padStart(2, '0')}`;
                    const ahora = new Date().toISOString().replace(/[-:.]/g, '').split('Z')[0];
                    
                    // Obtener horario del turno
                    const horarioTurno = horariosturno[turno.turno] || horariosturno.descanso;
                    
                    // Convertir horarios a formato iCal (YYYYMMDDTHHMMSS)
                    let dtStart, dtEnd;
                    if (turno.turno === 'descanso' || turno.turno === 'vacaciones' || turno.turno === 'baja' || turno.turno === 'libre' || turno.turno === 'festivo') {
                        // Para no-laborales, usar todo el día
                        dtStart = `${fechaStr}T000000`;
                        dtEnd = `${fechaStr}T235900`;
                    } else {
                        // Para turnos laborales, usar horario específico
                        const [inicioHora, inicioMin] = horarioTurno.inicio.split(':');
                        const [finHora, finMin] = horarioTurno.fin.split(':');
                        
                        dtStart = `${fechaStr}T${inicioHora}${inicioMin}00`;
                        
                        // Si fin es 00:00 (noche que termina en madrugada), termina al día siguiente
                        if (horarioTurno.fin === '00:00') {
                            const diaSiguiente = new Date(año, mes - 1, parseInt(turno.dia) + 1);
                            const fechaSiguiente = `${diaSiguiente.getFullYear()}${String(diaSiguiente.getMonth() + 1).padStart(2, '0')}${String(diaSiguiente.getDate()).padStart(2, '0')}`;
                            dtEnd = `${fechaSiguiente}T000000`;
                        } else {
                            dtEnd = `${fechaStr}T${finHora}${finMin}00`;
                        }
                    }

                    icalContent += `BEGIN:VEVENT
UID:turno-${empleadoId}-${fechaStr}@cuadrante.local
DTSTAMP:${ahora}Z
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${turno.turno.charAt(0).toUpperCase() + turno.turno.slice(1)} - ${empleado?.nombre || 'Empleado'}
DESCRIPTION:Turno: ${turno.turno}\\nHorario: ${horarioTurno.inicio} - ${horarioTurno.fin}\\nHoras: ${horarioTurno.horas}h
LOCATION:Sede Principal
CATEGORIES:${turno.turno}
STATUS:CONFIRMED
END:VEVENT\n`;
                }
            });

            icalContent += 'END:VCALENDAR';

            return {
                exito: true,
                icalContent: icalContent,
                nombreArchivo: `turnos_${empleado?.nombre || 'empleado'}_${mes}_${año}.ics`
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Descargar calendario iCal
     */
    static descargarICAL(empleadoId, mes, año) {
        try {
            const resultado = this.exportarCuadranteICAL(empleadoId, mes, año);
            if (!resultado.exito) throw new Error(resultado.mensaje);

            const blob = new Blob([resultado.icalContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = resultado.nombreArchivo;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return { exito: true, mensaje: 'iCal descargado' };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Agregar evento especial al calendario
     */
    static agregarEventoEspecial(empleadoId, fecha, tipo, descripcion) {
        try {
            const eventId = `${empleadoId}-${fecha}-${Date.now()}`;
            this.eventos.set(eventId, {
                empleadoId: empleadoId,
                fecha: fecha,
                tipo: tipo, // 'reunion', 'capacitacion', 'festivo', etc.
                descripcion: descripcion || '',
                creado: new Date().toISOString()
            });

            this.saveToStorage();
            return { exito: true, mensaje: 'Evento especial agregado', eventId: eventId };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Obtener festivos
     */
    static obtenerFestivos(año = null) {
        const añoActual = año || new Date().getFullYear();
        return this.festivosGlobales.filter(f => f.fecha.startsWith(String(añoActual)));
    }

    /**
     * Verificar si una fecha es festivo
     */
    static esFestivo(fecha) {
        return this.festivosGlobales.some(f => f.fecha === fecha);
    }

    /**
     * Obtener eventos de empleado
     */
    static obtenerEventosEmpleado(empleadoId) {
        return Array.from(this.eventos.values())
            .filter(e => e.empleadoId === empleadoId);
    }

    /**
     * Generar URL compartible de calendario
     */
    static generarURLCompartible(empleadoId) {
        try {
            const calendario = this.calendarios.get(empleadoId);
            if (!calendario) {
                throw new Error('Calendario no conectado para este empleado');
            }

            const urlBase = 'https://calendar.google.com/calendar/u/0/r';
            const params = new URLSearchParams({
                cid: calendario.googleCalendarId
            });

            return {
                exito: true,
                url: `${urlBase}?${params.toString()}`,
                mensaje: 'URL de calendario generada'
            };
        } catch (error) {
            return { exito: false, mensaje: error.message };
        }
    }

    /**
     * Persistencia
     */
    static saveToStorage() {
        try {
            const datos = {
                calendarios: Array.from(this.calendarios.entries()),
                eventos: Array.from(this.eventos.entries()),
                festivosGlobales: this.festivosGlobales,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('integracionCalendario', JSON.stringify(datos));
        } catch (error) {
            console.error('Error guardando IntegracionCalendario:', error);
        }
    }

    static loadFromStorage() {
        try {
            const datos = localStorage.getItem('integracionCalendario');
            if (datos) {
                const parsed = JSON.parse(datos);
                this.calendarios = new Map(parsed.calendarios);
                this.eventos = new Map(parsed.eventos);
                this.festivosGlobales = parsed.festivosGlobales || [];
            }
        } catch (error) {
            console.error('Error cargando IntegracionCalendario:', error);
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IntegracionCalendario.init());
} else {
    IntegracionCalendario.init();
}
