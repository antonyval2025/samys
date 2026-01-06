# 📊 DIAGRAMA DE FLUJO - Modal A+B

## 1️⃣ INICIO DE LA APP

```
┌─────────────────────────────────────┐
│  usuario.html abierto en navegador  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   DOMContentLoaded se activa        │
│   └─ Cargar datos de localStorage   │
│   └─ Inicializar empleados          │
│   └─ Generar cuadrante              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  TurnoManager.reiniciarDatos()      │
│  └─ generarTurnosEmpleado()         │
│     └─ DEVUELVE: turnos vacíos      │
│        (solo domingos/festivos/etc) │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Renderizar cuadrante general       │
│  (vacío o con algunos turnos)       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  TurnoManager.verificarYMostrarBoton│
│  ├─ ¿esCuadranteVacio()?            │
│  │  ├─ ✅ SI → show botón           │
│  │  └─ ❌ NO → hide botón           │
│  └─ display = 'block' o 'none'      │
└─────────────────────────────────────┘
```

## 2️⃣ USUARIO HACE CLIC EN BOTÓN "GENERAR TURNOS"

```
┌──────────────────────────────────────┐
│ onclick="TurnoManager.mostrarModal()"│
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  TurnoManager.mostrarModalGeneracion │
│  ├─ Obtener mes/año actual          │
│  ├─ Calcular empleados (length)     │
│  ├─ Estimar turnos (~dias*5/7*emps) │
│  └─ Llenar campos dinámicamente:    │
│     ├─ #infoMesGeneracion = "Enero" │
│     ├─ #infoAnioGeneracion = "2026" │
│     ├─ #resumenEmpleados = "7"      │
│     └─ #resumenTurnos = "~130"      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Modal.classList.add('active')       │
│  (Modal ahora visible)               │
│                                      │
│  ┌──────────────────────────────────┐│
│  │  MODAL GENERACION TURNOS        ││
│  │  ─────────────────────────────  ││
│  │  📋 Generar Turnos Por Defecto  ││
│  │                                 ││
│  │  📆 Período a Generar:          ││
│  │     MES: Enero | AÑO: 2026      ││
│  │                                 ││
│  │  📊 Resumen:                    ││
│  │     Empleados: 7                ││
│  │     Turnos a generar: ~130      ││
│  │                                 ││
│  │  ⚠️ Se asignarán: Turnos por    ││
│  │  ⏸️ Se respetarán: Domingos...  ││
│  │                                 ││
│  │  [❌ Cancelar] [✅ Generar]     ││
│  └──────────────────────────────────┘│
└──────────────────────────────────────┘
```

## 3️⃣ USUARIO HACE CLIC EN "GENERAR TURNOS"

```
┌──────────────────────────────────────┐
│ onclick="TurnoManager.generarTurnos()│
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Iterar por cada empleado            │
│  ├─ Obtener turnos de AppState      │
│  └─ Para cada día del mes:          │
│     ├─ ¿turno === '' ?              │
│     │  ├─ ✅ SI:                    │
│     │  │  ├─ ¿Es domingo?           │
│     │  │  │  ✅ → skip              │
│     │  │  ├─ ¿Es festivo?           │
│     │  │  │  ✅ → skip              │
│     │  │  └─ Es laboral             │
│     │  │     └─ Asignar turno!      │
│     │  │        (turnoPrincipal)    │
│     │  │                            │
│     │  └─ ❌ NO:                    │
│     │     └─ Dejar como está        │
│     │        (no sobrescribir)      │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  AppState.saveToStorage()            │
│  └─ Guardar a localStorage           │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Modal.classList.remove('active')    │
│  └─ Modal se cierra                 │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  UI.generarCuadranteGeneral()        │
│  └─ Renderizar cuadrante con        │
│     los turnos nuevos                │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  TurnoManager.verificarYMostrarBoton │
│  └─ esCuadranteVacio() ?             │
│     ✅ SI → show botón (no debería) │
│     ❌ NO → hide botón (correcto)   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  NotificationSystem.show()           │
│  ┌─────────────────────────────────┐ │
│  │ ✅ ~130 turnos asignados para   │ │
│  │    Enero                        │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## 4️⃣ USUARIO CAMBIA DE MES

```
┌──────────────────────────────────────┐
│ Click ▶ (próximo mes)               │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  DateUtils.cambiarMes(+1)            │
│  ├─ currentMonth = Febrero           │
│  ├─ TurnoManager.reiniciarDatos()   │
│  │  └─ ¿Hay turnos de Febrero?      │
│  │     ❌ NO → generar nuevos       │
│  │     ✅ SI → mantener              │
│  └─ UI.generarCuadranteGeneral()    │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  TurnoManager.verificarYMostrarBoton │
│  └─ Febrero está vacío?              │
│     ✅ SI → botón VISIBLE           │
│     ❌ NO → botón OCULTO            │
└──────────────────────────────────────┘
```

## 5️⃣ LÓGICA DE NO-SOBRESCRITURA

```
Al generar turnos, para cada día:

┌────────────────────────────────────────────┐
│ if (dia.turno === '') {                    │
│   // Solo si está COMPLETAMENTE VACÍO      │
│   if (!esDomingo && !esFestivo) {          │
│     dia.turno = turnoPrincipal             │
│   }                                        │
│ }                                          │
│ // Si NO es vacío, no hace nada           │
└────────────────────────────────────────────┘

Ejemplos:
─────────────────────────────────────────────────────────────
Día 1  | turno: "mañana"     | Acción: NO CAMBIAR ✅ SEGURO
Día 2  | turno: ""           | Acción: ASIGNAR mañana
Día 3  | turno: "baja"       | Acción: NO CAMBIAR ✅ PROTEGIDO
Día 4  | turno: "descanso"   | Acción: NO CAMBIAR ✅ PRESERVADO
Día 5  | turno: ""           | Acción: ASIGNAR mañana
Domingo| turno: ""           | Acción: NO ASIGNAR ✅ RESPETA

Segundo click en GENERAR (cuadrante vacío otra vez):
Day 1  | turno: "mañana"     | Acción: NO CAMBIAR ✅ PRESERVADO
```

## 6️⃣ FLUJO COMPLETO DE ESTADOS

```
Estado 1: CARGA INICIAL
├─ Cuadrante: VACÍO
├─ Botón: VISIBLE ✨
├─ Modal: CERRADO
└─ Usuario: Ve botón pulsante

           ▼

Estado 2: USUARIO ABRE MODAL
├─ Cuadrante: SIN CAMBIOS
├─ Botón: VISIBLE
├─ Modal: ABIERTO
└─ Usuario: Ve detalles del mes/empleados

           ▼

Estado 3: USUARIO GENERA
├─ Cuadrante: LLENO (turnos asignados)
├─ Botón: OCULTO
├─ Modal: CERRADO
└─ Usuario: Ve notificación de éxito

           ▼

Estado 4: CAMBIAR ENERO → FEBRERO
├─ Cuadrante: VACÍO (febrero sin turnos)
├─ Botón: VISIBLE NUEVAMENTE
├─ Modal: CERRADO
└─ Usuario: Puede generar febrero o editar

           ▼

Estado 5: CAMBIAR FEBRERO → ENERO
├─ Cuadrante: LLENO (mantiene los turnos de enero)
├─ Botón: OCULTO (porque hay turnos)
├─ Modal: CERRADO
└─ Usuario: Ve turnos que generó antes
```

## 7️⃣ EVENTOS PRINCIPALES

| Evento | Trigger | Función | Resultado |
|--------|---------|---------|-----------|
| `load` | Usuario abre app | `DOMContentLoaded` | Cuadrante cargado, botón verificado |
| `click botón` | Usuario clic en "Generar Turnos" | `mostrarModalGeneracion()` | Modal abierto |
| `click generar` | Usuario clic en "Generar Turnos" (modal) | `generarTurnos()` | Turnos asignados |
| `cambiar mes` | Usuario clic ◀▶ | `DateUtils.cambiarMes()` | Datos nuevos, botón re-verificado |
| `editar turno` | Usuario clic en celda | `TurnoEditor` | Cambio manual, no afecta botón |

## 8️⃣ DETECCIÓN DE CUADRANTE VACÍO

```javascript
esCuadranteVacio() {
  para cada empleado {
    para cada día del mes {
      si (es laboral && turno === '') {
        contador_vacios++
      }
      si (es laboral) {
        contador_total++
      }
    }
  }
  
  return (contador_vacios > 0 && contador_vacios === contador_total)
  // Devuelve TRUE solo si TODOS los días laborales están vacíos
}
```

---

**Resumen Visual**: El botón es una **UI inteligente** que:
- ✅ Aparece cuando lo necesitas
- ✅ Se oculta cuando no lo necesitas
- ✅ Siempre protege tus datos
- ✅ Funciona mensualmente
