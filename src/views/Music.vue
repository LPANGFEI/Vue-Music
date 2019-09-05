<template>
    <section class="music">
        <Loading v-show="loadingShow" />
        <div class="wrapper" ref="wrapper">
            <div class="container">
                <!-- 轮播图 -->
                <MusicSwipe />
                <!-- 推荐歌单 -->
                <MusicTitle title="推荐歌单" />
                <div v-for="(item, index) in items" :key="index">
                    <MusicRcmSong :items="item" />
                </div>
                <!-- 最新音乐 -->
                <MusicTitle title="最新音乐" />
                <!-- 点击播放，触发vuex -->
                <div v-for="(newSong,index) in newSongs" :key="newSong.id" @click="play(index)">
                    <MusicNewSong :newSong="newSong" />
                </div>
                <!-- 底部 -->
                <MusicFooter />
                <div class="footer_item"></div>
            </div>
        </div>
    </section>
</template>

<script>
import BScroll from "better-scroll";
import MusicSwipe from "@/components/MusicSwipe.vue";
import MusicTitle from "@/components/MusicTitle";
import MusicRcmSong from "@/components/MusicRcmSong";
import MusicNewSong from "@/components/MusicNewSong";
import MusicFooter from "@/components/MusicFooter";
import { mapActions } from "vuex";
export default {
    name: "music",
    data() {
        return {
            loadingShow: true,
            bScroll: null,
            rcmSong: [],
            items: [],
            newSongs: []
        };
    },
    components: {
        MusicSwipe,
        MusicTitle,
        MusicRcmSong,
        MusicNewSong,
        MusicFooter
    },
    methods: {
        // 推荐歌单
        async getRcmSong() {
            let res = await this.$http("/personalized");
            res = res.data;
            this.rcmSong = res.result.splice(0, 6);
            this.items.push(this.rcmSong.slice(0, 3));
            this.items.push(this.rcmSong.slice(3));
            this.$nextTick(() => {
                this.initLoading();
            });
        },
        // 推荐音乐
        async getNewSong() {
            let res = await this.$http("/personalized/newsong");
            res = res.data;
            this.newSongs = res.result;
            this.$nextTick(() => {
                this.initLoading();
            });
        },
        // better-scroll
        initBScroll() {
            if (this.bScroll) {
                this.bScroll.refresh();
            } else {
                this.bScroll = new BScroll(this.$refs.wrapper, {
                    probeType: 3,
                    click: true
                });
                // this.bScroll.on("scroll", this.scrollY);
            }
        },
        // 加载效果
        initLoading() {
            setTimeout(() => {
                this.loadingShow = false;
            }, 300);
        },
        scrollY({ y }) {
            if (y > -150) {
                this.playShow = true;
            } else {
                this.playShow = false;
            }
        },
        // 触发vuex，保存数据
        play(index) {
            let arr = [];
            // 数据格式不一致，拿到推荐歌曲的歌名，id，图片，歌手，时长
            this.newSongs.forEach(item => {
                let obj = {
                    name: item.name,
                    id: item.id,
                    al: {
                        picUrl: item.song.album.picUrl
                    },
                    ar: [{ name: item.song.album.artists[0].name }],
                    dt: item.song.bMusic.playTime
                };
                // 集合
                arr.push(obj);
            });
            let obj = {
                modeList: arr,
                songList: arr,
                currentIndex: index,
                play: true,
                playScreen: true
            };
            this.comPlay(obj);
        },
        ...mapActions(["comPlay"])
    },
    created() {
        this.getRcmSong();
        this.getNewSong();
    },
    mounted() {
        this.initBScroll();
    },
    beforeDestroy() {
        this.bScroll.destroy();
        this.bScroll = null;
    }
};
</script>

<style lang="scss" scoped>
.music {
    width: 100%;
    font-size: 16px;
    .wrapper {
        width: 100%;
        overflow: hidden;
        height: 100vh;
    }
    .play {
        width: 100%;
        height: 40px;
    }
    .footer_item {
        height: 80px !important;
    }
}
</style>
