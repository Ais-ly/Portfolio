# Zoo

Application web de gestion d'animaux développée en PHP, suivant le patron de conception MVC.

## Architecture

- **Model** : gestion des données via une interface `AnimalStorage` avec plusieurs implémentations (MySQL, Session, Stub)
- **View** : génération HTML (`View`) et JSON (`ApiView`)
- **Controller** : logique applicative
- **Router** : dispatch des requêtes HTTP

## Fonctionnalités

- Lister, créer, modifier et supprimer des animaux
- API REST JSON (`api.php`)

## Lancer le projet

- Configurer les identifiants MySQL dans un fichier externe
- Importer la base de données
- Accéder via `site.php` pour l'interface web ou `api.php` pour l'API
