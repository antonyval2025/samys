import re

with open('nuevo_cuadrante_mejorado.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar la segunda ocurrencia de "window.TurnoManager.generarTurnosEmpleado"
matches = list(re.finditer(r'window\.TurnoManager\.generarTurnosEmpleado = function', content))
if len(matches) > 1:
    # Segunda ocurrencia (la duplicada)
    start_pos = matches[1].start()
    
    # Buscar el siguiente "window.EdicionMasiva = {" después de start_pos
    next_edicion = content.find('window.EdicionMasiva = {', start_pos)
    
    if next_edicion != -1:
        # Encontrar el "// SISTEMA DE EDICIÓN MASIVA MEJORADO" antes de EdicionMasiva
        prev_comment = content.rfind('// SISTEMA DE EDICIÓN MASIVA MEJORADO', start_pos, next_edicion)
        if prev_comment != -1:
            # Eliminar desde start_pos hasta justo antes del comentario
            content_new = content[:start_pos] + content[prev_comment:]
            
            with open('nuevo_cuadrante_mejorado.html', 'w', encoding='utf-8') as f:
                f.write(content_new)
            
            lines_removed = content[:next_edicion].count('\n') - content[:start_pos].count('\n')
            print(f'✅ Eliminadas {lines_removed} líneas de código duplicado')
        else:
            print('❌ No encontré comentario SISTEMA DE EDICIÓN')
    else:
        print('❌ No encontré EdicionMasiva')
else:
    print(f'❌ Hay {len(matches)} ocurrencias de generarTurnosEmpleado (esperaba 2+)')
    for i, m in enumerate(matches):
        line_num = content[:m.start()].count('\n') + 1
        print(f'   {i+1}. Línea {line_num}')
