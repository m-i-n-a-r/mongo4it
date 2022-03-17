<?php 
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
require_once '../configurazione/connessione.php';

echo "\033[93mRecupero Incidenti live da luceverde.it\033[39m".PHP_EOL;
$dati = json_decode(file_get_contents('https://api.luceverde.it/legacy/epf/getEvents/5/predefinito'));

$new = array();

foreach ($dati->features as $evento){
    $titolo = $evento->properties->what->title;
    $pos = strpos(strtolower($titolo),'incidente');
//     $pos = strpos(strtolower($titolo),'traffico');
    if ($pos !== false){
        $incidente = new stdClass();
        $incidente->Protocollo = intval(date("Y").$evento->properties->id);
        $incidente->NaturaIncidente = $titolo;
        $incidente->STRADA1 = $evento->properties->where->road;
        $incidente->Strada02 = $evento->properties->where->initialStreet;
        $orig_date = new DateTime($evento->properties->when->initialDate);
        $orig_date=$orig_date->getTimestamp();
        $incidente->data = new \MongoDB\BSON\UTCDateTime($orig_date * 1000);
        $geoPoint = new stdClass();
        $geoPoint->type="Point";
        if ($evento->geometry->type == 'Point'){
            $geoPoint->coordinates = $evento->geometry->coordinates;
        }
        elseif ($evento->geometry->type == 'MultiPoint'){
            $geoPoint->coordinates = $evento->geometry->coordinates[0];
        }
        $incidente->geoPoint = $geoPoint;
        $incidente->ora = intval(date('H', intval($incidente->data."")/1000));
        $incidente->dayOfWeek = intval(date('w', intval($incidente->data."")/1000))+1;
        
        $incidente->municipio = getMunicipioByCoordinate($db, $geoPoint);

        if(getIncidenteByProtocollo($db, $incidente->Protocollo) == null && isset($geoPoint->coordinates)){
            $meteo = getMeteo($geoPoint->coordinates);
            $incidente->CondizioneAtmosferica = $meteo->CondizioneAtmosferica;
            $incidente->Visibilita = $meteo->Visibilita; 
        }
        $new[]=$incidente;
    }
}


// echo '<pre>';
// print_r($new);
// echo '</pre>';

foreach ($new as $n){
    if (isset($n->CondizioneAtmosferica) && $n->CondizioneAtmosferica != "" && getIncidenteByProtocollo($db, $n->Protocollo) == null){
        insertIncidente($db, $n);
    }
}

function getMeteo($coordinate){
    $obj = new stdClass();
    $obj->CondizioneAtmosferica = "";
    $obj->Visibilita = "";
    if (count($coordinate) != 2){
        return $obj;
    }
    $curl = curl_init();
    
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://community-open-weather-map.p.rapidapi.com/weather?lat=".$coordinate[0]."&lon=".$coordinate[1]."&lang=it&units=metric",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key: e99a5c97bfmsha641f5828e1fb5cp110a84jsnbcec7231a452"
        ],
    ]);
    
    $response = curl_exec($curl);
    $err = curl_error($curl);
    
    curl_close($curl);
    
    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
//         echo $response;
        $meteo = json_decode($response);
//         echo '<pre>';
//         print_r($meteo);
//         echo '</pre>';

        // Foschia
        // Vento forte
        // Sole radente
        // Pioggia in atto
        // Nuvoloso
        // Sereno
        // Nebbia
        // Grandine in atto

        if (isset($meteo->message)){
            
        }
        else{
            $ca = "";
            switch($meteo->weather[0]->description){
                case 'cielo sereno': $ca = "Sereno";
                break;
                case 'nubi sparse': $ca = "Nuvoloso";
                break;
                case 'cielo coperto': $ca = "Nuvoloso";
                break;
                case 'poche nuvole': $ca = "Nuvoloso";
                break;
                case 'pioggia leggera': $ca = "Pioggia in atto";
                break;
                default: $ca = $meteo->weather[0]->description;
            }
            $v = "";
            if (intval($meteo->visibility) <= 3300){
                $v = "Insufficiente";
            }
            elseif(intval($meteo->visibility) <= 6600){
                $v = "Sufficiente";
            }
            elseif(intval($meteo->visibility) <= 10000){
                $v = "Buona";
            }
            $obj->CondizioneAtmosferica = $ca;
            $obj->Visibilita = $v;
        }
    }
    
    return $obj;
}

function getIncidenteByProtocollo($db, $protocollo){
    $collection = $db->Incidente_Geo_Distinct;
    
    $option = array();
    $where = array();
    $where["Protocollo"]= intval($protocollo);
    
    $obj = $collection->findOne($where,$option);
    return $obj;
}

function getMunicipioByCoordinate($db, $geoPoint){
    $collection = $db->Municipi;
    
    $option = array();
    $where = array();
    $where['geometry']=['$geoIntersects' => ['$geometry' => $geoPoint]];
    
    $option = ['projection' => [
            'properties' => 1
    ]
    ];
    
    $obj = $collection->findOne($where,$option);

    $municipio = "";
    if ($obj != null){
        $municipio = $obj->properties->municipio;
    }
    
    return $municipio;
}

function insertIncidente($db, $incidente){
    echo PHP_EOL.PHP_EOL."\033[91mINCIDENTE!\033[39m".PHP_EOL;
    echo "\033[96mProtocollo: \033[92m".$incidente->Protocollo."".PHP_EOL;
    echo "\033[96mNaturaIncidente: \033[92m".$incidente->NaturaIncidente."".PHP_EOL;
    echo "\033[96mSTRADA1: \033[92m".$incidente->STRADA1."".PHP_EOL;
    echo "\033[96mStrada02: \033[92m".$incidente->Strada02."".PHP_EOL;
    echo "\033[96mdata: \033[92m".date('d/m/Y H:i:s', intval($incidente->data."")/1000)."".PHP_EOL;
    echo "\033[96mgeoPoint.type: \033[92m".$incidente->geoPoint->type."".PHP_EOL;
    echo "\033[96mgeoPoint.coordinates: \033[92m".$incidente->geoPoint->coordinates[0]." - ".$incidente->geoPoint->coordinates[1]."".PHP_EOL;
    echo "\033[96mCondizioneAtmosferica: \033[92m".$incidente->CondizioneAtmosferica."".PHP_EOL;
    echo "\033[96mVisibilita: \033[92m".$incidente->Visibilita."\033[39m".PHP_EOL;
    $collection = $db->Incidente_Geo_Distinct;
    
    $obj = $collection->insertOne($incidente);
    return $obj;
}