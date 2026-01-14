# ⚡ QUICK START - PRUEBA RÁPIDA (5 MINUTOS)

## Lo Que Necesitas Saber

✅ **Todos tus datos se guardan automáticamente en tu navegador**
✅ **Al cambiar de mes, tus datos anteriores NO se borran**
✅ **Puedes descargar un backup JSON con un botón**
✅ **Puedes cargar ese backup en otra ventana/navegador**

---

## PRUEBA EN 3 PASOS

### PASO 1: Crea datos en ENERO (1 minuto)
```
1. Abre: nuevo_cuadrante_mejorado.html
2. Haz clic en un turno cualquiera (ej: día 5 para "María")
3. Selecciona "Mañana"
4. Verás "✔ Cambios guardados" en esquina inferior derecha
5. ¡Listo! Ya está guardado en tu navegador
```

### PASO 2: Cambia a FEBRERO (30 segundos)
```
1. Arriba a la derecha, haz clic en la flecha > (SIGUIENTE MES)
2. Ahora ves FEBRERO vacío
3. Crea 1-2 turnos en FEBRERO
```

### PASO 3: Vuelve a ENERO (10 segundos)
```
1. Haz clic en la flecha < (MES ANTERIOR)
2. 🎉 ¡TUS DATOS DE ENERO SIGUEN AQUI!
3. María debe tener su turno en el día 5
```

**Si llegaste aquí, la persistencia funciona ✅**

---

## CÓMO HACER UN BACKUP

```
1. Abre el Panel de Control (🎛️ arriba a la izquierda)
2. Baja hasta "Datos Locales"
3. Haz clic en "💾 Respaldar (JSON)"
4. Se descargará un archivo backup_turnos_2026-01-14.json
5. Guárdalo donde quieras (tu escritorio, por ejemplo)
```

---

## CÓMO CARGAR UN BACKUP

```
1. Abre una NUEVA ventana del navegador (anónima si quieres)
2. Abre nuevo_cuadrante_mejorado.html
3. Panel de Control > "📂 Importar (JSON)"
4. Selecciona tu archivo backup_turnos_XXXX.json
5. 🎉 ¡Todos tus datos se restauran!
```

---

## PREGUNTAS FRECUENTES

**P: ¿Dónde se guardan mis datos?**
R: En el almacenamiento local del navegador (tu disco duro). NO en ningún servidor.

**P: ¿Si borro el historial de navegación se pierden?**
R: SÍ. El almacenamiento local se borra. Por eso haz backups regularmente.

**P: ¿Puedo usar la app sin internet?**
R: SÍ. 100% funciona offline. No necesita servidor.

**P: ¿Qué es ese archivo JSON que descargo?**
R: Es tu base de datos portátil. Contiene TODOS tus empleados y turnos de TODOS los meses.

**P: ¿Puedo editar el JSON a mano?**
R: No se recomienda, pero sí, es un JSON válido.

---

## INDICADORES VISUALES QUE DEBES VER

| Indicador | Significado |
|-----------|------------|
| ✔ Cambios guardados en JSON local | Datos guardados en tu navegador |
| 📋 Turnos cargados | Se están mostrando los datos |
| 💾 Archivo descargado | Tu backup está en Descargas/ |
| 📥 Datos importados. Recargando | Se está restaurando tu backup |

---

## SI ALGO NO FUNCIONA

### Los datos desaparecen al cambiar mes
→ Abre DevTools (F12) > Console
→ Busca errores en rojo
→ Guarda un backup antes de hacer nada más

### El backup no se descarga
→ Verifica que el navegador no bloqueé descargas
→ Comprueba la carpeta Descargas/

### El import no funciona
→ Usa un archivo JSON que hayas descargado desde esta app
→ No intentes editar el JSON manualmente

### Veo "localStorage corrupto"
→ Limpia todo con Ctrl + Shift + Delete
→ Recarga la página
→ Vuelve a empezar (sin backups, perdió todo)

---

## RESUMEN FINAL

```
✅ Datos = Guardados automáticamente
✅ Cambio de mes = Datos preservados
✅ Backup = Descargable como JSON
✅ Restore = Cargable en cualquier navegador
✅ Privacidad = 100% local, sin servidores
```

¡Listo! La app está lista para usar.
