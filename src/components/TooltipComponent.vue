<template>
  <!-- Tooltip component -->
  <v-tooltip :activator="tooltip_activator" :location="tooltip_location">{{
    tooltip_text
  }}</v-tooltip>
</template>

<script setup>
//Variables
const props = defineProps({
  tooltip_location: String,
  tooltip_activator: String,
  tooltip_text: String,
});
</script>

<style scoped lang="scss">
//Tooltip style
.v-tooltip {
  //Font style
  font-family: $primary-font;
}
</style>
