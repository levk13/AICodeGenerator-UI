<template>
  <div class="c-login">

    <div class="d-flex">
      <div class="scigon-logo my-5">
        <img class="scigon-logo__image" alt="Scigon Labs" src="../assets/ScigonLabsLogo.svg">
      </div>

      <div class="testwyze-logo mt-5 mb-5 mx-auto">
        <img class="testwyze-logo__image" alt="Scigon Labs" src="../assets/AILogo.svg">
        <h1 class="h1 heading mb-0">Test Automation Framework</h1>
      </div>
    </div>

    <Form @submit="handleLogin" :validation-schema="schema">
      <div class="mb-3">

        <div class="form-group mb-3">
          <Field name="username"
            id="username"
            type="text"
            placeholder="Email"
            class="form-control"
          />
          <ErrorMessage name="username" class="form-text invalid-feedback" />
        </div>

        <div class="form-group mb-3">
          <Field name="password"
            id="password"
            type="password"
            placeholder="Password"
            class="form-control"
          />
          <ErrorMessage name="password" class="form-text invalid-feedback" />
        </div>

        <div>
          <button class="btn btn-light" :disabled="loading">
            <span v-show="loading" class="spinner-border spinner-border-sm"></span>
            <span>Login</span>
          </button>
        </div>

        <div>
          <div v-if="message" class="alert alert-warning" role="alert">
            {{ message }}
          </div>
        </div>
      </div>
    </Form>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default {
  name: "Login",
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const schema = yup.object().shape({
      username: yup.string().required("Username is required!"),
      password: yup.string().required("Password is required!"),
    });

    return {
      loading: false,
      message: "",
      schema,
    };
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
    handleLogin(user) {
      this.loading = true;
      console.log(user)
      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/testrunner");
        },
        (error) => {
          console.log("Logging Error")
          console.log(error)
          this.loading = false;
          this.message = "Either Login failed or License in Use"
        }
      );
    },
  },
};
</script>

<style lang="scss">
  .c-login {
    max-width: 18.75rem;
    margin: 0 auto;
  }

</style>
