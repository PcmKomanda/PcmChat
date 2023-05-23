<script>
import CreateGuildModal from "./CreateGuildModal.vue";
import GuildIcon from "./GuildIcon.vue";

export default {
  data() {
    return {
      modal: "",
    };
  },
  computed: {
    guilds() {
      return this.$store.state.guilds.guilds;
    },
  },
  methods: {
    setModal(modal) {
      this.modal = modal;
    },
  },
  mounted() {
    this.$store.dispatch("getGuilds");
  },
  sockets: {
    updateGuildIcon() {
      this.$store.dispatch("getGuilds");
      if (sessionStorage.getItem("guild") == null) return;
      this.$store.dispatch("getGuild", sessionStorage.getItem("guild"));
    },
  },
  components: { GuildIcon, CreateGuildModal },
};
</script>
<template>
  <div
    class="flex h-full w-[90px] overflow-y-scroll overflow-x-hidden bg-base-300"
  >
    <div class="flex-grow p-0">
      <div v-for="guild in guilds" :key="guild._id">
        <GuildIcon :guild="guild"></GuildIcon>
      </div>
      <div
        class="flex justify-center bg-slate-700 rounded-full cursor-pointer hover:invert duration-200 w-[54px] h-[54px] mx-auto mt-2 tooltip tooltip-right"
        @click="setModal('create')"
        title="Sukurti serverį"
      >
        <i class="fas fa-plus my-auto text-3xl" />
      </div>
    </div>
    <CreateGuildModal
      v-if="modal == 'create'"
      @close="setModal('')"
    ></CreateGuildModal>
  </div>
</template>
