# GUÍA: Crear servidor_turnos.exe (SIN DEPENDENCIAS)

Este .exe NO requiere nada instalado. Funciona en cualquier ordenador.

## PARA USUARIOS

Si ya tienes `servidor_turnos.exe` en esta carpeta:
- Solo haz doble clic en él
- Se inicia automáticamente el servidor
- No necesitas Python ni nada más

## PARA DESARROLLADORES - Crear el .exe

### Requisitos (una sola vez)
```bash
pip install pyinstaller
```

### Generar el .exe (ejecutar en esta carpeta)
```bash
pyinstaller --onefile --windowed --icon=icon.ico --name="servidor_turnos" servidor_turnos.py
```

### Resultado
- Genera carpeta `dist/`
- Dentro está `servidor_turnos.exe`
- Copia ese .exe a esta carpeta

### Distribución
- Usuarios reciben esta carpeta con:
  * `nuevo_cuadrante_mejorado.html`
  * `servidor_turnos.exe` ← Único requisito
  * Carpetas `css/`, `js/`, etc.

## Alternativa: Pre-compilado

Si necesitas generar el .exe automáticamente para distribución:

```python
import subprocess
import sys

# Instalar PyInstaller
subprocess.run([sys.executable, "-m", "pip", "install", "pyinstaller", "-q"])

# Generar .exe
subprocess.run([
    "pyinstaller",
    "--onefile",
    "--windowed",
    "--name=servidor_turnos",
    "servidor_turnos.py"
])

print("✓ Archivo generado: dist/servidor_turnos.exe")
```

## Ventajas del .exe
✅ No requiere Python instalado
✅ No requiere instalar paquetes
✅ Funciona en cualquier Windows
✅ Una sola carpeta para distribuir
✅ Experiencia de usuario profesional
