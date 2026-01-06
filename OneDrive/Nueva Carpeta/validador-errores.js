/**
 * SCRIPT DE VALIDACIÓN DE ERRORES EN JS
 * Ejecutar en consola del navegador para verificar errores encontrados
 * Fecha: 2 de enero de 2026
 */

const ValidadorErroresJS = {
    resultados: {
        erroresCriticos: [],
        erroresMedianos: [],
        erroresBajos: [],
        verificados: []
    },

    /**
     * VERIFICACIÓN #1: colaNotiicaciones vs colaNotificaciones
     */
    verificarColaNotiicaciones() {
        console.log("\n🔴 [CRÍTICO] Verificando: SistemaNotificaciones.colaNotiicaciones");
        
        try {
            // Esto debería fallar si el nombre está mal
            if (typeof SistemaNotificaciones !== 'undefined') {
                const tieneColaIncorrecta = 'colaNotiicaciones' in SistemaNotificaciones;
                const tieneColaCorrecta = 'colaNotificaciones' in SistemaNotificaciones;
                
                if (tieneColaIncorrecta && !tieneColaCorrecta) {
                    this.resultados.erroresCriticos.push({
                        error: "TYPO EN VARIABLE",
                        archivo: "js/sistema-notificaciones.js",
                        variable: "colaNotiicaciones",
                        deberia_ser: "colaNotificaciones",
                        estado: "❌ ERROR CONFIRMADO"
                    });
                    console.error("❌ CONFIRMADO: Variable se llama 'colaNotiicaciones' (con ii)");
                    return false;
                } else if (tieneColaCorrecta) {
                    this.resultados.verificados.push("✅ colaNotificaciones está bien escrito");
                    console.log("✅ OK: Variable se llama 'colaNotificaciones' (correcto)");
                    return true;
                }
            }
        } catch (error) {
            console.error("⚠️ No se pudo verificar SistemaNotificaciones:", error.message);
        }
    },

    /**
     * VERIFICACIÓN #2: cargarFestivosEspaña vs cargarFestivosEspana
     */
    verificarCargarFestivos() {
        console.log("\n🔴 [CRÍTICO] Verificando: IntegracionCalendario.cargarFestivosEspaña()");
        
        try {
            if (typeof IntegracionCalendario !== 'undefined') {
                const tieneConEña = 'cargarFestivosEspaña' in IntegracionCalendario;
                const tieneSinEña = 'cargarFestivosEspana' in IntegracionCalendario;
                
                if (tieneSinEña && tieneConEña) {
                    console.warn("⚠️ AMBOS MÉTODOS EXISTEN - Hay duplicación");
                    return false;
                } else if (!tieneSinEña && !tieneConEña) {
                    this.resultados.erroresCriticos.push({
                        error: "MÉTODO NO ENCONTRADO",
                        archivo: "js/integracion-calendario.js",
                        problema: "cargarFestivosEspaña() se llama en línea 21 pero no está definida",
                        deberia_ser: "cargarFestivosEspana() o cambiar la llamada",
                        estado: "❌ ERROR CONFIRMADO"
                    });
                    console.error("❌ CONFIRMADO: Problema con cargarFestivos");
                    return false;
                } else if (tieneConEña) {
                    this.resultados.verificados.push("✅ cargarFestivosEspaña está bien escrito");
                    console.log("✅ OK: Método usa 'ñ' (cargarFestivosEspaña)");
                    return true;
                } else {
                    console.log("✅ OK: Método se llama 'cargarFestivosEspana' (sin ñ)");
                    return true;
                }
            }
        } catch (error) {
            console.error("⚠️ No se pudo verificar IntegracionCalendario:", error.message);
        }
    },

    /**
     * VERIFICACIÓN #3: desviacioEstantdar vs desviacionEstandar
     */
    verificarDesviacionEstandar() {
        console.log("\n🟠 [MEDIO] Verificando: DashboardAnalytica.desviacionEstandar");
        
        try {
            if (typeof DashboardAnalytica !== 'undefined' && DashboardAnalytica.metricas) {
                const tieneIncorrecto = 'desviacioEstantdar' in DashboardAnalytica.metricas.equidad;
                const tieneCorrect = 'desviacionEstandar' in DashboardAnalytica.metricas.equidad;
                
                if (tieneIncorrecto) {
                    this.resultados.erroresMedianos.push({
                        error: "TYPO EN PROPIEDAD",
                        archivo: "js/dashboard-analytica.js",
                        linea: 65,
                        propiedad: "desviacioEstantdar",
                        deberia_ser: "desviacionEstandar",
                        estado: "❌ ERROR CONFIRMADO"
                    });
                    console.error("❌ CONFIRMADO: Propiedad mal escrita 'desviacioEstantdar'");
                    return false;
                } else if (tieneCorrect) {
                    this.resultados.verificados.push("✅ desviacionEstandar está bien escrito");
                    console.log("✅ OK: Propiedad se llama 'desviacionEstandar'");
                    return true;
                }
            }
        } catch (error) {
            console.error("⚠️ No se pudo verificar DashboardAnalytica:", error.message);
        }
    },

    /**
     * VERIFICACIÓN #4: carrasArray vs cargasArray
     */
    verificarCarrasArray() {
        console.log("\n🟠 [MEDIO] Verificando: OptimizadorTurnos - carrasArray");
        
        // Nota: Esta verificación requiere inspeccionar el código fuente
        console.log("ℹ️ INFO: Necesita inspección manual del código en línea 104 de optimizador-turnos.js");
        console.log("Buscar: 'const carrasArray' debería ser 'const cargasArray'");
        
        this.resultados.erroresMedianos.push({
            error: "TYPO EN VARIABLE",
            archivo: "js/optimizador-turnos.js",
            lineas: [104, 105, 107, 110],
            variable: "carrasArray",
            deberia_ser: "cargasArray",
            estado: "⚠️ REQUIERE INSPECCIÓN MANUAL"
        });
    },

    /**
     * Generar reporte completo
     */
    generarReporte() {
        console.clear();
        console.log("╔════════════════════════════════════════════════════════════════╗");
        console.log("║        VALIDACIÓN DE ERRORES EN ARCHIVOS JAVASCRIPT            ║");
        console.log("║                   2 de enero de 2026                           ║");
        console.log("╚════════════════════════════════════════════════════════════════╝\n");

        // Ejecutar todas las verificaciones
        this.verificarColaNotiicaciones();
        this.verificarCargarFestivos();
        this.verificarDesviacionEstandar();
        this.verificarCarrasArray();

        // Resumen
        console.log("\n════════════════════════════════════════════════════════════════");
        console.log("📊 RESUMEN DE RESULTADOS");
        console.log("════════════════════════════════════════════════════════════════");
        
        console.log(`\n🔴 Errores Críticos: ${this.resultados.erroresCriticos.length}`);
        this.resultados.erroresCriticos.forEach((err, i) => {
            console.log(`   ${i + 1}. ${err.error} en ${err.archivo}`);
            if (err.variable) console.log(`      Variable: ${err.variable} → ${err.deberia_ser}`);
            if (err.problema) console.log(`      Problema: ${err.problema}`);
            console.log(`      Estado: ${err.estado}`);
        });

        console.log(`\n🟠 Errores Medios: ${this.resultados.erroresMedianos.length}`);
        this.resultados.erroresMedianos.forEach((err, i) => {
            console.log(`   ${i + 1}. ${err.error} en ${err.archivo}`);
            if (err.linea) console.log(`      Línea: ${err.linea}`);
            if (err.lineas) console.log(`      Líneas: ${err.lineas.join(', ')}`);
            if (err.variable) console.log(`      Variable: ${err.variable} → ${err.deberia_ser}`);
            if (err.propiedad) console.log(`      Propiedad: ${err.propiedad} → ${err.deberia_ser}`);
            console.log(`      Estado: ${err.estado}`);
        });

        console.log(`\n✅ Verificaciones OK: ${this.resultados.verificados.length}`);
        this.resultados.verificados.forEach((msg) => {
            console.log(`   ${msg}`);
        });

        console.log("\n════════════════════════════════════════════════════════════════");
        console.log("📋 TABLA DE CAMBIOS REQUERIDOS");
        console.log("════════════════════════════════════════════════════════════════\n");

        const cambios = [
            {
                archivo: "js/sistema-notificaciones.js",
                lineas: "24, 249, 270",
                cambio: "colaNotiicaciones → colaNotificaciones",
                prioridad: "🔴 CRÍTICA"
            },
            {
                archivo: "js/integracion-calendario.js",
                lineas: "21",
                cambio: "cargarFestivosEspaña() → cargarFestivosEspana()",
                prioridad: "🔴 CRÍTICA"
            },
            {
                archivo: "js/dashboard-analytica.js",
                lineas: "65",
                cambio: "desviacioEstantdar → desviacionEstandar",
                prioridad: "🟠 MEDIA"
            },
            {
                archivo: "js/optimizador-turnos.js",
                lineas: "104, 105, 107, 110",
                cambio: "carrasArray → cargasArray",
                prioridad: "🟠 MEDIA"
            }
        ];

        cambios.forEach((cambio, i) => {
            console.log(`${i + 1}. ${cambio.prioridad}`);
            console.log(`   Archivo: ${cambio.archivo}`);
            console.log(`   Línea(s): ${cambio.lineas}`);
            console.log(`   Cambio: ${cambio.cambio}\n`);
        });

        console.log("════════════════════════════════════════════════════════════════\n");

        // Exportar resultados
        return this.resultados;
    },

    /**
     * Exportar resultados como JSON
     */
    exportarJSON() {
        const resultado = this.generarReporte();
        console.log("\n📥 EXPORTAR COMO JSON:\n");
        console.log(JSON.stringify(resultado, null, 2));
        return resultado;
    },

    /**
     * Exportar resultados como CSV
     */
    exportarCSV() {
        const resultado = this.generarReporte();
        let csv = "Tipo,Archivo,Línea(s),Error,Corrección,Estado\n";
        
        resultado.erroresCriticos.forEach(err => {
            csv += `CRÍTICO,"${err.archivo}","","${err.variable || err.problema}","${err.deberia_ser}","${err.estado}"\n`;
        });
        
        resultado.erroresMedianos.forEach(err => {
            const linea = err.linea || (err.lineas ? err.lineas.join(',') : '');
            csv += `MEDIO,"${err.archivo}","${linea}","${err.variable || err.propiedad || err.error}","${err.deberia_ser}","${err.estado}"\n`;
        });

        console.log("\n📥 EXPORTAR COMO CSV:\n");
        console.log(csv);
        return csv;
    }
};

// ════════════════════════════════════════════════════════════════
// INSTRUCCIONES DE USO:
// ════════════════════════════════════════════════════════════════
// 
// 1. Abre la consola del navegador (F12)
// 2. Copia y pega todo este código
// 3. Ejecuta los siguientes comandos:
//
//    ValidadorErroresJS.generarReporte();        // Resumen completo
//    ValidadorErroresJS.exportarJSON();          // Formato JSON
//    ValidadorErroresJS.exportarCSV();           // Formato CSV
//
// ════════════════════════════════════════════════════════════════

// Auto-ejecutar si se está usando en consola
if (typeof window !== 'undefined') {
    console.log("✅ ValidadorErroresJS cargado. Ejecuta: ValidadorErroresJS.generarReporte()");
}
