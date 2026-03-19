<?php
// Connexion à la DB
require_once('./config1.php'); 

$dsn = DB_HOST . DB_NAME . ';charset=utf8';

try{
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
}catch (PDOException $e){
    die('Erreur de connexion : ' . $e->getMessage());
}
function getPionniers(){
    global $pdo;
    return $pdo->query("SELECT * FROM Pionnier")->fetchAll(PDO::FETCH_ASSOC);
}

function getPionnier($id){
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM Pionnier WHERE idP = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
