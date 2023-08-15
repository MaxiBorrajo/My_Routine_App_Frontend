<template>
  <!-- Load circle component -->
  <v-progress-circular
    :model-value="progress_circular_model_value"
    :size="progress_circular_size"
    :width="progress_circular_width"
    :color="progress_circular_color ? progress_circular_color : 'attention'"
    :indeterminate="progress_circular_indeterminate"
  >
    {{ progress_circular_inside_value }}
  </v-progress-circular>
</template>

<script setup>
//Variables
const props = defineProps({
  progress_circular_model_value: Number,
  progress_circular_size: Number,
  progress_circular_width: Number,
  progress_circular_color: String,
  progress_circular_indeterminate: Boolean,
  progress_circular_inside_value: String || Number,
});
</script>

<style scoped lang="scss">
//Load circle's styles
.v-progress-circular {
  //Font
  font-family: $primary-font;
}
</style>
