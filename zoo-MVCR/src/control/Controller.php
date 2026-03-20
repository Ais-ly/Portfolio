<?php
require_once __DIR__ . '/../view/ViewInterface.php';
require_once __DIR__ . '/../model/Animal.php';
require_once __DIR__ . '/../model/AnimalStorage.php';
require_once __DIR__ . '/../model/AnimalBuilder.php';

class Controller{
    private ViewInterface $view;
  //private array $animalsTab;
    private AnimalStorage $animalStorage;


    public function __construct(ViewInterface $view, AnimalStorage $animalStorage){
        $this->view = $view;
        $this->animalStorage = $animalStorage;
        /*$this->animalsTab =  array(
            'medor' => new Animal('Médor', 'chien', 5),
            'felix' => new Animal('Félix', 'chat', 3),
            'denver' => new Animal('Denver', 'dinosaure', 12),
        );*/
    }


    /*public function showInformation($id){
        foreach($this->animalsTab as $name => $species){
	        $this->view->prepareAnimalPage($name, $species);
        } 
    }*/

    public function createNewAnimal(): void{
        $builder = new AnimalBuilder([]);
        $this->view->prepareAnimalCreationPage($builder);
        $this->view->render();

    }


    public function saveNewAnimal(array $data): void{
        // Créer un AnimalBuilder avec les données
        $builder = new AnimalBuilder($data);
        
        if ($builder->isValid()){
            $animal = $builder->createAnimal();
            $id = $this->animalStorage->create($animal);
            
           //utiliser displayAnimalCreationSuccess
            $this->view->displayAnimalCreationSuccess($id);
        } else{
            $this->view->prepareAnimalCreationPage($builder);
            $this->view->render();
        }
    }


    public function showInformation($id) : void{
        $animal = $this->animalStorage->read($id);
        
        if ($animal !== null){
            $this->view->prepareAnimalPage($animal, $id);
        }else{
            $this->view->prepareUnknownAnimalPage();
        }
        $this->view->render();
    }


    public function showList(): void{
        $animals = $this->animalStorage->readAll();
        $this->view->prepareListPage($animals);
        $this->view->render();


    }


    public function deleteAnimal(string $id): void{
        $success = $this->animalStorage->delete($id);
        if ($success){
            $this->view->displayAnimalDeletionSuccess();
        }else{
            $this->view->prepareUnknownAnimalPage();
            $this->view->render();
        }
    }

    public function updateAnimal(string $id, array $data): void{
        $builder = new AnimalBuilder($data);
        
        if ($builder->isValid()){
            $animal = $builder->createAnimal();
            $success = $this->animalStorage->update($id, $animal);
            if ($success){
                $this->view->displayAnimalUpdateSuccess($id);
            }else{
                $this->view->prepareUnknownAnimalPage();
                $this->view->render();
            }
        }else{
            $this->view->prepareAnimalEditPage($builder, $id); 
            $this->view->render();
        }
    }



    public function showEditAnimal(string $id): void{
        $animal = $this->animalStorage->read($id);
        
        if ($animal === null){
            $this->view->prepareUnknownAnimalPage();
            $this->view->render();
            return;
        }
        
        $data = [
            AnimalBuilder::NAME_REF    => $animal->getName(),
            AnimalBuilder::SPECIES_REF => $animal->getSpecies(),
            AnimalBuilder::AGE_REF     => $animal->getAge(),
        ];
        
        $builder = new AnimalBuilder($data);
        $this->view->prepareAnimalEditPage($builder, $id);
        $this->view->render();
    }



}



?>