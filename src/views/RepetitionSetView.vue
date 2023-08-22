<template>
  <section
    v-if="data_is_loaded"
    class="repetition-set-view-section text-center d-flex align-center justify-center flex-column"
  >
    <!-- Repetition set view -->
    <div
      class="d-flex align-center justify-center flex-column repetition-set-view-section__title"
    >
      <!-- Repetition set view title -->
      <h2 class="text-uppercase set">{{ exercise_name }}</h2>
      <h2 class="text-uppercase set">{{ current_set.set_order }} SET {{ current_set.weight }} {{ weight_unit }}</h2>
      <h2 class="text-uppercase set">
        {{ current_set.repetition }} Repetitions
      </h2>
    </div>
    <!-- Repetition set view actions -->
    <div
      class="repetition-set-view-section__actions d-flex align-center justify-center"
    >
      <!-- Repetition set view stop button -->
      <v-avatar color="text" size="50" @click="go_home">
        <v-tooltip text="Stop" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="fa-solid fa-stop"
              v-bind="props"
              class="action_button"
            >
            </v-icon>
          </template>
        </v-tooltip>
      </v-avatar>
      <!-- Repetition set view next exercise button -->
      <v-avatar color="text" size="50" @click="set_finished">
        <v-tooltip text="Finished? Next exercise" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              icon="fa-solid fa-forward"
              v-bind="props"
              class="action_button"
            >
            </v-icon>
          </template>
        </v-tooltip>
      </v-avatar>
    </div>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount,computed } from "vue";
import router from "../router/index";

//Variables
const props = defineProps({
  current_set: Object,
  exercise_name: String,
});

const emit = defineEmits(["set_finished"]);

const data_is_loaded = ref(false);

const weight_unit = computed(()=>{
  return JSON.parse(localStorage.getItem("current_user_info")).weight
})

//Methods
/*Function that emit an event indicating that the set has finished */
function set_finished() {
  emit("set_finished");
}

/*Function that goes to the home page */
function go_home() {
  router.push({ name: "Home" });
}

/*Lifehooks */

//Lifehooks that renders the view
onBeforeMount(() => {
  data_is_loaded.value = true;
});
</script>

<style scoped lang="scss">
//Repetition set view styles
.repetition-set-view-section {
  //Sizing
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-width: 668px;
  
  position: relative;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Display
  gap: 50px;

  //Repetition set view title styles

  &__title {
    width: 100%;
    height: 100%;
    h2 {
      font-size: 35px;
    }
    gap: 10px;
  }

  //Repetition set view actions styles
  &__actions {
    gap: 50px;
  }
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Repetition set view styles
  .repetition-set-view-section {
    padding: 200px 0 300px 0;
  }
}
</style>
