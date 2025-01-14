<template>
  <div class="c-aicodegenerator mx-auto text-center pt-5">
    <div class="container">
      <div class="">

        <div class="runPan text-left d-flex space-x-4 align-items-stretch mb-3">

          <VueMultiselect v-model="selectedIssues"
            :options="issues"
            :multiple="true"
            :close-on-select="true"
            placeholder="Select Test Items:">
          </VueMultiselect>

          <button @click="run" type="button" class="btn btn-large btn-primary">Run</button>
          <button @click="clear" type="button" class="btn btn-large btn-outline-dark">Clear</button>
        </div>

        <samp class="samp">
          <p v-for="(item, index) in runResult" v-bind:key="index">
            {{ item }}
          </p>
        </samp>

      </div>
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
      issues: [],
      selectedIssues: [],
      runResult: ['No Active Test Results...']
    }
  },
  created() {
    this.populateItemsAndLoadAnyToRun()
  },

  methods: {



    async populateItemsAndLoadAnyToRun() {
      const response = await http.get("/processingApi/getIssues");
      for (var i = 0; i < response.data.length; i++) {
        var issue = response.data[i]
        console.log(issue)
        this.issues.push(issue)
      }

      this.selectedIssues = this.$store.state.issuesToRUn
      this.$store.state.issuesToRUn = []
      // console.log(issuesToRun);
    },

    clear() {
      this.runResult = ['No Active Test Results...']
    },

    async run() {
      this.runResult = []
      for (var i = 0; i < this.selectedIssues.length; i++) {
        try {
          var selectedItem = this.selectedIssues[i];
          this.runResult.push('Running Test for Selected Item: ' + selectedItem)
          const response = await http.get("/processingApi/runTest?issue=" + selectedItem);
          this.runResult.push(response.data)
        }
        catch (error) {
          if (error.response == null) {
            this.runResult.push("A Processing error has occured, please contact support for assistence.")
          }
          else if (error.response.data == null) {
            this.runResult.push("A Processing error has occured, please contact support for assistence.")
          }
          else if (error.response.data.message == null) {
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
