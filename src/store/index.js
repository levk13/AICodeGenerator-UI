import { createStore } from "vuex";
import { auth } from  "../services/auth.module"

const store = createStore({
   modules: {
    auth,
    }
  }
);



export default store;