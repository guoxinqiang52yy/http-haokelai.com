Page({
  onLoad (options) {
    let sku = options.id || '';
    this.setData({
        urlid:sku
    });
    var _this = this;
    let task = tt.request({
        url: 'https://pianke.jinjieyihua.com/index.php/portal/user/accountLog',
        data: {
            id: _this.data.urlid,
        },  
        header:{'content-type': 'application/x-www-form-urlencoded'},
        method:"POST",
        success (res) {
            console.log(res.data);
            if(res.data.code===1){
              _this.setData({
                items:res.data.data
              })
            }else if(res.data.code===0){

            }
        },
        fail (res) {
            console.log(`request调用失败`);
        }
    });
  },
  data: {
    urlid:'',
    items:[
      {"id": "2","money": "2999","title": "充值","type": "0","add_time": "2019-09-17 14:32:46","order_number": "gdyfgays238748328838835","delete_time": "0","remark": null,"company_id": "1","user_id": "2","ucard": "2"},
      {"id": "4","money": "100","title": "买了1星英雄","type": "2","add_time": "2019-09-17 14:32:46","order_number": "gdyfgays238748328838836","delete_time": "0","remark": "","company_id": "1","user_id": "2","ucard": "2"}
    ],
  }
})