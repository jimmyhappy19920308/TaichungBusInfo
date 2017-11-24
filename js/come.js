var data2 = [];
var helper = {
  getParameterByName: function(name, url) {
    var regex, results;
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i');
    results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};
var disroadLine = helper.getParameterByName("Zh_tw");

//console.log(disroadLine);


var url = `https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taichung?$filter=RouteName%2FZh_tw%20eq%20%27${disroadLine}%27%20and%20Direction%20eq%20%271%27&$orderby=StopSequence%20asc&$top=100&$format=JSON`;
var bustimeList = document.querySelector('.bustimeList');
var address = document.querySelector('.address');
var go = document.querySelector('.go');
var come = document.querySelector('.come');

address.innerHTML = disroadLine;

function comeLine() {
  clearTimeout(goLine);
  var xhr2 = new XMLHttpRequest();
  xhr2.open('get', url);
  xhr2.send(null);
  xhr2.onload = function() {
    if (xhr2.status == 200) { //http狀態碼=200執行程式碼
      data2 = JSON.parse(xhr2.responseText);
      //console.log(data2);
      function updateList(items) {
        const len = items.length;
        //console.log(len);
        
        var str = '';
        for (var i = 0; i < len; i++) {
          //console.log(go);

          const Time = Math.floor(items[i].EstimateTime / 60);
          if(items[i].EstimateTime == undefined){
            str += `
              <li>
                <div class="ball rounded-circle"></div>
                <span class="eTime first">過站
                  <span class="stop">${items[i].StopName.Zh_tw}</span>
                </span>
              </li>
            `;
          }else if(items[i].EstimateTime < 0){
            str += `
              <li>
                <div class="ball rounded-circle red"></div>
                <span class="redTime eTime first ">停駛
                  <span class="stop">${items[i].StopName.Zh_tw}</span>
                </span>
              </li>
            `;
          }else if(items[i].EstimateTime){
            str += `
              <li>
                <div class="ball rounded-circle"></div>
                <span class="eTime first">${Time}分
                  <span class="stop">${items[i].StopName.Zh_tw}</span>
                </span>
              </li>
            `;
          }else if(items[i].EstimateTime == 0){
            str += `
              <li>
                <div class="ball rounded-circle red"></div>
                <span class="redTime eTime first ">進站中
                  <span class="stop">${items[i].StopName.Zh_tw}</span>
                </span>
              </li>
            `;
          }
  
        }
        bustimeList.innerHTML = str;
      }
  
      updateList(data2);
    } 
  }
  
}
comeLine();
setInterval(comeLine, 30000);


