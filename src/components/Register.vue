<template>
  <div id="register">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png">
    <div class="bg-dark mx-5 my-3 p-4 mx-auto rounded-3">
        <h1 class="my-2 fs-1 fw-bold">S'inscrire</h1>
        <b-form @submit.prevent="signup" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="firstName"><i class="fas fa-user"></i></label>
            <input class="form-control ms-3" v-model="user.firstName" type="text" name="firstName" id="firstName" placeholder="Prénom">
        </div>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="prenomValidation" v-if="!$v.user.firstName.required">Le champ est requis.</b-form-invalid-feedback>
          </div>
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="lastName"><i class="fas fa-user"></i></label>
            <input class="form-control ms-3" v-model="user.lastName" type="text" name="lastName" id="lastName" placeholder="Nom de famille">
        </div>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="nomValidation" v-if="!$v.user.lastName.required">Le champ est requis.</b-form-invalid-feedback>
        </div>
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="email"><i class="far fa-envelope"></i></label>
            <input class="form-control ms-3" v-model="user.mail" type="email" name="email" id="email" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</b-form-invalid-feedback>
              <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</b-form-invalid-feedback>
        </div>
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="password"><i class="fas fa-lock"></i></label>
            <input class="form-control ms-3" v-model="user.password" type="password" name="password" id="password" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</b-form-invalid-feedback>
          <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</b-form-invalid-feedback>
        </div>
        <button type="submit" class="btn btn-primary mt-5 mb-3 align-self-center fs-4 fw-bold rounded-2">Enregistrer</button>
        </b-form>
        <p>Vous avez déjà un compte? <router-link to="/login" class="text-reset fw-bold">Se connecter</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
        axios.post('http://localhost:3000/api/auth/signup',this.user)
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
      axios.post('http://localhost:3000/api/auth/login',requestBody)
        .then(response => {
          console.log(response.data);
          this.$store.state.token = response.data.token;
          this.$router.push('/profil');
        })
        .catch(error => {
          console.error("Votre mot de passe ou votre identifiant est incorrect",error);
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
#register div {
  width:40%;
}

#register .form-group, #register .errors {
  width: 100%;
}
</style>
