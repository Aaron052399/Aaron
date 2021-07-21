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
    let wxgetPhone = this.selectComponent('.wxgetPhone');
    let wxgetUser = this.selectComponent('.wxgetUser');

    let isAuthPhoneNum = wx.getStorageSync('isAuthPhoneNum');
    let isAuthUserInfo = wx.getStorageSync('isAuthUserInfo');

    let userToken = wx.getStorageSync('user_token');
    if (userToken == '' || userToken == 'undefined') {
      app.wxlogin();
    }

    if (isAuthUserInfo != false) {
      wxgetUser && wxgetUser.showRound();
    }

    if (isAuthPhoneNum != false) {
      wxgetPhone && wxgetPhone.showRound();
    }

  },
  onLoad: function (query) {
    var that = this;
    wx.checkSession({
      success() {},
      fail() {}
    });

    var qqmapsdk = new QQMapWX({
      key: 'UZ2BZ-2VTRU-XR4VZ-4JFHH-KHF37-LBFWT'
    });

    let map_num = wx.getStorageSync("map_num");
    if (map_num == '' || map_num == 'undefined') {
      qqmapsdk.reverseGeocoder({
        success: function (res) {
          wx.setStorageSync("address", res.result.address);
        },
      });
      wx.setStorageSync("map_num", 1);
    }

    var activity_id = decodeURIComponent(query.activity_id);
    if (activity_id != "" && activity_id != "undefined") {
      wx.setStorageSync('activity_id', activity_id);
    } else {
      activity_id = "";
    }

    wx.request({
      url: app.globalData.URL + '/ApiLecture/getActivityInfo',
      method: 'POST',
      data: {
        activity_id: activity_id
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            pic: res.data.data.bgpic,
            grades: res.data.data.grade,
          });
        }
      }
    });
    wx.request({
      url: app.globalData.URL + '/ApiLecture/register',
      method: 'POST',
      data: {
        token: wx.getStorageSync('user_token'),
        address: wx.getStorageSync('address'),
        scene: wx.getStorageSync('scene')
      },
      success: function (res) {
        switch (res.data.code) {
          case 200:
            wx.setStorageSync('isSignIn', res.data.data.isSignIn)
            if(res.data.data.isSignIn == 1)
            {
              wx.redirectTo({
                url: res.data.data.redirectUrl
              });
            }
            break;
          case 301:
            wx.redirectTo({
              url: res.data.data.redirectUrl
            });
            break;
            // case 4001:
            //   wx.showToast({
            //     title: res.data.info,
            //     icon: 'none',
            //     duration: 2000
            //   });
            //   setTimeout(function () {
            //     wx.redirectTo({
            //       url: '/pages/register/register'
            //     })
            //   }, 3000);
            //   break;
        }
      },
    });

  },
  formSubmit(e) {
    var that = this;
  },
});