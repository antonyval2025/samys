#!/usr/bin/env python3
"""
Documentación - Sistema de Persistencia con Base de Datos SQLite
"""

DOCUMENTACION = """
═══════════════════════════════════════════════════════════════════════════════
                    SISTEMA DE PERSISTENCIA CON BASE DE DATOS
═══════════════════════════════════════════════════════════════════════════════

## ¿QUÉ CAMBIÓ?

Anteriormente, los datos se guardaban en `localStorage` del navegador, lo que significa:
- ❌ Los datos se perdían cuando se limpiaba el caché
- ❌ Solo funcionaba en el navegador actual (no sincronización)
- ❌ Límite de 5-10 MB de almacenamiento
- ❌ No había respaldo independiente

Ahora, con la nueva arquitectura:
- ✅ Datos en base de datos SQLite (turnos_database.db)
- ✅ Persistencia permanente e independiente de la aplicación
- ✅ API REST para acceso desde cualquier cliente
- ✅ Respaldo automático de toda la información

═══════════════════════════════════════════════════════════════════════════════

## ARQUITECTURA

┌─────────────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (Frontend)                                 │
│  nuevo_cuadrante_mejorado.html + JavaScript                                 │
│  - Interfaz de usuario (tablas, formularios, modales)                       │
│  - Llamadas HTTP a /api/* (fetch)                                           │
└────────────┬──────────────────────────────────────────────────────────────┬─┘
             │                                                              │
         HTTP/REST                                                      HTTP/REST
         GET/POST/PUT/DELETE                                          GET/POST/PUT/DELETE
             │                                                              │
┌────────────▼──────────────────────────────────────────────────────────────▼─┐
│                    SERVIDOR FLASK (Backend - servidor_turnos.py)            │
│  - API REST con rutas /api/*                                                │
│  - Validación de datos                                                      │
│  - Gestión de base de datos                                                │
│  - CORS habilitado (acceso desde cualquier origen)                          │
└────────────┬──────────────────────────────────────────────────────────────┬─┘
             │                                                              │
         SQL Queries                                                    SQL Queries
             │                                                              │
┌────────────▼──────────────────────────────────────────────────────────────▼─┐
│                    BASE DE DATOS SQLITE (turnos_database.db)                │
│  Tablas:                                                                     │
│  - empleados (id, nombre, departamento, localidad, ...)                     │
│  - turnos (id, empleado_id, dia, mes, anio, turno, horas, ...)            │
│  - tipos_turno (id, nombre, horario, color, horas)                         │
└──────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════

## CÓMO INICIAR

### Opción 1: Usar el script de inicio (Recomendado)
1. Abre Windows PowerShell o Cmd
2. Navega a: C:\\Users\\samys\\OneDrive\\Nueva Carpeta
3. Ejecuta: iniciar.bat
4. Abre navegador: http://localhost:8000

### Opción 2: Manual con Python
cd "C:\\Users\\samys\\OneDrive\\Nueva Carpeta"
python servidor_turnos.py

### Opción 3: Con puerto específico
python servidor_turnos.py --port 8080

═══════════════════════════════════════════════════════════════════════════════

## RUTAS API REST

### Empleados

1. OBTENER todos los empleados
   GET /api/empleados
   Ejemplo: curl http://localhost:8000/api/empleados

2. CREAR nuevo empleado
   POST /api/empleados
   Body JSON:
   {
     "nombre": "María García",
     "email": "maria@email.com",
     "telefono": "600123456",
     "departamento": "Enfermería",
     "localidad": "Madrid",
     "horasContrato": 160,
     "turnoPrincipal": "mañana",
     "estado": "activo"
   }

3. ACTUALIZAR empleado
   PUT /api/empleados/<id>
   Body JSON: (mismo formato que POST)

4. ELIMINAR empleado
   DELETE /api/empleados/<id>

### Turnos

1. OBTENER turnos de un empleado (mes específico)
   GET /api/turnos/<emp_id>?mes=0&anio=2025
   (mes: 0-11, donde 0=enero, 11=diciembre)

2. GUARDAR turnos de un empleado
   POST /api/turnos/<emp_id>
   Body JSON:
   {
     "mes": 0,
     "anio": 2025,
     "turnos": [
       { "dia": 1, "turno": "mañana", "horas": 8, "fecha": "2025-01-01", "esFinSemana": false },
       { "dia": 2, "turno": "tarde", "horas": 8, "fecha": "2025-01-02", "esFinSemana": false }
     ]
   }

### Tipos de Turno

1. OBTENER tipos de turno disponibles
   GET /api/tipos-turno

═══════════════════════════════════════════════════════════════════════════════

## UBICACIÓN DE LA BASE DE DATOS

La base de datos se guarda en el mismo directorio de la aplicación:

C:\\Users\\samys\\OneDrive\\Nueva Carpeta\\turnos_database.db

Características:
- Archivo SQLite (compatible con cualquier cliente SQLite)
- Se crea automáticamente al iniciar el servidor
- Incluye todas las tablas y datos iniciales
- Respaldable fácilmente (copiar el archivo)

═══════════════════════════════════════════════════════════════════════════════

## CÓMO FUNCIONA AHORA

### Agregar Empleado

ANTES (localStorage):
1. Usuario llena formulario en navegador
2. JavaScript valida datos
3. Datos se guardan en localStorage del navegador
4. ❌ Problema: Si limpias cache, desaparecen

AHORA (API + Base de Datos):
1. Usuario llena formulario en navegador
2. JavaScript valida datos
3. JavaScript hace POST a /api/empleados
4. Servidor Flask recibe datos
5. Base de datos SQLite guarda datos
6. ✅ Datos permanentes, independientes del navegador

### Cargar Empleados

ANTES:
1. Página carga
2. JavaScript lee localStorage.empleadosData
3. ❌ Si está vacío, no hay datos

AHORA:
1. Página carga
2. JavaScript hace GET a /api/empleados
3. Servidor responde con datos de base de datos
4. ✅ Siempre hay datos (están en la BD)

### Guardar Cambios de Turnos

ANTES:
1. Usuario cambia turno en tabla
2. AppState.saveToStorage() → localStorage
3. ❌ Datos solo en navegador actual

AHORA:
1. Usuario cambia turno en tabla
2. AppState.saveToStorage() → POST /api/turnos/<emp_id>
3. Servidor guarda en base de datos
4. ✅ Datos disponibles desde cualquier navegador/dispositivo

═══════════════════════════════════════════════════════════════════════════════

## VENTAJAS DE ESTA ARQUITECTURA

1. **Persistencia Real**
   - Los datos nunca se pierden
   - Existirán mientras no elimines el archivo .db

2. **Sincronización**
   - Múltiples usuarios pueden acceder simultáneamente
   - Los datos están centralizados

3. **Respaldo**
   - Solo copia el archivo turnos_database.db
   - Puedes hacer backup diario/semanal

4. **Escalabilidad**
   - Fácil migrar a bases de datos más grandes (MySQL, PostgreSQL)
   - La API REST es compatible con cualquier frontend

5. **Seguridad**
   - Datos no dependen del caché del navegador
   - Validación en servidor
   - Mejor auditoría de cambios

═══════════════════════════════════════════════════════════════════════════════

## TROUBLESHOOTING

### Problema: "Error al conectar a /api/empleados"
Solución:
1. Verifica que el servidor está corriendo: http://localhost:8000
2. Abre la consola del navegador (F12)
3. Busca mensajes de error en la pestaña "Console"

### Problema: "No se crea turnos_database.db"
Solución:
1. Asegúrate de que SQLite3 está disponible en Python
2. Intenta ejecutar: python -c "import sqlite3; print('OK')"
3. Revisa que tienes permisos de escritura en la carpeta

### Problema: Puerto 8000 en uso
Solución:
1. Usa otro puerto: python servidor_turnos.py --port 8080
2. Accede en: http://localhost:8080

### Problema: Flask no instalado
Solución:
1. Instala: pip install flask flask-cors
2. O ejecuta el script setup nuevamente

═══════════════════════════════════════════════════════════════════════════════

## RESPALDO Y RECUPERACIÓN

### Hacer respaldo
1. Copia el archivo: turnos_database.db
2. Guárdalo en un lugar seguro (USB, OneDrive, etc.)

### Restaurar desde respaldo
1. Detén el servidor (Ctrl+C)
2. Elimina el archivo turnos_database.db actual
3. Copia tu respaldo y renómbralo a turnos_database.db
4. Inicia el servidor nuevamente

### Exportar datos a JSON
1. Abre http://localhost:8000/api/empleados
2. Los datos se mostrarán en formato JSON
3. Copia y guarda en un archivo .json

═══════════════════════════════════════════════════════════════════════════════

## MIGRACIÓN DESDE localStorage A BASE DE DATOS

Si ya tenías datos en localStorage:

1. Abre el archivo antiguo (nuevo_cuadrante_mejorado.html)
2. Abre la consola del navegador (F12)
3. Ejecuta: JSON.parse(localStorage.getItem('empleadosData'))
4. Copia los datos
5. Ahora con el nuevo servidor:
   - Los empleados se cargarán automáticamente desde la API
   - Si están vacíos, puedes copiar los datos antiguos manualmente

═══════════════════════════════════════════════════════════════════════════════

## TECNOLOGÍAS UTILIZADAS

- **Frontend**: HTML/CSS/JavaScript (vanilla, sin frameworks)
- **Backend**: Python Flask (librería HTTP minimalista)
- **Base de Datos**: SQLite3 (sin instalación, incluido en Python)
- **API**: REST JSON
- **CORS**: Habilitado para acceso desde navegadores

═══════════════════════════════════════════════════════════════════════════════

## PRÓXIMOS PASOS

1. Inicia el servidor con: iniciar.bat
2. Abre: http://localhost:8000 en tu navegador
3. Agrega empleados - se guardarán en la BD
4. Genera turnos - se guardarán en la BD
5. Verifica: C:\\Users\\samys\\OneDrive\\Nueva Carpeta\\turnos_database.db

¡Los datos ahora tienen persistencia real! 🎉

═══════════════════════════════════════════════════════════════════════════════
"""

if __name__ == "__main__":
    print(DOCUMENTACION)
