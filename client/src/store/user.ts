import api from "../libs/api";
import store from "./store";
export default {
  state: {
    _id: null,
    display_name: null,
    avatar: null,
    role: null,
    status: null,
    created_at: null,
    error: null,
  },
  mutations: {
    setUser(state: any, user: any) {
      state._id = user._id;
      state.display_name = user.display_name;
      state.avatar = user.avatar;
      state.role = user.role;
      state.status = user.status;
      state.created_at = user.createdAt;
      state.error = user._id ? null : "Kažkas atsitiko. Bandykite dar kartą.";
    },
  },
  actions: {
    async getUser({ commit }: any) {
      const { $cookies } = store.app.config.globalProperties;
      const token = $cookies.get("auth-token") || null;
      if (token) {
        await api
          .get("/users/me")
          .then((res) => {
            commit("setUser", res.data);
          })
          .catch((err) => {
            commit("setUser", { _id: null });
          });
      }
      // location.href = "/login";
    },
  },
  getters: {
    user: (state: any) => state.user,
  },
};
