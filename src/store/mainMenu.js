export default {
    namespaced: true,
    state: {
        title: '',
        menuItems: [{
            title: 'Вопросы',
            path: 'QuestionsPage',
            exact: 'exact'
        }, {
            title: 'Верификация',
            path: 'VerifyPage',
            exact: ''
        }]
    },
    mutations: {
        setTitle(state, value) {
            state.title = value;
        }
    },
    actions: {
        setTitle({commit}, value) {
            commit('setTitle', value);
        }
    }
};
