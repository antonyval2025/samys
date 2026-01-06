// MÓDULO: DocumentAnalyzer - Análisis Inteligente de Documentación
// ================================================================
// Sistema local de búsqueda semántica y generación de resúmenes
// Sin dependencias externas, 100% JavaScript vanilla

class DocumentAnalyzer {
    static documentosIndexados = new Map();
    static indiceGlobal = [];
    static initialized = false;

    // Inicializar el análisis de documentación embebida
    static async inicializar() {
        if (this.initialized) return;

        // Cargar documentación desde archivos incrustados
        this.cargarDocumentacionEmbebida();
        this.construirIndices();
        this.initialized = true;

        console.log(`✅ DocumentAnalyzer inicializado con ${this.documentosIndexados.size} documentos`);
    }

    static cargarDocumentacionEmbebida() {
        // ARQUITECTURA Y ESTRUCTURA
        this.agregarDocumento('ARQUITECTURA', `
            # Arquitectura del Sistema de Gestión de Turnos
            
            ## Clases Principales
            - AppState: Gestiona estado global de la app
            - EmployeeManager: CRUD de empleados
            - TurnoManager: Generación y formato de turnos
            - TurnoEditor: Edición interactiva de turnos
            - UI: Renderización de tablas
            - ExportManager: Exportación PDF, Excel, WhatsApp
            - ChatBot: Asistente inteligente
            
            ## Datos
            - localStorage['turnosAppState']: Estado global
            - localStorage['empleadosData']: Lista de empleados
            - Map<empleadoId, Array<turno>>: Turnos por empleado
            
            ## Persistencia
            - Automática después de cada cambio
            - Carga en inicialización (DOMContentLoaded)
        `);

        this.agregarDocumento('EMPLEADOS', `
            # Gestión de Empleados
            
            ## Campos de Empleado
            - id: Identificador único
            - nombre: Nombre completo (mín 3 caracteres)
            - email: Validado con regex
            - telefono: Mínimo 9 caracteres
            - departamento: Área de trabajo
            - localidad: Ubicación
            - horasContrato: 0-240 horas/mes
            - turnoPrincipal: mañana/tarde/noche
            - estado: activo/vacaciones/baja
            
            ## Operaciones CRUD
            - EmployeeManager.agregarEmpleado()
            - EmployeeManager.editarEmpleado()
            - EmployeeManager.eliminarEmpleado()
            - EmployeeManager.obtenerListaEmpleados()
        `);

        this.agregarDocumento('TURNOS', `
            # Sistema de Turnos
            
            ## Tipos de Turno
            - mañana: 08:00-16:00 (8h, verde)
            - tarde: 16:00-00:00 (8h, amarillo)
            - noche: 00:00-08:00 (8h, rojo)
            - mixto: Combinación de turnos
            - descanso: Día libre (0h)
            - vacaciones: Estado especial
            - baja: Ausencia justificada
            - festivo: Día no laboral
            - libre: Disponible
            
            ## Generación Automática
            - TurnoManager.generarTurnosEmpleado()
            - Patrón: 5 días trabajo + 2 descanso
            - Considera estado (activo/vacaciones/baja)
            - Fines de semana aleatorios
            
            ## Edición
            - Individual: TurnoEditor.abrirEditorTurno()
            - Masiva: TurnoEditor.aplicarEdicionMasiva()
            - Cambios en cola: AppState.cambiosPendientes
            - Guardar: AppState.aplicarCambiosPendientes()
        `);

        this.agregarDocumento('EXPORTACION', `
            # Sistema de Exportación
            
            ## Formatos Soportados
            - PDF: ExportManager.exportarCuadranteGeneral()
            - Excel/CSV: ExportManager.exportarExcelIndividual()
            - WhatsApp: ExportManager.enviarWhatsAppIndividual()
            - Impresión: Navegador nativo
            
            ## Características
            - Tabla general: Todos empleados + todos días
            - Individual: Turnos + estadísticas de un empleado
            - WhatsApp: URL codificada con datos
            - Usa html2canvas para convertir HTML a imagen
            - jsPDF para generación de PDFs
        `);

        this.agregarDocumento('ESTADISTICAS', `
            # Análisis y Reportes
            
            ## Métricas Disponibles
            - Total empleados (activos/inactivos)
            - Turnos asignados por mes
            - Horas totales trabajadas
            - Promedio horas por empleado
            - Distribución por tipo de turno
            - Empleados en vacaciones/baja
            - Balance de turnos por persona
            
            ## Validaciones
            - Máximo 12 turnos noche por mes
            - Mínimo 2 descansos consecutivos
            - Cumplimiento de horas de contrato
            - Distribución equitativa
        `);

        this.agregarDocumento('INTEGRACIONES', `
            # Integraciones Externas
            
            ## WhatsApp
            - URL: https://wa.me/{PHONE}?text={ENCODED_MSG}
            - Envío de cuadrantes personalizados
            - Compatible con números internacionales
            
            ## HTML2Canvas
            - Conversión HTML → Imagen PNG
            - Usado para PDFs
            - Preserva estilos CSS
            
            ## jsPDF
            - Generación de documentos PDF
            - Soporte para múltiples páginas
            - Embebe imágenes
        `);

        this.agregarDocumento('TROUBLESHOOTING', `
            # Solución de Problemas
            
            ## Turnos no se guardan
            - Verificar AppState.cambiosPendientes no vacío
            - Hacer clic en "Guardar Cambios"
            - Revisar console del navegador
            
            ## Empleados desaparecen
            - Revisar localStorage.empleadosData
            - Puede estar corrompido: localStorage.clear() + reload
            
            ## Tabla no se actualiza
            - Llamar UI.generarCuadranteGeneral() manualmente
            - Verificar que cambios se aplicaron
            
            ## WhatsApp no abre
            - Verificar formato de teléfono internacional
            - Usar .toLowerCase() en URL
            - Revisar encoding de caracteres especiales
        `);

        this.agregarDocumento('MEJORAS', `
            # Mejoras Implementadas (v9.3+)
            
            ## Validaciones Inteligentes
            - RestriccionesTurnos.validarCambioTurno()
            - Máx 12 turnos noche, mín 2 descansos
            - Detecta incompatibilidades estado/turno
            
            ## Balanceo Automático
            - BalanceadorTurnos.aplicarBalanceoAutomatico()
            - Distribución equitativa
            - Índice de equidad 0-1
            
            ## Sistema de Permisos
            - userRole: admin | supervisor | empleado
            - Control de edición y visualización
            
            ## Auditoría
            - SistemaAuditoria.registrarCambio()
            - Historial completo de cambios
            - Timestamps de modificaciones
        `);
    }

    static agregarDocumento(titulo, contenido) {
        this.documentosIndexados.set(titulo, {
            titulo: titulo,
            contenido: contenido,
            palabrasClave: this.extraerPalabrasClaveDoc(contenido),
            timestamp: Date.now()
        });
    }

    static construirIndices() {
        this.indiceGlobal = [];
        
        this.documentosIndexados.forEach((doc, titulo) => {
            // Indexar líneas con contenido relevante
            const lineas = doc.contenido.split('\n');
            lineas.forEach((linea, idx) => {
                if (linea.trim().length > 10) {
                    this.indiceGlobal.push({
                        titulo: titulo,
                        linea: linea.trim(),
                        palabras: this.extraerPalabras(linea),
                        importancia: this.calcularImportancia(linea)
                    });
                }
            });
        });
    }

    static extraerPalabrasClaveDoc(texto) {
        const palabrasComunes = ['el', 'la', 'de', 'que', 'en', 'y', 'a', 'es', 'del', 'por', 'una', 'un', 'los', 'las', 'su', 'o'];
        const palabras = texto.toLowerCase().match(/\b\w+\b/g) || [];
        
        return palabras
            .filter(p => p.length > 3 && !palabrasComunes.includes(p))
            .filter((p, i, arr) => arr.indexOf(p) === i)  // Único
            .slice(0, 20);
    }

    static extraerPalabras(texto) {
        return texto.toLowerCase().match(/\b\w+\b/g) || [];
    }

    static calcularImportancia(linea) {
        let score = 0;
        if (linea.startsWith('#')) score += 10;
        if (linea.startsWith('##')) score += 8;
        if (linea.includes('-')) score += 2;
        if (linea.includes('**')) score += 3;
        return score;
    }

    // BÚSQUEDA SEMÁNTICA
    static buscar(pregunta, topK = 5) {
        // No necesita await porque inicializar() se llama en DOMContentLoaded
        // this.inicializar() ya se ejecutó

        const palabrasPregunta = this.extraerPalabras(pregunta);
        const resultados = [];

        this.indiceGlobal.forEach(item => {
            let similaridad = 0;

            palabrasPregunta.forEach(palabra => {
                if (item.palabras.includes(palabra)) {
                    similaridad += 1;
                }
            });

            // Boost si contiene la pregunta literal
            if (item.linea.toLowerCase().includes(pregunta.toLowerCase())) {
                similaridad += 5;
            }

            if (similaridad > 0) {
                resultados.push({
                    ...item,
                    score: (similaridad * item.importancia) / (palabrasPregunta.length || 1)
                });
            }
        });

        return resultados
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }

    // GENERAR RESPUESTA CONTEXTUAL
    static generarRespuesta(pregunta) {
        const preguntaLower = pregunta.toLowerCase();
        
        // Respuestas específicas pre-configuradas
        if (preguntaLower.includes('cómo') || preguntaLower.includes('como')) {
            return this.explicarComo(pregunta);
        }

        if (preguntaLower.includes('qué es') || preguntaLower.includes('que es')) {
            return this.explicarQue(pregunta);
        }

        if (preguntaLower.includes('resumen') || preguntaLower.includes('summary')) {
            return this.generarResumen(pregunta);
        }

        if (preguntaLower.includes('mapa') || preguntaLower.includes('diagrama') || preguntaLower.includes('estructura')) {
            return this.generarMapaMental(pregunta);
        }

        // Búsqueda general
        const resultados = this.buscar(pregunta);
        if (resultados.length === 0) {
            return '❌ No encontré información sobre: ' + pregunta + '\n\n💡 Intenta preguntar sobre: empleados, turnos, exportación, estadísticas, arquitectura';
        }

        let respuesta = `📚 Información encontrada:\n\n`;
        respuesta += `**${resultados[0].titulo}**\n`;
        respuesta += `${resultados[0].linea}\n\n`;

        if (resultados.length > 1) {
            respuesta += `🔗 Documentos relacionados:\n`;
            resultados.slice(1, 3).forEach(r => {
                respuesta += `• ${r.titulo}: ${r.linea.substring(0, 60)}...\n`;
            });
        }

        return respuesta;
    }

    static explicarComo(pregunta) {
        const temas = {
            'agregar empleado': 'Usa EmployeeManager.agregarEmpleado(). El formulario valida nombre (3+ chars), email, teléfono.',
            'generar turnos': 'TurnoManager.generarTurnosEmpleado() crea 30+ días automáticamente. Patrón: 5 trabajo + 2 descanso.',
            'exportar pdf': 'ExportManager.exportarCuadranteGeneral(). Convierte la tabla HTML a imagen con html2canvas, luego genera PDF.',
            'enviar whatsapp': 'ExportManager.enviarWhatsAppIndividual(). Construye URL: https://wa.me/PHONE?text=MENSAJE codificado.',
            'editar masivamente': 'TurnoEditor.aplicarEdicionMasiva(). Selecciona empleados, días, turno actual y nuevo. Los cambios van a cola.',
            'guardar cambios': 'AppState.aplicarCambiosPendientes() guarda todos los cambios pendientes a localStorage.',
            'calcular horas': 'Suma horas por tipo de turno. Usa tiposTurno[turno].horas para cada día trabajado.'
        };

        for (const [tema, respuesta] of Object.entries(temas)) {
            if (pregunta.toLowerCase().includes(tema)) {
                return `✅ **${tema.toUpperCase()}**\n${respuesta}`;
            }
        }

        return this.generarRespuesta(pregunta);
    }

    static explicarQue(pregunta) {
        const definiciones = {
            'chatbot': 'Asistente inteligente que responde preguntas sobre la app. Usa búsqueda de palabras clave y análisis semántico.',
            'appstate': 'Clase estática que centraliza el estado global: empleados, turnos, cambios pendientes, mes/año actual.',
            'cambios pendientes': 'Cola de cambios sin guardar. Se aplican todos juntos con AppState.aplicarCambiosPendientes().',
            'turno': 'Asignación de un tipo de horario a un empleado en un día específico. Puede ser mañana, tarde, noche, etc.',
            'balanceo': 'Distribución equitativa de turnos entre empleados respetando restricciones y preferencias.',
            'restricción': 'Regla que valida cambios: máx 12 noches/mes, mín 2 descansos consecutivos, cumplimiento de horas.',
            'localStorage': 'Sistema de persistencia del navegador. Almacena turnosAppState y empleadosData como JSON.'
        };

        for (const [concepto, def] of Object.entries(definiciones)) {
            if (pregunta.toLowerCase().includes(concepto)) {
                return `📖 **${concepto.toUpperCase()}**\n${def}`;
            }
        }

        return this.generarRespuesta(pregunta);
    }

    static generarResumen(tema) {
        const resumenes = {
            'arquitectura': `🏗️ **ARQUITECTURA DEL SISTEMA**
        
1. **AppState** - Centro neurálgico
   → Estado global, persistencia en localStorage
   
2. **Gestión** - CRUD inteligente
   → EmployeeManager (empleados)
   → TurnoManager (generación automática)
   → TurnoEditor (ediciones masivas)
   
3. **UI** - Renderización dinámica
   → Tablas interactivas sin refrescar página
   → Modales para edición
   
4. **Exportación** - Múltiples formatos
   → PDF, Excel, WhatsApp
   
5. **ChatBot** - Asistente + DocumentAnalyzer
   → Búsqueda semántica, resúmenes, mapas mentales`,

            'flujo': `⚡ **FLUJO PRINCIPAL DE CAMBIOS**

1. Usuario hace clic en celda o abre modal
2. TurnoEditor captura el cambio
3. Cambio se agrega a AppState.cambiosPendientes
4. UI muestra preview de cambios
5. Usuario hace clic "Guardar Cambios"
6. AppState.aplicarCambiosPendientes() aplica todos
7. AppState.saveToStorage() persiste datos
8. UI se regenera dinámicamente`,

            'datos': `💾 **ESTRUCTURA DE DATOS**

**Empleado:**
{
  id, nombre, email, telefono,
  departamento, localidad,
  horasContrato, turnoPrincipal,
  estado, fechaAlta, salario
}

**Turno (diario):**
{
  dia, turno, horas, fecha,
  esFinSemana, descripcion
}

**AppState:**
- currentYear/currentMonth
- scheduleData: Map<empId, Array<turno>>
- cambiosPendientes: Queue<cambio>
- empleados: Array`,

            'mejoras': `🚀 **MEJORAS IMPLEMENTADAS**

✅ Validaciones inteligentes
✅ Balanceo automático de turnos
✅ Sistema de permisos (admin/supervisor/empleado)
✅ Auditoría y historial de cambios
✅ Predictor de conflictos
✅ Reportes avanzados
✅ ChatBot con análisis de docs`,

            'turnos': `📅 **TIPOS DE TURNOS**

Laborales:
• Mañana: 08:00-16:00 (8h)
• Tarde: 16:00-00:00 (8h)
• Noche: 00:00-08:00 (8h)
• Mixto: Combinación

Especiales:
• Descanso: Día libre (0h)
• Vacaciones: Ausencia planificada
• Baja: Ausencia justificada
• Festivo: No laboral
• Libre: Disponible`
        };

        for (const [clave, contenido] of Object.entries(resumenes)) {
            if (tema.toLowerCase().includes(clave)) {
                return contenido;
            }
        }

        return `📚 Resumen no disponible.\n\nTemas disponibles: arquitectura, flujo, datos, mejoras, turnos`;
    }

    static generarMapaMental(tema) {
        const mapas = {
            'sistema': `
📊 SISTEMA DE GESTIÓN DE TURNOS (v9.3)
│
├── 👥 EMPLEADOS
│   ├── Crear/Editar/Eliminar
│   ├── Departamentos y Localidades
│   └── Estados: Activo, Vacaciones, Baja
│
├── 📅 TURNOS
│   ├── Generación Automática
│   │   ├── Patrón: 5 trabajo + 2 descanso
│   │   └── Fines de semana aleatorios
│   ├── Edición Individual
│   ├── Edición Masiva
│   └── Tipos: Mañana, Tarde, Noche, Mixto, Descanso...
│
├── 💾 PERSISTENCIA
│   ├── localStorage['turnosAppState']
│   ├── localStorage['empleadosData']
│   └── Sincronización automática
│
├── 📊 ANÁLISIS
│   ├── Estadísticas mensuales
│   ├── Balance de turnos
│   ├── Cumplimiento de horas
│   └── Distribución por tipo
│
├── 📤 EXPORTACIÓN
│   ├── PDF (tabla completa)
│   ├── Excel/CSV (individual)
│   ├── WhatsApp (personalizado)
│   └── Impresión
│
└── 🤖 INTELIGENCIA
    ├── ChatBot (búsqueda en docs)
    ├── Validaciones automáticas
    ├── Balanceo inteligente
    └── Predicción de conflictos`,

            'datos': `
ESTRUCTURA DE DATOS
│
├── AppState (Global)
│   ├── currentYear, currentMonth
│   ├── scheduleData: Map<id, turnos[]>
│   ├── cambiosPendientes: Queue
│   ├── empleados: Array
│   └── userRole: admin|supervisor|empleado
│
├── Empleado (Objeto)
│   ├── id: string
│   ├── nombre: string (3+)
│   ├── email: valid@email
│   ├── telefono: string (9+)
│   ├── departamento: string
│   ├── localidad: string
│   ├── horasContrato: 0-240
│   ├── turnoPrincipal: string
│   ├── estado: activo|vacaciones|baja
│   └── metadata: {...}
│
└── Turno (Por día)
    ├── dia: 1-31
    ├── turno: mañana|tarde|noche|...
    ├── horas: 0-24
    ├── fecha: Date
    ├── esFinSemana: boolean
    └── descripcion: string`,

            'flujo': `
FLUJO DE CAMBIOS
│
├── INPUT
│   ├── Clic en celda de turno
│   ├── Modal de edición
│   └── Edición masiva
│
├── PROCESAMIENTO
│   ├── TurnoEditor captura cambio
│   ├── Validaciones (restricciones)
│   ├── Agregación a cambiosPendientes
│   └── Preview en UI
│
├── GUARDADO
│   ├── AppState.aplicarCambiosPendientes()
│   ├── Actualización de scheduleData
│   ├── localStorage.saveToStorage()
│   └── Auditoría del cambio
│
└── VISUALIZACIÓN
    ├── UI.generarCuadranteGeneral()
    ├── UI.generarCuadranteIndividual()
    └── Notificación de éxito`
        };

        for (const [clave, contenido] of Object.entries(mapas)) {
            if (tema.toLowerCase().includes(clave)) {
                return contenido;
            }
        }

        return `
🗺️ MAPAS MENTALES DISPONIBLES

• Sistema completo
• Estructura de datos
• Flujo de cambios

Ejemplo: "mapa mental del sistema"`;
    }

    // Estadísticas de documentación
    static estadisticasDocumentacion() {
        return `
📊 ESTADÍSTICAS DE DOCUMENTACIÓN

Documentos indexados: ${this.documentosIndexados.size}
Líneas analizadas: ${this.indiceGlobal.length}
Palabras clave únicas: ${new Set(this.indiceGlobal.flatMap(i => i.palabras)).size}

Temas cubiertos:
${Array.from(this.documentosIndexados.keys()).map(k => `  • ${k}`).join('\n')}
        `;
    }
}

// Inicializar al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DocumentAnalyzer.inicializar());
} else {
    DocumentAnalyzer.inicializar();
}
