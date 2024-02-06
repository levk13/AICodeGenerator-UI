<template>
    <div id="jiraPage">
     
      <div class="d-flex">
      <button id="runbutton" v-on:click="manageVisibility('test')" >Run Test </button>  
      <button  v-on:click="manageVisibility('add')" id="runbutton">Add New</button>  

      
      <input v-model="filterKeyword" type="text" @input="handleFilterChange" placeholder="Keyword Search">
      </div>

      <InPageModal :open="isOpen">
        <div id="panelDiv" v-if="isTestVisible" >
        <select  v-model="selectedItem" id="jiraItems">
                <option value="" disabled hidden>Select Issue</option>
              <option v-for="name in jiraItems" :key="name" :value="name">{{ name }}</option>
           </select>
           <button v-on:click="run()"  id="runbutton">Run Prompt Test</button>

           <textarea rows="10" cols="100" v-model="promptResponse">
           </textarea>
           <button v-on:click="handleModalClosed()">Close</button>   
        </div>
       
        <div id="panelDiv" v-if="isAddNewVisible" >
           <div> 
            <label>Key:</label>
            <input type="text" v-model="addingKey" >
            <label>Value:</label>
            <input type="text" v-model="addingValue">
            <button  v-on:click="add_record()">Add New </button>   
            <button  v-on:click="handleModalClosed()">Cancel </button>   
           </div>
        </div>

      </InPageModal> 
        <div id="table-wrapper"  v-if="isGridVisible" >
        <div id="table-scroll">
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Edit</th>
                    <th>Save</th>
                    <th>Delete</th>

                </tr>
            </thead>
        <tbody>
            <tr v-for="row in filterItems" v-bind:key="row.key" >
                <td>
                    {{row.data.key}}    
                </td>

                <td>
                    <textarea v-show="row.isEditMode" rows="5" cols="50" id="description"  v-model="row.data.value"/>
                 <label id="description" v-show="!row.isEditMode" v-text="row.data.value"/>  
                </td>

                <td>
                  <button class ="btn btn-outline-primary" v-on:click="enableEditMode(row)">edit</button>
                </td>

                <td>
                    <button class="btn btn-success" v-on:click="saveRow(row)">save</button>
                </td>
                <td>
                    <button class="btn btn-danger" v-on:click="deleteRow(row)">Delete</button>
                </td>



            </tr>
        </tbody>   
        </table> 
    </div>
        </div>
    </div>
  </template>
  
  <script>
  import http from '../http-common'
  import "bootstrap/dist/css/bootstrap.min.css";
  import InPageModal from '../components/InPageModal.vue';
  import {ref} from "vue";

  export default {
    name: 'KeywordPrompt',
    components: {InPageModal},
 
  setup(){
    const isOpen = ref(false);
    return {isOpen}
  },
  
  data() {
    return {
        promptkeywords : [],
        jiraItems :[], 
        filterItems :[],
        selectedItem : '',
        promptResponse : '',
        addingKey : '',
        addingValue : '', 
        isGridVisible: true,  
        isAddNewVisible: false, 
        isTestVisible: false, 
        filterKeyword: ''
    }
  },
  created() {
      this.loadPromptKeywords()
      this.populateJiraItems()
    },
  
  methods: {
  
    handleModalClosed(){
        this.isOpen = false;
        this.isGridVisible =  true,  
        this.isAddNewVisible= false, 
        this.isTestVisible= false
    },


    handleFilterChange(){

      if(this.filterKeyword == ''){
        this.filterItems = this.promptkeywords
        console.log('No Filter')
        return;
      }
      this.filterItems = this.promptkeywords.filter(item => item.data.key.includes(this.filterKeyword));
    },

    manageVisibility(clickBy){
      this.isOpen = true;
      this.isGridVisible = false;
      if(clickBy== "test"){
        this.isTestVisible = true; 
        this.isAddNewVisible = false;
      }
      else {
        this.isTestVisible = false; 
        this.isAddNewVisible = true;
      }
    },


    async populateJiraItems(){
      const response = await http.get("/processingApi/getJiraItems");
       for (var i = 0; i < response.data.length; i++){
          var issue =  response.data[i]
          this.jiraItems.push(issue)
       }

  },
  
    async loadPromptKeywords(){
        const response = await http.get("/promptApi/getall");
        console.log(response.data) 
        for (var i = 0; i < response.data.length; i++){
            var item =  response.data[i]
            this.promptkeywords.push({data:item, isEditMode : false})

         }
         this.filterItems = this.promptkeywords;
         this.filterKeyword = '';
    },
    enableEditMode(row){
        row.isEditMode = !row.isEditMode;
    },

    async saveRow(row){
        console.log(row)
         await http.post("/promptApi/addupdate",row.data); 
        row.isEditMode = !row.isEditMode;
    },
 
    async deleteRow(row){
        console.log(row)
         await http.delete("/promptApi/delete?id="  +row.data.id);    
         this.loadPromptKeywords();
    },
 
      async run() {
        this.runResult = []
            try{
                const response = await http.get("/promptApi/test?issue="  + this.selectedItem);      
                this.promptResponse = response.data
              
            }
            catch (error) {
              this.runResult.push("A Processing Error has occured, please check the logs for further details.")
            }
      },

      async add_record(){
        var request = {
            "key": this.addingKey,  
            "value": this.addingValue
        }
         await http.post("/promptApi/addupdate",request); 
         this.addingKey = ''; 
         this.addingValue = '';
         this.loadPromptKeywords();
         this.handleModalClosed();
      }
       
    }
  }
  
  </script>
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>
  
  <style>
  
  
  .multiselect {
  max-height: 20px;
  margin-right: 10px;
  }
  
  
  .multiselect__select{
    margin-right: 10px;
  
  
  }
  
  .multiselect__tag {
    width: 100px;
    background-color: #25BCEF;
  }
  
  
 
  
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
  
  #tableDiv {
    overflow: scroll;
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
  max-height: 60px;
  }

  table {
  font-family: 'Open Sans', sans-serif;
  width: 2000px;
  border-collapse: collapse;
  border: 3px solid #44475C;
  margin: 10px 10px 0 10px;
  max-height: 100px;
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
  background: whitesmoke;
}
table td:last-child {
  border-right: none;
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
  
#table-wrapper {
  position:relative;
}
#table-scroll {
  height:650px;
  overflow:auto;  
  margin-top:20px;
}
#table-wrapper table {
  width:100%;

}
#table-wrapper table * {

}

  </style>