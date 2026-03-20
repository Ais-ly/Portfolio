<?php
set_include_path("./src");
require_once ("view/View.php");
require_once ("control/Controller.php");
//require_once ("model/AnimalStorageStub.php"); 


class Router {

    public function main(AnimalStorage $animalStorage): void{
        if (session_status() === PHP_SESSION_NONE){
            session_start();
        }


        $action = isset($_GET['action']) ? $_GET['action'] : null;
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (isset($_SESSION['feedback'])){
            $feedback = $_SESSION['feedback'];
        }else{
            $feedback = "";
        }

        // Supprimer le feedback après l'avoir récupéré 
        unset($_SESSION['feedback']);

        $view = new View($this, $feedback);
        $controller = new Controller($view, $animalStorage);

        $view->setMenu([
                ['url' => 'site.php', 'text' => 'Accueil'],
                ['url' => 'site.php?action=liste', 'text' => 'Liste des animaux'],
                ['url' => $this->getAnimalCreationURL(), 'text' => 'Créer un animal']
        ]);


        if ($action === 'debug'){
            $this->showDebugPage($view, $animalStorage);
            return;  
        }elseif ($action === 'liste'){
            $controller->showList();
        }elseif ($action === 'nouveau'){
            $controller->createNewAnimal();
        }elseif ($action === 'sauverNouveau'){  
            $controller->saveNewAnimal($_POST);
        }elseif ($action === 'supprimer'){
            $controller->deleteAnimal($id);

        }elseif ($action === 'modifier'){
            $controller->showEditAnimal($id);

        }elseif ($action === 'sauverModification'){
            $controller->updateAnimal($id, $_POST);
        
        }elseif ($id){
            $controller->showInformation($id);

        }else{
            $this->showHomePage();
        }


    }
        


    public function getAnimalURL(string $id): string{
        return "site.php?id=" . urlencode($id);
    }


    public function getAnimalCreationURL(): string{
        return "site.php?action=nouveau";
    }

    public function getAnimalSaveURL(): string{
        return "site.php?action=sauverNouveau";
    }

    public function getAnimalDeleteURL(string $id): string{
        return "site.php?action=supprimer&id=" . urlencode($id);
    }


    public function getAnimalEditURL(string $id): string{
        return "site.php?action=modifier&id=" . urlencode($id);
    }

    public function getAnimalSaveEditURL(string $id): string{
        return "site.php?action=sauverModification&id=" . urlencode($id);
    }

        

    public function showHomePage(): void{
       /* if (session_status() === PHP_SESSION_NONE){
            session_start();
        }
        
        // Récupérer feedback depuis session
        if (isset($_SESSION['feedback'])){
            $feedback = $_SESSION['feedback'];
        } else {
            $feedback = "";
        }

        // Supprimer après récupération
        unset($_SESSION['feedback']);
    
        $view = new View($this, $feedback);*/
        $view = new View($this, "");
        $view->setMenu([
            ['url' => 'site.php', 'text' => 'Accueil'],
            ['url' => 'site.php?action=liste', 'text' => 'Liste des animaux'],
            ['url' => $this->getAnimalCreationURL(), 'text' => 'Créer un animal']
        ]);
        $view->prepareHomePage();
        $view->render();

    }


    public function POSTredirect(string $url, string $feedback = ""): void{
        if (session_status() === PHP_SESSION_NONE){
            session_start();
        }

        $_SESSION['feedback'] = $feedback;

        header("HTTP/1.1 303 See Other");
        header("Location: " . $url);
        exit(); 
    }  


}


?>