# 💰 Sistema Completo de Turnos + Compensación Económica - Limpieza

## Requisitos Confirmados

### Horas y Estructura
- **Horas semanales**: 39 horas
- **Días de trabajo**: 6 días  
- **Descanso fijo**: 1 día/semana

### Compensaciones por Guardia

| Situación | Descanso | Dinero Extra |
|-----------|----------|-------------|
| Domingo Normal | Sí | €0 |
| **Domingo Guardia** | +1 día (Mar-Jue) | **+€15/día** (solo dinero, no horas) |
| Festivo Normal | Sí | €0 |
| **Festivo Guardia** | +1 día (Mar-Jue) + 1h extra | **+€20/día** (solo dinero, no horas) |

---

## 1. Configuración Ampliada

```javascript
const configuracionDepartamentos = {
    'Limpieza': {
        horasPorSemana: 39,
        diasTrabajo: 6,
        diaDescansoFijo: 1,
        pattern: 'seis-uno',
        horasPorDia: 6.5,
        compensacionFinSemana: true,
        compensacionFestivo: true,
        // 🆕 COMPENSACIÓN ECONÓMICA
        compensacionEconomica: {
            domingoGuardia: 15,      // €15 por trabajar domingo
            festivoGuardia: 20       // €20 por trabajar festivo
        }
    },
    'Cocina': {
        horasPorSemana: 40,
        diasTrabajo: 5,
        diaDescansoFijo: 2,
        pattern: 'cinco-dos',
        horasPorDia: 8,
        compensacionFinSemana: false,
        compensacionFestivo: false,
        compensacionEconomica: {
            domingoGuardia: 0,
            festivoGuardia: 0
        }
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

## 2. Estructura de Datos - Objeto Turno

```javascript
{
    dia: 21,
    turno: 'domingo-guardia',
    horas: 6.5,
    fecha: Date,
    esFinSemana: true,
    departamento: 'Limpieza',
    config: { /* configuración */ },
    
    // 🆕 COMPENSACIÓN
    compensacion: {
        tipo: 'domingo',                    // 'domingo' | 'festivo'
        descanso: true,                     // Se libra otro día
        dineroExtra: 15,                    // €15 o €20
        razon: 'Guardia domingo',
        aplicada: false                     // Tracking de si se aplicó
    }
}
```

---

## 3. Función Principal Mejorada

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
        
        const patron = this.generarPatronDepartamento(empleado, config);
        let domingosTrabajados = [];
        let festivosTrabajados = [];
        
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fechaObj = new Date(fechaBase);
            fechaObj.setDate(dia);
            const diaSemana = fechaObj.getDay();
            
            let turno;
            let compensacion = null;
            
            // ===== ESTADOS ESPECIALES =====
            if (empleado.estado === 'vacaciones' && dia <= 15) {
                turno = 'vacaciones';
            } else if (empleado.estado === 'baja') {
                turno = 'baja';
            }
            // ===== DÍAS FESTIVOS =====
            else if (this.esFestivo(fechaObj)) {
                if (Math.random() > 0.2) {
                    turno = 'festivo';
                } else {
                    turno = 'festivo-guardia';
                    compensacion = {
                        tipo: 'festivo',
                        descanso: true,
                        dineroExtra: config.compensacionEconomica.festivoGuardia,
                        razon: 'Guardia en festivo',
                        aplicada: false
                    };
                    festivosTrabajados.push({ dia, fechaObj });
                }
            }
            // ===== DOMINGOS =====
            else if (diaSemana === 0) {
                if (Math.random() > 0.5) {
                    turno = 'domingo-guardia';
                    compensacion = {
                        tipo: 'domingo',
                        descanso: true,
                        dineroExtra: config.compensacionEconomica.domingoGuardia,
                        razon: 'Guardia domingo',
                        aplicada: false
                    };
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
            
            const horas = this.calcularHorasTurno(turno, config);
            
            turnos.push({
                dia: dia,
                turno: turno,
                horas: horas,
                fecha: fechaObj,
                esFinSemana: diaSemana === 0 || diaSemana === 6,
                departamento: empleado.departamento,
                config: config,
                compensacion: compensacion
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
            return [turno, turno, turno, turno, turno, turno, 'descanso'];
        } else if (config.pattern === 'cinco-dos') {
            return [turno, turno, turno, turno, turno, 'descanso', 'descanso'];
        }
        return [turno, 'descanso'];
    }
    
    static calcularHorasTurno(turno, config) {
        if (['descanso', 'libre', 'vacaciones', 'baja', 'festivo'].includes(turno)) {
            return 0;
        }
        if (turno === 'descanso-compensado') {
            return 0; // Solo descanso, sin extra
        }
        if (turno === 'descanso-comp-extra') {
            return 1; // 1 hora extra por festivo
        }
        return config.horasPorDia || tiposTurno[turno]?.horas || 8;
    }
    
    static aplicarCompensacionDomingos(turnos, domingosTrabajados, config) {
        if (!config.compensacionFinSemana || domingosTrabajados.length === 0) {
            return;
        }
        
        let compensacionesAplicadas = 0;
        const diasPreferidos = [2, 3, 4];
        
        for (let turno of turnos) {
            if (compensacionesAplicadas >= domingosTrabajados.length) break;
            
            const diaSemana = turno.fecha.getDay();
            
            if (diasPreferidos.includes(diaSemana) && 
                !['descanso', 'descanso-compensado', 'vacaciones', 'baja', 'festivo'].includes(turno.turno)) {
                
                turno.turno = 'descanso-compensado';
                turno.horas = 0;
                turno.compensacion = {
                    tipo: 'domingo-comp',
                    descanso: true,
                    dineroExtra: 0,  // Solo descanso, sin dinero adicional
                    razon: 'Compensación por trabajo en domingo',
                    aplicada: true
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
        const diasPreferidos = [2, 3, 4];
        
        for (let turno of turnos) {
            if (compensacionesAplicadas >= festivosTrabajados.length) break;
            
            const diaSemana = turno.fecha.getDay();
            const esFestivo = this.esFestivo(turno.fecha);
            
            if (diasPreferidos.includes(diaSemana) && 
                !esFestivo &&
                !['descanso', 'descanso-compensado', 'descanso-comp-extra', 'vacaciones', 'baja'].includes(turno.turno)) {
                
                turno.turno = 'descanso-comp-extra';
                turno.horas = 1; // 1 hora extra
                turno.compensacion = {
                    tipo: 'festivo-comp',
                    descanso: true,
                    dineroExtra: 0,  // Solo descanso + 1h, sin dinero adicional
                    razon: 'Compensación por trabajo en festivo (descanso + 1h extra)',
                    aplicada: true
                };
                compensacionesAplicadas++;
            }
        }
    }
}
```

---

## 4. Nuevos Tipos de Turno (Actualizado)

```javascript
const tiposTurno = {
    // ... existentes ...
    
    'festivo': {
        inicial: 'F',
        nombre: 'Festivo',
        color: '#fef3c7',
        horario: '-',
        horas: 0,
        descripcion: 'Día festivo sin trabajar'
    },
    'festivo-guardia': {
        inicial: 'FG',
        nombre: 'Festivo Guardia',
        color: '#fecaca',
        horario: '08:00-16:00',
        horas: 6.5,
        descripcion: 'Trabaja festivo',
        extra: {
            descanso: 1,        // 1 día descanso
            dinero: 20,         // €20 extra
            horasExtra: 1       // 1 hora extra
        }
    },
    'domingo-guardia': {
        inicial: 'DG',
        nombre: 'Domingo Guardia',
        color: '#fed7aa',
        horario: '08:00-16:00',
        horas: 6.5,
        descripcion: 'Trabaja domingo',
        extra: {
            descanso: 1,        // 1 día descanso
            dinero: 15,         // €15 extra
            horasExtra: 0       // Sin horas extra
        }
    },
    'descanso-compensado': {
        inicial: 'DC',
        nombre: 'Descanso Compensado',
        color: '#c4b5fd',
        horario: '-',
        horas: 0,
        descripcion: 'Día libre por trabajar domingo'
    },
    'descanso-comp-extra': {
        inicial: 'DCE',
        nombre: 'Descanso + Extra',
        color: '#a5b4fc',
        horario: '-',
        horas: 1,
        descripcion: 'Día libre + 1h extra por trabajar festivo'
    }
};
```

---

## 5. Sistema de Nómina - Cálculo de Compensación

```javascript
class NominaManager {
    
    static calcularCompensacionEmpleado(empleadoId, turnos, mes, año) {
        const empleado = empleados.find(e => e.id === empleadoId);
        if (!empleado) return null;
        
        const nomina = {
            empleado: empleado.nombre,
            departamento: empleado.departamento,
            mes: mes,
            año: año,
            
            // Base
            horasBase: 0,
            tarifaBase: empleado.tarifaHoraBase || 10, // €/hora default
            sueldoBase: 0,
            
            // Compensaciones
            domingosTrabajados: 0,
            compensacionDomingos: 0,      // €15 × domingos
            
            festivosTrabajados: 0,
            compensacionFestivos: 0,       // €20 × festivos
            
            horasExtra: 0,
            compensacionHorasExtra: 0,    // €10 × horas extra (si aplica)
            
            totalCompensacion: 0,
            sueldoTotal: 0,
            
            detalles: []
        };
        
        // Analizar turnos
        turnos.forEach(turno => {
            // Horas base
            if (turno.turno !== 'descanso' && 
                turno.turno !== 'vacaciones' && 
                turno.turno !== 'baja' &&
                !turno.turno.includes('compensado') &&
                turno.turno !== 'festivo' &&
                turno.turno !== 'descanso-comp-extra') {
                
                nomina.horasBase += turno.horas;
            }
            
            // Compensaciones
            if (turno.turno === 'domingo-guardia') {
                nomina.domingosTrabajados++;
                nomina.compensacionDomingos += 15;
                nomina.detalles.push({
                    dia: turno.dia,
                    tipo: 'Domingo Guardia',
                    compensacion: 15
                });
            }
            
            if (turno.turno === 'festivo-guardia') {
                nomina.festivosTrabajados++;
                nomina.compensacionFestivos += 20;
                nomina.detalles.push({
                    dia: turno.dia,
                    tipo: 'Festivo Guardia',
                    compensacion: 20
                });
            }
            
            // Horas extra por compensación festivo
            if (turno.turno === 'descanso-comp-extra') {
                nomina.horasExtra += turno.horas;
                // Las horas extra se pagan a tarifa especial (ej: 50% más)
            }
        });
        
        // Cálculos
        nomina.sueldoBase = nomina.horasBase * nomina.tarifaBase;
        nomina.compensacionHorasExtra = nomina.horasExtra * (nomina.tarifaBase * 1.5);
        nomina.totalCompensacion = nomina.compensacionDomingos + 
                                   nomina.compensacionFestivos + 
                                   nomina.compensacionHorasExtra;
        nomina.sueldoTotal = nomina.sueldoBase + nomina.totalCompensacion;
        
        return nomina;
    }
    
    static generarNominaHTML(nomina) {
        return `
            <div style="font-family: Arial; padding: 20px; background: #f5f5f5;">
                <h2>NÓMINA - ${nomina.mes}/${nomina.año}</h2>
                <p><strong>Empleado:</strong> ${nomina.empleado} (${nomina.departamento})</p>
                
                <hr>
                <h3>SUELDO BASE</h3>
                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <td>Horas Base:</td>
                        <td>${nomina.horasBase} h × €${nomina.tarifaBase}/h</td>
                        <td style="text-align:right;"><strong>€${nomina.sueldoBase.toFixed(2)}</strong></td>
                    </tr>
                </table>
                
                <hr>
                <h3>COMPENSACIONES</h3>
                <table style="width:100%; border-collapse: collapse;">
                    <tr>
                        <td>Domingos Trabajados:</td>
                        <td>${nomina.domingosTrabajados} × €15</td>
                        <td style="text-align:right;"><strong>€${nomina.compensacionDomingos.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                        <td>Festivos Trabajados:</td>
                        <td>${nomina.festivosTrabajados} × €20</td>
                        <td style="text-align:right;"><strong>€${nomina.compensacionFestivos.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                        <td>Horas Extra:</td>
                        <td>${nomina.horasExtra} h × €${(nomina.tarifaBase * 1.5).toFixed(2)}/h</td>
                        <td style="text-align:right;"><strong>€${nomina.compensacionHorasExtra.toFixed(2)}</strong></td>
                    </tr>
                </table>
                
                <hr>
                <h3 style="text-align:right;">
                    TOTAL COMPENSACIÓN: €${nomina.totalCompensacion.toFixed(2)}
                </h3>
                <h2 style="text-align:right; color: #059669;">
                    SUELDO TOTAL: €${nomina.sueldoTotal.toFixed(2)}
                </h2>
                
                <hr>
                <h4>DETALLE DE COMPENSACIONES</h4>
                <table style="width:100%; border-collapse: collapse; font-size:12px;">
                    <tr style="background:#ddd;">
                        <th>Día</th>
                        <th>Tipo</th>
                        <th>Compensación</th>
                    </tr>
                    ${nomina.detalles.map(d => `
                        <tr>
                            <td>${d.dia}</td>
                            <td>${d.tipo}</td>
                            <td>€${d.compensacion}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }
}
```

---

## 6. Validaciones Extendidas

```javascript
static validarCompensacionEconomica(empleadoId, turnos, config) {
    const diagnostico = {
        valido: true,
        errores: [],
        advertencias: [],
        resumen: {},
        nomina: null
    };
    
    const conteos = {
        domingosTrabajados: turnos.filter(t => t.turno === 'domingo-guardia').length,
        festivosTrabajados: turnos.filter(t => t.turno === 'festivo-guardia').length,
        descansos_comp_domingo: turnos.filter(t => t.turno === 'descanso-compensado').length,
        descansos_comp_festivo: turnos.filter(t => t.turno === 'descanso-comp-extra').length,
    };
    
    // Validar descansos compensados
    if (conteos.domingosTrabajados !== conteos.descansos_comp_domingo) {
        diagnostico.errores.push(
            `DESCANSOS: ${conteos.domingosTrabajados} domingos vs ` +
            `${conteos.descansos_comp_domingo} compensaciones`
        );
    }
    
    if (conteos.festivosTrabajados !== conteos.descansos_comp_festivo) {
        diagnostico.errores.push(
            `DESCANSOS: ${conteos.festivosTrabajados} festivos vs ` +
            `${conteos.descansos_comp_festivo} compensaciones`
        );
    }
    
    // Calcular compensación económica
    const compensacionDomingos = conteos.domingosTrabajados * config.compensacionEconomica.domingoGuardia;
    const compensacionFestivos = conteos.festivosTrabajados * config.compensacionEconomica.festivoGuardia;
    const totalCompensacion = compensacionDomingos + compensacionFestivos;
    
    diagnostico.resumen = {
        domingosTrabajados: conteos.domingosTrabajados,
        festivosTrabajados: conteos.festivosTrabajados,
        compensacionDomingos: `€${compensacionDomingos}`,
        compensacionFestivos: `€${compensacionFestivos}`,
        totalCompensacion: `€${totalCompensacion}`
    };
    
    diagnostico.valido = diagnostico.errores.length === 0;
    
    return diagnostico;
}
```

---

## 7. Ejemplo de Nómina (Diciembre 2025 - Limpieza)

```
╔═══════════════════════════════════════════════════════════════╗
║                    NÓMINA - DICIEMBRE 2025                    ║
║              Empleado: Antonio Jiménez                        ║
║              Departamento: Limpieza                           ║
╠═══════════════════════════════════════════════════════════════╣

SUELDO BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Horas Base:  156h × €10/h = €1,560.00

COMPENSACIONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Domingos Trabajados:  2 × €15 = €30.00
  Festivos Trabajados:  1 × €20 = €20.00
  Horas Extra:          1h × €15 = €15.00
                        ─────────────────
  TOTAL COMPENSACIÓN:              €65.00

╠═══════════════════════════════════════════════════════════════╣
║            SUELDO TOTAL: €1,625.00                            ║
╚═══════════════════════════════════════════════════════════════╝

DETALLE DE COMPENSACIONES
┌─────┬──────────────────┬────────────────┐
│ Día │ Tipo             │ Compensación   │
├─────┼──────────────────┼────────────────┤
│ 7   │ Domingo Guardia  │ €15            │
│ 14  │ Domingo Guardia  │ €15            │
│ 25  │ Festivo Guardia  │ €20            │
└─────┴──────────────────┴────────────────┘
```

---

## 8. Checklist Final

```javascript
// ✅ Configuración
const configuracionDepartamentos = {
    'Limpieza': {
        compensacionEconomica: {
            domingoGuardia: 15,
            festivoGuardia: 20
        }
    }
};

// ✅ Tipos de Turno
'domingo-guardia'       // €15
'festivo-guardia'       // €20 + 1h extra

// ✅ Funciones
TurnoManager.generarTurnosEmpleado()          ✅
TurnoManager.aplicarCompensacionDomingos()    ✅
TurnoManager.aplicarCompensacionFestivos()    ✅

// ✅ Nómina
NominaManager.calcularCompensacionEmpleado()  ✅
NominaManager.generarNominaHTML()             ✅

// ✅ Validaciones
TurnoManager.validarCompensacionEconomica()   ✅
```

---

**Resumen de Compensación Económica:**
- 🎯 Domingo guardia = €15 (solo dinero, sin horas)
- 🎯 Festivo guardia = €20 (solo dinero, sin horas)
- 🎯 Se suma automáticamente a la nómina
- 🎯 Se descuenta el dinero del turno normal (es compensación, no extra)
