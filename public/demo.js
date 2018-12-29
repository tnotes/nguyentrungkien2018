Vue.component('rightchat', {
    template:'<div class="vertical-box-column width-200 bg-black-transparent-2 hidden-xs">\n' +
        '                <!-- begin vertical-box -->\n' +
        '                <div class="vertical-box">\n' +
        '\n' +
        '                    <!-- end wrapper -->\n' +
        '                    <!-- begin vertical-box-row -->\n' +
        '                    <div class="vertical-box-row">\n' +
        '                        <!-- begin vertical-box-cell -->\n' +
        '                        <div class="vertical-box-cell">\n' +
        '                            <!-- begin vertical-box-inner-cell -->\n' +
        '                            <div class="vertical-box-inner-cell">\n' +
        '                                <!-- begin scrollbar -->\n' +
        '                                <div data-scrollbar="true" data-height="100%">\n' +
        '                                    <!-- begin wrapper -->\n' +
        '                                    <div class="wrapper p-0">\n' +
        '                                        <div class="nav-title"><b>FOLDERS</b></div>\n' +
        '\n' +
        '                                        <ul class="nav nav-inbox">\n' +
        '                                            <li class="active"><a href="email_inbox.html"><i class="fa fa-inbox fa-fw m-r-5"></i> Inbox <span class="badge pull-right">{{container.conversation.filter(e=>{\n' +
        '                                                if(e.seen === false){\n' +
        '                                                return e\n' +
        '                                                }\n' +
        '                                                }).length\n' +
        '                                                }}</span></a></li>\n' +
        '\n' +
        '                                        </ul>\n' +
        '\n' +
        '                                        <div class="nav-title row"><b>LỌC</b> <select style="width: 150px;height: 25px;padding-top:2px;margin-top:-5px;margin-left:10px;background: none;border:1px solid #676767" @change="filterChat" class="form-control form-control-sm"  v-model="nicknameSelect">\n' +
        '                                            <option value="all">Tất cả</option>\n' +
        '                                            <option v-for="(element,index) in listAccountFacebook" :key="index" :value="element" style="background: none">{{element}}</option>\n' +
        '\n' +
        '                                        </select></div>\n' +
        '\n' +
        '                                        <ul class="nav nav-inbox">\n' +
        '                                            <li v-for="data in container.conversation" @click="newTag(data)"><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-white"></i> {{data.name}} <i v-if="data.seen === false" class="time fa fa-envelope" style="color: white; float:right"></i></a></li>\n' +
        '\n' +
        '                                        </ul>\n' +
        '                                    </div>\n' +
        '                                    <!-- end wrapper -->\n' +
        '                                </div>\n' +
        '                                <!-- end scrollbar -->\n' +
        '                            </div>\n' +
        '                            <!-- end vertical-box-inner-cell -->\n' +
        '                        </div>\n' +
        '                        <!-- end vertical-box-cell -->\n' +
        '                    </div>\n' +
        '                    <!-- end vertical-box-row -->\n' +
        '                </div>\n' +
        '                <!-- end vertical-box -->\n' +
        '            </div>',
    data(){
        return {

            nicknameSelect:"all",
            listAccountFacebook:[],




        }
    },
    computed:{
        container(){
            return store.state;
        }
    },

    created: async  function(){

        console.log('hello')
        //  this.listAccountFacebook = uniq(store.state.conversation.map(e=>e.facebook_name_sender))




    },
    methods:{

        filterChat:async function(){
            let nickname = this.nicknameSelect;
            if(nickname === 'all'){
                return  this.listInbox = store.state.conversation;

            }else {
                return this.listInbox = store.state.conversation.filter(e=>{
                    if(e.facebook_name_sender === nickname){
                        return e
                    }
                })
            }

        },
        newTag:async function(obj){
            let result = await axios.post('/api/getConversation',{ID_receiver:obj.ID_receiver,ID_sender:obj.ID_sender,seen:true});
            store.commit('changeComponent','chat');

            store.commit('getConversation',result.data);
            $("#scroll").animate({ scrollTop:1000000000}, 500);



        }





    },
});