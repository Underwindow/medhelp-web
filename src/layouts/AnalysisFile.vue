<template>
    <md-card class="md-card-analysis md-elevation-5">
        <md-card-area>

            <md-card-header style="padding-bottom: 16px">
              <div style="max-width: 100%; white-space: normal;" class="md-title">{{ analysisData.name }}</div>
              <div class="md-subhead">{{ (analysisData.file_id != null)? uploadingStatus : ""}}</div>
            </md-card-header>

            <md-card-content style="padding-bottom: 1px" v-show="!analysisData.file_id">
              <md-field style="width: 80%">
                <label></label>
                <md-file name="file" v-model="placeholder" placeholder="Файл не выбран" @change="processFile($event)"/>
              </md-field> 
            </md-card-content>
        </md-card-area>

        <md-card-actions v-show="analysisData.file_id" md-alignment="space-between">
            <md-button class="md-downloader" v-on:click="downloadFile()">Скачать  <md-icon>get_app</md-icon></md-button > 

            <md-button v-show="!analysisData.isChecked"  class="" v-on:click="acceptFile()">Принять</md-button>
        </md-card-actions>
    </md-card>
</template>

<script>
import axios from 'axios';
  export default {
    props: {
        analysisData : Object,
        filedata: Object,
    },
    data: () => ({
        uploadingStatus: "Файл загружен",
        token: localStorage.getItem('token')
    }),
    methods: {
      async processFile(event) {
        // alert(event);
        this.filedata = event.target.files[0];
        var formData = new FormData()
        formData.append('file', this.filedata, this.filedata.name)
        
        const requestOptions = {
          method: "POST",
          headers: { "Authorization": "Bearer " + this.token },
          body: formData
        };

        fetch(axios.defaults.baseURL + "/analysis/" + this.analysisData.id + "/upload", requestOptions)
          .then(async response => {
            const res = await response;
            
            if (res.ok) {
              this.$router.go(this.$router.currentRoute);
            }
            else {
              alert("Ошибка: " + res.statusText);
            }
          }).catch(error => {
            this.errorMessage = error;
            console.error('There was an error!', error);
          });
      },
      async acceptFile() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json",  "Authorization": "Bearer " + this.token },
          body: JSON.stringify({"analysisId": parseInt(this.analysisData.id), "checked": true})
        };

        fetch(axios.defaults.baseURL + "/check", requestOptions)
            .then(async response => {
              const res = await response;
              if (res.ok) {
                this.$router.go(this.$router.currentRoute + ':' + window.scrollY);
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
      async downloadFile() {
        const requestOptions = {
          method: "GET",
          headers: {"Authorization": "Bearer " + this.token }
        };

        fetch(axios.defaults.baseURL + "/analysis/" + this.analysisData.id + "/download", requestOptions)
          .then(async response => {
            const res = await response;
            if (res.ok) {
              let fileName = decodeURIComponent(
                escape(res.headers.get('Content-Disposition').split('filename=')[1])
              );

              res.blob().then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(link.href);
              }); 
            } else { alert("Ошибка: " + res.statusText); } 
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-card {
    vertical-align: top;
  }
  .md-card-analysis {
    margin-top: 15px;
    min-width: 100%;
    // background-color: #db5248;
    background-color: #776a7c;
  }
</style>