-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: app_viajes
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `conductores`
--

DROP TABLE IF EXISTS `conductores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conductores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `licencia` varchar(50) NOT NULL,
  `fecha_vencimiento_licencia` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  KEY `idx_conductores_dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conductores`
--

LOCK TABLES `conductores` WRITE;
/*!40000 ALTER TABLE `conductores` DISABLE KEYS */;
INSERT INTO `conductores` VALUES (1,'Juan','Pérez','12345678','B1234567','2025-12-31'),(2,'María','González','87654321','B7654321','2026-06-15'),(3,'Carlos','López','11223344','B1122334','2025-09-30');
/*!40000 ALTER TABLE `conductores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Test1','test1@test.com','$2b$10$oZRzD9JLq1/QmL/coMhz2OeXjGnUZLxnygsyVxlbvBX4XeAZLxoii'),(2,'Test2','test2@test.com','test1234');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `patente` varchar(20) NOT NULL,
  `anio` int NOT NULL,
  `capacidad_carga` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patente` (`patente`),
  KEY `idx_vehiculos_patente` (`patente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (1,'Ford','Transit','ABC123',2020,1500.00),(2,'Mercedes-Benz','Sprinter','DEF456',2021,2000.00),(3,'Iveco','Daily','GHI789',2019,1800.00);
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `viajes`
--

DROP TABLE IF EXISTS `viajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `viajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehiculo_id` int NOT NULL,
  `conductor_id` int NOT NULL,
  `fecha_salida` datetime NOT NULL,
  `fecha_llegada` datetime DEFAULT NULL,
  `origen` varchar(255) NOT NULL,
  `destino` varchar(255) NOT NULL,
  `kilometros` decimal(10,2) NOT NULL,
  `observaciones` text,
  PRIMARY KEY (`id`),
  KEY `idx_viajes_vehiculo` (`vehiculo_id`),
  KEY `idx_viajes_conductor` (`conductor_id`),
  KEY `idx_viajes_fecha_salida` (`fecha_salida`),
  CONSTRAINT `viajes_ibfk_1` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `viajes_ibfk_2` FOREIGN KEY (`conductor_id`) REFERENCES `conductores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `viajes`
--

LOCK TABLES `viajes` WRITE;
/*!40000 ALTER TABLE `viajes` DISABLE KEYS */;
/*!40000 ALTER TABLE `viajes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14 19:54:58
