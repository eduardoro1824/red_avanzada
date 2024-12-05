// Variables globales
let wifiActive = false;
let aiEnabled = false;
let devices = [];
let threatCounter = 0;

// Elementos del DOM
const wifiStatus = document.getElementById('wifiStatus');
const deviceTableBody = document.getElementById('deviceTableBody');
const threatAlerts = document.getElementById('threatAlerts');

// Botones
const startWifiZone = document.getElementById('startWifiZone');
const enableAI = document.getElementById('enableAI');
const toggleAI = document.getElementById('toggleAI');
const clearDevices = document.getElementById('clearDevices');
const addDeviceManually = document.getElementById('addDeviceManually');

// Eventos
startWifiZone.addEventListener('click', toggleWifiZone);
enableAI.addEventListener('click', toggleAIStatus);
toggleAI.addEventListener('click', startAutoConnection);
clearDevices.addEventListener('click', clearAllDevices);
addDeviceManually.addEventListener('click', addManualDevice);

// Función para activar/desactivar la Zona Wi-Fi
function toggleWifiZone() {
    wifiActive = !wifiActive;
    wifiStatus.textContent = wifiActive
        ? 'Estado: Zona Wi-Fi activa'
        : 'Estado: Zona Wi-Fi no activa';

    // Habilitar o deshabilitar botones según el estado de la zona Wi-Fi
    enableAI.disabled = !wifiActive;
    clearDevices.disabled = !wifiActive;
    addDeviceManually.disabled = !wifiActive;
    toggleAI.disabled = !wifiActive;

    if (!wifiActive) {
        devices = [];
        renderDeviceTable();
    }
}

// Función para habilitar/deshabilitar la IA
function toggleAIStatus() {
    if (!wifiActive) {
        alert('Activa la Zona Wi-Fi antes de habilitar la IA.');
        return;
    }

    aiEnabled = !aiEnabled;
    alert(aiEnabled ? 'IA habilitada.' : 'IA deshabilitada.');
}

// Función para iniciar la conexión automática mediante IA
function startAutoConnection() {
    if (!aiEnabled || !wifiActive) {
        alert('Activa la Zona Wi-Fi y habilita la IA antes de iniciar la conexión automática.');
        return;
    }

    const interval = setInterval(() => {
        if (!aiEnabled || !wifiActive) {
            clearInterval(interval);
            return;
        }

        const randomDevice = generateRandomDevice();
        devices.push(randomDevice);
        renderDeviceTable();
        generateThreatAlert(randomDevice);
    }, 3000);

    alert('Conexión automática iniciada. Se agregarán dispositivos cada 3 segundos.');
    // Se ha eliminado la línea que deshabilitaba el botón de inicio automático
}

// Función para agregar dispositivos manualmente
function addManualDevice() {
    const name = document.getElementById('manualDeviceName').value;
    const ip = document.getElementById('manualDeviceIp').value;

    if (!name || !ip) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newDevice = {
        name,
        ip,
        status: 'Conectado',
        threat: 'Ninguna',
        blocked: false // Estado inicial: no bloqueado
    };

    devices.push(newDevice);
    renderDeviceTable();

    document.getElementById('manualAddForm').reset();
}

// Función para generar un dispositivo aleatorio
function generateRandomDevice() {
    const randomNames = ['PC-1', 'Tablet-X', 'Phone-Y', 'Router-Z'];
    const randomIp = `192.168.1.${Math.floor(Math.random() * 255) + 1}`;
    const isThreat = Math.random() < 0.3; // 30% de probabilidad de amenaza

    return {
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        ip: randomIp,
        status: 'Conectado',
        threat: isThreat ? 'Amenaza detectada' : 'Ninguna',
        blocked: isThreat // Bloqueado automáticamente si hay amenaza
    };
}

// Función para generar una alerta de amenaza
function generateThreatAlert(device) {
    if (device.threat === 'Amenaza detectada') {
        const alert = document.createElement('li');
        alert.textContent = `¡ALERTA! Dispositivo ${device.name} (${device.ip}) detectado con amenaza y bloqueado automáticamente.`;
        threatAlerts.appendChild(alert);
        threatCounter++;
    }
}

// Función para limpiar todos los dispositivos
function clearAllDevices() {
    devices = [];
    renderDeviceTable();
    threatAlerts.innerHTML = '';
    threatCounter = 0;
}

// Función para renderizar la tabla de dispositivos
function renderDeviceTable() {
    deviceTableBody.innerHTML = '';

    devices.forEach((device, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.ip}</td>
            <td>${device.status}</td>
            <td>${device.threat}</td>
            <td>
                <button onclick="toggleBlockDevice(${index})">
                    ${device.blocked ? 'Desbloquear' : 'Bloquear'}
                </button>
            </td>
            <td>
                <button onclick="removeDevice(${index})" class="remove-btn">Eliminar</button>
            </td>
        `;

        deviceTableBody.appendChild(row);
    });
}

// Función para bloquear/desbloquear un dispositivo
function toggleBlockDevice(index) {
    const device = devices[index];
    device.blocked = !device.blocked;
    device.status = device.blocked ? 'Bloqueado' : 'Conectado';
    renderDeviceTable();
}

// Función para eliminar un dispositivo individual
function removeDevice(index) {
    const confirmDelete = confirm(
        `¿Estás seguro de que deseas eliminar el dispositivo "${devices[index].name}" (${devices[index].ip})?`
    );
    if (confirmDelete) {
        devices.splice(index, 1);
        renderDeviceTable();
    }
}
