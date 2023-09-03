import { createWebHistory, createRouter, isNavigationFailure } from "vue-router";
import AICodeGeneratorJira from '../views/AICodeGeneratorJira';
import Home from '../views/Home';



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