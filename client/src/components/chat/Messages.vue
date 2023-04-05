<script>
import Editor from './Editor.vue';
import Message from './Message.vue';
import { checkText } from 'smile2emoji'
export default {
    props: {
      user: {
        type: Object,
        required: true,
      }
    },
    components: { Message, Editor },
    data() {
        return {
            messages: [],
        }
    },
    methods: {
      scrollToEnd() {
      this.$refs.messages.scrollTop =
        this.$refs.messages.lastElementChild.offsetTop;
      },
    },
    sockets: {
        newMessage(e) {
            e.content = checkText(e.content);
            this.messages.push(e);
        },
        setMessages(e) {
            this.messages = e.map((message) => {
                message.content = checkText(message.content);
                return message;
            })
        },
    },
    updated() {
      // whenever data changes and the component re-renders, this is called.
      this.$nextTick(() => this.scrollToEnd());
    },
}
</script>
<template>
  <div class="h-5/6 w-full p-2 overflow-y-scroll pb-10" ref="messages">
    <div v-if="messages.length < 1">Žinučių nėra.</div>
    <div v-for="message in messages" :key="message._id">
      <Message :message="message" :user="user" v-if="message.author"/> 
    </div>
  </div>
  <Editor class="flex fixed bottom-0" :user="user._id"/>
</template>