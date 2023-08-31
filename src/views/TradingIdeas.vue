<template>
  <div id="pagecontrol">
        <h3>Trading Ideas</h3>
   <button  v-on:click="toggleAddMode()">Add Idea</button>

<div v-show="isAddEnabled"> 

<div>
 <label>Symbol: 
 <input v-model="symbol">
 </label>

 <label id="leftMargin">TS Name: 
 <!-- <input v-model="tradingStrategy"> -->
 <select  v-model="tradingStrategy">
  <option v-for="name in tradingStrategyNames" :key="name" :value="name">{{ name }}</option>
 </select>

 </label>
</div>


<br/>
<div>
<p>Description</p>
<textarea rows="5" cols="50" id="description" v-model="description"/>
</div>

<button v-on:click="saveIdea()">Save Idea</button>
<button v-on:click="clearValues()">Close</button>

</div>
<div>
 <h5>Filter</h5>
 <label id="leftMargin">Min Conviction: 
    <input v-model="minConviction">
 </label>

 <label id="leftMargin">Max Conviction: 
    <input v-model="maxConviction">
 </label>
 
 <label id="leftMargin">Symobl lookup
    <input v-model="symbolLookup">
 </label>
 
<label id="leftMargin">Alerts Created
    <input type="checkbox" v-model="filteredAlertsCreated" >
 </label>

 <label id="leftMargin">TS Name: 
 <!-- <input v-model="tradingStrategy"> -->
 <select  v-model="filteredtradingStrategy">
  <option v-for="name in tradingStrategyNames" :key="name" :value="name">{{ name }}</option>
 </select>

 </label> 


 <button id="leftMargin" v-on:click="filter()">filter</button>
 <button id="leftMargin" v-on:click="clearFilter()">Clear filter</button>
 
 </div>
 <br/>

<button v-on:click="sortIdeas()">sort</button>
<button v-on:click="handleLoad()">refresh</button>

<table>
  <thead>
    <tr>
      <th>Conv</th>
      <th>As Of</th>
      <th>Symbol</th>
       <th>Description</th>
       <th>Whale Activity</th>
      <th>Target</th>
      <th>Entry Px</th>
      <th>StopLoss</th>
      <th>R/R</th>
      <th>Trading Strategy</th>
      <th>Alert Created</th>
      <th>Short Float</th>
      <th>RSI</th>
      <th>Target Price</th>
      <th>Refresh</th>
      
      <th>Edit Mode</th>
      <th>Save</th>
      <th>Delete</th>
      <th>Last Price</th>

    </tr>
  </thead>
  <tbody>
    <tr v-for="row in bindingTradingIdeasList" v-bind:key="row.sybmol" >
    
      <td style="width: 60px">
        <select v-model="row.data.conviction" v-on:change="updateConviction(row)"> 
            <option v-for="a in convictions" :key="a" :value="a">{{ a }}</option>
        </select>
      </td>

      <td>{{row.date}}</td>
      <td :style="{  background: getActiveColor(row)}">{{row.data.symbol}}</td>
      <td>
        <textarea v-show="row.isEditMode" rows="5" cols="50" id="description"  v-model="row.data.description"/>
         <label  id="description" v-show="!row.isEditMode" v-text="row.data.description"/>
      </td>

      <td>
        <textarea v-show="row.isEditMode" rows="5" cols="50" id="description"  v-model="row.data.whaleActivity"/>
         <label id="description" v-show="!row.isEditMode" v-text="row.data.whaleActivity"/>
        </td>

      <td>
          <input  v-show="row.isEditMode" v-model="row.data.target"/>
         <label id="description" v-show="!row.isEditMode" v-text="row.data.target"/>
      </td>

      <td>
          <input  v-show="row.isEditMode" v-model="row.data.entryPrice"/>
         <label id="description" v-show="!row.isEditMode" v-text="row.data.entryPrice"/>
      </td>

        <td>
          <input  v-show="row.isEditMode" v-model="row.data.stopLoss"/>
         <label id="description" v-show="!row.isEditMode" v-text="row.data.stopLoss"/>
      </td>
      

      
        <td>
          {{row.data.riskReward}}
      </td>


       <td>
          <select  v-show="row.isEditMode"  v-model="row.data.tradingStrategyName">
         <option v-for="name in tradingStrategyNames" :key="name" :value="name">{{ name }}</option>
         </select>

         <label id="description" v-show="!row.isEditMode" v-text="row.data.tradingStrategyName"/>
      </td>
      
      <td>
          <input type="checkbox" v-show="row.isEditMode" v-model="row.data.alertedCreated"/>
         <label id="description" v-show="!row.isEditMode" v-text="row.data.alertedCreated"/>
      </td>

        <td>{{row.data.symbolAnalytic.shortFloat}}</td>
        <td>{{row.data.symbolAnalytic.rsi}}</td>
        <td>{{row.data.symbolAnalytic.targetPrice}}</td>
        <td><button v-on:click="updateAnalytic(row)">Analytic</button></td>
        <td><Button  v-on:click="enableEditMode(row)">Edit </Button></td>
        <td>
            <Button  v-on:click="updateIdea(row)">Save
            </Button>
      </td>
      
      <td><button v-on:click="deleteIdea(row)">Delete</button></td>

      <td>
        <div>
        {{row.lastPrice}}
        <Button id="delta" v-on:click="getQuote(row)">
            Refresh
        </Button>
        </div>
      </td>  


    </tr>
  </tbody>
</table>

  </div> 

 </template>

<script>
 

export default {
  name: 'TradingIdeas',


data() {
  return {
     tradingIdeasList:[], 
     bindingTradingIdeasList:[], 
     isAddEnabled :false, 
     symbol : '',
     description :'',
     tradingStrategy: '',
     filteredtradingStrategy : '',
     tradingStrategyNames : [],
     minConviction :0,
     maxConviction : 5, 
     symbolLookup: '',
     filteredAlertsCreated :false,
     activeColor: 'red', 
     convictions: [0,1,2,3,4,5]
    }
},
created() {
  this.handleLoad();
  },
 



methods: {
    handleLoad(){
     this.load();
     this.loadTradingStrategyNames();
    },

   getActiveColor(row){ 
     if(row.data.tradingStrategyName=="Breakdown" 
      || row.data.tradingStrategyName=="TwentyOne_Eight_Cross" 
      || row.data.tradingStrategyName=="ReverseRDR" 
      || row.data.tradingStrategyName=="Daily Bear Reverse") 
     return "red"
     return 'lightgreen';
   },

   filter(){
     this.bindingTradingIdeasList = [];
     console.log(this.bindingTradingIdeasList.length);
     
    for (var i = 0; i < this.tradingIdeasList.length; i++)
     {
        var instance = this.tradingIdeasList[i];
        if(instance.data.conviction > this.maxConviction) continue;
        if(instance.data.conviction < this.minConviction) continue;
        
       if(this.symbolLookup !=''){
         if(instance.data.symbol !=this.symbolLookup ) continue;
       }

        if(this.filteredtradingStrategy!=''){
                   if(instance.data.tradingStrategyName !=this.filteredtradingStrategy ) continue;
        }

       if(this.filteredAlertsCreated){
         if(!instance.data.alertedCreated){
           continue;
         }
       }

        this.bindingTradingIdeasList.push(instance);
     }
     console.log(this.bindingTradingIdeasList.length);
     this.sortIdeas();
   },

  clearFilter(){
     this.minConviction =0;
     this.maxConviction =5;
     this.symbolLookup = '';
     this.filteredAlertsCreated = false;
     this.filteredtradingStrategy = '';
     this.filter();

  },

  setFilteredIdeas(){
      this.bindingTradingIdeasList = [];
     for (var i = 0; i < this.tradingIdeasList.length; i++)
     {
        var instance = this.tradingIdeasList[i];
         this.bindingTradingIdeasList.push(instance);
     }
  },

   async load(){
       this.tradingIdeasList = [];
      try{
        const response = await this.$http.get("/trading/tradingideas");
       
        for (var i = 0; i < response.data.length; i++)
        {
           console.log(response.data.length)
            var date = null; 
            if(response.data[i].enteredDate!=null)
              date = response.data[i].enteredDate.monthValue + "/" +   response.data[i].enteredDate.dayOfMonth  
              const data = response.data[i];

             
              if(data.symbolAnalytic ==null)
                data.symbolAnalytic = {};
            this.tradingIdeasList.push({data:data, date:date, isEditMode : false, lastPrice :0});
            this.setFilteredIdeas();
            this.sortIdeas();
        }   
      } catch (error) {
        console.log(error);
      }
    },

    async loadTradingStrategyNames(){
         const response = await this.$http.get("/tradingstrategy/tradingstrategynames");
         console.log(response.data);
         this.tradingStrategyNames = response.data;
    },

  async updateAnalytic(row){
     const response =  await this.$http.get("/trading/getanalyticforidea/" + row.data.id);
      row.data = response.data;
     console.log(response.data);
  },


    async deleteIdea(row){
       await this.$http.delete("/trading/tradingidea/" + row.data.id);
       this.load();
    },

    async saveIdea(){
      const payload = { "symbol": this.symbol, "description" : this.description,"tradingStrategyName" :  this.tradingStrategy}
      this.postIdea(payload);
      this.clearValues();
      this.handleLoad();
    },

    computeRiskReward(row){
      console.log(row.data.target);
      console.log(row.data.entryPrice);
      console.log(row.data.stopLoss);
      if(row.data.target==0 ||  row.data.entryPrice==0 || row.data.stopLoss==0)
        return 0;
      console.log('Got here');
      var gainAmount =  row.data.target - row.data.entryPrice; 
      var lossAmount = row.data.entryPrice - row.data.stopLoss;
      var rr = gainAmount/lossAmount;

      return rr.toFixed(2);
    },

    async postIdea(idea){
      await this.$http.post("/trading/savetradingidea", idea);
    },

   async updateIdea(row){
        row.data.enteredDate = null;
        row.data.riskReward = this.computeRiskReward(row);
        this.postIdea(row.data);
        this.enableEditMode(row);
   },

 async updateConviction(row){
     row.data.enteredDate = null;
      this.postIdea(row.data);
      this.sortIdeas();
 },
    clearValues(){
      this.toggleAddMode();
      this.symbol = '';
      this.description='';
      this.tradingStrategy = '';
    },


    async getQuote(row){
     const url = "/trading/quote/" + row.data.symbol
     const response = await this.$http.get(url);
     row.lastPrice = response.data.lastPrice;
},

    toggleAddMode(){
        this.isAddEnabled = !this.isAddEnabled;
    },
      
      enableEditMode(row){
        row.isEditMode = !row.isEditMode;
    },

    sortIdeas(){
      this.bindingTradingIdeasList = this.sortByConviction()
    },

    sortByConviction (){
     return this.bindingTradingIdeasList.slice().sort(function(a, b){
        return (b.data.conviction > a.data.conviction) ? 1 : -1;
  });
},


   getClassForbackground(){
     this.class = "short";
     return this.class
   }
 }
}
</script>

<style scoped >
table {
  font-family: 'Open Sans', sans-serif;
  width: 2450px;
  border-collapse: collapse;
  border: 3px solid #44475C;
  margin: 10px 10px 0 10px;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #44475C;
  color: #FFF;
  padding: 8px;
  min-width: 30px;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7D82A8;
}
table td:last-child {
  border-right: none;
}


#description {
  width: 800;
  height:700;

}
 
#leftMargin  {
    margin-left: 10px;
}

    .short {
       background-color: red
    }
    .long {
       background-color: green
    }
</style>
 
