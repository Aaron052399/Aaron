var app=getApp();
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
      canIUse: wx.canIUse('button.open-type.getUserInfo')
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
},
    onLoad: function() {
        var that=this;
        // 查看是否授权
        wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                    app.getUserInfo(res);
                }
              })
            }
          }
        })
      },
      bindGetUserInfo (e) {
        app.getUserInfo(e.detail);
       
      }
  

 
 
  

  
  
  
   
  });
  