#!/bin/bash
echo "正在导入数据到数据库..."

echo "第1步：导入科目和教师数据..."
mysql -u root -proot enrollment < subject_teacher_data.sql

echo "第2步：导入学生数据..."
mysql -u root -proot enrollment < student_data.sql

echo "第3步：导入课程数据..."
mysql -u root -proot enrollment < add_data.sql

echo "所有数据导入完成！" 