# 🚀 INICIAR LA APLICACIÓN DE TURNOS

Tu aplicación está lista. Elige **UNA** de estas opciones para iniciar:

---

## ✅ OPCIÓN 1: Batch simple (RECOMENDADO para Windows)
**Archivo:** `iniciar_simple.bat`

Doble-clic en el archivo y listo.

**Ventajas:**
- ✅ Lo más simple
- ✅ Ve el servidor en la terminal
- ✅ Control total (CTRL+C para detener)

**Requisitos:**
- Python 3.9+ instalado
- `pip install flask`

---

## 🎯 OPCIÓN 2: Con navegador automático
**Archivo:** `iniciar_con_navegador.bat`

Inicia el servidor en una ventana separada y abre el navegador automáticamente.

**Ventajas:**
- ✅ El servidor corre en background
- ✅ Abre navegador automáticamente
- ✅ Puedes seguir usando la consola

**Requisitos:**
- Python 3.9+ instalado
- `pip install flask`

---

## 🛡️ OPCIÓN 3: Batch con verificaciones
**Archivo:** `iniciar_seguro.bat`

Revisa todo antes de iniciar (Python, puertos, archivos).

**Ventajas:**
- ✅ Detecta y advierte de problemas
- ✅ Más mensajes de diagnóstico
- ✅ Manejo de puertos en uso

**Requisitos:**
- Python 3.9+ instalado
- `pip install flask`

---

## 💻 OPCIÓN 4: PowerShell (alternativa moderna)
**Archivo:** `iniciar_servidor.ps1`

Para usuarios que prefieren PowerShell.

**Cómo usar:**
```powershell
# Desde PowerShell (como administrador recomendado):
.\iniciar_servidor.ps1

# Si da error de ejecución:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\iniciar_servidor.ps1
```

**Ventajas:**
- ✅ Colores y formatos mejorados
- ✅ Mejor manejo de errores
- ✅ Interfaz más moderna

**Requisitos:**
- PowerShell 5.0+
- Python 3.9+ instalado
- `pip install flask`

---

## 🔧 VERIFICACIÓN RÁPIDA (Sin dependencias Python)

Si prefieres NO instalar Python, usa:
- **Archivo:** `servidor_turnos.exe` (compilado, 12.8 MB)
- **Cómo:** Doble-clic directo en el .exe
- **Ventaja:** Funciona solo, sin Python

> ⚠️ Nota: El .exe es más grande, pero no necesita Python

---

## 📋 CHECKLIST ANTES DE INICIAR

```
☐ Python instalado? (abre terminal: python --version)
☐ Flask instalado? (pip install flask)
☐ Puerto 5001 disponible? (netstat -an | find ":5001")
☐ Archivo servidor_turnos.py existe?
☐ Archivo nuevo_cuadrante_mejorado.html existe?
```

---

## 🚨 SOLUCIÓN DE PROBLEMAS

### "Python no encontrado"
```
1. Instala Python desde: https://www.python.org
2. Marca "Add Python to PATH"
3. Reinicia la computadora
4. Verifica: python --version
```

### "Flask no instalado"
```
pip install flask
```

### "Puerto 5001 en uso"
```
1. Opción A: Usa otro puerto (modifica servidor_turnos.py)
2. Opción B: Cierra la aplicación anterior
3. netstat -ano | find ":5001"  (ve qué proceso lo usa)
taskkill /PID <numero> /F  (termina ese proceso)
```

### "No se abre el navegador"
```
1. Manualmente ve a http://localhost:5001
2. Verifica firewall de Windows
```

---

## 📂 ESTRUCTURA

```
/
├── iniciar_simple.bat ............... ⭐ RECOMENDADO
├── iniciar_con_navegador.bat ....... Abre navegador automático
├── iniciar_seguro.bat .............. Con verificaciones
├── iniciar_servidor.ps1 ............ Versión PowerShell
├── servidor_turnos.py .............. Backend Flask (necesario)
├── servidor_turnos.exe ............. Alternativa compilada
├── nuevo_cuadrante_mejorado.html ... Frontend (la aplicación)
├── turnos_database.db .............. Se crea automáticamente
└── README_INICIAR.md ............... Este archivo
```

---

## 🎯 PRÓXIMO PASO

**Elige uno de los inicadores y doble-clic. Listo. 🚀**

- **Principiantes:** `iniciar_simple.bat`
- **Usuarios avanzados:** `iniciar_servidor.ps1`
- **Máxima seguridad:** `iniciar_seguro.bat`
- **Sin Python:** `servidor_turnos.exe`

---

## 💡 TIPS

1. **Mantén abierta la ventana del servidor** mientras usas la app
2. **Ctrl+C** en la terminal del servidor para detener
3. **Puedes usar múltiples ventanas del navegador** con la misma app
4. **Los datos se guardan automáticamente** en `turnos_database.db`
5. **Para resetear datos:** elimina `turnos_database.db` y reinicia

---

## 📞 ACCESO

- **URL:** http://localhost:5001
- **Base de datos:** turnos_database.db (SQLite)
- **Datos persistentes:** SÍ (se guardan automáticamente)

¡Disfruta gestionar tus turnos! 🎉
