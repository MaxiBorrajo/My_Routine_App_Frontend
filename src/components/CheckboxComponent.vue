<template>
  <!-- Checkbox -->
  <v-checkbox :label="checkbox_label" :value="checkbox_value"></v-checkbox>
</template>

<script setup>
//Variables
const props = defineProps({
  checkbox_value: null,
  checkbox_label: String,
});
</script>

<style scoped lang="scss">
//Checkbox's style
.v-checkbox {
  //Font style
  font-family: $primary-font;
}
</style>
