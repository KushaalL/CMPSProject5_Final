const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/login',async (req, res) => {
    res.render('login',{hide_login:true});
});

router.post('/login',async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const user = await req.db.findUserByName(username);
    if(user&&bcrypt.compareSync(password,user.password))
    {
        req.session.user = user;
        res.redirect('/');
    }
    else
        res.render('login',{hide_login:true,message: 'Invalid login information'});
});

router.get('/signup',async (req, res) => {
    res.render('signup',{hide_login:true});
});

router.post('/signup', async (req,res)=> {
    const username = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();
    if(p1!=p2)
    {
        res.render('signup',{hide_login:true,message:'Your passwords do not match'});
        return;
    }
    const user = await req.db.findUserByName(username);
    if(user)
    {
        res.render('signup',{hide_login:true,message:'Your username is already in use'});
        return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(p1, salt);
    const id = await req.db.createUser(req.body, username, hashPass);
    req.session.user = await req.db.findUserById(id);
    res.redirect('/');
});

router.get('/logout',(req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;