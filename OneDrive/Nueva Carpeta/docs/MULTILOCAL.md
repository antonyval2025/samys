# Sistema de Gestión Multi-Local/Empresa
**Versión 8.0+ | Soporte para múltiples sucursales, departamentos y consolidación de reportes**

---

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Componentes Principales](#componentes-principales)
3. [Uso de la Interfaz](#uso-de-la-interfaz)
4. [Arquitectura de Datos](#arquitectura-de-datos)
5. [API de Programación](#api-de-programación)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Consolidación de Reportes](#consolidación-de-reportes)

---

## Descripción General

El módulo **Soporte Multi-Local** permite gestionar turnos y empleados en múltiples sucursales de una empresa, cada una con:
- ✅ Horarios operativos propios
- ✅ Reglas de turnos independientes
- ✅ Departamentos con presupuestos de horas
- ✅ Empleados asignados a locales específicos
- ✅ Reportes consolidados y comparativos

### Características Principales
- **GestorLocales**: Crear, editar, eliminar sucursales
- **GestorDepartamentos**: Gestionar departamentos con presupuesto de horas
- **ConsolidadorReportes**: Consolidar reportes de múltiples locales
- **Persistencia**: Todo guardado en localStorage

---

## Componentes Principales

### 1. GestorLocales
Gestiona el ciclo de vida completo de locales/sucursales.

#### Propiedades Estáticas
```javascript
GestorLocales.locales[];          // Array de objetos local
GestorLocales.localActualId;      // ID del local actual (ej: "local-madrid")
```

#### Estructura de un Local
```javascript
{
    id: "local-madrid",
    nombre: "Madrid Centro",
    ciudad: "Madrid",
    pais: "España",
    horarios: { inicio: "08:00", fin: "20:00" },
    diasOperativos: [1, 2, 3, 4, 5, 6],  // Lun-Sáb (0=Dom, 6=Sáb)
    reglas: {
        maxTurnosNoche: 12,
        minDescansos: 2,
        maxDiasSeguidos: 6,
        horasPromedio: 40
    },
    departamentos: [],
    empleados: [],  // Array de IDs de empleados
    creado: "2024-01-01T10:30:00Z",
    activo: true
}
```

#### Métodos Disponibles
| Método | Descripción |
|--------|-------------|
| `inicializarLocales()` | Cargar locales desde localStorage o crear por defecto |
| `cambiarLocalActual(localId)` | Cambiar el local actualmente visualizado |
| `crearLocal(config)` | Crear nueva sucursal |
| `actualizarLocal(localId, actualizaciones)` | Modificar local |
| `eliminarLocal(localId)` | Eliminar sucursal |
| `obtenerLocalActual()` | Obtener objeto local actual |
| `agregarEmpleadoALocal(localId, empleado)` | Asignar empleado a local |
| `obtenerEmpleadosDelLocal(localId)` | Listar empleados del local |
| `guardarLocales()` | Persistir en localStorage |

### 2. GestorDepartamentos
Gestiona departamentos dentro de locales.

#### Estructura de un Departamento
```javascript
{
    id: "dept-1234567890",
    nombre: "Ventas",
    presupuestoHoras: 160,  // Horas/mes
    empleados: [],
    creado: "2024-01-01T10:30:00Z"
}
```

#### Métodos Disponibles
| Método | Descripción |
|--------|-------------|
| `crearDepartamento(localId, config)` | Crear departamento |
| `obtenerDepartamentosLocal(localId)` | Listar departamentos |
| `validarPresupuestoHoras(deptoId, horasUtilizadas)` | Validar presupuesto |
| `eliminarDepartamento(localId, deptId)` | Eliminar departamento |

### 3. ConsolidadorReportes
Genera reportes consolidados de múltiples locales.

#### Métodos Disponibles
| Método | Descripción |
|--------|-------------|
| `consolidarReportesRotacion(localesIds)` | Consolidar reportes de rotación |
| `analizarComparativoLocales()` | Comparar métricas entre locales |
| `exportarReportesConsolidadosHTML()` | Exportar a HTML imprimible |

---

## Uso de la Interfaz

### 1. Selector de Locales
Ubicado en la barra superior (parte izquierda del selector de fechas):

```html
<select id="selectLocal" onchange="GestorLocales.cambiarLocalActual(this.value)">
    <option value="">-- Seleccionar Local --</option>
    <option value="local-madrid">🏢 Madrid Centro (Madrid)</option>
    <option value="local-barcelona">🏢 Barcelona (Barcelona)</option>
    <option value="local-valencia">🏢 Valencia (Valencia)</option>
</select>
```

**Uso**: Selecciona un local para cambiar automáticamente la vista y datos mostrados.

### 2. Botón "🏢 Gestionar Locales"
Abre modal para:
- ✅ Crear nuevos locales
- ✅ Ver lista de locales existentes
- ✅ Cambiar local actual
- ✅ Eliminar locales

### 3. Botón "📂 Gestionar Departamentos"
Abre modal para:
- ✅ Crear departamentos en local actual
- ✅ Ver departamentos existentes
- ✅ Definir presupuesto de horas
- ✅ Eliminar departamentos

---

## Arquitectura de Datos

### Almacenamiento en localStorage
```javascript
// Locales y departamentos
localStorage['localesData'] = JSON.stringify(GestorLocales.locales);

// Turnos generales (ya existía)
localStorage['turnosAppState'] = JSON.stringify(AppState.scheduleData);

// Empleados
localStorage['empleadosData'] = JSON.stringify(empleados);
```

### Integración con AppState
```javascript
AppState.currentLocalId;      // ID del local actual (nuevo)
AppState.scheduleData;         // Turnos comunes (todos los locales)
AppState.empleadosActuales;   // Empleados del local (opcional)
```

---

## API de Programación

### Crear un Local Programáticamente
```javascript
const nuevoLocal = GestorLocales.crearLocal({
    nombre: "Valencia",
    ciudad: "Valencia",
    ciudad: "Valencia",
    horarios: { inicio: "07:00", fin: "19:00" },
    diasOperativos: [1, 2, 3, 4, 5],
    reglas: {
        maxTurnosNoche: 8,
        minDescansos: 2,
        maxDiasSeguidos: 5,
        horasPromedio: 35
    }
});
```

### Cambiar Local Actual
```javascript
GestorLocales.cambiarLocalActual('local-madrid');
// Resultado: Cambio de local + actualización UI + recarga de turnos
```

### Agregar Empleado a Local
```javascript
const empleado = empleados[0];  // Obtener empleado existente
GestorLocales.agregarEmpleadoALocal('local-madrid', empleado);
```

### Crear Departamento
```javascript
const nuevoDepto = GestorDepartamentos.crearDepartamento(
    'local-madrid',  // localId
    {
        nombre: "Ventas",
        presupuestoHoras: 160
    }
);
```

### Validar Presupuesto de Horas
```javascript
const validacion = GestorDepartamentos.validarPresupuestoHoras(
    'dept-123456',  // deptoId
    120              // horas utilizadas
);

console.log(validacion);
// { 
//   valido: true, 
//   presupuestoTotal: 160, 
//   horasUtilizadas: 120, 
//   horasDisponibles: 40 
// }
```

### Consolidar Reportes
```javascript
const reporte = ConsolidadorReportes.consolidarReportesRotacion(
    ['local-madrid', 'local-barcelona']  // Array de localIds (opcional)
);
```

### Analizar Comparativo
```javascript
const comparativo = ConsolidadorReportes.analizarComparativoLocales();
// {
//   "Madrid Centro": {
//       ciudad: "Madrid",
//       totalEmpleados: 8,
//       horasPromedio: 45.3,
//       turnosNochePromedio: 2.1,
//       equidad: 0.87
//   },
//   "Barcelona": { ... },
//   ...
// }
```

---

## Ejemplos de Uso

### Ejemplo 1: Crear Sistema Multi-Local Desde Cero
```javascript
// Paso 1: Inicializar
GestorLocales.inicializarLocales();  // Carga 3 locales por defecto

// Paso 2: Crear local adicional
GestorLocales.crearLocal({
    nombre: "Bilbao",
    ciudad: "Bilbao",
    horarios: { inicio: "08:00", fin: "18:00" },
    diasOperativos: [1, 2, 3, 4, 5, 6]
});

// Paso 3: Cambiar a nuevo local
GestorLocales.cambiarLocalActual('local-1234567890');

// Paso 4: Crear departamentos
GestorDepartamentos.crearDepartamento(GestorLocales.localActualId, {
    nombre: "Recepción",
    presupuestoHoras: 160
});

GestorDepartamentos.crearDepartamento(GestorLocales.localActualId, {
    nombre: "Administración",
    presupuestoHoras: 80
});

console.log("✅ Sistema multi-local configurado");
```

### Ejemplo 2: Obtener Empleados de un Local
```javascript
const empleadosMadrid = GestorLocales.obtenerEmpleadosDelLocal('local-madrid');
console.log(`Madrid tiene ${empleadosMadrid.length} empleados`);

empleadosMadrid.forEach(emp => {
    console.log(`- ${emp.nombre}: ${emp.email}`);
});
```

### Ejemplo 3: Cambiar Entre Locales en Loop
```javascript
const generarReportePorLocal = () => {
    GestorLocales.locales.forEach(local => {
        GestorLocales.cambiarLocalActual(local.id);
        
        const reporte = GeneradorReportes.generarReporteRotacion(
            AppState.scheduleData,
            GestorLocales.obtenerEmpleadosDelLocal(local.id)
        );
        
        console.log(`${local.nombre}: ${reporte.empleados.length} empleados`);
    });
};

generarReportePorLocal();
```

### Ejemplo 4: Validar Presupuesto Mensual
```javascript
const validarPresupuestoGlobal = () => {
    let presupuestoTotal = 0;
    let horasUsadas = 0;

    GestorLocales.locales.forEach(local => {
        const deptos = GestorDepartamentos.obtenerDepartamentosLocal(local.id);
        
        deptos.forEach(depto => {
            presupuestoTotal += depto.presupuestoHoras;
        });
    });

    // Sumar horas utilizadas
    AppState.scheduleData.forEach((turnos, empleadoId) => {
        turnos.forEach(turno => {
            horasUsadas += turno.horas || 0;
        });
    });

    console.log(`Presupuesto total: ${presupuestoTotal} horas`);
    console.log(`Horas usadas: ${horasUsadas} horas`);
    console.log(`Disponible: ${presupuestoTotal - horasUsadas} horas`);
};

validarPresupuestoGlobal();
```

---

## Consolidación de Reportes

### Generar Reporte Consolidado
```javascript
const reporte = ConsolidadorReportes.consolidarReportesRotacion();

console.log(`📊 Resumen Global:`);
console.log(`   Total de locales: ${reporte.resumenGlobal.totalLocales}`);
console.log(`   Total de empleados: ${reporte.resumenGlobal.totalEmpleados}`);
console.log(`   Horas totales: ${reporte.resumenGlobal.totalHoras}`);
console.log(`   Turnos noche totales: ${reporte.resumenGlobal.totalTurnosNoche}`);
```

### Exportar Reporte a HTML
```javascript
// Abre ventana de impresión con reporte consolidado
ConsolidadorReportes.exportarReportesConsolidadosHTML();

// También abre automáticamente el diálogo print (Ctrl+P)
```

### Comparar Equidad Entre Locales
```javascript
const comparativo = ConsolidadorReportes.analizarComparativoLocales();

console.log("📈 Análisis de Equidad:");
Object.entries(comparativo.locales).forEach(([nombre, datos]) => {
    const equidadPct = (datos.equidad * 100).toFixed(1);
    console.log(`${nombre}: ${equidadPct}% equidad`);
});
```

---

## Mejores Prácticas

### ✅ HACER
```javascript
// Siempre obtener el local actual antes de operaciones
const localActual = GestorLocales.obtenerLocalActual();

// Validar presupuesto antes de asignar horas
const validacion = GestorDepartamentos.validarPresupuestoHoras(deptoId, horas);
if (!validacion.valido) {
    console.warn("⚠️ Presupuesto insuficiente");
}

// Guardar después de cambios
GestorLocales.guardarLocales();
```

### ❌ NO HACER
```javascript
// No acceder directamente a propiedades sin validar
console.log(GestorLocales.locales[0].nombre);  // ❌ Puede no existir

// No confiar solo en localStorage sin verificación
const datos = JSON.parse(localStorage.getItem('localesData'));  // ❌ Puede estar corrupto

// No cambiar localActualId sin usar cambiarLocalActual()
GestorLocales.localActualId = 'local-madrid';  // ❌ No actualiza UI ni persistencia
```

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Selector de locales vacío | Llamar `GestorLocales.inicializarLocales()` en consola |
| Cambio de local no actualiza UI | Verificar que `AppState` esté actualizado y llamar `TurnoManager.reiniciarDatos()` |
| Datos de locales se pierden | Comprobar localStorage en DevTools (F12 → Application → Local Storage) |
| Departamentos no aparecen | Asegurarse que el local tiene departamentos creados (array no vacío) |

---

## Roadmap Futuro

🔮 **Próximas mejoras planeadas:**
- Multi-idioma por local
- Zona horaria independiente por local
- Historial de cambios de local
- Sincronización en tiempo real (WebSockets)
- Integración con APIs de recursos humanos
- Dashboard de KPIs por local

---

**Última actualización**: 2024 | **Versión**: 8.0+
