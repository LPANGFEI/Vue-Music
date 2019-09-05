<template>
    <section class="title">
        <h1 class="text">{{title}}</h1>
    </section>
</template>

<script>
export default {
    name: "MusicTitle",
    props: {
        title: {
            type: String,
            default: "标题"
        }
    }
};
</script>

<style lang="scss" scoped>
.title {
    width: 100%;
    .text {
        position: relative;
        box-sizing: border-box;
        padding-left: 10px;
        line-height: 40px;
        font-size: 18px;
        font-weight: 400;
        color: #666;
        &::after {
            content: "";
            position: absolute;
            left: 4px;
            top: 50%;
            width: 2px;
            height: 20px;
            background-color: #d43c33;
            transform: translateY(-50%);
        }
    }
}
</style>
