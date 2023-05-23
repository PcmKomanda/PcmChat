<script>
import moment from "moment";

import User from "./User/User.vue";
import GuildsList from "./Guilds/GuildsList.vue";
import GuildTitle from "./Main/GuildTitle.vue";
import ChannelsList from "./Main/ChannelsList.vue";

export default {
  data() {
    return {
      rooms: [],
    };
  },
  methods: {
    logout() {
      this.$cookies.remove("auth-token");
      this.$router.push("/login");
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    format() {
      return (date) => moment(date).format("YYYY-MM-DD HH:MM");
    },
    guild() {
      return this.$store.state.guild;
    },
  },
  components: { User, GuildsList, GuildTitle, ChannelsList },
  mounted() {
    this.$store.dispatch("getGuild", sessionStorage.getItem("guild"));
    if (!sessionStorage.getItem("guild")) {
      sessionStorage.clear();
    }
  },
};
</script>
<template>
  <div class="flex flex-col w-full h-screen m-0 p-0">
    <div class="flex-grow inline-flex overflow-auto">
      <GuildsList></GuildsList>
      <div class="flex flex-col w-full overflow-hidden bg-base-200">
        <div class="h-12">
          <GuildTitle></GuildTitle>
        </div>
        <div class="w-full flex-grow overflow-y-auto">
          <ChannelsList></ChannelsList>
        </div>
      </div>
    </div>
    <div class="mt-auto">
      <User></User>
    </div>
  </div>
</template>
