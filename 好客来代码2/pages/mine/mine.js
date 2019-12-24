var app = getApp();

Page({
    data: {
        userInfo: {},
        cartGoodCount: 0,
        result: '',
        result2: '',
        look_codeBody: false,
        imagePath: '',
        userTypeShow:false,/*店内关联显示隐藏*/
    },
    userFun() {
        var _this = this;
        let task = tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/user/userInfo',
            data: {
                openid: tt.getStorageSync('useropenid'),
            },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            method: "POST",
            success(res) {
                if (res.data.code == 1) {
                    _this.setData({
                        userInfo: res.data.data
                    })
                    if (res.data.data.user_type === "1") {
                        _this.setData({
                            userTypeShow:true
                        })
                    }else{
                        _this.setData({
                            userTypeShow:false
                        })
                    }
                }
            },
            fail(res) {
                console.log(`request调用失败 ${res.errMsg}`);
            }
        });
    },
    onLoad() {
        let _this = this;
        _this.userFun()
    },
    goOrder(event) {
        tt.navigateTo({
            url: '../members/index'
        });
    },
    //核销
    getScancode: function () {
        var _this = this;
        wx.scanCode({
            success: (res) => {
                var result = res.result;
                tt.request({
                    url: 'https://pianke.jinjieyihua.com/index.php/portal/user/heXiao',
                    data: {
                        openid: tt.getStorageSync('useropenid'),
                        number: result
                    },
                    header: {'content-type': 'application/x-www-form-urlencoded'},
                    method: "POST",
                    success(res) {

                        tt.showToast({
                            title: res.data.msg,
                            icon: "none"
                        })

                    },
                    fail(res) {
                        console.log(`request调用失败 ${res.errMsg}`);
                    }
                });
            }
        })
    },
    //店员关联
    getShopRelation: function () {
        var _this = this;
        wx.scanCode({
            success: (res) => {
                var result2 = res.result;
                tt.request({
                    url: 'https://pianke.jinjieyihua.com/index.php/portal/user/widthCompaney',
                    data: {
                        openid: tt.getStorageSync('useropenid'),
                        number: result2
                    },
                    header: {'content-type': 'application/x-www-form-urlencoded'},
                    method: "POST",
                    success(res) {
                        if(res.data.code == 1){
                            _this.setData({
                                userTypeShow:true
                            })
                            _this.userFun()
                        }
                        tt.showToast({
                            title: res.data.msg,
                            icon: "none"
                        })
                    },
                    fail(res) {
                        console.log(`request调用失败 ${res.errMsg}`);
                    }
                });
            }
        })
    },
    onShow() {
        this.userFun();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.showToast({
            title: '正在刷新数据...',
            icon: 'loading',
        });
        this.setData({imagePath: ''});//先清空数据
        this.onLoad();//再重新加载数据
        wx.stopPullDownRefresh();//停止刷新操作
    },
})