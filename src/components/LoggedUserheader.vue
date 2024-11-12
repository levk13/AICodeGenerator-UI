<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary py-0">
      <div class="container-fluid">


        <a class="navbar-brand flex-grow-0" aria-current="page" href="/">
          <img class="testwyze-logo__image"
            style="width: 2.5rem;"
            alt="Testwyze AI Logo"
            src="../assets/AILogo.svg">
        </a>
        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse flex-grow-0" id="navbarSupportedContent">

          <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li class="nav-item">
              <router-link to="/testrunner" class="nav-link">Test Runner</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/prompthelper" class="nav-link">Prompt Manager</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/issuecreator" class="nav-link">Issue Creator</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/workflowmanager" class="nav-link">Workflow Manager</router-link>
            </li>
          </ul>

          <ul class="navbar-nav user-nav">
            <li class="nav-item dropdown">
              <button
                class="btn dropdown-toggle d-flex align-items-center space-x-2"
                type="button"
                data-bs-toggle="dropdown" >
                <span style="width: 1.5rem; height: 1.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>user-c-frame</title><g fill="#ffffff"><path d="M16,0C7.178,0,0,7.178,0,16s7.178,16,16,16,16-7.178,16-16S24.822,0,16,0Zm0,6c3.032,0,5.5,2.467,5.5,5.5s-2.468,5.5-5.5,5.5-5.5-2.467-5.5-5.5,2.468-5.5,5.5-5.5Zm0,24c-3.97,0-7.552-1.669-10.102-4.333,1.706-3.964,5.653-6.667,10.102-6.667s8.396,2.703,10.102,6.667c-2.55,2.664-6.132,4.333-10.102,4.333Z"></path></g></svg>
                </span>
                <span class="text-capitalize text-secondary-emphasis me-2">{{ first_name }}</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li>
                  <a type="button" class="dropdown-item icon-link" @click.prevent="handleLogout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                      <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                    </svg>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>







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
    handleLogout() {
      this.$store.dispatch("auth/logout", this.$store.state.auth.user.id)
      this.$router.push("/")
    },
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
