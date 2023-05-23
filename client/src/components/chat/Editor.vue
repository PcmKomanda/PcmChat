<script>
import api from "../../libs/api";

export default {
  props: ["channel", "msg"],
  data() {
    return {
      message: {
        _id: "",
        content: "",
      },
    };
  },
  watch: {
    msg() {
      this.message = { ...this.msg };
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async send() {
      if (
        this.message.content.trimStart().length > 1000 ||
        this.message.content.trimStart().length < 1
      )
        return;
      await api
        .post(`/channels/${this.channel._id}/messages`, {
          content: this.message.content,
        })
        .then((r) => {
          this.$socket.emit("newMessage", {
            message: r.data.data,
            channel: this.channel,
          });
        });
      this.message.content = "";
    },
    async edit() {
      if (
        this.message.content.trimStart().length > 1000 ||
        this.message.content.trimStart().length < 1
      )
        return;
      await api
        .put(`/messages/${this.message._id}`, {
          content: this.message.content,
        })
        .then((r) => {
          this.$socket.emit("editMessage", r.data.data._id);
          this.$emit("clear_editor");
          this.message.content = "";
        });
    },
  },
};
</script>
<template>
  <div class="flex h-18 bg-base-200 bottom-0 sticky w-full p-2 m-0">
    <input
      v-model="this.message.content"
      type="text"
      class="input min-w-full m-0 bg-base-100"
      :class="this.message.content.length > 1000 ? 'input-error' : ''"
      placeholder="Tekstas"
      @keyup.enter="this.msg.uid ? edit() : send()"
    />
  </div>
</template>
