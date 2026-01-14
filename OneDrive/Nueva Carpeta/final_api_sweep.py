import os

def remove_api_logic():
    path = r'c:\Users\samys\OneDrive\Nueva Carpeta\js\modules.js'
    if not os.path.exists(path): return
    
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_mode = False
    
    for line in lines:
        # Nivel 1: Eliminar llamadas directas
        if 'await this._guardarEnAPI();' in line:
            new_lines.append(line.replace('await this._guardarEnAPI();', '// await this._guardarEnAPI(); (Modo Local)'))
            continue
            
        if 'this.guardarEmpleadoEnBD(nuevoEmpleado);' in line:
            new_lines.append(line.replace('this.guardarEmpleadoEnBD(nuevoEmpleado);', '// this.guardarEmpleadoEnBD(nuevoEmpleado); (Modo Local)'))
            continue

        # Nivel 2: Eliminar definiciones de funciones
        if 'static async _guardarEnAPI()' in line:
            skip_mode = True
            new_lines.append('    // _guardarEnAPI deshabilitado en Modo Local\n')
            continue
            
        if 'static guardarEmpleadoEnBD(empleado)' in line:
            skip_mode = True
            new_lines.append('    // guardarEmpleadoEnBD deshabilitado en Modo Local\n')
            continue
            
        if skip_mode:
            if line.strip() == '}':
                skip_mode = False
            continue
            
        new_lines.append(line)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print("✓ Removed API logic from modules.js")

remove_api_logic()
