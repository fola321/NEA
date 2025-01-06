let map;
let floorplanBounds = [
    [51.43860564348526, 0.0362003858023555], // north west coordinate
    [51.43173557024439, 0.05014862303723368] // south east coordinate
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

function recentreMap(map, lat, lng, locationName) {
    // Center the map on the provided coordinates
    map.setView([lat, lng], 19);
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
    map = initialiseMap();   
}

document.addEventListener("DOMContentLoaded", () => {
    loadWebsite();
    const button = document.getElementById("scan-btn");
    button.addEventListener("click", scanBluetoothDevices); // add event listener to the scan button

    const searchBarContainer = document.getElementById("search-bar-container");
    const suggestionsList = document.createElement("div");
    suggestionsList.setAttribute("id", "suggestions-list");
    searchBarContainer.appendChild(suggestionsList);

    const searchInput = document.getElementById("search-input");
    const recentSearches = document.getElementById("recent-searches");
    const recentSearchesList = document.getElementById("recent-searches-list");
    
    suggestionsList.style.position = "absolute";
    suggestionsList.style.background = "#fff";
    suggestionsList.style.border = "1px solid #ddd";
    suggestionsList.style.borderRadius = "4px";
    suggestionsList.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
    suggestionsList.style.zIndex = "1000";
    suggestionsList.style.width = "75%";
    suggestionsList.style.marginTop = "10px";
    suggestionsList.style.display = "none";
    suggestionsList.style.left = "12%";
    
    
    const dummyDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non convallis metus, in convallis sapien. Suspendisse potenti. Proin lacinia ut sapien at finibus. Nunc ligula neque, placerat sit amet iaculis eu, mattis nec libero. Ut aliquam finibus justo, a suscipit turpis lobortis sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque congue convallis dolor, vel eleifend purus congue a. Cras ut metus sagittis eros dictum tempus fringilla eget urna.";

    const locations = [
        {name: "Main Entrance", coords: [51.432379877995814, 0.04667436304914679], description: dummyDescription},
        {name: "Cafeteria", coords: [51.432399108183006, 0.04659724953935672], description: dummyDescription},
        {name: "Meeting Room A", coords: [51.43239576380319, 0.046648882063303115], description: dummyDescription},
        {name: "Meeting Room B", coords: [51.432341417597186, 0.046616695554869], description: dummyDescription},
        {name: "HR Department", coords: [51.432370680946924, 0.046660281451706864], description: dummyDescription},
        {name: "IT Department", coords: [51.43235563122656, 0.04668173912399628], description: dummyDescription},
        {name: "Building A", coords: [51.43239241942315, 0.046703867348544724], description: dummyDescription},
        {name: "Building B", coords: [51.432345598076864, 0.04671996060276178], description: dummyDescription},
        {name: "school", coords: [51.43804158166343, 0.038594470142922374], description: dummyDescription}

    ];
    
    let recentSearchesData = []; // Initially empty
    
    function updateRecentSearches() {
        recentSearchesList.innerHTML = "";
        if (recentSearchesData.length === 0) {
            recentSearches.style.display = "none"; // Hide if no recent searches
            return;
        }
        recentSearches.style.display = "block"; // Show if there are recent searches
        recentSearchesData.forEach((search) => {
            const searchItem = document.createElement("div");
            searchItem.textContent = search;
            searchItem.addEventListener("click", () => {
                searchInput.value = search;
                closeSearchBar();
                scanBluetoothDevices(); // Run Bluetooth scan when location is pressed
            });
            recentSearchesList.appendChild(searchItem);
        });
    }    
    updateRecentSearches();
    
    function showSuggestions(input) {
        const suggestionsList = document.getElementById("suggestions-list");
    
        suggestionsList.innerHTML = ""; // Clear previous suggestions
        if (!input) {
            suggestionsList.style.display = "none";
            return;
        }
        suggestionsList.style.display = "block"; // Show suggestions

        const matchingLocations = locations.filter((loc) =>
            loc.name.toLowerCase().includes(input.toLowerCase())
        );
    
        matchingLocations.forEach((loc) => {
            const suggestionItem = document.createElement("div");
            suggestionItem.textContent = loc.name;
            suggestionItem.style.padding = "10px";
            suggestionItem.style.cursor = "pointer";
            suggestionItem.style.borderBottom = "1px solid #ddd";
            suggestionItem.addEventListener("click", () => {
                const locationInfo = document.getElementById("location-info");
                searchInput.value = loc.name;
                suggestionsList.style.display = "none"; // Hide suggestions
    
                // Recenter the map
                recentreMap(map, loc.coords[0], loc.coords[1], loc.name);
    
                // Trigger the bottom sheet
                showLocationInfo(loc.name, loc.description);
    
                // Ensure bottom sheet is visible
                locationInfo.classList.add("open");
            });            suggestionItem.addEventListener("mouseenter", () => {
                suggestionItem.style.background = "#f9f9f9";
            });
            suggestionItem.addEventListener("mouseleave", () => {
                suggestionItem.style.background = "#fff";
            });
            suggestionsList.appendChild(suggestionItem);
        });
    
    }
        
    function addToRecentSearches(location) {
    if (!recentSearchesData.includes(location)) {
    recentSearchesData.unshift(location);
    if (recentSearchesData.length > 5) recentSearchesData.pop();
    updateRecentSearches();
    }
    }
    
    searchInput.addEventListener("input", (e) => {
        const inputValue = e.target.value.trim();
        if (inputValue === "") {
            suggestionsList.style.display = "none";
            if (recentSearchesData.length > 0) {
                recentSearches.style.display = "block"; // Show recent searches when input is blank
            }
        } else {
            showSuggestions(inputValue); // Show suggestions
            recentSearches.style.display = "none"; // Hide recent searches while typing
        }
    });
        
    searchInput.addEventListener("click", () => {
        searchInput.removeAttribute("readonly");
        searchBarContainer.classList.add("expanded");
        searchInput.placeholder = "Enter location...";
        if (searchInput.value.trim() === "" && recentSearchesData.length > 0) {
        recentSearches.style.display = "block"; // Show recent searches if input is blank
        }
    });
    
    searchInput.addEventListener("blur", () => {
        setTimeout(() => {
            // Hide recent searches and suggestions when losing focus
            recentSearches.style.display = "none";
            suggestionsList.style.display = "none";
            searchInput.setAttribute("readonly", true);
            searchInput.placeholder = "Search for a location...";
            searchBarContainer.classList.remove("expanded");
        }, 200); // Small timeout to allow click events to register on recent search items
        });
                
    function closeSearchBar() {
        searchInput.setAttribute("readonly", true);
        searchInput.placeholder = "Search for a location...";
        searchBarContainer.classList.remove("expanded");
        suggestionsList.style.display = "none";
        // Only show recent searches if there are entries
        if (recentSearchesData.length > 0) {
        recentSearches.style.display = "block";
        }
    }

    // Sliding behavior for more info (optional)
    const locationInfo = document.getElementById("location-info");
    let isDragging = false;
    let startY = 0;
    let startHeight = 0;

    locationInfo.addEventListener("click", (e) => {
        if (!e.target.closest("#directions-btn")) {
            locationInfo.classList.toggle("expanded"); // Toggle expanded state
        }
        });

    // Touch events for sliding up and down
    locationInfo.addEventListener("touchstart", (e) => {
        console.log("touchstart", e.touches[0].clientY);

        if (!e.target.closest("#location-info")) return;


        isDragging = true;
        startY = e.touches[0].clientY; // Capture the initial touch position
        startHeight = locationInfo.offsetHeight; // Current height of the bottom sheet
        locationInfo.classList.add("dragging"); // Add dragging class
        document.body.style.touchAction = "none"; // Disable default scrolling
    });

    document.addEventListener("touchmove", (e) => {
        console.log("touchmove", e.touches[0].clientY);

        if (!isDragging) return;

        const touchY = e.touches[0].clientY; // Current touch position
        const dy = startY - touchY; // Difference between initial and current touch position
        const newHeight = Math.min(Math.max(startHeight + dy, 150), window.innerHeight); // Clamp height
        locationInfo.style.height = `${newHeight}px`; // Update height dynamically
    });

    document.addEventListener("touchend", () => {
        console.log("touchend");

        if (isDragging) {
            isDragging = false;
            locationInfo.classList.remove("dragging"); // Remove dragging class
            document.body.style.touchAction = ""; // Re-enable scrolling

            // Determine whether to expand or collapse based on height
            const midPoint = window.innerHeight / 2;
            if (locationInfo.offsetHeight > midPoint) {
                locationInfo.classList.add("expanded");
            } else {
                locationInfo.classList.remove("expanded");
            }
            locationInfo.style.height = ""; // Reset inline height for CSS rules
        }
    });

    function showLocationInfo(locationName, description) {
        console.log("Updating bottom sheet content and adding 'open' class");

        const locationInfo = document.getElementById("location-info");
        const locationNameElement = document.getElementById("location-name");
        const locationDescriptionElement = document.getElementById("location-description");
        const locationImageElement = document.getElementById("location-image");
    
        // Update the content
        locationNameElement.textContent = locationName;
        locationDescriptionElement.textContent = description;
    
        // Show the bottom sheet
        locationInfo.classList.add("open");
        console.log("Classes on location-info:", locationInfo.classList); // Check if 'open' is added
    }
    
    // Close the bottom sheet when clicking outside
    document.addEventListener("click", (e) => {
        const locationInfo = document.getElementById("location-info");
        if (!locationInfo.contains(e.target) && !e.target.closest("#search-bar-container")) {
            locationInfo.classList.remove("open");
        }
    });

    const directionsBtn = document.getElementById("directions-btn");

    directionsBtn.addEventListener("click", (e) => {

        let originalStyles = {
            top: searchBarContainer.style.top,
            backgroundColor: searchBarContainer.style.backgroundColor,
            padding: searchBarContainer.style.padding,
            borderRadius: searchBarContainer.style.borderRadius,
            boxShadow: searchBarContainer.style.boxShadow,
            height: searchBarContainer.style.height,
            width: searchBarContainer.style.width
        };

        // Check if the starting location search bar already exists
        if (!document.getElementById("start-location-bar")) {            
            // Create the starting location search bar
            const startLocationBar = document.createElement("div");
            startLocationBar.id = "start-location-bar";
            startLocationBar.className = "search-bar"; // Reuse the 'search-bar' class
            startLocationBar.innerHTML = `
                <input type="text" id="start-location-input" placeholder="Enter starting location..." />
            `;
            searchBarContainer.prepend(startLocationBar);

                    // Create suggestions list for the starting location
        const startSuggestionsList = document.createElement("div");
        startSuggestionsList.setAttribute("id", "start-suggestions-list");
        
        startSuggestionsList.style.position = "absolute";
        startSuggestionsList.style.background = "#fff";
        startSuggestionsList.style.border = "1px solid #ddd";
        startSuggestionsList.style.borderRadius = "4px";
        startSuggestionsList.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        startSuggestionsList.style.zIndex = "1000";
        startSuggestionsList.style.width = "77%";
        startSuggestionsList.style.marginTop = "10px";
        startSuggestionsList.style.display = "none";
        startSuggestionsList.style.top = "95%"; // Position immediately below the bar
        startSuggestionsList.style.left = "12%"; // Align with the left edge of the bar


            
        startLocationBar.appendChild(startSuggestionsList);

        // Add event listeners for the starting location input
        const startLocationInput = document.getElementById("start-location-input");

        function showStartSuggestions(input) {
            startSuggestionsList.innerHTML = ""; // Clear previous suggestions
        
            // Add "Your Location" as the first suggestion
            const yourLocationItem = document.createElement("div");
            yourLocationItem.textContent = "Your Location";
            yourLocationItem.style.padding = "10px";
            yourLocationItem.style.cursor = "pointer";
            yourLocationItem.style.borderBottom = "1px solid #ddd";
            yourLocationItem.addEventListener("click", () => {
                startLocationInput.value = "Your Location";
                startSuggestionsList.style.display = "none"; // Hide suggestions
                // Trigger your location-specific functionality
                console.log("Your Location selected");
            });
            yourLocationItem.addEventListener("mouseenter", () => {
                yourLocationItem.style.background = "#f9f9f9";
            });
            yourLocationItem.addEventListener("mouseleave", () => {
                yourLocationItem.style.background = "#fff";
            });
            startSuggestionsList.appendChild(yourLocationItem);
        
            // Add matching locations below "Your Location"
            if (input) {
                const matchingLocations = locations.filter((loc) =>
                    loc.name.toLowerCase().includes(input.toLowerCase())
                );
        
                matchingLocations.forEach((loc) => {
                    const suggestionItem = document.createElement("div");
                    suggestionItem.textContent = loc.name;
                    suggestionItem.style.padding = "10px";
                    suggestionItem.style.cursor = "pointer";
                    suggestionItem.style.borderBottom = "1px solid #ddd";
                    suggestionItem.addEventListener("click", () => {
                        startLocationInput.value = loc.name;
                        startSuggestionsList.style.display = "none"; // Hide suggestions
                        // Optionally recenter the map for this location
                        recentreMap(map, loc.coords[0], loc.coords[1], loc.name);
                    });
                    suggestionItem.addEventListener("mouseenter", () => {
                        suggestionItem.style.background = "#f9f9f9";
                    });
                    suggestionItem.addEventListener("mouseleave", () => {
                        suggestionItem.style.background = "#fff";
                    });
                    startSuggestionsList.appendChild(suggestionItem);
                });
            }
            startSuggestionsList.style.display = "block"; // Show suggestions
        }
        
        startLocationInput.addEventListener("click", () => {
            // Show "Your Location" and suggestions when the input is clicked
            showStartSuggestions(""); // Pass an empty string to show only "Your Location"
        });
        
        startLocationInput.addEventListener("input", (e) => {
            const inputValue = e.target.value.trim();
            showStartSuggestions(inputValue); // Show "Your Location" and matching suggestions
        });
        
        startLocationInput.addEventListener("blur", () => {
            setTimeout(() => {
                startSuggestionsList.style.display = "none"; // Hide suggestions when input loses focus
            }, 200); // Small timeout to allow click events to register
        });

            // Adjust search bar container styles
            searchBarContainer.style.padding = "10px";
            searchBarContainer.style.backgroundColor = "white";
            searchBarContainer.style.borderRadius = "12px";
            searchBarContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
            searchBarContainer.style.top = "0px";
            searchBarContainer.style.flexDirection = "column"; // Restore vertical layout
            searchBarContainer.style.width = "100%"
            searchBarContainer.style.height = "19%";

            const searchBars = document.querySelectorAll(".search-bar");
            searchBars.forEach((bar) => {
                bar.style.width = "60%"; // New width (adjust as needed)
            });
            

            // Add back button
            const backBtn = document.createElement("div");
            backBtn.id = "back-btn";
            searchBarContainer.parentElement.appendChild(backBtn);

                
            backBtn.addEventListener("click", () => {
                // Remove the starting location bar
                if (startLocationBar) startLocationBar.remove();
                backBtn.remove();
    
                // Restore original styles
                searchBarContainer.style.top = originalStyles.top;
                searchBarContainer.style.backgroundColor = originalStyles.backgroundColor;
                searchBarContainer.style.padding = originalStyles.padding;
                searchBarContainer.style.borderRadius = originalStyles.borderRadius;
                searchBarContainer.style.boxShadow = originalStyles.boxShadow;
                searchBarContainer.style.height = originalStyles.height;
                searchBarContainer.style.width = originalStyles.width;
            });

            e.stopPropagation(); // Prevent event from propagating to the bottom sheet click handler
            locationInfo.classList.remove("open");

        }
    });                                
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
                console.log(`${deviceNameKey}'s approximate distance: ${deviceDataValue.distance} meters`);
            });

            // calculate and log the nearest beacon
            const nearestBeacon = calculateNearestBeacon();
            const nearestBeaconData = rssiValuesByDevice.get(nearestBeacon); // object with rssi array and distance properties
            const nearestBeaconDistance = nearestBeaconData ? nearestBeaconData.distance : null;          
            console.log(`The nearest beacon is ${nearestBeacon} with a distance of ${nearestBeaconDistance} meters.`);
        }, 1000); // stop scanning after x milliseconds
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
