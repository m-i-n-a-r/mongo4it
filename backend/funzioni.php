<?php 
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
try{
    if(isset($_REQUEST['servizio'])) {
        require_once './configurazione/connessione.php';
        
        $servizio = $_REQUEST['servizio'];
        switch($servizio) {
            case 'countIncidenti': require_once './servizi/countIncidenti.php'; break;
            default: echo json_encode(array());
        }
    }
    else{
        echo json_encode(array());
    }
}
catch(Exception $e){
    echo json_encode(['errore' => $e->getMessage()]);
}