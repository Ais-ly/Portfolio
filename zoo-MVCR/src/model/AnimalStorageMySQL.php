<?php

require_once __DIR__ . '/Animal.php';
require_once __DIR__ . '/AnimalStorage.php';

class AnimalStorageMySQL implements AnimalStorage{
    
    private PDO $pdo;
    
    public function __construct(PDO $pdo){
      $this->pdo = $pdo;
    }
    
    
   
    public function read(string $id){
        $stmt = $this->pdo->prepare("SELECT name, species, age FROM animals WHERE id = :id");
        
        // Exécuter la requête avec l'ID
        $stmt->execute([':id' => $id]);
        
        // Récupérer le résultat
        $row = $stmt->fetch();
        
        if ($row === false) {
            return null;
        }
        
        return new Animal(
            $row['name'],
            $row['species'],
            (int)$row['age']
        );

        
    }
    
    
    public function readAll(){
        $stmt = $this->pdo->query("SELECT * FROM animals");
    
        // Récupérer toutes les lignes
        $rows = $stmt->fetchAll();
            
        $animals = [];
       foreach ($rows as $row) {
            $animal = new Animal(
                $row['name'],
                $row['species'],
                $row['age']
            );
            
            // Ajouter au tableau avec l'ID comme clé
            $id = (string) $row['id'];
            $animals[$id] = $animal;
        }
        
        return $animals;
    }
    
   
    public function create(Animal $a): string{
        $stmt = $this->pdo->prepare("INSERT INTO animals (name, species, age) VALUES (:name, :species, :age)");
        
        $stmt->execute([
            ':name'    => $a->getName(),
            ':species' => $a->getSpecies(),
            ':age'     => $a->getAge(),
        ]);
        
        return (string) $this->pdo->lastInsertId();
    }
    
   
    public function delete(string $id): bool{
        $stmt = $this->pdo->prepare("DELETE FROM animals WHERE id = :id");
        $stmt->execute([':id' => $id]);
        
        return $stmt->rowCount() > 0;
    }
   
    public function update(string $id, Animal $a): bool{
        $stmt = $this->pdo->prepare("UPDATE animals SET name = :name, species = :species, age = :age WHERE id = :id");
        
        $stmt->execute([
            ':name'    => $a->getName(),
            ':species' => $a->getSpecies(),
            ':age'     => $a->getAge(),
            ':id'      => $id,
        ]);
        
        return $this->read($id) !== null;
    }


}