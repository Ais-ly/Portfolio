<?php

require_once __DIR__ . '/../Router.php';
require_once __DIR__ . '/ViewInterface.php';
class View implements ViewInterface{


    private string $title;
	private string $content;
    private Router $router;
    private array $menu;
    private string $feedback;

    public function __construct(Router $router, string $feedback = ""){
		$this->title = "";
		$this->content = "";
        $this->router = $router;
        $this->menu = [];
        $this->feedback = $feedback;

	
	}

    public function setMenu(array $menu): void {
        $this->menu = $menu;
    }

    public function render() : void{
        $title = $this->title;
        $content = $this->content;
        $menu = $this->menu;
        $feedback = $this->feedback;
       
        include __DIR__ . "/squelette.php";
       


    }



    public function prepareTestPage() : void{
        $this->title = "Licence Info";
        $this->content = "evfbvhebvuhruuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu";

    }


   /* public function prepareAnimalPage($name, $species) : void{
        $this->title = $name;
        $this->content = $name . " est un animal de l'espèce " . $species;

    }*/


    public function prepareAnimalPage(Animal $animal, $id) : void{
        $this->title = htmlspecialchars($animal->getName());

        $deleteUrl = $this->router->getAnimalDeleteURL($id);
        $editUrl   = $this->router->getAnimalEditURL($id);
        
        $this->content = htmlspecialchars($animal->getName()) . " est un animal de l'espèce " . 
                        htmlspecialchars($animal->getSpecies()) . " et il a " . htmlspecialchars($animal->getAge()) . " ans.";
    
        $this->content .= "<br><br>";
        $this->content .= "<a href=\"" . htmlspecialchars($editUrl) . "\"><button>Modifier</button></a>";
        $this->content .= " <a href=\"" . htmlspecialchars($deleteUrl) . "\" onclick=\"return confirm('Supprimer cet animal ?')\"><button>Supprimer</button></a>";
    }
    
    



    public function prepareUnknownAnimalPage() : void{
        $this->title = "Erreur";
        $this->content = "Animal inconnu.";
    }

    public function prepareHomePage() : void{
        $this->title = "Accueil";
        $this->content = "Bienvenue sur le site des animaux !";
    }


    public function prepareListPage(array $animals) : void{
        $this->title = "Liste des animaux";

        $content = "<ul>";
        foreach($animals as $animalId => $animal) {
            $url = $this->router->getAnimalURL($animalId);
            $deleteUrl = $this->router->getAnimalDeleteURL($animalId);
            $editUrl   = $this->router->getAnimalEditURL($animalId);
           

            $content .= "<li>";
            $content .= "<a href=\"" . htmlspecialchars($url) . "\">" . htmlspecialchars($animal->getName()) . "</a>";
            $content .= " <a href=\"" . htmlspecialchars($editUrl) . "\"><button>Modifier</button></a>";
            $content .= " <a href=\"" . htmlspecialchars($deleteUrl) . "\" onclick=\"return confirm('Supprimer cet animal ?')\"><button>Supprimer</button></a>";
            $content .= "</li>";

        }
        $content .="</ul>";
        $this->content = $content;

        


    }


    public function prepareDebugPage($variable){
        $this->title = 'Debug';
        $this->content = '<pre>'.htmlspecialchars(var_export($variable, true)).'</pre>';
    }


    public function prepareAnimalCreationPage(AnimalBuilder $animalBuilder): void{
        $this->title = "Créer un nouvel animal";
        
        // URL pour l'action du formulaire
        $actionUrl = $this->router->getAnimalSaveURL();

        // Passer le builder au template
        $builder = $animalBuilder;
        
        // Inclure le template
        ob_start(); // Commence à capturer la sortie
        include __DIR__ . '/animalCreationForm.php';
        $this->content = ob_get_clean(); // Récupère le contenu
    }


    public function displayAnimalCreationSuccess(string $id): void{
        $animalUrl = $this->router->getAnimalURL($id);
        $this->router->POSTredirect($animalUrl, "Animal créé avec succès");
        
    }


    public function prepareAnimalEditPage(AnimalBuilder $animalBuilder, string $id): void{
        $submitLabel = "Enregistrer les modifications";
        $this->title = "Modifier un animal";
        
        $actionUrl = $this->router->getAnimalSaveEditURL($id);
        $builder = $animalBuilder;
        
        ob_start();
        include __DIR__ . '/animalCreationForm.php';
        $this->content = ob_get_clean();
    }


    public function displayAnimalDeletionSuccess(): void{
        $this->router->POSTredirect("site.php?action=liste", "Animal supprimé avec succès");
    }

    public function displayAnimalUpdateSuccess(string $id): void{
        $animalUrl = $this->router->getAnimalURL($id);
        $this->router->POSTredirect($animalUrl, "Animal mis à jour avec succès");
    }




}




?>