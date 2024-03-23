import { createWebHistory, createRouter, isNavigationFailure } from "vue-router";
import AICodeGenerator from '../views/AICodeGenerator';
import Home from '../views/Home';
import store from '@/store/index';
import KeywordPrompt from '../views/KeywordPrompt'
import IssueCreator  from "../views/IssueCreator.vue";

const routes = [
 {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/testrunner",
    name: "Testrunner",
    component: AICodeGenerator,
    beforeEnter(to, from, next) {
        if (store.state.auth.status.loggedIn) {
            next();
          }
         else {
          next('/');
        }
      }

},
{
  path: "/prompthelper",
  name: "prompthelper",
  component: KeywordPrompt,
  beforeEnter(to, from, next) {
      if (store.state.auth.status.loggedIn) {
          next();
        }
       else {
        next('/');
      }
    }
  },
  {
    path: "/issuecreator",
    name: "issuecreator",
    component: IssueCreator,
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