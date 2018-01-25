window.Vue = require('vue');
import App from './App.vue'
import vOutsideEvents from 'vue-outside-events'

Vue.use(vOutsideEvents)

const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});
