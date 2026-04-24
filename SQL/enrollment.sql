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

 Date: 08/03/2026 13:18:45
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
  `dayOfWeek` int(0) NULL DEFAULT NULL COMMENT '星期几，1-7表示周一到周日',
  `startTime` int(0) NULL DEFAULT NULL COMMENT '上课开始时间，例如1表示第一节课',
  `endTime` int(0) NULL DEFAULT NULL COMMENT '上课结束时间，例如2表示第二节课',
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
  `allStock` int(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of curriculum
-- ----------------------------
INSERT INTO `curriculum` VALUES (101, 1001, 201, '2025-05-02 12:23:14', 2, 5, 6, '主教学楼A101', '计算机编程基础', '大一', '计算机科学', 1, 20, 1, '2025-05-02 15:22:05', '2025-05-02 12:23:14', 0, 50);
INSERT INTO `curriculum` VALUES (102, 1002, 202, '2025-05-02 12:23:14', 3, 1, 2, '主教学楼A102', '数据结构与算法', '大一', '计算机科学', 1, 24, 1, '2025-05-02 15:22:12', '2025-05-02 12:23:14', 0, 44);
INSERT INTO `curriculum` VALUES (103, 1003, 203, '2025-05-02 12:23:14', 4, 3, 4, '主教学楼A103', '数据库系统原理', '大二', '计算机科学', 1, 39, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 39);
INSERT INTO `curriculum` VALUES (104, 1004, 204, '2025-05-02 12:23:14', 5, 5, 6, '主教学楼A104', '操作系统', '大二', '计算机科学', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (105, 1005, 205, '2025-05-02 12:23:14', 1, 1, 2, '主教学楼A105', '计算机网络', '大三', '计算机科学', 1, 0, 1, '2025-05-02 15:22:16', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (106, 1006, 206, '2025-05-02 12:23:14', 2, 3, 4, '主教学楼A106', '软件工程', '大三', '计算机科学', 1, 28, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 28);
INSERT INTO `curriculum` VALUES (107, 1007, 207, '2025-05-02 12:23:14', 3, 5, 6, '主教学楼A107', '人工智能', '大四', '计算机科学', 1, 23, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 23);
INSERT INTO `curriculum` VALUES (108, 1008, 208, '2025-05-02 12:23:14', 4, 1, 2, '主教学楼A108', '机器学习', '大四', '计算机科学', 1, 20, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 20);
INSERT INTO `curriculum` VALUES (109, 1009, 209, '2025-05-02 12:23:14', 5, 3, 4, '工程楼B101', '电路分析基础', '大一', '电子工程', 1, 38, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 38);
INSERT INTO `curriculum` VALUES (110, 1010, 210, '2025-05-02 12:23:14', 1, 5, 6, '工程楼B102', '数字电路', '大一', '电子工程', 1, 39, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 39);
INSERT INTO `curriculum` VALUES (111, 1011, 211, '2025-05-02 12:23:14', 2, 1, 2, '工程楼B103', '模拟电路', '大二', '电子工程', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (112, 1012, 212, '2025-05-02 12:23:14', 3, 3, 4, '工程楼B104', '嵌入式系统', '大二', '电子工程', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (113, 1013, 213, '2025-05-02 12:23:14', 4, 5, 6, '工程楼B105', '信号与系统', '大三', '电子工程', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (114, 1014, 214, '2025-05-02 12:23:14', 5, 1, 2, '工程楼B106', '通信原理', '大三', '电子工程', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (115, 1015, 215, '2025-05-02 12:23:14', 1, 3, 4, '工程楼B107', '电子设计自动化', '大四', '电子工程', 1, 25, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 25);
INSERT INTO `curriculum` VALUES (116, 1016, 216, '2025-05-02 12:23:14', 2, 5, 6, '工程楼B108', '数字信号处理', '大四', '电子工程', 1, 25, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 25);
INSERT INTO `curriculum` VALUES (117, 1017, 217, '2025-05-02 12:23:14', 3, 1, 2, '理科楼C101', '高等数学I', '大一', '数学', 1, 45, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 45);
INSERT INTO `curriculum` VALUES (118, 1018, 218, '2025-05-02 12:23:14', 4, 3, 4, '理科楼C102', '线性代数', '大一', '数学', 1, 44, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 45);
INSERT INTO `curriculum` VALUES (119, 1019, 219, '2025-05-02 12:23:14', 5, 5, 6, '理科楼C103', '概率论与数理统计', '大二', '数学', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (120, 1020, 220, '2025-05-02 12:23:14', 1, 1, 2, '理科楼C104', '复变函数', '大二', '数学', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (121, 1021, 221, '2025-05-02 12:23:14', 2, 3, 4, '理科楼C105', '抽象代数', '大三', '数学', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (122, 1022, 222, '2025-05-02 12:23:14', 3, 5, 6, '理科楼C106', '数值分析', '大三', '数学', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (123, 1023, 223, '2025-05-02 12:23:14', 4, 1, 2, '理科楼C107', '微分几何', '大四', '数学', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (124, 1024, 224, '2025-05-02 12:23:14', 5, 3, 4, '理科楼C108', '泛函分析', '大四', '数学', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (125, 1025, 225, '2025-05-02 12:23:14', 1, 5, 6, '理科楼D101', '力学', '大一', '物理', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (126, 1026, 226, '2025-05-02 12:23:14', 2, 1, 2, '理科楼D102', '电磁学', '大一', '物理', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (127, 1027, 227, '2025-05-02 12:23:14', 3, 3, 4, '理科楼D103', '热学', '大二', '物理', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (128, 1028, 228, '2025-05-02 12:23:14', 4, 5, 6, '理科楼D104', '光学', '大二', '物理', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (129, 1029, 229, '2025-05-02 12:23:14', 5, 1, 2, '理科楼D105', '量子力学', '大三', '物理', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (130, 1030, 230, '2025-05-02 12:23:14', 1, 3, 4, '理科楼D106', '固体物理', '大三', '物理', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (131, 1031, 231, '2025-05-02 12:23:14', 2, 5, 6, '理科楼D107', '原子物理', '大四', '物理', 1, 25, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 25);
INSERT INTO `curriculum` VALUES (132, 1032, 232, '2025-05-02 12:23:14', 5, 1, 2, '理科楼D108', '核物理', '大四', '物理', 1, 24, 1, '2025-05-10 16:10:57', '2025-05-02 12:23:14', 0, 25);
INSERT INTO `curriculum` VALUES (133, 1033, 233, '2025-05-02 12:23:14', 4, 3, 4, '理科楼E101', '无机化学', '大一', '化学', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (134, 1034, 234, '2025-05-02 12:23:14', 5, 5, 6, '理科楼E102', '分析化学', '大一', '化学', 1, 40, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 40);
INSERT INTO `curriculum` VALUES (135, 1035, 235, '2025-05-02 12:23:14', 1, 1, 2, '理科楼E103', '有机化学', '大二', '化学', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (136, 1036, 236, '2025-05-02 12:23:14', 2, 3, 4, '理科楼E104', '物理化学', '大二', '化学', 1, 35, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 35);
INSERT INTO `curriculum` VALUES (137, 1037, 237, '2025-05-02 12:23:14', 3, 5, 6, '理科楼E105', '生物化学', '大三', '化学', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (138, 1038, 238, '2025-05-02 12:23:14', 4, 1, 2, '理科楼E106', '高分子化学', '大三', '化学', 1, 30, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 30);
INSERT INTO `curriculum` VALUES (139, 1039, 239, '2025-05-02 12:23:14', 5, 3, 4, '理科楼E107', '材料化学', '大四', '化学', 1, 25, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 25);
INSERT INTO `curriculum` VALUES (140, 1040, 240, '2025-05-02 12:23:14', 1, 5, 6, '理科楼E108', '催化化学', '大四', '化学', 1, 25, 1, '2025-05-02 15:07:22', '2025-05-02 12:23:14', 0, 25);

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
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enrollment
-- ----------------------------
INSERT INTO `enrollment` VALUES (15, 2198020031, 101, NULL, NULL);
INSERT INTO `enrollment` VALUES (16, 2198020031, 102, NULL, NULL);
INSERT INTO `enrollment` VALUES (17, 2198020031, 103, NULL, NULL);
INSERT INTO `enrollment` VALUES (18, 2198020031, 107, NULL, NULL);
INSERT INTO `enrollment` VALUES (19, 2198020031, 110, NULL, NULL);
INSERT INTO `enrollment` VALUES (20, 2198020031, 109, NULL, NULL);
INSERT INTO `enrollment` VALUES (21, 2198020031, 106, NULL, NULL);
INSERT INTO `enrollment` VALUES (24, 2198020031, 132, NULL, NULL);
INSERT INTO `enrollment` VALUES (25, 2198020031, 118, NULL, NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1921211553561223170 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of enrollment_log
-- ----------------------------
INSERT INTO `enrollment_log` VALUES (1918172030520795137, 5735661675557859, 2198020031, 1, '2025-05-02 05:13:45', '2025-05-02 05:13:45');
INSERT INTO `enrollment_log` VALUES (1918172042952712194, 9124494896039649, 2198020031, 1, '2025-05-02 05:13:48', '2025-05-02 05:13:48');
INSERT INTO `enrollment_log` VALUES (1918172054336053249, 4798667388215460, 2198020031, 1, '2025-05-02 05:13:50', '2025-05-02 05:13:50');
INSERT INTO `enrollment_log` VALUES (1918197022247624706, 5758846196086032, 2198020031, 1, '2025-05-02 06:53:03', '2025-05-02 06:53:03');
INSERT INTO `enrollment_log` VALUES (1918197050143940610, 5926942910861257, 2198020031, 1, '2025-05-02 06:53:10', '2025-05-02 06:53:10');
INSERT INTO `enrollment_log` VALUES (1918197064626872321, 7605026234857630, 2198020031, 1, '2025-05-02 06:53:13', '2025-05-02 06:53:13');
INSERT INTO `enrollment_log` VALUES (1918197151973253121, 6481934980405076, 2198020031, 1, '2025-05-02 06:53:34', '2025-05-02 06:53:34');
INSERT INTO `enrollment_log` VALUES (1921114817444814849, 1473398856141403, 2198020031, 1, '2025-05-10 08:07:20', '2025-05-10 08:07:20');
INSERT INTO `enrollment_log` VALUES (1921116151233486850, 7220644265324156, 2198020031, 1, '2025-05-10 08:12:38', '2025-05-10 08:12:38');
INSERT INTO `enrollment_log` VALUES (1921118691740196866, 7443739334739903, 2198020031, 1, '2025-05-10 08:22:43', '2025-05-10 08:22:43');
INSERT INTO `enrollment_log` VALUES (1921211553561223170, 538113450124805, 2198020031, 1, '2025-05-10 14:31:43', '2025-05-10 14:31:43');

SET FOREIGN_KEY_CHECKS = 1;
