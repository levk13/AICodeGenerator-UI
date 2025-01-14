<template>
  <div class="c-prompthelper">
    <div class="container">

      <div class="d-flex gap-3 mt-5">
        <!-- <button id="runbutton" v-on:click="manageVisibility('test')" >Run Test </button>   -->
        <button class="btn btn-primary flex-shrink-0"
          @click="manageVisibility('add')"
          v-show="!isAddNewVisible">
          <i class="bi bi-plus-lg"></i>
          Add New
        </button>

        <input v-model="filterKeyword"
          @input="handleFilterChange"
          class="form-control"
          type="text"
          placeholder="Keyword Search">
      </div>

      <InPageModal :open="isOpen">
        <div class="" v-if="isTestVisible">
          <select v-model="selectedItem" id="items">
            <option value="" disabled hidden>Select Issue</option>
            <option v-for="name in items" :key="name" :value="name">{{ name }}</option>
          </select>
          <button @click="run()" id="runbutton">Run Prompt Test</button>

          <textarea rows="10" cols="100" v-model="promptResponse" class="form-control">
            </textarea>
          <button @click="handleModalClosed()">Close</button>
        </div>

        <div class="p-4 border rounded" v-if="isAddNewVisible">
          <div class="space-y-4">
            <div>
              <label class="form-label" for="keyInput">Key:</label>
              <input class="form-control" type="text" v-model="addingKey" id="keyInput">
            </div>

            <div class="">
              <label class="form-label" for="valueInput">Value:</label>
              <input class="form-control" type="text" v-model="addingValue" id="valueInput">
            </div>

            <div class="d-flex space-x-4 mt-3">
              <button class="btn btn-primary" @click="add_record()">Add New</button>
              <button class="btn btn-outline-light" @click="handleModalClosed()">Cancel </button>
            </div>
          </div>
        </div>

      </InPageModal>
      <div v-if="isGridVisible" class="mt-3">
        <div class="table-scroll">
          <table class="table table-striped w-100 m-0 border-1">
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
              <tr v-for="row in filterItems" :key="row.data.id">
                <td>
                  <span class="font-monospace">{{ row.data.key }}</span>
                </td>

                <td>
                  <div class="item-description pe-4">
                    <textarea v-show="row.isEditMode"
                      rows="5"
                      cols="50"
                      :id="`description-${row.data.id}`"
                      v-model="row.data.value" />
                    <label :for="`description-${row.data.id}`" v-show="!row.isEditMode" v-text="row.data.value" />
                  </div>
                </td>

                <td>
                  <button class="btn btn-sm btn-outline-light"
                    @click="enableEditMode(row)">
                    <i class="bi bi-pencil"></i>
                    <span class="visually-hidden">Edit</span>
                  </button>
                </td>

                <td>
                  <button class="btn btn-sm btn-outline-light"
                    @click="saveRow(row)">
                    <i class="bi bi-floppy2-fill"></i>
                    <span class="visually-hidden">save</span>
                  </button>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-light"
                    @click="deleteRow(row)">
                    <i class="bi bi-x"></i>
                    <span class="visually-hidden">Delete</span>
                  </button>
                </td>



              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '../http-common'
import InPageModal from '../components/InPageModal.vue';
import { ref } from "vue";

export default {
  name: 'KeywordPrompt',
  components: { InPageModal },

  setup() {
    const isOpen = ref(false);
    return { isOpen }
  },

  data() {
    return {
      promptkeywords: [],
      items: [],
      filterItems: [],
      selectedItem: '',
      promptResponse: '',
      addingKey: '',
      addingValue: '',
      isGridVisible: true,
      isAddNewVisible: false,
      isTestVisible: false,
      filterKeyword: ''
    }
  },
  created() {
    this.loadPromptKeywords()
    //this.populateTestItems()
  },

  methods: {

    handleModalClosed() {
      this.isOpen = false;
      this.isGridVisible = true,
        this.isAddNewVisible = false,
        this.isTestVisible = false
    },


    handleFilterChange() {

      if (this.filterKeyword == '') {
        this.filterItems = this.promptkeywords
        console.log('No Filter')
        return;
      }
      this.filterItems = this.promptkeywords.filter(item => item.data.key.toLowerCase().includes(this.filterKeyword.toLowerCase()));
    },

    manageVisibility(clickBy) {
      this.isOpen = true;
      this.isGridVisible = false;
      if (clickBy == "test") {
        this.isTestVisible = true;
        this.isAddNewVisible = false;
      }
      else {
        this.isTestVisible = false;
        this.isAddNewVisible = true;
      }
    },


    async populateTestItems() {
      const response = await http.get("/processingApi/getItems");
      for (var i = 0; i < response.data.length; i++) {
        var issue = response.data[i]
        this.items.push(issue)
      }

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
    enableEditMode(row) {
      row.isEditMode = !row.isEditMode;
    },

    async saveRow(row) {
      console.log(row)
      await http.post("/promptApi/addupdate", row.data);
      row.isEditMode = !row.isEditMode;
    },

    async deleteRow(row) {
      console.log(row)
      await http.delete("/promptApi/delete?id=" + row.data.id);
      this.loadPromptKeywords();
    },

    async run() {
      this.runResult = []
      try {
        const response = await http.get("/promptApi/test?issue=" + this.selectedItem);
        this.promptResponse = response.data

      }
      catch (error) {
        this.runResult.push("A Processing Error has occured, please check the logs for further details.")
      }
    },

    async add_record() {
      var request = {
        "key": this.addingKey,
        "value": this.addingValue
      }
      await http.post("/promptApi/addupdate", request);
      this.addingKey = '';
      this.addingValue = '';
      this.loadPromptKeywords();
      this.handleModalClosed();
    }

  }
}

</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.multiselect {
  max-height: 20px;
  margin-right: 10px;
}

.multiselect__select {
  margin-right: 10px;
}

.multiselect__tag {
  width: 100px;
  background-color: #25BCEF;
}

table {
  width: 2000px;
  border-collapse: collapse;
  border: 3px solid #44475C;
  margin: 10px 10px 0 10px;
  max-height: 100px;
}

table td:last-child {
  border-right: none;
}

.table-scroll {
  height: 650px;
  overflow: auto;
}


</style>
