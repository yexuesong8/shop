## Rabbit Framework

```bash
# 克隆项目
git clone git@192.168.10.117:chenquan/rabbit-framework-web.git

# 进入项目目录
cd rabbit-framework-web

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 发布

```bash
# 构建开发环境
npm run build:dev

# 构建测试环境
npm run build:test

# 构建生产环境
npm run build:prod
```

## 在项目中使用rabbit
引入rabbit的install方法进行初始化安装
  ```
  import { install } from "@rabbit.do/rabbit";
  
  install();
  ```
install方法目前接收一个对象参数，包括一下几项：
```
routes: array,  需要注册的路由
store: object({ store名称: vuex module对象 }), 需要注册的vuex store
setting: object, 初始化的项目系统参数
loadView: function, 动态加载页面方法，(item) => (resolve) => require([`@/views/${item.component}`], resolve)，每个项目基本一致，从外面传入是因为方便rabbit插件打包（注意事项第4条）
routeHandler： function, 处理路由的方法，必须返回需要使用的路由信息
```
install方法的返回值有以下两项：
```
const { store, router } = install({ ... });

store: vuex store实例
router: vue-router 路由实例
```

## 注意事项

- 自定义路由,需要在项目目录下新建router.js添加路由配置
    import router from "@rabbit/router";
    router.addRoute(routes); // 注意如果覆盖rabbit默认路由 需要修改匹配规则 // https://github.com/vuejs/vue-router/issues/2886
然后在main.js中引入router.js文件

- 在rabbit中新建页面，先在菜单管理中配置页面参数，配置完成后需要在/src/router/router-config.js文件中添加对应的配置（因为打包后项目里不能通过动态引入的方式加载页面，需要先配置好路由直接匹配，TODO：找其它更好的解决方式）

- 自定义store只需要在src/store中引入即可

- 所有动态加载的页面或组件都需要放在/src/views/dynamic目录下，以`@/views/dynamic/${path}`引入，
这样是为了优化插件打包大小。如用“@/views/${path}”引入，则会打包views目录下所有文件。目前没找到其它优化
方法

- 插件打包时会有一些指令配置，为了保证在本地开发时能正常运行， 指令注册代码参考：
    ```
    import Directive from "...";
    import Vue from "vue";
    
    Vue.directive('Directive', Directive);
    ```


## package
````
本地package： npm pack
安装本地包： npm install D:\project\rabbit-framework-web\rabbit-0.0.2.tgz
````

## 插件

### 正式环境插件的实现
```
1. 'npm run pack:plugin'命令： /scripts/webpack.plugin.js打包所有插件，打包时会给每个文件添加上hash值（当前时间戳），并在/lib目录中生成plugin-hash.txt文件记录此hash值（方便其它项目使用引用对应js、css）
2. 'npm run pack:plugin-loader'命令：/scripts/webpack.plugin.rabbit.js打包排除插件后的rabbit核心代码（包括业务组件、公用方法等），生成rabbit.plugin.js
3. 'node scripts/generate-core-file.js'命令：/scripts/generate-core-file.js复制已有的核心库文件到dist/core目录, 同时通过/scripts/utils.writePluginJs.js方法依据/src/plugin/inject/plugins.json生成/src/plugin/inject/plugins.js
4. 'npm run pack:gen-html'命令：/scripts/generate-html.js将核心库的script标签、link标签添加到index.html中
5. 'node scripts/generate-plugin-file.js'命令：/scripts/generate-plugin-file.js依据/src/plugin/inject/plugins.json中的配置，将需要用的插件复制到dist/plugins目录中
6. 'npm run pack:plugin-core'命令：/scripts/rollup.plugin.core.js将/src/plugin/loader.js,以及由/src/plugin/inject/plugins.json生成的/src/plugin/inject/plugins.js编译到dist/core目录中
7. 项目运行时，loader.js读取plugin.js中的配置，然后加载每个插件的js文件，插件js会调用loader.js的路由注册方法、样式注册方法，以及调用rabbit.plugin.js的store注册方法以及其它基础配置注册
```

### 开发环境插件模式的实现
```
1. 'npm run gen:plugin-dev-route'命令：/scripts/generate-plugin-route.js根据/src/plugin/inject/plugins.json中的配置（排除项目自己的插件配置），生成/src/entry/plugin-route.js。plugin-route.js中引入了注册插件的路由配置文件、插件js文件、样式文件，导出供/src/entry/plugin.js使用
2. /src/entry/plugin.js引入rabbit中的router、store以及plugin-route.js导出的配置项，执行loader.js相同的逻辑进行路由替换
3. /src/entry/main.js 根据执行环境动态引入/src/entry/plugin.js
```

### 插件的打包与使用
1.在/plugin/provide目录下新建插件目录，包含3个文件：index.js（插件具体内容配置，需要完成页面组件的引入、注册以及路由、样式的注册，然后导出）、routes.json（插件路由信息配置文件，其它项目在使用插件的时候引入routes.json进行配置）、entry.js（插件打包入口）。示例：

index.js
```
import ComponentName1 from "./demo1";
import ComponentName2 from "./demo2";

<!-- 如果通过vuex注册了store，需要执行一下代码 -->
import { store } from "@/entry/lib";
import demoStore from "@/store/demo/index";
store.registerModule("demo", demoStore);
<!---->

const routes = require("./routes.json");

const components = [
  ComponentName1,
  ComponentName2,
];

const install = function(Vue) {
  components.forEach(component => {
    if (component.name) Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

if (typeof window !== 'undefined' && window.loader) {
  window.loader.installPluginRoute("rabbit", "demo", routes);
  // 如果有样式，需要注册样式文件
  window.loader.loadPluginStyle("rabbit", "demo");
}

export default {
  install,
  ComponentName1,
  ComponentName2,
};

```

routes.json
```
[
  {
    "path": "/rabbit/page/demo1",
    // 注意组件名称必须与vue文件中定义的name属性一致(在loader.js中使用)
    "componentName": "ComponentName1",
  },
  {
    "path": "/rabbit/page/demo2",
    "componentName": "ComponentName2"
  }
]
```
entry.js
```
module.exports = {
  demo: "./src/plugin/provide/demo/index.js",
};
```

demo2同上。

3.打包，执行npm包发布命令

### 插件的使用

在/src/plugin/inject/plugins.json 中添加需要使用的插件配置,格式为：<br>
<项目名>.<模块名称> 示例：
```
[
  "rabbit.demo1",
  "rabbit.demo2"
]
```
