import { createStore } from "vuex";
import user from "./user";
import guilds from "./guilds";
import guild from "./guild";
import channel from "./channel";

export default createStore({
  modules: {
    user,
    guilds,
    guild,
    channel,
  },
});
