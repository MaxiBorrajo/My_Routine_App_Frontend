<template>
  <section class="play_exercise_view d-flex align-center justify-center" v-if="data_is_loaded">
    <!-- Play exercise view -->
    <!-- Time set view -->
    <TimeSetView
      :current_set="current_sets[current_set_index]"
      :exercise_name="current_exercise.exercise_name"
      v-if="show_set && current_sets[current_set_index].time"
      @set_finished="change_set"
    />
    <!-- Repetition set view -->
    <RepetitionSetView
      :current_set="current_sets[current_set_index]"
      :exercise_name="current_exercise.exercise_name"
      v-if="show_set && current_sets[current_set_index].repetition"
      @set_finished="change_set"
    />
    <!-- Rest after set view -->
    <RestAfterSetView
      v-if="show_rest_after_set"
      :set_rest="rest_after_set"
      :set_order="current_sets[current_set_index].set_order"
      @set_rest_finished="start_new_set"
    />
    <!-- Rest after exercise view -->
    <ExerciseRestView
      v-if="show_rest_after_exercise"
      :exercise_rest="rest_after_exercise"
      :exercise_name="current_exercise.exercise_name"
      @rest_finished="start_new_exercise"
    />
  </section>
</template>

<script setup>
//Imports
import { ref, watch, onBeforeMount } from "vue";
import { useSetStore } from "../stores/set_store";
import TimeSetView from "@/views/TimeSetView.vue";
import RepetitionSetView from "@/views/RepetitionSetView.vue";
import ExerciseRestView from "@/views/ExerciseRestView.vue";
import RestAfterSetView from "@/views/RestAfterSetView.vue";

//Variables
const set_store = useSetStore();

const props = defineProps({
  current_exercise: Object,
});

const emit = defineEmits(["exercise_finished"]);

const current_sets = ref([]);

const current_set_index = ref(0);

const rest_after_exercise = ref({});

const rest_after_set = ref({});

const show_rest_after_exercise = ref(false);

const show_rest_after_set = ref(false);

const show_set = ref(true);

const data_is_loaded = ref(false)

//Methods

//Function that gets the sets of the current exercise
async function get_sets_of_exercise() {
  current_sets.value = [
    ...(await set_store.find_all_sets_of_exercise(
      props.current_exercise.id_exercise
    )),
  ];
}

//Function that changes the current set
function change_set() {
  if (current_set_index.value === current_sets.value.length - 1) {
    show_set.value = false;

    show_rest_after_exercise.value = true;

    exercise_finished();
  } else {
    show_set.value = false;

    current_set_index.value++;

    show_rest_after_set.value = true;
  }
}

//Function that starts a new set
function start_new_set() {
  show_rest_after_set.value = false;

  rest_after_set.value = {
    ...current_sets.value[current_set_index.value].rest_after_set,
  };

  show_set.value = true;
}

//Function that emits an event indicating that an exercise has finished
function exercise_finished() {
  emit("exercise_finished");
}

//Function that starts a new exercise
function start_new_exercise() {
  show_rest_after_exercise.value = false;

  show_set.value = true;

  rest_after_exercise.value = { ...props.current_exercise.time_after_exercise };

  current_set_index.value = 0;

  rest_after_set.value = {
    ...current_sets.value[current_set_index.value].rest_after_set,
  };
}

//Watchers
/*Watcher that gets the sets of the current exercise
when sees a change in the props*/
watch(props, async () => {
  await get_sets_of_exercise();
});

//Lifehooks
/*Lifehook that gets the sets of the current exercise and 
establish the current rests */
onBeforeMount(async () => {
  await get_sets_of_exercise();

  rest_after_exercise.value = {...props.current_exercise.time_after_exercise};

  rest_after_set.value =
    {...current_sets.value[current_set_index.value].rest_after_set};

  data_is_loaded.value = true;
});
</script>

<style scoped>
/*Play exercise view styles */
.play_exercise_view {
  width: 100%;
  height: 100%;
}
</style>
