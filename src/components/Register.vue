<template>
  <div>
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png">
    <div class="register">
        <h1>S'inscrire</h1>
        <form @submit.prevent="signup">
        <div class="form-item">
            <label for="firstName"><i class="fas fa-user"></i></label>
            <input v-model="user.firstName" type="text" name="firstName" id="firstName" placeholder="Prénom">
        </div>
        <div v-if="errors" class="error">
          <p v-if="!$v.user.firstName.required">Le champ est requis.</p>
          </div>
        <div class="form-item">
            <label for="lastName"><i class="fas fa-user"></i></label>
            <input v-model="user.lastName" type="text" name="lastName" id="lastName" placeholder="Nom de famille">
        </div>
        <div v-if="errors" class="error">
              <p v-if="!$v.user.lastName.required">Le champ est requis.</p>
        </div>
        <div class="form-item">
            <label for="email"><i class="far fa-envelope"></i></label>
            <input v-model="user.mail" type="email" name="email" id="email" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error">
              <p v-if="!$v.user.mail.required">Le champ est requis.</p>
              <p v-if="!$v.user.mail.email">Votre mail n'est pas valide.</p>
        </div>
        <div class="form-item">
            <label for="password"><i class="fas fa-lock"></i></label>
            <input v-model="user.password" type="password" name="password" id="password" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error">
          <p v-if="!$v.user.password.required">Le champ est requis.</p>
          <p v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</p>
        </div>
        <button type="submit" class="btn btn-primary">Enregistrer</button>
        </form>
        <p>Vous avez déjà un compte? <router-link to="/login">Se connecter</router-link></p>
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
          const regex = /^[#\\w@_-]{8,20}$/;
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
.register {
  background-color: #dadada;
  padding: 25px 35px 35px 35px;
  width:30%;
  margin:auto;
  margin-top: 40px;
  a {
      color: #2c3e50;
      font-weight: bold;
  }
}

form {
  display: flex;
  flex-direction: column;
}

.form-item {
  display: flex;
  justify-content: space-between;
  margin: 15px 0 5px 0;
  i {
    font-size:30px;
  }
  input {
        width: 90%;
        height: 30px;
        border:none;
        border-radius: 5px;
        font-size: 20px;
    }
}

button {
  margin-top:25px;
}

.error {
  text-align: left;
  color: red; 
  font-size: 12px;
}
</style>
