<?php if ($builder->getError() !== null): ?>
    <div style="color: red; border: 1px solid red; padding: 10px; margin-bottom: 15px;">
        <strong>Erreur :</strong> <?php echo htmlspecialchars($builder->getError()); ?>
    </div>
<?php endif; ?>

<form method="post" action="<?php echo htmlspecialchars($actionUrl); ?>">
    <div>
        <label for="<?php echo htmlspecialchars(AnimalBuilder::NAME_REF); ?>">Nom :</label>
        <input type="text" 
               id="<?php echo htmlspecialchars(AnimalBuilder::NAME_REF); ?>" 
               name="<?php echo htmlspecialchars(AnimalBuilder::NAME_REF); ?>" 
               value="<?php echo htmlspecialchars($builder->getField(AnimalBuilder::NAME_REF)); ?>">
    </div>
    <div>
        <label for="<?php echo htmlspecialchars(AnimalBuilder::SPECIES_REF); ?>">Espèce :</label>
        <input type="text" 
               id="<?php echo htmlspecialchars(AnimalBuilder::SPECIES_REF); ?>" 
               name="<?php echo htmlspecialchars(AnimalBuilder::SPECIES_REF); ?>" 
               value="<?php echo htmlspecialchars($builder->getField(AnimalBuilder::SPECIES_REF)); ?>">
    </div>
    <div>
        <label for="<?php echo htmlspecialchars(AnimalBuilder::AGE_REF); ?>">Âge :</label>
        <input type="number" 
               id="<?php echo htmlspecialchars(AnimalBuilder::AGE_REF); ?>" 
               name="<?php echo htmlspecialchars(AnimalBuilder::AGE_REF); ?>" 
               min="0"
               value="<?php echo htmlspecialchars($builder->getField(AnimalBuilder::AGE_REF)); ?>">
    </div>
    <div>
        <button type="submit"><?php echo htmlspecialchars($submitLabel ?? 'Créer l\'animal'); ?></button>
    </div>
</form>