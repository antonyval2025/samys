# 🧹 Lógica de Turnos - Departamento de Limpieza

## Requisitos Especificados

- **Horas semanales**: 39 horas
- **Días de trabajo**: 6 días (con 1 día de descanso fijo)
- **Domingo Guardia**: Si trabaja domingo, se libera compensadamente otro día de la semana
- **Días Festivos**: 
  - Normalmente se libran (descanso)
  - Si hay guardia en festivo → se trabaja + descanso de compensación + extra adicional
- **Compensación**: 
  - Domingo guardia: 1 día descanso + nada extra
  - Festivo guardia: 1 día descanso + 1 hora extra de compensación

---

## Problemas Actuales del Sistema

### 1. **Patrones Rígidos por Turno Principal**
```javascript
// ACTUAL - Solo considera el turno principal, no el departamento
const patrones = {
    'Mañana': ['mañana', 'mañana', 'mañana', 'mañana', 'mañana', 'descanso', 'descanso'],
    'Tarde': ['tarde', 'tarde', 'tarde', 'tarde', 'tarde', 'descanso', 'descanso'],
    'Noche': ['noche', 'noche', 'noche', 'noche', 'noche', 'descanso', 'descanso']
};
```
**Problema**: Genera 5+2 (7 días), pero Limpieza necesita 6+1

### 2. **Cálculo de Horas por Tipo de Turno**
```javascript
// ACTUAL - Todos los turnos tienen 8 horas
tiposTurno = {
    mañana: { horas: 8 },
    tarde: { horas: 8 },
    // ...
};
```
**Problema**: Para 39 horas en 6 días = 6.5 horas/día, pero sistema asigna 8h fijas

### 3. **Sin Consideración de Departamento**
```javascript
// ACTUAL - generarTurnosEmpleado() no sabe del departamento
static generarTurnosEmpleado(empleado, diasEnMes) {
    // No diferencia por departamento
}
```
**Problema**: No hay lógica especial para Limpieza, Cocina, Recepción, etc.

### 4. **Sin Compensación por Fin de Semana**
```javascript
// ACTUAL - Los domingos de guardia son aleatorios sin compensación planificada
else if (diaSemana === 0 || diaSemana === 6) {
    turno = Math.random() > 0.7 ? patron[0] : 'descanso';
}
```
**Problema**: No hay mecanismo de "si trabaja domingo → libra día entre semana"

---

## Solución Propuesta

### 1. **Agregar Configuración por Departamento**

Crear objeto de configuración departamental:

```javascript
const configuracionDepartamentos = {
    'Limpieza': {
        horasPorSemana: 39,
        diasTrabajo: 6,
        diaDescansoFijo: 1,  // 1 día fijo de descanso
        pattern: 'seis-uno', // 6 días turno + 1 descanso
        horasPorDia: 6.5,    // 39 / 6
        compensacionFinSemana: true,
        descuentoFinSemana: 0.5 // Si trabaja domingo, se descuenta 0.5 días del presupuesto
    },
    'Cocina': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diaDescansoFijo: 2,
        pattern: 'cinco-dos',
        horasPorDia: 8
    },
    'Recepción': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diaDescansoFijo: 2,
        pattern: 'cinco-dos',
        horasPorDia: 8
    }
};
```

### 2. **Mejorar la Función generarTurnosEmpleado()**

```javascript
static generarTurnosEmpleado(empleado, diasEnMes) {
    const turnos = [];
    const fechaBase = new Date(AppState.currentYear, AppState.currentMonth, 1);
    const config = configuracionDepartamentos[empleado.departamento] || 
                   configuracionDepartamentos['Limpieza'];
    
    // Determinar el patrón según el departamento
    const patron = this.generarPatronDepartamento(empleado, config);
    
    let domingosTrabajados = [];
    let diasCompensacion = [];
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fechaObj = new Date(fechaBase);
        fechaObj.setDate(dia);
        const diaSemana = fechaObj.getDay(); // 0=dom, 1=lun, ..., 6=sab
        
        let turno;
        
        // Estados especiales
        if (empleado.estado === 'vacaciones' && dia <= 15) {
            turno = 'vacaciones';
        } else if (empleado.estado === 'baja') {
            turno = 'baja';
        } 
        // Lógica específica de departamento
        else if (config.compensacionFinSemana && diaSemana === 0) {
            // DOMINGO: Trabajar o descansar?
            // Registrar para compensación
            if (Math.random() > 0.5) { // 50% probabilidad de trabajar domingo
                turno = empleado.turnoPrincipal || 'mañana';
                domingosTrabajados.push({ dia, fechaObj });
            } else {
                turno = 'descanso';
            }
        }
        // ENTRE SEMANA
        else {
            const indicePatron = (dia - 1) % patron.length;
            turno = patron[indicePatron];
        }
        
        // Calcular horas según departamento
        const horas = this.calcularHorasTurno(turno, config);
        
        turnos.push({
            dia: dia,
            turno: turno,
            horas: horas,
            fecha: fechaObj,
            esFinSemana: diaSemana === 0 || diaSemana === 6,
            departamento: empleado.departamento,
            config: config
        });
    }
    
    // Aplicar compensaciones por domingos trabajados
    this.aplicarCompensacionDomingos(turnos, domingosTrabajados, config);
    
    return turnos;
}
```

### 3. **Función para Generar Patrón por Departamento**

```javascript
static generarPatronDepartamento(empleado, config) {
    const principales = [
        empleado.turnoPrincipal || 'mañana',
        'descanso'
    ];
    
    if (config.pattern === 'seis-uno') {
        // 6 días turno + 1 descanso
        return [
            principales[0], principales[0], principales[0],
            principales[0], principales[0], principales[0],
            'descanso'
        ];
    } else if (config.pattern === 'cinco-dos') {
        // 5 días turno + 2 descanso
        return [
            principales[0], principales[0], principales[0],
            principales[0], principales[0],
            'descanso', 'descanso'
        ];
    }
    
    return principales;
}
```

### 4. **Función para Calcular Horas Dinámicamente**

```javascript
static calcularHorasTurno(turno, config) {
    if (turno === 'descanso' || turno === 'libre') return 0;
    if (turno === 'vacaciones' || turno === 'baja') return 0;
    if (turno === 'festivo') return 0;
    
    // Si es turno normal, usar las horas del departamento
    return config.horasPorDia || tiposTurno[turno]?.horas || 8;
}
```

### 5. **Función para Aplicar Compensaciones**

```javascript
static aplicarCompensacionDomingos(turnos, domingosTrabajados, config) {
    if (!config.compensacionFinSemana || domingosTrabajados.length === 0) {
        return;
    }
    
    // Buscar días entre semana para librar (preferable martes-jueves)
    let diaLiberadoCount = 0;
    const diasPreferidos = [2, 3, 4]; // Martes, Miércoles, Jueves
    
    for (let turno of turnos) {
        if (diaLiberadoCount >= domingosTrabajados.length) break;
        
        const diaSemana = turno.fecha.getDay();
        
        // Si es un día preferido y estaba trabajado, cambiar a descanso
        if (diasPreferidos.includes(diaSemana) && 
            turno.turno !== 'descanso' && 
            turno.turno !== 'vacaciones' &&
            turno.turno !== 'baja') {
            
            turno.turno = 'descanso-compensado'; // Nuevo tipo
            turno.horas = 0;
            turno.razon = 'Compensación por trabajo en domingo';
            diaLiberadoCount++;
        }
    }
}
```

---

## Cambios en la Estructura de Datos

### Objeto Turno Mejorado

```javascript
{
    dia: 15,
    turno: 'mañana',
    horas: 6.5,              // ← Ahora variable según departamento
    fecha: Date,
    esFinSemana: false,
    departamento: 'Limpieza', // ← Nuevo
    razon: 'Compensación',    // ← Nuevo (opcional)
    compensado: true          // ← Nuevo (marca si es compensación)
}
```

### Empleado Mejorado

```javascript
{
    id: 1,
    nombre: 'Antonio Jiménez',
    departamento: 'Limpieza',
    horasContrato: 39,        // ← Horas semanales / mes
    turnoPrincipal: 'Mañana',
    estado: 'activo',
    // NUEVOS CAMPOS OPCIONALES:
    domingosTrabajados: 4,    // Tracking de domingos
    diasCompensacion: 4,      // Tracking de compensaciones
    email: '...',
    telefono: '...'
}
```

---

## Nuevos Tipos de Turno

Agregar a `tiposTurno`:

```javascript
tiposTurno = {
    // ... existentes ...
    'descanso-compensado': {
        inicial: 'DC',
        nombre: 'Descanso Compensado',
        color: '#c4b5fd',
        horario: '-',
        horas: 0
    },
    'domingo-guardia': {
        inicial: 'DG',
        nombre: 'Domingo Guardia',
        color: '#fecaca',
        horario: '08:00-16:00',
        horas: 6.5 // O el valor correspondiente
    }
};
```

---

## Validaciones Necesarias

### 1. Validar Cumplimiento Semanal
```javascript
static validarCumplimientoSemanal(turnos, config) {
    // Agrupar por semana
    // Contar días trabajados
    // Verificar que sea 6 (Limpieza) o 5 (otros)
    // Verificar que sea 1 (Limpieza) o 2 (otros) descansos
}
```

### 2. Validar Compensaciones
```javascript
static validarCompensaciones(empleadoId, turnos) {
    // Contar domingos trabajados vs días compensados
    // Asegurar que sean iguales
    // Marcar si hay deudas de compensación
}
```

### 3. Validar Horas Mensuales
```javascript
static validarHorasMensuales(turnos, config) {
    const totalHoras = turnos
        .filter(t => t.turno !== 'descanso' && t.turno !== 'vacaciones')
        .reduce((sum, t) => sum + t.horas, 0);
    
    const diasTrabajados = turnos
        .filter(t => t.turno !== 'descanso' && t.turno !== 'vacaciones')
        .length;
    
    const esperado = config.horasPorDia * diasTrabajados;
    const margen = 1; // ±1 hora de tolerancia
    
    return Math.abs(totalHoras - esperado) <= margen;
}
```

---

## Recomendaciones Implementación

### Fase 1: Básica (Inmediata)
- [ ] Agregar `configuracionDepartamentos`
- [ ] Crear función `generarPatronDepartamento()`
- [ ] Crear función `calcularHorasTurno()`
- [ ] Agregar campo `departamento` a objetos turno

### Fase 2: Compensaciones (Semana 1)
- [ ] Implementar `aplicarCompensacionDomingos()`
- [ ] Agregar nuevo tipo turno `descanso-compensado`
- [ ] Función `validarCompensaciones()`

### Fase 3: Validaciones (Semana 2)
- [ ] `validarCumplimientoSemanal()`
- [ ] `validarHorasMensuales()`
- [ ] UI para mostrar errores/advertencias

### Fase 4: Reportes (Semana 3)
- [ ] Reporte de cumplimiento por departamento
- [ ] Reporte de compensaciones pendientes
- [ ] Dashboard de equilibrio

---

## Ejemplo de Cuadrante Correcto (Limpieza)

```
MES: DICIEMBRE 2025 - Limpieza (39h/semana, 6 días, descanso compensado)

SEMANA 1:
Lun 1:  Mañana (6.5h)
Mar 2:  Mañana (6.5h)
Mié 3:  Mañana (6.5h)
Jue 4:  Mañana (6.5h)
Vie 5:  Mañana (6.5h)
Sáb 6:  Mañana (6.5h)   ← 39 horas
Dom 7:  Descanso (0h)

SEMANA 2:
Lun 8:  Mañana (6.5h)
Mar 9:  Descanso-Comp (0h) ← Compensación por domingo 14
Mié 10: Mañana (6.5h)
Jue 11: Mañana (6.5h)
Vie 12: Mañana (6.5h)
Sáb 13: Mañana (6.5h)
Dom 14: Guardia Domingo (6.5h) ← Trabaja fin de semana = 39.5h

✅ TOTAL MES: ~156 horas (4 semanas × 39h)
```

---

## Testing

```javascript
// En consola del navegador:

// Test 1: Generar turnos para empleado Limpieza
const empleadoLimpieza = empleados.find(e => e.departamento === 'Limpieza');
const turnos = TurnoManager.generarTurnosEmpleado(empleadoLimpieza, 30);

// Test 2: Verificar patrón 6-1
const diasTrabajo = turnos.filter(t => t.turno !== 'descanso').length;
console.log('Días trabajo esperados:', 26, 'Reales:', diasTrabajo);

// Test 3: Verificar horas
const totalHoras = turnos.reduce((sum, t) => sum + t.horas, 0);
console.log('Horas esperadas:', 169, 'Reales:', totalHoras); // 26 × 6.5

// Test 4: Verificar compensaciones
const domingosTrabajados = turnos.filter(t => t.turno === 'domingo-guardia').length;
const diasCompensados = turnos.filter(t => t.turno === 'descanso-compensado').length;
console.log('Domingos:', domingosTrabajados, 'Compensaciones:', diasCompensados);
```

---

## Preguntas para Clarificar

1. **¿Todos los departamentos necesitan configuración especial o solo Limpieza?**
2. **¿La compensación debe ser automática o manual (supervisor aprueba)?**
3. **¿Cuánta flexibilidad en qué días se libra (solo M-J o cualquier día)?**
4. **¿Se registra el "crédito" de compensación para futuros meses?**
5. **¿Hay límite de domingos trabajados/mes?**
