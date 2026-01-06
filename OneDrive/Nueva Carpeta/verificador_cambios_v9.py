#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de verificación de cambios v9.0
Valida que los cambios de cálculo de horas se han aplicado correctamente
"""

import os
import re
from pathlib import Path

def verificar_cambios():
    """Verifica que los cambios se han aplicado correctamente"""
    
    print("=" * 70)
    print("VERIFICADOR DE CAMBIOS v9.0 - Corrección de Horas")
    print("=" * 70)
    print()
    
    archivos_a_verificar = [
        "nuevo_cuadrante_mejorado.html",
        "DISTRIBUCION_LISTA/nuevo_cuadrante_mejorado.html"
    ]
    
    puntos = {
        "calcularHorasDelHorario": False,
        "infoTurno.horas": False,
        "horas del tipo de turno": False
    }
    
    for archivo in archivos_a_verificar:
        ruta = Path(archivo)
        if not ruta.exists():
            print(f"❌ Archivo no encontrado: {archivo}")
            continue
        
        print(f"✓ Verificando: {archivo}")
        
        try:
            with open(ruta, 'r', encoding='utf-8') as f:
                contenido = f.read()
            
            # Búsqueda 1: Función calcularHorasDelHorario
            if re.search(r'function calcularHorasDelHorario\s*\(', contenido):
                puntos["calcularHorasDelHorario"] = True
                print("  ✓ Función 'calcularHorasDelHorario' encontrada")
            else:
                print("  ✗ Función 'calcularHorasDelHorario' NO encontrada")
            
            # Búsqueda 2: Uso de infoTurno.horas en PDF
            if re.search(r'infoTurno\.horas\s*\?\s*`\$\{infoTurno\.horas\}h`', contenido):
                puntos["infoTurno.horas"] = True
                print("  ✓ Lectura correcta de 'infoTurno.horas'")
            else:
                print("  ✗ Lectura de 'infoTurno.horas' no óptima")
            
            # Búsqueda 3: Return de horas en obtenerInfoTurnoVisualPDF
            if re.search(r'horas:\s*horas\s*\};?\s*\}\s*function calcularResumenTurnosPDF', contenido):
                puntos["horas del tipo de turno"] = True
                print("  ✓ Retorno de horas en 'obtenerInfoTurnoVisualPDF'")
            else:
                print("  ✗ Retorno de horas no encontrado o incorrecto")
        
        except Exception as e:
            print(f"  ✗ Error al leer archivo: {e}")
        
        print()
    
    # Resumen
    print("=" * 70)
    print("RESUMEN DE VERIFICACIÓN")
    print("=" * 70)
    
    total = len(puntos)
    completados = sum(1 for v in puntos.values() if v)
    
    for punto, estado in puntos.items():
        simbolo = "✓" if estado else "✗"
        print(f"{simbolo} {punto}")
    
    print()
    print(f"Cambios detectados: {completados}/{total}")
    
    if completados == total:
        print("✓ TODOS LOS CAMBIOS HAN SIDO APLICADOS CORRECTAMENTE")
        return True
    else:
        print("⚠️  FALTA APLICAR ALGUNOS CAMBIOS")
        print("\nPasos para corregir:")
        print("1. Abre 'nuevo_cuadrante_mejorado.html'")
        print("2. Busca la función 'obtenerInfoTurnoVisualPDF'")
        print("3. Verifica que retorne 'horas' junto con otros datos")
        print("4. Busca 'construirCalendarioVisualPDF' y verifica uso de 'infoTurno.horas'")
        return False

def prueba_calculo():
    """Prueba la función de cálculo de horas"""
    print("\n" + "=" * 70)
    print("PRUEBA DE CÁLCULO DE HORAS")
    print("=" * 70)
    print()
    
    def calcular_horas(horario):
        import re
        match = re.match(r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})', horario)
        if not match:
            return None
        
        hi, mi, hf, mf = map(int, match.groups())
        total_minutos = (hf * 60 + mf) - (hi * 60 + mi)
        if total_minutos < 0:
            total_minutos += 24 * 60
        
        horas = total_minutos / 60
        return f"{horas:.1f}" if horas % 1 != 0 else f"{int(horas)}"
    
    casos_prueba = [
        ("08:00-16:00", "8"),
        ("16:00-00:00", "8"),
        ("00:00-08:00", "8"),
        ("14:30-21:00", "6.5"),
        ("22:00-06:00", "8"),
        ("10:00-18:00", "8"),
        ("14:30-18:00", "3.5"),
    ]
    
    print("Casos de prueba:")
    print()
    
    todos_correctos = True
    for horario, esperado in casos_prueba:
        resultado = calcular_horas(horario)
        estado = "✓" if resultado == esperado else "✗"
        
        if resultado != esperado:
            todos_correctos = False
        
        print(f"{estado} {horario:15} → {resultado:4} (esperado: {esperado})")
    
    print()
    if todos_correctos:
        print("✓ TODOS LOS CÁLCULOS SON CORRECTOS")
    else:
        print("✗ ALGUNOS CÁLCULOS NO SON CORRECTOS")
    
    return todos_correctos

def main():
    """Función principal"""
    cambios_ok = verificar_cambios()
    calculos_ok = prueba_calculo()
    
    print("\n" + "=" * 70)
    print("RESULTADO FINAL")
    print("=" * 70)
    
    if cambios_ok and calculos_ok:
        print("✓ TODO ESTÁ CORRECTO - La versión 9.0 está lista")
        return 0
    else:
        print("⚠️  REVISA LOS PUNTOS MARCADOS CON ✗")
        return 1

if __name__ == "__main__":
    import sys
    sys.exit(main())
