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

    getCalcoloAlert : async (lat, long, flgFeriale, orario, clima) => {

        if (flgFeriale) {
        
            var queryMediaRoma = JSON.stringify({
                "collection": "Incidente_Geo_Distinct",
                "database": "Hackaton",
                "dataSource": "demo",
                "filter": { $and : [{geoPoint :
                    { $near :
                    {
                        $geometry : {
                            type : "Point" ,
                            coordinates : [lat, long] },
                        $maxDistance : 1000
                    }
                    }}, {dayOfWeek: { $gte : 1, $lte : 5 }}, 
                    {ora: { $gte : orario - 1, $lte : orario + 1 }}, 
                    {CondizioneAtmosferica:clima}
                ]
                }
            });
        } else {
            var queryMediaRoma = JSON.stringify({
                "collection": "Incidente_Geo_Distinct",
                "database": "Hackaton",
                "dataSource": "demo",
                "filter": { $and : [{geoPoint :
                    { $near :
                    {
                        $geometry : {
                            type : "Point" ,
                            coordinates : [lat, long] },
                        $maxDistance : 1000
                    }
                    }}, {dayOfWeek: { $gte : 6 }}, 
                    {ora: { $gte : orario - 1, $lte : orario + 1 }}, 
                    {CondizioneAtmosferica:clima},
                ]
                }
            });
        }

        var queryChartMapConfig = {
            method: 'post',
            url: 'https://data.mongodb-api.com/app/data-bcvqg/endpoint/data/beta/action/find',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '5ZeDsX1tgu7nVn7kJV74XfGcOiN7UMjbiNX36hmEDfataprwx00krrZGrWWw0kjQ'
            },
            data : queryMediaRoma
        };

        let esito = "OK"

        await axios(queryChartMapConfig)
        .then(function (response) {
            // let numeroDocuments = response.data.documents[0].numTotaleIncidenti;
            // return numeroDocuments

            if(response.data.documents.length > valoreSogliaFestivi ) {
                esito = "KO"
            } else {
                esito = "OK"
            } 
        }).catch(function (error) {
            console.log(error);
        });

        return esito
    },

} 



App.getCalcoloAlert(12.4185, 41.9104, false, 18, "Sereno").then((data) => {
    // const allIncidenti = data.documents
    console.log("Prova", data)
    // alert(data)
    // const totaleIncidenti = allIncidenti.length;
    // console.log("Prova: ", allIncidenti)
})
