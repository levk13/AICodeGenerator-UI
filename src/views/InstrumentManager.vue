<template>
  <div id="pagecontrol">
   <button  v-on:click="load">Load</button>
    <button  v-on:click="clear">Clear</button>
<button  v-on:click="save">Save</button>
<label >Import </label>
<input id="name" type="file" ref="file" @change="loadNewInstruments()">
  <button v-on:click="getShortInterest">generate Short Interest Watch List</button>
 
 <!-- <v-data-table :headers="headers" :items="symbols" :search="search" class="elevation-1" fixed-header height="350px"/> -->

 <div id="gridContainer"> 
<datatable title="Instruments" :columns="columns" :rows="symbols" exactSearch=true>

  <th slot="thead-tr">
    Is premium
  </th>
  <th slot="thead-tr">
    Is RDR
  </th>
  <template slot="tbody-tr" slot-scope="props">
    <td>
       <input type="checkbox" v-model="props.row.data.isPremium"  @change=symbolUpdated(props.row)> 
    </td>

    <td>
       <input type="checkbox" v-model="props.row.data.rdroptionEnabled"  @change=symbolUpdated(props.row)> 
    </td>


  </template>
</datatable>
 </div>
</div>
</template>

<script>
import {pythonBackEnd} from '../main'
import DataTable from "vue-materialize-datatable";

// @ is an alias to /src

export default {
  name: 'InstrumentManager',
  components: {
 "datatable": DataTable
},

 data() {
  return {
      symbols: [],
      shortInterst :[],
      columns: [
        {
          label: 'Ticker',
          field: 'data.ticker',
        },
        {
          label: 'Exchange',
          field: 'data.exchange'
        },
        {
          label: 'Type',
          field: 'data.type',
        },
        
        {
          label: 'Last Close',
          field: 'data.lastClosePrice',
          type: 'number',
        },
     {
          label: 'Is Premium',
          field: 'data.isPremium',
        }
        ],
  }
},

 methods: {

clear() {
  this.symbols = [];
},


async save(){
        var response = [];
        console.log(this.symbols)
        for (var i = 0; i < this.symbols.length; i++)
        {
             var instance = this.symbols[i];
             if(instance.isUpdated)
              response.push(instance.data);
        }
        await this.$http.post("/symbol/save", response);
        console.log(response);
},

async getShortInterest(){
  var respone = await this.$http.get("/symbol/shortInterest");

  var FileSaver = require('file-saver');
  let text = respone.data.join("\r\n");
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  var fileName = "shortInterest" + ".txt"; 
  FileSaver.saveAs(blob, fileName);


  console.log(respone);
},


symbolUpdated: function(row){
    row.isUpdated = true;
},

async load() {
      try {
       
        const response = await pythonBackEnd.get("/equityinstrument/all");
        // JSON responses are automatically parsed.
        for (var i = 0; i < response.data.length; i++)
        {
             var instance = response.data[i];
             var rowInstance = {data: instance, isUpdated : false};
             this.symbols.push(rowInstance);

        } 
      } catch (error) {
        console.log(error);
      }
    },

  async loadNewInstruments(){
    var fileName =  this.$refs.file.files[0];
    console.log(fileName);
    var reader = new FileReader(); 
    reader.onload = (res) => {
      console.log('HIT HERE')
      var fileContent = res.target.result;
      pythonBackEnd.post("/equityinstrument/addnewinstruments", fileContent.split(","));
}
  reader.readAsText(fileName);

 },
}
}


</script>

<style>
/* table {
  border-collapse: collapse;
  border: 3px solid #44475C;
}

table th {
  text-align: left;
  background: #44475C;
  color: white;
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
} */


#gridContainer { 
  width: 50%;
}

</style>