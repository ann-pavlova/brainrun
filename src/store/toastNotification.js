export default {
    namespaced: true,
    state: {
        text: null
    },
    mutations: {
        setToastNotification(state, value) {
            state.text = value;
        },
        clearToastNotification(state) {
            state.text = null;
        }
    },
    actions: {
        setToastNotification({commit}, value) {
            commit('setToastNotification', value);
        },
        clearToastNotification({commit}) {
            commit('clearToastNotification');
        }
    }
};
