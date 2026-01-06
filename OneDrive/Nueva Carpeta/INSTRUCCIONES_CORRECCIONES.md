# 🔧 CORRECCIONES ESPECÍFICAS PARA IMPLEMENTAR

## ARCHIVOS A CORREGIR INMEDIATAMENTE

### 1. test-semana-4.html
**Archivo:** `c:\Users\samys\OneDrive\Nueva Carpeta\test-semana-4.html`

#### Cambio 1 - Línea 273
```html
❌ ANTES:
<script src="/js/gestor-multilocal.js"></script>

✅ DESPUÉS:
<script src="js/gestor-multilocal.js"></script>
```

#### Cambio 2 - Línea 274
```html
❌ ANTES:
<script src="/js/integracion-calendario.js"></script>

✅ DESPUÉS:
<script src="js/integracion-calendario.js"></script>
```

#### Cambio 3 - Línea 275
```html
❌ ANTES:
<script src="/js/sistema-notificaciones.js"></script>

✅ DESPUÉS:
<script src="js/sistema-notificaciones.js"></script>
```

#### Cambio 4 - Agregar AppState (antes de línea 273)
Insertar antes del bloque de scripts:
```html
    <script>
        // Mock AppState para tests si no está disponible
        if (typeof AppState === 'undefined') {
            window.AppState = {
                currentMonth: 0,
                currentYear: 2025,
                scheduleData: new Map(),
                saveToStorage: function() {}
            };
        }
    </script>
```

---

### 2. test-semana-5.html
**Archivo:** `c:\Users\samys\OneDrive\Nueva Carpeta\test-semana-5.html`

#### Cambio 1 - Línea 247
```html
❌ ANTES:
<script src="/js/dashboard-avanzado-s5.js"></script>

✅ DESPUÉS:
<script src="js/dashboard-avanzado-s5.js"></script>
```

#### Cambio 2 - Línea 248
```html
❌ ANTES:
<script src="/js/sistema-auditoria-s5.js"></script>

✅ DESPUÉS:
<script src="js/sistema-auditoria-s5.js"></script>
```

#### Cambio 3 - Línea 249
```html
❌ ANTES:
<script src="/js/gestor-backups-s5.js"></script>

✅ DESPUÉS:
<script src="js/gestor-backups-s5.js"></script>
```

#### Cambio 4 - Línea 203 (Expandir mock)
```javascript
❌ ANTES:
        // Mock SistemaAuditoriaAvanzado
        window.SistemaAuditoriaAvanzado = {
            registrarCambio: function() { return {exito: true}; }
        };

✅ DESPUÉS:
        // Mock SistemaAuditoriaAvanzado
        window.SistemaAuditoriaAvanzado = {
            registrarCambio: function(tipo, op, ant, new_val, user, motivo) { 
                return {
                    exito: true, 
                    id: 'audit-' + Date.now(),
                    timestamp: new Date().toISOString()
                }; 
            },
            obtenerHistorial: function() {
                return {
                    exito: true,
                    registros: [],
                    total: 0
                };
            },
            analizarActividadUsuario: function(user) {
                return {
                    exito: true,
                    estadisticas: {
                        totalOperaciones: 0
                    }
                };
            },
            detectarActividadesSospechosas: function() {
                return {
                    exito: true,
                    sospechosas: []
                };
            },
            generarReporteAuditoria: function(inicio, fin) {
                return {
                    exito: true,
                    html: '<html>REPORTE</html>',
                    nombreArchivo: 'reporte-auditoria.html'
                };
            },
            limpiarRegistrosAntiguos: function(dias) {
                return {
                    exito: true,
                    mensaje: 'Limpieza completada'
                };
            }
        };
```

---

### 3. test-semana-3.html
**Archivo:** `c:\Users\samys\OneDrive\Nueva Carpeta\test-semana-3.html`

#### Cambio 1 - Línea 110-124 (Corregir datos de prueba)
```javascript
❌ ANTES:
                    [1, [
                        { dia: 1, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
                        { dia: 2, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 3, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 4, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 5, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 6, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 7, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 8, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 9, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 10, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 11, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 12, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 13, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 14, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 15, turno: 'descanso', mes: 0, anio: 2026, horas: 0 }
                    ]],

✅ DESPUÉS:
                    [1, [
                        { dia: 1, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
                        { dia: 2, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 3, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 4, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 5, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 6, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 7, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 8, turno: 'noche', mes: 0, anio: 2026, horas: 8 },
                        { dia: 9, turno: 'descanso', mes: 0, anio: 2026, horas: 0 },
                        { dia: 10, turno: 'descanso', mes: 0, anio: 2026, horas: 0 },
                        { dia: 11, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
                        { dia: 12, turno: 'mañana', mes: 0, anio: 2026, horas: 8 },
                        { dia: 13, turno: 'tarde', mes: 0, anio: 2026, horas: 8 },
                        { dia: 14, turno: 'tarde', mes: 0, anio: 2026, horas: 8 },
                        { dia: 15, turno: 'descanso', mes: 0, anio: 2026, horas: 0 }
                    ]],
```

**Razonamiento:** 14 turnos nocturnos consecutivos viola la ley de protección laboral (máximo ~12-14 por mes, no consecutivos). Se corrige a 8 consecutivos + descanso.

---

## ARCHIVOS A CREAR

### Estructura de carpeta necesaria:
```
c:\Users\samys\OneDrive\Nueva Carpeta\
├── js/  ← CREAR ESTA CARPETA
│   ├── validador-datos.js
│   ├── auto-save.js
│   ├── tab-sync.js
│   ├── generador-reportes.js
│   ├── integracion-whatsapp.js
│   ├── sincronizacion-datos.js
│   ├── analizador-conflictos.js
│   ├── dashboard-analytica.js
│   ├── optimizador-turnos.js
│   ├── gestor-multilocal.js
│   ├── integracion-calendario.js
│   ├── sistema-notificaciones.js
│   ├── dashboard-avanzado-s5.js
│   ├── sistema-auditoria-s5.js
│   └── gestor-backups-s5.js
├── test-semana-1.html (LEER)
├── test-semana-2.html (LEER)
├── test-semana-3.html (EDITAR)
├── test-semana-4.html (EDITAR)
└── test-semana-5.html (EDITAR)
```

---

## ORDEN DE EJECUCIÓN RECOMENDADO

### Paso 1: Crear carpeta (30s)
```powershell
New-Item -ItemType Directory -Path "c:\Users\samys\OneDrive\Nueva Carpeta\js" -Force
```

### Paso 2: Corregir rutas en test-semana-4.html (2 min)
Editar líneas 273-275

### Paso 3: Corregir rutas en test-semana-5.html (2 min)
Editar líneas 247-249 + línea 203

### Paso 4: Corregir datos en test-semana-3.html (2 min)
Editar líneas 110-124

### Paso 5: Crear archivos vacíos en js/ (1 min)
```powershell
@(
    'validador-datos',
    'auto-save',
    'tab-sync',
    'generador-reportes',
    'integracion-whatsapp',
    'sincronizacion-datos',
    'analizador-conflictos',
    'dashboard-analytica',
    'optimizador-turnos',
    'gestor-multilocal',
    'integracion-calendario',
    'sistema-notificaciones',
    'dashboard-avanzado-s5',
    'sistema-auditoria-s5',
    'gestor-backups-s5'
) | ForEach-Object {
    New-Item -ItemType File -Path "c:\Users\samys\OneDrive\Nueva Carpeta\js\$_.js" -Force | Out-Null
}
```

### Paso 6: Validar cambios (2 min)
- Abrir cada test-semana-X.html en navegador
- Presionar F12 para abrir DevTools
- Verificar que NO hay errores en la consola al cargar

---

## VERIFICACIÓN POST-CAMBIOS

Después de realizar cada corrección, verificar:

```javascript
// En consola del navegador (F12):

// 1. Verificar que empleados existe
console.log(typeof empleados);  // debe retornar "object"

// 2. Verificar que AppState existe (semana 4 y 5)
console.log(typeof AppState);   // debe retornar "object"

// 3. Verificar que archivos se intentan cargar
console.log(document.scripts);  // revisar que las rutas sean correctas

// 4. Verificar que no hay ReferenceError en la consola
// Si ves: "ReferenceError: ValidadorDatos is not defined"
// Significa que el módulo no se cargó correctamente
```

---

## RESUMEN DE CAMBIOS

| Archivo | Línea(s) | Cambio | Impacto |
|---------|----------|--------|--------|
| test-semana-3.html | 110-124 | Reducir turnos noche de 14 a 8 | Datos válidos |
| test-semana-4.html | 273-275 | Cambiar `/js/` a `js/` | Rutas relativas funcionan |
| test-semana-4.html | Antes de 273 | Agregar mock AppState | Tests no fallan por AppState undefined |
| test-semana-5.html | 203 | Expandir mock SistemaAuditoriaAvanzado | Tests obtienen estructura correcta |
| test-semana-5.html | 247-249 | Cambiar `/js/` a `js/` | Rutas relativas funcionan |
| NUEVA CARPETA | N/A | Crear `js/` con 15 archivos | Módulos pueden ser implementados |

**Tiempo total estimado:** 10 minutos

---

## ⚡ QUICK FIX SCRIPT

Si usas VS Code, puedes automatizar los reemplazos con Find & Replace (Ctrl+H):

```
BUSCAR:     src="/js/
REEMPLAZAR: src="js/
ARCHIVOS:   test-semana-*.html
```

Esto reemplazará automáticamente las 6 rutas incorrectas.

---

**FIN DE INSTRUCCIONES DE CORRECCIÓN**
