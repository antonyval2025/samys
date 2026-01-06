# 🏗️ ARQUITECTURA INTEGRAL DEFINITIVA - Sistema de Gestión de Turnos

**Versión**: 1.0  
**Fecha**: 6 de Enero de 2026  
**Estado**: Implementación en Progreso  

---

## 📊 DIAGRAMA DE ENTIDADES Y RELACIONES

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTRUCTURA CENTRAL                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  DEPARTAMENTOS   │  (DepartamentosManager - FASE 2)
│  ─────────────   │
│  • id            │
│  • nombre        │
│  • horasSemanales│ ← Define estándares
│  • diasTrabajo   │
│  • horasDiarias  │
│  • descripcion   │
└────────┬─────────┘
         │
         │ 1:N (Un depto tiene varios empleados)
         │
         ▼
┌──────────────────────────┐
│      EMPLEADOS           │  (EmployeeManager)
│  ────────────────────    │
│  • id                    │
│  • nombre                │
│  • departamento ────────►│ FK a Departamentos
│  • localidad             │
│  • email                 │
│  • telefono              │
│  • horasContrato         │
│  • turnoPrincipal ──────►│ Define turno por defecto
│  • estado (activo/baja)  │
│  • foto (opcional)       │
└────────┬─────────────────┘
         │
         │ 1:N (Un empleado tiene turnos de todo el mes)
         │
         ▼
┌──────────────────────────────────────┐
│         TURNOS (AppState)            │  (TurnoManager / GeneradorTurnos*)
│  ──────────────────────────────────  │
│  • empleadoId                        │
│  • dia (1-31)                        │
│  • turno (mañana/tarde/noche/...)    │
│  • horas (dinámico según depto)      │
│  • horario (08:00-16:00)             │
│  • fecha (Date object)               │
│  • esFinSemana                       │
└──────┬───────────────────────────────┘
       │
       │ Se renderiza en
       │
       ├──────────────────────────────┐
       │                              │
       ▼                              ▼
┌─────────────────────┐      ┌──────────────────────┐
│  CUADRANTE GENERAL  │      │ CUADRANTE INDIVIDUAL │
│  (UI)               │      │ (UI)                 │
│ Tabla: Emp × Días   │      │ Vista: Un empleado   │
│ Colores por turno   │      │ Con estadísticas     │
└─────────────────────┘      └──────────────────────┘


┌──────────────────┐
│  LOCALIDADES     │  (LocationManager - Opcional)
│  ──────────────  │
│  • nombre        │
│  • empleados[]   │  ← Referencias a empleados
└──────────────────┘
```

---

## 🔑 ENTIDADES PRINCIPALES Y SISTEMAS

### 1. **DEPARTAMENTOS** (Source of Truth: `DepartamentosManager`)

**Responsabilidades:**
- ✅ Almacenar estándares de trabajo (horas/día, días/semana, horas/semana)
- ✅ Propagar cambios de estándares a todos los empleados del depto
- ✅ Validar cambios de empleados entre departamentos

**Archivos:**
- `js/departamentos-manager.js` - FASE 2 (único manager de departamentos)
- `localStorage['departamentosData_fase2']` - Persistencia

**Datos de Ejemplo:**
```javascript
{
  nombre: "Limpieza",
  id: "limpieza",
  horasSemanales: 39,      // Contrato: 39h/semana
  diasTrabajo: 6,          // Trabaja 6 días
  horasDiarias: 6.5        // 39÷6 = 6.5h/día
}
```

**Métodos Críticos:**
- `obtenerDepartamento(nombre)` - Buscar por nombre (normalizado)
- `obtenerDepartamentos()` - Listar todos
- `crear(config)` - Crear nuevo
- `actualizar(nombre, config)` - Editar estándares
- `eliminar(nombre)` - Eliminar si no hay empleados

---

### 2. **EMPLEADOS** (Source of Truth: `EmployeeManager`)

**Responsabilidades:**
- ✅ Gestionar datos de empleados
- ✅ Asignar empleados a departamentos
- ✅ Disparar regeneración de turnos cuando cambia departamento o turno principal
- ✅ Persistir en localStorage

**Campos Críticos:**
```javascript
{
  id: 1,
  nombre: "Juan García",
  departamento: "Limpieza",     // ← Referencia a depto
  turnoPrincipal: "tarde",      // ← Turno por defecto
  estado: "activo"              // activo|vacaciones|baja
}
```

**Flujo Reactivo:**
```
EmployeeManager.guardarEmpleado()
  ├─ Detecta: ¿Cambió departamento?
  │   └─► SistemaReactividad.emit('cambio-departamento-empleado')
  │
  └─ Detecta: ¿Cambió turnoPrincipal?
      └─► Regenera turnos con TurnoManager.generarTurnosEmpleado()
```

---

### 3. **TURNOS** (Source of Truth: `AppState.scheduleData`)

**Responsabilidades:**
- ✅ Almacenar turnos de todos los empleados, todos los meses
- ✅ Aplicar estándares del departamento (horas dinámicas)
- ✅ Persistir en localStorage y BD

**Estructura:**
```javascript
AppState.scheduleData = Map {
  empleadoId: [
    {
      dia: 1,
      turno: "tarde",
      horas: 6.5,              // ← Dinámico según depto
      horario: "12:30-19:00",
      fecha: Date(2026-01-01),
      esFinSemana: false
    },
    // ... 30+ días del mes
  ]
}
```

**Generadores:**
- `TurnoManager.generarTurnosEmpleado()` - General (8h) o dinámico por depto
- `GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito()` - FASE 2, dinámico

**Flujo de Generación:**
```
Cambio de empleado (depto/turno)
  ▼
SistemaReactividad dispara evento
  ▼
GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito()
  ▼
Lee estándares de DepartamentosManager
  ▼
Crea turnos con horas dinámicas
  ▼
AppState.scheduleData.set(empleadoId, turnos)
  ▼
UI.generarCuadranteGeneral() renderiza cambios
```

---

### 4. **CUADRANTES** (UI: `UI.generarCuadranteGeneral()`)

**Responsabilidades:**
- ✅ Renderizar tabla de empleados × días
- ✅ Mostrar turnos con colores según tipo
- ✅ Permitir edición individual (modal de turno)
- ✅ Filtrar por departamento/estado

**Datos que Lee:**
- `empleados[]` - Lista de empleados
- `AppState.scheduleData` - Turnos
- `AppState.currentMonth/Year` - Mes visualizado

**No Almacena Nada:** Es solo presentación

---

## 🔗 PUNTOS DE INTEGRACIÓN CRÍTICOS

### Punto 1: **Cambio de Departamento → Regeneración de Turnos**

```
UI: Click editar empleado
  ▼
EmployeeManager.editarEmpleado()
  ▼
Usuario cambia dropdown "departamento" (Lee de DepartamentosManager)
  ▼
EmployeeManager.guardarEmpleado()
  ├─ Detecta cambio de depto
  └─► SistemaReactividad.emit('cambio-departamento-empleado', {
        empleadoId: 3,
        nuevoDepartamento: 'Limpieza',
        empleadoObj: {...}
      })
  ▼
SistemaReactividad observer captura evento
  ▼
Lee estándares: DepartamentosManager.obtenerDepartamento('limpieza')
  ▼
GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito(
  empleadoId, 
  'Limpieza', 
  { horasDiarias: 6.5, diasTrabajo: 6, horasSemanales: 39 },
  mes, año
)
  ▼
AppState.scheduleData actualizado con turnos de 6.5h
  ▼
UI.generarCuadranteGeneral() renderiza
```

---

### Punto 2: **Cambio de Turno Principal → Regeneración de Turnos**

```
UI: Click editar empleado
  ▼
EmployeeManager.editarEmpleado()
  ▼
Usuario cambia "Turno Principal" (dropdown de turnos)
  ▼
EmployeeManager.guardarEmpleado()
  ├─ Detecta cambio de turnoPrincipal
  └─► Llama: TurnoManager.generarTurnosEmpleado(empleado, diasEnMes)
        (O .generarTurnosEmpleadoConLocalidad() si tiene localidad)
  ▼
TurnoManager Lee: DepartamentosManager.obtenerDepartamento(empleado.departamento)
  ▼
Obtiene horasDiarias del depto → actualiza tiposTurno dinámicamente
  ▼
Genera 31 turnos con turno.horas = horasDiarias
  ▼
AppState.scheduleData.set(empleadoId, turnos)
  ▼
AppState.saveToStorage()
  ▼
UI.generarCuadranteGeneral()
```

---

### Punto 3: **Cambio de Estándares de Departamento → Regenerar TODO**

```
UI: Modal Gestionar Departamentos
  ▼
DepartmentManager.guardarDepartamento()
  ├─ Lee: depto_horasSemanales, depto_diasTrabajo, depto_horasDiarias
  └─► DepartamentosManager.actualizar(nombre, config)
  ▼
SistemaReactividad.emit('cambio-estandares-departamento', {
  nombreDepto: 'Limpieza',
  estandares: { horasSemanales: 39, diasTrabajo: 6, horasDiarias: 6.5 }
})
  ▼
Observer: "Para TODOS los empleados de Limpieza"
  ├─► Busca empleados en AppState/EmployeeManager
  ├─► Para cada uno:
  │   └─► GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito()
  └─► AppState.scheduleData actualizado
  ▼
UI.generarCuadranteGeneral()
```

---

## 📋 MÓDULOS Y RESPONSABILIDADES

| Módulo | Responsabilidad | Toca localStorage | Emite Eventos | Lee de |
|--------|-----------------|------------------|----------------|--------|
| **DepartamentosManager** | Gestionar deptos y estándares | ✅ | ✅ (cambio-estandares) | - |
| **EmployeeManager** | Gestionar empleados | ✅ | ✅ (cambio-depto) | DepartamentosManager |
| **TurnoManager** | Generar turnos | ✅ (AppState) | ❌ | DepartamentosManager |
| **GeneradorTurnosDepartamentos** | Generar turnos dinámicos (FASE 2) | ✅ (AppState) | ❌ | DepartamentosManager |
| **SistemaReactividad** | Propagar cambios | ❌ | ✅ (todos) | ❌ (solo escucha) |
| **UI** | Renderizar cuadrantes | ❌ | ❌ | AppState, empleados[] |
| **AppState** | Estado central | ✅ | ❌ | - |

---

## 🚫 REGLAS ARQUITECTÓNICAS

1. **Una sola fuente de verdad por entidad:**
   - Departamentos → `DepartamentosManager`
   - Empleados → `EmployeeManager`
   - Turnos → `AppState.scheduleData`

2. **No duplicar datos:**
   - ❌ NO guardar departamentos en `EmployeeManager`
   - ❌ NO guardar turnos en departamentos
   - ✅ Solo referencias (IDs, nombres normalizados)

3. **Cambios reactivos:**
   - Cualquier cambio en entrada → dispara evento en `SistemaReactividad`
   - Los observers manejan cascada de cambios
   - La UI se actualiza automáticamente

4. **Lectura dinámica de estándares:**
   - `TurnoManager` siempre lee de `DepartamentosManager`
   - Nunca cachear estándares en turnos
   - Si cambias estándares, turnos usan nuevos valores

5. **localStorage como persistencia:**
   - `departamentosData_fase2` - Departamentos
   - `empleadosData` - Empleados
   - `turnosAppState` - Turnos (AppState)
   - Sincronizar siempre después de cambios

---

## 🔄 FLUJOS PRINCIPALES

### Flujo A: Crear Empleado en Departamento Limpieza

```
1. EmployeeManager.guardarEmpleado()
   ├─ nombre: "Pedro"
   ├─ departamento: "Limpieza" (del dropdown de DepartamentosManager)
   └─ turnoPrincipal: "tarde"

2. Verificar: ¿Es nuevo?
   └─► Sí: Generar turnos iniciales

3. Generar turnos con:
   ├─ TurnoManager.generarTurnosEmpleado(empleado, diasEnMes)
   └─► Lee horasDiarias de DepartamentosManager → 6.5h

4. AppState.scheduleData.set(empleadoId, turnos)

5. UI.generarCuadranteGeneral() renderiza
   └─► Pedro aparece con turnos de 6.5h/día
```

### Flujo B: Cambiar Empleado de Operaciones a Limpieza

```
1. EmployeeManager.editarEmpleado(empleado_id=1)
   └─ Carga dropdown departamentos de DepartamentosManager

2. Usuario selecciona "Limpieza"

3. EmployeeManager.guardarEmpleado()
   ├─ Detecta: departamento anterior="Operaciones" → nuevo="Limpieza"
   └─► SistemaReactividad.emit('cambio-departamento-empleado', {...})

4. SistemaReactividad observer:
   ├─ Lee DepartamentosManager.obtenerDepartamento("Limpieza")
   ├─ Obtiene: { horasDiarias: 6.5, ... }
   └─► GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito(
        1, "Limpieza", {horasDiarias: 6.5, ...}, mes, año
      )

5. Turnos regenerados con 6.5h

6. UI.generarCuadranteGeneral()
   └─► Pedro ahora con 6.5h (no 8h)
```

### Flujo C: Cambiar Estándares de Limpieza (39h → 35h)

```
1. Modal "Gestionar Departamentos" abierto
   ├─ Lee de DepartamentosManager
   └─ Muestra: horasDiarias = 6.5, diasTrabajo = 6

2. Usuario edita: diasTrabajo = 5
   └─ horasDiarias debe recalcularse: 35÷5 = 7h

3. DepartmentManager.guardarDepartamento()
   └─► DepartamentosManager.actualizar("Limpieza", {
        horasSemanales: 35,
        diasTrabajo: 5,
        horasDiarias: 7
      })

4. SistemaReactividad.emit('cambio-estandares-departamento', {...})

5. Observer de SistemaReactividad:
   ├─ Busca todos empleados de Limpieza
   ├─ Para cada uno: GeneradorTurnosDepartamentos.generarTurnosEmpleadoDepartamentoExplicito(
        empleadoId, "Limpieza", {horasDiarias: 7, ...}
      )
   └─ AppState.scheduleData actualizado

6. Todos los empleados de Limpieza ahora con 7h/día

7. UI.generarCuadranteGeneral()
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Antes de implementar CUALQUIER cambio:

- [ ] ¿Afecta a departamentos? → Consultar este documento sección "Departamentos"
- [ ] ¿Afecta a empleados? → ¿Lees de DepartamentosManager para estándares?
- [ ] ¿Afecta a turnos? → ¿Usas GeneradorTurnosDepartamentos con parámetros explícitos?
- [ ] ¿Afecta a UI? → ¿Llamas UI.generarCuadranteGeneral()?
- [ ] ¿Hay cambios reactivos? → ¿Emites evento en SistemaReactividad?
- [ ] ¿Persistes datos? → ¿Llamaste AppState.saveToStorage() / guardarEnStorage()?
- [ ] ¿Documentaste el cambio? → ¿Actualizaste este documento?

---

## 📞 REFERENCIAS RÁPIDAS

**Para agregar nuevo departamento tipo:**
1. Ir a: `js/departamentos-manager.js`
2. Usar método: `DepartamentosManager.crear({nombre, horasSemanales, diasTrabajo, horasDiarias})`

**Para cambiar cómo se generan turnos:**
1. Ir a: `js/generador-turnos-departamentos.js`
2. Modificar: `generarTurnosEmpleadoDepartamentoExplicito()` (recibe horasDiarias explícitamente)

**Para debugear estándares:**
```javascript
// Consola
const depto = DepartamentosManager.obtenerDepartamento('limpieza');
console.log(depto); // Debe mostrar horasDiarias, diasTrabajo, etc
```

**Para debugear turnos:**
```javascript
// Consola
const turnos = AppState.scheduleData.get(empleadoId);
console.log(turnos.map(t => `Día ${t.dia}: ${t.turno} (${t.horas}h)`));
```

---

**Última Actualización**: 6 de Enero de 2026  
**Responsable**: Sistema de Gestión de Turnos v2.0

