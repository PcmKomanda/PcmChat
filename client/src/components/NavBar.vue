<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      online: 0,
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth-token');
      this.$router.push('/login'	);
    },
  },
  sockets: {
    setOnline(e) {
        console.log(e);
        this.online = e;
    },
    // disconnect() {
    //   this.$socket.emit('disconnect', this.user.provider_id);
    // }
  },
}
</script>
<template>
  <div class="navbar bg-base-300 px-4">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">Prisijungę: {{ online }}</a>
  </div>
  <div class="flex-none">
    <span class="text-2xl mr-2">
      {{ user.display_name }}
    </span>
    <div class="dropdown dropdown-end">
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-15 rounded-full">
          <img :src="user.avatar" />
        </div>
      </label>
      <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
        <li>
          <a class="justify-between text-xl">
            Profilis
          </a>
        </li>
        <li><a class="text-xl">Nustatymai</a></li>
        <li><a class="text-xl" @click="logout()">Atsijungti</a></li>
      </ul>
    </div>
  </div>
</div>
</template>