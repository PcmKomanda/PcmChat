<script>
export default {
  props: ["guild"],
  data() {
    return {};
  },
  methods: {
    select() {
      // history.pushState({}, "", `/chat/${this.guild._id}`);
      sessionStorage.setItem("guild", this.guild._id);
      sessionStorage.setItem("channel", this.guild.default_channel);

      this.$store.dispatch("getGuild", this.guild._id);
      this.$store.dispatch("getChannel", this.guild.default_channel);
    },
  },
};
</script>
<template>
  <div class="flex mt-2 p-0">
    <!-- <div class="mx-auto" @click="$store.dispatch('getGuild', guild._id)"> -->
    <div class="mx-auto" @click="select">
      <img
        class="rounded-full cursor-pointer hover:opacity-80 duration-200 w-[54px] h-[54px]"
        :src="guild.icon"
        :title="guild.title"
      />
    </div>
  </div>
</template>
