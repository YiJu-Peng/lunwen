declare namespace API {
  type addStudentUsingPOSTParams = {
    id?: number;
    major?: string;
    studentId?: number;
    studentName?: string;
    userId?: number;
  };

  type addTeacherUsingPOSTParams = {
    id?: number;
    level?: string;
    teacherId?: number;
    teacherName?: string;
    userId?: number;
  };

  type BaseResponse = {
    code?: number;
    data?: Record<string, any>;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListUserVO_ = {
    code?: number;
    data?: UserVO[];
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageMessage_ = {
    code?: number;
    data?: PageMessage_;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponsePostVO_ = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type checkCurriculumUsingPOSTParams = {
    /** curriculumId */
    curriculumId?: number;
  };

  type checkUsingGETParams = {
    /** echostr */
    echostr?: string;
    /** nonce */
    nonce?: string;
    /** signature */
    signature?: string;
    /** timestamp */
    timestamp?: string;
  };

  type ClassesAvgDTO = {
    averageScore?: number;
    subjectName?: string;
  };

  type ClassFailCountDTO = {
    className?: string;
    failRatio?: number;
  };

  type CollegeCountDTO = {
    name?: string;
    value?: number;
  };

  type CourseAverageScoreDTO = {
    averageScore?: number;
    subjectId?: number;
    subjectName?: string;
  };

  type Curriculum = {
    id?: number;
    subjectId?: number;
    teacherId?: number;
    teachingTime?: Date;
    location?: string;
    grade?: string;
    major?: string;
    isCheck?: number;
    remarks?: string;
    stock?: number;
    isStock?: number;
    createTime?: Date;
    updateTime?: Date;
  };

  type CurriculumVO = {
    createTime?: string;
    grade?: string;
    id?: number;
    isCheck?: number;
    location?: string;
    major?: string;
    remarks?: string;
    subjectId?: number;
    subjectName?: string;
    teacherId?: number;
    teacherName?: string;
    teachingTime?: string;
    updateTime?: string;
  };

  type deleteCurriculumUsingDELETEParams = {
    /** id */
    id: number;
  };

  type DeleteRequest = {
    id?: number;
  };

  type deleteStudentUsingDELETEParams = {
    /** id */
    id?: number;
  };

  type deleteTeacherUsingDELETEParams = {
    /** id */
    id?: number;
  };

  type dropCourseUsingPOSTParams = {
    courseId: number;
    studentId: string | number;
  };

  type EnrollmentDTO = {
    curriculumId?: number;
    userId?: number;
  };

  type getCurriculumByIdUsingGETParams = {
    /** id */
    id: number;
  };

  type getMessagesUsingGETParams = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getStudentByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getStudentEnrollmentsUsingGETParams = {
    studentId: string | number;
  };

  type getStudentsUsingGETParams = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    optimizeJoinOfCountSql?: boolean;
    'orders[0].asc'?: boolean;
    'orders[0].column'?: string;
    pages?: number;
    'records[0].id'?: number;
    'records[0].major'?: string;
    'records[0].studentId'?: number;
    'records[0].studentName'?: string;
    'records[0].userId'?: number;
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type getTeacherByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getTeachersUsingGETParams = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    optimizeJoinOfCountSql?: boolean;
    'orders[0].asc'?: boolean;
    'orders[0].column'?: string;
    pages?: number;
    'records[0].id'?: number;
    'records[0].level'?: string;
    'records[0].teacherId'?: number;
    'records[0].teacherName'?: string;
    'records[0].userId'?: number;
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type IPageStudent_ = {
    current?: number;
    pages?: number;
    records?: Student[];
    size?: number;
    total?: number;
  };

  type IPageTeacher_ = {
    current?: number;
    pages?: number;
    records?: Teacher[];
    size?: number;
    total?: number;
  };

  type listCurriculumsUsingGETParams = {
    createTime?: string;
    current?: number;
    id?: number;
    isCheck?: number;
    location?: string;
    pageSize?: number;
    remarks?: string;
    sortField?: string;
    sortOrder?: string;
    subjectId?: number;
    subjectName?: string;
    teacherId?: number;
    updateTime?: string;
  };

  type listUserByPageUsingGETParams = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type listUserUsingGETParams = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Message = {
    createTime?: string;
    id?: number;
    isRead?: number;
    message?: string;
    updateTime?: string;
    userId?: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type pageCurriculumsUsingGETParams = {
    createTime?: string;
    current?: number;
    id?: number;
    isCheck?: number;
    location?: string;
    pageSize?: number;
    remarks?: string;
    sortField?: string;
    sortOrder?: string;
    subjectId?: number;
    subjectName?: string;
    teacherId?: number;
    updateTime?: string;
  };

  type PageMessage_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Message[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageParamCurriculumVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    optimizeJoinOfCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: CurriculumVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type PostAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type PostEditRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostFavourQueryRequest = {
    current?: number;
    pageSize?: number;
    postQueryRequest?: PostQueryRequest;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    favourUserId?: number;
    id?: number;
    notId?: number;
    orTags?: string[];
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type readMessageUsingPUTParams = {
    /** id */
    id?: number;
  };

  type ReasonCountDTO = {
    name?: string;
    value?: number;
  };

  type selectCourseUsingPOSTParams = {
    curriculumId?: number;
    userId?: number;
  };

  type Student = {
    id?: number;
    major?: string;
    studentId?: number;
    studentName?: string;
    userId?: number;
  };

  type Teacher = {
    id?: number;
    level?: string;
    teacherId?: number;
    teacherName?: string;
    userId?: number;
  };

  type TeacherCountDTO = {
    averageScore?: number;
    name?: string;
    studentCount?: number;
  };

  type updateCurriculumUsingPUTParams = {
    /** id */
    id: number;
  };

  type updateStudentUsingPUTParams = {
    id?: number;
    major?: string;
    studentId?: number;
    studentName?: string;
    userId?: number;
    /** id */
    id?: number;
  };

  type updateTeacherUsingPUTParams = {
    id?: number;
    level?: string;
    teacherId?: number;
    teacherName?: string;
    userId?: number;
    /** id */
    id?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    gender?: number;
    id?: number;
    isDelete?: number;
    unReadMessage?: number;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userDescription?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    unReadMessage?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UsualScoreDTO = {
    failCount?: number;
    failRate?: number;
    scoreRange?: string;
    totalInRange?: number;
  };

  /**
   * 课程推荐结果视图对象
   */
  type CourseRecommendVO = {
    /**
     * 课程ID
     */
    curriculumId: number;
    
    /**
     * 科目ID
     */
    subjectId: number;
    
    /**
     * 科目名称
     */
    subjectName: string;
    
    /**
     * 上课时间
     */
    teachingTime: string;
    
    /**
     * 上课地点
     */
    location: string;
    
    /**
     * 推荐理由
     */
    recommendReason: string;
    
    /**
     * 推荐分数，用于排序
     */
    recommendScore: number;
  };

  /**
   * 冲突课程视图对象
   */
  type ConflictCourseVO = {
    /**
     * 课程ID
     */
    curriculumId: number;
    
    /**
     * 科目ID
     */
    subjectId: number;
    
    /**
     * 科目名称
     */
    subjectName: string;
    
    /**
     * 上课时间
     */
    teachingTime: string;
    
    /**
     * 上课地点
     */
    location: string;
    
    /**
     * 教师ID
     */
    teacherId: number;
    
    /**
     * 教师名称
     */
    teacherName: string;
    
    /**
     * 冲突原因
     */
    conflictReason: string;
    
    /**
     * 格式化的上课时间字符串
     */
    teachingTimeString: string;
  };
  
  /**
   * 课程冲突检测结果
   */
  type ConflictCheckResult = {
    /**
     * 是否存在冲突
     */
    hasConflict: boolean;
    
    /**
     * 冲突描述
     */
    conflictDescription: string;
    
    /**
     * 冲突课程列表
     */
    conflictCourses: ConflictCourseVO[];
    
    /**
     * 冲突详情
     */
    conflictDetails: string;
    
    /**
     * 待选课程
     */
    targetCourse: Curriculum;
  };

  /**
   * 课程表视图对象
   */
  type ScheduleVO = {
    /**
     * 用户ID
     */
    userId: number;

    /**
     * 对应的学生/教师ID
     */
    personId: number;

    /**
     * 姓名
     */
    name: string;

    /**
     * 用户类型（学生/教师）
     */
    userType: string;

    /**
     * 课程表类型（周课表/学期课表）
     */
    scheduleType: string;

    /**
     * 当前周次/学期信息
     */
    currentPeriod: string;

    /**
     * 课程表数据
     * 外层Map的键是星期几（1-7），值是当天的课程列表
     */
    scheduleData: Record<number, ScheduleCourseItemVO[]>;

    /**
     * 所有课程的列表
     */
    courseList: ScheduleCourseItemVO[];
  };

  /**
   * 课程表项目视图对象
   */
  type ScheduleCourseItemVO = {
    id?: number;
    subjectId?: number;
    teacherId?: number;
    teacherName?: string;
    courseName?: string;
    teachingTime?: Date;
    location?: string;
    dayOfWeek?: number;
    startTime?: number;
    endTime?: number;
    grade?: string;
    major?: string;
    remarks?: string;
  };

  /**
   * 课程表响应对象
   */
  type BaseResponseScheduleVO = {
    code: number;
    data: ScheduleVO;
    message: string;
  };

  /**
   * 获取学生课程表参数
   */
  type getStudentScheduleUsingGETParams = {
    studentId: string | number;
  };

  /**
   * 获取教师课程表参数
   */
  type getTeacherScheduleUsingGETParams = {
    teacherId: number;
  };

  // Sa-Token登录结果类型
  type LoginResult = {
    user: UserVO;
    tokenName: string;
    tokenValue: string;
    loginId: number;
    role: string;
  };

  // Sa-Token登录响应类型
  type BaseResponseLoginResult = {
    code: number;
    data: LoginResult;
    message: string;
  };

  // 用户注册请求类型
  type UserRegisterRequest = {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
  };

  // 分页查询用户请求类型
  type UserQueryRequest = {
    current?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    id?: number;
    userName?: string;
    userRole?: string;
  };

  // 登录用户视图对象
  type LoginUserVO = {
    id: number;
    userName: string;
    userAvatar?: string;
    userProfile?: string;
    userRole: string;
    createTime: string;
  };

  // 登录用户响应类型
  type BaseResponseLoginUserVO_ = {
    code: number;
    data: LoginUserVO;
    message: string;
  };

  // 响应类型 - 字符串响应
  type ResponseString = {
    code?: number;
    message?: string;
    data?: string;
  };

  // 响应类型 - 课程列表响应
  type ResponseCurriculum = {
    code?: number;
    message?: string;
    data?: Curriculum[];
  };

  type checkCourseUsingPOSTParams = {
    curriculumId: number;
  };
}
