<template>
    <div id="header">
        <H3>Welcome, {{first_name}}</H3>
        <button  id="runbutton" v-on:click="handleLogout">Logout</button>
    </div>
</template>

<script>
export default {

    computed: {
    first_name() {
        return this.$store.state.auth.user.first_name;
    }
 },

methods: {
  handleLogout(){
    this.$store.dispatch("auth/logout")
    this.$router.push("/");
  },  
 }
}
</script>

<style>
#header {
display: flex;
width: 1000px;
justify-content: space-between;
align-items: flex-start;
}
</style>