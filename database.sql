CREATE DATABASE  IF NOT EXISTS `club_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
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
-- Table structure for table `absences_membres`
--

DROP TABLE IF EXISTS `absences_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `absences_membres` (
  `id_absence` int unsigned NOT NULL AUTO_INCREMENT,
  `id_groupe` int unsigned NOT NULL,
  `id_membre` int unsigned NOT NULL,
  `date` date NOT NULL,
  `justifiee` tinyint NOT NULL,
  `justification` varchar(255) DEFAULT NULL,
  `id_creneau` int unsigned NOT NULL,
  PRIMARY KEY (`id_absence`),
  UNIQUE KEY `id_absence_UNIQUE` (`id_absence`),
  KEY `fk_absences_membres_groupes1_idx` (`id_groupe`),
  KEY `fk_absences_membres_membres1_idx` (`id_membre`),
  KEY `fk_absences_membres_creneaux1_idx` (`id_creneau`),
  CONSTRAINT `fk_absences_membres_creneaux1` FOREIGN KEY (`id_creneau`) REFERENCES `creneaux` (`id_creneau`) ON DELETE CASCADE,
  CONSTRAINT `fk_absences_membres_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`) ON DELETE CASCADE,
  CONSTRAINT `fk_absences_membres_membres1` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id_membre`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `absences_membres`
--

LOCK TABLES `absences_membres` WRITE;
/*!40000 ALTER TABLE `absences_membres` DISABLE KEYS */;
INSERT INTO `absences_membres` VALUES (1,2,10,'2024-05-12',1,'Opération medicale',14),(2,2,10,'2024-05-17',0,'',14);
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
  `id_membre` int unsigned NOT NULL,
  PRIMARY KEY (`id_accomp`),
  UNIQUE KEY `id_accomp_UNIQUE` (`id_accomp`),
  KEY `fk_accomp_membres` (`id_membre`),
  CONSTRAINT `fk_accomp_membres` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id_membre`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accomplissements`
--

LOCK TABLES `accomplissements` WRITE;
/*!40000 ALTER TABLE `accomplissements` DISABLE KEYS */;
INSERT INTO `accomplissements` VALUES (10,'Coupe d\'algerie - 2022','2024-05-01','foot ball','Premiere place',10);
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
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `id_admin_UNIQUE` (`id_admin`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrateurs`
--

LOCK TABLES `administrateurs` WRITE;
/*!40000 ALTER TABLE `administrateurs` DISABLE KEYS */;
INSERT INTO `administrateurs` VALUES (1,'SOUALAH MOHAMMED','Zakaria','zaxy17','7215ee9c7d9dc229d2921a40e899ec5f','Administrateur'),(16,'ZEGHIMI','Zayd Aymen','zzaydou','a341c7080e9c303c1e885ba96e710730','Gestionnaire'),(18,'HEMIMED','Anis','h_anis','25f9e794323b453885f5181f1b624d0b','Gestionnaire'),(19,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(20,'SAHRAOUI','Ramy','ramy18','bc70904109e8f620e4b53c33eaf8b811','Gestionnaire'),(21,'LEHIDANE','Mohammed','m_lehidane','f1d9b0a5ac1ae1811b80ab6fde4f4396','Administrateur'),(28,'BOUKAKIOU','Rayan','bkrayan','25f9e794323b453885f5181f1b624d0b','Gestionnaire'),(30,'BETTAYEB','Yazid','yazidbet','25f9e794323b453885f5181f1b624d0b','Administrateur'),(32,'KOUDRI','Chemsedine','chemso17','b2220407b7e07a6abb7beac457bc679a','Gestionnaire'),(33,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(35,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(36,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(38,'KHALED','Adriane Anis','adralo','798547eb8831c98ae7474f328e3a57c4','Administrateur'),(39,'BETTAYEB','Yazid','yazidbet','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(40,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(41,'KHALED','Adriane Anis','adralow1','25f9e794323b453885f5181f1b624d0b','Administrateur'),(42,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(43,'KHALED','Adriane Anis','adralow','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(44,'BETTAYEB','Yazid','yazzzid','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(45,'BETTAYEB','BETTAYEB','yazidbet','798547eb8831c98ae7474f328e3a57c4','Gestionnaire'),(47,'KHALED','Adriane Anis','adralow11111111','798547eb8831c98ae7474f328e3a57c4','Administrateur'),(50,'boukakiou','rayan','bkrayano','25f9e794323b453885f5181f1b624d0b','Administrateur'),(51,'soualah mohammed','zakaria','zax','25f9e794323b453885f5181f1b624d0b','Administrateur'),(52,'soualah mohammed','zaky','zaxy19','25f9e794323b453885f5181f1b624d0b','Administrateur');
/*!40000 ALTER TABLE `administrateurs` ENABLE KEYS */;
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
  `id_membre` int unsigned NOT NULL,
  `id_creneau` int unsigned NOT NULL,
  `date_entree` datetime NOT NULL,
  `date_sortie` datetime DEFAULT NULL,
  PRIMARY KEY (`id_assiduite`),
  UNIQUE KEY `id_assiduite_UNIQUE` (`id_assiduite`),
  KEY `fk_assiduite_membres_groupes1_idx` (`id_groupe`),
  KEY `fk_assiduite_membres_membres1_idx` (`id_membre`),
  KEY `fk_assiduite_membres_creneaux1_idx` (`id_creneau`),
  CONSTRAINT `fk_assiduite_membres_creneaux1` FOREIGN KEY (`id_creneau`) REFERENCES `creneaux` (`id_creneau`) ON DELETE CASCADE,
  CONSTRAINT `fk_assiduite_membres_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`) ON DELETE CASCADE,
  CONSTRAINT `fk_assiduite_membres_membres1` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id_membre`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assiduite_membres`
--

LOCK TABLES `assiduite_membres` WRITE;
/*!40000 ALTER TABLE `assiduite_membres` DISABLE KEYS */;
INSERT INTO `assiduite_membres` VALUES (33,1,10,16,'2024-05-04 00:29:08','2024-05-04 00:29:25'),(34,1,10,16,'2024-05-04 15:06:39','2024-05-04 15:07:08'),(35,1,10,16,'2024-05-04 18:21:56','2024-05-04 18:23:06');
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
  `telephone` varchar(15) NOT NULL,
  `sexe` enum('Homme','Femme') NOT NULL,
  PRIMARY KEY (`id_coach`),
  UNIQUE KEY `id_coach_UNIQUE` (`id_coach`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coachs`
--

LOCK TABLES `coachs` WRITE;
/*!40000 ALTER TABLE `coachs` DISABLE KEYS */;
INSERT INTO `coachs` VALUES (20,'SOUALAH MOHAMMED2','Zakaria','zakaria@gmail.com','2000-05-12','0754326210','Homme'),(23,'Zaxy','Bus','','2000-02-02','0548653201','Homme'),(24,'Zaxy','Bus2','buszaxy@gmail.com','2024-05-02','0548653201','Femme');
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
  `numero_salle` int unsigned NOT NULL,
  `id_groupe` int unsigned NOT NULL,
  `titre` varchar(100) NOT NULL,
  `date_debut` datetime NOT NULL,
  `date_fin` datetime NOT NULL,
  `type` enum('Evenement','Seance') NOT NULL,
  `description` text,
  PRIMARY KEY (`id_creneau`),
  UNIQUE KEY `id_creneau_UNIQUE` (`id_creneau`),
  KEY `fk_creneaux_groupes1_idx` (`id_groupe`),
  KEY `fk_creneaux_salles1_idx` (`numero_salle`),
  CONSTRAINT `fk_creneaux_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`) ON DELETE CASCADE,
  CONSTRAINT `fk_creneaux_salles1` FOREIGN KEY (`numero_salle`) REFERENCES `salles` (`numero_salle`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creneaux`
--

LOCK TABLES `creneaux` WRITE;
/*!40000 ALTER TABLE `creneaux` DISABLE KEYS */;
INSERT INTO `creneaux` VALUES (14,2,2,'Seance Test','2024-05-15 17:00:00','2024-05-15 19:00:00','Seance','blabla'),(15,2,2,'Seance Test 2','2024-05-16 17:00:00','2024-05-16 19:00:00','Seance','blabla'),(16,2,1,'Test Creneau','2024-05-01 20:30:00','2024-05-10 20:30:00','Seance','test'),(17,2,1,'Test Un Creneau','2024-05-04 11:15:00','2024-05-04 12:15:00','Seance',NULL),(18,2,1,'Test Plusieurs Creneaux','2024-05-05 11:15:00','2024-05-05 13:15:00','Seance',NULL),(19,2,1,'Test Plusieurs Creneaux','2024-05-12 11:15:00','2024-05-12 13:15:00','Seance',NULL),(20,2,1,'Test Plusieurs Creneaux','2024-05-19 11:15:00','2024-05-19 13:15:00','Seance',NULL),(21,2,1,'Test Plusieurs Creneaux','2024-05-26 11:15:00','2024-05-26 13:15:00','Seance',NULL),(22,3,11,'Test Plusieurs Creneaux 2','2024-05-06 14:30:00','2024-05-06 16:30:00','Seance',NULL),(23,3,11,'Test Plusieurs Creneaux 2','2024-05-13 14:30:00','2024-05-13 16:30:00','Seance',NULL),(24,3,11,'Test Plusieurs Creneaux 2','2024-05-20 14:30:00','2024-05-20 16:30:00','Seance',NULL),(25,3,11,'Test Plusieurs Creneaux 2','2024-05-27 14:30:00','2024-05-27 16:30:00','Seance',NULL),(26,3,11,'Test creneau 3','2024-05-07 15:10:00','2024-05-07 18:10:00','Seance',NULL),(27,3,11,'Test creneau 3','2024-05-14 15:10:00','2024-05-14 18:10:00','Seance',NULL),(28,3,11,'Test creneau 3','2024-05-21 15:10:00','2024-05-21 18:10:00','Seance',NULL),(29,3,11,'Test creneau 3','2024-05-28 15:10:00','2024-05-28 18:10:00','Seance',NULL);
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
  PRIMARY KEY (`id_depense`),
  UNIQUE KEY `id_transaction_UNIQUE` (`id_depense`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depenses`
--

LOCK TABLES `depenses` WRITE;
/*!40000 ALTER TABLE `depenses` DISABLE KEYS */;
INSERT INTO `depenses` VALUES (3,'nouvelle table','categ1',5000.00,'2023-12-19',NULL),(4,'nouvelle chaise pour la caisse','categ2',10000.00,'2020-09-19',NULL),(5,'Test salle','categ3',2500.00,'2024-05-10',NULL),(6,'Test salle','categ4',5000.00,'2024-04-11',NULL);
/*!40000 ALTER TABLE `depenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipements`
--

DROP TABLE IF EXISTS `equipements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipements` (
  `id_equipement` int unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `quantite` int unsigned NOT NULL,
  `numero_salle` int unsigned NOT NULL,
  PRIMARY KEY (`id_equipement`),
  UNIQUE KEY `id_equipement_UNIQUE` (`id_equipement`),
  KEY `fk_equipements_salles1_idx` (`numero_salle`),
  CONSTRAINT `fk_equipements_salles1` FOREIGN KEY (`numero_salle`) REFERENCES `salles` (`numero_salle`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipements`
--

LOCK TABLES `equipements` WRITE;
/*!40000 ALTER TABLE `equipements` DISABLE KEYS */;
INSERT INTO `equipements` VALUES (22,'jxhiuvf',15,2),(25,'chaise',15,3);
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
  PRIMARY KEY (`id_groupe`),
  UNIQUE KEY `id_sport_UNIQUE` (`id_groupe`),
  KEY `fk_groupes_sports1_idx` (`id_sport`),
  CONSTRAINT `fk_groupes_sports1` FOREIGN KEY (`id_sport`) REFERENCES `sports` (`id_sport`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes`
--

LOCK TABLES `groupes` WRITE;
/*!40000 ALTER TABLE `groupes` DISABLE KEYS */;
INSERT INTO `groupes` VALUES (1,1,'Hommes'),(2,1,'Femmes'),(8,4,'U17'),(11,3,'-80kg'),(12,4,'U19');
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
  CONSTRAINT `fk_groupes_has_coaches_coaches1` FOREIGN KEY (`id_coach`) REFERENCES `coachs` (`id_coach`) ON DELETE CASCADE,
  CONSTRAINT `fk_groupes_has_coaches_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes_a_coachs`
--

LOCK TABLES `groupes_a_coachs` WRITE;
/*!40000 ALTER TABLE `groupes_a_coachs` DISABLE KEYS */;
INSERT INTO `groupes_a_coachs` VALUES (1,20),(2,20),(11,20),(12,20),(12,23),(1,24);
/*!40000 ALTER TABLE `groupes_a_coachs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupes_a_membres`
--

DROP TABLE IF EXISTS `groupes_a_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupes_a_membres` (
  `id_groupe` int unsigned NOT NULL,
  `id_membre` int unsigned NOT NULL,
  PRIMARY KEY (`id_groupe`,`id_membre`),
  KEY `fk_groupes_has_membres_groupes1_idx` (`id_groupe`),
  KEY `fk_groupes_has_membres_membres1` (`id_membre`),
  CONSTRAINT `fk_groupes_has_membres_groupes1` FOREIGN KEY (`id_groupe`) REFERENCES `groupes` (`id_groupe`) ON DELETE CASCADE,
  CONSTRAINT `fk_groupes_has_membres_membres1` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id_membre`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupes_a_membres`
--

LOCK TABLES `groupes_a_membres` WRITE;
/*!40000 ALTER TABLE `groupes_a_membres` DISABLE KEYS */;
INSERT INTO `groupes_a_membres` VALUES (2,10),(8,10),(11,10);
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
  `telephone` varchar(15) NOT NULL,
  `groupe_sanguin` varchar(20) NOT NULL,
  `maladies` varchar(255) NOT NULL,
  `poids` smallint unsigned NOT NULL,
  `taille` smallint unsigned NOT NULL,
  `supprime` tinyint NOT NULL,
  PRIMARY KEY (`id_membre`),
  UNIQUE KEY `id_membre_UNIQUE` (`id_membre`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membres`
--

LOCK TABLES `membres` WRITE;
/*!40000 ALTER TABLE `membres` DISABLE KEYS */;
INSERT INTO `membres` VALUES (10,'SOUALAH MOHAMMED','Zakaria','Homme','2004-12-08','2024-04-03','mz_soualahmohammed@esi.dz','0578219634','O+','/',70,179,0),(13,'ZEGHIMI','Zayd Aymen','Homme','2004-05-13','2024-05-03','mz_zeghimi@esi.dz','0578219634','O-','/',70,179,0);
/*!40000 ALTER TABLE `membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements_membres`
--

DROP TABLE IF EXISTS `paiements_membres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paiements_membres` (
  `id_paiement` int unsigned NOT NULL AUTO_INCREMENT,
  `id_membre` int unsigned NOT NULL,
  `montant_paye` decimal(10,2) NOT NULL,
  `montant_restant` decimal(10,2) NOT NULL,
  `date_paiement` date NOT NULL,
  `mois` varchar(45) NOT NULL,
  PRIMARY KEY (`id_paiement`),
  UNIQUE KEY `id_paiement_UNIQUE` (`id_paiement`),
  KEY `id_membre` (`id_membre`),
  CONSTRAINT `paiements_membres_ibfk_1` FOREIGN KEY (`id_membre`) REFERENCES `membres` (`id_membre`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements_membres`
--

LOCK TABLES `paiements_membres` WRITE;
/*!40000 ALTER TABLE `paiements_membres` DISABLE KEYS */;
INSERT INTO `paiements_membres` VALUES (21,10,2400.00,100.00,'2024-05-04','2024-07'),(29,10,2500.00,0.00,'2024-05-05','2024-04');
/*!40000 ALTER TABLE `paiements_membres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametres`
--

DROP TABLE IF EXISTS `parametres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametres` (
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `petites_tables` int unsigned NOT NULL,
  `grandes_tables` int unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametres`
--

LOCK TABLES `parametres` WRITE;
/*!40000 ALTER TABLE `parametres` DISABLE KEYS */;
INSERT INTO `parametres` VALUES ('ghackcourrier@gmail.com','azyq rfmp mkzi botf',8,5);
/*!40000 ALTER TABLE `parametres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salles`
--

DROP TABLE IF EXISTS `salles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salles` (
  `numero_salle` int unsigned NOT NULL AUTO_INCREMENT,
  `capacite` int unsigned NOT NULL,
  `nom_salle` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`numero_salle`),
  UNIQUE KEY `numero_UNIQUE` (`numero_salle`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salles`
--

LOCK TABLES `salles` WRITE;
/*!40000 ALTER TABLE `salles` DISABLE KEYS */;
INSERT INTO `salles` VALUES (2,20,'Salle Fitness'),(3,10,'Salle Kickboxing'),(7,22,'Stade de foot');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sports`
--

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;
INSERT INTO `sports` VALUES (1,'Crossfit'),(4,'Football'),(3,'Kickboxing');
/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-05 19:25:31
