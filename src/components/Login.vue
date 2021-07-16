<template>
  <div>
    <img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png">
    <div class="login">
        <h1>Se connecter</h1>
        <form @submit.prevent="login">
        <div class="form-item">
            <label for="mail"><i class="far fa-envelope"></i></label>
            <input v-model="user.mail" type="email" name="email" id="mail" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error">
              <p v-if="!$v.user.mail.required">Le champ est requis.</p>
              <p v-if="!$v.user.mail.email">Votre mail n'est pas valide.</p>
        </div>
        <div class="form-item">
            <label for="pwsd"><i class="fas fa-lock"></i></label>
            <input v-model="user.password" type="password" name="password" id="pwsd" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error">
              <p v-if="!$v.user.password.required">Le champ est requis.</p>
              <p v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</p>
        </div>
        <button type="submit" class="btn btn-primary">Connexion</button>
        </form>
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
.login {
  background-color: #dadada;
  padding: 25px 35px 35px 35px;
  width:30%;
  margin: auto;
  margin-top: 40px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-item {
  display: flex;
  justify-content: space-between;
  margin: 20px 0 5px 0;
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
