// Geolocation Feature
document.getElementById("getLocation").addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Show latitude and longitude
            document.getElementById("locationOutput").innerText =
                `Latitude: ${latitude}, Longitude: ${longitude}`;

            // Initialize the map with the retrieved coordinates
            initMap(latitude, longitude);
        },
        (error) => {
            alert("Unable to retrieve location.");
            console.error(error);
        }
    );
});

// Function to initialize the map with Leaflet
function initMap(latitude, longitude) {
    // Create the map, centered on the user's coordinates
    const map = L.map('map').setView([latitude, longitude], 14);

    // Set OpenStreetMap as the base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the user's location
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup("You are here!")
        .openPopup();
}


// Puzzle Logic
let selectedBlock = null;

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropZone = event.target;

    if (dropZone.classList.contains("draggable")) {
        swapBlocks(draggedElement, dropZone); // Swap blocks
    } else if (dropZone.classList.contains("drop-zone") && !dropZone.hasChildNodes()) {
        dropZone.appendChild(draggedElement); // Move normally if the zone is empty
    }
}

// Swap two blocks in the puzzle
function swapBlocks(block1, block2) {
    const parent1 = block1.parentNode;
    const parent2 = block2.parentNode;

    parent1.appendChild(block2);
    parent2.appendChild(block1);
}

// Handle block selection for swapping
function selectBlock(block) {
    if (selectedBlock === block) {
        block.classList.remove("selected"); // Deselect if clicked again
        selectedBlock = null;
        return;
    }

    if (selectedBlock) {
        selectedBlock.classList.remove("selected"); // Remove previous selection
    }

    block.classList.add("selected"); // Highlight the new selection
    selectedBlock = block;
}

// Check if the puzzle is solved correctly
function checkPuzzle() {
    const correctOrder = ["block1", "block2", "block3", "block4"];
    const userOrder = Array.from(document.querySelectorAll(".drop-zone")).map(zone =>
        zone.firstChild ? zone.firstChild.id : null
    );

    document.getElementById("puzzleResult").innerText =
        JSON.stringify(correctOrder) === JSON.stringify(userOrder)
            ? "🎉 Correct! You solved the puzzle!"
            : "❌ Try again!";
}
