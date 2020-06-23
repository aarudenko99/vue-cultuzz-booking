import Vue from 'vue';

import ApiService from '@/services/api.service';

import { router } from './router';
import store from './store';

import App from './App.vue';

import '@/plugins';
import '@/components';

import '@/styles/main.scss';

ApiService.init(process.env.VUE_APP_ENDPOINT_URL);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App, { ref: 'App' }),
}).$mount('#app');
