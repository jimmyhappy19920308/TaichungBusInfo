const list = document.querySelector('.list');
var data = '';
var RouteIDs = [];
var query = '';
var filterItems;
const searchBus = document.querySelector('.searchBus');
console.log(searchBus);



const xhr = new XMLHttpRequest();
xhr.open('get', 'http://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=300&$format=JSON', true);
xhr.send(null);
xhr.onload = function () {
  if (xhr.status == 200) { //http狀態碼=200執行程式碼
    data = JSON.parse(xhr.responseText);
    //console.log(data);
  } else { //http狀態碼為其他值則執行以下程式碼
    console.log('沒撈到資料');
  }

  searchBus.addEventListener('input', keywordSearch);

  function keywordSearch(e) {
    //console.log(e.target.value);
    query = e.target.value;
    filterItems = function (query) {
      return data.filter(function (el) {
        //RouteIDs.push(el.RouteID);
        //console.log(el.RouteID);
        return el.SubRoutes[0].SubRouteName.Zh_tw.indexOf(query) == 0;
      })
    }
    console.log(filterItems(query));

    function updateList(items) {
      const len = items.length;
      var str = '';
      for (var i = 0; i < len; i++) {
        str += `
          <li>
            <span class="Headsign">${items[i].SubRoutes[0].Headsign}</span><br>
            <span class="RouteId">${items[i].SubRoutes[0].SubRouteName.Zh_tw}</span>
          </li>
        `;
      }
      list.innerHTML = str;
    }
    //console.log(data);
    updateList(filterItems(query));
  }



  /*   function updateList(items) {
      const len = items.length;
      var str = '';
      for (var i = 0; i < len; i++) {
        str += `
          <li>
            <span class="Headsign">${items[i].SubRoutes[0].Headsign}</span><br>
            <span class="RouteId">${items[i].RouteID}</span>
          </li>
        `;
      }
      list.innerHTML = str;
    }
    //console.log(data);
    updateList(data); */


}