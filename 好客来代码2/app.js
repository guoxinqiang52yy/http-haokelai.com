App({
    onLaunch: function () {
        tt.login({
            success (res) {
                var code = res.code;
                var anonymous_code = res.anonymousCode;
                tt.getUserInfo({
                    success (res) {
                        var that = this;
                        var avatarUrl = '';//用户头像
                        var nickName = '';//用户名
                        avatarUrl = res.userInfo.avatarUrl;
                        nickName = res.userInfo.nickName;
                        let task = tt.request({
                            url: 'https://pianke.jinjieyihua.com/index.php/portal/user/dyLogin',
                            data: {
                                code: code,
                                avatarUrl:avatarUrl,
                                nickName:nickName,
                                anonymous_code:anonymous_code
                            },
                            header:{'content-type': 'application/x-www-form-urlencoded'},
                            method:"POST",
                            success (res) {
                                if(res.data.code == 1){//业务成功
                                    tt.setStorage({
                                        key: 'userid',
                                        data: res.data.data.user_id,
                                        success (res) {
                                            console.log(`set seen ad flag`);
                                        },
                                        fail (res) {
                                            console.log(`setStorage调用失败`);
                                        }
                                    });
                                    tt.setStorage({
                                        key: 'useropenid',
                                        data: res.data.data.openid,
                                        success (res) {
                                            console.log(`set seen ad flag`);
                                        },
                                        fail (res) {
                                            console.log(`setStorage调用失败`);
                                        }
                                    });
                                    tt.showToast({
                                        title: '登陆成功',
                                        icon:'none'
                                    })
                                }else{//业务失败
                                    console.log(res.msg);
                                }
                            },
                            fail (res) {
                                console.log(`request调用失败 ${res.errMsg}`);
                            }
                        });
                    },
                    fail (res) {
                        console.log(`getUserInfo调用失败`);
                    }
                });            
            },
            fail (res) {
                console.log(`login调用失败`);
            }
       });
        tt.hideShareMenu({
            success (res) {
                console.log(`hideShareMenu 调用成功`);
            },
            fail (res) {
                console.log(`hideShareMenu 调用失败`);
            }
        });
    }
})
