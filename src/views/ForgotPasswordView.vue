<template>
  <section class="forgot_password_section d-flex justify-center align-center">
    <!-- Back button -->
    <BackButtonComponent />

    <v-card color="card" rounded="0" class="d-flex flex-column justify-center">
      <!-- Forgot password section title -->
      <v-card-title class="text-center">
        <h1>Forgot password</h1>
      </v-card-title>
      <!-- Forgot password section subtitle -->
      <v-card-subtitle class="text-center">
        Please provide the email address associated with your account so we can
        send you a password reset email.
      </v-card-subtitle>
      <!-- Forgot password section form -->
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="forgot_password(forgot_password_form)"
          class="d-flex flex-column"
        >
          <p v-if="error" class="error">{{ error }}</p>

          <InputComponent
            input_label="Email"
            :input_rules="[rules.required, rules.email]"
            v-model="forgot_password_form.email"
          />
          <ButtonComponent button-label="Submit" button_type="submit" />
        </v-form>
      </v-card-text>
    </v-card>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_timeout="3000"
      :snackbar_multiline="true"
      snackbar_text="Email sent successfully"
    />
  </section>
</template>

<script setup>
//Imports
import { ref } from "vue";
import rules from "../utils/rules";
import { useUserStore } from "../stores/user_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import BackButtonComponent from "@/components/BackButtonComponent.vue";

//Variables

const forgot_password_form = ref({
  email: null,
});

const user_store = useUserStore();

const error = ref(null);

const form = ref(null);

const open_snackbar = ref(false);

//Methods

/*Function that sends an change password email to the one given by the user*/
async function forgot_password(data_form) {
  const { valid } = await form.value.validate();

  if (valid) {
    open_snackbar.value = false;

    const result = await user_store.forgot_password(data_form);

    if (result.success) {
      open_snackbar.value = true;
    } else {
      error.value = result.resource.message;
    }
  }
}
</script>

<style scoped lang="scss">
//Forgot password view styles
.forgot_password_section {
  //Position
  position: relative;
  //Sizing
  min-height: 100vh;
  height: auto;
  width: 100%;
  //Main section style
  .v-card {
    //Sizing and spacing
    height: 100%;
    width: 100%;
    padding: 20px 0 0 0;

    //Color
    color: rgb(var(--v-theme-text));

    //Display
    gap: 20px;

    //Main section subtitle
    .v-card-subtitle {
      //Font
      white-space: normal;
    }
    //Forgot password form
    .v-card-text {
      //Display
      flex: none !important;

      //Main form
      .v-form {
        //Display
        gap: 10px;
      }
    }
  }
}

//Media queries
@media only screen and (min-width: 480px) {
  //Forgot password view styles
  .forgot_password_section {
    //Spacing
    padding: 100px 0;

    //Main section style
    .v-card {
      //Spacing and sizing
      height: 100%;
      padding: 50px 10px;
      width: 480px;
    }
  }
}

//Media queries
@media only screen and (min-width: 1280px) {
  //Forgot password view styles
  .forgot_password_section {
    //Main section style
    .v-card {
      //Spacing
      height: 100%;
      padding: 50px 20px;
      width: 50%;
    }
  }
}
</style>
