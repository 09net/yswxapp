var util = require('../../utils/util.js');
var changbool=false
var that
//获取应用实例
const app = getApp()
Page({
  data: {
    keyword: "",
    title: '',
    mode: 0,
    zhenkey: "",
 scrollTop: 0,
    over: false,
    floorstatus: false,
    loading: false,
    scrollHeight: 0,
    networkType: "none",
    imagebool: false,
    isConnected: false,

  },
  onLaunch(options) {   // 监听网络状态变化

    wx.onNetworkStatusChange(res => {

      if (that.data.isConnected != res.isConnected || that.data.networkType != res.networkType) {
        that.setData({
          isConnected: res.isConnected,
          networkType: res.networkType
        });

      }

    })

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  more: function () {
    wx.navigateBack({
      delta: 1
    })

  },
  onLoad: function (options) {

 
    that = this
    this.getdata(options.id);
    that.setData({
      imagebool: util.imagebool
    });


  },

  getdata: function (smode) {
    util.content = [];
    if (smode == 'fav') {
      that.setData({
        mode: 'fav',
      });
      that.setdata(util.fav_data, 'up')
      wx.setNavigationBarTitle({
        title: "收藏夹",
      })
 
    } else {
      that.setData({
        mode: 'look',
      });
      that.setdata(util.look_data,'up')
      wx.setNavigationBarTitle({
        title: "历史记录",
      })
    }


  }, onShareAppMessage: function (ops) {
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
  },
  fav: function () {
    util.content=[];
    that.setData({
      mode: 'fav',
    });
    that.setdata(util.fav_data, 'up')
    wx.setNavigationBarTitle({
      title: "收藏夹",
    })
  },
  look: function () {
    util.content=[];
    that.setData({
      mode: 'look',
    });
    that.setdata(util.look_data, 'up')
    wx.setNavigationBarTitle({
      title: "历史记录",
    })
  },

  setdata: function (data, smode){

   
  var j = data.length
  var k;
  for (var i = 0; i < data.length; i++) {
    k = j - i - 1;
    data[k]['btime'] = Number(data[k]['btime']);
    if (util.pagtime > data[k]['btime'] || util.pagtime == 0) { util.pagtime = data[k]['btime'] }
    var str = data[k]['img'];
    if (str == "") {
      data[k]['img'] = [];
    } else if (typeof (str)=='string') {
      str = str.replace(/\{m\}/g, util.bucketcdn)
      data[k]['img'] = str.split(",");

    }
    
    data[k]['btime'] = util.timeStamp2String(data[k]['btime'])
    if (smode == "up") {
      util.content.unshift(data[k])
    } else {
      util.content.push(data[k])
    }
  }
  
  that.setData({
    mulu: util.content,
    title: '浏览记录'
  })
},
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  keywordin: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  sreach: function () {
    var scontent = [];
    if (this.data.keyword == "") return false;

    var content = [];
    for (var index in ycontent) {
      content[index] = ycontent[index][0].split(this.data.keyword);
    }
    this.setData({
      content: content,
      zhenkey: this.data.keyword
    })
    alli = 0;
    maxi = 0;
    alla = [];
    wx.createSelectorQuery().selectAll('.highlight').boundingClientRect(function (rects) {
      rects.forEach(function (rect) {
        if (maxi > 0) {
          if (alla[maxi - 1] != rect.top) {
            alla[maxi] = rect.top
            maxi++;

          }

        } else {
          alla[maxi] = rect.top
          maxi++;
        }

      })
    }).exec(function (e) {
      if (maxi == 0) {
        wx.showToast({
          title: '无数据',
          icon: 'none',
          duration: 2000
        })
      } else {
        wx.pageScrollTo({
          scrollTop: alla[alli],
          duration: 300
        })


      }
      wx.setNavigationBarTitle({
        title: alli + '/' + maxi,
      })
    });

  },
  title: function () {
    wx.setNavigationBarTitle({
      title: alli + '/' + maxi,
    })
  },
  pre: function () {
    if (alli < 1) {
      wx.showToast({
        title: '已经到顶了',
        icon: 'none',
        duration: 2000
      });
      this.sreach();
    } else {
      alli--;
      wx.pageScrollTo({
        scrollTop: alla[alli],
        duration: 300
      })


    }
    this.title();
  },
  top: function () {

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })

  },
  next: function () {
    if (maxi < alli + 2) {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 2000
      });
      this.sreach();
    } else {
      alli++;
      wx.pageScrollTo({
        scrollTop: alla[alli],
        duration: 300
      })


    }
    this.title();
  }
})
