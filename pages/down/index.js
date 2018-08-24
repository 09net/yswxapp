var util = require('../../utils/util.js');
const app = getApp()
var that
var upimgi=0
var upvod = false
Page({
  data: {
    fonesize: 14,
    img:[],
    vs: "",
    viewmode: 1,
    userinfo:{},
    loginbool:true
  }, onLoad: function (options) {
    that=this
    if (typeof (options.url) == "undefined") {
      that.data.url = "https://zh.ysv8.com";

    } else {
      that.data.url = options.url;
      
    }
    that.setData({
      url: that.data.url,
    })

    wx.setNavigationBarTitle({
      title: "浏览器",
    })
   
   
  },onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: util.title,
      path: 'pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '感谢您的分享',
          icon: 'success'
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '您取消了分享',
          icon: 'success'
        })
      }
    }
  }
  
})
