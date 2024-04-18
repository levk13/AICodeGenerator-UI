<template> 
    <div class="container">
       
        <div class="row">
            <div class="col">
                <div id ="table-scroll">      
        <table class="table table-bordered table-striped">
            <thead>
                <tr>
                    <th>Work Item</th>
                    <!-- <th>View</th> -->
                    <th>Insert</th>
                </tr>
            </thead>
        <tbody>
            <tr v-for="row in availableWorkItems" v-bind:key="row.id" >
                <td>
                    {{row.name}}  
                </td>

                <td>
                    <button class="btn btn-success" data-placement="right" v-on:click="insertWorkItem(row)">Insert</button>
                </td>
            </tr>
        </tbody>   
        </table> 
      </div>    
    </div>
           
            <div class="col">
                <ul>
                    <li v-for="workflowItem in workflowItems" :key="workflowItem.id">
                        <div class="card">
                            <div class="card-header">
                                {{workflowItem.name}}
                            </div>
                            
                            <div class="card-body text-right border-secondary mb-3">
                                <div><p class="card-text">Change Type: {{ workflowItem.change_type }}</p>
                                <!-- <p class="card-text">User Story #: {{ workflowItem.userStoryNum }}</p> -->
                            </div>
                            
                            <div class="row margin-top">
                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-success" style="height: auto;" data-bs-toggle="collapse" data-bs-target="#collapse-b1" aria-expanded="false" aria-controls="collapse-b1">
                                            File Info
                                        </button>
                                    </div>
                                </div>

                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-primary" style="height: auto;" data-bs-toggle="collapse" data-bs-target="#collapse-b2" aria-expanded="false" aria-controls="collapse-b2">
                                            Params
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div id="myGroup">  <!-- Add the parent id here -->
                                <div class="collapse" id="collapse-b1"  data-bs-parent="#myGroup">
                                    <div class="input_field_container"> 
                                        <label class="label">User Story Name: </label>
                                        <input class="input_field" v-model="workflowItem.user_story_name"/>
                                    </div>

                                    <div class="input_field_container"> 
                                        <label class="label">File Name: </label>
                                        <input class="input_field" v-model="workflowItem.file_name"/>
                                    </div>

                                    <div class="input_field_container"> 
                                        <label class="label">Ref Name: </label>
                                        <input class="input_field" v-model="workflowItem.reference_file_name"/>
                                    </div>
                                </div>

                            <div class="collapse" id="collapse-b2" data-bs-parent="#myGroup">
                                <div class="alert alert-primary mt-3">
                                    <div>      
                                        <table class="table table-bordered table-striped">
                                            <thead>
                                                 <tr>
                                                    <th>Parameter</th>
                                                    <th>Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="row in workflowItem.parameters" v-bind:key="row[0]" >
                                                    <td>{{row[0]}}</td>
                                                    <td><input  v-model="row[1]"/></td>
                                                </tr>
                                            </tbody>   
                                        </table> 
                                    </div>
                                </div>
                            </div>

                        
            <div class="align-right">      
                <button class="btn btn-secondary" @click =removeItem(workflowItem)>Remove</button>     
            </div>
            
                </div> <!--closing card div-->
                </div>
                </div>
            </li>
                </ul>
                <div class="align-right">
                 <button @click="createIssues" class="btn btn-light">Create Issues</button>
                </div>
            </div>
        </div>
    </div>  
</template>

  
  <script>
 // import LoginOld from '../components/LoginOld.vue'
 import "bootstrap/dist/css/bootstrap.min.css";

 import http from '../http-common'
  export default {
    name: 'WorkflowManager',
    components: {
    },

    data() {
    return {
      workflowItems: [], 
      availableWorkItems : []
    }
   },
   created(){
        this.loadAvailableWorkItems();
    },
   methods: {
    
    async createIssues(){
             await http.post("/issuesApi/createworkflow", this.workflowItems);
    },

    async loadAvailableWorkItems(){
      
         const response = await http.get("/issuesApi/getworkflowitems");
         for (var i = 0; i < response.data.length; i++){
            var item =  response.data[i]
            console.log(item)   
            item["user_story_name"] = ""; 
            item["file_name"] = "";
            item["reference_file_name"] = "";


            this.availableWorkItems.push(item);
         }
    
    },
    
    insertWorkItem(workItem) {
      console.log(workItem.id);
        this.workflowItems.push(workItem)
    }, 

    removeItem(workflowItem){
        this.workflowItems.splice(workflowItem, 1)
    }
  }
}
  </script>
  
  <style>
  .align-right{
    text-align: right;
  }

  .input_field_container{
    text-align: left;
    margin-bottom: 5px;
  }

  .input_field { 
    width:  600px;
  }

  .label {
  margin-right: 5px;
}
 </style>
   