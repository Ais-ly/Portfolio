<?php

interface ViewInterface {
    public function prepareListPage(array $animals): void;
    public function prepareAnimalPage(Animal $animal, string $id): void;
    public function prepareUnknownAnimalPage(): void;
    public function displayAnimalCreationSuccess(string $id): void;
    public function displayAnimalDeletionSuccess(): void;
    public function displayAnimalUpdateSuccess(string $id): void;
    public function prepareAnimalCreationPage(AnimalBuilder $builder): void;
    public function render(): void;
}