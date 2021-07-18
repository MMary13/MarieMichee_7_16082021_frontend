<template>
  <div id="login">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png">
    <div class="bg-dark mx-5 p-4 w-25 mx-auto rounded-3">
        <h1 class="my-2 fs-1 fw-bold">Se connecter</h1>
        <b-form @submit.prevent="login" class="d-flex flex-column justify-content-center justify-items-center">
        <b-form-group class=" w-100 mt-4">
            <label for="mail"><i class="far fa-envelope"></i></label>
            <b-form-input v-model="user.mail" type="email" name="email" id="mail" placeholder="Adresse mail"></b-form-input>
        </b-form-group>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</b-form-invalid-feedback>
          <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</b-form-invalid-feedback>
        </div>

        <b-form-group class="w-100 mt-4">
            <label for="pwsd"><i class="fas fa-lock"></i></label>
            <b-form-input v-model="user.password" type="password" name="password" id="pwsd" placeholder="Mot de passe"></b-form-input>
        </b-form-group>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</b-form-invalid-feedback>
              <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</b-form-invalid-feedback>
        </div>
        
        <b-button type="submit" variant="primary" class="btn btn-primary mt-5 align-self-center fs-4 fw-bold">Connexion</b-button>
      </b-form>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'Login',
  data() {
    return{
      user: {
        mail:null,
        password:null
      },
      errors: false
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
          console.log(password);
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
      axios.post('http://localhost:3000/api/auth/login',this.user)
        .then(response => {
          console.log(response.data);
          this.$store.state.token = response.data.token;
          this.$store.state.authenticated = true;
          this.$router.push('/profil');
        })
        .catch(error => {
          console.error("Votre mot de passe ou votre identifiant est incorrect",error);
        });
      } else {
        console.log ("Requête non valide");
      }

    }
  },
  created() {
    console.log("La vue est crée");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
