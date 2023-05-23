<script>
import api from "../../../libs/api";
import Multiselect from "@vueform/multiselect";

export default {
  data() {
    return {
      guild: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    guild_info() {
      return this.$store.state.guild;
    },
    options() {
      console.log(this.guild.members);
      return this.guild.members.map((m) => {
        return { label: m.display_name, value: m._id };
      });
    },
  },
  methods: {
    async updateGuild() {
      this.loading = true;
      await api
        .put(`/guilds/${this.guild._id}`, {
          title: this.guild.title,
          description: this.guild.description,
          privacy: this.guild.privacy,
        })
        .then(async (r) => {
          this.$store.dispatch("getGuild");
          this.loading = false;
          await this.uploadIconToServer();
          this.$emit("close");
        });
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
        .put(`/guilds/${this.guild._id}/icon`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((r) => {
          this.loading = false;
          // this.$store.dispatch("getGuilds");
          this.$socket.emit("updateGuildIcon");
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
  created() {
    this.guild = { ...this.guild_info };
  },
  components: {
    Multiselect,
  },
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
      <h3 class="font-bold text-lg">Redaguoti gildiją.</h3>
      <div class="divider my-1"></div>
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
            v-model="guild.title"
            type="text"
            placeholder="Pavadinimas"
            class="input input-bordered w-full"
          />
        </div>
        <div>
          <label class="label">
            <span class="label-text">Viešumas</span>
          </label>
          <select class="select select-bordered" v-model="guild.privacy">
            <option class="option" value="private">Privatus</option>
            <option value="public">Viešas</option>
          </select>
        </div>
      </div>
      <div class="modal-action">
        <a
          @click="updateGuild"
          class="btn"
          :class="loading ? 'loading btn-disabled' : ''"
        >
          Atnaujinti!
        </a>
      </div>
    </div>
  </div>
</template>

<style>
.multiselect-tag.is-user {
  padding: 5px 8px;
  border-radius: 22px;
  background: #35495e;
  margin: 3px 3px 8px;
}

.multiselect-tag.is-user img {
  width: 18px;
  border-radius: 50%;
  height: 18px;
  margin-right: 8px;
  border: 2px solid #ffffffbf;
}

.multiselect-tag.is-user i:before {
  color: #ffffff;
  border-radius: 50%;
}

.user-image {
  margin: 0 6px 0 0;
  border-radius: 50%;
  height: 22px;
}
</style>
