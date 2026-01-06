# 📚 REFERENCIA RÁPIDA - ModuleManager

**Última actualización**: 5 enero 2026  
**Versión**: 2.0 (IIFE + ModuleManager)

---

## 🎯 Acceso Rápido

```javascript
// Obtener módulo
const whatsApp = ModuleManager.get('WhatsAppSender');
const backup = ModuleManager.get('BackupManager');

// Ver todos los módulos
ModuleManager.list();

// Verificar dependencias
if (ModuleManager.verificar(['WhatsAppSender', 'BackupManager'])) {
    // Usar módulos aquí
}
```

---

## 📱 WhatsAppSender - Métodos Disponibles

### 1. Enviar a un empleado
```javascript
ModuleManager.get('WhatsAppSender').enviarMensajeEmpleado(
    empleadoId,      // número
    nombre,          // string
    opciones         // { dia?: number, tipo?: 'confirmacion'|'cambio'|'recordatorio' }
);

// Ejemplo
ModuleManager.get('WhatsAppSender').enviarMensajeEmpleado(1, 'Juan Pérez', {
    dia: 5,
    tipo: 'confirmacion'
});
```

### 2. Envío masivo (con pausa entre envíos)
```javascript
ModuleManager.get('WhatsAppSender').enviarMasivoEmpleados(
    empleadoIds,     // array de números [1,2,3]
    opciones         // { pausa?: 1500, dia?: number, tipo?: string }
);

// Ejemplo: Enviar a 5 empleados con 1.5s entre cada uno
ModuleManager.get('WhatsAppSender').enviarMasivoEmpleados([1,2,3,4,5], {
    pausa: 1500,
    dia: 5
});
```

### 3. Envío por departamento
```javascript
ModuleManager.get('WhatsAppSender').enviarPorDepartamento(
    departamento,    // string
    opciones         // { pausa?: 1500, dia?: number, tipo?: string }
);

// Ejemplo
ModuleManager.get('WhatsAppSender').enviarPorDepartamento('Operaciones', {
    pausa: 1500
});
```

### 4. Obtener estadísticas
```javascript
const stats = ModuleManager.get('WhatsAppSender').obtenerEstadisticas();
console.log(stats);
// { 
//   enviados: 10,
//   fallidos: 1,
//   intentos: 11,
//   ultimoEnvio: "2026-01-05T17:30:00.000Z",
//   tasaExito: "90.9%"
// }
```

### 5. Resetear estadísticas
```javascript
ModuleManager.get('WhatsAppSender').resetearEstadisticas();
```

### 6. Validar dependencias
```javascript
const ok = ModuleManager.get('WhatsAppSender').validarDependencias();
if (ok) {
    console.log('✅ Todas las dependencias disponibles');
} else {
    console.log('❌ Falta alguna dependencia');
}
```

---

## 💾 BackupManager - Métodos Disponibles

### 1. Crear backup ahora
```javascript
const resultado = ModuleManager.get('BackupManager').crearBackupAhora();
// {
//   exito: true,
//   destino: 'LOCAL',
//   bytes: 15234,
//   tiempo: 245,
//   timestamp: "2026-01-05T17:30:00.000Z"
// }
```

### 2. Restaurar desde backup
```javascript
const resultado = ModuleManager.get('BackupManager').restaurarBackup();
// Pide confirmación del usuario
// Restaura datos si existe backup
// Recarga UI automáticamente
```

### 3. Descargar backup como JSON
```javascript
ModuleManager.get('BackupManager').descargarBackupJSON();
// Descarga archivo: backup_turnos_2026-01-05_17-30.json
```

### 4. Obtener estado actual
```javascript
const estado = ModuleManager.get('BackupManager').obtenerEstadoActual();
console.log(estado);
// {
//   sincronizacionActiva: true,
//   ultimoSync: "2026-01-05T17:30:00.000Z",
//   proximoSync: "45s",
//   totalSyncs: 120,
//   syncsExitosos: 119,
//   syncsFallidos: 1,
//   backup: {
//     existe: true,
//     timestamp: "2026-01-05T17:25:00.000Z",
//     version: "2.0.0"
//   }
// }
```

### 5. Validar integridad
```javascript
const validacion = ModuleManager.get('BackupManager').validarIntegridad();
console.log(validacion);
// {
//   memoriaValida: true,
//   backupValido: true,
//   detalleMemoria: { empleados: 7, turnos: 210, tamaño: 12400 },
//   detalleBackup: { ... },
//   resumenGral: "✅ TODO OK"
// }
```

### 6. Obtener estadísticas
```javascript
const stats = ModuleManager.get('BackupManager').obtenerEstadisticas();
console.log(stats);
// {
//   backupsCreados: 120,
//   restauraciones: 3,
//   descargas: 2,
//   validaciones: 15,
//   tasaExito: "✅ 100%"
// }
```

### 7. Validar dependencias
```javascript
const ok = ModuleManager.get('BackupManager').validarDependencias();
```

### 8. Formatear bytes
```javascript
const formatted = ModuleManager.get('BackupManager').formatearBytes(1524);
console.log(formatted);  // "1.49 KB"
```

---

## 🔧 Casos de Uso Comunes

### Notificar a empleados sobre cambio de turno
```javascript
const ids = [1, 3, 5, 7];  // IDs de empleados
ModuleManager.get('WhatsAppSender').enviarMasivoEmpleados(ids, {
    pausa: 2000,  // 2 segundos entre cada envío
    dia: 6,
    tipo: 'cambio'
});
```

### Hacer backup antes de operación masiva
```javascript
console.log('📦 Creando backup de seguridad...');
ModuleManager.get('BackupManager').crearBackupAhora();

console.log('⚙️ Realizando operación...');
// Tu código aquí

console.log('✅ Operación completada');
```

### Validar estado del sistema
```javascript
const estado = ModuleManager.get('BackupManager').obtenerEstadoActual();
const validacion = ModuleManager.get('BackupManager').validarIntegridad();

if (estado.sincronizacionActiva && validacion.memoriaValida) {
    console.log('✅ Sistema listo para operaciones');
} else {
    console.warn('⚠️ Algunos servicios no están disponibles');
}
```

### Crear backup y descargar antes de salir
```javascript
// Crear backup nuevo
ModuleManager.get('BackupManager').crearBackupAhora();

// Esperar un poco para asegurar que se creó
setTimeout(() => {
    // Descargar el backup
    ModuleManager.get('BackupManager').descargarBackupJSON();
}, 1000);
```

---

## ⚠️ Mensajes de Error Comunes

### "ModuleManager is not defined"
```javascript
// ❌ PROBLEMA: ModuleManager no está cargado aún
// ✅ SOLUCIÓN: Usar dentro de DOMContentLoaded o después

document.addEventListener('DOMContentLoaded', function() {
    const whatsApp = ModuleManager.get('WhatsAppSender');
});
```

### "Module 'WhatsAppSender' not found"
```javascript
// ❌ PROBLEMA: Módulo no se registró
// ✅ SOLUCIÓN: Verificar que js/whatsapp-sender.js está cargado antes

ModuleManager.list();  // Ver qué módulos existen
ModuleManager.verificar(['WhatsAppSender', 'BackupManager']);  // Verificar disponibilidad
```

### "Dependencias no disponibles"
```javascript
// ❌ PROBLEMA: Falta IntegracionWhatsApp, NotificationSystem, etc.
// ✅ SOLUCIÓN: Verificar módulos antes de usar

const whatsApp = ModuleManager.get('WhatsAppSender');
if (whatsApp.validarDependencias()) {
    whatsApp.enviarMensajeEmpleado(...);
} else {
    console.warn('Dependencias faltantes');
}
```

---

## 🧪 Testing Rápido

```javascript
// Cargar suite de tests
const script = document.createElement('script');
script.src = 'js/test-modulemanager.js';
document.head.appendChild(script);

// O manualmente
console.log(ModuleManager.get('WhatsAppSender') ? '✅ WhatsApp OK' : '❌ WhatsApp NO');
console.log(ModuleManager.get('BackupManager') ? '✅ Backup OK' : '❌ Backup NO');
```

---

## 📋 Checklist de Buenas Prácticas

- [ ] Verificar ModuleManager existe antes de usar
- [ ] Usar ModuleManager.verificar() para validar dependencias
- [ ] Siempre chequear resultado de operaciones críticas
- [ ] Usar try/catch para operaciones de backup/restore
- [ ] Respetar pausa de 1.5-2 segundos en envíos masivos
- [ ] Pedir confirmación antes de restaurar backup
- [ ] Ver documentación completa: [REFACTORIZACION_MODULEMANAGER_COMPLETADA.md](REFACTORIZACION_MODULEMANAGER_COMPLETADA.md)

---

## 🔗 Enlaces Útiles

| Documento | Propósito |
|-----------|----------|
| [REFACTORIZACION_MODULEMANAGER_COMPLETADA.md](REFACTORIZACION_MODULEMANAGER_COMPLETADA.md) | Documentación detallada |
| [SUMARIO_MODULEMANAGER_INTEGRATION.md](SUMARIO_MODULEMANAGER_INTEGRATION.md) | Resumen ejecutivo |
| [js/test-modulemanager.js](js/test-modulemanager.js) | Suite de validación |
| [js/whatsapp-sender.js](js/whatsapp-sender.js) | Código fuente |
| [js/backup-manager.js](js/backup-manager.js) | Código fuente |

---

**Última actualización**: 5 enero 2026 - 17:45  
**Versión**: 2.0 (ModuleManager IIFE)  
**Estado**: ✅ LISTO PARA PRODUCCIÓN
