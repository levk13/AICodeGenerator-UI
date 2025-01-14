<template>

  <div class="main" data-bs-theme="dark">

    <div class="flex-shrink-0">
      <div id="AIHeader" class="ai-header mt-5" v-if="loggedIn">
        <LoggedUserheader></LoggedUserheader>
      </div>

      <div class="content">
        <router-view />
      </div>
    </div>
    <div class="flex-grow-1"></div>
    <Footer />
  </div>

</template>

<script>
import LoggedUserheader from './components/LoggedUserheader.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    LoggedUserheader,
    Footer,
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
