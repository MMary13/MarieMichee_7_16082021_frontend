<template>
  <div id="login">
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png" class="w-75">
    <div class="bg-dark my-3 mx-5 p-5 mx-auto rounded-3">
        <h1 class="my-2 fs-1 fw-bold">Se connecter</h1>
        <b-form @submit.prevent="login" class="d-flex flex-column justify-content-center justify-items-center">
        <div class="form-group mt-4 d-flex align-items-center">
            <label for="mail"><i class="far fa-envelope"></i></label>
            <input class="form-control ms-3" v-model="user.mail" type="email" name="email" id="mail" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</b-form-invalid-feedback>
          <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</b-form-invalid-feedback>
        </div>

        <div class="form-group mt-4 d-flex align-items-center">
            <label for="pwsd"><i class="fas fa-lock"></i></label>
            <input class="form-control ms-3" v-model="user.password" type="password" name="password" id="pwsd" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</b-form-invalid-feedback>
              <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</b-form-invalid-feedback>
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="falseIdentification">
          Votre identifiant ou votre mot de passe est incorrect.
        </div>
        <div class="alert alert-secondary w-100 mt-2" role="alert" v-if="serverIssue">
          Nous rencontrons un problème de server, veuillez nous excuser.
        </div>
        
        <button type="submit" class="btn btn-primary mt-5 align-self-center fs-4 fw-bold">Connexion</button>
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
          localStorage.setItem('user-token', response.data.token);
          this.$store.state.token = response.data.token;
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

#login .form-group, #login .errors {
  width: 100%;
}
</style>
