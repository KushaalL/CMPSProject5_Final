const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

router.get('/',async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.render('start', {contacts:contacts});
});


router.put('/create', async (req, res) => {
    const result = await geocoder.geocode(req.body.address);
    if(result.length>0)
    {
        const info = {
            first: req.body.fName,
            last: req.body.lName,
            phone: req.body.phone,
            email: req.body.email,
            address: result[0].formattedAddress,
            contact_by_phone: req.body.contactPhone,
            contact_by_email: req.body.contactEmail,
            contact_by_mail: req.body.contactMail,
            lat: result[0].latitude,
            lng: result[0].longitude};
        const id = await req.db.createContact(info);

        res.json({
            id: id,
            lat: result[0].latitude,
            lng: result[0].longitude,
            formalAddress: result[0].formattedAddress,
        });
    }
    else
    {
        res.json({
            error:'No address was found'
        })
    }
});

router.get('/contacts', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.json({ contacts: contacts });
});

module.exports = router;