<template>
  <section
    class="routine-section d-flex flex-column"
    id="specific_routine_section"
  >
    <LoaderComponent v-model="show_loader" />
    <!-- Back button -->
    <BackButtonComponent />
    <!-- Routine section first part -->
    <div
      class="routine-section__first-part d-flex flex-column"
      v-if="routine_info && days_of_routine"
    >
      <!-- Routine name -->
      <span
        class="routine-section__first-part__title d-flex justify-space-between align-center"
        v-if="show_edit_routine_name"
      >
        <InputComponent
          :input_rules="[rules.required]"
          input_variant="outlined"
          v-model="routine_info.routine_name"
          :input_auto_focus="true"
          @blur="update_routine"
        />
      </span>
      <span
        class="routine-section__first-part__title d-flex justify-space-between align-center"
        v-else
      >
        <h2>{{ routine_info.routine_name }}</h2>
        <v-tooltip text="Edit title" location="start">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="fa-solid fa-pen"
              v-bind="props"
              v-if="!show_edit_routine_name"
              @click="show_edit_routine_name = !show_edit_routine_name"
            ></v-icon>
          </template>
        </v-tooltip>
      </span>
      <v-divider></v-divider>
      <!-- Routine chips info -->
      <div class="routine-section__first-part__chips-info d-flex">
        <v-chip label class="chip"
          >Usage: {{ routine_info.usage_routine }}</v-chip
        >
        <v-chip label>Created at: {{ routine_info.created_at }}</v-chip>
        <v-chip label
          >To do: {{ get_routine_day_status(days_of_routine) }}</v-chip
        >
      </div>
    </div>
    <!-- Routine section first part title loader-->
    <div class="routine-section__first-part d-flex flex-column" v-else>
      <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
      <v-skeleton-loader
        type="chip, chip, chip"
        color="card"
      ></v-skeleton-loader>
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
      v-if="routine_info"
    >
      <span class="d-flex align-center routine-section__description__title"
        ><p>Description</p>
        <v-tooltip text="Edit description" location="end">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="fa-solid fa-pen"
              v-bind="props"
              @click="
                show_edit_routine_description = !show_edit_routine_description
              "
            ></v-icon>
          </template> </v-tooltip
      ></span>
      <TextareaComponent
        v-if="show_edit_routine_description"
        :input_clearable="true"
        :input_auto_grow="true"
        :input_auto_focus="true"
        input_variant="outlined"
        v-model="routine_info.description"
        @blur="update_routine"
      />
      <div v-else>
        <p
          class="routine-section__description__text"
          v-if="routine_info.description"
        >
          {{ capitalized_first_character(routine_info.description) }}
        </p>
        <p class="routine-section__description__text" v-else>
          No description provided
        </p>
      </div>
    </div>
    <!-- Routine section description loader -->
    <div class="routine-section__description d-flex flex-column" v-else>
      <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
    </div>
    <!-- Routine section days selected -->
    <div
      class="routine-section__days-selected d-flex flex-column"
      v-if="days_available"
    >
      <p>Assigned days</p>
      <div class="d-flex justify-center">
        <v-slide-group show-arrows>
          <v-slide-group-item v-for="day in days_available" :key="day.id_day">
            <v-chip
              label
              :color="is_a_selected_day(day) ? 'attention' : 'soft_attention'"
              @click="change_day(day)"
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
      v-if="preparation_time"
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
              @blur="
                fix_preparation_time();
                update_routine();
              "
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
                fix_preparation_time();
                update_routine();
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
      v-if="exercises_of_routine"
    >
      <!-- Routine section exercises title and options -->
      <span class="d-flex align-center routine-section__description__title"
        ><p>Exercises</p>
        <v-tooltip text="Delete exercise" location="top">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="fa-solid fa-trash"
              v-bind="props"
              @click="
                open_dialog(
                  'Confirm delete',
                  'Are you sure you want to delete the selected exercises?',
                  delete_all_selected_exercises
                )
              "
            ></v-icon>
          </template>
        </v-tooltip>
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
          v-model="exercises_of_routine"
          v-if="exercises_of_routine.length > 0"
          item-key="id"
          @end="change_exercise_order"
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
        :button-route="{
          name: 'ChooseExercise',
          query: { id_routine: route.params.id_routine },
        }"
      />
      <p>or</p>
      <!-- Routine section create new exercise -->
      <ButtonComponent
        button-variant="outlined"
        button-type="button"
        button-prepend-icon="fa-solid fa-plus"
        button-label="create new exercise"
        button-color="text"
        :button-route="{ name: 'CreateExercise' }"
      />
    </div>
    <v-divider></v-divider>
    <!-- Routine section delete button -->
    <div class="d-flex justify-start" v-if="routine_info">
      <ButtonComponent
        button-type="button"
        button-prepend-icon="fa-solid fa-trash-can"
        button-label="delete routine"
        class="delete_button"
        button-color="red"
        button-variant="outlined"
        @click="
          open_dialog(
            'Confirm delete',
            `Are you sure you want to delete '${routine_info.routine_name}'?`,
            delete_routine
          )
        "
      />
    </div>
    <!-- Routine section delete button loader -->
    <div class="d-flex justify-start" v-else>
      <v-skeleton-loader type="button" color="card"></v-skeleton-loader>
    </div>
    <!-- Routine section favorite button -->
    <v-tooltip
      v-if="routine_info"
      :text="
        routine_info.is_favorite ? 'Set to not favorite' : 'Set to favorite'
      "
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-icon
          :class="routine_info.is_favorite ? 'is_favorite' : 'is_not_favorite'"
          icon="fa-solid fa-heart"
          @click="change_favorite"
          v-bind="props"
        ></v-icon>
      </template>
    </v-tooltip>
    <!-- Routine section play button -->
    <v-tooltip
      text="
        Play routine
      "
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-icon
          class="play_button"
          icon="fa-solid fa-play"
          v-bind="props"
          @click="play_routine"
        ></v-icon>
      </template>
    </v-tooltip>
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
import { ref, onBeforeMount } from "vue";
import draggable from "vuedraggable";
import { useRoute } from "vue-router";
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
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import router from "../router";
import { capitalized_first_character } from "../utils/utils_functions";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables
const route = useRoute();

const day_store = useDayStore();

const exercise_store = useExerciseStore();

const routine_store = useRoutineStore();

const routine_info = ref(null);

const preparation_time = ref(null);

const days_of_routine = ref(null);

const days_available = ref(null);

const exercises_of_routine = ref(null);

const selected_exercises = ref([]);

const error = ref({
  has_error: false,
  error_message: "",
});

const show_loader = ref(false);

const show_edit_routine_name = ref(false);

const show_edit_routine_description = ref(false);

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
 * Function that indicates if a day is a selected one for the routine
 * @param {Object} day - Day object with id_day and name_day
 */
const is_a_selected_day = (day) => {
  let found_days = [];

  days_of_routine.value.forEach((assigned_day) => {
    if (assigned_day.id_day === day.id_day) {
      found_days.push(assigned_day);
    }
  });

  return found_days.length > 0;
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

/**
 * Function that changes the days assigned to the routine
 * @param {Object} day - Day object with id_day and name_day
 */
async function change_day(day) {
  try {
    if (is_a_selected_day(day)) {
      await day_store.unscheduled_day_from_routine(
        day.id_day,
        route.params.id_routine
      );
    } else {
      const data = {
        id_day: day.id_day,
        id_routine: route.params.id_routine,
      };

      await day_store.assign_day_to_routine(data);
    }

    days_of_routine.value = [
      ...(await day_store.find_days_of_routine(route.params.id_routine)),
    ];
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/**
 * Function that updates the routine
 */
function update_routine() {
  if (routine_info.value.routine_name) {
    try {
      routine_info.value.time_before_start = `${preparation_time.value.minutes} minutes ${preparation_time.value.seconds} seconds`;

      routine_store.update_specific_routine(
        route.params.id_routine,
        routine_info.value
      );

      show_edit_routine_name.value = false;

      show_edit_routine_description.value = false;
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;
    }
  }
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

/*Function that changes favorite state of the exercise */
async function change_favorite() {
  routine_info.value.is_favorite = !routine_info.value.is_favorite;

  update_routine();
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

/*Function deletes all selected exercises of the routine */
async function delete_all_selected_exercises() {
  if (selected_exercises.value.length > 0) {
    try {
      open_snackbar.value = false;

      dialog.value.show_dialog = false;

      selected_exercises.value.forEach(async (id_exercise) => {
        show_loader.value = true;

        let result = await exercise_store.delete_specific_exercise(id_exercise);

        if (result) {
          exercises_of_routine.value = [
            ...(await exercise_store.find_exercises_of_routine(
              route.params.id_routine
            )),
          ];

          show_loader.value = false;
        }
      });

      snackbar_text.value = "Exercises deleted successfully";

      open_snackbar.value = true;
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      show_loader.value = false;
    }
  } else {
    open_snackbar.value = false;

    snackbar_text.value = "You must select at least one exercise";

    open_snackbar.value = true;

    show_loader.value = false;
  }
}

/*Function removes all selected exercises of the routine */
async function remove_all_selected_exercises() {
  if (selected_exercises.value.length > 0) {
    try {
      open_snackbar.value = false;

      dialog.value.show_dialog = false;

      show_loader.value = true;

      selected_exercises.value.forEach(async (id_exercise) => {
        await routine_store.remove_exercise_from_routine(
          id_exercise,
          route.params.id_routine
        );
      });

      show_loader.value = false;
      
      exercises_of_routine.value = [
        ...(await exercise_store.find_exercises_of_routine(
          route.params.id_routine
        )),
      ];

      snackbar_text.value = "Exercises removed successfully";

      open_snackbar.value = true;
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      show_loader.value = false;
    }
  } else {
    show_loader.value = false;

    open_snackbar.value = false;

    snackbar_text.value = "You must select at least one exercise";

    open_snackbar.value = true;
  }
}

/*Function adds all added exercises to the routine */
async function add_all_added_exercises(exercises) {
  if (exercises.length > 0) {
    try {
      open_snackbar.value = false;

      exercises.forEach(async (exercise) => {
        show_loader.value = true;

        let result = await routine_store.add_exercise_to_routine(
          exercise.id_exercise,
          route.params.id_routine,
          {
            exercise_order: 0,
          }
        );

        if (result) {
          exercises_of_routine.value = [
            ...(await exercise_store.find_exercises_of_routine(
              route.params.id_routine
            )),
          ];
        }
      });

      show_loader.value = false;

      snackbar_text.value = "Exercises added successfully";

      open_snackbar.value = true;

      exercise_store.selected_exercises = [];

      exercises_of_routine.value = [
        ...(await exercise_store.find_exercises_of_routine(
          route.params.id_routine
        )),
      ];
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      exercise_store.selected_exercises = [];

      show_loader.value = false;
    }
  }
}

/*Function selects all exercises of the routine */
function select_all_exercises() {
  selected_exercises.value = [];

  exercises_of_routine.value.forEach((exercise) => {
    selected_exercises.value.push(exercise.id_exercise);
  });
}

/*Function deletes the actual routine*/
async function delete_routine() {
  show_loader.value = true;

  try {
    dialog.value.show_dialog = false;

    await routine_store.delete_specific_routine(route.params.id_routine);

    router.push({ name: "Home" });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/*Function that changes the order of the exercises of the routine*/
async function change_exercise_order() {
  try {
    exercises_of_routine.value.forEach(async (exercise, index) => {
      let data = {
        exercise_order: index + 1,
      };

      await routine_store.change_order_of_an_exercise(
        exercise.id_exercise,
        route.params.id_routine,
        data
      );
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;

    show_loader.value = false;
  }
}

/*Function that handles play of a routine*/
function play_routine() {
  if (exercises_of_routine.value.length > 0) {
    router.push({
      name: "PlayRoutine",
      params: {
        id_routine: route.params.id_routine,
      },
    });
  }
}

/*Lifehooks*/
/*Gets certain routine's data before view is mounted*/
onBeforeMount(async () => {
  try {
    exercises_of_routine.value = [
      ...(await exercise_store.find_exercises_of_routine(
        route.params.id_routine
      )),
    ];

    routine_info.value = {
      ...(await routine_store.find_specific_routine(route.params.id_routine)),
    };

    days_of_routine.value = [
      ...(await day_store.find_days_of_routine(route.params.id_routine)),
    ];

    days_available.value = [...(await day_store.find_all_days())];

    preparation_time.value = { ...routine_info.value.time_before_start };

    fix_preparation_time();

    routine_info.value.created_at = routine_info.value.created_at.split("T")[0];

    await add_all_added_exercises(exercise_store.selected_exercises);
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
  max-width: 768px;
  height: auto;
  padding: 70px 35px;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Font
  font-family: $primary-font;

  //Display
  gap: 20px;
  //Routine section first part
  &__first-part {
    gap: 10px;
    //Routine section first part title
    &__title {
      width: 100%;
      h2 {
        font-size: 25px;
      }
      .v-icon {
        font-size: 20px;
      }
    }
    //Routine section first part chips
    &__chips-info {
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  //Routine section description
  &__description {
    gap: 5px;
    //Routine section description title
    &__title {
      gap: 10px;
      .v-icon {
        font-size: 13px;
      }
    }
    &__text {
      font-size: 13px;
      font-weight: 200;
    }
  }

  //Routine section days selected
  &__days-selected {
    width: 100%;
    gap: 10px;
  }

  //Routine section preparation time
  &__preparation-time {
    width: 100%;
    gap: 15px;

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
    .v-list {
      gap: 10px;
      align-items: center;
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
    margin-bottom: 10px;
    p {
      font-size: 30px;
      font-weight: 500;
    }
  }

  //Is favorite and not favorite styles
  .is_favorite,
  .is_not_favorite {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  //Play button styles
  .play_button {
    position: absolute;
    top: 20px;
    right: 60px;
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
    width: 100%;
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
  }
}
</style>
