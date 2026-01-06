# ✅ CHECKLIST RÁPIDA DE CORRECCIONES

**Generado**: 2 de enero de 2026  
**Archivos a Corregir**: 5  
**Total de Cambios**: 5 áreas con 7 líneas/métodos afectados  

---

## 🔴 CORRECCIONES CRÍTICAS (HACER HOY)

### [ ] Error #1: `colaNotiicaciones` → `colaNotificaciones`
**Archivo**: `js/sistema-notificaciones.js`

- [ ] **Línea 24**: Cambiar declaración
  ```javascript
  // Antes:
  static colaNotiicaciones = [];
  // Después:
  static colaNotificaciones = [];
  ```

- [ ] **Línea 249**: Actualizar en `encolarEmailNotificacion()`
  ```javascript
  // Antes:
  this.colaNotiicaciones.push({
  // Después:
  this.colaNotificaciones.push({
  ```

- [ ] **Línea 270**: Actualizar en `encolarSMSNotificacion()`
  ```javascript
  // Antes:
  this.colaNotiicaciones.push({
  // Después:
  this.colaNotificaciones.push({
  ```

**Validación**:
```javascript
// En consola del navegador:
console.assert(Array.isArray(SistemaNotificaciones.colaNotificaciones));
// Debe mostrar: true ✅
```

---

### [ ] Error #2: Inconsistencia de nombre de método `cargarFestivos`
**Archivo**: `js/integracion-calendario.js`

- [ ] **Opción A (Recomendada)**: Cambiar DEFINICIÓN (línea 28) para usar ñ
  ```javascript
  // Antes (línea 28):
  static cargarFestivosEspana() {
  
  // Después:
  static cargarFestivosEspaña() {
  ```
  *(La llamada en línea 21 ya está correcta: `this.cargarFestivosEspaña();`)*

**O**

- [ ] **Opción B**: Cambiar LLAMADA (línea 21) para no usar ñ
  ```javascript
  // Antes (línea 21):
  this.cargarFestivosEspaña();
  
  // Después:
  this.cargarFestivosEspana();
  ```
  *(La definición en línea 28 ya está correcta sin ñ)*

**Seleccionar una opción e implementar SOLO una**

**Validación**:
```javascript
// En consola del navegador:
console.assert(typeof IntegracionCalendario.cargarFestivosEspaña === 'function');
// Debe mostrar: true ✅
```

---

## 🟠 CORRECCIONES MEDIAS (ANTES DEL VIERNES)

### [ ] Error #3: `desviacioEstantdar` → `desviacionEstandar`
**Archivo**: `js/dashboard-analytica.js`

- [ ] **Línea 65**: Cambiar nombre de propiedad
  ```javascript
  // Antes:
  equidad: {
      indiceGini: 0,
      desviacioEstantdar: 0,
      coeficienteVariacion: 0
  }
  
  // Después:
  equidad: {
      indiceGini: 0,
      desviacionEstandar: 0,
      coeficienteVariacion: 0
  }
  ```

**Validación**:
```javascript
// En consola:
console.assert('desviacionEstandar' in DashboardAnalytica.metricas.equidad);
// Debe mostrar: true ✅
```

---

### [ ] Error #4: `carrasArray` → `cargasArray`
**Archivo**: `js/optimizador-turnos.js`

- [ ] **Línea 104**: Cambiar en declaración
  ```javascript
  // Antes:
  const carrasArray = Object.values(cargas);
  // Después:
  const cargasArray = Object.values(cargas);
  ```

- [ ] **Línea 105**: Cambiar en primer uso
  ```javascript
  // Antes:
  const promedio = carrasArray.reduce((a, b) => a + b.horas, 0) / carrasArray.length;
  // Después:
  const promedio = cargasArray.reduce((a, b) => a + b.horas, 0) / cargasArray.length;
  ```

- [ ] **Línea 107**: Cambiar en segundo uso
  ```javascript
  // Antes:
  carrasArray.reduce((sum, c) => sum + Math.pow(c.horas - promedio, 2), 0) / carrasArray.length
  // Después:
  cargasArray.reduce((sum, c) => sum + Math.pow(c.horas - promedio, 2), 0) / cargasArray.length
  ```

- [ ] **Línea 110**: Cambiar en forEach
  ```javascript
  // Antes:
  carrasArray.forEach((carga, index) => {
  // Después:
  cargasArray.forEach((carga, index) => {
  ```

**Validación**: Revisar código visualmente (4 cambios realizados)

---

### [ ] Error #5: Implementar cálculo de `desviacionEstandar`
**Archivo**: `js/dashboard-analytica.js`

- [ ] **Después de línea 140** (en método `calcularMetricas()`): Agregar cálculo
  ```javascript
  // Agregar este código después del cálculo de Gini:
  
  if (dataEmpleados.length > 0) {
      const promedio = parseFloat(this.metricas.horas.promedio);
      
      // Calcular desviación estándar
      const sumaCuadrados = dataEmpleados.reduce((sum, e) => {
          return sum + Math.pow(e.horas - promedio, 2);
      }, 0);
      
      const varianza = sumaCuadrados / dataEmpleados.length;
      this.metricas.equidad.desviacionEstandar = Math.sqrt(varianza).toFixed(2);
      
      // Coeficiente de variación
      this.metricas.equidad.coeficienteVariacion = 
          (parseFloat(this.metricas.equidad.desviacionEstandar) / promedio * 100).toFixed(2);
  }
  ```

**Validación**:
```javascript
// En consola:
DashboardAnalytica.calcularMetricas();
console.log(DashboardAnalytica.metricas.equidad.desviacionEstandar);
// Debe mostrar un número mayor a 0 (no 0)
```

---

## 📋 CHECKLIST DE VALIDACIÓN FINAL

Después de realizar todos los cambios:

- [ ] **Paso 1**: Guardar todos los archivos
- [ ] **Paso 2**: Refrescar página del navegador (F5)
- [ ] **Paso 3**: Abrir consola (F12)
- [ ] **Paso 4**: Ejecutar validaciones:

```javascript
// Copiar y pegar en consola:

console.log("=== VERIFICACIÓN DE CORRECCIONES ===\n");

// Verificar Error #1
console.log("1. SistemaNotificaciones.colaNotificaciones:");
console.assert(Array.isArray(SistemaNotificaciones.colaNotificaciones), "❌ Error");
console.log("✅ OK\n");

// Verificar Error #2
console.log("2. IntegracionCalendario.festivos:");
try {
    IntegracionCalendario.cargarFestivosEspaña();
    console.assert(IntegracionCalendario.festivosGlobales.length > 0, "❌ Error");
    console.log("✅ OK\n");
} catch(e) {
    console.error("❌ Método no existe:", e.message, "\n");
}

// Verificar Error #3
console.log("3. DashboardAnalytica.desviacionEstandar:");
console.assert('desviacionEstandar' in DashboardAnalytica.metricas.equidad, "❌ Error");
console.log("✅ OK\n");

// Verificar Error #4 + #5
console.log("4. Recalcular métricas:");
DashboardAnalytica.calcularMetricas();
console.log("Desviación Estándar:", DashboardAnalytica.metricas.equidad.desviacionEstandar);
console.assert(parseFloat(DashboardAnalytica.metricas.equidad.desviacionEstandar) >= 0, "❌ Error");
console.log("✅ OK\n");

console.log("=== TODAS LAS CORRECCIONES VERIFICADAS ===");
```

---

## 🎯 RESUMEN RÁPIDO

| Error | Archivo | Línea(s) | Cambio | Tiempo |
|-------|---------|----------|--------|--------|
| #1 | sistema-notificaciones.js | 24,249,270 | 3 reemplazos | 2 min |
| #2 | integracion-calendario.js | 21,28 | 1 reemplazo (escoger opción) | 1 min |
| #3 | dashboard-analytica.js | 65 | 1 reemplazo | 1 min |
| #4 | optimizador-turnos.js | 104,105,107,110 | 4 reemplazos | 2 min |
| #5 | dashboard-analytica.js | 140+ | Agregar código | 5 min |

**TIEMPO TOTAL**: ~11 minutos

---

## 🔄 MÉTODO RÁPIDO CON FIND & REPLACE

Si prefieres usar Find & Replace en VS Code:

### 1. Corregir `colaNotiicaciones` (3 reemplazos)
- **Find**: `colaNotiicaciones`
- **Replace**: `colaNotificaciones`
- **File**: `js/sistema-notificaciones.js`
- **Click**: Replace All (3 matches)

### 2. Corregir método festivos (1 reemplazo)
- **Find**: `cargarFestivosEspaña()`
- **Replace**: `cargarFestivosEspana()`
- **File**: `js/integracion-calendario.js`
- **Click**: Replace (1 match)

### 3. Corregir `desviacioEstantdar` (1 reemplazo)
- **Find**: `desviacioEstantdar`
- **Replace**: `desviacionEstandar`
- **File**: `js/dashboard-analytica.js`
- **Click**: Replace (1 match)

### 4. Corregir `carrasArray` (4 reemplazos)
- **Find**: `carrasArray`
- **Replace**: `cargasArray`
- **File**: `js/optimizador-turnos.js`
- **Click**: Replace All (4 matches)

### 5. Agregar cálculo (Manual)
- Editar `js/dashboard-analytica.js`
- Ir a línea 140
- Agregar código de cálculo (ver arriba)

---

## ⏱️ CRONOGRAMA RECOMENDADO

```
HOY (antes de las 5 PM):
├─ 10 min: Errores #1 y #2 (críticos)
└─ 5 min: Validación en navegador

MAÑANA:
├─ 10 min: Errores #3 y #4 (medios)
├─ 5 min: Error #5 - implementar cálculo
└─ 30 min: Testing completo

VIERNES:
└─ Revisión final y documentación
```

---

## 🆘 SI ALGO FALLA

1. **Error de sintaxis**: Verificar que los cambios están exactamente iguales
2. **Consola dice "undefined"**: Refrescar la página (F5)
3. **Método no encontrado**: Verificar que el nombre exacto sea idéntico
4. **Validación falla**: Usar script `validador-errores.js` para más detalles

---

## 📞 REFERENCIAS RÁPIDAS

- **Guía completa**: Ver `GUIA_CORRECCION_ERRORES.md`
- **Validador automático**: Ejecutar `validador-errores.js` en consola
- **Reporte JSON**: Ver `ANALISIS_ERRORES_JS.json`
- **Detalles técnicos**: Ver `REPORTE_TECNICO_DETALLADO.md`

---

**¡Listo para empezar!** Marca las casillas a medida que completes cada paso.

