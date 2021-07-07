var app=getApp();
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
      isClose:wx.getStorageSync('isClose')

    },
    methods:{
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
    getPhoneNumber (e) {
       var that=this;
      wx.request({
      url: app.globalData.URL+'/Api/getPhone',
      method:'POST',
      data: {
        scene:wx.getStorageSync('scene'),
        address:wx.getStorageSync('address'),
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        token:wx.getStorageSync('user_token'),
        channel1:wx.getStorageSync('channel1'),
        channel2:wx.getStorageSync('channel2'),
        channel3:wx.getStorageSync('channel3'),
       
      },
      success:function(res1){
        console.log(res1);
          if(res1.data.code==200){
            wx.setStorageSync('step', res1.data.data.step);
            if(res1.data.data.step==2){
              that.hideRound();
            }
          }
          if(res1.data.code==201){
            app.wxlogin();
        }
      }
    })
    }
  },
    onLoad: function() {
      console.log(wx.getStorageSync('isColse'))
        // 查看是否授权
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  console.log(res.userInfo)
                }
              })
            }
          }
        })
      },
      
  

 
 
  

  
  
  
   
  });
  