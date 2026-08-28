const API_URL = 'http://localhost:3000/api/appointments';

const form = document.getElementById('appointmentForm');
const formTitle = document.getElementById('formTitle');
const patientNameInput = document.getElementById('patientName');
const doctorNameInput = document.getElementById('doctorName');
const appointmentDateInput = document.getElementById('appointmentDate');
const tableBody = document.getElementById('appointmentTableBody');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');

let editingId = null;
let allAppointments = []; // Almacena todas las citas para el buscador

// Cargar citas al iniciar la página
document.addEventListener('DOMContentLoaded', fetchAppointments);

async function fetchAppointments() {
    try {
        const response = await fetch(API_URL);
        allAppointments = await response.json();
        renderTable(allAppointments);
    } catch (error) {
        console.error('Error al conectar con el backend:', error);
        tableBody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-500">⚠️ Error al conectar con el servidor backend.</td></tr>`;
    }
}

// Evento para filtrar la tabla en tiempo real
searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    const filteredAppointments = allAppointments.filter(app => {
        return app.patientName.toLowerCase().includes(searchTerm) || 
               app.doctorName.toLowerCase().includes(searchTerm);
    });

    renderTable(filteredAppointments);
});

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const patientName = patientNameInput.value.trim();
    const doctorName = doctorNameInput.value.trim();
    const appointmentDate = appointmentDateInput.value.trim();

    if (!patientName || !doctorName || !appointmentDate) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const appointmentData = { patientName, doctorName, appointmentDate };

    try {
        let response;
        if (editingId) {
            // Actualizar (PUT)
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });
        } else {
            // Crear (POST)
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appointmentData)
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al procesar la solicitud');
        }

        resetFormMode();
        fetchAppointments();

    } catch (error) {
        console.error('Error:', error);
        alert("Hubo un problema: " + error.message);
    }
});

function editAppointment(id, patientName, doctorName, appointmentDate) {
    editingId = id;
    patientNameInput.value = patientName;
    doctorNameInput.value = doctorName;
    appointmentDateInput.value = appointmentDate;

    if (formTitle) formTitle.textContent = "Editar Cita Existente";
    if (submitBtn) {
        submitBtn.textContent = "ACTUALIZAR CITA";
        submitBtn.className = "bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:bg-amber-700 transition";
    }
    if (cancelEditBtn) cancelEditBtn.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormMode() {
    form.reset();
    editingId = null;
    if (formTitle) formTitle.textContent = "Agendar Nueva Cita";
    if (submitBtn) {
        submitBtn.textContent = "AGENDAR CITA";
        submitBtn.className = "bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:bg-teal-700 transition";
    }
    if (cancelEditBtn) cancelEditBtn.classList.add('hidden');
}

async function deleteAppointment(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta cita?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar la cita');
        fetchAppointments();
    } catch (error) {
        console.error('Error al eliminar:', error);
        alert("Error al eliminar la cita.");
    }
}

function renderTable(appointments) {
    tableBody.innerHTML = '';
    if (appointments.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-gray-400 italic">No se encontraron citas registradas.</td></tr>`;
        return;
    }

    appointments.forEach(app => {
        const row = document.createElement('tr');
        row.className = "hover:bg-gray-50 border-b border-gray-100";
        
        const fechaObj = new Date(app.appointmentDate + 'T00:00:00');
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

        row.innerHTML = `
            <td class="p-4 font-medium text-teal-800">${app.patientName}</td>
            <td class="p-4 text-gray-600">${app.doctorName}</td>
            <td class="p-4 font-mono text-sm">${fechaFormateada}</td>
            <td class="p-4 text-center space-x-2">
                <button onclick="editAppointment('${app.id}', '${app.patientName}', '${app.doctorName}', '${app.appointmentDate}')" 
                    class="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-amber-200 transition">
                    Editar
                </button>
                <button onclick="deleteAppointment('${app.id}')" 
                    class="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                    Eliminar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}