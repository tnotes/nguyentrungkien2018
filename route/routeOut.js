const express = require('express');
const route =  express.Router();
const path = require("path");
const {accountFIND_manager,accountCREATE_manager,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,statusUPDATE,chatDELETE} = require('./../db');
route.get('/demo',(req,res)=>{
    res.sendFile(path.join(__dirname + '/../page/account.html'));

})
route.get('/', async function(req, res){


   if(req.cookies.username !== undefined && req.cookies.password !== undefined){
       let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

       if(check.length > 0){
           res.sendFile(path.join(__dirname + '/../page/chat.html'));
       }else {
           res.sendFile(path.join(__dirname + '/../page/index.html'));

       }

   }else {
       res.sendFile(path.join(__dirname + '/../page/index.html'));

   }

});
route.get('/logout',async (req,res)=>{
    res.clearCookie("password").clearCookie("username").redirect('/')
});
route.get('/changePassword',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
            res.sendFile(path.join(__dirname + '/../page/changepassword.html'));
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.get('/mutiplesms',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
            res.sendFile(path.join(__dirname + '/../page/mutiplesms.html'));

        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.post('/login',async (req,res)=>{

    let check = await accountCHECK_manager(req.body.username,req.body.password);
    if(check.length >0){
        res.cookie("username",req.body.username).cookie("password",req.body.password).redirect('/')
    }else{
        res.redirect('/')
    }

});
route.get('/addAcc',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
            res.sendFile(path.join(__dirname + '/../page/addAcc.html'));
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.get('/account',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
            res.sendFile(path.join(__dirname + '/../page/addPass.html'));
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.get('/addCookie',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
            res.sendFile(path.join(__dirname + '/../page/addCookie.html'));
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname + '/../page/register.html'));
});
route.post('/register',async (req,res)=>{
    let username = req.body.username;
    let check = await accountFIND_manager(username);
    if(check.length > 0){
        res.send(false)
    }else {
        await accountCREATE_manager(req.body);
        res.cookie("username",req.body.username).cookie("password",req.body.password).redirect('/')

    }
});

module.exports = route;
