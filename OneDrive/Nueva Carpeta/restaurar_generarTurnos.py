# Leer el archivo
with open('js/modules.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Encontrar el inicio de la función generarTurnos (con NUEVA FUNCIÓN)
inicio = content.find('// NUEVA FUNCION: Generar turnos (COMPATIBLE CON API)')
if inicio == -1:
    inicio = content.find('// NUEVA FUNCIÓN: Generar turnos')
    
if inicio != -1:
    # Encontrar el fin de la función (donde comienza _guardarEnAPI)
    fin = content.find('// Nueva función para guardar en API', inicio)
    
    if fin != -1:
        # Extraer la parte antes
        antes = content[:inicio]
        despues = content[fin:]
        
        # Nueva función simple sin restricciones
        nueva_funcion = """    // NUEVA FUNCIÓN: Generar turnos (COMPATIBLE CON API)
    static async generarTurnos() {
        console.log('[generarTurnos] Iniciando generacion de turnos...');
        
        try {
            // Generar turnos para TODOS los empleados
            NotificationSystem.show('Generando turnos para todos los empleados...', 'info');
            
            for (const empleado of empleados) {
                const turnos = this.generarTurnosEmpleado(empleado);
                this.scheduleData.set(empleado.id, turnos);
                console.log('Turnos generados para ' + empleado.nombre);
            }
            
            // GUARDAR EN API/BD
            console.log('[generarTurnos] Guardando turnos en API/BD...');
            await this._guardarEnAPI();
            
            this.cerrarModalGeneracion();
            UI.generarCuadranteGeneral();
            NotificationSystem.show('Turnos generados correctamente para todos', 'success');
        } catch (err) {
            console.error('Error al generar:', err);
            NotificationSystem.show('Error al generar turnos', 'error');
        }
    }

    """
        
        # Juntar
        nuevo_content = antes + nueva_funcion + despues
        
        # Guardar
        with open('js/modules.js', 'w', encoding='utf-8') as f:
            f.write(nuevo_content)
        
        print('OK - Funcion generarTurnos restaurada')
    else:
        print('No encontrado fin de funcion')
else:
    print('No encontrada funcion')
