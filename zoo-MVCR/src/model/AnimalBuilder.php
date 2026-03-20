<?php
require_once __DIR__ . '/Animal.php';

class AnimalBuilder {
    
    public const NAME_REF = 'NOM';
    public const SPECIES_REF = 'ESPECE';
    public const AGE_REF = 'AGE';
    
    private array $data;
    private ?string $error;
    
    public function __construct(array $data){
        $this->data = $data;
        $this->error = null;
    }
   
    public function getData(): array{
        return $this->data;
    }
    
    public function getError(): ?string{
        return $this->error;
    }
    
    public function getField(string $key): string{
        return $this->data[$key] ?? '';
    }

    public function createAnimal(): Animal{
        $name = trim($this->data[self::NAME_REF] ?? '');
        $species = trim($this->data[self::SPECIES_REF] ?? '');
        $age = $this->data[self::AGE_REF] ?? '';
        
        if (empty($name)) {
            throw new Exception("Veuillez entrer le nom!");
        } elseif (empty($species)) {
            throw new Exception("Veuillez préciser l'espèce!");
        } elseif (!is_numeric($age) || $age < 0) {
            throw new Exception("L'âge doit être un nombre positif!");
        }

        $age = intval($age);
        return new Animal($name, $species, $age);

    }

    public function isValid(): bool{
        $name = trim($this->data[self::NAME_REF] ?? '');
        $species = trim($this->data[self::SPECIES_REF] ?? '');
        $age = $this->data[self::AGE_REF] ?? '';
        
        $this->error = null;
        
        if (empty($name)){
            $this->error = "Veuillez entrer le nom!";
            return false;
        }
        
        if (empty($species)){

            $this->error = "Veuillez préciser l'espèce!";
            return false;
        }
        

        if (!is_numeric($age) || $age < 0){
            $this->error = "L'âge doit être un nombre positif!";
            return false;
        }
        
        return true;
    }





}
