const mongoose = require('mongoose');
const config = require('./config');
const url = config.mongodb;
mongoose.connect(url, { useNewUrlParser: true });
const Schema = mongoose.Schema;
const SchemaChat = new Schema({},{strict:false});
const ModelChat = mongoose.model('conversation',SchemaChat);
const ModelAccount = mongoose.model('account',SchemaChat);
const ModelAccountManager = mongoose.model('accountManager',SchemaChat);
const ModelAlarm = mongoose.model('alarm',SchemaChat);
const ModelScenario = mongoose.model('scenario',SchemaChat);
const ModelScenarioID = mongoose.model('scenarioID',SchemaChat);
const ModelVocative = mongoose.model('vocative',SchemaChat);
const AutoChat = mongoose.model('autoChat',SchemaChat);

module.exports = {
    ModelVocativeINSERT:(userBoss,vocative)=>{
      return new Promise(resolve=>{
          ModelVocative.updateMany({userBoss:userBoss},{userBoss:userBoss,vocative:vocative},{upsert:true},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelVocativeFIND:userBoss=>{
      return new Promise(resolve=>{
          ModelVocative.find({userBoss:userBoss},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelScenarioID_INSERT_ID:(userBoss,syntax,ID)=>{
      return new Promise(resolve=>{
          ModelScenarioID.updateMany({userBoss:userBoss,syntax:syntax},{$push:{listID:ID}},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelScenarioID_REMOVE_ID:(userBoss,syntax,ID)=>{
      return new Promise(resolve=>{
          ModelScenarioID.updateMany({userBoss:userBoss,syntax:syntax},{$pull:{listID:ID}},(err,result)=>{
              resolve(result)
          })
      })
    },

    ModelScenarioID_INSERT:(userBoss,syntax)=>{
        return new Promise(resolve=>{
            ModelScenarioID.updateOne({userBoss:userBoss,syntax:syntax},{userBoss:userBoss,syntax:syntax,listID:[]},{upsert:true}).then(result=>{
                resolve(result)
            })
        })
    },
    ModelScenarioID_FIND:(userBoss,syntax)=>{
      return new Promise(resolve=>{
          ModelScenarioID.find({userBoss:userBoss,syntax:syntax},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelScenarioID_DELETE:(userBoss,syntax)=>{
      return new Promise(resolve=>{
          ModelScenarioID.deleteMany({userBoss:userBoss,syntax:syntax},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelScenarioINSERT:(userBoss,data)=>{
      return new Promise(resolve=>{
          ModelScenario.updateOne({userBoss:userBoss,syntax:data.syntax},{syntax:data.syntax,nameScenario:data.nameScenario,dataArr:data.dataArr,checkedNames:data.checkedNames},{upsert:true}).then(result=>{
              resolve(result)
          })
      })
    },
    ModelScenarioDELETE:(userBoss,syntax)=>{
      return new Promise(resolve=>{
          ModelScenario.deleteMany({userBoss:userBoss,syntax:syntax},(err,result)=>{
              resolve(result)
          })
      })
    },
    ModelScenarioALL:userBoss=>{
        return new Promise(resolve=>{
            ModelScenario.find({userBoss:userBoss},(err,result)=>{
                resolve(result)
            })
        })
    },
    ModelScenarisCHECKsyntax:(userBoss,syntax)=>{
        return new Promise(resolve=>{
            ModelScenario.find({userBoss:userBoss,syntax:syntax},(err,result)=>{
                resolve(result)
            })
        })
    },
    AutoChatINSERT:(userBoss,KeySecure,keyList,message,select)=>{
      return new Promise(resolve=>{
          AutoChat.updateOne({userBoss:userBoss,KeySecure:KeySecure},{KeySecure:KeySecure,keyList:keyList,message:message,select:select},{upsert:true}).then(result=>{
              resolve(result)
          })
      })
    },

    AutoChatFINDall:userBoss=>{
      return new Promise(resolve=>{
          AutoChat.find({userBoss:userBoss},(err,result)=>{
              resolve(result);
          })
      })
    },
    AutoChatDELETE:(userBoss,KeySecure)=>{
      return new Promise(resolve=>{
          AutoChat.deleteMany({userBoss:userBoss,KeySecure:KeySecure}).then(result=>{
              resolve(result)
          })
      })
    },
    AlarmINSERT:(userBoss,data,status,id)=>{
      return new Promise(resolve => {
          ModelAlarm.updateOne({userBoss:userBoss,aid:id},{aid:id,userBoss:userBoss,data:data,status:status},{upsert:true}).then(result=>{
              resolve(id)
          })
      })
    },
    AlarmUPDATE:(userBoss,id,newData)=>{
        return new Promise(resolve => {
            ModelAlarm.updateOne({userBoss:userBoss,aid:id},{data:newData}).then(result=>{
                resolve(id)
            })
        })
    },
    AlarmUPDATEstatus:(userBoss,id,value)=>{
        return new Promise(resolve => {
            ModelAlarm.updateOne({userBoss:userBoss,aid:id},{status:value}).then(result=>{
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
    AlarmDELETEall:userBoss=>{
      return new Promise(resolve=>{
          ModelAlarm.deleteMany({userBoss:userBoss}).then(result=>{
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
    chatDELETEall:userBoss=>{
        return new Promise(resolve => {
            ModelChat.deleteMany({userBoss:userBoss}, (err, result) => {
                resolve(result);
            })
        })
    },
  accountINSERT : account=>{

    return new Promise(resolve=>{
        ModelAccount.update({ID_sender:account.ID_sender,userBoss:account.userBoss},account,{upsert:true},(err,res)=>{
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
    accountREADfull : (ID_sender)=>{
        return new Promise(resolve=>{
            ModelAccount.find({ID_sender:ID_sender},(err,result)=>{
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
    accountDELETEall: userBoss=>{
        return new Promise(resolve=>{
            ModelAccount.deleteOne({userBoss:userBoss},(err,res)=>{
                if(!err){
                    resolve(true)
                }
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
    accountALL_manager:()=>{
        return new Promise(resolve=>{
            ModelAccountManager.find({},(err,result)=>{
                resolve(result)
            })
        })
    },
    accountFIND_manager : nick=>{
    return new Promise(resolve=>{
      ModelAccountManager.find({"email":nick},(err,result)=>{
        resolve(result)
      })
    })
    },
    accountUPDATE_manager : (nick,newValue)=>{
        return new Promise(resolve=>{
            ModelAccountManager.updateOne({"email":nick},newValue,(err,result)=>{
                resolve(result)
            })
        })
    },
    accountDELETE_manager:nick=>{
        return new Promise(resolve=>{
            ModelAccountManager.deleteMany({"email":nick},(err,result)=>{
                resolve(result)
            })
        })
    },
    accountCHECK_manager : (nick,pass)=>{
        return new Promise(resolve=>{
            ModelAccountManager.find({"email":nick,"password":pass},(err,result)=>{
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
    changePASSWORD:(email,passwordOLD,passwordNEW)=>{
      return new Promise(resolve => {
          ModelAccountManager.updateOne({email:email,password:passwordOLD},{password:passwordNEW},(err,result)=>{
              resolve(result)
          })
      })
    },
    chatFINDall:()=>{
      return new Promise(resolve=>{
          ModelChat.find({},(err,result)=>{
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


