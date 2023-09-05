<template>
  <section
    class="exercise-rest-view-section text-center d-flex flex-column align-center justify-center"
  >
    <!-- Exercise rest view -->
    <div
      class="d-flex align-center justify-center flex-column exercise-rest-view-section__title"
    >
      <!-- Exercise rest view title -->
      <h2>PREPARE FOR:</h2>
      <h2 class="text-uppercase exercise-rest_name">{{ exercise_name }}</h2>
    </div>
    <!-- Exercise rest view countdown -->
    <CountdownComponent
      :countdown="exercise_rest"
      @countdown_finished="rest_finished"
    />
  </section>
</template>

<script setup>
//Imports
import CountdownComponent from "@/components/CountdownComponent.vue";

//Variables
const props = defineProps({
  exercise_rest: Object,
  exercise_name: String,
});

const emit = defineEmits(["rest_finished"]);

//Methods

/*Function that emits an event that indicates that the rest has finished*/
function rest_finished() {
  emit("rest_finished");
}

/*Lifehooks*/

</script>

<style scoped lang="scss">
//Exercise rest view styles
.exercise-rest-view-section {
  //Sizing
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-width: 668px;
  padding: 100px 0;
  
  position: relative;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Display
  gap: 50px;

  //Title style
  &__title {
    //Sizing
    width: 100%;
    height: auto;

    //Display
    gap: 10px;

    h2 {
      font-size: 25px;
    }

    //Exercise rest name style
    .exercise-rest_name {
      font-size: 35px;
    }
  }
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Exercise rest view styles
  .exercise-rest-view-section {
    padding: 100px 0 200px 0;
  }
}
</style>
