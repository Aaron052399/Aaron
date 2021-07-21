var app = getApp();
Component({
  data: {
    show: {
      basic: false,
      top: false,
      bottom: false,
      left: false,
      right: false,
      round: false,
      closeIcon: false,
      customCloseIcon: false,
      customIconPosition: false
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isClose: wx.getStorageSync('isClose'),
    isHide: wx.getStorageSync('isAuthPhoneNum'),
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

    getPhoneNumber(e) {
      var that = this;
      // wx.showToast({
      //   title: '请稍后...',
      //   icon: 'loading',
      //   duration: 10000,
      //   mask: true
      // });
      wx.showLoading({
        title: '加载中...',
      });
      wx.request({
        url: app.globalData.URL + '/ApiLecture/getPhone',
        method: 'POST',
        data: {
          activity_id: wx.getStorageSync('activity_id'),
          address: wx.getStorageSync('address'),
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          token: wx.getStorageSync('user_token'),
        },
        success: function (res1) {
          switch (res1.data.code) {
            case 200:
              wx.setStorageSync('step', res1.data.data.step);
              wx.setStorageSync("isAuthPhoneNum", 0);
              if (res1.data.data.step == 2) {
                that.hideRound();
                if (res1.data.data.isSignIn == 1) {
                  wx.showToast({
                    title: '您已成功签到，请勿重复扫码',
                    icon: 'none',
                    duration: 2000
                  })
                }
                setTimeout(function () {
                  wx.hideLoading();
                  wx.redirectTo({
                    url: res1.data.data.redirectUrl,
                  });
                }, 1000);
              }
              break;
            case 201:
              wx.showToast({
                title: '服务器错误，请重试！',
                icon: 'none',
                duration: 2000
              })
              app.wxlogin();
              break;
            case 4001:
              wx.showToast({
                title: res1.data.info,
                icon: 'none',
                duration: 2000
              });
              wx.redirectTo({
                url: res1.data.data.redirectUrl,
              })
              break;
          }
        },
        complete: function () {
          // wx.hideToast();
        }
      })
    }
  },
  onLoad: function () {
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
});