<script>
import Messages from "./Messages.vue";
import Editor from "./Editor.vue";
import MembersList from "./MembersList.vue";
export default {
  inheritAttrs: false,
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    channel() {
      return this.$store.state.channel;
    },
  },
  components: { Messages, Editor, MembersList },
};
</script>
<template>
  <div class="h-screen grid grid-cols-12">
    <div class="col-span-12 lg:col-span-9">
      <Messages
        @openSidebar="this.$emit('openSidebar')"
        :channel_id="channel._id"
        class="flex"
      />
    </div>
    <div class="hidden lg:flex col-span-3">
      <MembersList />
    </div>
  </div>
</template>
