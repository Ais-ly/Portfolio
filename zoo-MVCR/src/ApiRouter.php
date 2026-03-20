<?php

require_once("view/ApiView.php");
require_once("control/Controller.php");

class ApiRouter{
    
    public function main(AnimalStorage $animalStorage){
        $collection = $_GET['collection'] ?? '';
        $id = $_GET['id'] ?? null;
     
        
        $view = new ApiView();
        
        
        $controller = new Controller($view, $animalStorage);
        
        
        if ($collection === 'animaux'){
            if ($id !== null){
                $controller->showInformation($id);

            }else{
                $controller->showList();

            }
        }
    }



}
