var WxSearch = require('../../wxSearchView/wxSearchView.js');
var util = require('../../utils/util.js');
//获取应用实例
const app = getApp()
var that
var ajaxurl;
Page({
  data: {
    keyword: "",
    title: '',
    mode: 0,
    zhenkey: "",
    scrollTop:0,
    over:false,
    floorstatus: false,
    loading:false,
    scrollHeight: 0,
    networkType:"none",
    imagebool:false,
    isConnected:false,

  },
  onLaunch(options) {   // 监听网络状态变化

    wx.onNetworkStatusChange(res => {

      if (that.data.isConnected != res.isConnected || that.data.networkType != res.networkType){
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
    wx.navigateTo({
      url: '/pages/set/index'
    })

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
  onLoad: function (options) {


    that = this;
    WxSearch.init(
      that,  // 本页面一个引用
      ['杭州', '嘉兴', "海宁", "桐乡", '宁波', '金华'], // 热点搜索推荐，[]表示不使用
      ['湖北', '湖南', '北京', "南京"],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );
    that.setData({
      imagebool: util.imagebool
    });
    if (typeof (options.fid) == "undefined") {
      util.fid = 11;

    } else {

      util.fid = options.fid
    }
    if (typeof (options.mode) == "undefined") {
      util.mode = 0;

    } else {

      util.mode = options.mode
    }
    that.setData({
      loading: false
    });
    util.content = [];
    util.pagtime = 0;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          mode: util.mode,
          scrollHeight: res.windowHeight
        });

      }
    });
    that.getdata("up");

    wx.showShareMenu({
      withShareTicket: true
    })

  }, mode0: function () {
    util.mode = 0;
    that.restart2();
  },
  mode1: function () {
    util.mode = 1;
    that.restart2();
  },
  mode2: function () {
    util.mode = 2;
    that.restart2();
  },
  mode3: function () {
    util.mode = 3;
    that.restart2();
  },
  goTop: function (e) {
    that.setData({
      scrollTop: 0
    })
  }, scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 300) {
      that.setData({
        floorstatus: true
      });
    } else {
      that.setData({
        floorstatus: false
      });
    }
  },
  restart2:function () {
   
    that.setData({
      loading: false,
      scrollTop: 0
    });
    util.content = [];
    util.pagtime = 0;
    that.setData({
      mode: util.mode,
      mulu: []
    });
    that.getdata("up");
  },
  getdata: function (smode) {
    if (smode == "up") { ajaxurl = util.www + 'f/' + util.fid + '/' + util.mode + '/0.api'; }else{ajaxurl = util.www + 'f/' + util.fid + '/' + util.mode + '/' + util.pagtime + '.api';}
    that.setData({
    loading:true
    });
    wx.request({
      url: ajaxurl,
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var j = res['data']['data'].length
        var k;
        for (var i = 0; i < j; i++) {
          k = j - i - 1;
          res['data']['data'][k]['btime'] = Number(res['data']['data'][k]['btime']);
          if (util.pagtime > res['data']['data'][k]['btime'] || util.pagtime == 0) { util.pagtime = res['data']['data'][k]['btime'] }
          var str = res['data']['data'][k]['img'];
          if (str == "") {
            res['data']['data'][k]['img'] = [];
          } else {
            str = str.replace(/\{m\}/g, util.bucketcdn)
            res['data']['data'][k]['img'] = str.split(",");

          }
          if (res['data']['data'][k]['vs'] == "") {
          } else {
            res['data']['data'][k]['vs'] = util.bucketcdn + res['data']['data'][k]['vs']
          }
          res['data']['data'][k]['btime'] = util.timeStamp2String(res['data']['data'][k]['btime'])
          if (smode == "up") {
            if (util.in_array(res['data']['data'][k]['id'], util.content) == false){
            util.content.unshift(res['data']['data'][k])
            }
          } else {
            util.content.push(res['data']['data'][k])
          }
        }

        that.setData({
          mulu: util.content,
          title: res['data']['title']
        })

        if (j < 10) {
          that.setData({
            over: true
          })
        } else {
          wx.setNavigationBarTitle({
            title: res['data']['title'],
          })
          that.setData({
            loading: false
          });
        }

      }
    })
  },
  onShow: function (e) {
   
    try {
      var value = wx.getStorageSync('imagebool')
      if (value) {
        util. imagebool = value;
      }
    } catch (e) {
      util. imagebool = false;
    }


    that.setData({
      loading: false,
      imagebool: util.imagebool
    });
  },
  upper: function (e) {
    if (that.data.loading) return false;
    wx.showToast({
      title: '拼命刷新中',
      icon: 'success',
    });
    this.getdata("up");

  },
  lower: function (e) {
    if (that.data.loading) return false;
    wx.showToast({
      title: '拼命加载中',
      icon: 'success',
    });
    this.getdata("down");

  },
  goto: function (e) {
    wx.createSelectorQuery().select('#p' + e.target.id).boundingClientRect(function (rect) {

      wx.pageScrollTo({
        scrollTop: rect.top - 60,
        duration: 300
      })

    }).exec()


    wx.pageScrollTo({
      scrollTop: alla[alli],
      duration: 300
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
  }, wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: function(e) {
    wx.navigateTo({
      url: '../search/search?q=' + that.data.wxSearchData.value
    })
  },
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数
 
  mySearchFunction: function (value) {
    wx.navigateTo({
      url: '../search/search?q=' + value
    })
  },
  

  myGobackFunction: function (value) {
    console.log(value)
    wx.navigateTo({
      url: '../search/search?q=' + value
    })
  }
})
