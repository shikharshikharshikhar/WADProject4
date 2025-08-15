console.log("places.js with map functionality loaded!");

// Global variables
let markers = [];
let map;

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
});

const initializeMap = () => {
    console.log("Initializing map...");
    try {
        // Initialize map centered near Ramapo College (you can change coordinates)
        map = L.map('map').setView([41, -74], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        console.log("Map initialized successfully!");
    } catch (error) {
        console.error("Error initializing map:", error);
    }
};

const addPlace = async () => {
    console.log("addPlace called!");
    
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    
    if (!label || !address) {
        alert('Please fill in both label and address');
        return;
    }
    
    try {
        console.log(`Adding place: ${label} at ${address}`);
        const response = await axios.put('/places', { 
            label: label, 
            address: address 
        });
        
        console.log("Server response:", response.data);
        alert('Place added successfully!');
        
        // Clear form
        document.querySelector("#label").value = '';
        document.querySelector("#address").value = '';
        
        // Reload the places to show the new one
        await loadPlaces();
        
    } catch (error) {
        console.error('Error adding place:', error);
        alert('Error adding place: ' + error.message);
    }
};

const clearMarkers = () => {
    // Remove all existing markers from map
    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];
};

const addMarker = (place) => {
    // Only add marker if we have valid coordinates
    if (place.lat && place.lng && place.lat !== 0 && place.lng !== 0) {
        const marker = L.marker([place.lat, place.lng])
            .addTo(map)
            .bindPopup(`<b>${place.label}</b><br/>${place.address}`);
        
        markers.push(marker);
        console.log(`Added marker for ${place.label} at ${place.lat}, ${place.lng}`);
    } else {
        console.log(`No valid coordinates for ${place.label}, skipping marker`);
    }
};

const on_row_click = (e) => {
    let row = e.target;
    
    // If clicked element is a TD, get the parent TR
    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
    }
    
    const lat = parseFloat(row.dataset.lat);
    const lng = parseFloat(row.dataset.lng);
    
    console.log(`Row clicked: lat=${lat}, lng=${lng}`);
    
    // Only fly to location if we have valid coordinates
    if (lat && lng && lat !== 0 && lng !== 0) {
        map.flyTo(new L.LatLng(lat, lng), 15);
        console.log(`Flying to ${lat}, ${lng}`);
    } else {
        alert('No coordinates available for this place');
    }
};

const loadPlaces = async () => {
    try {
        console.log("Loading places...");
        const response = await axios.get('/places');
        const tbody = document.querySelector('tbody');
        
        // Clear existing table rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Clear existing markers
        clearMarkers();

        if (response && response.data && response.data.places) {
            console.log(`Loaded ${response.data.places.length} places`);
            
            for (const place of response.data.places) {
                console.log("Processing place:", place);
                
                // Create table row
                const tr = document.createElement('tr');
                
                // Add data attributes for lat/lng
                tr.dataset.lat = place.lat || 0;
                tr.dataset.lng = place.lng || 0;
                
                // Add click handler
                tr.onclick = on_row_click;
                
                tr.innerHTML = `
                    <td>${place.label}</td>
                    <td>${place.address}</td>
                    <td>
                        <button class='btn btn-danger btn-sm' type='button' onclick='event.stopPropagation(); deletePlace(${place.id})'>Delete</button>
                    </td>
                `;
                
                tbody.appendChild(tr);
                
                // Add marker to map
                addMarker(place);
            }
        } else {
            console.log("No places found");
        }
    } catch (error) {
        console.error('Error loading places:', error);
        alert('Error loading places. Please refresh the page.');
    }
};

const deletePlace = async (id) => {
    if (confirm('Are you sure you want to delete this place?')) {
        try {
            console.log(`Deleting place ${id}`);
            await axios.delete(`/places/${id}`);
            alert('Place deleted successfully!');
            await loadPlaces();
        } catch (error) {
            console.error('Error deleting place:', error);
            alert('Error deleting place');
        }
    }
};
