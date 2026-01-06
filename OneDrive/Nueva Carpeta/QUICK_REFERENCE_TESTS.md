# 📌 QUICK REFERENCE - PROBLEMAS POR ARCHIVO

## test-semana-1.html
```
Status: ⚠️ WARNING
Tests: 6
Problemas: 5 (3 CRÍTICA, 1 WARNING, 1 INFO)
```

| Línea | Tipo | Problema | Fix |
|-------|------|----------|-----|
| 85 | 🔴 | `js/validador-datos.js` not found | Create file |
| 86 | 🔴 | `js/auto-save.js` not found | Create file |
| 87 | 🔴 | `js/tab-sync.js` not found | Create file |
| 162 | 🟠 | validarTurno() structure mismatch | Verify signature |
| 177 | 🟡 | typeof check for ES6 class | Should be 'object' |

---

## test-semana-2.html
```
Status: ❌ ERROR
Tests: 6
Problemas: 5 (3 CRÍTICA, 1 WARNING, 1 INFO)
```

| Línea | Tipo | Problema | Fix |
|-------|------|----------|-----|
| 95 | 🔴 | `js/generador-reportes.js` not found | Create file |
| 96 | 🔴 | `js/integracion-whatsapp.js` not found | Create file |
| 97 | 🔴 | `js/sincronizacion-datos.js` not found | Create file |
| 136 | 🟠 | Map vs Array inconsistency | Use JSON.stringify(Array.from(Map)) |
| 118 | 🟡 | Phone format non-standard | Use +34XXXXXXXXX |

---

## test-semana-3.html
```
Status: ❌ ERROR
Tests: 6
Problemas: 5 (3 CRÍTICA, 2 WARNING)
```

| Línea | Tipo | Problema | Fix |
|-------|------|----------|-----|
| 95 | 🔴 | `js/analizador-conflictos.js` not found | Create file |
| 96 | 🔴 | `js/dashboard-analytica.js` not found | Create file |
| 97 | 🔴 | `js/optimizador-turnos.js` not found | Create file |
| **110-124** | 🟠 | **14 turnos noche consecutivos** (ILLEGAL) | **Reduce to 7-8 + breaks** |
| 206 | 🟠 | Return type mismatch (string vs object) | Standardize response |

---

## test-semana-4.html ⚠️ CRITICAL
```
Status: ❌ ERROR
Tests: 18
Problemas: 6 (4 CRÍTICA, 1 WARNING, 1 INFO)
```

| Línea | Tipo | Problema | Fix |
|-------|------|----------|-----|
| **273** | 🔴 | `/js/gestor-multilocal.js` ← WRONG PATH | `js/gestor-multilocal.js` |
| **274** | 🔴 | `/js/integracion-calendario.js` ← WRONG PATH | `js/integracion-calendario.js` |
| **275** | 🔴 | `/js/sistema-notificaciones.js` ← WRONG PATH | `js/sistema-notificaciones.js` |
| 273-275 | 🔴 | 3 files don't exist (after path fix) | Create all 3 |
| 291 | 🟠 | AppState undefined | Add mock before line 273 |
| 380 | 🟡 | Hardcoded date '2025-01-01' | Use new Date().getFullYear() |

---

## test-semana-5.html ⚠️ CRITICAL
```
Status: ❌ ERROR
Tests: 18
Problemas: 6 (4 CRÍTICA, 1 WARNING, 1 INFO)
```

| Línea | Tipo | Problema | Fix |
|-------|------|----------|-----|
| **247** | 🔴 | `/js/dashboard-avanzado-s5.js` ← WRONG PATH | `js/dashboard-avanzado-s5.js` |
| **248** | 🔴 | `/js/sistema-auditoria-s5.js` ← WRONG PATH | `js/sistema-auditoria-s5.js` |
| **249** | 🔴 | `/js/gestor-backups-s5.js` ← WRONG PATH | `js/gestor-backups-s5.js` |
| 247-249 | 🔴 | 3 files don't exist (after path fix) | Create all 3 |
| **203** | 🟠 | Mock returns `{exito:true}` only | Expand with `id, registros, sospechosas[]` |
| 450 | 🟡 | Test expects `sospechosas[]` in response | Add to mock |

---

## 🔧 ONE-LINER FIXES

### For VS Code (Find & Replace with Ctrl+H):

**Fix all absolute paths:**
```
Search:  src="/js/
Replace: src="js/
File:    test-semana-*.html
Result:  6 replacements (lines 273-275 in s4, 247-249 in s5)
```

**Command line (PowerShell):**
```powershell
# Fix path issue in test-semana-4.html
(Get-Content "test-semana-4.html") -replace 'src="/js/', 'src="js/' | Set-Content "test-semana-4.html"

# Fix path issue in test-semana-5.html
(Get-Content "test-semana-5.html") -replace 'src="/js/', 'src="js/' | Set-Content "test-semana-5.html"
```

---

## 📊 DEPENDENCY MATRIX

### What modules are loaded by each test:

| Module | S1 | S2 | S3 | S4 | S5 |
|--------|----|----|----|----|-----|
| validador-datos | ✅ | - | - | - | - |
| auto-save | ✅ | - | - | - | - |
| tab-sync | ✅ | - | - | - | - |
| generador-reportes | - | ✅ | - | - | - |
| integracion-whatsapp | - | ✅ | - | - | - |
| sincronizacion-datos | - | ✅ | - | - | - |
| analizador-conflictos | - | - | ✅ | - | - |
| dashboard-analytica | - | - | ✅ | - | - |
| optimizador-turnos | - | - | ✅ | - | - |
| gestor-multilocal | - | - | - | ✅ | - |
| integracion-calendario | - | - | - | ✅ | - |
| sistema-notificaciones | - | - | - | ✅ | - |
| dashboard-avanzado-s5 | - | - | - | - | ✅ |
| sistema-auditoria-s5 | - | - | - | - | ✅ |
| gestor-backups-s5 | - | - | - | - | ✅ |

**Total modules required:** 15
**Current status:** 0/15 (0%)

---

## ✅ IMPLEMENTATION CHECKLIST

### Before starting:
- [ ] Read ANALISIS_TESTS_COMPLETO.json (detailed)
- [ ] Read ANALISIS_TESTS_SEMANA1-5_REPORTE.md (executive summary)
- [ ] Read this file (quick reference)

### Phase 1 - Fixes (10 minutes):
- [ ] Create js/ folder
- [ ] Fix test-semana-3.html lines 110-124 (turnos noche)
- [ ] Fix test-semana-4.html lines 273-275 (remove /)
- [ ] Fix test-semana-5.html lines 247-249 (remove /)
- [ ] Expand mock in test-semana-5.html line 203

### Phase 2 - Create modules (14-18 hours):
- [ ] Semana 1: 3 modules (1-2 hours)
- [ ] Semana 2: 3 modules (2-3 hours)
- [ ] Semana 3: 3 modules (2-3 hours)
- [ ] Semana 4: 3 modules (3-4 hours)
- [ ] Semana 5: 3 modules (3-4 hours)

### Phase 3 - Validate (2-3 hours):
- [ ] test-semana-1.html → 6/6 tests pass
- [ ] test-semana-2.html → 6/6 tests pass
- [ ] test-semana-3.html → 6/6 tests pass
- [ ] test-semana-4.html → 18/18 tests pass
- [ ] test-semana-5.html → 18/18 tests pass

---

## 🚀 EXPECTED RESULTS AFTER FIX

### Semana 1 expected to pass tests:
- ✅ Test 1: ValidadorDatos.validarEmpleado() with valid data
- ✅ Test 2: ValidadorDatos.validarEmpleado() with invalid email
- ✅ Test 3: AutoSaveManager initialization
- ✅ Test 4: TabSyncManager ID and listeners
- ✅ Test 5: ValidadorDatos.validarTurno() validations
- ✅ Test 6: Module integration check

### Semana 2 expected to pass tests:
- ✅ Test 1: GeneradorReportes.generarReporteMensual()
- ✅ Test 2: GeneradorReportes.generarReporteEmpleado()
- ✅ Test 3: IntegracionWhatsApp.validarTelefono()
- ✅ Test 4: IntegracionWhatsApp.formatearTelefonoWhatsApp()
- ✅ Test 5: SincronizacionDatos initialization
- ✅ Test 6: SincronizacionDatos.crearBackupLocal()

### Semana 3 expected to pass tests:
- ✅ Test 1: AnalizadorConflictos initialization
- ✅ Test 2: AnalizadorConflictos.analizarEmpleado()
- ✅ Test 3: DashboardAnalytica initialization
- ✅ Test 4: DashboardAnalytica charts generation
- ✅ Test 5: OptimizadorTurnos initialization
- ✅ Test 6: OptimizadorTurnos.obtenerMejorSugerencia()

### Semana 4 expected to pass tests (18 total):
- ✅ GestorMultiLocal: 6 tests
- ✅ IntegracionCalendario: 6 tests
- ✅ SistemaNotificaciones: 6 tests

### Semana 5 expected to pass tests (18 total):
- ✅ DashboardAvanzado: 6 tests
- ✅ SistemaAuditoriaAvanzado: 6 tests
- ✅ GestorBackups: 6 tests

**Total expected passing: 60/60 tests (100%)**

---

**Last updated:** 2025-01-02
**Analysis type:** Complete HTML/JavaScript test suite
**Files analyzed:** 5
**Documents generated:** 4
