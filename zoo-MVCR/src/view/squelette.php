<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title><?= htmlspecialchars($title) ?></title>
    <style>

        .feedback {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        nav.menu {
            background-color: #f0f0f0;
            padding: 10px;
            margin-bottom: 20px;
        }
        nav.menu ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }
        nav.menu li {
            display: inline-block;
            margin-right: 15px;
        }
        nav.menu a {
            text-decoration: none;
            color: #333;
            padding: 5px 10px;
            border-radius: 3px;
        }
        nav.menu a:hover {
            background-color: #ddd;
        }

    </style>
</head>
<body>
    <?php if (!empty($feedback)): ?>
        <div class="feedback">
            <?= htmlspecialchars($feedback) ?>
        </div>
    <?php endif; ?>

    <nav class="menu">
        <ul>
            <?php foreach ($menu as $item): ?>
                <li><a href="<?= htmlspecialchars($item['url']) ?>">
                    <?= htmlspecialchars($item['text']) ?>
                </a></li>
            <?php endforeach; ?>
        </ul>
    </nav>
    
    <h1><?= htmlspecialchars($title) ?></h1>
    <?= $content ?>
    
</body>
</html>