# 🧪 Guía de Pruebas de Persistencia de Datos

## Descripción General
Se han creado herramientas completas para verificar que **todos los datos se guardan y recuperan correctamente** en localStorage cuando:
- Se crean nuevos empleados
- Se editan empleados
- Se crean o modifican turnos
- Se aplican cambios masivos
- Se recarga la página

---

## 📋 Herramientas Disponibles

### 1. **test_persistencia_visual.html** (RECOMENDADO)
Página HTML visual con interfaz gráfica para ejecutar pruebas.

**Cómo usar:**
```bash
1. Abre en navegador: http://localhost:5001/test_persistencia_visual.html
2. Haz clic en "Ejecutar Todas las Pruebas"
3. Espera a que terminen (2-3 segundos)
4. Revisa resultados con ✅ (pasado) o ❌ (fallido)
```

**Lo que prueba:**
- ✅ Empleados cargados en memoria
- ✅ Antony presente en la lista
- ✅ Sincronización entre memoria y localStorage
- ✅ Turnos guardados correctamente
- ✅ Tamaño total de datos guardados

---

### 2. **test_persistencia_completo.js** (ADVANCED)
Script JavaScript para consola del navegador con pruebas detalladas.

**Cómo usar:**
```bash
1. Abre la aplicación: http://localhost:5001/nuevo_cuadrante_mejorado.html
2. Abre la consola: F12 → Console
3. Copia y pega el contenido de test_persistencia_completo.js
4. Presiona Enter para ejecutar
```

**Output esperado:**
```
🧪 INICIANDO SUITE DE PRUEBAS DE PERSISTENCIA
═══════════════════════════════════════════════

📋 SUITE 1: PERSISTENCIA DE EMPLEADOS
✅ Hay 8 empleados cargados
✅ Antony encontrado (ID: 8)
✅ Empleado creado y guardado (ID: 9)
✅ Empleado encontrado en localStorage
✅ Datos recuperados correctamente (8 empleados)
✅ Empleado de prueba eliminado y guardado

🔄 SUITE 2: PERSISTENCIA DE TURNOS
✅ 30 turnos encontrados para María Rodríguez López
✅ Turno creado para día 15
✅ Turno verificado en memoria (tipo: noche)
✅ Turnos recuperados correctamente (30 turnos)
✅ Turno recuperado con datos íntegros

[... más pruebas ...]

📊 RESUMEN DE PRUEBAS
═══════════════════════════════════════════════
✅ Pruebas PASADAS: 14
❌ Pruebas FALLIDAS: 0
📈 TASA DE ÉXITO: 100.0%
═══════════════════════════════════════════════
🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!
```

---

## 🧪 Suite de Pruebas Detalladas

### SUITE 1: Persistencia de Empleados

**Test 1.1:** Verificar empleados por defecto
- ✓ Confirma que hay empleados cargados
- ✓ Valida que no estén vacíos

**Test 1.2:** Buscar a Antony
- ✓ Verifica presencia de Antony (ID: 8)
- ✓ Confirma datos correctos (Operaciones, Getafe)

**Test 1.3:** Crear empleado nuevo
- ✓ Agrega un empleado de prueba
- ✓ Guarda en AppState
- ✓ Persiste en localStorage

**Test 1.4:** Verificar localStorage
- ✓ Lee datos de localStorage
- ✓ Confirma que el nuevo empleado está ahí

**Test 1.5:** Simular recarga de página
- ✓ Limpia array de empleados en memoria
- ✓ Recarga desde localStorage
- ✓ Verifica que todos vuelvan

**Test 1.6:** Limpieza
- ✓ Elimina empleado de prueba
- ✓ Guarda cambios

---

### SUITE 2: Persistencia de Turnos

**Test 2.1:** Verificar turnos iniciales
- ✓ Cada empleado debe tener ~30 turnos (1 mes)

**Test 2.2:** Crear turno específico
- ✓ Crea un turno para día 15, tipo "noche"
- ✓ Asigna 8 horas
- ✓ Guarda en AppState

**Test 2.3:** Verificar persistencia
- ✓ Lee el turno creado desde AppState
- ✓ Confirma tipo y horas correctas

**Test 2.4:** Simular recarga
- ✓ Limpia AppState
- ✓ Recarga desde localStorage
- ✓ Verifica que el turno siga ahí

**Test 2.5:** Verificar integridad
- ✓ Confirma que los datos no se corrompieron
- ✓ Valida cada campo

---

### SUITE 3: Cambios Masivos

**Test 3.1:** Aplicar cambios masivos
- ✓ Crea 15+ turnos simultáneamente
- ✓ Los guarda todos en batch
- ✓ Persiste en localStorage

**Test 3.2:** Verificar todos
- ✓ Confirma que todos los cambios se guardaron
- ✓ Valida consistencia

**Test 3.3:** Recarga tras masivo
- ✓ Limpia AppState
- ✓ Recarga cambios masivos
- ✓ Verifica número correcto de turnos

---

### SUITE 4: Recuperación y Limpieza

**Test 4.1:** Analizar localStorage
- ✓ Muestra tamaño total de datos guardados
- ✓ Desglose por empleados vs turnos

**Test 4.2:** Recuperación de datos corruptos
- ✓ Simula corrupción intencional
- ✓ Intenta cargar datos inválidos
- ✓ Restaura desde backup
- ✓ Verifica recuperación

**Test 4.3:** Verificar consistencia final
- ✓ Confirma que no hay datos sueltos
- ✓ Valida conteos globales

---

## 🔍 Escenarios de Prueba Manual

### Escenario 1: Crear Empleado y Verificar
```
1. Abre la app
2. Clic en "👥 Gestionar Empleados"
3. Crea un empleado nuevo "Test Empleado"
4. Guarda
5. Recarga la página (F5)
6. RESULTADO ESPERADO: "Test Empleado" debe seguir ahí
```

### Escenario 2: Cambiar Turno y Verificar
```
1. Clic en un turno en el cuadrante
2. Cambia el turno (ej: mañana → noche)
3. Guarda
4. Recarga la página (F5)
5. RESULTADO ESPERADO: El turno debe estar con el nuevo tipo
```

### Escenario 3: Cambios Masivos Persistentes
```
1. Abre "⚡ Edición Masiva"
2. Aplica cambios a múltiples empleados/días
3. Haz clic en "💾 Guardar Cambios"
4. Recarga la página (F5)
5. RESULTADO ESPERADO: Todos los cambios siguen ahí
```

### Escenario 4: Antony Permanece
```
1. Verifica que Antony está en el cuadrante
2. Recarga página (F5)
3. Abre consola: localStorage.clear()
4. Recarga página nuevamente (F5)
5. RESULTADO ESPERADO: Antony debe aparecer (lista por defecto)
```

---

## 📊 Métricas de Éxito

### ✅ Todo Funciona si:
- [ ] Tasa de éxito = 100%
- [ ] Antony aparece en empleados
- [ ] Los datos persisten después de F5
- [ ] Los datos persisten después de localStorage.clear()
- [ ] Los cambios masivos se guardan
- [ ] No hay errores en la consola (rojo)

### ❌ Hay Problemas si:
- [ ] Tasa de éxito < 100%
- [ ] Algún empleado desaparece
- [ ] Los turnos no persisten
- [ ] Los cambios masivos se pierden
- [ ] Hay errores en rojo en la consola

---

## 🛠️ Comandos Útiles en Consola

```javascript
// Ver todos los empleados en memoria
console.log(empleados)

// Ver todos los empleados guardados en localStorage
console.log(JSON.parse(localStorage.getItem('empleadosData')))

// Buscar a Antony
empleados.find(e => e.nombre.includes('Antony'))

// Ver todos los turnos
console.log(Array.from(AppState.scheduleData.entries()))

// Ver turnos de un empleado (ID: 1)
console.log(AppState.scheduleData.get(1))

// Ver tamaño total de datos
const size = new Blob([
  localStorage.getItem('empleadosData'),
  localStorage.getItem('turnosAppState')
]).size
console.log(`Total: ${size} bytes`)

// Limpiar y reiniciar (peligro!)
localStorage.clear()
location.reload()

// Hacer backup de datos
const backup = {
  empleados: localStorage.getItem('empleadosData'),
  turnos: localStorage.getItem('turnosAppState')
}
console.log('Backup creado:', backup)

// Restaurar desde backup
localStorage.setItem('empleadosData', backup.empleados)
localStorage.setItem('turnosAppState', backup.turnos)
location.reload()
```

---

## 📈 Checklist Final

Antes de considerar completado:

- [ ] Ejecuté test_persistencia_visual.html → 100% éxito
- [ ] Ejecuté test_persistencia_completo.js en consola → 100% éxito
- [ ] Antony aparece siempre en empleados
- [ ] Los turnos persisten después de F5
- [ ] Los cambios masivos persisten
- [ ] localStorage.clear() y recarga muestra empleados por defecto
- [ ] No hay errores en consola

---

## 🎉 Conclusión

Si **todas las pruebas pasan**, puedes estar seguro de que:
- ✅ La persistencia funciona correctamente
- ✅ Los datos no se pierden
- ✅ La aplicación es estable
- ✅ Es seguro lanzar a producción
