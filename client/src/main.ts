import { createApp } from "vue";
import VueSocketIO from "vue-3-socket.io";
import VueCookies from "vue-cookies";
import VueLazyload from "vue-lazyload";
import App from "./App.vue";
import "./main.css";
import router from "./routes/router";
import store from "./store/store";

const app = createApp(App)
  .use(
    new VueSocketIO({
      debug: true,
      connection: `
      https://${import.meta.env.VITE_API}`,
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
