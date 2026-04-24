/*
 * Copyright (c) 2018-2999 杭州有赞科技有限公司 All rights reserved.
 *
 * https://www.youzan.com/
 *
 * 未经允许，不可做商业用途！
 *
 * 版权所有，侵权必究！
 */
package com.hardlin.springbootinit.utils;

import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.plugins.pagination.PageDTO;
import lombok.Data;


import java.util.Collections;
import java.util.List;

/**
 * 分页参数
 * @author hehe
 */

public class PageParam<T> extends PageDTO<T> {

//    public PageParam(long current, long pageSize) {
//        this.size = pageSize;
//        this.current = current;
//    }

    /**
     * 最大每页条数
     */
    private final long MAX_SIZE = 100;

    /**
     * 每页显示条数，默认 10
     */

    private long pageSize = 10;

    /**
     * 当前页
     */

    private long current = 1;

    /**
     * 先查出数据列表
     */

    private List<T> records;
    /**
     * 总数
     */

    private long total = 0;


    public PageParam() {

    }

    @Override
    public List<T> getRecords() {
        return this.records;
    }

    @Override
    public Page<T> setRecords(List<T> records) {
        this.records = records;
        return this;
    }

    @Override
    public long getTotal() {
        return this.total;
    }

    @Override
    public Page<T> setTotal(long total) {
        this.total = total;
        return this;
    }

    @Override
    public long getSize() {
        return this.size;
    }

    @Override
    public Page<T> setSize(long size) {
        if (size > MAX_SIZE) {
            this.size = 100;
        } else {
            this.size = size;
        }
        return this;
    }

    @Override
    public long getCurrent() {
        return this.current;
    }

    @Override
    public Page<T> setCurrent(long current) {
        this.current = current;
        return this;
    }
}
