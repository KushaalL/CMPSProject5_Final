const express = require('express')
const router = express.Router();
const geo = require('node-geocoder');
const geocoder = geo({ provider: 'openstreetmap' });

const logged_in = (req,res,next) => {
    console.log("hioiiiiiii");
    if(req.session.user)
        next();
    else
        res.status(401).send("Not authorized");
}
router.get('/',async (req, res) => {
    console.log("loading start page");
    const contacts = await req.db.getAllContacts();
    res.render('start', {contacts:contacts, user: req.session.user});
});

router.put('/create', async (req, res) => {
    const address = req.body.street + " " + req.body.city + " " + req.body.state + " " + req.body.zipcode+" "+req.body.country;
    console.log("address:  "+address);
    const result = await geocoder.geocode(address);
    console.log("length",result.length)
    for(let i of result)
        console.log(i)

    if(result.length===1)
    {
        console.log("result:  "+result[0]);
        const info = {
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
        const id = await req.db.createContact(info);
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

// router.delete('/contacts/:id', async (req, res) => {
//     await req.db.deleteContact(req.params.id);
//     res.status(200).send();
// });

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