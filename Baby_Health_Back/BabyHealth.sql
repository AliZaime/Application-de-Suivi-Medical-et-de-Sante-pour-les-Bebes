-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: babyhealth.cu7ccyaao03a.us-east-1.rds.amazonaws.com    Database: Baby_Health
-- ------------------------------------------------------
-- Server version	8.0.40

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `advice`
--

DROP TABLE IF EXISTS `advice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `date` date NOT NULL,
  `image` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `advice_category_id_0ec59769_fk_category_id` (`category_id`),
  CONSTRAINT `advice_category_id_0ec59769_fk_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advice`
--

LOCK TABLES `advice` WRITE;
/*!40000 ALTER TABLE `advice` DISABLE KEYS */;
INSERT INTO `advice` VALUES (1,'Vaccine Calendar','The vaccine calendar is an essential guide for parents and caregivers to ensure that children receive timely vaccinations against preventable diseases. Following this schedule is critical for safeguarding a child’s health and promoting immunity. Early childhood is a time when children are particularly vulnerable to diseases such as measles, polio, and whooping cough. The vaccine calendar provides a clear timeline, typically starting at birth and continuing through early childhood, to ensure that children are protected at the right stages. Timely vaccination not only helps the child develop immunity, but it also protects those who may be unable to receive vaccines due to medical reasons through herd immunity. Parents should consult with pediatricians to stay on track and ensure that their children are receiving the appropriate vaccinations at the right time.','2025-06-02','VaccineCalendar.png',5),(2,'Babyproofing Home','Babyproofing a home is a vital task to create a safe environment for a growing infant or toddler. As babies begin to explore their surroundings, they encounter various hazards such as sharp edges, electrical outlets, and choking risks. Babyproofing involves removing or securing dangerous objects, installing safety gates, outlet covers, and furniture anchors, and making sure that hazardous substances, such as cleaning supplies and medications, are out of reach. A thorough babyproofing strategy goes beyond simply making the home child-safe; it also includes setting boundaries for areas that might pose a risk, like stairs or kitchens, and educating family members about maintaining these safety practices. This proactive approach helps minimize the likelihood of accidents, allowing children to explore and develop in a secure environment.','2025-06-02','BabyproofingHome.png',8),(3,'Avoiding Choking Hazards','Choking is a serious risk for infants and toddlers as they explore the world by putting objects in their mouths. Preventing choking hazards requires careful attention to the types of food, toys, and household items that a baby or toddler encounters. Food should be cut into small, manageable pieces, and certain foods, like whole grapes, nuts, and hard candies, should be avoided until children are old enough to chew them safely. Toys should be age-appropriate, with no small parts that could pose a choking risk. Parents should also learn infant CPR and recognize the signs of choking, which can include difficulty breathing and a change in skin color. Regularly inspecting toys and household items for loose parts can also prevent these dangerous situations from arising.','2025-06-02','AvoidingChokingHazards.png',8),(4,'Managing Night Wakings','Night wakings are a common concern for parents of young children. Whether it\'s a newborn needing frequent feedings or a toddler experiencing nightmares, managing these nocturnal interruptions is critical for both the child’s well-being and the parents\' rest. Establishing a bedtime routine, such as reading a book or offering a warm bath, can signal to the child that it\'s time for sleep. It’s also important to address the root cause of the wakefulness, whether it\'s hunger, discomfort, or fear, and respond with comforting techniques like gentle rocking or a soothing voice. Over time, as the child grows older, parents can gradually teach them to self-soothe, helping them sleep through the night without needing to wake up for reassurance. Consistent sleep patterns and a calming environment can significantly reduce disruptions during the night.','2025-06-02','ManagingNightWakings.png',2),(5,'Motor Skill Development','Motor skill development is a crucial aspect of a baby’s growth and involves the development of both fine and gross motor skills. Fine motor skills include tasks like grasping small objects, picking up toys, and feeding themselves, while gross motor skills involve larger movements like crawling, walking, and running. Babies begin developing motor skills from the moment they are born, starting with simple movements like reaching and kicking, and progressing to more complex actions such as sitting up, crawling, and eventually walking. Encouraging motor development involves offering age-appropriate toys, providing ample floor time for crawling, and engaging in activities that help strengthen muscles, such as tummy time. Each milestone in motor skill development marks a step toward independence, helping babies interact with their environment more effectively.','2025-06-02','MotorSkillDevelopment.png',4),(6,'Car Seat Safety','Car seat safety is an essential consideration for every parent to ensure the protection of their baby while traveling. Infants and toddlers are especially vulnerable in a car crash, which is why proper car seat use can make a significant difference in minimizing injury. The car seat should always be appropriate for the baby’s age, weight, and height, and parents should ensure the seat is installed correctly, following the manufacturer’s instructions or seeking professional help if needed. Infants should be placed in rear-facing car seats until they are at least two years old, as this position offers the best protection for their neck and spine in the event of an accident. The harness should be snug, and parents should avoid placing bulky clothing under the straps, as it can compromise the car seat’s effectiveness. Car seat safety is one of the most critical aspects of babyproofing a home and travel safety.','2025-06-02','CarSeatSafety.png',8),(10,'Diaper Rash Prevention','Diaper rash is a common condition that causes redness and irritation on a baby’s skin, often in areas covered by the diaper. Preventing diaper rash involves regular diaper changes to avoid prolonged exposure to moisture, as well as using a barrier cream or ointment to protect the skin. It’s also important to clean the baby’s skin gently with water and mild soap during diaper changes, avoiding wipes with alcohol or fragrances that can irritate the skin. Allowing the baby’s skin to air-dry and giving it a break from the diaper when possible can also help prevent irritation. If a diaper rash occurs, applying a zinc oxide-based cream and ensuring the baby’s skin remains clean and dry is crucial for healing.','2025-06-02','DiaperRashPrevention.png',3),(15,'When to See a Pediatrician','Knowing when to see a pediatrician is an essential aspect of keeping your baby healthy. While some symptoms can be managed at home, certain signs may indicate a more serious issue that requires professional care. Parents should consult a pediatrician if their baby has a high fever, is experiencing difficulty breathing, has a significant change in behavior or eating habits, or is not meeting developmental milestones. Rashes, persistent vomiting, and signs of dehydration are other reasons to seek medical advice. Regular well-child visits are also important for tracking growth and development and ensuring the baby is up to date on vaccinations. By keeping open communication with a pediatrician and knowing when to seek medical care, parents can ensure their child receives timely treatment when necessary.','2025-06-02','WhentoSeeaPediatrician.png',6),(17,'Postpartum Self-Care','Postpartum self-care is critical for a new mother’s recovery after childbirth. While the focus often shifts to caring for the baby, it is equally important for the mother to take care of her own physical and emotional needs. After childbirth, a woman’s body goes through significant changes, including hormonal shifts, physical recovery from labor, and the demands of breastfeeding. Adequate rest, staying hydrated, and eating a nutritious diet can help restore energy levels. It’s also essential for mothers to allow themselves time for self-care, whether through relaxation, engaging in hobbies, or seeking support from family and friends. Emotional well-being is just as important, so seeking help for postpartum depression, if necessary, should not be overlooked. By focusing on self-care, mothers can better manage the demands of new motherhood.','2025-06-02','PostpartumSelf-Care.png',7),(18,'Tummy Time Benefits','Tummy time is a crucial activity for infants to build strength and motor skills. This activity involves placing a baby on their stomach while they are awake, allowing them to lift their head, strengthen their neck muscles, and begin developing coordination. Tummy time helps prevent flat spots from developing on the back of the baby’s head and encourages the development of the upper body muscles necessary for sitting up, crawling, and eventually walking. Starting tummy time early and incorporating it into a daily routine is essential, as it helps babies develop the necessary strength to explore the world around them. As babies become more accustomed to tummy time, they will gradually increase their tolerance, gaining strength and independence.','2025-06-02','TummyTimeBenefits.png',4),(19,'Tracking Milestones','Tracking milestones is a key part of monitoring a baby’s development. From the first smile to the first steps, milestones indicate progress in areas such as motor skills, communication, social interaction, and cognitive development. It’s important for parents to be aware of these milestones, as they provide valuable insights into a child’s overall development and may highlight any concerns or delays. While all babies develop at their own pace, tracking milestones helps parents celebrate achievements and identify areas where extra support might be needed. Pediatricians typically use developmental checklists to track progress, and early intervention can make a significant difference in supporting children who may be facing developmental challenges.','2025-06-02','TrackingMilestones.png',4),(21,'Managing Fever','Managing fever in babies can be challenging for parents, but it is a natural response to infection. A fever itself is not usually dangerous but can make a baby uncomfortable. It is important to monitor the baby’s temperature regularly and provide fluids to keep them hydrated. If the fever is mild, offering comfort through rest and light clothing can help. However, if the fever exceeds a certain threshold or is accompanied by other symptoms such as difficulty breathing, persistent crying, or a rash, seeking medical attention is essential. Parents should never give aspirin to a baby due to the risk of Reye’s syndrome and should consult with a pediatrician for the appropriate treatment. Fever management requires careful attention to ensure that the baby stays safe and comfortable.','2025-06-02','ManagingFever.png',6),(23,'Colic Relief Tips','Colic is a common yet distressing condition in babies, causing excessive crying and fussiness, often in the late afternoon or evening. Although colic usually resolves on its own, there are several strategies parents can use to help soothe their baby. Holding the baby in an upright position during and after feedings can help alleviate discomfort from gas and reflux. Gentle rocking or using a baby swing can provide comfort and distraction. Swaddling, playing soothing sounds, or offering a pacifier can also calm a baby. While colic can be tough for parents, it’s important to remember that it’s a phase that will pass. However, if crying becomes extreme or is accompanied by other concerning symptoms, it’s crucial to consult a pediatrician.','2025-06-02','ColicReliefTips.png',6),(26,'Create a Bedtime Routine','A consistent bedtime routine is essential for helping babies and toddlers develop healthy sleep habits. A routine signals to the child that it is time to wind down and prepare for sleep. Activities might include a warm bath, a calming story, or gentle music. It’s important to create a predictable and calming environment that helps the baby feel secure and relaxed. The routine should be gentle and consistent, as a relaxed approach to bedtime fosters positive associations with sleep. By sticking to a routine, parents help their child establish a sense of comfort and predictability, making bedtime less stressful for both the child and the parents.','2025-06-02','CreateaBedtimeRoutine.png',2),(27,'Burping Techniques','Burping is an important step after feeding to release the air swallowed during eating. This air can cause discomfort, leading to fussiness or even spitting up. Parents should gently hold their baby in an upright position and softly pat or rub their back to help release the air. Some babies may need to be burped more than once during a feeding, especially if they are prone to swallowing air. There are various techniques, including the over-the-shoulder method, sitting on the parent’s lap, or laying the baby across the parent’s knee. By incorporating burping into feeding routines, parents can help their baby feel more comfortable and reduce the chances of post-feeding discomfort.','2025-06-02','BurpingTechniques.png',1),(30,'Safe Sleep Practices','Safe sleep practices are crucial for preventing sudden infant death syndrome (SIDS) and ensuring that babies sleep safely and soundly. Babies should always sleep on their backs, on a firm mattress with no soft bedding, pillows, or stuffed animals, to reduce the risk of suffocation. The baby’s crib should be free from hazards, and the baby should sleep in the same room as the parents but in their own crib for the first six months. Keeping the room at a comfortable temperature and avoiding overheating also contributes to a safe sleep environment. Parents should avoid co-sleeping on the same surface as the baby, as this increases the risk of accidental suffocation. Safe sleep practices are a critical component of infant care.','2025-06-02','SafeSleepPractices.png',2),(31,'Signs Baby is Full','Recognizing when a baby is full is important to avoid overfeeding and to ensure the baby is getting the right amount of nourishment. Signs that a baby is full include turning away from the breast or bottle, slowing down their sucking, or becoming relaxed and content. In some cases, babies might fall asleep during feeding, signaling that they have had enough. It’s important for parents to follow the baby’s cues and avoid pressuring them to finish the bottle or continue nursing when they are not interested. Overfeeding can lead to discomfort, while responsive feeding ensures that the baby’s nutritional needs are met without overindulgence.','2025-06-02','SignsBabyisFull.png',1),(32,'Partner Support','Partner support is critical for new parents navigating the challenges of raising a baby. Shared responsibilities between partners help alleviate the stress and exhaustion that often accompany new parenthood. This support can range from helping with nighttime feedings and diaper changes to offering emotional encouragement and practical assistance. Effective communication between partners is key to maintaining a balanced and supportive relationship. A strong partnership allows both parents to feel more confident in their parenting roles and ensures that both have the opportunity to rest and recharge. It also provides an important model for children as they learn about teamwork and relationships.','2025-06-02','PartnerSupport.png',7),(40,'Cleaning Baby Bottles','Cleaning baby bottles thoroughly is an essential part of ensuring that babies are feeding in a safe and hygienic environment. Bottles should be washed immediately after each use, using warm water and baby-safe soap. It’s important to disassemble the bottles, cleaning all parts, including the nipples, caps, and bottles themselves, to remove any leftover milk or formula. Boiling water or using a bottle sterilizer can provide additional protection by eliminating bacteria. Proper cleaning also prevents the build-up of mold or residue, which can cause health issues for the baby. Maintaining a clean and sanitized feeding set is one of the most important steps in caring for an infant.','2025-06-02','CleaningBabyBottles.png',3),(43,'Managing Sleep Deprivation','Managing sleep deprivation is one of the biggest challenges for new parents. Sleep deprivation can lead to fatigue, irritability, and difficulty concentrating, impacting both physical and mental health. To manage this, parents can consider taking turns with their partner for nighttime duties, allowing each parent to get some uninterrupted rest. Napping during the day when the baby sleeps can help mitigate the lack of nighttime sleep. Creating a calm and dark sleep environment, limiting caffeine intake, and practicing relaxation techniques before bed can also improve sleep quality. While it’s inevitable that parents will experience sleepless nights, prioritizing sleep when possible can help maintain overall well-being.','2025-06-02','ManagingSleepDeprivation.png',7),(50,'Why Vaccines Matter','Vaccines play a critical role in protecting the health of both individuals and communities. They prevent the spread of contagious diseases by enabling the body to develop immunity without causing illness. Vaccines are proven to save lives by protecting against diseases like polio, measles, and diphtheria, which can have serious, long-term consequences. In addition to individual protection, vaccines contribute to herd immunity, which protects those who cannot be vaccinated, such as infants or people with compromised immune systems. Following the recommended vaccine schedule ensures that children develop the immunity they need to stay healthy and prevents outbreaks of preventable diseases.','2025-06-02','WhyVaccinesMatter.png',5),(69,'Post-vaccine Reactions','Post-vaccine reactions are generally mild and temporary, though they can sometimes cause concern for parents. These reactions may include redness at the injection site, mild fever, or irritability. These reactions are typically signs that the body is building immunity, and they usually resolve within a few days. In rare cases, a more severe reaction may occur, but these are typically short-lived and can be managed with medical care. Parents should follow the guidance of their pediatrician for any specific post-vaccine care instructions. Vaccines are one of the most effective tools in safeguarding children from serious diseases, and any mild side effects are far outweighed by the long-term benefits of vaccination.','2025-06-02','Post-vaccineReactions.png',5),(74,'Bathing Basics','Bathing basics for infants focus on creating a gentle, safe, and comfortable experience for the baby. Babies should not be bathed in a full bath until their umbilical cord stump has fallen off and healed, which usually occurs after a few weeks. Until then, parents can give the baby a sponge bath using a soft cloth or sponge. It’s important to use lukewarm water, ensuring that the room is warm to avoid the baby getting cold. Only mild, baby-safe soap should be used, as babies’ skin is sensitive. Parents should support the baby’s head and neck while bathing, and take care to gently cleanse the baby’s body without scrubbing too hard. The goal is to create a relaxing and secure environment for both the baby and the parent.','2025-06-02','BathingBasics.png',3),(75,'Breastfeeding Latch Tips','A proper breastfeeding latch is essential for both the baby’s nourishment and the mother’s comfort. A good latch ensures that the baby can effectively transfer milk and avoids painful issues like nipple soreness or engorgement for the mother. To achieve a proper latch, the baby should have the entire nipple and most of the areola in their mouth, not just the tip of the nipple. The baby’s mouth should be open wide before latching, and the lips should be flanged outwards, creating a good seal. If a mother feels pain or discomfort while breastfeeding, it\'s a sign that the latch may need adjustment. Parents may want to consult with a lactation consultant to ensure that both mother and baby are positioned correctly for successful breastfeeding.','2025-06-02','BreastfeedingLatchTips.png',1);
/*!40000 ALTER TABLE `advice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `time` datetime(6) NOT NULL,
  `value` varchar(255) NOT NULL,
  `place` varchar(255) NOT NULL,
  `parent_id` int NOT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `appointment_parent_id_7ee46da8_fk_parent_parent_id` (`parent_id`),
  CONSTRAINT `appointment_parent_id_7ee46da8_fk_parent_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (8,'2025-06-12 16:00:00.000000','Soutenance PFA','Esisa',5),(11,'2025-08-10 07:15:00.000000','Mon anniv','Rabat',1),(12,'2025-05-31 19:37:00.000000','Faris','fes',3),(13,'2025-05-31 19:37:00.000000','Ggg','gggg',3),(14,'2025-06-04 04:43:00.000000','Kekek','fes',4),(16,'2025-06-04 04:43:00.000000','Kekek','fes',4),(17,'2025-06-06 11:50:00.000000','Test de notification','Alten',5),(18,'2025-06-12 10:50:00.000000','Rendez vous chez le pediatre','Pédiatrie Esisa',8),(19,'2025-06-14 11:30:00.000000','vaccin anti rougeole','x',1),(20,'2025-06-12 15:28:00.000000','Vaccin grippe','Pediatre',9),(21,'2025-06-14 08:30:00.000000','Rendez vous chez le prediatre','Pediatre',9),(22,'2025-06-13 20:08:00.000000','Desc 1','Lieu 1',3);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add parent',7,'add_parent'),(26,'Can change parent',7,'change_parent'),(27,'Can delete parent',7,'delete_parent'),(28,'Can view parent',7,'view_parent'),(29,'Can add baby',8,'add_baby'),(30,'Can change baby',8,'change_baby'),(31,'Can delete baby',8,'delete_baby'),(32,'Can view baby',8,'view_baby'),(33,'Can add baby tracking',9,'add_babytracking'),(34,'Can change baby tracking',9,'change_babytracking'),(35,'Can delete baby tracking',9,'delete_babytracking'),(36,'Can view baby tracking',9,'view_babytracking'),(37,'Can add appointment',10,'add_appointment'),(38,'Can change appointment',10,'change_appointment'),(39,'Can delete appointment',10,'delete_appointment'),(40,'Can view appointment',10,'view_appointment'),(41,'Can add biberon',11,'add_biberon'),(42,'Can change biberon',11,'change_biberon'),(43,'Can delete biberon',11,'delete_biberon'),(44,'Can view biberon',11,'view_biberon'),(45,'Can add solides',12,'add_solides'),(46,'Can change solides',12,'change_solides'),(47,'Can delete solides',12,'delete_solides'),(48,'Can view solides',12,'view_solides'),(49,'Can add sommeil',13,'add_sommeil'),(50,'Can change sommeil',13,'change_sommeil'),(51,'Can delete sommeil',13,'delete_sommeil'),(52,'Can view sommeil',13,'view_sommeil'),(53,'Can add couche',14,'add_couche'),(54,'Can change couche',14,'change_couche'),(55,'Can delete couche',14,'delete_couche'),(56,'Can view couche',14,'view_couche'),(57,'Can add tetee',15,'add_tetee'),(58,'Can change tetee',15,'change_tetee'),(59,'Can delete tetee',15,'delete_tetee'),(60,'Can view tetee',15,'view_tetee'),(61,'Can add advice',16,'add_advice'),(62,'Can change advice',16,'change_advice'),(63,'Can delete advice',16,'delete_advice'),(64,'Can view advice',16,'view_advice'),(65,'Can add category',17,'add_category'),(66,'Can change category',17,'change_category'),(67,'Can delete category',17,'delete_category'),(68,'Can view category',17,'view_category'),(69,'Can add temperature',18,'add_temperature'),(70,'Can change temperature',18,'change_temperature'),(71,'Can delete temperature',18,'delete_temperature'),(72,'Can view temperature',18,'view_temperature'),(73,'Can add medicament',19,'add_medicament'),(74,'Can change medicament',19,'change_medicament'),(75,'Can delete medicament',19,'delete_medicament'),(76,'Can view medicament',19,'view_medicament'),(77,'Can add symptome',20,'add_symptome'),(78,'Can change symptome',20,'change_symptome'),(79,'Can delete symptome',20,'delete_symptome'),(80,'Can view symptome',20,'view_symptome'),(81,'Can add cry detection',21,'add_crydetection'),(82,'Can change cry detection',21,'change_crydetection'),(83,'Can delete cry detection',21,'delete_crydetection'),(84,'Can view cry detection',21,'view_crydetection'),(85,'Can add vaccination',22,'add_vaccination'),(86,'Can change vaccination',22,'change_vaccination'),(87,'Can delete vaccination',22,'delete_vaccination'),(88,'Can view vaccination',22,'view_vaccination'),(89,'Can add note',23,'add_note'),(90,'Can change note',23,'change_note'),(91,'Can delete note',23,'delete_note'),(92,'Can view note',23,'view_note');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baby_profile`
--

DROP TABLE IF EXISTS `baby_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baby_profile` (
  `baby_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `blood_type` varchar(255) NOT NULL,
  `profile_picture` varchar(255) NOT NULL,
  `parent_id` int NOT NULL,
  PRIMARY KEY (`baby_id`),
  KEY `baby_profile_parent_id_2b74a7e8_fk_parent_parent_id` (`parent_id`),
  CONSTRAINT `baby_profile_parent_id_2b74a7e8_fk_parent_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baby_profile`
--

LOCK TABLES `baby_profile` WRITE;
/*!40000 ALTER TABLE `baby_profile` DISABLE KEYS */;
INSERT INTO `baby_profile` VALUES (1,'dexter','2004-10-08','homme','A+','test',1),(2,'laguerta','2024-12-24','Girl','O-','x',2),(5,'Khatouf mohamed','2025-01-01','Boy','A+','aaa',4),(6,'Elizabeth','2023-05-10','fille','A+','sofia.jpg',4),(7,'Hamza Rais','2004-04-22','Homme','O+','picture',5),(13,'Mohamed Amine Khatouf','2004-06-05','Garçon','O+','Photo',7),(14,'Faris mohammed','2004-06-05','Fille','O+','Photo',7),(15,'lazy','2025-06-05','Fille','AB+','ee',4),(17,'Amine Khatouf','2025-06-06','Garçon','O+','Photo',5),(18,'Zhhe','2025-06-06','Garçon','AB+','Nds',5),(19,'Faris mohammed','2024-07-16','Fille','O+','Url',5),(20,'Mon Bébé 1','2023-06-11','Garçon','O+','Url',8),(21,'Mon Bébé 2','2023-06-11','Fille','O+','Url',8),(22,'Mon Bébé 1','2023-06-12','Garçon','O+','Url',9),(23,'Mon Bébé 2','2023-06-12','Fille','O+','Url',9),(24,'Salma','2024-08-08','Fille','B+','Photo',3),(25,'Mohamed','2025-06-13','Garçon','AB+','Photo',3);
/*!40000 ALTER TABLE `baby_profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `baby_tracking`
--

DROP TABLE IF EXISTS `baby_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baby_tracking` (
  `tracking_id` int NOT NULL AUTO_INCREMENT,
  `weight` double NOT NULL,
  `height` double NOT NULL,
  `head_circumference` double NOT NULL,
  `date_recorded` date NOT NULL,
  `note` longtext,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`tracking_id`),
  KEY `baby_tracking_baby_id_a867a1c2_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `baby_tracking_baby_id_a867a1c2_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baby_tracking`
--

LOCK TABLES `baby_tracking` WRITE;
/*!40000 ALTER TABLE `baby_tracking` DISABLE KEYS */;
INSERT INTO `baby_tracking` VALUES (1,6.5,62,41,'2025-05-15','Bonne croissance observée',1),(2,6.8,63.5,42,'2025-05-22','Petite poussée de croissance',1),(3,7.1,65,43,'2025-05-27','Mesures régulières',1),(5,8.5,75,47,'2025-05-28','cette mesure est effectuer à la fin du deuxième mois',1),(6,10,83,49,'2025-05-28','cette mesure le troisième mois mais une messure du pédiatre',1),(7,11,90,50,'2025-05-28','4 ème mois après allaitement',1),(8,11,92.4,60,'2025-05-28','6ème mois',1),(10,6.5,62,41,'2025-05-15','Bonne croissance observée',1),(11,6.8,63.5,42,'2025-05-22','Petite poussée de croissance',1),(12,7.1,65,43,'2025-05-27','Mesures régulières',1),(14,5.5,42.6,35,'2025-06-17','première mesure après naissance',2),(15,11.7,82,50,'2025-05-31','un test de l\'app',1),(18,20,50,50,'2022-02-02','Shs',5),(21,6.5,70,30,'2025-06-09','',7),(22,15,95,67,'2025-06-10','allo',1),(23,6.5,90,30,'2025-06-10','',7),(24,6.5,100,25,'2025-06-10','',7),(25,35,120,30,'2025-06-11','',20),(26,32,97,68,'2025-06-12','capture',1),(27,25,120,25,'2025-06-12','',22),(28,15,125,20,'2025-07-19','',22),(29,5,10,45,'2025-03-13','Note 1',24),(30,10,20,50,'2025-06-13','Note 2',24);
/*!40000 ALTER TABLE `baby_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `biberon`
--

DROP TABLE IF EXISTS `biberon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biberon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantite` int NOT NULL,
  `date` date NOT NULL,
  `heure` time(6) NOT NULL,
  `source` varchar(20) NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `biberon_baby_id_e2572748_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `biberon_baby_id_e2572748_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biberon`
--

LOCK TABLES `biberon` WRITE;
/*!40000 ALTER TABLE `biberon` DISABLE KEYS */;
INSERT INTO `biberon` VALUES (2,50,'2025-06-01','02:57:00.000000','sein','ee',5),(3,500,'2025-06-11','22:40:00.000000','lait_artificiel','',20),(4,250,'2025-06-12','14:18:00.000000','lait_artificiel','',22),(5,250,'2025-06-12','16:18:00.000000','sein','',22),(6,300,'2025-06-12','19:18:00.000000','lait_artificiel','',22),(7,20,'2025-06-12','19:14:00.000000','sein','Remarque 1',24),(8,10,'2025-06-12','19:15:00.000000','lait_artificiel','Remarque 2',24),(9,45,'2025-06-13','19:15:00.000000','sein','Remarque 3',24),(10,150,'2025-06-13','19:48:00.000000','sein','',25);
/*!40000 ALTER TABLE `biberon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Feeding','Feeding your baby is not just about nutrition; it’s a bonding experience that fosters emotional connection and trust. Recognize cues that your baby is hungry—rooting, sucking on hands, or fussiness—and respond promptly to build a sense of security. During breastfeeding, ensure a proper latch to avoid nipple soreness and optimize milk intake. If bottle feeding, maintain eye contact and hold your baby upright to reduce the risk of ear infections. Always burp your baby after feeds to release any trapped air. Over time, you’ll learn your baby’s rhythm and preferences—trust your instincts and consult a pediatric nutritionist for guidance if needed.'),(2,'Sleep','Healthy sleep is essential for your baby’s growth and development. Establishing a predictable bedtime routine—including a warm bath, a lullaby, or gentle rocking—signals to your baby that it\'s time to wind down. Make sure the sleep environment is dark, cool, and quiet. Use a firm mattress without pillows or loose bedding to reduce the risk of SIDS. Newborns may wake frequently, but consistency helps them learn day-night patterns. Resist the urge to pick your baby up at every sound; instead, wait a moment to see if they self-soothe. If sleep troubles persist, consider sleep training methods appropriate for their age and temperament.'),(3,'Hygiene','Maintaining good hygiene for your baby is crucial to prevent infections and skin issues. Bathe your baby 2–3 times a week or more if needed due to sweat or diaper messes, using lukewarm water and gentle, fragrance-free baby soap. Pay special attention to creases under the neck, behind the ears, and in skin folds where moisture can accumulate. Always keep the umbilical cord area clean and dry until it naturally falls off. Use clean washcloths and avoid harsh scrubbing. For diaper changes, clean from front to back and apply a barrier cream to protect against rash. Sterilize bottles and pacifiers regularly, especially in the first months.'),(4,'Growth','Your baby\'s physical and cognitive development unfolds rapidly in the first year. Every month brings new milestones—lifting the head, rolling over, babbling, or first steps. Tummy time is essential to strengthen neck and core muscles, prevent flat spots, and prepare for crawling. Encourage interaction with toys, sounds, and facial expressions to stimulate learning and emotional bonding. Track progress, but don’t panic over slight delays—each child develops at their own pace. However, consult your pediatrician if milestones are significantly delayed or if you notice signs such as lack of eye contact, limited movement, or no response to sounds.'),(5,'Vaccination','Vaccination is a cornerstone of public health and a critical part of infant care. Following your country’s immunization schedule helps protect your child against life-threatening diseases such as measles, polio, and whooping cough. Vaccines are rigorously tested for safety and efficacy. Mild side effects such as low-grade fever or soreness at the injection site are common and usually harmless. Keep a vaccination record and bring it to every doctor visit. If your child misses a dose, consult your pediatrician about catch-up schedules. Vaccines not only protect your baby but also contribute to herd immunity, reducing the spread of contagious diseases in the community.'),(6,'Health','Understanding common health issues during infancy can help you respond appropriately and avoid unnecessary worry. Monitor your baby’s temperature regularly—fever above 38°C (100.4°F) in infants under three months warrants immediate medical attention. Watch for signs of colic, such as prolonged crying, clenched fists, and arched back. During teething, offer safe teething toys or chilled washcloths to soothe gum pain. Always observe changes in feeding habits, stool color, or skin tone. When in doubt, consult your pediatrician rather than relying on online forums or home remedies.'),(7,'Parental Tips','Taking care of a baby is emotionally rewarding but also physically and mentally demanding. It\'s essential for parents to prioritize self-care to prevent burnout. Accept help from family and friends, rest when the baby sleeps, and maintain open communication with your partner. Postpartum depression is real and treatable—don’t hesitate to seek professional support if you feel persistently overwhelmed or sad. Join parenting communities or support groups to share experiences and reduce isolation. Remember, there is no perfect parent—what matters most is being responsive, present, and loving. Trust your journey.'),(8,'Safety','Safety begins at home. Babyproofing your environment is a proactive step in preventing accidents. Install outlet covers, cabinet locks, and corner protectors. Never leave your baby unattended on a changing table or sofa. Use rear-facing car seats that meet current safety standards and always secure your baby properly. During sleep, place your baby on their back in a crib with a firm mattress and no loose items. Keep small objects, cords, and toxic substances out of reach. As your baby starts crawling and walking, anticipate new hazards and adjust your safety measures accordingly.');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `couche`
--

DROP TABLE IF EXISTS `couche`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `couche` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `cause` varchar(30) DEFAULT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `baby_id` (`baby_id`),
  CONSTRAINT `couche_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couche`
--

LOCK TABLES `couche` WRITE;
/*!40000 ALTER TABLE `couche` DISABLE KEYS */;
INSERT INTO `couche` VALUES (1,'urine','2025-05-30','07:35:00','Diarrhée','Rmq1',5),(3,'urine','2025-05-30','03:38:00','Liquide','Remarque',6),(6,'urine','2025-05-30','04:16:00','Normale','',5),(7,'urine','2025-05-30','04:17:00','Normale','',5),(8,'souillee','2025-05-30','04:17:00','Normale','',5),(9,'souillee','2025-05-31','00:26:00','Autre','Rmq3',5),(10,'mixte','2025-05-31','01:47:00','Constipation','',5),(11,'urine','2025-05-31','11:14:00','Diarrhée','',5),(13,'souillee','2025-05-30','05:28:00','Diarrhée','',5),(14,'mixte','2025-05-31','18:20:00','Normale','',7),(15,'mixte','2025-05-31','18:27:00','Molle','Khanza b7al moulaha',7),(23,'souillee','2025-06-01','16:36:00','Diarrhée','',7),(24,'mixte','2025-06-03','16:38:00','Diarrhée','khanza',7),(25,'mixte','2025-06-04','10:33:00','Normale','',7),(28,'souillee','2025-06-04','17:07:00','Normale','',5),(29,'mixte','2025-06-05','13:08:00','Diarrhée','Khanza',14),(32,'mixte','2025-06-11','22:39:00','Normale','',20),(33,'mixte','2025-06-12','14:16:00','Normale','',22),(34,'mixte','2025-06-12','16:16:00','Normale','',22),(35,'souillee','2025-06-12','19:17:00','Diarrhée','',22),(39,'urine','2025-06-14','19:20:00','Molle','Remarque 2',24),(40,'souillee','2025-06-14','19:35:00','Liquide','Remaque 3',24),(41,'mixte','2025-06-13','19:43:00','Normale','',25);
/*!40000 ALTER TABLE `couche` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cryDetection`
--

DROP TABLE IF EXISTS `cryDetection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cryDetection` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `confidence` double NOT NULL,
  `detected_at` datetime(6) NOT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cryDetection_baby_id_e81b2b59_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `cryDetection_baby_id_e81b2b59_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cryDetection`
--

LOCK TABLES `cryDetection` WRITE;
/*!40000 ALTER TABLE `cryDetection` DISABLE KEYS */;
INSERT INTO `cryDetection` VALUES (1,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:20:51.462905',7),(2,'Fatigue',0.46494024991989136,'2025-06-05 11:24:33.362404',7),(3,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:29:56.684708',7),(4,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:33:54.819066',7),(5,'Fatigue',0.46494024991989136,'2025-06-05 11:34:05.527402',7),(6,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:34:15.627566',7),(7,'Fatigue',0.46494024991989136,'2025-06-05 11:34:26.474112',7),(8,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:35:57.656654',7),(9,'Douleur au ventre',0.9842230677604675,'2025-06-05 11:59:52.403471',7),(10,'Fatigue',0.4649401903152466,'2025-06-05 12:25:36.544241',1),(11,'Fatigue',0.4649401903152466,'2025-06-05 12:25:51.618869',1),(12,'Douleur au ventre',0.9842230677604675,'2025-06-05 14:16:01.652889',7),(13,'Fatigue',0.46494024991989136,'2025-06-06 09:22:47.824713',7),(14,'Douleur au ventre',0.9842230677604675,'2025-06-06 09:26:30.160026',17),(15,'Douleur au ventre',0.9842230677604675,'2025-06-06 10:30:07.486376',7),(16,'Douleur au ventre',0.9842230677604675,'2025-06-06 11:42:05.907746',7),(17,'Douleur au ventre',0.9842230677604675,'2025-06-06 12:17:01.346577',7),(18,'Douleur au ventre',0.9842230677604675,'2025-06-09 11:34:52.159591',7),(19,'Douleur au ventre',0.9842230677604675,'2025-06-09 12:21:32.160078',7),(20,'Douleur au ventre',0.9842230677604675,'2025-06-09 13:18:29.425535',7),(21,'Douleur au ventre',0.9842230677604675,'2025-06-09 18:03:30.149540',7),(22,'Fatigue',0.4649401903152466,'2025-06-09 19:30:58.717508',1),(23,'Douleur au ventre',0.9842230677604675,'2025-06-09 19:34:25.738327',1),(24,'Fatigue',0.46494024991989136,'2025-06-10 09:19:23.352303',7),(25,'Fatigue',0.46494024991989136,'2025-06-10 09:22:01.805764',7),(26,'Douleur au ventre',0.9842230677604675,'2025-06-10 09:22:18.693749',7),(27,'Fatigue',0.46494024991989136,'2025-06-11 10:31:01.341211',19),(28,'Douleur au ventre',0.9842230677604675,'2025-06-11 12:03:27.475563',5),(29,'Douleur au ventre',0.9842230677604675,'2025-06-11 21:47:33.645186',20),(30,'Douleur au ventre',0.9842230677604675,'2025-06-11 22:13:21.997871',20),(31,'Fatigue',0.46494024991989136,'2025-06-11 23:09:27.567401',20),(32,'Douleur au ventre',0.9842230677604675,'2025-06-12 13:26:50.317167',22),(33,'Fatigue',0.46494024991989136,'2025-06-12 13:27:01.884831',22),(34,'Fatigue',0.4649403393268585,'2025-06-13 18:33:59.872855',24),(35,'Douleur au ventre',0.9842230677604675,'2025-06-13 18:34:14.925008',24),(36,'Fatigue',0.4649401903152466,'2025-06-13 20:54:51.327586',24),(37,'Faim',0.9681620597839355,'2025-06-24 13:41:01.246169',7),(38,'Douleur au ventre',0.9842230677604675,'2025-06-24 14:00:57.762184',7),(39,'Faim',0.9142931699752808,'2025-06-24 14:06:49.266764',19),(40,'Faim',0.9791190028190613,'2025-06-24 14:56:31.838594',19),(41,'Faim',0.9993962049484253,'2025-06-24 14:57:29.666214',19),(42,'Faim',0.9155211448669434,'2025-06-24 14:57:49.762666',19),(43,'Faim',0.9894166588783264,'2025-06-24 15:02:25.158419',19),(44,'Faim',0.9803095459938049,'2025-06-24 15:03:07.678812',19),(45,'Faim',0.9840037226676941,'2025-06-24 15:06:52.492329',18),(46,'Faim',0.9904927611351013,'2025-06-24 15:08:23.044563',18),(47,'Faim',0.9995902180671692,'2025-06-24 15:09:00.004279',18),(48,'Faim',0.9999982118606567,'2025-06-25 20:24:41.325989',17),(49,'Douleur au ventre',0.9842230677604675,'2025-06-27 00:18:01.779663',24),(50,'Faim',0.9964450001716614,'2025-06-27 12:57:51.949304',18),(51,'Fatigue',0.46494024991989136,'2025-06-27 12:59:20.114691',18),(52,'Faim',0.9921365976333618,'2025-06-27 13:02:44.217001',7),(53,'Faim',0.980455756187439,'2025-06-27 14:58:00.685879',19),(54,'Faim',0.9956867098808289,'2025-06-27 16:55:10.442872',24),(55,'Douleur au ventre',0.9842230677604675,'2025-06-27 18:04:42.186398',24),(56,'Faim',0.8722547292709351,'2025-06-27 18:05:12.802623',24),(57,'Faim',0.9256529808044434,'2025-06-28 10:19:05.108560',17),(58,'Faim',0.9422329664230347,'2025-06-28 10:26:07.312093',7),(59,'Fatigue',0.46494024991989136,'2025-06-28 10:26:27.994379',7),(60,'Fatigue',0.46494024991989136,'2025-06-28 10:33:22.533334',24),(61,'Faim',0.9994285702705383,'2025-06-28 10:33:47.538357',24),(62,'Fatigue',0.46494024991989136,'2025-06-28 10:45:02.007233',24),(63,'Faim',0.983343780040741,'2025-06-28 10:45:25.816341',24);
/*!40000 ALTER TABLE `cryDetection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(16,'userAPI','advice'),(10,'userAPI','appointment'),(8,'userAPI','baby'),(9,'userAPI','babytracking'),(11,'userAPI','biberon'),(17,'userAPI','category'),(14,'userAPI','couche'),(21,'userAPI','crydetection'),(19,'userAPI','medicament'),(23,'userAPI','note'),(7,'userAPI','parent'),(12,'userAPI','solides'),(13,'userAPI','sommeil'),(20,'userAPI','symptome'),(18,'userAPI','temperature'),(15,'userAPI','tetee'),(22,'userAPI','vaccination');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-05-25 11:11:39.796505'),(2,'auth','0001_initial','2025-05-25 11:11:43.576343'),(3,'admin','0001_initial','2025-05-25 11:11:44.498023'),(4,'admin','0002_logentry_remove_auto_add','2025-05-25 11:11:44.622919'),(5,'admin','0003_logentry_add_action_flag_choices','2025-05-25 11:11:44.756728'),(6,'contenttypes','0002_remove_content_type_name','2025-05-25 11:11:45.568574'),(7,'auth','0002_alter_permission_name_max_length','2025-05-25 11:11:45.911124'),(8,'auth','0003_alter_user_email_max_length','2025-05-25 11:11:46.183975'),(9,'auth','0004_alter_user_username_opts','2025-05-25 11:11:46.338359'),(10,'auth','0005_alter_user_last_login_null','2025-05-25 11:11:46.659130'),(11,'auth','0006_require_contenttypes_0002','2025-05-25 11:11:46.778384'),(12,'auth','0007_alter_validators_add_error_messages','2025-05-25 11:11:46.905482'),(13,'auth','0008_alter_user_username_max_length','2025-05-25 11:11:47.269962'),(14,'auth','0009_alter_user_last_name_max_length','2025-05-25 11:11:47.635514'),(15,'auth','0010_alter_group_name_max_length','2025-05-25 11:11:47.907118'),(16,'auth','0011_update_proxy_permissions','2025-05-25 11:11:48.373582'),(17,'auth','0012_alter_user_first_name_max_length','2025-05-25 11:11:48.700056'),(18,'sessions','0001_initial','2025-05-25 11:11:49.227984'),(19,'userAPI','0001_initial','2025-05-25 11:11:49.963553'),(20,'userAPI','0002_babytracking','2025-05-27 18:20:56.562152'),(21,'userAPI','0002_appointment','2025-05-29 00:31:42.235870'),(22,'userAPI','0003_remove_appointment_baby_parent_gender','2025-05-29 15:00:56.957617'),(23,'userAPI','0004_biberon','2025-06-01 00:55:07.708306'),(24,'userAPI','0005_solides','2025-06-01 14:12:34.903953'),(25,'userAPI','0006_sommeil','2025-06-02 00:32:43.199361'),(26,'userAPI','0004_couche_tetee','2025-06-02 15:29:05.326210'),(27,'userAPI','0005_category_advice','2025-06-02 15:29:18.648570'),(28,'userAPI','0007_parent_expo_token_babytracking_couche_tetee','2025-06-03 17:31:21.469002'),(29,'userAPI','0006_parent_expo_token_alter_tetee_remarque_and_more','2025-06-04 02:05:40.604636'),(30,'userAPI','0006_temperature','2025-06-04 02:10:39.909222'),(31,'userAPI','0007_medicament','2025-06-04 11:27:28.096659'),(32,'userAPI','0008_symptome','2025-06-05 10:22:07.408137'),(33,'userAPI','0009_update_symptome','2025-06-05 10:28:28.969506'),(34,'userAPI','0008_cryDetection','2025-06-05 10:33:56.111163'),(35,'userAPI','0010_update_symptom_id','2025-06-05 11:53:41.048419'),(36,'userAPI','0011_merge_0008_cryDetection_0010_update_symptom_id','2025-06-08 01:08:30.763148'),(37,'userAPI','0012_parent_expo_token_alter_medicament_dosage_and_more','2025-06-08 01:10:11.108208'),(38,'userAPI','0013_alter_vaccination_table','2025-06-08 01:19:16.346970'),(39,'userAPI','0014_alter_vaccination_table','2025-06-08 01:19:16.572989');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicament`
--

DROP TABLE IF EXISTS `medicament`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicament` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `heure` time(6) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medicament_baby_id_a878bdbf_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `medicament_baby_id_a878bdbf_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicament`
--

LOCK TABLES `medicament` WRITE;
/*!40000 ALTER TABLE `medicament` DISABLE KEYS */;
INSERT INTO `medicament` VALUES (3,'rtyrt','antalgique','14:09:00.000000','30','rzer',5),(5,'Doliprane','autre','13:08:00.000000','10','',14),(6,'Brufen','antalgique','13:09:00.000000','100','',14),(7,'Jehdh','vitamine','13:10:00.000000','899','',14),(8,'aaa','antibiotique','10:53:00.000000','22','',5),(9,'Doliprane','antibiotique','11:14:00.000000','10','',7),(11,'Bruffen','probiotique','11:28:00.000000','100','',7),(12,'Fdh','antalgique','11:30:00.000000','100','',7),(13,'Dolia un','antalgique','12:40:00.000000','40','Hsha',7),(14,'Gg','antalgique','17:55:00.000000','11','',7),(15,'doliprane','autre','21:30:00.000000','500','pour les maux de tête',1),(16,'Bb','antalgique','13:28:00.000000','16','',7),(17,'Rtt','antalgique','14:16:00.000000','1','',7),(19,'Doliprane','antalgique','22:44:00.000000','500','',20),(21,'Doliprane','antalgique','14:23:00.000000','250','',22),(22,'Codoliprane','antalgique','19:24:00.000000','250','',22),(23,'Vita C+','vitamine','20:24:00.000000','250','',22),(24,'Medicament 1','antalgique','19:21:00.000000','20','Remarque 1',24),(25,'Medicament 2','antibiotique','21:22:00.000000','30','Remarque 2',24),(26,'Medicament 3','vitamine','20:22:00.000000','20','Remarque 3',24);
/*!40000 ALTER TABLE `medicament` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `note`
--

DROP TABLE IF EXISTS `note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `note` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date_created` datetime NOT NULL,
  `parent_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `note_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`parent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `note`
--

LOCK TABLES `note` WRITE;
/*!40000 ALTER TABLE `note` DISABLE KEYS */;
INSERT INTO `note` VALUES (10,'Hhhe','Ddjdj','2025-06-11 11:51:05',4),(11,'Hhhe','Ddjdj','2025-06-11 11:51:06',4),(12,'Hhhe','Ddjdj','2025-06-11 11:51:07',4),(13,'Ldld','Soso','2025-06-11 11:51:19',4),(14,'Information sur la temperature','Je dois prendre la température de mon bébé chaque jour a 12:30','2025-06-11 21:53:26',8),(15,'Rappel 1','Mon Bébé et intolérant au gluten','2025-06-12 13:30:38',9),(16,'Rappel 2','Mon Bébé dois au moins faire une sieste de 45 min durant la journée','2025-06-12 13:31:12',9),(17,'Note 1','Contenu 1','2025-06-12 14:41:44',3),(18,'Note 2','Contenu 2','2025-06-13 18:41:52',3);
/*!40000 ALTER TABLE `note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent` (
  `parent_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(254) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `notification_preferences` json NOT NULL,
  `gender` varchar(255) NOT NULL,
  `expo_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`parent_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
INSERT INTO `parent` VALUES (1,'hamza rais','hmizourais557@gmail.com','0682330690','pbkdf2_sha256$720000$rrcntsxeaPdLuc8sxZULKg$tikNJN0bMKgwisw8TnehwjeC4/wsDeA1n8HNWpk5pJw=','\"sms\"','female','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXJlbnRfaWQiOjEsImV4cCI6MTc0OTA0NDIyMiwiaWF0IjoxNzQ4OTU3ODIyfQ.w8remGXQW0aW3GwOCP962vM_XZCuIHVad2ryUyMAVEE'),(2,'test','test576@gmail.com','0652349716','pbkdf2_sha256$720000$wkQEN9StDUnCAwzHlTFv9O$5aB0+zFk5blulVGZ5djDbklEC9sj1HsGmEgmuqasVlY=','\"email\"','',NULL),(3,'Mohammed Faris','m.faris@esisa.ac.ma','0619204645','pbkdf2_sha256$1000000$oFU7Ah5ACDzyZpzmB6knwd$OFhg0dfOv4kQH7LBpIqCMPPLBM4EH3T7GirbA8YMD2E=','\"email\"','homme',NULL),(4,'Khatouf Mohamed Amine','m.a.khatouf@gmail.com','066666666','pbkdf2_sha256$1000000$lawHRKR73pgo8T0JxvL2Jb$jVvuijqXZ24aConRKDMV2d6Mk4LlJoYI3AvrcZIoB+0=','\"email\"','female',NULL),(5,'Ali Zaime','alizaime2003@gmail.com','0667738593','pbkdf2_sha256$720000$4WJrAmb4Ma8jl3br7IrgRv$zkw+NNAyHVLTclGDfKtPwQfHHbw7v2eo/pzciSPnQGQ=','\"SMS\"','Not specified',NULL),(6,'test2','test1234@gmail.com','1234567890','pbkdf2_sha256$720000$KX7I0JFGr7nExaNsAzKIng$XEPvyfHsvoMPx3pIbkQMDxYRR3oDVVenifi+SRHoiC4=','\"sms\"','femme',NULL),(7,'Ali zaime','zaimmohamedali0@gmail.com','0667738593','pbkdf2_sha256$600000$MjRQ9sEisuUgQcHa7JVzPj$Mb6QHlxwZKCd930KQ3dWRSIP6fqWDrv/kBwTq0vourI=','\"email\"','homme',NULL),(8,'Ali Zaime','a.zaime2003@gmail.com','+212667738593','pbkdf2_sha256$600000$tXNwuvGX7aLiH9SmKvn0se$gkeBYvOWjK80WpZLYqt5NNkSeW6sRdrrCHkDmL8FIs8=','\"sms\"','homme',NULL),(9,'Test','test@esisa.ac.ma','+212667738593','pbkdf2_sha256$600000$yRsyPViDkECcleUsfFGnF9$39JzZQExtoD+0UBelvn1tMU0U5coEXcfzDyodaWVXGU=','\"sms\"','homme',NULL);
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solides`
--

DROP TABLE IF EXISTS `solides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `heure` time(6) NOT NULL,
  `quantite` int NOT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `solides_baby_id_172b91a6_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `solides_baby_id_172b91a6_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solides`
--

LOCK TABLES `solides` WRITE;
/*!40000 ALTER TABLE `solides` DISABLE KEYS */;
INSERT INTO `solides` VALUES (6,'cereales','2025-06-03','13:50:00.000000',500,5),(8,'fruit','2025-06-01','18:59:00.000000',200,5),(10,'fruit','2025-06-09','19:03:00.000000',100,1),(11,'fruit','2025-06-11','22:41:00.000000',150,20),(12,'fruit','2025-06-12','14:19:00.000000',100,22),(13,'legumes','2025-06-12','17:19:00.000000',250,22),(14,'proteines','2025-06-12','19:19:00.000000',100,22),(15,'fruit','2025-06-13','17:03:00.000000',10,22),(16,'fruit','2025-06-12','19:16:00.000000',20,24),(17,'legumes','2025-06-13','12:16:00.000000',10,24),(18,'cereales','2025-06-14','17:16:00.000000',45,24);
/*!40000 ALTER TABLE `solides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sommeils`
--

DROP TABLE IF EXISTS `sommeils`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sommeils` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dateDebut` datetime(6) NOT NULL,
  `dateFin` datetime(6) NOT NULL,
  `duration` int NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sommeils_baby_id_48c58a5a_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `sommeils_baby_id_48c58a5a_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sommeils`
--

LOCK TABLES `sommeils` WRITE;
/*!40000 ALTER TABLE `sommeils` DISABLE KEYS */;
INSERT INTO `sommeils` VALUES (3,'2025-06-02 01:10:29.018000','2025-06-03 01:10:00.000000',1439,'Ghh',5),(4,'2025-06-02 01:28:00.900000','2025-06-02 01:55:00.000000',26,'Pppo',5),(5,'2025-06-02 01:34:58.872000','2025-06-02 01:41:00.000000',6,'Hh',5),(7,'2025-06-02 01:41:10.732000','2025-06-03 01:13:00.000000',1411,'Ndkdk',5),(8,'2025-06-03 15:34:22.512000','2025-06-03 15:34:22.512000',0,'iknkin',7),(13,'2025-06-11 21:42:19.731000','2025-06-12 21:42:00.000000',1439,'',20),(14,'2025-06-12 12:27:00.000000','2025-06-13 12:27:00.000000',1440,'',19),(16,'2025-06-12 13:20:52.585000','2025-06-12 14:45:00.000000',84,'',22),(17,'2025-06-12 21:31:00.000000','2025-06-13 07:21:00.000000',590,'',22),(18,'2025-06-13 09:22:00.000000','2025-06-13 13:22:00.000000',240,'',22),(19,'2025-06-12 21:18:00.000000','2025-06-12 22:18:00.000000',60,'Remarque 1',24),(20,'2025-06-13 18:16:00.000000','2025-06-13 20:16:00.000000',120,'Remarque 2',24),(21,'2025-06-14 18:19:00.000000','2025-06-14 19:19:00.000000',60,'Remarque 3',24);
/*!40000 ALTER TABLE `sommeils` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `symptome`
--

DROP TABLE IF EXISTS `symptome`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `symptome` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `heure` time(6) NOT NULL,
  `symptomes` json NOT NULL,
  `remarque` longtext,
  `predicted_disease` varchar(100) DEFAULT NULL,
  `description` longtext,
  `precautions` json DEFAULT NULL,
  `top_5_diseases` json DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userAPI_symptome_baby_id_a4372b05_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `userAPI_symptome_baby_id_a4372b05_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `symptome`
--

LOCK TABLES `symptome` WRITE;
/*!40000 ALTER TABLE `symptome` DISABLE KEYS */;
INSERT INTO `symptome` VALUES (1,'2025-06-05','11:55:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acidity\"]','aa',NULL,NULL,NULL,NULL,5),(2,'2025-06-05','11:55:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acidity\"]','aza',NULL,NULL,NULL,NULL,5),(3,'2025-06-05','11:57:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acidity\"]','eeee',NULL,NULL,NULL,NULL,5),(4,'2025-06-05','12:27:00.000000','[\"abdominal_pain\", \"acidity\"]','fee',NULL,NULL,NULL,NULL,5),(8,'2025-06-05','19:54:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\"]','erf','','','[]','[]',5),(12,'2025-06-06','11:34:00.000000','[\"high_fever\", \"headache\", \"history_of_alcohol_consumption\"]','','Paralysis (brain hemorrhage)','Intracerebral hemorrhage (ICH) is when blood suddenly bursts into brain tissue, causing damage to your brain. Symptoms usually appear suddenly during ICH. They include headache, weakness, confusion, and paralysis, particularly on one side of your body.','[\"massage\", \"eat healthy\", \"exercise\", \"consult doctor\"]','[{\"disease\": \"Paralysis (brain hemorrhage)\", \"probability\": \"22.99%\"}, {\"disease\": \"Acne\", \"probability\": \"18.55%\"}, {\"disease\": \"Fungal infection\", \"probability\": \"16.00%\"}, {\"disease\": \"Allergy\", \"probability\": \"10.97%\"}, {\"disease\": \"Urinary tract infection\", \"probability\": \"7.94%\"}]',7),(13,'2025-06-06','13:17:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acidity\"]','','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"43.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"6.00%\"}]',7),(14,'2025-06-09','14:19:00.000000','[\"itching\", \"yellowing_of_eyes\", \"yellowish_skin\", \"yellow_urine\"]','','Chronic cholestasis','Chronic cholestatic diseases, whether occurring in infancy, childhood or adulthood, are characterized by defective bile acid transport from the liver to the intestine, which is caused by primary damage to the biliary epithelium in most cases','[\"cold baths\", \"anti itch medicine\", \"consult doctor\", \"eat healthy\"]','[{\"disease\": \"Chronic cholestasis\", \"probability\": \"26.00%\"}, {\"disease\": \"Acne\", \"probability\": \"16.00%\"}, {\"disease\": \"GERD\", \"probability\": \"14.00%\"}, {\"disease\": \"Allergy\", \"probability\": \"14.00%\"}, {\"disease\": \"Paralysis (brain hemorrhage)\", \"probability\": \"14.00%\"}]',7),(17,'2025-06-11','22:45:00.000000','[\"itching\", \"weight_loss\", \"weakness_of_one_body_side\", \"vomiting\"]','','Drug Reaction','An adverse drug reaction (ADR) is an injury caused by taking medication. ADRs may occur following a single dose or prolonged administration of a drug or result from the combination of two or more drugs.','[\"stop irritation\", \"consult nearest hospital\", \"stop taking drug\", \"follow up\"]','[{\"disease\": \"Drug Reaction\", \"probability\": \"30.31%\"}, {\"disease\": \"Paralysis (brain hemorrhage)\", \"probability\": \"18.00%\"}, {\"disease\": \"Chronic cholestasis\", \"probability\": \"11.37%\"}, {\"disease\": \"Arthritis\", \"probability\": \"8.00%\"}, {\"disease\": \"Impetigo\", \"probability\": \"6.29%\"}]',20),(18,'2025-06-11','00:06:00.000000','[\"itching\", \"yellow_urine\", \"weight_loss\"]','','Acne','Acne vulgaris is the formation of comedones, papules, pustules, nodules, and/or cysts as a result of obstruction and inflammation of pilosebaceous units (hair follicles and their accompanying sebaceous gland). Acne develops on the face and upper trunk. It most often affects adolescents.','[\"bath twice\", \"avoid fatty spicy food\", \"drink plenty of water\", \"avoid too many products\"]','[{\"disease\": \"Acne\", \"probability\": \"22.36%\"}, {\"disease\": \"Paralysis (brain hemorrhage)\", \"probability\": \"22.00%\"}, {\"disease\": \"GERD\", \"probability\": \"20.00%\"}, {\"disease\": \"Allergy\", \"probability\": \"17.64%\"}, {\"disease\": \"Drug Reaction\", \"probability\": \"6.00%\"}]',21),(19,'2025-06-12','14:26:00.000000','[\"itching\", \"yellowing_of_eyes\", \"yellow_urine\", \"yellow_crust_ooze\"]','','Impetigo','Impetigo (im-puh-TIE-go) is a common and highly contagious skin infection that mainly affects infants and children. Impetigo usually appears as red sores on the face, especially around a child\'s nose and mouth, and on hands and feet. The sores burst and develop honey-colored crusts.','[\"soak affected area in warm water\", \"use antibiotics\", \"remove scabs with wet compressed cloth\", \"consult doctor\"]','[{\"disease\": \"Impetigo\", \"probability\": \"22.28%\"}, {\"disease\": \"Acne\", \"probability\": \"18.00%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"10.00%\"}, {\"disease\": \"Drug Reaction\", \"probability\": \"8.00%\"}]',22),(20,'2025-06-12','14:26:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acidity\", \"anxiety\"]','','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"43.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"6.00%\"}]',22),(21,'2025-06-12','14:25:00.000000','[\"abdominal_pain\", \"belly_pain\", \"painful_walking\", \"stomach_pain\"]','l\'enfant a commencer à sentir ceci les dernières 2 jours','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"43.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"6.00%\"}]',1),(22,'2025-06-14','11:45:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\"]','Bsbs','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"43.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"6.00%\"}]',5),(23,'2025-06-13','19:25:00.000000','[\"abdominal_pain\", \"abnormal_menstruation\", \"acute_liver_failure\"]','Remrque 1','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"43.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"6.00%\"}]',24),(24,'2025-06-14','20:25:00.000000','[\"abdominal_pain\", \"breathlessness\", \"brittle_nails\", \"bruising\"]','Remarque 2','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"41.17%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"14.83%\"}, {\"disease\": \"Cervical spondylosis\", \"probability\": \"8.00%\"}, {\"disease\": \"GERD\", \"probability\": \"8.00%\"}]',24),(25,'2025-06-11','19:26:00.000000','[\"blurred_and_distorted_vision\", \"bruising\", \"brittle_nails\"]','Remarque 3','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"35.77%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"14.83%\"}, {\"disease\": \"Cervical spondylosis\", \"probability\": \"10.00%\"}, {\"disease\": \"GERD\", \"probability\": \"8.00%\"}]',24),(26,'2025-06-13','21:53:00.000000','[\"back_pain\", \"belly_pain\", \"hip_joint_pain\"]','','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"55.17%\"}, {\"disease\": \"Cervical spondylosis\", \"probability\": \"16.00%\"}, {\"disease\": \"GERD\", \"probability\": \"10.00%\"}, {\"disease\": \"Alcoholic hepatitis\", \"probability\": \"8.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"2.83%\"}]',24),(27,'2025-06-27','17:49:00.000000','[\"abdominal_pain\", \"neck_pain\", \"painful_walking\"]','','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"22.57%\"}, {\"disease\": \"Cervical spondylosis\", \"probability\": \"15.33%\"}, {\"disease\": \"Heart attack\", \"probability\": \"14.53%\"}, {\"disease\": \"Migraine\", \"probability\": \"14.00%\"}, {\"disease\": \"Dimorphic hemmorhoids(piles)\", \"probability\": \"9.85%\"}]',24),(28,'2025-06-28','11:43:00.000000','[\"abnormal_menstruation\", \"belly_pain\", \"blackheads\"]','','Urinary tract infection','Urinary tract infection: An infection of the kidney, ureter, bladder, or urethra. Abbreviated UTI. Not everyone with a UTI has symptoms, but common symptoms include a frequent urge to urinate and pain or burning when urinating.','[\"drink plenty of water\", \"increase vitamin c intake\", \"drink cranberry juice\", \"take probiotics\"]','[{\"disease\": \"Urinary tract infection\", \"probability\": \"45.17%\"}, {\"disease\": \"GERD\", \"probability\": \"16.00%\"}, {\"disease\": \"Migraine\", \"probability\": \"16.00%\"}, {\"disease\": \"Heart attack\", \"probability\": \"6.83%\"}, {\"disease\": \"Cervical spondylosis\", \"probability\": \"6.00%\"}]',24);
/*!40000 ALTER TABLE `symptome` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temperature`
--

DROP TABLE IF EXISTS `temperature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temperature` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `heure` time(6) NOT NULL,
  `temperature` double NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `temperature_baby_id_e337162b_fk_baby_profile_baby_id` (`baby_id`),
  CONSTRAINT `temperature_baby_id_e337162b_fk_baby_profile_baby_id` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temperature`
--

LOCK TABLES `temperature` WRITE;
/*!40000 ALTER TABLE `temperature` DISABLE KEYS */;
INSERT INTO `temperature` VALUES (3,'2025-06-06','03:28:00.000000',38,'normale',5),(5,'2025-06-05','13:11:00.000000',37,'',5),(6,'2025-06-05','13:15:00.000000',37,'',7),(8,'2025-06-05','13:17:00.000000',40,'',7),(10,'2025-06-11','22:43:00.000000',36,'',20),(11,'2025-06-12','14:22:00.000000',37,'',22),(12,'2025-06-12','20:22:00.000000',38,'',22),(13,'2025-06-12','22:23:00.000000',35,'',22),(14,'2025-06-11','19:20:00.000000',37,'Remarque 1',24),(15,'2025-06-12','21:20:00.000000',40,'Remarque 2',24),(16,'2025-06-13','23:21:00.000000',40,'',24);
/*!40000 ALTER TABLE `temperature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tetee`
--

DROP TABLE IF EXISTS `tetee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tetee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `temps_passe` int NOT NULL,
  `remarque` varchar(255) DEFAULT NULL,
  `baby_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `baby_id` (`baby_id`),
  CONSTRAINT `tetee_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tetee`
--

LOCK TABLES `tetee` WRITE;
/*!40000 ALTER TABLE `tetee` DISABLE KEYS */;
INSERT INTO `tetee` VALUES (1,'2025-05-31','06:50:00',15,'aaa',5),(4,'2025-06-01','03:20:00',30,'fr',5),(6,'2025-06-05','13:20:00',100,'',7),(10,'2025-06-11','22:40:00',10,'',20),(11,'2025-06-12','15:17:00',10,'',22),(12,'2025-06-12','17:18:00',15,'',22),(13,'2025-06-12','21:18:00',11,'',22),(14,'2025-06-12','19:12:00',15,'Remarque 1',24),(15,'2025-06-13','15:13:00',10,'Remarque 2',24),(16,'2025-06-13','19:14:00',30,'Remarque 3',24);
/*!40000 ALTER TABLE `tetee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccination`
--

DROP TABLE IF EXISTS `vaccination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaccination` (
  `id` int NOT NULL AUTO_INCREMENT,
  `baby_id` int NOT NULL,
  `vaccine_name` varchar(255) NOT NULL,
  `date_administered` date NOT NULL,
  `next_due_date` date DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`id`),
  KEY `baby_id` (`baby_id`),
  CONSTRAINT `vaccination_ibfk_1` FOREIGN KEY (`baby_id`) REFERENCES `baby_profile` (`baby_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccination`
--

LOCK TABLES `vaccination` WRITE;
/*!40000 ALTER TABLE `vaccination` DISABLE KEYS */;
INSERT INTO `vaccination` VALUES (21,5,'Fghh','2025-06-11','2025-06-12','Hff'),(22,20,'Vaccin de la grippe','2025-06-11','2026-06-11',NULL),(23,22,'Grippe','2025-06-12','2025-06-12',NULL),(24,22,'Varicelle','2025-06-12','2025-06-20',NULL),(26,24,'Vaccin 1','2025-06-11','2025-08-13','Remarque 1'),(27,24,'Vaccin 2','2025-08-13','2025-10-13','Remarque 2'),(28,24,'Vaccin 3','2025-08-13',NULL,'Remarque 3');
/*!40000 ALTER TABLE `vaccination` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-04 18:32:09
