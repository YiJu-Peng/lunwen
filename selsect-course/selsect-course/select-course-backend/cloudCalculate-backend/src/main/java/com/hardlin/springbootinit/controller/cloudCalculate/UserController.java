package com.hardlin.springbootinit.controller.cloudCalculate;

import cn.dev33.satoken.stp.SaTokenInfo;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.crypto.digest.DigestUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import com.hardlin.springbootinit.common.BaseResponse;
import com.hardlin.springbootinit.common.ErrorCode;
import com.hardlin.springbootinit.common.ResultUtils;
import com.hardlin.springbootinit.exception.BusinessException;
import com.hardlin.springbootinit.mapper.StudentMapper;
import com.hardlin.springbootinit.mapper.TeacherMapper;
import com.hardlin.springbootinit.model.dto.user.*;
import com.hardlin.springbootinit.model.entity.Message;
import com.hardlin.springbootinit.model.entity.User;
import com.hardlin.springbootinit.model.vo.LoginUserVO;
import com.hardlin.springbootinit.model.vo.UserVO;
import com.hardlin.springbootinit.service.MessageService;
import com.hardlin.springbootinit.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 用户接口
 *
 * @author DawnCclin
 */
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    private static final String SALT = "dawnlin";
    @Resource
    private UserService userService;
    @Resource
    private StudentMapper studentMapper;
    @Resource
    private TeacherMapper teacherMapper;
    @Resource
    private MessageService messageService;

    // region 登录相关

    /**
     * 用户注册
     *
     * @param userRegisterRequest
     * @return
     */
    @PostMapping("/register")
    public BaseResponse<Long> userRegister(@RequestBody UserRegisterRequest userRegisterRequest) {
        if (userRegisterRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userRegisterRequest.getUserAccount();
        String userPassword = userRegisterRequest.getUserPassword();
        String checkPassword = userRegisterRequest.getCheckPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword, checkPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "参数为空");
        }
        long result = userService.userRegister(userAccount, userPassword, checkPassword);
        return ResultUtils.success(result);
    }

    /**
     * 用户登录
     *
     * @param userLoginRequest
     * @param request
     * @return
     */
    @PostMapping("/login")
    public BaseResponse<Map<String, Object>> userLogin(@RequestBody UserLoginRequest userLoginRequest, HttpServletRequest request) {
        if (userLoginRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        String userAccount = userLoginRequest.getUserAccount();
        String userPassword = userLoginRequest.getUserPassword();
        if (StringUtils.isAnyBlank(userAccount, userPassword)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 调用Service层登录方法
        User user = userService.userLogin(userAccount, userPassword, request);
        // 转换为VO对象
        LoginUserVO loginUserVO = userService.getLoginUserVO(user);
        // 获取Sa-Token登录信息
        SaTokenInfo tokenInfo = StpUtil.getTokenInfo();
        // 设置响应结果，包含用户信息和令牌
        Map<String, Object> result = new HashMap<>();
        result.put("user", loginUserVO);
        result.put("tokenName", tokenInfo.getTokenName());
        result.put("tokenValue", tokenInfo.getTokenValue());
        result.put("loginId", tokenInfo.getLoginId());
        result.put("role", user.getUserRole());
        return ResultUtils.success(result);
    }

    /**
     * 用户注销
     *
     * @param request
     * @return
     */
    @PostMapping("/logout")
    public BaseResponse<Boolean> userLogout(HttpServletRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = userService.userLogout(request);
        return ResultUtils.success(result);
    }

    /**
     * 获取当前登录用户
     *
     * @param request
     * @return
     */
    @GetMapping("/get/login")
    public BaseResponse<LoginUserVO> getLoginUser(HttpServletRequest request) {
        // 获取用户信息
        User user = userService.getLoginUser(request);
        return ResultUtils.success(userService.getLoginUserVO(user));
    }

    // endregion

    // region 增删改查 - 仅保留必要的管理接口，均使用网关鉴权

    /**
     * 创建用户
     *
     * @param userAddRequest
     * @param request
     * @return
     */
    @PostMapping("/add")
    public BaseResponse<Long> addUser(@RequestBody UserAddRequest userAddRequest, HttpServletRequest request) {
        if (userAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = new User();
        BeanUtils.copyProperties(userAddRequest, user);
        // 2. 加密
        String encryptPassword = DigestUtils.md5DigestAsHex((SALT + user.getUserPassword()).getBytes());
        // 3. 分配 accessKey, secretKey
        String accessKey = DigestUtil.md5Hex(SALT + user.getUserAccount() + RandomUtil.randomNumbers(5));
        String secretKey = DigestUtil.md5Hex(SALT + user.getUserAccount() + RandomUtil.randomNumbers(8));
        user.setUserPassword(encryptPassword);
        try {
            boolean result = userService.save(user);
            if (!result) {
                throw new BusinessException(ErrorCode.OPERATION_ERROR);
            }
            return ResultUtils.success(user.getId());
        }catch (Exception e) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "用户名已存在或其他错误");
        }
    }

    /**
     * 更新用户
     *
     * @param userUpdateRequest
     * @param request
     * @return
     */
    @PostMapping("/update")
    public BaseResponse<Boolean> updateUser(@RequestBody UserUpdateRequest userUpdateRequest, HttpServletRequest request) {
        if (userUpdateRequest == null || userUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = new User();
        BeanUtils.copyProperties(userUpdateRequest, user);
        try {
            boolean result = userService.updateById(user);
            return ResultUtils.success(result);
        }catch (DuplicateKeyException e) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, e.getMessage());
        }
    }

    /**
     * 根据 id 获取用户
     *
     * @param id
     * @param request
     * @return
     */
    @GetMapping("/get")
    public BaseResponse<UserVO> getUserById(int id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getById(id);
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return ResultUtils.success(userVO);
    }

    /**
     * 获取用户列表
     *
     * @param userQueryRequest
     * @param request
     * @return
     */
    @GetMapping("/list")
    public BaseResponse<List<UserVO>> listUser(UserQueryRequest userQueryRequest, HttpServletRequest request) {
        User userQuery = new User();
        if (userQueryRequest != null) {
            BeanUtils.copyProperties(userQueryRequest, userQuery);
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>(userQuery);
        List<User> userList = userService.list(queryWrapper);
        List<UserVO> userVOList = userList.stream().map(user -> {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return userVO;
        }).collect(Collectors.toList());
        return ResultUtils.success(userVOList);
    }

    /**
     * 分页获取用户列表
     *
     * @param userQueryRequest
     *
     * @return
     */
    @GetMapping("/list/page")
    public BaseResponse<Page<UserVO>> listUserByPage(UserQueryRequest userQueryRequest) {
        long current = 1;
        long size = 10;
        User userQuery = new User();
        if (userQueryRequest != null) {
            BeanUtils.copyProperties(userQueryRequest, userQuery);
            current = userQueryRequest.getCurrent();
            size = userQueryRequest.getPageSize();
        }
        QueryWrapper<User> queryWrapper = new QueryWrapper<>(userQuery);
        Page<User> userPage = userService.page(new Page<>(current, size), queryWrapper);
        Page<UserVO> userVOPage = new PageDTO<>(userPage.getCurrent(), userPage.getSize(), userPage.getTotal());
        List<UserVO> userVOList = userPage.getRecords().stream().map(user -> {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            return userVO;
        }).collect(Collectors.toList());
        userVOPage.setRecords(userVOList);
        return ResultUtils.success(userVOPage);
    }

    // 添加获取用户消息接口
    /**
     * 获取用户消息
     *
     * @param userId 用户ID
     * @param current 当前页码
     * @param size 每页大小
     * @return 消息分页列表
     */
    @GetMapping("/getMessages")
    public BaseResponse<Page<Message>> getMessages(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size) {
        
        // 创建分页对象
        Page<Message> messagePage = new Page<>(current, size);
        
        // 创建查询条件
        QueryWrapper<Message> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq(userId != null, "userId", userId);
        queryWrapper.orderByDesc("createTime"); // 按创建时间倒序排列
        
        // 执行分页查询
        Page<Message> result = messageService.page(messagePage, queryWrapper);
        
        return ResultUtils.success(result);
    }
    
    /**
     * 标记消息为已读
     *
     * @param id 消息ID
     * @return 操作结果
     */
    @PostMapping("/readMessage")
    public BaseResponse<String> readMessage(@RequestParam Long id) {
        if (id == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "消息ID不能为空");
        }
        
        // 获取消息
        Message message = messageService.getById(id);
        if (message == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "消息不存在");
        }
        
        // 更新消息状态为已读
        message.setIsRead(1);
        boolean updated = messageService.updateById(message);
        
        // 如果更新成功，同时减少用户未读消息数
        if (updated && message.getUserId() != null) {
            User user = userService.getById(message.getUserId());
            if (user != null && user.getUnReadMessage() != null && user.getUnReadMessage() > 0) {
                user.setUnReadMessage(user.getUnReadMessage() - 1);
                userService.updateById(user);
            }
        }
        
        return ResultUtils.success(updated ? "标记已读成功" : "标记已读失败");
    }
    // endregion
}
