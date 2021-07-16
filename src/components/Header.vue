<template>
    <header>
        <nav>
            <div>
                <router-link to="/"><img alt="Groupomania logo" src="../assets/logo_groupomania-red-left.png"></router-link>
            </div>
            <div class="header-links">
                <router-link to="/"><i class="fas fa-comments"></i></router-link>
                <router-link to="/profil"><i class="fas fa-user-circle"></i></router-link>
                <router-link to="/"><i class="fas fa-sign-out-alt"></i></router-link>
            </div>
        </nav>
    </header>
</template>

<script>

export default {
  name: 'Header'
}
</script>

<style scoped lang="scss">
header {
    border-bottom-color: #FFD7D7;
    border-bottom-width: 5px;
    border-bottom-style: solid;
}
    nav {
        margin: 15px;
        display: flex;
        justify-content: space-between;
        img {
            height: 70px;
        }
    }

    .header-links {
        display: flex;
        align-items: center;
        font-size: 35px;
        i {
            color: #FFD7D7;
            margin: 0 20px 0 20px;
            &:hover {
                color: #FD2D01;
            }
        }
        
    }
</style>