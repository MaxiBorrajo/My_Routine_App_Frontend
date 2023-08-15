<template>
  <!-- Overlay -->
  <v-overlay :persistent="true" scroll-strategy="none">
    <!-- Load circle -->
    <ProgressCircularComponent
      progress_circular_color="attention"
      :progress_circular_indeterminate="true"
      :progress_circular_size="70"
      :progress_circular_width="7"
    />
  </v-overlay>
</template>

<script setup>
//Imports
import ProgressCircularComponent from "@/components/ProgressCircularComponent.vue";

//Variables
const props = defineProps({
  overlay_activator: Boolean
});

</script>

<style scoped lang="scss">
//Overlay's style
.v-overlay {
  //Display
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
