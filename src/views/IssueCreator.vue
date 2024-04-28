<template>

  
<div class="container-fluid">
       
       <div class="row">
           <div class="col">
            <div class="keyword">
              <input v-model="filterKeyword" type="text" @input="handleFilterChange" placeholder="Keyword Filter"> 
              <button  class="btn btn-light" id="margin" v-on:click="clearAll">Clear All</button>
            </div>
           </div> <!-- Close of COL 1--> 
       </div> <!-- Close of ROW 1-->   


       <div class="row">
          <div class="col, keyword">
            <div id ="table-scroll">      
            <table class="table table-bordered table-striped ">
              <thead>
                <tr>
                    <th>Key</th>
                    <!-- <th>View</th> -->
                    <th>Insert</th>
                </tr>
            </thead>
            <tbody>
              <tr v-for="row in filterItems" v-bind:key="row.key" >
                <td data-toggle="tooltip" v-bind:title ="row.data.value">
                    {{row.data.key}}  
                </td>

                <td>
                    <button class="btn btn-success"  data-toggle="tooltip" v-bind:title ="row.data.value" data-placement="right" v-on:click="insertKeyword(row)">Insert</button>
                </td>
            </tr>
        </tbody>   
        </table> 
      </div>
    </div> <!-- Close of COL 1--> 
       
      <div  class="col align-left">     
        <textarea  v-model="instructions" class ="instructions_test">
        </textarea>
      </div>

  <div class="col">
    <div class ="align-left"> 
      <div class="row margin-top">
                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-light" style="height: auto; width: 150px;" data-bs-toggle="collapse" data-bs-target="#collapse-b1" aria-expanded="false" aria-controls="collapse-b1">
                                            Main Info
                                        </button>
                                    </div>
                                </div>

                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-light" style="height: auto;  width: 150px;" data-bs-toggle="collapse" data-bs-target="#collapse-b2" aria-expanded="false" aria-controls="collapse-b2">
                                            Load Existing
                                        </button>
                                    </div>
                                </div>
                            
                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-light" style="height: auto;  width: 150px;" data-bs-toggle="collapse" data-bs-target="#collapse-b3" aria-expanded="false" aria-controls="collapse-b2">
                                            Get Manual Test
                                        </button>
                                    </div>
                                </div>
                            
                              </div>

                            <div id="myGroup">  <!-- Add the parent id here -->
                                <div class="collapse" id="collapse-b1"  data-bs-parent="#myGroup">
                                  <div class="top-margin">
                                  <div class="input_field_container_right"> 
                                      <label id="label">Title</label>
                                      <input class="input_fields"  v-model="issueTitle"/>
                                    </div>

                                    <div class="input_field_container_right"> 
                                      <label id="label">File Name</label>
                                      <input class="input_fields" v-model="fileName"/>
                                    </div>

                                    <div class="input_field_container_right"> 
                                      <label id="label">Change Type</label>
                                       <input class="input_fields" v-model="change_type"/>
                                    </div>


                                    <div class="input_field_container_right"> 
                                      <label id="label">Reference File Name</label>
                                      <input class="input_fields" v-model="reference_file_name"/>
                                    </div>

                                    <div class="input_field_container_right"> 
                                      <label id="label">Branch Name</label>
                                      <input class="input_fields" v-model="branch"/>
                                    </div>

                                    <div  class="input_field_container_right" >
                                      <button class="btn btn-light" @click="saveIssue">Save</button>
                                     </div>
                                     <div v-if="successfulSave" class="input_field_container_right" >
                                      <label>Current Isuse # {{ issueId }}</label>
                                      <button class="btn btn-light" @click="ProcessIssue">Process </button>
                                     </div>
                               
                                    </div>
                                  
                              
                                  
                                  

                                </div>

                            <div class="collapse" id="collapse-b2" data-bs-parent="#myGroup">
                              <div class="margin-top">
                              <div class="input_field_container_right">
                              <br>
                                <IssueSelector class="issue_selector" ref ="issueSelector"/>
                             
                             <button class="btn btn-light" @click="onGetIssue">get</button>
                            </div> 
                          </div>
                          </div>
                            
                            <div class="collapse" id="collapse-b3" data-bs-parent="#myGroup">
                              <div class="flex-right">
                                <label id="label">Manual Case #:</label>
                                <input id="manulcaseinput" v-model="manualtestcasenum">
                                 <button  class="btn btn-light" @click="getmanualtest">Get</button>
                                </div>
                            </div> 
                      </div>   
      </div>
  </div>
 </div>   

  <!--This is the right column of main grid-->
 



</div>



  </template>
  
  <script>
  import http from '../http-common'
  import { Tooltip } from 'bootstrap'
  import IssueSelector from '../components/IssueSelector.vue'
  import "bootstrap/dist/css/bootstrap.min.css";
//  import { ref} from 'vue'

  export default {
    name: 'IssueCreator',
    mounted() {
      new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })

    },
  
    components: {
      IssueSelector
    },
  
  data() {
    return {
       filterItems : [],
       promptkeywords : [], 
       instructions : '', 
       issueTitle : '', 
       fileName : '', 
       manualtestcasenum :'',
       change_type : '',
       mode : 'new', 
       issueId : '', 
       branch : '',
       successfulSave : false,
    }
  },
  created() {
    this.loadPromptKeywords()
    },
  
  methods: {
  

    clearAll() {
      this.issueTitle = '';
      this.fileName = ''; 
      this.manualtestcasenum = '';
      this.instructions = '';
      this.issueId = '';
      this.successfulSave = false;
    },

    insertKeyword(row){
      this.instructions += row.data.key
    },

    getIssue(){
      console.log(this.selectedIssues[0]) 
    },
  
    async getmanualtest(){ 
 
      const response = await http.get("/issuesApi/getmanualtest?manualtestnum="  + this.manualtestcasenum); 
      
      Object.entries(response.data.test_steps).forEach(entry => {
         this.instructions +=  entry[1] + '\n'
      })
      this.issueTitle = response.data.title
    },

    async onGetIssue() {
       var selected = this.$refs.issueSelector.getSelected();
       var first = selected[0] 

       const response = await http.get("/issuesApi/getissue?issue="  +first);     
       var data = response.data;
       this.issueTitle = data.title;
       this.instructions = data.description;  
       this.fileName = data.file_name;
       this.reference_file_name = data.reference_file_name;
       this.change_type = data.change_type;
       this.mode = "edit";
       this.issueId = first;
       this.branch = data.branch;
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

  ProcessIssue(){
        if(this.issueId == '') 
            return; 
        
            
        this.$store.state.issuesToRUn = [this.issueId]
        this.$router.push("/testrunner");    

    },
  
    async saveIssue(){
      var request = {
            "description" : this.instructions, 
            "title" : this.issueTitle, 
            "file_name" : this.fileName, 
            "change_type": this.change_type, 
            "reference_file_name" : this.reference_file_name,
            "branch" : this.branch
        }

        if(this.mode=="edit"){
          request['id'] = this.issueId
        }

      var response = await http.post("/issuesApi/createissue", request);      
      this.issueId = response.data
      this.successfulSave = true;
    },  
    }
  }
  
  </script>
  
  <style>
    .instructions_test {
      width:  1050px;
      height: 520px;
    }
  

    .input_fields {
      width:  500px;
    }

    .issue_selector{
      width: 300px;
    }


    .flex-container {
  display: flex;
  flex-direction: row;
}

.flex-container-column {
  display: flex;
  flex-direction: columns;
  margin-right: 20px;
}

.section_label { 
 color: white;
}

.keyword { 
  width: 500px;
  text-align: left;
  justify-content: left;
}

.item1 {
    flex: 0 1 auto;
    margin-left: 15px;
}

.item2 {
    flex: 0 1 auto;
    justify-content: left;
    margin-left: 15px;
  }

  .border-container-item {
    flex: 0 1 auto;
    justify-content: left;
    margin-left: 15px;
    margin-bottom: 20px;
    border:3px solid whitesmoke;
  }
 
  .flex-right {
    text-align: right;
    margin-right: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .flex-left {
    text-align: left;
    margin-left: 20px;
  }

  .align-left { 
    text-align: left;
  }
.flex-item {
  flex: 0 1 auto;
}
.flex-item-right {
  flex-basis: 80%;
  width: 1000px;
  justify-content: left;
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

#margin { 
  margin-left: 10px;
}

#manulcaseinput{
  margin-right: 10px;
}
.box {
  height: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.box>* {
  flex: 1 1 80px;
}

.input_field_container_right{
    text-align: right;
    margin-bottom: 30px;
  }

  .top-margin {
    margin-top: 10px;
  }
  </style>