<template>
    <section class="ranking">
        <!-- loading -->
        <Loading v-show="loadingShow" />
        <!-- better-scroll -->
        <div class="wrapper" ref="wrapper">
            <div class="container">
                <div class="top_item" v-for="top in topList" :key="top.id" @click="jump(top.idx)">
                    <!-- 封面 -->
                    <img v-lazy="top.coverImgUrl" />
                    <ul>
                        <!-- 歌曲 -->
                        <li v-for="(hot,index) in top.hotSong" :key="index">
                            <i>{{index+1}}.</i>
                            <span>{{hot.name}}-</span>
                            <span class="singer">{{hot.ar[0].name}}</span>
                        </li>
                    </ul>
                </div>
                <div class="footer_item"></div>
            </div>
        </div>
    </section>
</template>

<script>
import BScroll from "better-scroll";
export default {
    name: "RanKing",
    data() {
        return {
            loadingShow: true,
            bScroll: null,
            topList: []
        };
    },
    methods: {
        async getTopList() {
            let res = await this.$http("/toplist/detail");
            this.topList = res.data.list;
            // 接口文档排行榜的排序如下
            let topName = [
                "云音乐新歌榜",
                "云音乐热歌榜",
                "网易原创歌曲榜",
                "云音乐飙升榜",
                "云音乐电音榜",
                "UK排行榜周榜",
                "美国Billboard周榜",
                "KTV嗨榜",
                "iTunes榜",
                "Hit FM Top榜",
                "日本Oricon周榜",
                "韩国Melon排行榜周榜",
                "韩国Mnet排行榜周榜",
                "韩国Melon原声周榜",
                "中国TOP排行榜(港台榜)",
                "中国TOP排行榜(内地榜)",
                "香港电台中文歌曲龙虎榜",
                "华语金曲榜",
                "中国嘻哈榜",
                "法国 NRJ EuroHot 30周榜",
                "台湾Hito排行榜",
                "Beatport全球电子舞曲榜",
                "云音乐ACG音乐榜",
                "云音乐嘻哈榜"
            ];
            // 获取的接口顺序和文档排序不一样，设置对应的idx
            for (let j = 0; j < topName.length; j++) {
                for (let i = 0; i < this.topList.length; i++) {
                    if (this.topList[i].name.indexOf(topName[j]) > -1) {
                        this.$set(this.topList[i], "idx", j);
                        break;
                    }
                }
            }
            // 接口有毒的，只能拿到13个榜单和文档的榜单一致，所以需要过滤一下
            for (let i = 0; i < this.topList.length; i++) {
                if (!("idx" in this.topList[i])) {
                    this.topList.splice(i, 1);
                    i--;
                } else {
                    // 与文档对应且存在 idx 的数据发送ajax请求
                    this.$http(`/top/list?idx=${this.topList[i].idx}`).then(
                        res => {
                            let tracks = res.data.playlist.tracks.splice(0, 3);
                            this.$set(this.topList[i], "hotSong", tracks);
                        }
                    );
                }
            }
            this.$nextTick(() => {
                this.initLoading();
            });
        },
        initBScroll() {
            if (this.bScroll) {
                this.bScroll.refresh();
            } else {
                this.bScroll = new BScroll(this.$refs.wrapper, {
                    probeType: 3,
                    click: true
                });
            }
        },
        initLoading() {
            setTimeout(() => {
                this.loadingShow = false;
            }, 1000);
        },
        // 跳转页面
        jump(idx) {
            this.$router.push({
                path: "/details",
                query: {
                    id: idx,
                    type: "ranking"
                }
            });
        }
    },
    created() {
        this.getTopList();
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
.ranking {
    width: 100%;
    font-size: 16px;
    background-color: rgba(230, 230, 230, 0.4);
    .wrapper {
        width: 100%;
        overflow: hidden;
        height: 100vh;
    }
    .top_item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 4.5rem;
        padding: 2px 4px;
        border-bottom: 1px solid #ddd;
        img {
            flex: 0 0 auto;
            display: block;
            width: 4.25rem;
            height: 4.25rem;
        }
        ul {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            flex: 0 0 auto;
            width: 100%;
            height: 4.25rem;
            padding-left: 10px;

            li {
                width: 100%;
                font-size: 12px;
                color: #2e3030;

                .singer {
                    color: #888;
                }
            }
        }
    }
    .footer_item {
        height: 80px !important;
    }
}
</style>
