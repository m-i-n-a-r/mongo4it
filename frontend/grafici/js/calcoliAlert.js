const totaleIncidenti = 38374
const totIncidentiFeriali = 27682
const totIncidentiFestivi = 10693
const giorniFeriali = 910
const giorniFestivi = 375

const valoreSogliaFestivi = 2.22
const valoreSogliaFeriale = 2.07


var mediaIncidentiRomaFeriali = Math.round(totIncidentiFeriali / giorniFeriali, 0)
var mediaIncidentiRomaFestivi = Math.round(totIncidentiFestivi / giorniFestivi, 0)

App = {

    getCalcoloAlert: async (lat, long, flgFeriale, orario, clima, anno) => {
        //alert('lat:' + lat + ' long:' + long + ' flgFeriale:' + flgFeriale + 'orario:' + orario + ' clima:' + clima + ' anno:' + anno);

        if (anno != null) {
            anno = parseInt(anno)
        }
        orario = parseInt(orario);
        // Se Anno = All 
        if (anno == null) {
            if (flgFeriale) {
                var queryMediaRoma = JSON.stringify({
                    "collection": "Incidente_Geo_Distinct",
                    "database": "Hackaton",
                    "dataSource": "demo",
                    "filter": {
                        $and: [{
                            "geoPoint":
                            {
                                $near:
                                {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [lat, long]
                                    },
                                    $maxDistance: 1000
                                }
                            }
                        }, { "dayOfWeek": { $gt: 1, $lt: 7 } },
                        { ora: { $gte: orario - 1, $lte: orario + 1 } },
                        { CondizioneAtmosferica: clima }
                        ]
                    }
                });
            } else {
                var queryMediaRoma = JSON.stringify({
                    "collection": "Incidente_Geo_Distinct",
                    "database": "Hackaton",
                    "dataSource": "demo",
                    "filter": {
                        $and: [{
                            geoPoint:
                            {
                                $near:
                                {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [lat, long]
                                    },
                                    $maxDistance: 1000
                                }
                            }
                        }, { dayOfWeek: { $eq: 1, $eq: 7 } },
                        { ora: { $gte: orario - 1, $lte: orario + 1 } },
                        { CondizioneAtmosferica: clima }
                        ]
                    }
                });
            }
        }
        // Se Anno è valorizzato 
        else {
            if (flgFeriale) {
                var queryMediaRoma = JSON.stringify({
                    "collection": "Incidente_Geo_Distinct",
                    "database": "Hackaton",
                    "dataSource": "demo",
                    "filter": {
                        $and: [{
                            "geoPoint":
                            {
                                $near:
                                {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [lat, long]
                                    },
                                    $maxDistance: 1000
                                }
                            }
                        }, { "dayOfWeek": { $gt: 1, $lt: 7 } },
                        { ora: { $gte: orario - 1, $lte: orario + 1 } },
                        { CondizioneAtmosferica: clima },
                        { "data": { $gte: new Date(anno, 0, 1), $lte: new Date(anno, 11, 31) } }

                        ]
                    }
                });
            } else {
                var queryMediaRoma = JSON.stringify({
                    "collection": "Incidente_Geo_Distinct",
                    "database": "Hackaton",
                    "dataSource": "demo",
                    "filter": {
                        $and: [{
                            geoPoint:
                            {
                                $near:
                                {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [lat, long]
                                    },
                                    $maxDistance: 1000
                                }
                            }
                        }, { dayOfWeek: { $eq: 1, $eq: 7 } },
                        { ora: { $gte: orario - 1, $lte: orario + 1 } },
                        { CondizioneAtmosferica: clima },
                        { "data": { $gte: new Date(anno, 0, 1), $lte: new Date(anno, 11, 31) } }
                        ]
                    }
                });
            }
        }

        var queryChartMapConfig = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/find',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
            },
            data: queryMediaRoma
        };

        let esito = "OK"

        await axios(queryChartMapConfig)
            .then(function (response) {
                // let numeroDocuments = response.data.documents[0].numTotaleIncidenti;
                // return numeroDocuments
                console.log(JSON.stringify(response.data.documents));
                if (response.data.documents.length > valoreSogliaFestivi) {
                    esito = "<strong>Hai più probabilità di fare incidenti (" + response.data.documents.length + ")</strong>";
                } else {
                    esito = "<strong>Vai tranquillo, rischio minore della media</strong>"
                }
            }).catch(function (error) {
                console.log(error);
            });

        return esito
    },

} 
