<template>
  <div id="jiraPage">
   

    <div id="panelDiv"> 
      
         <div id="runPan">
            <select  v-model="selectedJiraItem" id="jiraItems">
                <option value="" disabled hidden>Select Issue</option>
              <option v-for="name in jiraItems" :key="name" :value="name">{{ name }}</option>
           </select>
          <button  v-on:click="run" id="runbutton">Run</button>
          <button  v-on:click="clear" id="clearButton">Clear</button>
         </div>

    <samp id="samp">
      <p>{{runResult}}</p>
    </samp>

    </div>


   </div> 
</template>

<script>
export default {
  name: 'AICodeGeneratorJira',

data() {
  return {
     jiraItems : [],
     selectedJiraItem : '',
     runResult : 'No Run Results...'
  }
},
created() {
    this.populateJiraItems()
  },

methods: {


  async populateJiraItems(){
      const response = await this.$http.get("/processingApi/getJiraItems");
       for (var i = 0; i < response.data.length; i++){
          var issue =  response.data[i]
          this.jiraItems.push(issue)
       }
  },

  clear(){
    this.runResult = 'No Run Results...'
  },

    async run() {
         try{
         this.runResult = 'Running Test for Selected Item: ' + this.selectedJiraItem 
          const response = await this.$http.get("/processingApi/runTest?issue="  + this.selectedJiraItem);      
          this.runResult = response.data
          console.log(response)
        } 
          catch (error) {
            this.runResult = "A Processing Error has occured, please check the logs for further details."
          }
    },

    async submitTradeClick () {
      const fullsymbol =  this.symbol + '_' + this.expirationDate + this.callput + this.strike
      const payload = {stopLoss: this.stoplossBinding, symbol: fullsymbol, underlying: this.symbol };

     try {
         await this.$http.post("/trading/submittrade", payload);
        // JSON responses are automatically parsed.
      //  console.log(response);
      } catch (error) {
      //  console.log(error);
      }
     
  }
}
}
</script>

<style>


#samp {
  background: #000;
  border: 3px groove #ccc;
  color: #ccc;
  display: block;
  padding: 5px;
  width: 850px;
  height: 350px;
  text-align: left;
}

#panelDiv {
  display: inline-flex;
padding: 16px;
flex-direction: column;
align-items: flex-end;
gap: 16px;
border-radius: 8px;
background: rgba(255, 255, 255, 0.70);
box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}

#runPan {
display: flex;
width: 350px;
justify-content: space-between;
align-items: flex-start;
}



#runbutton {
border-radius: 2px;
background: #25BCEF;
display: flex;
padding: 12px;
justify-content: center;
align-items: center;
gap: 10px;
margin-right: 10px;
}

#clearButton {
border-radius: 2px;
background: black;
color: white;
display: flex;
padding: 12px;
justify-content: center;
align-items: center;
gap: 10px;
}

#jiraItems{
display: flex;
padding: 6px 12px;
justify-content: space-between;
align-items: center;
flex: 1 0 0;
border: 1px solid #000;
background: #FFF;
margin-right: 10px;
height: 42px;
}

</style>