# 📋 Sistema de Gestión de Turnos

**Versión**: 8.0+ | **Estado**: ✅ Listo para usar  
**Última actualización**: 15 de diciembre de 2025

---

## ⚡ Inicio Rápido (SIN INSTALACIÓN)

### Windows - Opción 1: Usar el .exe (RECOMENDADO)

**El .exe es el servidor compilado. NO requiere nada instalado.**

1. **Haz doble clic en `servidor_turnos.exe`**
2. Se abrirá una ventana cmd (no la cierres)
3. Abre tu navegador: **http://localhost:8000**
4. ¡Listo! Los datos se guardan automáticamente

### Windows - Opción 2: Usar el .bat (si tienes Python)

1. **Haz doble clic en `iniciar_servidor.bat`**
2. Automáticamente detectará Python e iniciará el servidor
3. Abre: **http://localhost:8000**

### macOS / Linux

```bash
cd "ruta/a/la/carpeta"
python3 -m http.server 8000
```

Luego abre: http://localhost:8000

---

## 📂 Estructura de Carpetas

```
Sistema-Gestión-Turnos/
├── servidor_turnos.exe               ← Doble clic (SIN dependencias) ⭐
├── iniciar_servidor.bat              ← Alternativa con Python
├── iniciar_servidor.ps1              ← Script PowerShell
├── nuevo_cuadrante_mejorado.html     ← Aplicación
├── js/modules.js                     ← Lógica
├── css/estilos_pastel4.css          ← Estilos
└── README_QUICK_START.md             ← Este archivo
```

---

## ❓ Preguntas Frecuentes

**¿Qué es servidor_turnos.exe?**
- Es el servidor HTTP compilado
- ✅ Sin Python instalado
- ✅ Sin Node.js
- ✅ Sin nada adicional
- ✅ Un solo archivo

**¿Dónde se guardan los datos?**
- En el navegador (localStorage)
- Se guardan automáticamente
- Se recuperan al reabrir

**¿Funciona sin internet?**
- ✅ Totalmente offline
- ✅ Sin servidores externos
- ✅ Todo local en tu ordenador

**¿Puedo usar en múltiples ordenadores?**
- ✅ Copia la carpeta completa
- ✅ Ejecuta el .exe en cada uno
- ✅ Cada ordenador tiene sus datos

---

## 🔧 Solución de Problemas

### El puerto 8000 está en uso
```bash
taskkill /F /IM python.exe
```

### No funciona el .exe
- Comprueba: Windows Vista o superior
- Intenta el .bat si tienes Python

### Los datos no se guardan
1. Verifica: `http://localhost:8000` (no `file://`)
2. Abre consola (F12) y escribe: `diag()`
3. Comprueba el localStorage

---

## 📦 Requisitos Mínimos

| Opción | Requisitos | Sistema |
|--------|-----------|--------|
| .exe ⭐ | Ninguno | Windows Vista+ |
| .bat | Python 3.6+ | Windows |
| macOS/Linux | Python 3.6+ | Mac/Linux |

---

## 🚀 Para Programadores

### Editar servidor
```bash
# Edita servidor_turnos.py
# Recompila:
python -m PyInstaller --onefile --windowed --name="servidor_turnos" servidor_turnos.py
```

### Agregar funcionalidades
1. Edita `nuevo_cuadrante_mejorado.html`
2. O agrega archivos en `js/`
3. Se aplican al recargar

---

## ✅ Características

- Gestión completa de cuadrantes
- Múltiples tipos de turno
- Filtros por localidad/departamento
- Exportación PDF, Excel, WhatsApp
- Datos persistentes localmente
- Interfaz responsive
- Sin dependencias externas
- Totalmente offline

---

**¿Problemas?** Abre F12 → Consola → Escribe `diag()`

