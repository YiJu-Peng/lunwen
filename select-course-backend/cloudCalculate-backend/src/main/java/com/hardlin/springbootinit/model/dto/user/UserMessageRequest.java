package com.hardlin.springbootinit.model.dto.user;

import com.hardlin.springbootinit.common.PageRequest;
import lombok.Data;

import java.io.Serializable;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/27 11:05
 */
@Data
public class UserMessageRequest extends PageRequest implements Serializable {
    Long userId;
}
     