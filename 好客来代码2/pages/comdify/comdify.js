var GoodList = {};
var goodlistdata = require('../../GoodList.js');

Page({
    data: {
        isLoading: true,
        typeData: {},
        goodData: {}
    },
    onLoad() {
        let _this = this;
        tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/product/productList',
            data: {},
            header: {'content-type': 'application/x-www-form-urlencoded'},
            method: "POST",
            success: function (res) {
                setTimeout(() => {
                    _this.setData({
                        isLoading: false
                    });
                }, 300);
                GoodList = res.data;
                _this.initData();
            }
        })
        _this.initData();

        // 初始化scroll-view高度
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });

    },
    initData() {
        let orderArr = [];
        let types = [];
        for (let i in GoodList.data) {
            orderArr.push(GoodList.data[i].id);
        }

        // 拿到最大的ID设为初始化分类
        let orderId = Math.min(...orderArr);

        this.setData({
            current: orderId,
            typeData: GoodList.data
        });

        // 初始化商品列表
        this.setGoodList(orderId);
    },
    //点击分类
    tapTpye(event) {
        this.setData({
            current: event.currentTarget.dataset.current
        });
        this.setGoodList(event.currentTarget.dataset.current);
    },
    //点击商品
    tapGood(event) {
        wx.navigateTo({
            url: '../detail/detail?id=' + event.currentTarget.dataset.id
        });
    },
    setGoodList(typ) {
        for (let i in GoodList.data) {
            if (GoodList.data[i].id == typ) {
                this.setData({
                    goodData: GoodList.data[i]
                });
            }
        }
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
            {
                typeData: {},
                goodData: {}
            }
        );//先清空数据
        this.onLoad();//再重新加载数据
        wx.stopPullDownRefresh();//停止刷新操作
    },
})