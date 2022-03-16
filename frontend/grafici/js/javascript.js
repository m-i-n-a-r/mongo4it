// var axios = require('axios');
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
            
axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
