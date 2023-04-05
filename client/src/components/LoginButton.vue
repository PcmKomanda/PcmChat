<script>
export default {
  props: {
    provider: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      loading: false,
      colors: {
        discord: {
          0: '#7289DA',
          1: '#7270DE',
        },
        github: {
          0: '#171515',
          1: '#24292e',
        },
        google: {
          0: '#4285f4',
          1: '#4562f4',
        }
      }
    }
  },
  watch: {
    loading() {
      if(this.loading) {
        setInterval(() => {
          const token = localStorage.getItem('auth-token');
          if(token) {
            this.$router.push('/chat');
          }
        }, 1000);
      }
    }
  },
  computed: {
    currentColors() {
      return this.colors[this.provider];
    },
    getProvider() {
      if(this.provider === 'google') {
        return 'Google';
      } if (this.provider === 'discord') {
        return 'Discord'
      } else if(this.provider === 'github') {
        return 'GitHub';
      }
    }
  },
  methods: {
    login(provider) {
      this.loading = true;
      this.popup = window.open(`${import.meta.env.VITE_API_URL}/auth/${provider}`, '_blank', 'width=600,height=600, "location=no"');
      this.popupIntervalId = setInterval(() => {
        if(this.popup.closed) {
          this.loading = false;
          clearInterval(this.popupIntervalId);
        }
      }, 1000);
    },
  },

}
</script>
<template>
  <div>
    <button :title="title" type="button" :style="{
      '--button-background-color': currentColors[0], 
      '--button-border-color--hover': currentColors[0],  
      '--button-border-color': currentColors[1], 
      '--button-background-color--hover': currentColors[1]
      }" 
      class="border-2 transition duration-[1s] w-full rounded-[10px] m-auto text-xl lg:text-3xl"
      :class="{
        'cursor-not-allowed': disabled,
        'cursor-wait': loading,
        'cursor-pointer': !disabled,
      }"
      @click="login(`${provider}`)" :disabled="loading || disabled">
          <div class="">
            <svg v-show="loading" aria-hidden="true" class="w-[30px] h-[30px] m-2 mx-auto text-gray-200 animate-spin dark:text-gray-700 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
          <div v-if="!loading">
            <i class="fa-brands animate-wiggle place-self-center pr-2" :class="`fa-${provider}`"></i>
            <span>Prisijungti su {{ getProvider }}</span>
          </div>
        </button>
  </div>
</template>

<style>
button {
  color: var(--button-color);
  background-color: var(--button-background-color) !important;
  border-color: var(--button-border-color);
}

button:hover {
  color: var(--button-color--hover);
  background-color: var(--button-background-color--hover) !important;
  border-color: var(--button-border-color--hover);
}
</style>