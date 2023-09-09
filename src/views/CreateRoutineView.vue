<template>
  <section
    class="routine-section d-flex flex-column"
    id="specific_routine_section"
  >
    <!-- Loader component -->
    <LoaderComponent v-model="show_loader" />
    <!-- Back button -->
    <BackButtonComponent />
    <!-- Routine section first part -->
    <h2>Create new routine</h2>
    <v-form ref="form" @submit.prevent="create_routine()">
      <div
        class="routine-section__first-part d-flex flex-column"
        v-if="new_routine"
      >
        <!-- Routine section first part title -->
        <span
          class="routine-section__first-part__title d-flex justify-space-between align-center"
        >
          <InputComponent
            :input_rules="[rules.required]"
            input_label="Routine name"
            input_variant="outlined"
            v-model="new_routine.routine_name"
          />
        </span>
      </div>
      <!-- Routine section first part title loader-->
      <div class="routine-section__first-part d-flex flex-column" v-else>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
      </div>
      <!-- Error component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Routine section description -->
      <div
        class="routine-section__description d-flex flex-column"
        v-if="new_routine"
      >
        <TextareaComponent
          :input_clearable="true"
          :input_auto_grow="true"
          input_label="Description"
          input_variant="outlined"
          v-model="new_routine.description"
        />
      </div>
      <!-- Routine section description loader -->
      <div class="routine-section__description d-flex flex-column" v-else>
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
      </div>
      <!-- Routine section days selected -->
      <div
        class="routine-section__days-selected d-flex flex-column"
        v-if="new_routine"
      >
        <p>Assigned days</p>
        <div class="d-flex justify-center">
          <v-slide-group show-arrows v-model="selected_days" mandatory multiple>
            <v-slide-group-item
              v-for="day in days_available"
              :key="day.id_day"
              v-slot="{ isSelected, toggle }"
              :value="day.id_day"
            >
              <v-chip
                label
                :color="isSelected ? 'attention' : 'soft_attention'"
                @click="toggle"
              >
                {{ day.name_day }}
              </v-chip>
            </v-slide-group-item>
          </v-slide-group>
        </div>
      </div>
      <!-- Routine section days selected loader -->
      <div class="routine-section__days-selected d-flex flex-column" v-else>
        <v-skeleton-loader type="table-row" color="card"></v-skeleton-loader>
      </div>
      <!-- Routine section preparation time -->
      <div
        class="routine-section__preparation-time d-flex flex-column"
        v-if="new_routine"
      >
        <p>Preparation time</p>
        <div class="d-flex justify-center">
          <div
            class="d-flex routine-section__preparation-time__inputs align-center"
          >
            <span class="d-flex align-center">
              <!-- Routine section preparation time minutes -->
              <v-text-field
                hide-details
                single-line
                type="number"
                class="centered-input input-font"
                variant="outlined"
                v-model.number="preparation_time.minutes"
                @blur="fix_preparation_time"
              ></v-text-field>
              <p>m</p></span
            >
            <span class="d-flex align-center">
              <!-- Routine section preparation time seconds -->
              <v-text-field
                single-line
                hide-details
                type="number"
                class="centered-input input-font"
                variant="outlined"
                v-model.number="preparation_time.seconds"
                @blur="
                  () => {
                    fix_preparation_time();
                  }
                "
              ></v-text-field>
              <p>s</p></span
            >
          </div>
        </div>
      </div>
      <!-- Routine section preparation time loader -->
      <div
        class="routine-section__preparation-time d-flex align-center justify-center"
        v-else
      >
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
      </div>
      <!-- Routine section exercises -->
      <div
        class="routine-section__exercises d-flex flex-column"
        v-if="new_routine"
      >
        <!-- Routine section exercises title and options -->
        <span class="d-flex align-center routine-section__description__title"
          ><p>Exercises</p>
          <v-tooltip text="Remove from routine" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-eraser"
                v-bind="props"
                @click="
                  open_dialog(
                    'Confirm remove',
                    'Are you sure you want to remove from the routine the selected exercises?',
                    remove_all_selected_exercises
                  )
                "
              ></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="Reset all" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-square-minus"
                v-bind="props"
                v-if="selected_exercises.length > 0"
                @click="selected_exercises = []"
              ></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip text="Select all" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-square-check"
                v-bind="props"
                v-if="selected_exercises.length > 0"
                @click="select_all_exercises"
              ></v-icon>
            </template>
          </v-tooltip>
        </span>
        <!-- Routine section list of exercises -->
        <v-list
          base-color="text"
          bg-color="background_color"
          class="d-flex flex-column"
        >
          <draggable
            v-model="choosed_exercises"
            v-if="choosed_exercises.length > 0"
            item-key="id"
            class="draggable"
          >
            <template #item="{ element: exercise }">
              <v-list-item>
                <ExerciseCardComponent :exercise_card_data="exercise" />
                <CheckboxComponent
                  :checkbox_value="exercise.id_exercise"
                  v-model="selected_exercises"
                  class="exercise_checkbox"
                />
              </v-list-item>
            </template>
          </draggable>

          <h2 v-else id="no_exercises_found" class="text-center">
            No exercise was found
          </h2>
        </v-list>
      </div>
      <!-- Routine section exercises loader-->
      <div class="routine-section__exercises d-flex flex-column" v-else>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
      </div>
      <!-- Routine section buttons -->
      <div class="d-flex routine-section__buttons align-center justify-center">
        <!-- Routine section add exercise -->
        <ButtonComponent
          button-variant="outlined"
          button-type="button"
          button-prepend-icon="fa-solid fa-list"
          button-label="add exercise"
          button-color="text"
          :button-route="{ name: 'ChooseExercise' }"
        />
      </div>
      <v-divider></v-divider>
      <!-- Routine section create button -->
      <div class="d-flex justify-start">
        <ButtonComponent
          button-type="submit"
          button-prepend-icon="fa-solid fa-plus"
          button-label="create new routine"
          button-color="text"
          class="create_button"
        />
      </div>
    </v-form>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_timeout="3000"
      :snackbar_multiline="true"
      :snackbar_text="snackbar_text"
    />
    <!-- Dialog component -->
    <v-dialog
      v-model="dialog.show_dialog"
      persistent
      width="auto"
      scroll-strategy="none"
    >
      <DialogComponent
        :dialog_title="dialog.dialog_title"
        :dialog_text="dialog.dialog_text"
        :dialog_yes_button="dialog.dialog_action"
        :dialog_no_button="
          () => {
            dialog.show_dialog = false;
          }
        "
      />
    </v-dialog>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, onUpdated } from "vue";
import draggable from "vuedraggable";
import { useDayStore } from "../stores/day_store";
import { useExerciseStore } from "../stores/exercise_store";
import { useRoutineStore } from "../stores/routine_store";
import rules from "../utils/rules";
import BackButtonComponent from "@/components/BackButtonComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import ExerciseCardComponent from "@/components/ExerciseCardComponent.vue";
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import router from "../router";

//Functions

const day_store = useDayStore();

const exercise_store = useExerciseStore();

const routine_store = useRoutineStore();

const form = ref(null);

const new_routine = ref({
  routine_name: "",
  time_before_start: "",
  description: "",
});

const preparation_time = ref({
  seconds: 0,
  minutes: 0,
});

const show_loader = ref(false);

const selected_days = ref([1]);

const days_available = ref(null);

const choosed_exercises = ref([]);

const selected_exercises = ref([]);

const error = ref({
  has_error: false,
  error_message: "",
});

const dialog = ref({
  show_dialog: false,
  dialog_title: "",
  dialog_text: "",
  dialog_action: null,
});

const open_snackbar = ref(false);

const snackbar_text = ref("");

//Methods

/**
 * Function that assigned days to a routine
 */
async function assign_days() {
  try {
    const last_id = await routine_store.find_last_id_routine();

    selected_days.value.forEach((id_day) => {
      const data = {
        id_day: id_day,
        id_routine: last_id,
      };

      day_store.assign_day_to_routine(data);
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/**
 * Function that assigned exercises to a routine
 */
async function assign_exercises() {
  try {
    const last_id = await routine_store.find_last_id_routine();

    choosed_exercises.value.forEach((exercise, index) => {
      routine_store.add_exercise_to_routine(exercise.id_exercise, last_id, {
        exercise_order: index + 1,
      });
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/**
 * Function that creates a routine
 */
async function create_routine() {
  show_loader.value = true;

  const { valid } = await form.value.validate();

  if (valid) {
    try {
      new_routine.value.time_before_start = `${preparation_time.value.minutes} minutes ${preparation_time.value.seconds} seconds`;

      const result = await routine_store.create_new_routine(new_routine.value);

      if (result) {
        assign_exercises();

        assign_days();
      }

      router.push({ name: "Home" });
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;
    }
  }

  show_loader.value = false;
}

/*Function that fixes a interval object by changing seconds, minutes and hours attributes*/
function fix_preparation_time() {
  preparation_time.value.seconds = preparation_time.value.seconds
    ? preparation_time.value.seconds
    : 0;

  preparation_time.value.minutes = preparation_time.value.minutes
    ? preparation_time.value.minutes
    : 0;

  preparation_time.value.seconds = parseInt(preparation_time.value.seconds);

  preparation_time.value.minutes = parseInt(preparation_time.value.minutes);

  preparation_time.value.seconds =
    preparation_time.value.seconds > 59 ? 59 : preparation_time.value.seconds;

  preparation_time.value.minutes =
    preparation_time.value.minutes > 99 ? 99 : preparation_time.value.minutes;
}

/**
 * Function that opens a dialog
 * @param {Function} dialog_action - Function that dialog will execute is yes button is clicked
 * @param {String} dialog_text - Dialog's text to show
 * @param {String} dialog_title - Dialog's title to show
 */
function open_dialog(dialog_title, dialog_text, dialog_action) {
  dialog.value.dialog_title = dialog_title;

  dialog.value.dialog_text = dialog_text;

  dialog.value.dialog_action = dialog_action;

  dialog.value.show_dialog = true;
}

/*Function that selects all exercises available*/
function select_all_exercises() {
  choosed_exercises.value = [...selected_exercises.value];
}

/*Function removes all selected exercises of the routine */
async function remove_all_selected_exercises() {
  dialog.value.show_dialog = false;

  let new_choosed_exercises = [];

  choosed_exercises.value.forEach((exercise) => {
    if (!selected_exercises.value.includes(exercise.id_exercise)) {
      new_choosed_exercises.push(exercise);
    }
  });

  exercise_store.selected_exercises = new_choosed_exercises;
}

/*Lifehooks*/

/*Obtain the selected exercises and make them choosed ones*/
onUpdated(() => {
  choosed_exercises.value = [...exercise_store.selected_exercises];
});

/*Gets certain routine's data before view is mounted*/
onBeforeMount(async () => {
  try {
    days_available.value = [...(await day_store.find_all_days())];
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
});
</script>

<style scoped lang="scss">
//Routine section styles
.routine-section {
  //Position
  position: relative;

  //Sizing and spacing
  min-height: 100vh;
  width: 100%;
  height: auto;
  padding: 70px 35px;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Font
  font-family: $primary-font;

  //Display
  gap: 20px;

  h2 {
    font-size: 25px;
  }

  //Routine section first part
  &__first-part {
    margin-bottom: 10px;
    //Routine section first part title
    &__title {
      width: 100%;
    }
  }

  //Routine section description
  &__description {
    //Routine section description title
    &__title {
      gap: 10px;
      .v-icon {
        font-size: 13px;
      }
    }
  }

  //Routine section days selected
  &__days-selected {
    width: 100%;
    gap: 10px;
    margin-bottom: 10px;
  }

  //Routine section preparation time
  &__preparation-time {
    width: 100%;
    gap: 15px;
    margin-bottom: 10px;
    //Routine section preparation time inputs
    .routine-section__preparation-time__inputs {
      width: 300px;
      gap: 10px;
      span {
        gap: 10px;
      }
    }
  }

  //Routine section exercises
  &__exercises {
    gap: 10px;
    margin-bottom: 10px;
    .v-list {
      gap: 10px;
      align-items: center;
      padding-right: 40px;
      .v-list-item {
        position: relative;
        padding-right: 40px;
        //Routine exercise checkbox
        .exercise_checkbox {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }

  //Routine section buttons
  &__buttons {
    width: 100%;
    gap: 5px;
    flex-direction: column;
    margin-bottom: 20px;
    p {
      font-size: 30px;
      font-weight: 500;
    }
  }

  .create_button {
    margin-top: 30px;
  }

  //No exercises found label styles
  #no_exercises_found {
    color: rgb(var(--v-theme-text));
    font-weight: 700;
  }

  //Draggable styles
  .draggable {
    width: 100%;
    max-width: 480px;
  }

  //Paragraph styles
  p {
    font-size: 17px;
    font-weight: 500;
  }
}

//Media queries
@media only screen and (min-width: 480px) {
  //Routine section styles
  .routine-section {
    max-width: 768px;
    //Routine section first part
    &__first-part {
      //Routine section first part title
      &__title {
        justify-content: start !important;
        gap: 10px;
        h2 {
          font-size: 30px;
        }
        .v-icon {
          font-size: 20px;
        }
      }
    }

    //Routine section description
    &__description {
      gap: 5px;
      //Routine section description title
      &__title {
        p {
          font-size: 20px;
        }
        .v-icon {
          font-size: 15px;
        }
      }
      &__text {
        font-size: 15px;
      }
    }

    //Routine section days selected
    &__days-selected {
      width: 100%;
      gap: 10px;
      p {
        font-size: 20px;
      }
    }

    //Routine section preparation time
    &__preparation-time {
      p {
        font-size: 20px;
      }
    }

    //Routine section buttons
    &__buttons {
      gap: 10px;
      flex-direction: row;
      p {
        font-size: 20px;
      }
    }

    //No exercises found label styles
    #no_exercises_found {
      color: rgb(var(--v-theme-text));
      font-weight: 700;
    }

    &__exercises {
    .v-list {
      padding-right: 0px;
    }
  }
  }
}
</style>
