# ⚡ INICIO RÁPIDO - Cuadrante de Turnos

## 🎯 Problema Solucionado
El cuadrante estaba **descontrolado** sin poder:
- Cambiar de mes
- Mostrar el cuadrante general
- Editar turnos

**Estado:** ✅ **RESUELTO**

---

## 🚀 CÓMO USAR (3 OPCIONES)

### Opción 1️⃣: Script Automático (MÁS FÁCIL)
```bash
cd "c:\Users\samys\OneDrive\Nueva Carpeta"
python verificar_cuadrante.py
```
✅ Inicia servidor automáticamente  
✅ Abre navegador  
✅ ¡Listo para usar!

### Opción 2️⃣: Servidor Python Manual
```bash
cd "c:\Users\samys\OneDrive\Nueva Carpeta"
python -m http.server 8000
```
Luego abre en navegador:
```
http://localhost:8000/nuevo_cuadrante_mejorado.html
```

### Opción 3️⃣: Doble Clic Directo
⚠️ **NO RECOMENDADO** (archivo:// no tiene todas las funciones)

Si DEBES hacer esto: Abre en navegador como HTTP, no como archivo

---

## ✨ QUÉ DEBE PASAR CUANDO ABRE

### Pantalla Inicial
```
📊 Sistema de Gestión de Turnos
├─ Mes/Año selector (arriba)
├─ Botones ◀ ▶ para cambiar mes
└─ TABLA GRANDE con empleados y turnos
    ├─ Fila: Empleados (Juan, María, Carlos, Ana, Pedro)
    └─ Columnas: Días 1-31 con turnos (mañ, tar, noc, des...)
```

### Colores de Turnos
| Turno | Color |
|-------|-------|
| Mañana | 🟢 Verde |
| Tarde | 🟡 Amarillo |
| Noche | 🔵 Azul |
| Descanso | ⚪ Gris |
| Vacaciones | 🩷 Rosa |

---

## 🎮 FUNCIONES DISPONIBLES

### 1. Cambiar Mes
**Clic en:** `◀ mes actual ▶`
- Se regenera cuadrante automáticamente
- Notificación en esquina superior-derecha

### 2. Editar Turno Individual
**Clic en:** Cualquier celda de turno
- Aparece ventana con opciones
- Selecciona nuevo turno (1-9)
- Se guarda automáticamente

### 3. Gestionar Empleados
**Clic en:** Botón `👥 Empleados`
- Ver lista de empleados
- Agregar nuevos
- Editar existentes

---

## 📊 DATOS INCLUIDOS

### Empleados Automáticos (5)
1. **Juan García** - Limpieza, Getafe
2. **María López** - Limpieza, Madrid
3. **Carlos Martínez** - Mantenimiento, Getafe
4. **Ana Rodríguez** - Limpieza, Leganés
5. **Pedro Sánchez** - Seguridad, Getafe

Todos con:
- Contrato: 169 horas/mes
- Estado: Activo

---

## 💾 ALMACENAMIENTO

- ✅ Se guarda automáticamente en `localStorage`
- ✅ Persiste entre sesiones
- ✅ Nada de servidor necesario (offline-friendly)

**Para limpiar datos:**
```javascript
// En consola (F12):
localStorage.clear()
location.reload()
```

---

## 🔍 VERIFICACIÓN EN CONSOLA

Abre consola (F12) y verás logs como:
```
✓ Empleados cargados: 5
✓ Tipos de turnos cargados
✓ Turnos inicializados/cargados
✓ Cuadrante general generado
✓ Aplicación cargada correctamente
```

Si ves rojo (errores), reporta el mensaje completo.

---

## ⚙️ TECLAS ÚTILES

| Tecla | Función |
|-------|---------|
| F12 | Abre consola |
| Ctrl+Shift+K | Abre consola (Chrome) |
| Ctrl+Shift+I | Inspector (Firefox) |
| Ctrl+Shift+Supr | Limpia localStorage |

---

## ❌ SI NO FUNCIONA

### Problema: Pantalla en blanco
1. Abre consola (F12)
2. Busca texto rojo
3. Espera 3 segundos adicionales

### Problema: Botones no funcionan
1. Verifica que sea `http://localhost` (no `file://`)
2. Recarga página (F5)
3. Limpia caché (Ctrl+Shift+Supr)

### Problema: Datos no se guardan
1. Verifica que localStorage esté habilitado
2. Intenta en incógnito/privado
3. Cierra otras pestañas del sitio

---

## 📞 DEBUGGING

Para reportar problemas, copia esto de la consola:
```javascript
// En consola:
console.log({
    empleados: window.empleados?.length,
    appState: typeof window.AppState,
    ui: typeof window.UI,
    turnoManager: typeof window.TurnoManager,
    version: 'Fix v1.0'
})
```

---

## ✅ CHECKLIST FINAL

- [ ] Abre el archivo sin errores
- [ ] Ve el cuadrante del mes actual
- [ ] Aparecen 5 empleados
- [ ] Botones ◀ ▶ funcionan
- [ ] Puede cambiar de mes
- [ ] Haces clic en celda = aparece editor
- [ ] Cambias turno = se actualiza
- [ ] Cierras = datos persisten

---

**🎉 ¡LISTO! El cuadrante funciona correctamente**

Cualquier duda: Abre consola (F12) y verifica los logs

**Última actualización:** 28 de diciembre de 2025
