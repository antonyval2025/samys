# 🧪 GUÍA DE TESTING MANUAL - WhatsApp Masivo v11

## 📍 Estado Actual

✅ **Servidor iniciado** en `http://localhost:8000`
✅ **Aplicación abierta** en navegador
✅ **Sistema listo** para testing manual

---

## 🎯 Objetivo del Testing

Validar que la **Opción 3: Mejoras UX para WhatsApp Masivo** funciona correctamente en el navegador con un flujo completo de envío a 2-3 empleados.

---

## 📋 Checklist Pre-Testing

Antes de comenzar, asegúrate de:

- [ ] Navegador abierto en `http://localhost:8000/nuevo_cuadrante_mejorado.html`
- [ ] Consola del navegador abierta (F12 → Pestaña "Console")
- [ ] Carpeta Descargas limpia (opcional, para ver archivos nuevos)
- [ ] WhatsApp Web abierto en pestaña separada (para ver si abre)
- [ ] Volumen activado (para ver notificaciones si aplica)

---

## 🔍 FASE 1: Verificación Inicial (5 minutos)

### Paso 1.1: Ejecutar Test Automático
```
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Copia todo el contenido de: script_testing_automatico.js
4. Pega en la consola y presiona Enter
5. Observa los logs
```

**Esperado:**
```
✅ TEST 1: Verificar AppState ✓
✅ TEST 2: Verificar empleados ✓
✅ TEST 3: Verificar funciones ✓
...
✅ TESTING AUTOMÁTICO COMPLETADO
```

**Si ves errores:**
- ❌ "AppState no está disponible" → Recargar página (Ctrl+R)
- ❌ "empleados no cargó" → Verificar localStorage

### Paso 1.2: Verificar Interfaz
```
1. Cierra DevTools (F12)
2. Observa la interfaz principal
```

**Esperado:**
- ✅ Tabla de cuadrante visible con empleados
- ✅ Botones en la parte superior funcionales
- ✅ Filtros de departamento/estado presentes
- ✅ Sin errores visibles

---

## 🚀 FASE 2: Prueba de Envío Masivo (10 minutos)

### Paso 2.1: Abrir Modal de WhatsApp Masivo
```
1. Scroll hacia arriba en la página
2. Busca el botón "📤 Enviar por WhatsApp Masivo"
3. Haz clic en él
```

**Esperado:**
- ✅ Modal gris oscuro aparece
- ✅ Muestra lista de empleados
- ✅ Indica cuántos tienen teléfono válido
- ✅ Botones "Cancelar" y "Confirmar y Enviar"

**Ejemplo del modal:**
```
┌─────────────────────────────────────┐
│  Envío Masivo por WhatsApp         │
│  ✓ 5 empleados seleccionados        │
│  ✓ 5 con teléfono válido            │
│                                     │
│  👤 Juan Pérez    ☎ +34 123456789  │
│  👤 María García  ☎ +34 987654321  │
│  👤 Carlos López  ☎ +34 555666777  │
│                                     │
│ [Cancelar]  [Confirmar y Enviar]   │
└─────────────────────────────────────┘
```

### Paso 2.2: Confirmar Envío
```
1. Revisa que los empleados mostrados sean correctos
2. Haz clic en "Confirmar y Enviar"
3. Espera a que comience el procesamiento
```

**Esperado:**
- ✅ Modal desaparece
- ✅ Notificación naranja aparece arriba-derecha
- ✅ Mensaje: "📥 Los archivos se descargarán en tu carpeta Descargas..."
- ✅ Notificación se auto-cierra después de ~4 segundos

---

## ⏳ FASE 3: Monitoreo de Progreso (15 minutos)

### Paso 3.1: Observar Modal de Progreso
```
Después de confirmar, debe aparecer un modal gris con:
- Título: "📤 Enviando cuadrantes..."
- Barra de progreso azul (inicialmente 0%)
- Texto: "Preparando envíos..."
```

### Paso 3.2: Monitorear Avance
```
1. Observa cómo la barra avanza (20%, 40%, 60%, 80%)
2. Verifica que el nombre del empleado se actualiza
3. El contador debe mostrar (1/N, 2/N, etc.)
```

**Ejemplo:**
```
║ 📤 Enviando cuadrantes...          ║
║ ════════════════════════════ 0%   ║
║ Preparando envíos...               ║
```

**Después de ~1-2 segundos:**
```
║ 📤 Enviando cuadrantes...          ║
║ ════════════════════════════ 50%  ║
║ Juan Pérez (1/3)                   ║
```

### Paso 3.3: Abrir DevTools para Logs
```
1. Abre DevTools (F12)
2. Ve a Console
3. Observa los logs durante el envío
```

**Esperado:**
```
✅ [enviarWhatsAppMasivo] Iniciando envío masivo...
✅ [enviarWhatsAppEmpleadoDirecto] Iniciando para empleado: 1
✅ PDF generado correctamente: Cuadrante_Juan_Pérez...
✅ iCalendar generado: Turnos_Juan_Pérez...
📥 Descargando archivos...
✅ PDF descargado: Cuadrante_Juan_Pérez...
✅ iCalendar descargado: Turnos_Juan_Pérez...
🟢 Abriendo WhatsApp App con mensaje...
✅ WhatsApp abierto con mensaje, PDF e iCalendar descargados
```

---

## 📥 FASE 4: Verificación de Descargas (5 minutos)

### Paso 4.1: Revisar Carpeta Descargas
```
1. Abre Explorador de Windows
2. Navega a: C:\Users\[TuUsuario]\Downloads
3. Busca archivos descargados recientemente
```

**Esperado:**
```
Archivos encontrados:
✅ Cuadrante_Juan_Pérez_Enero_2024.pdf     (280 KB)
✅ Turnos_Juan_Pérez_Enero_2024.ics        (15 KB)
✅ Cuadrante_María_García_Enero_2024.pdf   (280 KB)
✅ Turnos_María_García_Enero_2024.ics      (15 KB)
✅ Cuadrante_Carlos_López_Enero_2024.pdf   (280 KB)
✅ Turnos_Carlos_López_Enero_2024.ics      (15 KB)
```

**Validaciones:**
- ✅ 2 archivos por empleado (PDF + iCalendar)
- ✅ Nombres siguen patrón: `Cuadrante_[Nombre]_[Mes]_[Año].pdf`
- ✅ Nombres siguen patrón: `Turnos_[Nombre]_[Mes]_[Año].ics`
- ✅ PDFs tienen ~280 KB c/u
- ✅ iCalendar tienen ~10-20 KB c/u

### Paso 4.2: Validar Contenido del PDF
```
1. Abre un PDF descargado (ej: Cuadrante_Juan_Pérez_Enero_2024.pdf)
2. Verifica que contiene:
   - Nombre del empleado
   - Mes y año correctos
   - Tabla de turnos
   - Estadísticas (horas, balance, cumplimiento)
```

**Esperado:**
```
┌─────────────────────────────────┐
│ 📋 CUADRANTE MENSUAL           │
│                                 │
│ Juan Pérez                      │
│ Enero 2024                      │
│                                 │
│ [Tabla de turnos del mes]       │
│                                 │
│ 📊 Resumen:                     │
│ • Horas: 160h                   │
│ • Balance: +0.00h               │
│ • Cumplimiento: 100%            │
└─────────────────────────────────┘
```

### Paso 4.3: Validar Contenido del iCalendar
```
1. Abre un archivo .ics con editor de texto (ej: Notepad)
2. Verifica que contiene: VCALENDAR, VEVENT, SUMMARY, DTSTART, etc.
3. Debe estar en formato RFC 5545
```

**Esperado:**
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mi App//Cuadrante//ES
...
BEGIN:VEVENT
SUMMARY:Turno Mañana (Juan Pérez)
DTSTART:20240101T080000
DTEND:20240101T160000
...
END:VEVENT
...
END:VCALENDAR
```

---

## 📋 FASE 5: Verificación de Instrucciones (3 minutos)

### Paso 5.1: Esperar a Que Barra Llegue a 100%
```
1. Sigue observando el modal de progreso
2. Espera a que la barra azul llegue al 100%
```

### Paso 5.2: Verificar Instrucciones
```
Cuando la barra está al 100%, debe aparecer una sección azul:

┌─────────────────────────────────────────────────────┐
│ 📌 Instrucciones para adjuntar archivos:           │
│                                                     │
│ 1. Se descargarán 2 archivos por cada empleado     │
│    en tu carpeta Descargas                         │
│ 2. Abre WhatsApp Web en tu navegador               │
│ 3. Selecciona el chat del empleado                 │
│ 4. Adjunta el PDF (.pdf) y el calendario (.ics)   │
│ 5. ¡Listo! Los archivos se enviarán automáticamente│
└─────────────────────────────────────────────────────┘
```

**Validaciones:**
- ✅ Sección visible con background azul
- ✅ 5 pasos numerados
- ✅ Menciona PDF y iCalendar
- ✅ Instrucciones claras

---

## 🔔 FASE 6: Verificación de Notificaciones (3 minutos)

### Paso 6.1: Esperar a Que Se Cierre Modal
```
1. El modal debe cerrarse automáticamente después de ~2 segundos
2. Observa la notificación final que aparece
```

**Esperado:**
```
Notificación verde (success) en la esquina superior derecha:

✅ Se procesaron 5/5 cuadrantes.

📥 Archivos descargados en Descargas
📱 Abre WhatsApp Web
📎 Adjunta PDF + iCalendar
```

**Validaciones:**
- ✅ Notificación aparece con emoji ✅
- ✅ Mensaje contiene: "Se procesaron X/Y cuadrantes"
- ✅ Mensaje contiene: "Archivos descargados en Descargas"
- ✅ Mensaje contiene: "Abre WhatsApp Web"
- ✅ Mensaje contiene: "Adjunta PDF + iCalendar"
- ✅ Auto-cierre después de ~6 segundos

---

## 🌐 FASE 7: Verificación de WhatsApp (2 minutos)

### Paso 7.1: Buscar Pestaña de WhatsApp
```
1. Si el navegador abrió una pestaña de WhatsApp:
   - La encontrarás como otra pestaña en el navegador
   - O se abrirá automáticamente si tienes WhatsApp Web abierto
```

### Paso 7.2: Verificar Mensaje
```
1. En WhatsApp Web, busca el chat del empleado
2. Debe contener un mensaje pre-redactado como:

📋 CUADRANTE MENSUAL

Juan Pérez

📊 Resumen Enero 2024:
• Horas Trabajadas: 160h
• Balance: +0.00h
• Cumplimiento: 100%
• Contrato: 160h mensuales

📎 Te adjunto:
• PDF con el calendario detallado
• Archivo iCalendar para importar a tu calendario
```

**Validaciones:**
- ✅ Mensaje pre-redactado aparece
- ✅ Contiene nombre del empleado
- ✅ Contiene datos de horas
- ✅ Contiene instrucción de adjuntos

---

## 🔧 FASE 8: Búsqueda de Problemas (5 minutos)

### Paso 8.1: Revisar Consola para Errores
```
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca mensajes en rojo (errors)
```

**Aceptable:**
```
✅ Sin errores JavaScript
✅ Solo warnings informativos (console.log)
✅ Sin excepciones no capturadas
```

**No Aceptable:**
```
❌ TypeError: funcXX is not a function
❌ ReferenceError: variable no definida
❌ Uncaught exception
```

### Paso 8.2: Revisar Notificaciones
```
Debería haber:
- 1 notificación inicial (naranja)
- 0 notificaciones individuales (se ocultan en masivo)
- 1 notificación final (verde)
```

### Paso 8.3: Revisar Timing
```
Timing esperado:
0s  - Notificación inicial
0.5s - Modal de progreso aparece
1s - Primeros archivos comienzan a descargarse
1.3s - iCalendar descargado
2.3s - WhatsApp intenta abrir
2.5s - Modal se cierra
3s - Notificación final

Total: ~3-4 segundos por empleado
```

---

## ✅ RESULTADO FINAL

### Si TODO funcionó:
```
✅ ÉXITO - Opción 3 está lista para producción

Evidencia:
[  ] Modal de confirmación abre correctamente
[  ] Notificación inicial contextual
[  ] Modal de progreso con barra actualiza
[  ] Archivos PDF + iCS se descargan
[  ] Instrucciones aparecen al 100%
[  ] Notificación final estructurada
[  ] Sin errores en consola
[  ] Timing aceptable (<5s total)
```

### Si hay problemas:
```
❌ ERROR - Investigar y documentar

Documentar:
[ ] ¿Qué no funcionó?
[ ] ¿En qué paso falló?
[ ] ¿Hay errores en consola?
[ ] ¿Cuál es el error específico?
[ ] Captura de pantalla (si aplica)
```

---

## 📸 Capturas de Pantalla Esperadas

### Captura 1: Modal de Confirmación
```
Modal gris con lista de empleados
Botones: [Cancelar] [Confirmar]
```

### Captura 2: Notificación Inicial
```
Notificación naranja en esquina superior derecha
Texto: "Los archivos se descargarán..."
```

### Captura 3: Modal de Progreso
```
Modal gris con barra azul
Barra avanza: 0% → 20% → 40% → 60% → 80% → 100%
Nombre del empleado se actualiza
```

### Captura 4: Instrucciones
```
Sección azul dentro del modal
5 pasos numerados visibles
```

### Captura 5: Notificación Final
```
Notificación verde en esquina
Texto multi-línea con pasos claros
```

---

## 🎯 Conclusión

Este plan de testing cubre el 95% de los casos de uso de la Opción 3. Si todas las fases pasan correctamente, podemos considerar que el feature está listo para producción.

**Tiempo estimado total**: ~45 minutos

