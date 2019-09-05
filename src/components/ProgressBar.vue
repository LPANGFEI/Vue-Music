<template>
    <!-- vue v-cloak 解决页面加载时闪烁出现vue标签或者指令的问题 -->
    <section class="progress" v-cloak>
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
    </section>
</template>

<script>
import { SET_PLAY } from "../store/mutation-types";
export default {
    name: "ProgressBar",
    props: ["nowTime", "playTime", "rate"],
    methods: {
        play(e) {
            // 解析字符串并返回浮点数。
            let width = parseFloat(
                window.getComputedStyle(this.$refs.progress, null).width
            );
            let proportion = e.offsetX / width;
            this.$emit("proportion", proportion);
            this.$store.commit(SET_PLAY, true);
        }
    }
};
</script>

<style lang="scss" scoped>
.progress {
    display: flex;
    align-items: center;
    color: #000;
    .left,
    .right {
        text-align: center;
        font-size: 12px;
        color: #f1f1f1;
    }
    .prog {
        width: 10rem;
        .wrap {
            width: 9rem;
            margin: 0 auto;
            height: 3px;
            background: rgba(0, 0, 0, 0.3);
            position: relative;
            .con {
                top: 0;
                position: absolute;
                height: 100%;
                background-color: red;
            }
        }
    }
}
[v-cloak] {
    display: none !important;
}
</style>
