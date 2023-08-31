<template>
   <div>

    <h3>Alerts {{sentiment}}</h3> 
    
    <label id ="inputLabel">Going Back?
        <input v-model="timeframe">
     </label>
    
    <table>
        <tbody>
                <tr  v-for="row in symbols" v-bind:key="row.symbol">
                      <td>{{row.symbol}}</td>
                   
                       <td><input type="checkbox"  v-model="row.selected"  @change=symbolSelected()> </td>
                </tr>

        </tbody>
     </table> 

<table>
  <thead>
    <tr>
      <th>Symbol</th>
      <th>Time</th>
      <th>Alert Type</th>
      <th>Was Adhoc</th>
      <th>Alert Price</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="row in filteredAlerts" v-bind:key="row.data.symbol">
      <td>{{row.data.symbol}}</td>
     <td>{{row.timeStamp}}</td>
      <td>{{row.data.alertType}}</td>
     <td>{{row.data.adhoc}}</td>
     <td>{{row.data.alertPrice}}</td>
    </tr>
  </tbody>
</table>

  </div>

</template>

<script>

export default {
  name: 'AlertsGrid',
props: {
    sentiment: String
  },
data() {
  return {
      alerts : [],
      symbols :[], 
      filteredAlerts :[],
      polling: null,
      timeframe: 300
  
    }
},

created() {
     this.loadAlert();
     this.pollData()
  },

beforeDestroy () {
	clearInterval(this.polling)
},
methods: {
  
pollData () {
		this.polling = setInterval(() => {
      this.loadAlert()
      }, 10000)
	},

   async loadAlert(){
    try {
     
      const response =  await this.$http.get("/trading/alertsbysentiment/" + " " + "/" + this.timeframe);
      console.log(response.data)
 
         this.alerts = [];
         this.symbols = [];
        const map = new Map();
        for (var i = 0; i <  response.data.length; i++)
         {
                var instance = response.data[i];
                const timeStamp = instance.timeStamp.monthValue + '-' + instance.timeStamp.dayOfMonth + ':' + instance.timeStamp.hour + ':' + instance.timeStamp.minute
                this.alerts.push({data:response.data[i], timeStamp:timeStamp, show:true}) 
                  if(!map.has(instance.symbol)){
                        map.set(instance.symbol, true);
                         
                          this.symbols.push({symbol: instance.symbol, selected : true});
                  }

          }

       console.log(this.symbols);   
      this.symbolSelected();

        }    
    catch (error) {
        console.log(error);
      }
   }  ,

    symbolSelected(){
         this.filteredAlerts = [];
         for (var i = 0; i <  this.symbols.length; i++)
         {  
            var instance = this.symbols[i];
            if(!instance.selected) continue;

            console.log(instance.symbol);
            for (var k = 0; k <  this.alerts.length; k++){
                var alert = this.alerts[k]; 
                if(alert.data.symbol== instance.symbol)
                    this.filteredAlerts.push(alert);
            }
        }
    }
 
 }
}
</script>

<style>


</style>

