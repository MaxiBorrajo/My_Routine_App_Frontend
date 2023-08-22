<template>
  <!-- Exercise card component -->
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
    @click="go_to_specific_exercise()"
    v-if="data_is_loaded"
  >
    <!-- Exercise card first part -->
    <v-card-item>
      <!-- Exercise card overline -->
      <div class="overline d-flex justify-space-between align-center">
        <!-- intensity -->
        <span
          :class="exercise_intensity_class"
          class="d-flex align-center justify-center"
        >
          <v-icon icon="fa-solid fa-circle"></v-icon>
          {{ exercise_intensity }}
        </span>
        <!-- Button to add to favorites -->
        <v-icon
          icon="fa-solid fa-heart"
          :class="
            is_exercise_favorite.is_favorite ? 'is_favorite' : 'is_not_favorite'
          "
          @click.stop="change_favorite"
        ></v-icon>
      </div>
      <!-- Exercise card title -->
      <v-card-title class="text-uppercase">
        {{ exercise_card_data.exercise_name }}
      </v-card-title>
      <!-- Exercise card second part -->
      <v-card-subtitle class="d-flex flex-column">
        <!-- Exercise's description -->
        <span id="description" class="text-truncate">{{
          capitalized_first_character(exercise_card_data.description)
        }}</span>
        <!-- Exercise's amount of time sets -->
        <span>
          {{ amount_time_sets > 0 ? `Time sets: ${amount_time_sets}` : `` }}
        </span>
        <!-- Exercise's amount of repetition sets -->
        <span>
          {{
            amount_repetition_sets > 0
              ? `Repetition sets: ${amount_repetition_sets}`
              : ``
          }}
        </span>
      </v-card-subtitle>
    </v-card-item>
    <!-- Exercise card last part -->
    <div class="card_last_item d-flex justify-space-between align-center">
      <!-- Number of routines where the exercise is in-->
      <span
        ><span class="card_last_item__label text-uppercase">Routines:</span>
        {{ amount_routines }}</span
      >

      <!-- Rest time after the exercise -->
      <span
        ><span class="card_last_item__label text-uppercase">Rest:</span>
        {{ rest_time }}</span
      >
      <!-- Number of muscle groups in the exercise -->
      <span
        ><span class="card_last_item__label text-uppercase"
          >Muscle groups:</span
        >
        {{ amount_muscle_groups }}</span
      >
    </div>
  </v-card>
  <!-- Exercise card component when data is not loaded yet -->
  <v-skeleton-loader type="card" v-else color="card"></v-skeleton-loader>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, computed, watch } from "vue";
import { useExerciseStore } from "../stores/exercise_store";
import { useRoutineStore } from "../stores/routine_store";
import { useMuscleGroupStore } from "../stores/muscle_group_store";
import { useSetStore } from "../stores/set_store";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import { capitalized_first_character } from "../utils/utils_functions";
import router from "../router";

//Variables
const exercise_store = useExerciseStore();

const routine_store = useRoutineStore();

const muscle_group_store = useMuscleGroupStore();

const set_store = useSetStore();

const props = defineProps({
  exercise_card_data: Object,
  exercise_card_current_page: Number,
  exercise_card_change_occurred: Boolean,
});

const data_is_loaded = ref(false);

const amount_routines = ref(null);

const amount_muscle_groups = ref(null);

const amount_time_sets = ref(0);

const amount_repetition_sets = ref(0);

const is_exercise_favorite = ref({
  is_favorite: null,
});

const rest_time = computed(() => {
  const time_after_exercise = props.exercise_card_data.time_after_exercise;

  let time = "";

  if (time_after_exercise.seconds) {
    time =
      time_after_exercise.seconds >= 10
        ? `${time_after_exercise.seconds}` + time
        : `0${time_after_exercise.seconds}` + time;
  } else {
    time = "00" + time;
  }

  if (time_after_exercise.minutes) {
    time =
      time_after_exercise.minutes >= 10
        ? `${time_after_exercise.minutes}:` + time
        : `0${time_after_exercise.minutes}:` + time;
  } else {
    time = "00:" + time;
  }

  return time;
});

const exercise_intensity = computed(() => {
  switch (props.exercise_card_data.intensity) {
    case 2:
      return "Mid intensity";
    case 3:
      return "High intensity";
    default:
      return "Low intensity";
  }
});

const exercise_intensity_class = computed(() => {
  switch (props.exercise_card_data.intensity) {
    case 2:
      return "mid";
    case 3:
      return "high";
    default:
      return "low";
  }
});

//Methods

/*Functions that gets the amount of time sets or repetition
sets that the exercise has */
const get_amounts_of_sets = async () => {
  const sets = await set_store.find_all_sets_of_exercise(
    props.exercise_card_data.id_exercise
  );

  amount_time_sets.value = 0;

  amount_repetition_sets.value = 0;

  sets.resource.forEach((set) => {
    if (set.time) {
      amount_time_sets.value++;
    } else {
      amount_repetition_sets.value++;
    }
  });
};

/*Function that gets the amount of muscle groups assigned to the exercise */
const get_amount_muscle_groups = async () => {
  const muscle_groups = await muscle_group_store.find_muscle_groups_of_exercise(
    props.exercise_card_data.id_exercise
  );

  amount_muscle_groups.value = muscle_groups.resource.length;
};

/*Functions that gets the amount of routine where the
exercise is included in */
const get_amount_routines = async () => {
  const routines = await routine_store.find_routines_of_exercise(
    props.exercise_card_data.id_exercise
  );

  amount_routines.value = routines.resource.length;
};

/*Function that changes the favorite status of a exercise */
async function change_favorite() {
  is_exercise_favorite.value.is_favorite =
    !is_exercise_favorite.value.is_favorite;

  await exercise_store.update_specific_exercise(
    props.exercise_card_data.id_exercise,
    is_exercise_favorite.value
  );
}

/*Function that obtain certain data of the exercise */
async function get_exercise_data() {
  data_is_loaded.value = false;

  is_exercise_favorite.value.is_favorite = props.exercise_card_data.is_favorite;

  await get_amount_routines();

  await get_amount_muscle_groups();

  await get_amounts_of_sets();

  data_is_loaded.value = true;
}

/*Function that takes you to a specific page of the exercise*/
function go_to_specific_exercise() {
  router.push({
    name: "SpecificExercise",
    params: { id_exercise: props.exercise_card_data.id_exercise },
  });
}

//Watchers

/*Watcher that is responsible for updating 
  the data of the exercise every time it detects 
  a change in the props*/
watch(props, async () => {
  await get_exercise_data();
});

//LifeHooks

/*Lifehook in charge of obtaining certain data 
  from the exercise before mounting the component 
  and enabling the main card when the data is loaded */
onBeforeMount(async () => {
  is_exercise_favorite.value.is_favorite = props.exercise_card_data.is_favorite;

  await get_exercise_data();
});
</script>

<style scoped lang="scss">
//Exercise card's style
.v-card {
  //Color
  color: rgb(var(--v-theme-text)) !important;

  //Size
  width: 100%;
  //Exercise card first part styles
  .v-card-item {
    //overline styles
    .overline {
      //Size
      width: 100%;
      height: 100%;
    }
    //Title style
    .v-card-title {
      //Font styles
      font-size: 18px;
      font-weight: 900;

      //Spacing
      padding-top: 5px;
    }
    //Icon styles
    .v-icon {
      //Font styles
      font-size: 18px;
    }
    //Exercise card description
    .v-card-subtitle {
      //Spacing
      padding-bottom: 7px;

      //Display
      gap: 2px;
    }
  }

  //Exercise card last part
  .card_last_item {
    //Color
    background-color: rgb(var(--v-theme-text));
    color: rgb(var(--v-theme-background_color));

    //Font style
    font-size: 14px;

    //Spacing
    padding: 7px 10px;

    //display
    flex-wrap: wrap;

    //Exercise card last part label's style
    .card_last_item__label {
      //Font style
      font-weight: 900;
      font-size: 12px;
    }
  }
}

//Intensity styles

.low {
  color: #009dff;
  gap: 5px;
  font-size: 14px;
  font-weight: 400;
  .v-icon {
    color: #009dff;
    font-size: 10px !important;
  }
}

.mid {
  color: #ffff00;
  gap: 5px;
  font-size: 14px;
  font-weight: 400;
  .v-icon {
    color: #ffff00;
    font-size: 10px !important;
  }
}

.high {
  color: #ff0000;
  gap: 5px;
  font-size: 14px;
  font-weight: 400;
  .v-icon {
    color: #ff0000;
    font-size: 10px !important;
  }
}

//Description style
#description {
  //Display
  display: inline-block;

  //Size
  max-width: auto;
}

//Media queries
@media only screen and (min-width: 480px) {
  //Exercise card style
  .v-card,
  .v-skeleton-loader {
    //Size
    max-width: 480px;
  }
}
</style>
