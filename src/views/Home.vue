<template>
  <div id="app">

  <div>
    <LoginVue/>
  </div>
  </div>
</template>

<script>
import LoginVue from '../components/Login.vue'
  
export default {
  name: 'Home',
  components: {
    LoginVue
  }
}



</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 1000px;

  
}
fieldset {
  border: 0;
}



</style>
