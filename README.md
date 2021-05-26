# AUTOMATIC-WEBPACK-PLUGIN
组件自动化注册、页面自动化注册

## 安装

```bash
npm install automatic-webpack-plugin
```

## 需要环境

- webpack >= 4
- Nodes >= 8

## 配置参数

+ useFile[boolean] 
default:     false
description: 是否监听文件（默认只监听文件夹）
+ maxlevel[string]
default:     1
description: 文件监听层级
+ inPath[string]
default:     没有默认必传参数
description: 监听的文件路径
+ outPath[string]
default:     inPath + '/index.js'
description: 自动生成的文件
+ templateEach[function]
default:     没有默认必传参数
param:      fileName[文件名称]
param:      filePath[文件路径]
description 需要遍历生成的模板
+ out[function]
default     template => template
param:      template[遍历生成的文本]
param:      modules[模块]
description: 最终生成的文本

## 示例（详细配置见example）

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

