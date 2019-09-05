export default {
    // 导航
    navs: [{
            id: 1,
            name: 'music',
            title: '音乐'
        },
        {
            id: 2,
            name: 'ranking',
            title: '排行'
        },
        {
            id: 3,
            name: 'singer',
            title: '歌手'
        }
    ],
    // 模式：0：全部播放；1：单首循环
    mode: 0,
    // 歌曲列表
    songList: [],
    // 当前播放索引
    currentIndex: -1,
    // 播放
    play: false,
    // true：全屏播放；false：播放栏
    playScreen: true,
    // 收藏列表
    collections: [],
}
