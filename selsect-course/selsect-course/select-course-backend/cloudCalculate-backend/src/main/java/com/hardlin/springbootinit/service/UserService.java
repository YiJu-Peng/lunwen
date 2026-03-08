package com.hardlin.springbootinit.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.IService;
import com.hardlin.springbootinit.model.dto.user.UserQueryRequest;
import com.hardlin.springbootinit.model.entity.User;
import com.hardlin.springbootinit.model.vo.LoginUserVO;
import com.hardlin.springbootinit.model.vo.UserVO;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
* @author DawnCclin
* @description 针对表【user(用户)】的数据库操作Service
* @createDate 2024-06-17 22:32:37
*/
public interface UserService extends IService<User> {

    long userRegister(String userAccount, String userPassword, String checkPassword);

    User userLogin(String userAccount, String userPassword, HttpServletRequest request);

    User getLoginUser(HttpServletRequest request);

    User getLoginUserPermitNull(HttpServletRequest request);

    boolean isAdmin(HttpServletRequest request);

    boolean isAdmin(User user);

    boolean userLogout(HttpServletRequest request);

    LoginUserVO getLoginUserVO(User user);

    UserVO getUserVO(User user);

    List<UserVO> getUserVO(List<User> userList);

    QueryWrapper<User> getQueryWrapper(UserQueryRequest userQueryRequest);
}
