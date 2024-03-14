<template>
  <div id="testpage">
    
    <div id="panelDiv"> 
      
         <div id="runPan">

           <VueMultiselect v-model="selectedIssues" :options="issues " 
           :multiple="true"  :close-on-select="true"  placeholder="Select Test Items:"></VueMultiselect >
        
          <button  v-on:click="run" id="runbutton">Run</button>
          <button  v-on:click="clear" id="clearButton">Clear</button>
         </div>

    <samp id="samp">
      <p v-for="(item, index) in runResult" v-bind:key="index">
        {{item}}
      </p>
      
     
    </samp>

    </div>


   </div> 
</template>

<script>
import http from '../http-common'
import VueMultiselect from 'vue-multiselect'
 
export default {
  name: 'AICodeGenerator',

  components: {
    VueMultiselect 
  },

data() {
  return {
     issues : [],
     selectedIssues : [],
     runResult : ['No Active Test Results...']
  }
},
created() {
    this.populateItems()
  },

methods: {



  async populateItems(){
      const response = await http.get("/processingApi/getIssues");
       for (var i = 0; i < response.data.length; i++){
          var issue =  response.data[i]
          console.log(issue)
          this.issues.push(issue)
       }
  },

  clear(){
    this.runResult = ['No Active Test Results...']
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


/* .multiselect__tag {
  color: rgb(48, 48, 48);
  background-color: rgba(var(--vs-primary), 0.3);
  font-size: 01rem;
}
.multiselect__tag:hover {
  background-color: rgba(var(--vs-warning), 0.3);
}


.multiselect__option--highlight {
  background-color: rgba(var(--vs-primary), 1);
  color: rgb(255, 255, 255);
  font-size: 0.9rem;
  height: 1rem;
}

//drop down content area.
.multiselect__content {
  background: rgb(255, 255, 255);
  color: #444;
  font-size: 0.9rem;
}

.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 0.25rem 1.625rem 0.25rem 0.625rem;

  margin-right: 0.625rem;

  line-height: 1;

  margin-bottom: 0.5rem;
} */


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