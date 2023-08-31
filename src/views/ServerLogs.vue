<template>
  <div>
   
     <h2>Server Logs</h2>
    <button v-on:click="loadLogs">Refresh</button>
    <div id="divStyle">
    <div v-for="item in logs" v-bind:key="item.message" >
    {{ item.message }}
    </div>
  </div>

 

  </div>
</template>

<script>
// @ is an alias to /src


export default {
  name: 'ServerLogs',
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
      
       const response = await this.$http.get("/adminprocessing/getcachedlogs/100");
          
        if(response.data.length == 0) {
            this.logs.push( {message : 'No Messages'})
            return;
        }
       
        for (var i = 0; i < response.data.length; i++){
           const timeStamp = response.data[i].timestamp;
           
           const message = timeStamp + "-" +  response.data[i].message + " : " +  response.data[i].source;
           const entry = {message : message};

         this.logs.push(entry);
         this.logs.push({message: ''});
        }

    }

 }
}

</script>

<style scoped>
    #divStyle {
          border-style: solid;
        border-width: 2px 2px 2px 2px;
        font-family: 'Courier New', Courier, monospace;
        background : whitesmoke;
        width: 1600px;
        overflow-y: scroll;
        height: 1500px;
        max-height: 1000px;
        text-align: left;
        color: navy;
    }

</style>