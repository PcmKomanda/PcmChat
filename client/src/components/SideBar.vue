<script>
export default {
  data() {
    return {
      rooms: [],
    }
  },
  methods: {
    async fetchRooms() {
      const token = localStorage.getItem('auth-token');
      const data = await fetch(`${import.meta.env.VITE_API_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json());
      if(data.status === 401) {
        localStorage.removeItem('auth-token');
        this.$router.push('/login');
      }
      this.rooms = data;
    }
  },
}
</script>
<template>
  <div>
    
  </div>
</template>