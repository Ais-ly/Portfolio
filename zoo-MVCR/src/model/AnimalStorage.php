<?php


interface AnimalStorage {
    
    /**
     * Retourne l'animal avec l'identifiant donné, ou null si non trouvé
     * @param string $id L'identifiant de l'animal
     * @return Animal|null L'animal trouvé ou null
     */
    public function read(string $id);
    

    /**
     * Retourne tous les animaux sous forme d'un tableau associatif id => Animal
     * @return array Tableau associatif des animaux
     */
    public function readAll();
    

    /**
     * Ajoute un animal à la base et retourne son identifiant
     * @param Animal $a L'animal à ajouter
     * @return string L'identifiant de l'animal créé
     */
    public function create(Animal $a);
    

    /**
     * Supprime un animal de la base
     * @param string $id L'identifiant de l'animal à supprimer
     * @return bool true si suppression effectuée, false si identifiant inexistant
     */
    public function delete(string $id);
    

    /**
     * Met à jour un animal dans la base
     * @param string $id L'identifiant de l'animal à mettre à jour
     * @param Animal $a Le nouvel animal
     * @return bool true si mise à jour effectuée, false si identifiant inexistant
     */
    public function update(string $id, Animal $a);


}
