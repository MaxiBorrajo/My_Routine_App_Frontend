<template>
  <section class="routine_section">
    <LoaderComponent v-model="show_loader" />
    <!-- Routines filter and sort by part -->
    <div class="routine_section__selects d-flex justify-end align-center">
      <ButtonComponent
        button-variant="text"
        button-type="button"
        button-append-icon="fa-solid fa-caret-down"
        button-label="filter & sorting"
        id="filter_routines_menu_activator"
        class="filter__button"
      />
    </div>
    <!-- Filter and sort by menu -->
    <v-menu
      activator="#filter_routines_menu_activator"
      location="bottom"
      :close-on-content-click="false"
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
          <!-- Sort by -->
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
        <!-- Order -->
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
        <!-- Filter -->
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
        <!-- Filter values -->
        <v-list-item v-if="selected_filter">
          <v-select
            :items="return_filter_values(selected_filter)"
            item-title="title"
            item-value="value"
            density="compact"
            label="Filter values"
            v-if="selected_filter"
            :multiple="selected_filter === 'day'"
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
    <!-- All routines section -->
    <div class="routine_section__routines d-flex flex-column align-center">
      <!-- Create routine button -->
      <ButtonComponent
        button-variant="outlined"
        button-type="button"
        button-prepend-icon="fa-solid fa-plus"
        button-label="create new routine"
        id="create_routine_button"
        button-color="text"
        :button-route="{ name: 'CreateRoutine' }"
      />
      <!-- Error Component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Routine card component -->
      <RoutineCardComponent
        v-if="paginated_routines().length > 0"
        v-for="routine in paginated_routines()"
        :key="routine.id_routine"
        :routine_card_data="routine"
      />
      <h2 v-else id="no_routines_found" class="text-center">
        No routine was found
      </h2>
    </div>
    <!-- Pagination component -->
    <PaginationComponent
      v-model="current_page"
      :pagination_total_amount="routines.length"
      :pagination_amount_per_page="3"
      class="pagination"
    />
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, watch } from "vue";
import { useDayStore } from "../stores/day_store";
import { useRoutineStore } from "../stores/routine_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import RoutineCardComponent from "@/components/RoutineCardComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables

const props = defineProps({
  main_dashboard_error: Object,
});

const error = ref({
  has_error: props.main_dashboard_error.has_error,
  error_message: props.main_dashboard_error.error_message,
});

const show_loader = ref(false)

const routine_store = useRoutineStore();

const day_store = useDayStore();

const routines = ref([]);

const current_page = ref(1);

const sort_by_options = ref([
  {
    sort_by: "Routine name",
    value: "routine_name",
  },
  {
    sort_by: "Usage",
    value: "usage_routine",
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
    filter: "Favorite routines",
    value: "is_favorite",
  },
  {
    filter: "Weekday",
    value: "day",
  },
]);

const days_available = ref([]);

const selected_sort_by = ref(null);

const selected_filter = ref(null);

const select_order = ref(null);

const selected_filter_values = ref([]);

//Methods

/*Function that paginates the routines */
function paginated_routines() {
  const start_index = (current_page.value - 1) * 3;

  const end_index = start_index + 3;

  return routines.value.slice(start_index, end_index);
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
  } else if (choosen_filter === "day") {
    return days_available.value;
  } else {
    return [];
  }
}

/*Function that applies the filters and sorting choosen if there is any */
async function applied_filters_and_sorting() {
  show_loader.value = true;

  try {
    routines.value = [
      ...(await routine_store.find_routines(
        selected_sort_by.value,
        select_order.value,
        selected_filter.value,
        selected_filter_values.value
      )),
    ];
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
from the routines before mounting the component
and enabling the view when the data is loaded */
onBeforeMount(async () => {
  show_loader.value = true;

  try {
    routines.value = [...(await routine_store.find_routines())];

    const days = await day_store.find_all_days();

    days.forEach((day) => {
      days_available.value.push({
        title: day.name_day,
        value: day.id_day,
      });
    });
    
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
});
</script>

<style scoped lang="scss">
//Routine view styles
.routine_section {
  //Position
  position: relative;

  //Sizing and spacing
  min-height: calc(100vh - 48px);
  width: 100%;
  padding: 0 0 80px 0;

  //Font
  font-family: $primary-font;

  //Selects styles
  .routine_section__selects {
    color: rgb(var(--v-theme-text));
    padding: 10px 0;
  }

  //Routines styles
  .routine_section__routines {
    //Sizing and spacing
    height: 100%;
    padding: 10px 20px;

    //Display
    gap: 30px;

    //No routines found label style
    #no_routines_found {
      //Spacing
      padding: 20px;

      //Font
      font-size: 45px;

      //Color
      color: rgba($color: var(--v-theme-text), $alpha: 0.5);
    }

    //Create routine button style
    #create_routine_button {
      //Sizing
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
  //Routine view styles
  .routine_section {
    .routine_section__routines {
      //Create routine button
      #create_routine_button {
        //Sizing and spacing
        padding: 20px 0;
        max-width: 480px;
      }
    }
  }
}
</style>
