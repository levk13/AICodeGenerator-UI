<template>

   
   <div id="submittrade">

 
   <table>
     <tr>
       <td>
   <div id = "leftalginControls">
    
    <h3>Trading Management</h3> 

 
 <label>Is Short
    <input type="checkbox"  v-model="isShort" @change=sideUpdated()> 
   </label>

  <div id="divStyle">
  
   
    <label id ="inputLabel">Symbol
        <input v-model="symbol">
     </label>
    </div>
 
     <div id="divStyle">
        <label  id ="inputLabel" >Strike Price
            <input v-model="strike">
        </label>
    </div>

   <div id="divStyle">
      <label  id ="inputLabel">Option Type
            <input v-model="callput">
        </label>
  </div>
      
    <div id="divStyle">
       <label  id ="inputLabel">Expiration Date
                   <input v-model="expirationDate">
       </label>
    </div>

    <div id="divStyle">
       <label  id ="inputLabel">Stop Loss
             <input v-model="stoplossBinding" >
       </label>
    </div>
     <button id="leftalginControls" v-on:click="submitTradeClick">Submit Trade</button>
      <button id="leftalginControls" v-on:click="saveOrder">Save Order</button>
      <button id="leftalginControls" v-on:click="loadSavedOrder">Load Orders</button>
      <!-- <button id="leftalginControls" v-on:click="deleteAllOrders">Delete All Orders Orders</button> -->
     <button id="leftalginControls" v-on:click="clearOrders">Clear Orders</button>
   </div>
   <div id="divStyle"> 
  
  <table id ="mytable">
    <thead>
    <tr>
      <th>Symbol</th>
      <th>underlying</th>
      <th>Stop Loss</th>
      <th>Load Or Trade Saved Order For Trade</th>
      <th>Delete Saved Order</th>
      <th>Bid/Ask|Delta</th>
      
    </tr>
  </thead>

 <tbody>
    <tr v-for="row in savedOrders" v-bind:key="row.order.symbol">
      <td>{{row.order.symbol}}</td>
      <td>{{row.order.underlying}}</td>
      <td>{{row.order.stopLoss}}</td>
   
       <td> 
         <Button  v-on:click="trade(row.order)" >*TRADE*</Button>
         <Button  v-on:click="loadIntoFormSavedOrder(row.order)" >Load For Trade</Button>
      </td>
       <td> 
         <Button  v-on:click="deleteSavedOrder(row.order)" >Delete</Button>
         </td>
         
         <td>
           <OptionsQuote  v-bind:symbol ="row.order.symbol"/>
          </td>
    </tr>
  </tbody>


  </table>
 


  </div>

  

</td>

<td>
   <div id = "leftalginControls">
    
    <h3>Select Options</h3> 

    
   
    
    <h3>Trading Management</h3> 

  <div>
     <label id ="inputLabel">Symbol
        <input v-model="optionSymbol"  v-uppercase>
     </label>
  
       <label id ="inputLabel">Min Cost
        <input id="pricetext" v-model="minOptionCost">
     </label>

       <label id ="inputLabel">Max Cost
        <input id="pricetext" v-model="maxOptionCost">
     </label>

      <label id ="inputLabel">Is Call
        <input  type="checkbox" v-model="optionIsCall">
     </label>

      <button v-on:click="getOptions()">Get Options</button>
      <button v-on:click="clearOptionChain()">Clear</button>
      

  </div>

<table id="mytable">
  <thead>
    <th>Symbol</th> 
    <th>Bid/Ask/Delta</th>
    <th>Trade</th>
    <th>Save To Orders</th>
   </thead>


    <tbody>
    <tr v-for="row in optionsChain" v-bind:key="row.symbol">
        <td>{{row.symbol}}</td>
             <td>
           <OptionsQuote  v-bind:symbol ="row.symbol"/>
          </td>
          <td><button v-on:click="submitTradeClickFromOptionChain(row)" >Trade</button></td>
          <td><button v-on:click="saveOptionOrder(row)" >Save As Order</button></td>
    </tr>
    </tbody>  
   </table>

   </div>
</td>

</tr>
</table>

  <div  id="divStyle">    <h3>Equity Trades</h3> 
   <div id="divStyle">
      <label id ="inputLabel">Symbol
        <input v-model="equitySymbol" v-uppercase>
      </label> 
    </div> 
    <div id="divStyle">
      <label id ="inputLabel">Quantity
        <input v-model="equityQuantity">
      </label>
    </div> 

 <div id="divStyle">
      <label id ="inputLabel">stopLoss
        <input v-model="equityStopLoss">
      </label>
    </div> 


  </div>
     <button v-on:click="submitEquityTrade" >Trade Equity</button> 
     <button v-on:click="clearEquityField" >Clear</button> 
  </div>
</template>

<script>
import OptionsQuote from '../components/OptionsQuote.vue'
export default {
  name: 'Trading',
components: {
    OptionsQuote
  },

  directives: {
    uppercase(el) {
      el.value = el.value.toUpperCase()
  }
  },

data() {
  return {
      symbol : '',
      strike : '',
      stoplossBinding: '',
      savedOrders: [], 
      callput:  'C', 
      expirationDate : '102221', 
      isShort : false,
      optionSymbol :'',
      minOptionCost : 0,
      maxOptionCost:150,
      optionIsCall : true, 
      optionsChain : [], 
      equitySymbol : '', 
      equityQuantity : 0,
      equityStopLoss : 0,
  }
},
created() {
     this.loadSavedOrder();
     this.pollData()
  },



methods: {
  
  sideUpdated() {
    console.log("Hit SIde Updated");
    console.log(this.isShort);
    if(this.isShort) 
      this.callput = 'P'
     else 
      this.callput = 'C'
  },

  clearOptionChain(){
    this.optionsChain = [];
  },

  clearEquityField(){
    this.equitySymbol= '';
    this.equityQuantity = 0; 
    this.equityStopLoss = 0;
  },

  async getOptions(){
    const urlParams = this.optionSymbol + '/' + this.optionIsCall + '/' + this.minOptionCost   + '/' +  this.maxOptionCost;
    const response =  await this.$http.get("/trading/options/" + urlParams);
    this.optionsChain = response.data;
    console.log(this.optionsChain);
  },

   async loadSavedOrder(){
    try {
     
      const response =  await this.$http.get("/trading/getsavedorders");
       console.log(response.data.length)
        this.savedOrders = [];
       for (var i = 0; i < response.data.length; i++)
        {
             var instance = response.data[i];
             var rowInstance = {order: instance, bid:'', ask:'' };
            this.savedOrders.push(rowInstance);
           // this.getQuote(rowInstance);
      }

    }
    catch (error) {
        console.log(error);
      }
   }  ,


   async saveOrder(){
     this.processSavedOrder(this.getOrderPayLoad());
   }  ,


  async saveOptionOrder(row){
    this.processSavedOrder(this.getOptionOrderPayload(row.symbol));
  },


  async processSavedOrder(order){
  try  {
        this.savedOrders.push( {order:order, bid:'', ask:'' })
        await this.$http.post("/trading/saveorder",this.createPayLoadToSend());
        this.clearvalues();
        this.loadSavedOrder();
     }
     catch (error) {
        console.log(error);
      }
  },

   createPayLoadToSend(){
    const payLoadToSend = [];
       for (var i = 0; i < this.savedOrders.length; i++)
        {
            var instance = this.savedOrders[i];
            payLoadToSend.push(instance.order);
        }
        return payLoadToSend;
   },

  getOrderPayLoad: function(){
      console.log(this.strike);
      this.symbol = this.symbol.toUpperCase();
      const fullsymbol =  this.symbol + '_' + this.expirationDate + this.callput + this.strike
      const payload = {stopLoss: this.stoplossBinding, symbol: fullsymbol, underlying: this.symbol , strikePrice: this.strike, short: this.isShort,option:true};
      return payload; 
    },

  getEquityPayload(){
      this.equitySymbol = this.equitySymbol.toUpperCase();
      const payload = {stopLoss: this.equityStopLoss, symbol: this.equitySymbol, quantity: this.equityQuantity, option:false};
      return payload; 
  },

  getOptionOrderPayload: function(symbol){
     const payload = {stopLoss:0, symbol: symbol, underlying: this.optionSymbol , strikePrice: 0, short: !this.optionIsCall,option:true};
    return payload;
  },

  clearOrders: function(){
    this.savedOrders = [];
  },

  loadIntoFormSavedOrder : function(row){
      this.symbol = row.underlying;
      this.strike = row.strikePrice;
      this.stoplossBinding = row.stopLoss
      this.isShort = row.isShort
  },


   clearvalues: function(){
      this.symbol = ''
      this.strike = ''
      this.stoplossBinding = ''
      this.isShort = false
   },

   async deleteSavedOrder(order){
     try{ 
       
       var index = this.savedOrders.indexOf(order);
      this.savedOrders.splice(index,1);
      await this.$http.post("/trading/saveorder",this.createPayLoadToSend());
      this.loadSavedOrder(); 
     }
     catch(error)
     {
       console.log(error);
     }
  },


    async submitTradeClick () {
      this.trade(this.getOrderPayLoad());
  },

  async submitTradeClickFromOptionChain(row){
    this.trade(this.getOptionOrderPayload(row.symbol));
  },

 async submitEquityTrade(){
    this.trade(this.getEquityPayload());
    this.clearEquityField();
 },

  async trade(row){
      try {
        const response =  await this.$http.post("/trading/submittrade", row);
        // JSON responses are automatically parsed.
        console.log(response);
        this.clearvalues();
      } catch (error) {
        console.log(error);
      }
  },


mounted: function () {
  alert('Hi Page')
  
},

 
  beforeDestroy() {
        alert('bye Page')
  }
}
}
</script>

<style scoped>
#divStyle {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-bottom: 10px;
  margin-top : 10px;
  float: inline-start;
 
}



#submittrade {
 box-sizing: border-box;
 background :none;
 border-width: 1;
 vertical-align: top;
   float: inline-start;


}
#inputLabel {
     text-align: left;
   
}

#leftalginControls {
    text-align: left;
}

#pricetext { 
  width: 70px;
}


#mytable {
  font-family: 'Open Sans', sans-serif;
  width: 750px;
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
table tbody tr:nth-child(2n) td {
  background: whitesmoke;
}




</style>

