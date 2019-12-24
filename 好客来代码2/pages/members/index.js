Page({
    pageloadfunc(){
        var _this = this;
        tt.request({
            url: 'https://pianke.jinjieyihua.com/index.php/portal/order/orderList',
            data: {
                openid:tt.getStorageSync('useropenid'),
            },
            header:{'content-type': 'application/x-www-form-urlencoded'},
            method:"POST",
            success (res) {
                if(res.data.code == 1){
                    _this.setData({
                        items: res.data.data,
                        nonecars:false
                    })
                }else{
                    _this.setData({
                        nonecars:true
                    })
                }   
            },
            fail (res) {
                _this.setData({
                    nonecars:true
                })
                console.log(`request调用失败 ${res.errMsg}`);
            }
        });
    },
    onLoad: function () {
        this.pageloadfunc();
    },
    onItemClick (event) {
        var thisid = event.currentTarget.dataset.id;
        if (thisid) {
            tt.navigateTo({
                url: `details/index?id=${thisid}`,
            })
        }
    },
    data: {
        pickerHidden: true,
        chosen: '',
        nonecars:true,
        searchcompanyname:'',
        items: [
            {id:'',product_name:'',product_price:'',product_image:'',add_time:'',status:''}
        ]
    },
    onShow: function(options) {
        tt.getStorage({
                key: 'userid',
                success (res) {
                     console.log(`getStorage调用成功${res.data}`);
                },
                fail (res) {
                    console.log(`getStorage调用失败`);
                }
            });
        tt.setNavigationBarTitle({
            title: '我的订单',
            success (res) {
                console.log(`${res}`);
            },
            fail (res) {
                console.log(`setNavigationBarTitle调用失败${res.errMsg}`);
            }
        });
        this.onLoad()/*重载*/
      },
    onconfirm:function(e) {
        console.log(e.detail.value);
        var searchcomname = e.detail.value;
        this.pageloadfunc(searchcomname);
        tt.showToast({
            title: '加载中...',
            duration: 1500,
            icon:'loading',
            success (res) {
                
            },
            fail (res) {
                console.log(`showToast调用失败`);
            }
        });
    },
    inputchange:function(e) {
        if(e.detail.value==''){
            var searchcomname = '';
            this.pageloadfunc(searchcomname);
            tt.showToast({
                title: '加载中...',
                duration: 1500,
                icon:'loading',
                success (res) {
                    
                },
                fail (res) {
                    console.log(`showToast调用失败`);
                }
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
        });
        this.setData({items:[]});//先清空数据
        this.onLoad();//再重新加载数据
        wx.stopPullDownRefresh();//停止刷新操作
    },
    // 页面触底时执行
    onReachBottom: function() {
        wx.showToast({
            title: '没有更多数据',
        });
        // this.setData({items:[]});//先清空数据
        // this.onLoad();//再重新加载数据
    },
})