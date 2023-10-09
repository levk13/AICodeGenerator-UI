<template>

<div>
    <form @submit="handleLogin()">
        <div class="form-floating mb-3">
  <input  v-model="user.username"  type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
  <label for="floatingInput">Email address</label>
</div>
<div class="form-floating">
  <input v-model="user.password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
  <label for="floatingPassword">Password</label>
</div>

<div  id="center">
    <button  class="btn btn btn-light btn-lg" type="submit">Submit</button>  
 
  </div>


</form>
    </div>
  </template>
  
  <script>


    export default {
      data() {
        return {
          user: {
            username: '',
            password: ''
          },
         
          show: true
        }
    },
    computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/testrunner");
    }
  },
  methods: {
    handleLogin() {
      console.log("calling Router")
      this.loading = true;
 
      this.$store.dispatch("auth/login", this.user).then(
        () => {
        
          this.$router.push("/testrunner");
        },
        (error) => {
          this.loading = false;
          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    }
  }
}
</script>
      <style>
    #center {
  margin: auto;

  padding: 10px;
  float: right;
  border-width: 1px;
}
      </style>

      