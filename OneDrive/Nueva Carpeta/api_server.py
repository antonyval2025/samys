#!/usr/bin/env python3
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse
from datetime import datetime
import sys

DATA_DIR = os.path.join(os.path.dirname(__file__), 'datos_bd')

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        
        print(f"[API] GET {path}")
        
        # CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # GET /api/health - Verificación simple de conexión
        if path == '/api/health':
            self.wfile.write(json.dumps({'status': 'ok', 'timestamp': datetime.now().isoformat()}).encode())
        
        # GET /api/turnos/1
        elif path.startswith('/api/turnos/'):
            empleado_id = path.split('/')[-1]
            filename = f"turnos_empleado_{empleado_id}.json"
            filepath = os.path.join(DATA_DIR, filename)
            
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    datos = json.load(f)
                print(f"[API] Retornando datos para empleado {empleado_id}")
                self.wfile.write(json.dumps({'empleadoId': empleado_id, 'turnos': datos}).encode())
            else:
                self.wfile.write(json.dumps({'empleadoId': empleado_id, 'turnos': {}}).encode())
        else:
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        print(f"[API] POST {parsed.path}")
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # POST /api/turnos/1
        if parsed.path.startswith('/api/turnos/'):
            try:
                empleado_id = parsed.path.split('/')[-1]
                datos = json.loads(body)
                mes = datos.get('mes')
                anio = datos.get('anio')
                turnos = datos.get('turnos', [])
                
                filename = f"turnos_empleado_{empleado_id}.json"
                filepath = os.path.join(DATA_DIR, filename)
                
                # Leer datos existentes
                datosExistentes = {}
                if os.path.exists(filepath):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        datosExistentes = json.load(f)
                
                # Guardar nuevos datos
                key = f"{anio}-{mes}"
                datosExistentes[key] = {
                    "mes": mes,
                    "anio": anio,
                    "turnos": turnos
                }
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(datosExistentes, f, indent=2)
                
                print(f"[API] Guardados turnos para empleado {empleado_id}: {len(turnos)} dias")
                self.wfile.write(json.dumps({
                    'success': True,
                    'empleadoId': empleado_id,
                    'mes': mes,
                    'anio': anio,
                    'diasGuardados': len(turnos)
                }).encode())
            except Exception as e:
                print(f"[API] ERROR: {e}")
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        # POST /api/empleados
        elif parsed.path == '/api/empleados':
            try:
                datos = json.loads(body)
                empleado_id = datos.get('empleadoId')
                empleado = datos.get('empleado', {})
                
                filename = f"turnos_empleado_{empleado_id}.json"
                filepath = os.path.join(DATA_DIR, filename)
                
                # Leer datos existentes
                datosExistentes = {}
                if os.path.exists(filepath):
                    with open(filepath, 'r', encoding='utf-8') as f:
                        datosExistentes = json.load(f)
                
                # Guardar info del empleado (sin pisar los turnos)
                datosExistentes['_empleado'] = empleado
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(datosExistentes, f, indent=2)
                
                print(f"[API] Guardado empleado {empleado_id}: {empleado.get('nombre', 'Sin nombre')}")
                self.wfile.write(json.dumps({
                    'success': True,
                    'empleadoId': empleado_id,
                    'nombre': empleado.get('nombre', '')
                }).encode())
            except Exception as e:
                print(f"[API] ERROR: {e}")
                self.wfile.write(json.dumps({'error': str(e)}).encode())
        
        else:
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Suprimir logs por defecto

if __name__ == '__main__':
    port = 5001
    server = HTTPServer(('0.0.0.0', port), APIHandler)
    print(f"Servidor API ejecutándose en http://localhost:{port}")
    print(f"Sirviendo datos desde: {DATA_DIR}")
    server.serve_forever()
