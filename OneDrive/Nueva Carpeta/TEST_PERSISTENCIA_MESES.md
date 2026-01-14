# 🧪 PRUEBA DE PERSISTENCIA DE DATOS POR MESES

## Problema Reportado
Al cambiar de mes en el cuadrante, los datos del mes anterior se pierden.

## Solución Implementada
✅ **Arquitectura Mejorada de Persistencia:**
1. **Todos los meses se guardan en UN SOLO archivo JSON** en localStorage
2. **No se borra nada** cuando cambias de mes
3. **SessionStorage como respaldo** por si algo falla
4. **Indicador visual** de guardado en esquina inferior derecha

## INSTRUCCIONES DE PRUEBA

### Paso 1: Iniciar Limpio
```
1. Abre el archivo: nuevo_cuadrante_mejorado.html
2. Presiona Ctrl + Shift + Delete para abrir Almacenamiento/Storage del navegador
3. Limpia todos los datos de esta URL (Clear All)
4. Recarga la página (F5)
```

### Paso 2: Crear Datos en ENERO 2026
```
1. Verifica que estés en ENERO 2026 (debe ser automático)
2. Haz clic en un día cualquiera (ej: día 5 para empleado "María")
3. Selecciona un turno (ej: "Mañana")
4. Verás un indicador "✔ Cambios guardados en JSON local" en la esquina inferior derecha
5. Repite para 3-4 empleados diferentes
6. Observa que el navegador guarda AUTOMÁTICAMENTE (sin pulsar ningún botón)
```

### Paso 3: Cambiar a FEBRERO 2026
```
1. Haz clic en la flecha derecha (>) para ir a FEBRERO
2. IMPORTANTE: Los datos de ENERO deben haberse guardado automáticamente
3. Verás que FEBRERO está vacío (es correcto)
4. Crea 2-3 turnos en FEBRERO
```

### Paso 4: Volver a ENERO
```
1. Haz clic en la flecha izquierda (<) para volver a ENERO
2. ⭐ LOS DATOS DE ENERO DEBEN SEGUIR AHINDO:
   - María debe tener su turno en el día 5
   - Otros empleados deben tener sus turnos
3. Si los datos están, ¡la persistencia funciona! ✅
```

### Paso 5: Verificar Almacenamiento del Navegador
```
1. Abre DevTools (F12)
2. Ve a Storage > Local Storage > (tu URL)
3. Busca la clave "turnosAppState"
4. Haz clic y expande para ver el contenido
5. Deberías ver UN SOLO objeto JSON que contiene:
   - year: 2026
   - month: (el mes actual)
   - scheduleData: ARRAY CON TODOS LOS TURNOS DE TODOS LOS MESES
   - empleados: [12 empleados]
   - timestamp: fecha actual
```

### Paso 6: Hacer Backup
```
1. Abre el Panel Lateral ("🎛️ Control Panel")
2. Busca la sección "Datos Locales"
3. Haz clic en "💾 Respaldar (JSON)"
4. Se descargará un archivo backup_turnos_YYYY-MM-DD.json
5. Guárdalo en tu escritorio (es tu respaldo portable)
```

### Paso 7: Cargar Backup en Otra Ventana
```
1. Abre una NUEVA ventana del navegador anónimo (Ctrl + Shift + N)
2. Abre nuevamente nuevo_cuadrante_mejorado.html
3. Verás la app vacía (sin tus datos)
4. Abre el Panel Lateral
5. Haz clic en "📂 Importar (JSON)"
6. Selecciona el archivo backup que descargaste
7. ⭐ La página se recargará y verás TODOS TUS DATOS de todos los meses:
   - ENERO con María y otros
   - FEBRERO con tus turnos
   - Navega por meses y verifica
```

## CHECKLIST FINAL

- [ ] Los datos de ENERO persisten después de cambiar a FEBRERO
- [ ] Los datos de FEBRERO persisten después de volver a ENERO  
- [ ] El indicador "✔ Cambios guardados" aparece después de cada cambio
- [ ] El archivo JSON descargado es válido (puedes abrirlo en un editor de texto)
- [ ] Después de importar el JSON en una nueva ventana, todos los datos están presentes
- [ ] Puedes cambiar meses sin perder datos

## SI ALGO FALLA

### Síntoma: Los datos de ENERO desaparecen al cambiar a FEBRERO
**Causa:** El `saveToStorage()` no se está llamando antes del cambio de mes
**Solución:** Verifica que en DevTools -> Console no haya errores al cambiar mes

### Síntoma: El indicador de guardado NO aparece
**Solución:** Verifica que la línea en HTML tenga el `<div id="save-indicator">`

### Síntoma: ImportarJSON no funciona
**Solución:** El archivo JSON debe tener la estructura correcta (con campos "turnos", "empleados", "config")

## NOTAS TÉCNICAS

- **LocalStorage:** Almacenamiento permanente del navegador (100% local, en tu disco)
- **SessionStorage:** Respaldo temporal de la sesión actual (se borra al cerrar navegador)
- **scheduleData:** Es un Map de JavaScript que contiene TODOS los turnos de TODOS los meses
  - Estructura: `Map { empleadoId => [ { dia, turno, horas, fecha (con año/mes), ... }, ... ] }`
- **Fecha crítica:** Cada turno tiene una propiedad `fecha` con el año y mes para filtrar correctamente

## CONCLUSIÓN

Si todos los puntos del checklist pasan ✅, entonces:
- ✅ La persistencia de datos funciona correctamente
- ✅ Cambiar de mes es seguro (no pierdes datos)
- ✅ Puedes hacer backups y restaurarlos
- ✅ La aplicación es totalmente local y privada (TODO en tu ordenador)
