# 🧪 PLAN DE TESTING - Opción 3: WhatsApp Masivo

**Inicio Testing**: 3 de enero de 2026
**Tester**: Sistema Automático + Manual
**Versión**: v11 - Opción 3

---

## 📋 Test Cases a Ejecutar

### TC001: Interfaz Inicial Carga Correctamente
**Descripción**: Verificar que la aplicación carga sin errores
**Pasos**:
1. Abrir nuevo_cuadrante_mejorado.html en navegador
2. Esperar a que DOM se cargue completamente
3. Verificar que cuadrante se muestra

**Criterios de Éxito**:
- ✅ Sin errores en consola
- ✅ Interfaz completamente visible
- ✅ Botones funcionan

**Status**: [ ] NOT STARTED

---

### TC002: Filtrado de Empleados (Departamento)
**Descripción**: Verificar que los filtros funcionan correctamente
**Pasos**:
1. Abrir sección "Cuadrante General"
2. Seleccionar un departamento en filtro
3. Verificar que tabla actualiza

**Criterios de Éxito**:
- ✅ Tabla muestra solo empleados del departamento
- ✅ Conteo correcto de empleados

**Status**: [ ] NOT STARTED

---

### TC003: Apertura Modal WhatsApp Masivo
**Descripción**: Verificar que modal de confirmación abre correctamente
**Pasos**:
1. Hacer clic en "📤 Enviar por WhatsApp Masivo"
2. Verificar que modal abre con lista de empleados
3. Validar que muestra teléfonos

**Criterios de Éxito**:
- ✅ Modal aparece superpuesto
- ✅ Lista de empleados visible
- ✅ Teléfonos mostrados correctamente

**Status**: [ ] NOT STARTED

---

### TC004: Notificación Inicial
**Descripción**: Verificar que notificación inicial aparece al comenzar envío
**Pasos**:
1. Confirmar envío masivo
2. Observar notificación que aparece arriba-derecha
3. Leer mensaje de instrucción

**Criterios de Éxito**:
- ✅ Notificación aparece en 0.5s
- ✅ Mensaje contiene: "Descargas", "WhatsApp Web"
- ✅ Auto-cierre en 4s

**Status**: [ ] NOT STARTED

---

### TC005: Modal de Progreso Aparece
**Descripción**: Verificar que modal de progreso muestra correctamente
**Pasos**:
1. Después de notificación inicial
2. Observar modal gris con barra de progreso
3. Verificar título y texto de estado

**Criterios de Éxito**:
- ✅ Modal aparece centrado
- ✅ Barra visible (inicialmente 0%)
- ✅ Texto "Preparando envíos..."

**Status**: [ ] NOT STARTED

---

### TC006: Barra de Progreso Actualiza
**Descripción**: Verificar que barra de progreso avanza correctamente
**Pasos**:
1. Observar barra mientras procesa empleados
2. Verificar que avanza porcentualmente
3. Validar nombres de empleados muestren (N/Total)

**Criterios de Éxito**:
- ✅ Barra avanza en pasos (20%, 40%, 60%, 80%)
- ✅ Nombre del empleado se actualiza
- ✅ Contador (1/3, 2/3, 3/3) correcto

**Status**: [ ] NOT STARTED

---

### TC007: Descarga de PDF
**Descripción**: Verificar que PDF se descarga correctamente
**Pasos**:
1. Monitorear carpeta Descargas
2. Verificar que archivo PDF aparece
3. Validar nombre: Cuadrante_[Nombre]_[Mes]_[Año].pdf

**Criterios de Éxito**:
- ✅ PDF descargado (>200KB)
- ✅ Nombre sigue patrón correcto
- ✅ Se descarga 1 por empleado

**Status**: [ ] NOT STARTED

---

### TC008: Descarga de iCalendar
**Descripción**: Verificar que archivo iCalendar se descarga correctamente
**Pasos**:
1. Monitorear carpeta Descargas
2. Verificar que archivo .ics aparece
3. Validar nombre: Turnos_[Nombre]_[Mes]_[Año].ics

**Criterios de Éxito**:
- ✅ iCalendar descargado (10-20KB)
- ✅ Nombre sigue patrón correcto
- ✅ Delay ~300ms entre PDF e iCalendar
- ✅ Se descarga 1 por empleado

**Status**: [ ] NOT STARTED

---

### TC009: WhatsApp Abre Automáticamente
**Descripción**: Verificar que WhatsApp se abre con mensaje pre-redactado
**Pasos**:
1. Esperar a que archivos se descarguen
2. Observar si pestaña de WhatsApp se abre
3. Verificar mensaje en chat

**Criterios de Éxito**:
- ✅ WhatsApp abre (~1.3s después de descargas)
- ✅ Mensaje contiene nombre del empleado
- ✅ Mensaje contiene datos de horas
- ✅ Número correcto en URL

**Status**: [ ] NOT STARTED

---

### TC010: Instrucciones en Modal Al 100%
**Descripción**: Verificar que instrucciones aparecen al completar
**Pasos**:
1. Esperar a que barra llegue a 100%
2. Observar que aparece sección con instrucciones
3. Leer los 5 pasos numerados

**Criterios de Éxito**:
- ✅ Sección aparece con background azul
- ✅ Título: "📌 Instrucciones para adjuntar archivos:"
- ✅ 5 pasos numerados visibles
- ✅ Menciona PDF (.pdf) e iCalendar (.ics)

**Status**: [ ] NOT STARTED

---

### TC011: Intento de Apertura de Explorador
**Descripción**: Verificar que se intenta abrir explorador (fallback si es necesario)
**Pasos**:
1. Después de 100% y instrucciones
2. Observar si explorador abre a carpeta Descargas
3. Si no abre, verificar tooltip flotante

**Criterios de Éxito**:
- ✅ Explorador abre (Opción ideal), O
- ✅ Tooltip flotante aparece con "Presiona Win + E"
- ✅ Instrucción clara visible

**Status**: [ ] NOT STARTED

---

### TC012: Notificación Final Estructurada
**Descripción**: Verificar que notificación final contiene pasos claros
**Pasos**:
1. Modal desaparece después de 2s
2. Observar notificación verde
3. Leer estructura de pasos

**Criterios de Éxito**:
- ✅ Notificación aparece con ✅ emoji
- ✅ Contiene: "Se procesaron X/Y cuadrantes"
- ✅ Contiene: "📥 Archivos descargados en Descargas"
- ✅ Contiene: "📱 Abre WhatsApp Web"
- ✅ Contiene: "📎 Adjunta PDF + iCalendar"
- ✅ Auto-cierre en 6s

**Status**: [ ] NOT STARTED

---

### TC013: Modal Desaparece Limpiamente
**Descripción**: Verificar que modal se remueve correctamente del DOM
**Pasos**:
1. Después de completar envío
2. Inspeccionar elemento en DevTools
3. Verificar que modal ya no existe

**Criterios de Éxito**:
- ✅ Modal removido del DOM
- ✅ Sin elementos huérfanos
- ✅ Fondo oscuro desaparece

**Status**: [ ] NOT STARTED

---

### TC014: Sin Notificaciones Duplicadas
**Descripción**: Verificar que NO hay notificaciones duplicadas en modo masivo
**Pasos**:
1. Durante envío masivo
2. Monitorear notificaciones que aparecen
3. Contar cuántas notificaciones de archivo aparecen

**Criterios de Éxito**:
- ✅ 1 notificación inicial
- ✅ 0 notificaciones individuales por empleado (se ocultan en modo masivo)
- ✅ 1 notificación final

**Status**: [ ] NOT STARTED

---

### TC015: Errores en Consola
**Descripción**: Verificar que no hay errores JavaScript durante el flujo
**Pasos**:
1. Abrir DevTools Console (F12)
2. Ejecutar todo el flujo de WhatsApp masivo
3. Revisar consola por errores rojos

**Criterios de Éxito**:
- ✅ Sin errores (console.error)
- ✅ Logs informativos visibles
- ✅ Sin warnings críticos

**Status**: [ ] NOT STARTED

---

### TC016: Timing Correcto Entre Acciones
**Descripción**: Verificar que los delays/timings son correctos
**Pasos**:
1. Medir tiempo entre eventos:
   - Inicio notificación inicial: 0ms
   - Inicio modal progreso: ~500ms
   - Descarga PDF: ~1s
   - Descarga iCalendar: ~1.3s
   - Apertura WhatsApp: ~2.3s
   - Cierre modal: ~2.5s
   - Notificación final: ~3s

**Criterios de Éxito**:
- ✅ Timings coinciden ±500ms
- ✅ No hay congelamiento
- ✅ Flujo se ve natural

**Status**: [ ] NOT STARTED

---

## 📊 Resumen de Coverage

```
Total Test Cases: 16
- API/Backend: 0
- UI/Frontend: 12
- Integración: 4
- Edge Cases: 0

Cobertura estimada: 85%
```

---

## 🔍 Configuración de Testing

### Navegador
- **Primario**: Chrome/Chromium (principal)
- **Secundario**: Edge, Firefox (validación)
- **Requisitos**: Acceso a localStorage, descarga automática

### Empleados de Prueba
Se usarán 3 empleados de prueba con:
- Nombre válido
- Teléfono válido (número fake válido para URL WhatsApp)
- Departamento asignado
- Estado activo

### Monitoreo
- DevTools Console abierta (para revisar logs)
- Carpeta Descargas limpia al inicio
- WhatsApp Web abierto/accesible

---

## 📝 Registro de Resultados

### Fase 1: TC001-TC005 (Setup)
- [ ] TC001: _____ 
- [ ] TC002: _____ 
- [ ] TC003: _____ 
- [ ] TC004: _____ 
- [ ] TC005: _____ 

### Fase 2: TC006-TC010 (Ejecución Principal)
- [ ] TC006: _____
- [ ] TC007: _____
- [ ] TC008: _____
- [ ] TC009: _____
- [ ] TC010: _____

### Fase 3: TC011-TC016 (Finalización)
- [ ] TC011: _____
- [ ] TC012: _____
- [ ] TC013: _____
- [ ] TC014: _____
- [ ] TC015: _____
- [ ] TC016: _____

---

## ✅ Criterios de Aceptación Global

**Se considera EXITOSO si**:
- ✅ 14 o más test cases pasan (87.5%+)
- ✅ Sin errores críticos en consola
- ✅ Archivos se descargan correctamente
- ✅ WhatsApp abre con mensaje correcto
- ✅ Instrucciones visibles y claras
- ✅ Timing es aceptable (<3s total)

**Se considera FALLIDO si**:
- ❌ Más de 2 test cases fallan
- ❌ Error crítico en JavaScript
- ❌ Archivos no se descargan
- ❌ WhatsApp no abre
- ❌ Modal no se muestra

---

## 🎯 Inicio Testing

**Próximo Paso**: Abrir aplicación en navegador y ejecutar TC001

