mapboxgl.accessToken = 'pk.eyJ1IjoiYXBlMTYzIiwiYSI6ImNsMHRydnl3YjBvaDQzam5ta3N1eXcwemEifQ.XtSoUweJyOjv-kdolaHmKQ';
const map = new mapboxgl.Map({
  container: 'map', // container element id
  style: 'mapbox://styles/mapbox/light-v10',
  center: [12.4963655, 41.9027835], // initial map center in [lon, lat]
  zoom: 10
});
var lon = 12.4963655;
var lat = 41.9027835;
  coords=[];
function error() {


  maximumLon = 12.55
  minimumLon = 12.33
  maximumLat = 42
  minimumLat = 41.779
  position = {};

  position.coords = {};
  position.coords.latitude = Math.random() * (maximumLat - minimumLat) + minimumLat;
  position.coords.longitude = Math.random() * (maximumLon - minimumLon) + minimumLon;
  mia_posizione(position)
}
function GetSelectedValue(selectItem) {
  var index = document.getElementById(selectItem).selectedIndex;
  return document.getElementById(selectItem).value;
}

function rischio() {
  ora = document.getElementById('slider').value;
  giorno = document.getElementById('filters').value;

  var listaAnni = document.getElementsByName("toggle")
  var anno
  var i;
  for (i = 0; i < listaAnni.length; i++) {
    if (listaAnni[i].checked) {
      anno = listaAnni[i].value;
    }
  }

  //alert('anno' + anno)
  if (!anno || anno == "all") {
    anno = null
  }


  meteoS = GetSelectedValue('meteoS');
  if (!meteoS || meteoS == "All") {
    meteoS = "Sereno"
  }


  giornoBool = giorno == 'Feriali';

  App.getCalcoloAlert(lon, lat, giornoBool, ora, meteoS, anno).then((data) => {
    // const allIncidenti = data.documents
    console.log("Prova", data)
     document.getElementById('pippo').innerHTML="Partenza: "+data;
    // const totaleIncidenti = allIncidenti.length;
    // console.log("Prova: ", allIncidenti)
  })
}


function mia_posizione(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;


  rischio()







  const geojson = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {
          'message': 'Baz',
          'iconSize': [40, 40]
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [lon, lat]
        }
      }
    ]
  };
  // Add markers to the map.
  for (const marker of geojson.features) {
    // Create a DOM element for each marker.
    const el = document.getElementById('marker');
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = 'marker';
    el.style.backgroundImage = `url(../images/car.png)`;
    el.style.backgroundSize = '100%';

    el.addEventListener('click', () => {
      //window.alert(marker.properties.message);
    });

    // Add markers to the map.
    new mapboxgl.Marker(el)
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);
  }
  coordTemp=[lon, lat];
  if(coords.length>0){
    coordTemp=coords;
  }
  getRoute(coordTemp);
}







var queryChartMap = JSON.stringify({
  "collection": "Incidente_Geo_Distinct",
  "database": "Hackaton",
  "dataSource": "demo",
  "filter": {},
  "projection": {
    "geometry": "$geoPoint",
    "properties": {
      "Coinvolti": { $sum: ["$NUM_FERITI", "$NUM_MORTI"] },
      "Ora": "$ora",
      "Giorno": "$dayOfWeek",
      "Anno": { "$year": "$data" },
      "Meteo": "$CondizioneAtmosferica"
    }
  },
  "limit": 50000

});
var queryChartMapConfig = {
  method: 'post',
  url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/find',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
  },
  data: queryChartMap
};



var queryChartLayer = JSON.stringify({
  "collection": "Municipi",
  "database": "Hackaton",
  "dataSource": "demo",
  "filter": {},
  "projection": {
    "geometry": 1,
    "properties": {
      "mun": { '$toInt': { '$substr': ['$id', 20, 2] } }
    }

  }


});
var queryChartLayerConfig = {
  method: 'post',
  url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/find',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
  },
  data: queryChartLayer
};

axios(queryChartLayerConfig)
  .then(function (response) {
    console.log(JSON.stringify(response.data.documents.length));
    createGraphMun(response.data);
  })
  .catch(function (error) {
    console.log(error);
  });

function createGraph(data) {
  console.log('dentro createGraph');
  filterHour = ['==', ['number', ['get', 'Ora']], 12];
  filterDay = ['!=', ['number', ['get', 'Giorno']], 0];
  filterYear = ['!=', ['number', ['get', 'Anno']], 0];
  filterMeteo = ['!=', ['string', ['get', 'Meteo']], 'pippo'];
  map.addLayer({
    id: 'collisions',
    type: 'circle',
    source: {
      type: 'geojson',
      data:
      {
        "type": "FeatureCollection",
        "features": data.documents
      }
    },
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'Coinvolti']],
        0,
        4,
        5,
        24
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'Coinvolti']],
        0,
        '#2DC4B2',
        1,
        '#3BB3C3',
        2,
        '#669EC4',
        3,
        '#8B88B6',
        4,
        '#A2719B',
        5,
        '#AA5E79'
      ],
      'circle-opacity': 0.7
    },
    filter: ['all', filterHour, filterDay, filterYear, filterMeteo]
  });

  document.getElementById('slider').addEventListener('input', (event) => {
    rischio()
    const hour = parseInt(event.target.value);
    // update the map
    filterHour = ['==', ['number', ['get', 'Ora']], hour];
    map.setFilter('collisions', ['all', filterHour, filterDay, filterYear, filterMeteo]);

    // converting 0-23 hour to AMPM format
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 ? hour % 12 : 12;

    // update text in the UI
    document.getElementById('active-hour').innerText = hour12 + ampm;
  });
  document.getElementById('hourNone').addEventListener('click', (event) => {
    rischio()
    const checked = event.target.checked;
    // update the map
    if (checked) {
      filterHour = ['!=', ['number', ['get', 'Ora']], 25];
    }
    else {
      hour = parseInt(document.getElementById('slider').value);
      filterHour = ['==', ['number', ['get', 'Ora']], hour];
    }

    map.setFilter('collisions', ['all', filterHour, filterDay, filterYear, filterMeteo]);
  });
  document.getElementById('filters').addEventListener('change', (event) => {
    rischio()
    const day = event.target.value;
    if (day === 'all') {
      filterDay = ['!=', ['number', ['get', 'Giorno']], 0];
    } else if (day === 'weekday') {
      filterDay = ['match', ['get', 'Giorno'], [7, 1], false, true];
    } else if (day === 'weekend') {
      filterDay = ['match', ['get', 'Giorno'], [7, 1], true, false];
    } else {
      console.log('error');
    }
    map.setFilter('collisions', ['all', filterHour, filterDay, filterYear, filterMeteo]);
  });
  document.getElementById('years').addEventListener('change', (event) => {

    rischio()
    //Stef
    document.getElementById(event.target.value).checked = true;
    //FINE STEF
    year = event.target.value;

    if (year === 'all') {
      filterYear = ['!=', ['number', ['get', 'Anno']], 0];
    }
    else {
      year = parseInt(year);
      filterYear = ['==', ['number', ['get', 'Anno']], year];
    }
    map.setFilter('collisions', ['all', filterHour, filterDay, filterYear, filterMeteo]);
  });
  document.getElementById('meteoS').addEventListener('change', (event) => {
    meteo = event.target.value;
    //alert('ciao' + meteo)
    if (meteo == 'All') {
      filterMeteo = ['!=', ['string', ['get', 'Meteo']], "pippo"];
    }
    else {
      filterMeteo = ['==', ['string', ['get', 'Meteo']], meteo];
      //alert(filterMeteo)
    }

    map.setFilter('collisions', ['all', filterHour, filterDay, filterYear, filterMeteo]);
  });

  console.log('fine map');


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(mia_posizione, error);
  } else {
    alert('La geo-localizzazione NON è possibile');
  }











}

function createGraphMun(data) {
  console.log(JSON.stringify(data.documents.length));
  var dati = data.documents;


  map.addLayer(
    {
      'id': 'isoLayer',
      'type': 'fill',
      'source': {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": data.documents
        }
      },
      'layout': {},
      'paint': {
        'fill-color': [
          'case',
          ['!=', ['get', 'mun'], null],
          [
            'interpolate',
            ['linear'],
            ['get', 'mun'],
            1,
            '#000000',
            16,
            '#ffffff'
          ],
          'rgba(255, 255, 255, 0)'
        ],
        'fill-opacity': 0.5
      }
    }
  );


  axios(queryChartMapConfig)
    .then(function (response) {
      console.log(JSON.stringify(response.data.documents));
      createGraph(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}


map.on('click', (event) => {
  coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
  const end = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      }
    ]
  };
  if (map.getLayer('end')) {
    map.getSource('end').setData(end);
  } else {
    map.addLayer({
      id: 'end',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: coords
              }
            }
          ]
        }
      },
      paint: {
        'circle-radius': 10,
        'circle-color': 'green'
      }
    });
  }
  var listaAnni = document.getElementsByName("toggle")
  var anno
  var i;
  for (i = 0; i < listaAnni.length; i++) {
    if (listaAnni[i].checked) {
      anno = listaAnni[i].value;
    }
  }

  //alert('anno' + anno)
  if (!anno || anno == "all") {
    anno = null
  }
  ora = document.getElementById('slider').value;
  giorno = document.getElementById('filters').value;

  meteoS =GetSelectedValue('meteoS');
  if(!meteoS || meteoS == "All"){
    meteoS = "Sereno"
  }

  giornoBool = giorno == 'Feriali';
  App.getCalcoloAlert(coords[0], coords[1], giornoBool, ora, meteoS, anno).then((data) => {

    
    // const allIncidenti = data.documents
    console.log("Prova 2", data)
     document.getElementById('end').innerHTML="Arrivo: "+data;
})

  getRoute(coords);


});



async function getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  const query = await fetch(
    'https://api.mapbox.com/directions/v5/mapbox/driving/'+lon+','+lat+';'+end[0]+','+end[1]+'?steps=true&geometries=geojson&access_token='+mapboxgl.accessToken,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;

console.log(JSON.stringify(route))
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'green',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }
  // add turn instructions here at the end

  
  var listaAnni = document.getElementsByName("toggle")
  var anno
  var i;
  for (i = 0; i < listaAnni.length; i++) {
    if (listaAnni[i].checked) {
      anno = listaAnni[i].value;
    }
  }

  //alert('anno' + anno)
  if (!anno || anno == "all") {
    anno = null
  }
  ora = document.getElementById('slider').value;
  giorno = document.getElementById('filters').value;

  meteoS =GetSelectedValue('meteoS');
  if(!meteoS || meteoS == "All"){
    meteoS = "Sereno"
  }

  giornoBool = giorno == 'Feriali';
  App.getCalcoloPercorsoAlert(route, giornoBool, ora, meteoS, anno).then((data) => {

    
    // const allIncidenti = data.documents
    console.log("Prova 2", data)
     document.getElementById('end').innerHTML="Percorso: "+data;
})
}


