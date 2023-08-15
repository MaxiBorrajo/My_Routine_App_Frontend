<template>
  <section
    v-if="data_is_loaded"
    class="prepare-view-section text-center d-flex flex-column align-center justify-center"
  >
    <!-- Prepare view  -->
    <div
      class="d-flex align-center justify-center flex-column prepare-view-section__title"
    >
      <!-- Prepare view title -->
      <h2>PREPARE FOR:</h2>
      <h2 class="text-uppercase routine_name">{{ routine_name }}</h2>
    </div>
    <!-- Prepare view countdown -->
    <CountdownComponent
      :countdown="routine_countdown"
      @countdown_finished="preparation_finished"
    />
  </section>
</template>

<script setup>
//Imports
import { onBeforeMount, ref } from "vue";
import CountdownComponent from "@/components/CountdownComponent.vue";

//Variables
const props = defineProps({
  routine_countdown: Object,
  routine_name: String,
});

const emit = defineEmits(["preparation_finished"]);

const data_is_loaded = ref(false);

//Methods
//Function that emits an event indicating that preparation time has finished
function preparation_finished() {
  emit("preparation_finished");
}

//Lifehooks
/*Lifehooks that renders the view */
onBeforeMount(() => {
  data_is_loaded.value = true;
});
</script>

<style scoped lang="scss">
//Prepare view styles
.prepare-view-section {
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

  //Prepare view title styles
  &__title {
    width: 100%;
    height: 100%;
    gap: 10px;

    h2 {
      font-size: 25px;
    }
    .routine_name {
      font-size: 35px;
    }
  }
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Prepare view styles
  .prepare-view-section {
    padding: 100px 0 200px 0;
  }
}
</style>
