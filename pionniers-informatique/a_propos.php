<?php
$titrePage = "À propos";
ob_start();
?>
<div class="page-a-propos about-container">
    <h2>À propos du projet</h2>
    <p>
        Ce site est une application web de gestion des pionniers de l'informatique. 
        Il permet de consulter, ajouter, modifier et supprimer des fiches de personnalités 
        ayant marqué l'histoire de l'informatique.
    </p>
    <p>
        Les données sont stockées en base de données MySQL, les biographies dans des fichiers 
        fragments et les photos dans un dossier dédié sur le serveur.
    </p>

    <h3>Technologies utilisées</h3>
    <ul>
        <li>PHP</li>
        <li>MySQL / PDO</li>
        <li>HTML / CSS</li>
    </ul>

    <p><strong>Auteur :</strong> Aissatou Cheikh Ly</p>
</div>
<?php
$contenu = ob_get_clean();
include 'squelette.php';
?>