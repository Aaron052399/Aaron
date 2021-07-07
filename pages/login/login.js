var app=getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
Page({
  data: {
    grades:[],
    index:0,
    channel1:0,
    channel2:0,
    channel3:0,
      pic:''
    
      
  },
  
  bindPickerGrade: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onShow:function(){
    
    // let wxgetPhone = this.selectComponent('.wxgetPhone');
    // let wxgetUser = this.selectComponent('.wxgetUser');
    // //wxgetUser && wxgetUser.showRound();
    // var step = wx.getStorageSync('step');
    // if(step==""||step=="1"){
    //   wxgetPhone && wxgetPhone.showRound();
    // }
   
    
    
    
  },
  onLoad: function(query) {
    var that=this; 
     
    wx.checkSession({
    
      success(){
      
      },
       fail() {
        
         app.wxlogin();
       }
     })
    var qqmapsdk = new QQMapWX({
      key: 'UZ2BZ-2VTRU-XR4VZ-4JFHH-KHF37-LBFWT'
  });
  var scene1=decodeURIComponent(query.scene);
  if(scene1!=""&&scene1!="undefined"){
    wx.setStorageSync('scene',scene1);
  }else{
    scene1="";
  }
    wx.request({
      url: app.globalData.URL+'/Test/getScene',
      method:'POST',
      data: {
        scene:scene1
       
      },
      success:function(res){
      
          if(res.data.code==200){
            that.setData({
              pic:res.data.data.bgpic,

              grades:res.data.data.grade,
             
             
            });
            // wx.setStorageSync("channel1",res.data.data.channel1.id);
            // wx.setStorageSync("channel2",res.data.data.channel2.id);
            // wx.setStorageSync("channel3",res.data.data.channel3.id);
          }
      }
    }),
    qqmapsdk.reverseGeocoder({
      success: function(res){
        wx.setStorageSync("address",res.result.address);
      
      }
    });
  },
  formSubmit(e) {
    if(e.detail.value.userName==""){
      wx.showToast({
        title: '请输入学生姓名',
        icon: 'success',
        duration: 2000
        })
      return;
    }
    var that=this;
    console.log(e);
    wx.request({
      url: app.globalData.URL+'/Api/reg',
      method:'POST',
      data: {
        name:e.detail.value.userName,
        grade_id:that.data.grades[that.data.index].id,
        token:wx.getStorageSync('user_token'),
        address:wx.getStorageSync('address')
       
      },
      success:function(res){
        if(res.data.code==200){
        wx.redirectTo({
          url: '/pages/tishi/index'
        })
      }else{
        wx.showToast({
          title: '服务器忙，请重试',
          icon: 'success',
          duration: 2000
          })
      }
      },
     
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
});
