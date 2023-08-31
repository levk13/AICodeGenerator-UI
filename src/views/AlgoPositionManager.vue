<template>

  <div id="pagecontrol">
     <h3>Algo Positions</h3>
   <button  v-on:click="load">Load</button>
    <button  v-on:click="clear">Clear</button>
     <label id="spacing">Enable Real Time Quotes
    <input type="checkbox"  v-model="isRealTimeQuotesEnabled"> 
   </label>

<div id="gridContainer"> 
  <datatable title="" :columns="columns" :rows="algoPositions" >
    <th slot="thead-tr">
      Last Price
    </th>
      <th slot="thead-tr">
      Stop Loss
    </th>
     <th slot="thead-tr">
      Delete Position
    </th>
    <th slot="thead-tr">
      Sell Position
    </th>
    <th slot="thead-tr">
      Eligible for Double
    </th>

   <template slot="tbody-tr" slot-scope="props">
    <td>
        <div>
        {{props.row.lastPrice}}
        <Button id="delta" v-on:click="getQuote(props.row)">Refresh
      </Button>
        </div>
    </td>

     <td> 
          <input v-model="props.row.data.stopLoss">
          <Button  v-on:click="updateStopLoss(props.row.data)" >Update Stop Loss</Button>
      </td>

      <td><Button v-on:click="deletePosition(props.row.data)">Delete</Button></td>
      <td><Button v-on:click="sellPosition(props.row.data)">SELL</Button></td>
      <td> 
        <input type="checkbox"  v-model="props.row.data.eligbleForDoubleUp"> 
        </td>
   </template>

  
  
  
  </datatable>
</div>






 
<table>
<tr>
<td>{{selectedOptionQuote}}</td>
 </tr> 
 <tr>
   <td>
       <OptionsQuote  v-bind:symbol ="selectedOptionQuote"/>
   </td>
 </tr>
</table>


 

  </div>
</template>

<script>
import DataTable from "vue-materialize-datatable";
import OptionsQuote from '../components/OptionsQuote.vue'
import {pythonBackEnd} from '../main' 
export default {
  name: 'AlgoPositionManager',
  
  components: {
    OptionsQuote,
     "datatable": DataTable
  },
 data() {
  return {
      algoPositions: [],
       polling: null,
       selectedOptionQuote:'',
       isRealTimeQuotesEnabled : false,
         columns: [
        {
          label: 'Ticker',
          field: 'data.displaySymbol',
        },
        {
          label: 'Quantity',
          field: 'data.quantity',
        },
        {
          label: 'Asset Type',
          field: 'data.assetType',
        },
        {
          label: 'Underlying',
          field: 'data.underlying',
        },
        {
          label: 'Order Status',
          field: 'data.orderStatus',
        },
         {
          label: 'Trading Strategy',
          field: 'data.tradingStrategyName',
        },
        {
          label: 'Day Num',
          field: 'data.dayNumber',
        }
        ]
  }

},

created() {
     this.load();
     this.pollData()
  },
beforeDestroy () {
	clearInterval(this.polling)
},

 methods: {

clear() {
  this.algoPositions = [];
},

	pollData () {

    this.polling = setInterval(() => {
      this.getAllLastPrice()
      }, 10000)
	},

async updateStopLoss(row){
  const url = "/algopositions/updatestoploss";
  const payload = {id : row.id, stoploss : row.stopLoss};
  const response = await this.$http.post(url,payload);
  console.log(response)
},
viewOptionQuote(row){
  // if(row.data.displaySymbol ='' || row.data.displaySymbol ==null)
  //   return; 
   this.selectedOptionQuote = row.data.displaySymbol


},
getAllLastPrice(){
  if(!this.isRealTimeQuotesEnabled) 
    return;
  for (var i = 0; i < this.algoPositions.length; i++){
    var instance = this.algoPositions[i];
    this.getQuote(instance);
  }
},

async deletePosition(row) {
    try {
        const url = "/algotrading/algoposition?id=" + row.id
        const response = await pythonBackEnd.delete(url);
        console.log(response);
        this.load();
       
      } catch (error) {
        console.log(error);
      }
},

async sellPosition(row) {
    try {
        const url = "/algopositions/sell/" + row.id;
        const response = await this.$http.delete(url);
        console.log(response);
        this.load();
       
      } catch (error) {
        console.log(error);
      }
},

async load() {
      try {
        console.log("HIT Load");        
        const response = await pythonBackEnd.get("/algotrading/allpositions");
        console.log(this.algoPositions);
        
         this.algoPositions = [];
          for (var i = 0; i < response.data.length; i++)
         {
             var instance = response.data[i];
             var rowInstance = {data: instance, lastPrice : '' };
             this.algoPositions.push(rowInstance);
            this.getQuote(rowInstance);
        }
   //    this.startAutoRefresh();
      } catch (error) {
        console.log(error);
      }
    },

    async getQuote(rowInstance){
      const row = rowInstance.data
      var symbol = row.symbol;
      if(row.assetType == "OPTION") {
        symbol = row.underlying;
      }

     const url = "/trading/quote/" + symbol
     const response = await this.$http.get(url);
     rowInstance.lastPrice = response.data.lastPrice;
     console.log(row.lastPrice)
},
 openChart(row){
   console.log(row);
  const url = "https://www.tradingview.com/chart/c3cQyN39/?symbol=" + row.data.symbol; 
  window.open(url, "_target");
},


// created () {
// 	this.load();
// }

 }



}
</script>