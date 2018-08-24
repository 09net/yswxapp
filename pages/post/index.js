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
  }, formReset:function(){
    that.setData({
      vs: "",
      img:[]
    });
  },formSubmit: function (e) {


    var title = e.detail.value.title;
    var content = e.detail.value.content; 
    var img="";
    var j=0;
    var len=0;
    for (j = 0, len = that.data.img.length; j < len; j++) {
      img = img + ',' + that.data.img[j]['url'] + '@' + that.data.img[j]['w'] + '|' + that.data.img[j]['h'];
    }
    wx.request({

      url: util.www+'post.api', //接口地址
      data: {
        title: title,
        content: content,
        vs: that.data.vs,
        imgv: img,
        fid: util.fid,
        YSV8_HEX: util.ysv8hex
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.showModal({
          title: '投稿成功',
          content: '管理员审核后，显示',
          showCancel: false,
          success: function (res) { 
            wx.navigateBack({
              delta: 1
            })

          }
        })

      },
      fail: function (res) {
        console.log('cuowu' + ':' + res)
      }
    })


  }
  
  
  ,upvod: function (e) {
    if (upvod) {

      wx.showToast({
        title: '只允许上传一个视频',
        icon: 'success',
      });
      return false;

    }
    wx.chooseVideo({
      compressed:true,
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePath = res.tempFilePath;
 
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;

          wx.uploadFile({
            url: util.www + 'post/uploadfiles.api',
            filePath: tempFilePath,
            name: 'photo',
            formData: {
              'YSV8_HEX': util.ysv8hex
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              if (data['success']){
              that.data.vs = data['file_path']
      

              that.setData({
                vs: that.data.vs
              });


            
              upvod=true;
            }else{
                wx.showModal({
                  title: '错误提示',
                  content: data['info'],
                  showCancel: false,
                  success: function (res) { }
                })
            }
             wx.hideToast();

            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }

    });

  },upimg:function(e){
    if (upimgi>5) {

      wx.showToast({
        title: '做多上传6张',
        icon: 'success',
      });
      return false;

    }
    wx.chooseImage({
      count: 6,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        var uploadImgCount = 0;
        for (var i = 0, h = tempFilePaths.length; i < h; i++) {
          wx.uploadFile({
            url: util.www + 'post/upload.api',
            filePath: tempFilePaths[i],
            name: 'photo',
            formData: {
              'YSV8_HEX': util.ysv8hex
            },
            header: {
              "Content-Type": "multipart/form-data"
            },
            success: function (res) {
              uploadImgCount++;
              var data = JSON.parse(res.data);
              if (data['success']) {
              that.data.img.push(data)

          
              that.setData({
                img: that.data.img
              });


               
              upimgi++;
              }else{
                wx.showModal({
                  title: '错误提示',
                  content: data['info'],
                  showCancel: false,
                  success: function (res) { }
                })
              }
              wx.hideToast();
            },
            fail: function (res) {
              wx.hideToast();
              wx.showModal({
                title: '错误提示',
                content: '上传图片失败',
                showCancel: false,
                success: function (res) { }
              })
            }
          });
        }
      }
    });  

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
                wx.setStorageSync('userinfo', util.userinfo)
              wx.showToast({
                title: '登录成功',
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
  
    wx.setNavigationBarTitle({
      title: "投稿中心",
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
