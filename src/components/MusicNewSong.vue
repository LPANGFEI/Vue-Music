<template>
    <section class="newsong">
        <div class="msg">
            <!-- 歌名 -->
            <p class="name">
                {{newSong.song.name}}
                <span>{{newSong.song.alias[0]}}</span>
            </p>
            <!-- 歌手 -->
            <p class="artist">
                <span class="artist_img"></span>
                <span class="artist_msg">{{newSong.song.artists[0].name}} - {{newSong.song.name}}</span>
            </p>
        </div>
        <!-- 播放按钮 -->
        <div class="icon">
            <span></span>
        </div>
    </section>
</template>

<script>
export default {
    name: "MusicNewSong",
    props: {
        newSong: Object,
        require: true
    }
};
</script>

<style lang="scss" scoped>
.newsong {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 54px;
    padding-left: 10px;
    border-bottom: 1px solid #eee;
    .msg {
        box-sizing: border-box;
        padding: 6px 0;
        width: 14rem;
        height: 100%;
        .name {
            width: 100%;
            height: 1rem;
            font-size: 17px;
            line-height: 1rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            word-break: normal;
            color: #333333;
            span {
                color: #888;
            }
        }
        .artist {
            width: 100%;
            height: 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            span {
                font-size: 12px;
            }
            .artist_img {
                display: inline-block;
                width: 10px;
                height: 8px;
                background-image: url("https://s3.music.126.net/m/s/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880");
                background-size: 166px 97px;
            }
            .artist_msg {
                padding-left: 5px;
                color: #888;
            }
        }
    }
    .icon {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
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
</style>>
