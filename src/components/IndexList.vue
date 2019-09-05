<template>
    <section class="list">
        <ul class="container">
            <li
                v-for="(item,index) in letters"
                :key="index"
                @click="scrollTo(index)"
                :class="{red : currentIndex == index}"
            >{{item}}</li>
        </ul>
    </section>
</template>

<script>
import BScroll from "better-scroll";
export default {
    name: "IndexList",
    props: {
        currentIndex: Number,
        require: true
    },
    data() {
        return {
            letters: [
                "热",
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
            ]
        };
    },
    methods: {
        // 自定义事件
        scrollTo(index) {
            this.$emit("scroll", index);
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    position: fixed;
    right: 0;
    top: 50%;
    width: 1rem;
    // height: 19rem;
    transform: translateY(-40%);
    line-height: 1;
    li {
        color: #757575;
        font-size: 10px;
        padding: 4px 5px;
        font-weight: 600;
    }
}
.red {
    color: #d43c33 !important;
}
</style>
