<?php 
// if(!isset($_REQUEST['strada'])){
//     throw new Exception('Parametro "strada" non presente!');
// }

$collection = $db->Incidente_Geo_Distinct;

$filter = array();
$filter[] = ['$count' => 'Protocollo'];

$cursor = $collection->aggregate($filter);

$ret = array();
foreach($cursor as $doc){
    $ret['count'] = $doc->Protocollo;
}

echo json_encode($ret);