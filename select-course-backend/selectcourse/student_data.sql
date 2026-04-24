-- 添加学生数据
-- 注意：学生 ID 需要和 enrollment 表中的 studentId 保持对应
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int NOT NULL,
  `studentId` bigint DEFAULT NULL,
  `userId` bigint DEFAULT NULL,
  `studentName` varchar(50) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `grade` varchar(20) DEFAULT NULL,
  `major` varchar(50) DEFAULT NULL,
  `college` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `updateTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 计算机科学专业学生
INSERT INTO student (id, studentId, userId, studentName, gender, age, grade, major, college, phoneNumber, email) VALUES 
(10001, 10001, 101110101, '张三', '男', 20, '大二', '计算机科学', '计算机学院', '13900000001', 'zhangsan@example.com'),
(10002, 10002, 101110102, '李四', '男', 21, '大二', '电子工程', '电子工程学院', '13900000002', 'lisi@example.com'),
(10003, 10003, 101110103, '王五', '女', 19, '大一', '数学', '数学学院', '13900000003', 'wangwu@example.com'),
(10004, 10004, 101110104, '赵六', '男', 22, '大三', '物理', '物理学院', '13900000004', 'zhaoliu@example.com'),
(10005, 10005, 101110105, '钱七', '女', 20, '大二', '化学', '化学学院', '13900000005', 'qianqi@example.com'),
(10006, 10006, 101110106, '孙八', '男', 21, '大二', '计算机科学', '计算机学院', '13900000006', 'sunba@example.com'),
(10007, 10007, 101110107, '周九', '女', 19, '大一', '电子工程', '电子工程学院', '13900000007', 'zhoujiu@example.com'),
(10008, 10008, 101110108, '吴十', '男', 22, '大三', '数学', '数学学院', '13900000008', 'wushi@example.com'),
(10009, 10009, 101110109, '郑十一', '女', 20, '大二', '物理', '物理学院', '13900000009', 'zheng11@example.com'),
(10010, 10010, 101110110, '王十二', '男', 21, '大二', '化学', '化学学院', '13900000010', 'wang12@example.com'),
(10011, 10011, 101110111, '李十三', '女', 19, '大一', '计算机科学', '计算机学院', '13900000011', 'li13@example.com'),
(10012, 10012, 101110112, '张十四', '男', 22, '大三', '电子工程', '电子工程学院', '13900000012', 'zhang14@example.com'),
(10013, 10013, 101110113, '刘十五', '女', 20, '大二', '数学', '数学学院', '13900000013', 'liu15@example.com'),
(10014, 10014, 101110114, '陈十六', '男', 21, '大二', '物理', '物理学院', '13900000014', 'chen16@example.com'),
(10015, 10015, 101110115, '杨十七', '女', 19, '大一', '化学', '化学学院', '13900000015', 'yang17@example.com'),
(10016, 10016, 101110116, '黄十八', '男', 22, '大三', '计算机科学', '计算机学院', '13900000016', 'huang18@example.com'),
(10017, 10017, 101110117, '周十九', '女', 20, '大二', '电子工程', '电子工程学院', '13900000017', 'zhou19@example.com'),
(10018, 10018, 101110118, '吴二十', '男', 21, '大二', '数学', '数学学院', '13900000018', 'wu20@example.com'),
(10019, 10019, 101110119, '徐二一', '女', 19, '大一', '物理', '物理学院', '13900000019', 'xu21@example.com'),
(10020, 10020, 101110120, '孙二二', '男', 22, '大三', '化学', '化学学院', '13900000020', 'sun22@example.com'); 