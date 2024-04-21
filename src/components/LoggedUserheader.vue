<template>
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
   
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">   
            <button type="button" v-on:click="routeToTestRunner" class="btn btn-light">Test Runner</button>
        </li>
       
        <li class="nav-item">   
            <button type="button" v-on:click="routeToPrompt" class="btn btn-light">Prompt Manager</button>
        </li>
    
        <!-- <li class="nav-item">   
            <button type="button" v-on:click="routeToIssueCreator" class="btn btn-light">Issue Creator</button>
        </li> -->
    
        <li class="nav-item">   
            <button type="button" v-on:click="routeToWorkFlow" class="btn btn-light">Workflow Manager</button>
        </li>

      </ul>
       
    <div class="d-flex">
     <label >{{ first_name}}</label>
      <button class="btn btn-dark" v-on:click="handleLogout">Logout</button>
    </div>
    
    </div>
  </div>
</nav>
  </div>

</template>

<script>
export default {

    computed: {
    first_name() {
        return this.$store.state.auth.user.first_name;
    }, 
 },

methods: {
  handleLogout(){
    this.$store.dispatch("auth/logout", this.$store.state.auth.user.id)
    this.$router.push("/")
  },
  
  routeToTestRunner(){
    this.$router.push("/testrunner");
    
  },

  routeToPrompt(){
    this.$router.push("/prompthelper");
    
  },

  routeToIssueCreator(){
    this.$router.push("/issuecreator");
    
  },
  routeToWorkFlow(){
    this.$router.push("/workflowmanager");
    
  }


  


 }
}
</script>

<style>
#header {
display: flex;
justify-content: space-between;
align-items: flex-start;
}
</style>