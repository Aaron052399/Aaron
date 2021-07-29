var app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
Page({
  data: {
    grades: [],
    index: 0,
    pic: ''
  },

  bindPickerGrade: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  onShow: function () {
    let userToken = wx.getStorageSync('user_token');
    if (userToken === '' || userToken === 'undefined') {
      app.wxlogin();
    }
  },
  onLoad: function (query) {
    let wxgetPhone = this.selectComponent('.wxgetPhone');
    let wxgetUser = this.selectComponent('.wxgetUser');
    let isAuthUserInfo = wx.getStorageSync('isAuthUserInfo');
    let isAuthPhoneNum = wx.getStorageSync('isAuthPhoneNum');

    let isAuth = 0;

    if (isAuthUserInfo == 0 && isAuthPhoneNum == 0) {
      isAuth = 1;
    }

    if (isAuthUserInfo == 1) {
      wxgetUser && wxgetUser.showRound();
    }

    if (isAuthPhoneNum == 1) {
      wxgetPhone && wxgetPhone.showRound();
    }

    var that = this;
    wx.checkSession({
      success() {},
      fail() {}
    });

    var scene = decodeURIComponent(query.scene);
    if (scene != "" && scene != "undefined") {
      wx.setStorageSync('scene', scene);
    } else {
      scene = "";
    }

    wx.request({
      url: app.globalData.URL + '/ApiLecture/getActivityInfo',
      method: 'POST',
      data: {
        scene: scene
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            pic: res.data.data.bgpic,
            grades: res.data.data.grade,
          });
          wx.setStorageSync('scene', res.data.data.scene)
        }
      }
    });

    wx.request({
      url: app.globalData.URL + '/ApiLecture/register',
      method: 'POST',
      data: {
        token: wx.getStorageSync('user_token'),
        scene: wx.getStorageSync('scene'),
        isAuth: isAuth,
      },
      success: function (res) {
        switch (res.data.code) {
          case 200:
            wx.setStorageSync('isSignIn', res.data.data.isSignIn)
            if (res.data.data.isSignIn == 1) {
              wx.showToast({
                title: '您已签到成功，请勿重复扫码',
                icon: 'none',
                duration: 2000
              });
            }
            if(res.data.data.isSignIn == 0){
              wx.showToast({
                title: '恭喜您，已签到成功！',
                icon: 'none',
                duration: 2000
              });
            }
            setTimeout(function () {
              wx.redirectTo({
                url: res.data.data.redirectUrl
              });
            }, 1000);
            break;
          case 301:
            wx.redirectTo({
              url: res.data.data.redirectUrl
            });
            break;
          case 4001:
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 2000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/register/register'
              })
            }, 3000);
            break;
        }
      },
    });

  },
  formSubmit(e) {
    var that = this;
  },
});