<?php
ob_start(); 
session_start();
require_once 'donnees.php';

$pionnier = getPionnier($_GET['id']);
if (!$pionnier) die("Pionnier introuvable.");

//récupèration du texte 
$cheminFragment = "textes/" . $pionnier['fragment'] . ".frg.html";
if (file_exists($cheminFragment)){

    $contenuBrut = file_get_contents($cheminFragment);

    //strip_tags permet d'enlever le <div> et les <p> pour que l'utilisateur ne voit que le texte brut
    $contenuTexte = strip_tags($contenuBrut);
}else{
    $contenuTexte = $pionnier['contribution'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $nomImage = $pionnier['image']; 

    // Gestion de l'image 
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK){
        $extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $nouveauNom = uniqid('img_') . "." . $extension;
        if (move_uploaded_file($_FILES['image']['tmp_name'], "images/" . $nouveauNom)){
            // Supprimer l'ancienne image
            if (!empty($pionnier['image'])){
                $ancienneImage = "images/" . $pionnier['image'];
                if (file_exists($ancienneImage)){
                    unlink($ancienneImage);
                }
            }
        
        
            $nomImage = $nouveauNom;
        }
    }

    //Traitement du texte envoyé par l'utilisateur
    $textePropre = strip_tags($_POST['biographie']);
    $texteFinal = nl2br($textePropre); // Transforme les "Entrée" en <br> HTML

    //Enregistrement dans le fichier fragment
    file_put_contents($cheminFragment, $texteFinal);

    $params = [
        $_POST['nom'],
        $_POST['naissance'],
        !empty($_POST['deces']) ? $_POST['deces'] : null,
        $_POST['nationalite'],
        $nomImage,
        $textePropre, 
        $_GET['id']
    ];

    try{
        $stmt = $pdo->prepare("UPDATE Pionnier SET 
            nom = ?, naissance = ?, deces = ?, 
            nationalite = ?, image = ?, contribution = ? 
            WHERE idP = ?");
        $stmt->execute($params);
        header("Location: index.php?action=liste");
        exit;
    }catch (PDOException $e){
        die("Erreur : " . $e->getMessage());
    }
}
?>

<h1>Modifier le profil</h1>

<form method="post" enctype="multipart/form-data" class="form-ajout">
    <div class="form-group">
        <label>Nom complet</label>
        <input type="text" name="nom" value="<?= htmlspecialchars($pionnier['nom']) ?>" required>
    </div>

    <div class="form-group">
        <label>Biographie</label>
        <textarea name="biographie" placeholder="Décrivez les travaux de ce pionnier..." style="min-height: 200px;"><?= htmlspecialchars(trim($contenuTexte)) ?></textarea>
    </div>

    <div class="form-group">
        <label>Photo</label>
        <div style="margin-bottom: 10px;">
            <img src="images/<?= htmlspecialchars($pionnier['image']) ?>" width="60" style="border-radius: 4px; vertical-align: middle;">
            <span style="font-size: 0.9em; color: #666; margin-left: 10px;">Changer l'image :</span>
        </div>
        <input type="file" name="image" accept="image/*">
    </div>

    <input type="hidden" name="naissance" value="<?= $pionnier['naissance'] ?>">
    <input type="hidden" name="nationalite" value="<?= $pionnier['nationalite'] ?>">

    <button type="submit" class="btn-submit">Enregistrer</button>
</form>

<?php
$contenu = ob_get_clean();
include 'squelette.php';
?>