<template>
  <div class="div-background">
    <md-card class="md-card-main md-elevation-0">
      <md-card-header>

        <div class="md-title">Направление</div>
      </md-card-header>

      <md-card-content>
        <div>
            <md-table>
                <md-table-row>
                    <md-table-cell class="data-type" >ФИО</md-table-cell>
                    <md-table-cell>{{ referral.patientFirstName }} {{referral.patientLastName}}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Дата рождения</md-table-cell>
                    <md-table-cell>{{ referral.patientBirthDate }}</md-table-cell>
                </md-table-row>

                <!-- <md-table-row>
                    <md-table-cell class="data-type">Адрес проживания</md-table-cell>
                    <md-table-cell>{{ referral.patientBirthDate }}</md-table-cell>
                </md-table-row> -->

                <md-table-row>
                    <md-table-cell class="data-type">Направлющая МО</md-table-cell>
                    <md-table-cell>{{ referral.medicalOrganization }}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Дата и время приёма</md-table-cell>
                    <md-table-cell>{{ referral.date }}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Направляющий специалист</md-table-cell>
                    <md-table-cell>{{ referral.doctorSpecialty }}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Номер полиса</md-table-cell>
                    <md-table-cell>{{ referral.patientPolicyNumber }}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Диагноз по МКБ-10</md-table-cell>
                    <md-table-cell>{{ referral.icdCode }}</md-table-cell>
                </md-table-row>

                <md-table-row>
                    <md-table-cell class="data-type">Статус</md-table-cell>
                    <md-table-cell>{{ statusToStr(referral.status) }}</md-table-cell>
                </md-table-row>
            </md-table>
            
            <div class="medical-analyses">
                <md-list class="md-double-line">
                    <span class="md-subheading">Медицинские обследования</span>
                    <md-list-item v-for="analysis in analyses" v-bind:key="analysis.id">
                      <AnalysisFile :analysisData="analysis"/>
                    </md-list-item>
                </md-list>
            </div>
        </div>
      </md-card-content>
      <md-divider></md-divider>

      <md-card-actions md-alignment="space-between">
        <md-button class="md-raised md-primary" @click="changeStatus(2)" >Одобрить</md-button>
                <div style="cursor: pointer" @click="toMainPage()">Вернуться к направлениям</div>
        <md-button class="md-raised md-accent" @click="changeStatus(3)">Отказать</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<style lang="scss" scoped>
  .md-card {
    vertical-align: top;
  }
  .md-card.md-card-main {
    margin: 4px;
    width: 600px;
    // min-width: 400px;
    display: inline-block;
    vertical-align: top;
    overflow: auto;
    // max-height: 600px;
  }
  .medical-analyses {
    margin-top: 30px;
  }
  .md-table-cell {
      text-align: start;
  }
  .div-background {
    background-color: #2c272e;
  }
  // .data-type {
  //     text-align: right;
  // }
</style>

<script>
import axios from 'axios';

import AnalysisFile from '../layouts/AnalysisFile.vue'

export default {
  components: {
    AnalysisFile,
  },
  data: () => ({
    referralId: null,
    referral: null,
    analyses: [],
    token: localStorage.getItem('token')
  }),
  // watch: {
  //   '$route' (to, from) {
  //     alert(to.params.refId + " from " + from.params.refId);
  //   }
  // },
  async created() {
    if (localStorage.getItem('token')) {
      this.updateView()
    }
    else {
      this.$router.push('/login');
    }
  },
  methods: {
    toMainPage() {
      this.$router.push('/')
    },
    statusToStr(statusId) {
      var statuses = [
        "Ожидаются рез-ты мед.обсл",
        "Ожидает проверки",
        "Одобрено",
        "Отклонено"];
      return statuses[statusId];
    },
    goHome() {
      this.$router.push('/');
    },
    async updateView() {
      const headers = { 
        "Content-Type": "application/json", 
        "Authorization": 'Bearer ' + this.token
        };
      // alert(this.token)
      var response = await fetch(axios.defaults.baseURL + '/directions', { headers });
      var json = await response.json();
      this.referralId = this.$route.params.refId;
      this.referral =  this.filterById(json['directions'], this.referralId);

      var date = new Date(this.referral.date);
      date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
      this.referral.date = date.toLocaleDateString('ru-RU') + ', ' + date.getHours() + ':' + date.toLocaleTimeString().split(':')[1]
      
      var patientBirthDate = new Date(this.referral.patientBirthDate);
      this.referral.patientBirthDate = patientBirthDate.toLocaleDateString('ru-RU')
      
      response = await fetch(axios.defaults.baseURL + '/direction/' + this.referralId + '/analysis', { headers });
      json = await response.json();   
      this.analyses = json.analysis 
    },
    async changeStatus(value) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + this.token },
        body: JSON.stringify({"directionId": parseInt(this.referralId), "status": value})
      };

      fetch(axios.defaults.baseURL + "/status", requestOptions)
          .then(async response => {
            // const json = await response.json();
            const res = await response;
            if (res.ok) {
              this.updateView();
            }
            else {
              alert("Ошибка: " + res.statusText)
            }
          })
          .catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
    },
    filterById(jsonObject, id) {
      return jsonObject.filter(
        function(jsonObject) { return (jsonObject['id'] == id); }
      )[0];
    }
  }
}
</script>