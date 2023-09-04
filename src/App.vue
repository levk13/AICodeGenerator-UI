<template>

  <div id="app">
    <div v-if="loggedIn"> 
      <LoggedUserheader></LoggedUserheader>
      </div>
    <br><br>

   <img alt="Scigon Labs" src="./assets/ScigonLabsLogo.svg">
   
     <br>
     <div id="AIHeader">
         <img alt="Scigon Labs" src="./assets/AILogo.svg">  
           <p id="texts">Test Automation Framework</p>
     </div>             
     <router-view/>
     
    </div>
</template>

<script>
import LoggedUserheader from './components/LoggedUserheader.vue';
export default {
  components: {
    LoggedUserheader
  },
  data() {
  return {

  }
},
computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
 }
,
}



</script>

<style>
@import url(http://fonts.googleapis.com/icon?family=Material+Icons);
#app {
  text-align: center;
  color: #2c3e50;
  
background: radial-gradient(50% 50% at 50% 50%, #05C1FC 0%, #009ECF 41.67%, #00789D 100%);
}

#nav {
  padding: 30px;
  text-align: left;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}



#pagecontrol { 
  text-align: left;
}


#texts { 
  color: #FFF;
font-family: Montserrat;
font-size: 28px;
font-style: normal;
font-weight: 500;
line-height: normal;
}

#AIHeader {
  display: inline-flex;
justify-content: center;
align-items: center;
gap: 8px;
}


</style>