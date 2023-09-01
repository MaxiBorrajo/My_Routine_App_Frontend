<template>
  <!-- Dialog component -->
  <v-card color="card">
    <!-- Dialog title -->
    <v-card-title>{{ dialog_title }}</v-card-title>
    <!-- Dialog text -->
    <v-card-text>{{ dialog_text }}</v-card-text>
    <!-- Dialog actions -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <ButtonComponent
        button-type="button"
        button-label="Yes"
        @click="dialog_yes_button"
        color="attention"
        button-variant="tonal"
      />
      <ButtonComponent
        button-type="button"
        button-label="No"
        @click="dialog_no_button"
        color="attention"
        button-variant="tonal"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup>
//Imports
import ButtonComponent from "@/components/ButtonComponent.vue";

//Variables
const props = defineProps({
  dialog_yes_button: Function,
  dialog_no_button: Function,
  dialog_title: String,
  dialog_text: String,
});
</script>

<style scoped lang="scss">
// Dialog styles
.v-card {
  //Color
  color: rgb(var(--v-theme-text));
  
  //Font
  font-family: $primary-font;

}
</style>
