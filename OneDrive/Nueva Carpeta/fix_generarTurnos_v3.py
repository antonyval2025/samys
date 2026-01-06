with open('js/modules.js', 'r', encoding='utf-8', errors='replace') as f:
    lines = f.readlines()

# Encontrar la línea donde comienza generarTurnos
inicio_idx = -1
fin_idx = -1

for i, line in enumerate(lines):
    if 'static async generarTurnos()' in line:
        inicio_idx = i
    if inicio_idx != -1 and i > inicio_idx and '// Nueva función para guardar en API' in line:
        fin_idx = i
        break

if inicio_idx != -1 and fin_idx != -1:
    print(f'Encontrada funcion en lineas {inicio_idx} a {fin_idx}')
    
    # Crear nueva función
    nueva_funcion = [
        '    // NUEVA FUNCION: Generar turnos (COMPATIBLE CON API)\n',
        '    static async generarTurnos() {\n',
        "        console.log('[generarTurnos] Iniciando generacion de turnos...');\n",
        '        \n',
        '        try {\n',
        "            // Generar turnos para TODOS los empleados\n",
        "            NotificationSystem.show('Generando turnos para todos los empleados...', 'info');\n",
        '            \n',
        '            for (const empleado of empleados) {\n',
        '                const turnos = this.generarTurnosEmpleado(empleado);\n',
        '                this.scheduleData.set(empleado.id, turnos);\n',
        "                console.log('Turnos generados para ' + empleado.nombre);\n",
        '            }\n',
        '            \n',
        '            // GUARDAR EN API/BD\n',
        "            console.log('[generarTurnos] Guardando turnos en API/BD...');\n",
        '            await this._guardarEnAPI();\n',
        '            \n',
        '            this.cerrarModalGeneracion();\n',
        '            UI.generarCuadranteGeneral();\n',
        "            NotificationSystem.show('Turnos generados correctamente para todos', 'success');\n",
        '        } catch (err) {\n',
        "            console.error('Error al generar:', err);\n",
        "            NotificationSystem.show('Error al generar turnos', 'error');\n",
        '        }\n',
        '    }\n',
        '\n',
    ]
    
    # Reemplazar
    nuevas_lineas = lines[:inicio_idx] + nueva_funcion + lines[fin_idx:]
    
    with open('js/modules.js', 'w', encoding='utf-8') as f:
        f.writelines(nuevas_lineas)
    
    print('✅ RESTAURADA - Funcion generarTurnos actualizada')
else:
    print(f'ERROR: inicio={inicio_idx}, fin={fin_idx}')
