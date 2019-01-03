const express = require('express');
const route =  express.Router();
const path = require('path');
const moment = require('moment-timezone');
const process = require('./../index');
var randomstring = require("randomstring");

const {accountFIND_manager,accountALL_manager, ModelVocativeINSERT,ModelScenarioID_FIND,ModelScenarioID_DELETE,ModelScenarioID_INSERT,ModelScenarioDELETE,ModelScenarioALL,ModelScenarioINSERT,ModelScenarisCHECKsyntax,accountREADfull,AlarmDELETEall,accountUPDATE_manager,AlarmFIND,AutoChatFINDall,AutoChatDELETE,AutoChatINSERT,accountINSERT,chatFIND,AlarmINSERT,AlarmDELETE,accountCREATE_manager,changePASSWORD,statusUPDATE,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,seenUPDATE,chatDELETE} = require('./../db');
function generateRandomInteger() {
    let min = 0;
    let max=1000000000000;
    return Math.floor(min + Math.random()*(max+1 - min)).toString()
}
let getINDEX = async (email)=>{
    let syntaxRandom = Math.floor(Math.random()*1000000).toString();
    let testSyntax = await ModelScenarisCHECKsyntax(email,syntaxRandom);
    if(testSyntax.length === 0){
        return syntaxRandom
    }else {
        return await getINDEX(email)
    }
};
function change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim();
    return str;
}

route.post('/changePassword',async (req,res)=>{
    if(req.body.password.length > 0){
        let change = await changePASSWORD(req.cookies.email,req.cookies.password,req.body.password);
        res.send({error:null,result:change})
    }else {
        res.send({error:'Bạn không được để trống mật khẩu',result:null})
    }


});
route.post('/account',async (req,res)=>{

        let author = randomstring.generate()+generateRandomInteger();
        let infoBoss = await accountFIND_manager(req.cookies.email);
        let accountCountNow = await accountREAD(req.cookies.email);
        let limit = parseInt(infoBoss[0]['_doc'].FacebookCount);
        let present = accountCountNow.length;
        let listIDactive = accountCountNow.map(e=>{

            return e['_doc']['ID_sender']
        });




            if(req.body.type === 'pass') {
                let findCookie = await accountREADfull(req.body.email);
                if(findCookie.length > 0){
                    res.send({
                        error:"Tài khoản facebook này đã được thêm bởi một tài khoản nào đó đang sử dụng trên Facebook manager!",
                    })
                }else {
                    if(present < limit || listIDactive.includes(req.body.email) === true){
                        let result = await accountINSERT({
                            status: 'active',
                            type: 'pass',
                            author: author,
                            ID_sender: req.body.email,
                            userBoss: req.cookies.email,
                            email: req.body.email,
                            password: req.body.password,
                            date: req.body.date,
                            month: req.body.month,
                            year: req.body.year
                        });
                        if (result.upserted !== undefined) {

                            let result = await process({
                                status: 'active',
                                type: 'pass',
                                author: author,
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
                        } else {
                            res.send({
                                error: "Tài khoản Facebook này đã xuất hiện trong danh sách của bạn !",
                            })
                        }
                    }else {
                        res.send({
                            error:"Xin lỗi,quý khách đã đạt giới hạn tài khoản quản lí .Vui lòng liên hệ nhà cung cấp để được nâng cấp sử dụng dịch vụ . Trân trọng cảm ơn !",
                        })
                    }

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
                    if(present < limit || listIDactive.includes(req.body.data[i]['c_user']) === true){
                        let result = await accountINSERT({
                            ID_sender: req.body.data[i]['c_user'],
                            status: 'active',
                            author:author,
                            type:'cookie',
                            userBoss: req.cookies.email,

                            cookie: OBJ_template
                        });

                        if(result.upserted !== undefined){

                            let account = await process({
                                ID_sender: req.body.data[i]['c_user'],
                                status: 'active',
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
                    }else {
                        res.send({
                            error:"Xin lỗi,quý khách đã đạt giới hạn tài khoản quản lí .Vui lòng liên hệ nhà cung cấp để được nâng cấp sử dụng dịch vụ . Trân trọng cảm ơn !",
                        })
                    }





                }
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
       //     await AlarmDELETEall(req.cookies.email);
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
    let AllAccount = await accountREAD(req.cookies.email);
    let chatBotKey = await AutoChatFINDall(req.cookies.email);
    res.send({chatBotKey:chatBotKey,AllAccount:AllAccount})

});
route.post('/addAutoChat',async (req,res)=>{
    let AddAutoChat = await AutoChatINSERT(req.cookies.email,randomstring.generate(),req.body.keyList,req.body.message,req.body.select);
    let chatBotKey = await AutoChatFINDall(req.cookies.email);

    res.send(chatBotKey)
});
route.post('/deleteAutoChat',async (req,res)=>{

   let DeleteAutoChat = await AutoChatDELETE(req.cookies.email,req.body.KeySecure);
   res.send(DeleteAutoChat);
});
route.post('/updateAutoChat',async (req,res)=>{
    let UpdateAutoChat = await AutoChatINSERT(req.cookies.email,req.body.KeySecure,req.body.keyList,req.body.message,req.body.select);
    res.send(UpdateAutoChat);
});
route.post('/removeChat',async (req,res)=>{

        await chatDELETE(req.body.id,req.cookies.email);
        res.send(true)

});
route.post('/getAllScenario',async (req,res)=>{
    let alldata = await ModelScenarioALL(req.cookies.email);
    res.send(alldata)
});
route.post('/setScenario',async (req,res)=>{

   let scenarioINSERT = await ModelScenarioINSERT(req.cookies.email,req.body.data);
   let ID_syntax = await ModelScenarioID_FIND(req.cookies.email,req.body.data.syntax);
   if(ID_syntax.length === 0){
       await ModelScenarioID_INSERT(req.cookies.email,req.body.data.syntax)
   }
   res.send(scenarioINSERT)
});
route.post('/vocative',async (req,res)=>{
   let vocativeUp = await ModelVocativeINSERT(req.cookies.email,req.body.vocative);
   res.send(vocativeUp)
});


route.post('/removeScenario',async (req,res)=>{
    let remove = await ModelScenarioDELETE(req.cookies.email,req.body.syntax);
    await ModelScenarioID_DELETE(req.cookies.email,req.body.syntax)
    res.send(remove)
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
route.get('/chat',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/chat.html'));

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
route.get('/scenario',async (req,res)=>{
    res.sendFile(path.join(__dirname + '/../page/scenario.html'));

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
