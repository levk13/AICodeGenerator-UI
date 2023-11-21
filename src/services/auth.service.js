import http from '../http-common'
class AuthService {
    login(user) {
      return  http.post('userApi/login', {
          email: user.username,
          password: user.password, 
        })
        .then(response => {
       //   if (response.data.accessToken) {
          console.log(response.data)  
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('auth', response.data.auth_token)
      //    }
          return response.data;
        });
    }
  
    logout(id) {
      console.log(id)
      return  http.post('userApi/logout', {
        id: id,
      })
      .then(response => {
        console.log('ABOUT TO REMOVE');
        console.log(response);
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
      });
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