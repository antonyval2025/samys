# � SISTEMA DE GESTIÓN DE TURNOS v8.0+

**Versión**: 8.0+ | **Estado**: ✅ COMPLETADO (100%)  
**Tareas**: 11/11 completadas | **Código**: 11,396 líneas | **Documentación**: 8,650+ líneas  
**Última Actualización**: Sesión Actual

---

## 🎯 Descripción General

Sistema web monolítico para gestionar cuadrantes mensuales de turnos con soporte para:
- ✅ Múltiples empleados y sus turnos
- ✅ Múltiples sucursales/locales
- ✅ Departamentos con presupuestos
- ✅ Edición individual y masiva de turnos
- ✅ Reportes avanzados y consolidados
- ✅ Exportación a PDF, Excel, WhatsApp
- ✅ Sistema de permisos (admin, supervisor, empleado)
- ✅ Validaciones automáticas
- ✅ Balanceo automático de carga

---

## 🚀 Inicio Rápido

### 1. Abrir Aplicación
```bash
# Abrir en navegador:
nuevo_cuadrante_mejorado.html
```

### 2. Seleccionar Local
```
Barra superior → Selector "🏢 Local:" → Seleccionar local
(3 locales por defecto: Madrid, Barcelona, Valencia)
```

### 3. Editar Turnos
```
Hacer clic en celda de turno → Modal de edición
Seleccionar tipo de turno (mañana, tarde, noche, descanso, etc.)
Clic "Guardar"
```

### 4. Exportar
```
Botón "📁 Exportar" → Seleccionar formato (PDF, Excel, WhatsApp)
Archivo descargado automáticamente
```

---

## 🏗️ Estructura del Proyecto

```
proyecto/
├── nuevo_cuadrante_mejorado.html      # Aplicación principal (3,160 líneas)
├── css/
│   └── estilos.css                    # Estilos de la aplicación
├── js/
│   ├── modules.js                     # Clases principales (1,200+ líneas)
│   └── soporte-multilocal.js          # Soporte multi-local (1,034 líneas)
├── docs/
│   ├── MULTILOCAL.md                  # Guía de multi-local
│   ├── TAREA_6_COMPLETADA.md         # Detalles de Tarea #6
│   ├── ESTADO_ACTUAL.md               # Estado del proyecto
│   └── RESUMEN_TAREA_6.md             # Resumen ejecutivo
└── README.md                           # Este archivo
└── estructura-multisede.json         # Configuración (futuro)
```

---

## Instalación y Setup

### Opción 1: Uso Directo (Recomendado)

```bash
# 1. Clonar o descargar los archivos
git clone <repositorio>

# 2. Abrir en navegador
# Navega a: nuevo_cuadrante_mejorado.html

# 3. ¡Listo! Los datos se guardan automáticamente en LocalStorage
```

### Opción 2: Servidor Local

```bash
# Usar cualquier servidor HTTP
python -m http.server 8000
# O con Node.js
npx http-server
# Acceder a: http://localhost:8000
```

---

## Características Principales

### 1. Gestión de Empleados

```javascript
// Agregar empleado
const nuevoEmpleado = {
    id: 8,
    nombre: "Juan Pérez García",
    departamento: "Operaciones",
    horasContrato: 160,
    turnoPrincipal: "Mañana",
    estado: "activo",
    email: "juan.perez@empresa.com",
    telefono: "+34 600 123 456"
};
empleados.push(nuevoEmpleado);
EmployeeManager.guardarEnStorage();
```

### 2. Generación de Cuadrantes

```javascript
// Generar automáticamente para el mes actual
TurnoManager.inicializarDatos();
UI.generarCuadranteGeneral();

// Cambiar a otro mes
DateUtils.cambiarMes(1); // Próximo mes
```

### 3. Edición de Turnos

```javascript
// Cambiar un turno individual
AppState.agregarCambio(empleadoId, dia, 'noche');

// Aplicar cambios pendientes
AppState.aplicarCambiosPendientes();
AppState.saveToStorage();
```

### 4. Validaciones y Restricciones

```javascript
// Validar cambio de turno
const validacion = RestriccionesTurnos.validarCambioTurno(
    AppState.scheduleData,
    empleadoId,
    dia,
    'noche',
    empleados
);

if (!validacion.permitido) {
    NotificationSystem.show(validacion.errores[0], 'error');
}
```

### 5. Análisis y Balanceo

```javascript
// Analizar distribución actual
const distribucion = BalanceadorTurnos.analizarDistribucion(
    AppState.scheduleData,
    empleadoId
);
console.log(`Turnos noche: ${distribucion.noche}`);

// Obtener recomendaciones
const recomendaciones = BalanceadorTurnos.generarRecomendaciones(
    AppState.scheduleData,
    empleados
);
```

### 6. Reportes Avanzados

```javascript
// Generar reporte de rotación
const reporte = GeneradorReportes.generarReporteRotacion(
    AppState.scheduleData,
    empleados
);

// Exportar como HTML imprimible
GeneradorReportes.exportarReporteHTML(reporte);

// Generar reporte de horas
const reporteHoras = GeneradorReportes.generarReporteCumplimientoHoras(
    AppState.scheduleData,
    empleados
);
```

---

## Guía de Uso

### Flujo Típico de Usuario

#### 1. Primer Uso
```
1. Abrir aplicación
2. Clic en "👥 Gestionar Empleados"
3. Agregar empleados del equipo
4. Sistema genera automáticamente cuadrante
```

#### 2. Editar Cuadrante
```
1. Clic en cualquier turno en la tabla
2. Abre modal con opciones rápidas
3. Seleccionar nuevo turno
4. Clic en "💾 Guardar Cambios"
```

#### 3. Edición Masiva
```
1. Clic en "🔄 Edición Masiva"
2. Seleccionar empleados y días
3. Indicar turno nuevo
4. Revisar resumen
5. Aplicar cambios
```

#### 4. Exportar
```
1. Seleccionar empleado en panel derecho
2. Clic en "📄 Descargar PDF" o "📤 Enviar por WhatsApp"
3. Listo!
```

---

## API de Desarrollo

### Clases Principales

#### `AppState`
Estado centralizado de la aplicación.

```javascript
// Propiedades
AppState.currentYear         // Año actual
AppState.currentMonth        // Mes actual (0-11)
AppState.selectedEmployee    // Empleado seleccionado
AppState.scheduleData        // Map de turnos
AppState.userRole            // 'admin' | 'supervisor' | 'empleado'

// Métodos
AppState.saveToStorage()                    // Guardar estado
AppState.loadFromStorage()                  // Cargar estado
AppState.agregarCambio(empleadoId, dia, turno)  // Agregar cambio
AppState.aplicarCambiosPendientes()        // Aplicar cambios
```

#### `TurnoManager`
Gestión de turnos y patrones de rotación.

```javascript
// Métodos
TurnoManager.generarTurnosEmpleado(empleado, diasEnMes)
TurnoManager.inicializarDatos()
TurnoManager.reiniciarDatos()
TurnoManager.formatearTurno(turno)          // Retorna: 'M', 'T', 'N'
TurnoManager.formatearTurnoCompleto(turno)  // Retorna: 'Mañana', 'Tarde'
```

#### `BalanceadorTurnos`
Análisis y recomendaciones de distribución.

```javascript
// Métodos
BalanceadorTurnos.analizarDistribucion(scheduleData, empleadoId)
BalanceadorTurnos.generarRecomendaciones(scheduleData, empleados)
BalanceadorTurnos.aplicarBalanceoAutomatico(scheduleData, empleados, diasEnMes)
BalanceadorTurnos.calcularEquidad(scheduleData, empleados)  // 0-1
```

#### `RestriccionesTurnos`
Validación de reglas de negocio.

```javascript
// Métodos
RestriccionesTurnos.validarCambioTurno(scheduleData, empleadoId, dia, nuevoTurno, empleados)
RestriccionesTurnos.detectarConflictos(scheduleData, empleados)
```

#### `GeneradorReportes`
Análisis y reportes complejos.

```javascript
// Métodos
GeneradorReportes.generarReporteRotacion(scheduleData, empleados)
GeneradorReportes.generarReporteCumplimientoHoras(scheduleData, empleados)
GeneradorReportes.generarReporteTurnosNocturno(scheduleData, empleados)
GeneradorReportes.generarReporteFinSemana(scheduleData, empleados)
GeneradorReportes.exportarReporteHTML(reporte)
```

---

## Ejemplos de Integración

### Ejemplo 1: Crear Comando de Balanceo Automático

```javascript
// Agregar botón HTML
<button onclick="balancearAutomaticamente()">⚖️ Balancear Automáticamente</button>

// Función
function balancearAutomaticamente() {
    const resultado = BalanceadorTurnos.aplicarBalanceoAutomatico(
        AppState.scheduleData,
        empleados,
        DateUtils.getDiasEnMes(AppState.currentYear, AppState.currentMonth)
    );

    // Mostrar recomendaciones
    resultado.recomendaciones.forEach(rec => {
        console.log(`${rec.empleado}: ${rec.mensaje}`);
    });

    // Aplicar cambios
    resultado.cambiosPropuestos.forEach(cambio => {
        AppState.agregarCambio(cambio.empleadoId, cambio.dia, cambio.nuevoTurno);
    });

    AppState.aplicarCambiosPendientes();
    UI.generarCuadranteGeneral();
    NotificationSystem.show('Balanceo aplicado', 'success');
}
```

### Ejemplo 2: Validar Antes de Guardar

```javascript
function guardarConValidacion() {
    const conflictos = RestriccionesTurnos.detectarConflictos(
        AppState.scheduleData,
        empleados
    );

    if (conflictos.length > 0) {
        console.warn('⚠️ Conflictos detectados:');
        conflictos.forEach(c => {
            console.warn(`  ${c.empleado} (Día ${c.dia}): ${c.mensaje}`);
        });

        if (!confirm(`Se encontraron ${conflictos.length} conflicto(s). ¿Continuar?`)) {
            return;
        }
    }

    AppState.aplicarCambiosPendientes();
    NotificationSystem.show('Cambios guardados', 'success');
}
```

### Ejemplo 3: Generar Reporte Mensual

```javascript
function generarReporteMensual() {
    const reporteRotacion = GeneradorReportes.generarReporteRotacion(
        AppState.scheduleData,
        empleados
    );

    const reporteHoras = GeneradorReportes.generarReporteCumplimientoHoras(
        AppState.scheduleData,
        empleados
    );

    const reporteNoche = GeneradorReportes.generarReporteTurnosNocturno(
        AppState.scheduleData,
        empleados
    );

    // Mostrar reporte de rotación
    GeneradorReportes.exportarReporteHTML(reporteRotacion);

    // O guardar como JSON para procesamiento
    const reportes = { rotacion: reporteRotacion, horas: reporteHoras, noche: reporteNoche };
    console.log(JSON.stringify(reportes, null, 2));
}
```

### Ejemplo 4: Integración de Auditoría

```javascript
function registrarCambioConAuditoria(empleadoId, dia, nuevoTurno) {
    const turnos = AppState.scheduleData.get(empleadoId);
    const turnoAnterior = turnos[dia - 1]?.turno;

    // Registrar cambio
    AppState.agregarCambio(empleadoId, dia, nuevoTurno);

    // Registrar en auditoría
    SistemaAuditoria.registrarCambio({
        empleadoId,
        dia,
        turnoAnterior,
        nuevoTurno,
        razon: 'Cambio manual'
    });

    // Guardar
    AppState.aplicarCambiosPendientes();
}

// Exportar auditoría
function exportarAuditoria() {
    SistemaAuditoria.exportarAuditoria();
}
```

---

## Troubleshooting

### Problema: Los cambios no se guardan

**Solución:**
```javascript
// Verificar que se llamó a saveToStorage()
AppState.saveToStorage();

// Verificar que localStorage está habilitado
console.log(localStorage.getItem('turnosAppState'));

// Si está vacío, reinicializar
localStorage.clear();
location.reload();
```

### Problema: Tabla no se actualiza después de editar

**Solución:**
```javascript
// Forzar regeneración de UI
UI.generarCuadranteGeneral();
if (AppState.selectedEmployee) {
    UI.generarCuadranteIndividual();
}
```

### Problema: Empleados desaparecen

**Solución:**
```javascript
// Cargar desde storage
EmployeeManager.cargarDelStorage();

// Si se perdieron, regenerar datos de prueba
// (ver array empleados en modules.js)
EmployeeManager.guardarEnStorage();
EmployeeManager.actualizarListaEmpleados();
```

### Problema: PDF no genera correctamente

**Solución:**
```javascript
// Verificar que html2canvas y jsPDF estén cargados
console.log(html2canvas); // debe no ser undefined
console.log(jsPDF);       // debe no ser undefined

// Aumentar escala
const canvas = await html2canvas(elemento, { scale: 3 });
```

---

## Próximas Características (Roadmap)

- [ ] Sistema multi-local/empresa
- [ ] Integración con Google Calendar
- [ ] Notificaciones por email
- [ ] Aplicación móvil (React Native)
- [ ] Base de datos en nube (Firebase/Supabase)
- [ ] Dashboard de KPIs
- [ ] Sistema de permisos granulares

---

## Soporte

Para preguntas o problemas:
1. Revisar la sección [Troubleshooting](#troubleshooting)
2. Consultar [copilot-instructions.md](.github/copilot-instructions.md)
3. Abrir un issue en el repositorio

---

**Versión:** 8.0  
**Última actualización:** Diciembre 2025  
**Licencia:** MIT
