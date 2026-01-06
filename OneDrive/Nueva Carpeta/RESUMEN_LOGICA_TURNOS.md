# 📋 Resumen Rápido - Lógica de Turnos Limpieza

## La Regla Base

```
LIMPIEZA = 39 horas / 6 días = 6.5 horas/día
```

## Decisión de Turno para Cada Día

```
┌─────────────────────────────────────────────────────────────┐
│              ¿QUÉ TURNO TOCA HOY?                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ ¿Estado BAJA?           → BAJA                         │
│                                                             │
│  ❌ ¿Estado VACACIONES?     → VACACIONES                   │
│                                                             │
│  🎄 ¿Es FESTIVO?                                           │
│      ├─ 80% → FESTIVO (descanso)                           │
│      └─ 20% → FESTIVO-GUARDIA (trabaja 6.5h)              │
│                 ⚠️ GENERA: descanso + 1h extra             │
│                                                             │
│  ☀️ ¿Es DOMINGO?                                           │
│      ├─ 50% → DOMINGO-GUARDIA (trabaja 6.5h)              │
│      │   ⚠️ GENERA: 1 descanso entre semana               │
│      └─ 50% → DESCANSO                                    │
│                                                             │
│  📅 ¿ENTRE SEMANA?                                         │
│      └─ Sigue PATRÓN: M T M M M M D (6 trabajo + 1 desc)  │
│         Donde M=Mañana, D=Descanso                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Compensaciones

### 1️⃣ Domingo Trabajado
- **Si**: Trabaja domingo (domingo-guardia)
- **Entonces**: Se libra 1 día entre semana (Martes-Jueves preferible)
- **Tipo**: DESCANSO-COMPENSADO
- **Horas**: 0h
- **Relación**: 1 domingo = 1 compensación

### 2️⃣ Festivo Trabajado  
- **Si**: Trabaja un festivo (festivo-guardia)
- **Entonces**: Se libra 1 día entre semana + 1 hora extra
- **Tipo**: DESCANSO-COMP-EXTRA
- **Horas**: 1h extra
- **Relación**: 1 festivo = 1 compensación + 1h

## Tipos de Turno

| Código | Nombre | Horas | Color | Descripción |
|--------|--------|-------|-------|-------------|
| **M** | Mañana | 6.5h | Verde | Turno normal |
| **D** | Descanso | 0h | Gris | Día libre normal |
| **F** | Festivo | 0h | Amarillo | Día festivo sin trabajar |
| **FG** | Festivo Guardia | 6.5h | Rojo | ⚠️ Trabaja festivo → +descanso+1h |
| **DG** | Domingo Guardia | 6.5h | Naranja | ⚠️ Trabaja domingo → +descanso |
| **DC** | Descanso Comp | 0h | Lila | Compensación por domingo |
| **DCE** | Descanso+Extra | 1h | Azul | Compensación por festivo |

## Validaciones Automáticas

```
✅ CORRECTO:
   - 2 domingos guardia = 2 descansos compensación
   - 1 festivo guardia = 1 descanso+extra
   - ~26 días trabajo × 6.5h = ~169 horas

❌ INCORRECTO:
   - 3 domingos pero solo 2 compensaciones
   - 156 horas cuando debería haber 169
   - Sin descansos compensación para domingos trabajados
```

## Ejemplos Día a Día

### Semana Normal (Sin eventos especiales)
```
Lun: Mañana (6.5h)
Mar: Mañana (6.5h)
Mié: Mañana (6.5h)
Jue: Mañana (6.5h)
Vie: Mañana (6.5h)
Sáb: Mañana (6.5h)
Dom: Descanso (0h)
─────────────────────
Total: 39 horas
```

### Semana con Domingo Guardia
```
Lun: Mañana (6.5h)
Mar: Descanso-Comp (0h)  ← Por el domingo 7
Mié: Mañana (6.5h)
Jue: Mañana (6.5h)
Vie: Mañana (6.5h)
Sáb: Mañana (6.5h)
Dom: Domingo-Guardia (6.5h)
─────────────────────────────
Total: 39 horas (compensado)
```

### Semana con Festivo (Navidad)
```
Lun: Mañana (6.5h)
Mar: Descanso+Extra (1h)  ← Por el festivo 25
Mié: Mañana (6.5h)
Jue: Mañana (6.5h)
Vie: Mañana (6.5h)
Sáb: Mañana (6.5h)
Dom: Descanso (0h)
─────────────────────────────────
Dec 25 (Navidad): Festivo-Guardia (6.5h)
─────────────────────────────────
Total: 39.5 horas (compensado con 1h extra)
```

## Checklist de Implementación

```javascript
// 1. Configuración
const configuracionDepartamentos = { /* LIMPIEZA: 39h, 6 días */ };
const DIAS_FESTIVOS = [ /* Enero 1, Mayo 1, etc */ ];

// 2. Funciones Clave
TurnoManager.esFestivo(fecha)                    ✅
TurnoManager.generarPatronDepartamento()         ✅
TurnoManager.calcularHorasTurno()                ✅
TurnoManager.aplicarCompensacionDomingos()       ✅
TurnoManager.aplicarCompensacionFestivos()       ✅

// 3. Nuevos Tipos Turno
'festivo'
'festivo-guardia'
'domingo-guardia'
'descanso-compensado'
'descanso-comp-extra'

// 4. Validación
TurnoManager.validarCumplimientoMensual()        ✅
```

## Preguntas Confirmadas

| Pregunta | Respuesta |
|----------|-----------|
| ¿Cuántas horas/semana? | 39 horas |
| ¿Cuántos días trabajo? | 6 días |
| ¿Domingo se libra? | Sí, normalmente |
| ¿Domingo guardia? | Se trabaja + descanso comp |
| ¿Festivo se libra? | Sí, normalmente (80%) |
| ¿Festivo guardia? | Se trabaja + descanso + 1h extra |
| ¿Horas/día? | 6.5h (39÷6) |
| ¿Compensación automática? | Sí |
| ¿Día preferido para comp? | Martes-Jueves |

---

**Documento generado el**: 18 Diciembre 2025  
**Estado**: ✅ Lógica Confirmada
