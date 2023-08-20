<template>
  <section class="dashboard_section">
    <!-- Dashboard section -->
    <div v-if="data_is_loaded">
      <div class="d-flex align-center justify-center dashboard_section__navbar">
        <!-- Dashboard section tabs -->
        <v-tabs v-model="tab" color="text" align-tabs="center">
          <v-tab :value="1">Routines</v-tab>
          <v-tab :value="2">Exercises</v-tab>
        </v-tabs>
        <!-- Dashboard section avatar -->
        <v-avatar
          :image="profile_photo"
          class="dashboard_section__navbar__menu_button"
          id="menu-activator"
        >
        </v-avatar>
        <!-- Dashboard section menu -->
        <v-menu activator="#menu-activator">
          <v-list base-color="text" bg-color="card">
            <v-list-subheader>ACCOUNT OPTIONS</v-list-subheader>
            <v-list-item
              prepend-icon="fa-solid fa-user"
              :to="{ name: 'Profile' }"
            >
              <v-list-item-title>PROFILE</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="fa-solid fa-comment"
              :to="{ name: 'Feedback' }"
              ><v-list-item-title>SEND FEEDBACK</v-list-item-title></v-list-item
            >
            <v-divider></v-divider>
            <v-list-item
              prepend-icon="fa-solid fa-right-from-bracket"
              @click="sign_out()"
              ><v-list-item-title>SIGN OUT</v-list-item-title></v-list-item
            >
          </v-list>
        </v-menu>
      </div>
      <!-- Dashboard section windows -->
      <v-window v-model="tab">
        <!-- Routines view -->
        <v-window-item :value="1">
          <RoutinesView :main_dashboard_error="error" />
        </v-window-item>
        <!-- Exercises view -->
        <v-window-item :value="2">
          <ExercisesView :main_dashboard_error="error" />
        </v-window-item>
      </v-window>
    </div>
    <!-- Loader component when data is not loaded yet -->
    <LoaderComponent v-else v-model="show_loader" />
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount, onBeforeUpdate } from "vue";
import { useTheme } from "vuetify";
import router from "../router";
import { useUserStore } from "../stores/user_store";
import { useExerciseStore } from "../stores/exercise_store";
import RoutinesView from "@/views/RoutinesView.vue";
import ExercisesView from "@/views/ExercisesView.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import VueCookies from "vue-cookies";

//Variables
const user_store = useUserStore();

const exercise_store = useExerciseStore();

const theme = useTheme();

const show_loader = ref(true);

const data_is_loaded = ref(false);

const profile_photo = ref("");

const error = ref(null);

const tab = ref(null);

//Methods

/*Function that gets data of the current user */
const get_user_data = async () => {
  data_is_loaded.value = false;

  show_loader.value = true;

  if (!localStorage.getItem("current_user_info")) {
    try {
      const user = await user_store.get_current_user();

      localStorage.setItem("current_user_info", JSON.stringify(user.resource));

      profile_photo.value = user.resource.url_profile_photo;

      theme.global.name.value = user.resource.theme;
    } catch (err) {
      show_loader.value = false;

      error.value = err.response.data.resource.message;
    }
  } else {
    const user = JSON.parse(localStorage.getItem("current_user_info"));

    profile_photo.value = user.url_profile_photo;

    theme.global.name.value = user.theme;
  }

  show_loader.value = false;

  data_is_loaded.value = true;
};

/*Function that allows user to sign out */
async function sign_out() {
  try {
    await user_store.logout();

    localStorage.clear();

    VueCookies.remove("_is_logged_in");

    router.push({ name: "Home" });
  } catch (err) {
    error.value = err.response.data.resource.message;
  }
}

//Watchers

/*Lifehooks */
onBeforeUpdate(async () => {
  await get_user_data();
});

/*Obtain user's information before mounting the component */
onBeforeMount(async () => {
  await get_user_data();

  exercise_store.selected_exercises = [];
});
</script>

<style scoped lang="scss">
//Main dashboard view style
.dashboard_section {
  //Sizing and spacing
  min-height: 100vh;

  width: 100%;
  height: auto;
  padding: 10px 0 50px 0;

  //Font
  font-family: $primary-font;

  //Color
  background-color: rgb(var(--v-theme-background_color)) !important;

  //Tab
  .v-tab {
    color: rgb(var(--v-theme-text));
  }

  //Navbar style
  .dashboard_section__navbar {
    //Sizing
    width: 100%;

    //Position
    position: relative;
    .dashboard_section__navbar__menu_button {
      //Position
      position: absolute;
      top: 7px;
      right: 7px;
    }
  }

  //Window style
  .v-window-item {
    //Margination
    margin-top: 15px;
  }
}

//Menu subheader style
.v-list-subheader {
  color: rgb(var(--v-theme-text)) !important;
}

//Media queries
@media only screen and (min-width: 768px) {
  //Main dashboard view style
  .dashboard_section {
    //Sizing
    max-width: 678px;
  }
}
</style>
