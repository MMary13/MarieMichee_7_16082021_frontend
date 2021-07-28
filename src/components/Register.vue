<template>
  <div id="register">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png" class="w-75">
    <div class="bg-dark mx-5 my-3 p-4 mx-auto rounded-3">
        <h1 class="my-2 fs-1 fw-bold">S'inscrire</h1>
        <form @submit.prevent="signup" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
          <i class="fas fa-user fs-3" aria-label="Prénom"></i>
          <label for="firstName" v-show="false">Prénom: </label>
          <input class="form-control ms-3" v-model="user.firstName" type="text" name="firstName" id="firstName" placeholder="Prénom">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
          <form-invalid-feedback :state="prenomValidation" v-if="!$v.user.firstName.required">Le champ est requis.</form-invalid-feedback>
          </div>
        <div class="form-group mt-4 d-flex align-items-center">
          <i class="fas fa-user fs-3" aria-label="Nom de famille"></i>
          <label for="lastName" v-show="false">Nom de famille: </label>
          <input class="form-control ms-3" v-model="user.lastName" type="text" name="lastName" id="lastName" placeholder="Nom de famille">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
              <form-invalid-feedback :state="nomValidation" v-if="!$v.user.lastName.required">Le champ est requis.</form-invalid-feedback>
        </div>
        <div class="form-group mt-4 d-flex align-items-center">
          <i class="far fa-envelope fs-3" aria-label="Mail"></i>
          <label for="email" v-show="false">Mail: </label>
          <input class="form-control ms-3" v-model="user.mail" type="email" name="email" id="email" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
              <form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</form-invalid-feedback>
              <form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</form-invalid-feedback>
        </div>
        <div class="form-group mt-4 d-flex align-items-center">
          <i class="fas fa-lock fs-3" aria-label="Mot de passe"></i>
          <label for="password" v-show="false">Mot de passe: </label>
          <input class="form-control ms-3" v-model="user.password" type="password" name="password" id="password" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error text-secondary text-start ps-5">
          <form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</form-invalid-feedback>
          <form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</form-invalid-feedback>
        </div>
        <button type="submit" class="btn btn-primary mt-5 mb-3 align-self-center fs-4 fw-bold rounded-2">Enregistrer</button>
        </form>
        <p>Vous avez déjà un compte? <router-link to="/login" class="text-reset fw-bold">Se connecter</router-link></p>
    </div>
  </div>
</template>

<script>
import { HTTP } from '../http/http-common'
import { required, email } from 'vuelidate/lib/validators'


export default {
  name: 'Register',
  data() {
    return{
      user: {
        firstName:null,
        lastName:null,
        mail:null,
        password:null
      },
      errors:false
    }
  },
  computed: {
    prenomValidation() {
      return !this.$v.user.firstName.$invalid;
    },
    nomValidation() {
      return !this.$v.user.lastName.$invalid;
    },
    emailValidation() {
      return !this.$v.user.mail.$invalid;
    },
    passwordValidation() {
      return !this.$v.user.password.$invalid;
    }
  },
   validations: {
    user: {
      firstName: {
        required
      },
      lastName: {
        required
      },
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
    signup() {
      if(this.formValidated()) {
        console.log(this.user);
        HTTP.post('/auth/signup',this.user)
          .then(response => {
            console.log(response.data);
            this.login();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        console.log("Requête non valide")
      }
    },
    login() {
      const requestBody = {"mail":this.user.mail,"password":this.user.password};
      console.log(requestBody);
      HTTP.post('/auth/login',requestBody)
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
          console.error("Votre mot de passe ou votre identifiant est incorrect",error);
        });
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
#register img {
  width: 60%;
  @media (max-width: 767px) {
  width: 90%
  }
}

#register div {
  width:40%;
  @media (max-width: 767px) {
  width: 90%
  }
}

#register .form-group, #register .error {
  width: 100%;
}
</style>
