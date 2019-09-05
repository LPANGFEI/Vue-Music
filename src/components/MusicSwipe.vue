<template>
    <!-- 轮播图 -->
    <section class="swipe">
        <mt-swipe>
            <mt-swipe-item v-for="img in imgs" :key="img.id">
                <img :src="img.imageUrl" />
            </mt-swipe-item>
        </mt-swipe>
    </section>
</template>

<script>
export default {
    name: "MusicSwipe",
    data() {
        return {
            imgs: []
        };
    },
    methods: {
        async getImgs() {
            let res = await this.$http("/banner");
            res = res.data;
            this.imgs = res.banners;
        }
    },
    created() {
        this.getImgs();
    }
};
</script>

<style lang="scss" scoped>
.swipe {
    width: 100%;
    margin: 0 auto;
    height: 6.5rem;
    max-height: 200px;
    padding: 3px 1px;
    overflow: hidden;
    img {
        display: block;
        height: 100%;
        width: 100%;
    }
}
</style>
