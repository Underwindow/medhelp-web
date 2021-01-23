<template>
  <div class="page-container" >
    <md-app md-waterfall md-mode="fixed">
      <!-- <md-app-toolbar>
        <span class="md-title">Свердловская областная клиническая больница №1</span>
      </md-app-toolbar> -->

      <md-app-drawer md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          Регистров А. И
        </md-toolbar>

        <md-list>
          <md-list-item @click="toMainPage">
            <md-icon>calendar_view_day</md-icon>
            <span class="md-list-item-text">Список направлений</span>
          </md-list-item>

          <md-list-item @click="alert">
            <md-icon>grading</md-icon>
            <span class="md-list-item-text">Расписание</span>
          </md-list-item>

          <md-list-item @click="logout">
            <md-icon>exit_to_app</md-icon>
            <span class="md-list-item-text">Выход</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content id="mainContent">
        <ReferralsTable/>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss" scoped>
  .md-app {
    min-height: 100vh;
    border: 1px solid rgba(#000, .12);
  }

   // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
  .md-app-content {
    background-color: #2c272e;
  }
</style>

<script>
import ReferralsTable from './ReferralsTable.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    ReferralsTable,
  },
  async created() {
    if (localStorage.getItem('token')) {
      const response = await axios.get('/directions');
      // alert(axios.defaults.baseURL);
      console.log(response);
    }
    else {
      this.$router.push('/login');
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    toMainPage () {
      this.$router.push('/');
    }
  }
}
</script>