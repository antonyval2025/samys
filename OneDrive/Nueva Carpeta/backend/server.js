const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

// 📁 Directorio donde guardar los datos
const DATA_DIR = path.join(__dirname, '../datos_bd');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`✅ Directorio ${DATA_DIR} creado`);
}

// Middlewares
app.use(cors());
app.use(express.json());

// 🟢 RUTA: Guardar/actualizar turnos de un empleado
app.post('/api/turnos/:empleadoId', (req, res) => {
    try {
        const { empleadoId } = req.params;
        const { mes, anio, turnos } = req.body;

        if (!empleadoId || mes === undefined || anio === undefined) {
            return res.status(400).json({ 
                error: 'Faltan parámetros: empleadoId, mes, anio' 
            });
        }

        // Crear archivo de datos para este empleado
        const filename = `turnos_empleado_${empleadoId}.json`;
        const filepath = path.join(DATA_DIR, filename);

        // Leer datos existentes (si existen)
        let datosExistentes = {};
        if (fs.existsSync(filepath)) {
            const contenido = fs.readFileSync(filepath, 'utf-8');
            datosExistentes = JSON.parse(contenido);
        }

        // Actualizar o agregar datos del mes/año
        const key = `${anio}-${mes}`;
        datosExistentes[key] = {
            mes,
            anio,
            turnos,
            fechaActualizacion: new Date().toISOString()
        };

        // Guardar en archivo
        fs.writeFileSync(filepath, JSON.stringify(datosExistentes, null, 2));

        console.log(`✅ Turnos guardados: empleado ${empleadoId}, ${mes}/${anio} (${turnos?.length || 0} días)`);

        res.json({
            success: true,
            message: `Turnos guardados para empleado ${empleadoId}`,
            empleadoId,
            mes,
            anio,
            diasGuardados: turnos?.length || 0
        });
    } catch (error) {
        console.error('❌ Error al guardar turnos:', error);
        res.status(500).json({ 
            error: 'Error al guardar turnos',
            details: error.message 
        });
    }
});

// 🔵 RUTA: Obtener turnos de un empleado
app.get('/api/turnos/:empleadoId', (req, res) => {
    try {
        const { empleadoId } = req.params;
        const filename = `turnos_empleado_${empleadoId}.json`;
        const filepath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filepath)) {
            return res.json({ 
                empleadoId,
                turnos: {},
                message: 'No hay datos para este empleado'
            });
        }

        const contenido = fs.readFileSync(filepath, 'utf-8');
        const datos = JSON.parse(contenido);

        res.json({
            empleadoId,
            turnos: datos
        });
    } catch (error) {
        console.error('❌ Error al obtener turnos:', error);
        res.status(500).json({ 
            error: 'Error al obtener turnos',
            details: error.message 
        });
    }
});

// 🟡 RUTA: Obtener todos los datos (para respaldo)
app.get('/api/backup', (req, res) => {
    try {
        const archivos = fs.readdirSync(DATA_DIR);
        const datosCompletos = {};

        archivos.forEach(archivo => {
            if (archivo.endsWith('.json')) {
                const contenido = fs.readFileSync(path.join(DATA_DIR, archivo), 'utf-8');
                datosCompletos[archivo] = JSON.parse(contenido);
            }
        });

        res.json({
            timestamp: new Date().toISOString(),
            totalArchivos: archivos.length,
            datos: datosCompletos
        });
    } catch (error) {
        console.error('❌ Error al obtener backup:', error);
        res.status(500).json({ error: error.message });
    }
});

// 🟠 RUTA: Eliminar datos de un mes ESPECÍFICO (NO TODOS LOS DATOS)
app.delete('/api/turnos/:empleadoId', (req, res) => {
    try {
        const { empleadoId } = req.params;
        const { mes, anio } = req.body;

        console.log(`\n🟠 DELETE /api/turnos/${empleadoId}`);
        console.log(`   📥 Body recibido: mes=${mes}, anio=${anio}`);

        // 🔧 IMPORTANTE: Validar que se recibieron mes y año
        if (mes === undefined || anio === undefined) {
            console.error('❌ ERROR: No se recibió mes y/o año. Abortando para proteger datos.');
            return res.status(400).json({ 
                success: false,
                message: 'ERROR: mes y anio son requeridos para evitar borrar datos críticos',
                empleadoId
            });
        }

        const filename = `turnos_empleado_${empleadoId}.json`;
        const filepath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filepath)) {
            console.log(`⚠️  Archivo no existe: ${filename}`);
            return res.json({ 
                success: false,
                message: 'Archivo no existe (nada que eliminar)',
                empleadoId
            });
        }

        const contenido = fs.readFileSync(filepath, 'utf-8');
        const datos = JSON.parse(contenido);

        // IMPORTANTE: Formato es ANIO-MES (sin padding en mes)
        const key = `${anio}-${mes}`;
        console.log(`🔍 Buscando clave: "${key}"`);
        console.log(`📋 Claves en archivo: ${Object.keys(datos).join(', ')}`);

        if (key in datos) {
            const turnosEliminados = (datos[key] || []).length;
            delete datos[key];
            console.log(`✅ Clave ${key} eliminada (${turnosEliminados} turnos borrados)`);
            
            // Si el archivo quedó vacío, eliminarlo completamente
            if (Object.keys(datos).length === 0) {
                try {
                    fs.unlinkSync(filepath);
                    console.log(`🗑️  Archivo completamente eliminado: ${filename} (no hay otros meses)`);
                } catch (unlinkError) {
                    console.error(`❌ Error al eliminar archivo: ${unlinkError.message}`);
                }
            } else {
                // Si aún hay datos de OTROS meses, guardar el archivo actualizado
                fs.writeFileSync(filepath, JSON.stringify(datos, null, 2));
                const otrosMeses = Object.keys(datos).length;
                console.log(`💾 Archivo actualizado: ${filename} (${otrosMeses} otros meses preservados)`);
            }
            
            res.json({ 
                success: true, 
                message: `${turnosEliminados} turnos de ${mes}/${anio} eliminados. Otros meses preservados.`,
                empleadoId,
                mes,
                anio,
                turnosEliminados
            });
        } else {
            console.log(`⚠️  Clave ${key} NO encontrada (ya estaba eliminada)`);
            // Aunque la clave no exista, responder con éxito (ya está eliminada)
            res.json({ 
                success: true,
                message: 'Datos ya no existen (nada que eliminar)',
                empleadoId,
                mes,
                anio
            });
        }
    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
        console.error(error.stack);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        server: 'Servidor de Turnos v1.0',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🚀 SERVIDOR DE TURNOS INICIADO                              ║
║  URL: http://localhost:${PORT}                                ║
║  Directorio de datos: ${DATA_DIR}        ║
║                                                              ║
║  Rutas disponibles:                                          ║
║  POST   /api/turnos/:empleadoId  → Guardar turnos           ║
║  GET    /api/turnos/:empleadoId  → Obtener turnos           ║
║  DELETE /api/turnos/:empleadoId  → Eliminar mes             ║
║  GET    /api/backup              → Backup completo          ║
║  GET    /health                  → Estado del servidor      ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
    process.exit(1);
});
