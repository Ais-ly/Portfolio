<?php

require_once __DIR__ . '/../model/Animal.php';
require_once __DIR__ . '/ViewInterface.php';

class ApiView implements ViewInterface {
    
    public function prepareListPage(array $animals):void{
        $result = [];
        foreach ($animals as $id => $animal){
            $result[] = [
                'id' => $id,           
                'nom' => $animal->getName() 
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($result);


    }
    
 
    public function prepareAnimalPage(Animal $animal, string $id):void{
        $data = [
            'nom' => $animal->getName(),      
            'espece' => $animal->getSpecies(), 
            'age' => $animal->getAge()        
        ];
        header('Content-Type: application/json');
        echo json_encode($data);


    }
    
    public function prepareUnknownAnimalPage():void{
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['error' => 'Animal non trouvé']);

    }


    public function displayAnimalCreationSuccess(string $id): void {}
    public function displayAnimalDeletionSuccess(): void {}
    public function displayAnimalUpdateSuccess(string $id): void {}
    public function prepareAnimalCreationPage(AnimalBuilder $builder): void {}
    public function render(): void {}
    
   
}
