<template>
  <section class="d-flex justify-center home_section">
    <v-card
      color="background"
      rounded="0"
      class="d-flex align-center flex-column"
    >
      <!-- Home section title -->
      <v-card-title>
        <h1 class="text-center d-flex align-center justify-center">MyR<img
            :src="logo"
            alt="Logo de MyRoutineApp"
          />utineApp</h1>
      </v-card-title>
      <!-- Home section toggle -->
      <v-card-subtitle class="d-flex justify-center">
        <ButtonToggleComponent
          v-model="current_view"
          :button_toggle_options="['Sign in', 'Sign up']"
          :button_toggle_has_only_icons="false"
          :button_toggle_button_height="50"
          :button_toggle_button_width="100"
        />
      </v-card-subtitle>
      <!-- Home section views -->
      <v-card-text class="d-flex align-center flex-column">
        <LoginView v-if="current_view === 'Sign in'" />
        <RegisterView v-else />
      </v-card-text>
    </v-card>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount } from "vue";
import ButtonToggleComponent from "@/components/ButtonToggleComponent.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { useUserStore } from "../stores/user_store";
import { useTheme } from "vuetify";
import { useRoute } from "vue-router";
import VueCookies from "vue-cookies";
import router from "../router";
import logo from '../assets/logo-my-routine-app.png'
//Variables

const current_view = ref("Sign in");

const route = useRoute();

//Methods
/*Function that gets the current theme */
async function get_theme() {
  const theme = useTheme();

  const user_store = useUserStore();

  try {
    if (
      (!localStorage.getItem("current_user_info") &&
        VueCookies.isKey("is_logged_in")) ||
      (!localStorage.getItem("current_user_info") &&
        VueCookies.isKey("is_logged_in") &&
        !VueCookies.get("is_logged_in"))
    ) {
      theme.global.name.value = "light";
    } else if (
      !localStorage.getItem("current_user_info") &&
      VueCookies.isKey("is_logged_in") &&
      VueCookies.get("is_logged_in")
    ) {
      const user = await user_store.get_current_user();

      localStorage.setItem("current_user_info", JSON.stringify(user));

      theme.global.name.value = user.theme;
    } else {
      const user = JSON.parse(localStorage.getItem("current_user_info"));

      theme.global.name.value = user.theme;
    }
  } catch (error) {
    theme.global.name.value = "light";
  }
}

//Lifehooks


//Lifehook that set the current theme before view render
onBeforeMount(async () => {
  if (route.query.google_redirect) {
    VueCookies.set("_is_logged_in", true);

    router.push({ name: "Dashboard" });
  } else {
    await get_theme();
  }
});
</script>

<style scoped lang="scss">
//Home view styles
.home_section {
  //Sizing
  height: auto;
  width: 100%;
  max-width: 600px;

  //Color
  background-color: rgb(var(--v-theme-background_color));

  //Main section
  .v-card {
    //Sizing and spacing
    width: 100%;
    height: 100%;
    padding: 65px 40px 110px 40px;

    //Color
    color: rgb(var(--v-theme-text));

    .v-card-title{
      img{
        width: 25px;
      }
    }

    //Home view subtitle
    .v-card-subtitle {
      //Sizing and margination
      width: 100%;
      margin-top: 30px;
    }
    //Login o register view container
    .v-card-text {
      //Sizing
      width: 100%;
      height: 100%;
    }
  }
}
</style>
