#!/usr/bin/env python3
"""
Servidor HTTP simple para testing de la aplicación
Ejecutar: python3 servidor_testing.py
Acceder a: http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser

PORT = 8000
DIRECTORIO = os.path.dirname(os.path.abspath(__file__))

class MiHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORIO, **kwargs)
    
    def end_headers(self):
        # Prevenir caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), MiHandler) as httpd:
        print(f"🚀 Servidor iniciado en http://localhost:{PORT}")
        print(f"📂 Sirviendo archivos desde: {DIRECTORIO}")
        print(f"📖 Aplicación: http://localhost:{PORT}/nuevo_cuadrante_mejorado.html")
        print("\n✅ Abriendo navegador automáticamente...\n")
        
        # Abrir navegador automáticamente
        webbrowser.open(f"http://localhost:{PORT}/nuevo_cuadrante_mejorado.html")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n❌ Servidor detenido por usuario (Ctrl+C)")
