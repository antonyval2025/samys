# Guía de Prueba de Persistencia de Datos

## Cambios Implementados

### 1. **TurnoManager.inicializarDatos()** - LÍNEA 767 en js/modules.js
- **ANTES**: Limpiaba AppState.scheduleData y regeneraba todos los turnos
- **AHORA**: Solo genera turnos si el empleado NO tiene turnos previos
- **BENEFICIO**: Preserva cambios de turnos al recargar la página
- **GUARDAR**: Ahora llama `AppState.saveToStorage()` al final

### 2. **TurnoManager.reiniciarDatos()** - LÍNEA 784 en js/modules.js
- **ANTES**: No guardaba datos después de reiniciar
- **AHORA**: Llama `AppState.saveToStorage()` después de `inicializarDatos()`

### 3. **DOMContentLoaded** - LÍNEA 1415 en nuevo_cuadrante_mejorado.html
- **ANTES**: Forzaba mes/año actual, perdiendo los datos previos
- **AHORA**: 
  - Paso 1: Guardar tipos de turnos
  - Paso 2: Cargar empleados
  - Paso 3: Cargar tipos de turnos
  - Paso 4: Cargar AppState (MÁS IMPORTANTE - AQUÍ se restauran los turnos)
  - Paso 5: Usar mes/año actual si no hay datos previos
  - Paso 6: Inicializar datos (solo genera si están vacíos)
  - Paso 7-8: Actualizar UI
- **RESULTADO**: Los datos guardados se restauran correctamente

### 4. **EmployeeManager.guardarEmpleado()** - LÍNEA 1303 en js/modules.js
- **ANTES**: Solo guardaba en localStorage de empleados
- **AHORA**: 
  - Genera turnos para nuevo empleado
  - Llama `AppState.saveToStorage()` para guardar también en AppState
  - **RESULTADO**: Empleados nuevos persisten con sus turnos

### 5. **EmployeeManager.eliminarEmpleado()** - LÍNEA 1325 en js/modules.js
- **ANTES**: No limpiaba turnos de AppState
- **AHORA**: 
  - Elimina turnos del empleado de AppState
  - Llama `AppState.saveToStorage()`
  - **RESULTADO**: Datos se limpian correctamente

## Datos Guardados en localStorage

### 1. **tiposTurnoData** (tipos de turnos disponibles)
```javascript
localStorage.getItem('tiposTurnoData')
// {
//   "mañana": { id: 1, nombre: "mañana", inicial: "M", ... },
//   "tarde": { id: 2, nombre: "tarde", inicial: "T", ... },
//   ...
// }
```

### 2. **empleadosData** (lista de empleados)
```javascript
localStorage.getItem('empleadosData')
// [
//   { id: 1, nombre: "Juan", departamento: "Ventas", ... },
//   { id: 2, nombre: "María", departamento: "Finanzas", ... },
// ]
```

### 3. **turnosAppState** (CRÍTICO - estado con turnos)
```javascript
localStorage.getItem('turnosAppState')
// {
//   "year": 2025,
//   "month": 11,
//   "filters": { ... },
//   "selectedEmployeeId": null,
//   "scheduleData": [
//     [1, [{ dia: 1, turno: "mañana", horas: 8, ... }, ...]],
//     [2, [{ dia: 1, turno: "tarde", horas: 8, ... }, ...]],
//     ...
//   ],
//   "userRole": "admin"
// }
```

## Pasos para Probar

### Prueba 1: Crear Empleado y Verificar Persistencia
1. Abre la app en `http://localhost:8000`
2. Haz clic en "👥 Empleados"
3. Crea un nuevo empleado (ej: "Test User", "IT", "Madrid", etc.)
4. Guarda el empleado
5. **Abre la consola del navegador (F12)** y ejecuta:
   ```javascript
   console.log('Empleados:', empleados.length);
   console.log('AppState turnos:', AppState.scheduleData.size);
   console.log('localStorage empleados:', localStorage.getItem('empleadosData'));
   ```
6. Recarga la página (F5 o Ctrl+Shift+R)
7. **Verifica que:**
   - ✓ El empleado sigue apareciendo en la lista
   - ✓ Los turnos aparecen en el cuadrante
   - ✓ En consola ves los datos restaurados

### Prueba 2: Editar Turno y Verificar Persistencia
1. En la tabla principal, haz clic en un turno (una celda de turno)
2. Cambia el turno a uno diferente
3. Guarda la edición
4. Abre consola y ejecuta:
   ```javascript
   const empleado1 = AppState.scheduleData.get(1);
   console.log('Turno día 1:', empleado1[0]);
   ```
5. **Recarga la página (F5)**
6. **Verifica que:**
   - ✓ El turno sigue con el nuevo valor
   - ✓ No vuelve al original
   - ✓ En consola ves el turno guardado

### Prueba 3: Resetear Navegador
1. Crea varios empleados con turnos modificados
2. Ejecuta en consola:
   ```javascript
   console.log('Datos guardados:', {
       empleados: JSON.parse(localStorage.getItem('empleadosData')).length,
       turnos: JSON.parse(localStorage.getItem('turnosAppState')).scheduleData.length
   });
   ```
3. Recarga la página varias veces
4. **Verifica que:**
   - ✓ Los datos persisten después de cada recarga
   - ✓ No hay pérdida de información

### Prueba 4: Verificar Logs de Inicialización
1. Abre la consola (F12)
2. Recarga la página
3. Busca los mensajes con `✓` en la consola:
   ```
   🟢 INIT: Iniciando carga de datos...
   ✓ Tipos de turnos cargados
   ✓ Empleados cargados: N
   ✓ AppState cargado - Mes: 11 Año: 2025 Turnos guardados: N
   ✓ Mes/Año configurado: 11 / 2025
   ✓ Turnos inicializados/cargados
   ✓ Cuadrante general generado
   ```

### Prueba 5: Borrar localStorage e Inicializar desde Cero
1. Abre consola y ejecuta:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
2. **Verifica que:**
   - ✓ Se crean 7 empleados por defecto
   - ✓ Se generan turnos para todos
   - ✓ No hay errores en consola
   - ✓ El cuadrante se ve normal

## Flujo de Persistencia Correcto

```
1. PÁGINA CARGA
   ↓
2. DOMContentLoaded ejecuta:
   - Guardar tipos turnos (si no existen)
   - Cargar empleados de localStorage
   - Cargar tipos turnos de localStorage
   - ✅ Cargar AppState (AQUÍ restaura los turnos guardados)
   - Usar mes/año actual
   - Inicializar datos (SOLO si turnos vacíos)
   - ✅ Guardar AppState al finalizar
   ↓
3. APP CARGADA CON DATOS RESTAURADOS
   ↓
4. USUARIO EDITA TURNO
   - Abre modal
   - Cambia turno
   - Guarda
   - ✅ Actualiza AppState.scheduleData
   - ✅ Llama AppState.saveToStorage() ← CRÍTICO
   ↓
5. USUARIO RECARGA PÁGINA
   - Repite pasos 2-3
   - ✅ AppState.loadFromStorage() restaura cambios
   ↓
6. DATOS PERMANECEN
```

## Validación en Consola

Para verificar que todo funciona:

```javascript
// Ver empleados
console.log('Empleados en memoria:', empleados);

// Ver turnos de empleado 1
const turnosEmpl1 = AppState.scheduleData.get(1);
console.log('Turnos empleado 1:', turnosEmpl1);

// Ver localStorage
console.log('localStorage keys:', Object.keys(localStorage));

// Ver tamaño de datos
const appState = localStorage.getItem('turnosAppState');
console.log('Tamaño datos:', {
    appState: appState ? (appState.length / 1024).toFixed(2) + ' KB' : 'vacío',
    empleados: localStorage.getItem('empleadosData')?.length || 0,
    tipos: localStorage.getItem('tiposTurnoData')?.length || 0
});
```

## Resolución de Problemas

### Si datos se pierden al recargar:
1. ✓ Verificar que `AppState.saveToStorage()` se llama después de cada cambio
2. ✓ Abrir DevTools → Storage → localStorage
3. ✓ Verificar que `turnosAppState` contiene datos

### Si empleados no aparecen:
1. ✓ Verificar que `EmployeeManager.cargarDelStorage()` se ejecuta
2. ✓ Verificar `localStorage.empleadosData` existe

### Si turnos no se cargan:
1. ✓ Verificar que `AppState.loadFromStorage()` se ejecuta
2. ✓ Verificar `localStorage.turnosAppState` contiene `scheduleData`
3. ✓ Ver consola para mensajes de error

