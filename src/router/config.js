import Home from '../views/Home.vue'

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/music',
        children: [{
                path: 'music',
                name: 'music',
                component: () => import('@/views/Music')
            },
            {
                path: 'ranking',
                name: 'ranking',
                component: () => import('@/views/Ranking')

            },
            {
                path: 'singer',
                name: 'singer',
                component: () => import('@/views/Singer')

            }
        ]
    },
    {
        path: '/details',
        name: 'details',
        component: () => import('@/views/Details')
    },
    {
        path: '*',
        redirect: '/'
    }
]

// 公开配置
export default {
    scrollBehavior(to, from, savePosition) {
        return {
            x: 0,
            y: 0
        }
    },
    routes,
    mode: 'history'
}
