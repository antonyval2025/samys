# Copilot Instructions - Sistema de Gestión de Turnos

## Descripción General

Este es un **aplicación web monolítica de una sola página (HTML/JS)** para gestionar cuadrantes mensuales de turnos. Todo el código está contenido en `nuevo_cuadrante_mejorado.html` (3830+ líneas).

**Arquitectura**: JavaScript vanilla con clases ES6, datos persistidos en `localStorage`, sin dependencias externas excepto `html2canvas` y `jsPDF` para exportación.

## Estructura Principal

### Estado Global (`AppState`)
Clase estática que centraliza todo el estado de la aplicación:
- `currentYear`, `currentMonth` - Mes/año seleccionado
- `scheduleData` - Map<empleadoId, Array<turnoDía>>
- `cambiosPendientes` - Cambios sin guardar (cola de cambios)
- `selectedEmployee` - Empleado actualmente visualizado en panel individual
- Métodos: `saveToStorage()`, `loadFromStorage()`, `aplicarCambiosPendientes()`

### Clases Principales

**`EmployeeManager`** - Gestión CRUD de empleados
- Modalidad: clic en "👥 Gestionar Empleados" abre formulario con lista
- Validaciones: nombre (3+ chars), email, teléfono, horas (0-240)
- Persiste en `localStorage.empleadosData`

**`TurnoManager`** - Generación y formateo de turnos
- `generarTurnosEmpleado()` - Genera 30+ días usando patrones rotativos
- Considera: estado del empleado (activo/vacaciones/baja), fines de semana aleatorios
- Tipos de turno: mañana/tarde/noche/mixto/descanso/vacaciones/baja/festivo/libre

**`TurnoEditor`** - Edición interactiva (modal de turno único o masiva)
- `abrirEditorTurno()` → Modal con 9 botones rápidos de turno
- `aplicarEdicionMasiva()` → Edita múltiples empleados/días simultáneamente
- Los cambios se agregan a `AppState.cambiosPendientes` (no inmediatos)

**`UI`** - Renderización de tablas y vistas
- `generarCuadranteGeneral()` - Tabla grande con todos empleados + días
- `generarCuadranteIndividual()` - Vista resumida de un empleado
- Actualiza dinámicamente sin refrescar página

**`ExportManager`** - Generación de PDFs, impresión, WhatsApp
- Métodos principales:
  - `exportarCuadranteGeneral(formato)` - Tabla completa (PDF/print)
  - `generarPDFIndividual()` - Turno individual con estadísticas
  - `enviarWhatsAppIndividual()` - URL codificada con datos del empleado
  - `exportarExcelIndividual()` - CSV con formato compatible Excel
- Usa `html2canvas` para convertir tabla HTML a imagen, `jsPDF` para PDFs
- Integración WhatsApp: construye URL `https://wa.me/{PHONE}?text={ENCODED_MSG}`

### Constantes Globales

```javascript
tiposTurno = {
  mañana: { horario: "08:00-16:00", color: "#d4edda", horas: 8 },
  tarde: { horario: "16:00-00:00", color: "#fff3cd", horas: 8 },
  noche: { horario: "00:00-08:00", color: "#f8d7da", horas: 8 },
  // ... más tipos
}

empleados[] // Array global, inicializado con 7 empleados de prueba
```

## Flujos Críticos

### 1. **Cambio de Mes**
`DateUtils.cambiarMes(±1)` → actualiza `AppState.currentMonth` → `TurnoManager.reiniciarDatos()` → regenera tabla

### 2. **Editar Turno Individual**
1. Usuario hace clic en celda turno → `TurnoEditor.abrirEditorTurno()`
2. Abre modal con 9 botones de turno + input de horas
3. Usuario selecciona turno → `cambiarTurnoRapido()` actualiza modal visualmente
4. Guarda → `guardarDescripcion()` → actualiza `AppState.scheduleData`

### 3. **Edición Masiva**
1. Selecciona empleados/días/turno actual/nuevo turno
2. Resumen dinámico predice cuántos turnos cambiarán
3. `aplicarEdicionMasiva()` agrega N cambios a `cambiosPendientes`
4. Usuario debe hacer clic en "💾 Guardar Cambios" → `aplicarCambiosPendientes()`

### 4. **Persistencia**
- **Automática**: `AppState.saveToStorage()` después de cada cambio
- **Carga**: `AppState.loadFromStorage()` al iniciar (evento `DOMContentLoaded`)
- Datos se guardan como JSON en `localStorage['turnosAppState']` y `localStorage['empleadosData']`

## Convenciones & Patrones

### Colores y Estilos
- Colores de turno en `tiposTurno[turno].color`
- Sistema de notificaciones: `NotificationSystem.show(msg, tipo)` → aparece arriba-derecha
- Modales: clase `.modal` + `classList.add/remove('active')`

### Nombres de IDs HTML
- `selectYear`, `selectMonth` - selectores de fecha
- `cuadranteGeneral`, `cuadranteIndividual` - contenedores de tablas
- `modal*` - modales (ej: `modalGestionEmpleados`, `modalEdicionMasiva`)
- `*Empleado` - campos de formulario de empleado

### Validaciones
- **Email**: regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Telefono**: mínimo 9 caracteres
- **Nombre**: mínimo 3 caracteres
- **Horas**: 0-240 (contrato), 0-24 (turno específico)

## Cómo Modificar

### Agregar Nuevo Tipo de Turno
1. Añade entrada en objeto `tiposTurno`
2. Actualiza CSS color en línea de estilos (`.mañana`, `.noche`, etc.)
3. Los dropdowns se llenan dinámicamente con `TurnoManager.obtenerOpcionesTurno()`

### Cambiar Patrón de Rotación
- En `TurnoManager.generarTurnosEmpleado()`, modifica objeto `patrones`
- Patrón actual: 5 días turno + 2 descanso (rota cada 7 días)

### Nueva Exportación o Integración
- Agregar método en `ExportManager` (clase no incluida en lectura pero referenciada)
- Para WhatsApp: construir URL `https://wa.me/PHONE?text=TEXT` codificado

## Debugging & Testing

### Inspeccionar Estado
```javascript
// En consola:
console.log(AppState.scheduleData) // Ver todos los turnos
console.log(AppState.cambiosPendientes) // Ver cambios sin guardar
console.log(empleados) // Ver lista de empleados
localStorage.getItem('turnosAppState') // Ver estado guardado
```

### Limpiar Datos
```javascript
localStorage.clear() // Resetea todo
location.reload() // Carga valores por defecto
```

### Problemas Comunes
- **Turnos no cambian**: Verificar `AppState.cambiosPendientes` no está vacío + hacer clic "Guardar"
- **Empleados desaparecen**: Revisar `localStorage.empleadosData`, puede estar corrompido
- **Tabla no se actualiza**: Llamar `UI.generarCuadranteGeneral()` manualmente

## Notas de Implementación

- **Sin frameworks**: Todo vanilla JS. Cambios = refrescar manualmente partes de UI
- **Monolítico**: Una sola línea de archivo HTML. Considera dividir si crece >5000 líneas
- **Accesibilidad**: Faltan `aria-labels`, `keyboard nav`. Mejora recomendada
- **Mobile**: Responsivo parcial (hay `@media` para <1200px pero tabla es muy ancha en móvil)

## Patrones de Extensión

### Agregar Nueva Funcionalidad
1. **Nueva clase**: Heredar patrón de `EmployeeManager` (métodos estáticos, interacción con `AppState`)
2. **Actualizar UI**: Nuevos botones/modales, llamar a método de la clase desde `onclick`
3. **Persistencia**: Siempre llamar `AppState.saveToStorage()` al final del cambio
4. **Notificaciones**: Usar `NotificationSystem.show()` para feedback visual

### Integración con ExportManager
```javascript
class ExportManager {
  static exportarCuadranteGeneral(formato) {
    const canvas = await html2canvas(document.getElementById('cuadranteGeneral'));
    if (formato === 'pdf') {
      const pdf = new jsPDF();
      pdf.addImage(canvas, 'PNG', 10, 10);
      pdf.save('cuadrante.pdf');
    }
  }
}
```

## Arquitectura de Datos

### `AppState.scheduleData` Map Structure
```javascript
Map {
  empleadoId: [
    { dia: 1, turno: "mañana", horas: 8, fecha: Date, esFinSemana: false },
    { dia: 2, turno: "tarde", horas: 8, fecha: Date, esFinSemana: false },
    // ... 30+ días
  ]
}
```

### `AppState.cambiosPendientes` Queue
```javascript
[
  { empleadoId: 1, dia: 5, nuevoTurno: "noche", timestamp: "2024-06-01T10:30:00Z" },
  // Cambios se aplican en batch con guardarCambios()
]
```

## Debugging Avanzado

### Inspeccionar Cambios Pendientes
```javascript
// Ver cola de cambios sin guardar
AppState.cambiosPendientes.forEach(c => {
  console.log(`${empleados.find(e=>e.id===c.empleadoId).nombre} - Día ${c.dia}: ${c.nuevoTurno}`)
})
```

### Verificar Consistencia de Datos
```javascript
// Validar que todos los empleados tienen turnos generados
empleados.forEach(emp => {
  const turnos = AppState.scheduleData.get(emp.id);
  console.assert(turnos?.length > 0, `Falta datos para ${emp.nombre}`);
})
```

### Simular Cambios Masivos
```javascript
// Generar N cambios para testing
for(let i=0; i<50; i++) {
  AppState.agregarCambio(1, Math.ceil(Math.random()*30), 'noche');
}
AppState.aplicarCambiosPendientes();
```

## Mejoras Implementadas (v8.0+)

✅ **Validaciones inteligentes**:
- `RestriccionesTurnos.validarCambioTurno()` - Máx 12 turnos noche, mín 2 descansos consecutivos
- `RestriccionesTurnos.detectarConflictos()` - Detecta incompatibilidades estado/turno
- `ValidadorTurnos.validarDistribucionTurnos()` - Análisis por empleado

✅ **Balanceo automático**:
- `BalanceadorTurnos.aplicarBalanceoAutomatico()` - Distribución equitativa
- `BalanceadorTurnos.calcularEquidad()` - Índice 0-1
- `BalanceadorTurnos.generarRecomendaciones()` - Sugerencias específicas

✅ **Sistema de permisos**:
- `AppState.userRole` - 'admin' | 'supervisor' | 'empleado'
- `AppState.canEditShifts()` - Control de edición
- `AppState.canDeleteEmployees()` - Control de eliminación
- `AppState.canViewReports()` - Control de reportes

✅ **Reportes avanzados**:
- `GeneradorReportes.generarReporteRotacion()` - Análisis de turnos
- `GeneradorReportes.generarReporteCumplimientoHoras()` - Validación horaria
- `GeneradorReportes.generarReporteTurnosNocturno()` - Distribución nocturna
- `GeneradorReportes.exportarReporteHTML()` - Exportación imprimible

✅ **Predicción de conflictos**:
- `PredictorConflictos.predecirConflictos()` - Alertas críticas y advertencias
- `SistemaAuditoria.registrarCambio()` - Historial completo de cambios

## Mejoras Futuras (Roadmap)

1. **Multi-local** - Gestionar múltiples empresas/departamentos
2. **Integración calendario** - Google Calendar/Outlook
3. **Notificaciones** - Email y push notifications
4. **Aplicación móvil** - React Native
5. **Base de datos en nube** - Firebase/Supabase
6. **Dashboard KPIs** - Visualización avanzada
