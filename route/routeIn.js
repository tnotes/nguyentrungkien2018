const express = require('express');
const route =  express.Router();
const path = require('path');
const process = require('./../index');
var randomstring = require("randomstring");

const {accountFIND_manager,AlarmFIND,accountINSERT,chatFIND,AlarmINSERT,AlarmDELETE,accountCREATE_manager,changePASSWORD,statusUPDATE,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,seenUPDATE,chatDELETE} = require('./../db');
function generateRandomInteger() {
    let min = 0;
    let max=1000000000000;
    return Math.floor(min + Math.random()*(max+1 - min)).toString()
}


route.get('/cookie',async (req,res)=>{
    res.send(req.cookies)
});

route.post('/changePassword',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);

        if(check.length > 0){
           let change = await changePASSWORD(req.cookies.username,req.cookies.password,req.body.password);
           res.send(change)
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }
});
route.post('/account',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined){
        let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);
        let author = randomstring.generate()+generateRandomInteger();
        if(check.length > 0){

            if(req.body.type === 'pass') {
               let result = await accountINSERT({
                    status: 'Đang hoạt động',
                    type:'pass',
                    author:author,
                    ID_sender: req.body.username,
                    userBoss:req.cookies.username,
                    username: req.body.username,
                    password: req.body.password,
                    date: req.body.date,
                    month: req.body.month,
                    year: req.body.year
                });
                if(result.upserted !== undefined) {

                    let result = await process({
                        status: 'Đang hoạt động',
                        type: 'pass',
                        author:author,
                        ID_sender: req.body.username,
                        userBoss: req.cookies.username,
                        username: req.body.username,
                        password: req.body.password,
                        date: req.body.date,
                        month: req.body.month,
                        year: req.body.year
                    });
                    result.error = null;
                    res.send(result);
                }else {
                    res.send({
                        error:"Tài khoản Facebook này đã xuất hiện trong danh sách của bạn !",
                        ID_sender: req.body.username,
                        status: 'Đang hoạt động',
                        type:'pass',
                        userBoss: req.cookies.username,
                    })
                }



            }else if(req.body.type === 'cookie'){
                for(let i =0;i<req.body.data.length;i++) {
                    let OBJ_template = [
                        {
                            "key": "fr",
                            "value": req.body.data[i]['fr'],
                            "expires": "9030-11-20T03:12:21.000Z",
                            "maxAge": 7775999,
                            "domain": "facebook.com",
                            "path": "/",
                            "secure": true,
                            "httpOnly": true,
                            "hostOnly": false,
                            "creation": "2018-08-22T03:12:24.149Z",
                            "lastAccessed": "2018-08-22T03:12:28.968Z"
                        },
                        {
                            "key": "datr",
                            "value": req.body.data[i]['datr'],
                            "domain": "facebook.com",
                            "path": "/",
                            "hostOnly": false,
                            "creation": "2018-08-22T03:12:24.280Z",
                            "lastAccessed": "2018-08-22T03:12:28.968Z"
                        },
                        {
                            "key": "c_user",
                            "value": req.body.data[i]['c_user'],
                            "expires": "9030-11-20T03:12:21.000Z",
                            "maxAge": 7775999,
                            "domain": "facebook.com",
                            "path": "/",
                            "secure": true,
                            "hostOnly": false,
                            "creation": "2018-08-22T03:12:25.184Z",
                            "lastAccessed": "2018-08-22T03:12:28.968Z"
                        },
                        {
                            "key": "xs",
                            "value": req.body.data[i]['xs'],
                            "expires": "9018-11-20T03:12:21.000Z",
                            "maxAge": 7775999,
                            "domain": "facebook.com",
                            "path": "/",
                            "secure": true,
                            "httpOnly": true,
                            "hostOnly": false,
                            "creation": "2018-08-22T03:12:25.187Z",
                            "lastAccessed": "2018-08-22T03:12:28.968Z"
                        }];

                    let result = await accountINSERT({
                        ID_sender: req.body.data[i]['c_user'],
                        status: 'Đang hoạt động',
                        author:author,
                        type:'cookie',
                        userBoss: req.cookies.username,

                        cookie: OBJ_template
                    });

                    if(result.upserted !== undefined){

                        let account = await process({
                            ID_sender: req.body.data[i]['c_user'],
                            status: 'Đang hoạt động',
                            author:author,
                            type:'cookie',
                            userBoss: req.cookies.username,
                            cookie: OBJ_template
                        });

                        account.error = null;
                        res.send(account);

                    }else {
                        res.send({
                            error:"Tài khoản Facebook này đã xuất hiện trong danh sách của bạn !",
                            ID_sender: req.body.data[i]['c_user'],
                            status: 'Đang hoạt động',
                            type:'cookie',
                            userBoss: req.cookies.username,
                        })
                    }


                }
            }
        }else {
            res.sendFile(path.join(__dirname + '/../page/index.html'));

        }

    }else {
        res.sendFile(path.join(__dirname + '/../page/index.html'));

    }

});

route.get('/',async (req,res)=>{
    res.sendFile(__dirname+'/page/index.html');
});
route.post('/alarmData',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined) {

        let check = await accountCHECK_manager(req.cookies.username, req.cookies.password)

        if (check.length > 0) {

            let alarmDATA = await AlarmFIND(req.cookies.username)
            res.send(alarmDATA)
        } else {
            res.send({error: 'Mời bạn thực hiện đăng nhập lại'})
        }
    }else {
        res.send({error: 'Mời bạn thực hiện đăng nhập lại'})

    }
});
route.post('/hen-gio',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined) {

        let check = await accountCHECK_manager(req.cookies.username, req.cookies.password)

        if (check.length > 0) {
            let aid = null;

            if (req.body.data.aid === undefined || req.body.data.aid === null || req.body.data.aid === 0 || req.body.data.aid === '' ){
                aid = randomstring.generate()+generateRandomInteger();

            }else {
                aid = req.body.data.aid;
            }

            let alarm = await AlarmINSERT(req.cookies.username,req.body.data,true,aid)
            res.send(alarm)
         } else {
            res.send({error: 'Mời bạn thực hiện đăng nhập lại'})
        }
    }else {
        res.send({error: 'Mời bạn thực hiện đăng nhập lại'})

    }
});
route.post('/xoa-hen-gio',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined) {

        let check = await accountCHECK_manager(req.cookies.username, req.cookies.password)

        if (check.length > 0) {

            let alarmDELETE = await AlarmDELETE(req.cookies.username,req.body.aid)
            res.send(alarmDELETE)
        } else {
            res.send({error: 'Mời bạn thực hiện đăng nhập lại'})
        }
    }else {
        res.send({error: 'Mời bạn thực hiện đăng nhập lại'})

    }
});
route.post('/getAllAccount',async (req,res)=>{
    let check = await accountCHECK_manager(req.cookies.username,req.cookies.password);
    if(check.length > 0){
        let result = await accountREAD(req.cookies.username);

        res.send({error:null,data:result});
    }else {
        res.send({error:'Mời bạn thực hiện đăng nhập lại'})
    }

});
route.post('/deleteAccount',async (req,res)=>{
    let check = await accountCHECK_manager(req.cookies.username,req.cookies.password)

    if(check.length >0){
        let result = await accountDELETE(req.body.ID_sender,req.cookies.username);
        res.send({error:null,result:result});
    }else{
        res.send({error:'Mời bạn thực hiện đăng nhập lại'})
    }
});
route.post('/getAllConversation',async (req,res)=>{

    let check = await accountCHECK_manager(req.cookies.username,req.cookies.password)

    if(check.length >0){

        let result= await chatREAD(req.cookies.username);

        res.send({error:null,result:result});
    }else{
        res.send({error:'Mời bạn thực hiện đăng nhập lại'})
    }
});
route.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')

});
route.post('/getConversation',async (req,res)=>{
    if(req.cookies.username !== undefined && req.cookies.password !== undefined) {

        let check = await accountCHECK_manager(req.cookies.username, req.cookies.password)

        if (check.length > 0) {
            await seenUPDATE(req.body.ID_sender, req.body.ID_receiver, req.cookies.username, req.body.seen);
            let result = await chatFIND(req.body.ID_sender, req.body.ID_receiver, req.cookies.username);

            res.send(result);
        } else {
            res.send({error: 'Mời bạn thực hiện đăng nhập lại'})
        }
    }else {
        res.send({error: 'Mời bạn thực hiện đăng nhập lại'})

    }
});
route.post('/removeChat',async (req,res)=>{
    let check = await accountCHECK_manager(req.cookies.username,req.cookies.password)

    if(check.length >0){
        await chatDELETE(req.body.id,req.cookies.username);
        res.send(true)
    }else{
        res.send({error:'Mời bạn thực hiện đăng nhập lại'})
    }
})

route.post('/uploadIMAGE',async (req,res)=>{
    let check = await accountCHECK_manager(req.cookies.username,req.cookies.password)

    if(check.length >0){
        if (!req.files) return res.status(400).send('No files were uploaded.');
        let sampleFile = req.files.sampleFile;
        let nameIMG = generateRandomInteger()+'.jpg';
        if (sampleFile !== undefined){
            sampleFile.mv('./public/imgChat/'+nameIMG, function(err) {
                if (err) return res.status(500).send(err);

                res.send('imgChat/'+nameIMG);
            });
        }

    }else{
        res.send({error:'Mời bạn thực hiện đăng nhập lại'})
    }

});
module.exports = route;
