
class AuthService {
    login(user) {
      // return  this.$http.post('user/login', {
      //     username: user.username,
      //     password: user.password
      //   })
      //   .then(response => {
      //  //   if (response.data.accessToken) {
      //       localStorage.setItem('user', JSON.stringify(response.data));
      // //    }
      //     return response.data;
      //   });
    
      localStorage.setItem('user', JSON.stringify(user));
      return user;
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