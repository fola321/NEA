let floorplanBounds = [
    [51.43273099016653, 0.045596614844766535], // north west coordinate
    [51.43184654028391, 0.048187381465194315] // south east coordinate
]

function initialiseMap() {
    const map = L.map("map", {
        center: [51.43237874530258, 0.04667906264817554],
        zoom: 19,
        maxBounds: [floorplanBounds],
        maxBoundsViscosity: 1.0,
        minZoom: 17,
        maxZoom: 22
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 22,
        minZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map;
}

// function overlayFloorplan(map) {
//     fetch("/floorplan.svg")
//         .then(response => response.text())
//         .then(svgText => {
//             // Create a DOM element for the SVG
//             const svgContainer = document.createElement('div');
//             svgContainer.innerHTML = svgText;

//             const svgElement = svgContainer.querySelector('svg');
//             svgElement.style.position = 'absolute';

//             // Convert floorplan bounds to LatLngBounds
//             const overlayBounds = L.latLngBounds(floorplanBounds);

//             // Calculate corners of the bounds in layer coordinates
//             const topLeft = map.latLngToLayerPoint(overlayBounds.getNorthWest());
//             const bottomRight = map.latLngToLayerPoint(overlayBounds.getSouthEast());

//             // Set the size and position of the SVG
//             svgElement.style.left = `${topLeft.x}px`;
//             svgElement.style.top = `${topLeft.y}px`;
//             svgElement.style.width = `${bottomRight.x - topLeft.x}px`;
//             svgElement.style.height = `${bottomRight.y - topLeft.y}px`;

//             // Append the SVG to the map's overlay pane
//             const pane = map.getPane('overlayPane');
//             pane.appendChild(svgElement);

//             // Apply rotation if needed
//             svgElement.style.transformOrigin = 'center center';
//             svgElement.style.transform = 'rotate(-12deg)'; // Adjust rotation angle
//         })
//         .catch(error => console.error("Error loading SVG:", error));
// }

function loadWebsite() {
    const map = initialiseMap();
    console.log(map);   
}

// Bluetooth scanning functionality
function scanForBluetoothDevices() {
    const devicesContainer = document.getElementById("bluetooth-devices");
    devicesContainer.textContent = "Scanning for devices...";

    navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true })
        .then(scan => {
            navigator.bluetooth.addEventListener('advertisementreceived', event => {
                const deviceInfo = `
Device Name: ${event.device.name || "Unknown"}
Device ID: ${event.device.id}
RSSI: ${event.rssi}
TX Power: ${event.txPower || "Unknown"}
UUIDs: ${event.uuids || "None"}
Manufacturer Data: ${Array.from(event.manufacturerData.keys()).join(", ") || "None"}
Service Data: ${Array.from(event.serviceData.keys()).join(", ") || "None"}
`;

                devicesContainer.textContent += deviceInfo + "\n\n";
            });
        })
        .catch(error => {
            devicesContainer.textContent = "Error: " + error.message;
        });
}

// Attach event listener to the button
document.getElementById("scan-btn").addEventListener("click", scanForBluetoothDevices);

loadWebsite()