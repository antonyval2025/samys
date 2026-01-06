# 🗺️ MAPA VISUAL DE PROBLEMAS

## test-semana-1.html (5 problemas)

```
Línea 1:    <!DOCTYPE html>
Línea 2:    <html lang="es">
...
Línea 85:   <script src="js/validador-datos.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe
            Necesita: js/validador-datos.js con clase ValidadorDatos

Línea 86:   <script src="js/auto-save.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe
            Necesita: js/auto-save.js con clase AutoSaveManager

Línea 87:   <script src="js/tab-sync.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe
            Necesita: js/tab-sync.js con clase TabSyncManager

...

Línea 162:  const result5 = {
                validarTurnoMañana: ValidadorDatos.validarTurno({
                    empleadoId: 1,
                    turno: 'mañana',
                    dia: 5,
                    mes: 1,     ⬅️ 🟠 WARNING: Estructura puede no coincidir
                    anio: 2026  ⬅️ 🟠 WARNING: Verificar firma del método
                }),

Línea 177:  validadorCargado: typeof ValidadorDatos === 'function',
            ⬆️ 🟡 INFO: Debería ser 'object' para clases ES6
            Cambiar a: typeof ValidadorDatos === 'object'
```

---

## test-semana-2.html (5 problemas)

```
Línea 1:    <!DOCTYPE html>
...
Línea 95:   <script src="js/generador-reportes.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

Línea 96:   <script src="js/integracion-whatsapp.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

Línea 97:   <script src="js/sincronizacion-datos.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

...

Línea 118:  { 
                id: 1, 
                nombre: 'Juan García', 
                email: 'juan@test.com', 
                telefono: '645123456',     ⬅️ 🟡 INFO: Sin formato E.164 (+34XXXXXXXXX)
                horasContrato: 160,
                departamento: 'Operaciones',
                estado: 'activo'
            },

Línea 136:  scheduleData: new Map([
                [1, [
                    { dia: 1, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
                ]],
            ]),
            ⬆️ 🟠 WARNING: Map se convierte a Array en localStorage pero no se reconvierte
```

---

## test-semana-3.html (5 problemas)

```
Línea 1:    <!DOCTYPE html>
...
Línea 95:   <script src="js/analizador-conflictos.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

Línea 96:   <script src="js/dashboard-analytica.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

Línea 97:   <script src="js/optimizador-turnos.js"></script>
            ⬆️ ❌ CRÍTICA: Archivo no existe

...

Línea 110:  [1, [
Línea 111:      { dia: 1, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
Línea 112:      { dia: 2, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #1
Línea 113:      { dia: 3, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #2
Línea 114:      { dia: 4, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #3
Línea 115:      { dia: 5, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #4
Línea 116:      { dia: 6, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #5
Línea 117:      { dia: 7, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #6
Línea 118:      { dia: 8, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #7
Línea 119:      { dia: 9, turno: 'noche', mes: 0, anio: 2026, horas: 8 },   ⬅️ Turno noche #8
Línea 120:      { dia: 10, turno: 'noche', mes: 0, anio: 2026, horas: 8 },  ⬅️ Turno noche #9
Línea 121:      { dia: 11, turno: 'noche', mes: 0, anio: 2026, horas: 8 },  ⬅️ Turno noche #10
Línea 122:      { dia: 12, turno: 'noche', mes: 0, anio: 2026, horas: 8 },  ⬅️ Turno noche #11
Línea 123:      { dia: 13, turno: 'noche', mes: 0, anio: 2026, horas: 8 },  ⬅️ Turno noche #12
Línea 124:      { dia: 14, turno: 'noche', mes: 0, anio: 2026, horas: 8 },  ⬅️ Turno noche #13
Línea 125:      { dia: 15, turno: 'descanso', mes: 0, anio: 2026, horas: 0 }
            ⬆️ ❌ CRÍTICA: 14 TURNOS NOCTURNOS CONSECUTIVOS
               VIOLACIÓN LEGAL: Máximo legal es ~12-14 POR MES (no consecutivos)
               SOLUCIÓN: Reducir a 7-8 + agregar descansos

Línea 206:  const graficoTurnos = DashboardAnalytica.generarGraficoTurnos();
            const passed4 = typeof graficoDistribucion === 'string' && 
                           graficoDistribucion.includes('DISTRIBUCIÓN') &&
                           typeof graficoTurnos === 'string' &&
                           graficoTurnos.includes('TURNOS');
            ⬆️ 🟠 WARNING: Espera string pero podría ser objeto
```

---

## test-semana-4.html ⚠️ CRÍTICA (6 problemas)

```
Línea 1:    <!DOCTYPE html>
...
Línea 273:  <script src="/js/gestor-multilocal.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" (raíz absoluta) - INCORRECTA
                           Solo funciona en servidor HTTP, no en file://
                           Cambiar a: src="js/gestor-multilocal.js"

Línea 274:  <script src="/js/integracion-calendario.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" (raíz absoluta) - INCORRECTA
                           Cambiar a: src="js/integracion-calendario.js"

Línea 275:  <script src="/js/sistema-notificaciones.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" (raíz absoluta) - INCORRECTA
                           Cambiar a: src="js/sistema-notificaciones.js"

Línea 273-275: Incluso si se corrigen rutas:
            ⬆️ ❌ CRÍTICA: 3 ARCHIVOS NO EXISTEN

...

Línea 291:  // ✅ CREAR VARIABLE GLOBAL empleados PARA TESTS
            if (typeof empleados === 'undefined') {
                window.empleados = [...]
            }
            // PERO NO SE DEFINE APPSTATE
            ⬆️ 🟠 WARNING: AppState puede ser undefined si tests lo necesitan

...

Línea 380:  const año = new Date().getFullYear();
            const esFestivo = IntegracionCalendario.esFestivo('2025-01-01');
            ⬆️ 🟡 INFO: Fecha hardcodeada '2025-01-01' puede no ser correcta en años futuros
```

---

## test-semana-5.html ⚠️ CRÍTICA (6 problemas)

```
Línea 1:    <!DOCTYPE html>
...
Línea 203:  // Mock SistemaAuditoriaAvanzado
            window.SistemaAuditoriaAvanzado = {
                registrarCambio: function() { return {exito: true}; }
            };
            ⬆️ 🟠 WARNING: Mock demasiado simple - falta estructura:
                           - No retorna 'id'
                           - No retorna 'timestamp'
                           - No tiene método 'detectarActividadesSospechosas'
                           - No retorna 'sospechosas: []'

...

Línea 247:  <script src="/js/dashboard-avanzado-s5.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" - INCORRECTA
                           Cambiar a: src="js/dashboard-avanzado-s5.js"

Línea 248:  <script src="/js/sistema-auditoria-s5.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" - INCORRECTA
                           Cambiar a: src="js/sistema-auditoria-s5.js"

Línea 249:  <script src="/js/gestor-backups-s5.js"></script>
            ⬆️ ❌ CRÍTICA: RUTA CON "/" - INCORRECTA
                           Cambiar a: src="js/gestor-backups-s5.js"

Línea 247-249: Incluso si se corrigen rutas:
            ⬆️ ❌ CRÍTICA: 3 ARCHIVOS NO EXISTEN

...

Línea 450:  const resultado = SistemaAuditoriaAvanzado.detectarActividadesSospechosas();
            const paso = resultado.exito;
            testsAuditoria.push({
                nombre: 'Detectar Sospechosas',
                descripcion: 'Debe detectar actividades sospechosas',
                resultado: `${resultado.sospechosas.length} alertas`,  ⬅️ Mock NO tiene .sospechosas
                paso: paso
            });
            ⬆️ 🟡 INFO: Test espera resultado.sospechosas pero mock no lo retorna
```

---

## 📊 RESUMEN DE LOCALIZACIONES

### ❌ ARCHIVOS FALTANTES (15 total)
```
Semana 1: js/validador-datos.js (L85), js/auto-save.js (L86), js/tab-sync.js (L87)
Semana 2: js/generador-reportes.js (L95), js/integracion-whatsapp.js (L96), js/sincronizacion-datos.js (L97)
Semana 3: js/analizador-conflictos.js (L95), js/dashboard-analytica.js (L96), js/optimizador-turnos.js (L97)
Semana 4: js/gestor-multilocal.js (L273), js/integracion-calendario.js (L274), js/sistema-notificaciones.js (L275)
Semana 5: js/dashboard-avanzado-s5.js (L247), js/sistema-auditoria-s5.js (L248), js/gestor-backups-s5.js (L249)
```

### ❌ RUTAS INCORRECTAS (6 total)
```
test-semana-4.html L273-275: /js/ → js/ (3 cambios)
test-semana-5.html L247-249: /js/ → js/ (3 cambios)

TOTAL: 6 reemplazos con buscar/reemplazar
```

### ❌ DATOS INVÁLIDOS (1 total)
```
test-semana-3.html L110-124: 14 turnos noche consecutivos → reducir a 7-8
```

### ❌ MOCKS INCOMPLETOS (1 total)
```
test-semana-5.html L203: Expandir SistemaAuditoriaAvanzado mock
```

### 🟠 WARNINGS (7 total)
```
test-semana-1.html L162: Estructura validarTurno puede no coincidir
test-semana-2.html L136: Map vs Array inconsistencia
test-semana-3.html L206: Tipo de retorno esperado es string
test-semana-4.html L291: AppState no definido
test-semana-5.html L203: Mock muy simple
```

### 🟡 INFO (3 total)
```
test-semana-1.html L177: typeof debería ser 'object'
test-semana-2.html L118: Teléfono sin formato estándar
test-semana-4.html L380: Fecha hardcodeada
```

---

## ✅ CHECKLIST DE CORRECCIONES POR LÍNEA

### test-semana-1.html
- [ ] L85: Crear js/validador-datos.js
- [ ] L86: Crear js/auto-save.js
- [ ] L87: Crear js/tab-sync.js
- [ ] L162: Verificar firma de validarTurno()
- [ ] L177: Cambiar typeof check a 'object'

### test-semana-2.html
- [ ] L95: Crear js/generador-reportes.js
- [ ] L96: Crear js/integracion-whatsapp.js
- [ ] L97: Crear js/sincronizacion-datos.js
- [ ] L118: Estandarizar formato de teléfono
- [ ] L136: Verificar conversión Map/Array

### test-semana-3.html
- [ ] L95: Crear js/analizador-conflictos.js
- [ ] L96: Crear js/dashboard-analytica.js
- [ ] L97: Crear js/optimizador-turnos.js
- [ ] L110-124: Cambiar 14 turnos noche a 7-8 + descansos
- [ ] L206: Estandarizar tipo de retorno

### test-semana-4.html
- [ ] L273: Cambiar `/js/gestor-multilocal.js` → `js/gestor-multilocal.js`
- [ ] L274: Cambiar `/js/integracion-calendario.js` → `js/integracion-calendario.js`
- [ ] L275: Cambiar `/js/sistema-notificaciones.js` → `js/sistema-notificaciones.js`
- [ ] L273-275: Crear los 3 archivos
- [ ] L291: Agregar mock AppState
- [ ] L380: Usar año dinámico en esFestivo()

### test-semana-5.html
- [ ] L203: Expandir mock SistemaAuditoriaAvanzado
- [ ] L247: Cambiar `/js/dashboard-avanzado-s5.js` → `js/dashboard-avanzado-s5.js`
- [ ] L248: Cambiar `/js/sistema-auditoria-s5.js` → `js/sistema-auditoria-s5.js`
- [ ] L249: Cambiar `/js/gestor-backups-s5.js` → `js/gestor-backups-s5.js`
- [ ] L247-249: Crear los 3 archivos

---

**Total de cambios necesarios: 23 (incluyendo 15 creaciones + 8 correcciones)**
