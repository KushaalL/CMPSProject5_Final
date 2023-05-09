const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

const logged_in = (req,res,next) => {
    if(req.secret.user)
        next();
    else
        res.status(401).send("Not authorized");
}
router.get('/',async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.render('start', {contacts:contacts, user: req.session.user});
});


router.put('/create', async (req, res) => {
    const result = await geocoder.geocode(req.body.address);
    console.log(result.length)
    if(result.length===1)
    {
        console.log(req.body.fName);
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
    else if(result.length===0)
    {
        res.json({
            error:'No address was found'
        })
    }
    else
    {
        res.json({
            error:'Address was not specific enough'
        })
    }

});

router.get('/contacts', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.json({ contacts: contacts });
});

router.delete('/contacts/:id', async (req, res) => {
    await req.db.deleteContact(req.params.id);
    res.status(200).send();
});

router.get('/contacts/:id/edit',logged_in, async (req, res) => {
    const id = req.params.id;
    const contact = await req.db.getContact(parseInt(id));
    res.render('edit',{contact:contact[0], user: req.session.user});
});

router.post('/contacts/:id/edit',logged_in, async (req, res) => {
    console.log("edit contact");
    await req.db.updateContact(req.body,req.params.id);
    res.redirect('/');
});

module.exports = router;