window.Vue = require('vue');
import App from './App.vue'
import vOutsideEvents from 'vue-outside-events'

Vue.use(vOutsideEvents)

const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})


const app = new Vue({
    el: '#app',
    template: '<App/>',
    components: { App }
});
