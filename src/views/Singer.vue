<template>
    <section class="singer">
        <!-- loading -->
        <Loading v-show="loadingShow" />
        <!-- better-scroll -->
        <div class="wrapper" ref="wrapper">
            <div class="container">
                <div v-for="(singer, index) in singers" :key="index" ref="singer">
                    <!-- 序号留白 -->
                    <h1>{{index}}</h1>
                    <!-- 歌手列表 -->
                    <div
                        class="singer_item"
                        v-for="item in singer"
                        :key="item.id"
                        @click="jump(item.id)"
                    >
                        <!-- 图片 -->
                        <img v-lazy="item.img1v1Url" />
                        <!-- 名字 -->
                        <span>{{item.name}}</span>
                    </div>
                </div>
                <div class="footer_item"></div>
            </div>
        </div>
        <!-- 序号 -->
        <IndexList @scroll="scroll" :currentIndex="currentIndex" />
    </section>
</template>

<script>
import BScroll from "better-scroll";
import IndexList from "../components/IndexList";
export default {
    name: "Singer",
    data() {
        return {
            loadingShow: true,
            singers: {},
            bScroll: null,
            currentIndex: 0,
            singerHeight: []
        };
    },
    components: {
        IndexList
    },
    methods: {
        // 热门歌手
        async getHotData() {
            let res = await this.$http("/top/artists?offset=0&limit=10");
            res = res.data;
            this.$set(this.singers, "HOT", res.artists);
        },
        async getArtists(key) {
            let res = await this.$http(
                `/artist/list?cat=1002&limit=10&initial=${key}`
            );
            res = res.data;
            this.$set(this.singers, key, res.artists);
            this.$nextTick(() => {
                this.calculationHeight();
                this.initLoading();
            });
        },
        // 获取每一个div的高度，即每个字母加热门的歌手高度
        calculationHeight() {
            // 初始高度
            let height = 0;
            // 高度集合
            this.singerHeight.push(height);
            // 所有的歌手div
            let singer = this.$refs.singer;
            // 遍历所有的歌手div，获取每一块的高度，添加到高度集合中
            singer.forEach(item => {
                height += item.clientHeight;
                this.singerHeight.push(height);
            });
        },
        // 点击字母滑动
        scroll(index) {
            this.currentIndex = index;
            let offsetY = -this.singerHeight[index];
            this.bScroll.scrollTo(0, offsetY, 300);
        },
        // 初始化better-scroll
        initBScroll() {
            if (this.bScroll) {
                this.bScroll.refresh();
            } else {
                this.bScroll = new BScroll(this.$refs.wrapper, {
                    probeType: 2,
                    click: true
                });
                this.bScroll.on("scroll", this.scrollY);
            }
        },
        // 滑动改变字母颜色
        scrollY({ y }) {
            let num = parseInt(y);
            if (num > 0) {
                this.currentIndex = 0;
            } else {
                num = Math.abs(num);
                for (let i = 0; i < this.singerHeight.length; i++) {
                    let h1 = this.singerHeight[i];
                    let h2 = this.singerHeight[i + 1];
                    if (num >= h1 && num < h2) {
                        this.currentIndex = i;
                        break;
                    }
                }
            }
        },
        initLoading() {
            setTimeout(() => {
                this.loadingShow = false;
            }, 1000);
        },
        // 点击跳转
        jump(id) {
            this.$router.push({
                path: "/details",
                query: {
                    id,
                    type: "singer"
                }
            });
        }
    },
    created() {
        this.getHotData();
        let letters = [
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "k",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z"
        ];
        letters.forEach(key => {
            this.getArtists(key);
        });
    },
    mounted() {
        this.initBScroll();
    },
    beforeDestroy() {
        this.bScroll.refresh();
        this.bScroll = null;
    }
};
</script>

<style lang="scss" scoped>
.singer {
    width: 100%;
    text-align: center;
    .wrapper {
        width: 100%;
        overflow: hidden;
        height: 100vh;
    }
    .footer_item {
        height: 80px !important;
    }
}
.container {
    width: 100%;
    h1 {
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        font-size: 12px;
        color: #666;
        background-color: #eeeff0;
    }
    .singer_item {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 2.55rem;
        padding-left: 0.25rem;
        border-bottom: 1px solid #eee;
        img {
            flex: 0 0 2rem;
            display: block;
            width: 2rem;
            height: 2rem;
        }
        span {
            display: inline-block;
            padding-left: 0.5rem;
            font-size: 0.7rem;
            line-height: 0.7rem;
            color: #2e3030;
        }
    }
}
</style>
