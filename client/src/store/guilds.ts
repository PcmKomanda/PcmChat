import api from "../libs/api";
import store from "./store";
export default {
  state: {
    guilds: [
      {
        _id: null,
        title: null,
        icon: null,
      },
    ],
  },
  mutations: {
    setGuilds(state: any, guilds: any) {
      state.guilds = guilds;
    },
  },
  actions: {
    async getGuilds({ commit }: any) {
      const { $cookies } = store.app.config.globalProperties;
      const token = $cookies.get("auth-token") || null;
      if (token) {
        const guilds = await api
          .get("/users/me/guilds")
          .then((res) => res.data);

        commit("setGuilds", guilds);
      }
      // location.href = "/login";
    },
  },
  getters: {
    guilds: (state: any) => state.guilds,
  },
};
