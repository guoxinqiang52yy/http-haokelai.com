Page({
  data: {
    pickerHidden: true,
    chosen: '',
    liuyan:'',
    contack_way:'',
  },
    onShow: function(options) {
        tt.setNavigationBarTitle({
        title: '关于我们',
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`setNavigationBarTitle调用失败`);
        }
    });
  },

    formSubmit: function (e) {
        var _this = this;
        var liuyan = e.detail.value.liuyan;
        var contact_way = e.detail.value.contact_way;
        console.log('form发生了submit事件，携带数据为：', e.detail.value.liuyan,e.detail.value.contant_way);
        if(e.detail.value.liuyan==''||e.detail.value.liuyan==' '){
            tt.showToast({
                title:'留言内容为空，留言失败',
                duration: 1500,
                icon:'none',
                success (res) {

                },
                fail (res) {
                    console.log(`showToast调用失败`);
                }
            });
        }else{
            let task = tt.request({
                url: 'https://pianke.jinjieyihua.com/index.php/portal/user/leaveMessage',
                data: {
                    openid:tt.getStorageSync('useropenid'),
                    content: liuyan,
                    contact_way:contact_way
                },  
                header:{'content-type': 'application/x-www-form-urlencoded'},
                method:"POST",
                success (res) {
                    console.log(res.data);
                    if(res.data.code==1){
                        if(_this.data.liuyan==""){
                            _this.setData({
                                liuyan:" ",
                                contact_way:" "
                            });
                            if(_this.data.liuyan==" "){
                                _this.setData({
                                    liuyan:"",
                                    contact_way:""
                                })
                            }
                        }else{
                            _this.setData({
                                liuyan:"",
                                contact_way:""
                            })
                        }
                        
                        tt.showToast({
                            title: res.data.msg,
                            duration: 1500,
                            icon:'none',
                            success (res) {
                                console.log(e.detail.value.liuyan);
                            },
                            fail (res) {
                                console.log(`showToast调用失败`);
                            }
                        });
                    }else if(res.data.code==2){
                        tt.showToast({
                            title: res.data.msg,
                            duration: 1500,
                            icon:'none',
                            success (res) {

                            },
                            fail (res) {
                                console.log(`showToast调用失败`);
                            }
                        });
                    }else if(res.data.code == 0){
                        tt.showToast({
                            title: res.data.msg,
                            duration: 1500,
                            icon:'none',
                            success (res) {

                            },
                            fail (res) {
                                console.log(`showToast调用失败`);
                            }
                        });
                    }
                },
                fail (res) {
                    console.log(`request调用失败`);
                }
            });
        }
    
    }
})

