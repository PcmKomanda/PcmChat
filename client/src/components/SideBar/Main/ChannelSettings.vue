<script>
import api from "../../../libs/api";

export default {
  inheritAttrs: false,
  props: ["hidden", "cn", "type"],
  data() {
    return {
      channel: { ...this.cn },
      loading: {
        saveButton: false,
        deleteButton: false,
      },
    };
  },
  watch: {
    cn() {
      this.channel = { ...this.cn };
    },
  },
  methods: {
    async saveChannel() {
      await api
        .put(`/channels/${this.channel._id}`, {
          title: this.channel.title,
          privacy: this.channel.privacy,
        })
        .then(async (r) => {
          await this.$socket.emit("updateGuild", r.data.data.guild);
          this.clear();
        });
    },
    async createChannel() {
      await api
        .post(`/guilds/${sessionStorage.getItem("guild")}/channels`, {
          title: this.channel.title,
          type: "text",
          privacy: this.channel.privacy,
        })
        .then(async (r) => {
          await this.$socket.emit("updateGuild", r.data.data.guild);
          this.clear();
        });
    },
    async deleteChannel() {
      await api.delete(`/channels/${this.channel._id}`).then(async (r) => {
        await this.$socket.emit("updateGuild", sessionStorage.getItem("guild"));
        this.clear();
      });
    },
    clear() {
      this.channel = {};
      this.loading = {
        saveButton: false,
        deleteButton: false,
      };
      this.$emit("close");
    },
  },
  computed: {
    guild() {
      return this.$store.state.guild;
    },
  },
  mounted() {
    if (this.type === "create") this.channel.privacy = "public";
  },
};
</script>
<template>
  <div v-if="channel._id || type === 'create'">
    <div class="modal modal-middle modal-open">
      <div class="modal-box relative flex flex-col">
        <label
          @click="clear"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          v-text="'x'"
        />
        <h3 class="font-bold text-lg">
          {{ type == "edit" ? "Redaguoti nustatymus." : "Kurti naują kanalą." }}
        </h3>
        <div class="form-control w-full">
          <div>
            <label class="label">
              <span class="label-text">Kanalo pavadinimas</span>
            </label>
            <input
              v-model="channel.title"
              type="text"
              placeholder="Kanalo pavadinimas"
              class="input input-bordered w-full"
            />
          </div>
          <div class="flex gap-2">
            <div class="w-full">
              <label class="label">
                <span class="label-text"> Viešumas </span>
              </label>
              <select
                class="select select-bordered w-full"
                v-model="channel.privacy"
              >
                <option class="option" value="public">
                  Viešas – Mato visi
                </option>
                <option class="option" value="private">
                  Privatus - Tik moderatoriams
                </option>
              </select>
            </div>
            <div>
              <label class="label">
                <span class="label-text">Tipas</span>
              </label>
              <select class="select select-bordered select-disabled" disabled>
                <option class="option" value="public">Tekstinis</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full gap-10">
          <div class="ml-auto mt-2 mb-0 w-full" v-if="type == 'edit'">
            <a
              class="btn w-full text-red-600"
              :class="loading.deleteButton ? 'loading' : 'placeholder:'"
              @click="deleteChannel"
            >
              Ištrinti
            </a>
          </div>
          <div class="ml-auto mt-2 mb-0 w-full">
            <a
              class="btn w-full"
              :class="loading.saveButton ? 'loading' : ''"
              @click="type == 'edit' ? saveChannel() : createChannel()"
            >
              Išsaugoti
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
