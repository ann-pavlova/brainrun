export default {
    namespaced: true,
    state: {
        error: null
    },
    mutations: {
        setError(state, value) {
            let errorText;
            if (value === 400) {
                errorText = 'Ошибка запроса';
            }
            if (value === 500) {
                errorText = 'Ошибка сервера';
            }
            if (value === 404) {
                errorText = 'Страница не найдена';
            }
            state.error = errorText;
        },
        setErrorMessage(state, message) {
            state.error = message;
        },
        clearError(state) {
            state.error = null;
        }
    },
    actions: {
        setError({commit}, value) {
            commit('setError', value);
        },
        setErrorMessage({commit}, message) {
            commit('setErrorMessage', message);
        },
        clearError({commit}) {
            commit('clearError');
        }
    }
};
