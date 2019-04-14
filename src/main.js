import Vue from 'vue'
import App from './App.vue'
import {store} from './store'
import {router} from './router'

// Dependencies
import ElementUI from 'element-ui';

// Miscellaneous
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en';

// Fully import dependencies
Vue.use(ElementUI, {locale});

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
