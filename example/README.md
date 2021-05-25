# example

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 测试步骤

1. 创建`automatic-webpack-plugin`软连接

   ```bash
   yarn link
   ```

2. 进入`example`目录，使用`automatic-webpack-plugin`软连接

   ```
   cd example
   yarn link "automatic-webpack-plugin"
   ```

3. 在`vue.config.js`引入`automatic-webpack-plugin`并添加相关配置

   ```javascript
   const path = require('path');
   const AutoMaticWebpackPlugin = require('automatic-webpack-plugin');
   
   module.exports = {
       configureWebpack: {
           plugins: [
               new AutoMaticWebpackPlugin([
                   /************组件自动化注册************/
                   {
                       // 使用文件模式
                       useFile: false,
                       /*********** 组件自动化注册 ***********/
                       // 文件监听等级
                       maxlevel: 2,
                        // 监听./src/components/*下的文件夹
                       inPath: './src/components',
                       outPath: './src/components/index.js',
                       // 模版
                       // fileName: 文件夹名字
                       // filePath: 文件夹路径
                       templateEach: (fileName, filePath) => {
                           return `Vue.component('${fileName}', () => import('${filePath}'));`
                       },
                       /**
                        * 输出模版
                        * template: 模版名称
                        * modules: 模版模块名称
                        */
                       out: (template, modules) => {
                           return `
                               /**
                                * Date ${new Date()}
                                * 组件自动化注册
                               */
                              import Vue from 'vue/dist/vue.esm.js';
                              ${template}
                           `;
                       },
                       // 自动新建index入口文件
                       addIndex: [
                           {
                               // 创建目录
                               state: 'dir',
                               name: 'blocks'
                           },
                           {
                               // 创建默认index.vue
                               state: 'file',
                               name: 'blocks/index.js',
                               template: (fileName, filePath) => {
                                   return `
                                       export default {
                                           name: '${fileName}-template'
                                       }
                                   `;
                               }
                           },
                           {
                               // 默认样式
                               state: 'file',
                               name: 'style.css',
                               template: (fileName, filePath) => {
                                   return `
                                       .${fileName} {}
                                   `;
                               }
                           },
                           {
                               // 默认逻辑js
                               state: 'file',
                               name: 'page.js',
                               template: (fileName, filePath) => {
                                   return `
                                       export default {
                                           name: '${fileName}'
                                       }
                                   `;
                               }
                           },
                           {
                               // 创建默认index.vue
                               state: 'file',
                               name: 'index.vue',
                               template: (fileName, filePath) => {
                                   return `
                                       <template>
                                           <div>
                                               <h3>路由${fileName}</h3>
                                           </div>
                                       </template>
                                       <style scoped src='./style.css'></style>
                                       <script src='./page.js'></script>
                                   `;
                               }
                           }
                       ]
                   },
                   /************路由自动化注册*************/
                   {
                       maxLength: 1,
                       inPath: './src/pages',
                       // 模板
                       // fileName: 文件夹名称
                       // filePath: 文件夹路径
                       templateEach: (fileName, filePath) => {
                           return `{ path: '/${fileName}', component: () => import('${filePath}') },`;
                       },
                       /** 
                        * 输出模板
                        * template: 模板名称
                        * modules: 模板模块名称
                       */
                       out: (template, modules) => {
                           return `
                               /**
                                *  Date ${new Date()}
                                *  路由自动化注册
                                */
                               import VueRouter from 'vue-router';
   
                               // 路由配置
                               const routes = [
                                   { path: '/', redirect: '/page1' },
                                   ${template}
                               ];
   
                               // 实例化路由
                               const router = new VueRouter({
                                   routes
                               });
                               export default router;
                           `;
                       },
                       addIndex: [
                           {
                               // 创建目录
                               state: 'dir',
                               name: 'blocks'
                           },
                           {
                               // 创建默认index.vue
                               state: 'file',
                               name: 'blocks/index.js',
                               template: (fileName, filePath) => {
                                   return `
                                       export default {
                                           name: '${fileName}-template'
                                       }
                                   `;
                               }
                           },
                           {
                               // 默认样式
                               state: 'file',
                               name: 'style.css',
                               template: (fileName, filePath) => {
                                   return `
                                       .${fileName} {}
                                   `;
                               }
                           },
                           {
                               // 默认逻辑js
                               state: 'file',
                               name: 'page.js',
                               template: (fileName, filePath) => {
                                   return `
                                       export default {
                                           name: '${fileName}'
                                       }
                                   `;
                               }
                           },
                           {
                               // 默认路由
                               state: 'file',
                               name: 'index.vue',
                               template: (fileName, filePath) => {
                                   return `
                                       <template>
                                           <div>
                                               <h3>路由${fileName}</h3>
                                           </div>
                                       </template>
                                       <style scoped src='./style.css'></style>
                                       <script src='./page.js'></script>
                                   `;
                               }
                           }
                       ]  
                   }
               ])
           ]
       }
   }
   ```

4. 编译、运行开发环境

   ```
   npm run serve
   ```

   



