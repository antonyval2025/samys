# 🏗️ ARQUITECTURA SISTEMAS DE DEPARTAMENTOS - v2.0

## 📋 ESTADO ACTUAL (PROBLEMA)

Hay 3 sistemas conflictivos:
1. **DepartmentManager** (modules.js) - UI vieja, sin estándares
2. **DepartamentosManager** (departamentos-manager.js) - FASE 2, con estándares ✅
3. **GestorDepartamentos** (soporte-multilocal.js) - Multi-local, incompatible

**CONFLICTOS:**
- ❌ Empleados asignados a "Limpieza" (DepartamentosManager)
- ❌ Modal de edición usa DepartmentManager (diferente BD)
- ❌ GestorDepartamentos es paralelo, no integrado
- ❌ Dos estructuras de datos diferentes
- ❌ Inconsistencia total

---

## ✅ ARQUITECTURA NUEVA (SOLUCIÓN)

### Principio: **DepartamentosManager es la ÚNICA fuente de verdad**

```
┌─────────────────────────────────────────────────────────┐
│                    DepartamentosManager                  │
│  (Módulo central - FASE 2)                               │
│  - Almacena: {nombre, horasSemanales, diasTrabajo, ...}│
│  - localStorage: "departamentosData"                    │
│  - Métodos: CRUD + sincronización                       │
└─────────────────────────────────────────────────────────┘
          ↑                           ↑                ↑
          │                           │                │
          │                           │                │
    ┌─────┴─────┐          ┌──────────┴──────────┐   │
    │ Empleados │          │ Generación Turnos  │   │
    │  Modal    │          │ (Lee estándares)   │   │
    │ (UI)      │          │                    │   │
    └───────────┘          └────────────────────┘   │
                                                     │
                                         ┌───────────┴──┐
                                         │   REPORTES   │
                                         │  (Métricas)  │
                                         └──────────────┘
```

### Estructura de Datos Unificada

```javascript
// localStorage["departamentosData"]
{
  "Limpieza": {
    nombre: "Limpieza",
    id: "limpieza",
    horasSemanales: 39,      // ← ESTÁNDAR
    diasTrabajo: 6,          // ← ESTÁNDAR
    horasDiarias: 6.5,       // ← ESTÁNDAR
    descripcion: "Personal de limpieza",
    creado: "2024-01-01T10:30:00Z"
  },
  "Operaciones": {
    nombre: "Operaciones",
    id: "operaciones",
    horasSemanales: 40,
    diasTrabajo: 5,
    horasDiarias: 8,
    descripcion: "Gestión operativa"
  }
}
```

---

## 🔄 FLUJOS INTEGRADOS

### Flujo 1: Crear Empleado
```
1. Usuario abre Gestionar Empleados
   ↓
2. DepartmentManager.llenarSelectDepartamentos()
   ↓
3. Lee de DepartamentosManager.obtenerDepartamentos()  ← ÚNICA FUENTE
   ↓
4. Rellena <select> con lista unificada
   ↓
5. Usuario selecciona "Limpieza" y guarda
   ↓
6. DepartmentManager.guardarEmpleado()
   - empleado.departamento = "Limpieza"
   - Dispara evento: cambio-departamento-empleado
   - Regenera turnos con estándares de Limpieza (6.5h)
```

### Flujo 2: Editar Departamento Estándares
```
1. Usuario abre DepartmentManager.abrirModal()
   ↓
2. Carga departamentos de DepartamentosManager
   ↓
3. Usuario edita "Limpieza": 39h → 35h
   ↓
4. DepartmentManager.guardarDepartamento()
   ↓
5. Actualiza DepartamentosManager
   ↓
6. Dispara evento: cambio-estandares-departamento
   ↓
7. Sistema reactivo regenera turnos de TODOS los empleados en Limpieza
```

### Flujo 3: Cambiar Departamento Empleado
```
1. Usuario en Gestionar Empleados edita empleado
   ↓
2. Cambia "Operaciones" → "Limpieza"
   ↓
3. DepartmentManager.guardarEmpleado()
   ↓
4. Detecta cambio: huboNuevoDepartamento = true
   ↓
5. Dispara SistemaReactividad.emit('cambio-departamento-empleado')
   ↓
6. Sistema regenera turnos con 6.5h/día (estándares de Limpieza)
```

---

## 📦 COMPONENTES FINALES

### 1️⃣ DepartamentosManager (FASE 2) - Backend
**Archivo**: `js/departamentos-manager.js`
**Responsabilidad**: Gestión centralizada de departamentos
**Métodos principales**:
- `obtenerDepartamento(nombre)` → Retorna {horasSemanales, diasTrabajo, horasDiarias, ...}
- `obtenerDepartamentos()` → Array de todos los departamentos
- `crearDepartamento(config)` → Crea nuevo departamento
- `actualizarDepartamento(nombre, config)` → Actualiza estándares
- `eliminarDepartamento(nombre)` → Borra departamento

### 2️⃣ DepartmentManager (modules.js) - UI Wrapper
**Archivo**: `js/modules.js`
**Responsabilidad**: UI modal para gestión
**Métodos principales**:
- `abrirModal()` → Abre modal
- `llenarSelectDepartamentos()` → Lee de DepartamentosManager ✅ MODIFICADO
- `cargarListaDepartamentos()` → Lista de DepartamentosManager
- `guardarDepartamento()` → Delega a DepartamentosManager
- `editarDepartamento()` → UI para editar

### 3️⃣ GestorDepartamentos (soporte-multilocal.js) - DEPRECADO
**Estado**: ⚠️ No usar en nuevos códigos
**Razón**: Conflictua con DepartamentosManager
**Plan**: Será removido en v3.0

---

## 🔀 MAPEO DE MIGRACIONES

| Antes | Ahora | Cambio |
|-------|-------|--------|
| DepartmentManager.departamentos | DepartamentosManager.obtenerDepartamentos() | Read-only, centralizado |
| Empleado.departamento (string) | Empleado.departamento (string) | Sin cambios |
| TurnoManager.generarTurnosEmpleado() | Lee horasDiarias de DepartamentosManager | ✅ Implementado |
| Modal → crear depto | Modal → delega a DepartamentosManager | ✅ En progreso |
| GestorDepartamentos.crearDepartamento() | Usar DepartmentManager | Deprecar |

---

## 🧪 VALIDACIÓN

### Checklist Post-Implementación
- [ ] DepartmentManager.llenarSelectDepartamentos() lee de DepartamentosManager
- [ ] Crear empleado en Limpieza → genera turnos con 6.5h
- [ ] Cambiar empleado a Limpieza → regenera turnos con 6.5h
- [ ] Editar Limpieza (39h → 35h) → todos los empleados se regeneran con 35h/semana
- [ ] Borrar mes enero → no borra empleados ni departamentos
- [ ] Modal departamentos muestra: Limpieza, Operaciones, Ventas, etc.
- [ ] Ningún error de "departamento no encontrado"

---

## 📝 CAMBIOS IMPLEMENTADOS

### ✅ Fase 1: Fix llenarSelectDepartamentos()
- Cambiar línea 2476 en modules.js
- Usar DepartamentosManager.obtenerDepartamentos() en lugar de DepartmentManager.departamentos

### ⏳ Fase 2: Unificar Backend Departamentos
- Asegurar que DepartmentManager.guardarDepartamento() actualice DepartamentosManager
- No duplicar datos

### ⏳ Fase 3: Deprecar GestorDepartamentos
- Redireccionar llamadas a DepartmentManager
- Documentar migración

---

## 🎯 REGLA DE ORO

**De ahora en adelante:**
- ✅ TODO código nuevo usa DepartamentosManager como fuente de datos
- ✅ DepartmentManager es UI wrapper SOLAMENTE
- ✅ No crear nuevas BD de departamentos
- ✅ Revisar este documento antes de modificar departamentos
