<template>
  <section class="error_section">
    <!-- Error section title -->
    <div
      class="error_section__title d-flex flex-column text-center align-center justify-center"
    >
      <span id="error_404"
        >4<v-icon icon="fa-solid fa-dumbbell"></v-icon>4</span
      >
      <p id="error_section__subtitle">Page not found...</p>
    </div>
    <!-- Error section home button -->
    <div class="d-flex justify-center">
      <ButtonComponent
        button-label="go back home"
        button-type="button"
        button-prepend-icon="fa-solid fa-house"
        button-color="text"
        :button-route="{ name: 'Home' }"
        class="button_back_home"
      />
    </div>
  </section>
</template>

<script setup>
//Imports
import ButtonComponent from "@/components/ButtonComponent.vue";
</script>

<style scoped lang="scss">
//Error view style
.error_section {
  //Spacing
  width: 100%;
  min-height: 100vh;
  max-width: 600px;

  //Color
  color: rgb(var(--v-theme-text));
  background-color: rgb(var(--v-theme-background_color));

  //Display
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 80% 20%;
  padding: 50px;

  //Error title view style
  .error_section__title {
    //Display
    gap: 20px;

    //404 main panel style
    #error_404 {
      //Display
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 15px;

      //Font style
      font-size: 150px;
      line-height: 0.7;
      font-weight: 700;

      //Icon style
      .v-icon {
        //Font style
        font-size: 100px;
      }
    }
    //Error view subtitle
    #error_section__subtitle {
      //Font style
      font-size: 20px;
      font-weight: 300;
    }
  }

  //Button style
  .v-btn {
    //Spacing
    width: 200px;
  }
}
</style>
