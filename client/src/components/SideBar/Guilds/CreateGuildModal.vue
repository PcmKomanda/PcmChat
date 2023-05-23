<script>
import api from "../../../libs/api";
import Alert from "../../Alert.vue";

export default {
  props: ["hidden"],
  data() {
    return {
      title: "",
      icon: "",
      guild_id: "",
      loading: false,
      privacy: "private",
      tab: "create",
      code: "",
      error: "",
    };
  },
  methods: {
    async createGuild() {
      this.loading = true;
      await api
        .post(`/guilds`, {
          title: this.title,
          privacy: this.privacy,
        })
        .then(async (r) => {
          this.guild_id = r.data.data._id;
          await this.uploadIconToServer();
        });
    },
    async join() {
      this.loading = true;
      await api
        .post("/guilds/join", {
          code: this.code,
        })
        .then(async (r) => {
          this.loading = false;
          await this.$socket.emit("updateGuildIcon");
          await this.$store.dispatch("getGuilds");
          await sessionStorage.setItem("guild", r.data.guild._id);
          await sessionStorage.setItem("channel", r.data.guild.default_channel);
          await this.$store.dispatch("getGuild", r.data.guild._id);
          await this.$store.dispatch("getChannel");

          await setTimeout(() => {
            this.$emit("close");
          }, 1000);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.error = err.response.data.error;
        });
    },
    setTab(tab) {
      this.tab = tab;
    },
    uploadIcon() {
      document.getElementById("serverIcon").click();
    },
    async uploadIconToServer() {
      const icon = document.getElementById("serverIcon").files[0];
      if (!icon) {
        this.loading = false;
        this.$store.dispatch("getGuilds");
        return setTimeout(() => {
          this.$emit("close");
        }, 1000);
      }
      const formData = new FormData();
      formData.append("icon", icon);
      await api
        .put(`/guilds/${this.guild_id}/icon`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => {
          this.loading = false;
          this.$store.dispatch("getGuilds");

          setTimeout(() => {
            this.$emit("close");
          }, 1000);
        });
    },
    previewIcon() {
      const icon = document.getElementById("serverIcon").files[0];
      const reader = new FileReader();
      reader.readAsDataURL(icon);
      reader.onloadend = () => {
        this.icon = reader.result;
      };
    },
  },
  components: { Alert },
};
</script>
<template>
  <div class="modal modal-middle modal-open">
    <input
      @change="previewIcon"
      id="serverIcon"
      type="file"
      accept="image/*"
      size="5000000"
      hidden
    />
    <div class="modal-box relative">
      <label
        @click="this.$emit('close')"
        class="btn btn-sm btn-circle absolute right-2 top-2"
        v-text="'x'"
      />
      <h3 class="font-bold text-lg">
        {{
          tab == "create"
            ? "Sukurkite savo gildiją."
            : "Prisijunkite prie gildijos."
        }}
      </h3>
      <div class="divider my-1"></div>
      <Alert v-if="error" :message="error" type="error" />
      <div v-if="tab === 'create'">
        <div class="flex w-[100px] h-[100px] mx-auto">
          <div
            class="w-full h-full flex flex-col rounded-full bg-base-300 items-center justify-center text-white hover:bg-gray-400 cursor-pointer duration-500 relative"
            :class="icon ? 'hover:text-white' : 'hover:text-slate-600'"
            @click="uploadIcon"
          >
            <div class="w-full h-full absolute">
              <img v-if="icon" :src="icon" class="w-full h-full rounded-full" />
            </div>
            <div class="z-0 text-center">
              <i class="fas fa-camera"></i>
              <p>Keisti</p>
            </div>
          </div>
        </div>
        <div class="form-control flex flex-row w-full gap-2">
          <div class="w-full">
            <label class="label">
              <span class="label-text">Pavadinimas</span>
            </label>
            <input
              v-model="title"
              type="text"
              placeholder="Pavadinimas"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Viešumas</span>
            </label>
            <select class="select select-bordered" v-model="privacy">
              <option class="option" value="private">Privatus</option>
              <option value="public">Viešas</option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="tab === 'join'">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Pakvietimo kodas</span>
          </label>
          <input
            v-model="code"
            type="text"
            placeholder="Pakvietimo kodas"
            class="input input-bordered w-full"
          />
        </div>
      </div>
      <div class="modal-action">
        <div class="flex flex-col md:flex-row w-full" v-if="tab == 'join'">
          <a
            class="btn"
            @click="setTab('create')"
            :class="loading ? 'btn-disabled' : ''"
          >
            Kurti savo gildiją
          </a>
          <a
            class="btn md:ml-auto mt-2 md:mt-0"
            @click="join"
            :class="loading ? 'loading btn-disabled' : ''"
          >
            Prisijungti!
          </a>
        </div>
        <div class="flex flex-col md:flex-row w-full" v-if="tab == 'create'">
          <a
            class="btn md:mr-auto mb-2 md:mb-0"
            @click="setTab('join')"
            v-if="tab == 'create'"
          >
            Prisijungti prie esamos gildijos
          </a>
          <a
            @click="createGuild"
            class="btn"
            :class="loading ? 'loading btn-disabled' : ''"
          >
            Sukurti!
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
