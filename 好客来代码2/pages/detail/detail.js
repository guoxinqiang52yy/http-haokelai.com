var app = getApp();
var Zan = require('../../dist/index');
var WxParse = require('../../wxParse/wxParse.js');
var gooddata = require('../../GoodData.js');
var gooddata_other = require('../../GoodData_other.js');
var GoodData = {};

Page({
  data: {
    image:'',
    goodName: "加载中...",
    currentPrice: "0.00",
    detail: "",
    kinds: [],
    goodsinfo:'',
    current: 0,
    total: 0,
    count: 1,
    cartGoodCount: 0,
    smpic: "",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    showDialog: false,
    goOrder: true,
    order_go:'',
    optionIds:'',
  },
  /*购买*/
  createcars(options){
    var _this = this;
    tt.request({
      url: 'https://pianke.jinjieyihua.com/index.php/portal/product/addOrder',
      data: {
        product_id: _this.data.optionIds,
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
      },
      fail (res) {
        console.log(`request调用失败`);
      }
    });
  },
  /*购买支付*/
  goShop_to(data){
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
  //接收ID
  onLoad(option) {
    let _this = this;
    _this.setData({
      optionIds:option.id
    })
    // 通过商品ID请求相应数据
    tt.request({
      url: 'https://pianke.jinjieyihua.com/index.php/portal/product/productDetail',
      data: {
        id:option.id
      },
      header: {'content-type': 'application/x-www-form-urlencoded'},
      method: "POST",
      success: function (res) {
        _this.setData({
          image: res.data.data.image,
          goodName: res.data.data.product_name,
          currentPrice: res.data.data.price,
          goodsinfo:res.data.data.info,
          goodsTypeName:res.data.data.type_name,
        });
      }
    });
  },
  onShow() {

  },
  goIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  },
});