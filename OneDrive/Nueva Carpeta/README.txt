# 🎯 Sistema de Gestión de Turnos - Inicio Rápido

## ¿Qué es esto?

Aplicación web para gestionar turnos de empleados con **persistencia real en base de datos SQLite**.

## ✅ Instalación (Primera Vez)

### 1. Instalar Python 3.8+
- Descarga: https://www.python.org/downloads/
- **Importante:** Marca "Add Python to PATH" durante la instalación

### 2. Instalar dependencias
Abre PowerShell en esta carpeta y ejecuta:
```powershell
pip install flask flask-cors
```

## 🚀 Inicio Rápido

### Opción 1: Doble clic en iniciar.bat (Recomendado)
1. **Haz doble clic** en `iniciar.bat`
2. El servidor se iniciará automáticamente
3. El navegador se abrirá automáticamente
4. ¡Listo! Puedes empezar a usar la aplicación

### Opción 2: PowerShell
```powershell
# Ejecutar con PowerShell
.\iniciar.ps1
```

### Opción 3: Manual
```powershell
# Desde PowerShell en esta carpeta
python servidor_turnos.py

# Luego abre: http://localhost:5001
```

## 📊 Características

✅ **Base de Datos Permanente**
- Los datos se guardan en `turnos_database.db`
- Nunca se pierden (no dependen de localStorage)
- Ubicación: `C:\Users\samys\OneDrive\Nueva Carpeta\turnos_database.db`

✅ **Gestión de Empleados**
- Agregar, editar, eliminar empleados
- Campos: Nombre, Email, Teléfono, Departamento, Localidad, etc.

✅ **Generación de Turnos**
- Turnos automáticos para el mes
- Tipos: Mañana, Tarde, Noche, Descanso, Vacaciones, etc.
- Edición masiva de turnos

✅ **Exportación**
- Exportar a PDF (individual o completo)
- Enviar por WhatsApp
- Exportar a Excel

## 🔧 Troubleshooting

### "Error: Puerto 5001 en uso"
```powershell
# Usar otro puerto
python servidor_turnos.py --port 5002
# Luego accede a: http://localhost:5002
```

### "Error: Flask no instalado"
```powershell
pip install flask flask-cors
```

### "No puedo ejecutar .ps1"
En PowerShell como administrador:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "La página no carga"
1. Verifica que el servidor está corriendo (ventana de consola)
2. Abre: http://localhost:5001/api/empleados
3. Si ves JSON, el servidor funciona
4. Si no, revisa la consola del servidor para errores

## 📱 Rutas API

La aplicación usa una API REST con las siguientes rutas:

```
GET    /api/empleados                    # Listar empleados
POST   /api/empleados                    # Crear empleado
PUT    /api/empleados/<id>               # Actualizar empleado
DELETE /api/empleados/<id>               # Eliminar empleado

GET    /api/turnos/<emp_id>?mes=X&anio=Y  # Obtener turnos
POST   /api/turnos/<emp_id>                # Guardar turnos

GET    /api/tipos-turno                  # Tipos de turno disponibles
```

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `iniciar.bat` | ⭐ Script para iniciar todo (doble clic) |
| `iniciar.ps1` | Script PowerShell alternativo |
| `servidor_turnos.py` | Servidor Flask con API REST |
| `nuevo_cuadrante_mejorado.html` | Aplicación web (frontend) |
| `turnos_database.db` | Base de datos (se crea automáticamente) |
| `GUIA_BD_RAPIDA.txt` | Documentación completa |

## 💾 Backup

### Hacer backup
```powershell
Copy-Item turnos_database.db backup_$(Get-Date -Format "yyyyMMdd_HHmmss").db
```

### Restaurar desde backup
```powershell
# 1. Detén el servidor (Ctrl+C)
# 2. Elimina turnos_database.db
# 3. Copia tu backup
Copy-Item backup_20250101_120000.db turnos_database.db
# 4. Reinicia el servidor
```

## 🌐 Acceso Remoto

Si quieres acceder desde otra PC en la red:

1. Abre `servidor_turnos.py`
2. Cambia `host='0.0.0.0'` (ya está así)
3. Accede desde: `http://192.168.1.X:5001` (tu IP local)

## 📚 Documentación Adicional

- [GUIA_BD_RAPIDA.txt](GUIA_BD_RAPIDA.txt) - Guía completa de base de datos
- [PERSISTENCIA_BD.md](PERSISTENCIA_BD.md) - Documentación técnica
- [copilot-instructions.md](.github/copilot-instructions.md) - Documentación del sistema

## ⚠️ Notas Importantes

1. **Python 3.7+** es requerido
2. El servidor corre en **puerto 5001** (puede cambiarse)
3. La BD está en **SQLite3** (no requiere servidor separado)
4. **CORS** está habilitado para desarrollo

## 🎓 Primer Uso

1. Haz clic en "👥 Gestionar Empleados"
2. Completa el formulario y haz clic en "Guardar"
3. El empleado se agrega a la BD automáticamente
4. Selecciona empleado y haz clic en "Generar Turnos"
5. Los turnos se generan automáticamente
6. Puedes editar turnos individuales o en masa

## 🆘 Soporte

Si encuentras problemas:

1. **Lee la consola del servidor** (ventana negro con errores)
2. **Abre DevTools** del navegador (F12) → Pestaña Console
3. **Verifica logs** ejecutando: `python servidor_turnos.py` en la terminal
4. **Revisa el archivo .db** con SQLite Browser si es necesario

## ✨ Versión

Sistema de Gestión de Turnos v10.0
- ✅ API REST con Flask
- ✅ Base de Datos SQLite
- ✅ Inicio automático
- ✅ Navegador automático
- ✅ CORS habilitado

---

¡Disfruta del sistema! 🚀
