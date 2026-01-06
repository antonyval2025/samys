// 🔍 SCRIPT DE DIAGNÓSTICO RÁPIDO - FASE 1
// Copiar y pegar en la consola del navegador

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     DIAGNÓSTICO RÁPIDO - FASE 1 SIDEBAR                   ║');
console.log('╚════════════════════════════════════════════════════════════╝');

// 1. Verificar ModuleManager
console.log('\n1️⃣ ModuleManager:');
console.log('  - Disponible:', typeof ModuleManager !== 'undefined' ? '✅ SÍ' : '❌ NO');
if (typeof ModuleManager !== 'undefined') {
    const mod = ModuleManager.get('SidebarSemana3Module');
    console.log('  - SidebarSemana3Module cargado:', mod ? '✅ SÍ' : '❌ NO');
    if (mod) {
        console.log('  - Estado:', mod.obtenerEstado());
    }
}

// 2. Verificar dependencias
console.log('\n2️⃣ Dependencias:');
console.log('  - AnalizadorConflictos:', typeof AnalizadorConflictos !== 'undefined' ? '✅' : '❌');
console.log('  - MetricasModule:', typeof MetricasModule !== 'undefined' ? '✅' : '❌');
console.log('  - OptimizadorTurnos:', typeof OptimizadorTurnos !== 'undefined' ? '✅' : '❌');
console.log('  - AppState:', typeof AppState !== 'undefined' ? '✅' : '❌');
console.log('  - NotificationSystem:', typeof NotificationSystem !== 'undefined' ? '✅' : '❌');
console.log('  - empleados:', typeof empleados !== 'undefined' ? '✅' : '❌');
console.log('  - modalSemana3:', document.getElementById('modalSemana3') ? '✅' : '❌');

// 3. Verificar logs en consola
console.log('\n3️⃣ Buscar en la consola arriba estos logs:');
console.log('  - 🚀 DOMContentLoaded: Inicializando SidebarSemana3Module...');
console.log('  - 📊 Estado de dependencias:');
console.log('  - ✅ SidebarSemana3Module inicializado');
console.log('  - 📦 SidebarSemana3Module registrado en ModuleManager');

// 4. Test manual
console.log('\n4️⃣ Test manual - ejecutar esto:');
console.log('  ModuleManager.get("SidebarSemana3Module").abrirAnalisis()');

console.log('\n════════════════════════════════════════════════════════════');
