#!/usr/bin/env python3
"""
Script para limpiar localStorage y reiniciar el servidor
"""

import os
import sys
import http.server
import socketserver
import webbrowser
import time
from pathlib import Path

def check_file_exists():
    """Verificar que el archivo HTML existe"""
    archivo = Path("nuevo_cuadrante_mejorado.html")
    if not archivo.exists():
        print("❌ ERROR: nuevo_cuadrante_mejorado.html no encontrado")
        return False
    
    tamaño = archivo.stat().st_size
    if tamaño < 150000:
        print(f"⚠️  ADVERTENCIA: Archivo parece pequeño ({tamaño} bytes)")
        return False
    
    print(f"✓ Archivo encontrado: {tamaño} bytes")
    return True

def start_server():
    """Iniciar servidor HTTP en puerto 8000"""
    PORT = 8000
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        httpd = socketserver.TCPServer(("", PORT), Handler)
        print(f"✓ Servidor iniciado en http://localhost:{PORT}")
        print(f"ℹ️  Para LIMPIAR datos antiguos:")
        print(f"   1. Abre Herramientas de Desarrollador (F12)")
        print(f"   2. Consola → Copia y pega esto:")
        print(f"      localStorage.clear(); location.reload();")
        print(f"   3. Presiona Enter")
        print()
        print(f"✓ Presiona Ctrl+C para detener")
        print()
        
        time.sleep(1)
        url = f"http://localhost:{PORT}/nuevo_cuadrante_mejorado.html"
        print(f"📱 Abriendo navegador: {url}")
        webbrowser.open(url)
        
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Servidor detenido")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ ERROR: Puerto 8000 ya está en uso")
            print(f"   Intenta: taskkill /F /IM python.exe")
        else:
            print(f"❌ ERROR: {e}")

def main():
    print("=" * 60)
    print("🚀 REINICIADOR DE CUADRANTE (LIMPIAR DATOS)")
    print("=" * 60)
    print()
    
    if not check_file_exists():
        sys.exit(1)
    
    print()
    print("📋 Si ves enero de 2024 en lugar de diciembre 2025:")
    print("1. Abre Herramientas de Desarrollador (F12)")
    print("2. Vete a Consola")
    print("3. Pega esto: localStorage.clear(); location.reload();")
    print("4. Presiona Enter")
    print()
    
    start_server()

if __name__ == "__main__":
    main()
