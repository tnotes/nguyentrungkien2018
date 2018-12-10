const express = require('express');
const route =  express.Router();
const path = require('path');
const moment = require('moment-timezone');
const process = require('./../index');
var randomstring = require("randomstring");

const {accountFIND_manager,accountALL_manager,accountUPDATE_manager,AlarmFIND,AutoChatFINDall,AutoChatDELETE,AutoChatINSERT,accountINSERT,chatFIND,AlarmINSERT,AlarmDELETE,accountCREATE_manager,changePASSWORD,statusUPDATE,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,seenUPDATE,chatDELETE} = require('./../db');
function generateRandomInteger() {
    let min = 0;
    let max=1000000000000;
    return Math.floor(min + Math.random()*(max+1 - min)).toString()
}


route.post('/changePassword',async (req,res)=>{

           let change = await changePASSWORD(req.cookies.email,req.cookies.password,req.body.password);
           res.send(change)

});

route.post('/account',async (req,res)=>{

        let author = randomstring.generate()+generateRandomInteger();
        let infoBoss = await accountFIND_manager(req.cookies.email);
        let accountCountNow = await accountREAD(req.cookies.email);
        let limit = parseInt(infoBoss[0]['_doc'].FacebookCount);
        let present = accountCountNow.length;

        if(present < limit){

            if(req.body.type === 'pass') {
                let result = await accountINSERT({
                    status: 'Đang hoạt động',
                    type:'pass',
                    author:author,
                    ID_sender: req.body.email,
                    userBoss:req.cookies.email,
                    email: req.body.email,
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
                        ID_sender: req.body.email,
                        userBoss: req.cookies.email,
                        email: req.body.email,
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
                        userBoss: req.cookies.email,

                        cookie: OBJ_template
                    });

                    if(result.upserted !== undefined){

                        let account = await process({
                            ID_sender: req.body.data[i]['c_user'],
                            status: 'Đang hoạt động',
                            author:author,
                            type:'cookie',
                            userBoss: req.cookies.email,
                            cookie: OBJ_template
                        });

                        account.error = null;
                        res.send(account);

                    }else {
                        res.send({
                            error:"Tài khoản Facebook này đã xuất hiện trong danh sách của bạn !",
                        })
                    }


                }
            }
        }else {
            res.send({
                error:"Hiện tại bạn chỉ thêm được tối đa "+limit+" tài khoản . Vui lòng nâng cấp để tiếp tục sử dụng !",
            })
        }


});

route.get('/',async (req,res)=>{
    res.sendFile(__dirname+'/page/index.html');
});
route.post('/alarmData',async (req,res)=>{
            let alarmDATA = await AlarmFIND(req.cookies.email)
            res.send(alarmDATA)
});
route.post('/hen-gio',async (req,res)=>{

            let aid = null;

            if (req.body.data.aid === undefined || req.body.data.aid === null || req.body.data.aid === 0 || req.body.data.aid === '' ){
                aid = randomstring.generate()+generateRandomInteger();

            }else {
                aid = req.body.data.aid;
            }

            let alarm = await AlarmINSERT(req.cookies.email,req.body.data,false,aid)
            res.send(alarm)

});
route.post('/xoa-hen-gio',async (req,res)=>{


            let alarmDELETE = await AlarmDELETE(req.cookies.email,req.body.aid)
            res.send(alarmDELETE)

});
route.post('/getAllAccount',async (req,res)=>{
        let result = await accountREAD(req.cookies.email);
        res.send({error:null,data:result});


});
route.post('/deleteAccount',async (req,res)=>{

        let result = await accountDELETE(req.body.ID_sender,req.cookies.email);
        res.send({error:null,result:result});

});
route.post('/getAllConversation',async (req,res)=>{
        let getUSER = await accountFIND_manager(req.cookies.email);
        let result= await chatREAD(req.cookies.email);
        res.send({error:null,result:{user:getUSER[0],conversation:result}});

});
route.post('/getConversation',async (req,res)=>{

            await seenUPDATE(req.body.ID_sender, req.body.ID_receiver, req.cookies.email, req.body.seen);
            let result = await chatFIND(req.body.ID_sender, req.body.ID_receiver, req.cookies.email);

            res.send(result);

});
route.post('/getAutoChat',async (req,res)=>{
    let chatBotKey = await AutoChatFINDall(req.cookies.email);
    let AllAccount = await accountREAD(req.cookies.email);
    res.send({chatBotKey:chatBotKey,AllAccount:AllAccount})

});
route.post('/addAutoChat',async (req,res)=>{
    let AddAutoChat = await AutoChatINSERT(req.cookies.email,randomstring.generate(),req.body.keyList,req.body.message,req.body.select);
    res.send(AddAutoChat)
});
route.post('/deleteAutoChat',async (req,res)=>{
   let DeleteAutoChat = await AutoChatDELETE(req.cookies.email,req.body.KeySecure);
   res.send(DeleteAutoChat);
});
route.post('/updateAutoChat',async (req,res)=>{
    let UpdateAutoChat = await AutoChatINSERT(req.cookies.email,req.body.KeySecure,req.body.keyList,req.body.message,req.body.select);
    res.send(UpdateAutoChat);
})
route.post('/removeChat',async (req,res)=>{

        await chatDELETE(req.body.id,req.cookies.email);
        res.send(true)

});

route.post('/uploadIMAGE',async (req,res)=>{

        if (!req.files) return res.status(400).send('No files were uploaded.');
        let sampleFile = req.files.sampleFile;
        let nameIMG = generateRandomInteger()+'.jpg';
        if (sampleFile !== undefined){
            sampleFile.mv('./public/imgChat/'+nameIMG, function(err) {
                if (err) return res.status(500).send(err);

                res.send('imgChat/'+nameIMG);
            });
        }



});
route.get('/addCookie',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/addCookie.html'));

});
route.get('/account',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/addPass.html'));

});
route.get('/autoChat',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/autoChat.html'));

});
route.post('/infoUser',async (req,res)=>{
   let info = await accountFIND_manager(req.cookies.email);
   res.send(info)
});
route.post('/updateUser',async (req,res)=>{
   let updateU = await accountUPDATE_manager(req.cookies.email,req.body.data);
   res.send(updateU)
});
route.get('/changePassword',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/changepassword.html'));

});
route.get('/mutiplesms',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/mutiplesms.html'));

});
module.exports = route;
