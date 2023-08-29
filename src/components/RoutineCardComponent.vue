<template>
  <!-- Routine card component -->
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
    @click="go_to_specific_routine()"
    v-if="!error"
  >
    <!-- Routine card first part -->
    <v-card-item>
      <!-- Routine card overline -->
      <div class="overline d-flex justify-space-between align-center">
        <!-- day to do the routine -->
        <span id="routine_day">{{ next_day }}</span>
        <!-- button to add to favorites -->
        <v-icon
          icon="fa-solid fa-heart"
          :class="
            is_routine_favorite.is_favorite ? 'is_favorite' : 'is_not_favorite'
          "
          @click.stop="change_favorite"
        ></v-icon>
      </div>
      <!-- Routine card title -->
      <v-card-title class="text-uppercase">
        {{ routine_card_data.routine_name }}
      </v-card-title>
      <!-- Routine card second part -->
      <v-card-subtitle class="d-flex justify-space-between align-center">
        <!-- Routine's description -->
        <span
          id="description"
          class="text-truncate"
          v-if="routine_card_data.description"
          >{{
            capitalized_first_character(routine_card_data.description)
          }}</span
        >
        <span id="description" class="text-truncate" v-else
          >No description provided</span
        >
        <!-- Play routine button -->
        <v-icon
          icon="fa-solid fa-play"
          class="play_button"
          @click.stop="play_routine"
        ></v-icon>
      </v-card-subtitle>
    </v-card-item>
    <!-- Routine card last part -->
    <div class="card_last_item d-flex justify-space-between align-center">
      <!-- Number of exercises in the routine -->
      <span
        ><span class="card_last_item__label text-uppercase">Exercises:</span>
        {{ amount_exercises }}</span
      >

      <!-- Preparation time before the routine -->
      <span
        ><span class="card_last_item__label text-uppercase">Preparation:</span>
        {{ preparation_time }}</span
      >

      <!-- Number of uses given to the routine -->
      <span
        ><span class="card_last_item__label text-uppercase">Usage:</span>
        {{ routine_card_data.usage_routine }}</span
      >
    </div>
  </v-card>
  <!-- Routine card component when data is not loaded yet -->
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
    class="d-flex justify-center align-center retry"
    v-else="error"
  >
    <ButtonComponent
      @click="retry"
      button-prepend-icon="fa-solid fa-arrow-rotate-left"
      button-label="retry"
    />
  </v-card>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, computed } from "vue";
import { useDayStore } from "../stores/day_store";
import { useRoutineStore } from "../stores/routine_store";
import router from "../router";
import { capitalized_first_character } from "../utils/utils_functions";
import ButtonComponent from "@/components/ButtonComponent.vue";

//Variables
const day_store = useDayStore();

const routine_store = useRoutineStore();

const props = defineProps({
  routine_card_data: Object,
});

const error = ref(false);

const amount_exercises = ref(0);

const next_day = ref("");

const is_routine_favorite = ref({
  is_favorite: false,
});

const preparation_time = computed(() => {
  const time_before_start = {...props.routine_card_data.time_before_start};

  let time = "";

  if (time_before_start.seconds) {
    time =
      time_before_start.seconds >= 10
        ? `${time_before_start.seconds}` + time
        : `0${time_before_start.seconds}` + time;
  } else {
    time = "00" + time;
  }

  if (time_before_start.minutes) {
    time =
      time_before_start.minutes >= 10
        ? `${time_before_start.minutes}:` + time
        : `0${time_before_start.minutes}:` + time;
  } else {
    time = "00:" + time;
  }

  return time;
});

//Methods

/*Function that gets the amount of exercises that the routine has */
const get_amount_exercises = async () => {
  amount_exercises.value = await routine_store.find_amount_exercises_of_routine(
    props.routine_card_data.id_routine
  );
};

/**
 * Function that returns an indication of the time remaining to perform the routine.
 * @param {Array} routine_days - Array with the days to perform the routine
 * @returns {String} Indication of how much is left to perform the routine
 */
function get_routine_day_status(routine_days) {
  let today = new Date().getDay();

  today = today === 0 ? 7 : today;

  let found;

  let least_difference = 0;

  let found_index = 0;

  routine_days.forEach((day, index) => {
    const difference = day.id_day - today;

    if (index === 0) {
      least_difference = difference;

      found_index = index;
    }

    if (difference === 0) {
      found = "Today";
    } else if (!found && difference === 1) {
      found = "Tomorrow";
    }

    if (difference < least_difference) {
      least_difference = difference;

      found_index = index;
    }
  });

  if (found) {
    return found;
  } else if (least_difference > 0) {
    return routine_days[found_index].name_day;
  } else {
    return `Next ${routine_days[found_index].name_day}`;
  }
}

/*Function that changes the favorite status of a routine */
function change_favorite() {
  is_routine_favorite.value.is_favorite =
    !is_routine_favorite.value.is_favorite;

 routine_store.update_specific_routine(
    props.routine_card_data.id_routine,
    is_routine_favorite.value
  );
}

/*Function that obtain certain data of the routine */
async function get_routine_data() {
  try {
    is_routine_favorite.value.is_favorite = props.routine_card_data.is_favorite;

    get_amount_exercises();

    next_day.value = get_routine_day_status(
      await day_store.find_days_of_routine(props.routine_card_data.id_routine)
    );
  } catch (err) {
    error.value = true;
  }
}

function retry() {
  error.value = false;

 get_routine_data();
}

/*Function that takes you to a specific page of the routine*/
function go_to_specific_routine() {
  router.push({
    name: "SpecificRoutine",
    params: { id_routine: props.routine_card_data.id_routine },
  });
}

/*Function that handles play of a routine*/
function play_routine() {
  if (amount_exercises.value > 0) {
    router.push({
      name: "PlayRoutine",
      params: {
        id_routine: props.routine_card_data.id_routine,
      },
    });
  }
}

//LifeHooks

/*Lifehook in charge of obtaining certain data
from the routine before mounting the component
and enabling the main card when the data is loaded */
onBeforeMount(() => {
  get_routine_data();
});
</script>

<style scoped lang="scss">
//Routine card's style
.v-card {
  //Color
  color: rgb(var(--v-theme-text)) !important;
  //Size
  width: 100%;
  //Font
  font-family: $primary-font;

  //Routine card first part styles
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
    //Day of the routine
    #routine_day {
      //Font styles
      font-size: 14px;
      font-weight: 400;
    }
    //Icon styles
    .v-icon {
      //Font styles
      font-size: 18px;
    }
    //Routine card description
    .v-card-subtitle {
      //Spacing
      padding-bottom: 7px;

      //Display
      gap: 10px;

      //Icon style
      .v-icon {
        //Font style
        font-size: 25px;
      }
    }
  }

  //Routine card last part
  .card_last_item {
    //Color
    background-color: rgb(var(--v-theme-text)) !important;
    color: rgb(var(--v-theme-background_color)) !important;
    //Font style
    font-size: 14px;

    //Spacing
    padding: 7px 10px;
    flex-wrap: wrap;

    //Routine card last part label's style
    .card_last_item__label {
      //Font style
      font-weight: 900;
      font-size: 12px;
    }
  }
}

//Loading card style
#loading {
  //Spacing
  padding: 20px;
}

//Description style
#description {
  //Display
  display: inline-block;

  //Size
  max-width: auto;
}

.retry {
  padding: 30px;
}

//Media queries
@media only screen and (min-width: 480px) {
  //Routine card style
  .v-card,
  .v-skeleton-loader {
    //Size
    max-width: 480px;
  }
}
</style>
