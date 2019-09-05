import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'

import FastClick from 'fastclick'
FastClick.attach(document.body)

// axios
axios.defaults.baseURL = 'http://localhost:3000/'
Vue.use(VueAxios, axios)

// 公共组件
import Loading from './components/Loading'
import MusicHeader from './components/MusicHeader'
Vue.component(Loading.name, Loading)
Vue.component(MusicHeader.name, MusicHeader)

// 公共样式
import './assets/css/reset.css'
// rem
import './assets/js/rem'
// mint-ui样式
import 'mint-ui/lib/style.css'
// mint-ui组件
import {
    Header,
    Button,
    Swipe,
    SwipeItem,
    Navbar,
    TabItem,
    Loadmore,
    Spinner
} from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);
Vue.component(Spinner.name, Spinner);
Vue.component(Header.name, Header)
Vue.component(Button.name, Button)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Navbar.name, Navbar)
Vue.component(TabItem.name, TabItem)

//懒加载配置
Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/img/touxiang.png'),
    loading: require('@/assets/img/touxiang.png'),
    attempt: 1
})

// 过滤器
Vue.filter('changeNumber', (value) => {
    if (value == undefined) {
        return 0;
    } else if (value > 100000000) {
        return (value / 100000000).toFixed(1) + "亿";
    } else {
        return (value / 10000).toFixed(1) + "万";
    }
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
