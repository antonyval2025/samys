# 🔧 Guía de Debugging - WhatsApp No Abre

## Problema Reportado
> "Cuando selecciono whatsapp en el cuadro de diálogo, no se abre"

## Causas Posibles Identificadas y Corregidas

### 1. ❌ Llamada sin Manejo de Promesas
**Problema:** `enviarWhatsAppIndividual()` es una función `async` pero se llamaba sin `await` o `.catch()`
**Solución:** Agregado `.catch()` para capturar errores

```javascript
// ANTES (ignoraba errores silenciosamente):
enviarWhatsAppIndividual();

// DESPUÉS (captura errores correctamente):
enviarWhatsAppIndividual().catch(error => {
    console.error('❌ Error en enviarWhatsAppIndividual:', error);
    alert('Error: ' + error.message);
});
```

### 2. ✅ Protección de `.toLowerCase()`
**Problema:** Valores undefined/null causaban crashes
**Solución:** Helper `lowerCaseSafe` implementado en todas las ubicaciones

### 3. 📦 Dependencias Externas
**Necesarios:** html2canvas, jsPDF (ya incluidas en el HTML)
**Verificación:** Abre `test_dependencies.html` para confirmar disponibilidad

## Pasos de Debugging

### Opción 1: Ver Consola del Navegador (Rápido)
1. Abre http://localhost:8000/nuevo_cuadrante_mejorado.html
2. **Presiona F12** (abre Developer Tools)
3. Ve a la pestaña **Console**
4. Abre un cuadrante individual (clic en un empleado)
5. Haz clic en botón 📤 WhatsApp
6. **Busca logs** que digan:
   - ✅ `🔵 [enviarWhatsAppIndividual] Iniciando...` = función empezó
   - ✅ `✅ [generarPDFCuadranteVisual] PDF completado:...` = PDF generado
   - ❌ `❌ [generarPDFCuadranteVisual] Error:...` = problema en PDF

### Opción 2: Verificar Dependencias (si siguen errores)
1. Abre http://localhost:8000/test_dependencies.html
2. Verifica que aparezcan todos los ✅:
   - ✅ html2canvas disponible
   - ✅ jsPDF disponible
   - ✅ URL.createObjectURL disponible
3. Si alguno dice ❌, las librerías faltan en el HTML

### Opción 3: Verificar Datos del Empleado
1. Consola (F12):
```javascript
// Ver empleados
console.log(JSON.parse(localStorage.getItem('empleadosData')))

// Ver si un empleado tiene teléfono
const emps = JSON.parse(localStorage.getItem('empleadosData') || '[]');
emps.forEach(e => console.log(`${e.nombre}: ${e.telefono || 'SIN TELÉFONO'}`));
```

2. **El empleado DEBE tener:**
   - ✅ Número de teléfono (requisito para WhatsApp)
   - ✅ Turnos en el mes seleccionado

## Logs Esperados en Orden

```
🔵 [enviarWhatsAppIndividual] Iniciando...
✅ [enviarWhatsAppIndividual] Cuadrante individual encontrado
🔵 [generarPDFCuadranteVisual] Iniciando con informe: {...}
✅ [generarPDFCuadranteVisual] Empleado: Juan García
✅ [generarPDFCuadranteVisual] Canvas generado
✅ [generarPDFCuadranteVisual] jsPDF disponible
✅ [generarPDFCuadranteVisual] PDF completado: Cuadrante_Juan_García_Diciembre_2025.pdf
[PDF se descarga automáticamente]
[WhatsApp se abre 800ms después]
```

## Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| `html2canvas is not defined` | Librería no cargada | Verificar que está en el HTML |
| `jsPDF is not defined` | Librería no cargada | Verificar que está en el HTML |
| `no teléfono registrado` | Empleado sin teléfono | Editar empleado, agregar teléfono |
| `Cannot read property 'toLowerCase'` | Valor no-string | Ya corregido con lowerCaseSafe |

## Checklist Pre-Uso

- [ ] Abre http://localhost:8000 (NO file://)
- [ ] Cuadrante se carga sin errores
- [ ] Empleado tiene teléfono en perfil
- [ ] F12 Console sin errores rojo
- [ ] Clic en empleado muestra cuadrante individual
- [ ] Botón 📤 WhatsApp está visible

## Si Sigue Sin Funcionar

1. **Copiar logs completos** desde Console (F12)
2. **Compartir:**
   - Qué texto aparece en console antes de que falle
   - Qué empleado está usando (¿tiene teléfono?)
   - Qué mes/año seleccionó
3. **Intentar otro navegador** (Chrome, Firefox, Edge)

## Cambios Implementados (23 Dic 2025)

✅ Agregado manejo de promesas con `.catch()` en llamada a `enviarWhatsAppIndividual()`
✅ Agregados logs detallados en funciones PDF
✅ Protegidos todos los `.toLowerCase()` con helper `lowerCaseSafe`
✅ Mejorado manejo de errores con stack traces
