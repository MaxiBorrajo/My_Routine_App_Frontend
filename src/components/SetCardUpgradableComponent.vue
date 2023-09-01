<template>
  <!-- Set card component -->
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
    v-if="!error"
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

            update_set();
          "
        ></v-text-field>
        <p>{{ weight_unit }}</p>
      </span>
      <!-- Set repetitions -->
      <span
        v-if="type === 'Repetition'"
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

            update_set()
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
            @blur="update_set()"
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
            @blur="update_set()"
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
            @blur="update_set()"
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
            @blur="update_set()"
          ></v-text-field>
          <p>s</p>
        </span>
      </span>
    </div>
  </v-card>
  <v-card
    color="card"
    variant="elevated"
    elevation="24"
    max-height="200"
    ripple
    class="d-flex justify-center align-center retry"
    v-else
  >
    <ButtonComponent
      @click="retry"
      button-prepend-icon="fa-solid fa-arrow-rotate-left"
      button-label="retry"
      button-type="button"
    />
  </v-card>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, watch } from "vue";
import { useSetStore } from "../stores/set_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

//Variables
const props = defineProps({
  set_card_data: Object,
  set_card_id_exercise: Number,
});

const emit = defineEmits(["set_information_changed"]);

const set_store = useSetStore();

const set_info = ref({});

const type = ref("");

const weight_unit = ref("");

const time_set = ref({});

const rest_time = ref({});

const error = ref(false);

//Methods

/*Function that updates the set's information */
async function update_set() {
  try {
    if (type.value === "Time") {
      fix_time(time_set);

      set_info.value.quantity = `${time_set.value.minutes} minutes ${time_set.value.seconds} seconds`;
    }

    fix_time(rest_time);

    set_info.value.rest_after_set = `${rest_time.value.minutes} minutes ${rest_time.value.seconds} seconds`;

    await set_store.update_specific_set(
      set_info.value.id_set,
      props.set_card_id_exercise,
      set_info.value
    );
  } catch (err) {
    console.log(err)
    error.value = true;
  }
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
  set_info.value = {
    id_set: props.set_card_data.id_set,
    set_order: props.set_card_data.set_order,
    weight: props.set_card_data.weight,
    rest_after_set: props.set_card_data.rest_after_set,
    type: props.set_card_data.time ? "time" : "repetition",
    quantity: props.set_card_data.time
      ? props.set_card_data.time
      : props.set_card_data.repetition,
  };

  const user = JSON.parse(localStorage.getItem("current_user_info"));

  weight_unit.value = user.weight;

  type.value = set_info.value.type === "time" ? "Time" : "Repetition";

  if (type.value === "Time") {
    time_set.value = { ...set_info.value.quantity };

    fix_time(time_set);
  }

  rest_time.value = { ...set_info.value.rest_after_set };

  fix_time(rest_time);
}

function retry() {
  error.value = false;

  get_set_info();

  update_set();
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
//Set card component style
.v-card {
  //Sizing
  width: 100%;

  //Color
  color: rgb(var(--v-theme-text));

  //Main content style
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
      //Font
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

.retry {
  padding: 30px;
}
</style>
