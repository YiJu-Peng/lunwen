#!/bin/bash
echo "正在导入数据到数据库..."
mysql -u root -proot enrollment < add_data.sql
echo "数据导入完成！" 