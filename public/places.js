console.log("places.js loaded successfully!");

const addPlace = async () => {
    console.log("addPlace function called!");
    
    const label = document.querySelector("#label").value;
    const address = document.querySelector("#address").value;
    
    console.log("Label:", label);
    console.log("Address:", address);
    
    if (!label || !address) {
        alert('Please fill in both label and address');
        return;
    }
    
    try {
        console.log("Making API call...");
        const response = await axios.put('/places', { 
            label: label, 
            address: address 
        });
        console.log("Response:", response.data);
        
        alert('Place added successfully!');
        
        // Clear form
        document.querySelector("#label").value = '';
        document.querySelector("#address").value = '';
        
    } catch (error) {
        console.error('Error adding place:', error);
        alert('Error adding place: ' + error.message);
    }
};

const loadPlaces = async () => {
    try {
        const response = await axios.get('/places');
        const tbody = document.querySelector('tbody');
        
        // Clear existing rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        if (response && response.data && response.data.places) {
            for (const place of response.data.places) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${place.label}</td>
                    <td>${place.address}</td>
                    <td>
                        <button class='btn btn-danger btn-sm' type='button' onclick='deletePlace(${place.id})'>Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            }
        }
    } catch (error) {
        console.error('Error loading places:', error);
    }
};
