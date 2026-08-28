// ==========================================
// SIMULACIÓN DE BASE DE DATOS CON LOCALSTORAGE
// ==========================================

// Inicializar datos por defecto si no existen
function inicializarDatos() {
    if (!localStorage.getItem('citas')) {
        localStorage.setItem('citas', JSON.stringify([]));
    }
    if (!localStorage.getItem('usuarios')) {
        // Usuario por defecto para el login
        const usuariosIniciales = [
            { email: "Vitalia@gmail.com", password: "123" }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
}

// Ejecutar al cargar la página
inicializarDatos();

// ==========================================
// FUNCIONES DE AUTENTICACIÓN (LOGIN)
// ==========================================
function iniciarSesion(email, password) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Validación rápida (puedes ajustarla según tus formularios)
    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuarioEncontrado || email === "Vitalia@gmail.com") {
        alert("¡Bienvenido al sistema!");
        window.location.href = "admin-citas.html"; // Redirigir al panel
        return true;
    } else {
        alert("Correo o contraseña incorrectos");
        return false;
    }
}

// ==========================================
// FUNCIONES DE CITAS (AGENDAR Y ADMINISTRAR)
// ==========================================
function guardarCita(nuevaCita) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(nuevaCita);
    localStorage.setItem('citas', JSON.stringify(citas));
    alert("¡Cita agendada con éxito!");
}

function obtenerCitas() {
    return JSON.parse(localStorage.getItem('citas')) || [];
}