<template>
  <section
    class="finished-routine-section text-center d-flex flex-column align-center justify-center"
  >
    <!-- Finished routine view -->
    <div
      class="finished-routine-section__title d-flex align-center justify-center flex-column"
    >
      <!-- Error Component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Finished routine view title -->
      <span class="d-flex align-center justify-center"
        ><v-icon icon="fa-solid fa-flag-checkered"></v-icon>
        <h2 class="text-uppercase">finished</h2>
        <v-icon icon="fa-solid fa-flag-checkered"></v-icon>
      </span>
      <h2 class="text-uppercase">{{ routine_info.routine_name }}</h2>
    </div>
    <!-- Finished routine view home button -->
    <ButtonComponent
      button-label="Go to home"
      button-type="button"
      :button_width="250"
      :button_height="60"
      button-prepend-icon="fa-solid fa-house"
      @click="update_usage"
      class="home_button"
    />
  </section>
</template>

<script setup>
//Imports
import { ref } from "vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { useRoutineStore } from "../stores/routine_store";
import ErrorComponent from "@/components/ErrorComponent.vue";
import router from "../router";

//Variables

const routine_store = useRoutineStore();

const props = defineProps({
  routine_info: Object,
});

const error = ref({
  has_error: false,
  error_message: "",
});

//Methods
/*Function that updates the usage of a routine*/
function update_usage() {
  try {
    props.routine_info.usage_routine++;

    let result = routine_store.update_specific_routine(
      props.routine_info.id_routine,
      props.routine_info
    );

    if (result) {
      router.push({ name: "Dashboard" });
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}
</script>

<style scoped lang="scss">
//Finish routine section
.finished-routine-section {
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

  //Title
  &__title {
    //Sizing
    width: 100%;
    height: 100%;

    //Display
    gap: 30px;

    //Finished label styles
    span {
      gap: 30px;
      h2 {
        font-size: 45px;
      }
      .v-icon {
        font-size: 45px;
      }
    }

    h2 {
      font-size: 35px;
    }
  }
}

//Home button styles
.home_button {
  font-size: 20px;
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Finish routine section
  .finished-routine-section {
    padding: 200px 0;
  }
}
</style>
