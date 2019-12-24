Page({
    data:{
        imgUrls: '',/*轮播图*/
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        items:{},
        openShop_list:{},/*订单列表*/
        product_id:'',
    },
    /*获取轮播图和店铺信息*/
    getbanner:function(){
        var page=this;
        tt.request({
            url: "https://pianke.jinjieyihua.com/index.php/portal/company/getCompanyInfo",
            method:'POST',
            dataType:'json',
            header:{'content-type': 'application/x-www-form-urlencoded'},
            data: {
                openid: tt.getStorageSync('useropenid')
            },
            success(res){
                page.setData({
                    imgUrls:res.data.data.company_info.company_lunbo,
                    items:res.data.data.company_info
                })

            },
            fail(res){
                tt.showToast({
                    title: '加载失败',
                    icon:'none'
                })
            }
        })
    },
    /*获取商品详情*/
    getopenshopList:function(){
        var page=this;
        tt.request({
            url: "https://pianke.jinjieyihua.com/index.php/portal/company/productList",
            method:'POST',
            dataType:'json',
            header:{'content-type': 'application/x-www-form-urlencoded'},
            data: {
                openid: tt.getStorageSync('useropenid')
            },
            success(res){
                page.setData({
                    openShop_list:res.data.data,
                    product_id:res.data.data.id
                })
            },
            fail(res){
                tt.showToast({
                    title: '加载失败',
                    icon:'none'
                })
            }
        })
    },
    /*点击购买*/
    createcars(){
        var _this = this;
        tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/user/addOrder',
            data: {
                product_id: _this.data.product_id,
                openid:tt.getStorageSync('useropenid')
            },
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                if (res.data.code === 1){
                    _this.setData({
                        order_go:res.data.data
                    })
                    _this.goShop_to(_this.data.order_go)
                }else{
                    tt.showToast({
                        title: res.data.msg,
                        icon:'none'
                    })
                }
                _this.getopenshopList()
            },
            fail (res) {
                console.log(`request调用失败`);
            }
        });
    },
    /*购买支付*/
    goShop_to(data){

        tt.request({
            url:'https://pianke.jinjieyihua.com/index.php/portal/user/payOrder',
            data:{
                order_number:data,
            },
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                var mydata = res.data.data;
                tt.pay({
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

                                },
                                fail(err) {
                                    reject(err);
                                }

                            });
                        },1000);
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
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var page=this;
        tt.showToast({
            title: '正在加载',
            icon:'loading',
            success(res){
                page.getbanner();
                page.getopenshopList()
            }
        })
    },

})