<template>

  <div class="container-fluid">

    <div class="row">
      <div class="col-3">
        <div class="d-flex align-items-center py-3">
          <input v-model="filterKeyword"
            class="form-control"
            @input="handleFilterChange"
            type="text"
            placeholder="Keyword Filter">
          <button class="btn btn-light ms-4 flex-shrink-0" @click="clearAll">Clear All</button>
        </div>
        <div class="table-scroll">
          <table class="table table-bordered table-striped m-0">
            <thead>
              <tr>
                <th>Key</th>
                <!-- <th>View</th> -->
                <th class="text-center">Insert</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in filterItems" :key="row.key">

                <td class=""
                  style="vertical-align: middle;"
                  data-toggle="tooltip"
                  :title="row.data.value">
                  {{ row.data.key }}
                </td>

                <td class="text-center">
                  <button class="btn btn-outline-light btn-sm"
                    @click="insertKeyword(row)"
                    :title="row.data.value"
                    data-toggle="tooltip"
                    data-placement="right"
                    aria-label="Insert">
                    <i class="bi bi-arrow-right"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-5 align-left">
        <div class="py-3">
        <textarea v-model="instructions" class="instructions-test w-100">
        </textarea>
        </div>
      </div>

      <div class="col">

        <ul class="nav nav-tabs mt-3" id="myTab" role="tablist">

          <li class="nav-item" role="presentation">
            <button id="main-info-tab"
              class="nav-link active"
              :class="{ active: activeTab == 'mainInfo' }"
              data-bs-toggle="tab"
              data-bs-target="#main-info-tab-pane"
              type="button"
              role="tab"
              aria-controls="main-info-tab-pane"
              :aria-selected="activeTab == 'mainInfo'">
              Main Info
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button id="load-existing-tab"
              class="nav-link"
              :class="{ active: activeTab == 'loadExisting' }"
              data-bs-toggle="tab"
              data-bs-target="#load-existing-tab-pane"
              type="button"
              role="tab"
              aria-controls="load-existing-tab-pane"
              :aria-selected="activeTab == 'loadExisting'">
              Load Existing
            </button>
          </li>

          <li class="nav-item" role="presentation">
            <button id="manual-test-tab"
              class="nav-link"
              :class="{ active: activeTab == 'manualTest' }"
              data-bs-toggle="tab"
              data-bs-target="#manual-test-tab-pane"
              type="button"
              role="tab"
              aria-controls="manual-test-tab-pane"
              :aria-selected="activeTab == 'manualTest'">
              Get Manual Test
            </button>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">

          <div id="main-info-tab-pane"
            class="tab-pane fade show"
            :class="{ active: activeTab == 'mainInfo' }"
            @click="activeTab = 'mainInfo'"
            role="tabpanel"
            aria-labelledby="main-info-tab"
            tabindex="0">
            <div class="top-margin">
              <div class="mb-3">
                <label class="label">Title</label>
                <input class="form-control" v-model="issueTitle" />
              </div>

              <div class="mb-3">
                <label class="label">File Name</label>
                <input class="form-control" v-model="fileName" />
              </div>

              <div class="mb-3">
                <label class="label">Change Type</label>
                <input class="form-control" v-model="change_type" />
              </div>


              <div class="mb-3">
                <label class="label">Reference File Name</label>
                <input class="form-control" v-model="reference_file_name" />
              </div>

              <div class="mb-3">
                <label class="label">Branch Name</label>
                <input class="form-control" v-model="branch" />
              </div>

              <div class="mb-3">
                <button class="btn btn-light" @click="saveIssue">Save</button>
              </div>
              <div v-if="successfulSave" class="mb-3">
                <label class="label">Current Isuse # {{ issueId }}</label>
                <button class="btn btn-light" @click="ProcessIssue">Process </button>
              </div>
            </div>
          </div>

          <div id="load-existing-tab-pane"
            class="tab-pane fade show"
            :class="{ active: activeTab == 'loadExisting' }"
            @click="activeTab = 'loadExisting'"
            role="tabpanel"
            aria-labelledby="load-existing-tab"
            tabindex="0">
            <div class="py-3">
              <div class="d-flex align-items-center">
                <div style="width: 20rem;">
                  <IssueSelector class="issue_selector" ref="issueSelector" />
                </div>
                <button class="btn btn-light ms-2" @click="onGetIssue">Get</button>
              </div>
            </div>
          </div>

          <div id="manual-test-tab-pane"
            class="tab-pane fade show"
            :class="{ active: activeTab == 'manualTest' }"
            @click="activeTab = 'manualTest'"
            role="tabpanel"
            aria-labelledby="manual-test-tab"
            tabindex="0">
            <div class="mt-3">
              <label for="manualcaseinput" class="label">Manual Case #:</label>
              <div class="d-flex align-items-center space-x-4">
                <div class="input-group ">
                  <input id="manualcaseinput" class="form-control" v-model="manualtestcasenum">

                </div>
                <button class="btn btn-light" @click="getmanualtest">Get</button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  </div>

</template>

<script>
import http from '../http-common'
import { Tooltip } from 'bootstrap'
import IssueSelector from '../components/IssueSelector.vue'
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
      filterItems: [],
      promptkeywords: [],
      instructions: '',
      issueTitle: '',
      fileName: '',
      manualtestcasenum: '',
      change_type: '',
      mode: 'new',
      issueId: '',
      branch: '',
      successfulSave: false,
      activeTab: 'mainInfo',

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

    insertKeyword(row) {
      this.instructions += row.data.key
    },

    getIssue() {
      console.log(this.selectedIssues[0])
    },

    async getmanualtest() {

      const response = await http.get("/issuesApi/getmanualtest?manualtestnum=" + this.manualtestcasenum);

      Object.entries(response.data.test_steps).forEach(entry => {
        this.instructions += entry[1] + '\n'
      })
      this.issueTitle = response.data.title
    },

    async onGetIssue() {
      var selected = this.$refs.issueSelector.getSelected();
      var first = selected[0]

      const response = await http.get("/issuesApi/getissue?issue=" + first);
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

    async loadPromptKeywords() {
      const response = await http.get("/promptApi/getall");
      console.log(response.data)
      for (var i = 0; i < response.data.length; i++) {
        var item = response.data[i]
        this.promptkeywords.push({ data: item, isEditMode: false })

      }
      this.filterItems = this.promptkeywords;
      this.filterKeyword = '';
    },

    clear() {
      this.runResult = ['No Active Test Results...']
    },

    handleFilterChange() {

      if (this.filterKeyword == '') {
        this.filterItems = this.promptkeywords
        console.log('No Filter')
        return;
      }
      this.filterItems = this.promptkeywords.filter(item => item.data.key.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    },

    ProcessIssue() {
      if (this.issueId == '')
        return;


      this.$store.state.issuesToRUn = [this.issueId]
      this.$router.push("/testrunner");

    },

    async saveIssue() {
      var request = {
        "description": this.instructions,
        "title": this.issueTitle,
        "file_name": this.fileName,
        "change_type": this.change_type,
        "reference_file_name": this.reference_file_name,
        "branch": this.branch
      }

      if (this.mode == "edit") {
        request['id'] = this.issueId
      }

      var response = await http.post("/issuesApi/createissue", request);
      this.issueId = response.data
      this.successfulSave = true;
    },
  }
}

</script>

<style lang="scss">

.form-control {
  width: 500px;
}

.issue_selector {
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

/* .keyword {
  width: 500px;
  text-align: left;
  justify-content: left;
} */

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
  border: 3px solid whitesmoke;
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

.table-scroll {
  height: 500px;
  max-height: 500px;
  overflow: auto;
}

.label {
  color: aliceblue;
}

.margin {
  margin-left: 10px;
}

.manualcaseinput {
  margin-right: 10px;
}

.box {
  height: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.box > * {
  flex: 1 1 80px;
}

.top-margin {
  margin-top: 10px;
}
</style>
