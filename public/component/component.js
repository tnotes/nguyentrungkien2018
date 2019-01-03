function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function uniq(a) {
    return Array.from(new Set(a));
}
function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return hours + ':' + minutes;
}
function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}
Vue.component('mutiplesms', {
    template:'<div class="content" id="content">\n' +
        '    \n' +
        '                    <div class="col-md-12">\n' +
        '                                <div class="panel panel-inverse " >\n' +
        '                                            <!-- begin panel-heading -->\n' +
        '                                            <div class="panel-heading ui-sortable-handle" style="background-color: #330404">\n' +
        '                                                        <div class="panel-heading-btn">\n' +
        '                                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                                                                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                                                                </div>\n' +
        '                                                        <h4  class="panel-title">Hẹn giờ gửi tin nhắn</h4>\n' +
        '                                                    </div>\n' +
        '                                            <!-- end panel-heading -->\n' +
        '                                            <!-- begin panel-body -->\n' +
        '                                            <div class="panel-body" data-sortable-id="form-plugins-1">\n' +
        '                                                        <div class="form-horizontal" data-parsley-validate="true" name="demo-form" novalidate="">\n' +
        '                    \n' +
        '                                                                    <div class="form-group row m-b-15">\n' +
        '                                                                                <label class="col-md-4 col-sm-4 col-form-label" >Đặt giờ * :</label>\n' +
        '                                                                                <div class="col-md-3">\n' +
        '                                                                                            <div class="input-group date" >\n' +
        '                                                                                                    <input type="datetime-local" v-model="calendar" id="calendar"\n' +
        '                                \n' +
        '                                                                                                           class="form-control">\n' +
        '                                \n' +
        '                                                                                                    </div>\n' +
        '                                                                                        </div>\n' +
        '                                                                            </div>\n' +
        '                                                                    <div class="form-group row m-b-15">\n' +
        '                                                                                <label class="col-md-4 col-sm-4 col-form-label">Nội dung tin nhắn :</label>\n' +
        '                                                                                <div class="col-md-8 col-sm-8">\n' +
        '                                                                                            <textarea class="form-control" spellcheck="false" rows="4" v-model="message" ></textarea>\n' +
        '                                                                                        </div>\n' +
        '                                                                            </div>\n' +
        '                    \n' +
        '                    \n' +
        '                                                                    <div class="form-group row m-b-15">\n' +
        '                                                                                <label class="col-md-4 col-sm-4 col-form-label">Khoảng cách mỗi tin nhắn :</label>\n' +
        '                                                                                <div class="col-md-1 col-sm-1">\n' +
        '                                                                                            <input v-model="time" class="form-control" type="number"   data-parsley-type="url" placeholder="... ">\n' +
        '                                                                                        </div>\n' +
        '                                                                                <div class="col-md-1 col-sm-1" style="margin-top: 15px">\n' +
        '                                                                                            <span >(s).</span>\n' +
        '                                                                                        </div>\n' +
        '                                                                            </div>\n' +
        '                    \n' +
        '                    \n' +
        '                                                                    <div class="form-group row m-b-0">\n' +
        '                                                                                <label class="col-md-4 col-sm-4 col-form-label">&nbsp;</label>\n' +
        '                                                                                <div class="col-md-8 col-sm-8">\n' +
        '                            \n' +
        '                                                                                            <button v-show="submit" type="submit" @click="alarmACTION" class="btn btn-sm btn-outline-primary m-r-5">Bắt đầu</button>\n' +
        '                                                                                            <button v-show="cancel" type="submit" @click="cancelAlarm" class="btn btn-sm btn-danger m-r-5">Stop</button>\n' +
        '                                                                                        <button v-show="reset" @click="resetAction" class="btn btn-sm btn-outline-primary m-r-5" data-toggle="modal">Làm lại</button>\n' +
        '                            \n' +
        '                                                                                        <a href="#modal-dialog" class="btn btn-sm btn-outline-primary m-r-5" data-toggle="modal">Lịch sử</a>\n' +
        '                            \n' +
        '                                                                                            <code v-show="receiver_blank" class="animated flash" style="color:#ffbaa9;background: none;margin-top:20px">Bạn phải chọn ít nhất 1 người dể gửi.</code>\n' +
        '                                                                                            <code v-show="message_blank" class="animated flash" style="color:#ffbaa9;background: none;margin-top:20px">Bạn không được để trống nội dung tin nhắn.</code>\n' +
        '                                                                                            <code v-show="calendar_blank" class="animated flash" style="color:#ffbaa9;background: none;margin-top:20px">Bạn phải thiết lập thời gian hẹn giờ.</code>\n' +
        '                                                                                        <div class="modal fade" id="modal-dialog" >\n' +
        '                                                                                                <div class="modal-dialog"  style="max-width: 1000px;">\n' +
        '                                                                                                        <div class="modal-content">\n' +
        '                                                                                                                <div class="modal-header">\n' +
        '                                                                                                                        <h4 class="modal-title">Lịch sử</h4>\n' +
        '                                                                                                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n' +
        '                                                                                                                    </div>\n' +
        '                                                                                                                <div class="modal-body">\n' +
        '                                                                                                                        <div class="panel panel-inverse" style="background-color: #261313">\n' +
        '                                                \n' +
        '                                                                                                                                <div class="panel-body">\n' +
        '                                                                                                                                        <div class="table-responsive">\n' +
        '                                                                                                                                                <table  class="table table-striped table-bordered">\n' +
        '                                                                                                                                                        <thead>\n' +
        '                                                                                                                                                        <tr>\n' +
        '                                                                                                                                                                <th width="1%">STT</th>\n' +
        '                                                                                                                                                                <th class="text-nowrap">Đặt giờ</th>\n' +
        '                                                                                                                                                                <th class="text-nowrap">Nội dung</th>\n' +
        '                                                                                                                                                                <th class="text-nowrap">Khoảng cách</th>\n' +
        '                                                                                                                                                                <th class="text-nowrap">Người nhận</th>\n' +
        '                                                                                                                                                                <th class="text-nowrap">Trạng thái</th>\n' +
        '                                                                                                                                                                <th></th>\n' +
        '                                                                                                                                                                <th></th>\n' +
        '                                                                                                                                                            </tr>\n' +
        '                                                                                                                                                        </thead>\n' +
        '                                                                                                                                                        <tbody>\n' +
        '                                                                                                                                                        <tr v-for="(element,index) in  listAlarm" :key="index" style="color:white" class="odd gradeX">\n' +
        '                                                                                                                                                                <td width="1%" class="f-s-600">{{index+1}}</td>\n' +
        '                                                                \n' +
        '                                                                \n' +
        '                                                                                                                                                                <td  class="with-img">{{element.data.month}}/{{element.data.date}}/2019 {{element.data.hour}}:{{element.data.minute}}</td>\n' +
        '                                                                                                                                                                <td>{{element.data.message}} </td>\n' +
        '                                                                                                                                                                <td>{{element.data.time}} giây</td>\n' +
        '                                                                                                                                                                <td>{{element.data.receiver.length}} người</td>\n' +
        '                                                                                                                                                                <td><code v-if="element.status === true" style="color:green;padding:3px 3px">Hoàn thành</code><code v-if="element.status === false" style="padding:3px 3px">Chưa hoàn thành</code></td>\n' +
        '                                                                                                                                                                <td @click="editHistory(element)"><i class="fas fa-pencil-alt fa-fw trashremove cur" style="color: #90ff81;"></i></td>\n' +
        '                                                                                                                                                                <td  @click="deleteHistory(element)"><i class="fa fa-trash-alt trashremove cur" style="color: red;"></i></a></td>\n' +

        '                                                                                                                                                            </tr>\n' +
        '                                                            \n' +
        '                                                            \n' +
        '                                                            \n' +
        '                                                                                                                                                        </tbody>\n' +
        '                                                                                                                                                    </table>\n' +
        '                                                                                                                                            </div>\n' +
        '                                                                                                                                    </div>\n' +
        '                                                                                                                                <!-- end panel-body -->\n' +
        '                                                                                                                            </div>\n' +
        '                                                                                                                        <!-- end panel -->\n' +
        '                                                                                                                    </div>\n' +
        '                                        \n' +
        '                                        \n' +
        '                                                                                                            </div>\n' +
        '                                                                                                        <div class="modal-footer">\n' +
        '                                                                                                                <a id="closeHistory" href="javascript:;" class="btn btn-white cur" data-dismiss="modal">Đóng</a>\n' +
        '                                                                                                            </div>\n' +
        '                                                                                                    </div>\n' +
        '                                                                                            </div>\n' +
        '                            \n' +
        '                                                                                        </div>\n' +
        '                                                                            </div>\n' +
        '                                                                </div>\n' +
        '                                                    </div>\n' +
        '            \n' +
        '            \n' +
        '                                            <!-- end hljs-wrapper -->\n' +
        '                                        </div>\n' +
        '                            </div>\n' +
        '                    <div class="col-md-12">\n' +
        '                                <div class="row">\n' +
        '                                            <div class="col-md-4">\n' +
        '                                                        <div class="panel panel-inverse" >\n' +
        '                                                                    <br>\n' +
        '                                                                   <span style="float:left;margin-left:15px">Bạn đang quản lý {{listAcc.length}} tài khoản</span>\n' +
        '                                                                    <br>\n' +
        '                    \n' +
        '                                                                   <button style="margin-top: 20px;float:left;margin-left:15px;margin-bottom: 20px" class="btn btn-sm btn-default" @click="GetListFriend">Tìm bạn bè <i class="fa fa-angle-double-right"></i></button>\n' +
        '                                                                    <div class="panel-body">\n' +
        '                                                                                <div id="data-table-fixed-columns_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer">\n' +
        '                                                                                            <div class="table-responsive">\n' +
        '                                                                                                        <table  class="table table-striped table-bordered">\n' +
        '                                                                                                                    <thead>\n' +
        '                                                                                                                    <tr>\n' +
        '                                                                                                                                <th width="1%"></th>\n' +
        '                                                                                                                                <th width="1%" data-orderable="false"></th>\n' +
        '                                                                                                                                <th class="text-nowrap">Tài khoản</th>\n' +
        '                                                                                                                                <th class="text-nowrap"></th>\n' +
        '                                        \n' +
        '                                                                                                                            </tr>\n' +
        '                                                                                                                    </thead>\n' +
        '                                                                                                                    <tbody>\n' +
        '                                                                                                                    <tr v-for="(data,index) in listAcc" :key="index" >\n' +
        '                                        \n' +
        '                                        \n' +
        '                                                                                                                                <td width="1%" class="f-s-600 ">{{index+1}}</td>\n' +
        '                                                                                                                                <td width="1%" class="with-img"><img :src="data.FacebookImage" class="img-rounded height-30"></td>\n' +
        '                                                                                                                                <td><a target="_blank" :href="data.FacebookUrl">{{data.FacebookName}}</a></td>\n' +
        '                                                                                                                                <td><input :value="data.ID_sender" v-model="listAccSelect" type="checkbox"></td>\n' +
        '                                        \n' +
        '                                                                                                                            </tr>\n' +
        '                                    \n' +
        '                                                                                                                    </tbody>\n' +
        '                                                                                                                </table>\n' +
        '                                                                                                    </div>\n' +
        '                                                                                        </div>\n' +
        '                                                                            </div>\n' +
        '                    \n' +
        '                                                                    <!-- end panel-body -->\n' +
        '                                                                </div>\n' +
        '                                                    </div>\n' +
        '                                            <div class="col-md-8">\n' +
        '                                                    <div class="panel panel-inverse" >\n' +
        '                                                                <br>\n' +
        '                                                                <div class="col-md-12 col-sm-12">\n' +
        '                                                                            <div class="row">\n' +
        '                                                                                        <div class="col-md-6 col-sm-6">\n' +
        '                                                                                                    <span style="background: none;float:left;">Hiển thị <select style="background: none;border:1px solid #848280;color:#848280;padding-left:15px"  v-model="pagination">\n' +
        '                  <option value="50">50</option>\n' +
        '                  <option value="100">100</option>\n' +
        '                  <option value="500">500</option>\n' +
        '                  <option :value="filteredList.length">Tất cả</option>\n' +
        '        \n' +
        '                </select> bạn bè</span>\n' +
        '                                                                                        <br> <br>\n' +
        '                                \n' +
        '                                                                                                   <center> <button  v-show="vocativeDefaultShow" style="margin-top:0px;float: left;" class="btn btn-sm btn-default " @click="vocativeShow">Thay đổi xưng hô</button></center>\n' +
        '                                \n' +
        '                                                                                                   <center><button  v-show="vocativeChangeShow"  class="btn btn-sm btn-primary" style="float: left" @click="vocationSubmit">Lưu xưng hô</button></center>\n' +
        '                                                                                                    <br>\n' +
        '                                \n' +
        '                                                                                                </div>\n' +
        '                                                                                        <div class="col-md-6 col-sm-6">\n' +
        '                                \n' +
        '                                                                                                    <div class="row" style="float: right"><span style="margin-top:5px;margin-right: 10px">Tìm kiếm:</span> <input v-model="search" style="height:25px"  type="text" class="form-control col-md-8"></div>\n' +
        '                                \n' +
        '                                \n' +
        '                                \n' +
        '                                \n' +
        '                                                                                                </div>\n' +
        '                            \n' +
        '                                                                                    </div>\n' +
        '                                                                        </div>\n' +
        '                                                                <div>\n' +
        '                        \n' +
        '                                                                            <!-- begin panel -->\n' +
        '                                                                            <div class="panel panel-inverse" style="margin-top: 10px">\n' +
        '                            \n' +
        '                            \n' +
        '                                                                                        <div class="panel-body">\n' +
        '                                                                                                    <div class="table-responsive">\n' +
        '                                                                                                                <table  class="table table-striped table-bordered">\n' +
        '                                                                                                                            <thead>\n' +
        '                                                                                                                            <tr>\n' +
        '                                                                                                                                        <th width="1%">STT</th>\n' +
        '                                                                                                                                        <th width="1%" data-orderable="false"></th>\n' +
        '                                                                                                                                        <th class="text-nowrap">User ID</th>\n' +
        '                                                                                                                                        <th class="text-nowrap">Facebook</th>\n' +
        '                                                                                                                                        <th class="text-nowrap">Xưng hô</th>\n' +
        '                                                                                                                                        <th class="text-nowrap">Tình trạng</th>\n' +
        '                                                                                                                                        <th class="text-nowrap"><input @change="selectAll" type="checkbox" v-model="AlllistFriendSelect"></th>\n' +
        '                                            \n' +
        '                                                                                                                                    </tr>\n' +
        '                                                                                                                            </thead>\n' +
        '                                                                                                                            <tbody>\n' + 
    '                                                                                                                              <tr v-show="loadingFriendIcon" class="odd gradeX"><td style="border: none"></td><td></td> <td>  <td></td> </td> <td><img src="/img/loadingFriend.svg" alt="" ></td> <td></td> <td></td> </tr>     ' +

    '                                                                                                                            <tr v-for="(data,index) in filteredList" :key="index" v-if="index < pagination" class="odd gradeX">\n' +
        '                                                                                                                                        <td width="1%" class="f-s-600" style="color: white">{{index+1}}</td>\n' +
        '                                                                                                                                        <td width="1%" class="with-img"><img :src="data.profilePicture" class="img-rounded height-30"></td>\n' +
        '                                                                                                                                        <td>{{data.userID}}</td>\n' +
        '                                                                                                                                        <td>{{data.fullName}}</td>\n' +
        '                                                                                                                                        <td style="text-align: center"><input type="text" spellcheck="false" v-show="dataVocative" style="width: 100px;text-align: center" v-model="data.vocative"><span v-show="dataVocativeText">{{data.vocative}}</span></td>\n' +
        '                                                                                                                                        <td v-if="data.status === \'Chưa gửi\'" style="color:red">{{data.status}}</td>\n' +
        '                                                                                                                                        <td v-if="data.status === \'Đã gửi\'" style="color:green">{{data.status}}</td>\n' +
        '                                            \n' +
        '                                                                                                                                       <td><input type="checkbox" :value="data" v-model="listFriendSelect"></td>\n' +
        '                                            \n' +
        '                                                                                                                                    </tr>\n' +
        '                                        \n' +
        '                                        \n' +
        '                                                                                                                            </tbody>\n' +
        '                                                                                                                        </table>\n' +
        '                                                                                                            </div>\n' +
        '                                                                                                </div>\n' +
        '                                                                                        <!-- end panel-body -->\n' +
        '                                                                                    </div>\n' +
        '                        \n' +
        '                                                                        </div>\n' +
        '                    \n' +
        '                    \n' +
        '                                                                <!-- end panel-body -->\n' +
        '                                                            </div>\n' +
        '                                                </div>\n' +
        '                                        <!-- end panel -->\n' +
        '                                    </div>\n' +
        '                        </div>\n' +
        '            </div>',
    data(){
        return {
            pagination:50,
            listAcc:[],
            listAccSelect:[],

            listFriendSelect:[],
            message:'',
            hour:'',
            minute:'',
            date:'',
            aid:null,
            month:'',
            year:'',
            time:1,
            username:getCookie("email"),
            connect:true,
            submit:true,
            cancel:false,
            dataVocative:false,
            dataVocativeText:true,
            listFriend:[],
            search:'',
            time_blank:false,
            receiver_blank:false,
            message_blank:false,
            calendar_blank:false,
            thongbao:'',
            vocativeDefaultShow:true,
            vocativeChangeShow:false,
            fullname:'',
            calendar:null,
            dataChat:{},
            AlllistFriendSelect:false,
            active_el:0,
            notification:false,
            listAlarm:[],
            reset:true,



        }
    },

    created: async  function(){
        let chata = await axios.post('/api/getAllConversation');

        this.dataChat =  chata.data.result

        let timenow = new Date();
        this.hour = timenow.getHours();
        this.minute = timenow.getMinutes()+1;
        this.date = timenow.getDate();
        this.month = timenow.getMonth()+1;
        this.year = timenow.getFullYear();

        this.calendar =   this.year+'-'+pad(parseInt(this.month))+'-'+pad(parseInt(this.date))+'T'+pad(parseInt(this.hour))+':'+pad(parseInt(this.minute))


        let chat = await axios.post('/api/getAllAccount');

        if(chat.data.error === null){

            this.listAcc = chat.data.data;


        }else{
            window.location.href = "/"
        }
        let alarmDATA = await axios.post('/api/alarmData');

        if(alarmDATA.data.length > 0){



            if( alarmDATA.data.slice(-1)[0].status === true){
                let _ = this;
                _.listAccSelect = this.listAcc.map(e=>{
                    return e.ID_sender
                });
                socket.emit('GetListFriend',{
                    list: _.listAccSelect
                })
                this.submit = true;
                this.cancel = false;
                this.hour = timenow.getHours();
                this.minute = timenow.getMinutes()+1;
                this.date = timenow.getDate();
                this.month = timenow.getMonth()+1;

                this.message = null;
                this.aid = null;
                this.thongbao = 'Đã gửi tin nhắn lúc : '+alarmDATA.data.slice(-1)[0].data.hour+'h'+alarmDATA.data.slice(-1)[0].data.minute+'p Ngày '+alarmDATA.data.slice(-1)[0].data.date+'/'+alarmDATA.data.slice(-1)[0].data.month

            }else {
                this.submit = false;
                this.reset = false;
                this.cancel = true;
                this.hour = alarmDATA.data.slice(-1)[0].data.hour;
                this.minute = alarmDATA.data.slice(-1)[0].data.minute;
                this.date = alarmDATA.data.slice(-1)[0].data.date;
                this.month = alarmDATA.data.slice(-1)[0].data.month;
                this.time = alarmDATA.data.slice(-1)[0].data.time;
                this.calendar =   this.year+'-'+pad(parseInt(this.month))+'-'+pad(parseInt(this.date))+'T'+pad(parseInt(this.hour))+':'+pad(parseInt(this.minute))


                this.message = alarmDATA.data.slice(-1)[0].data.message;
                this.aid = alarmDATA.data.slice(-1)[0].aid;
                store.state.listFriend = alarmDATA.data.slice(-1)[0].data.receiver;
                this.listFriendSelect = alarmDATA.data.slice(-1)[0].data.receiver;
            }
            return this.listAlarm = alarmDATA.data

        }else {
            let _ = this;
            _.listAccSelect = this.listAcc.map(e=>{
                return e.ID_sender
            });
            socket.emit('GetListFriend',{
                list: _.listAccSelect
            })
        }



    },
    computed: {
        container(){
            return store.state
        },
        filteredList() {
            let _ = this;
            return store.state.listFriend.filter(e=>{
                return e.fullName.toLowerCase().includes(_.search.toLowerCase())
            })

        },
        loadingFriendIcon(){
            if(store.state.listFriend.length >0){
                return false
            }else{
                return true
            }
        }


    },
    beforeMount:function(){
        let _ = this;
        socket.on('callback_listFriend',function(result){
            let listID =  store.state.listFriend.map(e=>e.userID);
            result.data = result.data.filter(e=>{
                if(listID.includes(e.userID) === false){
                    e.status = 'Chưa gửi';
                    return e
                }
            });
            return store.state.listFriend = store.state.listFriend.concat(result.data)
        });
        socket.on('perfect',function (result) {
            let seentrue = result.data.receiver.filter(e=>{
                if(e.status === 'Đã gửi'){
                    return e;
                }
            });
            if(seentrue.length === result.data.receiver.length){
                _.listAlarm = _.listAlarm.map(e=>{
                    if(e.aid === result.data.aid){
                        e.status = true;
                    }
                    return e
                });
                _.cancel = false;
                _.submit = true;
                _.reset = true;
                _.resetAction()
            }
            return _.listFriend = result.data.receiver
        })


    },
    mounted:function(){

        let name = this.username;
        let _ = this;

        $("form").change(function(evt){
            evt.preventDefault();
            var formData = new FormData($(this)[0]);
            $.ajax({
                url: '/api/uploadIMAGE',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                success: function (response) {

                    socket.emit('sendMessage',{
                        userBoss:name,
                        ID_receiver:store.state.conversation.ID_receiver,
                        type:'attachments',
                        url:response,
                        ID_sender:store.state.conversation.ID_sender
                    },function(callback){

                        return store.commit('pushConversation',callback.data)

                    });
                }
            });
            return false;
        });
    },
    methods:{
        GetListFriend:function(){
            this.receiver_blank = false;
            let _ = this;

            socket.emit('GetListFriend',{
                list: _.listAccSelect
            })

        },

        selectAll:async function(){
            if(this.AlllistFriendSelect  === true){
                return this.listFriendSelect = store.state.listFriend


            }else{
                return this.listFriendSelect = [];

            }
        },
        alarmACTION:async function(){
            let calendar = this.calendar;
            let _ = this;


            let month = calendar.split('T')[0].split('-')[1];
            let date = calendar.split('T')[0].split('-')[2];
            let HourAndMinute = calendar.split('T')[1];
            let hour = HourAndMinute.split(':')[0];
            let minute = HourAndMinute.split(':')[1];
            this.thongbao = '';
            if(this.time === ''){
                this.time_blank = true;
                return false;
            }
            if(this.calendar.trim() === ''){
                return this.calendar_blank = true;
            }
            if(this.message === ''){
                return this.message_blank = true;
            }
            if (this.listFriendSelect.length === 0){
                this.receiver_blank = true;
                return false;
            }
            let setAlarm = await axios.post('/api/hen-gio',{data:{aid:this.aid,hour:hour,minute:minute,date:date,month:month,time:this.time,message:this.message,receiver:this.listFriendSelect}});
            this.aid =setAlarm.data;
            this.listAlarm =  this.listAlarm.filter(e=>{
                if(e.aid !== _.aid){
                    return e
                }
            })
            this.listAlarm.push({aid:this.aid,data:{aid:this.aid,hour:hour,minute:minute,date:date,month:month,time:this.time,message:this.message,receiver:this.listFriendSelect},status:false})

            socket.emit('sendMessFriend',{aid:this.aid,hour:hour,minute:minute,date:date,month:month,time:this.time,message:this.message,receiver:this.listFriendSelect})
            store.state.listFriend = this.listFriendSelect
            this.cancel = true;
            this.submit = false;
            this.reset = false;


        },

        cancelAlarm:async function(){

            await axios.post('/api/xoa-hen-gio',{aid:this.aid});
            this.cancel = false;
            this.submit = true;
            this.reset = true

        },
        vocativeShow:async function(){
            this.vocativeDefaultShow = false;
            this.vocativeChangeShow = true;
            this.dataVocativeText = false;
            this.dataVocative = true;
        },
        vocationSubmit:async function(){
            let vocaArrr = this.filteredList.filter(e=>{
                if(e.vocative !== 'Anh' && e.vocative !== 'Chị'){
                    return e
                }
            });
            let vocativeSave = await axios.post('/api/vocative',{vocative:vocaArrr});
            this.vocativeDefaultShow = true;
            this.vocativeChangeShow = false;
            this.dataVocativeText = true;
            this.dataVocative = false;
        },
        history:async function(){
            // alert('hello world')
        },
        editHistory:async function(data){
            $("a#closeHistory").trigger("click");
            this.hour = data.data.hour;
            this.minute = data.data.minute;
            this.date = data.data.date;
            this.month = data.data.month;
            this.time = data.data.time;

            this.calendar =   this.year+'-'+pad(parseInt(this.month))+'-'+pad(parseInt(this.date))+'T'+pad(parseInt(this.hour))+':'+pad(parseInt(this.minute))

            this.message = data.data.message;
            this.aid = data.aid;
            store.state.listFriend = data.data.receiver;
            this.listFriendSelect = data.data.receiver;

        },
        deleteHistory:async function(data){
            await axios.post('/api/xoa-hen-gio',{aid:data.aid});
            return this.listAlarm = this.listAlarm.filter(e=>{

                if(e.aid !== data.aid){
                    return e
                }
            })
        },
        resetAction:async function(){
            let timenow = new Date();

            this.hour = timenow.getHours();
            this.minute = timenow.getMinutes()+1;
            this.date = timenow.getDate();
            this.month = timenow.getMonth()+1;

            this.message = null;

            let _ = this;
            _.listAccSelect = this.listAcc.map(e=>{
                return e.ID_sender
            });
            socket.emit('GetListFriend',{
                list: _.listAccSelect
            })
            this.listFriendSelect = [];
        }


    },
});
Vue.component('addcookie', {
    template:'<div class="content content-full-width inbox animated fadeIn" id="content">\n' +
        '        <div class="row">\n' +
        '\n' +
        '            <div class="col-lg-12 ui-sortable ">\n' +
        '                <div class="panel panel-inverse">\n' +
        '                    <!-- begin panel-heading -->\n' +
        '                    <div class="panel-heading ui-sortable-handle" style="background-color: #2c3e50">\n' +
        '                        <div class="panel-heading-btn">\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                        </div>\n' +
        '                        <h4  class="panel-title animated flash">Thêm tài khoản </h4>\n' +
        '                    </div>\n' +
        '                    <!-- end panel-heading -->\n' +
        '                    <!-- begin panel-body -->\n' +
        '\n' +
        '                    <div class="panel-body panel-form">\n' +
        '                        <div class="form-horizontal form-bordered">\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label">Cookie</label>\n' +
        '                                <div class="col-md-8">\n' +
        '                                    <div class="input-group date" >\n' +
        '                                        <textarea spellcheck="false" v-model="cookie" class="form-control" rows="3"></textarea>\n' +
        '\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label"></label>\n' +
        '                                <div class="col-md-8">\n' +
        '                                    <button v-show="buttonAdd" class="btn btn-primary" @click="addfacebookaccount"><i class="fa fa-paper-plane"></i> Thêm</button>\n' +
        '                                    <span v-show="loadingAdd"><img src="/img/load.svg" alt=""> Đang xử lí <span class="animated flash infinite delay-1s"> . . .  </span></span>\n' +
        '                                    <button style="margin-left: 10px" class="btn btn-danger">Hủy</button>\n' +
        '                                    <code v-show="errorShow">{{error}}</code>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <!-- end panel-body -->\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="panel panel-inverse">\n' +
        '            <div class="panel-body">\n' +
        '                <div class="table-responsive">\n' +
        '                <table class="table table-striped table-bordered">\n' +
        '                    <thead>\n' +
        '                    <tr>\n' +
        '                        <th width="1%">STT</th>\n' +
        '                        <th class="text-nowrap"></th>\n' +
        '\n' +
        '                        <th class="text-nowrap">ID</th>\n' +
        '                        <th class="text-nowrap">Facebook</th>\n' +
        '\n' +
        '                        <th class="text-nowrap">Tình trạng</th>\n' +
        '                        <th class="text-nowrap"></th>\n' +
        '                    </tr>\n' +
        '                    </thead>\n' +
        '                    <tbody>\n' +
        '                    <tr class="odd gradeX" v-for="(data,index) in container.account" :key="index">\n' +
        '                        <td style="color:white" width="1%" class="f-s-600 ">{{index+1}}</td>\n' +
        '                        <td><img :src="data.FacebookImage" alt=""></td>\n' +
        '                        <td>{{data.ID_sender}}</td>\n' +
        '                        <td><a target="_blank" :href="data.FacebookUrl">{{data.FacebookName}}</a></td>\n' +
        '                        <td v-if="data.status === \'active\'"><i class="fa fa-check-square" style="color:#93ff68"></i> <span style="color:#00ff00">{{data.status}}</span></td>\n' +
        '                        <td v-if="data.status === \'Cookie đã hết hạn.Vui lòng lấy lại Cookie\' || data.status === \'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint\'"><i class="fa fa-check-square" style="color:red"></i> <span class="animated infinite flash" style="color:red">{{data.status}}</span></td>\n' +
        '\n' +
        '\n' +
        '                        <td><center><a :href="\'#ex\'+ index" rel="modalPro:open"><i class="fa fa-trash-alt trashremove" style="color:red" ></i></a></center> </td>\n' +
        '<div :id="\'ex\'+index" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="removeCookie(data.ID_sender)">Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close"  >Hủy</a></center> \n' +
        '    </div>\n' +
        '\n' +


        '                    </tr>\n' +
        '\n' +
        '\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <!-- end panel-body -->\n' +
        '        </div>\n' +
        '        <!-- end panel -->\n' +
        '    </div>',
    data(){
        return {

            store:[],
            cookie:'',
            buttonAdd:true,
            loadingAdd:false,
            error:'',
            errorShow:false



        }
    },

    created:async function(){


        let allAccount = await axios.post('/api/getAllAccount');
        let result = allAccount.data.data.filter(e=>{
            if(e.type === 'cookie'){
                return e
            }
        });
        return store.state.account = result




    },
    computed: {
        container () {
            return store.state
        }
    },
    methods:{

        addfacebookaccount:async function(){
            this.buttonAdd = false;
            this.loadingAdd = true;
            let _ = this;

            let result = this.cookie.split('\n').map(e=>{
                let objResult = {};
                this.cookie.split(';').filter(e=>{
                    if(e.trim().length >0){
                        return e
                    }
                }).map(e=>{
                    objResult[e.split('=')[0].trim()] = e.split('=')[1].trim()
                });
                return objResult
            });

            this.cookie = '';

            let send = await axios.post('/api/account',{type:'cookie',data:result})

            if(send.data.error === null){

                this.container.account.push(send.data)
            }else {
                this.errorShow = true;
                this.error = send.data.error;
                setTimeout(function () {
                    _.error = '';
                },15000)
            }
            this.buttonAdd = true;
            this.loadingAdd = false;


        },
        removeCookie:async function(id){


            let del = await axios.post('/api/deleteAccount',{ID_sender:id});
            store.state.account = store.state.account.filter(e=>{
                if(e.ID_sender !== id){
                    return e
                }
            })


        }


    },

});
Vue.component('addpassword', {
    template:' <div class="content content-full-width inbox animated fadeIn" id="content">\n' +
        '        <div class="row">\n' +
        '\n' +
        '            <div class="col-lg-12 ui-sortable ">\n' +
        '                <div class="panel panel-inverse">\n' +
        '                    <!-- begin panel-heading -->\n' +
        '                    <div class="panel-heading ui-sortable-handle" style="background-color: #2c3e50">\n' +
        '                        <div class="panel-heading-btn">\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                        </div>\n' +
        '                        <h4  class="panel-title animated flash">Thêm tài khoản Facebook</h4>\n' +
        '                    </div>\n' +
        '                    <!-- end panel-heading -->\n' +
        '                    <!-- begin panel-body -->\n' +
        '\n' +
        '                    <div class="panel-body panel-form">\n' +
        '                        <div class="form-horizontal form-bordered">\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label">Tài khoản</label>\n' +
        '                                <div class="col-md-8">\n' +
        '                                    <div class="input-group date" >\n' +
        '                                        <input type="text" v-model="username" placeholder="Email hoặc Số điện thoại tài khoản facebook" class="form-control">\n' +
        '                                        <div class="input-group-addon">\n' +
        '                                            <i class="fa fa-user"></i>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label">Mật khẩu</label>\n' +
        '\n' +
        '                                <div class="col-md-8">\n' +
        '                                    <div class="input-group date" >\n' +
        '                                        <input type="text" v-model="password" placeholder="Mật khẩu tài khoản" class="form-control">\n' +
        '                                        <span class="input-group-addon">\n' +
        '\t\t\t\t\t\t\t\t\t\t\t<i class="fa fa-key"></i>\n' +
        '\t\t\t\t\t\t\t\t\t\t\t</span>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label">Ngày/Tháng/Năm sinh</label>\n' +
        '                                <div class="col-md-8">\n' +
        '                                    <div class="row row-space-10">\n' +
        '                                        <div class="col-xs-6">\n' +
        '                                            <input type="number" v-model="date" min="1" max="31" class="form-control"  placeholder="Ngày">\n' +
        '\n' +
        '                                        </div>\n' +
        '                                        <div class="col-xs-6">\n' +
        '                                            <input type="number" v-model="month" min="01" max="12" class="form-control"  placeholder="Tháng">\n' +
        '                                        </div>\n' +
        '                                        <div class="col-xs-6">\n' +
        '                                            <input type="number" v-model="year" min="01" max="9999" class="form-control"  placeholder="Năm ">\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="form-group row">\n' +
        '                                <label class="col-md-4 col-form-label"></label>\n' +
        '                                <div class="col-md-8">\n' +
        '\n' +
        '                                    <button v-show="buttonAdd" class="btn btn-primary" @click="addfacebookaccount"><i class="fa fa-paper-plane"></i> Thêm</button>\n' +
        '                                    <span v-show="loadingAdd"><img src="/img/load.svg" alt=""> Đang xử lí <span class="animated flash infinite delay-1s"> . . .  </span></span>\n' +
        '                                    <button class="btn btn-danger">Hủy</button>\n' +
        '\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <!-- end panel-body -->\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '        <div class="panel panel-inverse">\n' +
        '            <div class="panel-body">\n' +
        '                <div class="table-responsive">\n' +
        '                <table class="table table-striped table-bordered">\n' +
        '                    <thead>\n' +
        '                    <tr>\n' +
        '                        <th width="1%">STT</th>\n' +
        '                        <th class="text-nowrap"></th>\n' +
        '                        <th class="text-nowrap">Tài khoản</th>\n' +
        '                        <th class="text-nowrap">Mật Khẩu</th>\n' +
        '                        <th class="text-nowrap">Facebook</th>\n' +
        '\n' +
        '                        <th class="text-nowrap text-center">Ngày/Tháng/Năm sinh</th>\n' +
        '                        <th class="text-nowrap">Tình trạng</th>\n' +
        '                        <th class="text-nowrap"></th>\n' +
        '                    </tr>\n' +
        '                    </thead>\n' +
        '                    <tbody>\n' +
        '                    <tr class="odd gradeX" v-for="(data,index) in store" :key="index">\n' +
        '                        <td width="1%" class="f-s-600 text-inverse">{{index+1}}</td>\n' +
        '                        <td><img :src="data.FacebookImage" alt=""></td>\n' +
        '                        <td>{{data.username}}</td>\n' +
        '                        <td>{{data.password}}</td>\n' +
        '                        <td><a :href="data.FacebookUrl">{{data.FacebookName}}</a></td>\n' +
        '\n' +
        '                        <td class="text-center">{{data.date+\'/\'+data.month+\'/\'+data.year}}</td>\n' +
        '                        <td v-if="data.status === \'active\'"><i class="fa fa-check-square" style="color:green"></i> <span style="color:green">{{data.status}}</span></td>\n' +
        '                        <td v-if="data.status === \'Thông tin Tài khoản mật khẩu không chính xác hoặc đã bị checkpoint\'"><i class="fa fa-check-square" style="color:#800a05"></i> <span class="animated infinite flash" style="color:#800d0b">{{data.status}}</span></td>\n' +
        '\n' +
        '                        <td><center><i @click="remove(data.username)" class="fa fa-trash-alt trashremove" style="color:red"></i></center> </td>\n' +
        '                    </tr>\n' +
        '\n' +
        '\n' +
        '                    </tbody>\n' +
        '                </table>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <!-- end panel-body -->\n' +
        '        </div>\n' +
        '        <!-- end panel -->\n' +
        '    </div>',
    data(){
        return {
            username:'',
            password:'',
            date:'',
            month:'',
            year:'',

            store:[],
            buttonAdd:true,
            loadingAdd:false



        }
    },

    created:async function(){


        let allAccount = await axios.post('/api/getAllAccount');

        let result = allAccount.data.data.filter(e=>{
            if(e.type === 'pass'){
                return e
            }
        });

        this.store = result;



    },
    methods:{

        addfacebookaccount:async function(){
            this.buttonAdd = false;
            this.loadingAdd = true;
            let send = await axios.post('/api/account',{type:'pass',username:this.username,password:this.password,date:this.date,month:this.month,year:this.year});
            if(send.data.error === null){
                this.store.push(send.data)
            }else {
                alert(send.data.error)
            }
            this.username = '';
            this.password = '';
            this.date = '';
            this.month = '';
            this.year  = '';
            this.buttonAdd = true;
            this.loadingAdd = false;
        },
        remove:async function(username){


            let send = await axios.post('/api/deleteAccount',{ID_sender:username});

            this.store = this.store.filter(e=>{
                if(e.ID_sender !== username){
                    return e
                }
            })


        }


    },
});
Vue.component('autochat', {
    template:' <div class="content content-full-width inbox  animated fadeIn" id="content">\n' +
        '        <div class="panel panel-inverse">\n' +
        '            <!-- begin panel-heading -->\n' +
        '            <div class="panel-heading ui-sortable-handle" style="background-color: #2c3e50">\n' +
        '                <div class="panel-heading-btn">\n' +
        '                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                </div>\n' +
        '                <h4  class="panel-title">Trả lời tin nhắn tự động</h4>\n' +
        '            </div>\n' +
        '            <div class="panel-body">\n' +
        '                <div class="form-horizontal" data-parsley-validate="true" name="demo-form" novalidate="">\n' +
        '                    <div class="form-group row m-b-15">\n' +
        '                        <label class="col-md-4 col-sm-4 col-form-label">Danh sách từ khóa * :</label>\n' +
        '                        <div class="col-md-2 col-sm-2">\n' +
        '                            <input @keyup.13="addKey" autocomplete="off" class="form-control"\n' +
        '                                   data-parsley-required="true"\n' +
        '                                   name="fullname" placeholder="Từ khóa" spellcheck="false" type="text"\n' +
        '                                   v-model="keyword">\n' +
        '                        </div>\n' +
        '                        <div class="col-md-6 col-sm-6">\n' +
        '                            <div class="form-control" data-parsley-required="true"\n' +
        '                                 style="overflow-x: scroll;overflow-y: hidden;padding-right: 20px"\n' +
        '                                 type="text">\n' +
        '\n' +
        '                                <span class="label label-inverse" style="margin-right:5px;margin-top:5px"\n' +
        '                                      v-for="data in content.keyList">{{data}} <span @click="removeKey(data)"\n' +
        '                                                                                     class="removeKey">x</span></span>\n' +
        '\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +

        '                    </div>\n' +
        '\n' +
        '                    <div class="form-group row m-b-15">\n' +
        '                        <label class="col-md-4 col-sm-4 col-form-label" for="message">Nội dung :</label>\n' +
        '                        <div class="col-md-8 col-sm-8">\n' +
        '                            <textarea  v-model="content.message" class="form-control" data-parsley-range="[20,200]" id="message" name="message"\n' +
        '                                      placeholder="Nội dung"\n' +
        '                                      rows="4" spellcheck="false"></textarea>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="form-group row m-b-15">\n' +
        '                        <label class="col-md-4 col-sm-4 col-form-label" for="message">Tài khoản :</label>\n' +
        '                        <div class="col-md-8 col-sm-8">\n' +
        '                            <div class="form-check">\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                <span :key="index" v-for="(data,index) in account" style="margin-right: 30px">\n' +
        '\n' +
        '                                     <input  v-model="content.select" :value="data.ID_sender" class="form-check-input" data-parsley-mincheck="2"\n' +
        '                                            data-parsley-multiple="mincheck"\n' +
        '                                            id="mincheck" required="" spellcheck="false" type="checkbox"\n' +
        '                                            value="foo">\n' +
        '                                <label class="form-check-label">{{data.FacebookName}}</label>\n' +
        '\n' +
        '\n' +
        '                                </span>\n' +
        '\n' +
        '                            </div>\n' +
        '\n' +
        '\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="form-group row m-b-15">\n' +
        '                        <label class="col-md-4 col-sm-4 col-form-label" for="message"></label>\n' +
        '                        <div class="col-md-2 col-sm-2">\n' +
        '                        <div class="form-check">\n' +
        '\n' +
        '                            <button v-show="addDisplay" @click="addContent" class="btn btn-outline-danger" style="margin-left: -20px">Add</button>\n' +
        '                            <button v-show="updateDisplay" @click="updateContent" class="btn btn-outline-primary"  style="margin-left: -20px">Update</button>\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                        </div>\n' +
        '                        </div>\n' +
        '                        <div v-show="errorShow" class="col-md-6 col-sm-6">\n' +
        '                            <div class="form-check">\n' +
        '                                <br>\n' +
        '                                <code style="background: none;color:white;border:1px solid red;margin-left: -20px;" class="animated flash" v-show="errorShow">{{error}}</code>\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="panel-body">\n' +
        '                <div class="dataTables_wrapper form-inline dt-bootstrap no-footer" id="data-table-default_wrapper">\n' +
        '\n' +
        '                    <div class="row">\n' +
        '                        <div class="col-sm-6">\n' +
        '                        </div>\n' +
        '                        <div class="col-sm-6">\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="row">\n' +
        '                        <div class="col-sm-12">\n' +
        '                            <div class="table-responsive">\n' +
        '                                <table class="table table-striped table-bordered">\n' +
        '                                    <thead>\n' +
        '                                    <tr>\n' +
        '                                        <th width="1%">STT</th>\n' +
        '                                        <th class="text-nowrap"></th>\n' +
        '                                        <th class="text-nowrap">ID</th>\n' +
        '                                        <th class="text-nowrap">Facebook</th>\n' +
        '                                        <th class="text-nowrap">Tình trạng</th>\n' +
        '                                        <th class="text-nowrap"></th>\n' +
        '                                    </tr>\n' +
        '                                    </thead>\n' +
        '                                    <tbody>\n' +
        '                                    <tr  v-for="(data,index) in contentArr" :key="index">\n' +
        '                                        <td >{{index+1}}</td>\n' +
        '                                        <td>\n' +
        '                                            <span v-for="data1 in data.keyList" style="margin-right:5px" class="label label-inverse">{{data1}}</span>\n' +
        '\n' +
        '                                        </td>\n' +
        '                                        <td>{{data.message}}</td>\n' +
        '                                        <td><span v-for="data2 in data.select">{{findName(data2)}},</span></td>\n' +
        '                                        <td><i @click="editContent(data)" class="cur fa fa-edit text-danger"></i></td>\n' +
        '                                        <td><a href="#ex1" rel="modalPro:open"><i class="cur fa fa-trash text-primary"></i></a></td>\n' +
        '<div id="ex1" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="removeContent(data)">Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close"  >Hủy</a></center> \n' +
        '    </div>\n' +
        '                                    </tr>\n' +
        '                                    </tbody>\n' +
        '                                </table>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                    <div class="row">\n' +
        '                        <div class="col-sm-7">\n' +
        '                            <div class="dataTables_paginate paging_simple_numbers" id="data-table-default_paginate" v-show="pagination">\n' +
        '                                <ul class="pagination">\n' +
        '                                    <li class="paginate_button previous disabled" id="data-table-default_previous"><a\n' +
        '                                            aria-controls="data-table-default" data-dt-idx="0" href="#" tabindex="0">Previous</a>\n' +
        '                                    </li>\n' +
        '                                    <li class="paginate_button active"><a aria-controls="data-table-default"\n' +
        '                                                                          data-dt-idx="1"\n' +
        '                                                                          href="#" tabindex="0">1</a></li>\n' +
        '                                    <li class="paginate_button "><a aria-controls="data-table-default" data-dt-idx="2"\n' +
        '                                                                    href="#" tabindex="0">2</a></li>\n' +
        '                                    <li class="paginate_button "><a aria-controls="data-table-default" data-dt-idx="3"\n' +
        '                                                                    href="#" tabindex="0">3</a></li>\n' +
        '                                    <li class="paginate_button "><a aria-controls="data-table-default" data-dt-idx="4"\n' +
        '                                                                    href="#" tabindex="0">4</a></li>\n' +
        '                                    <li class="paginate_button "><a aria-controls="data-table-default" data-dt-idx="5"\n' +
        '                                                                    href="#" tabindex="0">5</a></li>\n' +
        '                                    <li class="paginate_button "><a aria-controls="data-table-default" data-dt-idx="6"\n' +
        '                                                                    href="#" tabindex="0">6</a></li>\n' +
        '                                    <li class="paginate_button next" id="data-table-default_next"><a\n' +
        '                                            aria-controls="data-table-default"\n' +
        '                                            data-dt-idx="7"\n' +
        '                                            href="#"\n' +
        '                                            tabindex="0">Next</a>\n' +
        '                                    </li>\n' +
        '                                </ul>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '\n' +
        '\n' +
        '            <!-- end panel -->\n' +
        '        </div>\n' +
        '        <!-- end panel -->\n' +
        '    </div>',
    data(){
        return {
            updateDisplay:false,
            addDisplay:true,
            keyword:'',
            name:'testing',
            account:[],
            error:'test',
            content:{
                keyList:[],
                message:'',
                select:[]
            },
            contentArr:[],
            pc:true,
            mobile:false,
            errorShow:false,
            findName:(id)=>{
                return this.account.filter(e=>{
                    if(e.ID_sender === id){
                        return e
                    }
                })[0].FacebookName
            },
            fullname: '',
            pagination:false
        }
    },

    created: async  function(){

        let width = window.innerWidth;

        if(width <= 768){

            this.pc = false;
            this.mobile = true;
        }else {
            this.pc = true;
            this.mobile = false;
        }

        let result = await axios.post('/api/getAutoChat');
        this.contentArr = result.data.chatBotKey;
        return this.account = result.data.AllAccount
    },
    computed: {

        filteredList() {
            let _ = this;
            return this.listFriend.filter(e=>{
                return e.fullName.toLowerCase().includes(_.search.toLowerCase())
            })

        },



    },
    beforeMount:function(){


    },
    mounted:function(){


    },
    methods:{
        addKey:function () {
            if(this.keyword.length > 0){
                this.content.keyList.push(this.keyword);
                this.keyword = '';
            }else{
                this.errorShow = true;
                return this.error = 'Bạn không được thêm từ khóa trống'
            }


        },
        format:function(){
            this.keyword = '';
        },
        removeKey:function(data){
            this.content.keyList = this.content.keyList.filter(e=>{

                if(e !== data){
                    return e
                }
            })
            return this.content
        },
        addContent:async function () {
            this.errorShow = false;
            if(this.content.keyList.length === 0){
                this.errorShow = true;
                return this.error = 'Bạn không được để trống list từ khóa'
            }
            if(this.content.select.length === 0){
                this.errorShow = true;
                return this.error = 'Bạn phải chọn ít nhất 1 tài khoản để áp dụng chế độ này'
            }
            if(this.content.message === ''){
                this.errorShow = true;
                return this.error = 'Bạn phải chọn nội dung trả lời tự động'
            }

            let sendContent = await axios.post('/api/addAutoChat', this.content);
            this.contentArr = sendContent.data;
            return this.content = {}
        },
        editContent:function(data){
            this.updateDisplay = true;
            this.addDisplay = false;
            this.content = data
        },
        removeContent:async function(data){

            let sendKeyDelete = await axios.post('/api/deleteAutoChat',{KeySecure:data.KeySecure});
            return this.contentArr = this.contentArr.filter(e=>{
                if(e.KeySecure !== data.KeySecure){
                    return e
                }
            })

        },
        updateContent:async function(){
            let sendContent = await axios.post('/api/updateAutoChat',this.content);
            return location.reload();
        }

    },
});
Vue.component('scenario', {
    template:'  <div class="content content-full-width inbox  animated fadeIn " id="content">\n' +
        '\n' +
        '            <div class="panel panel-inverse" >\n' +
        '                <div class="panel-heading ui-sortable-handle" style="background-color: #2c3e50">\n' +
        '                    <div class="panel-heading-btn">\n' +
        '                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                    </div>\n' +
        '                    <h4  class="panel-title">Kịch bản tin nhắn</h4>\n' +
        '                </div>\n' +
        '                <div class="panel-body">\n' +
        '                    <div class="form-horizontal" >\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label" >Chương trình * :</label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <div class="row">\n' +
        '                                    <div  v-for="(data,index) in AllData" :key="index" @click="scenarioSection(data)" class="col-md-2 cur">\n' +
        '                                        <div class="alert alert-secondary fade show m-b-10" style="background-color: #2c3e50;border:1px solid #8dc2ff ">\n' +
        '                                           <span v-if="data.nameScenario.length < 12"> {{data.nameScenario}}</span>\n' +
        '                                           <span v-if="data.nameScenario.length >= 12"> {{data.nameScenario.slice(0,8)}} ...</span>\n' +

        '                                        </div>\n' +
        '\n' +
        '                                    </div>\n' +
        '                                    <div @click="addScenario" class="col-md-2 cur" >\n' +
        '                                        <div class="alert alert-dark fade show m-b-10" style="background-color: #2c3e50;">\n' +
        '                                            <center style="color:white"><i class="fa fa-plus-square"></i></center>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label">Cú pháp * :</label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <input v-model="main.syntax" @keyup="textScenario" spellcheck="false" autocomplete="off" class="form-control" type="text"  name="email" data-parsley-type="email" placeholder="Cú pháp ... " data-parsley-required="true">\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label">Tên kịch bản :</label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <input v-model="main.nameScenario" @keyup="textScenario" spellcheck="false" autocomplete="off" class="form-control" type="text"  name="email" data-parsley-type="email" placeholder="Tên kịch bản ... " data-parsley-required="true">\n' +
        '\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label">Áp dụng :</label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <span style="margin-right: 20px" v-for="data in allAccount">\n' +
        '\n' +
        '  <input style="margin-top:15px" type="checkbox" :id="data.FacebookName" :value="data.ID_sender" v-model="main.checkedNames">\n' +

        '  <label style=";margin-left:7px" :for="data.FacebookName">{{data.FacebookName}}</label>\n' +
        '                        </span>\n' +
        '\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label">Nội dung :</label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <div  class="table-responsive">\n' +
        '                                    <table class="table table-condensed">\n' +
        '                                        <thead>\n' +
        '                                        <tr>\n' +
        '                                            <th>Thời gian</th>\n' +
        '                                            <th>Nội dung</th>\n' +
        '                                            <th>Hình ảnh</th>\n' +
        '                                            <th></th>\n' +
        '                                        </tr>\n' +
        '                                        </thead>\n' +
        '                                        <tbody>\n' +
        '\n' +
        '                                        <tr v-for="(element,index) in main.dataArr" :key="index">\n' +
        '                                            <td style="padding-top:20px">\n' +
        '                                                <code style="background: none;color:#ffa189c;border:1px solid #5e5f61;border-radius:2px;padding:5px 5px" v-if="element.time == 0 && index == 0">Bắt đầu</code>'+
        '                                                ' +
        '                                                <input type="number" v-model="element.time" v-if="index  != 0" style="width: 40px;height:20px;text-align: center" min="1" max="999">\n' +

        '<select v-if="index  != 0" v-model="element.timeName">\n' +
        '                                                    <option disabled value="Phút">Phút</option>\n' +
        '                                                    <option v-for="name in timeNameArr" :value="name">{{name}}</option>\n' +
        '                                                </select>\n' +
        '\n' +
        '\n' +
        '                                            </td>\n' +
        '                                            <td><textarea data-autoresize type="text" rows="7" v-model="element.text" spellcheck="false" class="form-control"></textarea></td>\n' +
        '                                            <td  @click="markIndex(element)"> <label :for="\'upload-photo-\'+ind"><i style="margin-top:20px;margin-left:20px" v-if="element.base64img === null" class="cur fas fa-camera-retro fa-lg"></i><img\n' +
        '                                                    v-if="element.base64img !== null" width="30px" height="30px" :src="element.base64img"  alt=""></label></td>\n' +
        '\n' +
        '                                            <input style="display: none" @change="uploadFile"  type="file"  name="photo" :id="\'upload-photo-\'+ind" />\n' +
        '                                            <td ><a v-bind:href="\'#bind\' + index"  rel="modalPro:open"><i style="margin-top:20px" class="fa fa-trash text-danger cur"></i></a></td>\n' +

        '<div :id="\'bind\' + index" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="removeSceComponent(element)">Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close"  >Hủy</a></center> \n' +
        '    </div>\n' +


        '                                        </tr>\n' +

        '                                        <tr><td><button class="btn btn-default" @click="addSce">Thêm</button></td></tr>\n' +
        '\n' +
        '\n' +
        '                                        </tbody>\n' +
        '                                    </table>\n' +
        '                                </div>\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '\n' +
        '                        <div class="form-group row m-b-15">\n' +
        '                            <label class="col-md-4 col-sm-4 col-form-label" ></label>\n' +
        '                            <div class="col-md-8 col-sm-8">\n' +
        '                                <button @click="scenario" style="margin-left: 10px" class="btn btn-outline-primary">Xác nhận</button>\n' +
        '                                <a href="#ex1" rel="modalPro:open" style="margin-left: 10px;margin-right: 20px" class="btn btn-outline-danger">Xóa</a>\n' +
        '<div id="ex1" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="removeScenatio" >Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close"  >Hủy</a></center> \n' +
        '    </div>\n' +
        '                                <span class="animated flash" v-show="errorShow">{{error}}</span>\n' +

        '\n' +
        '\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '\n' +
        '\n' +
        '\n' +
        '                    </div>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '\n' +
        '\n' +
        '    </div>',
    data(){
        return {
            time:'0',
            timeName:'Phút',
            timeNameArr:['Ngày','Giờ','Phút'],
            ind:0,
            mark:null,
            error:null,
            errorShow:false,
            AllData:[],

            allAccount:[],
            main:{
                syntax:null,
                nameScenario:null,
                dataArr:[{
                    key:null,
                    time:'0',
                    timeName:'Phút',
                    text:null,
                    base64img:null

                }],
                checkedNames:[]

            },
            data:{
                time:'0',
                timeName:'Phút',
                text:null,
                base64img:null
            },
            dataShow:false,
            fullname:''

        }
    },

    created: async  function(){

        let allAcc = await axios.post('/api/getAllAccount');
        this.allAccount = allAcc.data.data;

        let alldata = await axios.post('/api/getAllScenario');

        return this.AllData = alldata.data;
    },

    methods:{
        uploadFile:async function (event) {
            this.errorShow = false;
            let _ = this;
            let input = event.target;
            if (input.files && input.files[0]) {
                let reader = new FileReader();
                reader.onload = (e) => {
                    if(_.mark === null){
                        _.data.base64img = e.target.result;
                    }else {
                        _.main.dataArr = _.main.dataArr.filter(em=>{
                            if(em.text === this.mark.text && em.base64img === this.mark.base64img && em.time === this.mark.time && em.timeName === this.mark.timeName){
                                em.base64img = e.target.result;
                            }
                            return em
                        })
                    }
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
        markIndex:async function(element){
            return this.mark = element;
        },
        addSce:async function(){
            this.errorShow = false;

            let sce = this.data;
            if((sce.text === null || sce.text.trim() === '') && (sce.base64img === null || sce.base64img.trim() === '') && this.dataShow === true){

                this.error = 'Kịch bản trước phải có ít nhất nội dung văn bản hoặc hình ảnh !!!';
                return this.errorShow = true;
            }else {

                this.main.dataArr.push({
                    key:Math.random()*1000000000000000000,
                    time:'1',
                    timeName:'Phút',
                    text:null,
                    base64img:null
                });
                this.data = {
                    time:'1',
                    timeName:'Phút',
                    text:null,
                    base64img:null
                }
            }
            return this.main.dataArr;
        },
        scenario:async function(){
            this.errorShow = false;
            if(this.main.nameScenario === null){
                this.error = 'Tên kịch bản không được bỏ trống';
                return this.errorShow = true;
            }
            if((this.data.text !== null && this.data.text.trim() !== '') || (this.data.base64img !== null && this.data.base64img.trim() !== '')){
                this.main.dataArr.push(this.data)
            }
            if(this.main.dataArr.length === 0){
                this.error = 'Bạn phải thêm ít nhất 1 nội dung kịch bản !!!';
                return this.errorShow = true;
            }
            if(this.main.syntax === null || this.main.syntax === ''){
                this.dataShow = false;
                this.error = 'Bạn không được để trống cú pháp !!!';
                return this.errorShow = true;
            }
            if(this.main.checkedNames.length === 0){

                this.dataShow = false;
                this.error = 'Bạn phải chọn ít nhất 1 nick áp dụng !!!';
                return this.errorShow = true;
            }



            this.main.dataArr =  this.main.dataArr.filter(e=>{
                if((e.text !== null && e.text.trim() !== '') || (e.base64img !== null && e.base64img.trim() !== '')){
                    return e
                }
            });
            this.data = {
                time:'0',
                timeName:'Phút',
                text:null,
                base64img:null
            };
            if(this.main.syntax === null || this.main.syntax.trim() === ''){
                this.error = 'Bạn không được bỏ trống cú pháp tin nhắn !!!';
                return this.errorShow = true;
            }

            let send = await axios.post('/api/setScenario',{data:this.main});
            let _ = this;
            this.AllData = this.AllData.filter(e=>{
                if(e.syntax !== _.main.syntax){
                    return e
                }
            });
            this.AllData.push(this.main);
            this.main = {
                syntax:null,
                nameScenario:null,
                dataArr:[{
                    key:null,
                    time:'0',
                    timeName:'Phút',
                    text:null,
                    base64img:null

                }],
                checkedNames:[]
            }

            return true;

        },
        addScenario:async function(req,res){
            return this.main = {
                syntax:null,
                nameScenario:null,
                dataArr:[{
                    key:null,
                    time:'0',
                    timeName:'Phút',
                    text:null,
                    base64img:null

                }],
                checkedNames:[]

            };

        },
        removeScenatio:async function(){
            let remove = await axios.post('/api/removeScenario',{syntax:this.main.syntax});

            this.AllData = this.AllData.filter(e=>{
                if(e.syntax !== this.main.syntax){
                    return e
                }
            });

            return this.main = {
                syntax:null,
                nameScenario:null,
                dataArr:[{
                    key:null,
                    time:'0',
                    timeName:'Phút',
                    text:null,
                    base64img:null

                }],
                checkedNames:[]

            };



        },
        removeSceComponent:async function(data){
            console.log(data);
            console.log(this.main.dataArr)
            if(data.key === null){
                this.error = 'Đây là kịch bản bắt buộc bạn không thể xóa kịch bản này !!!';
                return this.errorShow = true;
            }else {
                return this.main.dataArr =  this.main.dataArr.filter(e=>{
                    if(e.key !== data.key){
                        return e
                    }
                })
            }

        },
        scenarioSection:async function(data){
            this.dataShow = false;

            return this.main = data
        },
        textScenario:async function(){
            return  this.main.dataArr[0].text = 'Quý khách đã đăng kí thành công Chương trình '+this.main.nameScenario+' của chúng tôi.Quý khách sẽ được cập nhật những thông tin mới nhất khi có sự kiện sắp diễn ra.Nếu muốn từ chối nhận tin nhắn vui lòng soạn HUY '+this.main.syntax+' gửi tới facebook quý khách dã nhắn trước đó.Trân trong cảm ơn !';

        }
    },
});
Vue.component('changepassword', {
    template:'<div id="content" class="content content-full-width inbox">\n' +
        '        <!-- begin vertical-box -->\n' +
        '        <div class="row">\n' +
        '            <!-- begin col-6 -->\n' +
        '            <div class="col-lg-12 ui-sortable">\n' +
        '                <!-- begin panel -->\n' +
        '                <div class="panel panel-inverse" data-sortable-id="form-validation-1">\n' +
        '                    <!-- begin panel-heading -->\n' +
        '                    <div style="background-color: #2c3e50" class="panel-heading ui-sortable-handle">\n' +
        '                        <div class="panel-heading-btn">\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                        </div>\n' +
        '                        <h4 class="panel-title">Chỉnh sửa thông tin</h4>\n' +
        '                    </div>\n' +
        '                    <!-- end panel-heading -->\n' +
        '                    <!-- begin panel-body -->\n' +
        '                    <div class="panel-body">\n' +
        '                        <div class="form-horizontal" >\n' +
        '                            <div class="form-group row m-b-15">\n' +
        '                                <label class="col-md-4 col-sm-4 col-form-label" for="fullname">Họ và Tên * :</label>\n' +
        '                                <div class="col-md-8 col-sm-8">\n' +
        '                                    <input spellcheck="false" class="form-control" v-model="info.name" type="text" id="fullname" name="fullname" placeholder="Required" data-parsley-required="true">\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="form-group row m-b-15">\n' +
        '                                <label class="col-md-4 col-sm-4 col-form-label" >Số điện thoại * :</label>\n' +
        '                                <div class="col-md-8 col-sm-8">\n' +
        '                                    <input spellcheck="false" class="form-control" type="text" v-model="info.phone" name="email" data-parsley-type="email" placeholder="Email" data-parsley-required="true">\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                            <div class="form-group row m-b-15">\n' +
        '                                <label class="col-md-4 col-sm-4 col-form-label" >Gói cước :</label>\n' +
        '                                <div class="col-md-8 col-sm-8">\n' +
        '                                    {{dataChat.user.package}}\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="form-group row m-b-0">\n' +
        '                                <label class="col-md-4 col-sm-4 col-form-label">&nbsp;</label>\n' +
        '                                <div class="col-md-2 col-sm-2">\n' +
        '                                        <button @click="changeInfo" type="submit" class="btn btn-outline-primary">Thay đổi thông tin</button>\n' +
        '                                </div>\n' +
        '                                <div class="col-md-6 col-sm-6" v-if="alertError.length === 0">\n' +
        '                                    <p v-if="alert.length>0" style="margin-top:10px;color:#0de800" class="animated flash">{{alert}}</p>\n' +
        '                                </div>\n' +
        '                                <div class="col-md-6 col-sm-6" v-if="alertError.length > 0">\n' +
        '                                    <p v-if="alertError.length>0" style="margin-top:10px;color:#e8585b" class="animated flash">{{alertError}}</p>\n' +
        '                                </div>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <!-- end hljs-wrapper -->\n' +
        '                </div>\n' +
        '                    <div class="panel panel-inverse" >\n' +
        '                        <!-- begin panel-heading -->\n' +
        '                        <div style="background-color: #2c3e50" class="panel-heading ui-sortable-handle">\n' +
        '                            <div class="panel-heading-btn">\n' +
        '                                <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>\n' +
        '                                <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-success" data-click="panel-reload"><i class="fa fa-redo"></i></a>\n' +
        '                                <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-warning" data-click="panel-collapse"><i class="fa fa-minus"></i></a>\n' +
        '                                <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-danger" data-click="panel-remove"><i class="fa fa-times"></i></a>\n' +
        '                            </div>\n' +
        '                            <h4 class="panel-title">Thay đổi mật khẩu</h4>\n' +
        '                        </div>\n' +
        '                        <!-- end panel-heading -->\n' +
        '                        <!-- begin panel-body -->\n' +
        '                        <div class="panel-body">\n' +
        '                            <div class="form-horizontal" >\n' +
        '                                <div class="form-group row m-b-15">\n' +
        '                                    <label class="col-md-4 col-sm-4 col-form-label" for="fullname">Mật khẩu mới * :</label>\n' +
        '                                    <div class="col-md-8 col-sm-8">\n' +
        '                                        <input spellcheck="false" class="form-control" v-model="password" type="text" name="fullname" placeholder="Password" data-parsley-required="true">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                                <div class="form-group row m-b-15">\n' +
        '                                    <label class="col-md-4 col-sm-4 col-form-label" >Nhập lại mật khẩu * :</label>\n' +
        '                                    <div class="col-md-8 col-sm-8">\n' +
        '                                        <input spellcheck="false" v-model="repassword" class="form-control" type="text" v-model="info.phone" name="email" data-parsley-type="email" placeholder="Re-Password" data-parsley-required="true">\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '\n' +
        '\n' +
        '                                <div class="form-group row m-b-0">\n' +
        '                                    <label class="col-md-4 col-sm-4 col-form-label">&nbsp;</label>\n' +
        '                                    <div class="col-md-2 col-sm-2">\n' +
        '                                        <button @click="send" type="submit" class="btn btn-outline-primary">Change Password</button>\n' +
        '                                    </div>\n' +
        '                                    <div class="col-md-6 col-sm-6" v-if="alert2Error.length === 0">\n' +
        '                                        <p v-if="alert2.length>0" style="margin-top:10px;color:#0de800" class="animated flash">{{alert2}}</p>\n' +
        '                                    </div>\n' +
        '\n' +
        '                                    <div class="col-md-6 col-sm-6" v-if="alert2Error.length > 0">\n' +
        '                                        <p v-if="alert2Error.length>0" style="margin-top:10px;color:#e84757" class="animated flash">{{alert2Error}}</p>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '                            </div>\n' +
        '                        </div>\n' +
        '\n' +
        '                        <!-- end hljs-wrapper -->\n' +
        '                    </div>\n' +
        '                <!-- end panel -->\n' +
        '            </div>\n' +
        '\n' +
        '        </div>\n' +
        '\n' +
        '    </div>\n' +
        '    <a href="javascript:;" class="btn btn-icon btn-circle btn-success btn-scroll-to-top fade" data-click="scroll-top"><i class="fa fa-angle-up"></i></a>\n' +
        '    <!-- end scroll to top btn -->\n' +
        '</div>',
    data(){
        return {
            password:'',
            repassword:'',
            notMatch:false,
            changeSuccess:false,
            changePassword:false,
            info:{
                name:null
            },
            status:null,
            infoShow:true,
            dataChat:{
                user:{
                    name:null
                },
                conversation:[]
            },
            alert:'',
            alertError:'',
            alert2:'',
            alert2Error:''
        }
    },
    created:async function(){
        let chata = await axios.post('/api/getAllConversation');

        this.dataChat =  chata.data.result;
        let info = await axios.post('/api/infoUser');
        var d = new Date();
        d.setTime(info.data[0].limitTime);
        let month = d.getMonth()+1;
        let day = d.getDate();
        this.status = 'Hạn sử dụng đến ngày '+day+' tháng '+month+'.';
        this.info = info.data[0]
    },
    methods:{
        send:async function(){

            if(this.password === this.repassword){
                let change = await axios.post('/api/changePassword',{password:this.password});

                if(change.data.error === null){
                    let _ = this;
                    _.alert2 = 'Đã thay đổi mật khẩu';
                    setTimeout(function () {
                        _.alert2 = '';
                    },5000)
                }else {
                    let _ = this;
                    _.alert2Error = change.data.error;
                    setTimeout(function () {
                        _.alert2Error = '';
                    },5000)
                }


            }else {
                let _ = this;
                _.alert2Error = 'Mật khẩu không khớp nhau !';
                setTimeout(function () {
                    _.alert2Error = '';
                },5000)
            }
        },
        changePasswordShow:async function(){
            this.infoShow = false;
            this.changePassword = true;
        },
        cancelC:async function(){
            this.infoShow = true;
            this.changePassword = false;
        },
        changeInfo:async function(){
            let change = await axios.post('/api/updateUser',{data:this.info});
            let _ = this;
            _.alert = 'Đã thay đổi';
            setTimeout(function () {
                _.alert = '';
            },5000)
        }
    }
});
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
        '                                            <li class="active"><a href="email_inbox.html"><i class="fa fa-inbox fa-fw m-r-5"></i> Inbox <span class="badge pull-right">{{container.list_chat.filter(e=>{\n' +
        '                                                if(e.seen === false){\n' +
        '                                                return e\n' +
        '                                                }\n' +
        '                                                }).length\n' +
        '                                                }}</span></a></li>\n' +
        '\n' +
        '                                        </ul>\n' +
        '\n' +
        '                                        <div class="nav-title row"><b>LỌC</b> <select style="width: 150px;height: 25px;padding-top:2px;margin-top:-5px;margin-left:10px;background: none;border:1px solid #676767" class="form-control form-control-sm"  v-model="container.nickSelect">\n' +
        '                                            <option value="all">Tất cả</option>\n' +
        '                                            <option v-for="(element,index) in listAccountFacebook" :key="index" :value="element.ID_sender" style="background: none">{{element.FacebookName}}</option>\n' +
        '\n' +
        '                                        </select></div>\n' +
        '\n' +
        '                                        <ul class="nav nav-inbox">\n' +
        '                                            <li v-for="data in containerG.listAllInboxOfAllNick" @click="newTag(data)"><a href="javascript:;"><i class="fa fa-fw f-s-10 m-r-5 fa-circle text-white"></i> {{data.name}} <i v-if="data.seen === false" class="time fa fa-envelope" style="color: white; float:right"></i></a></li>\n' +
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
            listAccountFacebook:[]
            //  listAccountFacebook:[],





        }
    },
    created:async function(){
        let allAccFacebook = await axios.post('/api/getAllAccount');
        return this.listAccountFacebook =  allAccFacebook.data.data
    },
    computed:{
        container(){
            return store.state;
        },
        containerG(){
            return store.getters;
        },


    },


    methods:{

        newTag:async function(obj){
            let result = await axios.post('/api/getConversation',{ID_receiver:obj.ID_receiver,ID_sender:obj.ID_sender,seen:true});
            store.commit('changeComponent','chat');

            store.commit('getConversation',result.data);
            $("#scroll").animate({ scrollTop:1000000000}, 500);



        }





    },
});
Vue.component('listchat', {

    template:' <div  id="content" class="content content-full-width inbox ">\n' +






        '        <!-- begin vertical-box -->\n' +
        '        <div class="vertical-box with-grid page-content-full-height">\n' +
        '\n' +
        '            <div class="vertical-box-column bg-black-transparent-2 page-content-full-height">\n' +
        '                <!-- begin vertical-box -->\n' +
        '                <div class="vertical-box">\n' +
        '                    <!-- begin wrapper -->\n' +
        '                    <div class="wrapper bg-black-transparent-2">\n' +
        '\n' +
        '                        <div class="btn-toolbar">\n' +
        '                            <div class="btn-group m-r-5">\n' +
        '                               <label style="margin-left:-7px" class="checkboxWrapper">\n' +
        '    <input @change="deleteAllConversationAction" type="checkbox"  v-model="deleteAllConversation" >\n' +
        '    <span class="checkmark"></span>\n' +
        '</label>' +
        '                            </div>\n' +
        '                            <div class="btn-group dropdown m-r-5">\n' +
        '                                <select style="background: #57585b;border-radius: 3px;color:white;border:none;outline: none;padding-left: 10px" v-model="container.filterSelect">\n' +
        '  <option value="all" style="color:white;text-align:center">Tất cả</option>\n' +
        '  <option value="unread" style="color:white;text-align:center">Chưa đọc</option>\n' +
        '  <option value="read" style="color:white;text-align:center">Đã đọc</option>\n' +
        '</select>\n' +
        '                            </div>\n' +
        '                            <div class="btn-group m-r-5">\n' +
        '                                <a href="." class="btn btn-sm btn-default"><i class="fa fa-redo f-s-14 t-plus-1"></i></a>\n' +
        '                            </div>\n' +
        '\n' +
        '                            <div class="btn-group">\n' +
        '                                <a v-show="deleteShow"  href="#ex1" rel="modalPro:open" class="btn btn-sm btn-default show" ><i class="fa t-plus-1 fa-times f-s-14 m-r-3"></i> <span class="hidden-xs">Delete</span></a>\n' +
        '<div id="ex1" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="deleteChat">Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close" >Hủy</a></center> \n' +
        '    </div>\n' +

        '                            </div>\n' +
        '                            <div class="btn-group ml-auto">\n' +
        '                                <button class="btn btn-default btn-sm">\n' +
        '                                    <i class="fa fa-chevron-left f-s-14 t-plus-1"></i>\n' +
        '                                </button>\n' +
        '                                <button class="btn btn-default btn-sm">\n' +
        '                                    <i class="fa fa-chevron-right f-s-14 t-plus-1"></i>\n' +
        '                                </button>\n' +
        '                            </div>\n' +
        '\n' +
        '                        </div>\n' +
        '\n' +
        '                    </div>\n' +
        '                    <!-- end wrapper -->\n' +
        '                    <!-- begin vertical-box-row -->\n' +
        '                    <div class="vertical-box-row">\n' +
        '\n' +
        '                        <div class="vertical-box-cell">\n' +
        '                            <!-- begin vertical-box-inner-cell -->\n' +
        '                            <div>\n' +
        '                                <!-- begin scrollbar -->\n' +
        '                                <div data-scrollbar="true" data-height="100%">\n' +
        '                                    <!-- begin list-email -->\n' +
        '                                    <ul  class="list-group list-group-lg no-radius list-email">\n' +
        '                                        <li class="p-,15 text-center" v-show="emptyInbox"><div class="p-20"><i class="fa fa-trash fa-5x text-silver"></i></div> Hộp thư trống</li>\n' +
        '                                        <li  v-if="data.seen === false" @mouseover="authorDisplay(data)"  @mouseout="authorHidden(data)"    v-for="(data,key) in containerG.listAllInbox" class="cur list-group-item unread">\n' +
        '\n' +
        '                                            <div class="email-checkbox">\n' +
        '                                               <label class="checkboxWrapper">\n' +
        '    <input type="checkbox" :value="data._id" v-model="trashArray" >\n' +
        '    <span class="checkmark"></span>\n' +
        '</label>\n' +
        '                                            </div>\n' +
        '                                            <a href="javascript:;" class="email-user bg-gradient-blue">\n' +
        '                                                <img  class="text-white" :src="data.image" alt="" />\n' +
        '                                            </a>\n' +
        '                                            <div  @click="activate(key),newTag(data)" class="email-info">\n' +
        '                                                <span >\n' +
        '                                                    <span class="email-time"><i  v-if="data.seen === false" style="color:white;float:right;margin-right: 10px" class="time fa fa-envelope"></i></span>\n' +
        '                                                    <span class="email-sender">{{data.name}}</span>\n' +
        '                                                    <span class="email-title" v-if="data.lastChat.type === \'text\'">{{data.lastChat.message}}</span>\n' +
        '                                                    <span class="email-title"  v-if="data.lastChat.type !== \'text\'" style="font-style: italic">Tin nhắn ảnh</span>\n' +
        '                                                    <span class="email-desc animated bounceInRight" v-if="data.ady">\n' +
        '\n' +
        '                                                  by {{data.facebook_name_sender}}</span>\n' +
        '                                                </span>\n' +
        '                                            </div>\n' +
        '                                        </li>\n' +
        '                                        <li  v-if="data.seen === true" @mouseover="authorDisplay(data)"  @mouseout="authorHidden(data)"     v-for="(data,key) in containerG.listAllInbox" class="cur list-group-item ">\n' +
        '\n' +
        '                                            <div class="email-checkbox">\n' +
        '\n' +
        '                                                    <label class="checkboxWrapper">\n' +
        '    <input type="checkbox" :value="data._id" v-model="trashArray" >\n' +
        '    <span class="checkmark"></span>\n' +
        '</label>\n' +
        '                                            </div>\n' +
        '                                            <a href="javascript:;" class="email-user bg-gradient-blue">\n' +
        '\n' +
        '                                                <img  class="text-white" :src="data.image" alt="" />\n' +
        '                                            </a>\n' +
        '                                            <div @click="activate(key),newTag(data)" class="email-info">\n' +
        '                                                <span >\n' +
        '                                                    <span class="email-time"><i  v-if="data.seen === false" style="color:white;float:right;margin-right: 10px" class="time fa fa-envelope"></i></span>\n' +
        '                                                    <span class="email-sender">{{data.name}}</span>\n' +
        '                                                    <span class="email-title" v-if="data.lastChat.type === \'text\'">{{data.lastChat.message}}</span>\n' +
        '                                                    <span class="email-title"  v-if="data.lastChat.type !== \'text\'" style="font-style: italic">Tin nhắn ảnh</span>\n' +
        '                                                    <span class="email-desc animated bounceInRight" v-if="data.ady">\n' +
        '\n' +
        '                                                  by {{data.facebook_name_sender}}</span>\n' +
        '                                                </span>\n' +
        '                                            </div>\n' +
        '                                        </li>\n' +

        '                                    </ul>\n' +
        '\n' +
        '                                </div>\n' +
        '                                <!-- end scrollbar -->\n' +
        '                            </div>\n' +
        '                            <!-- end vertical-box-inner-cell -->\n' +
        '                        </div>\n' +
        '                        <!-- end vertical-box-cell -->\n' +
        '                    </div>\n' +
        '                    <!-- end vertical-box-row -->\n' +
        '                    <!-- begin wrapper -->\n' +
        '                    <div class="wrapper bg-black-transparent-2 clearfix">\n' +
        '                        <div class="btn-group pull-right">\n' +
        '                            <button class="btn btn-default btn-sm">\n' +
        '                                <i class="fa fa-chevron-left f-s-14 t-plus-1"></i>\n' +
        '                            </button>\n' +
        '                            <button class="btn btn-default btn-sm">\n' +
        '                                <i class="fa fa-chevron-right f-s-14 t-plus-1"></i>\n' +
        '                            </button>\n' +
        '                        </div>\n' +
        '                        <div class="m-t-5 f-w-600">{{container.list_chat.length}} messages</div>\n' +
        '                    </div>\n' +
        '                    <!-- end wrapper -->\n' +
        '                </div>\n' +
        '                <!-- end vertical-box -->\n' +
        '            </div>\n' +
        '            <!-- begin vertical-box-column -->\n' +
        '            <rightchat></rightchat>\n' +
        '            <!-- end vertical-box-column -->\n' +
        '            <!-- begin vertical-box-column -->\n' +
        '            <!-- end vertical-box-column -->\n' +
        '        </div>\n' +
        '        <!-- end vertical-box -->\n' +
        '    </div>',
    data(){
        return {
            user:{},
            loading:false,
            result:false,
            message:'',

            name:'Facebook manager',
            chatVisible:false,
            introVisible:true,
            sha:false,
            active_el:-1,
            check:false,
            input:false,
            welcome:true,
            listCHAT:false,
            load_listCHAT:true,
            option:false,
            trashArray:[],
            connect:true,
            info:true,
            cookie:'',
            errorCookie:'',
            confirmRemoveCookie:false,
            errorCookieIcon:false,
            tmpRemove:{},
            listCookieShow:true,
            waitingCookie:false,
            saveFont:true,
            deleteAllConversation:false





        }
    },






    computed: {
        container () {
            return store.state
        },
        containerG(){
            return store.getters
        },

        deleteShow: function () {
            if(this.trashArray.length > 0){
                return true
            }else {
                return false
            }
        },
        emptyInbox:function(){

            if(this.container.list_chat.length === 0){
                return true
            }
        }
    },
    mounted:async function(){
        $("#scroll").animate({ scrollTop:10000000000000}, 500);

    },


    methods:{

        activate:function(el){
            this.active_el = el;
        },
        newTag:async function(obj){
            let result = await axios.post('/api/getConversation',{ID_receiver:obj.ID_receiver,ID_sender:obj.ID_sender,seen:true});
            store.commit('changeComponent','chat');

            store.commit('getConversation',result.data);
            $("#scroll").animate({ scrollTop:10000000000000}, 500);



        },
        deleteChat:async function(){
            let listID = this.trashArray;
            for(let i = 0;i<listID.length;i++){
                await axios.post('/api/removeChat',{id:listID[i]});
                store.commit('dropConversation',listID[i]);

            }

            this.welcome = true;
            this.result = false;
            this.option = false;


        },
        authorDisplay:async function(data){
            data.sha = true;
            data.ady = true;
            return data;
        },
        authorHidden:async function(data){
            data.sha = false;
            data.ady = false;
            return data;
        },
        deleteAllConversationAction:async function(){
            if(this.deleteAllConversation === true){
                return this.trashArray = this.container.list_chat.map(e=>e['_id'])

            }else {
                return this.trashArray = [];

            }
        }







    },
});
Vue.component('chat', {
    template:' <div id="content" class="content   content-full-width inbox page-content-full-height">\n' +
        '        <!-- begin vertical-box -->\n' +
        '        <div class="vertical-box with-grid">\n' +
        '            <!-- begin vertical-box-column -->\n' +
        '\n' +
        '            <!-- end vertical-box-column -->\n' +
        '            <!-- begin vertical-box-column -->\n' +
        '            <div class="vertical-box-column bg-black-transparent-2">\n' +
        '                <!-- begin vertical-box -->\n' +
        '                <div class="vertical-box">\n' +
        '                    <!-- begin wrapper -->\n' +
        '                    <div class="wrapper bg-black-transparent-2-lighter clearfix">\n' +
        '                        <div class="pull-left">\n' +
        '\n' +
        '                                <div class="media media-sm clearfix">\n' +
        '                                    <a href="javascript:;" class="pull-left">\n' +
        '                                        <img class=" rounded-corner" alt="" style="width: 40px"  :src="container.conversation.image">\n' +
        '                                    </a>\n' +
        '                                    <div class="media-body">\n' +
        '                                        <div class="email-from f-s-14 f-w-600 m-b-3">\n' +
        '                                            {{container.conversation.name}}\n' +
        '                                        </div>\n' +
        '                                        <div class="email-to">\n' +
        '                                            To:  {{container.conversation.facebook_name_sender}}\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </div>\n' +
        '\n' +
        '                        </div>\n' +
        '                        <div class="pull-right" style="margin-top:-30px">\n' +
        '                            <div class="btn-group m-r-5">\n' +
        '                                <a @click="container.component = `listchat`" href="javascript:;" class="btn btn-default btn-sm"><i class="fa fa-reply f-s-14 m-r-3 m-r-xs-0 t-plus-1"></i> <span class="hidden-xs">Quay lại</span></a>\n' +
        '                            </div>\n' +
        '                            <div class="btn-group m-r-5">\n' +
        '                                <a href="#ex1" rel="modalPro:open" class="btn btn-default btn-sm"><i class="fa fa-trash f-s-14 m-r-3 m-r-xs-0 t-plus-1"></i> <span class="hidden-xs">Delete</span></a>\n' +


        '<div id="ex1" class="modal animated bounceIn" style="width: 250px">\n' +
        '    <p>Bạn có chắc chắn muốn xóa ?.</p>\n' +

        ' <center><a class="btn btn-primary" rel="modalPro:close" style="color:white" @click="deleteConversaton(container.conversation[\'_id\'])">Xóa</a> '+
        '        <a class="btn btn-danger" href="javascript:;" rel="modalPro:close"  >Hủy</a></center> \n' +
        '    </div>\n' +



        ' </div>\n' +
        '                        </div>\n' +
        '\n' +
        '                    </div>\n' +
        '                    <!-- end wrapper -->\n' +
        '                    <!-- begin vertical-box-row -->\n' +
        '                    <div class="vertical-box-row">\n' +
        '                        <!-- begin vertical-box-cell -->\n' +
        '                        <div class="vertical-box-cell">\n' +
        '                            <!-- begin vertical-box-inner-cell -->\n' +
        '                            <div style="height:400px">\n' +
        '                                <!-- data-scrollbar="true"  -->\n' +
        '                                <div   id="scroll"  style="overflow-y: scroll;overflow-x: hidden;height: 100%" >\n' +
        '                                    <!-- begin wrapper -->\n' +
        '                                    <div class="wrapper">\n' +
        '\n' +
        '\n' +
        '                                        <div >\n' +
        '                                            <div :key="pid" v-for="(content,pid) in container.conversation.chat">\n' +
        `
                                                <div v-if="content.user === 'you'" >` +
        '\n' +
        '\n' +
        '                                                   <div v-if="content.type === \'text\'" style="color:white;background:none;margin-top: 30px;padding: 10px 10px;max-width:200px;max-height:200px"><div v-if="content.message.length >= 30" style=";color:#fffbfd;border: 1px solid #858585;border-radius: 10px;padding: 10px 10px;height:auto">{{content.message}}</div><span v-if="content.message.length < 30" style="max-width:200px;border: 1px solid #858585;border-radius: 10px;padding: 10px 10px;height:auto">{{content.message}}</span></div>\n' +
        '                                                    <img class="col-md-3" style="max-width: 200px;max-height: 200px;border-radius: 30px"  v-if="content.type === \'attachments\'" :key="index" v-for="(image,index) in content.message" :src="image.url" alt="">\n' +
        '\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                                </div>\n' +
        `                                                <div v-if="content.user === 'me'"   style="background:none">` +
        '                                                   <div class=" offset-md-9 offset-sm-9 text-right" v-if="content.type === \'text\'" style="background:none;color:white;margin-top:30px;"><div  class="text-left" v-if="content.message.length >= 30" style="max-width:200px;border: 1px solid #858585;border-radius: 10px;padding: 10px 10px;margin-left:20px">{{content.message}}</div><span  class="text-left" v-if="content.message.length < 30" style="max-width:200px;border: 1px solid #858585;border-radius: 10px;padding: 10px 10px;height:auto;">{{content.message}}</span></div> \n' +

        '\n' +
        '                                                   <p> <img class="col-md-6 offset-md-6" style="max-width: 400px;max-height: 400px;border-radius: 30px;float: right;margin-top:20px;margin-bottom: 30px"  v-if="content.type === \'attachments\'"  :key="index" v-for="(image,index) in content.message" :src="image.url" alt="image"></p>\n' +
        '\n' +
        '\n' +
        '\n' +
        '                                                </div>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '\n' +
        '                                    </div>\n' +
        '                                    <!-- end wrapper -->\n' +
        '                                </div>\n' +
        '                                <!-- end scrollbar -->\n' +
        '                            </div>\n' +
        '                            <!-- end vertical-box-inner-cell -->\n' +
        '                        </div>\n' +
        '                        <!-- end vertical-box-cell -->\n' +
        '                    </div>\n' +
        '\n' +
        '                    <div class="row">\n' +
        '                        <div class="input-field col s12">\n' +
        '\n' +
        '                            <textarea id="txta1" v-model="message" @keyup.13="send" placeholder="Nhập văn bản ..." style="resize:none;width:95%;outline:none;border:1px solid #707070;background: none;color: white" spellcheck="false" class="wrapper bg-black-transparent-2-lighter text-left clearfix "></textarea>\n' +
        '                            <form for="txtal" style="float: right;margin-right: 10px;margin-top:20px">\n' +
        '\n' +
        '                                <label for="fusk" style="background:none">  <i style="font-size: 20px" class="fa fa-image" aria-hidden="true"></i></label>\n' +
        '                                <input id="fusk" type="file" name="sampleFile" style="display: none;">\n' +
        '                            </form>\n' +
        '                        </div>\n' +
        '                    </div>\n' +
        '\n' +
        '                    <!-- end wrapper -->\n' +
        '                </div>\n' +
        '                <!-- end vertical-box -->\n' +
        '            </div>\n' +
        '            <rightchat></rightchat>\n' +
        '            <!-- end vertical-box-column -->\n' +
        '        </div>\n' +
        '        <!-- end vertical-box -->\n' +
        '    </div>',
    data(){
        return {
            user:{},
            loading:false,
            result:false,
            message:'',
            fullname:'',
            name:'Facebook manager',
            chatVisible:false,
            introVisible:true,
            sha:false,
            active_el:-1,
            check:false,
            input:false,
            welcome:true,
            listCHAT:false,
            load_listCHAT:true,
            option:false,
            username:getCookie("email"),
            password:getCookie("password"),
            trashArray:[],
            connect:true,
            info:true,
            cookie:'',
            errorCookie:'',
            confirmRemoveCookie:false,
            errorCookieIcon:false,
            tmpRemove:{},
            listCookieShow:true,
            waitingCookie:false,
            saveFont:true,
            dataChat:{conversation:[],user:{name:''}},
            nicknameSelect:null,
            component:null




        }
    },



    computed: {
        container () {
            return store.state
        },


        emptyInbox:function(){

            if(this.container.list_chat.length === 0){
                return true
            }
        }
    },
    beforeMount:function(){
        let name = this.username;
        socket.on('receiveMessage',function(data){

            $("#scroll").animate({ scrollTop:10000000000000}, 500);
            if(data.userBoss === name){
                let result = data.message;
                return store.commit('pushConversation',result)
            }

        });
        socket.on('error',function (data) {

            let ID_sender = data['ID_sender'];

            return store.commit('statusUPDATEpro',ID_sender)
        })


    },
    mounted:function(){
        $("#scroll").animate({ scrollTop:10000000000000}, 500);

        let name = this.username;
        let _ = this;

        $("form").change(function(evt){
            evt.preventDefault();
            var formData = new FormData($(this)[0]);
            $.ajax({
                url: '/api/uploadIMAGE',
                type: 'POST',
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                enctype: 'multipart/form-data',
                processData: false,
                success: function (response) {

                    socket.emit('sendMessage',{
                        userBoss:name,
                        ID_receiver:store.state.conversation.ID_receiver,
                        type:'attachments',
                        url:response,
                        ID_sender:store.state.conversation.ID_sender
                    },function(callback){
                        store.commit('pushConversation',callback.data)
                        store.state.list_chat = store.state.list_chat.map(e=>{

                            if(e['ID_receiver'] === store.state.conversation['ID_receiver']){
                                e.seen = true;
                            }
                            return e;

                        });
                        $("#scroll").animate({ scrollTop:1000000000}, 500);



                    });
                }
            });
            return false;
        });
    },
    methods:{
        send:function(){

            let _ = store;
            let mess = this.message;


            socket.emit('sendMessage',{
                userBoss:this.username,
                ID_receiver:_.state.conversation.ID_receiver,
                type:'text',
                message:mess,
                ID_sender:_.state.conversation.ID_sender

            },function(callback){

                if(callback.error !== null){
                    _.connect = false;
                    return _.commit('statusUPDATE','Cookie expired')

                }

                $("#scroll").animate({ scrollTop: 10000000000000}, 500);


                _.commit('pushConversation',callback.data)



                return _.state.list_chat = _.state.list_chat.map(e=>{

                    if(e['ID_receiver'] === store.state.conversation['ID_receiver']){
                        e.seen = true;
                    }
                    return e;

                });

            });

            $("#scroll").animate({ scrollTop:10000000000000}, 500);
            this.message = '';
        },
        newTag:async function(obj){
            this.welcome = false;
            this.result = false;
            this.loading = true;
            this.introVisible = false;
            this.chatVisible = true;
            this.option = true;

            let result = await axios.post('/api/getConversation',{ID_receiver:obj.ID_receiver,ID_sender:obj.ID_sender,seen:true});

            store.commit('getConversation',result.data);
            this.loading = false;
            this.result = true;
            if(result.data.status === 'active'){
                this.input = true;
            }
            $("#scroll").animate({ scrollTop: 10000000000000}, 500);



        },
        activate:function(el){
            this.active_el = el;
        },
        deleteChat:async function(){
            let listID = this.trashArray;
            for(let i = 0;i<listID.length;i++){
                await axios.post('/api/removeChat',{id:listID[i]});
                store.commit('dropConversation',listID[i]);

            }

            this.welcome = true;
            this.result = false;
            this.option = false;


        },
        deleteConversaton:async function(id){
            this.trashArray.push(id);
            this.deleteChat();
            location.reload()
        },
        authorDisplay:async function(data){
            data.sha = true;
            data.ady = true;
            return data;
        },
        authorHidden:async function(data){
            data.sha = false;
            data.ady = false;
            return data;
        },
        cookiePopup:async function(){
            $('.fullscreen.modal')
                .modal('show')
            ;
            let allAccount = await axios.post('/api/getAllAccount');
            let result = allAccount.data.data.filter(e=>{
                if(e.type === 'cookie'){
                    return e
                }
            });
            return store.state.account = result
        },
        addfacebookaccount:async function(){
            this.saveFont = false;
            this.waitingCookie = true;
            let _ = this;

            let result = this.cookie.split('\n').map(e=>{
                let objResult = {};
                this.cookie.split(';').filter(e=>{
                    if(e.trim().length >0){
                        return e
                    }
                }).map(e=>{
                    objResult[e.split('=')[0].trim()] = e.split('=')[1].trim()
                });
                return objResult
            });

            this.cookie = '';
            let send = await axios.post('/api/account',{type:'cookie',data:result});
            if(send.data.error === null){
                this.container.account.push(send.data)
            }else {
                this.errorCookieIcon = true;

                this.errorCookie = send.data.error;
                setTimeout(function () {
                    _.errorCookieIcon = false;
                    _.errorCookie = '';
                },24000)
            }
            this.saveFont = true;
            this.waitingCookie = false;



        },
        removeCookie:async function(data){
            this.tmpRemove = data;
            this.listCookieShow = false;

            this.confirmRemoveCookie = true;
        },
        confirmRemoveCookieAction:async function(){
            let id = this.tmpRemove.ID_sender;
            let del = await axios.post('/api/deleteAccount',{ID_sender:id});
            store.state.account = store.state.account.filter(e=>{
                if(e.ID_sender !== id){
                    return e
                }
            });
            this.listCookieShow = true;
            this.confirmRemoveCookie = false;

        },
        cancelRemoveCookieAction:async function(){
            this.tmpRemove = {};
            this.confirmRemoveCookie = false;
            this.listCookieShow = true;



        },






    },
});







