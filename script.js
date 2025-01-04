let floorplanBounds = [
    [51.43273099016653, 0.045596614844766535], // north west coordinate
    [51.43184654028391, 0.048187381465194315] // south east coordinate
]

function initialiseMap() {  // create map with initial settings
    const map = L.map("map", {
        center: [51.43237874530258, 0.04667906264817554],
        zoom: 19,
        maxBounds: [floorplanBounds],
        maxBoundsViscosity: 1.0,
        minZoom: 17,
        maxZoom: 22
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { // add OSM tiles
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
}

document.addEventListener("DOMContentLoaded", () => { // once the DOM has loaded, load the map
    loadWebsite();
    const button = document.getElementById("scan-btn");
    button.addEventListener("click", scanBluetoothDevices); // add event listener to the scan button
});


let rssiValuesByDevice = new Map(); // map to store RSSI arrays for each device
let meanRSSIAtOneMetreInOpen = -41;
let meanRSSIAtOneMetreThroughDoor = -50; // 1.6 inch wooden door
let txPower;
let deviceName;
const pathLossExponent = 4.5; // attenutation of signal parameter

function handleAdvertisement(event) { // this handler is run every single time an advertisement is received
    deviceName = event.device.name || "Unknown";

    console.log('Advertisement received.');
    console.log('  Device Name: ' + event.device.name);
    console.log('  Device ID: ' + event.device.id);
    console.log('  RSSI: ' + event.rssi);
    console.log('  TX Power: ' + event.txPower);
    console.log('  UUIDs: ' + event.uuids);
    console.log('  Manufacturer data: ' + event.manufacturerData)
    console.log('  Service data: ' + event.serviceData)

    // ensure an array exists for this device
    if (!rssiValuesByDevice.has(deviceName)) {
        rssiValuesByDevice.set(deviceName, // key is device name, value is object with rssi and distance properties
                              {rssiArray: [], distance: null} 
                              );
    }

    // add RSSI to the device's array   
    let deviceData = rssiValuesByDevice.get(deviceName);
    deviceData.rssiArray.push(event.rssi);
    console.log(`${deviceName}'s RSSI Array:`, deviceData.rssiArray);
    rssiValuesByDevice.set(deviceName, deviceData)
}

async function scanBluetoothDevices() { // handler is run when scan bluetooth devices button is pressed
    try {
        rssiValuesByDevice.clear(); // clear all RSSI data at the start of the scan
        navigator.bluetooth.removeEventListener("advertisementreceived", handleAdvertisement); // remove old listener

        const scan = await navigator.bluetooth.requestLEScan({
            filters: [{ namePrefix: "NEA_Beacon" }] // only show my beacons, not every bluetooth device
        });

        console.log("Bluetooth scan started.");

        navigator.bluetooth.addEventListener("advertisementreceived", handleAdvertisement); // add fresh listener

        setTimeout(() => {
            scan.stop();
            console.log("Bluetooth scan stopped.");

            // calculate and log the distance for each device
            rssiValuesByDevice.forEach((deviceDataValue, deviceNameKey) => {
                deviceDataValue.distance = calculateDistance2(deviceDataValue.rssiArray, meanRSSIAtOneMetreInOpen, pathLossExponent);
                console.log(`${deviceName}'s approximate distance: ${deviceDataValue.distance} meters`);

                // calculate and log the nearest beacon
                const nearestBeacon = calculateNearestBeacon();
                const nearestBeaconData = rssiValuesByDevice.get(nearestBeacon); // object with rssi array and distance properties
                const nearestBeaconDistance = nearestBeaconData ? nearestBeaconData.distance : null;          
                console.log(`The nearest beacon is ${nearestBeacon} with a distance of ${nearestBeaconDistance} meters.`);
            });
        }, 5000); // stop scanning after x milliseconds
    } catch (error) {
        console.error("Error scanning Bluetooth devices:", error);
    }
}

function calculateDistance1(rssiArray, txPower, pathLossExponent) { // first formula using tx power
    if (rssiArray.length === 0) return 0;
    const sumRSSI = rssiArray.reduce((x, y) => x + y, 0);
    const averageRSSI = sumRSSI / rssiArray.length;
    return Math.pow(10, (txPower - averageRSSI) / (10 * pathLossExponent));
}

function calculateDistance2(rssiArray, meanOneMetreRSSIInOpen, pathLossExponent) { // second formula using mean RSSI value, measured RSSI at one metre and path loss exponent
    if (rssiArray.length === 0) return 0;
    const meanRSSI = calculateMeanRSSI(rssiArray);
    return Math.pow(10, (meanOneMetreRSSIInOpen - meanRSSI) / (10 * pathLossExponent));
}


function calculateMeanRSSI(rssiArray) { // takes in an array of multiple RSSI values and calculates their mean
    const sumRSSI = rssiArray.reduce((x, y) => x + y, 0);
    return sumRSSI / rssiArray.length;
}

function calculateNearestBeacon() { //
    let nearestBeacon = null;
    let smallestDistance = Infinity;

    // iterate through the map to find the device with the smallest distance
    rssiValuesByDevice.forEach((deviceDataValue, deviceNameKey) => { // value and key suffixes to prevent confusion with actual variables
        if (deviceDataValue.distance !== null && deviceDataValue.distance < smallestDistance) {
            smallestDistance = deviceDataValue.distance;
            nearestBeacon = deviceNameKey;
        }
    });

    return nearestBeacon; // return the device name with the smallest distance
}
