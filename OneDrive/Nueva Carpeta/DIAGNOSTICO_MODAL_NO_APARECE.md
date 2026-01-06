# 🔍 DIAGNÓSTICO: Modal no aparece

## 🧪 Paso 1: Verificar en Consola

Abre tu navegador donde está la app y presiona **F12** para abrir DevTools.

En la **Consola** escribe:

```javascript
AutoSaveUIModule
```

Debería mostrar el objeto completo. Si dice `undefined`, el módulo no está cargado.

---

## 🧪 Paso 2: Verificar que se inicializa

En consola, busca estos mensajes:

```
✅ AutoSaveManager inicializado
✅ AutoSaveUIModule inicializado
✅ AutoSaveBDModule inicializado (persistencia BD)
```

Si NO ves estos mensajes, ve a **Pestaña Network** y verifica que los scripts se cargan:
- `js/auto-save.js` ✅
- `js/auto-save-ui.js` ✅
- `js/auto-save-bd.js` ✅

---

## 🧪 Paso 3: Forzar abrir modal

En la **Consola** escribe:

```javascript
AutoSaveUIModule.abrirModal()
```

Presiona Enter.

**Debería pasar:**
1. Verás mensajes en consola:
   ```
   🔓 Abriendo modal AutoGuardado...
   ✅ Modal Auto-guardado abierto
   ```

2. En la página debe aparecer un modal grande con:
   - "Estado de Autoguardado" como título
   - Información de cambios, guardados, etc.
   - Botones: [💾], [🗄️], [🛑]

**Si NO aparece:**
- Abre **Inspector (F12 → Elements)**
- Busca el elemento `<div id="modalAutoGuardado">`
- Debería estar en `<body>`
- Si NO está, el módulo no se inicializó

---

## 🧪 Paso 4: Debug completo

En consola, ejecuta esto:

```javascript
// 1. Verificar módulo
console.log('AutoSaveUIModule:', typeof AutoSaveUIModule);

// 2. Verificar que existe el modal en DOM
console.log('Modal en DOM:', document.getElementById('modalAutoGuardado') !== null);

// 3. Si existe, ver su estado CSS
const modal = document.getElementById('modalAutoGuardado');
if (modal) {
    console.log('Classes:', modal.className);
    console.log('Display:', window.getComputedStyle(modal).display);
    console.log('Visibility:', window.getComputedStyle(modal).visibility);
}

// 4. Forzar visibilidad
if (modal) {
    modal.classList.add('active');
    console.log('Modal activado por CSS');
}
```

---

## 🆘 SOLUCIONES RÁPIDAS

### Si "AutoSaveUIModule is undefined"
```
→ El script no se cargó
→ Verifica que <script src="js/auto-save-ui.js"></script> existe
→ Verifica que está DESPUÉS de <script src="js/auto-save.js"></script>
→ Recarga página (Ctrl+Shift+R para limpiar caché)
```

### Si modal no aparece pero AutoSaveUIModule existe
```
→ Ejecuta: AutoSaveUIModule.init()
→ Luego: AutoSaveUIModule.abrirModal()
→ Si aún no aparece, revisar CSS (ver Paso 4)
```

### Si modal aparece pero sin contenido
```
→ Probablemente error de JavaScript
→ Abre Consola (F12)
→ Mira errores en rojo (red text)
→ Copia el error exacto
```

### Si aparece el VIEJO modal (sin BD info)
```
→ Hay un modal antiguo en caché
→ Solución:
  1. Ctrl+Shift+R (limpiar caché)
  2. Cierra y reabre DevTools (F12)
  3. Recarga página
```

---

## 📝 INFORMACIÓN A COMPARTIR SI HAY ERROR

Si aún no funciona, ejecuta esto en consola y copia el resultado:

```javascript
{
    modulo: typeof AutoSaveUIModule,
    modalExiste: document.getElementById('modalAutoGuardado') !== null,
    autoSave: typeof AutoSaveManager,
    bd: typeof AutoSaveBDModule,
    scripts: {
        autoSave: document.querySelector('script[src*="auto-save.js"]') !== null,
        ui: document.querySelector('script[src*="auto-save-ui.js"]') !== null,
        bd: document.querySelector('script[src*="auto-save-bd.js"]') !== null
    }
}
```

Copia TODO el output y comparte.

---

## ✅ TEST ALTERNATIVO

Abre este archivo:
```
TEST_MODAL_AUTOGUARDADO.html
```

Te da un panel de test interactivo para verificar cada parte.

---

**Status**: En diagnóstico
**Próximo paso**: Ejecutar uno de estos tests y reportar resultado
