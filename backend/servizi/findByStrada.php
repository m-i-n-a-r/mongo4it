<?php 
if(!isset($_REQUEST['strada'])){
    throw new Exception('Parametro "strada" non presente!');
}

$collection = $db->Incident_Geo;

$option = array();
$where = array();
$where["STRADA1"]= $_REQUEST['strada'];

$cursor = $collection->find($where,$option)->toArray();
echo json_encode($cursor);