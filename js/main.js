
var dpr,rem,scale;
var docEl = document.documentElement,
    fontEl = document.createElement('style'),
    metaEl = document.querySelector('meta[name="viewport"]');
dpr = window.devicePixelRatio || 1;
rem = docEl.clientWidth * dpr / 10;
scale = 1 / dpr;
metaEl.setAttribute('content','width=' + dpr*docEl.clientWidth + ',initial-scale=' + scale +',maximum-scale=' + scale + ',minimum-scale=' + scale +',user-scalable=no');
docEl.firstElementChild.appendChild(fontEl);
fontEl.innerHTML = 'html{font-size:' + rem +'px!important;}';

//请求的参数
var httpData = {
  method:'post',
  url:'',
  msg:null,
  dealFn:null
};

//get请求添加参数
function addURL(url,name,value){
  url += (url.indexOf("?") == -1 ? "?" : "&");
  url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  return url;
};

/*发送请求函数*/
function sendMessage(httpData){
  var xhr = new XMLHttpRequest();
  var that = this;
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
        if(xhr.status >= 200 && xhr.status <300 || xhr.status == 304){
            var reponseTxt = JSON.parse(xhr.responseText);
            httpData.dealFn.call(that,reponseTxt);
        }
        else{
            console.log("网络错误:"+xhr.status);
        }
    }
  };
  xhr.open(httpData.method,httpData.url,true);
  xhr.setRequestHeader("Authorization",window.localStorage.token);
  if(httpData.method === 'post'){
    var msg = JSON.stringify(httpData.msg);
    xhr.send(msg);
  }
  else
    xhr.send(null);
};

//发送带图片的请求
function form(httpData) {
  var that = this;
  var formData = new FormData();
  formData.append("score", httpData.msg.score);
  formData.append("content", httpData.msg.content);
  formData.append("site", httpData.msg.site);
  formData.append("shop", httpData.msg.shop);
  formData.append("name", httpData.msg.name);
  formData.append("img", httpData.msg.img); //传递一个file对象
  var oReq = new XMLHttpRequest();
  oReq.onreadystatechange = function(){
    if(oReq.readyState == 4){
        if(oReq.status >= 200 && oReq.status <300 || oReq.status == 304){
            var reponseTxt = JSON.parse(oReq.responseText);
            httpData.dealFn.call(that,reponseTxt);
        }
        else{
          console.log("网络错误:"+oReq.status);
        }
    }
  };
  oReq.open(httpData.method,httpData.url,true);
  oReq.setRequestHeader("Authorization",window.localStorage.token);
  oReq.send(formData);
}


//移动端touch事件
// window.onload = function(){
//   window.addEventListener('touchstart',touchStart,false);
//   window.addEventListener('touchmove',touchMove,false);
// };

var start = 0,end = 0;//记录触摸起始点和滑动到的位置

//touchstart事件处理函数
function touchStart(event){
  var touch = event.targetTouches[0];
  start = touch.pageY;
};

//touchmove事件处理函数
function touchMove(event,httpData){
  var that = this;
  var touch = event.targetTouches[0];
  end = touch.pageY - start;
  if(end < 0){
    loadMore.call(that,httpData);
  }
};

function loadMore(httpData){
  var that = this;
  var pageHeight = document.body.clientHeight;
  var scrollTop = document.body.scrollTop;
  var allHeight = document.body.scrollHeight;//如果滚动高度=页面总长-页面一屏的高度（即滚动条到了底部）
  if(scrollTop + pageHeight >= allHeight - 100){
    sendMessage.call(that,httpData);
  }
};