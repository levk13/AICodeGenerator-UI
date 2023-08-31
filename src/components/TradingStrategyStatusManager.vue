<template>
  <div >
    <h2>Trading Strategy Status</h2>
 

<table id="tsgrid">
  <thead>
    <tr>
      <th>Name</th>
      <th>Is Active</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in tradingStrategies" v-bind:key="row.name">
      <td>{{row.name}}</td>
      <td> 
        <input type="checkbox"  v-model="row.active"> 
        </td>
    </tr>
    <tr>
        <td/>
        <td><button id="button"  v-on:click="save">Update</button>   </td>
    </tr>
  </tbody>
</table>


  </div>
</template>

<script>
export default {
  name: 'TradingStrategyStatusManager', 
data() {
  return {
      tradingStrategies: [],
  }
},
created() {
     this.load();
  },
methods: {

async load() {
      try {
        const response = await this.$http.get("/tradingstrategy/statuses");
        // JSON responses are automatically parsed.
        this.tradingStrategies = response.data;
      
        console.log(this.autoTradeCandidates);
      } catch (error) {
        console.log(error);
      }
    },

  async save(){
      const payload =this.tradingStrategies
    await this.$http.post("/tradingstrategy/savestatuses", payload);
    this.load();
  }  

 }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #tsgrid {
      width : 250px
  }

  #button {
    text-align: right;  
  }

</style>
