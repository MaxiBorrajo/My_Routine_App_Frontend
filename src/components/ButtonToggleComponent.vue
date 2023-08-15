<template>
  <!-- Button to switch between two options -->
  <v-btn-toggle
    divided
    mandatory="force"
    variant="outlined"
    rounded="0"
    selected-class="inverted"
  >
    <!-- Buttons with icons -->
    <ButtonComponent
      v-if="button_toggle_has_only_icons"
      v-for="(option, index) in button_toggle_options"
      :button-icon="button_toggle_icons[index]"
      :value="option"
      button-type="text"
    />
    <!-- Buttons without icons -->
    <ButtonComponent
      v-else
      v-for="option in button_toggle_options"
      :value="option"
      :button-label="option"
      button-type="text"
    />
  </v-btn-toggle>
</template>

<script setup>
//Imports
import ButtonComponent from "@/components/ButtonComponent.vue";

//Variables
const props = defineProps({
  button_toggle_options: Array,
  button_toggle_icons: Array,
  button_toggle_has_only_icons: Boolean,
  button_toggle_button_width: Number,
  button_toggle_button_height: Number,
});
</script>

<style scoped lang="scss">
//Button toggle's style
.v-btn-toggle {
  //Button toggle's color
  color: rgb(var(--v-theme-attention));
  border-color: rgb(var(--v-theme-attention));
}

//Selected button's style
.inverted {
  //Button toggle's color
  background-color: rgb(var(--v-theme-attention));
  color: rgb(var(--v-theme-background_color))!important;
}
</style>
