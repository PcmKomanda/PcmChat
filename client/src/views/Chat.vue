<script>
import SideBar from "../components/SideBar/SideBar.vue";
import Chat from "../components/chat/Chat.vue";
import api from "../libs/api";
export default {
  data() {
    return {
      settings: false,
      hover: false,
      pingInterval: null,
      openSidebar: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async ping() {
      await api
        .post(
          "/users/me/ping",
          {},
          { headers: { "Content-Type": "text/plain" } }
        )
        .then((r) => {
          console.log(r.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    OpenSidebar() {
      this.openSidebar = !this.openSidebar;
    },
  },
  components: {
    SideBar,
    Chat,
  },
  async mounted() {
    await this.$store.dispatch("getUser");

    await this.ping();
    this.pingInterval = setInterval(() => {
      this.ping();
    }, 10000);
  },
  beforeUnmount() {
    clearInterval(this.pingInterval);
  },
};
</script>
<template>
  <KeepAlive>
    <div v-if="user._id" class="min-h-screen max-h-screen overflow-hidden">
      <div class="grid grid-cols-12">
        <div
          class="col-span-2 xl:flex"
          :class="openSidebar ? 'mobile-sidebar' : 'hidden'"
        >
          <div
            class="sm:visible lg:invisible bg-opacity-60 bg-slate-950 w-screen h-screen absolute z-10"
            @click="openSidebar = false"
          ></div>
          <SideBar class="z-20" />
        </div>
        <div class="col-span-12 xl:col-span-10 xl:col-start-3 h-screen">
          <Chat @openSidebar="OpenSidebar"></Chat>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center items-center h-screen text-5xl">
        <div v-if="!user.error">
          <i class="fas fa-spinner fa-spin"></i>
          <span class="ml-2">Kraunasi...</span>
        </div>
        <div>
          <span v-if="user.error" class="text-red-500">
            Klaida(500): {{ user.error }}
          </span>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<style scoped>
@media screen and (max-width: 824px) {
  .mobile-sidebar {
    position: absolute;
    display: flex;
    height: 100%;
    width: 75%;
    z-index: 5;
  }
}
@media screen and (min-width: 824px) and (max-width: 1280px) {
  .mobile-sidebar {
    position: absolute;
    display: flex;
    height: 100%;
    width: 50%;
    z-index: 5;
  }
}
</style>
