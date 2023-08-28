<template>
  <!-- Set card component -->
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
  >
    <!-- Set main content -->
    <div class="d-flex main_content align-center">
      <!-- Set order -->
      <span class="set_order d-flex text-center align-center">
        {{ set_info.set_order }}
      </span>
      <!-- Set weight -->
      <span class="field d-flex justify-center align-center">
        <p>Weight:</p>
        <v-text-field
          single-line
          hide-details
          type="number"
          class="centered-input set_input"
          variant="outlined"
          v-model.number="set_info.weight"
          @blur="
            set_info.weight = set_info.weight < 0 ? 0 : set_info.weight;

            set_info.weight = set_info.weight ? set_info.weight : 0;
          "
        ></v-text-field>
        <p>{{ weight_unit }}</p>
      </span>
      <!-- Set repetitions -->
      <span
        v-if="set_info.type === 'repetition'"
        class="field d-flex justify-center align-center"
      >
        <p>{{ type }}:</p>
        <v-text-field
          single-line
          hide-details
          type="number"
          class="centered-input set_input"
          variant="outlined"
          v-model.number="set_info.quantity"
          @blur="
            set_info.quantity = set_info.quantity < 0 ? 0 : set_info.quantity;

            set_info.quantity = set_info.quantity ? set_info.quantity : 0;
          "
        ></v-text-field>
      </span>
      <!-- Set time -->
      <span class="field d-flex justify-center align-center" v-else>
        <p>{{ type }}:</p>
        <span class="d-flex align-center time_input">
          <v-text-field
            hide-details
            single-line
            type="number"
            class="centered-input set_input"
            variant="outlined"
            v-model.number="time_set.minutes"
            @blur="update_times()"
          ></v-text-field>
          <p>m</p>
        </span>
        <span class="d-flex align-center time_input">
          <v-text-field
            hide-details
            single-line
            type="number"
            class="centered-input set_input"
            variant="outlined"
            v-model.number="time_set.seconds"
            @blur="update_times()"
          ></v-text-field>
          <p>s</p>
        </span>
      </span>
      <!-- Set rest time -->
      <span class="field d-flex justify-center align-center">
        <p>Rest time:</p>
        <span class="d-flex align-center time_input">
          <v-text-field
            hide-details
            single-line
            type="number"
            class="centered-input set_input"
            variant="outlined"
            v-model.number="rest_time.minutes"
            @blur="update_times()"
          ></v-text-field>
          <p>m</p>
        </span>
        <span class="d-flex align-center time_input">
          <v-text-field
            hide-details
            single-line
            type="number"
            class="centered-input set_input"
            variant="outlined"
            v-model.number="rest_time.seconds"
            @blur="update_times()"
          ></v-text-field>
          <p>s</p>
        </span>
      </span>
    </div>
  </v-card>
  <!-- Set card component when data is not loaded yet -->
</template>

<script setup>
//Imports
import { ref, onBeforeMount, watch } from "vue";

//Variables
const props = defineProps({
  set_card_data: Object,
});

const set_info = ref({});

const type = ref('');

const weight_unit = ref('');

const time_set = ref({});

const rest_time = ref({});

//Methods
/*Function that updates times in the set*/
function update_times() {
  if (type.value === "Time") {
    fix_time(time_set);
  }

  fix_time(rest_time);
}

/**
 * Function that fixes a time object setting up seconds, minutes, and hours
 * values
 * @param{Object} Object that represents an interval of time*/
function fix_time(time) {
  time.value.seconds = time.value.seconds ? time.value.seconds : 0;

  time.value.minutes = time.value.minutes ? time.value.minutes : 0;

  time.value.seconds = parseInt(time.value.seconds);

  time.value.minutes = parseInt(time.value.minutes);

  time.value.seconds = time.value.seconds > 59 ? 59 : time.value.seconds;

  time.value.minutes = time.value.minutes > 99 ? 99 : time.value.minutes;
}

/*Function that gets and prepared the set information */
function get_set_info() {
  set_info.value = props.set_card_data;

  const user = JSON.parse(localStorage.getItem("current_user_info"));

  weight_unit.value = user.weight;

  type.value = set_info.value.type === "time" ? "Time" : "Repetition";

  if (type.value === "Time") {
    time_set.value = set_info.value.quantity;

    fix_time(time_set);
  }

  rest_time.value = set_info.value.rest_after_set;

  fix_time(rest_time);
}

/*Watcher */
/*Watcher that gets data of the set when sees a change in the props */
watch(props, () => {
  get_set_info();
});

/*Lifehooks */
/*Gets data of the set before the component is mounted*/
onBeforeMount(() => {
  get_set_info();
});
</script>

<style scoped lang="scss">
//Set card styles
.v-card {
  //Sizing
  width: 100%;
  min-width: 300px;

  //Color
  color: rgb(var(--v-theme-text));

  //Main content
  .main_content {
    //Sizing and spacing
    width: 100%;
    min-height: auto;
    padding: 10px;

    //Display
    gap: 20px;
    flex-wrap: wrap;

    //Set order box
    .set_order {
      //Sizing and spacing
      width: 30px;
      height: 30px;
      padding: 10px;

      //Border
      border-radius: 10px;
      border: 2px solid rgb(var(--v-theme-attention));

      //Font
      font-size: 12px;

      //Color
      color: rgb(var(--v-theme-attention));
    }

    //Field style
    .field {
      //Display
      gap: 5px;

      //Paragraph style
      p {
        //Font
        font-size: 13px;
        font-weight: 500;
      }

      //Time input style
      .time_input {
        gap: 5px;
      }
    }
  }
}
</style>
