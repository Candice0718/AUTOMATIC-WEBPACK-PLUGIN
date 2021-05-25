/**
 *  Date Tue May 25 2021 13:29:53 GMT+0800 (GMT+08:00)
 *  路由自动化注册
 */
import VueRouter from 'vue-router';

// 路由配置
const routes = [{
        path: '/',
        redirect: '/page1'
    },
    {
        path: '/page1',
        component: () => import('/Users/candice/practiceWorkspace/AUTOMATIC-WEBPACK-PLUGIN/example/src/pages/page1')
    }, {
        path: '/page2',
        component: () => import('/Users/candice/practiceWorkspace/AUTOMATIC-WEBPACK-PLUGIN/example/src/pages/page2')
    },
];

// 实例化路由
const router = new VueRouter({
    routes
});
export default router;