let map;
let maxBounds = [
    [51.43892, 0.03446], // north west coordinate
    [51.436762, 0.043473] // south east coordinate
]
// const floorplanBounds = [ // this determines where the floorplan will be placed on the map
//     [51.438718, 0.037575], // co-ordinates of the top left
//     [51.437643, 0.039852] // co-ordinates of the bottom right
// ]

let currentFloorplanOverlay = null;

let startingMarker, destinationMarker;

const dummyDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non convallis metus, in convallis sapien. Suspendisse potenti. Proin lacinia ut sapien at finibus. Nunc ligula neque, placerat sit amet iaculis eu, mattis nec libero. Ut aliquam finibus justo, a suscipit turpis lobortis sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque congue convallis dolor, vel eleifend purus congue a. Cras ut metus sagittis eros dictum tempus fringilla eget urna.";

const firstFloorLocations = [ 
    {name: "School Gate", id: "one", neighbours: {"School Gate - WP1": 1}, coords: [51.43736677400648, 0.040213018655776984], description: dummyDescription},
    {name: "Chapel", id: "two", neighbours: {"Chapel - WP1/WP4": 1}, coords: [51.437709952366774, 0.039739608764648444], description: dummyDescription},
    {name: "Reception", id: "three", neighbours: {"Reception - WP2": 1}, coords: [51.437908501397835, 0.03879815340042115], description: dummyDescription},
    {name: "Foxbury Building", id: "four", neighbours: {"Foxbury Building - WP5": 1}, coords: [51.43846192614147, 0.03782182931900025], description: dummyDescription},
    {name: "The Quad", id: "five", neighbours: {"WP6": 1, "WP7": 1, "WP8": 1, "WP9": 1}, coords: [51.43821447421482, 0.03856748342514039], description: dummyDescription},
    {name: "Room 1", id :"six", neighbours: {"Room 1 - Central Hall": 1}, coords: [51.43799377271679, 0.03864258527755738], description: dummyDescription},
    {name: "Room 2", id: "seven", neighbours: {"Room 2 - Central Hall": 1}, coords: [51.43803557232478, 0.038741827011108405], description: dummyDescription},
    {name: "Central Hall", id: "eight", neighbours: {"Room 1 - Central Hall": 1, "Room 2 - Central Hall": 1, "Central Hall - Lockers": 1, "Central Hall - Reception": 1, "Central Hall - WP13": 1, "Central Hall - Old Library": 1}, coords: [51.437960333002835, 0.0387793779373169], description: dummyDescription},
    {name: "Library Atrium", id: "nine", neighbours: {"Library Atrium - WP8": 1, "Library Atrium - WP7": 1,"Library Atrium - WP13": 1, "Library Atrium - Mervyn Peake Library": 1, "Library Atrium - WP12": 1}, coords: [51.43811164751319, 0.038851797580718994], description: dummyDescription},
    {name: "Old Library", id: "ten", neighbours: {"Central Hall - Old Library": 1, "Old Library - Mervyn Peake Library": 1}, coords: [51.438042260258506, 0.03887727856636048], description: dummyDescription},
    {name: "Lockers", id: "eleven", neighbours: {"Central Hall - Lockers": 1, "Lockers - WP14": 1}, coords: [51.43793776118207, 0.038662701845169074], description: dummyDescription},
    {name: "Turberville Atrium", id: "twelve", neighbours: {"Turberville Atrium - WP6": 1, "Turberville Atrium - Formica Seminar Room": 1, "Turberville Atrium - 6F Common Room": 1, "Turberville Atrium - Admissions Office": 1}, coords: [51.43818354262972, 0.03820940852165222], description: dummyDescription},
    {name: "Toilets in between Room T2 and T3", id: "thirteen", neighbours: {"Toilets in between Room T2 and T3 - Room T2": 1, "Toilets in between Room T2 and T3 - Room T3": 1}, coords: [51.438438518584185, 0.03812424838542939], description: dummyDescription},
    {name: "Politics Atrium", id: "fourteen", neighbours: {"Politics Atrium - Room 17": 1, "Politics Atrium - Room 18": 1}, coords: [51.43841155807927, 0.03850981593132019], description: dummyDescription},
    {name: "Admissions Office", id: "fifteen", neighbours: {"Turberville Atrium - Admissions Office": 1}, coords: [51.438104123599096, 0.03813296556472779], description: dummyDescription},
    {name: "Formica Seminar Room", id: "sixteen", neighbours: {"Turberville Atrium - Formica Seminar Room": 1, "Formica Seminar Room - 6F Common Room": 1}, coords: [51.438242897815094, 0.03824427723884583], description: dummyDescription},
    {name: "6F Common Room", id: "seventeen", neighbours: {"Formica Seminar Room - 6F Common Room": 1, "Turberville Atrium - 6F Common Room": 1, "6F Office - 6F Common Room":1}, coords: [51.43824038985107, 0.038048475980758674], description: dummyDescription},
    {name: "Room 17", id: "eighteen", neighbours: {"Politics Atrium - Room 17": 1}, coords: [51.43841427503009, 0.038423985242843635], description: dummyDescription},
    {name: "Room 18", id: "nineteen", neighbours: {"Politics Atrium - Room 18": 1}, coords: [51.43843684661537, 0.038605034351348884], description: dummyDescription},
    {name: "6F Office", id: "twenty", neighbours: {"6F Office - 6F Common Room": 1, "6F Office - Side Staircases": 1}, coords: [51.43830058094949, 0.03806825727224351], description: dummyDescription},
    {name: "Side Staircases", id: "twenty one", neighbours: {"6F Office - Side Staircases": 1, "Side Staircases - Maths Atrium": 1}, coords: [51.438325869547036, 0.03809172660112382], description: dummyDescription},
    {name: "Room T1", id: "twenty two", neighbours: {"Room T1 - Maths Atrium": 1}, coords: [51.43830037195277, 0.03821946680545807], description: dummyDescription},
    {name: "Room T2", id: "twenty three", neighbours: {"Room T2 - Maths Atrium": 1, "Toilets in between Room T2 and T3 - Room T3": 1}, coords: [51.43841657398837, 0.03805249929428101], description: dummyDescription},
    {name: "Room T3", id: "twenty four", neighbours: {"Room T3 - Maths Atrium": 1, "Toilets in between Room T2 and T3 - Room T3": 1}, coords: [51.43843705561147, 0.038202367722988136], description: dummyDescription},
    {name: "Room T4", id: "twenty five", neighbours: {"Room T4 - Maths Atrium": 1}, coords: [51.43839860031154, 0.03830596804618836], description: dummyDescription},
    {name: "Maths Atrium", id: "twenty six", neighbours: {"Side Staircases - Maths Atrium": 1, "Maths Atrium - WP6/WP9": 1, "Maths Atrium - Maths Office": 1, "Room T1 - Maths Atrium": 1, "Room T2 - Maths Atrium": 1, "Room T3 - Maths Atrium": 1, "Room T4 - Maths Atrium": 1,}, coords: [51.43836578788327, 0.03819063305854798], description: dummyDescription},
    {name: "Maths Office", id: "twenty seven", neighbours: {"Maths Atrium - Maths Office": 1}, coords: [51.43836411591178, 0.03806456923484802], description: dummyDescription},

];

const firstFloorWalkablePaths = [
    {name: "WP1", id: 1, neighbours: {"School Gate": 1, "Chapel": 1, "WP2": 1, "WP4": 1}, coords: [51.43760775152908, 0.039697028696537025]},
    {name: "WP2", id: 2, neighbours: {"WP1": 1, "WP4": 1, "WP3": 1, "Reception": 1}, coords: [51.437779340126255, 0.038871243596076965]},
    {name: "WP3", id: 3, neighbours: {"WP15": 1, "WP14": 1, "WP6": 1, "WP7": 1}, coords: [51.43784454780416, 0.038474947214126594]},
    {name: "WP4", id: 4, neighbours: {"WP1": 1, "WP2": 1}, coords: [51.43798332280879, 0.03925010561943055]},
    {name: "WP5", id: 5, neighbours: {"Foxbury Building": 1, "WP2": 1}, coords: [51.438112483503566, 0.037835240364074714]},
    {name: "WP6", id: 6, neighbours: {"Turberville Atrium": 1, "Maths Atrium": 1, "The Quad": 1, "WP7": 1, "WP9": 1}, coords: [51.43819691845287, 0.038381069898605354]},
    {name: "WP7", id: 7, neighbours: {"The Quad": 1, "Library Atrium": 1, "WP6": 1, "WP8": 1}, coords: [51.43809158373953, 0.0386345386505127]},
    {name: "WP8", id: 8, neighbours: {"The Quad": 1, "KGH": 1, "Library Atrium": 1, "WP7": 1, "WP9": 1}, coords: [51.438248749730576, 0.038747191429138184]},
    {name: "WP9", id: 9, neighbours: {"The Quad": 1, "Maths Atrium": 1, "Politics Atrium": 1, "WP6": 1, "WP8": 1}, coords: [51.43837331175427, 0.03848299384117127]},
    {name: "WP10", id: 10, neighbours: {}, coords: [51.43813589122792, 0.03793850541114808]},
    {name: "WP11", id: 11, neighbours: {}, coords: [51.43818103466246, 0.0382201373577118]},
    {name: "WP12", id: 12, neighbours: {"Library Atrium": 1}, coords: [51.438155118992526, 0.03892153501510621]},
    {name: "WP13", id: 13, neighbours: {"Central Hall": 1, "Library Atrium": 1,}, coords: [51.43805480013163, 0.038803517818450935]},
    {name: "WP14", id: 14, neighbours: {"Lockers": 1, "WP3": 1}, coords: [51.4379193693199, 0.03856781870126725]},
    {name: "WP15", id: 15, neighbours: {"WP3": 1}, coords: [51.437904321427126, 0.038344189524650574]},

]

const firstFloorDoors = [
    {name: "Chapel - WP1/WP4", coords: [51.43779856804096, 0.03956224769353867], neighbours: {"WP4": 1,"WP1": 1, "Chapel": 1}},
    {name: "School Gate - WP1", coords: [51.43736677400648, 0.040213018655776984], neighbours: {"WP1": 1, "School Gate": 1}},
    {name: "Reception - WP2", coords: [51.43787756960555, 0.038814246654510505], neighbours: {"WP2": 1, "Reception": 1}},
    {name: "Foxbury Building - WP5", coords: [51.43841761896935, 0.03781110048294068], neighbours: { "WP5": 1, "Foxbury Building": 1}},
    {name: "WP3 - WP15", coords: [51.43790808340079, 0.03841795027256013], neighbours: {"WP3": 1, "WP15": 1}},
    {name: "WP3 - WP14", coords: [51.43791435335617, 0.03849104046821595], neighbours: {"WP3": 1, "WP14": 1}},
    {name: "Turberville Atrium - WP6", coords: [51.43819232051412, 0.03830730915069581], neighbours:{"Turberville Atrium": 1, "WP6": 1}},
    {name: "Turberville Atrium - Formica Seminar Room", coords: [51.43821113026069, 0.038211084902286536], neighbours:{"Formica Seminar Room": 1, "Turberville Atrium": 1}},
    {name: "Formica Seminar Room - 6F Common Room", coords: [51.438246241766905, 0.03817152231931687], neighbours:{"Formica Seminar Room": 1, "6F Common Room": 1}},
    {name: "Turberville Atrium - 6F Common Room", coords: [51.438204442351676, 0.03816012293100358], neighbours:{"6F Common Room": 1, "Turberville Atrium": 1}},
    {name: "6F Office - 6F Common Room", coords: [51.438296401014654, 0.038105472922325134], neighbours:{"6F Office": 1, "6F Common Room": 1}},
    {name: "6F Office - Side Staircases", coords: [51.43831959964812, 0.03810781985521317], neighbours:{"6F Office": 1, "Side Staircases": 1}},
    {name: "Side Staircases - Maths Atrium", coords: [51.43833172145191, 0.03814000636339188], neighbours:{"Side Staircases": 1, "Maths Atrium": 1}},
    {name: "Maths Atrium - WP6/WP9", coords: [51.438356383042795, 0.038257688283920295], neighbours:{"Maths Atrium": 1, "WP6": 1, "WP9": 1}},
    {name: "Maths Atrium - Maths Office", coords: [51.438359308993384, 0.03812927752733231], neighbours:{"Maths Atrium": 1, "Maths Office": 1}},
    {name: "Room T2 - Maths Atrium", coords: [51.43840821413954, 0.0381215661764145], neighbours:{"Room T2": 1, "Maths Atrium": 1}},
    {name: "Room T3 - Maths Atrium", coords: [51.43840633317337, 0.03816246986389161], neighbours: {"Room T3": 1, "Maths Atrium": 1}},
    {name: "Room T4 - Maths Atrium", coords: [51.438375192721814, 0.038248971104621894], neighbours: {"Room T4": 1, "Maths Atrium": 1}},
    {name: "Room T1 - Maths Atrium", coords: [51.438327750516535, 0.03816548734903336], neighbours: {"Room T1": 1, "Maths Atrium": 1}},
    {name: "Library Atrium - WP7", coords: [51.4381601349298, 0.03882229328155518], neighbours: {"Library Atrium": 1, "WP7": 1}},
    {name: "Library Atrium - WP12", coords: [51.43813547323293, 0.038841739296913154], neighbours:{"WP12": 1, "Library Atrium": 1}},
    {name: "Library Atrium - WP13", coords: [51.438106631570605, 0.03880485892295838], neighbours:{"WP13": 1, "Library Atrium": 1}},
    {name: "Library Atrium - WP8", coords: [51.43817455574635, 0.0388387218117714], neighbours:{"Library Atrium": 1, "WP8": 1}},
    {name: "KGH - WP8", coords: [51.438189812547314, 0.03885347396135331], neighbours: {"KGH": 1, "WP8": 1}},
    {name: "Library Atrium - Mervyn Peake Library", coords: [51.4381239783697, 0.038901753723621375], neighbours: {"Mervyn Peake Library": 1, "Library Atrium": 1}},
    {name: "Central Hall - Old Library", coords: [51.43800422262237, 0.03884073346853256], neighbours: {"Old Library": 1, "Central Hall": 1}},
    {name: "Old Library - Mervyn Peake Library", coords: [51.43808594080161, 0.03892321139574051], neighbours:{"Old Library": 1, "Mervyn Peake Library": 1}},
    {name: "Central Hall - Lockers", coords: [51.4379536450571, 0.03871232271194459], neighbours: {"Lockers": 1, "Central Hall": 1}},
    {name: "Lockers - WP14", coords: [51.437942777143206, 0.03868885338306428], neighbours: {"Lockers": 1, "WP14": 1}},
    {name: "Central Hall - Reception", coords: [51.43794528512357, 0.03879010677337647], neighbours: {"Reception": 1, "Central Hall": 1}},
    {name: "Room 1 - Central Hall", coords: [51.43798290481243, 0.03870159387588502], neighbours: {"Central Hall": 1, "Room 1": 1}},
    {name: "Room 2 - Central Hall", coords: [51.43800422262237, 0.03871098160743714], neighbours: {"Central Hall": 1, "Room 2": 1}},
    {name: "Central Hall - WP13", coords: [51.43802198745637, 0.03881894052028657], neighbours: {"Central Hall": 1, "WP13": 1}},
    {name: "Politics Atrium - Room 17", coords: [51.43840925912076, 0.03848668187856675], neighbours: {"Politics Atrium": 1, "Room 17": 1}},
    {name: "Politics Atrium - Room 18", coords: [51.4384146930225, 0.03853630274534226], neighbours: {"Politics Atrium": 1, "Room 18": 1}},
    {name: "Toilets in between Room T2 and T3 - Room T2", coords: [51.43840821413954, 0.0381215661764145], neighbours: {"Toilets in between Room T2 and T3": 1, "Room T2": 1}},
    {name: "Toilets in between Room T2 and T3 - Room T3", coords: [51.43840633317337, 0.03816246986389161], neighbours: {"Toilets in between Room T2 and T3": 1, "Room T3": 1}},  
    {name: "Turberville Atrium - Admissions Office", coords: [51.43813651822038, 0.03813128918409348], neighbours: {"Turberville Atrium": 1, "Admissions Office": 1}},  

]

function initialiseMap() {  // create map with initial settings
    const map = L.map("map", {
        center: [51.437919, 0.039032],
        zoom: 18,
        maxBounds: [maxBounds],
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

function recentreMap(map, lat, lng) {
    // centre the map on the provided coordinates
    map.setView([lat, lng], 19);
}

function removeCurrentFloorplan() {
    if (currentFloorplanOverlay) {
      map.removeLayer(currentFloorplanOverlay);
      currentFloorplanOverlay = null;
    }
}
  
function loadGroundFloor(map) {
    removeCurrentFloorplan();

    const floorplanBoundsGround = [
        [51.438718, 0.037575],
        [51.437643, 0.039852]
    ];
    const floorplanOverlay = L.imageOverlay('./floorplan-ground_floor.svg', floorplanBoundsGround);

    floorplanOverlay.addTo(map);
    currentFloorplanOverlay = floorplanOverlay;

    const updateTransform = () => {
        const element = floorplanOverlay.getElement();
        if (element) {
            element.style.transform = '';
            element.style.transformOrigin = 'center';

            const topLeft = map.latLngToLayerPoint(floorplanBoundsGround[0]);
            const bottomRight = map.latLngToLayerPoint(floorplanBoundsGround[1]);

            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            const centerX = (topLeft.x + bottomRight.x) / 2;
            const centerY = (topLeft.y + bottomRight.y) / 2;
            element.style.transform = `translate(${centerX - width / 2}px, ${centerY - height / 2}px) rotate(-13deg)`;
        }
    };

    updateTransform();

    map.on('zoomend', () => {
        floorplanOverlay.setBounds(floorplanBoundsGround);
        updateTransform();
    });

    map.on('moveend', updateTransform);
}

function loadFirstFloor(map) {
    removeCurrentFloorplan();

    const floorplanBoundsFirst = [
        [51.438810, 0.037798],
        [51.437616, 0.039514]
    ];
    const floorplanOverlay = L.imageOverlay('./floorplan-first_floor.svg', floorplanBoundsFirst);

    floorplanOverlay.addTo(map);
    currentFloorplanOverlay = floorplanOverlay;

    const updateTransform = () => {
        const element = floorplanOverlay.getElement();
        if (element) {
            element.style.transform = '';
            element.style.transformOrigin = 'center';
            element.style.opacity = '0.4';

            const topLeft = map.latLngToLayerPoint(floorplanBoundsFirst[0]);
            const bottomRight = map.latLngToLayerPoint(floorplanBoundsFirst[1]);

            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            const centerX = (topLeft.x + bottomRight.x) / 2;
            const centerY = (topLeft.y + bottomRight.y) / 2;
            element.style.transform = `translate(${centerX - width / 2}px, ${centerY - height / 2}px) rotate(-13deg)`;
        }
    };

    updateTransform();

    map.on('zoomend', () => {
        floorplanOverlay.setBounds(floorplanBoundsFirst);
        updateTransform();
    });

    map.on('moveend', updateTransform);
}

function loadSecondFloor(map) {
    removeCurrentFloorplan();

    const floorplanBoundsSecond = [
        [51.438718, 0.037575],
        [51.437643, 0.039852]
    ];
    const floorplanOverlay = L.imageOverlay('./floorplan-second_floor.svg', floorplanBoundsSecond);

    floorplanOverlay.addTo(map);
    currentFloorplanOverlay = floorplanOverlay;

    const updateTransform = () => {
        const element = floorplanOverlay.getElement();
        if (element) {
            element.style.transform = '';
            element.style.transformOrigin = 'center';

            const topLeft = map.latLngToLayerPoint(floorplanBoundsSecond[0]);
            const bottomRight = map.latLngToLayerPoint(floorplanBoundsSecond[1]);

            const width = bottomRight.x - topLeft.x;
            const height = bottomRight.y - topLeft.y;

            const centerX = (topLeft.x + bottomRight.x) / 2;
            const centerY = (topLeft.y + bottomRight.y) / 2;
            element.style.transform = `translate(${centerX - width / 2}px, ${centerY - height / 2}px) rotate(-13deg)`;
        }
    };

    updateTransform();

    map.on('zoomend', () => {
        floorplanOverlay.setBounds(floorplanBoundsSecond);
        updateTransform();
    });

    map.on('moveend', updateTransform);
}

function loadWebsite() {
    map = initialiseMap();
    loadGroundFloor(map);
    map.on('contextmenu', function (event) {
        const { lat, lng } = event.latlng;

        console.log(`Coordinates:\n${lat}, ${lng}`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadWebsite();
    // const button = document.getElementById("scan-btn");
    // button.addEventListener("click", showUserLocation); // add event listener to the scan button

    const groundFloorBtn = document.getElementById('ground-floor-btn');
    const firstFloorBtn = document.getElementById('first-floor-btn');
    const secondFloorBtn = document.getElementById('second-floor-btn');
  
    groundFloorBtn.addEventListener('click', () => loadGroundFloor(map));
    firstFloorBtn.addEventListener('click', () => loadFirstFloor(map));
    secondFloorBtn.addEventListener('click', () => loadSecondFloor(map));

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
        
    let recentSearchesData = []; // initially empty
    
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
                showUserLocation(); // Run Bluetooth scan when location is pressed
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

        const matchingLocations = firstFloorLocations
    .filter((loc) =>
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
                recentreMap(map, loc.coords[0], loc.coords[1]);
                if (startingMarker) {
                    map.removeLayer(startingMarker);
                }
                startingMarker = L.marker([loc.coords[0], loc.coords[1]]).addTo(map);
    
                // trigger the bottom sheet
                showLocationInfo(loc.name, loc.description);
    
                // ensure bottom sheet is visible
                locationInfo.classList.add("open");
            });            
            suggestionItem.addEventListener("mouseenter", () => {
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
                recentSearches.style.display = "block"; // show recent searches when input is blank
            }
        } else {
            showSuggestions(inputValue); // show suggestions
            recentSearches.style.display = "none"; // hide recent searches while typing
        }
    });
        
    searchInput.addEventListener("click", () => {
        searchInput.removeAttribute("readonly");
        searchBarContainer.classList.add("expanded");
        searchInput.placeholder = "Enter location...";
        if (searchInput.value.trim() === "" && recentSearchesData.length > 0) {
        recentSearches.style.display = "block"; // show recent searches if input is blank
        }
    });
    
    searchInput.addEventListener("blur", () => {
        setTimeout(() => {
            // hide recent searches and suggestions when losing focus
            recentSearches.style.display = "none";
            suggestionsList.style.display = "none";
            searchInput.setAttribute("readonly", true);
            searchInput.placeholder = "Search for a location...";
            searchBarContainer.classList.remove("expanded");
        }, 200); 
        });
                
    function closeSearchBar() {
        searchInput.setAttribute("readonly", true);
        searchInput.placeholder = "Search for a location...";
        searchBarContainer.classList.remove("expanded");
        suggestionsList.style.display = "none";
        // only show recent searches if there are entries
        if (recentSearchesData.length > 0) {
        recentSearches.style.display = "block";
        }
    }

    const locationInfo = document.getElementById("location-info");
    let isDragging = false;
    let startY = 0;
    let startHeight = 0;

    locationInfo.addEventListener("click", (e) => {
        if (!e.target.closest("#directions-btn")) {
            locationInfo.classList.toggle("expanded"); // toggle expanded state
        }
    });

    locationInfo.addEventListener("touchstart", (e) => {
        console.log("touchstart", e.touches[0].clientY); // debugging

        if (!e.target.closest("#location-info")) return;


        isDragging = true;
        startY = e.touches[0].clientY; // capture the initial touch position
        startHeight = locationInfo.offsetHeight; // current height of the bottom sheet
        locationInfo.classList.add("dragging"); 
        document.body.style.touchAction = "none"; 
    });

    document.addEventListener("touchmove", (e) => {
        console.log("touchmove", e.touches[0].clientY);

        if (!isDragging) return;

        const touchY = e.touches[0].clientY; // current touch position
        const dy = startY - touchY; // difference between initial and current touch position
        const newHeight = Math.min(Math.max(startHeight + dy, 150), window.innerHeight); // clamp height
        locationInfo.style.height = `${newHeight}px`; // update height dynamically
    });

    document.addEventListener("touchend", () => {
        console.log("touchend");

        if (isDragging) {
            isDragging = false;
            locationInfo.classList.remove("dragging"); 
            document.body.style.touchAction = ""; // re-enable scrolling

            // determine whether to expand or collapse based on height
            const midPoint = window.innerHeight / 2;
            if (locationInfo.offsetHeight > midPoint) {
                locationInfo.classList.add("expanded");
            } else {
                locationInfo.classList.remove("expanded");
            }
            locationInfo.style.height = ""; 
        }
    });

    function showLocationInfo(locationName, description) {
        console.log("Updating bottom sheet content and adding 'open' class");

        const locationInfo = document.getElementById("location-info");
        const locationNameElement = document.getElementById("location-name");
        const locationDescriptionElement = document.getElementById("location-description");
        const locationImageElement = document.getElementById("location-image");
    
        // update the content
        locationNameElement.textContent = locationName;
        locationDescriptionElement.textContent = description;
    
        // show the bottom sheet
        locationInfo.classList.add("open");
        console.log("Classes on location-info:", locationInfo.classList); // check if 'open' is added
    }
    
    // closes the bottom sheet when clicking outside
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

        if (!document.getElementById("start-location-bar")) {   // create start location search bar          
            const startLocationBar = document.createElement("div");
            startLocationBar.id = "start-location-bar";
            startLocationBar.className = "search-bar"; 
            startLocationBar.innerHTML = `
                <input type="text" id="start-location-input" placeholder="Enter starting location..." />
            `;
            searchBarContainer.prepend(startLocationBar);

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
            startSuggestionsList.style.top = "95%"; 
            startSuggestionsList.style.left = "12%";

            startLocationBar.appendChild(startSuggestionsList);

            const startLocationInput = document.getElementById("start-location-input");

            function showStartSuggestions(input) {
                startSuggestionsList.innerHTML = ""; // clear previous suggestions
            
                // adding "Your Location" as the first suggestion
                const yourLocationItem = document.createElement("div");
                yourLocationItem.textContent = "Your Location";
                yourLocationItem.style.padding = "10px";
                yourLocationItem.style.cursor = "pointer";
                yourLocationItem.style.borderBottom = "1px solid #ddd";
                yourLocationItem.addEventListener("click", () => {
                    startLocationInput.value = "Your Location";
                    startSuggestionsList.style.display = "none"; // hide suggestions
                    showUserLocation();
                    console.log("Your Location selected");
                });
                yourLocationItem.addEventListener("mouseenter", () => {
                    yourLocationItem.style.background = "#f9f9f9";
                });
                yourLocationItem.addEventListener("mouseleave", () => {
                    yourLocationItem.style.background = "#fff";
                });
                startSuggestionsList.appendChild(yourLocationItem);
            
                // adds matching firstFloorLocation below "Your Location"
                if (input) {
                    const matchingLocations = firstFloorLocations
                .filter((loc) =>
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
                            recentreMap(map, loc.coords[0], loc.coords[1]);
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
                startSuggestionsList.style.display = "block"; // shows suggestions
            }
            
            startLocationInput.addEventListener("click", () => {
                showStartSuggestions(""); // passes an empty string to show only "Your Location"
            });
            
            startLocationInput.addEventListener("input", (e) => {
                const inputValue = e.target.value.trim();
                showStartSuggestions(inputValue); // shows "Your Location" and matching suggestions
            });
        
            startLocationInput.addEventListener("blur", () => {
                setTimeout(() => {
                    startSuggestionsList.style.display = "none"; // hides suggestions when input loses focus
                }, 200); // timeout to allow click events to register
            });

            // adjusts search bar container styles
            searchBarContainer.style.padding = "10px";
            searchBarContainer.style.backgroundColor = "white";
            searchBarContainer.style.borderRadius = "12px";
            searchBarContainer.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
            searchBarContainer.style.top = "0px";
            searchBarContainer.style.flexDirection = "column";
            searchBarContainer.style.width = "100%"
            searchBarContainer.style.height = "19%";

            const searchBars = document.querySelectorAll(".search-bar");
            searchBars.forEach((bar) => {
                bar.style.width = "60%"; 
            });
            
            const backBtn = document.createElement("div");
            backBtn.id = "back-btn";
            searchBarContainer.parentElement.appendChild(backBtn);

                
            backBtn.addEventListener("click", () => {
                // removes the starting location bar
                if (startLocationBar) startLocationBar.remove();
                backBtn.remove();
    
                // restores original styles
                searchBarContainer.style.top = originalStyles.top;
                searchBarContainer.style.backgroundColor = originalStyles.backgroundColor;
                searchBarContainer.style.padding = originalStyles.padding;
                searchBarContainer.style.borderRadius = originalStyles.borderRadius;
                searchBarContainer.style.boxShadow = originalStyles.boxShadow;
                searchBarContainer.style.height = originalStyles.height;
                searchBarContainer.style.width = originalStyles.width;
            });

            e.stopPropagation(); // prevents event from propagating to the bottom sheet click handler
            locationInfo.classList.remove("open");

        }
    });
    
    const startLocation = "6F Office";
    const endLocation = "Central Hall";
    
    const graph = buildGraph(firstFloorLocations, firstFloorDoors, firstFloorWalkablePaths);
    const shortestPath = bfs(graph, startLocation, endLocation);
    

    function buildGraph(locations, doors, paths) {
        const graph = {};
    
        locations.forEach(location => {
            graph[location.name] = Object.keys(location.neighbours);
        });
    
        doors.forEach(door => {
            graph[door.name] = Object.keys(door.neighbours);
        });
    
        paths.forEach(path => {
            graph[path.name] = Object.keys(path.neighbours);
        });
    
        return graph;
    }
    
    function bfs(graph, start, goal) {
        const queue = [[start]]; // start with the path containing only the start node
        const visited = new Set(); // tracks visited nodes
    
        while (queue.length > 0) {
            const path = queue.shift(); // retrieves the first path in the queue
            const node = path[path.length - 1]; // retrieves the last node in the path
    
            if (node === goal) {
                return path; // returns the path if we reached the goal
            }
    
            if (!visited.has(node)) {
                visited.add(node); // mark the node as visited
    
                const neighbors = graph[node] || [];
                for (const neighbor of neighbors) {
                    if (!visited.has(neighbor)) {
                        queue.push([...path, neighbor]); // add new path with neighbor to the queue
                    }
                }
            }
        }
    
        return null; // return null if no path is found
    }
    
    function displayPath(map, path, locations, doors, paths) {
        const allNodes = [...locations, ...doors, ...paths];
        const latLngs = path.map(name => {
            const node = allNodes.find(node => node.name === name);
            return node ? node.coords : null;
        }).filter(coords => coords); // remove any null values
    
        L.polyline(latLngs, { color: 'blue' }).addTo(map); // add path to map
    }
    
    if (shortestPath) { // verify there is a path
        console.log("Shortest Path:", shortestPath);
        displayPath(map, shortestPath, firstFloorLocations, firstFloorDoors, firstFloorWalkablePaths);
    } else {
        console.log("No path found.");
    }
    
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

async function showUserLocation() { // handler is run when scan bluetooth devices button is pressed
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

            const nearestLocation = firstFloorLocations
        .find(loc => loc.name === nearestBeacon.slice(11)); //extracts the location by getting rid of nea_beacon
            recentreMap(map, nearestLocation.coords[0], nearestLocation.coords[1]);
            if (destinationMarker) {
                map.removeLayer(destinationMarker);
            }
            destinationMarker = L.marker([nearestLocation.coords[0], nearestLocation.coords[1]]).addTo(map);


        }, 1000); // stop scanning after x milliseconds
    } catch (error) {
        console.error("Error scanning Bluetooth devices:", error);
    }
}

function showGPSLocation1() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // adds a marker to the map at the user's location
            const userMarker = L.marker([latitude, longitude]).addTo(map);
        },
        (error) => {
            // Handle errors
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("User denied the request for Geolocation.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location information is unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("The request to get user location timed out.");
                    break;
                default:
                    alert("An unknown error occurred.");
                    break;
            }
        }
    );
}

function showGPSLocation2() {
    navigator.geolocation.watchPosition(success, error);

    let success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracyOfPosition = position.coords.accuracy;

        if (currentGPSLocation) {
            map.removeLayer(currentGPSLocation);
            map.removeLayer(accuracyRadius)
        }

        let currentGPSLocation = L.marker([latitude, longitude]);
        currentGPSLocation.addTo(map);
        let accuracyRadius = L.circle([latitude, longitude], {
            radius: accuracyOfPosition,
        })
        accuracyRadius.addTo(map);
    }

    let error = (err) => {
        if (err.code === 1) {
            console.log("Geolocation access was denied.");
        } else {"Cannot retrieve current location."}
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
