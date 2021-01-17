CREATE DATABASE  IF NOT EXISTS `infile` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `infile`;
-- MariaDB dump 10.18  Distrib 10.5.8-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: infile
-- ------------------------------------------------------
-- Server version	10.5.8-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));

--
-- Table structure for table `alumno`
--

DROP TABLE IF EXISTS `alumno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `alumno` (
  `id_alumno` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genero` int(1) NOT NULL,
  `estado` int(1) NOT NULL,
  PRIMARY KEY (`id_alumno`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumno`
--

LOCK TABLES `alumno` WRITE;
/*!40000 ALTER TABLE `alumno` DISABLE KEYS */;
INSERT INTO `alumno` VALUES (1,'Marvin','Calderon',0,1),(2,'Juan','Perez',0,1),(3,'Jessica','Medina',1,1),(4,'Alex','Mendez',0,1),(5,'Pedro','Gonzalez',0,1),(6,'María','Mendez',1,1),(7,'Jacobo','Lepes',0,1),(8,'Jaime','Morales',0,1),(9,'Jazmin','Juarez',1,1),(10,'Lizbeth','Rodriguez',1,1),(11,'Marcos','Juarez',0,1),(12,'Ary','Medina',1,1);
/*!40000 ALTER TABLE `alumno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asignacion`
--

DROP TABLE IF EXISTS `asignacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asignacion` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `zona` float NOT NULL,
  `final` float NOT NULL,
  `estado` int(1) NOT NULL,
  `ref_id_alumno` int(11) NOT NULL,
  `ref_id_curso` int(11) NOT NULL,
  PRIMARY KEY (`id_asignacion`,`ref_id_alumno`,`ref_id_curso`),
  KEY `fk_asignacion_alumno1_idx` (`ref_id_alumno`),
  KEY `fk_asignacion_curso1_idx` (`ref_id_curso`),
  CONSTRAINT `fk_asignacion_alumno1` FOREIGN KEY (`ref_id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_asignacion_curso1` FOREIGN KEY (`ref_id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignacion`
--

LOCK TABLES `asignacion` WRITE;
/*!40000 ALTER TABLE `asignacion` DISABLE KEYS */;
INSERT INTO `asignacion` VALUES (1,65,25,1,1,1),(2,36,25,1,1,2),(3,50,25,1,1,3),(4,75,25,1,2,1),(5,36,15,1,2,2),(6,70,12,1,2,3),(7,56,15,1,3,1),(8,55,25,1,3,2),(9,62,15,1,3,3),(10,66,15,1,4,1),(11,40,12,1,4,2),(12,70,10,1,4,3),(13,66,25,1,5,1),(14,45,12,1,5,2),(15,66,25,1,5,3),(16,70,10,1,6,1),(17,43,22,1,6,2),(18,55,20,1,6,3),(19,75,25,1,7,1),(20,75,22,1,7,2),(21,55,25,1,7,3),(22,75,25,1,8,1),(23,45,12,1,8,2),(24,47,19,1,8,3),(25,66,15,1,9,1),(26,70,10,1,9,2),(27,66,10,1,9,3),(28,62,12,1,10,1),(29,45,15,1,10,2),(30,66,12,1,10,3),(31,65,15,1,11,1),(32,44,25,1,11,2),(33,60,11,1,11,3),(34,75,25,1,12,1),(35,36,10,1,12,2),(36,74,10,1,12,3);
/*!40000 ALTER TABLE `asignacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colegio`
--

DROP TABLE IF EXISTS `colegio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `colegio` (
  `id_colegio` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(320) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` char(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_colegio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colegio`
--

LOCK TABLES `colegio` WRITE;
/*!40000 ALTER TABLE `colegio` DISABLE KEYS */;
INSERT INTO `colegio` VALUES (1,'admin@infile.com','ADMIN','$2b$10$icJXzJK72CYiqfdBMrtv3uQD4pSN22cynrIxJ9XN0eYAghYdW/4yi'),(2,'demo1@gmail.com','DEMO1','$2b$10$PLOHb4s4CqF0nlrNb0dfgONkRwteaEu0nSEKtjeCpO.9ttg3S2Aye'),(3,'demo2@gmail.com','DEMO2','$2b$10$lvl6aTxJr7U1oHmVRxzNeOwhluhezqkL/j7dTnGjf92MqqfBDjAXO');
/*!40000 ALTER TABLE `colegio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` int(1) NOT NULL,
  PRIMARY KEY (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Matemática',1),(2,'Física',1),(3,'Química',1);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grado`
--

DROP TABLE IF EXISTS `grado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grado` (
  `id_grado` int(11) NOT NULL AUTO_INCREMENT,
  `grado` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` int(1) NOT NULL,
  PRIMARY KEY (`id_grado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grado`
--

LOCK TABLES `grado` WRITE;
/*!40000 ALTER TABLE `grado` DISABLE KEYS */;
INSERT INTO `grado` VALUES (1,'1ero. Primaria',1),(2,'2do. Primaria',1),(3,'3ero. Primaria',1);
/*!40000 ALTER TABLE `grado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matricula`
--

DROP TABLE IF EXISTS `matricula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matricula` (
  `id_matricula` int(11) NOT NULL AUTO_INCREMENT,
  `estado` int(1) NOT NULL,
  `ref_id_alumno` int(11) NOT NULL,
  `ref_id_grado` int(11) NOT NULL,
  PRIMARY KEY (`id_matricula`,`ref_id_alumno`,`ref_id_grado`),
  KEY `fk_matricula_alumno1_idx` (`ref_id_alumno`),
  KEY `fk_matricula_grado1_idx` (`ref_id_grado`),
  CONSTRAINT `fk_matricula_alumno1` FOREIGN KEY (`ref_id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_matricula_grado1` FOREIGN KEY (`ref_id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matricula`
--

LOCK TABLES `matricula` WRITE;
/*!40000 ALTER TABLE `matricula` DISABLE KEYS */;
INSERT INTO `matricula` VALUES (1,1,1,3),(2,1,2,1),(3,1,3,2),(4,1,4,3),(5,1,5,1),(6,1,6,2),(7,1,7,3),(8,1,8,1),(9,1,9,2),(10,1,10,3),(11,1,11,1),(12,1,12,2);
/*!40000 ALTER TABLE `matricula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro`
--

DROP TABLE IF EXISTS `registro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registro` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `estado` int(1) NOT NULL,
  `ref_id_colegio` int(11) NOT NULL,
  `ref_id_alumno` int(11) NOT NULL,
  PRIMARY KEY (`id_registro`,`ref_id_colegio`,`ref_id_alumno`),
  KEY `fk_registro_colegio_idx` (`ref_id_colegio`),
  KEY `fk_registro_alumno1_idx` (`ref_id_alumno`),
  CONSTRAINT `fk_registro_alumno1` FOREIGN KEY (`ref_id_alumno`) REFERENCES `alumno` (`id_alumno`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_registro_colegio` FOREIGN KEY (`ref_id_colegio`) REFERENCES `colegio` (`id_colegio`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro`
--

LOCK TABLES `registro` WRITE;
/*!40000 ALTER TABLE `registro` DISABLE KEYS */;
INSERT INTO `registro` VALUES (1,1,2,1),(2,1,2,2),(3,1,2,3),(4,1,3,4),(5,1,3,5),(6,1,3,6),(7,1,2,7),(8,1,2,8),(9,1,2,9),(10,1,3,10),(11,1,3,11),(12,1,3,12);
/*!40000 ALTER TABLE `registro` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-17 15:37:08
