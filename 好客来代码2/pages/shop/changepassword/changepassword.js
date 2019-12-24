Page({
  data: {
    pickerHidden: true,
    chosen: ''
  },
  formSubmit: function (e) {
    if(e.detail.value.oldpassword==''){
      tt.showToast({
        title: '旧密码不能为空',
        duration: 2000,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`showToast调用失败`);
        }
      });
      return
    }else if(e.detail.value.newpassword==''){
      tt.showToast({
        title: '新密码不能为空',
        duration: 2000,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`showToast调用失败`);
        }
      });
      return
    }else if(e.detail.value.againnewpassword==''){
      tt.showToast({
        title: '确认新密码不能为空',
        duration: 2000,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`showToast调用失败`);
        }
      });
      return
    }else if(e.detail.value.newpassword.length<6||e.detail.value.newpassword.length>20){
      tt.showToast({
        title: '密码长度为6-20位',
        duration: 2000,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`showToast调用失败`);
        }
      });
      return
    }else if(e.detail.value.againnewpassword!=e.detail.value.newpassword){
      tt.showToast({
        title: '两次新密码不一致',
        duration: 2000,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`showToast调用失败`);
        }
      });
      return
    }else{
      let task = tt.request({
        url: 'https://pianke.jinjieyihua.com/index.php/portal/user/editPassword',
        data: {
            openid: tt.getStorageSync('useropenid'),
            password:e.detail.value.newpassword,
            old_password:e.detail.value.oldpassword
        },
        header:{'content-type': 'application/x-www-form-urlencoded'},
        method:"POST",
        success (res) {
          console.log(res.data);
          if(res.data.code==0){
            tt.showToast({
              title:'修改失败',
              duration:1500,
            })
          };
          if(res.data.code==1){
            tt.showToast({
              title: '修改成功',
              duration: 1500,
              success (res) {
                setTimeout(function () {
                  tt.navigateBack({
                    delta: 1,
                    success (res) {
                        console.log(`${res}`);
                    },
                    fail (res) {
                        console.log(`navigateBack调用失败`);
                    }
                  });
                }, 1500) 
                
              },
              fail (res) {
                  console.log(`showToast调用失败`);
              }
            });
          }
          if (res.data.code===-1){
            tt.showToast({
              title: '旧密码错误',
              duration: 1500,
            })
          }
        },
        fail (res) {
            console.log(`request调用失败 ${res.errMsg}`);
        }
    });
    }
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})