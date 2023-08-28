<template>
  <section class="reset_password_section d-flex justify-center align-center">
    <!-- Reset password view -->
    <v-card color="card" rounded="0" class="d-flex flex-column justify-center">
      <!-- Reset password view title -->
      <v-card-title class="text-center">
        <h1>Change password</h1>
      </v-card-title>
      <v-card-subtitle class="text-center">
        Please, enter a new password. If you have not requested this password
        change, please ignore this page and let us know by leaving your feedback
        <span id="feedback"
          ><router-link :to="{ name: 'Feedback' }">here</router-link></span
        >.
      </v-card-subtitle>
      <!-- Reset password view form -->
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="reset_password(reset_password_form)"
          class="d-flex flex-column"
        >
          <p v-if="error" class="error">{{ error }}</p>
          <InputComponent
            input_label="Password"
            :input_rules="[rules.required, rules.password]"
            v-model="reset_password_form.password"
            :input_append_inner_icon="
              show_password ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
            "
            @click:append-inner="show_password = !show_password"
            :input_type="show_password ? 'text' : 'password'"
          />
          <InputComponent
            input_label="Confirm password"
            :input_rules="[
              rules.required,
              rules.confirm_password(reset_password_form.password),
            ]"
          />
          <ButtonComponent button-label="Submit" button_type="submit" />
        </v-form>
      </v-card-text>
    </v-card>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_multiline="true"
      snackbar_text="Password changed successfully"
      :snackbar_has_action="true"
      snackbar_btn_label="Sign in"
      snackbar_btn_type="text"
      :snackbar_btn_action="
        () => {
          router.push({ name: 'Home' });
        }
      "
    />
  </section>
</template>

<script setup>
//Imports
import { ref } from "vue";
import { useUserStore } from "@/stores/user_store";
import { useRoute } from "vue-router";
import router from "../router";
import rules from "../utils/rules";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";

//Variables
const route = useRoute();

const reset_password_form = ref({
  password: null,
});

const user_store = useUserStore();

const error = ref(null);

const form = ref(null);

const open_snackbar = ref(false);

const show_password = ref(false);

/*Function that changes the user's password with the new one*/
async function reset_password(data_form) {
  try {
    const { valid } = await form.value.validate();

    if (valid) {
      open_snackbar.value = false;

      await user_store.reset_password(route.params.token, data_form);

      open_snackbar.value = true;
    }
  } catch (error) {
    error.value = err.response.data.resource.message;
  }
}
</script>

<style scoped lang="scss">
//Reset password view style
.reset_password_section {
  //Position
  position: relative;

  //Sizing
  min-height: 100vh;
  height: auto;
  width: 100%;
  width: 700px;

  .v-card {
    //Sizing and spacing
    min-height: 100%;
    width: 100%;
    padding: 50px 5px 45px 5px;

    //Color
    color: rgb(var(--v-theme-text));

    //Display
    gap: 20px;

    //Reset password subtitle
    .v-card-subtitle {
      white-space: normal;
    }

    //Reset password fomr
    .v-card-text {
      //Display
      flex: none !important;

      //Form
      .v-form {
        //Display
        gap: 10px;

        //Error
        .error {
          //Margin
          margin-bottom: 5px;
        }
      }
    }
  }
}

//Link to feedback view style
#feedback {
  //Link
  a {
    //Color
    color: rgb(var(--v-theme-text));

    //Text
    text-decoration: underline;
  }
}

//Media queries
@media only screen and (min-width: 480px) {
  //Reset password view style
  .reset_password_section {
    //Spacing
    padding: 150px 0;
    .v-card {
      //Sizing and spacing
      height: 100%;

      padding: 70px 15px;
    }
  }
}
</style>
