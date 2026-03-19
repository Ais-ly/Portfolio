


-- Table principale
CREATE TABLE Pionnier (
    idP INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    naissance DATE NOT NULL,
    deces DATE,
    nationalite VARCHAR(50) NOT NULL,
    contribution TEXT NOT NULL,
    image VARCHAR(255) NOT NULL DEFAULT 'default.jpg',
    fragment VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Données d'exemple
INSERT INTO Pionnier (nom, naissance, deces, nationalite, contribution, image, fragment) VALUES
('Alan Turing', '1912-06-23', '1954-06-07', 'Britannique', 'Machine de Turing, cryptanalyse Enigma', 'turing.jpg', 'turing'),
('Ada Lovelace', '1815-12-10', '1852-11-27', 'Britannique', 'Premier algorithme informatique', 'lovelace.jpg', 'lovelace'),
('John von Neumann', '1903-12-28', '1957-02-08', 'Américano-Hongrois', 'Architecture des ordinateurs modernes', 'vonneumann.jpg', 'vonneumann'),
('Grace Hopper', '1906-12-09', '1992-01-01', 'Américaine', 'Premier compilateur (COBOL)', 'hopper.jpg', 'hopper');


