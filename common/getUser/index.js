Page({
    data: {
      show: {
        basic: false,
        top: false,
        bottom: false,
        left: false,
        right: false,
        round: true,
        closeIcon: false,
        customCloseIcon: false,
        customIconPosition: false
      },
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
  
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
  

 
 
  

  
  
  
   
  });
  