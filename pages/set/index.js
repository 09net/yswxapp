var util = require('../../utils/util.js');
const app = getApp()
var that
Page({
  data: {
    fonesize: 14,
    viewmode: 1,
    userinfo:{},
    loginbool:true,
    qiandao:"签到",
    imagebool:false
  }, home: function () {
    if (getCurrentPages().length >= 2) {
      wx.navigateBack({
        delta: 1
      })

      return false;
    }
    console.log("重定向")
    wx.navigateTo({
      url: '/pages/index/index'
    })

  }, tixian: function (e) {
    if (util.userinfo.gold < 38888){
      wx.showModal({
        title: '金币不足',
        content: '兑换100元需要38888金币',
        showCancel: false,
        success: function (res) {
        }
      })
      return false
    }
    wx.request({
      url: util.www + 'user/tixian.api',
      data: {
        YSV8_HEX: util.ysv8hex
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (info) {

        if (info.data['code'] == 200) {
          util.userinfo.gold = info.data['gold'];
          util.userinfo.credits = info.data['credits'];
          wx.setStorageSync('userinfo', util.userinfo)
          that.setData({
            userinfo: util.userinfo
          });


          wx.showModal({
            title: '提现成功',
            content: '等客服审核后，您将收到100元红包',
            showCancel: false,
            success: function (res) {
            }
          })


        } else {

          util.mswal(info.data, false);
        }
      
      }
    })



    
  },
  out: function (e) {
    util.ysv8hex = ""
    wx.removeStorageSync('ysv8hex')
    util.userinfo = {};
    wx.removeStorageSync('userinfo')

    that.setData({
      userinfo: util.userinfo,
      loginbool: true
    });
    wx.showModal({
      title: '退出成功',
      content: '请登陆，请点击顶部的【登录】按钮',
      showCancel: false,
      success: function (res) {
      }
    })

  },
  qiandao:function(e){
    if (that.data.loginbool) {
      wx.showModal({
        title: '未登陆',
        content: '请登陆，请点击顶部的【登录】按钮',
        showCancel: false,
        success: function (res) {
        }
      })
      return false;
    }
    try {
      var value = wx.getStorageSync('qiandao')
      if (value) {
        if (util.newDay == value){
          that.setData({
            qiandao: "已签"
          });
          wx.showModal({
            title: '错误',
            content: "本机今日已领",
            showCancel: false,
            success: function (res) {
            }
          })
          return false;

        }
      }
    } catch (e) {
    }

    wx.request({
      url: util.www + 'user/qiandao.api',
      data: {
        YSV8_HEX: util.ysv8hex
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (info) {

        if (info.data['code'] == 200) {
          util.userinfo.gold = info.data['gold'];
          util.userinfo.credits = info.data['credits'];
          wx.setStorageSync('userinfo', util.userinfo)
            that.setData({
              userinfo: util.userinfo,
              qiandao: "已签"
            });


          wx.showModal({
            title: '金币+' + info.data['info'],
            content: '暴击倍数：' + info.data['rnd']+'(最高1万倍)',
            showCancel: false,
            success: function (res) {
            }
          })


        } else {

          util.mswal(info.data,false);
        }
        wx.setStorageSync('qiandao', info.data['data'])
      }
    })



  },
  bindGetUserInfo: function (e) {
   
    if (e.detail.userInfo) {
      

      var rawData = e.detail.rawData;
      var signature = e.detail.signature;
      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      var euserInfo = e.detail.userInfo;
      
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.request({
            url: util.www +'weixin/login.api',
            data: {
              "code": code,
              "rawData": rawData,
              "signature": signature,
              'iv': iv,
              'encryptedData': encryptedData
            },
            method: 'GET',
            success: function (info) {
  
              if (info.data.code==200 ){
                util.ysv8hex = info.data.ysv8hex
              wx.setStorageSync('ysv8hex', util.ysv8hex)
                util.userinfo = euserInfo;

                util.userinfo.gold= info.data['gold'];
                util.userinfo.credits = info.data['credits'];

                wx.setStorageSync('userinfo', util.userinfo)
              wx.showToast({
                title: '成功',
                icon: 'success',
              });
              that.setData({
                loginbool: false,
                userinfo: util.userinfo
              });
   
            }else{

              wx.showToast({
                title: '请重试',
                icon: 'success',
              });
            }
            }
          })



        }
      });
    } else {
      wx.showToast({
        title: '登录体验更好',
        icon: 'success',
      });
    }


   

  },
  
  onLoad: function (options) {

 

    that=this
    if (util.ysv8hex == false || util.userinfo == false){
      wx.showToast({
        title: '请点击登录按钮',
        icon: 'success',
      });

    }else{
  
      try {
        var value = wx.getStorageSync('qiandao')
        if (value) {
          if (util.newDay == value) {
            that.setData({
              qiandao: "已签"
            });
          }
        }
      } catch (e) {
      }

      console.log(util.imagebool)
     
        that.data.loginbool=false;
        that.data.userinfo=util.userinfo;
     
    }
    that.setData({
      loginbool: that.data.loginbool,
      userinfo: that.data.userinfo,
      imagebool: util.imagebool
    });
    wx.setNavigationBarTitle({
      title: "个人中心",
    })
   
  },imagebool:function(e){
    util.imagebool = e.detail.value
    that.setData({
      imagebool: util.imagebool
    }); 

   
      wx.setStorageSync('imagebool', util.imagebool)
    
  }
  ,onShareAppMessage: function (ops) {
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
, mode0: function () {
    util.mode = 0;
    util.that.restart();
  },
  mode1: function () {
    util.mode = 1;
    util.that.restart();
  },
  mode2: function () {
    util.mode = 2;
    util.that.restart();
  },
  mode3: function () {
    util.mode = 3;
    util.that.restart();
  },
  fonesize: function (e) {
    try {
      wx.setStorageSync('fonesize', e.detail.value)
      app.globalData.fonesize = e.detail.value
      var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];  //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          fonesize: e.detail.value
        })
    } catch (e) {

    }
  },
  navigateBack: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },
  
  viewmode: function (e) {
    try {
      wx.setStorageSync('viewmode', e.detail.value)
      app.globalData.viewmode = e.detail.value
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.setData({
        viewmode: e.detail.value
      })
    } catch (e) {

    }
  },
  
})
