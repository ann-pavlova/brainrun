import apiQuestions from '../api/apiQuestions';

export default {
    namespaced: true,
    state: {
        question: {},
        nextId: ''
    },
    mutations: {
        setQuestionForVerifiedToState(state, questionValue) {
            if (questionValue.question !== undefined) {
                state.question = questionValue.question;
            } else {
                state.question = {};
            }

            if (questionValue.nextId) {
                state.nextId = questionValue.nextId;
            } else {
                state.nextId = '';
            }
        }
    },
    actions: {
        async setQuestionForVerifiedToState({commit}, id) {
            let resp = await apiQuestions.getQuestionForVerifyById(id);
            commit('setQuestionForVerifiedToState', resp.data);
        },
        async getQuestionForVerify({commit, state}) {
            let resp;
            if (state.nextId !== '') {
                resp = await apiQuestions.getQuestionForVerifyById(state.nextId);
            } else {
                resp = await apiQuestions.getQuestionForVerify();
            }
            commit('setQuestionForVerifiedToState', resp.data);
        },
        setQuestionAsVerify({commit}, id) {
            let config = [{'op': 'replace', 'path': '/status', 'value': 'published'}];
            return apiQuestions.setQuestionVerify(id, config);
        },
        setQuestionAsNoVerify({commit}, id) {
            let config = [{'op': 'replace', 'path': '/status', 'value': 'fixRequired'}];
            return apiQuestions.setQuestionVerify(id, config);
        }
    }
};
