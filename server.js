const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta al archivo JSON donde guardas los datos
const DATA_FILE = path.join(__dirname, 'data.json');

// Función auxiliar para leer los datos del JSON
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            // Si no existe, creamos una estructura base vacía
            const initialData = { usuarios: [], citas: [] };
            fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        const fileData = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Error al leer el archivo de datos:", error);
        return { usuarios: [], citas: [] };
    }
}

// Función auxiliar para escribir en el archivo JSON
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error al escribir en el archivo de datos:", error);
    }
}

// ==========================================
// RUTAS DE LA API
// ==========================================

// Ruta de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
    res.json({ status: 'API del Sistema Express funcionando correctamente' });
});

// Ruta de Login (Ejemplo básico adaptado a tu estructura)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readData();

    // Puedes buscar en tu base de datos o simular la validación
    // Si manejas usuarios en tu data.json, puedes buscarlos aquí:
    /*
    const user = db.usuarios.find(u => u.email === email && u.password === password);
    if (user) {
        return res.json({ success: true, message: 'Autenticación exitosa', user });
    }
    */

    // Validación provisional o de prueba (ajusta según tus credenciales)
    if (email === "Vitalia@gmail.com") {
        return res.json({ success: true, message: 'Bienvenido al sistema' });
    }

    res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
});

// Ruta para obtener o registrar citas (Ejemplo general)
app.get('/api/citas', (req, res) => {
    const db = readData();
    res.json(db.citas || []);
});

app.post('/api/citas', (req, res) => {
    const nuevaCita = req.body;
    const db = readData();
    
    if (!db.citas) db.citas = [];
    db.citas.push(nuevaCita);
    
    writeData(db);
    res.json({ success: true, message: 'Cita registrada correctamente', cita: nuevaCita });
});

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
// Utiliza el puerto que asigne la plataforma en la nube (Render) o el 3000 por defecto localmente
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});