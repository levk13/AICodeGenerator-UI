<template>
  <div id="app" class="main">

    <div id="div">
      <LoginOld id="login" />
    </div>
  </div>
</template>

<script>
import LoginOld from '../components/LoginOld.vue'

export default {
  name: 'Home',
  components: {
    LoginOld
  }
}

</script>
