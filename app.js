//app.js
App({
  onLaunch: function () {
    try {
      var value = wx.getStorageSync('fonesize')
      if (value) {
        this.globalData.fonesize = value
      }
    } catch (e) {
    
    }
    try {
      var value = wx.getStorageSync('viewmode')
      if (value) {
        this.globalData.viewmode = value
      }
    } catch (e) {

    }
  },
  globalData: {
    fonesize: 14,
    viewmode:1
  }
})