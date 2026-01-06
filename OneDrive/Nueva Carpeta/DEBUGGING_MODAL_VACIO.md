# 🔍 DEBUGGING - Modal de Departamentos Vacío

## Pasos para Diagnosticar

### 1. Abre la Consola del Navegador
- Presiona **F12**
- Ve a la pestaña **Console**

### 2. Ejecuta estos comandos EN ORDEN y copia los resultados

```javascript
// TEST 1: Verificar que DepartmentManager existe y tiene departamentos
console.log('=== TEST 1: Datos cargados ===');
console.log('DepartmentManager:', typeof DepartmentManager);
console.log('Departamentos en DepartmentManager:', DepartmentManager.departamentos);
console.log('Total deptos:', DepartmentManager.departamentos?.length);
```

**Resultado esperado:**
```
DepartmentManager: object
Departamentos en DepartmentManager: Array(6) [ {...}, {...}, ...]
Total deptos: 6
```

---

```javascript
// TEST 2: Verificar que el modal existe
console.log('=== TEST 2: Modal y contenedores ===');
const modal = document.getElementById('modalGestionDepartamentos');
const lista = document.getElementById('listaDepartamentos');
console.log('Modal existe:', !!modal);
console.log('ListaDepartamentos existe:', !!lista);
console.log('Lista HTML actual:', lista?.innerHTML);
```

**Resultado esperado:**
```
Modal existe: true
ListaDepartamentos existe: true
Lista HTML actual: <p style="...">No hay departamentos...</p>
  O
Lista HTML actual: <div style="display: grid...">...</div>
```

---

```javascript
// TEST 3: Forzar apertura del modal manualmente
console.log('=== TEST 3: Abriendo modal manualmente ===');
DepartmentManager.abrirModal();
// Espera 1 segundo, luego verifica:
setTimeout(() => {
  const lista = document.getElementById('listaDepartamentos');
  console.log('Después de abrirModal():', lista?.innerHTML);
}, 1000);
```

**Resultado esperado en consola:**
```
[UIIntegracionDepartamentos] 🔗 Interceptando abrirModal()
[UIIntegracionDepartamentos] ✅ Lista cargada manualmente
[UIIntegracionDepartamentos] 🔄 Sincronizando departamentos antiguos → FASE 2
[UIIntegracionDepartamentos] ✅ X departamentos sincronizados
```

---

```javascript
// TEST 4: Llamar directamente a cargarListaDepartamentos()
console.log('=== TEST 4: Cargar lista directamente ===');
DepartmentManager.cargarListaDepartamentos();
const lista = document.getElementById('listaDepartamentos');
console.log('HTML después de cargarListaDepartamentos():', lista?.innerHTML?.substring(0, 200));
```

**Resultado esperado:**
```
HTML después de cargarListaDepartamentos(): <div style="display: grid; gap: 10px;">...
```

---

```javascript
// TEST 5: Verificar UIIntegracionDepartamentos
console.log('=== TEST 5: Módulo de integración ===');
console.log('UIIntegracionDepartamentos:', typeof UIIntegracionDepartamentos);
console.log('Métodos disponibles:', Object.keys(UIIntegracionDepartamentos));
```

**Resultado esperado:**
```
UIIntegracionDepartamentos: object
Métodos disponibles: ['inicializar', 'sincronizarAhora', 'obtenerConfig', 'establecerSincronizacionAutomatica']
```

---

## 🎯 Diagnóstico Basado en Resultados

### Escenario A: TEST 1 muestra lista vacía
```
Departamentos en DepartmentManager: []
```
**Problema**: No hay datos cargados desde localStorage  
**Solución**: 
```javascript
// Crear datos de prueba
DepartmentManager.departamentos = [
  { id: 1, nombre: 'Operaciones', descripcion: 'General' },
  { id: 2, nombre: 'Limpieza', descripcion: 'Limpieza 39h' }
];
DepartmentManager.guardarEnStorage();
location.reload();
```

---

### Escenario B: Modal existe pero lista no se actualiza
```
Modal existe: true
ListaDepartamentos existe: true
Lista HTML actual: <p style="...">No hay departamentos...</p>
```
**Problema**: cargarListaDepartamentos() no se ejecuta o no genera HTML  
**Solución**: Verificar que modules.js tiene el método cargarListaDepartamentos completo

---

### Escenario C: UIIntegracionDepartamentos no está cargado
```
UIIntegracionDepartamentos: undefined
```
**Problema**: El módulo no se inicializó  
**Solución**:
```javascript
// Cargar manualmente
if (typeof UIIntegracionDepartamentos === 'undefined') {
  console.error('UIIntegracionDepartamentos no cargó. Recargar página.');
  location.reload();
}
```

---

## 📝 Reporta lo siguiente:

Copia y pega los resultados de cada test en tu respuesta:

```
TEST 1 - Datos:
[tu resultado aquí]

TEST 2 - Modal:
[tu resultado aquí]

TEST 3 - Abrir modal (logs en consola):
[tu resultado aquí]

TEST 4 - Cargar lista:
[tu resultado aquí]

TEST 5 - Módulo:
[tu resultado aquí]
```

---

**Una vez reportes estos, sabré exactamente dónde está el problema.**
