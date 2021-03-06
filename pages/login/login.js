var app = getApp();
Page({
  data: {
    grades: [],
    index: 0,
    pic: ''
  },

  bindPickerGrade: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onShow: function () {

  },
  onLoad: function (query) {
    wx.showToast({
      title: '您未完善用户信息，请先完善',
      icon: 'none',
      duration: 2000
    });
    var that = this;

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
        scene: wx.getStorageSync('scene')
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            pic: res.data.data.bgpic,
            grades: res.data.data.grade,
          });
        }
      }
    })
  },
  formSubmit(e) {
    if (e.detail.value.userName == "") {
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var that = this;
    wx.request({
      url: app.globalData.URL + '/ApiLecture/enroll',
      method: 'POST',
      data: {
        name: e.detail.value.userName,
        grade_id: that.data.grades[that.data.index].id,
        token: wx.getStorageSync('user_token'),
        scene: wx.getStorageSync('scene')
      },
      success: function (res) {
        switch (res.data.code) {
          case 200:
            wx.redirectTo({
              url: res.data.data.redirectUrl
            })
            break;
          case 9001:
            wx.showToast({
              title: res.data.info,
              icon: 'none',
              duration: 2000
            });
            break;
          default:
            app.wxlogin();
            wx.showToast({
              title: '服务器忙，请重试',
              icon: 'success',
              duration: 2000
            });
            break;
        }
      },

    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
});