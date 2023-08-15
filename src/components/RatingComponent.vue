<template>
  <!-- Rating component -->
  <v-rating
    :color="rating_color ? rating_color : 'attention'"
    :density="rating_density"
    :clearable="rating_clearable"
    :hover="rating_hover"
    :item-labels="rating_item_labels"
    :item-label-position="rating_item_label_position"
  ></v-rating>
</template>

<script setup>
//Variables
const props = defineProps({
  rating_color: String,
  rating_density: String,
  rating_clearable: Boolean,
  rating_hover: Boolean,
  rating_item_labels: Array,
  rating_item_label_position: String,
});
</script>

<style scoped lang="scss">
//Rating's style
.v-rating {
  //Font
  font-family: $primary-font;
}
</style>
