<script>
import api from "../../../libs/api";
import GuildSettings from "./GuildSettings.vue";
import InviteCodeGen from "./InviteCodeGen.vue";

export default {
  data() {
    return {
      openDropdown: false,
      modal: "",
    };
  },
  methods: {
    async QuitGuild() {
      if (!confirm("Ar tikrai?")) return;
      if (this.guild.owner === this.user._id) {
        await api.delete(`/guilds/${this.guild._id}`).then((r) => {
          this.$store.dispatch("getGuilds");
          sessionStorage.clear();
          this.$store.dispatch("getGuild", null);
          this.$store.dispatch("getChannel");
        });
      } else {
        await api.put(`/guilds/${this.guild._id}/leave`).then((r) => {
          // this.$store.dispatch("getGuilds");
          this.$socket.emit("updateGuildIcon");
          sessionStorage.clear();
          this.$store.dispatch("getGuild", null);
          this.$store.dispatch("getChannel");
        });
      }
      this.openDropdown = false;
    },
    setModal(modal) {
      this.modal = modal;
    },
  },
  computed: {
    guild() {
      return this.$store.state.guild;
    },
    user() {
      return this.$store.state.user;
    },
  },
  components: { GuildSettings, InviteCodeGen },
};
</script>
<template>
  <div
    v-if="guild._id"
    class="flex w-full h-full bg-neutral-800 duration-200 cursor-pointer relative border-b-2 border-slate-400"
    :class="openDropdown ? 'bg-neutral-900' : ''"
  >
    <div
      class="text-white w-full mx-2 flex"
      @click="openDropdown = !openDropdown"
      tabindex="0"
    >
      <span
        class="2xl:text-lg my-auto font-bold w-[80%] select-none overflow-hidden truncate"
      >
        {{ guild.title }}
      </span>
      <div class="mx-auto my-auto">
        <i class="fas fa-chevron-down"></i>
      </div>
    </div>
    <div
      v-if="openDropdown"
      class="absolute bg-base-300 shadow-md w-full h-fit mt-12 px-1 z-10"
    >
      <button
        class="btn w-full my-1"
        @click="setModal('settings')"
        v-if="user._id == guild.owner || guild.moderators.includes(user._id)"
      >
        Nustatymai
      </button>
      <button class="btn w-full" @click="setModal('gen_code')">
        Sugeneruoti kodą
      </button>
      <button class="btn w-full text-red-700 my-1" @click="QuitGuild">
        {{ guild.owner === user._id ? "Ištrinti" : "Išeiti" }}
      </button>
    </div>
  </div>
  <GuildSettings
    v-if="modal == 'settings'"
    @close="setModal('')"
  ></GuildSettings>

  <InviteCodeGen v-if="modal == 'gen_code'" @close="setModal('')" />
</template>
