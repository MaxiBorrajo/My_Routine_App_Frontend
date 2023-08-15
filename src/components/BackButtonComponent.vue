<template>
  <!-- Button to go to the previous page -->
  <v-tooltip
    text="Click to go back"
    location="end"
  >
    <template v-slot:activator="{ props }">
      <v-icon
        icon="fa-solid fa-left-long"
        class="btn_back"
        @click="go_back()"
        v-bind="props"
      >
      </v-icon>
    </template>
  </v-tooltip>
</template>

<script setup>
//Imports
import router from "../router/index";

//Methods
/**
 * Function to go to the previous page
 */
function go_back() {
  router.go(-1);
}
</script>

<style scoped lang="scss">
//Button back style
.btn_back {
  //Position
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1;

  //Color
  color: rgb(var(--v-theme-text));
}

</style>
