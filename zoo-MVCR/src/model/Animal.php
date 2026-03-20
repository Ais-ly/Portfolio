<?php
class Animal{
    private string $name;
    private string $species;
    private int $age;


    public function __construct(string $name, string $species, int $age){
        $this->name = $name;
        $this->species = $species;
        $this->age = $age;
    }


    public function getName() : string{
        return $this->name;
    }


    public function getSpecies() : string{
        return $this->species;
    }


    public function getAge() : int{
        return $this->age;
    }
}



?>