<template>
    <section class="player" v-show="getSongList.length">
        <transition name="down" mode="out-in">
            <div class="container" v-show="getPlayScreen">
                <div class="music">
                    <!-- 背景图 -->
                    <div class="bg">
                        <img :src="getSongImg()" :key="getCurrentIndex" class="blur" />
                    </div>
                    <!-- 返回 -->
                    <div class="back">
                        <img src="@/assets/img/down.png" @click="back" />
                    </div>
                    <div class="title">
                        <!-- 歌名+歌手 -->
                        <div class="title-msg">
                            <h1>{{songName}}</h1>
                            <h2>{{singerName}}</h2>
                        </div>
                    </div>
                    <!-- 封面 -->
                    <div class="turntable" @click="changeShow">
                        <transition :name="cart">
                            <div class="turntable-box" v-show="isShow">
                                <div
                                    class="turntable-box1"
                                    :class="['rotate',getPlay ? '' : 'pause']"
                                >
                                    <!-- 图片 -->
                                    <img v-lazy="getSongImg()" :key="getCurrentIndex" />
                                </div>
                            </div>
                        </transition>
                        <!-- 歌词 -->
                        <transition :name="cart">
                            <div class="lyric" v-show="!isShow" ref="lyric">
                                <div class="bscroll" ref="bScroll">
                                    <div class="bscroll-container">
                                        <div class="lyric-content">
                                            <p
                                                ref="p"
                                                v-for="(item,index) in lyric.lines"
                                                :key="index"
                                                :class="[currentLineNum === index ? 'current' : '']"
                                            >{{item.txt}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <div class="bottom">
                        <!-- 进度条 -->
                        <div class="press">
                            <!-- vue v-cloak 解决页面加载时闪烁出现vue标签或者指令的问题 -->
                            <div class="progress" v-cloak>
                                <!-- 播放时间 -->
                                <div class="left">{{nowTime}}</div>
                                <!-- 进度条 -->
                                <div class="prog">
                                    <div class="wrap" @click="play" ref="progress">
                                        <div class="con" :style="{width:rate +'%'}"></div>
                                    </div>
                                </div>
                                <!-- 歌曲总时长 -->
                                <div class="right">{{playTime}}</div>
                            </div>
                        </div>
                        <!-- 按钮 -->
                        <div class="btns">
                            <!-- 模式 -->
                            <div @click="mode">
                                <img :src="modeImg" />
                            </div>
                            <!-- 上一首 -->
                            <div @click="prev">
                                <img src="@/assets/img/prev.png" />
                            </div>
                            <!-- 暂停 -->
                            <div @click="stop">
                                <img :src="stopImg" />
                            </div>
                            <!-- 下一首 -->
                            <div @click="next">
                                <img src="@/assets/img/next.png" />
                            </div>
                            <!-- 收藏 -->
                            <div @click="collection">
                                <img :src="collectionImg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!-- 底部播放栏 -->
        <div class="mini-player" v-show="!getPlayScreen" @click="changePlayScreen">
            <!-- 图片 -->
            <div class="box" :class="['rotate',getPlay ? '' : 'pause']">
                <img v-lazy="getSongImg()" />
            </div>
            <!-- 歌名+歌手 -->
            <div class="minit-player-container">
                <p class="p1">{{songName}}</p>
                <p class="p2">{{singerName}}</p>
            </div>
            <!-- 按钮 -->
            <div class="btn">
                <div @click.stop="stop">
                    <img :src="stopImg" />
                </div>
            </div>
        </div>
        <!-- 音频 timeupdate方法，返回播放位置，绑定唯一下标-->
        <audio ref="audio" :src="songUrl" :key="getCurrentIndex" @timeupdate="updataTime"></audio>
    </section>
</template>

<script>
import BScroll from "better-scroll";
import Lyric from "lyric-parser";
/**
 *
 * 播放歌词 play()
 * 暂停歌词 stop()
 * 歌词跳转 seek(startTime)
 * 切换播放/暂停状态 toggelePlay()
 */
import { mapGetters } from "vuex";
import {
    SET_MODE,
    SET_SONG_LIST,
    SET_CURRENT_INDEX,
    SET_PLAY,
    SET_PLAY_SCREEN,
    ADD_COLLECTIONS,
    REMOVE_COLLECTIONS
} from "../store/mutation-types";

export default {
    name: "Player",
    data: () => ({
        bScroll: null,
        songUrl: "",
        nowTime: "",
        dt: "",
        nows: "",
        lrc: "",
        lyric: "",
        isShow: true,
        currentLineNum: 0,
        cart: "no-mode-translate-fade",
        isCollection: false
    }),
    watch: {
        // 更换歌曲链接
        songUrl() {
            if (this.lyric) {
                this.lyric.stop();
            }
            this.$nextTick(() => {
                this.$refs.audio.play();
                this.getSongLyric();
            });
        },
        // 播放暂停
        getPlay(newVal) {
            this.$nextTick(() => {
                newVal ? this.$refs.audio.play() : this.$refs.audio.pause();
            });
            // 切换歌词播放暂停状态
            if (this.lyric) {
                this.lyric.togglePlay();
            }
        },
        // 监听歌曲列表，是否切换了内容
        getSongList() {
            this.getSongUrl();
        },
        // 当前唯一图片，唯一歌曲
        getCurrentIndex() {
            // 获取歌曲连接
            this.getSongUrl();
            // 获取歌曲图片
            this.getSongImg();
        },
        // 监听播放进度
        rate(newVal) {
            // 当开始播放的时候开始进行判断处于什么模式
            if (newVal > 100) {
                // 单曲循环模式
                if (this.getMode) {
                    let index = this.getCurrentIndex;
                    this.$store.commit(SET_PLAY, true);
                    this.$store.commit(SET_CURRENT_INDEX, index);
                    this.$nextTick(() => {
                        this.$refs.audio.play();
                        this.getSongLyric();
                        if (this.lyric) {
                            this.lyric.seek(0);
                        }
                    });
                } else {
                    // 播放全部
                    // 还原初始收藏状态
                    this.next();
                }
            }
        }
    },
    computed: {
        // 暂停播放切换按钮图片
        stopImg() {
            if (this.getPlayScreen) {
                return this.getPlay
                    ? require("@/assets/img/stop.png")
                    : require("@/assets/img/start.png");
            } else {
                return this.getPlay
                    ? require("@/assets/img/stop1.png")
                    : require("@/assets/img/start1.png");
            }
        },
        // 模式切换图片
        modeImg() {
            return this.getMode
                ? require("@/assets/img/loopOne.png")
                : require("@/assets/img/loopAll.png");
        },
        // 收藏切换图片
        collectionImg() {
            // 遍历收藏列表中的id
            for (let i of this.getCollections) {
                // 如果当前播放的歌曲id存在于收藏列表中，显示收藏图片
                if (this.getSongList[this.getCurrentIndex].id === i) {
                    return require("@/assets/img/collection2.png");
                }
            }
            // 常规显示未收藏图片
            return require("@/assets/img/collection1.png");
        },
        // 歌曲时长
        playTime() {
            let ar = this.getSongList[this.getCurrentIndex];
            if (ar === undefined) {
                return;
            }
            let timer = ar.dt;
            this.dt = timer;
            return this.format(timer, 1000);
        },
        // 歌名
        songName() {
            let item = this.getSongList[this.getCurrentIndex];
            if (item === undefined) {
                return;
            }
            let name = item.name;
            return name;
        },
        // 歌手
        singerName() {
            let item = this.getSongList[this.getCurrentIndex];
            if (item === undefined) {
                return;
            }
            let str = "";
            let ar = item.ar;
            // 如果一个以上歌手
            ar.forEach((item, index) => {
                if (index == ar.length - 1) {
                    str += item.name;
                } else {
                    str += item.name + "/";
                }
            });
            return str;
        },
        //进度比例
        rate() {
            // 当前播放时长/(总时长/1000)*100
            return (this.nows / (this.dt / 1000)) * 100;
        },
        ...mapGetters([
            "getMode",
            "getCurrentIndex",
            "getSongList",
            "getPlay",
            "getPlayScreen",
            "getCollections"
        ])
    },
    methods: {
        // 播放连接
        async getSongUrl() {
            let obj = this.getSongList[this.getCurrentIndex] || {};
            let id = obj.id;
            if (id === undefined) {
                return;
            }
            let res = await this.$http(`/song/url?id=${id}`);
            res = res.data;
            this.songUrl = res.data[0].url;
        },
        // 封面图片
        getSongImg() {
            let al = this.getSongList[this.getCurrentIndex];
            if (al === undefined) {
                return;
            }
            al = this.getSongList[this.getCurrentIndex].al;
            return al.picUrl;
        },
        // 歌词数据
        async getSongLyric() {
            let obj = this.getSongList[this.getCurrentIndex] || {};
            let id = obj.id;
            if (id === undefined) {
                return;
            }
            let res = await this.$http(`/lyric?id=${id}`);
            res = res.data;
            this.lrc = res.lrc.lyric;
            this.lyric = new Lyric(this.lrc, this.handlerLyric);
            if (this.getPlay) {
                // 播放歌词
                this.lyric.play();
            }
        },
        // 歌词解析
        handlerLyric({ lineNum, txt }) {
            this.currentLineNum = lineNum;
            if (lineNum > 5) {
                let ele = this.$refs.p[lineNum - 5];
                this.bScroll.scrollToElement(ele, 1000);
            } else {
                this.bScroll.scrollTo(0, 0, 1000);
            }
        },
        // better-scroll
        initBScroll() {
            if (this.bScroll) {
                this.bScroll.refresh();
            } else {
                this.bScroll = new BScroll(this.$refs.bScroll, {
                    probeType: 3,
                    click: true
                });
            }
        },
        // 歌词隐藏显示
        changeShow() {
            this.isShow = !this.isShow;
            this.$nextTick(() => {
                this.initBScroll();
            });
        },
        // 返回
        back() {
            this.$store.commit(SET_PLAY_SCREEN, false);
        },
        // 更换模式
        mode() {
            if (this.getMode) {
                this.$store.commit(SET_MODE, 0);
            } else {
                this.$store.commit(SET_MODE, 1);
            }
        },
        // 上一首歌
        prev() {
            // 还远初始收藏状态
            this.isCollection = false;
            this.currentLineNum = 0;
            let index = this.getCurrentIndex;
            index--;
            if (index < 0) {
                index = this.getSongList.length - 1;
            }
            this.$store.commit(SET_CURRENT_INDEX, index);
            this.$store.commit(SET_PLAY, true);
        },
        // 下一首
        next() {
            this.isCollection = false;
            this.currentLineNum = 0;
            let index = this.getCurrentIndex;
            index++;
            if (index === this.getSongList.length) {
                index = 0;
            }
            this.$store.commit(SET_PLAY, true);
            this.$store.commit(SET_CURRENT_INDEX, index);
        },
        // 暂停
        stop() {
            this.$store.commit(SET_PLAY, !this.getPlay);
        },
        // 收藏
        collection() {
            // 获取当前播放歌曲的id
            let id = this.getSongList[this.getCurrentIndex].id;
            // 初始收藏状态为false，先便利收藏列表
            for (let i of this.getCollections) {
                // 如果当前播放的歌曲id存在于收藏列表中，改变收藏状态为true
                if (this.getSongList[this.getCurrentIndex].id === i) {
                    this.isCollection = true;
                }
            }
            // 如果已收藏
            if (this.isCollection) {
                // 点击即取消收藏
                this.$store.commit(REMOVE_COLLECTIONS, id);
                // 切换收藏状态
                this.isCollection = !this.isCollection;
            } else {
                // 如果未收藏，点击之后就收藏
                this.$store.commit(ADD_COLLECTIONS, id);
                // 切换收藏状态
                this.isCollection = !this.isCollection;
            }
        },
        // 播放样式
        changePlayScreen() {
            this.$store.commit(SET_PLAY_SCREEN, true);
        },
        // 更新当前播放时长
        updataTime(e) {
            // 当前播放时长
            this.nows = e.target.currentTime;
            // 当前播放时长，显示
            this.nowTime = this.format(e.target.currentTime, 1);
        },
        // 格式化时间
        format(timer, num) {
            let now = Math.floor(timer / num);
            let m = Math.floor(now / 60);
            let s = Math.floor(now % 60);
            s = s > 9 ? s : `0${s}`;
            return `${m}:${s}`;
        },
        // 进度条
        play(e) {
            // 播放
            this.$store.commit(SET_PLAY, true);
            // 解析字符串并返回浮点数。
            let width = parseFloat(
                window.getComputedStyle(this.$refs.progress, null).width
            );
            // 长度
            this.nows = (e.offsetX / width) * (this.dt / 1000);
            // 播放进度为当前播放时长
            this.$refs.audio.currentTime = this.nows;
            if (this.lyric) {
                // 歌词跳转
                this.lyric.seek(this.nows * 1000);
            }
        }
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
.player {
    font-size: 16px;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
    .bg {
        background: rgba(50, 50, 50, 1);
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        right: 0;
        z-index: -1;
        img {
            width: 100%;
            height: 100vh;
        }
    }
    .container {
        width: 100%;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 10;
        .music {
            width: 100%;
            height: 100%;
        }
        .back {
            width: 100%;
            height: 50px;
            img {
                width: 20px;
                height: 20px;
                padding: 5px 20px;
            }
        }
        .title {
            width: 100%;
            height: 50px;
            display: flex;
            .title-msg {
                display: inline-block;
                margin: 0 auto;
                color: #f1f1f1;
                h1 {
                    width: 100%;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 18px;
                    font-weight: 600;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    animation: cart 0.5s linear;
                }
                h2 {
                    width: 100%;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 14px;
                    animation: cart 0.5s linear;
                }
                @keyframes cart {
                    from {
                        transform: translateY(40px);
                    }
                    to {
                        transform: translateY(0px);
                    }
                }
            }
        }
        .turntable {
            width: 100%;
            height: 60%;
            display: flex;
            align-items: center;
            .turntable-box {
                width: 100%;
                height: 250px;
                position: absolute;
                z-index: 11;
                .turntable-box1 {
                    width: 200px;
                    height: 200px;
                    margin: 0 auto;
                    border-radius: 50%;
                    border: 20px solid #000;
                    overflow: hidden;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .bscroll {
                width: 100%;
                overflow: hidden;
                height: 100%;
            }
            .lyric {
                width: 100%;
                height: 60%;
                overflow: hidden;
                position: absolute;
                z-index: 10;
                p {
                    color: #c7c7c7;
                    font-size: 14px;
                    padding: 10px 0;
                    text-align: center;
                }
                .current {
                    color: #d43c33;
                }
            }
        }
    }
}
.bottom {
    width: 100%;
    .press {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 250px;
        height: 50px;
        margin: 0 auto;
        .progress {
            display: flex;
            align-items: center;
            color: #000;
        }
        .left,
        .right {
            text-align: center;
            font-size: 12px;
            color: #f1f1f1;
        }
        .prog {
            width: 10rem;
        }
        .wrap {
            width: 9rem;
            margin: 0 auto;
            height: 3px;
            background: rgba(0, 0, 0, 0.3);
            position: relative;
        }
        .con {
            top: 0;
            position: absolute;
            height: 100%;
            background-color: red;
        }
        [v-cloak] {
            display: none !important;
        }
    }
    .btns {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 50px;
        margin: 0 auto;
        div {
            width: 50px;
            height: 30px;
            text-align: center;
            img {
                width: 30px;
                height: 30px;
            }
        }
    }
}
.blur {
    -webkit-filter: blur(30px); /* Chrome, Opera */
    -moz-filter: blur(30px);
    -ms-filter: blur(30px);
    filter: blur(30px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); /* IE6~IE9 */
}
.mini-player {
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    background: #fff;
    .box {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        padding: 10px;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    .minit-player-container {
        flex: 1;
        padding-right: 10px;
        .p1,
        .p2 {
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .p1 {
            height: 30px;
            font-size: 16px;
            line-height: 30px;
            color: #333;
        }
        .p2 {
            height: 20px;
            font-size: 12px;
            color: #666;
        }
    }
    .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 40px;
        height: 40px;
        img {
            display: block;
            padding-right: 10px;
            width: 22px;
            height: 22px;
        }
    }
}

@keyframes rot {
    from {
        transform: rotateZ(0deg);
    }
    to {
        transform: rotateZ(360deg);
    }
}
.rotate {
    animation: rot 20s infinite linear;
}
.pause {
    animation-play-state: paused;
}
</style>
