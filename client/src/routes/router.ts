import { VueCookies } from "vue-cookies";
import { createRouter, createWebHistory } from "vue-router";

import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

type RLN = RouteLocationNormalized;
type NGN = NavigationGuardNext;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      beforeEnter: (to: RLN, from: RLN, next: NGN) => next("/chat"),
    },
    {
      path: "/chat",
      name: "Chat",
      component: () => import("../views/Chat.vue"),
      beforeEnter: (to: RLN, from: RLN, next: NGN) => {
        const { $cookies } = router.app.config.globalProperties;
        const authed = $cookies.get("auth-token") || false;

        if (authed) {
          next();
        } else {
          next("/login");
        }
      },
      children: [
        {
          path: "/chat/:guild_id",
          name: "ChatGuild",
          component: () => import("../views/Chat.vue"),
        },
        {
          path: "/chat/:guild_id/:channel_id",
          name: "ChatChannel",
          component: () => import("../views/Chat.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      beforeEnter: (to: RLN, from: RLN, next: NGN) => {
        const { $cookies } = router.app.config.globalProperties;
        const authed = $cookies.get("auth-token") || false;

        if (authed) {
          next("/chat");
        } else {
          next();
        }
      },
    },
    {
      path: "/auth/:provider/callback",
      name: "AuthCallback",
      beforeEnter: async (to: RLN) => {
        const { provider } = to.params;
        const { code } = to.query;
        if (code) {
          const { token } = await fetch(
            `${
              import.meta.env.VITE_API_URL
            }/auth/${provider}/callback?code=${code}`
          ).then((res) => res.json());
          if (token) {
            const { $cookies } = router.app.config.globalProperties;
            (await $cookies.set("auth-token", token)) as VueCookies;
            close();
          }
        }
      },
    },
    // {
    //   path: "/auth/github/callback",
    //   name: "AuthGithubCallback",
    //   beforeEnter: async (to: RLN) => {
    //     const { code } = to.query;
    //     if (code) {
    //       const { token } = await fetch(
    //         `${import.meta.env.VITE_API_URL}/auth/github/callback?code=${code}`
    //       ).then((res) => res.json());
    //       if (token) {
    //         $cookies.set("auth-token", token);
    //         close();
    //       }
    //     }
    //   },
    // },
    // {
    //   path: "/auth/google/callback",
    //   name: "AuthGoogleCallback",
    //   beforeEnter: async (to: RLN) => {
    //     const { code } = to.query;
    //     if (code) {
    //       const { token } = await fetch(
    //         `${import.meta.env.VITE_API_URL}/auth/google/callback?code=${code}`
    //       ).then((res) => res.json());
    //       if (token) {
    //         await close();
    //       }
    //     }
    //   },
    // },
    {
      path: "/users/:login_name",
      name: "User Profile",
      component: () => require("./views/UserProfile.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      beforeEnter: (to: RLN, from: RLN, next: NGN) => next("/chat"),
    },
  ] as any,
});

export default router;
