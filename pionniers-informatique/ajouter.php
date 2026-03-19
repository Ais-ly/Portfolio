<?php
ob_start(); 
session_start();
require_once 'donnees.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    //Gestion de l'image
    $nomImage = 'default.jpg';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $extensionsAutorisees = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (in_array($extension, $extensionsAutorisees)) {
            // On génère un nom unique pour éviter les doublons
            $nomImage = uniqid('img_') . "." . $extension;
            move_uploaded_file($_FILES['image']['tmp_name'], "images/" . $nomImage);
        }
    }

    //Gestion du fichier texte(fragment)
    $fragmentNom = 'pionnier_' . uniqid();
    $texteBrut = strip_tags($_POST['texte']); // Nettoyage du HTML
    $texteFinal = nl2br($texteBrut); // Transformation des retours à la ligne
    
    file_put_contents("textes/$fragmentNom.frg.html", $texteFinal);
    
    //Insertion en Base de Données
    $sql = "INSERT INTO Pionnier (nom, naissance, deces, nationalite, image, fragment, contribution) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $params = [
        $_POST['nom'],
        $_POST['naissance'],
        !empty($_POST['deces']) ? $_POST['deces'] : null,
        $_POST['nationalite'],
        $nomImage,
        $fragmentNom,
        $texteBrut
    ];

    try{
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        

        $_SESSION['message'] = "Le nouveau pionnier a été ajouté avec succès !";
        
        // Redirection, retour vers la liste
        header("Location: index.php?action=liste");
        exit; 
    }catch (PDOException $e){
        die("Erreur lors de l'ajout : " . $e->getMessage());
    }

}


$titrePage = "Ajouter un pionnier";
?>

<h1>Ajouter un nouveau pionnier</h1>

<form method="post" enctype="multipart/form-data" class="form-ajout">
    <div class="form-group">
        <label for="nom">Nom complet</label>
        <input type="text" id="nom" name="nom" placeholder="Ex: Margaret Hamilton" required>
    </div>
    
    <div style="display: flex; gap: 20px;">
        <div class="form-group" style="flex: 1;">
            <label for="naissance">Date de naissance</label>
            <input type="date" id="naissance" name="naissance" required>
        </div>
        <div class="form-group" style="flex: 1;">
            <label for="deces">Date de décès (optionnel)</label>
            <input type="date" id="deces" name="deces">
        </div>
    </div>
    
    <div class="form-group">
        <label for="nationalite">Nationalité</label>
        <input type="text" id="nationalite" name="nationalite" placeholder="Ex: Américaine" required>
    </div>
    
    <div class="form-group">
        <label for="image">Photo de profil</label>
        <input type="file" id="image" name="image" accept="image/*">
    </div>
    
    <div class="form-group">
        <label for="texte">Biographie</label>
        <textarea id="texte" name="texte" placeholder="Écrivez ici le texte sans balises HTML..." style="min-height: 150px;" required></textarea>
    </div>
    
    <button type="submit" class="btn-submit">Créer la fiche</button>
    <a href="index.php?action=liste" style="display: block; text-align: center; margin-top: 15px; color: #666; text-decoration: none;">Annuler</a>
</form>

<?php
$contenu = ob_get_clean();
include 'squelette.php';
?>