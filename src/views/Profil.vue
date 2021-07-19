<template>
  <div class="profil">
    <Header/>
    <section class="d-flex mx-5 justify-content-start">
      <div>
        <img src="../assets/profil-vide.jpg" alt="Image de Profil">
      </div>
      
      <div class="w-75 d-flex flex-column align-items-start ms-3">
        <h1 class="fs-1 fw-bold">Mon Profil</h1>
        <p><strong>Prénom :</strong> {{ $store.state.user.firstName }}</p>
        <p><strong>Nom :</strong> {{ $store.state.user.lastName }}</p>
        <p><strong>Mail</strong> : {{ $store.state.user.mail }}</p>
        <div class="d-flex justify-content-between align-items-center mt-5">
          <button class="btn btn-primary fs-4 fw-bold me-2" @click="getUpdateForm">Modifier mon profil</button>
          <button class="btn btn-primary fs-4 fw-bold ms-2" @click="deleteProfil">Supprimer mon compte</button>
        </div>
      </div>
    </section>

    <b-form @submit.prevent="updateProfil" class="d-flex flex-column justify-content-center w-50 mx-auto my-5 bg-dark p-3 rounded-3" v-if="ok">
      <h2>Modification du profil:</h2>
        <div class="mt-4 d-flex align-items-center">
            <label for="firstName">Prénom: </label>
            <input class="form-control ms-2" v-model="user.firstName" type="text" name="firstName" id="firstName" placeholder="Prénom">
        </div>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="prenomValidation" v-if="!$v.user.firstName.required">Le champ est requis.</b-form-invalid-feedback>
          </div>
        <div class="mt-4 d-flex align-items-center">
            <label for="lastName">Nom: </label>
            <input class="form-control ms-2" v-model="user.lastName" type="text" name="lastName" id="lastName" placeholder="Nom">
        </div>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="nomValidation" v-if="!$v.user.lastName.required">Le champ est requis.</b-form-invalid-feedback>
        </div>
        <div class="mt-4 d-flex align-items-center">
            <label for="email"><i class="far fa-envelope"></i></label>
            <input class="form-control ms-2" v-model="user.mail" type="email" name="email" id="email" placeholder="Adresse mail">
        </div>
        <div v-if="errors" class="error">
              <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.required">Le champ est requis.</b-form-invalid-feedback>
              <b-form-invalid-feedback :state="emailValidation" v-if="!$v.user.mail.email">Votre mail n'est pas valide.</b-form-invalid-feedback>
        </div>
        <div class="mt-4 d-flex align-items-center">
            <label for="password"><i class="fas fa-lock"></i></label>
            <input class="form-control ms-2" v-model="user.password" type="password" name="password" id="password" placeholder="Mot de passe">
        </div>
        <div v-if="errors" class="error">
          <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.required">Le champ est requis.</b-form-invalid-feedback>
          <b-form-invalid-feedback :state="passwordValidation" v-if="!$v.user.password.strongPassword">Votre mot de passe doit contenir 1 lettre Majuscule, 1 lettre minuscule, 1 chiffre, un caractère spécial et doit faire au minimum 8 caractères.</b-form-invalid-feedback>
        </div>
        <button type="submit" class="btn btn-primary mt-5 mb-3 align-self-center fs-4 fw-bold rounded-2">Enregistrer</button>
        </b-form>
  </div>
</template>

<script>
import axios from 'axios';
import { required, email } from 'vuelidate/lib/validators'
import Header from '../components/Header.vue'

export default {
  name: 'Profil',
  components: {
    Header
  },
  data() {
    return{
      user: {
        firstName:null,
        lastName:null,
        mail:null,
        password:null
      },
      ok: false,
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
      getUpdateForm() {
      this.ok = true;
    },
    closeUpdateForm() {
      this.ok = false;
    },
    updateProfil() {
      if(this.formValidated()) {
        console.log(this.user);
        axios.put('http://localhost:3000/api/auth/profil',this.user, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
          .then(response => {
            console.log(response.data);
            this.$store.state.user = this.user;
            this.user.password = null;
            this.closeUpdateForm();
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        console.log("Requête non valide")
      }
    },
    deleteProfil() {
      axios.delete('http://localhost:3000/api/auth/profil', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
          .then(response => {
            console.log(response.data);
            this.$store.state.user = null;
            alert("Votre compte a bien été supprimé");
            this.$router.push( { name: "Landing"});
          })
          .catch(error => {
            console.error(error);
          });
    }
  },
  beforeMount() {
    axios.get('http://localhost:3000/api/auth/profil', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
            .then(response => {
              console.log(response.data.user);
              this.$store.state.user = response.data.user;
              this.user = response.data.user;
              this.user.password=null;
            })
            .catch(error => {
              console.error("Votre mot de passe ou votre identifiant est incorrect",error);
            });
    this.user.firstName = this.$store.state.user.firstName;
    this.user.lastName = this.$store.state.user.lastName;
    this.user.mail = this.$store.state.user.mail;
  },
  mounted() {
    console.log(this.$store.getters.isAuthenticated);
    if(!this.$store.getters.isAuthenticated) {
      console.log("Non Authentifié");
        this.$router.replace({ name: "Home" });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
