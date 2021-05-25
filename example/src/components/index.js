/**
 * Date Tue May 25 2021 12:53:49 GMT+0800 (GMT+08:00)
 * 组件自动化注册
 */
import Vue from 'vue/dist/vue.esm.js';
Vue.component('component1', () => import('/Users/candice/practiceWorkspace/AUTOMATIC-WEBPACK-PLUGIN/example/src/components/component1'));
Vue.component('blocks', () => import('/Users/candice/practiceWorkspace/AUTOMATIC-WEBPACK-PLUGIN/example/src/components/component1/blocks'));