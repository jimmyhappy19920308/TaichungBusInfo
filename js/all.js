var searchBus = document.querySelector('.searchBus');
var favorite = document.querySelector('.favorite');
var list = document.querySelector('.list');

var data = '';
var query = '';
var filterItems;

var isNotLogin;
var userList = [];

var xhr = new XMLHttpRequest();
xhr.open(
  'get',
  'https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taichung?$top=300&$format=JSON',
  true
);
xhr.send(null);
xhr.onload = function() {
  if (xhr.status == 200) {
    //http狀態碼=200執行程式碼
    data = JSON.parse(xhr.responseText);

    searchBus.addEventListener('input', keywordSearch);

    function keywordSearch(e) {
      query = e.target.value;
      filterItems = function(query) {
        return data.filter(function(el) {
          return (
            el.SubRoutes[0].SubRouteName.Zh_tw.indexOf(query.toUpperCase()) == 0
          );
        });
      };

      function updateList(items) {
        var len = items.length;

        var str = '';
        for (i = 0; i < len; i++) {
          str += `        
              <li>
                <i data-key1="${items[i].SubRoutes[0].Headsign}" data-key2="${
            items[i].SubRoutes[0].SubRouteName.Zh_tw
          }" class="fa fa-heart-o add" aria-hidden="true"></i>
                <a href="selectbusInfo.html?Zh_tw=${
                  items[i].SubRoutes[0].SubRouteName.Zh_tw
                }" class="busLink">
                  <span class="Headsign">${
                    items[i].SubRoutes[0].Headsign
                  }</span><br>
                  <span class="RouteId">${
                    items[i].SubRoutes[0].SubRouteName.Zh_tw
                  }</span>
                </a>
              </li>
            `;
        }
        list.innerHTML = str;
      }
      updateList(filterItems(query));
    }

    function allList(items) {
      var len = items.length;
      var str = '';
      for (var i = 0; i < len; i++) {
        str += `        
            <li>
              <i data-key1="${items[i].SubRoutes[0].Headsign}" data-key2="${
          items[i].SubRoutes[0].SubRouteName.Zh_tw
        }" class="fa fa-heart-o add" aria-hidden="true"></i>
              <a href="selectbusInfo.html?Zh_tw=${
                items[i].SubRoutes[0].SubRouteName.Zh_tw
              }" class="busLink">
                <span class="Headsign a">${
                  items[i].SubRoutes[0].Headsign
                }</span><br>
                <span class="RouteId">${
                  items[i].SubRoutes[0].SubRouteName.Zh_tw
                }</span>
              </a>
            </li>
          `;
      }
      list.innerHTML = str;
    }
    allList(data);

    list.addEventListener('click', addItem, false);

    function addItem(e) {
      if (e.target.nodeName == 'I' && isNotLogin == undefined) {
        alert('請先登入');
        SignIn();
      }
    }
  } else {
    //http狀態碼為其他值則執行以下程式碼
    alert('沒撈到資料');
  }
}; //XMLHttpRequest結束

function localList() {
  var str = '';
  for (item in data) {
    str += `
      <li>
        <i class="fa fa-heart-o add" aria-hidden="true"></i>
        <a href="selectbusInfo.html?Zh_tw=${
          data[item].SubRoutes[0].SubRouteName.Zh_tw
        }" class="busLink">
          <span class="Headsign ab">${
            data[item].SubRoutes[0].Headsign
          }</span><br>
          <span class="RouteId">${
            data[item].SubRoutes[0].SubRouteName.Zh_tw
          }</span>
        </a>
      </li>
    `;
  }
  list.innerHTML = str;
  favorite.innerHTML = '';
}

document.getElementById('quickstart-sign-out').style.display = 'none';

function SignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.FacebookAuthProvider();
    // [END createprovider]
    // [START addscopes]
    provider.addScope('email');
    // [END addscopes]
    // [START signin]
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // [START_EXCLUDE]
        //document.getElementById('quickstart-oauthtoken').textContent = token;
        // [END_EXCLUDE]
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // [START_EXCLUDE]
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert(
            'You have already signed up with a different auth provider for that email.'
          );
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
  // [END_EXCLUDE]
}

function SignOut() {
  // [START signout]
  firebase.auth().signOut();
  document.getElementById('quickstart-sign-out').style.display = 'none';
  document.getElementById('quickstart-sign-in').style.display = 'block';
  document.getElementById('fbName').style.display = 'none';

  var old_element = document.querySelector('.favorite');
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);

  var old_element2 = document.querySelector('.list');
  var new_element2 = old_element2.cloneNode(true);
  old_element2.parentNode.replaceChild(new_element2, old_element2);

  location.reload();

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
      var name = user.displayName;

      isNotLogin = isAnonymous;

      var User = firebase.database().ref(uid);

      firebase
        .database()
        .ref()
        .once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(Data) {
            userList.push(Data.key);
          });

          if (userList.indexOf(uid) === -1) {
            for (item in data) {
              User.child('List').push({
                Headsign: data[item].SubRoutes[0].Headsign,
                SubRouteName: data[item].SubRoutes[0].SubRouteName.Zh_tw
              });
            }
          } else if (userList.indexOf(uid) > -1) {
            // console.log(userList);
            // console.log('uid已存在');
          }
        });

      User.child('List')
        .orderByChild('SubRouteName')
        .on('value', function(snapshot) {
          var str = '';

          snapshot.forEach(function(data) {
            var lHeadsign = data.val().Headsign;
            var lRouteName = data.val().SubRouteName;
            var key = data.key;

            str += `
            <li>
                <i data-key="${key}" data-key1="${lHeadsign}" data-key2="${lRouteName}" class="fa fa-heart-o add" aria-hidden="true"></i>
                <a href="selectbusInfo.html?Zh_tw=${lRouteName}" class="busLink">
                <span class="Headsign">${lHeadsign}</span><br>
                <span class="RouteId">${lRouteName}</span>
                </a>
            </li>
            `;
          });
          list.innerHTML = str;
        });

      list.addEventListener('click', addFavorite, false);

      function addFavorite(e) {
        if (e.target.nodeName == 'I') {
          var datakey = e.target.dataset.key;
          var busHeadsign = e.target.dataset.key1;
          var busRoute = e.target.dataset.key2;
          User.child('Favorite').push({
            Headsign: busHeadsign,
            SubRouteName: busRoute
          });
          User.child('List')
            .child(datakey)
            .remove();
        }
      }

      User.child('Favorite')
        .orderByChild('SubRouteName')
        .on('value', function(snapshot) {
          var val = snapshot.val();
          var str = '';

          snapshot.forEach(function(Data) {
            var favoriteVal = Data.val();
            var favoriteKey = Data.key;
            var fHeadsign = favoriteVal.Headsign;
            var fRouteName = favoriteVal.SubRouteName;

            str += `
            <li>
                <i data-key="${favoriteKey}" data-key1="${fHeadsign}" data-key2="${fRouteName}" class="fa fa-heart add" aria-hidden="true"></i>
                <a href="selectbusInfo.html?Zh_tw=${fRouteName}" class="busLink">
                <span class="Headsign">${fHeadsign}</span><br>
                <span class="RouteId">${fRouteName}</span>
                </a>
            </li>
            `;
          });
          favorite.innerHTML = str;
        });

      favorite.addEventListener('click', removeFavorite, false);
      function removeFavorite(e) {
        var fKey = e.target.dataset.key;
        var fHeadsign = e.target.dataset.key1;
        var fRouteName = e.target.dataset.key2;

        if ((e.target.nodeName = 'I')) {
          User.child('Favorite')
            .child(fKey)
            .remove();
          User.child('List').push({
            Headsign: fHeadsign,
            SubRouteName: fRouteName
          });
        }
      }

      document.getElementById('quickstart-sign-in').style.display = 'none';
      document.getElementById('quickstart-sign-out').style.display = 'block';
      document.getElementById('fbName').style.display = 'block';
      document.getElementById('fbName').textContent = `歡迎 ${name}`;

      // [END_EXCLUDE]
    } else {
      localList();
    }
    // [START_EXCLUDE]
    //document.getElementById('quickstart-sign-in').disabled = false;
    // [END_EXCLUDE]
  });
  // [END authstatelistener]

  document
    .getElementById('quickstart-sign-in')
    .addEventListener('click', SignIn, false);
  document
    .getElementById('quickstart-sign-out')
    .addEventListener('click', SignOut, false);
}
