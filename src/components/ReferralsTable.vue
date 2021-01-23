<template>
  <div>
    <md-table v-model="searched" md-sort="name" md-sort-order="asc" md-fixed-header>
      <md-table-toolbar>
        <div class="md-toolbar-section-start">
          <h1 class="md-title">Направления</h1>
        </div>

        <md-field md-clearable class="md-toolbar-section-end">
          <md-input placeholder="Поиск по ФИО пациента..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state v-show="search"
        md-label="Не найдено"
        :md-description="`Поиск пациента '${search}' не дал результатов. Попробуйте ввести другое значение.`">
        <!-- <md-button class="md-primary md-raised" @click="newReferral">Create New Referral</md-button> -->
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{item}" v-on:click="toReferralPage(item)">
        <!-- <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell> -->
        <md-table-cell md-label="ФИО пациента" md-sort-by="patientFirstName">{{ item.patientFirstName }} {{item.patientLastName[0]}}.</md-table-cell>
        <md-table-cell md-label="Дата приёма" md-sort-by="date">{{ new Date(item.date).toLocaleString('ru-RU', options) }}</md-table-cell>
        <md-table-cell md-label="Должность врача" md-sort-by="doctorSpecialty">{{ item.doctorSpecialty }}</md-table-cell>
        <md-table-cell md-label="ФИО врача" md-sort-by="doctorName">{{ item.doctorName }}</md-table-cell>
        <md-table-cell md-label="Код МКБ-10" md-sort-by="icdCode">{{ item.icdCode }}</md-table-cell>
        <md-table-cell md-label="Направляющая МО" md-sort-by="medicalOrganization">{{ item.medicalOrganization }}</md-table-cell>
        <md-table-cell md-label="Статус" md-sort-by="status">{{ statusToStr(item.status) }}</md-table-cell>

      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import axios from 'axios'
  const toLower = text => {
    return text.toString().toLowerCase()
  }

  const searchByName = (items, term) => {
    if (term) {
      return items.filter(item => toLower(item.patientFirstName + item.patientLastName[0]).includes(toLower(term)))
    }

    return items
  }

  export default {
    name: 'ReferralsTable',
    data: () => ({
      referrals: [],
      search: null,
      options: { year: 'numeric', month: 'numeric', day: 'numeric' },
      searched: [],
      token: localStorage.getItem('token')
    }),
    methods: {
      newReferral () {
        window.alert('NotImplemented');
      },
      searchOnTable () {
        this.searched = searchByName(this.referrals, this.search)
      },
      statusToStr(statusId) {
          var statuses = [
            "Ожидаются рез-ты мед.обсл",
            "Ожидает проверки",
            "Одобрено",
            "Отклонено"];
          return statuses[statusId];
      },
      toReferralPage(item) {
          this.$router.push('/referral/' + item.id);
      }
    },
    async created() {
      // alert(this.token)
      // GET request using fetch with async/await
      const headers = { 
        "Content-Type": "application/json", 
        "Authorization": "Bearer " + this.token
      };
      const response = await fetch(axios.defaults.baseURL + '/directions', { headers });
      const json = await response.json();
      this.referrals = json.directions;
      this.searched = this.referrals
    }
  }
</script>

<style lang="scss" scoped>
  .md-field {
    max-width: 300px;
  }
  .md-table-cell {
    text-align: start;
  }
</style>