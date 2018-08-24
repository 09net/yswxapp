var util = require('../../utils/util.js');
let wxparse = require("../../wxParse/wxParse.js");
const app = getApp()

var that
Page({
  data: {
    tdata: [],
    content: "",
    PostList:[],
    files:[],
    keyword:"",
    vote:"",
    title:'',
    share:false,
    fav:false,
    over: false,
    zhenkey: "",
    loading:false
  }, home: function () {
    console.log(getCurrentPages())
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
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, more: function () {
    wx.navigateTo({
      url: '/pages/set/index'
    })

  }, onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: that.title,
      path: 'pages/look/index?id=' + util.id,
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
  goods:function(){
    if (util.in_array(util.id, util.ding_data)){
      return false;
    }
    wx.request({
      url: util.www + 'thread/vote.api',
      data: {
        id: util.id, type: 'goods',
        YSV8_HEX: util.ysv8hex

      },
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.code==200){
          util.ding_data = util.str_push({
            id: util.id,
            size: "goods"
          }, util.ding_data)
          wx.setStorageSync('ding_data', util.ding_data)

        that.data.tdata['goods'] = Number(that.data.tdata['goods'])+1,
          that.setData({
          tdata: that.data.tdata,
          vote:"goods"
        });
        }else{
          util.mswal(res.data);

        }  
      }
    });

  


  },
  nos: function () {
    if (util.in_array(util.id, util.ding_data)) {
      return false;
    }
    wx.request({
      url: util.www + 'thread/vote.api',
      data: {
        id: util.id, type: 'nos',
        YSV8_HEX: util.ysv8hex
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {

        if (res.data.code == 200) {
          util.ding_data = util.str_push({
            id: util.id,
            size: "nos"
          }, util.ding_data)
          wx.setStorageSync('ding_data', util.ding_data)
          that.data.tdata['nos'] = Number(that.data.tdata['nos']) + 1,
            that.setData({
              tdata: that.data.tdata,
              vote: "nos"
            });
        } else {
          util.mswal(res.data);

        }

        
          
      }
    });




  },
  onLoad: function (options) {
    that = this;
    util.pagtime=0;
    util.ajaxbool=false
   
      if (typeof (options.id) == "undefined"){
        util.id = 1;

      }else{

        util.id = options.id
      }
    
    this.get_t_data();

wx.showShareMenu({
  withShareTicket: true
})
  },
  downfile: function (e) {


    wx.showModal({
      title: '提示',
      content: '下载附件需要扣除200金币',
      success: function (res) {
        if (res.confirm) {
     

          wx.request({
            url: util.www + 'ajax/downfile.api?id=' + e.currentTarget.dataset.id,
            data: {
              YSV8_HEX: util.ysv8hex
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (info) {
              console.log(info)
              if (info.data['error'] == true) {
                util.userinfo.gold = info.data['gold'];
                util.userinfo.credits = info.data['credits'];
                wx.setStorageSync('userinfo', util.userinfo)
                that.setData({
                  userinfo: util.userinfo
                });
                wx.navigateTo({
                  url: '/pages/down/index?url=' + info.data['info']
                })
              }else{
                util.mswal(info.data)
              }
            }
               
          })


        } else if (res.cancel) {
          wx.showToast({
            title: '用户取消',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }, addpl: function (e) {
    if (util.ajaxbool) return false;
    util.ajaxbool = true
    wx.request({
      url: util.www + 'comment/' + util.id + '.api',
      data: {
        pageid: util.pagtime
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code != 200) {
          util.mswal(res.data);
          return false;
        }
        var j = res['data']['PostList'].length
        var k;
        for (var i = 0; i < j; i++) {
          k = j - i - 1;
          res['data']['PostList'][k]['btime'] = Number(res['data']['PostList'][k]['btime']);
          if (util.pagtime > res['data']['PostList'][k]['btime'] || util.pagtime == 0) { util.pagtime = res['data']['PostList'][k]['btime'] }

          res['data']['PostList'][k]['btime'] = util.timeStamp2String(res['data']['PostList'][k]['btime'])
          that.data.PostList.push(res['data']['PostList'][k])
        }
        that.setData({
 
          PostList: that.data.PostList,
        

        })
        if (j < 10) {
          that.setData({
            over: true
          })
        } else {

          util.ajaxbool = false
        }
      }
    });



  },
  get_t_data:function(e){
    wx.showLoading({
      title: '加载中',
    })

    if (util.ajaxbool) { wx.hideLoading();return false;}
    util.ajaxbool = true
    wx.request({
      url: util.www + 't/' + util.id + '.api',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading()
       if( res.data.code !=200) {
         util.mswal(res.data);
         return false;
       }
       
        res['data']['thread']['btime'] = util.timeStamp2String(res['data']['thread']['btime'])
       // console.log(res['data'])
        wxparse.wxParse('content', 'html', res['data']['PostData'], that, 5);
        var j = res['data']['PostList'].length
        var k;
        for (var i = 0; i < j; i++) {
          k = j - i - 1;
          res['data']['PostList'][k]['btime'] = Number(res['data']['PostList'][k]['btime']);
          if (util.pagtime > res['data']['PostList'][k]['btime'] || util.pagtime == 0) { util.pagtime = res['data']['PostList'][k]['btime'] }

          res['data']['PostList'][k]['btime'] = util.timeStamp2String(res['data']['PostList'][k]['btime'] )
        }

        util.look_data = util.add_array(res['data']['thread'], util.look_data)
        wx.setStorageSync('look_data', util.look_data)
        console.log(res['data']['files'])
        that.setData({
          tdata: res['data']['thread'],
          PostList: res['data']['PostList'],
          fav: util.in_array(util.id, util.fav_data),
          files: res['data']['files'],
          share:that.data.share,
          vote: util.in_array(util.id, util.ding_data, "size")

        })
        that.title = res['data']['thread']['title']

        if (j < 10) {
          that.setData({
            over: true
          })
        } else {
  
          util.ajaxbool = false
        }

        wx.setNavigationBarTitle({
          title: res['data']['thread']['title'],
        })  


      }
    })
  },
  fav: function () {
    util.fav_data = util.add_array(that.data.tdata, util.fav_data)
    wx.setStorageSync('fav_data', util.fav_data)
    that.setData({
      fav:true
    });
    console.log(util.fav_data)
  },
  getUserInfo: function(e) {
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
  sreach:function(){
  var scontent=[];
  if (this.data.keyword=="") return false;
  
  var content = [];
  for (var index in ycontent) {
    content[index] = [ycontent[index][0],ycontent[index][1].split(this.data.keyword)];
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
  if(maxi>0){
    if (alla[maxi-1] != rect.top){
      alla[maxi] = rect.top
      maxi++;

    }

  }else{
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
  title:function(){
    wx.setNavigationBarTitle({
      title: alli + '/' + maxi,
    })  
  },
  pre: function () {
    if (alli <1) {
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
  next:function(){
    if (maxi < alli+2) {
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
