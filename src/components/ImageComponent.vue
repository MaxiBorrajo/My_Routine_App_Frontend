<template>
  <!-- Image component -->
  <v-img
    :width="image_width"
    :height="image_height"
    :aspect-ratio="image_aspect_ratio"
    :cover="image_cover"
    :src="image_source"
  ></v-img>
</template>

<script setup>
//Variables
const props = defineProps({
  image_width: Number,
  image_height: Number,
  image_aspect_ratio: String,
  image_cover: Boolean,
  image_source: String,
});
</script>

<style scoped lang="scss"></style>
