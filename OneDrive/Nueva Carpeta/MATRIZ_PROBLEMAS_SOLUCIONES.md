# 📊 MATRIZ DETALLADA DE PROBLEMAS Y SOLUCIONES

---

## TABLA 1: FALLOS LÓGICOS (12 TOTAL)

| ID | Fallo | Ubicación | Severidad | Impacto | Solución | Effort | Timeline |
|----|-------|-----------|-----------|---------|----------|--------|----------|
| L1 | Cálculo horas incorrecto | `TurnoManager.generarTurnosEmpleado()` | 🔴 Alto | Reportes incorrectos | Almacenar horas en objeto turno | 2h | Sem 1 |
| L2 | Cambio mes no regenera datos | `DateUtils.cambiarMes()` | 🔴 Alto | Datos desincronizados | Aplicar siempre `reiniciarDatos()` | 1h | Sem 1 |
| L3 | Festivos no detectados correctamente | `calcularResumenTurnosPDF()` | 🔴 Alto | Guardias incorrectas | Validar fecha inicializada + festivos locales | 3h | Sem 2 |
| L4 | Edición masiva ignora restricciones | `EdicionMasiva` class | 🟠 Medio | Cuadrantes ilegales | Validar ANTES de aplicar cambios | 4h | Sem 1 |
| L5 | localStorage crece indefinidamente | `AppState.saveToStorage()` | 🟠 Medio | App se ralentiza | Limpiar histórico cada 30 días | 2h | Sem 5 |
| L6 | Sin sincronización entre pestañas | Global | 🔴 Alto | Pérdida de cambios | Event listener `storage` | 2h | Sem 1 |
| L7 | Búsqueda tipo turno ambigua | Múltiples lugares | 🟡 Bajo | Inconsistencias visuales | Crear clase `TurnoType` centralizada | 3h | Sem 4 |
| L8 | Validación email incompleta | `EmployeeManager` | 🟡 Bajo | Datos contacto inválidos | Regex más robusta + validación DNI | 2h | Sem 1 |
| L9 | Cambios se pierden si no guarda | `TurnoEditor` | 🔴 Alto | Pérdida total de datos | Autoguardado cada 30s | 4h | Sem 1 |
| L10 | Festivos locales no se aplican | `esFestivoLocal()` | 🟠 Medio | Cálculos incorrectos por ciudad | Obtener festivos según localidad | 3h | Sem 2 |
| L11 | AppState sin validación | Global | 🔴 Alto | Cambios no auditados | Métodos públicos seguros | 6h | Sem 2 |
| L12 | Borrar empleado no limpia turnos | `EmployeeManager.eliminarEmpleado()` | 🟠 Medio | Datos contaminados | Eliminar turnos + cambios pendientes | 2h | Sem 1 |

**Total Lógica**: 34 horas de desarrollo | Riesgo: 🔴 ALTO

---

## TABLA 2: FALLOS DE DISEÑO (11 TOTAL)

| ID | Fallo | Ubicación | Severidad | Impacto | Solución | Effort | Timeline |
|----|-------|-----------|-----------|---------|----------|--------|----------|
| D1 | Monolito HTML 4500 líneas | `nuevo_cuadrante_mejorado.html` | 🔴 Alto | Imposible mantener | Separar en módulos HTML/CSS/JS | 20h | Sem 4 |
| D2 | Centrado parcial cuadrante | `css/estilos_pastel4.css` | 🟡 Bajo | Inconsistente visualmente | Usar `max-width` + `margin: auto` | 1h | ✅ DONE |
| D3 | CSS estilos duplicados | Múltiples lugares | 🟠 Medio | Selector wars, hard debug | Consolidar en archivo único | 4h | Sem 4 |
| D4 | Layout modales no responsivo | Todos los `#modalXXX` | 🟠 Medio | Inutilizable en móvil | Media queries + viewport units | 6h | Sem 7 |
| D5 | Falta contraste colores | `.turno.mañana` | 🟡 Bajo | Accesibilidad pobre | Revisar WCAG 4.5:1 ratio | 2h | Sem 7 |
| D6 | Iconos emoji no escalables | Todos los botones | 🟡 Bajo | Inconsistencia visual | Usar `aria-label` + SVG | 3h | Sem 7 |
| D7 | Tabla sin virtualización | `UI.generarCuadranteGeneral()` | 🟠 Medio | Slow con 500+ empleados | Implementar VirtualTable | 8h | Sem 5 |
| D8 | localStorage sin compresión | `AppState.saveToStorage()` | 🟡 Bajo | Espacio desperdiciado | LZ-String compression | 3h | Sem 5 |
| D9 | Búsqueda/filtrado sin índices | Filtros cuadrante | 🟡 Bajo | Filtrado lento | Hash maps + índices | 4h | Sem 5 |
| D10 | No hay patrón comunicación | Global | 🔴 Alto | Componentes acoplados | Implementar EventBus | 6h | Sem 3 |
| D11 | Validación débil y distribuida | Múltiples lugares | 🔴 Alto | Datos inválidos en BD | ValidadorDatos centralizado | 6h | Sem 1 |

**Total Diseño**: 63 horas de desarrollo | Riesgo: 🟠 MEDIO-ALTO

---

## TABLA 3: PROBLEMAS DE EFICIENCIA (5 TOTAL)

| ID | Fallo | Ubicación | Severidad | Impacto | Solución | Effort | Timeline |
|----|-------|-----------|-----------|---------|----------|--------|----------|
| E1 | Renderizado tabla sin virtualización | `UI.generarCuadranteGeneral()` | 🟠 Medio | 15K celdas = crash | VirtualTable + lazy loading | 8h | Sem 5 |
| E2 | localStorage guardado completo | `AppState.saveToStorage()` | 🟡 Bajo | Lento con muchos cambios | Guardado incremental | 4h | Sem 5 |
| E3 | Búsqueda sin índices | Filtros | 🟡 Bajo | O(n) búsqueda = lento | Índices hash maps | 4h | Sem 5 |
| E4 | Sin cachés HTTP | Assets | 🟡 Bajo | Recarga lenta | Manifest + service workers | 6h | Sem 6 |
| E5 | JavaScript no minificado | TODO | 🟡 Bajo | Descarga 50% más grande | Build process con webpack | 8h | Sem 6 |

**Total Eficiencia**: 30 horas de desarrollo | Riesgo: 🟡 BAJO

---

## TABLA 4: CRONOGRAMA DETALLADO (8-10 SEMANAS)

### FASE 1: CRÍTICA (Semanas 1-2)

```
SEMANA 1
├─ Día 1-2: ValidadorDatos (8h)
│  └─ Métodos: validarEmpleado, validarTurno, validarDNI
├─ Día 2-3: AutoSaveManager (6h)
│  └─ Guardado cada 30s + beforeunload
├─ Día 3-4: TabSyncManager (4h)
│  └─ Event listener storage
├─ Día 4-5: Tests (8h)
│  └─ 20+ test cases
└─ Estimado: 26h (3-4 personas)

SEMANA 2
├─ Día 1-2: AppState refactor (10h)
│  └─ Propiedades privadas + métodos seguros
├─ Día 2-3: Integración validación (6h)
│  └─ Todos los métodos validan
├─ Día 3-4: Sistema auditoría (4h)
│  └─ Registro completo de cambios
├─ Día 4-5: Tests exhaustivos (8h)
│  └─ 80%+ coverage
└─ Estimado: 28h (3-4 personas)
```

### FASE 2: ARQUITECTURA (Semanas 3-4)

```
SEMANA 3
├─ Día 1: EventBus (6h)
├─ Día 2: TurnoEditor refactor (8h)
├─ Día 3: EmployeeManager refactor (6h)
├─ Día 4-5: Tests + debug (8h)
└─ Estimado: 28h

SEMANA 4
├─ Día 1-2: Dividir modules.js (10h)
├─ Día 3: Dividir CSS (6h)
├─ Día 4-5: Tests integración (8h)
└─ Estimado: 24h
```

### FASE 3: PERFORMANCE (Semanas 5-6)

```
SEMANA 5
├─ Día 1-2: Virtualización tabla (8h)
├─ Día 3: Índices búsqueda (6h)
├─ Día 4: Compresión localStorage (4h)
├─ Día 5: Tests performance (6h)
└─ Estimado: 24h

SEMANA 6
├─ Día 1-2: Suite tests completa (10h)
├─ Día 3-4: Documentación JSDoc (8h)
├─ Día 5: CI/CD setup (4h)
└─ Estimado: 22h
```

### FASE 4: UI/UX (Semanas 7-8)

```
SEMANA 7
├─ Día 1-2: Responsive design (8h)
├─ Día 3-4: Accesibilidad WCAG (6h)
├─ Día 5: Tests UI (4h)
└─ Estimado: 18h

SEMANA 8
├─ Día 1-3: Sidebar navigation (10h)
├─ Día 4: Dark mode (6h)
├─ Día 5: Tests finales (4h)
└─ Estimado: 20h
```

---

## TABLA 5: COMPETENCIAS REQUERIDAS

| Rol | Experiencia | Tareas | Horas |
|-----|-------------|--------|-------|
| **Lead Developer** | 8+ años | Arquitectura, code review, decisiones técnicas | 100h |
| **Mid Dev 1** | 4-6 años | Módulos, validación, tests | 150h |
| **Mid Dev 2** | 4-6 años | UI, performance, responsivo | 150h |
| **QA Engineer** | 3+ años | Tests, CI/CD, reporting | 100h |
| **UI/UX Designer** | 3+ años | Diseños, responsive, accesibilidad | 20h (sesiones) |

**Total**: 5 personas × 8 horas/día × ~50 días = 400-500 horas

---

## TABLA 6: RECURSOS Y HERRAMIENTAS

| Categoría | Herramienta | Costo | Uso |
|-----------|-----------|--------|-----|
| **Testing** | Jest | Gratis | Tests unitarios |
| **Testing** | Cypress | Gratis | Tests E2E |
| **Versionado** | GitHub | $21/mes | Repositorio privado |
| **CI/CD** | GitHub Actions | Gratis | Automatización |
| **Documentación** | Docusaurus | Gratis | Documentación técnica |
| **Diseño** | Figma | Gratis | Mockups UI |
| **Performance** | Lighthouse | Gratis | Auditoría perf |
| **Accesibilidad** | axe DevTools | Gratis | Testing accesibilidad |
| **IDE** | VS Code | Gratis | Editor principal |

**Total Costo Herramientas**: ~$63/mes × 3 meses = $189

---

## TABLA 7: MATRIZ RIESGO-IMPACTO

```
           RIESGO BAJO    RIESGO MEDIO    RIESGO ALTO
IMPACTO
BAJO        ✓ Accesibilidad  ✓ CSS modular   ⚠ localStorage
            ✓ Dark mode      ✓ Responsive    ⚠ Compresión

MEDIO       ✓ Virtualización ⚠ EventBus      🔴 Refactor App
            ✓ Índices        ⚠ Módulos JS    🔴 Validación

ALTO        ✓ Tests          🔴 Sidebar      🔴 Sincronización
            ✓ Docs           🔴 Edic Masiva  🔴 Autoguardado
```

---

## TABLA 8: DEPENDENCIAS ENTRE TAREAS

```
FASE 1 (Independiente)
├─ ValidadorDatos [2-3 días]
├─ AutoSaveManager [1-2 días]
├─ TabSyncManager [1 día]
└─ AppState refactor [3-4 días] ← DEPENDE DE ValidadorDatos

FASE 2 (DEPENDE DE FASE 1)
├─ EventBus [2-3 días]
└─ Refactor managers [4-5 días] ← DEPENDE DE EventBus

FASE 3 (DEPENDE DE FASE 2)
├─ Virtualización [2-3 días]
├─ Índices [1-2 días]
└─ Compresión [1 día]

FASE 4 (PARCIALMENTE paralelo)
├─ Tests [3-4 días]
├─ Responsive [2-3 días]
└─ Accesibilidad [2 días]

FASE 5 (DEPENDE DE TODO)
├─ Sidebar [3-4 días]
└─ Dark mode [1-2 días]
```

---

## TABLA 9: MÉTRICAS DE ÉXITO

| Métrica | Target | Sem 1 | Sem 4 | Sem 8 | Sem 10 |
|---------|--------|-------|-------|-------|--------|
| **Test Coverage** | 80% | 10% | 30% | 60% | 85% |
| **Bugs Críticos** | 0 | 5 | 2 | 0 | 0 |
| **Deuda Técnica** | Baja | Alta | Alta | Media | Baja |
| **Performance FCP** | < 2s | 4s | 3s | 2.5s | 1.8s |
| **Líneas de código** | < 2000 | 4500 | 3500 | 2500 | 2000 |
| **Módulos** | 15+ | 1 | 5 | 12 | 15 |

---

## TABLA 10: GUÍA PARA STAKEHOLDERS

| Pregunta | Respuesta |
|----------|-----------|
| **¿Está roto?** | No, funciona pero es frágil |
| **¿Cuánto cuesta?** | ~$28,000 en desarrollo |
| **¿Cuánto tiempo?** | 8-10 semanas con equipo de 4-5 personas |
| **¿Vale la pena?** | SÍ - Escalabilidad a 10K empleados |
| **¿Qué pasa si no lo hago?** | Deuda técnica crece, app colapsa con 300+ empleados |
| **¿Puedo hacerlo gradualmente?** | SÍ - Fase 1 (crítica), Fase 2 (importante), Fase 3+ (mejoras) |
| **¿Qué gano?** | Confiabilidad 99%, mantenibilidad, escalabilidad |

---

## TOTAL CUANTIFICADO

### Horas de Desarrollo
```
Fase 1: 34 + 28 = 62h (Correcciones)
Fase 2: 28 + 24 = 52h (Arquitectura)
Fase 3: 24 + 22 = 46h (Performance)
Fase 4: 18 + 20 = 38h (UI/UX)
Fase 5: 50h+ (Nuevas features)

TOTAL: 248-300+ horas
```

### Equipo
```
Lead Dev:   100 horas × $80/h  = $8,000
Mid Dev 1:  150 horas × $50/h  = $7,500
Mid Dev 2:  150 horas × $50/h  = $7,500
QA:         100 horas × $40/h  = $4,000
UX/Design:   20 horas × $60/h  = $1,200

TOTAL: $28,200
```

### Presupuesto
```
Personal:           $28,200
Herramientas:         $189
Imprevistos (10%):  $2,839
---
TOTAL:             $31,228 USD
```

---

**Documento Generado**: 1 de enero de 2026  
**Versión**: 1.0  
**Formato**: Tablas comparativas exhaustivas  
**Para**: Técnicos + Stakeholders
