<script>
import Messages from './Messages.vue';
import Editor from './Editor.vue';
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    room: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
    }
  },
  components: { Messages, Editor },
}
</script>
<template>

    <div class="w-full bg-base-200 p-2 border-b-2">
      <span class="text-4xl"># <i>Pagrindinis</i></span>
    </div>
    <div class="h-screen">
      <Messages :user="user" class/>
    </div>
</template>
