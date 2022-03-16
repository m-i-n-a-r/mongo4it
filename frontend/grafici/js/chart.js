mapboxgl.accessToken = 'pk.eyJ1IjoiYXBlMTYzIiwiYSI6ImNsMHRydnl3YjBvaDQzam5ta3N1eXcwemEifQ.XtSoUweJyOjv-kdolaHmKQ';
const map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/mapbox/light-v10',
    center: [12.4963655, 41.9027835], // initial map center in [lon, lat]
    zoom: 12
  });


  var queryChartMap = JSON.stringify({
    "collection": "Incident_Geo",
    "database": "Hackaton",
    "dataSource": "demo",
    "pipeline" : agg
});
var queryChartMapConfig = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/aggregate',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
    },
    data : queryChartMap
};
axios(queryChartMapConfig)
.then(function (response) {
    console.log('dopo response');
    createGraph(response.data);
})
.catch(function (error) {
    console.log(error);
});



function createGraph(data){
    console.log('dentro createGraph');

    map.addLayer({
      id: 'collisions',
      type: 'circle',
      source: {
        type: 'geojson',
        data: {
            "type": "FeatureCollection",
            "features": [{'NUM_FERITI':5,"geopoint":{"type":"Point","coordinates":[12.5095,41.895]},"intensity":"6230ba078933fcb852757df4"},{'NUM_FERITI':0,"geopoint":{"type":"Point","coordinates":[12.5095,41.895]},"intensity":"6230ba078933fcb852757df5"}]
        }
      },
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'NUM_FERITI']],
          0,
          4,
          5,
          24
        ],
        'circle-color': [
          'interpolate',
          ['linear'],
          ['number', ['get', 'NUM_FERITI']],
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
        'circle-opacity': 0.8
      }
    });
    
    console.log('fine map');
}