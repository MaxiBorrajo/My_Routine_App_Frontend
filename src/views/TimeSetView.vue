<template>
  <!-- Time set view section -->
  <section
    v-if="data_is_loaded"
    class="time-set-view-section text-center d-flex flex-column align-center justify-center"
  >
    <!-- Time set view section title -->
    <div
      class="d-flex align-center justify-center flex-column time-set-view-section__title"
    >
      <h2 class="text-uppercase set">{{ exercise_name }}</h2>
      <h2 class="text-uppercase">{{ current_set.set_order }} set {{ current_set.weight }} {{ weight_unit }}</h2>
    </div>
    <!-- Time set view section countdown -->
    <CountdownComponent
      :countdown="current_set.time"
      @countdown_finished="set_finished"
    />
  </section>
</template>

<script setup>
//Imports
import { onBeforeMount, ref, computed } from "vue";
import CountdownComponent from "../components/CountdownComponent.vue";

//Variables
const props = defineProps({
  current_set: Object,
  exercise_name: String,
});

const emit = defineEmits(["set_finished"]);

const data_is_loaded = ref(false);

const weight_unit = computed(()=>{
  return JSON.parse(localStorage.getItem("current_user_info")).weight
})


//Methods
/*Function that emits an event that indicates that the set has finished*/
function set_finished() {
  emit("set_finished");
}

//Lifehooks that renders the view
onBeforeMount(() => {
  data_is_loaded.value = true;
});
</script>

<style scoped lang="scss">
//Time set view styles
.time-set-view-section {
  //Sizing
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-width: 668px;

  position: relative;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Display
  gap: 50px;

  //Time set view title styles

  &__title {
    width: 100%;
    height: auto;

    h2 {
      font-size: 35px;
    }
  }
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Time set view styles
  .time-set-view-section {
    padding: 100px 0 200px 0;
  }
}
</style>
