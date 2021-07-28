// pages/tishi/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pic: '',
        isHidden: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var scene = wx.getStorageSync('scene');
        if (scene === '') {
            scene = decodeURIComponent(options.scene);
            if (scene != "" && scene != "undefined") {
                wx.setStorageSync('scene', scene);
            } else {
                scene = "";
            }
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
                        isHidden: false,
                        // v.MONTH_SUM <= 0 ? 0 : parseFloat(v.MONTH_SUM)
                        // 如果 v.MONTH_SUM <= 0 返回的结果是true的话 输出0 否则输出 parseFloat(v.MONTH_SUM)
                    });
                }
            }
        });
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        wx.setNavigationBarColor({
            frontColor: '#000000',
            // backgroundColor: '#DCDCDC',
        });

        // wx.showToast({
        //     title: '您已成功签到',
        //     image: '/pages/images/complete.png',
        //     duration: 3000,
        //     mask: true
        // });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})