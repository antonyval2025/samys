#!/usr/bin/env python3
"""
Launcher para Gestor de Turnos
Verifica cada paso y asegura que todo funcione correctamente
"""

import os
import sys
import time
import socket
import subprocess
import webbrowser
from pathlib import Path

class TurnosLauncher:
    def __init__(self):
        self.project_dir = Path.cwd()
        self.port = 5001
        self.server_process = None
        self.success = True
        
    def print_header(self):
        """Muestra encabezado"""
        print("\n" + "="*70)
        print("[*] GESTOR DE TURNOS - LAUNCHER INTELIGENTE".center(70))
        print("="*70 + "\n")
    
    def print_step(self, step_num, title):
        """Muestra el paso actual"""
        print(f"\n[{step_num}/5] {title}")
        print("-" * 70)
    
    def step_1_verificar_python(self):
        """Paso 1: Verificar Python"""
        self.print_step(1, "Verificando Python")
        
        try:
            result = subprocess.run(
                [sys.executable, "--version"],
                capture_output=True,
                text=True,
                timeout=5
            )
            version = result.stdout.strip() or result.stderr.strip()
            print(f"✓ {version} encontrado")
            return True
        except Exception as e:
            print(f"✗ Error: {e}")
            print(f"\nSolución: Instala Python desde https://www.python.org")
            return False
    
    def step_2_verificar_flask(self):
        """Paso 2: Verificar Flask"""
        self.print_step(2, "Verificando Flask")
        
        try:
            result = subprocess.run(
                [sys.executable, "-c", "import flask; print(f'Flask {flask.__version__}')"],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                print(f"✓ {result.stdout.strip()} encontrado")
                return True
            else:
                print("✗ Flask no está instalado")
                print("\nInstalando Flask...")
                install = subprocess.run(
                    [sys.executable, "-m", "pip", "install", "flask", "flask-cors"],
                    capture_output=True,
                    text=True,
                    timeout=30
                )
                if install.returncode == 0:
                    print("✓ Flask instalado correctamente")
                    return True
                else:
                    print("✗ Error al instalar Flask")
                    return False
        except Exception as e:
            print(f"✗ Error: {e}")
            return False
    
    def step_3_verificar_archivos(self):
        """Paso 3: Verificar archivos necesarios"""
        self.print_step(3, "Verificando archivos necesarios")
        
        archivos = [
            ("servidor_turnos.py", "Backend"),
            ("nuevo_cuadrante_mejorado.html", "Frontend"),
        ]
        
        todos_ok = True
        for archivo, desc in archivos:
            ruta = self.project_dir / archivo
            if ruta.exists():
                tamaño = ruta.stat().st_size / 1024  # KB
                print(f"✓ {archivo} ({tamaño:.1f} KB) - {desc}")
            else:
                print(f"✗ {archivo} NO ENCONTRADO")
                todos_ok = False
        
        return todos_ok
    
    def step_4_iniciar_servidor(self):
        """Paso 4: Iniciar servidor"""
        self.print_step(4, "Iniciando servidor Flask")
        
        try:
            # Verificar que el puerto esté disponible
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            resultado = sock.connect_ex(('127.0.0.1', self.port))
            sock.close()
            
            if resultado == 0:
                print(f"✗ El puerto {self.port} ya está en uso")
                print(f"   Buscando puerto alternativo...")
                encontrado = False
                for puerto_alt in [5002, 5003, 8000, 8001, 8080]:
                    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    resultado = sock.connect_ex(('127.0.0.1', puerto_alt))
                    sock.close()
                    if resultado != 0:
                        self.port = puerto_alt
                        print(f"✓ Usando puerto {self.port}")
                        encontrado = True
                        break
                
                if not encontrado:
                    print("✗ No hay puertos disponibles")
                    return False
            else:
                print(f"✓ Puerto {self.port} disponible")
            
            # Iniciar servidor
            print(f"   Iniciando en puerto {self.port}...")
            
            # Modificar variable de entorno para el puerto
            env = os.environ.copy()
            env['PORT'] = str(self.port)
            
            self.server_process = subprocess.Popen(
                [sys.executable, "servidor_turnos.py"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env
            )
            
            # Esperar a que el servidor inicie
            print("   Esperando que el servidor inicie...")
            time.sleep(4)
            
            # Verificar que el proceso está vivo
            if self.server_process.poll() is not None:
                print("✗ El servidor se cerró inesperadamente")
                # Obtener output del error
                _, stderr = self.server_process.communicate()
                if stderr:
                    print(f"   Error: {stderr[:200]}")
                return False
            
            print(f"✓ Servidor iniciado correctamente")
            return True
            
        except Exception as e:
            print(f"✗ Error al iniciar servidor: {e}")
            return False
    
    def step_5_verificar_conectividad(self):
        """Paso 5: Verificar conectividad"""
        self.print_step(5, "Verificando conectividad")
        
        try:
            # Intentar conexión al servidor
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            resultado = sock.connect_ex(('127.0.0.1', self.port))
            sock.close()
            
            if resultado == 0:
                print(f"✓ Servidor respondiendo en puerto {self.port}")
                print(f"✓ URL: http://localhost:{self.port}/")
                return True
            else:
                print(f"✗ Servidor no responde en puerto {self.port}")
                return False
                
        except Exception as e:
            print(f"✗ Error de conectividad: {e}")
            return False
    
    def abrir_navegador(self):
        """Abre el navegador automáticamente"""
        print("\n[*] Abriendo navegador...")
        try:
            url = f"http://localhost:{self.port}/"
            webbrowser.open(url)
            print(f"✓ Navegador abierto: {url}")
            time.sleep(2)
        except Exception as e:
            print(f"⚠ No se pudo abrir el navegador automáticamente")
            print(f"  Abre manualmente: http://localhost:{self.port}/")
    
    def mostrar_resumen(self):
        """Muestra resumen final"""
        print("\n" + "="*70)
        if self.success:
            print("[✓] INICIACIÓN COMPLETADA EXITOSAMENTE".center(70))
            print("="*70)
            print(f"\n  URL: http://localhost:{self.port}/")
            print(f"\n  Base de datos: {self.project_dir / 'turnos_database.db'}")
            print(f"\n  El servidor está corriendo. Presiona CTRL+C aquí para detener.")
            print("\n" + "="*70)
        else:
            print("[✗] ERROR DURANTE LA INICIACIÓN".center(70))
            print("="*70)
            print("\nVerifica los errores anteriores e intenta de nuevo.")
    
    def ejecutar(self):
        """Ejecuta todos los pasos"""
        self.print_header()
        
        pasos = [
            self.step_1_verificar_python,
            self.step_2_verificar_flask,
            self.step_3_verificar_archivos,
            self.step_4_iniciar_servidor,
            self.step_5_verificar_conectividad,
        ]
        
        for paso in pasos:
            try:
                if not paso():
                    self.success = False
                    self.mostrar_resumen()
                    if self.server_process:
                        self.server_process.terminate()
                    return False
            except Exception as e:
                print(f"✗ Error inesperado: {e}")
                self.success = False
                self.mostrar_resumen()
                if self.server_process:
                    self.server_process.terminate()
                return False
        
        # Todo OK - abrir navegador
        self.abrir_navegador()
        self.mostrar_resumen()
        
        # Mantener el servidor ejecutándose
        try:
            if self.server_process:
                self.server_process.wait()
        except KeyboardInterrupt:
            print("\n\n[!] Deteniendo servidor...")
            if self.server_process:
                self.server_process.terminate()
                self.server_process.wait()
            print("[✓] Servidor detenido")
            return True
        
        return True

def main():
    launcher = TurnosLauncher()
    launcher.ejecutar()

if __name__ == "__main__":
    main()

