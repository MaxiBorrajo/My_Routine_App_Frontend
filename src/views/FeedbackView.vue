<template>
  <section class="feedback_section d-flex justify-center align-center">
    <!-- Back button -->
    <BackButtonComponent />
    <!-- Main section -->
    <v-card color="card" rounded="0" class="d-flex flex-column justify-center">
      <!-- Main section title -->
      <v-card-title class="text-center">
        <h1>Feedback</h1>
      </v-card-title>
      <!-- Main section subtitle -->
      <v-card-subtitle class="text-center">
        We greatly value your feedback. If you have found any problem or want to
        share your opinion about the application, please do not hesitate to
        contact us.
      </v-card-subtitle>
      <!-- Feedback form -->
      <v-card-text>
        <v-form
          ref="form"
          @submit.prevent="send_feedback(feedback_form)"
          class="d-flex flex-column"
        >
          <!-- Error component -->
          <!-- Error Component -->
          <ErrorComponent
            v-if="error.has_error"
            :error_component_message="error.error_message"
            class="error"
          />
          <!-- Form area -->
          <TextareaComponent
            :input_clearable="true"
            input_label="Comments and suggestions:"
            :input_auto_grow="true"
            :input_rules="[rules.required]"
            v-model="feedback_form.comment"
          />
          <ButtonComponent button-label="Submit" button-type="submit" />
        </v-form>
      </v-card-text>
    </v-card>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_timeout="3000"
      :snackbar_multiline="true"
      snackbar_text="Feedback sent successfully"
    />
  </section>
</template>

<script setup>
//Imports
import { ref } from "vue";
import rules from "../utils/rules";
import { useUserStore } from "../stores/user_store";
import ButtonComponent from "@/components/ButtonComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import BackButtonComponent from "@/components/BackButtonComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";

//Variables
const form = ref(null);

const feedback_form = ref({
  comment: null,
});

const user_store = useUserStore();

const error = ref({
  has_error: false,
  error_message: "",
});

const open_snackbar = ref(false);

//Methods

/*Function that sends the feedback of the user */
async function send_feedback(data_form) {
  try {
    const { valid } = await form.value.validate();

    if (valid) {
      open_snackbar.value = false;

      await user_store.send_feedback(data_form);

      open_snackbar.value = true;
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }
}
</script>

<style scoped lang="scss">
//Feedback view styles
.feedback_section {
  //Position
  position: relative;

  //Sizing
  min-height: 100vh;
  height: auto;
  width: 100%;
  //Main section styles
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

    //Feedback form
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
  //Feedback view styles
  .feedback_section {
    //Spacing
    padding: 70px 0;

    //Main section style
    .v-card {
      //Spacing and sizing
      height: 100%;
      padding: 50px 10px;
      width: 550px;
    }
  }
}

@media only screen and (min-width: 768px) {
  //Feedback view styles
  .feedback_section {
    //Spacing
    padding: 100px 0;
  }
}

@media only screen and (min-width: 1024px) {
  //Feedback view styles
  .feedback_section {
    //Spacing
    padding: 150px 0;
  }
}

@media only screen and (min-width: 1280px) {
  //Feedback view styles
  .feedback_section {
    //Spacing
    padding: 100px 0;

    //Main section style
    .v-card {
      //Spacing and sizing
      height: 100%;
      padding: 50px 20px;
      width: 50%;
    }
  }
}
</style>
