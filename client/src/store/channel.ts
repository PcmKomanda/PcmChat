import api from "../libs/api";

export default {
  state: {
    _id: null,
    title: null,
    privacy: null,
    type: null,
    created_at: null,
  },
  mutations: {
    setChannel(state: any, channel: any) {
      state._id = channel?._id || null;
      state.title = channel?.title || null;
      state.privacy = channel?.privacy || null;
      state.type = channel?.type || null;
      state.created_at = channel?.createdAt || null;
    },
  },
  actions: {
    async getChannel({ commit }: any) {
      if (
        !sessionStorage.getItem("channel") ||
        sessionStorage.getItem("channel") === undefined
      )
        return commit("setChannel", null);
      await api
        .get(`/channels/${sessionStorage.getItem("channel")}`)
        .then((res) => {
          commit("setChannel", res.data.data);
        });
    },
  },
  getters: {
    channel: (state: any) => state.channel,
  },
};
