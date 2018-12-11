const express = require('express');
const route =  express.Router();
const path = require('path');
const moment = require('moment-timezone');

const {accountFIND_manager,accountALL_manager,accountDELETEall,chatDELETEall,accountDELETE_manager,accountUPDATE_manager,AlarmFIND,accountINSERT,chatFINDall,accountREADall,chatFIND,AlarmINSERT,AlarmDELETE,accountCREATE_manager,changePASSWORD,statusUPDATE,accountCHECK_manager,chatREAD,accountREAD,accountDELETE,seenUPDATE,chatDELETE} = require('./../db');
route.get('/',async (req,res)=>{

    res.sendFile(path.join(__dirname + '/../page/adminDashboard.html'));

});
let dataClient = async ()=>{
  let AllAccountUser = await accountALL_manager();
  let AllAccountFb = await accountREADall();
  let AllConversations = await chatFINDall();
  let data = AllAccountUser.map(e=>{
      e = e['_doc'];
      let dataAccountLength = AllAccountFb.filter(m=>{

          if(m['_doc'].userBoss === e.email){
              return m;
          }
      }).length;
      let dataConversationsLength = AllConversations.filter(m=>{
          if(m['_doc'].userBoss === e.email){
              return m;
          }
      }).length;
      e.dataAccountLength = dataAccountLength;
      e.dataConversationsLength = dataConversationsLength;
     
      e.startTimeConvert = moment(e.startTime).tz('Asia/Ho_Chi_Minh').format( "HH:mm DD/MM/YYYY");
      e.limitTimeConvert = moment(e.limitTime).tz('Asia/Ho_Chi_Minh').format( "HH:mm DD/MM/YYYY");

      return e
  });
    return data;


};
route.post('/list',async (req,res)=>{
    let data = await dataClient();
    res.send(data);
});
route.post('/deleteFacebook',async (req,res)=>{
    let deleteAll = await accountDELETEall(req.body.userBoss);
    res.send(deleteAll)
});
route.post('/deleteConversations',async (req,res)=>{
    let deleteAll = await chatDELETEall(req.body.userBoss);
    res.send(deleteAll)
});
route.post('/deleteUser',async (req,res)=>{
    await accountDELETEall(req.body.email);
    let deleteAll = await accountDELETE_manager(req.body.email);
    res.send(deleteAll)
});
route.post('/update',async (req,res)=>{
    let data = req.body.data;
     let obj = {
        name:data.name,
        email:data.email,
        password:data.password,
        phone:data.phone,
        package:data.package,
         FacebookCount:data.FacebookCount,
        startTime:data.startTime,
        limitTime:parseInt(moment(data.TimeEndYear+'-'+data.TimeEndMonth+'-'+data.TimeEndDay+' '+data.TimeStartHour).format( "x"))-60*60*15*1000
    };
    let update = await accountUPDATE_manager(data.email,obj);
    res.send(update)

});
module.exports = route;