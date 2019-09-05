import * as types from './mutation-types';

export default {
    comPlay({
        commit
    }, obj) {
        commit(types.SET_SONG_LIST, obj.songList);
        commit(types.SET_CURRENT_INDEX, obj.currentIndex);
        commit(types.SET_PLAY, obj.play);
        commit(types.SET_PLAY_SCREEN, obj.playScreen);
    }
}
