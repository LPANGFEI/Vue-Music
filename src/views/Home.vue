<template>
    <section class="home">
        <!-- 顶部栏 -->
        <MusicHeader />
        <!-- 导航 -->
        <MusicNav />
        <!-- 内容 -->
        <div class="container">
            <router-view></router-view>
        </div>
    </section>
</template>

<script>
import MusicNav from "@/components/MusicNav";

export default {
    name: "Home",
    components: {
        MusicNav
    }
};
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    height: 100%;
    background: #f8f8f8;
}
</style>
