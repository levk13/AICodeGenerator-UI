<template>
  <div id="pagecontrol">
        <h3>Trading Strategy Manager</h3>




   <button  v-on:click="load()">Load</button>
  <button  v-on:click="toggleAddNew()">Create New</button>


 <div v-show="isAddNewEnabled">  
  
   <label >Name
        <input v-model="newStrategyName">
  </label>

  <button  v-on:click="saveNewStrat()"> Save</button>


 </div>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Active</th>
      <th>max Equity Price</th>
      <th>Max Option Price</th>
      <th>Total Number of Equity Trades</th>
      <th>Total Number of Options Trades</th>
      <th>Number of Days Until Option Expire</th>
       <th>Stop Loss Type</th>
       <th>Edit Mode</th>
       <th>Update</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in tradingStrategies" v-bind:key="row.data.name">
      <td>{{row.data.name}}</td>
      
      <td>   <input type="checkbox" v-show="row.isEditMode"  v-model="row.data.active">
             <label v-show="!row.isEditMode" v-text="row.data.active"/>
      </td>
      
      
      <td>   <input v-show="row.isEditMode"  v-model="row.data.maxPrice">
             <label v-show="!row.isEditMode" v-text="row.data.maxPrice"/>
      </td>




     
      <td>  
            <input v-show="row.isEditMode" v-model="row.data.maxOptionPrice">
            <label v-show="!row.isEditMode" v-text="row.data.maxOptionPrice"/>
      </td>
      
      <td> 
            <input  v-show="row.isEditMode" v-model="row.data.numberOfTradesAllowed">
            <label v-show="!row.isEditMode" v-text="row.data.numberOfTradesAllowed"/>
      </td>
     
     <td>  
          <input  v-show="row.isEditMode" v-model="row.data.numberOfOptionTradesAllowed">
          <label v-show="!row.isEditMode" v-text="row.data.numberOfOptionTradesAllowed"/>
    
    </td>
     
      <td> 
            <input v-show="row.isEditMode" v-model="row.data.maxOptionDaysToExpire">
             <label v-show="!row.isEditMode" v-text="row.data.maxOptionDaysToExpire"/>
      </td>

      <td>{{row.data.stopLossType}}</td>
      <td>
            <Button  v-on:click="enableEditMode(row)">Edit
            </Button>

      </td>
      
      
      
      <td>
            <Button  v-on:click="save(row)">
              save
            </Button>

      </td>
    </tr>
  </tbody>
</table>

  </div> 

 </template>
<script>
import {pythonBackEnd} from '../main'
export default {
  name: 'TradingStrategy',
  data() {
  return {
       tradingStrategies :[],
       isAddNewEnabled :false,
       newStrategyName:''
  }
},
created() {
     this.load();
  },
 
 methods: {

    async saveNewStrat(){
      const payload = {name : this.newStrategyName, stopLossType: 'DaysLow'};
      await this.$http.post("/tradingstrategy/add",payload);
      this.toggleAddNew();
      this.load();
    },
    
    async load(){
       this.tradingStrategies = [];
      try{
        const response = await pythonBackEnd.get("/tradingstrategy/all");
      console.log(response.data.length);
        for (var i = 0; i < response.data.length; i++)
        {    
           
             var instance = response.data[i];
             var rowInstance = {data: instance, isEditMode : false, };
             this.tradingStrategies.push(rowInstance);

        } 
          
         console.log(this.tradingStrategies);   
      } catch (error) {
        console.log(error);
      }
    

    },

    enableEditMode(row){
        row.isEditMode = !row.isEditMode;
    },

    toggleAddNew(){
      this.isAddNewEnabled = !this.isAddNewEnabled
    },
    async save(row){
       try{
            const tradingStrategyUpdate = {
                id: row.data.id,
                maxOptionPosition: row.data.numberOfOptionTradesAllowed,
                maxEquityPosition: row.data.numberOfTradesAllowed,
                maxOptionDaysToExpire: row.data.maxOptionDaysToExpire,
                maxOptionPrice: row.data.maxOptionPrice,
                maxEquityPrice : row.data.maxPrice,
                active : row.data.active
            }
            await pythonBackEnd.post('/tradingstrategy/update',tradingStrategyUpdate);
            this.enableEditMode(row);
            this.load();
       }
       catch(error){
           console.log(error);
       }
    }

 }
}

</script>

