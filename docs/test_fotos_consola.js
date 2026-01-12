// Test: Verificar que las fotos de marca de agua funcionan correctamente

console.log('🧪 Iniciando test de fotos marca de agua...\n');

// 1. Verificar que el campo de foto existe en el HTML
console.log('1️⃣  Verificando existencia del campo de foto en el modal...');
const inputFoto = document.getElementById('emple_foto');
if (inputFoto) {
    console.log('✅ Campo de foto encontrado:', inputFoto.id);
    console.log('   - Tipo:', inputFoto.type);
    console.log('   - Placeholder:', inputFoto.placeholder);
} else {
    console.error('❌ Campo de foto NO encontrado');
}

// 2. Verificar que empleados pueden tener foto
console.log('\n2️⃣  Verificando estructura de empleados...');
if (typeof empleados !== 'undefined' && empleados.length > 0) {
    console.log(`✅ Array de empleados encontrado (${empleados.length} empleados)`);
    const primerEmpleado = empleados[0];
    console.log(`   - Primer empleado: ${primerEmpleado.nombre}`);
    if ('foto' in primerEmpleado) {
        console.log(`   ✅ Campo 'foto' presente: ${primerEmpleado.foto || '(vacío)'}`);
    } else {
        console.log(`   ⚠️  Campo 'foto' ausente (se agregará al guardar)`);
    }
} else {
    console.warn('⚠️  Array de empleados vacío o no encontrado');
}

// 3. Verificar que UI.generarCuadranteGeneral existe
console.log('\n3️⃣  Verificando función UI.generarCuadranteGeneral...');
if (typeof UI !== 'undefined' && typeof UI.generarCuadranteGeneral === 'function') {
    console.log('✅ Función UI.generarCuadranteGeneral disponible');
} else {
    console.error('❌ Función UI.generarCuadranteGeneral NO disponible');
}

// 4. Verificar que las celdas de turno pueden tener foto
console.log('\n4️⃣  Verificando celdas de turno generadas...');
const celdas = document.querySelectorAll('.turno-celda');
if (celdas.length > 0) {
    console.log(`✅ ${celdas.length} celdas de turno encontradas`);
    
    // Revisar la primera celda para ver si tiene background-image
    const primeraCelda = celdas[0];
    const backgroundImage = window.getComputedStyle(primeraCelda).backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
        console.log('✅ Primera celda tiene background-image (foto presente)');
    } else {
        console.log('ℹ️  Primera celda sin background-image (empleado sin foto)');
    }
} else {
    console.warn('ℹ️  No hay celdas de turno generadas (quizás no hay datos)');
}

// 5. Test manual: Agregar foto a un empleado de prueba
console.log('\n5️⃣  Test manual: Agregar foto de prueba...');
console.log('   Instrucciones:');
console.log('   1. Ejecuta en consola:');
console.log(`      empleados[0].foto = 'https://i.pravatar.cc/150?img=1';`);
console.log('   2. Luego: UI.generarCuadranteGeneral();');
console.log('   3. Deberías ver la foto como marca de agua en la primera fila');

// 6. Verificar localStorage
console.log('\n6️⃣  Verificando persistencia en localStorage...');
try {
    const datosGuardados = localStorage.getItem('empleadosData');
    if (datosGuardados) {
        const empleadosGuardados = JSON.parse(datosGuardados);
        if (Array.isArray(empleadosGuardados)) {
            const conFoto = empleadosGuardados.filter(e => e.foto && e.foto.trim().length > 0);
            console.log(`✅ localStorage tiene ${empleadosGuardados.length} empleados`);
            console.log(`   - ${conFoto.length} empleados con foto`);
            if (conFoto.length > 0) {
                console.log(`   - Ejemplo: ${conFoto[0].nombre} -> ${conFoto[0].foto}`);
            }
        }
    } else {
        console.log('ℹ️  localStorage vacío (datos no han sido guardados aún)');
    }
} catch (e) {
    console.error('❌ Error al leer localStorage:', e.message);
}

console.log('\n' + '='.repeat(60));
console.log('✨ Test completado. Verifica los resultados arriba.');
console.log('='.repeat(60));
