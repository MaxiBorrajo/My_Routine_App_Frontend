<template>
  <!-- Radio button component -->
  <v-radio-group :inline="radio_group_inline" :column="radio_group_column">
    <!-- Radio buttons -->
    <v-radio
      v-for="(value, index) in radio_group_values"
      :label="capitalized_first_character(radio_group_labels[index])"
      :value="value"
      :color="radio_group_colors[index]"
      @click="emit('value_change', value)"
    ></v-radio>
  </v-radio-group>
</template>

<script setup>
//Imports
import { capitalized_first_character } from "../utils/utils_functions";

//Variables
const props = defineProps({
  radio_group_labels: Array,
  radio_group_values: Array,
  radio_group_inline: Boolean,
  radio_group_column: Boolean,
  radio_group_colors: Array,
});

const emit = defineEmits(["value_change"]);
</script>

<style scoped lang="scss">
//Radio group's style
.v-radio-group {
  //Font
  font-family: $primary-font;

  
}
</style>
