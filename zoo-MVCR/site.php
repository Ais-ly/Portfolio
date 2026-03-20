<?php
/*
 * On indique que les chemins des fichiers qu'on inclut
 * seront relatifs au répertoire src.
 */
set_include_path("./src");
session_start();
/* Inclusion des classes utilisées dans ce fichier */
require_once("model/AnimalStorageMySQL.php");
require_once("Router.php");
require_once("/users/ly243/private/mysql_config.php");


try{
    
    $pdo = new PDO(
        "mysql:host=" . MYSQL_HOST . 
        ";port=" . MYSQL_PORT . 
        ";dbname=" . MYSQL_DB . 
        ";charset=utf8mb4",
        MYSQL_USER,
        MYSQL_PASSWORD,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

$animalStorage = new AnimalStorageMySQL($pdo); 
$router = new Router();

$router->main($animalStorage);


}catch (PDOException $e){
    die("Erreur de connexion à la base de données : " . $e->getMessage());

}


/*
 * Cette page est simplement le point d'arrivée de l'internaute
 * sur notre site. On se contente de créer un routeur
 * et de lancer son main.
 */



?>