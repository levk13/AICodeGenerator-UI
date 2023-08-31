<template>
  <div>
 <h3>Admin Control Panel</h3> 
  
  <div > <button v-on:click="loadCache">Load Cache</button></div>
 
  <!-- <div ><button v-on:click="runNighlyProcess">View Sector Tractor</button></div> -->
 
 <div> 
   <h3> SQS </h3>
    <div ><button v-on:click="purgeQueue">PURGE QUEUE</button></div>
 
 <select  v-model="selectedQueueOperation">
    <option v-for="a in queueOperations" :key="a.name" :value="a.value">{{ a.name }}</option>
 </select>
  <div >
  <button v-on:click="runQueueOperation">Run Queue Event</button></div>
 </div>
 
<br/>
<br/>
<div>
      <label id ="inputLabel">Is AUTOTRADER ON?
        <input type="checkbox"  v-model="systemConfig.autoTraderOn"> 
     </label>
</div>
<div>
     <label id ="inputLabel">Account Balance
         <input type="text" v-model="systemConfig.accountBalance "> 
     </label>
</div>
<div>
       <label id ="inputLabel">Max Positions
        <input id="pricetext" v-model="systemConfig.maxPosition">
     </label>
</div>
<div>
      <button v-on:click="getSystemConfiguration()">Get System Configuration</button>
      <button v-on:click="saveSystemConfiguration()">Save Changes</button>
  </div>

<br/>
   <div> 
       <label  id ="inputLabel">Expiration Date
          <input v-model="expirationDate">
       </label>
      <button  v-on:click="saveOptionExpiry">save Expiration Date</button>
  </div>

 
  </div>
</template>

<script>
// import RDRApprove from "./RDRApprove.vue";
import {pythonBackEnd} from '../main'
export default {
  name: 'AdminControlPanel',
  props: {
    msg: String
  },

data() {
  return {
    selectedQueueOperation: '',
      expirationDate : '', 
      systemConfig : '', 
      queueOperations :[
        {
          name: 'trading Message', 
          value : 'trade'
        }, 
        {
          name: 'run nightly process', 
          value : 'endofnight'
        }, 
        {
          name: 'Position Message', 
          value : 'position'
        }, 
       ]
  }
},

methods: {


 async loadCache() {
      try {
       
        const response = await this.$http.get("/adminprocessing/loadcache");
        // JSON responses are automatically parsed.
        this.posts = response.data;
      } catch (error) {
        console.log(error);
      }
    }, 

  async saveOptionExpiry(){
    const url= "/adminprocessing/setoptionexpiry/" + this.expirationDate;
    await this.$http.get(url);

  },

//
 
    async runQueueOperation() {
      try {
        //const response = await this.$http.get("/adminprocessing/enqueue/"  + this.selectedQueueOperation);
        const response = await pythonBackEnd.get("/admin/enqueue?messageType="  + this.selectedQueueOperation);
        // JSON responses are automatically parsed.
        this.posts = response.data;
      } catch (error) {
        console.log(error);
      }
     },

     

    async purgeQueue() {
    try {
        
        await pythonBackEnd.get("/admin/purge");
         //await this.$http.get("/adminprocessing/purgequeue");
      } catch (error) {
        console.log(error);
      }
     },


  async getSystemConfiguration(){
          try {
        const response =  await pythonBackEnd.get("/admin/systemconfiguration");
        this.systemConfig = response.data;
        console.log(this.systemConfig) 
       }
      catch (error) {
        console.log(error);
      }

  },
  
  async saveSystemConfiguration(){
      await pythonBackEnd.post("/admin/systemconfiguration",this.systemConfig);
  },

  }

 }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

#divStyle {
      margin-bottom: 10px;
      background-color: rgba(235, 227, 227, 0.397);
}




</style>