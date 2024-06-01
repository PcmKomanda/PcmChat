/// <reference types="vite/client" />

import "vue-router";
declare module "vue-router" {
  interface Router {
    app: any;
  }
}

import "vuex";

declare module "vuex" {
  interface Store {
    app: any;
  }
}
