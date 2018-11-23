const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nguyentrungkien';
mongoose.connect(url, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const SchemaChat = new Schema({},{strict:false});
const ModelChat = mongoose.model('conversation',SchemaChat);
const ModelAccount = mongoose.model('account',SchemaChat);
const ModelAccountManager = mongoose.model('accountManager',SchemaChat);
const ModelAlarm = mongoose.model('alarm',SchemaChat);
module.exports = {
    AlarmINSERT:(userBoss,data,status,id)=>{
      return new Promise(resolve => {
          ModelAlarm.updateOne({userBoss:userBoss,aid:id},{aid:id,userBoss:userBoss,data:data,status:status},{upsert:true}).then(result=>{
              resolve(id)
          })
      })
    },
    AlarmFIND:userBoss=>{
      return new Promise(resolve=>{
          ModelAlarm.find({userBoss:userBoss},(err,result)=>{
              resolve(result)
          })
      })
    },
    AlarmFIND_aid:(userBoss,aid)=>{
        return new Promise(resolve=>{
            ModelAlarm.find({userBoss:userBoss,aid:aid},(err,result)=>{
                resolve(result)
            })
        })
    },
    AlarmDELETE:(userBoss,aid)=>{
      return new Promise(resolve => {
          ModelAlarm.deleteOne({userBoss:userBoss,aid:aid}).then(result=>{
              resolve(result)
          })
      })
    },

  chatINSERT : info=>{
    return new Promise(resolve=>{
      let infoDATA = new ModelChat(info);
      infoDATA.save().then(result=>{
        resolve(result)
      })
    })
  },
  chatUPDATE : (id,userBoss,message)=>{
    return new Promise(resolve => {

      ModelChat.updateOne(
        { ID_receiver: id,userBoss:userBoss },
        { $push: { chat: message}},(err,res)=>{
          resolve(true)
        })
    })
  },
    chatREAD : (username)=>{
        return new Promise(resolve=>{
            ModelChat.find({userBoss:username},(err,result)=>{
                resolve(result);
            })
        })
    },
    chatDELETE : (id,userBoss)=> {
        return new Promise(resolve => {
            ModelChat.deleteOne({'_id': id,userBoss:userBoss}, (err, result) => {
                resolve(result);
            })
        })
    },
  accountINSERT : account=>{

    return new Promise(resolve=>{
        ModelAccount.updateMany({ID_sender:account.ID_sender,userBoss:account.userBoss},account,{upsert:true},(err,res)=>{
            resolve(res)
        })
    })
  },

  accountREAD : (username)=>{
    return new Promise(resolve=>{
      ModelAccount.find({userBoss:username},(err,result)=>{
        resolve(result)
      })
    })
  },
    accountREADall : ()=>{
        return new Promise(resolve=>{
            ModelAccount.find({},(err,result)=>{
                resolve(result)
            })
        })
    },
  accountDELETE: (id,userBoss)=>{
    return new Promise(resolve=>{
      ModelAccount.deleteOne({ID_sender:id,userBoss:userBoss},(err,res)=>{
        if(!err){
          resolve(true)
        }
      })
    })
  },
  accountUPDATE: (id,status)=>{
    return new Promise(resolve=>{
      ModelAccount.updateOne({ID_sender:id},{status:status},(err,res)=>{
        if(!err){
          resolve(res)
        }
      })
    })
  },
  accountFIND : (ID_sender,author,userBoss)=>{
    return new Promise(resolve=>{

      ModelAccount.find({ID_sender:ID_sender,author:author,userBoss:userBoss},(err,result)=>{
          if(result[0] !== undefined){
              resolve(result[0]['_doc']);

          }
      })
    })
  },
    accountFIND_manager : nick=>{
    return new Promise(resolve=>{
      ModelAccountManager.find({"username":nick},(err,result)=>{
        resolve(result)
      })
    })
    },
    accountCHECK_manager : (nick,pass)=>{
        return new Promise(resolve=>{
            ModelAccountManager.find({"username":nick,"password":pass},(err,result)=>{
                resolve(result)
            })
        })
    },
    accountCREATE_manager :obj=>{
        return new Promise(resolve=>{
            let doc = new ModelAccountManager(obj);
            doc.save().then(result=>{
              resolve(result)
            })
        })
    },


  seenUPDATE: (ID_sender,ID_receiver,username,value)=>{
    return new Promise(resolve=>{
      ModelChat.updateOne({ID_sender:ID_sender,ID_receiver:ID_receiver,userBoss:username},{seen:value},(err,result)=>{
        resolve(result)
      })
    })
  },
    statusUPDATE: (ID_sender,username,value)=>{
        return new Promise(resolve=>{
            ModelChat.updateMany({ID_sender:ID_sender,userBoss:username},{status:value},(err,result)=>{
                resolve(result)
            })
        })
    },
    changePASSWORD:(username,passwordOLD,passwordNEW)=>{
      return new Promise(resolve => {
          ModelAccountManager.updateOne({username:username,password:passwordOLD},{password:passwordNEW},(err,result)=>{
              resolve(result)
          })
      })
    },
  chatFIND : (ID_sender,ID_receiver,userBoss)=>{
    return new Promise(resolve=>{
      ModelChat.find({ID_sender:ID_sender,ID_receiver:ID_receiver,userBoss:userBoss},(err,result)=>{

          resolve(result[0]);
      })
    })
  }
};


