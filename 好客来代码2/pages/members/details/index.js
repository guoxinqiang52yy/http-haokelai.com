var QR = require("../../../utils/qrcode.js");
Page({
    data: {
        look_codeBody:false,
        background: [],
        indicatorDots: true,
        vertical: true,
        autoplay: true,
        interval: 2000,
        duration: 500,
        circular:true,
        bankabtnblock:false,
        meaasgelistblock:true,
        usercarcode:'',
        usertouxiang:'',
        urlid:'',
        huiyuankaid:'',
        product_name:'',
        product_price:'',
        product_id:'',
        add_time:'',
        order_number:'',
        code_img:'../../img/timg2.jpg',
        order_go:'',
        canvasHidden: false,
        imagePath: '',
        status:"",
        product_image:'',
    },
    pageloadfunc(){
        var _this = this;
        tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/order/orderDetail',
            data: {
                id: _this.data.urlid,
            },
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                if(res.data.code===1){
                    var jiaoyanCode = '对不起,未生成二维码';
                    _this.setData({
                        product_name:res.data.data.product_name,
                        product_price:res.data.data.product_price,
                        add_time:res.data.data.add_time,
                        order_number:res.data.data.order_number,
                        product_id:res.data.data.product_id,
                        status:res.data.data.status,
                        product_image:res.data.data.product_image
                    });
                    jiaoyanCode = _this.data.order_number
                    var size = _this.setCanvasSize(); //动态设置画布大小
                    _this.createQrCode(jiaoyanCode, "mycanvas", size.w, size.h);
                }
            },
            fail (res) {
                console.log(`request调用失败`);
            }
        })
    },

    onLoad (option) {
        this.setData({
            urlid:option.id
        });
        this.pageloadfunc();
    },
    /*参考*/
    //适配不同屏幕大小的canvas
    setCanvasSize: function() {
        var size = {};
        try {
            var res = tt.getSystemInfoSync();
            var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽 686是因为样式wxss文件中设置的大小
            var width = res.windowWidth / scale;
            var height = width; //canvas画布为正方形
            size.w = width;
            size.h = height;
        } catch (e) {
            // Do something when catch error
            console.log("获取设备信息失败" + e);
        }
        return size;
    },
    /**
     * 绘制二维码图片
     */
    createQrCode: function(url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => {
            this.canvasToTempImage();
        }, 1000);
    },
    /**
     * 获取临时缓存照片路径，存入data中
     */
    canvasToTempImage: function() {
        var that = this;
        //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                that.setData({
                    imagePath: tempFilePath,
                    // canvasHidden:true
                });
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },
    /**
     * 点击图片进行预览
     */
    previewImg: function (e) {
        var img = this.data.imagePath;
        console.log(img);
        wx.previewImage({
            current: img, // 当前显示图片的http链接
            urls: [img] // 需要预览的图片http链接列表
        });
    },
    /*查看二维码*/
    look_code(options){
        let that = this;
        that.setData({
            look_codeBody:true,
        })
    },
    look_codeBodyClose(){
        let that = this;
        that.setData({
            look_codeBody:false,
        })
    },
    /*购买*/
    createcars(options){
        var _this = this;
        let sku = options.id || '';
        let task = tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/product/addOrder',
            data: {
                product_id: _this.data.urlid,
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
                // _this.pageloadfunc();
            },
            fail (res) {
                console.log(`request调用失败`);
            }
        });
    },
    /*购买支付*/
    goShop_to(data){
        console.log(data);
        tt.request({
            url:'https://pianke.jinjieyihua.com/index.php/portal/product/payOrder',
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
                                    order_number:data
                                },
                                success(res) {
                                    // 商户后端查询的微信支付状态，通知收银台支付结果
                                    // console.log(JSON.stringify(res)+_this.data.trade_no);
                                },
                                fail(err) {
                                    reject(err);
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
            }
        })
    },
})