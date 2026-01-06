# 🚀 GUÍA RÁPIDA: SERVIDOR DE TURNOS + FRONTEND

## 📋 Orden Correcto de Ejecución

### 1️⃣ ABRIR TERMINAL 1 - SERVIDOR API (Puerto 5001)
```bash
cd backend
npm install
npm start
```

**Esperado:**
```
🚀 SERVIDOR DE TURNOS INICIADO
URL: http://localhost:5001
```

### 2️⃣ ABRIR TERMINAL 2 - SERVIDOR FRONTEND (Puerto 8000)
```bash
python -m http.server 8000 --directory .
```

**Esperado:**
```
Serving HTTP on 0.0.0.0 port 8000
```

### 3️⃣ ABRIR NAVEGADOR
```
http://localhost:8000/nuevo_cuadrante_mejorado.html
```

---

## 🔄 Flujo de Datos Correcto

```
┌─────────────────┐
│   NAVEGADOR     │ (Puerto 8000)
│ nuevo_cuadrante │
└────────┬────────┘
         │
         │ POST /api/turnos/:empleadoId
         │ (JSON con turnos del mes)
         ▼
┌─────────────────────────────────────┐
│   SERVIDOR EXPRESS (backend/)       │ (Puerto 5001)
│                                     │
│  📁 /datos_bd/                      │
│     ├─ turnos_empleado_1.json       │
│     ├─ turnos_empleado_2.json       │
│     └─ ...                          │
└─────────────────────────────────────┘
```

---

## 💾 Cómo Funcionan los Datos

### Cuando Haces Clic en "📋 GENERAR TURNOS":

1. **Genera turnos en memoria** (AppState.scheduleData)
2. **Guarda en localStorage** (respaldo local inmediato)
3. **Envía a API** (http://localhost:5001/api/turnos/:empleadoId)
4. **API guarda en archivo JSON** (datos_bd/turnos_empleado_X.json)

### Cuando Recargas la Página (Ctrl+R):

1. **Lee localStorage** (carga datos locales si existen)
2. **Solicita a API** (http://localhost:5001/api/turnos/:empleadoId)
3. **Combina datos** (BD tiene prioridad sobre localStorage)
4. **Mostra el cuadrante**

---

## 🐛 Solucionar Problemas

### ❌ "API no disponible" o "DESCONECTADA"

**Solución:**
1. Verifica que el servidor esté corriendo en Terminal 1
2. Abre http://localhost:5001/health en navegador
3. Deberías ver: `{"status":"OK","server":"Servidor de Turnos v1.0"}`

### ❌ "Datos se borran al recargar"

**Solución:**
1. Abre consola (F12) → Pestaña Console
2. Busca mensajes como "✅ API: Turnos guardados en BD"
3. Si NO aparecen, el servidor no está respondiendo

### ❌ Error CORS

**Solución:**
- El servidor ya incluye `app.use(cors())` - debe funcionar
- Si sigue fallando, verifica que localhost:5001 está accesible

---

## 🔍 Ver Datos Guardados

### Opción 1: Archivo JSON
```
c:\Users\samys\OneDrive\Nueva Carpeta\datos_bd\turnos_empleado_1.json
```

### Opción 2: API de Backup
```
http://localhost:5001/api/backup
```

Abre esto en navegador y verás todos los datos guardados en JSON

### Opción 3: Consola del Navegador
```javascript
// En consola (F12):
JSON.stringify(AppState.scheduleData)
localStorage.getItem('turnosAppState')
```

---

## 📦 Requisitos

- ✅ Node.js 14+ (npm)
- ✅ Python 3+ (para servidor frontend)
- ✅ Navegador moderno (Chrome, Firefox, Edge)

## Instalación de Node.js

Si no tienes Node.js:
1. Descarga desde https://nodejs.org
2. Instala versión LTS
3. Abre Terminal y ejecuta:
   ```bash
   node --version
   npm --version
   ```

---

## 🎯 Checklist Final

- [ ] Terminal 1: Servidor en http://localhost:5001/health (status OK)
- [ ] Terminal 2: Frontend en http://localhost:8000
- [ ] Navegador: http://localhost:8000/nuevo_cuadrante_mejorado.html cargado
- [ ] Consola (F12): Sin errores rojos CORS
- [ ] Click en "📋 GENERAR TURNOS": Aparecen turnos
- [ ] Recarga (Ctrl+R): Turnos se mantienen
- [ ] Carpeta `datos_bd/` contiene archivos JSON

---

**¿Problemas?** Revisa la consola (F12) del navegador y busca mensajes de error específicos.
