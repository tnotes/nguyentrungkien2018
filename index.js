const login = require("facebook-chat-api");
const {chatINSERT,accountFIND_manager,ModelScenarioID_INSERT_ID,ModelVocativeFIND,ModelScenarisCHECKsyntax,ModelScenarioDELETE,ModelVocativeINSERT,ModelScenarioID_FIND,ModelScenarioID_REMOVE_ID,accountREADall,ModelScenarioALL,AutoChatFINDall,AlarmFIND,AlarmFIND_aid,AlarmUPDATE,accountCHECK_manager,accountCREATE_manager,chatUPDATE,chatDELETE,chatFIND,chatREAD,accountDELETE,accountINSERT,accountFIND,accountREAD,seenUPDATE,statusUPDATE} = require('./db.js');
const express = require('express');
let CronJob  = require('cron').CronJob;
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const randomstring = require("randomstring");
const moment = require('moment-timezone');
let base64Img = require('base64-img');
function getTime() {
  let d = new Date();
  let hours = d.getHours()
  let minutes = d.getMinutes();
  let date = d.getDate();
  let mounth = d.getMonth()+1;
  return hours+':'+minutes+' | Date: '+date+'/'+mounth

}
let loginPass = account=>{
  return new Promise((resolve,reject) => {
      login({email: account.username, password: account.password}, (err, api) => {

          if(err){

              reject(err);
          }else {
              resolve(api)
          }
      })
  })
};
let loginCookie = account=>{
    return new Promise((resolve,reject) => {
        login({appState: account.cookie}, (err, api) => {
            if(err){
                reject(err);
            }else {
                resolve(api)
            }
        })
    })
};
let waitTime = time=>{
    return new Promise(resolve=>{
        setTimeout(function(){
            resolve(true);
        },time)
    })
};
let process = async function(account){
  let api = null;
  let getInfo = id => {
        return new Promise(resolve => {

            api.getUserInfo(id, (err, ret) => {
                resolve(ret[id])
            });
        });
    };
  let PushINFO = async api=>{
      let myID = await api.getCurrentUserID();
      let myInfo = await getInfo(myID);

      account.FacebookName = myInfo.name;
      account.FacebookImage = myInfo.thumbSrc;
      account.FacebookUrl = myInfo.profileUrl;
      await accountINSERT(account);
      return account;
  };
  if(account.type === 'pass'){
      try{
          api = await loginPass(account);
          account = await PushINFO(api)
      }catch (e) {
          account.status = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';
          await accountINSERT(account)
      }
  }else if (account.type === 'cookie'){
      try{
          api = await loginCookie(account);
          account = await PushINFO(api)

      }catch (e) {
          account.status = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
          await accountINSERT(account)
      }
  }
  function voca(e,vocative){
      let vocativeArr = vocative[0]['_doc'].vocative;
      let listVocative = vocativeArr.map(e=>e.userID);
        if(listVocative.includes(e.userID) === true){
            let vocativeName = vocativeArr.filter(em=>{
                if(em.userID === e.userID){
                    return em
                }
            })[0].vocative;
            e.vocative = vocativeName
        }else if(listVocative.includes(e.userID) === false){
            e['ID_sender'] = account.ID_sender;
            if(e.gender === 'female_singular'){
                e.vocative = 'Chị';
            }else if(e.gender === 'male_singular'){
                e.vocative = 'Anh';
            }
        }
        return e;
    }
  let sendMessText = async (data)=>{
      let info = await getInfo(data.ID_receiver);
      let vocative = await ModelVocativeFIND(account.userBoss);

      let obje = {
          userID:data.ID_receiver
      };
      if(info.gender === 1){
          obje.gender = 'female_singular';
      }else if(info.gender === 20){
          obje.gender = 'male_singular';
      }
      let loadVocative = await voca(obje,vocative);
      let vocativeUse = loadVocative.vocative;
      let lastname = info.name.split(' ').slice(0, -1).join(' ');
      let firstname = info.name.split(' ').slice(-1).join(' ');
      data.message = data.message.replace(/{{lastname}}/g,lastname).replace(/{{firstname}}/g,firstname).replace(/{{xungho}}/g,vocativeUse);
      let msg ={
          body:data.message
      };


      return new Promise(resolve=>{

          api.sendMessage(msg, data.ID_receiver, async (err, message) => {
              let result = {};
              if (err === null) {

                  await chatUPDATE(data.ID_receiver, account.userBoss, {
                      user: 'me',
                      type: data.type,
                      message: data.message,
                      time: getTime()
                  });

                  result.error = null;
              } else{
                  if(err.error === 'Not logged in.'){
                      if (account.type === 'cookie') {
                          account.status = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
                          await accountINSERT(account);
                          await statusUPDATE(data.ID_sender, account.userBoss, 'Cookie đã hết hạn.Vui lòng lấy lại Cookie')
                          result.error = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';

                      } else if (account.type === 'pass') {
                          account.status = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';
                          await accountINSERT(account);
                          await statusUPDATE(data.ID_sender, account.userBoss, 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint')

                          result.error = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';

                      }
                  }
              }
              let dataChat = await chatFIND(data.ID_sender, data.ID_receiver, account.userBoss);

              result.data = dataChat;
              resolve(result)

          });
      })
  };
  let sendMessExcute = async function(data){
      return new Promise(async (resolve,reject)=>{
          if(account.ID_sender === data.ID_sender && account.userBoss === data.userBoss) {
              let findUSER = await accountFIND(account.ID_sender, account.author, account.userBoss);
              if (findUSER !== undefined) {

                  if (data.type === 'text') {
                      let result = await sendMessText(data);
                      await seenUPDATE(account.ID_sender,data.ID_receiver,account.userBoss,true)
                      resolve(result)
                  } else if (data.type === 'attachments') {
                      await seenUPDATE(account.ID_sender,data.ID_receiver,account.userBoss,true)

                      api.sendMessage({
                          attachment: fs.createReadStream('./public/' + data.url)
                      }, data.ID_receiver, async (err, message) => {
                          let result = {};
                          if (err === null) {
                              await chatUPDATE(data.ID_receiver, account.userBoss, {
                                  user: 'me',
                                  type: data.type,
                                  message: JSON.stringify([{url: '/' + data.url}]),
                                  time: getTime()
                              });
                              result.error = null;
                          } else{
                              if(err.error === 'Not logged in.'){
                                  if (account.type === 'cookie') {
                                      account.status = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
                                      await accountINSERT(account);
                                      await statusUPDATE(data.ID_sender, account.userBoss, 'Cookie đã hết hạn.Vui lòng lấy lại Cookie')

                                      result.error = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
                                  } else if (account.type === 'pass') {
                                      account.status = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';
                                      await accountINSERT(account);
                                      await statusUPDATE(data.ID_sender, account.userBoss, 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint')

                                      result.error = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';

                                  }
                              }



                          }

                          let dataChat = await chatFIND(data.ID_sender, data.ID_receiver, account.userBoss);

                          result.data = dataChat;
                          resolve(result)
                      });


                  }

              }
          }
      })
    };
  let sender = await accountFIND(account.ID_sender,account.author,account.userBoss);
  let scenarioACTION = async ({message:message,ID_receiver:ID_receiver,miliTime:miliTime,base64img:base64img,syntax:syntax})=>{
        return new Promise(resolve=> {
            let time = parseInt(moment().tz('Asia/Ho_Chi_Minh').format("x")) + miliTime;
            let hour = parseInt(moment(time).tz('Asia/Ho_Chi_Minh').format("H"));
            let minute = parseInt(moment(time).tz('Asia/Ho_Chi_Minh').format("m"));
            let date = parseInt(moment(time).tz('Asia/Ho_Chi_Minh').format("D"));
            let month = parseInt(moment(time).tz('Asia/Ho_Chi_Minh').format("M"));

            new CronJob('00 ' + minute + ' ' + hour + ' ' + date + ' ' + (parseInt(month - 1)) + ' *', async function () {
                let listSyntax = await ModelScenarioID_FIND(account.userBoss,syntax);
                let listID = listSyntax[0]['_doc']['listID'];
                if(listID.includes(ID_receiver) === true){
                    let data = {
                        userBoss: account.userBoss,
                        ID_receiver: ID_receiver,
                        type: 'text',
                        message: message,
                        ID_sender: account.ID_sender,
                    };

                    let messExcute = await sendMessExcute(data);
                    if(base64img !== null && base64img !== undefined && base64img !== ''){
                        let nameImage = randomstring.generate();
                        let pathImage = await base64Img.imgSync(base64img, './public/imgChat', nameImage);
                        data.type = 'attachments';
                        data.url = 'imgChat/'+pathImage.split('\\').slice(-1)[0]



                    }
                    messExcute = await sendMessExcute(data);

                    resolve(messExcute)
                }


            }, null, true, 'Asia/Ho_Chi_Minh');
        });


    };
  let scenarioACTIVE = async (scenario,ID_receiver,mess)=>{
      let scenarioArr = scenario[0]['_doc'].dataArr;
      for(let f = 0;f<scenarioArr.length;f++){
          let messageScenario = scenarioArr[f].text;
          let timeNameScenario =  scenarioArr[f].timeName;

          let miliTimeScenario = 0;
          let timeIndex =  parseInt(scenarioArr[f].time);
          if(timeNameScenario === 'Phút'){
              miliTimeScenario = 60000*timeIndex;
          }else if(timeNameScenario === 'Giờ'){
              miliTimeScenario = 3600000*timeIndex;
          }else if(timeNameScenario === 'Ngày'){
              miliTimeScenario = 86400000*timeIndex;
          }
          let findSyntaxExits = await ModelScenarisCHECKsyntax(account.userBoss,mess);
          let listSyntax = await ModelScenarioID_FIND(account.userBoss,scenario[0]['_doc'].syntax);
          let listID = listSyntax[0]['_doc']['listID'];
          if(findSyntaxExits.length > 0 && listID.includes(ID_receiver) === true){

                  await scenarioACTION({message:messageScenario,ID_receiver:ID_receiver,miliTime:miliTimeScenario,base64img:scenarioArr[f].base64img,syntax:scenario[0]['_doc'].syntax});
              let dataChat = await chatFIND(account.ID_sender,ID_receiver,account.userBoss);
               io.sockets.emit('receiveMessage', {
                  message: dataChat,
                  ID_sender:account.ID_sender,
                  ID_receiver:ID_receiver,
                  userBoss:account.userBoss
              })

          }else {
              break;
          }

      }
      return true;
  };


    if(api !== null){
        await statusUPDATE(account.ID_sender,account.userBoss,'Đang hoạt động');
      io.on('connection',async socket=>{

          socket.on('sendMessage',async function(data,fn){
            let sending = await sendMessExcute(data);
            return fn(sending)
          });
          socket.on('GetListFriend',async function(dataSend){
              let vocative = await ModelVocativeFIND(account.userBoss);


              if(dataSend.list.includes(account.ID_sender)){
                  api.getFriendsList((err, data) => {
                      if(data !== undefined){
                          data = data.filter(e=>{
                              if(e.userID !== '0'){
                                  return e
                              }
                          }).map(e=>{
                              return voca(e,vocative)
                          } );

                          socket.emit('callback_listFriend',{
                              data:data
                          })

                      }



                  });
              }
              return true;
          });
          socket.on('sendMessFriend',async function(dataSend){

              let send = dataSend.receiver.filter(e=>{
                  if(e.ID_sender === account.ID_sender){
                      return e
                  }
              });

              new CronJob('00 '+dataSend.minute+' '+dataSend.hour+' '+dataSend.date+' '+( parseInt(dataSend.month)-1)+' *',async function() {
                  let listAlarm = await AlarmFIND_aid(account.userBoss,dataSend.aid);

                  if(listAlarm.length > 0){
                      for(let i = 0;i<send.length;i++){
                          let obj = {type:'text'};
                          obj['ID_receiver'] = send[i].userID;
                          obj['message'] = dataSend.message;
                          await sendMessText(obj);
                          dataSend.receiver = dataSend.receiver.map(e=>{
                              if(e.userID === send[i].userID){
                                  e.status = 'Đã gửi'
                              }
                              return e
                          });

                          await AlarmUPDATE(account.userBoss,dataSend.aid,dataSend);
                          io.sockets.emit("perfect",{
                              data:dataSend
                          });
                          await waitTime(dataSend.time*1000)
                      }
                  }



                  }, null, true, 'Asia/Ho_Chi_Minh');
          })

      });
      api.listen(async (err, message) => {

          if(err !== null){

              if(err.error === 'Not logged in.'){

                  if(account.type === 'cookie'){
                      account.status = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
                      await statusUPDATE(account.ID_sender, account.userBoss, 'Cookie đã hết hạn.Vui lòng lấy lại Cookie')
                      await accountINSERT(account)

                  }else if(account.type === 'pass'){
                      account.status = 'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint';

                      await statusUPDATE(account.ID_sender, account.userBoss, 'Cookie đã hết hạn.Vui lòng lấy lại Cookie')
                      await accountINSERT(account)

                  }
              }

              io.sockets.emit('error',{
                  ID_sender:account['ID_sender'],
                  status:"cookie error"
              });
              return {error:'asdddf'}

          }
          let findUSER = await accountFIND(account.ID_sender,account.author,account.userBoss);

          if(findUSER !== undefined && message !== undefined) {
            let mess = message.body;
            let ID_receiver = message.threadID;
            let messageCONTENT;


            if (message.attachments.length === 0) {

              messageCONTENT = {user: 'you', type: 'text', message: mess, time: getTime()}
            } else {

              messageCONTENT = {
                user: 'you',
                type: 'attachments',
                message: JSON.stringify(message.attachments),
                time: getTime()
              }
            }

            let find = await chatFIND(account.ID_sender,ID_receiver,account.userBoss);

            if (find === undefined) {
              let info = await getInfo(ID_receiver);

              await chatINSERT({
                  userBoss:account.userBoss,
                  ID_receiver: ID_receiver,
                  ID_sender: account.ID_sender,
                  facebook_name_sender:sender.FacebookName,
                  facebook_url_sender:sender.FacebookUrl,
                  name: info.name,
                  image: info.thumbSrc,
                  facebook: info.profileUrl,
                  status: 'Đang hoạt động',
                  seen:false,
                  chat: [messageCONTENT]

              })
            } else {

              await chatUPDATE(ID_receiver,account.userBoss, messageCONTENT);
              await seenUPDATE(account.ID_sender,ID_receiver,account.userBoss,false)
            }

              let allScenario = await ModelScenarioALL(account.userBoss);

              if(mess.trim().length < 11 && mess.includes('HUY') === true){
                  let SceID = isNaN(parseInt(mess.split(' ')[1]));

                  if(SceID === false){
                      let nameEvent = allScenario.filter(e=>{

                          if(e['_doc'].syntax.trim() === 'DK '+parseInt(mess.split(' ')[1])){
                              return e
                          }

                      })[0]['_doc'].nameScenario;


                      await ModelScenarioID_REMOVE_ID(account.userBoss,'DK '+parseInt(mess.split(' ')[1]),ID_receiver);
                      let msg = {
                          userBoss:account.userBoss,
                          ID_receiver:ID_receiver,
                          type:'text',
                          message:'Quý khách đã hủy thành công nhận tin nhắn từ Chương trình '+nameEvent+' .Trân trọng cảm ơn !',
                          ID_sender:account.ID_sender
                      }
                      await sendMessExcute(msg)
                  }

              }
              let scenario = allScenario.filter(e=>{
                  if(e['_doc'].syntax === mess){
                      return e
                  }
              });
              if(scenario.length > 0){
                  let listSyntax = await ModelScenarioID_FIND(account.userBoss,scenario[0]['_doc'].syntax);
                  let listID = listSyntax[0]['_doc']['listID'];
                  if(listID.includes(ID_receiver) === false){
                      await ModelScenarioID_INSERT_ID(account.userBoss,scenario[0]['_doc'].syntax,ID_receiver);
                      let messageAlert = 'Quý khách đã đăng kí thành công Chương trình '+scenario[0]['_doc'].nameScenario+' của chúng tôi.Quý khách sẽ được cập nhật những thông tin mới nhất khi có sự kiện sắp diễn ra.Nếu muốn từ chối nhận tin nhắn vui lòng soạn HUY '+scenario[0]['_doc'].syntax.replace('DK','').trim()+' gửi tới facebook quý khách dã nhắn trước đó.Trân trong cảm ơn !';
                      await sendMessExcute({
                          userBoss:account.userBoss,
                          ID_receiver:ID_receiver,
                          type:'text',
                          message:messageAlert,
                          ID_sender:account.ID_sender
                      });
                      scenarioACTIVE(scenario,ID_receiver,mess);
                  }else {
                      let messageAlert = 'Quý khách đã đăng kí thành công Chương trình '+scenario[0]['_doc'].nameScenario+' trước đó của chúng tôi.Quý khách sẽ được cập nhật những thông tin mới nhất khi có sự kiện sắp diễn ra.Nếu muốn từ chối nhận tin nhắn vui lòng soạn HUY '+scenario[0]['_doc'].syntax.replace('DK','').trim()+' gửi tới facebook quý khách dã nhắn trước đó.Trân trong cảm ơn';
                      await sendMessExcute({
                          userBoss:account.userBoss,
                          ID_receiver:ID_receiver,
                          type:'text',
                          message:messageAlert,
                          ID_sender:account.ID_sender
                      });
                  }
              }



              let AllAutoChat = await AutoChatFINDall(account.userBoss);
              for(let i = 0;i<AllAutoChat.length;i++){
                  if(AllAutoChat[i]['_doc'].select.includes(account.ID_sender) === true){


                      let messArr = mess.split(' ');
                      let runLoop = true;
                      for(let n = 0;n<messArr.length;n++){

                          if(runLoop === true){

                              for(let z = 0;z<AllAutoChat[i]['_doc'].keyList.length;z++){
                                  if(AllAutoChat[i]['_doc'].keyList[z].trim().split(' ').length > 1 && mess.includes(AllAutoChat[i]['_doc'].keyList[z].trim()) === true){
                                      let data = {
                                          userBoss:account.userBoss,
                                          ID_receiver:ID_receiver,
                                          type:'text',
                                          message:AllAutoChat[i]['_doc']['message'],
                                          ID_sender:account.ID_sender
                                      };
                                      await sendMessExcute(data);
                                      runLoop = false;
                                      break;

                                  }else if(AllAutoChat[i]['_doc'].keyList[z].trim().split(' ').length === 1 && messArr[n] === AllAutoChat[i]['_doc'].keyList[z].trim()){
                                      let data = {
                                          userBoss:account.userBoss,
                                          ID_receiver:ID_receiver,
                                          type:'text',
                                          message:AllAutoChat[i]['_doc']['message'],
                                          ID_sender:account.ID_sender
                                      };
                                      await sendMessExcute(data);
                                      runLoop = false;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              }
              let dataChat = await chatFIND(account.ID_sender,ID_receiver,account.userBoss);
              return io.sockets.emit('receiveMessage', {
                  message: dataChat,
                  ID_sender:account.ID_sender,
                  ID_receiver:ID_receiver,
                  userBoss:account.userBoss
              })
          }



      });


  }
  return account


};

(async ()=>{
  let account = await accountREADall();
   account.map(e=>process(e['_doc']));
})();
http.listen(9999);

module.exports = process;










