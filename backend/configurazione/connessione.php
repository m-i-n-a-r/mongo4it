<?php require_once __DIR__ . '/../vendor/autoload.php';

// try{
$client = new MongoDB\Client(
    'mongodb://DO_NOT_MODIFY:DO_NOT_MODIFY@demo-shard-00-00.lrogh.mongodb.net:27017,demo-shard-00-01.lrogh.mongodb.net:27017,demo-shard-00-02.lrogh.mongodb.net:27017/Hackaton?ssl=true&replicaSet=atlas-6o42sd-shard-0&authSource=admin&retryWrites=true&w=majority');
$db = $client->Hackaton;
