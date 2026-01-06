# 🧹 Sistema Completo de Turnos - Limpieza

## Requisitos Finales Confirmados

### Horas y Días
- **Horas semanales**: 39 horas
- **Días de trabajo**: 6 días  
- **Descanso fijo**: 1 día/semana

### Compensaciones

| Situación | Acción | Compensación |
|-----------|--------|--------------|
| **Domingo Normal** | Se libra | - |
| **Domingo Guardia** | Se trabaja | 1 día descanso (entre semana) |
| **Festivo Normal** | Se libra | - |
| **Festivo Guardia** | Se trabaja | 1 día descanso + 1h extra |

---

## 1. Configuración por Departamento

```javascript
const configuracionDepartamentos = {
    'Limpieza': {
        horasPorSemana: 39,
        diasTrabajo: 6,
        diaDescansoFijo: 1,
        pattern: 'seis-uno',
        horasPorDia: 6.5,           // 39 / 6
        compensacionFinSemana: true,
        compensacionFestivo: true
    },
    'Cocina': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diaDescansoFijo: 2,
        pattern: 'cinco-dos',
        horasPorDia: 8,
        compensacionFinSemana: false,
        compensacionFestivo: false
    }
};

// Días festivos España
const DIAS_FESTIVOS = [
    { mes: 0, dia: 1 },   // 1 Enero
    { mes: 0, dia: 6 },   // 6 Enero
    { mes: 4, dia: 1 },   // 1 Mayo
    { mes: 7, dia: 15 },  // 15 Agosto
    { mes: 9, dia: 12 },  // 12 Octubre
    { mes: 10, dia: 1 },  // 1 Noviembre
    { mes: 11, dia: 6 },  // 6 Diciembre
    { mes: 11, dia: 25 }  // 25 Diciembre
];
```

---

## 2. Función Principal Mejorada

```javascript
class TurnoManager {
    
    static esFestivo(fecha) {
        const mes = fecha.getMonth();
        const dia = fecha.getDate();
        return DIAS_FESTIVOS.some(f => f.mes === mes && f.dia === dia);
    }
    
    static generarTurnosEmpleado(empleado, diasEnMes) {
        const turnos = [];
        const fechaBase = new Date(AppState.currentYear, AppState.currentMonth, 1);
        const config = configuracionDepartamentos[empleado.departamento] || 
                       configuracionDepartamentos['Limpieza'];
        
        // Generar patrón según departamento
        const patron = this.generarPatronDepartamento(empleado, config);
        
        let domingosTrabajados = [];
        let festivosTrabajados = [];
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaObj = new Date(fechaBase);
            fechaObj.setDate(dia);
            const diaSemana = fechaObj.getDay(); // 0=dom, 1=lun, ..., 6=sab
            
            let turno;
            
            // ===== ESTADOS ESPECIALES =====
            if (empleado.estado === 'vacaciones' && dia <= 15) {
                turno = 'vacaciones';
            } else if (empleado.estado === 'baja') {
                turno = 'baja';
            }
            // ===== DÍAS FESTIVOS =====
            else if (this.esFestivo(fechaObj)) {
                // 80% probabilidad de descanso, 20% guardia
                if (Math.random() > 0.2) {
                    turno = 'festivo';
                } else {
                    turno = 'festivo-guardia'; // Será procesado después
                    festivosTrabajados.push({ dia, fechaObj });
                }
            }
            // ===== DOMINGOS =====
            else if (diaSemana === 0) {
                // 50% probabilidad de trabajar domingo
                if (Math.random() > 0.5) {
                    turno = 'domingo-guardia';
                    domingosTrabajados.push({ dia, fechaObj });
                } else {
                    turno = 'descanso';
                }
            }
            // ===== ENTRE SEMANA NORMAL =====
            else {
                const indicePatron = (dia - 1) % patron.length;
                turno = patron[indicePatron];
            }
            
            // Calcular horas según turno y departamento
            const horas = this.calcularHorasTurno(turno, config);
            
            turnos.push({
                dia: dia,
                turno: turno,
                horas: horas,
                fecha: fechaObj,
                esFinSemana: diaSemana === 0 || diaSemana === 6,
                departamento: empleado.departamento,
                config: config,
                compensacion: null // Se establece después
            });
        }
        
        // ===== APLICAR COMPENSACIONES =====
        this.aplicarCompensacionDomingos(turnos, domingosTrabajados, config);
        this.aplicarCompensacionFestivos(turnos, festivosTrabajados, config);
        
        return turnos;
    }
    
    static generarPatronDepartamento(empleado, config) {
        const turno = empleado.turnoPrincipal || 'mañana';
        
        if (config.pattern === 'seis-uno') {
            // 6 días turno + 1 descanso
            return [turno, turno, turno, turno, turno, turno, 'descanso'];
        } else if (config.pattern === 'cinco-dos') {
            // 5 días turno + 2 descanso
            return [turno, turno, turno, turno, turno, 'descanso', 'descanso'];
        }
        return [turno, 'descanso'];
    }
    
    static calcularHorasTurno(turno, config) {
        if (['descanso', 'libre', 'vacaciones', 'baja', 'festivo'].includes(turno)) {
            return 0;
        }
        if (turno === 'descanso-compensado' || turno === 'descanso-comp-extra') {
            return turno === 'descanso-comp-extra' ? 1 : 0; // 1h extra si es comp-extra
        }
        // Turno normal: usar horas del departamento
        return config.horasPorDia || tiposTurno[turno]?.horas || 8;
    }
    
    static aplicarCompensacionDomingos(turnos, domingosTrabajados, config) {
        if (!config.compensacionFinSemana || domingosTrabajados.length === 0) {
            return;
        }
        
        let compensacionesAplicadas = 0;
        const diasPreferidos = [2, 3, 4]; // Mar, Mié, Jue
        
        // Buscar días para compensar
        for (let turno of turnos) {
            if (compensacionesAplicadas >= domingosTrabajados.length) break;
            
            const diaSemana = turno.fecha.getDay();
            
            // Cambiar día preferido a descanso compensado
            if (diasPreferidos.includes(diaSemana) && 
                !['descanso', 'descanso-compensado', 'vacaciones', 'baja', 'festivo'].includes(turno.turno)) {
                
                turno.turno = 'descanso-compensado';
                turno.horas = 0;
                turno.compensacion = {
                    tipo: 'domingo',
                    razon: 'Compensación por trabajo en domingo'
                };
                compensacionesAplicadas++;
            }
        }
    }
    
    static aplicarCompensacionFestivos(turnos, festivosTrabajados, config) {
        if (!config.compensacionFestivo || festivosTrabajados.length === 0) {
            return;
        }
        
        let compensacionesAplicadas = 0;
        const diasPreferidos = [2, 3, 4]; // Mar, Mié, Jue
        
        // Buscar días para descanso + extra
        for (let turno of turnos) {
            if (compensacionesAplicadas >= festivosTrabajados.length) break;
            
            const diaSemana = turno.fecha.getDay();
            const esFestivo = this.esFestivo(turno.fecha);
            
            // Cambiar día preferido a descanso + 1h extra
            if (diasPreferidos.includes(diaSemana) && 
                !esFestivo &&
                !['descanso', 'descanso-compensado', 'descanso-comp-extra', 'vacaciones', 'baja'].includes(turno.turno)) {
                
                turno.turno = 'descanso-comp-extra';
                turno.horas = 1; // 1 hora extra
                turno.compensacion = {
                    tipo: 'festivo',
                    razon: 'Compensación por trabajo en festivo (descanso + 1h extra)'
                };
                compensacionesAplicadas++;
            }
        }
    }
}
```

---

## 3. Nuevos Tipos de Turno

```javascript
const tiposTurno = {
    // ... existentes ...
    
    'festivo': {
        inicial: 'F',
        nombre: 'Festivo',
        color: '#fef3c7',
        horario: '-',
        horas: 0
    },
    'festivo-guardia': {
        inicial: 'FG',
        nombre: 'Festivo Guardia',
        color: '#fecaca',
        horario: '08:00-16:00',
        horas: 6.5 // O según departamento
    },
    'domingo-guardia': {
        inicial: 'DG',
        nombre: 'Domingo Guardia',
        color: '#fed7aa',
        horario: '08:00-16:00',
        horas: 6.5
    },
    'descanso-compensado': {
        inicial: 'DC',
        nombre: 'Descanso Compensado',
        color: '#c4b5fd',
        horario: '-',
        horas: 0,
        razon: 'Por domingo trabajado'
    },
    'descanso-comp-extra': {
        inicial: 'DCE',
        nombre: 'Descanso + Extra',
        color: '#a5b4fc',
        horario: '-',
        horas: 1,
        razon: 'Por festivo trabajado (1h extra)'
    }
};
```

---

## 4. Validaciones

```javascript
static validarCumplimientoMensual(empleadoId, turnos, config) {
    const diagnostico = {
        valido: true,
        errores: [],
        advertencias: [],
        resumen: {}
    };
    
    // Contar turnos por tipo
    const conteos = {
        trabajados: turnos.filter(t => t.turno !== 'descanso' && 
                                        t.turno !== 'vacaciones' && 
                                        t.turno !== 'baja' &&
                                        !t.turno.includes('compensado')).length,
        descansos: turnos.filter(t => t.turno === 'descanso').length,
        descansos_comp: turnos.filter(t => t.turno === 'descanso-compensado').length,
        descansos_comp_extra: turnos.filter(t => t.turno === 'descanso-comp-extra').length,
        domingosTrabajados: turnos.filter(t => t.turno === 'domingo-guardia').length,
        festivosTrabajados: turnos.filter(t => t.turno === 'festivo-guardia').length
    };
    
    // Validar compensaciones
    if (conteos.domingosTrabajados !== conteos.descansos_comp) {
        diagnostico.errores.push(
            `Desbalance: ${conteos.domingosTrabajados} domingos trabajados ` +
            `vs ${conteos.descansos_comp} compensaciones`
        );
    }
    
    if (conteos.festivosTrabajados !== conteos.descansos_comp_extra) {
        diagnostico.errores.push(
            `Desbalance: ${conteos.festivosTrabajados} festivos trabajados ` +
            `vs ${conteos.descansos_comp_extra} compensaciones`
        );
    }
    
    // Calcular horas totales
    const horasTotales = turnos.reduce((sum, t) => sum + t.horas, 0);
    const diasTrabajados = conteos.trabajados - conteos.descansos_comp_extra; // Excluir los que son "extra"
    const horasEsperadas = diasTrabajados * config.horasPorDia;
    
    if (Math.abs(horasTotales - horasEsperadas) > 2) {
        diagnostico.advertencias.push(
            `Horas: esperadas ~${horasEsperadas}h, reales ${horasTotales}h (diferencia: ${horasTotales - horasEsperadas}h)`
        );
    }
    
    diagnostico.resumen = {
        diasTrabajados: conteos.trabajados,
        descansos: conteos.descansos,
        descansos_compensacion: conteos.descansos_comp,
        descansos_comp_extra: conteos.descansos_comp_extra,
        horasTotales: horasTotales,
        horasEsperadas: horasEsperadas
    };
    
    diagnostico.valido = diagnostico.errores.length === 0;
    
    return diagnostico;
}
```

---

## 5. Ejemplo Práctico

### Cuadrante Ideal (Diciembre 2025 - Limpieza)

```
SEMANA 1:
Lun 1:  Mañana (6.5h)
Mar 2:  Mañana (6.5h)
Mié 3:  Mañana (6.5h)
Jue 4:  Mañana (6.5h)
Vie 5:  Mañana (6.5h)
Sáb 6:  Mañana (6.5h) = 39h
Dom 7:  Descanso

SEMANA 2:
Lun 8:  Mañana (6.5h)
Mar 9:  Descanso Comp (0h)  ← Porque trabaja el 15 (domingo)
Mié 10: Mañana (6.5h)
Jue 11: Mañana (6.5h)
Vie 12: Mañana (6.5h)
Sáb 13: Mañana (6.5h)
Dom 14: Descanso

SEMANA 3:
Lun 15: Mañana (6.5h)
Mar 16: Mañana (6.5h)
Mié 17: Mañana (6.5h)
Jue 18: Mañana (6.5h)
Vie 19: Mañana (6.5h)
Sáb 20: Mañana (6.5h)
Dom 21: Domingo Guardia (6.5h)  ← Trabaja fin de semana

SEMANA 4:
Lun 22: Mañana (6.5h)
Mar 23: Descanso Comp (0h)  ← Compensación por domingo 21
Mié 24: Mañana (6.5h)
Jue 25: Festivo Guardia (6.5h)  ← Navidad, pero trabaja
Vie 26: Mañana (6.5h)
Sáb 27: Mañana (6.5h)
Dom 28: Descanso

SEMANA 5:
Lun 29: Mañana (6.5h)
Mar 30: Descanso Comp+Extra (1h)  ← Compensación por festivo 25
Mié 31: -

✅ TOTAL: 156h aproximado
   - 24 días trabajados × 6.5h = 156h
   - 2 domingos guardia → 2 descansos compensación
   - 1 festivo guardia → 1 descanso + 1h extra
```

---

## 6. Testing en Consola

```javascript
// Ver configuración
console.log(configuracionDepartamentos['Limpieza']);

// Generar turnos para un empleado Limpieza
const empleado = empleados.find(e => e.departamento === 'Limpieza');
const turnos = TurnoManager.generarTurnosEmpleado(empleado, 31);

// Validar
const validacion = TurnoManager.validarCumplimientoMensual(
    empleado.id,
    turnos,
    configuracionDepartamentos['Limpieza']
);
console.log('Validación:', validacion);

// Ver resumen
console.table(validacion.resumen);
```

---

## 7. Implementación (Fase)

### ✅ FASE 1 - Básica (Inmediata)
- [ ] Agregar `configuracionDepartamentos`
- [ ] Agregar `DIAS_FESTIVOS`
- [ ] Modificar `generarTurnosEmpleado()` principal
- [ ] Crear `esFestivo()`
- [ ] Crear `generarPatronDepartamento()`
- [ ] Crear `calcularHorasTurno()`

### ✅ FASE 2 - Compensaciones
- [ ] Crear `aplicarCompensacionDomingos()`
- [ ] Crear `aplicarCompensacionFestivos()`
- [ ] Agregar nuevos tipos de turno

### ✅ FASE 3 - Validaciones
- [ ] Crear `validarCumplimientoMensual()`
- [ ] Tests en consola

### ✅ FASE 4 - UI (Opcional)
- [ ] Mostrar indicador de compensaciones pendientes
- [ ] Dashboard de alertas
