#!/usr/bin/env python3
"""
Script para verificar y ejecutar el cuadrante de turnos
Uso: python verificar_cuadrante.py

✅ Características:
- Inicia servidor HTTP en puerto 8000
- Abre navegador automáticamente
- Maneja datos en localStorage
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
    
    # Verificar tamaño mínimo (debe tener al menos 150KB)
    tamaño = archivo.stat().st_size
    if tamaño < 150000:
        print(f"⚠️  ADVERTENCIA: Archivo parece pequeño ({tamaño} bytes)")
        return False
    
    print(f"✓ Archivo encontrado: {tamaño} bytes")
    return True

def start_server():
    """Iniciar servidor HTTP en puerto 8000"""
    PORT = 8000
    
    # Cambiar a directorio actual
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        httpd = socketserver.TCPServer(("", PORT), Handler)
        print(f"✓ Servidor iniciado en http://localhost:{PORT}")
        print(f"✓ Presiona Ctrl+C para detener")
        
        # Abrir navegador después de 1 segundo
        time.sleep(1)
        url = f"http://localhost:{PORT}/nuevo_cuadrante_mejorado.html"
        print(f"📱 Abriendo navegador: {url}")
        webbrowser.open(url)
        
        # Servir
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Servidor detenido")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ ERROR: Puerto 8000 ya está en uso")
            print(f"   Intenta con otro puerto o cierra la aplicación que lo usa")
        else:
            print(f"❌ ERROR: {e}")

def main():
    """Función principal"""
    print("=" * 60)
    print("🚀 VERIFICADOR DE CUADRANTE DE TURNOS")
    print("=" * 60)
    print()
    
    # Verificar archivo
    if not check_file_exists():
        sys.exit(1)
    
    print()
    print("📋 PASOS A REALIZAR:")
    print("1. Se abrirá el navegador automáticamente")
    print("2. Espera a que cargue completamente (~3 segundos)")
    print("3. Verifica que veas el cuadrante mensual")
    print("4. Prueba cambiar de mes con ◀ ▶")
    print("5. Haz clic en una celda para cambiar turno")
    print()
    print("🛑 PARA DETENER: Presiona Ctrl+C en esta ventana")
    print()
    
    start_server()

if __name__ == "__main__":
    main()
