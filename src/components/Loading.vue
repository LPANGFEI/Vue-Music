<template>
    <section class="loading">
        <div class="container">
            <div class="loading_icon">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="loading_text">
                <p>正在努力加载</p>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "Loading"
};
</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: #fff;
    text-align: center;
    z-index: 100;
}
.container {
    width: 100%;
    .loading_icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 2rem;
        div {
            width: 0.2rem;
            height: 0.8rem;
            margin-left: 0.25rem;
            background-color: #d43c33;
            animation-duration: 1s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;

            &:nth-of-type(1) {
                animation-name: loading_icon_1;
            }
            &:nth-of-type(2) {
                animation-name: loading_icon_2;
            }
            &:nth-of-type(3) {
                animation-name: loading_icon_3;
            }
            &:nth-of-type(4) {
                animation-name: loading_icon_4;
            }
        }
    }
    @keyframes loading_icon_1 {
        0% {
            height: 0.8rem;
        }
        50% {
            height: 1.2rem;
        }
        100% {
            height: 0.8rem;
        }
    }

    @keyframes loading_icon_2 {
        0% {
            height: 1rem;
        }
        50% {
            height: 0.7rem;
        }
        100% {
            height: 1rem;
        }
    }

    @keyframes loading_icon_3 {
        0% {
            height: 0.8rem;
        }
        50% {
            height: 1.2rem;
        }
        100% {
            height: 0.8rem;
        }
    }

    @keyframes loading_icon_4 {
        0% {
            height: 1rem;
        }
        50% {
            height: 0.7rem;
        }
        100% {
            height: 1rem;
        }
    }
    .loading_text {
        font-size: 0.7rem;
        line-height: 0.7rem;
        color: #888;
    }
}
</style>
