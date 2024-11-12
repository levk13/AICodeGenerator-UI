<template>
  <div class="container">

    <div class="row">

      <div class="col">
        <div class="mt-3">
          <h2 class="text-body fs-3">Available Workflow Items</h2>
          <div class="table-scroll mt-3">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Work Item</th>
                  <!-- <th>View</th> -->
                  <th>Insert</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in availableWorkItems" v-bind:key="row.id">
                  <td>
                    {{ row.name }}
                  </td>

                  <td>
                    <button class="btn btn-success"
                      data-placement="right"
                      v-on:click="insertWorkItem(row)">
                      Insert
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="mt-3">
          <h2 class="text-body fs-3">Pending Workflow Items</h2>
          <ul class="list-unstyled">
            <li v-for="workflowItem in workflowItems" :key="workflowItem.id" class="mt-3">
              <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <span>{{ workflowItem.name }}</span>
                  <button class="btn btn-secondary ms-3"
                    @click=removeItem(workflowItem)
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    data-bs-title="Remove"
                    aria-label="Remove">
                    <i class="bi bi-x-lg"></i>
                  </button>
                </div>

                <div class="card-body text-right border-secondary">
                  <div class="mb-3">
                    <p class="card-text">Change Type: <code>{{ workflowItem.change_type }}</code></p>
                    <!-- <p class="card-text">User Story #: {{ workflowItem.userStoryNum }}</p> -->
                  </div>

                  <div class="d-flex space-x-4">
                    <button type="button"
                      class="btn btn-success"
                      style="height: auto;"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse-b1"
                      aria-expanded="false"
                      aria-controls="collapse-b1">
                      File Info
                    </button>
                    <button type="button"
                      class="btn btn-primary"
                      style="height: auto;"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse-b2"
                      aria-expanded="false"
                      aria-controls="collapse-b2">
                      Params
                    </button>
                  </div>

                  <div id="myGroup"> <!-- Add the parent id here -->
                    <div class="collapse" id="collapse-b1" data-bs-parent="#myGroup">


                      <div class="input_field_container mt-3">
                        <label class="label">User Story Name: </label>
                        <input class="form-control" v-model="workflowItem.user_story_name" />
                      </div>

                      <div class="input_field_container">
                        <label class="label">File Name: </label>
                        <input class="form-control" v-model="workflowItem.file_name" />
                      </div>

                      <div class="input_field_container">
                        <label class="label">Ref Name: </label>
                        <input class="form-control" v-model="workflowItem.reference_file_name" />
                      </div>

                    </div>

                    <div class="collapse" id="collapse-b2" data-bs-parent="#myGroup">
                      <table class="table table-bordered table-striped m-0 mt-3">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in workflowItem.parameters" v-bind:key="row[0]">
                            <td><p class="mt-2 mb-0"><code class="font-monospace">{{ row[0] }}</code></p></td>
                            <td><input class="form-control" v-model="row[1]" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            </li>
          </ul>
          <div class="align-right space-x-4">
            <button @click="createIssues"
              class="btn btn-light">
              Create Issues
            </button>
            <button @click="processIssues"
              v-show="this.createdIssues.length > 0"
              :disabled="this.createdIssues.length == 0"
              class="btn btn-light">
              Process Issues
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
// import LoginOld from '../components/LoginOld.vue'

import http from '../http-common'
import { Tooltip } from 'bootstrap'

export default {
  name: 'WorkflowManager',
  components: {
  },

  data() {
    return {
      workflowItems: [],
      availableWorkItems: [],
      createdIssues: [],
      itemsFetched: false,
    }
  },


  created() {
    this.loadAvailableWorkItems();
    this.createdIssues = [];
  },


  mounted() {
    // Initialize Bootstrap Tooltips
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
  },


  methods: {
    async createIssues() {
      let response = await http.post("/issuesApi/createworkflow", this.workflowItems);
      this.createdIssues = response.data;
      this.itemsFetched = true;
    },

    processIssues() {
      if (this.createdIssues.length == 0) {
        return;
      }
      // this.createdIssues.push(12465);
      // this.createdIssues.push(3434);
      this.$store.state.issuesToRUn = this.createdIssues
      this.$router.push("/testrunner");
    },

    async loadAvailableWorkItems() {

      const response = await http.get("/issuesApi/getworkflowitems");
      for (var i = 0; i < response.data.length; i++) {
        var item = response.data[i]
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

    removeItem(workflowItem) {
      this.workflowItems.splice(workflowItem, 1)
    }
  }
}
</script>
