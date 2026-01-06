// Simular las variables globales necesarias
global.empleados = [
    { id: 1, nombre: "María Rodríguez", departamento: "Enfermería", localidad: "Madrid", horasContrato: 160, turnoPrincipal: "mañana", estado: "activo", email: "maria@email.com", telefono: "600123456" },
    { id: 2, nombre: "Carlos López", departamento: "Administración", localidad: "Barcelona", horasContrato: 140, turnoPrincipal: "tarde", estado: "activo", email: "carlos@email.com", telefono: "600234567" }
];

global.AppState = {
    currentYear: 2024,
    currentMonth: 11,
    scheduleData: new Map([
        [1, [{ dia: 1, turno: "mañana", horas: 8 }]],
        [2, [{ dia: 1, turno: "tarde", horas: 8 }]]
    ])
};

global.tiposTurno = {
    mañana: { horario: "08:00-16:00", color: "#d4edda", horas: 8 },
    tarde: { horario: "16:00-00:00", color: "#fff3cd", horas: 8 }
};

// Cargar el archivo modules.js
const fs = require("fs");
const code = fs.readFileSync("js/modules.js", "utf8");

// Ejecutar el código
try {
    eval(code);
    console.log("✅ Archivo modules.js cargado correctamente");

    // Probar algunas funciones del ChatBot
    const respuesta1 = ChatBot.contarEmpleados();
    console.log("Test 1 - contarEmpleados:", respuesta1);

    const respuesta2 = ChatBot.procesarPregunta("cuántos empleados hay");
    console.log("Test 2 - procesarPregunta:", respuesta2);

    console.log("✅ Todos los tests pasaron correctamente");
} catch (error) {
    console.log("❌ Error al ejecutar el código:", error.message);
}