# 🧪 GUÍA DE PRUEBA - Modal Generación A+B

## 📌 Antes de Comenzar

1. **Resetea localStorage** (datos previos pueden interferir):
   ```javascript
   // En consola del navegador:
   localStorage.clear();
   location.reload();
   ```

2. **Abre el archivo**:
   - `nuevo_cuadrante_mejorado.html` en tu navegador

## ✅ PRUEBA 1: Verificar Botón en Carga Inicial

**Paso 1**: Abre `nuevo_cuadrante_mejorado.html`
- **Esperado**: Ves la interfaz del cuadrante
- **Busca**: En la barra superior, después del botón "Chat", debe haber un botón "📋 Generar Turnos" con animación pulsante

**Paso 2**: Abre la consola del navegador (F12 → Console)
- **Busca logs**:
  ```
  ✓ Botón de generación verificado
  🟢 [TurnoManager.verificarYMostrarBoton] Botón mostrado (cuadrante vacío)
  ```

## ✅ PRUEBA 2: Abrir Modal

**Paso 1**: Click en el botón "📋 Generar Turnos"
- **Esperado**: Se abre un modal profesional con:
  - Encabezado verde: "Generar Turnos Por Defecto"
  - Sección "Período a Generar" con Mes y Año
  - Sección "Resumen" con conteo de empleados y turnos estimados
  - Advertencia amarilla sobre no sobrescritura
  - Dos botones: "❌ Cancelar" y "✅ Generar Turnos"

**Paso 2**: Verifica que los campos dinámicos están correctos
- **Mes**: Debe mostrar el mes actual (ej: "Enero")
- **Año**: Debe mostrar el año actual (ej: "2026")
- **Empleados**: Debe mostrar 7 (empleados por defecto)
- **Turnos**: Debe mostrar ~130 (aproximadamente)

## ✅ PRUEBA 3: Generar Turnos

**Paso 1**: Click en "✅ Generar Turnos"
- **Esperado**:
  - Modal se cierra automáticamente
  - En la esquina superior derecha aparece notificación verde:
    ```
    ✅ ~130 turnos asignados para Enero
    ```

**Paso 2**: Verifica el cuadrante
- El cuadrante ahora debe estar lleno de turnos
- Cada empleado debe tener un turno (mañana/tarde/noche) por defecto
- Los domingos deben estar vacíos o como "descanso"

**Paso 3**: Busca el botón
- **Esperado**: El botón "📋 Generar Turnos" desaparece (está oculto)
- **Razón**: El cuadrante ya no está vacío

## ✅ PRUEBA 4: Cambiar Mes y Volver

**Paso 1**: Click en el botón ▶ (próximo mes)
- **Esperado**: Navegas a Febrero
- El cuadrante de Febrero está VACÍO (sin turnos generados)
- El botón "📋 Generar Turnos" reaparece

**Paso 2**: Click en ▶ de nuevo → Marzo
- Cuadrante vacío
- Botón visible

**Paso 3**: Click en ◀ ◀ (volver dos meses) → Enero
- **Esperado**: Ves los turnos que generaste antes (se conservan)
- El botón desaparece (porque ya hay turnos)

## ✅ PRUEBA 5: Edición Manual + No-Overwrite

**Paso 1**: En Enero, edita manualmente un turno
- Click en una celda del turno de cualquier empleado
- Cambia el turno (ej: de "Mañana" a "Tarde")
- Guarda el cambio

**Paso 2**: Cambiar a otro mes y volver a Enero
- El cambio manual se conserva ✅

**Paso 3**: Genera turnos nuevamente (si el cuadrante estuviera vacío)
- Los cambios manuales no se sobrescriben

## ✅ PRUEBA 6: Dominios Especiales

**Verificar que se respetan**:
1. **Domingos**: Deben ser "descanso" o vacíos
2. **Festivos**: Si hay días festivos, deben ser "descanso"
3. **Bajas/Vacaciones**: Si un empleado está de baja ese mes, deben ser "baja" o "vacaciones"

**Cómo verificar bajas**:
- Botón "👥 Gestionar Empleados"
- Selecciona un empleado
- Cambia estado a "baja" o "vacaciones"
- Genera turnos → El empleado no debe tener turnos asignados

## ✅ PRUEBA 7: Consola de Debugging

**Abre la consola del navegador (F12)**

**Ejecuta estos comandos**:

```javascript
// Ver si el cuadrante está vacío
TurnoManager.esCuadranteVacio()
// Resultado: true o false

// Ver turnos del mes actual
AppState.scheduleData.forEach((turnos, empId) => {
  console.log(`Empleado ${empId}: ${turnos.filter(t => t.turno).length} turnos`);
})

// Ver botón estado
document.getElementById('btnGenerarTurnos').style.display
// Resultado: 'none' (oculto) o 'block' (visible)

// Ver campos del modal
document.getElementById('infoMesGeneracion').textContent
document.getElementById('infoAnioGeneracion').textContent
document.getElementById('resumenEmpleados').textContent
document.getElementById('resumenTurnos').textContent
```

## ✅ PRUEBA 8: Pruebas Automatizadas

**Archivo**: `TEST_MODAL_GENERACION_v1.html`

1. Abre el archivo en el navegador
2. Click en "▶ Ejecutar Todos los Tests"
3. Verifica que todos los tests pasen (✅ verde)

## 📋 Checklist Final

- [ ] Botón aparece al cargar la app (cuadrante vacío)
- [ ] Modal abre correctamente
- [ ] Campos dinámicos se populan (mes, año, empleados, turnos)
- [ ] Click "Generar Turnos" funciona
- [ ] Turnos se asignan correctamente
- [ ] Botón desaparece después de generar
- [ ] Cambiar mes muestra botón si está vacío
- [ ] Volver a mes anterior preserva turnos
- [ ] Ediciones manuales no se sobrescriben
- [ ] Domingos/festivos se respetan
- [ ] Bajas/Vacaciones se respetan
- [ ] Consola muestra logs correctos
- [ ] Tests automatizados pasan

## 🐛 Troubleshooting

### "Botón no aparece al cargar"
- Verifica que localStorage está limpio: `localStorage.clear()`
- Revisa consola para errores en `verificarYMostrarBoton()`
- Asegúrate que hay empleados cargados: `console.log(empleados.length)`

### "Modal no se abre"
- Click funciona? Verifica onclick: `onclick="TurnoManager.mostrarModalGeneracion()"`
- Modal existe? `document.getElementById('modalGeneracionTurnos')` debe retornar elemento

### "Campos del modal están vacíos"
- Verifica función `mostrarModalGeneracion()`:
  ```javascript
  TurnoManager.mostrarModalGeneracion() // Debe llenar campos
  ```
- Revisa valores en consola:
  ```javascript
  document.getElementById('infoMesGeneracion').textContent
  ```

### "Turnos no se generan"
- Verifica `generarTurnos()` se llama
- Revisa consola para logs de "Iniciando generación"
- Ejecuta manualmente: `TurnoManager.generarTurnos()`

### "Turnos se sobrescriben"
- Verifica lógica en `generarTurnos()`: `if (dia.turno === '')`
- Solo debe llenar días vacíos
- Si ves sobrescritura, contacta soporte

## 📞 Contacto para Problemas

Si encuentras issues:
1. Abre consola (F12)
2. Copia los logs de error
3. Incluye paso donde ocurrió el problema
4. Describe qué esperabas vs qué pasó

## 🎉 Success Criteria

✅ **La implementación A+B es correcta si**:
1. Botón aparece automáticamente cuando cuadrante está vacío
2. Modal muestra información correcta del mes/año
3. Generación llena SOLO días laborales sin turnos
4. No sobrescribe turnos existentes
5. Botón desaparece después de generar

---

**Fecha de prueba**: [Hoy]
**Navegador**: Chrome/Firefox/Edge
**Sistema Operativo**: Windows/Mac/Linux

