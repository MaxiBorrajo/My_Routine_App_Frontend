<template>
  <main>
    <!-- Main content -->
    <div class="main_content d-flex justify-center">
      <router-view v-slot="{ Component }">
        <Transition name="bounce" mode="out-in" appear>
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </Transition>
      </router-view>
    </div>
    <!-- Footer -->
    <div class="footer">
      <FooterComponent />
    </div>
  </main>
</template>

<script setup>
//Imports
import { onBeforeMount } from "vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { useTheme } from "vuetify";
import { useUserStore } from "@/stores/user_store";
import VueCookies from "vue-cookies";

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

      localStorage.setItem("current_user_info", JSON.stringify(user.resource));

      theme.global.name.value = user.resource.theme;
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
  await get_theme();
});
</script>

<style lang="scss">
//Main app styles
main {
  //Sizing
  height: 100%;
  width: 100%;

  //Display
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 1fr 0.5fr;

  .main_content {
    //Sizing
    min-height: 100vh;
    height: 100%;
    width: 100%;
    grid-row: 1;
  }
  //Footer style
  .footer {
    //Sizing
    height: 100%;
    width: 100%;
    grid-row: 2;
  }
}

//Transition styles
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

//General styles

#app {
  font-family: $primary-font;
  -webkit-font-smoothing: antialiased;
  -moz-asx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  font-size: 32px;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 16px;
}

h5 {
  font-size: 14px;
}

h6 {
  font-size: 12px;
}

p {
  font-size: 12px;
}

a {
  text-decoration: none;
}
</style>
