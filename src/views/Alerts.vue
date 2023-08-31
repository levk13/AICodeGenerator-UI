<template>
   <div >

       <table>
          <tr  id="element">
            <td>
                  <AlertsGrid sentiment="bull"/>
            </td>
            <!-- <td>
                <AlertsGrid sentiment="bear"/>
            </td> -->
          </tr>
       </table>
  </div>

</template>

<script>
import AlertsGrid from '../components/AlertsGrid.vue'
export default {
  name: 'Alerts',
 components: {
    AlertsGrid
  },

data() {
  return {
     
    }
},


methods: {

 }
}
</script>

<style>

#element {
vertical-align: top;
}
</style>

