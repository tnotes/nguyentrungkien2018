const express = require('express');
const route =  express.Router();
const path = require("path");
const {accountFIND_manager,accountCREATE_manager,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,statusUPDATE,chatDELETE} = require('./../db');
const moment = require('moment-timezone');
const config = require('./../config');
route.get('/', async function(req, res){


   if(req.cookies.email !== undefined && req.cookies.password !== undefined){
       let check = await accountCHECK_manager(req.cookies.email,req.cookies.password);

       if(check.length === 1){
           let timeLimit = parseInt(check[0]['_doc'].limitTime);
           let timeCurrent = parseInt(moment().tz('Asia/Ho_Chi_Minh').format( "x"));
           if(timeCurrent < timeLimit){
               res.sendFile(path.join(__dirname + '/../page/chat.html'));
           }else {
               res.clearCookie("password").clearCookie("email").redirect('/combo');
           }
       }else {
           res.sendFile(path.join(__dirname + '/../page/index.html'));

       }

   }else {
       res.sendFile(path.join(__dirname + '/../page/index.html'));

   }

});

route.post('/loginAdmin',async (req,res)=>{

    if(req.body.username === config.usernameAdmin && req.body.password === config.passwordAdmin){
        res.cookie("usernameAdmin",req.body.username).cookie("passwordAdmin",req.body.password).redirect('/admin');
    }else {
        res.redirect('/admin');
    }
});
route.get('/logout',async (req,res)=>{
    res.clearCookie("password").clearCookie("email").redirect('/')
});

route.post('/register',async (req,res)=>{

    let email = req.body.email;
    let check = await accountFIND_manager(email);
    if(check.length > 0){
        res.send({status:'Email đã được đăng kí.Vui lòng chọn một email khác !'})
    }else {
        if(req.body.name === undefined || req.body.name === ''){
            return res.send({status:'Họ và Tên không được bỏ trống'})
        }
        if(req.body.email === undefined || req.body.email === ''){
            return res.send({status:'Email sau định dạng hoặc không hợp lệ'})
        }
        if(req.body.password === undefined || req.body.password === ''){
            return res.send({status:'Mật khẩu không được bỏ trống'})
        }
        if(req.body.phone === undefined || req.body.phone === ''){
            return res.send({status:'Số điện thoai không được bỏ trống'})
        }
        req.body.startTime = parseInt(moment().tz('Asia/Ho_Chi_Minh').format( "x"));
        req.body.limitTime = parseInt(moment().tz('Asia/Ho_Chi_Minh').format( "x"))+259200000;
        req.body.package = 'Trial';
        req.body.FacebookCount = 2;
        await accountCREATE_manager(req.body);
        return res.cookie("email",req.body.email).cookie("password",req.body.password).send({status:'Đăng kí thành công !'})

    }

});
route.get('/combo',async (req,res)=>{
    res.sendFile(path.join(__dirname + '/../page/combo.html'));

});
route.post('/login',async (req,res)=>{

    let check = await accountCHECK_manager(req.body.email,req.body.password);
    if(check.length >0){
        res.cookie("email",req.body.email).cookie("password",req.body.password).redirect('/')
    }else{
        res.redirect('/')
    }

});


route.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname + '/../page/register.html'));
});


module.exports = route;
