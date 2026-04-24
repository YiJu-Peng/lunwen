-- 修改curriculum表，添加课程表所需的字段
ALTER TABLE curriculum 
ADD COLUMN dayOfWeek INT COMMENT '星期几，1-7表示周一到周日' AFTER teachingTime,
ADD COLUMN startTime INT COMMENT '上课开始时间，例如1表示第一节课' AFTER dayOfWeek,
ADD COLUMN endTime INT COMMENT '上课结束时间，例如2表示第二节课' AFTER startTime;

-- 更新已有数据，为避免所有课程都在同一时间，使用ID来分配不同的时间
-- 根据ID模5的余数+1来设置星期几
UPDATE curriculum SET dayOfWeek = (id % 5) + 1;

-- 根据ID模3的余数来设置不同的课时段
-- 0: 上午课程
UPDATE curriculum SET startTime = 1, endTime = 2 WHERE id % 3 = 0;
-- 1: 下午课程
UPDATE curriculum SET startTime = 3, endTime = 4 WHERE id % 3 = 1;
-- 2: 晚上课程
UPDATE curriculum SET startTime = 5, endTime = 6 WHERE id % 3 = 2; 