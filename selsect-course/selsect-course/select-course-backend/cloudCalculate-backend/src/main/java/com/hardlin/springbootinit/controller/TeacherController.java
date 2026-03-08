package com.hardlin.springbootinit.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.hardlin.springbootinit.model.entity.Teacher;
import com.hardlin.springbootinit.service.TeacherService;
import com.hardlin.springbootinit.utils.PageParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    //分页获取教师信息
    @GetMapping("/page")
    public IPage<Teacher> getTeachers(PageParam<Teacher> pageParam) {
        IPage<Teacher> page = teacherService.page(pageParam);
        return page;
    }

    // 根据ID获取教师信息
    @GetMapping("/{id}")
    public Teacher getTeacherById(@PathVariable("id") Integer id) {
        return teacherService.getById(id);
    }

    // 添加新教师
    @PostMapping
    public Boolean addTeacher(@RequestBody Teacher teacher) {
        return teacherService.save(teacher);
    }

    // 更新教师信息
    @PutMapping("/{id}")
    public Boolean updateTeacher(@PathVariable("id") Integer id, @RequestBody Teacher teacherDetails) {
        teacherDetails.setId(id);
        return teacherService.updateById(teacherDetails);
    }

    // 删除教师
    @DeleteMapping("/{id}")
    public Boolean deleteTeacher(@PathVariable("id") Integer id) {
        return teacherService.removeById(id);
    }
}
