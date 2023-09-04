import http from '../http-common'
class AuthService {
    login(user) {
      return  http.post('userApi/login', {
          email: user.username,
          password: user.password
        })
        .then(response => {
       //   if (response.data.accessToken) {
          console.log(response.data)  
          localStorage.setItem('user', JSON.stringify(response.data));
      //    }
          return response.data;
        });
    }
  
    logout() {
      localStorage.removeItem('user');
    }
  
  //   register(user) {
  //     return axios.post(API_URL + 'signup', {
  //       username: user.username,
  //       email: user.email,
  //       password: user.password
  //     });
  //   }
   }
  
  export default new AuthService();