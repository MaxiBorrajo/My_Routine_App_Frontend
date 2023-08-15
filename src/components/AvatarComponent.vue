<template>
  <!-- Avatar component -->
  <v-avatar
    :icon="avatar_icon"
    :image="avatar_image"
    :rounded="avatar_rounded"
    :size="avatar_size"
  >
    {{ avatar_inside_text }}
  </v-avatar>
</template>

<script setup>
//Variables
const props = defineProps({
  avatar_icon: String,
  avatar_image: String,
  avatar_rounded: Number,
  avatar_size: [Number, String],
  avatar_inside_text: String,
});
</script>

<style scoped lang="scss"></style>
