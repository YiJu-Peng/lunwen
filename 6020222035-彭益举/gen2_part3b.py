#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Part3b: 第4-5章补充内容"""
from docx.shared import Pt
from docx.oxml.ns import qn

def write_ch4_5_expanded(doc, body, h1, h2, h3, insert_fig, tbl_add, code_block):

    h1('第 4 章  系统设计（补充内容）')

    h2('4.1  Kubernetes 弹性部署方案（扩展）')
    body('尽管本系统在开发阶段采用Docker Compose进行单机编排，但在设计之初已充分考虑了向Kubernetes迁移的路径规划，确保系统架构具备弹性扩展能力。Kubernetes通过Deployment资源定义服务的副本数量（replicas）与镜像版本，通过Service资源实现ClusterIP内部负载均衡，通过Ingress资源实现外部流量路由。在本系统的Kubernetes部署方案中，select-service（选课微服务）作为高并发业务的核心组件，配置HPA（Horizontal Pod Autoscaler）根据CPU利用率自动扩缩容：当CPU利用率超过70%时，HPA触发扩容（最大副本数10），当CPU利用率低于30%时触发缩容（最小副本数2），实现资源的按需分配。Kubernetes弹性部署架构如图4.3所示。')
    insert_fig('fig_05_p34.png','图 4.3  Kubernetes 弹性部署架构图',14)

    h2('4.2  负载均衡动态扩缩容时序（扩展）')
    body('负载均衡模块的动态扩缩容时序图清晰展示了从流量激增到自动扩容的完整触发链路：当大量学生同时发起选课请求时，Spring Cloud Gateway检测到下游select-service实例响应时间上升，同步触发Kubernetes Metrics Server的CPU指标采集；当HPA检测到CPU利用率超过配置阈值时，向Kubernetes API Server发起扩容请求，Kubernetes调度器将新Pod分配至负载较轻的节点，待新实例成功启动并注册至Nacos后，Gateway的负载均衡器自动将新实例纳入路由列表，实现无缝水平扩展。负载均衡动态扩缩容时序图如图4.4所示。')
    insert_fig('fig_06_p35.png','图 4.4  负载均衡动态扩缩容时序图',14)

    h2('4.3  数据库索引设计（扩展）')
    body('索引设计对查询性能的影响很直接，笔者在开发初期没有特别注意索引，后来在做压测时发现推荐接口在数据量稍大时就明显变慢，排查发现是curriculum表的全表扫描导致的，加了索引之后响应时间下降了一个数量级。')
    body('具体来说，curriculum表的高频查询是"按专业+审核状态筛课程"，所以建了联合索引INDEX idx_major_check(major, is_check, is_delete)来支持推荐服务的查询。student表经常按user_id关联查询，建了单列索引INDEX idx_user_id(user_id)。enrollment表需要频繁判断"这个学生是否已经选了这门课"，为此建了联合唯一索引UNIQUE INDEX uk_student_curriculum(student_id, curriculum_id, is_delete)，这个索引既做唯一性约束防止重复写入，也能加速重复选课的校验查询。enrollment_log表按request_id查幂等日志，建了唯一索引UNIQUE INDEX uk_request_id(request_id)。加上索引之后关键接口在百万级数据量下响应能控制在10ms以内。')

    doc.add_page_break()

    h1('第 5 章  详细实现（补充内容）')

    h2('5.1  推荐模块数据流设计（扩展）')
    body('课程推荐模块的完整数据流设计体现了跨服务数据整合的工程考量：主服务（main-service）的CourseRecommendationService首先通过StudentMapper.selectById(studentId)从本地数据库查询学生信息，获取专业字段（major）；随后通过OpenFeign的EnrollmentClient向select-service的/api/curriculums/page接口发起HTTP请求，携带major参数进行专业过滤分页查询；select-service返回课程安排列表（Curriculum对象列表）；主服务接收到Curriculum数据后，通过SubjectMapper.selectById(curriculum.getSubjectId())补充查询课程基础信息（如课程名称、学分），并与授课时间、授课地点等Curriculum字段合并，构建CourseRecommendVO视图对象；最终设置推荐分数（专业匹配90分/通用50分）和推荐理由文本后，排序输出。整个流程涉及两个微服务的协作与两个数据库的查询，通过OpenFeign异步的底层HTTP调用实现毫秒级的跨服务数据整合。')
    body('推荐接口每次都要跨服务拿数据再排序，频繁调用开销不小，所以笔者在CourseRecommendationService里加了一层Redis缓存：同一专业的推荐结果缓存在Redis里，键格式是"course:recommend:{major}"，TTL设10分钟。同专业的后续请求直接读缓存，不再触发Feign调用和排序。更新策略是双管齐下：一是用@Scheduled定时任务每10分钟主动刷新热门专业的缓存，二是TTL到期后下次请求触发被动重建。这样既避免缓存长期不更新导致数据过时，又能在大部分时间里命中缓存节省计算。')

    h2('5.2  选课微服务独立部署设计（扩展）')
    body('选课微服务（select-service）作为高并发业务的核心组件，在部署架构上进行了特殊优化。首先，select-service单独配置了独立的MySQL连接池（HikariCP），池大小设置为最小10个连接、最大100个连接，连接超时时间设为30秒，空闲连接保持时间为600秒，确保高并发场景下连接不成为瓶颈。其次，select-service独立配置了JVM参数（-Xms512m -Xmx1024m -XX:+UseG1GC），使用G1垃圾回收器减少GC停顿时间，降低高并发场景下的响应时间抖动。再次，select-service通过Nacos配置中心动态管理Redisson连接参数（Redis地址、连接超时、最大连接数），支持在不重启服务的情况下调整分布式锁的Redis后端配置，为生产环境的在线调优提供了便利条件。')
    body('在API设计方面，选课微服务对外暴露的接口遵循RESTful设计规范：POST /api/enrollments/select（选课请求，参数：studentId、curriculumId、requestId）、DELETE /api/enrollments/{id}（退课请求）、GET /api/enrollments/student/{studentId}（查询学生已选课程列表）、GET /api/enrollments/curriculum/{curriculumId}（查询课程已选学生列表，供教师查看）。接口通过Sa-Token注解进行权限控制：选课/退课接口要求登录且角色为student，课程已选学生查询接口要求登录且角色为teacher或admin，确保接口访问的安全性。')

    h2('5.3  前端组件设计（扩展）')
    body('前端页面都是React函数式组件，用Hooks管理状态。以推荐页面为例：最外层的RecommendPage组件在挂载时通过useEffect触发推荐接口请求，用useState分别维护加载状态和推荐数据列表。CourseCard是下面的子组件，接收单门课程的数据作为props，展示课程名称、时间、教师、推荐理由这些信息，下面有个"立即选课"按钮。点击按钮会弹出EnrollmentModal确认弹窗，弹窗打开的同时异步调用冲突检测接口，结果用绿色（无冲突）和红色（有冲突）区分展示，学生确认后再提交选课。')
    body('前端性能方面做了几处优化：CourseCard用React.memo包了一下，避免父组件状态变化带着子组件一起重渲染；课程列表在数量超过100条时启用虚拟列表，只渲染视口内的节点；各功能模块用React.lazy+Suspense做懒加载，首屏只打包核心代码，加载时间控制在2秒内。Axios封装了统一的请求拦截器和响应拦截器，请求头里自动带上Token，响应里统一处理401（Token过期跳登录页）和403（权限不足提示），不用每个接口单独写。')

    h2('5.4  系统整体联调与集成测试（扩展）')
    body('系统在功能模块独立开发完成后进行了全链路集成测试，重点验证跨服务数据流的正确性。集成测试场景一：完整选课推荐链路验证——模拟软件工程专业学生登录系统，访问推荐接口，验证返回的推荐列表中专业相关课程（major包含"软件工程"）排名优先于通用选修课程；模拟计算机科学专业学生访问推荐接口，验证专业标签差异是否正确影响推荐结果排序。集成测试场景二：选课-库存-通知全链路验证——创建测试课程（stock=1），模拟两个并发学生同时发起选课请求（使用两个不同的requestId），验证最终选课成功的学生只有一个，另一个学生收到"课程已满"的失败通知，enrollment表中只有一条记录，curriculum表的stock为0（无超卖）。集成测试场景三：冲突检测与选课联动验证——为测试学生预先选定一门周一上午8:00-10:00的课程，然后尝试选择周一上午9:00-11:00的另一门课程，验证弹窗中是否正确展示冲突信息及冲突原因描述。三类集成测试场景均一次通过，验证了系统各模块间数据流的正确性与一致性。')

    doc.add_page_break()
