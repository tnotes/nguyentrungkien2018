const store = new Vuex.Store({
    state: {
        title:'Facebook manager',
        chat: [],
        account: [],
        filterSelect:'all',
        nickSelect:'all',
        listFriend:[],
        list_chat:[],
        error:[],
        ListKeyword:[],
        conversation:[],
        component:'listchat',


    },
    getters: {
        listAllInbox: state => {
            if(state.filterSelect === 'all'){
                 return state.list_chat;

            }else if(state.filterSelect === 'unread'){
                 return state.list_chat.filter(e=>{
                    if(e.seen === false){
                        return e
                    }
                })
            } else if(state.filterSelect === 'read'){
                 return state.list_chat.filter(e=>{
                    if(e.seen === true){
                        return e
                    }
                })
            }
        },
        listAllInboxOfAllNick:state=> {
            if(state.nickSelect === 'all'){
                return  state.list_chat;
            }else {
                return state.list_chat.filter(e=>{
                    if(e.ID_sender === state.nickSelect){
                        return e
                    }
                })
            }
        }
    },
    mutations: {
        changeComponent(state,newComponent){
           return  state.component = newComponent;
        },
        executeConversation(state,dataChat){

            dataChat.map(e=>{
                state.list_chat.push({
                    _id:e._id,
                    ID_receiver:e.ID_receiver,
                    ID_sender:e.ID_sender,
                    facebook_name_sender:e.facebook_name_sender,
                    facebook_url_sender:e.facebook_url_sender,
                    seen:e.seen,
                    name:e.name,
                    image:e.image,
                    lastChat:e.chat.slice(-1)[0],
                    status:e.status,
                    sha:false,
                    ady:false
                })
            })
        },
        pushConversation(state,data){

            let check = false;
            if(data.ID_receiver === state.conversation.ID_receiver){

                data.chat = data.chat.map(e=>{
                    if(e.type === 'text'){
                        return e
                    }else{
                        e.message = JSON.parse(e.message);
                        return e
                    }

                });
                state.conversation.chat = data.chat;
            }

            state.list_chat = state.list_chat.map(e=>{
                if (e.ID_receiver === data.ID_receiver && e.ID_sender === data.ID_sender){
                    e.seen = data.seen;
                    check = true;
                    e.status = data.status;
                    e.lastChat = data.chat.slice(-1)[0]
                    return e
                }else{
                    return e
                }
            });


            if(check ===  false){

                state.list_chat.push({
                    ID_receiver:data.ID_receiver,
                    ID_sender:data.ID_sender,
                    facebook_name_sender:data.facebook_name_sender,
                    facebook_url_sender:data.facebook_url_sender,
                    name:data.name,
                    image:data.image,
                    lastChat:data.chat.slice(-1)[0],
                    status:data.status,
                    seen:data.seen
                })
            }

            return true
        },
        dropConversation(state,id){

              state.list_chat = state.list_chat.filter(e=>{
                if(e['_id'] !== id){
                    return e
                }
            });

            return state.list_chat
        },
        statusUPDATEpro(state,ID_sender){
            state.conversation.status = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
            state.list_chat = state.list_chat.map(e=>{
              if(e['ID_sender'] === ID_sender){
                  e['status'] = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
              }

              return e
            });
            state.account = state.account.map(e=>{
                if(e['ID_sender'] === ID_sender){
                    e['status'] = 'Cookie đã hết hạn.Vui lòng lấy lại Cookie';
                }
                return e
            })




        },
        pushError(state,data){
            return state.error.push(data)
        },
        getConversation(state,data){
            data.chat = data.chat.map(e=>{
                if(e.type === 'text'){
                    return e
                }else{
                    e.message = JSON.parse(e.message);
                    return e
                }
            });

            state.list_chat = state.list_chat.map(e=>{
                if(e.ID_receiver === data.ID_receiver){
                    e.seen = true;
                    return e;
                }else{
                    return e;
                }
            });


            state.conversation = data;
        }

    }
})