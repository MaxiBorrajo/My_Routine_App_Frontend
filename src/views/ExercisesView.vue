<template>
  <section class="exercise_section">
    <!-- Exercises filter and sort by part -->
    <div class="exercise_section__selects d-flex justify-end align-center">
      <ButtonComponent
        button-variant="text"
        button-type="text"
        button-append-icon="fa-solid fa-caret-down"
        button-label="filter & sorting"
        id="filter_exercise_menu_activator"
        class="filter__button"
      />
    </div>
    <!-- Filter and sort by menu -->
    <v-menu
      activator="#filter_exercise_menu_activator"
      location="bottom"
      :close-on-content-click="false"
    >
      <v-list base-color="text" bg-color="card" min-width="300">
        <v-list-subheader>OPTIONS</v-list-subheader>
        <!-- Clear all option -->
        <v-list-item>
          <ButtonComponent
            button-variant="plain"
            button-type="text"
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
      <!-- Create exercise button -->
      <ButtonComponent
        button-variant="outlined"
        button-type="text"
        button-prepend-icon="fa-solid fa-plus"
        button-label="create new exercise"
        id="create_exercise_button"
        button-color="text"
        :button-route="{ name: 'CreateExercise' }"
      />
      <!-- Error Component -->
      <ErrorComponent v-if="error" :error_component_message="error" />
      <!-- Exercise card component -->
      <ExerciseCardComponent
        v-if="paginated_exercises().length > 0"
        v-for="exercise in paginated_exercises()"
        :exercise_card_data="exercise"
        :exercise_card_current_page="current_page"
        :exercise_card_change_occurred="send_change_occurred"
      />
      <h2 v-else id="no_exercises_found" class="text-center">
        No exercise was found
      </h2>
      <PaginationComponent
        v-model="current_page"
        :pagination_total_amount="exercises.length"
        :pagination_amount_per_page="3"
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
import ButtonComponent from "@/components/ButtonComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import ExerciseCardComponent from "@/components/ExerciseCardComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";

//Variables

const props = defineProps({
  main_dashboard_error: String,
});

const error = ref(props.main_dashboard_error);

const exercise_store = useExerciseStore();

const muscle_group_store = useMuscleGroupStore();

const exercises = ref([]);

const current_page = ref(1);

const send_change_occurred = ref(false);

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

/*Function that paginates the exercises */
function paginated_exercises() {
  const start_index = (current_page.value - 1) * 3;

  const end_index = start_index + 3;

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
  try {
    send_change_occurred.value = false;

    const exercises_of_user = await exercise_store.find_exercises(
      selected_sort_by.value,
      select_order.value,
      selected_filter.value,
      selected_filter_values.value
    );

    exercises.value = [];

    exercises_of_user.resource.forEach((exercise) => {
      exercises.value.push(exercise);
    });

    send_change_occurred.value = true;
  } catch (err) {
    error.value = err.response.data.resource.message;
  }
}

/*Function that clears that filters and sorting choosen if there is any*/
function clear_all_filter_and_sorting() {
  selected_sort_by.value = null;

  select_order.value = null;

  selected_filter.value = null;

  selected_filter_values.value = [];

  applied_filters_and_sorting();
}

/*Watchers*/

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
  try {
    const muscle_groups = await muscle_group_store.find_all_muscle_groups();

    muscle_groups.resource.forEach((day) => {
      muscle_groups_available.value.push({
        title: day.name_muscle_group,
        value: day.id_muscle_group,
      });
    });

    const exercises_of_user = await exercise_store.find_exercises();

    exercises_of_user.resource.forEach((exercise) => {
      exercises.value.push(exercise);
    });
  } catch (err) {
    error.value = err.response.data.resource.message;
  }
});
</script>

<style scoped lang="scss">
//Exercise view styles
.exercise_section {
  //Position
  position: relative;

  //Sizing and spacing
  min-height: calc(100vh - 48px);
  width: 100%;
  padding: 0 0 80px 0;

  //Font
  font-family: $primary-font;

  //Selects styles
  .exercise_section__selects {
    color: rgb(var(--v-theme-text));
    padding: 10px 0;
  }

  //Exercises styles
  .exercise_section__exercises {
    //Sizing and spacing
    height: 100%;
    padding: 10px 20px;

    //Display
    gap: 30px;

    #no_exercises_found {
      padding: 20px;
      font-size: 45px;
      color: rgba($color: var(--v-theme-text), $alpha: 0.5);
    }

    #create_exercise_button {
      min-width: 300px;
      width: 100%;
    }
  }
  //Pagination style
  .pagination {
    //Position
    position: absolute;
    bottom: 0;
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

//Media queries
@media only screen and (min-width: 480px) {
  //Exercise view styles
  .exercise_section {
    .exercise_section__exercises {
      //Create exercise button
      #create_exercise_button {
        //Sizing and spacing
        padding: 20px 0;
        max-width: 480px;
      }
    }
  }
}
</style>
