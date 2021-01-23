<template>
  <div class="main">
    <md-card>
        <form class="login" @submit.prevent="submit">
            <md-card-header>
                <div class="md-title">Регистрация</div>
                <!-- <div class="md-subhead">Subtitle here</div> -->
            </md-card-header>
            <md-card-content>
                <div>
                    <md-field md-clearable>
                        <label>Имя пользователя</label>
                        <md-input v-model="form.username" required></md-input>
                    </md-field>

                    <md-field>
                        <label>Пароль</label>
                        <md-input v-model="form.password" type="password" required></md-input>
                    </md-field>

                    <md-field>
                        <label>Ключ</label>
                        <md-input v-model="form.registrar.secret" type="password" required></md-input>
                    </md-field>
                </div>
            </md-card-content>
            <md-card-actions md-alignment="space-between">
                <div>
                    <md-button type="submit" class="md-primary">Зарегистрироваться</md-button>
                </div>

                <div>
                    <md-button to="/login">Войти</md-button>
                </div>
            </md-card-actions>
        </form>
    </md-card>
  </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'SignIn',
        data: () => ({
            form: {
                username: null,
                password: null,
                registrar : {
                    secret: null
                }
            }
        }),
        methods: {
            async submit() {
                const response = await axios.post('/registration', this.form)
                // alert(response.data.token);
                localStorage.setItem('token', response.data.token);
                this.$router.push('/');
            }
        }
    }
</script>

<style lang="scss" scoped>
  .md-card {
    width: 620px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }
  .md-field:last-child {
    margin-bottom: 40px;
  }
  .main {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #2c272e;
  }
</style>