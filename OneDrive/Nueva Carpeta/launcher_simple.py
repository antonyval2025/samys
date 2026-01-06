#!/usr/bin/env python3
import os
import sys
import socket
import subprocess
import webbrowser
import time
from pathlib import Path

def encontrar_puerto():
    """Encuentra un puerto disponible"""
    for puerto in [5001, 5002, 5003, 8000, 8080]:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            resultado = sock.connect_ex(('127.0.0.1', puerto))
            sock.close()
            if resultado != 0:
                return puerto
        except:
            pass
    return 5001

def main():
    # Ir al directorio del script
    directorio = Path(__file__).parent.absolute()
    os.chdir(directorio)
    
    print("\n" + "="*60)
    print("GESTOR DE TURNOS - INICIANDO".center(60))
    print("="*60 + "\n")
    
    # Verificar archivos
    if not Path('servidor_turnos.py').exists():
        print("✗ Error: servidor_turnos.py no encontrado")
        sys.exit(1)
    
    if not Path('nuevo_cuadrante_mejorado.html').exists():
        print("✗ Error: nuevo_cuadrante_mejorado.html no encontrado")
        sys.exit(1)
    
    print("[+] Archivos verificados ✓")
    
    # Limpiar procesos Python anteriores
    print("[+] Limpiando procesos anteriores...")
    os.system("taskkill /F /IM python.exe >nul 2>&1")
    time.sleep(1)
    
    # Encontrar puerto
    puerto = encontrar_puerto()
    print(f"[+] Puerto disponible: {puerto}")
    
    # Iniciar servidor
    print("[+] Iniciando servidor...")
    try:
        proceso = subprocess.Popen(
            [sys.executable, 'servidor_turnos.py'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=str(directorio)
        )
        print(f"[+] Servidor iniciado (PID: {proceso.pid})")
    except Exception as e:
        print(f"✗ Error al iniciar servidor: {e}")
        sys.exit(1)
    
    # Esperar a que el servidor inicie
    time.sleep(3)
    
    # Verificar que el servidor está corriendo
    if proceso.poll() is not None:
        print("✗ El servidor se cerró inesperadamente")
        sys.exit(1)
    
    print("[+] Servidor respondiendo ✓")
    
    # Abrir navegador
    url = f"http://localhost:5001/"
    print(f"[+] Abriendo navegador: {url}")
    webbrowser.open(url)
    
    print("\n" + "="*60)
    print("✓ Aplicación iniciada correctamente".center(60))
    print("  Presiona CTRL+C para detener".center(60))
    print("="*60 + "\n")
    
    try:
        proceso.wait()
    except KeyboardInterrupt:
        print("\n[+] Deteniendo servidor...")
        proceso.terminate()
        proceso.wait(timeout=5)
        print("[+] Servidor detenido")

if __name__ == '__main__':
    main()
