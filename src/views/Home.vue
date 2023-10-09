<template>
  <div id="app">

  <div id="div">
    <LoginOld id="login" />
  </div>
  </div>
</template>

<script>
import LoginOld from '../components/LoginOld.vue'
  
export default {
  name: 'Home',
  components: {
    LoginOld
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

#login {
    position: fixed;
    /* center the element */
    right: 0;
    left: 0;
    margin-right: auto;
    margin-left: auto;

    margin-top: 40px;
    /* give it dimensions */
    min-height: 10em;
    width: 40%;
  }

  #div { 
    background-color: inherit
  
  }

  #runbutton {
border-radius: 2px;
background: #25BCEF;
display: flex;
padding: 12px;
justify-content: center;
align-items: center;
gap: 10px;
margin-right: 10px;
}

</style>
