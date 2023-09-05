<template>
  <!-- Rest set view -->
  <section
    class="set-rest-view-section text-center d-flex flex-column align-center justify-center"
  >
  <!-- Rest set view title -->
    <div
      class="d-flex align-center justify-center flex-column set-rest-view-section__title"
    >
      <h2>{{ set_order - 1 }} SET</h2>
      <h2 class="text-uppercase">rest</h2>
    </div>
    <!-- Rest set view countdown -->
    <CountdownComponent
      :countdown="set_rest"
      @countdown_finished="set_rest_finished"
    />
  </section>
</template>

<script setup>
//Imports
import CountdownComponent from "@/components/CountdownComponent.vue";

//Variables
const props = defineProps({
  set_rest: Object,
  set_order: Number,
});

const emit = defineEmits(["set_rest_finished"]);

//Methods
/*Function that emits an event that indicates that the set rest has finished*/
function set_rest_finished() {
  emit("set_rest_finished");
}

/*Lifehooks*/

</script>

<style scoped lang="scss">
.set-rest-view-section {
  //Sizing
  width: 100%;
  height: auto;
  min-height: 100vh;
  max-width: 668px;
  padding: 100px 0;
  
  position: relative;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Display
  gap: 50px;

  &__countdown {
    width: 100%;
    height: auto;
    .v-progress-circular {
      font-size: 60px;
    }
  }

  &__title {
    width: 100%;
    height: auto;
    gap: 10px;

    h2 {
      font-size: 35px;
    }
  }

  &__actions {
    width: 100%;
    height: auto;
    gap: 50px;
  }
}

@media only screen and (min-width: 1280px) {
  .set-rest-view-section {
    padding: 100px 0 200px 0;
  }
}
</style>
