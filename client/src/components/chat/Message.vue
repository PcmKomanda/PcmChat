<script>
import moment from "moment";
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isYou() {
      return this.message.author._id === this.user._id;
    },
  },
  methods: {
    formatTime(date) {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>
<template>
  <div class="chat-message my-2 flex overflow-hidden">
    <div class="avatar min-h-fit min-w-fit">
      <div
        class="max-w-[4rem] max-h-[4rem] m-1 rounded-full"
        v-lazy-container="{ selector: 'img' }"
      >
        <img
          :data-src="message.author.avatar"
          class="select-none"
          draggable="false"
        />
      </div>
    </div>
    <div class="ml-2 flex flex-col w-full">
      <div class="header flex gap-2">
        <span
          class="text-lg"
          :class="
            message.author.chat_color
              ? `text-[${message.author.chat_color}]`
              : 'text-white'
          "
          >{{ message.author.display_name }}</span
        >
        <span class="text-sm my-auto">{{ formatTime(message.createdAt) }}</span>
        <span class="text-sm my-auto text-gray-500" v-if="message.edited">
          (Keista)
        </span>
      </div>
      <div class="break-normal">{{ message.content }}</div>
    </div>
  </div>
</template>
