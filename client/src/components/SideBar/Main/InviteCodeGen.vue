<script>
import api from "../../../libs/api";

export default {
  data() {
    return {
      code: "",
    };
  },
  computed: {
    guild() {
      return this.$store.state.guild;
    },
  },
  methods: {
    async genCode() {
      await api.post(`/guilds/${this.guild._id}/invite`).then((r) => {
        this.code = r.data.data.code;
      });
    },
    clear() {
      this.code = "";
      this.$emit("close");
    },
    copy() {
      const element = this.$refs.code;
      element.select();
      element.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(element.value);
    },
  },
  mounted() {
    this.genCode();
  },
};
</script>
<template>
  <div class="modal modal-middle modal-open">
    <div class="modal-box">
      <label
        @click="clear"
        class="btn btn-sm btn-circle absolute right-2 top-2"
        v-text="'x'"
      />
      <h3 class="font-bold text-lg">
        <span class="text-white italic font-extrabold">{{ guild.title }}</span>
        pakvietimo kodas
      </h3>
      <div class="divider my-1"></div>
      <div class="flex">
        <input
          ref="code"
          type="text"
          class="input input-bordered w-full input-disabled cursor-default"
          v-model="code"
        />
        <button class="btn" @click="copy">
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </div>
  </div>
</template>
