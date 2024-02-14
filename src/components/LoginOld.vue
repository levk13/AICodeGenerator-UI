<template>

      <Form @submit="handleLogin" :validation-schema="schema">
        <div class="form-floating mb-3">
  
          <div class="form-group">
          <Field name="username" type="text" class="form-control" id="floatingInput" placeholder="Email" />
          <ErrorMessage name="username" class="error-feedback" />
          </div>
          <br/>
        <div class="form-group">
          <Field name="password" type="password" class="form-control" id="floatingInput" placeholder="Password"/>
          <ErrorMessage name="password" class="error-feedback" />
        </div>
        
    
        <div id="center">
          <button  class="btn btn btn-light btn-lg"  :disabled="loading">
            <span
              v-show="loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Login</span>
          </button>
        </div>
     <br/><br/><br/><br/>
        <div>
          <div v-if="message" class="alert alert-warning" role="alert">
            {{ message }}
          </div>
        </div>
        </div>
      </Form>
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
<style>
#center {
margin: auto;

padding: 10px;
float: right;
border-width: 1px;
}
  </style>