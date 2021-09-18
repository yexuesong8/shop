### v2.0.0
```
新增：
  1、自定义主题

运行环境：monkey-web@1.0.8、element-ui@2.16.0、rabbit-java@1.2.6
```

### v1.0.15
```
新增：
  1、权限管理（接口列表、接口分类、数据分类、数据授权方式、数据授权、表、字段）
修改：
  1、系统管理-菜单管理新增编辑页面
  2、系统管理-角色管理分配角色接口修改，新增角色树回显
  3、系统管理-人员管理新增编辑页面新增工号字段

运行环境：monkey-web@1.0.7、element-ui@2.15.1、rabbit-java@1.2.6
```
### v1.0.8
```
新增：
  1、黑白名单规则
  2、新增Map插件
  3、新增ExcelImport、FileUpload组件
  4、坐标选择组件参数优化
  5、修改字典选择器wants为空时显示异常
  6、table单字段、多字段排序

运行环境：monkey-web@1.0.7、element-ui@2.15.1、rabbit-java@1.2.6
```

### v1.0.7
```
修改：
  1、修改路由方法$addRoute，新增插件添加路由方法$addPluginRoute
  2、修改rabbit文件更新脚本
  3、detail-form添加默认参数

运行环境：monkey-web@1.0.6、element-ui@2.15.1、rabbit-java@1.2.1-1.2.5
```

### v1.0.6

```
新增：
  1、mock
  2、node server.js开启GZIP

修改:
  1、修改UI库为@monkey.do/element-ui
  2、build目录名称改为scripts
  3、删除运维deployment目录
  4、Page: detail-form支持传入hide显示隐藏组件,table支持固定表格
  5、setting.js: 添加isAuthorization是否需要权限认证配置
  6、注释nprogress、router-view transition动画

运行环境：monkey-web@1.0.6、element-ui@2.15.1 rabbit-java@1.2.1
```

### v1.0.5

` 2021-03-01 `

```
新增：
  1、number指令
修改：
  1、人员选择器支持筛选
  2、系统配置优化
  3、页面设计器代码优化
  4、page组件FormItem中el-input默认maxlength为30
  5、page组件表单支持默认参数

运行环境：monkey-web@1.0.5、rabbit-java@1.2.1

```
### v1.0.4

` 2021-02-19 `

```
新增：
  1、添加报表、流程设计、首页设计器、页面设计器
  2、插件打包
  3、系统参数、同步钉钉
修改：
  1、服务资源状态数据获取方式修改
  2、select-selector命名修改
  3、人员选择器支持筛选
  4、字典选择器将后端返回值处理为字符串

运行环境：monkey-web@1.0.4、rabbit-java@1.2.1
```

### v1.0.3

` 2021-01-27 `

```
新增：
  1、DetailForm详情组件
  2、坐标选择器搜索地址功能
修改：
  1、Page组件
    - 重置参数修改
    - 删除Page/Toolbar默认值
    - 内置detail-form
    - 默认支持find-form el-input回车查询
  2、修改ExtraContent移除子节点方法
  3、MemberSelector支持自定义标题
  4、人员管理、岗位管理、字典管理用Page组件重构
  5、添加报表、流程设计、首页设计器
  6、钉钉登录修改
  7、修改角色管理分配角色不能点击与回显
```

### v1.0.2

`2021-01-06`

    1、添加vetur vscode组件代码提示
    2、组件优化
    3、打包配置优化
    4、添加Page组件及相关组件