<template>
  <div class="profil">
    <Header/>
    <div>
      <h1 class="fs-1 fw-bold text-secondary py-3">Mon Profil</h1>
      <section class="d-flex flex-column flex-md-row justify-content-center justify-content-md-around align-items-center">
        <div class="d-flex flex-column flex-md-row justify-content-center justify-content-md-start">
          <div>
            <avatar :username="fullName" :size="120" background-color="#FFD7D7" class="mb-2 px-2"></avatar>
          </div>
          <div class="d-flex flex-column align-items-start ms-3">
            <p><strong>Prénom :</strong> {{ user.firstName }}</p>
            <p><strong>Nom :</strong> {{ user.lastName }}</p>
            <p><strong>Mail</strong> : {{ user.mail }}</p>
          </div>
        </div>
      
        <div class="d-flex flex-column justify-content-center align-items-center my-3">
          <button class="btn btn-primary shadow fs-4 fw-bold my-3" @click="getUpdateForm">Modifier mon profil</button>
          <button class="btn btn-primary shadow fs-4 fw-bold my-3" @click="deleteProfil">Supprimer mon compte</button>
        </div>
    </section>
    </div>
    
    <b-form @submit.prevent="updateProfil()" class="form-profil d-flex flex-column justify-content-center mx-auto my-5 bg-dark p-3 rounded-3" v-if="ok">
      <div class="d-flex justify-content-between">
        <h2>Modification du profil:</h2>
        <div @click="closeUpdateForm()"><i class="fas fa-times-circle fs-4"></i></div>
      </div>
      
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
        <button type="submit" class="btn btn-primary shadow mt-5 mb-3 align-self-center fs-4 fw-bold rounded-2">Enregistrer</button>
        </b-form>
        <div v-if="isAdmin" class="w-100 my-5">
          <h2 class="text-start fw-bold text-secondary ps-4">Mes utilisateurs:</h2>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Utilisateur</th>
                <th scope="col">Mail</th>
                <th scope="col">Role</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" v-bind:key="user.id">
                <th scope="row">{{ user.id }}</th>
                <td class="d-flex justify-content-center">
                  <input class="user-input my-2" v-model="user.firstName" type="text">
                  <input class="user-input my-2" v-model="user.lastName" type="text">
                </td>
                <td>
                  <input class="user-input" v-model="user.mail" type="mail">
                </td>
                <td>
                  <select v-model="user.userRole" class="form-select" aria-label="Role select">
                    <option selected>{{ user.userRole }}</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </td>
                <td class="d-flex flex-column flex-md-row justify-content-center justify-content-md-around">
                  <div class="edit-icon" @click="updateUserByAdmin(user)"><i class="fas fa-edit"></i></div>
                  <div class="delete-icon" @click="deleteUserByAdmin(user.id)"><i class="fas fa-trash-alt"></i></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  </div>
</template>

<script>
import { HTTP } from '../http/http-common'
import { required, email } from 'vuelidate/lib/validators'
import Header from '../components/Header.vue'
import Avatar from 'vue-avatar'

export default {
  name: 'Profil',
  components: {
    Header,
    'avatar' : Avatar
  },
  data() {
    return{
      user: {},
      users: [],
      ok: false,
      errors:false,
      isAdmin:false
    }
  },
  computed: {
    fullName() {
      return this.user.firstName+' '+this.user.lastName;
    },
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
        HTTP.put('/auth/profil',this.user, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
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
      HTTP.delete('/auth/profil', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
          .then(response => {
            console.log(response.data);
            this.$store.state.user = null;
            this.$store.state.token= '';
            alert("Votre compte a bien été supprimé");
            this.$router.push( { name: "Landing"});
          })
          .catch(error => {
            console.error(error);
          });
    },
    getAllUsers() {
      HTTP.get('/auth/user', { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
        .then(response => {
          console.log(response.data);
          this.users = response.data.users;
        })
        .catch(error => {
          console.error("Impossible de récupérer les publications: ",error);
        });
    },
    deleteUserByAdmin(userId) {
      HTTP.delete('/auth/user/'+userId, { headers: { Authorization: 'Bearer ' +this.$store.state.token}})
      .then(response => {
        console.log(response.data);
        this.getAllUsers();
      })
      .catch(error => {
        console.error("Impossible de supprimer cet utilisateur: ",error);
      })
    },
    updateUserByAdmin(user) {
      HTTP.put('/auth/user/'+user.id, user,{ headers: { Authorization: 'Bearer ' +this.$store.state.token}})
        .then(response => {
          console.log(response.data);
          this.getAllUsers();
        })
        .catch(error => {
          console.error("Impossible de modifier cet utilisateur: ",error);
        })
    }
  },
  beforeMount() {
    this.user = this.$store.state.user;
    this.user.password=null;
    if(this.$store.state.user.userRole === 'ADMIN') {
      console.log("This user is an admin");
      this.isAdmin = true;
      this.getAllUsers();
    } else {
      console.log("This user is not an admin");
      this.isAdmin = false;
    }
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
@import '../app.scss';

.form-profil {
  width: 50%;
}

.fa-times-circle:hover {
  color:$primary;
}

.edit-icon:hover,.delete-icon:hover {
  color:$primary;
}

.user-input {
  width: fit-content;
  border-style: none;
  &:hover {
    border-style:solid;
    border-color: $primary;
    border-radius:15px;
    border-width:4px;
  }
}

@media (max-width: 767px) {
  .form-profil {
    width: 90%;
  }

  .table .form-control {
    font-size: 14px;
  }
    
  }
</style>
