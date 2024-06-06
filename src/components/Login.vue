<template>


  <div>
    <form @submit="handleLogin()">
      <div class="mb-3">
        <input v-model="user.username"
          id="email"
          type="email"
          placeholder="name@example.com"
          class="form-control">
        <label for="email">Email address</label>
      </div>
      <div class="">
        <input v-model="user.password"
          id="password"
          type="password"
          placeholder="Password"
          class="form-control">
        <label for="password">Password</label>
      </div>


      <div class="">
        <input v-model="user.key"
          id="license-key"
          type="text"
          placeholder="License Key"
          class="form-control">
        <!-- <label for="floatingPassword">License Key</label> -->
      </div>

      <div id="center">
        <button class="btn btn btn-light btn-lg" type="submit">Submit</button>
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
