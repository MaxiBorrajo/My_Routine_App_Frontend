<template>
  <section class="register_section">
    <v-form
      ref="form"
      @submit.prevent="register(register_form)"
      :class="
        error.has_error ? 'register_form_with_error' : 'register_form_without_error'
      "
    >
      <!-- Error component  -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Main register form -->
      <InputComponent
        input_label="Name"
        :input_rules="[rules.required]"
        v-model="register_form.name"
      />
      <InputComponent
        input_label="Last name"
        :input_rules="[rules.required]"
        v-model="register_form.last_name"
      />
      <InputComponent
        input_label="Email"
        :input_rules="[rules.required, rules.email]"
        v-model="register_form.email"
      />
      <InputComponent
        input_label="Password"
        :input_rules="[rules.required, rules.password]"
        v-model="register_form.password"
        :input_append_inner_icon="
          show_password ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
        "
        @click:append-inner="show_password = !show_password"
        :input_type="show_password ? 'text' : 'password'"
      />
      <InputComponent
        input_type="password"
        input_label="Confirm password"
        :input_rules="[
          rules.required,
          rules.confirm_password(register_form.password),
        ]"
      />
      <!-- Register form buttons -->
      <div class="register_buttons d-flex flex-column">
        <ButtonComponent
          button-label="Sign up"
          button-type="submit"
          button-prepend-icon="fa-solid fa-user-plus"
        />
        <ButtonComponent
          button-label="Sign up with google"
          button-type="button"
          :button-href="link_google"
          button-prepend-icon="fa-brands fa-google"
          button-color="#4185F4"
          class="google_button"
        />
      </div>
    </v-form>
    <LoaderComponent v-model="show_loader" />
  </section>
</template>

<script setup>
//Imports
import rules from "../utils/rules";
import { ref } from "vue";
import router from "../router/index";
import { useUserStore } from "../stores/user_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import VueCookies from "vue-cookies";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables
const form = ref(null);

const register_form = ref({
  name: null,
  last_name: null,
  email: null,
  password: null,
});

const user_store = useUserStore();

const show_password = ref(false);

const error = ref({
  has_error: false,
  error_message: "",
});

const link_google = import.meta.env.VITE_URL_GOOGLE;

const show_loader = ref(false);

//Methods

/*Function that allows user to create a new account */
async function register(data_form) {
  show_loader.value = true;

  const { valid } = await form.value.validate();

  if (valid) {
    try {
      const result = await user_store.register(data_form);

      localStorage.setItem("current_user_info", JSON.stringify(result));

      VueCookies.set("_is_logged_in", true);

      router.push({ name: "Profile" });
    } catch (err) {
      error.value = err.response.data.resource.message;
    }
  }

  show_loader.value = false;
}
</script>

<style scoped lang="scss">
//Register form
.register_section {
  //Sizing
  width: 100%;
  height: auto;

  //Color
  background-color: rgb(var(--v-theme-background_color)) !important;

  //Display
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;

  //Font
  font-family: $primary-font;

  //Register form withour error
  .register_form_without_error {
    //Sizing
    width: 100%;
    height: 100%;

    //Display
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr 2fr;
    grid-template-columns: 100%;
    gap: 10px;

    //Color
    background-color: rgb(var(--v-theme-background_color));

    //Margination
    margin-top: 30px;

    //Register form buttons style
    .register_buttons {
      grid-row: 6;
      gap: 15px;
    }
  }

  //Register form with error
  .register_form_with_error {
    //Sizing
    width: 100%;
    height: 100%;

    //Display
    display: grid;
    grid-template-rows: 0.4fr 1fr 1fr 1fr 1fr 1fr 2fr;
    grid-template-columns: 100%;
    gap: 10px;

    //Color
    background-color: rgb(var(--v-theme-background_color));

    //Margination
    margin-top: 15px;

    //Register form buttons style
    .register_buttons {
      grid-row: 7;
      gap: 15px;
    }
  }

  //Google button style
  .google_button {
    color: #ffffff;
  }

  //Error component style
  .error {
    grid-row: 1;
  }
}
</style>
