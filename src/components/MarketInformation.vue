<template>
  <div >
    <h2>Links:</h2>
    <button id="btn" v-on:click="sectorSelector">Sector Overview</button>
    <button id="btn" v-on:click="symbolHeatmap">Symbol Heatmap</button> 
  </div>
</template>

<script>
export default {
  name: 'MarketInformation', 

methods: {

    openWindow(url){
        window.open(url, "_target");
    },

    sectorSelector(){
        const url = "https://www.sectorspdr.com/sectorspdr/tools/sector-tracker";
        this.openWindow(url);
    }, 

    symbolHeatmap(){
        const  url = "https://finviz.com/map.ashx";
          this.openWindow(url);
    }
 }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #btn {
        background : whitesmoke;
        width: 200px;

    }

</style>
