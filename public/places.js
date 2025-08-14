console.log("places.js loaded successfully!");

// Global variables
let markers = [];
let map;

// Test function
const testButton = () => {
    console.log("Test button clicked!");
    alert("JavaScript is working!");
};

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
        const response = await axios.put('/places', { label: label, address: address });
        console.log("API response:", response);
        
        // Clear form
        document.querySelector("#label").value = '';
        document.querySelector("#address").value = '';
        
        await loadPlaces();
    } catch (error) {
        console.error('Error adding place:', error);
        alert('Error adding place: ' + error.message);
    }
};

doctype html 
html
    head 
        title Places 
        meta(name="viewport", content="width=device-width,initial-scale=1")
        script(src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js")
        link(href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css", rel="stylesheet", integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC",crossorigin="anonymous")
        // Leaflet CSS
        link(rel="stylesheet", href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css")
        style.
            #map-container { 
                position: relative; 
                height: 700px; 
                margin-bottom: 5rem; 
            } 
            #map { 
                position: absolute; 
                top: 0; 
                bottom: 0; 
                width: 100%; 
            }
            tr { 
                cursor: pointer; 
            }
    body 
        .container 
            h1.mt-3 Places 

            .row
                .col-md-6
                    form.form
                        .mb-3 
                            label(for="label") Label 
                            input#label.form-control(type='text')
                        .mb-3 
                            label(for="address") Address 
                            input#address.form-control(type='text')
                        button.btn.btn-primary(type='button', onclick='addPlace()') Add Place

                    table.table.table-hover
                        thead   
                            tr  
                                th Label 
                                th Address 
                                th 
                        tbody
                
                .col-md-6
                    #map-container
                        #map

        script(src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js", integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM", crossorigin="anonymous")
        // Leaflet JS - must come before places.js
        script(src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js")
        script(src="/places.js")
        script. 
            loadPlaces()
