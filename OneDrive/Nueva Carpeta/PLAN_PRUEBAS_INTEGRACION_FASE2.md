# 🧪 PLAN DE PRUEBAS - INTEGRACIÓN FASE 2 DEPARTAMENTOS

## 📋 Checklist de Verificación

Ejecuta estos comandos en la consola del navegador (F12 → Console) **en orden**.

---

## ✅ TEST 1: Verificar módulos cargados

```javascript
// Debe retornar 'object'
console.log('DepartmentManager:', typeof DepartmentManager);
console.log('DepartamentosManager:', typeof DepartamentosManager);
console.log('UIIntegracionDepartamentos:', typeof UIIntegracionDepartamentos);

// Debe retornar > 0
console.log('Deptos existentes:', DepartmentManager.departamentos.length);
```

**Resultado esperado:**
```
DepartmentManager: object
DepartamentosManager: object
UIIntegracionDepartamentos: object
Deptos existentes: 6 (o más)
```

---

## ✅ TEST 2: Abrir modal manualmente

```javascript
// Abre el modal de gestión de departamentos
DepartmentManager.abrirModal();
```

**Resultado esperado:**
- ✅ Modal abre visualmente
- ✅ Lista se llena con departamentos (deberías ver tarjetas)
- ✅ Consola muestra: `[UIIntegracionDepartamentos] 🔗 Interceptando abrirModal()`
- ✅ Consola muestra: `[UIIntegracionDepartamentos] 🔄 Sincronizando departamentos antiguos → FASE 2`
- ✅ Consola muestra: `[UIIntegracionDepartamentos] ✅ X departamentos sincronizados`

---

## ✅ TEST 3: Verificar sincronización FASE 2

```javascript
// Ver qué departamentos están sincronizados en FASE 2
const estado = DepartamentosManager.obtenerEstado();
console.log('Departamentos en FASE 2:', estado.departamentos);

// Mostrar cada uno
estado.departamentos.forEach(([id, depto]) => {
  console.log(`${id}: ${depto.nombre} (${depto.horasSemanales}h)`);
});
```

**Resultado esperado:**
- Array con todos los departamentos
- Formato: `[['operaciones', {nombre: 'Operaciones', ...}], ...]`
- **Mínimo esperado**: Operaciones, Ventas, Administración, etc.

---

## ✅ TEST 4: Crear departamento (UI)

### Opción A: Manualmente por UI
1. Modal ya está abierto
2. Clic botón "➕ Nuevo Departamento"
3. Ingresa:
   - Nombre: `Quality Assurance`
   - Descripción: `Equipo de control de calidad`
4. Clic "💾 Guardar Departamento"

### Opción B: Por código directo

```javascript
// Establecer datos en el form y guardar
document.getElementById('depto_nombre').value = 'Quality Assurance';
document.getElementById('depto_descripcion').value = 'Equipo de control de calidad';
DepartmentManager.guardarDepartamento();
```

**Resultado esperado:**
- ✅ Notificación: "Departamento guardado correctamente"
- ✅ Aparece en la lista (tarjeta nueva)
- ✅ Consola muestra: `[UIIntegracionDepartamentos] 🔗 Interceptando guardarDepartamento()`
- ✅ Consola muestra: `[UIIntegracionDepartamentos] ✅ Departamento 'Quality Assurance' guardado y sincronizado`
- ✅ Verifica que está en FASE 2:
```javascript
const depto = DepartamentosManager.obtenerDepartamento('quality_assurance');
console.log('QA en FASE 2:', depto);
```

---

## ✅ TEST 5: Sincronización periódica

```javascript
// El módulo sincroniza cada 5 segundos automáticamente
// Vamos a forzar una sincronización inmediata:

UIIntegracionDepartamentos.sincronizarAhora();
```

**Resultado esperado:**
- ✅ Retorna `true`
- ✅ Consola muestra: `[UIIntegracionDepartamentos] 🔄 Sincronizando departamentos antiguos → FASE 2`
- ✅ Consola muestra: `[UIIntegracionDepartamentos] ✅ X departamentos sincronizados`

---

## ✅ TEST 6: Editar departamento

### Manualmente por UI:
1. Modal abierto con lista de deptos
2. Busca un departamento (ej: "Quality Assurance")
3. Clic "✏️ Editar"
4. Cambia datos:
   - Nombre: `QA Testing`
   - Descripción: `Equipo de pruebas de calidad`
5. Clic "💾 Guardar Departamento"

**Resultado esperado:**
- ✅ Cambios visibles en lista inmediatamente
- ✅ Sincronizado automáticamente en FASE 2
- ✅ Consola muestra "Departamento guardado correctamente"

---

## ✅ TEST 7: Eliminar departamento

### Manualmente por UI:
1. Modal abierto con lista de deptos
2. Busca un departamento (ej: uno que creaste en test)
3. Clic "🗑️ Eliminar"
4. Confirma en dialogo

**Resultado esperado:**
- ✅ Desaparece de la lista
- ✅ Notificación: "Departamento eliminado correctamente"
- ✅ Registrado en logs del sistema

---

## ✅ TEST 8: Sincronización bidireccional

```javascript
// Simular agregar departamento por otro lado del sistema
// (Como si se cargara de localStorage directamente)

// 1. Ver estado inicial
console.log('Antes:', DepartmentManager.departamentos.length);

// 2. Agregar directamente (simulando otra fuente)
DepartmentManager.departamentos.push({
  id: 999,
  nombre: 'Departamento Test',
  descripcion: 'Creado por prueba'
});

// 3. Guardar en localStorage
DepartmentManager.guardarEnStorage();

// 4. Forzar sincronización
UIIntegracionDepartamentos.sincronizarAhora();

// 5. Verificar FASE 2
const depto = DepartamentosManager.obtenerDepartamento('departamento_test');
console.log('Test sincronización bidireccional:', depto ? '✅ ÉXITO' : '❌ FALLÓ');
```

**Resultado esperado:**
- ✅ Depto aparece en FASE 2
- ✅ Se puede usar en `GeneradorTurnosDepartamentos`
- ✅ Se puede analizar en `BalanceadorTurnos`

---

## ✅ TEST 9: Integración con FASE 2 (Generador de Turnos)

```javascript
// Probar que FASE 2 puede generar turnos para el nuevo depto

// 1. Obtener FASE 2
const fase2 = DepartamentosManager.obtenerEstado();
console.log('Departamentos FASE 2:', fase2.departamentos.length);

// 2. Ver estructura del estado FASE 2
console.log('Estructura:', fase2);

// 3. Probar GeneradorTurnosDepartamentos
if (typeof GeneradorTurnosDepartamentos !== 'undefined') {
  // Obtener empleado para prueba
  const empleado = empleados[0];
  
  // Obtener departamento del empleado
  const depto = DepartamentosManager.obtenerDepartamento(
    empleado.departamento?.toLowerCase().replace(/\s+/g, '_') || 'operaciones'
  );
  
  console.log('Depto del empleado:', depto);
  
  // Generar turnos para este empleado
  const turnos = GeneradorTurnosDepartamentos.generarTurnosEmpleado(
    empleado.id,
    2024, // año
    11,   // mes (noviembre, 0-indexed)
    depto
  );
  
  console.log('Turnos generados:', turnos?.length, 'días');
  console.log('Estructura turno:', turnos?.[0]);
}
```

**Resultado esperado:**
- ✅ FASE 2 retorna departamentos
- ✅ Generador puede crear turnos
- ✅ Turnos tienen estructura correcta: `{dia, turno, horas, ...}`

---

## ✅ TEST 10: Estado de localStorage

```javascript
// Verificar que ambos sistemas persisten correctamente

// Sistema antiguo
const antiguo = JSON.parse(localStorage.getItem('departamentosData'));
console.log('localStorage antiguo:', antiguo);

// Sistema FASE 2
const fase2 = JSON.parse(localStorage.getItem('departamentosConfig'));
console.log('localStorage FASE 2:', fase2);

// Verificar que tienen los mismos departamentos (aproximadamente)
console.log('Antiguo count:', antiguo?.length || 0);
console.log('FASE 2 count:', fase2?.departamentos?.length || 0);
```

**Resultado esperado:**
- ✅ Ambos tienen datos
- ✅ El conteo de departamentos es similar (permitiendo conversión de formato)
- ✅ localStorage no está corrupto

---

## 🔧 Troubleshooting Común

### Problema: "UIIntegracionDepartamentos is not defined"
```javascript
// Solución: Recargar página y esperar a que módulos carguen
location.reload();
// Esperar 2-3 segundos

// Luego verificar:
console.log(typeof UIIntegracionDepartamentos); // debe ser 'object'
```

### Problema: Modal abre pero lista está vacía
```javascript
// Forzar recarga manual:
DepartmentManager.cargarListaDepartamentos();

// O forzar sincronización:
UIIntegracionDepartamentos.sincronizarAhora();
```

### Problema: Consola muestra errores sobre módulos
```javascript
// Verificar orden de carga:
console.log('modules.js loaded:', typeof DepartmentManager);
console.log('departamentos-manager.js loaded:', typeof DepartamentosManager);
console.log('ui-integracion loaded:', typeof UIIntegracionDepartamentos);

// Si falta alguno, recargar:
location.reload();
```

### Problema: Cambios no persisten
```javascript
// Verificar localStorage:
localStorage.getItem('departamentosData'); // antiguo
localStorage.getItem('departamentosConfig'); // FASE 2

// Si está vacío, crear datos:
DepartmentManager.guardarEnStorage();
DepartamentosManager.guardarEnStorage();
```

---

## 📊 Resultados Esperados Resumen

| Test | Descripción | ✅ Esperado | ❌ Si Falla |
|------|-------------|-----------|-----------|
| 1 | Módulos cargados | Todos type='object' | Recargar página |
| 2 | Abrir modal | Abre con lista llena | Sincronizar manual |
| 3 | FASE 2 sincronizado | Departamentos en Map | Forzar sync |
| 4 | Crear depto | Aparece en lista + FASE 2 | Ver consola |
| 5 | Sync periódica | Cada 5s automático | Forzar sync |
| 6 | Editar depto | Cambios visibles | Recargar |
| 7 | Eliminar depto | Desaparece de UI | Limpiar localStorage |
| 8 | Bidireccional | Ambos sistemas sincronizados | Ver localStorage |
| 9 | FASE 2 genera turnos | Turnos con estructura | Ver console log |
| 10 | localStorage | Ambos tienen datos | Inicializar manual |

---

## 🎯 Criterio de Éxito

✅ **INTEGRACIÓN COMPLETADA** cuando:
1. ✅ Modal abre y muestra lista de departamentos
2. ✅ Crear departamento visible en UI y FASE 2
3. ✅ Editar departamento funciona en ambos sistemas
4. ✅ Eliminar departamento funciona
5. ✅ localStorage contiene ambos formatos (antiguo + FASE 2)
6. ✅ GeneradorTurnosDepartamentos puede usar departamentos FASE 2
7. ✅ BalanceadorTurnos puede analizar por departamento
8. ✅ Sin errores JavaScript en consola
9. ✅ Sin conflictos entre sistemas
10. ✅ Sincronización periódica funciona (cada 5 segundos)

---

**Ejecuta estos tests en orden y reporta cualquier problema.**
