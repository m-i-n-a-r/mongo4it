// var axios = require('axios');


/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
    {
      '$project': {
        '__alias_0': '$geoPoint', 
        '__alias_1': '$_id',
        'NUM_FERITI' : '$NUM_FERITI'
      }
    }, {
      '$project': {
        'geopoint': '$__alias_0', 
        'intensity': '$__alias_1', 
        '_id': 0,
        'NUM_FERITI' : '$NUM_FERITI'
      }
    }, {
      '$match': {
        'geopoint.type': 'Point', 
        'geopoint.coordinates': {
          '$type': 'array'
        }, 
        'geopoint.coordinates.0': {
          '$type': 'number', 
          '$ne': {
            '$numberDouble': 'NaN'
          }, 
          '$gte': -180, 
          '$lte': 180
        }, 
        'geopoint.coordinates.1': {
          '$type': 'number', 
          '$ne': {
            '$numberDouble': 'NaN'
          }, 
          '$gte': -90, 
          '$lte': 90
        }
      }
    }
  ];

// const MongoClient = mongodb.MongoClient;

//   MongoClient.connect(
//     'mongodb+srv://DO_NOT_MODIFY:DO_NOT_MODIFY@demo.lrogh.mongodb.net/test?authSource=admin&replicaSet=atlas-6o42sd-shard-0&readPreference=primary&appname=MongoDB+Compass&ssl=true',
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     function(connectErr, client) {
//       assert.equal(null, connectErr);
//       const coll = client.db('Hackaton').collection('Incident_Geo');
//       coll.aggregate(agg, (cmdErr, result) => {
//         assert.equal(null, cmdErr);
//       });
//       client.close();
//     }).then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });


            
/*axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });*/

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */


var data = JSON.stringify({
    "collection": "Incident_Geo",
    "database": "Hackaton",
    "dataSource": "demo",
    /*"projection": {
        "_id": 1
    },*/
    "filter" : {
        "municipio":"II"
    }
});
            
var config = {
    method: 'post',
    url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/findOne',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
    },
    data : data
};


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

    var pippo = axios(queryChartMapConfig)
    .then(function (response) {
        console.log('pippo');
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    });

