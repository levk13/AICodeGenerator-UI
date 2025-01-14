<template>
  <VueMultiselect v-model="selectedIssues"
    :options="issues"
    :multiple="true"
    :close-on-select="true"
    placeholder="Select Test Items:">
  </VueMultiselect>
</template>

<script>
import VueMultiselect from 'vue-multiselect'
import http from '../http-common'
export default {
  name: 'IssueSelector',

  components: {
    VueMultiselect
  },

  data() {
    return {
      issues: [],
      selectedIssues: []
    }
  },
  created() {
    this.populateItems()
  },

  methods: {
    getSelected() {
      return this.selectedIssues;
    },

    async populateItems() {
      const response = await http.get("/processingApi/getIssues");
      for (var i = 0; i < response.data.length; i++) {
        var issue = response.data[i]
        console.log(issue)
        this.issues.push(issue)
      }
    }
  },
  expose: ['getSelected']
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
