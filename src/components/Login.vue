<template>
  <div id="login">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png" class="w-75">
    <div class="bg-dark my-3 mx-5 p-5 mx-auto rounded-3">
        <h1 class="my-2 fs-1 fw-bold">Se connecter</h1>
        <form @submit.prevent="login" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
          <i class="far fa-envelope fs-3" aria-label="Mail"></i>
          <label for="mail" v-show="false">Mail: </label>
          <input class="form-control ms-3" v-model="user.mail" type="email" name="email" id="mail" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
          <form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</form-invalid-feedback>
          <form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</form-invalid-feedback>
        </div>

        <div class="form-group mt-4 d-flex align-items-center">
          <i class="fas fa-lock fs-3" aria-label="Mot de passe"></i>
          <label for="pwsd" v-show="false">Mot de passe: </label>
          <input class="form-control ms-3" v-model="user.password" type="password" name="password" id="pwsd" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
              <form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</form-invalid-feedback>
              <form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</form-invalid-feedback>
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="falseIdentification">
          Votre identifiant ou votre mot de passe est incorrect.
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="serverIssue">
          Nous rencontrons un problème de server, veuillez nous excuser.
        </div>
        
        <button type="submit" class="btn btn-primary mt-5 align-self-center fs-4 fw-bold">Connexion</button>
      </form>
    </div>
  </div>

</template>

<script>
import { HTTP } from '../http/http-common'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data() {
    return{
      user: {
        mail:null,
        password:null
      },
      errors: false,
      falseIdentification: false,
      serverIssue: false
    }
  },
  computed: {
    emailValidation() {
      return !this.$v.user.mail.$invalid;
    },
    passwordValidation() {
      return !this.$v.user.password.$invalid;
    }
  },
  validations: {
    user: {
      mail: {
        required,
        email
      },
      password: {
        required,
        isPasswordStrong(password) {
          const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$/;
          return regex.test(password);
        }
      }
    }
  },
  methods: {
    formValidated() {
      if(!this.$v.user.$invalid) {
        this.errors = false;
        return true;
      } else {
        this.errors = true;
        return false;
      }
    },
    login() {
      if(this.formValidated()) {
      console.log(this.user);
      HTTP.post('/auth/login',this.user)
        .then(response => {
          console.log(response.data);
          localStorage.setItem('user-token', response.data.token);
          this.$store.state.token = response.data.token;
          this.getUserInfo();
        })
        .then(() => {
          this.$router.push({ name: "Home" });
        })
        .catch(error => {
          if(error.response.status === 401 ) {
          console.error("Votre mot de passe ou votre identifiant est incorrect",error);
          this.falseIdentification = true;
          } else {
            console.error("Problème de server: ",error);
            this.serverIssue = true;
          }
        });
      } else {
        console.log ("Requête non valide");
      }
    },
    getUserInfo() {
      HTTP.get('/auth/profil', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
            .then(response => {
              console.log(response.data.user);
              this.$store.state.user = response.data.user;
            })
            .catch(error => {
              console.error("Impossible de récupérer les information de votre profil",error);
            });
    }
  },
  created() {
    console.log("La vue est crée");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#login img {
  width: 60%;
  @media (max-width: 767px) {
  width: 90%
  }
}

#login div {
  width:40%;
  @media (max-width: 767px) {
  width: 90%
  }
}

#login .form-group, #login .error, #login alert {
  width: 100%;
}
</style>
