var app = getApp();
Component({
  data: {
    show: {
      basic: true,
      top: true,
      bottom: true,
      left: true,
      right: true,
      round: false,
      closeIcon: true,
      customCloseIcon: true,
      customIconPosition: true
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isShow: wx.getStorageSync('isShow'),
    isHide: wx.getStorageSync('isAuthUserInfo'),
  },
  methods: {
    toggle(type, show) {
      this.setData({
        [`show.${type}`]: show
      });
    },

    showRound() {
      this.toggle('round', true);
    },

    hideRound() {
      this.toggle('round', false);
    },

    comeBack() {
      wx.redirectTo({
        url: '/pages/index/index'
      });
    },

    bindGetUserInfo(e) {
      var that = this;
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.globalData.URL + '/ApiLecture/userInfo',
        method: 'POST',
        data: {
          token: wx.getStorageSync('user_token'),
          scene: wx.getStorageSync('scene'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        success: function (res1) {
          switch (res1.data.code) {
            case 200:
              wx.setStorageSync('user_token', res1.data.data.token);
              wx.setStorageSync('isAuthUserInfo', 0);
              that.hideRound();
              break;
            case 201:
              wx.showToast({
                title: res1.data.info,
                icon: 'none',
                duration: 2000
              });
              setTimeout(function () {
                wx.hideToast();
                app.wxlogin();
              }, 1500);
              break;
            case 4001:
              wx.showToast({
                title: res1.data.info,
                icon: 'none',
                duration: 2000
              });
              break;
            default:
              wx.showToast({
                title: '服务器错误，请重试！',
                icon: 'none',
                duration: 2000
              });
              break;
          }
        },
        complete: function () {
          wx.hideLoading();
        }
      })
    },

  },
  onLoad: function () {
    var that = this;
    that.setData({
      'isShow': wx.getStorageSync('isShow')
    })
    // 查看是否授权
    wx.getSetting({
      success(res) {
        console.log('res' + res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.getUserInfo(res);
            }
          })
        }
      }
    })
  },
});