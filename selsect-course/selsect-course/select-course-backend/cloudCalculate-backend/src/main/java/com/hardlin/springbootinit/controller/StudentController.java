package com.hardlin.springbootinit.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.springbootinit.model.entity.Student;
import com.hardlin.springbootinit.service.StudentService;
import com.hardlin.springbootinit.utils.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // 获取所有学生信息
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    //分页获取学生信息
    @GetMapping("/page")
    public IPage<Student> getStudents(PageParam<Student> pageParam) {
        IPage<Student> page = studentService.page(pageParam);
        return page;
    }

    // 根据ID获取学生信息
    @GetMapping("/{id}")
    public Student getStudentById(Long id) {
        return studentService.getById(id);
    }

    // 添加新学生
    @PostMapping
    public Boolean addStudent(Student student) {
        return studentService.save(student);
    }

    // 更新学生信息
    @PutMapping("/{id}")
    public Boolean updateStudent(Long id,Student studentDetails) {
        return studentService.update(studentDetails,new LambdaQueryWrapper<Student>()
                .eq(Student::getId,id));
    }

    // 删除学生
    @DeleteMapping("/{id}")
    public void deleteStudent(Long id) {
        studentService.removeById(id);
    }
}
