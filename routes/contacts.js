const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

const logged_in = (req,res,next) => {
    if(req.session.user)
        next();
    else
        res.status(401).send("Not authorized");
}
router.get('/',async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.render('start', {contacts:contacts, user: req.session.user});
});

router.put('/create', async (req, res) => {
    const address = req.body.street + " " + req.body.city + " " + req.body.state + " " + req.body.zipcode+" "+req.body.country;
    const result = await geocoder.geocode(address);

    if(result.length===1)
    {
        const info = {
            title: req.body.title,
            first: req.body.first,
            last: req.body.last,
            phone: req.body.phone,
            email: req.body.email,
            street: result[0].streetNumber + " " + result[0].streetName,
            city: result[0].city,
            state: result[0].state,
            zipcode: result[0].zipcode,
            country: result[0].country,
            contact_by_phone: req.body.contactPhone,
            contact_by_email: req.body.contactEmail,
            contact_by_mail: req.body.contactMail,
            lat: result[0].latitude,
            lng: result[0].longitude};
        await req.db.createContact(info);
        res.json({});
    }
    else if(result.length===0)
    {
        res.json({
            error:'No address was found'
        });
    }
    else
    {
        res.json({
            error:'Address was not specific enough'
        });
    }

});

router.get('/contacts', async (req, res) => {
    const contacts = await req.db.getAllContacts();
    res.json({ contacts: contacts });
});

router.get('/contacts/:id/delete',logged_in, async (req, res) => {
    const contact = await req.db.getContact(parseInt(req.params.id));
    res.render('delete',{contact:contact[0], user: req.session.user});
});

router.post('/contacts/:id/delete',logged_in, async (req, res) => {
   await req.db.deleteContact(req.params.id);
    res.redirect('/');
});

router.get('/contacts/:id/edit',logged_in, async (req, res) => {
    const contact = await req.db.getContact(parseInt(req.params.id));
    res.render('edit',{contact:contact[0], user: req.session.user});
});

router.post('/contacts/:id/edit',logged_in, async (req, res) => {
    const address = req.body.street + " " + req.body.city + " " + req.body.state + " " + req.body.zipcode+" "+req.body.country;
    const result = await geocoder.geocode(address);

    if(result.length===1)
    {
        const info = {
            title: req.body.title,
            first: req.body.first,
            last: req.body.last,
            phone: req.body.phone,
            email: req.body.email,
            street: result[0].streetNumber + " " + result[0].streetName,
            city: result[0].city,
            state: result[0].state,
            zipcode: result[0].zipcode,
            country: result[0].country,
            contact_by_phone: req.body.contact_by_phone,
            contact_by_email: req.body.contact_by_email,
            contact_by_mail: req.body.contact_by_mail,
            lat: result[0].latitude,
            lng: result[0].longitude};
        await req.db.updateContact(info,req.params.id);
        res.redirect('/')
    }
    else
    {
        const contact = await req.db.getContact(parseInt(req.params.id));
        let message = "Address was not specific enough";
        if(result.length===0)
            message = "No address was found";
        res.render('edit',{contact:contact[0], message:message, user: req.session.user});
    }
});

module.exports = router;