
var pagtime = 0;
var ysv8hex = false;
var userinfo=false;
var content = [];
var that;
var fid = 11;/*ysphp栏目id*/
var title = "内涵GIF笑话-每日签到有机会领千元红包";/*小程序分享标题*/
var www = 'https://zh.44api.com/'/*您的网站域名*/
var bucketcdn = "https://img.44api.com/upload/"/*您的图片及视频存放地址*/
var id = 1;
var tdata = [];
var mode = 0;
var ajaxbool = false
var myDate = new Date();
var year = myDate.getFullYear();
var month = myDate.getMonth() + 1;
var day = myDate.getDate(); 
var newDay = year + "/" + month + "/" + day;
var fav_data=[];
var look_data=[];
var ding_data = [];
var arr2i;
var imagebool=false;
try {
  var value = wx.getStorageSync('imagebool')
  if (value) {
    imagebool = value;
  }
} catch (e) {
}
try {
  var value = wx.getStorageSync('ding_data')
  if (value) {
    ding_data = value;
  }
} catch (e) {
}

try {
  var value = wx.getStorageSync('ysv8hex')
  if (value) {
    ysv8hex = value;
  }
} catch (e) {
}
try {
  var value = wx.getStorageSync('userinfo')
  if (value) {
    userinfo = value;
  }
} catch (e) {
}
try {
  var value = wx.getStorageSync('fav_data')
  if (value) {
    fav_data = value;
  }
} catch (e) {
}
try {
  var value = wx.getStorageSync('look_data')
  if (value) {
    look_data = value;
  }
} catch (e) {

}
function mswal(array,b) {
  b = typeof b !== 'undefined' ? b : true;
  wx.showModal({
    title: '错误',
    content: array['info'],
    showCancel: false,
    success: function (res) {
      if (array['code'] == 301 && b) {
        wx.navigateTo({
          url: '../set/index'
        })
      }
    }
  })



}

function str_in_array(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}

function str_push(id, myarr) {
  myarr.push(id);
  if (myarr.length > 100) {
    myarr.splice(0, 10);
  }
  return myarr;
}



function in_array(id,myarr,mode){
  mode = typeof mode !== 'undefined' ? mode : false;
for (arr2i = 0;arr2i < myarr.length; arr2i++) {
if(id==myarr[arr2i]['id']){
  if (mode !== false) return myarr[arr2i][mode];
return true;
}
}
return false;
}

function add_array(arr, myarr) {
  for (arr2i = 0; arr2i < myarr.length; arr2i++) {
    if (arr['id'] == myarr[arr2i]['id']) {
      var news_sub = {
        id: myarr[arr2i]['id'],
        user: myarr[arr2i]['user'],
        btime: myarr[arr2i]['btime'],
        img: myarr[arr2i]['img'],
        posts: myarr[arr2i]['posts'],
        title: myarr[arr2i]['title'],
        vs: myarr[arr2i]['vs'],
      }
      myarr.push(news_sub);
      myarr.splice(arr2i, 1);
      return myarr;
    }
  }

  if (myarr.length > 100) {
    myarr.splice(0, 10);
  }

  var news_sub = {
    id: arr['id'],
    user: arr['user'],
    btime: arr['btime'],
    img: arr['img'],
    posts: arr['posts'],
    title: arr['title'],
    vs: arr['vs'],
  }
  myarr.push(news_sub);
  return myarr;
}


function timeStamp2String(time) {
  var datetime = new Date()
  datetime.setTime(time * 1000);
  var y = datetime.getFullYear();
  var m = datetime.getMonth() + 1;
  var d = datetime.getDate();
  var h = datetime.getHours();
  var n = datetime.getMinutes();
  var s = datetime.getSeconds();
  if (y == year && month == m && day == d) {
    return h + ":" + n + ":" + s;
  }
  if (y == year) {
    return m + '-' + d + ' ' + h + ":" + n;
  }

  return y + "-" + m + "-" + d;
} 
module.exports = {
  timeStamp2String: timeStamp2String,
  www: www,
  newDay: newDay,
  bucketcdn: bucketcdn,
  ajaxbool: ajaxbool,
  content: content,
  pagtime: pagtime,
  fid: fid,
  mode: mode,
  that: that,
  tdata: tdata,
  id:id,
  ysv8hex: ysv8hex,
  userinfo: userinfo,
  title: title,
  add_array: add_array,
  fav_data: fav_data,
  look_data: look_data,
  in_array: in_array,
  str_in_array: str_in_array,
  ding_data: ding_data,
  str_push: str_push,
  mswal: mswal,
  imagebool: imagebool
}