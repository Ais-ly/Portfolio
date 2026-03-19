<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Pionniers de l'informatique</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body class="page-accueil">
    <header class="main-header">
        <nav class="main-nav">
            <a href="index.php" class="nav-link active"><i class="fas fa-home"></i> Accueil</a>
            <a href="ajouter.php" class="nav-link"><i class="fas fa-plus-circle"></i> Ajouter</a>
            <a href="a_propos.php" class="nav-link"><i class="fas fa-info-circle"></i> À propos</a>
        </nav>
    </header>
    
    <?php if (isset($_SESSION['message'])): ?>
	    <div class="alert alert-success">
		<?= $_SESSION['message'] ?>
	    </div>
	    <?php unset($_SESSION['message']); ?>
    <?php endif; ?>

    <main class="main-content">
        <?= $contenu ?>
    </main>
</body>
</html>
