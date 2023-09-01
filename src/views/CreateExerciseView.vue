<template>
  <section class="exercise-section">
    <!-- Loader component -->
    <LoaderComponent v-model="show_loader" />
    <!-- Create exercise section -->
    <!-- Back button -->
    <BackButtonComponent />
    <!-- Create exercise section first part-->
    <h2>Create new exercise</h2>
    <!-- Create exercise section form -->
    <v-form
      ref="form"
      @submit.prevent="create_exercise()"
      class="exercise-section__form d-flex flex-column"
    >
      <!-- Exercise name input -->
      <div>
        <InputComponent
          :input_rules="[rules.required]"
          input_variant="outlined"
          v-model="new_exercise.exercise_name"
          input_label="Exercise name"
        />
      </div>
      <!-- Exercise description input -->
      <div>
        <TextareaComponent
          :input_clearable="true"
          :input_auto_grow="true"
          input_variant="outlined"
          v-model="new_exercise.description"
          input_label="Description"
        />
      </div>
      <!-- Error component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <div
        class="exercise-section__form__options"
        v-if="new_exercise.intensity"
      >
        <!-- Create exercise section options intensity -->
        <div>
          <p class="label">Intensity</p>
          <RadioButtonComponent
            :radio_group_values="[1, 2, 3]"
            :radio_group_labels="['low', 'mid', 'high']"
            :radio_group_colors="['#009dff', '#e8e80e', '#ff0000']"
            @value_change="
              (event) => {
                change_intensity(event);
              }
            "
            v-model="new_exercise.intensity"
          />
        </div>
        <!-- Create exercise section options choose muscle groups -->
        <div class="d-flex flex-column muscle_group">
          <p class="label">Assigned muscle groups</p>
          <v-select
            v-model="choosed_muscle_groups"
            :items="muscle_groups_available"
            item-title="name_muscle_group"
            return-object
            multiple
          ></v-select>
        </div>
      </div>
      <div class="exercise-section_form__options" v-else>
        <v-skeleton-loader
          type="paragraph, paragraph"
          color="card"
        ></v-skeleton-loader>
        <v-skeleton-loader
          type="paragraph, paragraph"
          color="card"
        ></v-skeleton-loader>
      </div>
      <div class="exercise-section__form__gallery d-flex flex-column">
        <!-- Create exercise section gallery title and options -->
        <span class="d-flex align-center label"
          ><p class="label">Gallery</p>
          <!-- Add new photo button -->
          <v-tooltip text="Add new photo" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-plus"
                v-bind="props"
                @click="file_input.click()"
              ></v-icon>
            </template>
          </v-tooltip>
          <!-- Delete photo button -->
          <v-tooltip text="Delete photo" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-trash"
                v-bind="props"
                @click="
                  open_dialog(
                    'Confirm delete',
                    'Are you sure you want to delete the selected photos?',
                    delete_all_selected_photos
                  )
                "
              ></v-icon>
            </template>
          </v-tooltip>
        </span>
        <!-- Create exercise section gallery carousel -->
        <v-carousel
          hide-delimiters
          v-if="choosed_photos.length > 0"
          progress="attention"
          height="300"
        >
          <v-carousel-item
            v-for="(photo, index) in choosed_photos"
            :src="photo"
            :key="index"
          >
            <CheckboxComponent
              :checkbox_value="index"
              v-model="selected_photos"
              class="photo_checkbox"
            />
          </v-carousel-item>
        </v-carousel>
        <!-- No photos uploaded yet text -->
        <h2 v-else class="text-center">No photos uploaded yet</h2>
        <!-- Input file -->
        <input
          ref="file_input"
          type="file"
          style="display: none"
          accept="image/*"
          @change="on_photo_change"
        />
      </div>
      <!-- Rest time -->
      <div class="exercise-section__form__rest-time d-flex flex-column">
        <p class="label">Rest time</p>
        <div class="d-flex justify-center">
          <!-- Create exercise section rest time inputs -->
          <div class="d-flex exercise-section_rest-time__inputs align-center">
            <!-- Create exercise section rest time minutes input -->
            <span class="d-flex align-center"
              ><v-text-field
                hide-details
                single-line
                type="number"
                class="centered-input input-font"
                variant="outlined"
                v-model.number="rest_time.minutes"
                @blur="
                  () => {
                    fix_rest_time();
                  }
                "
              ></v-text-field>
              <p class="label">m</p></span
            >
            <!-- Create exercise section rest time seconds input -->
            <span class="d-flex align-center"
              ><v-text-field
                single-line
                hide-details
                type="number"
                class="centered-input input-font"
                variant="outlined"
                v-model.number="rest_time.seconds"
                @blur="
                  () => {
                    fix_rest_time();
                  }
                "
              ></v-text-field>
              <p class="label">s</p></span
            >
          </div>
        </div>
      </div>
      <div class="exercise-section__form__sets d-flex flex-column">
        <!-- Create exercise section sets title and options -->
        <span class="d-flex align-center label"
          ><p class="label">Sets</p>
          <!-- Delete set button -->
          <v-tooltip text="Delete set" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-trash"
                v-bind="props"
                @click="
                  open_dialog(
                    'Confirm delete',
                    'Are you sure you want to delete the selected exercises?',
                    delete_all_selected_sets
                  )
                "
              ></v-icon>
            </template>
          </v-tooltip>
          <!-- Reset all button -->
          <v-tooltip text="Reset all" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-square-minus"
                v-bind="props"
                v-if="selected_sets.length > 0"
                @click="selected_sets = []"
              ></v-icon>
            </template>
          </v-tooltip>
          <!-- Select all button -->
          <v-tooltip text="Select all" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-square-check"
                v-bind="props"
                v-if="selected_sets.length > 0"
                @click="select_all_sets"
              ></v-icon>
            </template>
          </v-tooltip>
        </span>
        <!-- Create exercise section exercise's sets-->
        <v-list
          base-color="text"
          bg-color="background_color"
          class="d-flex flex-column"
          v-if="created_sets.length > 0"
        >
          <draggable v-model="created_sets" item-key="id">
            <template #item="{ element: set }">
              <v-list-item>
                <SetCardComponent :set_card_data="set" />
                <CheckboxComponent
                  :checkbox_value="set"
                  v-model="selected_sets"
                  class="set_checkbox"
                />
              </v-list-item>
            </template>
          </draggable>
        </v-list>
        <h2 v-else class="text-center">Sets not found</h2>
      </div>
      <div class="d-flex exercise-section__form__create-buttons">
        <!-- Create repetition set button -->
        <ButtonComponent
          button-variant="outlined"
          button-type="button"
          button-prepend-icon="fa-solid fa-hashtag"
          button-label="create new repetition set"
          button-color="text"
          @click.prevent="create_new_repetition_set"
        />
        <p class="label">or</p>
        <!-- Create time set button -->
        <ButtonComponent
          button-variant="outlined"
          button-type="button"
          button-prepend-icon="fa-solid fa-clock"
          button-label="create new time set"
          button-color="text"
          @click.prevent="create_new_time_set"
        />
      </div>
      <v-divider></v-divider>
      <!-- Exercise section create button -->
      <div class="d-flex justify-start">
        <ButtonComponent
          button-type="submit"
          button-prepend-icon="fa-solid fa-plus"
          button-label="create new exercise"
          button-color="text"
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
import { ref, onBeforeMount } from "vue";
import draggable from "vuedraggable";
import { useExerciseStore } from "../stores/exercise_store";
import { useMuscleGroupStore } from "../stores/muscle_group_store";
import { useSetStore } from "../stores/set_store";
import { usePhotoExerciseStore } from "../stores/photo_exercise";
import rules from "../utils/rules";
import BackButtonComponent from "@/components/BackButtonComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import SetCardComponent from "@/components/SetCardComponent.vue";
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import RadioButtonComponent from "@/components/RadioButtonComponent.vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import router from "../router";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables

const exercise_store = useExerciseStore();

const muscle_group_store = useMuscleGroupStore();

const photo_exercise_store = usePhotoExerciseStore();

const set_store = useSetStore();

const error = ref({
  has_error: false,
  error_message: "",
});

const form = ref(null);

const file_input = ref(null);

const show_loader = ref(false);

const new_exercise = ref({
  exercise_name: "",
  description: "",
  time_after_exercise: "",
  intensity: 1,
});

const rest_time = ref({
  seconds: 0,
  minutes: 0,
});

const choosed_muscle_groups = ref([
  { id_muscle_group: 1, name_muscle_group: "Global" },
]);

const last_id_set = ref(0);

const muscle_groups_available = ref([]);

const created_sets = ref([]);

const selected_sets = ref([]);

const new_photo = ref(new FormData());

const selected_photos = ref([]);

const choosed_photos = ref([]);

const choosed_files = ref([]);

const dialog = ref({
  show_dialog: false,
  dialog_title: "",
  dialog_text: "",
  dialog_action: null,
});

const open_snackbar = ref(false);

const snackbar_text = ref("");

//Methods

/*Function that updates the current exercise*/
async function create_exercise() {
  show_loader.value = true;
  
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      new_exercise.value.time_after_exercise = `${rest_time.value.minutes} minutes ${rest_time.value.seconds} seconds`;

      await exercise_store.create_new_exercise(new_exercise.value);

      const last_id = await exercise_store.find_last_id_exercise();

      create_sets(last_id);

      assign_muscle_groups(last_id);

      upload_photos(last_id);

      router.push({ name: "Home" });
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;
    }
  }

  show_loader.value = false;
}

/*Function that fix rest time object by changing seconds, minutes and hours attributes
  as appropiate*/
function fix_rest_time() {
  rest_time.value.seconds = rest_time.value.seconds
    ? rest_time.value.seconds
    : 0;

  rest_time.value.minutes = rest_time.value.minutes
    ? rest_time.value.minutes
    : 0;

  rest_time.value.seconds = parseInt(rest_time.value.seconds);

  rest_time.value.minutes = parseInt(rest_time.value.minutes);

  rest_time.value.seconds =
    rest_time.value.seconds > 59 ? 59 : rest_time.value.seconds;

  rest_time.value.minutes =
    rest_time.value.minutes > 99 ? 99 : rest_time.value.minutes;
}

/*Function that changes the intensity of the exercise */
async function change_intensity(value) {
  new_exercise.value.intensity = value;
}

/*Function that creates a new repetition set */
function create_new_repetition_set() {
  const new_set = {
    weight: 0.0,
    rest_after_set: {
      seconds: 0,
      minutes: 0,
    },
    set_order:
      created_sets.value.length > 0
        ? created_sets.value[created_sets.value.length - 1].set_order + 1
        : 1,
    type: "repetition",
    quantity: 0,
  };

  created_sets.value.push(new_set);
}

/*Function that creates a new time set */
function create_new_time_set() {
  const new_set = {
    weight: 0.0,
    rest_after_set: {
      seconds: 0,
      minutes: 0,
    },
    set_order:
      created_sets.value.length > 0
        ? created_sets.value[created_sets.value.length - 1].set_order + 1
        : 1,
    type: "time",
    quantity: {
      seconds: 0,
      minutes: 0,
    },
  };

  created_sets.value.push(new_set);
}

/*Function that selects all sets of the exercise*/
function select_all_sets() {
  selected_sets.value = [...created_sets.value];
}

/*Function that changes the set's order*/
function change_set_order() {
  created_sets.value.forEach((set, index) => {
    set.set_order = index + 1;
  });
}

/*Function that deletes all the selected sets*/
function delete_all_selected_sets() {
  dialog.value.show_dialog = false;

  let new_created_sets = [];

  if (selected_sets.value.length > 0) {
    created_sets.value.forEach((set) => {
      const index = selected_sets.value.indexOf(set);
      if (index === -1) {
        new_created_sets.push(set);
      }
    });

    created_sets.value = new_created_sets;

    change_set_order();
  }

  selected_sets.value = [];
}

/*Function that deletes all the selected photos */
function delete_all_selected_photos() {
  dialog.value.show_dialog = false;

  if (selected_photos.value.length > 0) {
    selected_photos.value.forEach((photo_index, index) => {
      let deleted_photos = 0;

      photo_index = index === 0 ? photo_index : photo_index - deleted_photos;

      choosed_photos.value.splice(photo_index, 1);

      choosed_files.value.splice(photo_index, 1);

      deleted_photos++;
    });
  }

  selected_photos.value = [];
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

/* Function that uploads a photo and associate it with the exercise*/
async function on_photo_change(event) {
  const file = event.target.files[0];

  const reader = new FileReader();

  reader.onload = (e) => {
    choosed_files.value.push(file);

    choosed_photos.value.push(e.target.result);
  };

  reader.readAsDataURL(file);
}

/*Function that assignes muscle groups to an exercise*/
function assign_muscle_groups(id_exercise) {
  try {
    choosed_muscle_groups.value.forEach((muscle_group) => {
      muscle_group_store.assign_muscle_group_to_exercise({
        id_exercise: id_exercise,
        id_muscle_group: muscle_group.id_muscle_group,
      });
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/*Function that uploads photos related to an exercise */
function upload_photos(id_exercise) {
  try {
    choosed_files.value.forEach((file) => {
      new_photo.value.append("image", file);

      photo_exercise_store.create_new_photo(id_exercise, new_photo.value);

      new_photo.value = new FormData();
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/*Function that associate the sets created to the exercise*/
function create_sets(id_exercise) {
  try {
    created_sets.value.forEach(async (set) => {
      let new_set = { ...set };

      new_set.id_exercise = id_exercise;

      new_set.id_set = last_id_set.value ? last_id_set.value : 1;

      new_set.rest_after_set = `${set.rest_after_set.minutes} minutes ${set.rest_after_set.seconds} seconds`;

      if (new_set.type === "time") {
        new_set.quantity = `${new_set.quantity.minutes} minutes ${new_set.quantity.seconds} seconds`;
      }

      set_store.create_new_set(new_set);

      last_id_set.value = new_set.id_set + 1;
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/*Lifehooks */
/*Gets and set certain data of the exercise before view is mounted */
onBeforeMount(async () => {
  try {
    muscle_groups_available.value = [
      ...(await muscle_group_store.find_all_muscle_groups()),
    ];

    create_new_repetition_set();

    last_id_set.value = await set_store.find_last_id_set();
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
});
</script>

<style scoped lang="scss">
//Create exercise section styles
.exercise-section {
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

  &__form {
    //Sizing
    height: 100%;
    width: 100%;

    //Display
    gap: 20px;

    //Margin
    margin-top: 20px;

    &__options {
      //Width
      width: 100%;

      //Display
      display: grid;
      gap: 10px;
      grid-row: 100%;
      grid-template-columns: 1fr 1fr;
    }

    //Create exercise section gallery
    &__gallery {
      width: 100%;
      gap: 10px;
      .v-carousel {
        .v-carousel-item {
          position: relative;
          .photo_checkbox {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }

    //Create exercise section rest time
    &__rest-time {
      width: 100%;
      gap: 10px;

      //Create exercise section rest time inputs
      .exercise-section_rest-time__inputs {
        width: 300px;
        gap: 10px;
        span {
          gap: 10px;
        }
      }
    }

    //Create exercise section sets
    &__sets {
      gap: 10px;
      .v-list {
        gap: 10px;
        overflow: hidden;
        .v-list-item {
          position: relative;
          padding-right: 40px;
          //Set checkbox style
          .set_checkbox {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
    }

    //Create buttons styles
    &__create-buttons {
      //Display
      gap: 10px;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
}

//Label style
.label {
  //Font
  font-size: 17px;
  font-weight: 500;

  //Display
  gap: 10px;
  .v-icon {
    font-size: 13px;
  }
}

//Muscle group style
.muscle_group {
  gap: 10px;
}

//Media queries
@media only screen and (min-width: 768px) {
  //Exercise section styles
  .exercise-section {
    &__form {
      &__create-buttons {
        //Sizing
        width: 100%;

        //Display
        gap: 10px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
