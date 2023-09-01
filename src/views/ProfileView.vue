<template>
  <section class="profile-section">
    <LoaderComponent v-model="show_loader" />
    <!-- Back button -->
    <BackButtonComponent />
    <div class="profile-section__main-content">
      <!-- Profile section title -->
      <h2 class="profile-section__main-content__title">Profile</h2>
      <v-divider></v-divider>
      <!-- Error component -->
      <ErrorComponent
        v-if="error.has_error"
        :error_component_message="error.error_message"
        class="error"
      />
      <!-- Profile section form -->
      <v-form
        ref="form"
        @submit.prevent="update_profile()"
        class="profile-section__main-content__form"
      >
        <!-- First part -->
        <div
          class="profile-section__main-content__form__first-part"
          v-if="user_info"
        >
          <!-- Change profile photo -->
          <v-avatar
            @mouseover="show_indicator = true"
            @mouseleave="show_indicator = false"
            @click="file_input.click()"
            size="200"
            class="profile-section__main-content__form__first-part__profile-photo"
          >
            <v-img :src="profile_photo" alt="Profile photo" cover></v-img>

            <v-icon
              v-if="show_indicator"
              class="change-indicator"
              icon="fa-solid fa-camera"
            ></v-icon>
          </v-avatar>
          <input
            ref="file_input"
            type="file"
            style="display: none"
            accept="image/*"
            @change="on_photo_profile_change"
          />
          <!-- Change username -->
          <div class="profile-section__main-content__form__field">
            <p>Username</p>
            <InputComponent
              :input_rules="[rules.required]"
              v-model="user_info.username"
            />
          </div>
        </div>
        <!-- First part loader -->
        <div class="profile-section__main-content__form__first-part" v-else>
          <v-skeleton-loader
            type="list-item-avatar"
            color="card"
          ></v-skeleton-loader>
        </div>
        <!-- Second part -->
        <div
          class="profile-section__main-content__form__second-part"
          v-if="user_info"
        >
          <!-- Change email -->
          <div class="profile-section__main-content__form__field">
            <p>Email</p>
            <InputComponent
              :input_rules="[rules.required, rules.email]"
              v-model="user_info.email"
            />
          </div>
          <!-- Change name -->
          <div class="profile-section__main-content__form__field">
            <p>Name</p>
            <InputComponent
              :input_rules="[rules.required]"
              v-model="user_info.name"
            />
          </div>
          <!-- Change last name -->
          <div class="profile-section__main-content__form__field">
            <p>Last name</p>
            <InputComponent
              :input_rules="[rules.required]"
              v-model="user_info.last_name"
            />
          </div>
          <!-- Change birthday -->
          <div class="profile-section__main-content__form__field">
            <p>Birthday</p>
            <InputComponent
              :input_rules="[rules.required]"
              v-model="user_info.date_birth"
              input_type="date"
            />
          </div>
          <!-- Change goal -->
          <div class="profile-section__main-content__form__field">
            <p>Goal</p>
            <TextareaComponent
              v-model="user_info.goal"
              :input_clearable="true"
              :input_auto_grow="true"
            />
          </div>
        </div>
        <!-- Second part loader -->
        <div
          class="profile-section__main-content__form__second-part-loader"
          v-else
        >
          <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
          <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
          <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
          <v-skeleton-loader type="heading" color="card"></v-skeleton-loader>
          <v-skeleton-loader
            type="image"
            color="card"
            class="goal"
          ></v-skeleton-loader>
        </div>
        <!-- Preferences -->
        <h2 class="profile-section__main-content__title">Preferences</h2>
        <v-divider></v-divider>
        <div
          class="profile-section__main-content__form__third-part"
          v-if="user_info"
        >
          <!-- Change experience -->
          <div class="profile-section__main-content__form__field">
            <p>Experience</p>
            <RadioButtonComponent
              :radio_group_values="['beginner', 'intermediate', 'experienced']"
              :radio_group_labels="['beginner', 'intermediate', 'experienced']"
              :radio_group_colors="['#009dff', '#e8e80e', '#ff0000']"
              v-model="user_info.experience"
            />
          </div>
          <!-- Change weight unit -->
          <div class="profile-section__main-content__form__field">
            <p>Weight unit</p>
            <ButtonToggleComponent
              v-model="user_info.weight"
              :button_toggle_options="['KG', 'LBS']"
              :button_toggle_icons="[
                'mdi mdi-weight-kilogram',
                'mdi mdi-weight-pound',
              ]"
            />
            <p class="clarification">
              *If you modify the unit of weight, the values will remain
              unchanged and won't be automatically converted to the new unit.
            </p>
          </div>
          <!-- Change theme -->
          <div class="profile-section__main-content__form__field">
            <p>Theme</p>
            <RadioButtonComponent
              :radio_group_labels="['light', 'dark', 'custom']"
              :radio_group_values="['light', 'dark', 'custom']"
              :radio_group_colors="['#1a1919', '#ffffff', '#ff0000']"
              v-model="user_info.theme"
            />
          </div>
          <!-- Change rating -->
          <div
            class="profile-section__main-content__form__field d-flex flex-column align-center"
            id="rating"
          >
            <p>Would you rate the app?</p>
            <RatingComponent
              v-model="user_info.rating"
              rating_color="text"
              rating_bg_color="text"
              :rating_clearable="true"
              :rating_hover="true"
              :rating_item_labels="['Terrible', '', '', '', 'Excellent']"
              rating_item_labels="top"
            />
          </div>
        </div>
        <!-- Preferences loader -->
        <div class="profile-section__main-content__form__third-part" v-else>
          <div class="profile-section__main-content__form__field">
            <p>Experience</p>
            <v-skeleton-loader
              type="list-item-three-line"
              color="card"
            ></v-skeleton-loader>
          </div>
          <div class="profile-section__main-content__form__field">
            <p>Weight unit</p>
            <v-skeleton-loader
              type="button, button"
              color="card"
            ></v-skeleton-loader>
          </div>
          <div class="profile-section__main-content__form__field">
            <p>Theme</p>
            <v-skeleton-loader
              type="list-item-three-line"
              color="card"
            ></v-skeleton-loader>
          </div>
          <div
            class="profile-section__main-content__form__field d-flex flex-column align-center"
            id="rating"
          >
            <p>Would you rate the app?</p>

            <v-skeleton-loader
              type="table-row"
              color="card"
            ></v-skeleton-loader>
          </div>
        </div>
        <div class="d-flex align-center justify-space-between profile_buttons">
          <ButtonComponent
            button-label="update profile"
            button-type="submit"
            id="submit-button"
          />
          <ButtonComponent
            button-type="button"
            button-prepend-icon="fa-solid fa-trash-can"
            button-label="delete account"
            class="delete_button"
            button-color="red"
            button-variant="outlined"
            @click="
              open_dialog(
                'Confirm delete',
                `Are you sure you want to delete your account?`,
                delete_account
              )
            "
          />
        </div>
      </v-form>
    </div>
    <!-- Snackbar component -->
    <SnackbarComponent
      v-model="open_snackbar"
      :snackbar_timeout="5000"
      :snackbar_multiline="true"
      snackbar_text="Profile updated successfully"
    />
    <!-- Dialog component -->
    <v-dialog
      v-model="dialog.show_dialog"
      persistent
      width="auto"
      scroll-strategy="none"
    >
      <DialogComponent
        :dialog_title="dialog.dialog_title"
        :dialog_text="dialog.dialog_text"
        :dialog_yes_button="dialog.dialog_action"
        :dialog_no_button="
          () => {
            dialog.show_dialog = false;
          }
        "
      />
    </v-dialog>
  </section>
</template>

<script setup>
//Imports
import { ref, onBeforeMount } from "vue";
import { useUserStore } from "../stores/user_store";
import rules from "../utils/rules";
import router from "../router";
import BackButtonComponent from "@/components/BackButtonComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import InputComponent from "@/components/InputComponent.vue";
import ButtonToggleComponent from "@/components/ButtonToggleComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import RadioButtonComponent from "@/components/RadioButtonComponent.vue";
import RatingComponent from "@/components/RatingComponent.vue";
import SnackbarComponent from "@/components/SnackbarComponent.vue";
import TextareaComponent from "@/components/TextareaComponent.vue";
import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";
import DialogComponent from "@/components/DialogComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";

//Variables
const user_info = ref(null);

const new_user_info = ref(new FormData());

const user_store = useUserStore();

const error = ref({
  has_error: false,
  error_message: "",
});

const form = ref(null);

const file_input = ref(null);

const profile_photo = ref("");

const open_snackbar = ref(false);

const show_indicator = ref(false);

const show_loader = ref(false)

const dialog = ref({
  show_dialog: false,
  dialog_title: "",
  dialog_text: "",
  dialog_action: null,
});

//Methods

/**
 * Function that allows the user to change his profile photo
 * @param {Event} event - Event captured on trying to change profile photo
 */
function on_photo_profile_change(event) {
  const file = event.target.files[0];

  const reader = new FileReader();

  reader.onload = (e) => {
    new_user_info.value = new FormData();

    new_user_info.value.append("image", file);

    profile_photo.value = e.target.result;
  };
  reader.readAsDataURL(file);
}

/*Function that updates the current user's information*/
async function update_profile() {
  show_loader.value = true;

  const { valid } = await form.value.validate();

  if (valid) {
    try {

      open_snackbar.value = false;

      Object.entries(user_info.value).forEach(([key, value]) => {
        new_user_info.value.append(key, value);
      });

      new_user_info.value.delete("url_profile_photo");

      new_user_info.value.delete("public_id_profile_photo");

      await user_store.update_current_user(new_user_info.value);

      localStorage.clear();

      new_user_info.value = new FormData();

      show_loader.value = false;

      open_snackbar.value = true;
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;

      show_loader.value = false;
    }
  }

  
}

/*Function that deletes current account */
async function delete_account() {
  show_loader.value = true;

  try {
    const result = await user_store.delete_user();

    if (result) {
      dialog.value.show_dialog = false;

      localStorage.clear();

      router.push({ name: "Home" });
    }
  } catch (err) {
    error.value.has_error = true;

    error.value.error_message = err.response.data.resource.message;
  }

  show_loader.value = false;
}

/**
 * Function that opens a dialog
 * @param {Function} dialog_action - Function that dialog will execute is yes button is clicked
 * @param {String} dialog_text - Dialog's text to show
 * @param {String} dialog_title - Dialog's title to show
 */
function open_dialog(dialog_title, dialog_text, dialog_action) {
  dialog.value.dialog_title = dialog_title;

  dialog.value.dialog_text = dialog_text;

  dialog.value.dialog_action = dialog_action;

  dialog.value.show_dialog = true;
}

/*Lifehooks */
/*Get user's info view is mounted */
onBeforeMount(async () => {
  show_loader.value = true;

  if (localStorage.getItem("current_user_info")) {
    user_info.value = JSON.parse(localStorage.getItem("current_user_info"));
  } else {
    try {
      user_info.value = { ...(await user_store.get_current_user()) };
    } catch (err) {
      error.value.has_error = true;

      error.value.error_message = err.response.data.resource.message;
    }
  }
  profile_photo.value = user_info.value.url_profile_photo;

  user_info.value.date_birth = user_info.value.date_birth.split("T")[0];

  show_loader.value = false;
});
</script>

<style scoped lang="scss">
//Skeleton loader style
.v-skeleton-loader {
  margin-bottom: 10px;
}

//Profile section styles
.profile-section {
  //Sizing and spacing
  min-height: 100vh;
  width: 100%;
  height: auto;

  //Color
  background-color: rgb(var(--v-theme-background_color));
  color: rgb(var(--v-theme-text));

  //Font
  font-family: $primary-font;

  //Main content styles
  &__main-content {
    //Sizing and spacing
    width: 100%;
    height: 100%;
    padding: 70px 35px;

    //Main content title
    &__title {
      //Font
      font-size: 30px;
      font-weight: 500;

      //Spacing
      padding-bottom: 5px;
    }

    //Main content form
    &__form {
      //Sizing
      height: 100%;
      width: 100%;

      //Spacing
      padding-top: 20px;
      &__field {
        //Sizing
        width: 100%;

        //Text style
        p {
          //Font
          font-size: 17px;
          font-weight: 500;

          //Spacing
          padding-bottom: 10px;
        }
        //Input
        .v-text-field {
          //Sizing
          width: 100%;
        }
      }

      //Main content first part
      &__first-part {
        //Display
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;

        //Main content first part profile photo
        &__profile-photo {
          //Position
          position: relative;

          //Cursor
          cursor: pointer;
          .change-indicator {
            //Position
            position: absolute;

            //Color
            background-color: rgba($color: var(--v-theme-text), $alpha: 0.6);
            color: rgb(var(--v-theme-background_color));

            //Font
            font-size: 100px;

            //Border
            border-radius: 50%;

            //Spacing
            width: 100%;
            height: 100%;
          }
        }
      }

      //Main content second part loader
      &__second-part-loader {
        //Margin
        margin: 20px 0;

        //Display
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 0.5fr 0.5fr 1fr;
        gap: 20px;

        //Goal loader style
        .goal {
          grid-column: 1/3;
        }
      }

      //Main content third part
      &__third-part {
        padding-top: 10px;
      }
    }
  }

  .profile_buttons {
    margin-top: 50px;
    #submit-button {
      margin-top: 10px;
    }
    flex-wrap: wrap;
    gap: 10px;
  }
}

//Clarification style
.clarification {
  //Spacing
  padding: 10px 0;
}

//Media queries
@media only screen and (min-width: 480px) {
  //Profile section styles
  .profile-section {
    //Sizing
    width: 80%;
  }
}

//Media queries
@media only screen and (min-width: 768px) {
  //Profile section styles
  .profile-section {
    //Main content styles
    &__main-content {
      //Main content form
      &__form {
        //Spacing
        padding-top: 30px;

        //Main content form first part
        &__first-part {
          //Display
          display: flex;
          flex-direction: row;
          gap: 20px;
        }

        //Main content form second part
        &__second-part {
          //Display
          display: flex;
          flex-wrap: wrap;
          gap: 2%;

          //Sizing
          padding-top: 20px;

          //Main content form second part field style
          .profile-section__main-content__form__field {
            //Sizing
            width: 49%;

            //Display
            flex-grow: 1;
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 1024px) {
  //Profile section styles
  .profile-section {
    //Sizing
    width: 820px;
    //Main content styles
    &__main-content {
      //Main content form
      &__form {
        //Main content form third part
        &__third-part {
          //Margin
          margin-top: 5px;

          //Display
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 2%;

          //Main content form second part field style
          .profile-section__main-content__form__field {
            //Sizing
            width: 32%;

            //Display
            flex-grow: 1;
            display: flex;
            align-items: center;
            flex-direction: column;

            //Text
            text-align: center;
          }

          //Rating style
          #rating {
            //Margin
            margin-top: 20px;
          }
        }
      }
    }
  }
}
</style>
