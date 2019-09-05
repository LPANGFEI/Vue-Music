<template>
    <section class="nav">
        <router-link v-for="nav in navs" :key="nav.id" :to="{name:nav.name}">{{nav.title}}</router-link>
    </section>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "MusicNav",
    computed: {
        ...mapState(["navs"])
    }
};
</script>

<style lang="scss" scoped>
.nav {
    display: flex;
    width: 100%;
    height: 40px;
    top: 40px;
    left: 0;
    z-index: 2;
    background: #fff;
    a {
        display: block;
        flex: 1;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        text-decoration: none;
        color: #000;
    }
    .router-link-active {
        color: red;
        position: relative;
        border-bottom: 1px solid red;
    }
}
</style>
