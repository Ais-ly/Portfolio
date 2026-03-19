<?php
session_start(); 
require_once 'donnees.php';

//Gestion des actions
$action = $_GET['action'] ?? 'accueil';
$messageConnexion = "";


ob_start(); 

//Affichage des messages flash 
if (isset($_SESSION['message'])){
    echo '<div class="message" style="background: #e7f3fe; padding: 15px; border-left: 5px solid #2196F3; margin-bottom: 20px;">' . htmlspecialchars($_SESSION['message']) . '</div>';
    unset($_SESSION['message']);

}

switch ($action){
    case 'accueil':
        ?>
        <div class="welcome" style="text-align: center; padding: 50px 20px;">
            <h1>À la découverte des esprits brillants derrière la révolution numérique</h1>
            <p>Explorez l'histoire des visionnaires du numérique.</p>
            
            <div style="margin-top: 30px; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                
                <?= $messageConnexion ?>
                <a href="index.php?action=liste" class="btn" style="background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Afficher la liste des pionniers</a>
            </div>
        </div>
        <?php
        break;

    case 'liste':
        try{
            $pionniers = getPionniers();
            ?>
            <h1>Liste des pionniers de l'informatique</h1>
            <?php if (empty($pionniers)): ?>
                <p class="notice">Aucun pionnier trouvé dans la base de données.</p>
            <?php else: ?>
                <div class="grid">
                    <?php foreach ($pionniers as $p): ?>
                    <div class="card">
                        <img src="images/<?= htmlspecialchars($p['image']) ?>" alt="<?= htmlspecialchars($p['nom']) ?>" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px 8px 0 0;">
                        <div style="padding: 15px;">
                            <h3><?= htmlspecialchars($p['nom']) ?></h3>
                            <p><em><?= htmlspecialchars($p['nationalite']) ?></em></p>
                            <div class="card-actions">
                                <a href="index.php?action=voir&id=<?= $p['idP'] ?>" class="btn-view" title="Voir détails">
                                    <i class="fas fa-eye"></i>
                                </a>
                                <a href="modifier.php?id=<?= $p['idP'] ?>" class="btn-edit" title="Modifier">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <a href="supprimer.php?id=<?= $p['idP'] ?>" 
                                   class="btn-delete" 
                                   onclick="return confirm('Êtes-vous sûr de vouloir supprimer ce pionnier ?');" title="Supprimer">
                                    <i class="fas fa-trash-alt"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <?php
        }catch (Exception $e){
            echo "<p class='erreur'>Erreur lors du chargement de la liste : " . $e->getMessage() . "</p>";
        }
        break;

    case 'voir':
        $id = $_GET['id'] ?? 0;
        try{
            $pionnier = getPionnier($id);
            if (!$pionnier){
                throw new Exception("Pionnier introuvable");
            }
            ?>
            <div class="detail-header">
                <h1><?= htmlspecialchars($pionnier['nom']) ?></h1>
                <div class="detail-actions">
                    <a href="modifier.php?id=<?= $pionnier['idP'] ?>" class="btn-edit" title="Modifier">
                        <i class="fas fa-edit"></i> Modifier
                    </a>
                    <a href="index.php?action=liste" class="btn-back">
                        <i class="fas fa-arrow-left"></i> Retour à la liste
                    </a>
                </div>
            </div>

            <div class="detail-body" style="display: flex; gap: 30px; margin-top: 20px;">
                <div class="detail-image">
                    <img src="images/<?= htmlspecialchars($pionnier['image']) ?>" width="300" alt="<?= htmlspecialchars($pionnier['nom']) ?>" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                </div>
                <div class="detail-info">
                    <p><strong>Nationalité :</strong> <?= htmlspecialchars($pionnier['nationalite']) ?></p>
                    <p><strong>Dates :</strong> 
                        <?= date('d/m/Y', strtotime($pionnier['naissance'])) ?> — 
                        <?= $pionnier['deces'] ? date('d/m/Y', strtotime($pionnier['deces'])) : 'Présent' ?>
                    </p>
                    <hr>
                    <div class="bio-content">
                        <?php 
                        $fragmentFile = "textes/" . $pionnier['fragment'] . ".frg.html";
                        if (file_exists($fragmentFile)) {
                            // On inclut le fichier HTML s'il existe
                            include($fragmentFile);
                        } else {
                            // Sinon on affiche le texte brut de la colonne contribution
                            echo "<div class='bio'>" . nl2br(htmlspecialchars($pionnier['contribution'])) . "</div>";
                        }
                        ?>
                    </div>
                </div>
            </div>
            <?php
        }catch (Exception $e){
            $_SESSION['message'] = "Erreur : " . $e->getMessage();
            header("Location: index.php?action=liste");
            exit;
        }
        break;

    default:
        echo "<h1>404 - Page non trouvée</h1><p>L'action demandée n'existe pas.</p>";
        break;
}

$contenu = ob_get_clean();
include 'squelette.php';
?>