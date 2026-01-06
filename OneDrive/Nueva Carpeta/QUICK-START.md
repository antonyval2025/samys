# ⚡ Quick Start - Sistema de Gestión de Turnos v8.0+

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ **Opción A: Con Servidor Local (Recomendado)**

#### En PowerShell:
```powershell
# Navegar a la carpeta del proyecto
cd "c:\Users\samys\OneDrive\Nueva Carpeta"

# Opción 1: Python (más común)
python -m http.server 8000

# Opción 2: Node.js http-server
npx http-server -p 8000

# Opción 3: Script automático
.\servidor-local.ps1
```

#### En navegador:
```
http://localhost:8000/nuevo_cuadrante_mejorado.html
```

---

### 2️⃣ **Opción B: Sin Servidor (Abrir directamente)**

Simplemente haz doble clic en `nuevo_cuadrante_mejorado.html`

⚠️ Algunas funciones pueden no funcionar (CORS)

---

### 3️⃣ **Opción C: VS Code Live Server**

```
1. Click derecho en nuevo_cuadrante_mejorado.html
2. "Open with Live Server"
3. Navegador abre automáticamente
```

---

## ✅ Verificar que Funciona

### ✔️ Tests Automáticos
Abre en navegador:
```
http://localhost:8000/test-integracion.html
```
Deberías ver todos los tests en verde ✅

### ✔️ Consola del Navegador (F12)
```javascript
// Copiar y pegar en DevTools > Console:
console.log(AppState.scheduleData.size) // Debe mostrar un número
```

---

## 🎯 Primeros Pasos en la Aplicación

### 1. **Ver el Cuadrante General**
   - ✅ Ya está cargado al abrir la página
   - Muestra todos los empleados y sus turnos

### 2. **Cambiar un Turno**
   - Click en cualquier celda de turno (ej: "mañana")
   - Se abre modal con opciones
   - Click en turno nuevo (ej: "noche")
   - Click "Guardar" para aplicar cambio

### 3. **Generar un Reporte**
   - Panel derecho > "Generar Reportes"
   - Elige tipo de reporte
   - Click "Descargar PDF"

### 4. **Ver Empleado Individual**
   - Panel derecho > Selecciona empleado
   - Aparece info completa:
     - Turnos del mes
     - Horas totales
     - Estadísticas

---

## 📁 Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `nuevo_cuadrante_mejorado.html` | 🎯 **ABRIR ESTO** - Aplicación principal |
| `test-integracion.html` | 🧪 Verificar que todo funciona |
| `INTEGRACION.md` | 📚 Documentación técnica |
| `README.md` | 📖 Manual de usuario |
| `COMPLETADO.md` | ✅ Resumen de lo hecho |

---

## ⌨️ Atajos Útiles

| Acción | Cómo |
|--------|------|
| Cambiar mes | Selectores en cabecera |
| Editar turno rápido | Click en turno + modal |
| Edición masiva | Botón "📝 Edición Masiva" (panel derecho) |
| Ver historial | Consola → `SistemaAuditoria.obtenerHistorialEmpleado(1)` |
| Balancear turnos | Consola → `BalanceadorTurnos.aplicarBalanceoAutomatico()` |
| Generar reporte | Botón "📊 Generar Reportes" |

---

## 🔧 Solucionar Problemas

### ❌ "Módulo no encontrado"
```
✅ Solución: 
   - Asegurar que carpeta 'js/' existe
   - Verificar archivos están en la ubicación correcta
   - Usar servidor local (no file://)
```

### ❌ "CSS no carga"
```
✅ Solución:
   - Asegurar que carpeta 'css/' existe
   - Verificar archivo estilos.css está ahí
   - Refrescar página (Ctrl+Shift+R)
```

### ❌ "No puedo editar turnos"
```
✅ Solución:
   - Abrir consola (F12)
   - Ver si hay errores en rojo
   - Asegurar que AppState está cargado
```

### ❌ "PDF no descarga"
```
✅ Solución:
   - Usar servidor local (http://)
   - No abrir como file:///
   - Instalar librería jsPDF (ya incluida)
```

---

## 📊 Datos de Prueba

La aplicación viene con 7 empleados de prueba:

| Nombre | Rol | Estado |
|--------|-----|--------|
| Juan García | Supervisor | Activo |
| María López | Empleado | Activo |
| Carlos Martín | Empleado | Activo |
| Ana Rodríguez | Empleado | Activo |
| Pedro Sánchez | Empleado | Activo |
| Laura Díaz | Empleado | Vacaciones |
| Roberto Gómez | Empleado | Activo |

---

## 🎓 Recursos

### Documentación
- 📖 [README.md](README.md) - Manual completo
- 🏗️ [ARQUITECTURA.md](ARQUITECTURA.md) - Cómo funciona internamente
- 🔗 [INTEGRACION.md](INTEGRACION.md) - Cómo se integran los módulos
- ✅ [COMPLETADO.md](COMPLETADO.md) - Resumen del proyecto

### Código
- 💡 [js/ejemplos-y-best-practices.js](js/ejemplos-y-best-practices.js) - 10 ejemplos de uso
- 🔐 [.github/copilot-instructions.md](.github/copilot-instructions.md) - Para IA agents

---

## ❓ FAQ Rápidas

**P: ¿Puedo usar esto sin servidor?**  
R: Sí, pero algunos features no funcionarán. Recomendado usar servidor local.

**P: ¿Se guardan los datos?**  
R: Sí, en localStorage del navegador. Persisten cuando cierras el navegador.

**P: ¿Puedo exportar datos?**  
R: Sí, a PDF, Excel, y compartir por WhatsApp.

**P: ¿Qué navegadores soporta?**  
R: Chrome, Firefox, Edge, Safari (últimas 2 versiones).

**P: ¿Qué es localhost:8000?**  
R: Un servidor web local en tu computadora. Solo tú puedes acceder.

---

## 🚀 Siguiente Paso

Después de verificar que funciona:

```
1. Ejecuta test-integracion.html ✅
2. Prueba cambiar algunos turnos
3. Genera un reporte PDF
4. Explora la documentación
5. ¿Listo para más? → INTEGRACION.md
```

---

**¡Listo para usar!** 🎉

Cualquier pregunta, ver [README.md](README.md) o [INTEGRACION.md](INTEGRACION.md)
