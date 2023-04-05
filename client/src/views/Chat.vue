<script>
import NavBar from '../components/NavBar.vue';
import SideBar from '../components/SideBar.vue';
import RightSidebar from '../components/rightSidebar.vue';
import Chat from '../components/chat/Chat.vue';
export default {
  data() {
    return {
      user: {},
      room: {
        id: 1,
      }
    }
  },
  methods: {
    async fetchUser() {
      const token = localStorage.getItem('auth-token');
      const data = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());
      if(data.status === 401) {
        localStorage.removeItem('auth-token');
        this.$router.push('/login');
      }
      this.user = data;
      if(data.provider_id) {
        this.$socket.emit('newUser', data.provider_id);
      }
    }
  }, 
  components: {
    NavBar,
    SideBar,
    RightSidebar,
    Chat
  },
  mounted() {
    this.fetchUser();
  },
  sockets: {
    connect: function () {
      console.log('socket to notification channel connected')
    },
  },
}
</script>
<template>
  <div class="min-h-screen max-h-screen overflow-hidden">
    <NavBar :user="user" />
    <div class="grid grid-cols-12">

      <div class="col-span-12 lg:col-span-8 lg:col-start-3 max-h-[80%]">
        <Chat :room="room" :user="user"></Chat>
      </div>
      <div class="hidden lg:flex col-span-2 ">
        <RightSidebar></RightSidebar>
      </div>
    </div>
  </div>
</template>