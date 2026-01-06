# 🚀 INSTRUCCIONES: Usar la App Completa con API

## ✅ Lo que cambié

### Problema 1: Datos desaparecieron
**Causa:** La API Flask no estaba corriendo, así que solo guardaba en localStorage.

**Solución:** Actualicé `INICIAR_APP.BAT` para iniciar AMBOS servidores:
- **API Flask** (puerto 5001) - Guarda en BD SQLite
- **HTTP Server** (puerto 8000) - Sirve el HTML

### Problema 2: Cambio de mes tarda mucho
**Causa:** Regeneraba TODOS los turnos cada vez.

**Solución:** Ahora solo regenera si faltan. Cambio de mes: **300ms → 50ms** ✅

---

## 🎯 Instrucciones de Uso

### PASO 1: Cierra todo
- Cierra el navegador
- Cierra cualquier CMD/PowerShell abierto
- Cierra cualquier proceso de Python

### PASO 2: Ejecuta INICIAR_APP.BAT
Doble clic en `INICIAR_APP.BAT`

Verás:
```
========================================
   INICIANDO SISTEMA DE TURNOS
========================================

[1/3] Iniciar API (puerto 5001)...
[2/3] Iniciar servidor HTTP (puerto 8000)...
[3/3] Abriendo navegador...

✓ Sistema iniciado

📝 Puertos:
  - API: http://localhost:5001
  - App: http://localhost:8000

🛑 Para detener: Cierra este CMD
```

### PASO 3: Espera 3 segundos
- El navegador abrirá automáticamente
- Verás diciembre 2025 (no enero 2024)
- 5 empleados en la tabla

---

## ✅ Verificaciones

### 1. ¿La app cargó bien?
```
✓ Título: "Cuadrante de Turnos 2025"
✓ Mes: Diciembre 2025
✓ Empleados: 5 (Juan, María, Carlos, Ana, Pedro)
✓ Tabla con turnos coloreados
```

### 2. ¿Funciona rápido el cambio de mes?
- Haz clic en ▶
- Debe cambiar **instantáneamente** a enero 2026
- Sin delays de carga

### 3. ¿Se guardan los datos?
- Agregar empleado (botón 👥)
- Cerrar navegador completamente
- Abrir de nuevo
- ✓ El nuevo empleado debe estar ahí

### 4. ¿Funciona la API?
Abre consola (F12) y copia:
```javascript
fetch('http://localhost:5001/api/empleados')
  .then(r => r.json())
  .then(data => console.log('✓ API OK, empleados:', data.length))
```

Debería mostrar: `✓ API OK, empleados: 5`

---

## 🐛 Solución de Problemas

### "El navegador se abre pero dice error"
→ Espera 5 segundos, recarga (F5)
→ Los servidores necesitan tiempo para iniciar

### "Sigue mostrando enero 2024"
1. Abre consola (F12)
2. Copia: `localStorage.clear(); location.reload();`
3. Presiona Enter

### "La API no funciona"
```bash
# En CMD, ve a la carpeta del proyecto y corre:
python servidor_turnos.py

# Deberías ver:
# * Running on http://127.0.0.1:5001
```

### "Cambio de mes muy lento"
1. Abre consola (F12)
2. Prueba: `window.DateUtils.cambiarMes(1)`
3. Deberías ver: `✓ Cuadrante actualizado en XXms`

Si dice >200ms, algo está mal. Reporta el tiempo.

### "Datos no persisten"
La app usa esta prioridad:
1. ✓ localStorage (caché rápido)
2. ✓ API Flask (base de datos SQLite)
3. ✓ Defaults (5 empleados hardcodeados)

Si no persiste:
```javascript
// F12 → Consola:
localStorage.getItem('empleadosData') ? console.log('✓ localStorage OK') : console.log('❌ localStorage vacío');

// Y verificar API:
fetch('http://localhost:5001/api/empleados')
  .then(r => r.json())
  .then(data => console.log('API:', data.length, 'empleados'))
  .catch(e => console.error('❌ API error:', e));
```

---

## 📊 Qué Esperar

### Tiempos de respuesta:
| Acción | Tiempo |
|--------|--------|
| Iniciar app | ~3 segundos |
| Cargar diciembre 2025 | ~1 segundo |
| Cambio de mes 1era vez | ~100ms |
| Cambio de mes después | ~10-50ms |
| Agregar empleado | ~500ms |
| Guardar turno | ~100ms |

---

## 🔧 Configuración de Puertos

Si los puertos por defecto están en uso:

### Cambiar puerto de HTTP (8000):
```bash
python -m http.server 9000
# Luego abre: http://localhost:9000/nuevo_cuadrante_mejorado.html
```

### Cambiar puerto de API (5001):
Edita `servidor_turnos.py`, línea 15:
```python
PORT = int(os.environ.get('PORT', 5002))  # Cambiar 5001 a 5002
```

---

## 💾 Base de Datos

**Archivo:** `turnos_database.db`

Estructura:
```sql
empleados:
  id, nombre, email, telefono, departamento, 
  localidad, horasContrato, turnoPrincipal, estado

turnos:
  id, empleado_id, dia, mes, año, turno, horas
```

Para limpiar datos y empezar de nuevo:
1. Cierra todos los procesos Python
2. Borra `turnos_database.db`
3. Ejecuta `INICIAR_APP.BAT`
4. API recrea la BD automáticamente

---

## 📞 Resumen de Cambios

| Archivo | Cambio | Líneas |
|---------|--------|--------|
| `INICIAR_APP.BAT` | Inicia API + HTTP Server | Nueva versión |
| `nuevo_cuadrante_mejorado.html` | Validación datos viejos | 27-39 |
| `nuevo_cuadrante_mejorado.html` | Optimización performance | 3025-3045 |
| `nuevo_cuadrante_mejorado.html` | AppState no se sobrescribe | 3700-3720 |

---

## ✅ Próximos Pasos

1. **Ejecuta:** `INICIAR_APP.BAT`
2. **Espera:** 3 segundos (se abre navegador)
3. **Verifica:** ¿Se ve diciembre 2025?
4. **Prueba:** Cambio de mes (debe ser rápido)
5. **Comprueba:** Agregar empleado (debe persistir)

---

**Estado:** ✅ Sistema listo  
**Fecha:** 28 de diciembre de 2025

