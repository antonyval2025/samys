% Checklist de Verificación: Problema de Horas Resuelto

## ✅ Verificación Rápida (5 minutos)

### 1️⃣ Tests Automáticos
```
📂 Abre: TEST_HORAS_TURNOS.html

☐ Test 1: Empleado "tarde" recibe 6.5h  ______
  Resultado esperado: ✅ PASS
  
☐ Test 2: Turno "Especial" recibe 4h  ______
  Resultado esperado: ✅ PASS
  
☐ Test 3: Empleado "tarde" NO recibe "Especial"  ______
  Resultado esperado: ✅ PASS
  
☐ Test 4: Domingos siempre son "libre"  ______
  Resultado esperado: ✅ PASS

Final: ☐ Todos los tests ✅ PASS
```

### 2️⃣ Diagnóstico Visual
```
📂 Abre: DIAGNOSTICO_HORAS_TURNOS.html

☐ Sección "Turnos por Defecto"  ______
  ✓ tarde: 6.5h
  ✓ mañana: 8h
  ✓ noche: 8h

☐ Sección "Turnos Personalizados"  ______
  (si creaste turnos custom)
  ✓ Especial: 4h (u otro valor configurado)

☐ Sección "Problemas Detectados"  ______
  ✓ Debería estar VACÍA o sin ❌ errores

Conclusión: ☐ Sin problemas encontrados
```

### 3️⃣ Verificación en la Aplicación
```
📂 Abre: nuevo_cuadrante_mejorado.html

Paso 1: Crear Empleado
  ☐ Nombre: "Juan Tarde"
  ☐ Turno: "tarde" 
  ☐ Horas contrato: 150
  ☐ Estado: "activo"
  ☐ Guarda

Paso 2: Generar Cuadrante
  ☐ Mes: Actual (ej: Diciembre 2025)
  ☐ Haz clic: "🔄 Generar"
  
Paso 3: Verificar
  ☐ Abre cuadrante general
  ☐ Busca a "Juan Tarde"
  ☐ Ve sus turnos del mes:
    ✓ Domingos: "L" (libre) 
    ✓ Lunes-Viernes: "T" (tarde)
    ✓ NO debe haber "E" (especial)
    ✓ NO debe haber "M" (mañana)
  ☐ Haz clic en un turno de tarde:
    ✓ Modal muestra: 6.5h
    ✓ NO muestra: 4h

Resultado: ☐ Todo correcto ✅
```

---

## ⚠️ Problemas Comunes y Soluciones

### Problema 1: "Tests muestran FAIL"
```
⚠️ Síntoma: Test 1, 2 ó 3 muestra ❌ FAIL

✅ Solución:
  1. Limpia localStorage:
     localStorage.clear();
     location.reload();
  
  2. Verifica que tiposTurno esté correctamente definido
  
  3. Revisa DIAGNOSTICO_HORAS_TURNOS.html
     para ver qué está mal
```

### Problema 2: "Empleado recibe turno incorrecto"
```
⚠️ Síntoma: Juan con "tarde" recibe "E" (especial)

✅ Solución:
  1. Abre DevTools (F12)
  
  2. Ejecuta en consola:
     const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
     console.log('Turnos personalizados:', tiposTurnoData);
  
  3. Si hay "tarde" con 4h en localStorage:
     - Es un turno personalizado que sobrescribe el default
     - Edítalo o elimínalo
     - Limpia localStorage
     - Intenta de nuevo
```

### Problema 3: "Horas incorrectas en el turno"
```
⚠️ Síntoma: Turno "tarde" muestra 4h en lugar de 6.5h

✅ Solución:
  1. Abre DIAGNOSTICO_HORAS_TURNOS.html
  
  2. Revisa sección "Problemas Detectados"
  
  3. Si dice: "Turno 'tarde' personalizado sobrescribe default"
     → Hay un conflicto en localStorage
  
  4. Limpia:
     localStorage.removeItem('tiposTurnoData');
     location.reload();
```

### Problema 4: "Domingos no están libres"
```
⚠️ Síntoma: Domingo muestra "T" (tarde) o "M" (mañana)

✅ Solución:
  1. Ejecuta en consola:
     const dia = 3; // ejemplo: día 3
     const diaSemana = new Date(2025, 0, dia).getDay();
     console.log('Día de semana (0=Dom):', diaSemana);
  
  2. Si diaSemana === 0 = Es domingo
  
  3. Verifica en js/modules.js línea 1037:
     if (diaSemana === 0) { turno = 'libre'; }
  
  4. Si no está, el código no fue actualizado correctamente
```

---

## 🔬 Verificación Profunda

### Console Check (Copia en DevTools F12)
```javascript
// Ver definición de turnos por defecto
console.log('Turno "tarde" en tiposTurno:', tiposTurno['tarde']);

// Ver si hay turnos personalizados
const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData') || '{}');
console.log('Turnos personalizados:', tiposTurnoData);

// Ver si hay conflicto de "tarde"
if (tiposTurnoData['tarde'] && tiposTurnoData['tarde'].horas !== 6.5) {
    console.warn('⚠️ CONFLICTO: "tarde" personalizado tiene ' + tiposTurnoData['tarde'].horas + 'h, debería ser 6.5h');
}

// Ver empleados
const empleados = JSON.parse(localStorage.getItem('empleadosData') || '[]');
console.log('Empleados:', empleados.map(e => `${e.nombre} (${e.turnoPrincipal})`));

// Ver turnos del primer empleado
const scheduleData = JSON.parse(localStorage.getItem('turnosAppState') || '{}').scheduleData;
if (scheduleData && Object.keys(scheduleData).length > 0) {
    const primerEmpleado = Object.entries(scheduleData)[0];
    console.log('Turnos del primer empleado:');
    console.table(primerEmpleado[1].slice(0, 10));
}
```

---

## 📋 Resumen de Cambios Realizados

| Archivo | Líneas | Cambio |
|---------|--------|--------|
| `js/modules.js` | 920-1003 | Función `generarTurnosEmpleadoConLocalidad()` actualizada |
| `js/modules.js` | 1007-1065 | Función `generarTurnosEmpleado()` actualizada |
| *Nuevo* | - | `TEST_HORAS_TURNOS.html` creado |
| *Nuevo* | - | `DIAGNOSTICO_HORAS_TURNOS.html` creado |
| *Nuevo* | - | `GUIA_PROBLEMA_HORAS_TURNOS.md` creado |
| *Nuevo* | - | `RESUMEN_SOLUCION_HORAS.md` creado |
| *Nuevo* | - | `CHECKLIST_VERIFICACION_HORAS.md` creado |

---

## ✅ Checklist Final

```
VERIFICACIÓN COMPLETADA:

☐ Ejecuté TEST_HORAS_TURNOS.html
☐ Todos los tests pasaron ✅
☐ Abrí DIAGNOSTICO_HORAS_TURNOS.html
☐ No hay problemas detectados
☐ Creé un empleado con "tarde"
☐ Generé cuadrante
☐ Verifiqué que reciba turnos "T" (tarde) con 6.5h
☐ NO recibe turnos "E" (especial) ni "M" (mañana)
☐ Domingos son siempre "L" (libre)

RESULTADO FINAL: ✅ PROBLEMA RESUELTO

Fecha de verificación: _______________
Persona que verificó: ________________
```

---

## 🚀 Siguiente Paso

Si todo funciona correctamente (✅):
```
1. Continúa usando la aplicación normalmente
2. Los turnos se asignarán correctamente
3. Las horas respetarán la configuración del empleado
```

Si algo no funciona (❌):
```
1. Ejecuta el checklist de problemas comunes
2. Abre TEST_HORAS_TURNOS.html y reporta qué falla
3. Abre DIAGNOSTICO_HORAS_TURNOS.html y comparte captura
4. Contacta con soporte compartiendo:
   - Resultado de los tests
   - Logs de la consola (F12)
   - Captura del diagnóstico
```

---

**Última actualización**: Diciembre 2024  
**Versión**: v1.0  
**Estado**: ✅ Listo para verificación
