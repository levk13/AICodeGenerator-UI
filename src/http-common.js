import axios from "axios";
import store  from "./store";
import router from "./router"

  const baseURL =  "http://aicodegenerator-dev.eba-b3dnfxyh.us-east-2.elasticbeanstalk.com/api"
  //const baseURL = "http://127.0.0.1:5000/api"

  const instance = axios.create({
    baseURL
  });


  instance.interceptors.request.use(
  (config) => {
  
    config.headers["Access-Control-Allow-Origin"] = "*"
    config.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    config.headers["Access-Control-Allow-Headers"] = "Origin, Content-Type, X-Auth-Token"
    

    const token = localStorage.getItem('auth');
      if (token == null) return config;
      console.log(token)

      if (token) {
          config.headers['Authorization'] = `${token}`;
      }
      
      var orgId = 0 ;
      if(store.state.auth.user != null)
        orgId =  store.state.auth.user.org_id

      console.log(orgId)
      config.headers['orgId'] = orgId
      return config;
  },

  (error) => {
    console.log('HIT Interceptor')
      return Promise.reject(error);
  }
);
instance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  console.log(error)
  if (error.response.status === 401) {
    console.log("hit 401")
    store.dispatch('auth/logout',store.state.auth.user.id)
    router.push('/')
  }
  return Promise.reject(error)
})


export default instance;