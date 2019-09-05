<template>
    <section class="details">
        <!-- Loading -->
        <Loading v-show="loadingShow" />
        <!-- 头部 -->
        <MusicHeader v-if="show" :title="title" :back="true" />
        <!-- better-scroll -->
        <div class="wrapper" ref="wrapper">
            <div class="container">
                <div class="content" v-if="show">
                    <!-- 封面 -->
                    <div class="img">
                        <img v-lazy="bgImg" />
                    </div>
                    <!-- 信息 -->
                    <div class="desc">
                        <!-- 播放量 -->
                        <p class="count" v-if="listenerShow">
                            <i></i>
                            {{songSheet.playCount | changeNumber}}
                        </p>
                        <!-- 标题/歌手名 -->
                        <span class="name">{{title}}</span>
                        <!-- 英文名 -->
                        <span v-if="englishName">({{englishName}})</span>
                    </div>
                </div>
                <!-- 标签+简介 -->
                <div class="msg" v-if="show">
                    <!-- 歌单标签 -->
                    <div class="tags" v-if="isShow">
                        标签：
                        <em v-for="(tag, index) in songSheet.tags" :key="index">{{tag}}</em>
                    </div>
                    <!-- 简介 -->
                    <div class="container" @click="showText">
                        <div :class="['text',{active}]">
                            <p>简介：{{description}}</p>
                        </div>
                        <span :class="['icon',{active}]"></span>
                    </div>
                </div>
                <!-- 留白 -->
                <div class="total" v-if="show">
                    <span>共{{counts}}首歌曲</span>
                </div>
                <!-- 歌曲列表 -->
                <div
                    class="songs"
                    v-for="(item, index) in songLists"
                    :key="index"
                    @click="play(index)"
                >
                    <!-- 序号 -->
                    <div class="num">{{index+1}}</div>
                    <!-- 歌名+歌手名 -->
                    <div class="list">
                        <p class="name">{{item.name}}</p>
                        <p class="singer">{{singer(item.ar)}}</p>
                    </div>
                    <!-- 播放按钮 -->
                    <div class="icon">
                        <span></span>
                    </div>
                </div>
                <div class="footer_item"></div>
            </div>
        </div>
    </section>
</template>

<script>
import BScroll from "better-scroll";
import { mapActions } from "vuex";

export default {
    name: "Details",
    data() {
        return {
            show: false,
            isShow: false,
            loadingShow: true,
            bScroll: null,
            songSheet: {},
            singerSheet: {
                artist: {},
                al: {}
            },
            englishName: null,
            active: false,
            listenerShow: true
        };
    },
    computed: {
        // 封面
        bgImg() {
            return this.songSheet.coverImgUrl || this.singerSheet.artist.picUrl;
        },
        // 标题
        title() {
            return this.songSheet.name || this.singerSheet.artist.name;
        },
        // 播放量
        counts() {
            if (this.$route.query.type == "singer") {
                return this.singerSheet.hotSongs.length;
            } else {
                return this.songSheet.tracks.length;
            }
        },
        // 歌曲列表
        songLists() {
            return this.songSheet.tracks || this.singerSheet.hotSongs;
        },
        // 简介
        description() {
            return (
                this.songSheet.description || this.singerSheet.artist.briefDesc
            );
        }
    },
    methods: {
        // 歌单
        async getSongSheet(id) {
            let res = await this.$http(`/playlist/detail?id=${id}`);
            res = res.data;
            this.songSheet = res.playlist;
            this.$nextTick(() => {
                this.show = true;
                this.isShow = true;
                this.initLoading();
            });
        },
        // 排行榜
        async getRankingSheet(idx) {
            let res = await this.$http(`/top/list?idx=${idx}`);
            res = res.data;
            this.songSheet = res.playlist;
            this.$nextTick(() => {
                this.show = true;
                this.initLoading();
            });
        },
        // 歌手
        async getSingerSheet(id) {
            let res = await this.$http(`/artists?id=${id}`);
            this.singerSheet = res.data;
            this.englishName = this.singerSheet.artist.alias[0];
            this.$nextTick(() => {
                this.show = true;
                this.listenerShow = false;
                this.initLoading();
            });
        },
        // 解析歌手
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
        // better-scro;l
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
        // loading
        initLoading() {
            setTimeout(() => {
                this.loadingShow = false;
            }, 1000);
        },
        // 触发vuex，保存数据
        play(index = 0) {
            let obj = {
                songList: this.songSheet.tracks || this.singerSheet.hotSongs,
                currentIndex: index,
                play: true,
                playScreen: true
            };
            this.comPlay(obj);
        },
        // 简介缩进
        showText() {
            this.active = !this.active;
        },
        // 获取数据
        ...mapActions(["comPlay"])
    },
    created() {
        // query
        let { id, type } = this.$route.query;
        // 请求数据
        if (type === "songSheet") {
            this.getSongSheet(id);
        } else if (type === "ranking") {
            this.getRankingSheet(id);
        } else {
            this.getSingerSheet(id);
        }
    },
    mounted() {
        // 创建better-scroll实例
        this.$nextTick(() => {
            this.initBScroll();
        });
    },
    beforeDestroy() {
        // 清除
        this.bScroll.destroy();
        this.bScroll = null;
    }
};
</script>

<style lang="scss" scoped>
.details {
    width: 100%;
    background-color: #f8f8f8;
    .wrapper {
        width: 100%;
        overflow: hidden;
        height: 100vh;
    }
    .total {
        width: 100%;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        font-size: 12px;
        color: #666;
        background-color: #eeeff0;
    }
    .footer_item {
        height: 40px !important;
    }
}
.content {
    position: relative;
    height: 220px;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    overflow: hidden;
    z-index: 5;
    .img {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        img {
            display: block;
            width: 100%;
        }
    }
    .desc {
        position: absolute;
        left: 15px;
        right: 15px;
        bottom: 5px;
        z-index: 3;
        color: #fff;
        font-size: 17px;
        p {
            padding: 1px;
            font-size: 13px;
            i {
                width: 12px;
                height: 12px;
                display: inline-block;
                background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PGcgb3BhY2l0eT0iLjE1Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiMwNDAwMDAiIGQ9Im0yMiAxNi43NzdjMCAxLjIzMy0xLjEyMSAyLjIzMy0yLjUwNiAyLjIzMy0xLjM4NCAwLTIuNTA2LTEtMi41MDYtMi4yMzN2LTIuNTUzYzAtMS4yMzQgMS4xMjItMi4yMzMgMi41MDYtMi4yMzMuMTc0IDAgLjM0My4wMTcuNTA2LjA0NnYtMS4zN2gtLjAzM2MuMDE3LS4yMi4wMzMtLjQ0MS4wMzMtLjY2NiAwLTQuNDE4LTMuNTgyLTgtOC04LTQuNDE4IDAtOCAzLjU4Mi04IDggMCAuMjI1LjAxNi40NDYuMDM0LjY2NmgtLjAzNHYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzcy0yLjUwNS0uOTk5LTIuNTA1LTIuMjMzdi0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43My0uMDg1LS4xNDgtLjE0OC0uMzEtLjE0OC0uNDkzdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMCA1LjUyMyAwIDEwIDQuNDc3IDEwIDEwIDAgLjA5LS4wMDkuMTc4LS4wMTQuMjY2LjAwMi4wMjQuMDE0LjA0NC4wMTQuMDY3djJjMCAuMzA2LS4xNDUuNTY5LS4zNi43NTMuMjI0LjMzNC4zNi43Mi4zNiAxLjEzOHYyLjU1MiIvPjwvZz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGZpbGw9IiNmZmYiIGQ9Im0yMCAxNi43NzdjMCAxLjIzMy0xLjEyMSAyLjIzMy0yLjUwNiAyLjIzMy0xLjM4NCAwLTIuNTA2LTEtMi41MDYtMi4yMzN2LTIuNTUzYzAtMS4yMzQgMS4xMjItMi4yMzMgMi41MDYtMi4yMzMuMTc0IDAgLjM0My4wMTcuNTA2LjA0NnYtMS4zN2gtLjAzM2MuMDE3LS4yMi4wMzMtLjQ0MS4wMzMtLjY2NiAwLTQuNDE4LTMuNTgyLTgtOC04LTQuNDE4IDAtOCAzLjU4Mi04IDggMCAuMjI1LjAxNi40NDYuMDM0LjY2NmgtLjAzNHYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzcy0yLjUwNS0uOTk5LTIuNTA1LTIuMjMzdi0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43My0uMDg1LS4xNDgtLjE0OC0uMzEtLjE0OC0uNDkzdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMCA1LjUyMyAwIDEwIDQuNDc3IDEwIDEwIDAgLjA5LS4wMDkuMTc4LS4wMTQuMjY2LjAwMi4wMjQuMDE0LjA0NC4wMTQuMDY3djJjMCAuMzA2LS4xNDUuNTY5LS4zNi43NTMuMjI0LjMzNC4zNi43Mi4zNiAxLjEzOHYyLjU1MiIvPjwvc3ZnPg==");
            }
        }
    }
}
.msg {
    padding: 10px 15px 0;
    background-color: #fbfcfd;
    color: #666;
    .tags {
        margin-bottom: 10px;
        line-height: 20px;
        margin-right: -10px;
        font-size: 14px;
        em {
            display: inline-block;
            margin-right: 10px;
            padding: 1px 8px;
            font-size: 12px;
            border: 1px solid #eee;
            border-radius: 20px;
        }
    }
    .container {
        position: relative;
        padding-bottom: 18px;
        line-height: 19px;
        color: #666;
        .text {
            -webkit-line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            word-wrap: break-word;
            white-space: normal;
            font-size: 14px;
            &.active {
                -webkit-line-clamp: 100;
                overflow: inherit;
            }
        }
        .icon {
            position: absolute;
            bottom: 3px;
            right: 0;
            z-index: 3;
            width: 15px;
            height: 15px;
            background-position: 50%;
            background-repeat: no-repeat;
            background-size: 12px auto;
            background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAANCAQAAAAZZWZbAAAAkElEQVR4AY2RtQEDMQxFX+D4RsgA6cN4XGr/cQJyEzD9yvCeZIAVWxbEJKNhDQ3CiUUE3iE0UNAjnFniS674nVQnqlw8iiHuJN/+hQRbzBluJP8tryQWfLAXy2j/61Aa3H7clOb7pJSMFtyipABUip/9T55yR2hIqZnifihRpVX8aMGtyg1BODAnMglHdnb8CYQbEwGgBxiKAAAAAElFTkSuQmCC);
            &.active {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAANCAQAAAAZZWZbAAAAlElEQVR4AY2ShQ1CMRBA33efgSgD4B/3aPdfhwsO1Vdvz1OMZCwYExNIzhYlbUocJr5DybjKPPOrFHfxLRndXWVO7Bbfo9iQIdBykdOCBAslBxRrMgS/yl2cFRnfNHeVnkQXP97FU/6pOcvL8vel4nS/NEdbc/oxdr/Q3eoGV2Qvl3piusrxWRCPuJ4lg+BfU7JneAOq9xL9utncPAAAAABJRU5ErkJggg==);
            }
        }
    }
}
.songs {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #eee;
    color: #333;
    .num {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 17px;
        color: #999;
    }
    .list {
        align-items: center;
        flex: 1;
        width: 100%;
        height: 50px;
        p {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .name {
            width: 100%;
            height: 25px;
            font-size: 17px;
            line-height: 25px;
        }
        .singer {
            width: 100%;
            font-size: 12px;
            line-height: 25px;
            color: #888;
        }
    }
    .icon {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 50px;
        height: 50px;

        span {
            width: 22px;
            height: 22px;
            display: block;
            background-image: url("https://s3.music.126.net/m/s/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880");
            background-size: 166px 97px;
            background-position: -24px 0;
        }
    }
}
</style>
