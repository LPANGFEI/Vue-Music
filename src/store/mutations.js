import * as types from './mutation-types'

export default {
    [types.SET_MODE](state, newVal) {
        state.mode = newVal;
    },
    [types.SET_SONG_LIST](state, newVal) {
        state.songList = newVal;
    },
    [types.SET_CURRENT_INDEX](state, newVal) {
        state.currentIndex = newVal;
    },
    [types.SET_PLAY_SCREEN](state, newVal) {
        state.playScreen = newVal;
    },
    [types.SET_PLAY](state, newVal) {
        state.play = newVal;
    },
    // 收藏
    [types.ADD_COLLECTIONS](state, newId) {
        let id = state.collections.find(id => id == newId);
        if (id === undefined) {
            state.collections = [...state.collections, newId];
        }
    },
    // 取消收藏
    [types.REMOVE_COLLECTIONS](state, oldId) {
        state.collections = state.collections.filter(id => id != oldId);
    }
}
