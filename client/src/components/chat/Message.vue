<script>
import moment from 'moment'
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    }
  },
  computed: {
    isYou() {
      return this.message.author._id === this.user._id;
    },
  },
  methods: {
    formatTime(date) {
      return moment(date).format('YYYY-MM-DD HH:mm');
    }
  },
}
</script>
<template>
  <div class="chat chat-start">

    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img :src="message.author.avatar" />
      </div>
    </div>
    <div class="chat-header">
      {{ message.author.display_name }}
      <time class="text-xs opacity-50">{{ formatTime(message.created_at) }}</time>
    </div>
    <div class="chat-bubble break-words">{{ message.content }}</div>
  </div>
</template>