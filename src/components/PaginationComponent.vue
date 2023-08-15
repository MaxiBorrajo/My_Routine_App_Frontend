<template>
  <!-- Pagination component -->
  <v-pagination
    :length="pagination_length"
    rounded="0"
    @update:model-value="pagination_on_page_change"
    color="attention"
  ></v-pagination>
</template>

<script setup>
//Imports
import { computed } from "vue";

//Variables
const pagination_length = computed(() => {
  return Math.ceil(
    props.pagination_total_amount / props.pagination_amount_per_page
  );
});

const props = defineProps({
  pagination_total_amount: Number,
  pagination_amount_per_page: Number,
  pagination_on_page_change: Function,
});
</script>

<style scoped lang="scss">
//Pagination's style
.v-pagination {
  //Font
  font-family: $primary-font;
}
</style>
