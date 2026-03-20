<?php

error_reporting(E_ALL);


set_include_path("./src");

// Configuration MySQL
require_once("/users/ly243/private/mysql_config.php");

require_once("model/AnimalStorageMySQL.php");
require_once("ApiRouter.php");



// Connexion PDO
$pdo = new PDO(
    "mysql:host=" . MYSQL_HOST . ";port=" . MYSQL_PORT . ";dbname=" . MYSQL_DB . ";charset=utf8mb4",
    MYSQL_USER,
    MYSQL_PASSWORD
);

$animalStorage = new AnimalStorageMySQL($pdo);
$router = new ApiRouter();
$router->main($animalStorage);




?>