<template>
  <section>
    <LoaderComponent v-model="show_loader" />
    <!-- Specific exercise section -->
    <div class="exercise-section d-flex flex-column">
      <!-- Back button -->
      <BackButtonComponent />
      <!-- Specific exercise section first part-->
      <div
        class="exercise-section__first-part d-flex flex-column"
        v-if="exercise_info"
      >
        <!-- Specific exercise section first part title -->
        <span
          class="exercise-section__first-part__title d-flex justify-space-between align-center"
          v-if="show_edit_exercise_name"
        >
          <!-- Specific exercise section first part input -->
          <InputComponent
            :input_rules="[rules.required]"
            input_variant="outlined"
            v-model="exercise_info.exercise_name"
            :input_auto_focus="true"
            @blur="update_exercise"
          />
        </span>

        <!-- Specific exercise section first part exercise name -->
        <span
          class="exercise-section__first-part__title d-flex justify-space-between align-center"
          v-else
        >
          <h2>{{ exercise_info.exercise_name }}</h2>
          <v-tooltip text="Edit title" location="start">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-pen"
                v-bind="props"
                v-if="!show_edit_exercise_name"
                @click="show_edit_exercise_name = !show_edit_exercise_name"
              ></v-icon>
            </template>
          </v-tooltip>
        </span>
        <v-divider></v-divider>

        <!-- Specific exercise section first part date of creation -->
        <div class="exercise-section__first-part__chips-info d-flex">
          <v-chip label>Created at: {{ exercise_info.created_at }}</v-chip>
        </div>
      </div>
      <!-- Exercise section first part title loader-->
      <div class="exercise-section__first-part d-flex flex-column" v-else>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="chip" color="card"></v-skeleton-loader>
      </div>
      <!-- Error component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Specific exercise section description -->
      <div
        class="exercise-section__description d-flex flex-column"
        v-if="exercise_info"
      >
        <!-- Specific exercise section description input -->
        <span class="d-flex align-center exercise-section__description__title"
          ><p>Description</p>
          <v-tooltip text="Edit description" location="end">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-pen"
                v-bind="props"
                @click="
                  show_edit_exercise_description =
                    !show_edit_exercise_description
                "
              ></v-icon>
            </template> </v-tooltip
        ></span>
        <TextareaComponent
          v-if="show_edit_exercise_description"
          :input_clearable="true"
          :input_auto_grow="true"
          :input_auto_focus="true"
          input_variant="outlined"
          v-model="exercise_info.description"
          @blur="update_exercise"
        />
        <!-- Specific exercise section exercise's description -->
        <div v-else>
          <p
            class="exercise-section__description__text"
            v-if="exercise_info.description !== ''"
          >
            {{ capitalized_first_character(exercise_info.description) }}
          </p>
          <p class="exercise-section__description__text" v-else>
            No description provided
          </p>
        </div>
      </div>
      <!-- Exercise section description loader -->
      <div class="exercise-section__description d-flex flex-column" v-else>
        <v-skeleton-loader type="paragraph" color="card"></v-skeleton-loader>
      </div>
      <!-- Specific exercise section options -->
      <div
        class="exercise-section__options"
        v-if="exercise_info && muscle_groups_available"
      >
        <!-- Specific exercise section options intensity -->
        <div>
          <p>Intensity</p>
          <RadioButtonComponent
            :radio_group_values="[1, 2, 3]"
            :radio_group_labels="['low', 'mid', 'high']"
            :radio_group_colors="['#009dff', '#e8e80e', '#ff0000']"
            @value_change="
              (event) => {
                change_intensity(event);
              }
            "
            v-model="exercise_info.intensity"
          />
        </div>
        <!-- Specific exercise section options choose muscle groups -->
        <div>
          <p>Assigned muscle groups</p>
          <v-select
            v-model="muscle_groups_of_exercise"
            :items="muscle_groups_available"
            item-title="name_muscle_group"
            return-object
            multiple
          ></v-select>
        </div>
      </div>
      <div
        class="exercise-section__options d-flex align-center justify-space-between"
        v-else
      >
        <v-skeleton-loader type="paragraph" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
      </div>
      <!-- Specific exercise section gallery-->
      <div
        class="exercise-section__gallery d-flex flex-column"
        v-if="exercise_info && photos_of_exercise"
      >
        <!-- Specific exercise section gallery title and options -->
        <span class="d-flex align-center exercise-section__description__title"
          ><p>Gallery</p>
          <v-tooltip text="Add new photo" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-plus"
                v-bind="props"
                @click="file_input.click()"
              ></v-icon>
            </template>
          </v-tooltip>
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
        <!-- Specific exercise section gallery carousel -->
        <v-carousel
          hide-delimiters
          v-if="photos_of_exercise.length > 0"
          progress="attention"
          height="300"
        >
          <v-carousel-item
            v-for="(photo, index) in photos_of_exercise"
            :src="photo.url_photo"
            :key="index"
          >
            <CheckboxComponent
              :checkbox_value="photo.public_id"
              v-model="selected_photos"
              class="photo_checkbox"
            />
          </v-carousel-item>
        </v-carousel>
        <h2 v-else class="text-center">No photos found</h2>
        <input
          ref="file_input"
          type="file"
          style="display: none"
          accept="image/*"
          @change="on_photo_change"
        />
      </div>
      <div class="exercise-section__gallery d-flex flex-column" v-else>
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
      </div>
      <!-- Specific exercise section routines -->
      <div
        class="exercise-section__routines d-flex flex-column"
        v-if="exercise_info && routines_of_exercise"
      >
        <!-- Specific exercise section routines slide group-->
        <p>Included in:</p>
        <v-slide-group show-arrows v-if="routines_of_exercise.length > 0">
          <v-slide-group-item
            v-for="routine in routines_of_exercise"
            :key="routine.id_routine"
          >
            <v-chip
              label
              :to="{
                name: 'SpecificRoutine',
                params: { id_routine: routine.id_routine },
              }"
            >
              {{ routine.routine_name }}
            </v-chip>
          </v-slide-group-item>
        </v-slide-group>
        <h2 v-else class="text-center">No routines found</h2>
      </div>
      <div class="exercise-section__routines d-flex flex-column" v-else>
        <v-skeleton-loader
          type="chip, chip, chip"
          color="card"
        ></v-skeleton-loader>
      </div>
      <!-- Specific exercise section rest time-->
      <div
        class="exercise-section__rest-time d-flex flex-column"
        v-if="exercise_info"
      >
        <p>Rest time</p>
        <div class="d-flex justify-center">
          <!-- Specific exercise section rest time inputs -->
          <div class="d-flex exercise-section_rest-time__inputs align-center">
            <!-- Specific exercise section rest time minutes input -->
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
                    update_exercise();
                  }
                "
              ></v-text-field>
              <p>m</p></span
            >
            <!-- Specific exercise section rest time seconds input -->
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
                    update_exercise();
                  }
                "
              ></v-text-field>
              <p>s</p></span
            >
          </div>
        </div>
      </div>
      <div
        class="exercise-section__rest-time d-flex align-center justify-center"
        v-else
      >
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="image" color="card"></v-skeleton-loader>
      </div>
      <!-- Specific exercise section sets -->
      <div
        class="exercise-section__sets d-flex flex-column"
        v-if="exercise_info && sets_of_exercise"
      >
        <!-- Specific exercise section sets title and options -->
        <span class="d-flex align-center exercise-section__description__title"
          ><p>Sets</p>
          <!-- Delete set button -->
          <v-tooltip text="Delete set" location="top">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="fa-solid fa-trash"
                v-bind="props"
                @click="
                  open_dialog(
                    'Confirm delete',
                    'Are you sure you want to delete the selected sets?',
                    delete_all_selected_sets
                  )
                "
              ></v-icon>
            </template>
          </v-tooltip>
          <!-- Reset all set button -->
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
          <!-- Select all set button -->
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
        <!-- Specific exercise section exercise's sets-->
        <v-list
          base-color="text"
          bg-color="background_color"
          class="d-flex flex-column"
          v-if="sets_of_exercise.length > 0"
        >
          <draggable
            v-model="sets_of_exercise"
            item-key="id"
            @end="change_set_order"
          >
            <template #item="{ element: set }">
              <v-list-item>
                <SetCardUpgradableComponent
                  :set_card_data="set"
                  :set_card_id_exercise="Number(route.params.id_exercise)"
                  :set_is_upgradable="true"
                />
                <CheckboxComponent
                  :checkbox_value="set.id_set"
                  v-model="selected_sets"
                  class="set_checkbox"
                />
              </v-list-item>
            </template>
          </draggable>
        </v-list>
        <h2 v-else class="text-center">Sets not found</h2>
      </div>
      <div class="exercise-section__sets d-flex flex-column" v-else>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
        <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
      </div>
      <!-- Specific exercise section sets buttons -->
      <div class="d-flex exercise-section__create-buttons">
        <!-- Specific exercise section sets create set button -->
        <ButtonComponent
          button-variant="outlined"
          button-type="button"
          button-prepend-icon="fa-solid fa-hashtag"
          button-label="create new repetition set"
          button-color="text"
          @click.prevent="create_new_repetition_set"
        />
        <p class="label">or</p>
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
      <!-- Specific exercise section sets delete exercise button -->
      <div class="d-flex justify-start" v-if="exercise_info">
        <ButtonComponent
          button-type="button"
          button-prepend-icon="fa-solid fa-trash-can"
          button-label="delete exercise"
          class="delete_button"
          button-color="red"
          button-variant="outlined"
          @click="
            open_dialog(
              'Confirm delete',
              `Are you sure you want to delete '${exercise_info.exercise_name}'?`,
              delete_exercise
            )
          "
        />
      </div>
      <!-- Favorite button -->
      <v-tooltip
        v-if="exercise_info"
        :text="
          exercise_info.is_favorite ? 'Set to not favorite' : 'Set to favorite'
        "
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-icon
            :class="
              exercise_info.is_favorite ? 'is_favorite' : 'is_not_favorite'
            "
            icon="fa-solid fa-heart"
            @click="change_favorite"
            v-bind="props"
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
    </div>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, watch } from "vue";
import draggable from "vuedraggable";
import { useRoute } from "vue-router";
import { useExerciseStore } from "../stores/exercise_store";
import { useRoutineStore } from "../stores/routine_store";
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
import SetCardUpgradableComponent from "@/components/SetCardUpgradableComponent.vue";
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import DialogComponent from "@/components/DialogComponent.vue";
import RadioButtonComponent from "@/components/RadioButtonComponent.vue";
import router from "../router";
import { capitalized_first_character } from "../utils/utils_functions";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables

const route = useRoute();

const exercise_store = useExerciseStore();

const routine_store = useRoutineStore();

const muscle_group_store = useMuscleGroupStore();

const photo_exercise_store = usePhotoExerciseStore();

const set_store = useSetStore();

const error = ref({
  has_error: false,
  error_message: "",
});

const show_loader = ref(false);

const file_input = ref(null);

const exercise_info = ref(null);

const rest_time = ref(null);

const muscle_groups_of_exercise = ref(null);

const muscle_groups_available = ref(null);

const routines_of_exercise = ref(null);

const photos_of_exercise = ref(null);

const sets_of_exercise = ref(null);

const selected_sets = ref([]);

const new_photo = ref(new FormData());

const selected_photos = ref([]);

const show_edit_exercise_name = ref(false);

const show_edit_exercise_description = ref(false);

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
function update_exercise() {
  if (exercise_info.value.exercise_name) {
    try {
      exercise_info.value.time_after_exercise = `${rest_time.value.minutes} minutes ${rest_time.value.seconds} seconds`;

      exercise_store.update_specific_exercise(
        route.params.id_exercise,
        exercise_info.value
      );

      show_edit_exercise_name.value = false;

      show_edit_exercise_description.value = false;
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;
    }
  }
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

/*Function that changes favorite state of the exercise */
function change_favorite() {
  exercise_info.value.is_favorite = !exercise_info.value.is_favorite;

  update_exercise();
}

/*Function that changes the intensity of the exercise */
function change_intensity(value) {
  exercise_info.value.intensity = value;

  update_exercise();
}

/*Function that deletes the exercise */
async function delete_exercise() {
  show_loader.value = true;

  try {
    dialog.value.show_dialog = false;

    await exercise_store.delete_specific_exercise(route.params.id_exercise);

    router.push({ name: "Home" });
  } catch (err) {
    dialog.value.show_dialog = false;

    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/*Function that selects all sets of the exercise*/
function select_all_sets() {
  selected_sets.value = [];

  sets_of_exercise.value.forEach((set) => {
    selected_sets.value.push(set.id_set);
  });
}

/*Function that changes the set's order*/
async function change_set_order() {
  try {
    sets_of_exercise.value.forEach(async (set, index) => {
      const new_set = {
        set_order: index + 1,
      };

      let result = await set_store.update_specific_set(
        set.id_set,
        route.params.id_exercise,
        new_set
      );

      if (index === sets_of_exercise.value.length - 1 && result) {
        sets_of_exercise.value = [
          ...(await set_store.find_all_sets_of_exercise(
            route.params.id_exercise
          )),
        ];
      }
    });
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}

/*Function that deletes all the selected sets*/
async function delete_all_selected_sets() {
  if (selected_sets.value.length > 0) {
    try {
      open_snackbar.value = false;

      dialog.value.show_dialog = false;

      show_loader.value = true;

      selected_sets.value.forEach(async (id_set, index) => {
        let result = await set_store.delete_specific_set(
          id_set,
          route.params.id_exercise
        );

        if (index === selected_sets.value.length - 1 && result) {
          sets_of_exercise.value = [
            ...(await set_store.find_all_sets_of_exercise(
              route.params.id_exercise
            )),
          ];

          await change_set_order();

          show_loader.value = false;
        }
      });

      open_snackbar.value = false;

      snackbar_text.value = "Sets deleted successfully";

      open_snackbar.value = true;

      selected_sets.value = [];
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      show_loader.value = false;
    }
  } else {
    show_loader.value = false;

    open_snackbar.value = false;

    snackbar_text.value = "You must select at least one set";

    open_snackbar.value = true;
  }
}

/*Function that deletes all the selected photos */
async function delete_all_selected_photos() {
  if (selected_photos.value.length > 0) {
    try {
      open_snackbar.value = false;

      dialog.value.show_dialog = false;

      show_loader.value = true;

      selected_photos.value.forEach(async (public_id, index) => {
        let result = await photo_exercise_store.delete_photo_of_exercise(
          public_id,
          route.params.id_exercise
        );

        if (index === selected_photos.value.length - 1 && result) {
          photos_of_exercise.value = [
          ...(await photo_exercise_store.find_all_photos_of_exercise(
            route.params.id_exercise
          )),
        ];

          show_loader.value = false;
        }
      });

      open_snackbar.value = false;

      snackbar_text.value = "Photos deleted successfully";

      open_snackbar.value = true;

      selected_photos.value = [];
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      show_loader.value = false;
    }
  } else {
    show_loader.value = false;

    open_snackbar.value = false;

    snackbar_text.value = "You must select at least one set";

    open_snackbar.value = true;
  }
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
  if (event.target.files[0]) {
    show_loader.value = true;

    try {
      const file = event.target.files[0];

      new_photo.value.append("image", file);

      const result = await photo_exercise_store.create_new_photo(
        route.params.id_exercise,
        new_photo.value
      );

      if (result) {
        photos_of_exercise.value = [
          ...(await photo_exercise_store.find_all_photos_of_exercise(
            route.params.id_exercise
          )),
        ];
      }

      open_snackbar.value = false;

      snackbar_text.value = "Photo uploaded successfully";

      open_snackbar.value = true;

      new_photo.value = new FormData();
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      new_photo.value = new FormData();
    }

    show_loader.value = false;
  }
}

/*Function that changes the intensity of the exercise */
async function create_new_repetition_set() {
  show_loader.value = true;

  try {
    const new_set = {
      id_exercise: route.params.id_exercise,
      id_set:
        sets_of_exercise.value.length > 0
          ? sets_of_exercise.value[sets_of_exercise.value.length - 1].id_set + 1
          : 1,
      weight: 0.0,
      rest_after_set: "0 minutes 0 seconds",
      set_order:
        sets_of_exercise.value.length > 0
          ? sets_of_exercise.value[sets_of_exercise.value.length - 1]
              .set_order + 1
          : 1,
      type: "repetition",
      quantity: 0,
    };

    const result = await set_store.create_new_set(new_set);

    if (result) {
      sets_of_exercise.value = [
        ...(await set_store.find_all_sets_of_exercise(
          route.params.id_exercise
        )),
      ];
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/*Function that creates a new time set */
async function create_new_time_set() {
  show_loader.value = true;

  try {
    const new_set = {
      id_exercise: route.params.id_exercise,
      id_set:
        sets_of_exercise.value.length > 0
          ? sets_of_exercise.value[sets_of_exercise.value.length - 1].id_set + 1
          : 1,
      weight: 0.0,
      rest_after_set: "0 minutes 0 seconds",
      set_order:
        sets_of_exercise.value.length > 0
          ? sets_of_exercise.value[sets_of_exercise.value.length - 1]
              .set_order + 1
          : 1,
      type: "time",
      quantity: "0 minutes 30 seconds",
    };

    const result = await set_store.create_new_set(new_set);

    if (result) {
      sets_of_exercise.value = [
        ...(await set_store.find_all_sets_of_exercise(
          route.params.id_exercise
        )),
      ];
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/*Watchers */

/*Watcher updates the assigned muscle groups of the exercise as appropiate */
watch(muscle_groups_of_exercise, (new_muscle_group, old_muscle_group) => {
  try {
    if (old_muscle_group && new_muscle_group.length > old_muscle_group.length) {
      const assignment = {
        id_exercise: route.params.id_exercise,
        id_muscle_group:
          new_muscle_group[new_muscle_group.length - 1].id_muscle_group,
      };

      muscle_group_store.assign_muscle_group_to_exercise(assignment);
    } else if (old_muscle_group) {
      let new_array = [];

      let old_array = [];

      new_muscle_group.forEach((muscle_group) => {
        new_array.push(muscle_group.id_muscle_group);
      });

      old_muscle_group.forEach((muscle_group) => {
        old_array.push(muscle_group.id_muscle_group);
      });

      old_array.forEach(async (id) => {
        if (!new_array.includes(id)) {
          muscle_group_store.unassigned_muscle_group_from_exercise(
            id,
            route.params.id_exercise
          );
        }
      });
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
});

/*Lifehooks */
/*Gets and set certain data of the exercise before view is mounted */
onBeforeMount(async () => {
  try {
    photos_of_exercise.value = [
      ...(await photo_exercise_store.find_all_photos_of_exercise(
        route.params.id_exercise
      )),
    ];

    sets_of_exercise.value = [
      ...(await set_store.find_all_sets_of_exercise(route.params.id_exercise)),
    ];

    exercise_info.value = {
      ...(await exercise_store.find_specific_exercise(
        route.params.id_exercise
      )),
    };

    rest_time.value = { ...exercise_info.value.time_after_exercise };

    fix_rest_time();

    exercise_info.value.created_at =
      exercise_info.value.created_at.split("T")[0];

    muscle_groups_of_exercise.value = [
      ...(await muscle_group_store.find_muscle_groups_of_exercise(
        route.params.id_exercise
      )),
    ];

    muscle_groups_available.value = [
      ...(await muscle_group_store.find_all_muscle_groups()),
    ];

    routines_of_exercise.value = [
      ...(await routine_store.find_routines_of_exercise(
        route.params.id_exercise
      )),
    ];
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
});
</script>

<style scoped lang="scss">
//Specific exercise section styles
.exercise-section {
  //Position
  position: relative;

  //Sizing and spacing
  min-height: 100vh;
  width: 100%;
  height: auto;
  padding: 70px 35px;
  max-width: 810px;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Font
  font-family: $primary-font;

  //Display
  gap: 20px;

  //Specific exercise section first part
  &__first-part {
    gap: 10px;
    //Specific exercise section first part title
    &__title {
      width: 100%;
      h2 {
        font-size: 25px;
      }
      .v-icon {
        font-size: 20px;
      }
    }
    //Specific exercise section chips info
    &__chips-info {
      //Display
      gap: 10px;
      flex-wrap: wrap;
    }
  }

  //Specific exercise section description
  &__description {
    gap: 5px;
    &__title {
      gap: 10px;
      .v-icon {
        font-size: 13px;
      }
    }
    //Specific exercise section text
    &__text {
      //Font
      font-size: 13px;
      font-weight: 200;
    }
  }

  //Specific exercise section options
  &__options {
    //Width
    width: 100%;

    //Display
    display: grid;
    gap: 10px;
    grid-row: 100%;
    grid-template-columns: 1fr 1fr;
  }

  //Specific exercise section gallery
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

  //Specific exercise section routines
  &__routines {
    width: 100%;
    gap: 10px;
  }

  //Specific exercise section rest time
  &__rest-time {
    width: 100%;
    gap: 15px;

    //Specific exercise section rest time inputs
    .exercise-section_rest-time__inputs {
      width: 300px;
      gap: 10px;
      span {
        gap: 10px;
      }
    }
  }

  //Specific exercise section sets
  &__sets {
    gap: 10px;
    .v-list {
      gap: 10px;
      overflow: hidden;
      padding: 0 20px;
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

  //Create buttons style
  &__create-buttons {
    //Display
    gap: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  
}

//Paragraph style
p {
  font-size: 17px;
  font-weight: 500;
}

//Is favorite and is not favorite style
.is_favorite,
.is_not_favorite {
  position: absolute;
  top: 20px;
  right: 20px;
}

//Media queries
@media only screen and (min-width: 480px) {
  //Exercise section styles
  .exercise-section {
    //Width
    width: 100%;
    max-width: 768px;
  }
}

//Media queries
@media only screen and (min-width: 768px) {
  //Exercise section styles
  .exercise-section {
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
</style>
