<template>
    <section class="play">
        <div class="container">
            <div class="img" v-if="img" @click="jump">
                <img class="pic" v-lazy="img.al.picUrl" />
            </div>
            <div class="msg" v-if="img" @click="jump">
                <p class="name">{{img.name}}</p>
                <p class="singer">{{singer(img.ar)}}</p>
            </div>
            <div class="icon" @click="playMusic">
                <span :class="['state',{isplay:isPlay}]"></span>
                <audio ref="audio" :src="song"></audio>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "MusicPlay",
    data: () => ({
        song: "",
        img: "",
        time: 0,
        timer: null,
        isPlay: false
    }),
    props: ["musicId"],
    watch: {
        musicId(newId, oldId) {
            this.musicId = newId;
            this.isPlay = false;
            this.getSongUrl();
            this.getImgUrl();
            this.$nextTick(() => {
                this.isPlay = true;
                this.$refs.audio.play();
            });
        }
    },
    methods: {
        async getSongUrl() {
            let res = await this.$http(`/song/url?id=${this.musicId}`);
            this.song = res.data.data[0].url;
        },
        async getImgUrl() {
            let res = await this.$http(`/song/detail?ids=${this.musicId}`);
            this.img = res.data.songs[0];
            this.time = this.img.dt;
            console.log(this.time);
        },
        singer(val) {
            let str = "";
            val.forEach((item, index) => {
                if (index == val.length - 1) {
                    str += item.name;
                } else {
                    str += item.name + "/";
                }
            });
            return str;
        },
        jump() {
            console.log(this.musicId);
            this.$router.push({
                path: "/player",
                query: {
                    id: this.musicId,
                    name: this.img.name,
                    singer: this.singer(this.img.ar)
                }
            });
        },
        playMusic() {
            let audio = this.$refs.audio;
            if (this.isPlay) {
                audio.pause();
                this.isPlay = false;
            } else {
                audio.play();
                this.isPlay = true;
            }
        }
    },
    created() {
        this.getSongUrl();
        this.getImgUrl();
    }
};
</script>

<style lang="scss" scoped>
.play {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 650px;
    height: inherit;
    margin: 0 auto;
    background-color: #fff;
}
.container {
    display: flex;
    justify-content: space-around;
    .img {
        flex: 0 0 40px;
        height: 40px;
        margin-left: 10px;
        .pic {
            display: block;
            height: 100%;
            border-radius: 50%;
        }
    }
    .msg {
        flex: 1;
        width: 100%;
        height: 40px;
        padding: 0 15px;
        .name,
        .singer {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            height: 20px;
            line-height: 20px;
        }
        .name {
            font-size: 16px;
        }
        .singer {
            font-size: 12px;
            color: #888;
        }
    }
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 40px;
        height: 40px;

        .state {
            display: block;
            padding-right: 10px;
            width: 22px;
            height: 22px;
            background-image: url("https://s3.music.126.net/m/s/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880");
            background-size: 166px 97px;
            background-position: -24px 0;

            &.isplay {
                width: 22px;
                height: 22px;
                background-image: url("../assets/img/stop1.png");
                background-size: 22px;
                background-repeat: no-repeat;
                background-position: 0;
            }
        }
    }
}
</style>
