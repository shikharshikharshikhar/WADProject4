const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const places = await req.db.findPlaces();
    res.json({ places: places });
});

router.put('/', async (req, res) => {
    try {
        const { label, address } = req.body;
        const id = await req.db.createPlace(label, address, 0, 0); // lat=0, lng=0 for now
        res.json({ 
            id: id, 
            label: label, 
            address: address, 
            lat: 0, 
            lng: 0 
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
