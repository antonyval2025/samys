# 🚀 Cómo Iniciar el Cuadrante de Turnos

## Opción 1: Windows - Doble clic (RECOMENDADO)

1. **Busca y abre:** `INICIAR_APP.BAT`
2. **El navegador se abrirá automáticamente** en `http://localhost:8000`
3. **¡Listo!** Verás el cuadrante de turnos

## Opción 2: Línea de comandos (CMD o PowerShell)

```bash
python verificar_cuadrante.py
```

Se abrirá automáticamente en `http://localhost:8000`

## Opción 3: Manual (si las otras no funcionan)

### 3a. Abre el servidor HTTP:
```bash
# PowerShell
python -m http.server 8000

# O CMD
python -m http.server 8000
```

### 3b. Abre el navegador:
- Ve a: `http://localhost:8000/nuevo_cuadrante_mejorado.html`

---

## ✅ Verificación Rápida

Después de abrir, deberías ver:

- ✓ Título: "Cuadrante de Turnos 2025"
- ✓ Mes actual: Diciembre 2025
- ✓ 5 empleados: Juan, María, Carlos, Ana, Pedro
- ✓ Tabla con turnos coloreados
- ✓ Botones ◀ ▶ para cambiar mes

---

## 🐛 Solución de Problemas

### "No se puede conectar a localhost:8000"

**Causa:** Puerto 8000 está ocupado

**Solución 1:** Cierra el navegador y ejecuta:
```bash
taskkill /F /IM python.exe
```

**Solución 2:** Usa otro puerto:
```bash
python -m http.server 9000
# Abre: http://localhost:9000/nuevo_cuadrante_mejorado.html
```

### "Archivo no encontrado" o "Access denied"

**Solución:**
1. Asegúrate que `nuevo_cuadrante_mejorado.html` existe en la carpeta
2. Cierra VS Code si lo está usando
3. Intenta de nuevo

### Error de Pylint en VS Code

**Causa:** VS Code intenta validar archivos Python mientras se ejecutan

**Solución:**
1. Abre Settings: `Ctrl+,`
2. Busca: `python.linting.enabled`
3. Desactívalo o ignora los errores
4. El servidor HTTP no usa validación de Python

---

## 📝 Requisitos Previos

- ✓ Python 3.7+ instalado
- ✓ `nuevo_cuadrante_mejorado.html` en la carpeta
- ✓ `verificar_cuadrante.py` en la carpeta
- ✓ Puerto 8000 disponible (o cambiable)

---

## 🔗 URLs Importantes

| Recurso | URL |
|---------|-----|
| Cuadrante General | http://localhost:8000/nuevo_cuadrante_mejorado.html |
| Cambio de Mes | Botones ◀ ▶ en la interfaz |
| Editar Turno | Clic en celda del turno |
| Listar Empleados | Botón "👥 Gestionar Empleados" |

---

## ⏱️ Tiempos Esperados

- Arranque: ~3 segundos
- Carga de página: ~1 segundo
- Cambio de mes: Inmediato (~0.5s)
- Edición de turno: Inmediato

---

## 💾 Datos Guardados

Los datos se guardan automáticamente en:
- `localStorage` del navegador (sincronizado cada cambio)
- Persisten aunque cierres el navegador

Para limpiar datos:
```javascript
// En consola del navegador (F12):
localStorage.clear()
location.reload()
```

---

**Última actualización:** 28 de diciembre de 2025
**Estado:** ✅ Listo para usar
