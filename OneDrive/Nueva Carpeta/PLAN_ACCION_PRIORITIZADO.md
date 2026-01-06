# 📅 PLAN DE ACCIÓN PRIORITIZADO - Hoja de Ruta de Implementación

---

## 🎯 OBJETIVOS

- **Plazo Total**: 8-10 semanas
- **Equipos Requeridos**: 1 Lead Dev + 2 Dev Mid-Level + 1 QA
- **Inversión**: ~400-500 horas de desarrollo
- **ROI**: Escalabilidad a 1000+ empleados, reducción de errores 90%

---

## 📊 MATRIZ DE PRIORIDAD

| Prioridad | Impacto | Esfuerzo | Riesgo | Tarea |
|-----------|---------|----------|--------|-------|
| 🔴 **P1** | Alto | Bajo | Alto | Autoguardado + Validación |
| 🔴 **P1** | Alto | Bajo | Medio | Sincronización entre pestañas |
| 🔴 **P1** | Alto | Medio | Alto | Refactorizar AppState |
| 🟠 **P2** | Alto | Medio | Medio | Patrón Event Bus |
| 🟠 **P2** | Medio | Medio | Bajo | Separar módulos JavaScript |
| 🟡 **P3** | Medio | Alto | Bajo | Virtualización tabla |
| 🟡 **P3** | Medio | Bajo | Bajo | Responsive design |
| 🟢 **P4** | Bajo | Alto | Bajo | Sidebar navigation |
| 🟢 **P4** | Bajo | Muy Alto | Bajo | Multi-local support |

---

## FASE 1: CORRECCIONES CRÍTICAS (Semanas 1-2)
**Objetivo**: Hacer aplicación estable y confiable

### Semana 1: Validación + Autoguardado

#### Tarea 1.1: Implementar `ValidadorDatos` ⏱️ 8 horas
**Responsable**: Dev 1  
**Descripción**: Crear clase centralizada `ValidadorDatos` con métodos:
- `validarEmpleado()`
- `validarTurno()`
- `validarDNI()`
- `validarEmail()`
- `validarRestriccionesTurno()`

**Checklist**:
- [ ] Archivo `js/modules/validadores.js` creado
- [ ] Todos los métodos implementados
- [ ] 15+ test cases creados
- [ ] Integración con `EmployeeManager.guardarEmpleado()`
- [ ] Notificaciones de error funcionales
- [ ] Commit: `feat: validación centralizada de datos`

**Criterio de Aceptación**:
```javascript
// Debe rechazar datos inválidos
ValidadorDatos.validarEmpleado({ nombre: 'A' }).valido === false;
ValidadorDatos.validarEmpleado({ email: 'invalido' }).valido === false;
ValidadorDatos.validarDNI('12345678Z').valido === true; // Valid Spanish DNI
```

---

#### Tarea 1.2: Implementar Autoguardado ⏱️ 6 horas
**Responsable**: Dev 1  
**Descripción**: Crear clase `AutoSaveManager` que:
- Guarde cada 30 segundos si hay cambios
- Advierta antes de cerrar si hay cambios sin guardar
- Recupere estado si hay crash del navegador
- Muestre notificación de "guardando"

**Checklist**:
- [ ] Archivo `js/modules/auto-save.js` creado
- [ ] Sistema de debounce implementado
- [ ] Event listener `beforeunload` funcional
- [ ] Notificaciones visuales en UI
- [ ] localStorage recovery funcional
- [ ] Pruebas manuales completadas
- [ ] Commit: `feat: autoguardado automático cada 30s`

**Criterio de Aceptación**:
```javascript
// Cambio debe guardarse automáticamente
AppState.cambiosPendientes.push({ /* cambio */ });
// Esperar 35 segundos
localStorage.getItem('turnosAppState').includes(/* cambio */); // true
```

---

#### Tarea 1.3: Sincronización Entre Pestañas ⏱️ 4 horas
**Responsable**: Dev 2  
**Descripción**: Implementar escucha del evento `storage` de localStorage

**Checklist**:
- [ ] Archivo `js/modules/tab-sync.js` creado
- [ ] Event listener en `window.addEventListener('storage')`
- [ ] UI se actualiza automáticamente cuando otra pestaña cambia datos
- [ ] Notificación visual de "actualizado desde otra pestaña"
- [ ] Pruebas con 2+ pestañas simultáneas
- [ ] Commit: `feat: sincronización en tiempo real entre pestañas`

**Criterio de Aceptación**:
```javascript
// Abrir app en 2 pestañas (A y B)
// En A: cambiar turno y guardar
// En B: debe ver cambio automáticamente sin refresh
```

---

### Semana 2: Refactorización AppState

#### Tarea 2.1: Nueva Clase AppState con Métodos Seguros ⏱️ 10 horas
**Responsable**: Dev 1 + Dev 2  
**Descripción**: Refactorizar AppState con:
- Propiedades privadas (`#`)
- Métodos públicos seguros (`setTurno`, `setMes`, `eliminarEmpleado`)
- Sistema de auditoría incluido
- Validación antes de modificar

**Checklist**:
- [ ] Archivo `js/modules/app-state-v2.js` creado (versión 2)
- [ ] Todas las propiedades son `#private`
- [ ] Métodos `set*` validan con `ValidadorDatos`
- [ ] Sistema de auditoría registra TODO cambio
- [ ] Mantiene compatibilidad con código existente
- [ ] localStorage versionado a v2
- [ ] 20+ test cases
- [ ] Commit: `refactor: AppState con métodos seguros y auditoría`

**Criterio de Aceptación**:
```javascript
// No permitir acceso directo
AppState.#scheduleData // Error: private field
AppState.scheduleData.set(...) // OK: acceso a través de getter

// Validación automática
AppState.setTurno(1, 5, 'invalid'); // Error: tipo de turno inválido
AppState.setTurno(1, 5, 'noche'); // OK si es válido

// Auditoría
AppState.auditLog[0].tipo === 'TURNO_MODIFICADO'; // true
```

---

#### Tarea 2.2: Integración de Validador en AppState ⏱️ 6 horas
**Responsable**: Dev 1  
**Descripción**: Asegurar que TODOS los cambios pasen por validación

**Checklist**:
- [ ] `setTurno()` valida antes de modificar
- [ ] `setMes()` valida rango válido
- [ ] `eliminarEmpleado()` requiere permisos
- [ ] Todos los errores lanzan excepciones claras
- [ ] Tests de restricciones de noche (máx 12)
- [ ] Tests de 3+ noches seguidas (rechazadas)
- [ ] Commit: `refactor: integración de validación en AppState`

---

## FASE 2: ARQUITECTURA Y PATRONES (Semanas 3-4)
**Objetivo**: Hacer código mantenible y escalable

### Semana 3: Patrón Event Bus

#### Tarea 3.1: Implementar Event Bus ⏱️ 6 horas
**Responsable**: Dev 2  
**Descripción**: Crear `EventBus` centralizado con métodos `subscribe()` y `publish()`

**Checklist**:
- [ ] Archivo `js/modules/event-bus.js` creado
- [ ] Métodos `subscribe(event, callback)` y `publish(event, data)` funcionando
- [ ] Sistema de `unsubscribe` incluido
- [ ] Manejo de errores en callbacks
- [ ] Definición de evento estándar en `EVENTOS` constante
- [ ] 10+ test cases
- [ ] Commit: `feat: implementar patrón Event Bus`

**Eventos a Definir**:
```javascript
EVENTOS = {
    EMPLEADO_CREADO: 'empleado:creado',
    EMPLEADO_ACTUALIZADO: 'empleado:actualizado',
    EMPLEADO_ELIMINADO: 'empleado:eliminado',
    TURNO_CAMBIADO: 'turno:cambiado',
    TURNOS_APLICADOS: 'turnos:aplicados',
    MES_CAMBIADO: 'mes:cambiado',
    CUADRANTE_ACTUALIZAR: 'ui:cuadrante-actualizar',
    MODAL_CERRAR: 'ui:modal-cerrar',
    CAMBIOS_PENDIENTES: 'estado:cambios-pendientes',
    GUARDADO_COMPLETADO: 'estado:guardado',
}
```

---

#### Tarea 3.2: Refactorizar TurnoEditor Usando Event Bus ⏱️ 8 horas
**Responsable**: Dev 1  
**Descripción**: Cambiar TurnoEditor para publicar eventos en lugar de modificar UI directamente

**Checklist**:
- [ ] `guardarDescripcion()` publica `TURNO_CAMBIADO`
- [ ] Modal se cierra automáticamente tras evento
- [ ] UI se actualiza automáticamente al evento
- [ ] Validación ocurre ANTES de publicar
- [ ] Tests con múltiples listeners
- [ ] Commit: `refactor: TurnoEditor usa EventBus`

**Antes**:
```javascript
// ❌ Acoplamiento fuerte
TurnoEditor.guardarDescripcion() {
    AppState.setTurno(...);
    document.getElementById('modalEdicion').classList.remove('active');
    UI.generarCuadranteGeneral(); // Recarga TODO
}
```

**Después**:
```javascript
// ✅ Desacoplamiento
TurnoEditor.guardarDescripcion() {
    AppState.setTurno(...); // Ya publica evento internamente
    // Modal y UI se actualizan automáticamente
}

// UI escucha evento
EventBus.subscribe(EVENTOS.TURNO_CAMBIADO, (data) => {
    UI.actualizarFilaEmpleado(data.empleadoId); // Solo actualiza lo necesario
});
```

---

#### Tarea 3.3: Refactorizar Otros Managers Usando Event Bus ⏱️ 6 horas
**Responsable**: Dev 2  
**Descripción**: Aplicar mismo patrón a EmployeeManager, DateUtils, etc.

**Checklist**:
- [ ] `EmployeeManager.guardarEmpleado()` publica `EMPLEADO_CREADO/ACTUALIZADO`
- [ ] `EmployeeManager.eliminarEmpleado()` publica `EMPLEADO_ELIMINADO`
- [ ] `DateUtils.cambiarMes()` publica `MES_CAMBIADO`
- [ ] Todos publican eventos válidos
- [ ] UI se actualiza de forma reactiva
- [ ] Commit: `refactor: todos los managers usan EventBus`

---

### Semana 4: Separación de Módulos

#### Tarea 4.1: Dividir modules.js en Módulos Separados ⏱️ 10 horas
**Responsable**: Dev 1 + Dev 2  
**Descripción**: Extraer cada clase a su propio archivo

**Estructura Target**:
```
js/modules/
├── app-state.js          (AppState v2)
├── event-bus.js          (EventBus)
├── validadores.js        (ValidadorDatos)
├── auto-save.js          (AutoSaveManager)
├── tab-sync.js           (TabSyncManager)
├── empleados.js          (EmployeeManager)
├── turnos.js             (TurnoManager)
├── turno-editor.js       (TurnoEditor)
├── ui.js                 (UI)
├── export.js             (ExportManager)
└── index.js              (Exports centralizados)
```

**Checklist**:
- [ ] 10 nuevos archivos creados
- [ ] Cada archivo exporta su clase principal
- [ ] `index.js` centraliza todos los exports
- [ ] main HTML importa solo `index.js`
- [ ] Sin cambios funcionales (misma behavior)
- [ ] Carga 50% más rápida (modular)
- [ ] Pruebas funcionales pasan
- [ ] Commit: `refactor: dividir modules.js en módulos separados`

---

#### Tarea 4.2: Crear archivo CSS Modular ⏱️ 6 horas
**Responsable**: Dev 2  
**Descripción**: Dividir `estilos_pastel4.css` en módulos temáticos

**Estructura Target**:
```
css/
├── base.css          (reset, variables, base)
├── layout.css        (flex, grid, responsivo)
├── tables.css        (tabla de turnos, estilos celda)
├── modales.css       (modales, dialogos)
├── botones.css       (buttons, controles)
├── notificaciones.css (toast, notificaciones)
├── tema.css          (colores, tema oscuro)
└── index.css         (importa todos)
```

**Checklist**:
- [ ] 8 archivos CSS creados
- [ ] Variables CSS centralizadas en `base.css`
- [ ] Sin duplicados de estilos
- [ ] 70% menos `!important` (migrar a especificidad real)
- [ ] Tema visual idéntico
- [ ] Commit: `refactor: dividir CSS en módulos temáticos`

---

## FASE 3: OPTIMIZACIONES (Semanas 5-6)
**Objetivo**: Performance y escalabilidad

### Semana 5: Virtualización y Índices

#### Tarea 5.1: Implementar Virtualización de Tabla ⏱️ 8 horas
**Responsable**: Dev 1  
**Descripción**: Renderizar solo filas visibles (500+ empleados sin lag)

**Checklist**:
- [ ] Clase `VirtualTable` creada en `js/modules/virtual-table.js`
- [ ] Tabla grande escala a 500+ empleados sin lag
- [ ] Scroll suave sin jank
- [ ] Buffer rows: 5-10 filas arriba/abajo
- [ ] Tests de performance (debe ser <50ms para render)
- [ ] Pruebas manuales con 1000 empleados simulados
- [ ] Commit: `feat: virtualización de tabla para 500+ empleados`

---

#### Tarea 5.2: Crear Índices de Búsqueda ⏱️ 6 horas
**Responsable**: Dev 2  
**Descripción**: Hash maps para búsqueda O(1) en lugar de O(n)

**Checklist**:
- [ ] Clase `EmployeeIndex` creada
- [ ] Índices por nombre, departamento, localidad
- [ ] Búsqueda < 5ms incluso con 5000 empleados
- [ ] Tests de performance
- [ ] Commit: `feat: índices de búsqueda para performance`

---

#### Tarea 5.3: Compresión localStorage ⏱️ 4 horas
**Responsable**: Dev 1  
**Descripción**: Usar compresión LZ-String para reducir tamaño

**Checklist**:
- [ ] Librería lz-string integrada
- [ ] Compresión de datos antes de guardar
- [ ] Descompresión al cargar
- [ ] Ahorro de espacio: 60-70%
- [ ] Rendimiento: <10ms para compress/decompress
- [ ] Commit: `feat: compresión localStorage con lz-string`

---

### Semana 6: Limpieza y Testing

#### Tarea 6.1: Suite Completa de Tests ⏱️ 10 horas
**Responsable**: Dev 2 (con QA)  
**Descripción**: Tests unitarios para todas las clases críticas

**Frameworks**: Jest + Testing Library

**Coverage Mínimo**: 80%

**Archivos de Test**:
```
tests/
├── app-state.test.js
├── validadores.test.js
├── turno-manager.test.js
├── event-bus.test.js
└── ui.test.js
```

**Checklist**:
- [ ] 50+ test cases escritos
- [ ] Coverage >= 80%
- [ ] Todos los tests pasan (CI/CD integrado)
- [ ] Tests de validación: datos válidos e inválidos
- [ ] Tests de restricciones: noches, descansos, etc.
- [ ] Tests de concurrencia: cambios simultáneos
- [ ] Commit: `test: suite completa de pruebas unitarias`

---

#### Tarea 6.2: Documentación del Código ⏱️ 8 horas
**Responsable**: Dev 1  
**Descripción**: JSDoc completo para todas las clases y métodos públicos

**Checklist**:
- [ ] Cada clase tiene comentario de descripción
- [ ] Cada método público tiene @param @returns @throws
- [ ] Ejemplos de uso en comentarios complejos
- [ ] README.md con arquitectura del proyecto
- [ ] Guía de extensión para nuevas features
- [ ] Commit: `docs: JSDoc completo y README`

---

## FASE 4: UI/UX MEJORADO (Semanas 7-8)
**Objetivo**: Interfaz moderna y accesible

### Semana 7: Responsive Design

#### Tarea 7.1: Responsive para Móvil ⏱️ 8 horas
**Responsable**: Dev 2  
**Descripción**: Hacer aplicación usable en móvil (< 768px)

**Checklist**:
- [ ] Media queries para <1200px, <768px, <480px
- [ ] Modales se ajustan al tamaño de pantalla
- [ ] Tabla es scrollable horizontalmente en móvil
- [ ] Botones tienen tamaño mínimo de 44x44px (accesibilidad)
- [ ] Tipografía legible (16px+ en móvil)
- [ ] Touch-friendly sin hover states
- [ ] Tested en Chrome, Firefox, Safari móvil
- [ ] Commit: `feat: responsive design para móvil`

---

#### Tarea 7.2: Accesibilidad WCAG 2.1 AA ⏱️ 6 horas
**Responsable**: Dev 1  
**Descripción**: Mejoras de accesibilidad

**Checklist**:
- [ ] Contraste de colores >= 4.5:1 para texto
- [ ] Emojis tienen `aria-label`
- [ ] Inputs tienen labels asociados
- [ ] Navegación por teclado (Tab, Enter)
- [ ] Focus visible en todos los elementos interactivos
- [ ] Alt text en imágenes
- [ ] ARIA roles apropiados
- [ ] Screen reader compatible
- [ ] Test con tools: axe, WAVE
- [ ] Commit: `feat: accesibilidad WCAG 2.1 AA`

---

#### Tarea 7.3: Dark Mode Propio (No Solo Overrides) ⏱️ 6 horas
**Responsable**: Dev 2  
**Descripción**: Implementar tema oscuro real con variables CSS

**Checklist**:
- [ ] Variables CSS para colores (light y dark)
- [ ] Toggle de tema en header
- [ ] Preferencia guardada en localStorage
- [ ] Respeta `prefers-color-scheme` del SO
- [ ] Transición suave entre temas
- [ ] Tests visuales en ambos temas
- [ ] Commit: `feat: dark mode completo con variables CSS`

---

### Semana 8: Sidebar Navigation (Propuesta Pendiente)

#### Tarea 8.1: Implementar Sidebar Navigation ⏱️ 10 horas
**Responsable**: Dev 1 + Dev 2  
**Descripción**: Reemplazar sistema de tabs por sidebar lateral

**Notas Críticas**:
- ⚠️ Estudiar por qué versión anterior falló (documentado en ANALISIS_ESTRUCTURAL)
- ⚠️ NO reorganizar DOM, agregar sidebar ANTES del main content
- ⚠️ Modales deben quedar en top layer (fixed positioning)

**Estructura HTML**:
```html
<body>
    <aside class="sidebar">
        <!-- navegación -->
    </aside>
    
    <main class="main-content">
        <!-- aplicación -->
    </main>
    
    <!-- Modales al final (top layer) -->
</body>
```

**Checklist**:
- [ ] HTML modificado SIN cambiar modales
- [ ] Sidebar 250px ancho, gradient oscuro
- [ ] Secciones: Inicio, Cuadrante, Reportes, Gestión, Integraciones, Config, Ayuda
- [ ] Iconos SVG (no emojis)
- [ ] Hover effects suave
- [ ] Collapsed state en móvil
- [ ] Transiciones suaves
- [ ] Modales siguen funcionando (fixed positioned)
- [ ] Tests de que modales se abren correctamente
- [ ] Commit: `feat: sidebar navigation (basada en propuesta)`

---

## FASE 5: NUEVAS CARACTERÍSTICAS (Semanas 9-10+)
**Objetivo**: Features premium

### Tarea 9.1: Multi-Local Support ⏱️ 12 horas
**Responsable**: Dev 1 + Dev 2  
**Descripción**: Gestionar múltiples empresas/localidades

**Checklist**:
- [ ] Tabla `locales` con datos de cada local
- [ ] Selector de local en header
- [ ] Turnos y reportes separados por local
- [ ] Festivos locales específicos por local
- [ ] Tests con 5+ locales simultáneos
- [ ] Commit: `feat: multi-local support`

---

### Tarea 9.2: Exportación Avanzada ⏱️ 8 horas
**Responsable**: Dev 2  
**Descripción**: Excel con fórmulas, Google Sheets sync, iCal

**Checklist**:
- [ ] Excel con fórmulas de suma/promedio
- [ ] Google Sheets API integration (OAuth)
- [ ] iCal export (compatible con Google Calendar)
- [ ] Plantillas de reporte customizables
- [ ] Commit: `feat: exportación avanzada (xlsx, google sheets, ical)`

---

## 📋 CHANGELOG POR SEMANA

### Semana 1
- ✅ Validación centralizada
- ✅ Autoguardado 30s
- ✅ Sincronización multi-pestaña

### Semana 2
- ✅ AppState refactorizado
- ✅ Sistema de auditoría
- ✅ Métodos seguros en AppState

### Semana 3
- ✅ EventBus centralizado
- ✅ TurnoEditor reactivo
- ✅ Managers con eventos

### Semana 4
- ✅ Módulos JavaScript separados
- ✅ CSS modular
- ✅ Arquitectura limpia

### Semana 5
- ✅ Virtualización tabla
- ✅ Índices búsqueda
- ✅ Compresión localStorage

### Semana 6
- ✅ Tests unitarios 80% coverage
- ✅ Documentación JSDoc
- ✅ README completo

### Semana 7
- ✅ Responsive design
- ✅ Accesibilidad WCAG AA
- ✅ Dark mode real

### Semana 8
- ✅ Sidebar navigation
- ✅ UX mejorado
- ✅ Tests de integración

### Semana 9-10
- ✅ Multi-local support
- ✅ Exportación avanzada
- ✅ Integración Google Sheets

---

## 🚀 CRITERIOS DE ACEPTACIÓN FINALES

**Al terminar todas las fases, el proyecto debe cumplir**:

- [ ] ✅ 0 warnings en consola
- [ ] ✅ 0 errores de validación no tratados
- [ ] ✅ Carga en < 2 segundos (cold start)
- [ ] ✅ Scroll suave incluso con 1000 empleados
- [ ] ✅ Sincronización <500ms entre pestañas
- [ ] ✅ PDF genera en < 5 segundos
- [ ] ✅ 80% test coverage
- [ ] ✅ WCAG 2.1 AA compliance
- [ ] ✅ Responsive 480px-2560px
- [ ] ✅ Sin dependencias externas excepto html2canvas + jsPDF
- [ ] ✅ Documentación 100% completa
- [ ] ✅ Sitio de desarrollo con CI/CD (GitHub Actions o similar)

---

## 📊 RECURSOS Y PRESUPUESTO

### Equipo Requerido
- **1 Lead Developer**: $80/h × 100h = $8,000
- **2 Mid-Level Developers**: $50/h × 300h = $15,000
- **1 QA Engineer**: $40/h × 100h = $4,000
- **1 UI/UX Designer** (sesiones puntuales): $60/h × 20h = $1,200

**Total**: ~$28,200 USD

### Herramientas
- Jest (tests): Gratis
- VS Code: Gratis
- GitHub (private repo): $21/mes × 3 meses = $63
- Figma (diseños): Gratis (community)

**Total herramientas**: ~$100

### Total Proyecto
**~$28,300 USD + 400-500 horas de desarrollo**

---

## ⚠️ RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| localStorage llena durante refactor | Media | Alto | Migrar a IndexedDB después de fase 3 |
| Breakage de features existentes | Media | Muy Alto | Tests exhaustivos + staging env |
| Performance issues en virtualización | Baja | Medio | Spike de 2-3 días en semana 5 |
| Incompatibilidad browser viejo | Baja | Bajo | Polyfills, soporte IE11 deprecado |
| Cambios requerimientos durante dev | Alta | Medio | Sprint planning semanal, comunicación clara |

---

## 🎓 CONCLUSIÓN

Este plan transforma la aplicación de un **prototipo frágil** a una **solución empresarial escalable** en 8-10 semanas.

**Próximas acciones inmediatas**:
1. ✅ Revisar este plan con stakeholders
2. ✅ Asignar equipos a tareas específicas
3. ✅ Crear repositorio Git con estructura base
4. ✅ Semana 1: Comenzar con Validación + Autoguardado
5. ✅ Daily standups para tracking de progreso

**Métrica de Éxito**: Al completar todo, la app debe ser **99% confiable, escalable a 10K empleados, y mantenible por cualquier developer junior**.
