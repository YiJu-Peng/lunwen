package com.hardlin.springbootinit.controller.cloudCalculate;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.mapper.*;
import com.hardlin.springbootinit.model.entity.*;
import com.hardlin.springbootinit.mapper.*;
import com.hardlin.springbootinit.model.entity.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/6/17 21:32
 */
@RestController
@RequestMapping("/cloudCalculate")
@Slf4j
public class ExcelUploadController {
    @Autowired
    private ClassesMapper classMapper;

    @Autowired
    private SubjectMapper subjectMapper;

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ScoreMapper scoreMapper;
    @Autowired
    private DelayedMapper delayedMapper;
    @PostMapping("/delayedUpload")
    public BaseResponse<String> delayedUpload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR, "上传文件为空");
        }
        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0);
            String[] head = new String[]{"申报类型","报名学年","报名学期","报名原因","学年","学期","学号","开课学院"};
            for (Row row : sheet){
                if (row.getRowNum() == 0){
                    for (int i = 0; i < head.length; i++){
                        Cell cell = row.getCell(i);
                        if (cell == null || StrUtil.isBlank(cell.getStringCellValue()) || !cell.getStringCellValue().equals(head[i])){
                            return ResultUtils.error(ErrorCode.PARAMS_ERROR, "上传Excel表结构不正确");
                        }
                    }
                    continue;
                }
                String study_year = row.getCell(1).getStringCellValue();
                int study_schdule = Integer.parseInt(row.getCell(2).getStringCellValue());
                String des = row.getCell(3).getStringCellValue();
                Cell cell = row.getCell(6);
                if (cell.getCellType() == CellType.NUMERIC) {
                    // 如果是数值类型，先将其转换为字符串再设置回去，确保后续操作按字符串处理
                    cell.setCellType(CellType.STRING);
                }
                long student_id = Long.parseLong(cell.getStringCellValue());
                System.out.println("student_id"+student_id);
                String student_college = row.getCell(7).getStringCellValue();

                QueryWrapper<Delayed> queryWrapper = new QueryWrapper<>();
                queryWrapper.eq("studyYear", study_year); // 等价于 WHERE id = #{classId}
                queryWrapper.eq("srudySchdule", study_schdule); // 等价于 WHERE id = #{classId}
                queryWrapper.eq("studentId", student_id); // 等价于 WHERE id = #{classId}

                // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                if (delayedMapper.selectCount(queryWrapper) <= 0) {
                    Delayed delayed = new Delayed();
                    delayed.setStudyYear(study_year);
                    delayed.setSrudySchdule(study_schdule);
                    delayed.setDes(des);
                    delayed.setStudentId(student_id);
                    delayed.setStudentcollege(student_college);
                    delayedMapper.insert(delayed);
                }

            }
            return ResultUtils.success("上传成功");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/uploadExcel")
    public BaseResponse<String> uploadExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResultUtils.error(ErrorCode.PARAMS_ERROR, "上传文件为空");
        }

        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(inputStream);
            Sheet sheet = workbook.getSheetAt(0); // 假设我们处理第一个sheet
            String[] head1 = new String[]{"学年", "学期", "学号", "性别", "课程代码", "课程名称", "学分", "平时成绩", "期末成绩", "总评成绩", "折算成绩", "最高成绩", "补考成绩", "绩点", "任课教师", "班级"};
            String[] head2 = new String[]{"学年", "学期", "学号", "性别", "课程代码", "课程名称","课程性质", "学分", "平时成绩",  "期中成绩","期末成绩", "实验成绩", "总评成绩", "绩点", "课程类别"};
            boolean flag1 = true;
            boolean flag2 = true;
            for (Row row : sheet) {
                //校验表头结构
                if (row.getRowNum() == 0) { //
                    for (int i = 0; i < row.getPhysicalNumberOfCells()-1; i++) {
                        Cell cell = row.getCell(i);
                        boolean equals1 = cell.getStringCellValue().equals(head1[i]);
                        boolean equals2 = cell.getStringCellValue().equals(head2[i]);
                        if (!equals1 || StrUtil.isBlank(cell.getStringCellValue())) {
                            flag1 = false;
                        }
                        if (!equals2 || StrUtil.isBlank(cell.getStringCellValue())) {
                            flag2 = false;
                        }
                        if (!flag1 && !flag2){
                            return ResultUtils.error(ErrorCode.PARAMS_ERROR,"上传的表结构错误");
                        }
                    }
                    continue;
                }
                if (flag1) {
                    String study_year = row.getCell(0).getStringCellValue();
                    int study_schdule = Integer.parseInt(row.getCell(1).getStringCellValue());
                    long student_id = (long) row.getCell(2).getNumericCellValue();
                    int student_gender = row.getCell(3).getStringCellValue().equals("男") ? 1 : 0;
                    int subject_id = Integer.parseInt(row.getCell(4).getStringCellValue());
                    String subject_name = row.getCell(5).getStringCellValue();
                    double subject_score = Double.parseDouble(row.getCell(6).getStringCellValue());
                    double usual_score = Double.parseDouble(StrUtil.isBlank(row.getCell(7).getStringCellValue()) ? "0" : row.getCell(7).getStringCellValue());
                    double test_score = Double.parseDouble(StrUtil.isBlank(row.getCell(8).getStringCellValue()) ? "0" : row.getCell(8).getStringCellValue());
                    double last_score = Double.parseDouble(StrUtil.isBlank(row.getCell(9).getStringCellValue()) ? "0" : row.getCell(9).getStringCellValue());
                    double again_score = Double.parseDouble(StrUtil.isBlank(row.getCell(12).getStringCellValue()) ? "0" : row.getCell(12).getStringCellValue());
                    double gpa = Double.parseDouble(StrUtil.isBlank(row.getCell(13).getStringCellValue()) ? "0" : row.getCell(13).getStringCellValue());
                    String teacher_name = row.getCell(14).getStringCellValue();
                    String stringCellValue = row.getCell(15).getStringCellValue();
                    int class_id = Integer.parseInt(stringCellValue.substring(0, stringCellValue.length() - 1));
                    //先查出班级是否存在 不存在添加
                    QueryWrapper<Classes> queryWrapper1 = new QueryWrapper<>();
                    queryWrapper1.eq("id", class_id); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (classMapper.selectCount(queryWrapper1) <= 0) {
                        Classes classes = new Classes();
                        classes.setId(class_id);
                        classMapper.insert(classes);
                    }
                    //先查出课程是否存在不存在添加
                    QueryWrapper<Subject> queryWrapper2 = new QueryWrapper<>();
                    queryWrapper2.eq("id", subject_id); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (subjectMapper.selectCount(queryWrapper2) <= 0) {
                        Subject subject = new Subject();
                        subject.setId(subject_id);
                        subject.setSubjectName(subject_name);
//                        subject.(subject_score);
                        subjectMapper.insert(subject);
                    }

                    //先查出学生不存在则添加，默认密码123456
                    QueryWrapper<User> queryWrapper3 = new QueryWrapper<>();
                    queryWrapper3.eq("id", student_id); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (userMapper.selectCount(queryWrapper3) <= 0) {
                        User user = new User();
                        user.setId((long) student_id);
                        user.setUserAccount(String.valueOf(student_id));
                        user.setUserRole("user");
                        user.setUserAvatar("https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png");
                        String encryptPassword = DigestUtils.md5DigestAsHex(("lin" + "123456").getBytes());
                        user.setUserPassword(encryptPassword);
                        user.setGender(student_gender);
                        userMapper.insert(user);
                    }

                    //如果不存在成绩条目 则添加
                    QueryWrapper<Score> queryWrapper4 = new QueryWrapper<>();
                    queryWrapper4.eq("studentId", student_id); // 等价于 WHERE id = #{classId}
                    queryWrapper4.eq("subjectId", subject_id); // 等价于 WHERE id = #{classId}
                    queryWrapper4.eq("sutdyYear", study_year); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (scoreMapper.selectCount(queryWrapper4) <= 0) {
                        Score score = new Score();
                        score.setSutdyYear(study_year);
                        score.setStudentId(student_id);
                        score.setSubjectId(subject_id);
                        score.setUsusalScore(usual_score);
                        score.setTestScore(test_score);
                        score.setLastScore(last_score);
                        score.setAgainScore(again_score);
                        score.setGpa(gpa);
                        score.setTeacherName(teacher_name);
                        score.setClassId(class_id);
                        score.setStudySchdule(study_schdule);
                        scoreMapper.insert(score);
                    }
                }
                if (flag2){
                    String study_year = row.getCell(0).getStringCellValue();
                    int study_schdule = Integer.parseInt(row.getCell(1).getStringCellValue());
                    long student_id = (long) row.getCell(2).getNumericCellValue();
                    int student_gender = row.getCell(3).getStringCellValue().equals("男") ? 1 : 0;
                    int subject_id = Integer.parseInt(row.getCell(4).getStringCellValue());
                    String subject_name = row.getCell(5).getStringCellValue();
                    double subject_score = Double.parseDouble(row.getCell(7).getStringCellValue());
                    double usual_score = Double.parseDouble(StrUtil.isBlank(row.getCell(8).getStringCellValue()) ? "0" : row.getCell(8).getStringCellValue());
                    double test_score = Double.parseDouble(StrUtil.isBlank(row.getCell(10).getStringCellValue()) ? "0" : row.getCell(10).getStringCellValue());
                    double experimental_score = Double.parseDouble(StrUtil.isBlank(row.getCell(11).getStringCellValue()) ? "0" : row.getCell(11).getStringCellValue());
                    String lastscoreString = row.getCell(12).getStringCellValue();
                    double last_score = Double.parseDouble(StrUtil.isBlank(lastscoreString) || lastscoreString.equals("参军") ? "0" : row.getCell(12).getStringCellValue());
                    double gpa = Double.parseDouble(StrUtil.isBlank(row.getCell(13).getStringCellValue()) ? "0" : row.getCell(13).getStringCellValue());
                    //先查出课程是否存在不存在添加
                    QueryWrapper<Subject> queryWrapper2 = new QueryWrapper<>();
                    queryWrapper2.eq("id", subject_id); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (subjectMapper.selectCount(queryWrapper2) <= 0) {
                        Subject subject = new Subject();
                        subject.setId(subject_id);
                        subject.setSubjectName(subject_name);
//                        subject.setSubjectScore(subject_score);
                        subjectMapper.insert(subject);
                    }

                    //先查出学生不存在则添加，默认密码123456
                    QueryWrapper<User> queryWrapper3 = new QueryWrapper<>();
                    queryWrapper3.eq("id", student_id); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (userMapper.selectCount(queryWrapper3) <= 0) {
                        User user = new User();
                        user.setId((long) student_id);
                        user.setUserAccount(String.valueOf(student_id));
                        user.setUserRole("user");
                        user.setUserAvatar("https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png");
                        String encryptPassword = DigestUtils.md5DigestAsHex(("lin" + "123456").getBytes());
                        user.setUserPassword(encryptPassword);
                        user.setGender(student_gender);
                        userMapper.insert(user);
                    }

                    //如果不存在成绩条目 则添加
                    QueryWrapper<Score> queryWrapper4 = new QueryWrapper<>();
                    queryWrapper4.eq("studentId", student_id); // 等价于 WHERE id = #{classId}
                    queryWrapper4.eq("subjectId", subject_id); // 等价于 WHERE id = #{classId}
                    queryWrapper4.eq("sutdyYear", study_year); // 等价于 WHERE id = #{classId}

                    // 使用Mapper接口的selectCount方法，如果查询到的结果大于0，则表示存在
                    if (scoreMapper.selectCount(queryWrapper4) <= 0) {
                        Score score = new Score();
                        score.setSutdyYear(study_year);
                        score.setStudentId(student_id);
                        score.setSubjectId(subject_id);
                        score.setUsusalScore(usual_score);
                        score.setTestScore(test_score);
                        score.setExperimentalScore(experimental_score);
                        score.setLastScore(last_score);
                        score.setGpa(gpa);
                        score.setStudySchdule(study_schdule);
                        scoreMapper.insert(score);
                    }
                }

            }
            workbook.close();
            return ResultUtils.success("上传成功");
        } catch (IOException e) {
           return ResultUtils.error(ErrorCode.SYSTEM_ERROR,"上传错误");
        }

    }
}
     