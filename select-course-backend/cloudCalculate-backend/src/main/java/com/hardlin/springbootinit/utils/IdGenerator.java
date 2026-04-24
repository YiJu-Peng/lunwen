package com.hardlin.springbootinit.utils;

import java.security.SecureRandom;
import java.util.UUID;

/**
 * @author DawnCclin dawn-lin.xyz @努力的林
 * @description
 * @time 2024/12/14 22:55
 */
public class IdGenerator {

    /**
     * 生成一个16位的唯一流水号
     * @return 16位的流水号
     */
    private static final SecureRandom random = new SecureRandom();

    /**
     * 生成一个指定长度的纯数字流水号
     * @param length 流水号的长度
     * @return 指定长度的纯数字流水号
     */
    public static Long generateRandomNumber(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int digit = random.nextInt(10); // 生成0-9之间的随机数
            sb.append(digit);
        }
        return Long.valueOf(sb.toString());
    }
}
     