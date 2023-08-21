<template>
  <v-icon
    :icon="volume_on ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"
    @click="change_volume"
    class="volume-button"
  ></v-icon>
  <div
    class="d-flex justify-center countdown-section__countdown"
    v-if="data_is_loaded"
  >
    <!-- Countdown -->
    <ProgressCircularComponent
      progress_circular_color="attention"
      :progress_circular_size="300"
      :progress_circular_width="5"
      :progress_circular_inside_value="countdown_fixed"
      :progress_circular_model_value="progress"
    />
  </div>
  <!-- Countdown actions-->
  <div class="countdown-section__actions d-flex justify-center align-center">
    <!-- Stop button -->
    <v-avatar color="attention" size="50">
      <v-tooltip text="Stop" location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon
            @click="go_home"
            icon="fa-solid fa-stop"
            v-bind="props"
            class="action_button"
          >
          </v-icon>
        </template>
      </v-tooltip>
    </v-avatar>
    <!-- Play/Pause button -->
    <v-avatar color="attention" size="50">
      <v-tooltip :text="is_paused ? 'Resume' : 'Pause'" location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon
            @click="toggle_pause"
            class="action_button"
            :icon="is_paused ? 'fa-solid fa-play' : 'fa-solid fa-pause'"
            v-bind="props"
          >
          </v-icon>
        </template>
      </v-tooltip>
    </v-avatar>
    <!-- Reset button -->
    <v-avatar color="attention" size="50">
      <v-tooltip text="Reset" location="bottom">
        <template v-slot:activator="{ props }">
          <v-icon
            @click="reset_countdown"
            icon="fa-solid fa-arrow-rotate-left"
            v-bind="props"
            class="action_button"
          >
          </v-icon>
        </template>
      </v-tooltip>
    </v-avatar>
  </div>
</template>

<script setup>
//Imports
import { ref, computed, onBeforeMount, onMounted } from "vue";
import ProgressCircularComponent from "@/components/ProgressCircularComponent.vue";
import router from "../router/index";
import { useUserStore } from "../stores/user_store";
import audio from "../assets/race-start-beeps-125125.mp3";
//Variables
const props = defineProps({
  countdown: Object,
});

const emit = defineEmits(["countdown_finished"]);

const countdown = ref(null);

const user_store = useUserStore();

const countdown_fixed = computed(() => {
  let time = "";

  if (countdown.value.seconds) {
    time =
      countdown.value.seconds >= 10
        ? `${countdown.value.seconds}` + time
        : `0${countdown.value.seconds}` + time;
  } else {
    time = "00" + time;
  }

  if (countdown.value.minutes) {
    time =
      countdown.value.minutes >= 10
        ? `${countdown.value.minutes}:` + time
        : `0${countdown.value.minutes}:` + time;
  } else {
    time = "00:" + time;
  }

  return time;
});

const countdown_sound = new Audio(audio);

const is_paused = ref(false);

const volume_on = ref(true);

const progress = ref(100);

let total_seconds;

const data_is_loaded = ref(false);

let interval_id;

//Methods
/*Function that changes the circular progress of the countdown based on the total time*/
function change_progress() {
  let value_to_rest = 100 / total_seconds;
  progress.value -= value_to_rest;
}

//Function that change the countdown depending on his progress
function change_countdown() {
  if ((countdown.value.seconds === 0) & (countdown.value.minutes === 0)) {
    countdown_sound.pause();

    emit("countdown_finished");
  } else if (
    (countdown.value.seconds === 0) &
    (countdown.value.minutes !== 0)
  ) {
    countdown.value.minutes--;

    countdown.value.seconds = 59;
  } else if (countdown.value.minutes === 0 && countdown.value.seconds === 4) {
    countdown_sound.play();

    countdown.value.seconds--;
  } else {
    countdown.value.seconds--;
  }
}

//Function that starts the countdown
function start_countdown() {
  interval_id = setInterval(
    () => {
      change_progress();

      change_countdown();
    },

    1000
  );
}

//Function that reset the countdown progress
function reset_countdown() {
  countdown_sound.pause();

  countdown_sound.currentTime = 0;

  clearInterval(interval_id);

  countdown.value = { ...props.countdown };

  fix_time();

  total_seconds = countdown.value.minutes * 60 + countdown.value.seconds;

  progress.value = 100;

  is_paused.value = false;

  start_countdown();
}

//Function that handles the pause and pause of the countdown
function toggle_pause() {
  is_paused.value = !is_paused.value;

  if (is_paused.value) {
    if (countdown_sound.currentTime !== 0) {
      countdown_sound.pause();
    }

    clearInterval(interval_id);
  } else {
    if (countdown_sound.currentTime !== 0) {
      countdown_sound.play();
    }

    start_countdown();
  }
}

/*Function that goes to the home page */
function go_home() {
  clearInterval(interval_id);

  if (countdown_sound.currentTime !== 0) {
    countdown_sound.pause();
  }

  router.push({ name: "Home" });
}

/*Function that fixes a interval object by changing seconds, minutes and hours attributes*/
function fix_time() {
  countdown.value.seconds = countdown.value.seconds
    ? countdown.value.seconds
    : 0;

  countdown.value.minutes = countdown.value.minutes
    ? countdown.value.minutes
    : 0;
}

//Function that allows volume or not of the countdown sound
function change_volume() {
  volume_on.value = !volume_on.value;

  user_store.volume_on = volume_on.value;

  if (volume_on.value) {
    countdown_sound.volume = 1;
  } else {
    countdown_sound.volume = 0;
  }
}

/*Lifehooks */

//Lifehook that starts the countdown when the view is mounted
onMounted(() => {
  start_countdown();
});

//Lifehook that prepares the countdown for its execution
onBeforeMount(() => {
  countdown.value = { ...props.countdown };

  fix_time();

  total_seconds = countdown.value.minutes * 60 + countdown.value.seconds;

  volume_on.value = user_store.volume_on;

  if (volume_on.value) {
    countdown_sound.volume = 1;
  } else {
    countdown_sound.volume = 0;
  }

  data_is_loaded.value = true;
});
</script>

<style scoped lang="scss">
//Countdown styles
.countdown-section {
  //Countdown progress circular
  &__countdown {
    width: 100%;
    height: 100%;
    .v-progress-circular {
      font-size: 60px;
    }
  }

  //Countdown actions
  &__actions {
    width: 100%;
    height: auto;
    gap: 50px;
  }
}

.volume-button {
  //Position
  position: absolute;
  top: 20px;
  right: 20px;

  //Color
  color: rgb(var(--v-theme-text));
}
</style>
