<script>
import LoginButton from "../components/LoginButton.vue";
export default {
  data() {},
  watch: {
    loading() {
      if (this.loading) {
        setInterval(() => {
          const token = this.$cookies.get("auth-token");

          if (token) {
            location.href = "/chat";
          }
        }, 1000);
      }
    },
  },
  components: {
    LoginButton,
  },
  methods: {
    login(provider) {
      if (provider === "discord") {
        window.open("http://localhost:3000/api/auth/discord", "_blank");
        this.loading = true;
      }
    },
  },
};
</script>

<template>
  <div class="w-[100vw] h-[100vh] flex">
    <div
      class="place-self-center m-auto w-full md:w-1/2 lg:w-1/3 h-fit bg-base-200 p-2 rounded-[15px] border-base-300 border-4"
    >
      <h1 class="text-4xl text-center">Prisijungimas</h1>
      <!-- <form class="flex flex-col gap-2 py-2">
        <input type="text" placeholder="El. paštas" class="p-2 rounded-[5px]  bg-slate-200 outline-indigo-600 focus:outline-indigo-600 focus:border-2 text-black" />
        <input type="password" placeholder="Slaptažodis" class="p-2 rounded-[5px] bg-slate-200 outline-indigo-600 focus:outline-indigo-600 text-black" />
        <Button text="Prisijungti" custom="bg-primary hover:bg-primary-hover"/>
      </form> -->

      <!-- make login with discord button-->
      <div class="flex flex-col gap-2 py-2 text-white">
        <LoginButton provider="discord"></LoginButton>
        <LoginButton provider="github"></LoginButton>
        <LoginButton provider="google"></LoginButton>
      </div>
    </div>
  </div>
</template>
