<template>
     <transition name="fade">
        <div class="vue-modal" v-show="open">
        <div class ="vue-modal-content">

            <br/>
            <slot/>
        </div>
        <!-- <button id="runbutton" @click="$emit('close')">close</button> -->
    </div>
</transition>

</template>

<script>

export default{
    props: {
        open : {
            type: Boolean,
            required: true
        }
    }

}
</script>


<style>
::before,
::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.vue-modal {
  /* position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1; */
}

.vue-modal-inner {
  /* max-width: 500px;
  margin: 2rem auto; */
}

.vue-modal-content {
  /* position: relative;
  background: radial-gradient(50% 50% at 50% 50%, #05C1FC 0%, #009ECF 41.67%, #00789D 100%);
  border: 1px solid rgba(15, 2, 2, 0.3);
  background-clip: padding-box;
  border-radius: 0.3rem;
  padding: 1rem; */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>
