#!/usr/bin/env python3
"""
Servidor HTTP con API REST para Sistema de Gestión de Turnos
Usa SQLite para persistencia de datos independiente de la aplicación
"""

import os
import sys
import json
import sqlite3
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# Configuración
PORT = int(os.environ.get('PORT', 5001))
DB_PATH = Path.cwd() / 'turnos_database.db'

def init_database():
    """Inicializar base de datos SQLite"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Tabla empleados
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS empleados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            departamento TEXT,
            localidad TEXT,
            horasContrato INTEGER DEFAULT 160,
            turnoPrincipal TEXT DEFAULT 'mañana',
            estado TEXT DEFAULT 'activo',
            email TEXT,
            telefono TEXT,
            foto TEXT
        )
    ''')

    # Tabla turnos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empleado_id INTEGER,
            dia INTEGER,
            mes INTEGER,
            anio INTEGER,
            turno TEXT,
            horas REAL DEFAULT 8.0,
            fecha TEXT,
            esFinSemana BOOLEAN DEFAULT 0,
            FOREIGN KEY (empleado_id) REFERENCES empleados (id)
        )
    ''')

    # Tabla tipos_turno
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tipos_turno (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT UNIQUE,
            horario TEXT,
            color TEXT,
            horas REAL DEFAULT 8.0
        )
    ''')

    # Insertar tipos de turno por defecto si no existen
    tipos_default = [
        ('mañana', '08:00-16:00', '#d4edda', 8.0),
        ('tarde', '16:00-00:00', '#fff3cd', 8.0),
        ('noche', '00:00-08:00', '#f8d7da', 8.0),
        ('mixto', '08:00-20:00', '#e2e3e5', 12.0),
        ('descanso', 'Libre', '#f8f9fa', 0.0),
        ('vacaciones', 'Vacaciones', '#cce5ff', 0.0),
        ('baja', 'Baja', '#f5c6cb', 0.0),
        ('festivo', 'Festivo', '#d1ecf1', 0.0),
        ('libre', 'Libre', '#f8f9fa', 0.0)
    ]

    for tipo in tipos_default:
        cursor.execute('''
            INSERT OR IGNORE INTO tipos_turno (nombre, horario, color, horas)
            VALUES (?, ?, ?, ?)
        ''', tipo)

    conn.commit()
    conn.close()
    print(f"[+] Base de datos inicializada: {DB_PATH}")

# Rutas API

@app.route('/api/empleados', methods=['GET'])
def get_empleados():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM empleados')
    empleados = cursor.fetchall()
    conn.close()

    # Convertir a lista de diccionarios
    empleados_list = []
    for emp in empleados:
        empleados_list.append({
            'id': emp[0],
            'nombre': emp[1],
            'departamento': emp[2],
            'localidad': emp[3],
            'horasContrato': emp[4],
            'turnoPrincipal': emp[5],
            'estado': emp[6],
            'email': emp[7],
            'telefono': emp[8],
            'foto': emp[9]
        })

    return jsonify(empleados_list)

@app.route('/api/empleados', methods=['POST'])
def add_empleado():
    data = request.get_json()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        INSERT INTO empleados (nombre, departamento, localidad, horasContrato, turnoPrincipal, estado, email, telefono, foto)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['nombre'],
        data.get('departamento', ''),
        data.get('localidad', ''),
        data.get('horasContrato', 160),
        data.get('turnoPrincipal', 'mañana'),
        data.get('estado', 'activo'),
        data.get('email', ''),
        data.get('telefono', ''),
        data.get('foto', None)
    ))

    empleado_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'id': empleado_id, 'message': 'Empleado agregado'}), 201

@app.route('/api/empleados/<int:emp_id>', methods=['PUT'])
def update_empleado(emp_id):
    data = request.get_json()
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
        UPDATE empleados SET
            nombre = ?, departamento = ?, localidad = ?,
            horasContrato = ?, turnoPrincipal = ?, estado = ?,
            email = ?, telefono = ?, foto = ?
        WHERE id = ?
    ''', (
        data['nombre'],
        data.get('departamento', ''),
        data.get('localidad', ''),
        data.get('horasContrato', 160),
        data.get('turnoPrincipal', 'mañana'),
        data.get('estado', 'activo'),
        data.get('email', ''),
        data.get('telefono', ''),
        data.get('foto', None),
        emp_id
    ))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Empleado actualizado'})

@app.route('/api/empleados/<int:emp_id>', methods=['DELETE'])
def delete_empleado(emp_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Eliminar turnos asociados
    cursor.execute('DELETE FROM turnos WHERE empleado_id = ?', (emp_id,))
    # Eliminar empleado
    cursor.execute('DELETE FROM empleados WHERE id = ?', (emp_id,))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Empleado eliminado'})

@app.route('/api/turnos/<int:emp_id>', methods=['GET'])
def get_turnos_empleado(emp_id):
    mes = request.args.get('mes', type=int)
    anio = request.args.get('anio', type=int)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if mes and anio:
        cursor.execute('''
            SELECT dia, turno, horas, fecha, esFinSemana
            FROM turnos
            WHERE empleado_id = ? AND mes = ? AND anio = ?
            ORDER BY dia
        ''', (emp_id, mes, anio))
    else:
        cursor.execute('''
            SELECT dia, mes, anio, turno, horas, fecha, esFinSemana
            FROM turnos
            WHERE empleado_id = ?
            ORDER BY anio DESC, mes DESC, dia
        ''', (emp_id,))

    turnos = cursor.fetchall()
    conn.close()

    turnos_list = []
    for turno in turnos:
        if mes and anio:
            turnos_list.append({
                'dia': turno[0],
                'turno': turno[1],
                'horas': turno[2],
                'fecha': turno[3],
                'esFinSemana': bool(turno[4])
            })
        else:
            turnos_list.append({
                'dia': turno[0],
                'mes': turno[1],
                'anio': turno[2],
                'turno': turno[3],
                'horas': turno[4],
                'fecha': turno[5],
                'esFinSemana': bool(turno[6])
            })

    return jsonify(turnos_list)

@app.route('/api/turnos/<int:emp_id>', methods=['POST'])
def save_turnos_empleado(emp_id):
    data = request.get_json()
    mes = data.get('mes')
    anio = data.get('anio')
    turnos = data.get('turnos', [])

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Eliminar turnos existentes para este empleado/mes/año
    cursor.execute('DELETE FROM turnos WHERE empleado_id = ? AND mes = ? AND anio = ?', (emp_id, mes, anio))

    # Insertar nuevos turnos
    for turno in turnos:
        cursor.execute('''
            INSERT INTO turnos (empleado_id, dia, mes, anio, turno, horas, fecha, esFinSemana)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            emp_id,
            turno['dia'],
            mes,
            anio,
            turno['turno'],
            turno.get('horas', 8.0),
            turno.get('fecha', ''),
            turno.get('esFinSemana', False)
        ))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Turnos guardados'})

@app.route('/api/tipos-turno', methods=['GET'])
def get_tipos_turno():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT nombre, horario, color, horas FROM tipos_turno')
    tipos = cursor.fetchall()
    conn.close()

    tipos_list = []
    for tipo in tipos:
        tipos_list.append({
            'nombre': tipo[0],
            'horario': tipo[1],
            'color': tipo[2],
            'horas': tipo[3]
        })

    return jsonify(tipos_list)

# Servir archivos estáticos
@app.route('/')
def index():
    try:
        return send_from_directory('.', 'nuevo_cuadrante_mejorado.html')
    except Exception as e:
        return jsonify({'error': f'No se encontró el archivo HTML: {str(e)}'}), 404

@app.route('/<path:filename>')
def static_files(filename):
    try:
        # Evitar acceso a archivos sensibles
        if filename.startswith('.') or '..' in filename:
            return jsonify({'error': 'Acceso denegado'}), 403
        return send_from_directory('.', filename)
    except Exception as e:
        return jsonify({'error': f'Archivo no encontrado: {filename}'}), 404

if __name__ == '__main__':
    init_database()

    print("\n" + "="*60)
    print("[*] SERVIDOR DE GESTIÓN DE TURNOS CON BASE DE DATOS".center(60))
    print("="*60)
    print(f"\n[i] Base de datos: {DB_PATH}")
    print(f"[>] Acceso: http://localhost:{PORT}/")
    print("\n[+] API REST disponible:")
    print("  - GET  /api/empleados")
    print("  - POST /api/empleados")
    print("  - PUT  /api/empleados/<id>")
    print("  - DEL  /api/empleados/<id>")
    print("  - GET  /api/turnos/<emp_id>?mes=X&anio=Y")
    print("  - POST /api/turnos/<emp_id>")
    print("  - GET  /api/tipos-turno")
    print("\n[!] Los datos se guardan permanentemente en la base de datos")

    app.run(host='0.0.0.0', port=PORT, debug=False)
