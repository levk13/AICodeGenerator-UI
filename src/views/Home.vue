<template>
  <div id="app">

  <div>
    <AICodeGeneratorJira/>
  </div>
  </div>
</template>

<script>
// import AdminControlPanel from '../components/AdminControlPanel.vue'
// import TradeEvents from '../components/TradeEvents.vue'
// import MarketInformation from '../components/MarketInformation.vue'
  import AICodeGeneratorJira from '../components/AICodeGeneratorJira.vue'


export default {
  name: 'App',
  components: {
    AICodeGeneratorJira
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
