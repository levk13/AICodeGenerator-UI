import { createWebHistory, createRouter, isNavigationFailure } from "vue-router";
import AICodeGeneratorJira from '../views/AICodeGeneratorJira';
import Home from '../views/Home';
import store from '@/store/index';


const routes = [
 {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/testrunner",
    name: "Testrunner",
    component: AICodeGeneratorJira,
    beforeEnter(to, from, next) {
        if (store.state.auth.status.loggedIn) {
            next();
          }
         else {
          next('/');
        }
      }

}
];




const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to, from, failure) => {
    console.log('to: ', to);
    console.log('from: ', from);
    if (isNavigationFailure(failure)) {
      console.log('failed navigation', failure)
    }
  })

  export default router 