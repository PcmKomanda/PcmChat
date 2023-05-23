<script>
import moment from "moment";
import StatusPicker from "./StatusPicker.vue";
export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    format() {
      return (date) => moment(date).format("YYYY-MM-DD HH:MM");
    },
  },
  methods: {
    logout() {
      this.$cookies.remove("auth-token");
      this.$router.push("/login");
    },
  },
  components: { StatusPicker },
};
</script>
<template>
  <div class="flex w-full h-16 bg-base-300 m-0 p-0 z-30">
    <div
      class="flex dropdown dropdown-top w-full h-16 hover:bg-base-200 duration-200 cursor-pointer mr-4"
    >
      <label tabindex="0" class="flex w-full">
        <div class="w-16 md:w-14 my-2 mx-2 flex">
          <div
            class="avatar status"
            :class="
              user.status.type == 'invisible' ? 'invis' : user.status.type
            "
            v-lazy-container="{ selector: 'img' }"
          >
            <img :data-src="user.avatar" class="rounded-full" />
          </div>
        </div>
        <div class="w-full inline-flex">
          <div class="text-center my-auto text-lg xl:text-xl 2xl:text-2xl">
            {{ user.display_name }}
          </div>
        </div>
      </label>
      <ul
        tabindex="0"
        class="dropdown-content menu p-4 shadow bg-base-200 rounded-box w-full m-2"
      >
        <span class="cursor-default text-4xl">
          <span>{{ user.display_name }}</span>
        </span>
        <div class="divider my-1"></div>
        <span class="cursor-default">
          <b class="text-white">Prisiregistruota:</b>
          <br />
          <span>{{ format(user.createdAt) }}</span>
        </span>
        <div class="divider my-1"></div>
        <StatusPicker></StatusPicker>
        <!-- <li><a>Spalva</a></li>  -->
      </ul>
    </div>
    <div
      class="my-auto text-xl ml-auto pr-2 hover:text-blue-300 duration-1000 cursor-pointer"
    >
      <i class="fa-solid fa-right-from-bracket" @click="logout"></i>
    </div>
  </div>
</template>
