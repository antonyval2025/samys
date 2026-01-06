# 🚀 CÓMO ARRANCAR LA APLICACIÓN CORRECTAMENTE

## ⚠️ **IMPORTANTE: El Orden Es Crítico**

---

## PASO 1️⃣: Abre Terminal (PowerShell o CMD)

Presiona: `Win + R` → escribe `powershell` → Enter

---

## PASO 2️⃣: Instala las Dependencias del Backend (PRIMERA VEZ SOLAMENTE)

```powershell
cd "c:\Users\samys\OneDrive\Nueva Carpeta\backend"
npm install
```

Espera a que termine (dice "added X packages")

---

## PASO 3️⃣: Abre TERMINAL 1 - Servidor de Base de Datos

Todavía en la misma terminal:

```powershell
npm start
```

Deberías ver:
```
🚀 SERVIDOR DE TURNOS INICIADO
URL: http://localhost:5001
```

**⚠️ NO CIERRES ESTA TERMINAL. DÉJALA CORRIENDO**

---

## PASO 4️⃣: Abre TERMINAL 2 - Servidor Frontend (Nueva terminal)

Presiona: `Win + R` → escribe `powershell` → Enter

```powershell
cd "c:\Users\samys\OneDrive\Nueva Carpeta"
python -m http.server 8000 --directory .
```

Deberías ver:
```
Serving HTTP on 0.0.0.0 port 8000
```

**⚠️ NO CIERRES ESTA TERMINAL TAMPOCO**

---

## PASO 5️⃣: Abre Navegador

Entra a:
```
http://localhost:8000/nuevo_cuadrante_mejorado.html
```

---

## ✅ Ahora Prueba:

1. **Haz clic en "📋 GENERAR TURNOS"**
   - Deberían aparecer los turnos en la tabla
   - En Terminal 1 (Servidor) deberías ver: `✅ Turnos guardados en BD: empleado X`

2. **Recarga la página (Ctrl + R)**
   - Los turnos DEBEN seguir ahí
   - En consola (F12) del navegador deberías ver: `✅ BD: X turnos cargados`

3. **Cambia a otro mes**
   - Vuelve a enero
   - Haz clic en "📋 GENERAR TURNOS" de nuevo
   - El problema del botón desapareciendo DEBE estar arreglado

---

## 🔍 Si Algo Falla:

### ❌ "API DESCONECTADA" en consola

**Solución:**
- Revisa que Terminal 1 esté corriendo
- Abre http://localhost:5001/health en navegador
- Debe mostrar: `{"status":"OK",...}`

### ❌ "Turnos desaparecen al recargar"

**Solución:**
- Abre consola (F12) → Pestaña Console
- Busca líneas que digan "✅ BD:"
- Si NO aparecen, la API no está respondiendo

### ❌ Puerto 5001 o 8000 ya está en uso

**Solución:**
```powershell
# Mata el proceso en puerto 5001
Stop-Process -Name node -Force

# Mata el proceso en puerto 8000
Stop-Process -Name python -Force
```

---

## 📦 Archivos Importantes

```
Nueva Carpeta/
├── backend/
│   ├── server.js          ← El servidor (conecta a BD)
│   ├── package.json       ← Dependencias
│   └── node_modules/      ← Se crea al hacer npm install
│
├── datos_bd/              ← Aquí se guardan los archivos JSON
│   ├── turnos_empleado_1.json
│   ├── turnos_empleado_2.json
│   └── ...
│
├── js/
│   ├── modules.js         ← Código principal (actualizado)
│   └── verificacion-automatica.js
│
└── nuevo_cuadrante_mejorado.html  ← La aplicación web
```

---

## 💡 ¿Cómo Funcionan los Datos Ahora?

```
NAVEGADOR (Puerto 8000)
    ↓
    Haces clic en "📋 GENERAR TURNOS"
    ↓
    Genera turnos EN MEMORIA
    ↓
    Guarda en localStorage (respaldo local inmediato) ✅
    ↓
    Envía a SERVIDOR API (Puerto 5001) ✅
    ↓
    SERVIDOR GUARDA EN ARCHIVO JSON ✅
    (datos_bd/turnos_empleado_X.json)
    ↓
    Recarga página (Ctrl+R)
    ↓
    Carga primero desde API/BD ✅
    Carga desde localStorage si falta algo ✅
    ↓
    Muestra los turnos (PERSISTEN)
```

---

## 🎯 Checklist Final

Antes de empezar a trabajar, verifica:

- [ ] Terminal 1: Servidor en http://localhost:5001/health → OK
- [ ] Terminal 2: Frontend en http://localhost:8000 → OK
- [ ] Navegador: http://localhost:8000/nuevo_cuadrante_mejorado.html cargado
- [ ] Consola (F12): Sin errores rojos
- [ ] Click "📋 GENERAR TURNOS": Aparecen turnos
- [ ] Recarga (Ctrl+R): Turnos siguen ahí
- [ ] Carpeta datos_bd/ contiene archivos JSON

---

## ❓ Preguntas Frecuentes

**P: ¿Tengo que hacer esto cada vez que inicio?**
R: Sí. Los servidores necesitan estar corriendo para que funcione.

**P: ¿Qué pasa si cierro una terminal?**
R: Si cierras la terminal del servidor, los datos no se guardarán. Vuelve a abrir.

**P: ¿Dónde se guardan mis datos?**
R: En `datos_bd/turnos_empleado_X.json` + localStorage del navegador (respaldo).

**P: ¿Puedo cerrar el navegador?**
R: Sí, los datos se guardan en la BD. Abre nuevamente y se cargarán.

---

**¿Listo? ¡Comienza por PASO 1!** 🚀
