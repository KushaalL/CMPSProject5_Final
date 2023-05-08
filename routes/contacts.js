const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/',async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.render('start', {contacts:contacts});
});


router.put('/create', async (req, res) => {

});

module.exports = router;