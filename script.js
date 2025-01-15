var map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function readCookies(prefix) {
  var nameEQ = prefix + "_";
  var ca = document.cookie.split(";");
  var ans = [];
  var j = 0;
  for (var i = 0; i < ca.length; i++) {
    var index = 0;
    var c = ca[i];
    while (c.charAt(index) == " ") {
      index = index + 1;
    }
    if (c.indexOf(nameEQ) == index) {
      // Trouver le caractère '='
      while (c.charAt(index) != "=") {
        index = index + 1;
      }
      ans[j] = c.substring(index + 1, c.length);
      j = j + 1;
    }
  }
  return ans;
}
function markersFromCookies(map) {
  var cookies = readCookies("marker");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var data = cookie.split(",");
    // data[0] : latitude
    // data[1] : longitude
    // data[2] : texte du popup
    // data[3] : URL (optionnelle)
    var marker = L.marker([data[0], data[1]]).addTo(map);
    // Si une URL est fournie, le texte devient un lien cliquable
    if (data[3] && data[3].length > 0) {
      marker
        .bindPopup('<a href="' + data[3] + '">' + data[2] + "</a>")
        .openPopup();
    } else {
      marker.bindPopup(data[2]).openPopup();
    }
  }
}
function writeCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

map.on("click", function (e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;
  var popupText = prompt("Entrez le texte du popup :");
  var url = prompt("Entrez l'URL (laissez vide si aucune) :");

  var marker = L.marker([lat, lng]).addTo(map);
  if (url && url.length > 0) {
    marker
      .bindPopup('<a href="' + url + '">' + popupText + "</a>")
      .openPopup();
  } else {
    marker.bindPopup(popupText).openPopup();
  }

  // Créer une chaîne CSV pour le cookie
  var cookieValue = [lat, lng, popupText, url].join(",");
  // Générer un nom de cookie unique
  var cookieName = "marker_" + new Date().getTime();
  // Enregistrer le cookie pour 30 jours
  writeCookie(cookieName, cookieValue, 30);
});



// Charger les marqueurs depuis les cookies
markersFromCookies(map);



// map.on("click", function (e) {
//   var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
// });


