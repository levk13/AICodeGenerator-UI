<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1>Test Page</h1>
        <BButton variant="primary">Notifications <BBadge variant="light">4</BBadge></BButton>
        <BButton @click="modal = !modal"> Toggle modal </BButton>
        <BModal v-model="modal" title="Hello, World!"> Foobar? </BModal>
      </div>
    </div>
  </div>
</template>


<script setup>

import { ref } from 'vue'
import { BButton, BModal, BBadge } from 'bootstrap-vue-next'

const modal = ref(false)


</script>
