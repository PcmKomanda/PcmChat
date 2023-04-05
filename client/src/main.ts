import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import VueSocketIO from "vue-3-socket.io";
import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

type RLN = RouteLocationNormalized;
type NGN = NavigationGuardNext;

// create routes with vue router 4
const routes = [
  {
    path: "/",
    name: "Home",
    beforeEnter: (to: RLN, from: RLN, next: NGN) => {
      const authed = localStorage.getItem("auth-token");

      if (authed) {
        next("/chat");
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("./views/Chat.vue"),
    beforeEnter: async (to: RLN, from: RLN, next: NGN) => {
      const authed = localStorage.getItem("auth-token");
      if (authed) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("./views/Login.vue"),
    beforeEnter: (to: RLN, from: RLN, next: NGN) => {
      const authed = localStorage.getItem("auth-token");
      if (authed) {
        next("/chat");
      } else {
        next();
      }
    },
  },
  {
    path: "/auth/discord/callback",
    name: "AuthDiscordCallback",
    beforeEnter: async (to: RLN) => {
      const { code } = to.query;
      if (code) {
        const { token } = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/discord/callback?code=${code}`
        ).then((res) => res.json());
        if (token) {
          await localStorage.setItem("auth-token", token);
          close();
        }
      }
    },
  },
  {
    path: "/auth/github/callback",
    name: "AuthGithubCallback",
    beforeEnter: async (to: RLN) => {
      const { code } = to.query;
      if (code) {
        const { token } = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/github/callback?code=${code}`
        ).then((res) => res.json());
        if (token) {
          await localStorage.setItem("auth-token", token);
          close();
        }
      }
    },
  },
  {
    path: "/users/:login_name",
    name: "User Profile",
    component: () => import("./views/UserProfile.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    beforeEnter: (to: RLN, from: RLN, next: NGN) => {
      next("/chat");
    },
  },
];
//
createApp(App)
  .use(
    new VueSocketIO({
      debug: true,
      connection: `ws://${import.meta.env.VITE_API}`,
    })
  )
  .use(
    createRouter({
      history: createWebHistory(),
      routes: routes as RouteRecordRaw[],
    })
  )
  .mount("#app");
