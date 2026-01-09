/**
 * LOCALIDADES MANAGER - Capa de Datos para Localidades
 * 
 * Responsabilidad: 
 * - Gestionar el estado de localidades (CRUD)
 * - Persistencia en localStorage
 * - Validaciones y reglas de negocio
 * 
 * NO maneja UI directamente (eso es ConsolidadoLocalidades)
 */

console.log('[LocalidadesManager] 📍 Inicializando gestor de localidades...');

const LocalidadesManager = (function() {
    
    // ============================================
    // ESTADO PRIVADO (Fuente de Verdad)
    // ============================================
    let localidades = JSON.parse(localStorage.getItem('localidadesData')) || [
        { id: 1, nombre: 'Madrid' },
        { id: 2, nombre: 'Barcelona' },
        { id: 3, nombre: 'Valencia' },
        { id: 4, nombre: 'Bilbao' },
        { id: 5, nombre: 'Sevilla' }
    ];

    // Contador de IDs para nuevas localidades
    let nextId = Math.max(...localidades.map(l => l.id || 0), 0) + 1;

    // ============================================
    // MÉTODOS PRIVADOS
    // ============================================

    /**
     * Persiste localidades en localStorage
     */
    function guardarEnStorage() {
        try {
            localStorage.setItem('localidadesData', JSON.stringify(localidades));
            console.log('[LocalidadesManager] 💾 Localidades guardadas en localStorage');
        } catch (error) {
            console.error('[LocalidadesManager] ❌ Error al guardar:', error);
        }
    }

    /**
     * Valida los datos de una localidad
     */
    function validarLocalidad(nombre) {
        if (!nombre || typeof nombre !== 'string') {
            return { valido: false, error: 'Nombre inválido' };
        }

        const nombreTrimmed = nombre.trim();
        if (nombreTrimmed.length < 2) {
            return { valido: false, error: 'El nombre debe tener al menos 2 caracteres' };
        }

        if (nombreTrimmed.length > 50) {
            return { valido: false, error: 'El nombre no puede exceder 50 caracteres' };
        }

        return { valido: true };
    }

    /**
     * Valida que no exista duplicado
     */
    function existeDuplicado(nombre, excluirId = null) {
        return localidades.some(l => 
            l.nombre.toLowerCase() === nombre.toLowerCase() && 
            (!excluirId || l.id !== excluirId)
        );
    }

    // ============================================
    // MÉTODOS PÚBLICOS (API)
    // ============================================

    /**
     * Inicializa el manager
     */
    function inicializar() {
        console.log('[LocalidadesManager] ✅ Inicializado con', localidades.length, 'localidades');
        return localidades.length > 0;
    }

    /**
     * Obtiene todas las localidades
     */
    function obtenerLocalidades() {
        return JSON.parse(JSON.stringify(localidades)); // Deep copy
    }

    /**
     * Obtiene una localidad por ID
     */
    function obtenerLocalidadPorId(id) {
        return localidades.find(l => l.id === id);
    }

    /**
     * Obtiene una localidad por nombre
     */
    function obtenerLocalidadPorNombre(nombre) {
        return localidades.find(l => l.nombre.toLowerCase() === nombre.toLowerCase());
    }

    /**
     * Crea una nueva localidad
     */
    function crearLocalidad(nombre) {
        const validacion = validarLocalidad(nombre);
        if (!validacion.valido) {
            console.error('[LocalidadesManager] ❌', validacion.error);
            return { exito: false, error: validacion.error };
        }

        if (existeDuplicado(nombre)) {
            console.error('[LocalidadesManager] ❌ Ya existe una localidad con ese nombre');
            return { exito: false, error: 'Ya existe una localidad con ese nombre' };
        }

        const nuevaLocalidad = {
            id: nextId++,
            nombre: nombre.trim(),
            creadoEn: new Date().toISOString()
        };

        localidades.push(nuevaLocalidad);
        guardarEnStorage();

        console.log('[LocalidadesManager] ✅ Localidad creada:', nuevaLocalidad);
        return { exito: true, localidad: nuevaLocalidad };
    }

    /**
     * Actualiza una localidad existente
     */
    function actualizarLocalidad(id, nombre) {
        const validacion = validarLocalidad(nombre);
        if (!validacion.valido) {
            console.error('[LocalidadesManager] ❌', validacion.error);
            return { exito: false, error: validacion.error };
        }

        if (existeDuplicado(nombre, id)) {
            console.error('[LocalidadesManager] ❌ Ya existe otra localidad con ese nombre');
            return { exito: false, error: 'Ya existe otra localidad con ese nombre' };
        }

        const localidad = localidades.find(l => l.id === id);
        if (!localidad) {
            console.error('[LocalidadesManager] ❌ Localidad no encontrada');
            return { exito: false, error: 'Localidad no encontrada' };
        }

        const nombreAnterior = localidad.nombre;
        localidad.nombre = nombre.trim();
        localidad.actualizadoEn = new Date().toISOString();
        
        guardarEnStorage();

        console.log(`[LocalidadesManager] ✅ Localidad actualizada: "${nombreAnterior}" → "${nombre}"`);
        return { exito: true, localidad };
    }

    /**
     * Elimina una localidad
     */
    function eliminarLocalidad(id) {
        const indice = localidades.findIndex(l => l.id === id);
        if (indice === -1) {
            console.error('[LocalidadesManager] ❌ Localidad no encontrada');
            return { exito: false, error: 'Localidad no encontrada' };
        }

        const [localidadEliminada] = localidades.splice(indice, 1);
        guardarEnStorage();

        console.log('[LocalidadesManager] ✅ Localidad eliminada:', localidadEliminada.nombre);
        return { exito: true, localidad: localidadEliminada };
    }

    /**
     * Obtiene estadísticas
     */
    function obtenerEstadisticas() {
        return {
            total: localidades.length,
            localidades: localidades.map(l => ({
                id: l.id,
                nombre: l.nombre,
                empleados: typeof empleados !== 'undefined' 
                    ? empleados.filter(e => e.localidad === l.nombre).length 
                    : 0
            }))
        };
    }

    /**
     * Obtiene el estado actual del manager
     */
    function obtenerEstado() {
        return {
            localidades: obtenerLocalidades(),
            total: localidades.length,
            nextId: nextId
        };
    }

    /**
     * Reinicia a valores por defecto
     */
    function reiniciar() {
        localidades = [
            { id: 1, nombre: 'Madrid' },
            { id: 2, nombre: 'Barcelona' },
            { id: 3, nombre: 'Valencia' },
            { id: 4, nombre: 'Bilbao' },
            { id: 5, nombre: 'Sevilla' }
        ];
        nextId = 6;
        guardarEnStorage();
        console.log('[LocalidadesManager] 🔄 Reiniciado a valores por defecto');
    }

    // ============================================
    // API PÚBLICA
    // ============================================
    return {
        inicializar,
        obtenerLocalidades,
        obtenerLocalidadPorId,
        obtenerLocalidadPorNombre,
        crearLocalidad,
        actualizarLocalidad,
        eliminarLocalidad,
        obtenerEstadisticas,
        obtenerEstado,
        reiniciar
    };
})();

console.log('[LocalidadesManager] ✅ Capa de datos de localidades cargada');
