<script>
import api from "../../libs/api";

export default {
  data() {
    return {
      members: [],
    };
  },
  computed: {
    guild() {
      return this.$store.state.guild;
    },
    channel() {
      return this.$store.state.channel;
    },
  },
  methods: {
    async loadMembers() {
      await api
        .get(
          `/guilds/${this.guild._id || sessionStorage.getItem("guild")}/members`
        )
        .then((r) => {
          this.members = r.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  sockets: {
    userStatusChanged() {
      this.loadMembers();
    },
  },
  mounted() {
    this.loadMembers();
    setInterval(() => {
      this.loadMembers();
    }, 30000);

    this.$watch(
      () => this.$store.state.guild.uid,
      () => {
        console.log("guild changed");
        this.loadMembers();
      }
    );
  },
};
</script>
<template>
  <div class="h-screen w-full">
    <div class="w-full min-h-[48px] border-b-2 bg-base-300"></div>
    <div class="flex w-full h-full flex-row p-2 overflow-y-scroll bg-base-200">
      <div class="flex-grow" v-if="this.guild._id">
        <div
          v-for="member in this.members
            .filter((m) =>
              channel.privacy === 'private'
                ? guild.moderators.includes(m._id) || guild.owner == m._id
                : true
            )
            .sort((a, b) => {
              a = a.status.type;
              b = b.status.type;
              if (a === 'online') return -1;
              if (a === 'idle' && b !== 'online') return -1;
              if (a === 'dnd' && b !== 'online' && b !== 'idle') return -1;
              return 1;
            })"
          :key="member._id"
          class="w-full text-xl flex my-2"
        >
          <div
            class="avatar status"
            :class="
              member.status.type === 'invisible' ||
              member.status.type === 'offline'
                ? 'invis'
                : member.status.type
            "
          >
            <div class="rounded-full w-12 h-12 bg-base-200">
              <img
                class="rounded-full w-12 h-12"
                :src="member.avatar"
                :title="member.display_name"
              />
            </div>
          </div>
          <div class="my-auto p-0 ml-2">
            {{ member.display_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
