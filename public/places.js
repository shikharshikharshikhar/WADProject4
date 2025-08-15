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
