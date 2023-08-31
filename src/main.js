import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import router from './router'
import OnoffToggle from 'vue-onoff-toggle'
import DataTable from 'v-data-table'

Vue.config.productionTip = false

export const pythonBackEnd = axios.create({
  baseURL: "http://ejtradingpython-env.eba-ifkwyb3y.us-east-2.elasticbeanstalk.com/api"
});

axios.defaults.baseURL =  "http://127.0.0.1:5000/api/"
Vue.prototype.$http = axios;

Vue.use(OnoffToggle)
Vue.use(DataTable)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


