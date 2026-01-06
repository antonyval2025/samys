# 🔧 GUÍA DE DIAGNÓSTICO - FALLOS EN TESTING FASE 1

## Status Actual
- ✅ Script insertado en HTML (línea 1581)
- ✅ Archivo existe: `js/controles-sidebar-semana3.js`
- ✅ Auto-inicialización agregada
- ❌ Tests siguen fallando - **INVESTIGANDO**

---

## 📊 Páginas de Diagnóstico Disponibles

### 1. **test_fase1.html** (Actualizado)
- URL: `http://localhost:8000/test_fase1.html`
- Tiene nuevo "Test 0: Verificación de Dependencias"
- Muestra qué dependencias faltan

### 2. **diagnostico_avanzado.html** (NUEVO)
- URL: `http://localhost:8000/diagnostico_avanzado.html`
- Diagrama visual del problema
- Forzar init manual
- Ver estado actual

### 3. **nuevo_cuadrante_mejorado.html** (App principal)
- URL: `http://localhost:8000/nuevo_cuadrante_mejorado.html`
- Abre consola (F12)
- Ejecutar DIAGNOSTICO_RAPIDO_FASE1.js

---

## 🔍 Checklist de Diagnóstico

### En `diagnostico_avanzado.html`:

1. **Paso 1: Verificación de carga**
   - [ ] `document.readyState` = ?
   - [ ] `typeof SidebarSemana3Module` = 'object' ✅
   - [ ] `typeof ModuleManager` = 'object' ✅
   - [ ] `ModuleManager.get('SidebarSemana3Module')` = encontrado ✅

2. **Paso 3: Forzar Init**
   - [ ] Hacer clic "Forzar Init"
   - [ ] Si sale error → módulo no se cargó
   - [ ] Si sale ok → revisar estado en Paso 4

3. **Paso 4: Estado Actual**
   - [ ] `isInitialized` = true ✅
   - [ ] Dependencias mostradas
   - [ ] Contar cuántas dependencias faltan

### En `test_fase1.html`:

1. **Test 0: Verificación de Dependencias**
   - [ ] Ver qué está disponible vs qué falta
   - [ ] Si todas dicen ✅ → problema es en módulo
   - [ ] Si algunas dicen ❌ → no se cargan las dependencias

### En navegador (Consola F12):

Buscar estos logs (copiar/pegar en test_fase1.html):
```javascript
ModuleManager.get("SidebarSemana3Module").validarDependencias()
```

Debería devolver objeto con estados true/false.

---

## 🎯 Posibles Causas

### Causa 1: Las dependencias no se cargan
**Síntomas:**
- Test 0 muestra ❌ para AnalizadorConflictos, MetricasModule, etc.

**Solución:**
- Verificar que estos archivos existen:
  - `js/analizador-conflictos.js`
  - `js/dashboard-analytica.js`
  - `js/optimizador-turnos.js`

### Causa 2: ModuleManager no existe
**Síntomas:**
- Test 0 muestra `typeof ModuleManager` = 'undefined'
- Paso 1 en diagnostico_avanzado falla

**Solución:**
- Verificar que `js/modules.js` carga ANTES
- Ver línea ~1499 en nuevo_cuadrante_mejorado.html

### Causa 3: El módulo no se registra en ModuleManager
**Síntomas:**
- `ModuleManager.get('SidebarSemana3Module')` = undefined
- Pero SidebarSemana3Module existe globalmente

**Solución:**
- Revisar línea 287-289 de controles-sidebar-semana3.js
- Debe tener: `ModuleManager.register('SidebarSemana3Module', SidebarSemana3Module)`

### Causa 4: init() nunca se ejecuta
**Síntomas:**
- `isInitialized` = false
- Pero ModuleManager.get devuelve el módulo

**Solución:**
- Revisar líneas 291-304 de controles-sidebar-semana3.js
- Deben tener código de auto-init con DOMContentLoaded

---

## 📋 Checklist de Verificación Rápida

```javascript
// 1. En consola del navegador, copiar esto:
ModuleManager.get('SidebarSemana3Module')

// Si devuelve undefined → módulo no registrado
// Si devuelve objeto → continuar

// 2. Si existe, ejecutar:
ModuleManager.get('SidebarSemana3Module').obtenerEstado()

// Debería devolver:
// {
//   isInitialized: true,
//   dependencias: { ... },
//   modalesCreados: { ... }
// }

// Si isInitialized = false → init() no se ejecutó

// 3. Si falta init(), ejecutar manualmente:
ModuleManager.get('SidebarSemana3Module').init()

// 4. Luego ejecutar tests:
ModuleManager.get('SidebarSemana3Module').abrirAnalisis()
```

---

## 🚨 Acción Inmediata

Abre **diagnostico_avanzado.html** y haz clic en estos botones EN ORDEN:

1. "Ejecutar" en Paso 1 → **¿Qué dice cada línea?**
2. "Ejecutar" en Paso 2 → **¿Readystate?**
3. "Forzar Init" en Paso 3 → **¿Error o éxito?**
4. "Ejecutar" en Paso 4 → **¿isInitialized?**

---

## 📞 Información a reportar

Cuando reportes el problema, incluye:

```
DIAGNÓSTICO FASE 1:

Paso 1:
- document.readyState: [COPIAR]
- typeof SidebarSemana3Module: [COPIAR]
- typeof ModuleManager: [COPIAR]
- ModuleManager.get(): [COPIAR]

Paso 3:
- Resultado de "Forzar Init": [COPIAR ERROR O "OK"]

Paso 4:
- isInitialized: [true/false]
- Dependencias disponibles: [X/7]

Consola (F12):
- ¿Hay algún error rojo?
- ¿Qué último log ves antes del error?
```

---

## 🎓 Entender el Flow

```
Timeline:
00:00 → HTML carga
00:50 → Scripts cargan (incluyendo controles-sidebar-semana3.js)
01:00 → const SidebarSemana3Module = (function() { ... })()
01:50 → if (typeof ModuleManager !== 'undefined') { register() } ← AQUÍ se registra
02:00 → if (document.readyState === 'loading') { addEventListener } ← AQUÍ espera
02:50 → DOMContentLoaded evento dispara
03:00 → setTimeout( → SidebarSemana3Module.init(), 500) ← AQUÍ se inicializa
```

Si algo en este timeline falla → los tests fallarán.

---

**Próximo paso:** Abre diagnostico_avanzado.html y reporta qué ves en cada paso.
