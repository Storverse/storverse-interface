import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
import { computed } from "vue";
import Layout from "@/views/layout/index.vue";

import { LoginState } from "@/store/modules/login";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/square",
  },
  {
    path: "/square",
    component: Layout,
    children: [
      {
        path: "",
        name: "Verse-Square",
        component: () => import("@/views/square/index.vue"),
      },
    ],
  },
  {
    path: "/notification",
    component: Layout,
    children: [
      {
        path: "",
        name: "Verse-Notification",
        component: () => import("@/views/notification/index.vue"),
      },
      {
        path: "/notConnect",
        name: "Verse-NotConnect",
        component: () => import("@/views/notification/notNotification.vue"),
      },
    ],
  },
  {
    path: "/profile",
    component: Layout,

    children: [
      {
        path: "",
        name: "Verse-Profile",
        component: () => import("@/views/profile/index.vue"),
      },
      {
        path: "/settingUser",
        name: "Verse-SettingUser",
        component: () => import("@/views/profile/setting/index.vue"),
      },
      {
        path: "/dashboardUser",
        name: "Verse-DashboardUser",
        component: () => import("@/views/profile/dashboard/index.vue"),
      },
      {
        path: "/userProfile",
        name: "Verse-UserProfile",
        component: () => import("@/views/profile/userProfile/index.vue"),
      },
    ],
  },
  {
    path: "/bookmark",
    component: Layout,
    children: [
      {
        path: "",
        name: "Verse-Bookmark",
        component: () => import("@/views/bookmark/index.vue"),
      },
    ],
  },
  {
    path: "/verse-details",

    component: Layout,
    children: [
      {
        path: "",
        name: "Verse-Details",
        component: () => import("@/views/verse-details/index.vue"),
      },
    ],
  },
  {
    path: "/upload-verse",
    component: Layout,
    children: [
      {
        path: "",
        name: "Verse-Upload",
        component: () => import("@/views/upload-verse/index.vue"),
      },
    ],
  },
  // #error
  {
    path: "/:pathMatch(.*)",
    component: () => import("@/views/error/index.vue"),
  },
];
const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  // mode: "history",
  routes,
});
router.beforeEach(async (to, from, next) => {
  const loginState = LoginState();
  const keplrAddress = computed(() => loginState.keplrAddress);

  document.title = to.name ? to.name : "Verse";
  if (
    to.fullPath != "/" &&
    to.fullPath != "/square" &&
    !keplrAddress.value &&
    to.fullPath != "/notification" &&
    to.fullPath != "/profile" &&
    to.fullPath != "/bookmark"
  ) {
    console.log(222);
    next("/");
    return;
  }

  return next();
});
export default router;
