<template>

  
<div>


  <div class="flex-container">
    
    <div class="flex-item">
      <div id="flex-right">
        <label id="label">Title</label>
        <input   v-model="issueTitle"/>
      </div>
      <div id="flex-right">
        <label id="label">File Name</label>
        <input v-model="fileName"/>
      </div>

      <div id="flex-right">
       <button class="btn btn-light"  v-on:click="createIssue">Create Issue</button>
      </div>

       <div id="flex-left">
      <input v-model="filterKeyword" type="text" @input="handleFilterChange" placeholder="Keyword Filter"> 
    </div>
  </div>
    
  <div class="flex-item"  id="flex-left">
    <div id="flex-left">
      <label id="label">Manual Case #:</label>
      <input id="manulcaseinput" v-model="manualtestcasenum">
      <button  class="btn btn-light" v-on:click="getmanualtest">Load Manual Test case Instructions</button>
    </div>
  
  </div>
 </div>
  
  <div class="flex-container">
    <div  class="flex-item">
      
      <div id ="table-scroll">      
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Key</th>
                    <!-- <th>View</th> -->
                    <th>Insert</th>
                </tr>
            </thead>
        <tbody>
            <tr v-for="row in filterItems" v-bind:key="row.key" >
                <td  data-toggle="tooltip" v-bind:title ="row.data.value">
                    {{row.data.key}}  
                </td>

                <td>
                    <button class="btn btn-success"  data-toggle="tooltip" v-bind:title ="row.data.value" data-placement="right" v-on:click="insertKeyword(row)">Insert</button>
                </td>
            </tr>
        </tbody>   
        </table> 
      </div>
  </div>
    
  <div  class="flex-item">     
    <textarea  v-model="instructions" id="instructions_test">
    </textarea>

  </div>
  </div>   
  <div>
</div>
</div>



  </template>
  
  <script>
  import http from '../http-common'
  import { Tooltip } from 'bootstrap'
  import "bootstrap/dist/css/bootstrap.min.css";
  export default {
    name: 'IssueCreator',
    mounted() {
      new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })

    },
  
    components: {
    },
  
  data() {
    return {
       issues : [],
       filterItems : [],
       promptkeywords : [], 
       instructions : '', 
       issueTitle : '', 
       fileName : '', 
       manualtestcasenum :'',
    }
  },
  created() {
    this.loadPromptKeywords()
    },
  
  methods: {
  

    insertKeyword(row){
      this.instructions += row.data.key
    },
  
    async getmanualtest(){ 
 
      const response = await http.get("/issuesApi/getmanualtest?manualtestnum="  + this.manualtestcasenum); 
      
      Object.entries(response.data.test_steps).forEach(entry => {
         this.instructions +=  entry[1] + '\n'
      })
      this.issueTitle = response.data.title
    },

    async populateItems(){
        const response = await http.get("/processingApi/getIssues");
         for (var i = 0; i < response.data.length; i++){
            var issue =  response.data[i]
            console.log(issue)
            this.issues.push(issue)
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
  
    clear(){
      this.runResult = ['No Active Test Results...']
    },

    handleFilterChange(){

  if(this.filterKeyword == ''){
    this.filterItems = this.promptkeywords
    console.log('No Filter')
    return;
  }
  this.filterItems = this.promptkeywords.filter(item => item.data.key.toLowerCase().includes(this.filterKeyword.toLowerCase()));
  },
  
    async createIssue(){
      var request = {
            "description" : this.instructions, 
            "title" : this.issueTitle, 
            "file_name" : this.fileName
        }
      await http.post("/issuesApi/createissuefromtestcase", request);      
    },  
    }
  }
  
  </script>
  
  <style>
    #instructions_test {
      width: 800px;
      height: 500px;
    }
  
    #ul {
      width: 200px;
      height: 500px;
    }

    .flex-container {
  display: flex;
  flex-direction: row;
}

 
  #flex-right {
    text-align: right;
  }
  #flex-left {
    text-align: left;
    margin-left: 20px;
  }
.flex-item {
  flex: 1;
}
#table-scroll {
  height:500px;
  max-height:500px;
  overflow:auto;  
  margin-top:20px;
}

#label {
  margin-right: 5px;
  margin-left: 5px;
  color: aliceblue;
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

#manulcaseinput{
  margin-right: 10px;
}

  </style>