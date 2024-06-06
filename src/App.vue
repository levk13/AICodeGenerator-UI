<template>

  <div id="app" class="main">
    <div id="AIHeader" class="ai-header" v-if="loggedIn">
      <LoggedUserheader></LoggedUserheader>
    </div>

    <div><img alt="Scigon Labs" src="./assets/ScigonLabsLogo.svg"></div>

    <div>
      <img alt="Scigon Labs" src="./assets/AILogo.svg">
      <h1 class="h1">Test Automation Framework</h1>
    </div>

    <div class="content">
      <router-view />
    </div>

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
