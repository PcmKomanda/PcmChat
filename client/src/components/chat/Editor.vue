<script>
export default {
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      content: ""
    }
  },
  methods: {
    send() {
      if(this.content.length > 1000 || this.content.length < 1) return;
        this.$socket.emit("newMessage", { content: this.content, author: this.user});
        this.content = "";
    }
  }
}
</script>
<template>
  <div class="bg-base-200 bottom-0 sticky w-full p-2 m-0">
    <input v-model="this.content" type="text" class="input min-w-full m-0 bg-base-100" :class="this.content.length > 1000 ? 'input-error' : ''" placeholder="Tekstas" @keyup.enter="send()"/>
  </div>
</template>

<style>
  /* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>