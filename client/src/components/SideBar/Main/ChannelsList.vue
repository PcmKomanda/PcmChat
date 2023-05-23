<script>
import ChannelSettings from "./ChannelSettings.vue";
export default {
  data() {
    return {
      hoverSettings: false,
      editChannel: false,
      createChannel: false,
      channel: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    channels() {
      const channels = this.$store.state.guild.channels;
      if (
        this.guild.moderators.includes(this.user._id) ||
        this.guild.owner == this.user._id
      ) {
        return channels.filter(
          (e) => e.privacy == "public" || e.privacy == "private"
        );
      }
      return channels.filter((e) => e.privacy == "public");
    },
    guild() {
      return this.$store.state.guild;
    },
  },
  methods: {
    genType(e) {
      if (e.type == "text") {
        if (e.privacy == "public") {
          return `<i class="fas fa-hashtag"></i>`;
        } else {
          return `<i class="fas fa-hashtag-lock"></i>`;
        }
      }
    },
    // title(e) {
    //   if (e.title?.length > 15) {
    //     return e.title.substring(0, 15) + "...";
    //   }
    //   return e.title;
    // },
    selectChannel(e) {
      sessionStorage.setItem("channel", e._id);
      this.$store.dispatch("getChannel");
    },
  },
  sockets: {
    updateGuild(e) {
      console.log(`Guild updated: ${e}`);
      if (this.guild._id !== e) return;
      this.$store.dispatch("getGuild", e);
      this.$store.dispatch("getChannel");
    },
  },
  components: { ChannelSettings },
};
</script>
<template>
  <div class="flex flex-col bg-base-200 w-full h-full" v-if="guild._id">
    <div
      v-for="Channel in channels"
      :key="Channel._id"
      class="odd:bg-base-300 hover:bg p-2 cursor-pointer flex"
    >
      <div
        class="text-lg my-auto w-[95%] select-none flex"
        @click="selectChannel(Channel)"
      >
        <span
          class="text-slate-500 text-xl pr-2 italic align-middle"
          v-html="genType(Channel)"
        >
        </span>
        <span class="text-slate-300 font-semibold truncate overflow-hidden">
          {{ Channel.title }}
        </span>
      </div>
      <div
        class="ml-auto my-auto"
        @click="
          channel = Channel;
          editChannel = true;
        "
        v-if="user._id == guild.owner || guild.moderators.includes(user._id)"
      >
        <i
          class="far motion-safe:hover:animate-spin-slow fa-gear hover:shadow-2xl"
        ></i>
      </div>
    </div>
    <!-- Add new guild-->
    <div
      class="flex justify-center bg-slate-700 rounded-full cursor-pointer hover:invert duration-200 w-[40px] h-[40px] mx-auto mt-2 tooltip tooltip-right"
      @click="createChannel = true"
      title="Sukurti kanalą"
      v-if="user._id == guild.owner || guild.moderators.includes(user._id)"
    >
      <i class="fas fa-plus my-auto text-xl" />
    </div>

    <ChannelSettings
      v-if="editChannel"
      :cn="channel"
      type="edit"
      @close="editChannel = false"
    />

    <ChannelSettings
      v-if="createChannel"
      type="create"
      @close="createChannel = false"
    />
  </div>
</template>
