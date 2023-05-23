<script>
export default {
  data() {
    return {
      types: [
        {
          key: "online",
          value: "Prisijungęs",
          class: "fas fa-circle text-green-500",
        },
        {
          key: "idle",
          value: "Neaktyvus",
          class: "fas fa-circle text-yellow-500",
        },
        {
          key: "dnd",
          value: "Užimtas",
          class: "fas fa-circle text-red-500",
        },
        {
          key: "invisible",
          value: "Nematomas",
          class: "fas fa-circle text-gray-500",
        },
      ],
      focus: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    formatStatus() {
      return (status) => {
        return this.types.find((s) => s.key === status);
      };
    },
  },
  methods: {
    async changeStatus(status) {
      await fetch(`${import.meta.env.VITE_API_URL}/users/me/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.$cookies.get("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });
      this.$store.dispatch("getUser");
      this.$socket.emit("userStatusChanged");
    },
  },
  mounted() {
    var a = setInterval(() => {
      const dropdown = document.getElementById("main-dd");
      if (!dropdown) {
        clearInterval(a);
        return;
      }
      if (dropdown && !dropdown.contains(document.activeElement)) {
        this.focus = false;
      }
    }, 500);
  },
};
</script>
<template>
  <li>
    <a @click="focus = !focus" :class="focus ? 'btn-primary text-white' : ''">
      <i :class="formatStatus(user.status.type).class"></i>
      {{ formatStatus(user.status.type).value }}
      <i class="fas fa-chevron-down ml-auto"></i>
    </a>
    <div v-if="focus" class="clear">
      <div class="divider my-1"></div>
      <ul class="shadow bg-base-300 rounded-box w-full">
        <li v-for="SType in types" :key="SType.key">
          <span @click="changeStatus(SType.key)">
            <i :class="SType.class"></i>
            {{ SType.value }}
          </span>
        </li>
      </ul>
      <div class="divider my-1"></div>
    </div>
  </li>
</template>

<style scoped="true">
.clear {
  all: unset;
}
</style>
