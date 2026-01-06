import re

with open('js/modules.js', 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Buscar la función completa usando regex sin confiarse en emojis
# Buscar desde "static async generarTurnos" hasta la siguiente función
pattern = r'static async generarTurnos\(\) \{.*?^\s{4}}\s*static async _guardarEnAPI'
match = re.search(pattern, content, re.MULTILINE | re.DOTALL)

if match:
    nueva_funcion = '''static async generarTurnos() {
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

    static async _guardarEnAPI'''
    
    # Reemplazar
    nuevo_content = content[:match.start()] + nueva_funcion + content[match.end():]
    
    with open('js/modules.js', 'w', encoding='utf-8') as f:
        f.write(nuevo_content)
    
    print('OK - Funcion restaurada correctamente')
else:
    print('ERROR - No se encontro patron de funcion')
    print('Buscando alternativa...')
    # Buscar solo el inicio
    if 'static async generarTurnos()' in content:
        print('La funcion SI existe, pero regex no coincide')
    else:
        print('La funcion NO existe en el archivo')
