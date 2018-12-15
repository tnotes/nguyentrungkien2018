const express = require('express');
const app = express();
const routeIn = require('./route/routeIn');
const routeOut = require('./route/routeOut');
const routeAdmin = require('./route/routeAdmin');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const config = require('./config.js');
const moment = require('moment-timezone');

const {accountCHECK_manager} = require('./db');

app.use(bodyParser.urlencoded({extended:false,limit: '500mb'}));
app.use(bodyParser.json({limit: '500mb'}));
app.use(fileUpload());
app.use(cors());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/api',async function (req,res,next) {

    if(req.cookies.email !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.email,req.cookies.password);
        if(check.length === 1){

            let timeLimit = parseInt(check[0]['_doc'].limitTime);
            let timeCurrent = parseInt(moment().tz('Asia/Ho_Chi_Minh').format( "x"));
            if(timeCurrent < timeLimit){
                next();
            }else {
                res.redirect('/combo');
            }

        }else {
            res.redirect('/');

        }

    }else {
        res.redirect('/');

    }
});
app.use('/admin',async function(req,res,next){
    if(req.cookies.usernameAdmin !== undefined && req.cookies.passwordAdmin !== undefined){

        if(req.cookies.usernameAdmin === config.usernameAdmin && req.cookies.passwordAdmin === config.passwordAdmin){

                next();

        }else {
            res.clearCookie('usernameAdmin').clearCookie('passwordAdmin').sendFile(__dirname+'/page/admin.html');

        }

    }else {
        res.clearCookie('usernameAdmin').clearCookie('passwordAdmin').sendFile(__dirname+'/page/admin.html');


    }
});
app.use('/api',routeIn);
app.use('/',routeOut);
app.use('/admin',routeAdmin);

app.listen(config.port);