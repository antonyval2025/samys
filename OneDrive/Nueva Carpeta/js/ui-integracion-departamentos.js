// 🔗 INTEGRACIÓN UI - Sincronización bidireccional entre DepartmentManager (antiguo) y DepartamentosManager (FASE 2)
console.log('[UIIntegracionDepartamentos] Iniciando sincronización...');

const UIIntegracionDepartamentos = (function() {
    const config = {
        sincronizacionAutomatica: true,
        intervalSincronizacion: 5000 // ms
    };

    let ultimaSincronizacion = 0;

    /**
     * Sincroniza los departamentos del sistema antiguo (DepartmentManager)
     * con el sistema FASE 2 (DepartamentosManager)
     */
    function sincronizarDepartamentosAntiguosAFase2() {
        if (typeof DepartmentManager === 'undefined' || typeof DepartamentosManager === 'undefined') {
            console.warn('[UIIntegracionDepartamentos] ⚠️ Dependencias no disponibles aún');
            return false;
        }

        console.log('[UIIntegracionDepartamentos] 🔄 Sincronizando departamentos antiguos → FASE 2');

        // Obtener departamentos del sistema antiguo
        const deptos = DepartmentManager.departamentos || [];
        
        deptos.forEach(depto => {
            // Sincronizar cada uno a través del método de FASE 2 (incluir estándares)
            DepartamentosManager.sincronizarDepartamento({
                id: depto.id,
                nombre: depto.nombre,
                descripcion: depto.descripcion,
                horasSemanales: depto.horasSemanales,  // ✅ Incluir estándares
                diasTrabajo: depto.diasTrabajo,
                horasDiarias: depto.horasDiarias
            });
        });

        console.log(`[UIIntegracionDepartamentos] ✅ ${deptos.length} departamentos sincronizados`);
        return true;
    }

    /**
     * Extiende el método abrirModal() para también cargar en FASE 2
     */
    function extenderAbrirModal() {
        if (typeof DepartmentManager === 'undefined') return;

        // Reemplazar completamente abrirModal para asegurar que se carga la lista
        DepartmentManager.abrirModal = function() {
            console.log('[UIIntegracionDepartamentos] 🔗 Abriendo modal y cargando lista');
            
            // Abrir el modal
            const modal = document.getElementById('modalGestionDepartamentos');
            if (modal) {
                modal.classList.add('active');
                console.log('[UIIntegracionDepartamentos] ✅ Modal abierto');
            }
            
            // Cargar lista - Llamar directamente con contexto correcto
            if (typeof DepartmentManager.cargarListaDepartamentos === 'function') {
                DepartmentManager.cargarListaDepartamentos();
                console.log('[UIIntegracionDepartamentos] ✅ Lista cargada');
            }
            
            // Sincronizar cuando se abre el modal
            sincronizarDepartamentosAntiguosAFase2();
        };

        console.log('[UIIntegracionDepartamentos] ✅ abrirModal() reemplazado');
    }

    /**
     * Extiende guardarDepartamento para sincronizar bidireccional
     */
    function extenderGuardarDepartamento() {
        // ✅ Ya no es necesario - ConsolidadoDepartamentos maneja la sincronización
        // El viejo DepartmentManager ya no se usa
        console.log('[UIIntegracionDepartamentos] ✅ Sincronización bidireccional manejada por ConsolidadoDepartamentos');
    }

    /**
     * Verifica sincronización periódica
     */
    function verificarSincronizacionPeriodica() {
        if (!config.sincronizacionAutomatica) return;

        setInterval(() => {
            const ahora = Date.now();
            if (ahora - ultimaSincronizacion > config.intervalSincronizacion) {
                console.log('[UIIntegracionDepartamentos] 🔄 Verificación periódica de sincronización');
                sincronizarDepartamentosAntiguosAFase2();
                ultimaSincronizacion = ahora;
            }
        }, config.intervalSincronizacion);
    }

    /**
     * Inicializa la integración
     */
    function inicializar() {
        console.log('[UIIntegracionDepartamentos] ⏳ Esperando disponibilidad de módulos...');

        const intentosMaximos = 10;
        let intentos = 0;

        const esperar = setInterval(() => {
            intentos++;
            
            // Verificar que ambos módulos estén disponibles
            if (typeof DepartmentManager !== 'undefined' && 
                typeof DepartamentosManager !== 'undefined') {
                
                clearInterval(esperar);
                console.log('[UIIntegracionDepartamentos] ✅ Módulos disponibles, inicializando...');

                // Extender métodos clave
                extenderAbrirModal();
                extenderGuardarDepartamento();

                // Sincronización inicial
                setTimeout(() => {
                    sincronizarDepartamentosAntiguosAFase2();
                    ultimaSincronizacion = Date.now();
                    console.log('[UIIntegracionDepartamentos] ✅ Sincronización inicial completada');
                }, 500);

                // Verificar periódicamente
                verificarSincronizacionPeriodica();

            } else if (intentos >= intentosMaximos) {
                console.error('[UIIntegracionDepartamentos] ❌ Timeout esperando módulos después de ' + intentosMaximos + ' intentos');
                clearInterval(esperar);
            }
        }, 300);
    }

    // API pública
    return {
        inicializar: inicializar,
        sincronizarAhora: sincronizarDepartamentosAntiguosAFase2,
        obtenerConfig: () => ({ ...config }),
        establecerSincronizacionAutomatica: (valor) => {
            config.sincronizacionAutomatica = valor;
            console.log(`[UIIntegracionDepartamentos] Sincronización automática: ${valor}`);
        }
    };
})();

// Auto-inicializar cuando el documento esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            UIIntegracionDepartamentos.inicializar();
        }, 800);
    });
} else {
    setTimeout(() => {
        UIIntegracionDepartamentos.inicializar();
    }, 800);
}

// Registrar en ModuleManager si existe
if (typeof ModuleManager !== 'undefined') {
    ModuleManager.register('UIIntegracionDepartamentos', UIIntegracionDepartamentos);
}

console.log('[UIIntegracionDepartamentos] ✅ Módulo cargado - Esperando inicialización');
