const favorite = document.querySelector('.favorite');
const list = document.querySelector('.list');
var data = '';
var RouteIDs = [];
var query = '';
var filterItems;
const searchBus = document.querySelector('.searchBus');
var uuid = '';
var isNotLogin;
var alreadyBusRoute = [];
var addFavorite = firebase.database().ref('addFavorite');
var isDisplay = 1;
var a;

// addFavorite.push({
//   "busHeadsign": 'busHeadsign',
//   "busRoute": 'busRoute',
//   "uuid": 'uuid'
// });






const xhr = new XMLHttpRequest();
xhr.open('get', 'https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=300&$format=JSON', true);
xhr.send(null);
xhr.onload = function () {
  if (xhr.status == 200) { //http狀態碼=200執行程式碼
    data = JSON.parse(xhr.responseText);

    searchBus.addEventListener('input', keywordSearch);
    
      function keywordSearch(e) {
        //console.log(e.target.value);
        query = e.target.value;
        filterItems = function (query) {
          return data.filter(function (el) {
            //RouteIDs.push(el.RouteID);
            //console.log(el.RouteID);
            return el.SubRoutes[0].SubRouteName.Zh_tw.indexOf(query.toUpperCase()) == 0;
          });
        }
        function updateList(items) {
          const len = items.length;
          var str = '';
          for (var i = 0; i < len; i++) {
            str += `        
              <li>
                <i class="fa fa-heart-o add" aria-hidden="true"></i>
                <a href="selectbusInfo.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}" class="busLink">
                  <span class="Headsign">${items[i].SubRoutes[0].Headsign}</span><br>
                  <span class="RouteId">${items[i].SubRoutes[0].SubRouteName.Zh_tw}</span>
                </a>
              </li>
            `;
          }
          list.innerHTML = str;
        }
        //console.log(data);
        updateList(filterItems(query));
      }
    
      function allList(items) {
        var len = items.length;
        var str = '';
        for (var i = 0; i < len; i++) {
          str += `        
            <li>
              <i data-key1="${items[i].SubRoutes[0].Headsign}" data-key2="${items[i].SubRoutes[0].SubRouteName.Zh_tw}" class="fa fa-heart-o add" aria-hidden="true"></i>
              <a href="selectbusInfo.html?Zh_tw=${items[i].SubRoutes[0].SubRouteName.Zh_tw}" class="busLink">
                <span class="Headsign">${items[i].SubRoutes[0].Headsign}</span><br>
                <span class="RouteId">${items[i].SubRoutes[0].SubRouteName.Zh_tw}</span>
              </a>
            </li>
          `;
        }
        list.innerHTML = str;

      }
      allList(data);

  } else { //http狀態碼為其他值則執行以下程式碼
    alert('沒撈到資料');
  }


  /* 加到最愛 */
var add = document.querySelectorAll('.list li i');
var addbtn = Array.from(add);

for(let item in addbtn){
  //console.log(addbtn[item]);
  addbtn[item].addEventListener('click', addItem, false);
}

function addItem(e){
  var busHeadsign = e.target.dataset.key1;
  var busRoute = e.target.dataset.key2;
  console.log(busHeadsign);
  console.log(busRoute);

  if(isNotLogin == false){
    
    e.target.parentElement.style.display = 'none';
    a = function(){
      e.target.parentElement.style.display = 'block';
    }

    if(alreadyBusRoute.indexOf(busRoute) > -1){

      console.log(`${busRoute}已經在陣列中`);
      console.log(alreadyBusRoute);
      console.log(alreadyBusRoute.indexOf(busRoute) > -1);
    }else{

      //將資料新增到firebase
        addFavorite.push({
          "busHeadsign": busHeadsign,
          "busRoute": busRoute,
          "uuid": uuid
        });

      alreadyBusRoute.push(busRoute);
    }
  }else{
    

    alert('請先登入');
    toggleSignIn();
  }

}
  
  /* 將資料渲染到網頁 */

  addFavorite.on('value', function(snapshot){
    var strF = '';
    var addData = snapshot.val();


      snapshot.forEach(function(data){
        let dataQ = data.val();
        //console.log(dataQ.uuid);
        if(dataQ.uuid == uuid){
          strF += `
          <li>
            <i data-key="${data.key}" data-busroute="${dataQ.busRoute}" class="fa fa-heart add" aria-hidden="true"></i>
            <a href="selectbusInfo.html?Zh_tw=${dataQ.busRoute}" class="busLink">
              <span class="Headsign">${dataQ.busHeadsign}</span><br>
              <span class="RouteId">${dataQ.busRoute}</span>
            </a>
          </li>
          `;
        }
 
      });
    favorite.innerHTML = strF;

      //刪除最愛(必須等字串組完)
      var remove = document.querySelectorAll('.favorite li i');
      var removeBtn = Array.from(remove);
      //console.log(removeBtn);
    
      for(let item in removeBtn){
        //console.log(addbtn[item]);
        removeBtn[item].addEventListener('click', removeItem, false);
        function removeItem(e){
          let key = e.target.dataset.key;
          let busroute = e.target.dataset.busroute;
          alreadyBusRoute.splice(alreadyBusRoute.length - 1, 1);
          if(alreadyBusRoute.indexOf(busroute) > -1){
          }else{
            a();

          }



          addFavorite.child(key).remove();
        }
      }
  });



}//XMLHttpRequest結束



  


document.getElementById('quickstart-sign-out').style.display = "none";
function SignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.FacebookAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('email');
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // [START_EXCLUDE]
      //document.getElementById('quickstart-oauthtoken').textContent = token;
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // [START_EXCLUDE]
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
      // [END_EXCLUDE]
    });
    // [END signin]

  } 
  // [START_EXCLUDE]

  //document.getElementById('quickstart-sign-in').disabled = true;
  // [END_EXCLUDE]
}

function SignOut(){
    // [START signout]
    firebase.auth().signOut();
    document.getElementById('quickstart-sign-out').style.display = 'none';
    document.getElementById('quickstart-sign-in').style.display = 'block';
    document.getElementById('fbName').style.display = 'none';
    // [END signout]
}

function initApp() {
  // Listening for auth state changes.
  // [START authstatelistener]
  document.getElementById('quickstart-sign-out').style.display = 'none';
  document.getElementById('fbName').style.display = 'none';
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
      var uid = user.uid;
      var isAnonymous = user.isAnonymous;
      var providerData = user.providerData;
      let name = user.displayName;


      console.log(name);
      console.log(user.uid);
      console.log(isAnonymous);
      uuid = uid;
      isNotLogin = isAnonymous;

      document.querySelector('.favorite').style.display = "block";

      document.getElementById('quickstart-sign-in').style.display = 'none';
      document.getElementById('quickstart-sign-out').style.display = 'block';
      document.getElementById('fbName').style.display = 'block';
      document.getElementById('fbName').textContent = `歡迎 ${name}`;

      
      
      
      // [END_EXCLUDE]
    }else{
      document.querySelector('.favorite').style.display = "none";
    }
    // [START_EXCLUDE]
    //document.getElementById('quickstart-sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]

  document.getElementById('quickstart-sign-in').addEventListener('click', SignIn, false);
  document.getElementById('quickstart-sign-out').addEventListener('click', SignOut, false);
}
