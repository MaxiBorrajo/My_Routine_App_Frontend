<template>
  <!-- Textarea component -->
  <v-textarea
    :clearable="input_clearable"
    :label="input_label"
    :color="input_color ? input_color : 'text'"
    :bg-color="input_bg_color ? input_bg_color : 'background_color'"
    :prepend-icon="input_prepend_icon"
    :prepend-inner-icon="input_prepend_inner_icon"
    :append-icon="input_append_icon"
    :append-inner-icon="input_append_inner_icon"
    :hide-details="input_hide_details"
    :density="input_density"
    :placeholder="input_placeholder"
    :rules="input_rules"
    :auto-grow="input_auto_grow"
    :autofocus="input_auto_focus"
    :variant="input_variant"
  ></v-textarea>
</template>

<script setup>
//Variables
const props = defineProps({
  input_label: String,
  input_placeholder: String,
  input_color: String,
  input_bg_color: String,
  input_prepend_icon: String,
  input_prepend_inner_icon: String,
  input_append_icon: String,
  input_append_inner_icon: String,
  input_hide_details: Boolean,
  input_density: String,
  input_clearable: Boolean,
  input_rules: Array,
  input_auto_grow: Boolean,
  input_auto_focus: Boolean,
  input_variant: String,
});
</script>

<style scoped lang="scss">
//Textarea styles
.v-textarea {
  font-family: $primary-font;
}
</style>
