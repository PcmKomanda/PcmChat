import { createApp } from "vue";
import "./main.css";
import App from "./App.vue";
import VueSocketIO from "vue-3-socket.io";
import store from "./store/store";
import VueCookies from "vue-cookies";
import router from "./routes/router";
import VueLazyload from "vue-lazyload";

const app = createApp(App)
  .use(
    new VueSocketIO({
      debug: true,
      connection: `${
        import.meta.env.NODE_ENV === "production" ? "wss" : "ws"
      }://${import.meta.env.VITE_API}`,
      vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_",
      },
    })
  )
  .use(VueCookies)
  .use(router)
  .use(store)
  .use(VueLazyload, {
    preLoad: 1.3,
    attempt: 1,
  });

router.app = app;
store.app = app;

app.mount("#app");
