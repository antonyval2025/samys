# 📱 Guía de Prueba: PDF WhatsApp Coincide con Cuadrante Individual

**Objetivo:** Validar que el PDF generado para WhatsApp ahora coincide visualmente con el cuadrante individual.

---

## ✅ Prueba 1: Visual Rápida (2 minutos)

### Paso 1: Abrir la aplicación
1. Abre `nuevo_cuadrante_mejorado.html` en tu navegador
2. Verifica que carguen los datos (al menos 1 empleado debe estar visible)

### Paso 2: Ver cuadrante individual
1. Haz clic en cualquier empleado en la tabla general
2. Se abre un modal con el **"Cuadrante del Empleado"**
3. **Observa:** Los cuadros de turnos tienen:
   - ✅ Fondo de color (verde para mañana, amarillo para tarde, etc.)
   - ✅ Una **letra grande** en el centro (M, T, N, etc.)
   - ✅ Número del día arriba
   - ✅ Horas abajo
   - ✅ Horario en letra pequeña

### Paso 3: Generar PDF para WhatsApp
1. En el modal del cuadrante individual, haz clic en botón **"📱 WhatsApp"**
2. Se descargará un archivo PDF: `cuadrante_<nombreempleado>_<mes>.pdf`
3. **Abre el PDF** con tu lector PDF favorito

### Paso 4: Comparar
Ahora compara el PDF descargado con el cuadrante individual abierto:

**CUADRANTE INDIVIDUAL** | **PDF WhatsApp**
---|---
Fondo verde (#d4edda) | Debe ser verde (#d4edda) ✓
Letra "M" grande (28px) | Debe ser "M" grande (28px) ✓
Número "1" oscuro | Debe ser "1" oscuro ✓
Horas "8h" oscuro | Debe ser "8h" oscuro ✓
Horario "08:00-16:00" oscuro | Debe ser "08:00-16:00" oscuro ✓
**SIN óvalo adicional** | **DEBE SER SIN óvalo** ✓

**✅ ÉXITO:** Si todo coincide, los cambios funcionan correctamente.

---

## 🔍 Prueba 2: Detallada (5 minutos)

Válida cada tipo de turno individualmente:

### Mañana (#d4edda - verde claro)
- [ ] Fondo verde claro
- [ ] Inicial "M" (no "Mañana")
- [ ] Horas: 8h
- [ ] Horario: 08:00-16:00

### Tarde (#fff3cd - amarillo claro)
- [ ] Fondo amarillo claro
- [ ] Inicial "T" (no "Tarde")
- [ ] Horas: 6.5h (o 6h según tu configuración)
- [ ] Horario: 14:30-21:00 (o tu horario configurado)

### Noche (#f8d7da - rosa claro)
- [ ] Fondo rosa claro
- [ ] Inicial "N" (no "Noche")
- [ ] Horas: 8h
- [ ] Horario: 00:00-08:00

### Descanso (#e2e3e5 - gris claro)
- [ ] Fondo gris claro
- [ ] Inicial "D" (no "Descanso")
- [ ] Horas: 0h (o en blanco)
- [ ] Horario: - (guión)

### Guardia (#d8b4fe - púrpura claro)
- [ ] Fondo púrpura claro
- [ ] Inicial "GD" (guardia tiene 2 letras)
- [ ] Horas: 20h
- [ ] Horario: 12:00-08:00

### Vacaciones (#d0ebff - azul claro)
- [ ] Fondo azul claro
- [ ] Inicial "V" (no "Vacaciones")
- [ ] Horas: 0h
- [ ] Horario: - (guión)

---

## 🐛 Prueba 3: Debugging (si algo no funciona)

### Test 3.1: Verificar localStorage
Abre la consola del navegador (F12 → Consola) y ejecuta:

```javascript
// Ver tipos de turno cargados
const tipos = JSON.parse(localStorage.getItem('tiposTurnoData'));
console.table(tipos);
```

**Esperado:** Debería listar todos los turnos con campos:
- `nombre`: "Mañana", "Tarde", etc.
- `inicial`: "M", "T", "N", etc.
- `color`: "#d4edda", "#fff3cd", etc.
- `horario`: "08:00-16:00", etc.
- `horas`: 8, 6.5, etc.

### Test 3.2: Verificar función obtenerInfoTurnoVisualPDF
En la consola, ejecuta:

```javascript
// Cargar la función (si no está disponible)
const tiposTurnoData = JSON.parse(localStorage.getItem('tiposTurnoData')) || {};

// Probar con "mañana"
const info = obtenerInfoTurnoVisualPDF('mañana', tiposTurnoData);
console.log('Info de mañana:', info);
```

**Esperado:** 
```javascript
{
  etiqueta: "Mañana",     // ← Nombre completo
  inicial: "M",            // ← NUEVO - Solo inicial
  color: "#d4edda",
  horario: "08:00-16:00",
  horas: 8
}
```

### Test 3.3: Limpiar caché y reintentar
Si el PDF sigue mostrando nombre completo:

1. Abre Developer Tools (F12)
2. Limpia caché: Ctrl+Shift+Delete (o Cmd+Shift+Delete en Mac)
3. Marca "Archivos en caché" y haz clic "Limpiar"
4. Recarga la página (F5)
5. Reintenta generar el PDF

---

## 📊 Comparación Visual Esperada

### ANTES de cambios ❌
```
PDF WhatsApp:
┌──────────────────┐
│        1         │
│  [Mañana]        │ ← NOMBRE COMPLETO en óvalo
│      8h          │
│   08:00-16:00    │
└──────────────────┘
BG: Negro opaco 🟤
```

### DESPUÉS de cambios ✅
```
PDF WhatsApp:
┌──────────────────┐
│        1         │
│        M         │ ← SOLO INICIAL (28px)
│      8h          │
│   08:00-16:00    │
└──────────────────┘
BG: Verde claro 🟢
```

---

## 🎬 Video de Prueba Recomendado

**Pasos a seguir en orden:**

1. **Abre cuadrante individual** → Haz screenshot
2. **Genera PDF** → Abre en lector PDF
3. **Compara lado a lado** → Verifica colores e iniciales
4. **Prueba múltiples empleados** → Valida consistencia
5. **Prueba múltiples meses** → Cambia mes y repite

---

## ✨ Checklist Final

- [ ] PDF tiene fondo del turno (no negro opaco)
- [ ] PDF muestra inicial "M" (no "Mañana")
- [ ] PDF muestra inicial "T" (no "Tarde")
- [ ] PDF muestra inicial "N" (no "Noche")
- [ ] PDF muestra números de día en oscuro
- [ ] PDF muestra horas en oscuro
- [ ] PDF muestra horario en oscuro
- [ ] PDF NO tiene óvalo adicional opaco
- [ ] Colores coinciden con cuadrante individual
- [ ] Márgenes y espaciado son similares

**✅ Si todos los checks están marcados, ¡los cambios son correctos!**

---

## 📞 Si Encuentras Problemas

1. **Verifica que estés usando `nuevo_cuadrante_mejorado.html`** (no copia antigua)
2. **Borra caché del navegador** (Ctrl+Shift+Delete)
3. **Abre Developer Tools** (F12) y busca errores en Consola
4. **Verifica localStorage** con los Test 3.1 y 3.2 de arriba
5. **Contacta con soporte** incluyendo:
   - Screenshot del PDF
   - Screenshot del cuadrante individual
   - Output de la consola (pasos 3-4)

---

**Fecha de esta guía:** 29 de diciembre de 2025  
**Versión:** 2.0  
**Cambios aplicados a:** `nuevo_cuadrante_mejorado.html` líneas 1606 y 1696-1725
