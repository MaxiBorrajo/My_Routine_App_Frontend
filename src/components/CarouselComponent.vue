<template>
  <!-- Photo carousel -->
  <v-carousel
    show-arrows="hover"
    hide-delimiters
    :progress="carousel_color_progress ? carousel_color_progress : 'attention'"
  >
    <!-- Photo -->
    <v-carousel-item
      v-for="photo in carousel_photos"
      :src="photo"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>

<script setup>
//Variables
const props = defineProps({
  carousel_photos: Array,
  carousel_color_progress: String,
});
</script>

<style scoped lang="scss"></style>
