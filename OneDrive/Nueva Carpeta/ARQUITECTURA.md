# ESTRUCTURA DEL PROYECTO - Sistema de Gestión de Turnos

## 📁 Árbol de Archivos Completo

```
proyecto-turnos/
├── .github/
│   └── copilot-instructions.md          # Instrucciones para agentes IA
│
├── css/
│   └── estilos.css                      # 300+ líneas de CSS compilado
│
├── js/
│   ├── modules.js                       # Clases principales (AppState, TurnoManager, etc.)
│   ├── balanceo-y-restricciones.js      # Validaciones y balanceo inteligente
│   ├── reportes-y-prediccion.js         # Análisis y generador de reportes
│   ├── soporte-multilocal.js            # Gestión multi-empresa/sucursal
│   └── ejemplos-y-best-practices.js     # Ejemplos prácticos de uso
│
├── nuevo_cuadrante_mejorado.html        # Archivo principal (3830 líneas)
├── README.md                            # Documentación de usuario
└── ARQUITECTURA.md                      # Este archivo

```

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│             APLICACIÓN WEB (HTML/CSS/JS)            │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  MÓDULO ESTADO                      │
│  AppState - Centraliza estado de aplicación         │
│  - currentMonth, currentYear                        │
│  - scheduleData (Map<empleadoId, turnos[]>)         │
│  - cambiosPendientes (cola de cambios)              │
│  - userRole (admin/supervisor/empleado)             │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┬───────────────┬───────────────┐
        ↓               ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Empleados    │ │  Turnos      │ │  Validación  │ │  Reportes    │
│              │ │              │ │              │ │              │
│ • CRUD       │ │ • Generación │ │ • Restricc.  │ │ • Rotación   │
│ • Validación │ │ • Patrones   │ │ • Conflictos │ │ • Horas      │
│ • Storage    │ │ • Formateo   │ │ • Estado emp │ │ • Nocturnos  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        ↓               ↓               ↓               ↓
    EmployeeManager  TurnoManager  Restricciones    GeneradorRep.
                                   Turnos           
        ↓               ↓               ↓               ↓
┌─────────────────────────────────────────────────────┐
│                    UI LAYER                         │
│  - generarCuadranteGeneral()                        │
│  - generarCuadranteIndividual()                     │
│  - actualizarEstadisticas()                         │
│  - Renderización dinámica                           │
└─────────────────────────────────────────────────────┘
                        ↓
        ┌───────────────┬───────────────┐
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ localStorage │ │   PDF/Print  │ │  WhatsApp    │
│              │ │              │ │              │
│ Persistencia │ │ html2canvas  │ │ Compartir    │
│              │ │ jsPDF        │ │ Mensajes     │
└──────────────┘ └──────────────┘ └──────────────┘
```

## 📊 Flujo de Datos

```
Usuario abre aplicación
        ↓
AppState.loadFromStorage()
        ↓
TurnoManager.inicializarDatos()
        ↓
UI.generarCuadranteGeneral()
        ↓
Usuario edita turno (click)
        ↓
TurnoEditor.abrirEditorTurno()
        ↓
Modal muestra opciones
        ↓
Usuario selecciona turno
        ↓
RestriccionesTurnos.validarCambioTurno()
        ↓
├─ Validación falla → NotificationSystem.show(error)
│
└─ Validación OK → AppState.agregarCambio()
        ↓
Usuario hace clic en "Guardar"
        ↓
AppState.aplicarCambiosPendientes()
        ↓
SistemaAuditoria.registrarCambio()
        ↓
AppState.saveToStorage()
        ↓
UI.generarCuadranteGeneral() (actualizar tabla)
        ↓
NotificationSystem.show(success)
```

## 🔄 Ciclo de Cambios

```
cambios pendientes (cola)
        ↓
AppState.cambiosPendientes = [
    { empleadoId: 1, dia: 5, nuevoTurno: 'noche', timestamp: '...' },
    { empleadoId: 2, dia: 10, nuevoTurno: 'descanso', timestamp: '...' },
    ...
]
        ↓
Usuario hace clic "Guardar Cambios"
        ↓
AppState.aplicarCambiosPendientes()
        ├─ Para cada cambio:
        │  ├─ Buscar turno actual en scheduleData
        │  ├─ Actualizar turno
        │  └─ Actualizar horas
        │
        └─ Limpiar cambiosPendientes
        ↓
AppState.saveToStorage()
        ↓
Cambios guardados permanentemente
```

## 🎯 Casos de Uso Principales

### Caso 1: Crear Empleado
```
EmployeeManager.mostrarModalGestion()
    ↓ Usuario completa formulario
EmployeeManager.guardarEmpleado()
    ├─ ValidadorTurnos.validarEmpleado()
    ├─ empleados.push(nuevoEmpleado)
    ├─ TurnoManager.generarTurnosEmpleado()
    └─ UI.generarCuadranteGeneral()
```

### Caso 2: Editar Turno Individual
```
Usuario hace clic en turno
    ↓
TurnoEditor.abrirEditorTurno()
    ↓
Modal muestra opciones de turno
    ↓
Usuario selecciona turno
    ├─ RestriccionesTurnos.validarCambioTurno()
    ├─ SistemaAuditoria.registrarCambio()
    └─ AppState.agregarCambio()
    ↓
Usuario hace clic "Guardar"
    ├─ AppState.aplicarCambiosPendientes()
    └─ UI.generarCuadranteGeneral()
```

### Caso 3: Edición Masiva
```
Usuario abre modal "Edición Masiva"
    ↓
Selecciona empleados + días + turno nuevo
    ↓
TurnoEditor.actualizarResumenModal()
    (muestra preview de cambios)
    ↓
Usuario confirma
    ↓
TurnoEditor.aplicarEdicionMasiva()
    ├─ Para cada combinación seleccionada:
    │  └─ AppState.agregarCambio()
    │
    └─ AppState.aplicarCambiosPendientes()
    ↓
UI.generarCuadranteGeneral()
```

### Caso 4: Generar Reporte
```
Usuario abre "Generar Reportes"
    ↓
GeneradorReportes.generarReporteRotacion()
    ├─ Analiza todos los turnos
    └─ Calcula estadísticas por empleado
    ↓
GeneradorReportes.generarReporteCumplimientoHoras()
    ├─ Compara horas asignadas vs contratadas
    └─ Identifica incumplimientos
    ↓
GeneradorReportes.exportarReporteHTML()
    ├─ Genera HTML formateado
    ├─ Abre ventana de impresión
    └─ Usuario imprime o descarga PDF
```

## 🔐 Sistema de Permisos

```
Roles:
├─ ADMIN (acceso total)
│  ├─ Ver/editar todos los turnos
│  ├─ Crear/eliminar empleados
│  ├─ Acceder a reportes
│  └─ Ver auditoría completa
│
├─ SUPERVISOR (lectura + algunos cambios)
│  ├─ Ver todos los turnos
│  ├─ Editar turnos (con restricciones)
│  ├─ Ver reportes
│  └─ NO puede eliminar empleados
│
└─ EMPLEADO (lectura de su cuadrante)
   ├─ Ver solo su cuadrante
   ├─ Ver solo su información
   └─ No puede editar
```

## 📈 Validaciones y Restricciones

```
Cuando se intenta cambiar un turno:

RestriccionesTurnos.validarCambioTurno()
    ├─ ✓ Validar: máx 12 turnos noche/mes
    ├─ ✓ Validar: mín 2 días descanso consecutivos c/7 días
    ├─ ✓ Validar: no >6 días seguidos de trabajo
    ├─ ✓ Validar: compatibilidad con estado (baja, vacaciones)
    ├─ ✓ Validar: no duplicar cambios pendientes
    │
    └─ Retorna:
        {
            permitido: true/false,
            advertencias: [...],
            errores: [...]
        }
```

## 🎨 Stack Tecnológico

```
Frontend:
├─ HTML5 (estructura semántica)
├─ CSS3 (diseño responsivo)
│  └─ Gradientes, flexbox, grid
├─ JavaScript ES6+ (lógica)
│  ├─ Clases (OOP)
│  ├─ Map/Set (estructuras eficientes)
│  ├─ Async/await (si es necesario)
│  └─ Template literals
│
Librerías Externas:
├─ html2canvas (captura de pantalla)
├─ jsPDF (generación de PDFs)
│
Almacenamiento:
├─ localStorage (datos persistentes)
│  ├─ turnosAppState
│  ├─ empleadosData
│  ├─ auditoria
│  └─ localesData
│
Navegador APIs:
├─ LocalStorage API
├─ Clipboard API
├─ Canvas API
└─ Blob/URL APIs
```

## 🚀 Rendimiento y Optimización

```
Optimizaciones Actuales:
├─ Uso de Map para scheduleData (O(1) lookup)
├─ Lazy rendering (genera UI solo cuando cambia)
├─ Caché de cálculos frecuentes
├─ Delegación de eventos (solo 1 listener)
├─ Compresión de datos en localStorage
│
Potenciales Mejoras:
├─ Web Workers para cálculos pesados
├─ Service Workers para offline
├─ Indexing para búsquedas rápidas
├─ Virtualización de listas largas
└─ Lazy loading de reportes
```

## 📝 Patrones de Código

```
Patrón 1: Clase Estática (State Management)
class AppState {
    static property = value;
    static method() { ... }
}

Patrón 2: Singleton (Gestión única)
class TurnoManager {
    static inicializarDatos() { ... }
    static reiniciarDatos() { ... }
}

Patrón 3: Builder (Configuración compleja)
const local = GestorLocales.crearLocal({
    nombre: '...',
    ciudad: '...',
    reglas: { ... }
});

Patrón 4: Strategy (Diferentes algoritmos)
RestriccionesTurnos.validarCambioTurno() // Usa distintas estrategias
BalanceadorTurnos.aplicarBalanceoAutomatico() // Otro algoritmo
```

## 🔗 Integraciones

```
Salida de Datos:
├─ PDF (html2canvas + jsPDF)
├─ CSV/Excel (generación de strings CSV)
├─ HTML (generación para impresión)
├─ WhatsApp (URL con encodificación)
└─ JSON (para integración externa)

Entrada de Datos:
├─ Formulario HTML
├─ localStorage (persistencia)
└─ Importación (futuro)

APIs Externas (Futuro):
├─ Google Calendar API
├─ Gmail API (notificaciones)
├─ Firebase (base de datos)
└─ Twilio (SMS)
```

## 🎓 Guía de Contribución

Para agregar nueva funcionalidad:

```
1. Crear clase en módulo JS apropiado
2. Seguir patrón estático si es gestor
3. Usar AppState para persistencia
4. Validar con NotificationSystem
5. Registrar en SistemaAuditoria si aplica
6. Actualizar UI con UI.generarCuadrante...()
7. Documentar método en README.md
```

---

**Última actualización:** Diciembre 2025  
**Versión:** 8.0+  
**Status:** Producción (con mejoras continuas)
