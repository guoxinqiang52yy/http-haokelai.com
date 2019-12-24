Page({
    data: {
        background: [{id: 1, url: '../img/1.jpg'}, {id: 2, url: '../img/ceshi.jpg'}, {id: 3, url: '../img/1.jpg'}],/*轮播*/
        indicatorDots: true,
        vertical: true,
        autoplay: true,
        interval: 3000,
        duration: 600,
        circular: true,
        advertisement: "../img/ceshi.jpg",/*广告图片*/
        items: [
            {id: '', product_name: '', product_price: '', product_image: '', add_time: '', status: ''}
        ],/*推荐商品列表*/
        navList: [
            {id: 1, navName: '首页', url: '/pages/index/index', image: 'icon-canyin'},
            {id: 2, navName: '我的商品', url: '/pages/comdify/comdify', image: 'icon-fenlei'},
            {id: 3, navName: '我的订单', url: '/pages/members/index', image: 'icon-shenghuo'},
            {id: 4, navName: '个人中心', url: '/pages/mine/mine', image: 'icon-ruzhu'}
        ],
        company: {},/*店铺信息*/
    },
    onLoad: function () {
        this.Fun1()
        this.Fun2()
        this.Fun3()
    },
    //店铺列表
    Fun1: function () {
        let _this = this
        wx.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/index/getCompany',
            data: {
                openid: tt.getStorageSync('useropenid')
            },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            method: "POST",
            success(res) {
                if (res.data.code === 1) {
                    _this.setData({
                        // background: res.data.data.company_info.company_lunbo
                        company: res.data.data
                    })
                }
            },
            fail(res) {
                console.log(`request调用失败 ${res.errMsg}`);
            }
        });
    },
    // 热门商品列表
    Fun2: function () {
        var _this = this;
        tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/index/getHot',
            data: {
                // openid: tt.getStorageSync('useropenid'),
            },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            method: "POST",
            success(res) {
                if (res.data.code == 1) {
                    _this.setData({
                        items: res.data.data,
                    })
                }
            },
            fail(res) {
                console.log(`request调用失败 ${res.errMsg}`);
            }
        });
    },
    //轮播图
    Fun3: function () {
        let _this = this
        wx.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/index/getLunbo',
            data: {
                // openid: tt.getStorageSync('useropenid')
            },
            header: {'content-type': 'application/x-www-form-urlencoded'},
            method: "POST",
            success(res) {
                if (res.data.code === 1) {
                    _this.setData({
                        background: res.data.data
                    })
                }
            },
            fail(res) {
                console.log(`request调用失败 ${res.errMsg}`);
            }
        });
    },
    //点击店铺
    onClickShop(event) {
        var thisid = event.currentTarget.dataset.thisid;
        if (thisid) {
            wx.navigateTo({
                url: `/pages/index/info_shop/index?id=${thisid}`,
            })
        }
    },
    //点击热门商品
    onItemClick(event) {
        var thisid = event.currentTarget.dataset.id;
        if (thisid) {
            wx.navigateTo({
                url: `../detail/detail?id=${thisid}`
            });
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
                background: [],/*轮播*/
                advertisement: "",/*广告图片*/
                items: [],/*推荐商品列表*/
                company: {},/*店铺信息*/
            }
        );//先清空数据
        this.onLoad();//再重新加载数据
        wx.stopPullDownRefresh();//停止刷新操作
    },
})