const login = require("facebook-chat-api");
const {chatINSERT,accountFIND_manager,accountREADall,AlarmFIND,AlarmFIND_aid,accountCHECK_manager,accountCREATE_manager,chatUPDATE,chatDELETE,chatFIND,chatREAD,accountDELETE,accountINSERT,accountFIND,accountREAD,seenUPDATE,statusUPDATE} = require('./db.js');
const express = require('express');
let CronJob  = require('cron').CronJob;
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
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

  let sendMessText = (data)=>{
      return new Promise(resolve=>{
          api.sendMessage(data.message, data.ID_receiver, async (err, message) => {
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
  }
  let sender = await accountFIND(account.ID_sender,account.author,account.userBoss);


    if(api !== null){
        await statusUPDATE(account.ID_sender,account.userBoss,'Đang hoạt động');
      io.on('connection',async socket=>{

          socket.on('sendMessage',async function(data,fn){

            if(account.ID_sender === data.ID_sender && account.userBoss === data.userBoss) {
                let findUSER = await accountFIND(account.ID_sender, account.author, account.userBoss);
                if (findUSER !== undefined) {

                    if (data.type === 'text') {
                        let result = await sendMessText(data);
                        return fn(result)
                    } else if (data.type === 'attachments') {

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
                            return fn(result)
                        });


                    }

                }
            }


        });
          socket.on('GetListFriend',async function(dataSend){

              if(dataSend.list.includes(account.ID_sender)){
                  api.getFriendsList((err, data) => {
                      if(data !== undefined){
                          data = data.filter(e=>{
                              if(e.userID !== '0'){
                                  return e
                              }
                          }).map(e=>{
                              e['ID_sender'] = account.ID_sender
                              return e
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
              let dataChat = await chatFIND(account.ID_sender,ID_receiver,account.userBoss);

              io.sockets.emit('receiveMessage', {
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










