//app.js

App({
  onShow() {
    let isAuthUserInfo = wx.getStorageSync('isAuthUserInfo');
    let isAuthPhoneNum = wx.getStorageSync('isAuthPhoneNum');

    if (isAuthUserInfo != 0 || isAuthUserInfo === '') {
      wx.setStorageSync('isAuthUserInfo', 1);
    }

    if (isAuthPhoneNum != 0 || isAuthUserInfo === '') {
      wx.setStorageSync('isAuthPhoneNum', 1);
    }  

    let userToken = wx.getStorageSync('user_token');

    if (userToken == '' || userToken == 'undefined') {
      this.wxlogin();
    }
  },

  onLoad(query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    var scene = decodeURIComponent(query.scene);
    if (scene != "" && scene != "undefined") {
      wx.setStorageSync('scene', scene);
    }
  },
  //设置全局请求URL

  getUserInfo(data) {
    var that = this;
    wx.request({
      url: that.globalData.URL + '/ApiLecture/userInfo',
      method: 'POST',
      data: {
        scene: that.scene,
        encryptedData: data.encryptedData,
        iv: data.iv,
        token: wx.getStorageSync('user_token')
      },
      success: function (res1) {
        if (res1.data.code == 200) {
          wx.setStorageSync('user_token', res1.data.data.token);
          wx.setStorageSync('isGetUserInfo', 1);
        }
      }
    })
  },
  getPhone(ret) {
    var that = this;
    wx.request({
      url: that.globalData.URL + '/Api/getPhone',
      method: 'POST',
      data: {
        scene: wx.getStorageSync('scene'),
        address: wx.getStorageSync('address'),
        encryptedData: ret.detail.encryptedData,
        iv: ret.detail.iv,
        token: wx.getStorageSync('user_token')

      },
      success: function (res1) {
        if (res1.data.code == 200) {
          wx.setStorageSync('step', res1.data.data.step);
        }
        if (res1.data.code == 201) {
          that.wxlogin();
        }
      }
    })
  },
  wxlogin: function () {
    var that = this;
    var value = wx.getStorageSync('user_token');
    wx.showLoading({
      title: '加载中...',
    })

    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.URL + '/ApiLecture/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function (res1) {
              if (res1.data.code == 200) {
                wx.setStorageSync('user_token', res1.data.data.token);
                wx.setStorageSync("step", res1.data.data.step);
                wx.setStorageSync("isShow", res1.data.data.isShow);
                wx.getStorageSync("isLogin", 1);
                wx.setStorageSync("isAuthPhoneNum", res1.data.data.isAuthPhoneNum);
                wx.setStorageSync("isAuthUserInfo", res1.data.data.isAuthUserInfo);
                if (res1.data.data.scene > 0) {
                  wx.setStorageSync("scene", res1.data.data.scene);
                }
              }
            },
            complete: function () {
              wx.hideLoading();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg);
          wx.hideToast();
          wx.showToast({
            title: '登陆失败，请稍后再试！',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })

  },

  onLaunch: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    URL: 'https://mini.zhixue16.com',
    scene: '',
  },


})