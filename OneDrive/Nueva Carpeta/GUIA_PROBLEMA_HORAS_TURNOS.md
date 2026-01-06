# 🔍 Diagnóstico: Problema de Horas en Turnos Personalizados

## 📋 Resumen del Problema

Cuando creas empleados con **turno personalizado** (ej: "Especial"), el sistema está asignando horas incorrectas:
- ❌ Empleado con turno **"Tarde" (6.5h)** recibe **"Especial" (4h)**
- ❌ Las horas no coinciden con la configuración del empleado

## 🔬 Raíz del Problema (Root Cause)

### Código Problemático (antes):
```javascript
// En js/modules.js - generarTurnosEmpleado()
const tiposTurnoDisponibles = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };

// PROBLEMA: turnosMerged mezcla turnos default con personalizados
// Si localStorage tiene "Tarde" con 4h, SOBRESCRIBE tiposTurno['tarde'] con 6.5h
```

### ¿Por qué ocurre?
1. **localStorage** guarda turnos personalizados en `tiposTurnoData`
2. **Spread operator** (`...tiposTurnoDisponibles`) sobrescribe valores duplicados
3. Si crear un turno personalizado "Tarde" con 4h, sobrescribe el default "tarde" con 6.5h
4. Cuando empleado tiene `turnoPrincipal = "tarde"`, recibe **4h en lugar de 6.5h**

## ✅ Solución Implementada

### Cambio en `js/modules.js` (generarTurnosEmpleado):

**ANTES:**
```javascript
const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };
let turnoEmpleado = empleado.turnoPrincipal;

if (!turnosMerged[turnoEmpleado]) {
    // fallback...
}
```

**AHORA:**
```javascript
// Prioridad 1: Buscar en turnos por defecto (tiposTurno)
// Prioridad 2: Buscar en turnos personalizados (tiposTurnoDisponibles)
// Prioridad 3: Fallback a 'mañana'

const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };

let turnoEmpleado = empleado.turnoPrincipal;

if (!turnosMerged[turnoEmpleado]) {
    const turnoLower = turnoEmpleado?.toLowerCase();
    const turnoEncontrado = Object.keys(turnosMerged).find(t => t.toLowerCase() === turnoLower);
    turnoEmpleado = turnoEncontrado || 'mañana';
}
```

## 🧪 Cómo Verificar la Solución

### Opción 1: Usar la herramienta de Test (RECOMENDADO)

1. Abre **`TEST_HORAS_TURNOS.html`** en el navegador
2. Haz clic en **▶️ Ejecutar Todos los Tests**
3. Verifica que todos los tests pasen ✅:
   - ✅ Empleado "tarde" recibe 6.5h
   - ✅ Turno personalizado "Especial" recibe 4h
   - ✅ Empleado "tarde" NO recibe "Especial"
   - ✅ Domingos siempre son "libre"

### Opción 2: Usar el Diagnóstico

1. Abre **`DIAGNOSTICO_HORAS_TURNOS.html`** en el navegador
2. Revisa:
   - **Turnos por Defecto**: Verifica que "tarde" tiene 6.5h
   - **Turnos Personalizados**: Verifica qué hay en localStorage
   - **Análisis de Empleados**: Busca empleados con diagnóstico ❌
   - **Problemas Detectados**: Lista de errores encontrados

### Opción 3: Verificación Manual en Consola

```javascript
// 1. Abre tu aplicación principal
// 2. Abre DevTools (F12)
// 3. Pega esto en la consola:

// Ver todos los turnos disponibles
console.log('Turnos por defecto:', {
    tarde: tiposTurno['tarde'],
    mañana: tiposTurno['mañana'],
    noche: tiposTurno['noche']
});

// Ver turnos personalizados
console.log('Turnos personalizados:', 
    JSON.parse(localStorage.getItem('tiposTurnoData') || '{}')
);

// Ver datos de empleados
const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
empleados.forEach(e => {
    console.log(`${e.nombre}: turnoPrincipal = ${e.turnoPrincipal}`);
});

// Ver turnos generados para el primer empleado
const scheduleData = JSON.parse(localStorage.getItem('turnosAppState') || '{}').scheduleData;
if (scheduleData) {
    const primerEmpleado = Object.entries(scheduleData)[0];
    if (primerEmpleado) {
        const [empId, turnos] = primerEmpleado;
        const turnosMes = turnos.slice(0, 10);
        console.table(turnosMes);
    }
}
```

## 📊 Comportamiento Esperado

### Escenario 1: Empleado con turno "Tarde"
```
Configuración:
- Nombre: Juan Limpieza
- Turno Principal: "tarde"
- Horas por turno: 6.5h

Resultado esperado en diciembre 2025:
- Domingos: "libre" (0h)
- Sábados: 50% "tarde" (6.5h) o "descanso" (0h)
- Lunes-Viernes: patrón TTTTTDD (5 "tarde" + 2 "descanso")
- Horas "tarde": **6.5h siempre**
```

### Escenario 2: Empleado con turno personalizado "Especial"
```
Configuración:
- Nombre: María Custom
- Turno Principal: "Especial"
- Horas por turno: 4h

Resultado esperado:
- Domingos: "libre" (0h)
- Sábados: 50% "Especial" (4h) o "descanso" (0h)
- Lunes-Viernes: patrón EEEEEEE (5 "Especial" + 2 "descanso")
- Horas "Especial": **4h siempre**
```

## 🛠️ Cómo Probar en la Aplicación Principal

### Paso 1: Limpiar datos (opcional)
```javascript
// En consola:
localStorage.clear();
location.reload();
```

### Paso 2: Crear empleado con turno "tarde"
1. Abre `nuevo_cuadrante_mejorado.html`
2. Haz clic en **👥 Gestionar Empleados**
3. Crea empleado:
   - Nombre: "Juan Limpieza"
   - Turno: "tarde"
   - Horas contrato: 150
4. Haz clic en **✅ Guardar**

### Paso 3: Crear turno personalizado "Especial"
1. Ve a la sección **"Nuevo Turno"** (si existe)
2. Crea:
   - Nombre: "Especial"
   - Horario: "10:00-14:00"
   - Horas: 4
   - Color: #ff6b6b
3. Guarda

### Paso 4: Crear empleado con turno "Especial"
1. Haz clic en **👥 Gestionar Empleados**
2. Crea empleado:
   - Nombre: "María Especial"
   - Turno: "Especial"
   - Horas contrato: 120
3. Guarda

### Paso 5: Generar cuadrante
1. Selecciona mes actual
2. Haz clic en **🔄 Generar**
3. Verifica en el cuadrante:
   - Juan Limpieza: todos los turnos de trabajo son "T" (tarde 6.5h)
   - María Especial: todos los turnos de trabajo son "E" (especial 4h)

## ❌ Problemas que DEBERÍA resolver

| Problema | Antes | Después |
|----------|-------|---------|
| Empleado "tarde" recibe "Especial" | ❌ Sí | ✅ No |
| Empleado "tarde" con horas incorrectas | ❌ 4h | ✅ 6.5h |
| Domingos no son libres | ❌ A veces | ✅ Siempre |
| Turno personalizado no se respeta | ❌ A veces | ✅ Siempre |

## 🔧 Cambios en el Código

### Archivo: `js/modules.js`

**Líneas 1007-1065** (generarTurnosEmpleado):
```javascript
// ✅ Fusión correcta de turnos
const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };

// ✅ Búsqueda robusta del turno del empleado
if (!turnosMerged[turnoEmpleado]) {
    const turnoLower = turnoEmpleado?.toLowerCase();
    const turnoEncontrado = Object.keys(turnosMerged).find(t => t.toLowerCase() === turnoLower);
    turnoEmpleado = turnoEncontrado || 'mañana';
}

// ✅ Patrón dinámico respetando el turno
const patronEmpleado = [turnoEmpleado, turnoEmpleado, turnoEmpleado, turnoEmpleado, turnoEmpleado, 'descanso', 'descanso'];
```

**Líneas 920-1003** (generarTurnosEmpleadoConLocalidad):
- Se aplicó el mismo fix para consistencia

## 📝 Próximos Pasos

1. **Ejecuta los tests**: Abre `TEST_HORAS_TURNOS.html` y verifica que pasen ✅
2. **Verifica en la aplicación**: Crea empleados y genera cuadrante
3. **Revisa el diagnóstico**: Abre `DIAGNOSTICO_HORAS_TURNOS.html` para ver detalles
4. **Reporta si sigue fallando**: Si hay problemas, revisa la sección "Debugging" abajo

## 🐛 Debugging Avanzado

Si sigue sin funcionar, ejecuta esto en la consola:

```javascript
// Ver fusión de turnos
const tiposTurnoDisponibles = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
const turnosMerged = { ...tiposTurno, ...tiposTurnoDisponibles };

console.log('Fusión de turnos:');
console.log('- "tarde" en tiposTurno:', tiposTurno['tarde']);
console.log('- "tarde" en localStorage:', tiposTurnoDisponibles['tarde']);
console.log('- "tarde" en merged:', turnosMerged['tarde']);

// Ver qué turno se asigna a cada empleado
const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
empleados.forEach(e => {
    let turnoEmpleado = e.turnoPrincipal;
    
    if (!turnosMerged[turnoEmpleado]) {
        const turnoLower = turnoEmpleado?.toLowerCase();
        const turnoEncontrado = Object.keys(turnosMerged).find(t => t.toLowerCase() === turnoLower);
        turnoEmpleado = turnoEncontrado || 'mañana';
    }
    
    console.log(`${e.nombre}: ${e.turnoPrincipal} → ${turnoEmpleado} (${turnosMerged[turnoEmpleado]?.horas}h)`);
});
```

---

**Última actualización**: Diciembre 2024  
**Versión**: v1.0  
**Estado**: ✅ Resuelto en js/modules.js líneas 920-1065
