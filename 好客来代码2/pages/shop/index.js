
Page({
    pageonload(){
        var _this = this;
        let task = tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/company/getCompanyInfo',
            data: {
                openid: tt.getStorageSync('useropenid')
            },  
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                console.log(res);
                if(res.data.code == 0){
                    _this.setData({
                        xieyiblockandhidden:true,
                        meiyoudianpuxinxi:false,
                        youdianpuxinxi:false
                    })
                };
                if(res.data.code==1){
                    if(res.data.data.company_info.status == -1){
                        _this.setData({
                            xieyiblockandhidden:false,
                            meiyoudianpuxinxi:true,
                            youdianpuxinxi:false,
                            // dengluzhanghao:res.data.data.admin_info.user_login,
                            kaidiantishixinxi:'尚未上传店铺信息'
                        })
                    }else if(res.data.data.company_info.status == 0){
                        _this.setData({
                            xieyiblockandhidden:false,
                            meiyoudianpuxinxi:true,
                            youdianpuxinxi:false,
                            // dengluzhanghao:res.data.data.admin_info.user_login,
                            kaidiantishixinxi:'店铺信息正在审核中'
                        })
                    }else if(res.data.data.company_info.status == 2){
                        _this.setData({
                            xieyiblockandhidden:false,
                            meiyoudianpuxinxi:true,
                            youdianpuxinxi:false,
                            // dengluzhanghao:res.data.data.admin_info.user_login,
                            kaidiantishixinxi:'店铺信息没有通过审核'
                        })
                    }else if(res.data.data.company_info.status == 1){
                        _this.setData({
                            xieyiblockandhidden:false,
                            meiyoudianpuxinxi:false,
                            youdianpuxinxi:true,
                            companyname:res.data.data.company_info.company_name,
                            companydetail:res.data.data.company_info.company_info,
                            order_nohe:res.data.data.order_nohe,
                            order_count:res.data.data.order_count,
                            order_he:res.data.data.order_he,
                            companytype:res.data.data.company_info.company_type,
                            companyaddress:res.data.data.company_info.address,
                            companyphone:res.data.data.company_info.contact_way,
                            background:res.data.data.company_info.company_lunbo
                        })
                    }
                }
                
            },
            fail (res) {
                console.log(`request调用失败`);
            }
        });
    },
    onLoad: function(options) {
        var _this = this;
        _this.pageonload();
    },
    data: {
        order_nohe:"",
        order_count:'',
        order_he:'',
        showModal: false,
        textV:'',
        xieyiblockandhidden:false,
        meiyoudianpuxinxi:true,
        youdianpuxinxi:false,
        pickerHidden: true,
        chosen: '',
        center: '../img/home2.png',
        companytime: '8：00-18:00',
        companydetail:'',
        background: [],
        indicatorDots: true,
        vertical: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        circular:true,
        company_icon:'../img/touxiang1.jpeg',
        morenchoose:'',
        dis:false,
        userid:1,
        // dengluzhanghao:'',
        kaidiantishixinxi:'',
        companyname:'',
        companytype:'',
        companyaddress:'',
        companyphone:'',
        // companyicon:'../img/touxiang1.jpeg',
        // membernum:0,
        // membermoney:0,
        // loginname:'',
        trade_no:'',
    },
    
    checkboxChange:function(e){
            if(this.data.morenchoose=='true'){
                this.setData({
                    morenchoose:'',
                    dis:true
                })
            }else{
                this.setData({
                    morenchoose:'true',
                    dis:false
                })
            }

        
    },
    changepassword:function(){
        tt.navigateTo({
            url: `changepassword/changepassword`,
            success (res) {
                
            },
            fail (res) {
                console.log('daghfjgkj'+res.errMsg);
            }
        });
        
    },
    onShow: function(options) {
        tt.setNavigationBarTitle({
            title: '我的店铺',
            success (res) {
                console.log(`${res}`);
            },
            fail (res) {
                console.log(`setNavigationBarTitle调用失败`);
            }
        });
        this.onLoad()
    },
    //关闭弹出框
    back:function(){
        this.setData({
            showModal:false,
            dis:false
        })
    },
    /**获取input输入值*/
    wish_put:function(e){
        this.setData({
            textV:e.detail.value
        })
    },
    //开启店铺
    createcars:function(){
        if(this.data.morenchoose=='true'){
                this.setData({
                    dis:true,
                    showModal:true
                })
            }else{
                this.setData({
                    dis:false,
                })
                tt.showToast({
                    title: '请先阅读并同意以上条款及条件',
                    duration: 2000,
                    icon:'none'
            });
                return
            }

    },
    //弹出框确定
    ok:function(){
        if (this.data.textV === ''){
            tt.showToast({
                title: '手机号不能为空',
                duration: 2000
            });
            return
        }

        var _this = this;
        let task = tt.request({
            // url: 'https://pianke.jinjieyihua.com/index.php/portal/company/openCompany',
            url:'https://pianke.jinjieyihua.com/index.php/portal/api/crgpayCompany ',
            data: {
                openid:tt.getStorageSync('useropenid')
            },
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                _this.setData({
                    trade_no:res.data.data.trade_no
                })
                // _this.pageonload();
                if(res.data.code==1){
                    let task = tt.request({
                        // url: 'https://pianke.jinjieyihua.com/index.php/portal/company/openCompany',
                        url:'https://pianke.jinjieyihua.com/index.php/portal/pay/pay',
                        data: {
                            order_number:res.data.data.trade_no,
                            mobile:_this.data.textV
                        },
                        header:{'content-type': 'application/x-www-form-urlencoded'},
                        method:"POST",
                        success (res) {
                            if (res.data.code===2){
                                tt.showToast({
                                    title: res.data.msg,
                                    duration: 2000,
                                });
                                return false
                            }
                            if(res.data.code===1){
                                var mydata = res.data.data;
                                let apppay = tt.pay({
                                    orderInfo: {
                                        "app_id": mydata.app_id,
                                        "sign_type": "MD5",
                                        "out_order_no": mydata.out_order_no,
                                        "merchant_id": mydata.merchant_id,
                                        "timestamp": mydata.timestamp,
                                        "product_code": "pay",
                                        "payment_type": "direct",
                                        "total_amount": mydata.total_amount,
                                        "trade_type": "H5",
                                        "uid": mydata.uid,
                                        "version": "2.0",
                                        "applet_version": "2.0",
                                        "currency": "CNY",
                                        "subject": mydata.subject,
                                        "body": mydata.body,
                                        "trade_time": mydata.trade_time,
                                        "valid_time": 300,
                                        "notify_url": mydata.notify_url,
                                        "wx_url": mydata.wx_url,
                                        "wx_type": "MWEB",
                                        "alipay_url": mydata.alipay_url,
                                        "sign": mydata.sign,
                                        "risk_info": mydata.risk_info
                                    },
                                    service: 3,
                                    _debug: 1,
                                    success(res) {
                                        setTimeout(function(){
                                            tt.request({
                                                url: 'https://pianke.jinjieyihua.com/index.php/portal/pay/getOrderStatus',
                                                header:{'content-type': 'application/x-www-form-urlencoded'},
                                                method:"POST",
                                                data:{
                                                    order_number:_this.data.trade_no
                                                },
                                                success(res) {
                                                    // 商户后端查询的微信支付状态，通知收银台支付结果
                                                    console.log(JSON.stringify(res)+_this.data.trade_no);
                                                    _this.setData({
                                                        showModal:false,
                                                        xieyiblockandhidden:false,
                                                        meiyoudianpuxinxi:true,
                                                        kaidiantishixinxi:'店铺信息正在审核中',
                                                        dis:false
                                                    })
                                                    _this.pageonload()
                                                },
                                                fail(err) {
                                                    reject(err);
                                                    _this.pageonload()
                                                }

                                            });
                                        },2000);
                                    },
                                    fail(res) {
                                        tt.showToast({
                                            title: '支付失败',
                                            duration: 2000,
                                            success (res) {
                                                console.log(`${res}`);
                                            },
                                            fail (res) {
                                                console.log(`showToast调用失败`);
                                            }
                                        });
                                        // 调起收银台失败处理逻辑
                                    },
                                });
                                if (apppay){
                                    _this.onLoad();
                                } else{
                                    UpdateManager.applyUpdate()
                                }
                                _this.onLoad();
                                // tt.showModal({
                                //     title: '微信支付',
                                //     content: '微信支付',
                                //     success (res) {
                                //         if (res.confirm) {

                                //         } else if (res.cancel) {
                                //             console.log('cancel, cold')
                                //         } else {
                                //             // what happend?
                                //         }
                                //     },
                                //     fail (res) {
                                //         console.log(`showModal调用失败`);
                                //     }
                                // });
                            }
                        },
                        fail (res) {
                            console.log(`request调用失败`);
                        }
                    });
                }
            },
            fail (res) {
                console.log(`request调用失败`);
            }
        });

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({
            title: '正在刷新数据...',
            icon: 'loading',
            duration: 2000
        });
        this.setData(
            {order_nohe:"",
            order_count:'',
            order_he:'',}
            );//先清空数据
        this.onLoad();//再重新加载数据
        wx.stopPullDownRefresh();//停止刷新操作
    },
})