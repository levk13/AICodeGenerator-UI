<template>

  
<div>


  <div> 
    <label>Issue Name</label>
    <input v-model="issueName"/>

    <label>File Name</label>
    <input v-model="fileName"/>
    <button  v-on:click="getmanualtest">Load Manual Test case Instructions</button>


  </div>

 
  
  <div class="flex-container">
    <div  class="flex-item">
      <input id="keywordFilter" v-model="filterKeyword" type="text" @input="handleFilterChange" placeholder="Keyword Filter"> 
      <div id ="table-scroll">      
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>View</th>
                    <th>Insert</th>
                </tr>
            </thead>
        <tbody>
            <tr v-for="row in filterItems" v-bind:key="row.key" >
                <td>
                    {{row.data.key}}  
                </td>

                <td>
                    <button class="btn btn-outline-primary" v-on:click="openAlert(row)">View</button>
                </td>


                <td>
                    <button class="btn btn-success" v-on:click="insertKeyword(row)">Insert</button>
                </td>
           

            </tr>
        </tbody>   
        </table> 
      </div>

    
  </div>
    
  <div  class="flex-item">
    <button  v-on:click="createIssue">Create Issue</button>
    <textarea  v-model="instructions" id="instructions_test">
    </textarea>

  </div>
    <!-- <b-form-textarea
      id="textarea"
      v-model="text"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>   -->

  </div>   
  <div>
</div>
</div>



  </template>
  
  <script>
  import http from '../http-common'
  import "bootstrap/dist/css/bootstrap.min.css";
  export default {
    name: 'IssueCreator',
  
    components: {
    },
  
  data() {
    return {
       issues : [],
       filterItems : [],
       promptkeywords : [], 
       instructions : '', 
       issueName : '', 
       fileName : ''
    }
  },
  created() {
    this.loadPromptKeywords()
    },
  
  methods: {
  

    insertKeyword(row){
      this.instructions += row.data.key
    },
  
    openAlert(row){
      alert(row.data.value)
    },

    async getmanualtest(){ 
      var issue = "48032"
      const response = await http.get("/issuesApi/getmanualtest?manualtestnum="  + issue); 
      
      Object.entries(response.data.test_steps).forEach(entry => {
         this.instructions +=  entry[1] + '\n'
      })
      this.issueName = response.data.title
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
            "testcasenumber": "48032", 
            "instructions" : this.instructions
        }
      await http.post("/issuesApi/createissuefromtestcase", request);      
    },

      async run() {
        this.runResult = []
        for (var i = 0; i < this.selectedIssues.length; i++){
            try{
                var selectedItem = this.selectedIssues[i];
                this.runResult.push('Running Test for Selected Item: ' + selectedItem)
                const response = await http.get("/processingApi/runTest?issue="  +selectedItem);      
                this.runResult.push(response.data)
            }
            catch (error) {
              if (error.response==null){
                this.runResult.push("A Processing error has occured, please contact support for assistence.")
              } 
              else if (error.response.data== null){
                this.runResult.push("A Processing error has occured, please contact support for assistence.")
              }
              else if(error.response.data.message ==null){
                this.runResult.push("A Processing error has occured, please contact support for assistence.")
              }
              else {
                this.runResult.push(error.response.data.message)
              }
            }
          }
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

  #keywordFilter {
    align-content: flex-start
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
  </style>