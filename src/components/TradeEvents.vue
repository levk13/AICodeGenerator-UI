<template>
  <div >
    <h2>Event Logs</h2>
    <button v-on:click="loadLogs">Refresh</button>
    <button v-on:click="deleteLogs">Empty Logs</button>
    <div id="divStyle">
    <div v-for="item in logs" v-bind:key="item.id" >
    {{ item.message }}
    </div>
  </div>

 
  </div>
</template>

<script>
export default {
  name: 'TradeEvents', 

data() {
  return {
        logs: [
      { message: 'No Logs' }
    
    ]
  }
},

created() {
     this.loadLogs();
  },
 
 methods: {

    async loadLogs(){
       this.logs = [];
      
       const response = await this.$http.get("/trading/tradeevents/");
          
        if(response.data.length == 0) {
            this.logs.push( {message : 'No Messages'})
            return;
        }
       
        for (var i = 0; i < response.data.length; i++){
           const timeStamp = response.data[i].timeStamp;
           const timestampMessage = timeStamp.hour + ":" + timeStamp. minute

           const message = timestampMessage + "-" +  response.data[i].orderType + " : " +  response.data[i].sybmol + " QTY: " +  response.data[i].quantity;
           const entry = {message : message};
           this.logs.push(entry);
        }

       

    } ,

    async deleteLogs(){
        await this.$http.delete("/trading/tradeevents/");
        this.loadLogs();
    }
 }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #divStyle {
          border-style: solid;
        border-width: 2px 2px 2px 2px;
        font-family: 'Courier New', Courier, monospace;
        background : whitesmoke;
        width: 600px;
        overflow-y: scroll;
        height: 500px;
        max-height: 1000px;
    }

</style>
