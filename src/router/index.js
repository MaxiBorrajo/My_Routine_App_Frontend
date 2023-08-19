//Imports
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChooseExerciseView from "../views/ChooseExerciseView.vue";
import ErrorView from "../views/ErrorView.vue";
import FeedbackView from "../views/FeedbackView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import MainDashboardView from "../views/MainDashboardView.vue";
import PlayRoutineView from "../views/PlayRoutineView.vue";
import ProfileView from "../views/ProfileView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";
import CreateRoutineView from "../views/CreateRoutineView.vue";
import CreateExerciseView from "../views/CreateExerciseView.vue";
import SpecificRoutineView from "../views/SpecificRoutineView.vue";
import SpecificExerciseView from "../views/SpecificExerciseView.vue";
import { useUserStore } from "@/stores/user_store";
import VueCookies from "vue-cookies";

//Variables
const router = createRouter({
  mode: "history",
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
      beforeEnter: (to, from, next) => {
        if (
          VueCookies.isKey("_is_logged_in") &&
          VueCookies.get("_is_logged_in")
        ) {
          next({ name: "Dashboard" });
        } else {
          next();
        }
      },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: MainDashboardView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/forgot_password",
      name: "ForgotPassword",
      component: ForgotPasswordView,
    },
    {
      path: "/reset_password/:token",
      name: "ResetPassword",
      component: ResetPasswordView,
    },
    {
      path: "/routine",
      name: "CreateRoutine",
      component: CreateRoutineView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/routine/:id_routine",
      name: "SpecificRoutine",
      component: SpecificRoutineView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/exercise",
      name: "CreateExercise",
      component: CreateExerciseView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/exercise/:id_exercise",
      name: "SpecificExercise",
      component: SpecificExerciseView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/exercises",
      name: "ChooseExercise",
      component: ChooseExerciseView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/play/routine/:id_routine",
      name: "PlayRoutine",
      component: PlayRoutineView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/feedback",
      name: "Feedback",
      component: FeedbackView,
      meta: {
        require_auth: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "Error",
      component: ErrorView,
      pathMatch: "prefix",
    },
  ],
});

//Guards
router.beforeEach(async (to, from, next) => {
  const require_auth = to.meta.require_auth;

  const user_store = useUserStore();
  if (
    (require_auth && !VueCookies.isKey("_is_logged_in")) ||
    (require_auth &&
      VueCookies.isKey("_is_logged_in") &&
      !VueCookies.get("_is_logged_in"))
  ) {
    next({ name: "Home" });

    user_store.not_logged_user_error = true;
  } else {
    next();
  }
});

//Exports
export default router;
