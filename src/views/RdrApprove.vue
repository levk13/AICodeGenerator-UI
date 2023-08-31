<template>
  <div id="pagecontrol">
    <h3>RDR Daily Candidates - {{rdrType}}</h3>
    <label>RDR Types:
    <button  v-on:click="setRDRType('auto')">auto</button>
    <button  v-on:click="setRDRType('all')">all</button>
    <button  v-on:click="setRDRType('reverse')">reverse</button>
    </label>
  <br>
<div>
  <button  v-on:click="loadrdr">Load</button>
  <button  v-on:click="clear">Clear</button>
  <button  v-on:click="saveApproved">Save Approved</button>
  <button v-on:click="approveall(true)">Approve All</button>
  <button v-on:click="approveall(false)">Un-Approve All</button>
  <button  v-on:click="runPostOpen">Run Post Open Process</button>
  <button v-on:click ="generateWatchList">Generate Watch List</button>
  <input type="file" ref="file" @change="readFile()"> 
</div>

 <label>Filter for Approved: <input type="checkbox" v-model="isFilterForApprovedOn" @change=filterForApproved()></label>


<div id="gridContainer"> 
<datatable title="" :columns="columns" :rows="bindingAutoTradeCandidates" >
 <th slot="thead-tr">
   Is Approved
  </th>
  <th slot="thead-tr">
   Chart
  </th>
 <template slot="tbody-tr" slot-scope="props">
    <td>
       <input type="checkbox" v-model="props.row.approved"  @change=symbolUpdated(props.row)> 
    </td>

    <td>
        <button  v-on:click="openChart(props.row)">
         Chart
       </button>
    </td>
  </template>

</datatable>
</div>
</div>

</template>

<script>
import DataTable from "vue-materialize-datatable";
import {pythonBackEnd} from '../main'

export default {
  name: 'RdrApprove',
    components: {
 "datatable": DataTable
  } ,
  
 data() {
  return {
      isFilterForApprovedOn: false,
      autoTradeCandidates: [],
      bindingAutoTradeCandidates: [],
      rdrType : null,
      rdrTypeRetrievedFor :null,
        columns: [
        {
          label: 'Ticker',
          field: 'symbol',
        },
           {
          label: 'Last Price',
          field: 'lastPrice',
        }
        ]
  }
},

 methods: {

clear() {
  this.autoTradeCandidates = [];
  this.approved = [];
  this.bindingAutoTradeCandidates = [];
},

 openChart(row){
  const url = "https://www.tradingview.com/chart/c3cQyN39/?symbol=" + row.symbol; 
  window.open(url, "_target");
},
async saveApproved(){
  this.approved = [];
for (var i = 0; i < this.autoTradeCandidates.length; i++)
{
  var instance = this.autoTradeCandidates[i]; 
  if(instance.approved)
    this.approved.push(instance.symbol)
}
console.log(this.approved)

 const payload = {values: this.approved, description : this.rdrTypeRetrievedFor };
await pythonBackEnd.post("/algotrading/approverdr", payload);

},

approveall(shouldApprove){
  for (var i = 0; i < this.autoTradeCandidates.length; i++)
  {
    var instance = this.autoTradeCandidates[i]; 
      instance.approved = shouldApprove;
  }
},

generateWatchList(){
  var fullSymbols = this.autoTradeCandidates.map(item => item.fullSymbol)
  var FileSaver = require('file-saver');
  let text = fullSymbols.join("\r\n");
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  var fileName = "rdrCandidates_" + this.rdrType + ".txt"; 
  FileSaver.saveAs(blob, fileName);
},

readFile(){
  var fileName =  this.$refs.file.files[0];
  console.log(fileName);
  var reader = new FileReader(); 
  reader.onload = (res) => {
    var fileContent = res.target.result;
    var approved = fileContent.split(",");

    for (var i = 0; i < this.autoTradeCandidates.length; i++)
    {
      var instance = this.autoTradeCandidates[i]; 
      var fullSymbol = instance.fullSymbol;
      if(approved.includes(fullSymbol))
          instance.approved = true;
    }
  }

  reader.readAsText(fileName);},


setRDRType(rdrType){
  this.rdrType = rdrType;

   console.log(this.rdrType);
   console.log(this.rdrTypeRetrievedFor);
},
async runPostOpen(){
     try {
       await this.$http.get("/tradingstrategy/rdrbeginday");
       this.loadrdr();
      } catch (error) {
        console.log(error);
      }
},

async loadrdr() {
      try {
       
        if(this.rdrType==null) {
          alert("Select RDR Type");
          return;
        } 
      this.rdrTypeRetrievedFor = this.rdrType;

        //line to change is here....
       const response = await pythonBackEnd.get("/algotrading/getrdrcandiadates?rdrtype="  + this.rdrType);
       //const response = await this.$http.get("/tradingstrategy/getautotradecandidates/" + this.rdrType);
        // JSON responses are automatically parsed.
        this.autoTradeCandidates = response.data;
        
        for (var i = 0; i < this.autoTradeCandidates.length; i++)
         {
             var instance = this.autoTradeCandidates[i];
              instance.chartUrl = "https://www.tradingview.com/chart/c3cQyN39/?symbol=" + instance.symbol;
              instance = instance.lastPrice.toFixed(2);
        }
        this.bindingAutoTradeCandidates = this.autoTradeCandidates.map((a)=> a);       
        console.log(this.autoTradeCandidates);
      } catch (error) {
        console.log(error);
      }
    },

   filterForApproved(){
    if(this.isFilterForApprovedOn)
      this.bindingAutoTradeCandidates = this.bindingAutoTradeCandidates.filter((a) => a.approved == true )
    else 
      this.bindingAutoTradeCandidates = this.autoTradeCandidates.map((a)=>a);
   }, 

 }

}
</script>
<style scoped>
#gridContainer { 
  width: 50%;
}
</style>
 