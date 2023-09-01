<template>
  <section class="play-routine-section">
    <!-- Error Component -->
    <ErrorComponent
      v-if="error.has_error"
      :error_component_message="error.error_message"
      class="error"
    />
    <!-- Loader component -->
    <section
      v-else-if="routine && exercises_of_routine && !error.has_error"
      class="play-routine-section__views d-flex justify-center align-center"
    >
      <!-- Play routine view -->
      <!-- Prepare view -->
      <PrepareView
        v-if="show_prepare_view"
        :routine_countdown="routine.time_before_start"
        :routine_name="routine.routine_name"
        @preparation_finished="start_exercise"
      />
      <!-- Play exercise view -->
      <PlayExerciseView
        v-if="show_exercise_view"
        :current_exercise="exercises_of_routine[current_exercise_index]"
        @exercise_finished="change_exercise"
      />
      <!-- Finished routine view -->
      <FinishedRoutineView
        v-if="show_routine_finished_view"
        :routine_info="routine"
      />
    </section>
    <LoaderComponent v-model="show_loader" />
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount } from "vue";
import PrepareView from "@/views/PrepareView.vue";
import PlayExerciseView from "@/views/PlayExerciseView.vue";
import FinishedRoutineView from "@/views/FinishedRoutineView.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import { useRoute } from "vue-router";
import { useExerciseStore } from "../stores/exercise_store";
import { useRoutineStore } from "../stores/routine_store";
import ErrorComponent from "@/components/ErrorComponent.vue";

//Variables
const show_prepare_view = ref(true);

const show_exercise_view = ref(false);

const show_routine_finished_view = ref(false);

const route = useRoute();

const exercise_store = useExerciseStore();

const routine_store = useRoutineStore();

const routine = ref(null);

const exercises_of_routine = ref(null);

const current_exercise_index = ref(0);

const error = ref({
  has_error: false,
  error_message: "",
});

const show_loader = ref(false);

//Function that starts the exercise view
function start_exercise() {
  show_prepare_view.value = false;

  show_exercise_view.value = true;

  console.log( show_exercise_view.value)
}

//Function that changes from one exercise to another or starts the routine finished view
function change_exercise() {
  if (current_exercise_index.value !== exercises_of_routine.value.length - 1) {
    current_exercise_index.value++;
  } else {
    show_exercise_view.value = false;

    show_routine_finished_view.value = true;
  }
}

/*Lifehooks*/
/*Liefehooks in charge of getting the routine information,
the exercises of the routine and renders the view */
onBeforeMount(async () => {
  show_loader.value = true;

  try {
    routine.value = {
      ...(await routine_store.find_specific_routine(route.params.id_routine)),
    };

    exercises_of_routine.value = [
      ...(await exercise_store.find_exercises_of_routine(
        route.params.id_routine
      )),
    ];
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
});
</script>

<style scoped lang="scss">
//Play routine view styles
.play-routine-section {
  //Sizing
  width: 100%;
  height: auto;
  min-height: 100vh;

  &__views {
    width: 100%;
    height: auto;
  }
}
</style>
