<template>
  <section class="login_section">
    <v-form
      ref="form"
      @submit.prevent="login(login_form)"
      :class="error ? 'login_form_with_error' : 'login_form_without_error'"
    >
      <!-- Error component -->
      <ErrorComponent
        v-if="error"
        :error_component_message="error"
        class="error"
      />
      <!-- Main form -->
      <InputComponent
        input_label="Email"
        :input_rules="[rules.required]"
        v-model="login_form.email"
        class="email_field"
      />
      <InputComponent
        input_label="Password"
        :input_rules="[rules.required]"
        v-model="login_form.password"
        class="password_field"
        :input_append_inner_icon="
          show_password ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
        "
        @click:append-inner="show_password = !show_password"
        :input_type="show_password ? 'text' : 'password'"
      />
      <router-link :to="{ name: 'ForgotPassword' }" class="forgot_password_link"
        >Forgot password?</router-link
      >
      <div class="login_buttons d-flex flex-column">
        <ButtonComponent
          button-label="Sign in"
          button_type="submit"
          button-prepend-icon="fa-solid fa-right-to-bracket"
        />
        <ButtonComponent
          button-label="Sign in with google"
          button_type="text"
          button-href="http://localhost:3000/v1/user/google"
          button-prepend-icon="fa-brands fa-google"
          button-color="#4185F4"
          class="google_button"
        />
      </div>
    </v-form>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_timeout="3000"
      :snackbar_multiline="true"
      snackbar_text="You must first login"
    />
  </section>
</template>

<script setup>
//Import
import rules from "../utils/rules";
import { ref, onMounted } from "vue";
import router from "../router";
import { useUserStore } from "../stores/user_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import VueCookies from "vue-cookies";

//Variables
const form = ref(null);

const login_form = ref({
  email: null,
  password: null,
});

const user_store = useUserStore();

const show_password = ref(false);

const error = ref(null);

const open_snackbar = ref(false);

/*Function that allows to login*/
async function login(data_form) {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      await user_store.logout();
      
      const result = await user_store.login(data_form);

      localStorage.setItem(
        "current_user_info",
        JSON.stringify(result.resource)
      );

      VueCookies.set('_is_logged_in', true)

      router.push({ name: "Dashboard" });
    } catch (err) {
      error.value = err.response.data.resource.message;
    }
  }
}

//Lifehooks

/*Lifehook in charge of managing a not logged user error */
onMounted(() => {
  open_snackbar.value = user_store.not_logged_user_error;

  user_store.not_logged_user_error = false;
});
</script>

<style scoped lang="scss">
//Login view styles
.login_section {
  //Color
  background-color: rgb(var(--v-theme-background_color)) !important;

  //Sizing
  width: 100%;
  height: auto;

  //Display
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;

  //Font
  font-family: $primary-font;

  //Main form without error component
  .login_form_without_error {
    //Sizing
    width: 100%;
    height: 100%;

    //Display
    display: grid;
    grid-template-rows: 1fr 1fr 0.5fr 2fr;
    grid-template-columns: 100%;
    gap: 10px;

    //Color
    background-color: rgb(var(--v-theme-background_color));

    //Margination
    margin-top: 30px;

    //Fields styles
    .email_field {
      grid-row: 1;
    }

    .password_field {
      grid-row: 2;
    }
    .forgot_password_link {
      grid-row: 3;
      color: rgb(var(--v-theme-attention));
      font-size: 15px;
    }
    .login_buttons {
      grid-row: 4;
      gap: 15px;
    }
  }

  //Main form with error component
  .login_form_with_error {
    //Sizing
    width: 100%;
    height: 100%;

    //Display
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 0.6fr 2fr;
    grid-template-columns: 100%;
    gap: 10px;

    //Color
    background-color: rgb(var(--v-theme-background_color));

    //Margination
    margin-top: 10px;

    //Fields styles
    .error {
      grid-row: 1;
      margin-bottom: 5px;
    }
    .email_field {
      grid-row: 2;
    }

    .password_field {
      grid-row: 3;
    }
    .forgot_password_link {
      grid-row: 4;
      color: rgb(var(--v-theme-attention));
      font-size: 15px;
    }
    .login_buttons {
      grid-row: 5;
      gap: 15px;
    }
  }

  //Google button
  .google_button {
    color: #ffffff;
  }
}
</style>
