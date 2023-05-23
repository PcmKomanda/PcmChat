<script>
import api from "../../libs/api";
import Editor from "./Editor.vue";
import Message from "./Message.vue";
import { checkText } from "smile2emoji";
import { uid } from "uid";
export default {
  inheritAttrs: false,
  components: { Message, Editor },
  props: ["channel_id"],
  data() {
    return {
      messages: [],
      date: null,
      message: {},
    };
  },
  computed: {
    channel() {
      return this.$store.state.channel;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    scrollToEnd: function () {
      // scroll to the start of the last message
      this.$refs.messages.scrollTop =
        this.$refs.messages.lastElementChild.offsetTop;
    },
    async loadMessages(page) {
      if (!this.channel._id) return;
      await api
        .get(
          `/channels/${this.channel._id}/messages?page=${
            page > 1 ? page : 1
          }&date=${this.date}`
        )
        .then((r) => {
          this.messages = r.data.data.map((r) => {
            r.content = checkText(r.content);
            return r;
          });
        });
    },
    async deleteMessage(e) {
      if (confirm("Ar tikrai norite ištrinti šią žinutę?") !== true) return;
      await api.delete(`/messages/${e._id}`).then((r) => {
        this.$socket.emit("deleteMessage", e);
      });
    },
    updateMessage(e, is_uid = true) {
      // hacky way to trigger component update
      const random_uid = uid(16);
      return (this.message = { ...e, uid: is_uid ? random_uid : undefined });
    },
  },
  sockets: {
    newMessage(e) {
      if (e.channel !== this.channel._id) return;
      e.content = checkText(e.content);
      this.messages.push(e);
    },
    setMessages(e) {
      this.messages = e.map((message) => {
        message.content = checkText(message.content);
        return message;
      });
      this.$nextTick(() => this.scrollToEnd());
    },
    editMessage(e) {
      if (e.channel !== this.channel._id) return;
      this.messages = this.messages.map((message) => {
        if (message._id === e._id) {
          message = e;
          message.content = checkText(message.content);
        }
        return message;
      });
    },
    messageDeleted(e) {
      if (e.channel !== this.channel._id) return;
      this.messages = this.messages.filter((message) => message._id !== e._id);
    },
  },
  mounted() {
    this.$store.dispatch("getChannel");
    if (this.channel._id) {
      this.date = Date.now();
      this.loadMessages();
      this.$nextTick(() => this.scrollToEnd());
    }

    this.$watch(
      () => this.channel._id,
      () => {
        this.messages = [];
        this.date = Date.now();
        this.loadMessages();
        this.$nextTick(() => this.scrollToEnd());
      }
    );
  },
};
</script>
<template>
  <div class="flex flex-col w-full m-0 p-0 h-full">
    <div class="bg-base-300 w-full min-h-[48px] border-b-2 flex">
      <i
        class="fas fa-bars text-3xl mx-2 sm:inline-flex xl:hidden my-auto"
        @click="this.$emit('openSidebar')"
      ></i>
      <div class="inline-flex" v-if="channel._id">
        <i class="fas fa-hashtag text-2xl md:text-3xl lg:text-4xl mr-2"></i>
        <span
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl italic my-auto"
        >
          {{ channel.title }}
        </span>
      </div>
    </div>
    <div
      class="flex-grow w-full overflow-y-auto"
      v-if="channel._id"
      ref="messages"
    >
      <span class="m-2" v-if="messages.length < 1">Žinučių nėra.</span>
      <div
        v-else
        v-for="message in messages"
        :key="message._id"
        class="hover:bg-base-300 duration-200 my-1 relative flex w-full"
      >
        <Message :message="message" v-if="message.author" />
        <div
          class="flex gap-2 text-lg absolute right-1 top-2"
          v-if="user._id === message.author._id"
        >
          <i
            class="fas fa-edit hover:text-warning duration-500 cursor-pointer"
            @click="updateMessage(message)"
          ></i>
          <i
            class="fas fa-trash-can hover:text-error duration-500 cursor-pointer"
            @click="
              deleteMessage(message) &&
                updateMessage({ _id: '', content: '' }, false)
            "
          ></i>
        </div>
      </div>
    </div>
    <div class="mt-auto" v-if="channel._id">
      <Editor
        :channel="channel"
        :msg="message"
        @clear_editor="updateMessage({ _id: '', content: '' }, false)"
      />
    </div>
  </div>
</template>
