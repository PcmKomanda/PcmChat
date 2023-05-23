import { uid } from "uid";
import api from "../libs/api";

export default {
  state: {
    _id: null,
    title: null,
    icon: null,
    owner: null,
    privacy: null,
    created_at: null,
    channels: [],
    default_channel: null,
    moderators: [],
    members: [],
    uid: null,
  },
  mutations: {
    setGuild(state: any, guild: any) {
      state._id = guild?._id || null;
      state.title = guild?.title || null;
      state.icon = guild?.icon || null;
      state.owner = guild?.owner || null;
      state.privacy = guild?.privacy || null;
      state.created_at = guild?.createdAt || null;
      state.channels = guild?.channels || [];
      state.default_channel = guild?.default_channel || null;
      state.moderators = guild?.moderators || [];
      state.members = guild?.members || [];
      state.uid = uid(16);
    },
  },
  actions: {
    async getGuild({ commit }: any, guildId: string) {
      if (!guildId || !sessionStorage.getItem("guild"))
        return commit("setGuild", null);
      await api
        .get(`/guilds/${guildId ? guildId : sessionStorage.getItem("guild")}`)
        .then((res) => {
          commit("setGuild", res.data.data);
        });
    },
  },
  getters: {
    guild: (state: any) => state.guild,
  },
};
