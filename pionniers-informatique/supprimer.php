<?php
require_once 'donnees.php';



if (isset($_GET['id'])){
    try{
        // Récupérer l'image AVANT la suppression
        $pionnier = getPionnier($_GET['id']);
        
        //Supprimer de la base de données
        $stmt = $pdo->prepare("DELETE FROM Pionnier WHERE idP = ?");
        $stmt->execute([$_GET['id']]);
        
        // Supprimer l'image du dossier images/
        if ($pionnier && !empty($pionnier['image'])){
            $cheminImage = "images/" . $pionnier['image'];
            if (file_exists($cheminImage)){
                unlink($cheminImage);
            }
        }

        //Supprimer le fichier texte
        if ($pionnier && !empty($pionnier['fragment'])){
            $cheminTexte = "textes/" . $pionnier['fragment'] . ".frg.html";
            if (file_exists($cheminTexte)){
                unlink($cheminTexte);
            }
        }
        
        
        $_SESSION['message'] = "Pionnier supprimé avec succès";
        
        header("Location: index.php?action=liste");
        exit;
    }catch (PDOException $e){
        die("Erreur : " . $e->getMessage());
    }
}


ob_start();
?>
<h1>Supprimer un pionnier</h1>
<p>Êtes-vous sûr de vouloir supprimer ce pionnier ?</p>
<a href="index.php">Annuler</a>
<a href="supprimer.php?id=<?= $_GET['id'] ?>&confirm=1">Confirmer</a>
<?php
$contenu = ob_get_clean();
include 'squelette.php';
?>
