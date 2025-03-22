-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 29 mars 2024 à 15:14
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projet_ipssi`
--

-- --------------------------------------------------------

--
-- Structure de la table `abonnement`
--

DROP TABLE IF EXISTS `abonnement`;
CREATE TABLE IF NOT EXISTS `abonnement` (
  `ID_Abonnement` int NOT NULL AUTO_INCREMENT,
  `ID_Utilisateur` int DEFAULT NULL,
  `Date_abonnement` date DEFAULT NULL,
  `Montant_total` decimal(10,2) DEFAULT NULL,
  `Espace` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Abonnement`),
  KEY `ID_Utilisateur` (`ID_Utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

DROP TABLE IF EXISTS `facture`;
CREATE TABLE IF NOT EXISTS `facture` (
  `ID_Facture` int NOT NULL AUTO_INCREMENT,
  `ID_Utilisateur` int DEFAULT NULL,
  `Date_facturation` date DEFAULT NULL,
  `Montant_total_HT` decimal(10,2) DEFAULT NULL,
  `Quantite` int DEFAULT NULL,
  `Montant_TVA` decimal(10,2) DEFAULT NULL,
  `Montant_TTC` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`ID_Facture`),
  KEY `ID_Utilisateur` (`ID_Utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fichier`
--

DROP TABLE IF EXISTS `fichier`;
CREATE TABLE IF NOT EXISTS `fichier` (
  `ID_Fichier` int NOT NULL AUTO_INCREMENT,
  `ID_Utilisateur` int DEFAULT NULL,
  `Nom_fichier` varchar(255) DEFAULT NULL,
  `Taille` decimal(10,2) DEFAULT NULL,
  `Date_upload` date DEFAULT NULL,
  PRIMARY KEY (`ID_Fichier`),
  KEY `ID_Utilisateur` (`ID_Utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `societe`
--

DROP TABLE IF EXISTS `societe`;
CREATE TABLE IF NOT EXISTS `societe` (
  `ID_Societe` int NOT NULL AUTO_INCREMENT,
  `Nom_societe` varchar(255) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  `Code_postal` varchar(10) DEFAULT NULL,
  `Ville` varchar(100) DEFAULT NULL,
  `SIRET` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_Societe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `ID_Utilisateur` int NOT NULL AUTO_INCREMENT,
  `Nom` varchar(255) DEFAULT NULL,
  `Prenom` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Mot_de_passe` varchar(255) DEFAULT NULL,
  `Tel` varchar(20) DEFAULT NULL,
  `Adresse` varchar(255) DEFAULT NULL,
  `Code_postal` varchar(10) DEFAULT NULL,
  `Ville` varchar(100) DEFAULT NULL,
  `Roles` json DEFAULT NULL,
  `Espace_util` decimal(10,2) DEFAULT NULL,
  `Date_inscription` date DEFAULT NULL,
  PRIMARY KEY (`ID_Utilisateur`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `abonnement`
--
ALTER TABLE `abonnement`
  ADD CONSTRAINT `abonnement_ibfk_1` FOREIGN KEY (`ID_Utilisateur`) REFERENCES `utilisateur` (`ID_Utilisateur`);

--
-- Contraintes pour la table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`ID_Utilisateur`) REFERENCES `utilisateur` (`ID_Utilisateur`);

--
-- Contraintes pour la table `fichier`
--
ALTER TABLE `fichier`
  ADD CONSTRAINT `fichier_ibfk_1` FOREIGN KEY (`ID_Utilisateur`) REFERENCES `utilisateur` (`ID_Utilisateur`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
