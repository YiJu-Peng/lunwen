/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : localhost:3306
 Source Schema         : enrollment

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 02/05/2025 12:05:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for curriculum
-- ----------------------------
DROP TABLE IF EXISTS `curriculum`;
CREATE TABLE `curriculum`  (
  `id` int(0) NOT NULL,
  `subjectId` int(0) NOT NULL,
  `teacherId` int(0) NOT NULL,
  `teachingTime` datetime(0) NOT NULL,
  `location` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `remarks` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL,
  `grade` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `major` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `isCheck` tinyint(0) NOT NULL DEFAULT 0,
  `stock` int(0) NULL DEFAULT NULL,
  `isStock` int(0) NOT NULL,
  `createTime` datetime(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `updateTime` datetime(0) NOT NULL,
  `isDelete` tinyint(0) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of curriculum
-- ----------------------------
INSERT INTO `curriculum` VALUES (1, 210361, 1, '2024-12-27 14:54:27', 'a101', NULL, '', '', 1, 999998, 0, '2024-12-27 14:54:27', '2024-12-27 15:18:42', 0);

-- ----------------------------
-- Table structure for enrollment
-- ----------------------------
DROP TABLE IF EXISTS `enrollment`;
CREATE TABLE `enrollment`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `studentId` bigint(0) NULL DEFAULT NULL,
  `curriculumId` bigint(0) NULL DEFAULT NULL,
  `createTime` datetime(0) NULL DEFAULT NULL,
  `updateTime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enrollment
-- ----------------------------
INSERT INTO `enrollment` VALUES (3, 2198020031, 1, NULL, NULL);

-- ----------------------------
-- Table structure for enrollment_log
-- ----------------------------
DROP TABLE IF EXISTS `enrollment_log`;
CREATE TABLE `enrollment_log`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT,
  `requestId` bigint(0) NOT NULL,
  `studentId` bigint(0) NOT NULL,
  `status` tinyint(0) NOT NULL,
  `createTime` datetime(0) NOT NULL,
  `updateTime` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1908794617554817026 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enrollment_log
-- ----------------------------
INSERT INTO `enrollment_log` VALUES (1867954080665161729, 9957734316820948, 2198020031, 1, '2024-12-14 15:25:32', '2024-12-14 15:25:32');
INSERT INTO `enrollment_log` VALUES (1867954138424922114, 8244102901044350, 2198020031, 1, '2024-12-14 15:25:46', '2024-12-14 15:25:46');
INSERT INTO `enrollment_log` VALUES (1908794617554817026, 4117840088008413, 2198020031, 1, '2025-04-06 08:11:15', '2025-04-06 08:11:15');

SET FOREIGN_KEY_CHECKS = 1;
