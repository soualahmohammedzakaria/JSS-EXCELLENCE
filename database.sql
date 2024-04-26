CREATE DATABASE  IF NOT EXISTS `club_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `club_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: club_db
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `absences_coachs`
--

DROP TABLE IF EXISTS `absences_coachs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absences_coachs` (
  `id_absence` int NOT NULL AUTO_INCREMENT,
  `id_coach` int NOT NULL,
  `date` date NOT NULL,
  `justifie` tinyint NOT NULL,
  `justification` varchar(255) NOT NULL,
  PRIMARY KEY (`id_absence`,`id_coach`),
  UNIQUE KEY `id_absence_UNIQUE` (`id_absence`),
  KEY `fk_absences_coachs_coachs1` (`id_coach`),
  CONSTRAINT `fk_absences_coachs_coachs1` FOREIGN KEY (`id_coach`) REFERENCES `coachs` (`id_coach`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absences_coachs`
--

LOCK TABLES `absences_coachs` WRITE;
/*!40000 ALTER TABLE `absences_coachs` DISABLE KEYS */;
/*!40000 ALTER TABLE `absences_coachs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `absences_membres`
--

DROP TABLE IF EXISTS `absences_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absences_membres` (
  `id_absence` int unsigned NOT NULL AUTO_INCREMENT,
  `id_groupe` int unsigned NOT NULL,
  `date` date NOT NULL,
  `justifiee` tinyint NOT NULL,
  `justification` varchar(255) NOT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_absence`,`id_groupe`,`id_membre`),
  UNIQUE KEY `id_absence_UNIQUE` (`id_absence`),
  KEY `fk_absences_membres_groupes1_idx` (`id_groupe`),
  CONSTRAINT `fk_absences_membres_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absences_membres`
--

LOCK TABLES `absences_membres` WRITE;
/*!40000 ALTER TABLE `absences_membres` DISABLE KEYS */;
/*!40000 ALTER TABLE `absences_membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accomplissements`
--

DROP TABLE IF EXISTS `accomplissements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accomplissements` (
  `id_accomp` int unsigned NOT NULL AUTO_INCREMENT,
  `nom_evenement` varchar(255) NOT NULL,
  `date_evenement` date NOT NULL,
  `discipline` varchar(255) NOT NULL,
  `palmares` varchar(255) NOT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_accomp`,`id_membre`),
  UNIQUE KEY `id_parcours_UNIQUE` (`id_accomp`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accomplissements`
--

LOCK TABLES `accomplissements` WRITE;
/*!40000 ALTER TABLE `accomplissements` DISABLE KEYS */;
INSERT INTO `accomplissements` VALUES (1,'coupe d\'algerie','2014-12-26','karate','hgyguylggglg','5');
/*!40000 ALTER TABLE `accomplissements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `administrateurs`
--

DROP TABLE IF EXISTS `administrateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrateurs` (
  `id_admin` int unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Gestionnaire','Administrateur') NOT NULL,
  `photo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `id_admin_UNIQUE` (`id_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrateurs`
--

LOCK TABLES `administrateurs` WRITE;
/*!40000 ALTER TABLE `administrateurs` DISABLE KEYS */;
INSERT INTO `administrateurs` VALUES (1,'SOUALAH MOHAMMED','Zakaria','zaxy17','7215ee9c7d9dc229d2921a40e899ec5f','Administrateur',''),(16,'ZEGHIMI','Zayd Aymen','zzaydou','a341c7080e9c303c1e885ba96e710730','Gestionnaire',''),(18,'HEMIMED','Anis','h_anis','25f9e794323b453885f5181f1b624d0b','Gestionnaire',''),(19,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(20,'SAHRAOUI','Ramy','ramy18','bc70904109e8f620e4b53c33eaf8b811','Gestionnaire',''),(21,'LEHIDANE','Mohammed','m_lehidane','f1d9b0a5ac1ae1811b80ab6fde4f4396','Administrateur',''),(28,'BOUKAKIOU','Rayan','bkrayan','25f9e794323b453885f5181f1b624d0b','Gestionnaire',''),(30,'BETTAYEB','Yazid','yazidbet','25f9e794323b453885f5181f1b624d0b','Administrateur',NULL),(32,'KOUDRI','Chemsedine','chemso17','b2220407b7e07a6abb7beac457bc679a','Gestionnaire',''),(33,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(35,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(36,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(38,'KHALED','Adriane Anis','adralo','798547eb8831c98ae7474f328e3a57c4','Administrateur',''),(39,'BETTAYEB','Yazid','yazidbet','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(40,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(41,'KHALED','Adriane Anis','adralow1','25f9e794323b453885f5181f1b624d0b','Administrateur',''),(42,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(43,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(44,'BETTAYEB','Yazid','yazzzid','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',''),(45,'BETTAYEB','BETTAYEB','yazidbet','798547eb8831c98ae7474f328e3a57c4','Gestionnaire',NULL),(47,'KHALED','Adriane Anis','adralow11111111','798547eb8831c98ae7474f328e3a57c4','Administrateur','');
/*!40000 ALTER TABLE `administrateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assiduite_coachs`
--

DROP TABLE IF EXISTS `assiduite_coachs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assiduite_coachs` (
  `id_assiduite` int unsigned NOT NULL AUTO_INCREMENT,
  `id_coach` int NOT NULL,
  `date` date NOT NULL,
  `heure_entree` time NOT NULL,
  `heure_sortie` time DEFAULT NULL,
  PRIMARY KEY (`id_assiduite`,`id_coach`),
  UNIQUE KEY `id_assiduite_UNIQUE` (`id_assiduite`),
  KEY `fk_assiduite_coachs_coachs1` (`id_coach`),
  CONSTRAINT `fk_assiduite_coachs_coachs1` FOREIGN KEY (`id_coach`) REFERENCES `coachs` (`id_coach`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assiduite_coachs`
--

LOCK TABLES `assiduite_coachs` WRITE;
/*!40000 ALTER TABLE `assiduite_coachs` DISABLE KEYS */;
/*!40000 ALTER TABLE `assiduite_coachs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assiduite_membres`
--

DROP TABLE IF EXISTS `assiduite_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assiduite_membres` (
  `id_assiduite` int unsigned NOT NULL AUTO_INCREMENT,
  `id_groupe` int unsigned NOT NULL,
  `date` date NOT NULL,
  `heure_entree` time NOT NULL,
  `heure_sortie` time DEFAULT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_assiduite`,`id_groupe`,`id_membre`),
  UNIQUE KEY `id_assiduite_UNIQUE` (`id_assiduite`),
  KEY `fk_assiduite_membres_groupes1_idx` (`id_groupe`),
  CONSTRAINT `fk_assiduite_membres_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assiduite_membres`
--

LOCK TABLES `assiduite_membres` WRITE;
/*!40000 ALTER TABLE `assiduite_membres` DISABLE KEYS */;
/*!40000 ALTER TABLE `assiduite_membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coachs`
--

DROP TABLE IF EXISTS `coachs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coachs` (
  `id_coach` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `photo` varchar(255) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `sexe` enum('Homme','Femme') NOT NULL,
  PRIMARY KEY (`id_coach`),
  UNIQUE KEY `id_coach_UNIQUE` (`id_coach`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coachs`
--

LOCK TABLES `coachs` WRITE;
/*!40000 ALTER TABLE `coachs` DISABLE KEYS */;
INSERT INTO `coachs` VALUES (5,'zeghimi','zayd','mz-zeghimi@esi.dz','2004-12-10','hvtuffyt','0512598765','Homme'),(6,'boukakiou','rayan','boukarayan2004@gmail.com','2004-08-08','hvtuffyt','0697050635','Homme'),(8,'zeghimi','moh','mz_zeghimi@esi.dz','1980-12-26','hvtuffyt','0578219634','Homme');
/*!40000 ALTER TABLE `coachs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creneaux`
--

DROP TABLE IF EXISTS `creneaux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creneaux` (
  `id_creneau` int unsigned NOT NULL AUTO_INCREMENT,
  `id_groupe` int unsigned NOT NULL,
  `numero_salle` int unsigned NOT NULL,
  `titre` varchar(100) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `type` enum('Evénement','Séance') NOT NULL,
  `description` text,
  PRIMARY KEY (`id_creneau`,`id_groupe`,`numero_salle`),
  UNIQUE KEY `id_creneau_UNIQUE` (`id_creneau`),
  KEY `fk_creneaux_groupes1_idx` (`id_groupe`),
  KEY `fk_creneaux_salles1_idx` (`numero_salle`),
  CONSTRAINT `fk_creneaux_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`),
  CONSTRAINT `fk_creneaux_salles1` FOREIGN KEY (`numero_salle`) REFERENCES `salles` (`numero_salle`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creneaux`
--

LOCK TABLES `creneaux` WRITE;
/*!40000 ALTER TABLE `creneaux` DISABLE KEYS */;
INSERT INTO `creneaux` VALUES (1,1,1,'test111','2024-04-24 10:30:00','2024-04-24 10:35:00','Evénement','blabla'),(21,5,2,'Combat sa9la','2024-04-24 10:40:00','2024-04-24 10:45:00','Séance','blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),(25,2,1,'test6','2024-04-25 15:52:00','2024-04-25 15:55:00','Séance','test5'),(28,5,2,'test4','2024-04-25 15:50:00','2024-04-25 15:55:00','Evénement','blabla');
/*!40000 ALTER TABLE `creneaux` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `depenses`
--

DROP TABLE IF EXISTS `depenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `depenses` (
  `id_depense` int unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `montant` decimal(10,2) unsigned NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `facture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_depense`),
  UNIQUE KEY `id_transaction_UNIQUE` (`id_depense`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depenses`
--

LOCK TABLES `depenses` WRITE;
/*!40000 ALTER TABLE `depenses` DISABLE KEYS */;
INSERT INTO `depenses` VALUES (1,'vvlgvgjvjgglv','tsshy',5000.00,'2023-12-19','iygygygyu','chemin');
/*!40000 ALTER TABLE `depenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipements`
--

DROP TABLE IF EXISTS `equipements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipements` (
  `numero_salle` int unsigned NOT NULL,
  `nom` varchar(255) NOT NULL,
  `quantite` int unsigned NOT NULL,
  PRIMARY KEY (`numero_salle`),
  KEY `fk_equipements_salles1_idx` (`numero_salle`),
  CONSTRAINT `fk_equipements_salles1` FOREIGN KEY (`numero_salle`) REFERENCES `salles` (`numero_salle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipements`
--

LOCK TABLES `equipements` WRITE;
/*!40000 ALTER TABLE `equipements` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupes`
--

DROP TABLE IF EXISTS `groupes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupes` (
  `id_groupe` int unsigned NOT NULL AUTO_INCREMENT,
  `id_sport` int unsigned NOT NULL,
  `nom_groupe` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`id_groupe`),
  UNIQUE KEY `id_sport_UNIQUE` (`id_groupe`),
  UNIQUE KEY `nom_UNIQUE` (`nom_groupe`),
  KEY `fk_groupes_sports1_idx` (`id_sport`),
  CONSTRAINT `fk_groupes_sports1` FOREIGN KEY (`id_sport`) REFERENCES `sports` (`id_sport`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes`
--

LOCK TABLES `groupes` WRITE;
/*!40000 ALTER TABLE `groupes` DISABLE KEYS */;
INSERT INTO `groupes` VALUES (1,1,'Judo U17','Judo pour les -17ans'),(2,1,'Judo U15','Judo pour les -15ans'),(5,2,'Kickboxing -80kg','-80kg');
/*!40000 ALTER TABLE `groupes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupes_a_coachs`
--

DROP TABLE IF EXISTS `groupes_a_coachs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupes_a_coachs` (
  `id_groupe` int unsigned NOT NULL,
  `id_coach` int NOT NULL,
  PRIMARY KEY (`id_groupe`,`id_coach`),
  KEY `fk_groupes_has_coaches_coaches1_idx` (`id_coach`),
  KEY `fk_groupes_has_coaches_groupes1_idx` (`id_groupe`),
  CONSTRAINT `fk_groupes_has_coaches_coaches1` FOREIGN KEY (`id_coach`) REFERENCES `coachs` (`id_coach`),
  CONSTRAINT `fk_groupes_has_coaches_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes_a_coachs`
--

LOCK TABLES `groupes_a_coachs` WRITE;
/*!40000 ALTER TABLE `groupes_a_coachs` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupes_a_coachs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupes_a_membres`
--

DROP TABLE IF EXISTS `groupes_a_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupes_a_membres` (
  `id_groupes` int unsigned NOT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_groupes`,`id_membre`),
  KEY `fk_groupes_has_membres_groupes1_idx` (`id_groupes`),
  CONSTRAINT `fk_groupes_has_membres_groupes1` FOREIGN KEY (`id_groupes`) REFERENCES `groupes` (`id_groupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes_a_membres`
--

LOCK TABLES `groupes_a_membres` WRITE;
/*!40000 ALTER TABLE `groupes_a_membres` DISABLE KEYS */;
INSERT INTO `groupes_a_membres` VALUES (1,'6'),(2,'2'),(2,'6'),(5,'2');
/*!40000 ALTER TABLE `groupes_a_membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membres`
--

DROP TABLE IF EXISTS `membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membres` (
  `id_membre` int unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `sexe` enum('Homme','Femme') NOT NULL,
  `date_naissance` date NOT NULL,
  `date_inscription` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `groupe_sanguin` varchar(20) NOT NULL,
  `maladies` varchar(255) NOT NULL,
  `poids` smallint unsigned NOT NULL,
  `taille` smallint unsigned NOT NULL,
  `supprime` tinyint NOT NULL,
  PRIMARY KEY (`id_membre`),
  UNIQUE KEY `id_membre_UNIQUE` (`id_membre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membres`
--

LOCK TABLES `membres` WRITE;
/*!40000 ALTER TABLE `membres` DISABLE KEYS */;
INSERT INTO `membres` VALUES (1,'SOUALAH MOHAMMED','Zakaria','Homme','2005-09-18','2024-03-11','zakaria@gmail.com','a','0745231208','O+','/',89,182,0),(8,'SOUALAH MOHAMMED','Anis','Homme','2009-09-18','2024-05-11','zakaria@gmail.com','a','0745231208','O-','/',89,182,0),(9,'ADRIANE','Khaled','Femme','2000-09-18','2024-03-11','zakaria@gmail.com','a','0745231208','O+','/',89,182,0),(10,'SOUALAH MOHAMMED','Rayan','Homme','2003-09-18','2024-03-11','zakaria@gmail.com','a','0745231208','O+','/',89,182,0),(11,'ADRIANE','Aymen','Femme','2005-09-18','2024-03-11','zakaria@gmail.com','a','0745231208','O+','/',89,182,0),(12,'ADRIANE','Zayd','Femme','2007-09-18','2024-03-11','zakaria@gmail.com','a','0745231208','O+','/',89,182,0);
/*!40000 ALTER TABLE `membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membres_a_abonnements`
--

DROP TABLE IF EXISTS `membres_a_abonnements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membres_a_abonnements` (
  `id_abonnement` int unsigned NOT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_abonnement`,`id_membre`),
  KEY `fk_membres_has_abonnements_abonnements1_idx` (`id_abonnement`),
  CONSTRAINT `fk_membres_has_abonnements_abonnements1` FOREIGN KEY (`id_abonnement`) REFERENCES `types_abonnements` (`id_abonnement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membres_a_abonnements`
--

LOCK TABLES `membres_a_abonnements` WRITE;
/*!40000 ALTER TABLE `membres_a_abonnements` DISABLE KEYS */;
/*!40000 ALTER TABLE `membres_a_abonnements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements_membres`
--

DROP TABLE IF EXISTS `paiements_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paiements_membres` (
  `id_paiement` int unsigned NOT NULL AUTO_INCREMENT,
  `id_abonnement` int unsigned NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `date_paiement` date NOT NULL,
  `date_debut_abonnement` date NOT NULL,
  `date_fin_abonnement` smallint unsigned NOT NULL,
  `points_restants` smallint unsigned NOT NULL,
  `methode_paiement` varchar(45) NOT NULL,
  `id_membre` varchar(45) NOT NULL,
  PRIMARY KEY (`id_paiement`,`id_abonnement`,`id_membre`),
  UNIQUE KEY `id_paiement_UNIQUE` (`id_paiement`),
  KEY `fk_paiements_membres_abonnements1_idx` (`id_abonnement`),
  CONSTRAINT `fk_paiements_membres_abonnements1` FOREIGN KEY (`id_abonnement`) REFERENCES `types_abonnements` (`id_abonnement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements_membres`
--

LOCK TABLES `paiements_membres` WRITE;
/*!40000 ALTER TABLE `paiements_membres` DISABLE KEYS */;
/*!40000 ALTER TABLE `paiements_membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salles`
--

DROP TABLE IF EXISTS `salles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salles` (
  `numero_salle` int unsigned NOT NULL,
  `capacite` int unsigned NOT NULL,
  `nom_salle` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`numero_salle`),
  UNIQUE KEY `numero_UNIQUE` (`numero_salle`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salles`
--

LOCK TABLES `salles` WRITE;
/*!40000 ALTER TABLE `salles` DISABLE KEYS */;
INSERT INTO `salles` VALUES (1,20,'Salle Judo'),(2,30,'Salle des sports de combat'),(3,25,'Stade de foot');
/*!40000 ALTER TABLE `salles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sports`
--

DROP TABLE IF EXISTS `sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sports` (
  `id_sport` int unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id_sport`),
  UNIQUE KEY `id_sport_UNIQUE` (`id_sport`),
  UNIQUE KEY `nom_UNIQUE` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sports`
--

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;
INSERT INTO `sports` VALUES (1,'Judo'),(2,'Kickboxing');
/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types_abonnements`
--

DROP TABLE IF EXISTS `types_abonnements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types_abonnements` (
  `id_abonnement` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(70) NOT NULL,
  `tarif` decimal(10,2) unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `nombre_points` smallint unsigned NOT NULL,
  PRIMARY KEY (`id_abonnement`),
  UNIQUE KEY `id_abonnement_UNIQUE` (`id_abonnement`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types_abonnements`
--

LOCK TABLES `types_abonnements` WRITE;
/*!40000 ALTER TABLE `types_abonnements` DISABLE KEYS */;
/*!40000 ALTER TABLE `types_abonnements` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-26 15:30:59
