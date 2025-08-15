const express = require('express');
const router = express.Router();
const geo = require('node-geocoder');

// Configure geocoder with OpenStreetMap (no API key needed)
const geocoder = geo({
    provider: 'openstreetmap',
    headers: { 'user-agent': 'Places App <your-email@example.com>' } // Replace with your email
});

router.get('/', async (req, res) => {
    try {
        const places = await req.db.findPlaces();
        res.json({ places: places });
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
});

router.put('/', async (req, res) => {
    try {
        let { label, address } = req.body;
        let lat = 0;
        let lng = 0;
        
        console.log(`Geocoding address: ${address}`);
        
        // Perform geocoding
        const result = await geocoder.geocode(address);
        
        if (result.length > 0) {
            // Use the first result
            lat = result[0].latitude;
            lng = result[0].longitude;
            // Use the properly formatted address from geocoder
            address = result[0].formattedAddress;
            console.log(`Geocoded to: ${lat}, ${lng} - ${address}`);
        } else {
            console.log('No geocoding results found, using lat=0, lng=0');
        }
        
        // Create place with geocoded data
        const id = await req.db.createPlace(label, address, lat, lng);
        
        // Return full place data
        res.json({ 
            id: id, 
            label: label, 
            address: address, 
            lat: lat, 
            lng: lng 
        });
    } catch (error) {
        console.error('Error creating place:', error);
        res.status(500).json({ error: 'Failed to create place' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await req.db.deletePlace(req.params.id);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ error: 'Failed to delete place' });
    }
});

module.exports = router;
