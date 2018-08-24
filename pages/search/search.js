//index.js
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
  // 搜索栏
  onLoad: function (options) {
    that = this;
    util.pagtime=0;
    WxSearch.init(
      that,  // 本页面一个引用
      ['笑话', '动图', "动态图"],
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );

    if (typeof (options.q) == "undefined") {
      util.id = "笑话";

    } else {

      util.id = options.q
    } 
    that.setData({
      imagebool: util.imagebool
    });
    console.log(options)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });

      }
    });
    that.getdata("up");

    wx.showShareMenu({
      withShareTicket: true
    })
  },

  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 搜索回调函数  
  mySearchFunction: function (value) {
   
    util.id = value;
    that.restart2();
    
return false
  },
  restart2: function () {
    util.ajaxbool = false
    util.content = [];
    util.pagtime = 0;
    that.setData({
      mode: util.mode,
      over:false,
      loading: false,
      scrollTop: 0
    });
    that.getdata("up");
  },
  wxSearchConfirm: function (e) {

    that.mySearchFunction(that.data.wxSearchData.value)
  },
  // 返回回调函数
  myGobackFunction: function (value) {

   that.mySearchFunction(value)
  },
  getdata: function (smode) {
 
    util.ajaxbool = true
    wx.request({
      url: util.www + 'search.api' ,
      data: {
        q: util.id,
        pageid: util.pagtime
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        util.pagtime = util.pagtime+1;
        var j = res['data']['data'].length
        var k;
        for (var i = 0; i < res['data']['data'].length; i++) {
          k = j - i - 1;
          res['data']['data'][k]['btime'] = Number(res['data']['data'][k]['btime']);
    
          var str = res['data']['data'][k]['img'];
          if (str == "") {
            res['data']['data'][k]['img'] = [];
          } else {
            str = str.replace(/\{m\}/g, util.bucketcdn)
            res['data']['data'][k]['img'] = str.split(",");

          }
          res['data']['data'][k]['title'] = res['data']['data'][k]['title'].replace(/<\/?.+?>/g, "");

          if (res['data']['data'][k]['vs'] == "") {
          } else {
            res['data']['data'][k]['vs'] = util.bucketcdn + res['data']['data'][k]['vs']
          }
          res['data']['data'][k]['btime'] = util.timeStamp2String(res['data']['data'][k]['btime'])
          if (smode == "up") {
            if (util.in_array(res['data']['data'][k]['id'], util.content) == false) {
              util.content.unshift(res['data']['data'][k])
            }
          } else {
            util.content.push(res['data']['data'][k])
          }
        }

        that.setData({
          mulu: util.content
        })
        wx.setNavigationBarTitle({
          title: util.id,
        })
        if (j < 10) {
          that.setData({
            over:true
          })
        } else {
          util.ajaxbool = false
        }

      }
    })
  },

  lower: function (e) {
    if (util.ajaxbool) return false;
    wx.showToast({
      title: '拼命加载中',
      icon: 'success',
    });
    this.getdata("down");

  }

})
