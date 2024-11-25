import { createApp } from 'vue'
import { createBootstrap } from 'bootstrap-vue-next'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap'
import './assets/styles/_variables.scss'
import './assets/styles/main.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'


createApp(App)
  .use(createBootstrap())
  .use(router)
  .use(store)
  .mount('#app')
