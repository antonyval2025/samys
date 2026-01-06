# 🔧 GUÍA DE DEBUGGING - Cambio de Mes

## Problema: Clic en ◀ ▶ no actualiza cuadrante

### Paso 1: Abre Consola (F12)
Presiona **F12** en tu navegador para abrir la consola de desarrollador.

### Paso 2: Copia y pega esto en la consola

```javascript
// 1. Verifica que DateUtils existe
console.log('DateUtils existe:', typeof window.DateUtils);
console.log('DateUtils.cambiarMes existe:', typeof window.DateUtils?.cambiarMes);

// 2. Verifica que AppState existe
console.log('AppState existe:', typeof window.AppState);
console.log('Mes actual:', window.AppState?.currentMonth);
console.log('Año actual:', window.AppState?.currentYear);

// 3. Verifica que UI existe
console.log('UI existe:', typeof window.UI);
console.log('UI.generarCuadranteGeneral existe:', typeof window.UI?.generarCuadranteGeneral);

// 4. Verifica que TurnoManager existe
console.log('TurnoManager existe:', typeof window.TurnoManager);
console.log('TurnoManager.reiniciarDatos existe:', typeof window.TurnoManager?.reiniciarDatos);

// 5. Verifica empleados
console.log('Empleados:', window.empleados?.length || 'NO ENCONTRADOS');

// 6. Prueba cambiar mes manualmente
console.log('=== PROBANDO CAMBIO DE MES ===');
window.DateUtils.cambiarMes(1);
console.log('Nuevo mes:', window.AppState.currentMonth);
```

### Paso 3: Observa la salida

Debería ver algo como:
```
DateUtils existe: object
DateUtils.cambiarMes existe: function
AppState existe: object
Mes actual: 11
Año actual: 2025
UI existe: object
UI.generarCuadranteGeneral existe: function
TurnoManager existe: object
TurnoManager.reiniciarDatos existe: function
Empleados: 5
=== PROBANDO CAMBIO DE MES ===
🔵 [DateUtils.cambiarMes] Dirección: 1
[cambiarMes] Cambiando a mes 0/2026
[cambiarMes] Llamando reiniciarDatos...
[cambiarMes] reiniciarDatos completado
[cambiarMes] Llamando UI.generarCuadranteGeneral...
🔵 [UI.generarCuadranteGeneral] Generando cuadrante...
✓ Cuadrante general generado
[cambiarMes] UI.generarCuadranteGeneral completado
[cambiarMes] Llamando UI.actualizarTitulosMes...
[cambiarMes] UI.actualizarTitulosMes completado
Nuevo mes: 0
```

### ✅ Si ves todo esto:
- Todos los componentes existen ✓
- El cambio de mes se ejecuta ✓
- La UI se actualiza ✓
- **El problema está solucionado**

### ❌ Si falta algo:

| Línea que falla | Significado | Solución |
|---|---|---|
| `DateUtils existe: undefined` | DateUtils no está creado | Recarga la página |
| `Empleados: NO ENCONTRADOS` | No hay empleados | Limpia localStorage: `localStorage.clear()` |
| Error en "Probando cambio de mes" | Hay un error en el code | Copia el error exacto y reporta |

---

## 🔍 Solución Rápida

Si algo está mal:

```javascript
// Limpiar todo
localStorage.clear();
location.reload();
```

Espera a que cargue completamente (~3 segundos) y prueba de nuevo.

---

## 📋 Si Persiste el Problema

Abre consola nuevamente y pega esto:

```javascript
// Información de diagnóstico
console.table({
    'AppState.currentMonth': window.AppState?.currentMonth,
    'AppState.currentYear': window.AppState?.currentYear,
    'cuadranteGeneral existe': !!document.getElementById('cuadranteGeneral'),
    'selectMonth existe': !!document.getElementById('selectMonth'),
    'selectYear existe': !!document.getElementById('selectYear'),
    'Turnos en memory': window.AppState?.scheduleData?.size || 0,
    'Empleados cargados': window.empleados?.length || 0
});
```

Copia la salida completa y reporta.
