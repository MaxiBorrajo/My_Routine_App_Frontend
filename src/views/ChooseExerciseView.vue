<template>
  <section class="exercise_section d-flex flex-column">
    <LoaderComponent v-model="show_loader" />
    <h2>Choose exercises</h2>
    <v-divider></v-divider>
    <!-- Back button -->
    <BackButtonComponent />
    <!-- Exercises filter and sort by part -->
    <div
      class="exercise_section__selects d-flex justify-space-between align-center"
    >
      <div class="d-flex exercise_section__buttons align-center">
        <!-- Add exercises button -->
        <ButtonComponent
          button-variant="outlined"
          button-type="button"
          button-prepend-icon="fa-solid fa-list"
          button-label="add exercises"
          button-color="attention"
          @click="add_exercises"
        />
        <!-- Reset all button -->
        <span class="d-flex align-center justify-center checks">
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
          <!-- Select all button -->
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
      </div>
      <!-- Filter button -->
      <ButtonComponent
        button-variant="text"
        button-type="button"
        button-append-icon="fa-solid fa-caret-down"
        button-label="filter & sorting"
        id="filter_exercise_menu_activator"
        class="filter__button"
      />
    </div>
    <!-- Filter and sort by menu -->
    <v-menu
      activator="#filter_exercise_menu_activator"
      location="start"
      :close-on-content-click="false"
      class="menu"
    >
      <v-list base-color="text" bg-color="card" min-width="300">
        <v-list-subheader>OPTIONS</v-list-subheader>
        <!-- Clear all option -->
        <v-list-item>
          <ButtonComponent
            button-variant="plain"
            button-type="button"
            button-prepend-icon="fa-solid fa-trash"
            button-label="clear all"
            @click="clear_all_filter_and_sorting"
          />
        </v-list-item>
        <!-- Options -->
        <v-list-item>
          <v-select
            :items="sort_by_options"
            item-title="sort_by"
            item-value="value"
            density="compact"
            label="Sort by"
            v-model="selected_sort_by"
            base-color="text"
            color="text"
            @click="select_order = null"
          ></v-select
        ></v-list-item>
        <v-list-item v-if="selected_sort_by">
          <v-select
            :items="order_options"
            density="compact"
            label="Order"
            v-if="selected_sort_by"
            item-title="order"
            item-value="value"
            v-model="select_order"
            base-color="text"
            color="text"
            @update:modelValue="applied_filters_and_sorting"
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-select
            :items="filter_options"
            item-title="filter"
            item-value="value"
            density="compact"
            label="Filter"
            v-model="selected_filter"
            base-color="text"
            color="text"
          ></v-select>
        </v-list-item>
        <v-list-item v-if="selected_filter">
          <v-select
            :items="return_filter_values(selected_filter)"
            item-title="title"
            item-value="value"
            density="compact"
            label="Filter values"
            v-if="selected_filter"
            :multiple="selected_filter === 'muscle_group'"
            v-model="selected_filter_values"
            base-color="text"
            color="text"
            @update:modelValue="applied_filters_and_sorting"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index < 1">
                <span>{{ item.title }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="text-grey text-caption align-self-center"
              >
                (+{{ selected_filter_values.length - 1 }} others)
              </span>
            </template>
          </v-select>
        </v-list-item>
      </v-list>
    </v-menu>
    <div class="exercise_section__exercises d-flex flex-column align-center">
      <!-- Error Component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Exercise card component -->
      <v-list
        base-color="text"
        bg-color="background_color"
        class="d-flex flex-column align-center"
        v-if="paginated_exercises().length > 0 && data_is_loaded"
      >
        <v-list-item
          v-for="exercise in paginated_exercises()"
          :key="exercise.id_exercise"
        >
          <ExerciseCardComponent :exercise_card_data="exercise" />
          <CheckboxComponent
            :checkbox_value="exercise"
            v-model="selected_exercises"
            class="exercise_checkbox"
          />
        </v-list-item>
      </v-list>
      <!-- No exercise found text -->
      <h2
        v-else-if="paginated_exercises().length === 0 && data_is_loaded"
        id="no_exercises_found"
        class="text-center"
      >
        No exercise was found
      </h2>
      <PaginationComponent
        v-model="current_page"
        :pagination_total_amount="exercises.length"
        :pagination_amount_per_page="5"
        class="pagination"
      />
    </div>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, watch } from "vue";
import { useMuscleGroupStore } from "../stores/muscle_group_store";
import { useExerciseStore } from "../stores/exercise_store";
import { useRoute } from "vue-router";
import ButtonComponent from "@/components/ButtonComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ExerciseCardComponent from "@/components/ExerciseCardComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import BackButtonComponent from "@/components/BackButtonComponent.vue";
import CheckboxComponent from "@/components/CheckboxComponent.vue";
import router from "../router";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables

const error = ref({
  has_error: false,
  error_message: "",
});

const show_loader = ref(false);

const route = useRoute();

const exercise_store = useExerciseStore();

const muscle_group_store = useMuscleGroupStore();

const exercises = ref([]);

const selected_exercises = ref([]);

const data_is_loaded = ref(false);

const current_page = ref(1);

const sort_by_options = ref([
  {
    sort_by: "Exercise name",
    value: "exercise_name",
  },
  {
    sort_by: "Intensity",
    value: "intensity",
  },
  {
    sort_by: "Date created",
    value: "created_at",
  },
]);

const order_options = ref([
  {
    order: "Ascendent",
    value: "ASC",
  },
  {
    order: "Descendent",
    value: "DESC",
  },
]);

const filter_options = ref([
  {
    filter: "Favorite exercises",
    value: "is_favorite",
  },
  {
    filter: "Muscle group",
    value: "muscle_group",
  },
  {
    filter: "Intensity",
    value: "intensity",
  },
]);

const muscle_groups_available = ref([]);

const selected_sort_by = ref(null);

const selected_filter = ref(null);

const select_order = ref(null);

const selected_filter_values = ref([]);

//Methods

/*Function that selects all exercises available*/
function select_all_exercises() {
  selected_exercises.value = [...exercises.value];
}

/*Function that paginates the exercises */
function paginated_exercises() {
  const start_index = (current_page.value - 1) * 5;

  const end_index = start_index + 5;

  return exercises.value.slice(start_index, end_index);
}

/*Function that selects the possible filter values depending of the filter choosed */
function return_filter_values(choosen_filter) {
  if (choosen_filter === "is_favorite") {
    const filter_values = [
      {
        title: "Favorite",
        value: [true],
      },
      {
        title: "Not favorite",
        value: [false],
      },
    ];

    return filter_values;
  } else if (choosen_filter === "muscle_group") {
    return muscle_groups_available.value;
  } else if (choosen_filter === "intensity") {
    const filter_values = [
      {
        title: "Low intensity",
        value: [1],
      },
      {
        title: "Mid intensity",
        value: [2],
      },
      {
        title: "High intensity",
        value: [3],
      },
    ];
    return filter_values;
  } else {
    return [];
  }
}

/*Function that applies the filters and sorting choosen if there is any */
async function applied_filters_and_sorting() {
  show_loader.value = true;

  try {
    exercises.value = [];

    if (route.query.id_routine) {
      exercises.value = [
        ...(await exercise_store.find_exercises_of_routine(
          route.query.id_routine,
          true,
          selected_sort_by.value,
          select_order.value,
          selected_filter.value,
          selected_filter_values.value
        )),
      ];
    } else {
      exercises.value = [
        ...(await exercise_store.find_exercises(
          selected_sort_by.value,
          select_order.value,
          selected_filter.value,
          selected_filter_values.value
        )),
      ];
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/*Function that clears that filters and sorting choosen if there is any*/
function clear_all_filter_and_sorting() {
  selected_sort_by.value = null;

  select_order.value = null;

  selected_filter.value = null;

  selected_filter_values.value = [];

  applied_filters_and_sorting();
}

/*Function that adds the selected exercises*/
function add_exercises() {
  exercise_store.selected_exercises = selected_exercises.value;

  router.go(-1);
}

//Watchers
/*Watcher that reset the selected order if sees a change in the selected sort by */
watch(selected_sort_by, () => {
  select_order.value = null;
});

/*Watcher that reset the selected filter values if sees a change in the selected filter */
watch(selected_filter, () => {
  selected_filter_values.value = [];
});

/*Lifehooks*/

/*Lifehook in charge of obtaining certain data 
    from the exercises before mounting the component 
    and enabling the view when the data is loaded */
onBeforeMount(async () => {
  show_loader.value = true;

  try {
    if (route.query.id_routine) {
      exercises.value = [
        ...(await exercise_store.find_exercises_of_routine(
          route.query.id_routine,
          true
        )),
      ];
    } else {
      exercises.value = [...(await exercise_store.find_exercises())];
    }

    const muscle_groups = await muscle_group_store.find_all_muscle_groups();

    muscle_groups.forEach((muscle_group) => {
      muscle_groups_available.value.push({
        title: muscle_group.name_muscle_group,
        value: muscle_group.id_muscle_group,
      });
    });

    selected_exercises.value = exercise_store.selected_exercises;

    data_is_loaded.value = true;
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;

    data_is_loaded.value = true;
  }

  show_loader.value = false;
});
</script>

<style scoped lang="scss">
//Exercise view styles
.exercise_section {
  //Position
  position: relative;

  //Sizing and spacing
  min-height: 100vh;
  height: auto;
  width: 100%;
  padding: 70px 35px;

  //Font
  font-family: $primary-font;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Display
  gap: 10px;

  //Selects styles
  .exercise_section__selects {
    color: rgb(var(--v-theme-text));
    padding: 10px 0;
  }

  //Exercise buttons styles
  &__buttons {
    //Sizing
    width: 100%;

    //Display
    gap: 10px;
    flex-wrap: wrap;
  }

  //Exercises styles
  &__exercises {
    //Sizing
    width: 100%;

    padding: 0 0 30px 0;

    //Display
    gap: 10px;

    //No exercises found text style
    #no_exercises_found {
      //Spacing
      padding: 20px;

      //Font
      font-size: 45px;

      //Color
      color: rgba($color: var(--v-theme-text), $alpha: 0.5);
    }

    //Create exercise button style
    #create_exercise_button {
      //Width
      min-width: 300px;
      width: 100%;
    }

    //Exercises style
    .v-list {
      //Sizing
      width: 100%;

      //Display
      gap: 10px;
      .v-list-item {
        //Sizing and spacing
        width: 100%;
        max-width: 535px;
        padding-right: 40px;

        //Position
        position: relative;

        //Exercises checkbox
        .exercise_checkbox {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
    }
  }
  //Pagination style
  .pagination {
    //Position
    position: absolute;
    bottom: 2%;
    left: 50%;
    right: 50%;
  }
}

//Filter button style
.filter__button {
  font-size: 12px !important;
}

//Menu subheader style
.v-list-subheader {
  color: rgb(var(--v-theme-text)) !important;
}

//Selects checks
.checks {
  gap: 5px;
}
</style>
