import Vue from 'vue';
import App from './App.vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';

import VueRouter from 'vue-router';
import MainPage from './components/MainPage.vue';
import ReferralPage from './components/ReferralPage.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';

// import store from './store'
import Axios from 'axios'

Vue.use(VueRouter);

const token = localStorage.getItem('token')
Axios.defaults.baseURL = 'http://192.168.3.6:8080'

if (token) {
  Axios.defaults.headers.common['Authorization'] =  'Bearer ' + token
}

const routes = [
  { path: '/referral/:refId', component: ReferralPage },
  { path: '/', component: MainPage },
  { path: '/login', component: SignIn },
  { path: '/registration', component: SignUp }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.config.productionTip = false;
Vue.use(VueMaterial);

new Vue({
  el: '#app',
  router,
  render: h => h(App)
}).$mount('#app')