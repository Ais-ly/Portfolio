<?php

require_once __DIR__ . '/AnimalStorage.php';
require_once __DIR__ . '/Animal.php';

class AnimalStorageStub implements AnimalStorage{
    
    private array $animals;
    
    public function __construct(){
        $this->animals = array(
            'medor' => new Animal('Médor', 'chien', 5),
            'felix' => new Animal('Félix', 'chat', 3),
            'denver' => new Animal('Denver', 'dinosaure', 12),
        );

    }
    

    public function read(string $id) : ?Animal{

        if (isset($this->animals[$id])){
            return $this->animals[$id];
        } else {
            return null;
        }

    }
        
    public function readAll(): array{
        return $this->animals;
    }

    public function create(Animal $a): string{
        throw new Exception("La méthode create() n'a pas de sens sur AnimalStorageStub");
    }


    public function delete(string $id): bool{
        throw new Exception("La méthode delete() n'a pas de sens sur AnimalStorageStub");
    }


    public function update(string $id, Animal $a): bool{
        throw new Exception("La méthode update() n'a pas de sens sur AnimalStorageStub");
    }


}
